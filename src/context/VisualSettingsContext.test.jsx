import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  VisualSettingsProvider,
  useVisualSettings,
} from './VisualSettingsContext';

vi.mock('./AchievementContext', () => ({
  useAchievements: () => ({ unlockAchievement: () => {} }),
}));

describe('saved reader preferences', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const mount = () =>
    renderHook(useVisualSettings, { wrapper: VisualSettingsProvider });

  it('resets unavailable saved reader modes to the site-following default', async () => {
    localStorage.setItem(
      'blog-post-view-mode',
      JSON.stringify('unavailable-reader'),
    );
    const { result } = mount();
    await waitFor(() =>
      expect(result.current.blogPostViewMode).toBe('standard'),
    );
    expect(JSON.parse(localStorage.getItem('blog-post-view-mode'))).toBe(
      'standard',
    );
  });

  it('preserves a supported saved reader choice', async () => {
    localStorage.setItem('blog-post-view-mode', JSON.stringify('dossier'));
    const { result } = mount();
    await waitFor(() =>
      expect(result.current.blogPostViewMode).toBe('dossier'),
    );
  });

  it('accepts a supported reader URL over an unavailable saved choice', async () => {
    localStorage.setItem(
      'blog-post-view-mode',
      JSON.stringify('unavailable-reader'),
    );
    window.history.replaceState({}, '', '/?fezBlogMode=knit');
    const { result } = mount();
    await waitFor(() => expect(result.current.blogPostViewMode).toBe('knit'));
    expect(JSON.parse(localStorage.getItem('blog-post-view-mode'))).toBe(
      'knit',
    );
    expect(window.location.search).toBe('');
  });
});
