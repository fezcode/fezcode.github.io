import React, { useEffect, useRef } from 'react';

/* ============================================================
 * A faint, procedurally generated ASCII texture.
 *
 * Each row is built as a string and drawn with a single fillText
 * call (two, actually: one for light glyphs, one for heavy ones),
 * so a full-bleed field costs ~150 draw calls per frame. It drifts
 * at a low frame rate, stops when offscreen or when the tab is
 * hidden, and draws a single still frame under reduced motion.
 * ============================================================ */

const LIGHT = ' .:-_';
const HEAVY = '+=X';
const RAMP = LIGHT + HEAVY; // index 0 is blank
const FPS = 8;

const hash = (x, y) => {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const noise = (x, y) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x, y) =>
  noise(x, y) * 0.55 +
  noise(x * 2.03 + 17.1, y * 2.03 + 3.7) * 0.3 +
  noise(x * 4.11 + 5.3, y * 4.11 + 11.9) * 0.15;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* Shape masks: 0 = empty, 1 = full density. nx/ny are 0..1. */
const MASKS = {
  // Dense at the left and right edges (where the reference had its
  // statues), thin streaks across the headline, quiet in the middle.
  hero: (nx, ny) => {
    const edge = Math.abs(nx - 0.5) * 2;
    const sides = smooth(0.38, 1, edge) * smooth(0.08, 0.35, ny);
    const streak = Math.exp(-((ny - 0.2) ** 2) / 0.004) * 0.55;
    return Math.min(1, 0.1 + sides * 1.05 + streak * (0.35 + edge));
  },
  // A soft, warped continent-like blob in the middle of the area.
  map: (nx, ny) => {
    const wx = (noise(nx * 3 + 9, ny * 3) - 0.5) * 0.35;
    const wy = (noise(nx * 3, ny * 3 + 4) - 0.5) * 0.35;
    const dx = (nx - 0.55 + wx) / 0.46;
    const dy = (ny - 0.55 + wy) / 0.42;
    return 1 - smooth(0.3, 1.05, Math.sqrt(dx * dx + dy * dy));
  },
  // Thin texture everywhere, used on the closing panel.
  wash: (nx, ny) =>
    0.45 + 0.4 * smooth(0.4, 1, Math.abs(nx - 0.5) * 2) - 0.2 * ny,
};

const AsciiField = ({
  variant = 'hero',
  className = '',
  color = '74, 66, 58',
  fontSize = 11,
  speed = 1,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const mask = MASKS[variant] || MASKS.hero;
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cellW = 6.6;
    let cellH = 12;
    let size = fontSize;
    let maskCache = null;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t = 0;
    let disposed = false;

    const setFont = () => {
      ctx.font = `${size}px "DM Mono", "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = width < 640 ? Math.max(8, fontSize - 2) : fontSize;
      setFont();
      cellW = ctx.measureText('X').width || size * 0.6;
      cellH = Math.round(size * 1.12);
      cols = Math.ceil(width / cellW) + 1;
      rows = Math.ceil(height / cellH) + 1;
      // Masks are static per size, so compute them once.
      maskCache = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          maskCache[r * cols + c] = mask(c / cols, r / rows);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const ox = t * 0.05 * speed;
      const oy = t * 0.012 * speed;
      const levels = RAMP.length;
      for (let r = 0; r < rows; r += 1) {
        let light = '';
        let heavy = '';
        for (let c = 0; c < cols; c += 1) {
          const m = maskCache[r * cols + c];
          let ch = ' ';
          if (m > 0.02) {
            // Stretched horizontally so the texture forms streaks.
            const v = fbm(c * 0.045 + ox, r * 0.17 + oy);
            const level = (v - 0.36) * 2.4 * m;
            const idx = Math.floor(
              Math.min(0.999, Math.max(0, level)) * levels,
            );
            ch = RAMP[idx];
          }
          if (ch === ' ') {
            light += ' ';
            heavy += ' ';
          } else if (HEAVY.includes(ch)) {
            light += ' ';
            heavy += ch;
          } else {
            light += ch;
            heavy += ' ';
          }
        }
        const y = r * cellH;
        ctx.fillStyle = `rgba(${color}, 0.26)`;
        ctx.fillText(light, 0, y);
        ctx.fillStyle = `rgba(${color}, 0.34)`;
        ctx.fillText(heavy, 0, y);
      }
    };

    const loop = (now) => {
      raf = 0;
      if (disposed || !visible) return;
      if (now - last >= 1000 / FPS) {
        t += last ? (now - last) / 1000 : 0;
        last = now;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || raf || disposed) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    measure();
    draw();

    let resizeTimer = 0;
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              if (disposed) return;
              measure();
              draw();
            }, 120);
          })
        : null;
    if (ro) ro.observe(canvas);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          })
        : null;
    if (io) io.observe(canvas);
    else {
      visible = true;
      start();
    }

    // Redraw once the mono font is ready so glyph widths are right.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        measure();
        draw();
      });
    }

    return () => {
      disposed = true;
      stop();
      clearTimeout(resizeTimer);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
    };
  }, [variant, color, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`trm-ascii ${className}`}
      aria-hidden="true"
    />
  );
};

export default AsciiField;
