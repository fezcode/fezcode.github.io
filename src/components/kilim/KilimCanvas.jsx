import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GAUGE, weaveGrid, seedOf } from './engine';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Weaves the grid returned by build(cols) into a canvas. Without a fixed
 * `cols`, the weave fills its container and re-weaves when the width changes
 * (which also covers the sidebar opening and closing). Drawing waits until
 * the canvas is near the viewport. `deps` lists the inputs build depends on,
 * like a hook dependency array.
 *
 * animate: the first time it is drawn, the piece comes off the loom row by
 * row, bottom-up (skipped under reduced motion). replay: bump this value to
 * weave it again (cards do this on hover).
 */
const KilimCanvas = ({
  build,
  deps = [],
  cols: fixedCols,
  gauge = GAUGE,
  brick = true,
  gap,
  seed = 'kilim',
  animate = false,
  replay = 0,
  className = '',
  style,
  lazy = true,
}) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const wovenOnce = useRef(false);
  const [measured, setMeasured] = useState(0);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (fixedCols) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () =>
      setMeasured(Math.max(1, Math.floor(el.clientWidth / gauge.w)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fixedCols, gauge.w]);

  useEffect(() => {
    if (visible) return undefined;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const cols = fixedCols || measured;
  const grid = useMemo(
    () => (cols ? build(cols) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cols, ...deps],
  );
  const numericSeed = useMemo(() => seedOf(seed), [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!grid || !visible || !canvas) return undefined;
    const opts = { seed: numericSeed, brick, ...(gap !== undefined && { gap }) };
    const loom = (animate && !wovenOnce.current) || replay > 0;
    wovenOnce.current = true;
    if (!loom || prefersReducedMotion()) {
      weaveGrid(canvas, grid, gauge.w, gauge.h, opts);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const duration = Math.min(1300, 280 + grid.rows * 14);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      weaveGrid(canvas, grid, gauge.w, gauge.h, { ...opts, upTo: Math.floor(p * grid.rows) });
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [grid, visible, gauge.w, gauge.h, numericSeed, brick, gap, animate, replay]);

  const height = grid ? grid.rows * gauge.h : 0;
  const width = grid ? grid.cols * gauge.w : undefined;
  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className={`klm-canvas ${fixedCols ? 'klm-canvas-fit' : ''} ${className}`}
      style={{ height, width: fixedCols ? width : undefined, ...style }}
    >
      <canvas ref={canvasRef} style={{ width, height }} />
    </span>
  );
};

export default KilimCanvas;
