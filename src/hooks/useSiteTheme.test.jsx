import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useSiteTheme from './useSiteTheme';

const campaign = (to = '2026-12-31T23:59:59.999+03:00') => `(featureFlags)
  > (flag)
    (id) knit-default
    (type) default-theme
    (theme) knit
    (from) 2026-10-29T00:00:00+03:00
    (to) ${to}
    (isActive) true`;

describe('theme preference and campaign precedence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T12:00:00+03:00'));
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    delete document.documentElement.dataset.fezcodexTheme;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(campaign()),
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('uses the active campaign immediately without persisting a preference', async () => {
    const { result } = renderHook(useSiteTheme);
    expect(result.current[0]).toBe('knit');
    await act(async () => {
      await Promise.resolve();
    });
    expect(localStorage.getItem('fezcodex-theme')).toBeNull();
  });

  it('preserves a saved preference and gives a valid URL choice priority', async () => {
    localStorage.setItem('fezcodex-theme', JSON.stringify('marquetry'));
    const { result: savedResult, unmount } = renderHook(useSiteTheme);
    await act(async () => {
      await Promise.resolve();
    });
    expect(savedResult.current[0]).toBe('marquetry');
    unmount();
    window.history.replaceState({}, '', '/?fezTheme=orbit');
    const { result: urlResult } = renderHook(useSiteTheme);
    await act(async () => {
      await Promise.resolve();
    });
    expect(urlResult.current[0]).toBe('orbit');
  });

  it('never overwrites an explicit choice when a slow flag request completes', async () => {
    let resolveRequest;
    fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const { result } = renderHook(useSiteTheme);
    act(() => result.current[1]('marquetry'));
    await act(async () => {
      resolveRequest({ ok: true, text: () => Promise.resolve(campaign()) });
    });
    expect(result.current[0]).toBe('marquetry');
    expect(JSON.parse(localStorage.getItem('fezcodex-theme'))).toBe(
      'marquetry',
    );
  });

  it('expires an open default-theme session without persisting the campaign', async () => {
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(campaign('2026-10-29T12:00:00.999+03:00')),
    });
    const { result } = renderHook(useSiteTheme);
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current[0]).toBe('knit');
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current[0]).toBe('brutalist');
    expect(localStorage.getItem('fezcodex-theme')).toBeNull();
  });

  it('keeps the bundled default offline and ignores invalid saved or selected themes', async () => {
    localStorage.setItem('fezcodex-theme', JSON.stringify('unknown'));
    fetch.mockRejectedValue(new Error('offline'));
    const { result } = renderHook(useSiteTheme);
    await act(async () => {
      await Promise.resolve();
    });
    act(() => result.current[1]('invalid'));
    expect(result.current[0]).toBe('knit');
  });
});
