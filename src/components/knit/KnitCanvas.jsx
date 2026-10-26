import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GAUGE, knitGrid } from './engine';

/**
 * Knits the grid returned by build(cols) into a canvas. Without a fixed
 * `cols`, the fabric fills its container and re-knits when the width
 * changes. Drawing waits until the canvas is near the viewport.
 * `deps` lists the inputs build depends on, like a hook dependency array.
 */
const KnitCanvas = ({
  build,
  deps = [],
  cols: fixedCols,
  gauge = GAUGE,
  className = '',
  style,
  lazy = true,
}) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
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

  useEffect(() => {
    if (grid && visible && canvasRef.current)
      knitGrid(canvasRef.current, grid, gauge.w, gauge.h);
  }, [grid, visible, gauge.w, gauge.h]);

  const height = grid ? grid.rows * gauge.h : 0;
  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className={`knt-canvas ${fixedCols ? 'knt-canvas-fit' : ''} ${className}`}
      style={{
        height,
        width: fixedCols ? fixedCols * gauge.w : undefined,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: fixedCols ? fixedCols * gauge.w : '100%',
          height,
        }}
      />
    </span>
  );
};

export default KnitCanvas;
