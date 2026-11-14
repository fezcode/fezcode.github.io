import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useShelfWindow from './useShelfWindow';

let frames;
let frameId;
let observers;
let hidden;

function makeShelf({ width = 530, spineWidth = 48, inset = 50 } = {}) {
  const shelf = document.createElement('div');
  const row = document.createElement('div');
  row.className = 'dc-shelf';
  row.style.columnGap = '5px';
  const spine = document.createElement('a');
  spine.className = 'dc-spine';
  row.append(spine);
  shelf.append(row);
  document.body.append(shelf);
  const sizes = { width, spineWidth, inset };
  const widthRead = vi.fn(() => sizes.width);
  const spineRead = vi.fn(() => sizes.spineWidth);
  const insetRead = vi.fn(() => sizes.inset);
  Object.defineProperty(shelf, 'clientWidth', { get: widthRead });
  Object.defineProperty(spine, 'offsetWidth', { get: spineRead });
  Object.defineProperty(spine, 'offsetLeft', { get: insetRead });
  return {
    shelf,
    ref: { current: shelf },
    sizes,
    widthRead,
    spineRead,
    insetRead,
  };
}

function flushFrame() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(16));
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  frames = new Map();
  frameId = 0;
  observers = [];
  hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    const id = ++frameId;
    frames.set(id, callback);
    return id;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id);
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
    },
  );
});

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useShelfWindow', () => {
  it('bounds media to the visible spines plus an eight-spine buffer', () => {
    const { ref } = makeShelf();
    const { result } = renderHook(() => useShelfWindow(ref, 200));
    expect(result.current).toMatchObject({
      start: 0,
      end: 18,
      visibleStart: 0,
      visibleEnd: 10,
      isScrolling: false,
      isPageVisible: true,
    });
  });

  it('switches the media window as the shelf moves and releases distant media', () => {
    const { ref, shelf } = makeShelf();
    const { result } = renderHook(() => useShelfWindow(ref, 200));
    act(() => {
      shelf.scrollLeft = 50 + 53 * 60;
      shelf.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isScrolling).toBe(true);
    flushFrame();
    expect(result.current).toMatchObject({
      start: 52,
      end: 78,
      visibleStart: 60,
      visibleEnd: 70,
    });
    expect(result.current.end - result.current.start).toBe(26);
  });

  it('coalesces scroll events and never remeasures layout while scrolling', () => {
    const fixture = makeShelf();
    const renders = vi.fn();
    renderHook(() => {
      renders();
      return useShelfWindow(fixture.ref, 200);
    });
    fixture.widthRead.mockClear();
    fixture.spineRead.mockClear();
    fixture.insetRead.mockClear();
    act(() => {
      for (let index = 0; index < 30; index += 1) {
        fixture.shelf.scrollLeft = index;
        fixture.shelf.dispatchEvent(new Event('scroll'));
      }
    });
    expect(frames.size).toBe(1);
    const before = renders.mock.calls.length;
    flushFrame();
    // These offsets stay within the same index window.
    expect(renders.mock.calls.length).toBe(before);
    expect(fixture.widthRead).not.toHaveBeenCalled();
    expect(fixture.spineRead).not.toHaveBeenCalled();
    expect(fixture.insetRead).not.toHaveBeenCalled();
  });

  it('pauses effects during a scroll burst and resumes only after idle', () => {
    const { ref, shelf } = makeShelf();
    const { result } = renderHook(() => useShelfWindow(ref, 200));
    act(() => shelf.dispatchEvent(new Event('scroll')));
    act(() => vi.advanceTimersByTime(100));
    act(() => shelf.dispatchEvent(new Event('scroll')));
    act(() => vi.advanceTimersByTime(139));
    expect(result.current.isScrolling).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isScrolling).toBe(false);
  });

  it('updates cached geometry on resize and clamps growing or shrinking counts', () => {
    const { ref, sizes, shelf } = makeShelf();
    const { result, rerender } = renderHook(
      ({ count }) => useShelfWindow(ref, count),
      { initialProps: { count: 200 } },
    );
    act(() => {
      sizes.width = 1000;
      observers[0].callback();
    });
    expect(result.current.visibleEnd).toBe(18);
    act(() => {
      shelf.scrollLeft = 50 + 53 * 25;
      shelf.dispatchEvent(new Event('scroll'));
    });
    flushFrame();
    rerender({ count: 30 });
    expect(result.current).toMatchObject({
      start: 17,
      end: 30,
      visibleStart: 25,
      visibleEnd: 30,
    });
    rerender({ count: 100 });
    expect(result.current.end).toBe(52);
  });

  it('stops pending work while hidden and refreshes the range on return', () => {
    const { ref, shelf } = makeShelf();
    const { result } = renderHook(() => useShelfWindow(ref, 200));
    act(() => shelf.dispatchEvent(new Event('scroll')));
    expect(frames.size).toBe(1);
    act(() => {
      hidden = true;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toMatchObject({
      isPageVisible: false,
      isScrolling: false,
    });
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    shelf.scrollLeft = 50 + 53 * 20;
    act(() => {
      hidden = false;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    flushFrame();
    expect(result.current).toMatchObject({
      isPageVisible: true,
      visibleStart: 20,
    });
  });

  it('cleans up scheduled work, resize observers and event subscriptions', () => {
    const { ref, shelf } = makeShelf();
    const shelfRemove = vi.spyOn(shelf, 'removeEventListener');
    const windowRemove = vi.spyOn(window, 'removeEventListener');
    const documentRemove = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useShelfWindow(ref, 200));
    act(() => shelf.dispatchEvent(new Event('scroll')));
    unmount();
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(shelfRemove).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(windowRemove).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(documentRemove).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );
  });

  it('uses a bounded fallback before layout is available', () => {
    const { ref } = makeShelf({ width: 0, spineWidth: 0, inset: 0 });
    const { result } = renderHook(() => useShelfWindow(ref, 200));
    expect(result.current).toMatchObject({
      start: 0,
      end: 32,
      visibleStart: 0,
      visibleEnd: 32,
    });
  });

  it('batches and cleans up safely when animation frames are unavailable', () => {
    vi.stubGlobal('requestAnimationFrame', undefined);
    vi.stubGlobal('cancelAnimationFrame', undefined);
    const { ref, shelf } = makeShelf();
    const { result, unmount } = renderHook(() => useShelfWindow(ref, 200));
    act(() => {
      shelf.scrollLeft = 50 + 53 * 20;
      shelf.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(16);
    });
    expect(result.current.visibleStart).toBe(20);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
