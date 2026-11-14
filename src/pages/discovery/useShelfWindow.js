import { useEffect, useRef, useState } from 'react';

const BUFFER = 8;
const UNMEASURED_COUNT = 32;
const SCROLL_IDLE_MS = 140;

const initialWindow = (count) => ({
  start: 0,
  end: Math.min(count, UNMEASURED_COUNT),
  visibleStart: 0,
  visibleEnd: Math.min(count, UNMEASURED_COUNT),
  isScrolling: false,
  isPageVisible: typeof document === 'undefined' || !document.hidden,
});

/** Keep lightweight spine slots in place; mount media only near the viewport. */
export default function useShelfWindow(shelfRef, count) {
  const [windowState, setWindowState] = useState(() => initialWindow(count));
  const current = useRef(windowState);
  const countRef = useRef(count);
  const measureRef = useRef(null);
  countRef.current = count;

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return undefined;

    let disposed = false;
    let frame = 0;
    let idleTimer = 0;
    let metrics = { width: 0, stride: 0, inset: 0 };
    const row = shelf.querySelector('.dc-shelf');
    const first = shelf.querySelector('.dc-spine');
    const nativeFrames =
      typeof window.requestAnimationFrame === 'function' &&
      typeof window.cancelAnimationFrame === 'function';
    const requestFrame = nativeFrames
      ? (callback) => window.requestAnimationFrame(callback)
      : (callback) => window.setTimeout(callback, 16);
    const cancelFrame = nativeFrames
      ? (id) => window.cancelAnimationFrame(id)
      : (id) => window.clearTimeout(id);

    const publish = (patch) => {
      if (disposed) return;
      const previous = current.current;
      if (Object.keys(patch).every((key) => previous[key] === patch[key]))
        return;
      const next = { ...previous, ...patch };
      current.current = next;
      setWindowState(next);
    };

    const updateWindow = () => {
      if (disposed) return;
      const total = Math.max(0, countRef.current);
      if (!(metrics.width > 0 && metrics.stride > 0)) {
        const end = Math.min(total, UNMEASURED_COUNT);
        publish({ start: 0, end, visibleStart: 0, visibleEnd: end });
        return;
      }

      // Scroll position is the only live geometry read during scrolling.
      const left = Math.max(0, shelf.scrollLeft);
      const visibleStart = Math.min(
        total,
        Math.max(0, Math.floor((left - metrics.inset) / metrics.stride)),
      );
      const visibleEnd = Math.min(
        total,
        Math.max(
          visibleStart,
          Math.ceil((left + metrics.width - metrics.inset) / metrics.stride),
        ),
      );
      publish({
        start: Math.max(0, visibleStart - BUFFER),
        end: Math.min(total, visibleEnd + BUFFER),
        visibleStart,
        visibleEnd,
      });
    };

    const scheduleWindow = () => {
      if (frame || disposed || document.hidden) return;
      frame = requestFrame(() => {
        frame = 0;
        updateWindow();
      });
    };

    const measure = () => {
      if (disposed) return;
      const spineWidth = first?.offsetWidth || 0;
      const gap = row
        ? Number.parseFloat(window.getComputedStyle(row).columnGap) || 0
        : 0;
      metrics = {
        width: shelf.clientWidth,
        stride: spineWidth > 0 ? spineWidth + gap : 0,
        inset: first?.offsetLeft || 0,
      };
      updateWindow();
    };

    const clearIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = 0;
    };
    const onScroll = () => {
      publish({ isScrolling: true });
      clearIdle();
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        publish({ isScrolling: false });
      }, SCROLL_IDLE_MS);
      scheduleWindow();
    };
    const onVisibility = () => {
      const visible = !document.hidden;
      publish({ isPageVisible: visible });
      if (visible) scheduleWindow();
      else {
        cancelFrame(frame);
        frame = 0;
        clearIdle();
        publish({ isScrolling: false });
      }
    };

    measureRef.current = measure;
    shelf.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', onVisibility);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure);
    observer?.observe(shelf);
    if (first) observer?.observe(first);
    measure();

    return () => {
      disposed = true;
      measureRef.current = null;
      cancelFrame(frame);
      clearIdle();
      observer?.disconnect();
      shelf.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [shelfRef]);

  useEffect(() => {
    measureRef.current?.();
  }, [count]);

  return windowState;
}
