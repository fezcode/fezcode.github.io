import React, { useEffect, useRef, useState } from 'react';
import KilimCanvas from './KilimCanvas';
import { WOOL, GAUGE, FINE, shade, hash, vstack } from './engine';
import {
  BANDS,
  badgeGrid,
  iconGrid,
  panelGrid,
  rugGrid,
  sideBandGrid,
} from './patterns';

/** A woven pictogram. name is a key of ICONS or a Phosphor icon name. */
export const KilimIcon = ({ name, fg = WOOL.ivory, bg = null, pad = 0, className = '' }) => {
  const size = 7 + pad * 2;
  return (
    <KilimCanvas
      className={`klm-icon ${className}`}
      gauge={FINE}
      brick={false}
      cols={size}
      seed={name}
      build={() => iconGrid(name, { fg, bg, pad })}
      deps={[name, fg, bg, pad]}
    />
  );
};

/**
 * One or more woven bands running the full width.
 * pattern: a key of BANDS, or an array of keys / [key, options] pairs.
 */
export const KilimBand = ({ pattern, options, className = '' }) => {
  const parts = (Array.isArray(pattern) ? pattern : [pattern]).map((p) =>
    Array.isArray(p) ? p : [p, options],
  );
  return (
    <KilimCanvas
      className={`klm-band ${className}`}
      seed={JSON.stringify(parts)}
      build={(cols) => vstack(...parts.map(([name, o]) => BANDS[name](cols + 1, o || {})))}
      deps={[JSON.stringify(parts)]}
    />
  );
};

/** A three-row stripe for dividing list rows. */
export const KilimStripe = ({ className = '', ...options }) => (
  <KilimBand pattern={[['stripe', options]]} className={`klm-stripe ${className}`} />
);

/** A small square swatch with a göl, seeded so each item keeps its own. */
export const KilimBadge = ({ seed, size = 11, className = '' }) => (
  <KilimCanvas
    className={`klm-badge ${className}`}
    cols={size}
    seed={seed}
    build={() => badgeGrid(String(seed || 'fezcodex'), size)}
    deps={[seed, size]}
  />
);

/** A woven panel with a seeded medallion; replay re-weaves it (hover). */
export const KilimPanel = ({ seed, rows = 40, replay = 0, animate = true, className = '' }) => (
  <KilimCanvas
    className={`klm-panel ${className}`}
    seed={seed}
    animate={animate}
    replay={replay}
    build={(cols) => panelGrid(cols, String(seed || 'fezcodex'), rows)}
    deps={[seed, rows]}
  />
);

/** A project's image framed on a woven mount, or its panel when it has none. */
export const KilimCover = ({ item, replay = 0, className = '' }) => {
  const [failed, setFailed] = useState(null);
  const hasImage = item.image && failed !== item.image;
  return (
    <div className={`klm-cover ${className}`} aria-hidden="true">
      {hasImage ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(item.image)}
        />
      ) : (
        <KilimPanel seed={item.slug || item.title} replay={replay} />
      )}
    </div>
  );
};

/** The sawtooth band woven down a sidebar's edge; fills its parent's height. */
export const KilimSideBand = ({ className = '' }) => {
  const ref = useRef(null);
  const [rows, setRows] = useState(0);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return undefined;
    const measure = () => setRows(Math.ceil(el.clientHeight / GAUGE.h) + 2);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <span ref={ref} className={`klm-sideband ${className}`} aria-hidden="true">
      {rows > 0 && (
        <KilimCanvas cols={8} lazy={false} seed="sideband" build={() => sideBandGrid(rows)} deps={[rows]} />
      )}
    </span>
  );
};

/**
 * Warp threads knotted into tassels: the fringe at each end of the rug.
 * flip: hang downwards (the bottom end).
 */
export const KilimFringe = ({ flip = false, className = '' }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(W * ratio);
      canvas.height = Math.round(H * ratio);
      const x = canvas.getContext('2d');
      if (!x) return;
      x.setTransform(ratio, 0, 0, ratio, 0, 0);
      x.clearRect(0, 0, W, H);
      const ivory = [239, 229, 207];
      const step = GAUGE.w * 1.2;
      const group = 6;
      for (let i = 0; i * step < W + step; i += group) {
        const cx = (i + group / 2) * step;
        for (let j = 0; j < group; j++) {
          const sx = (i + j) * step + step / 2;
          const sway = (hash(i + j, 5) - 0.5) * 6;
          const s = shade(ivory, -0.1 - hash(j, i) * 0.18).map(Math.round);
          x.strokeStyle = `rgb(${s.join(',')})`;
          x.lineWidth = 1.6;
          x.beginPath();
          x.moveTo(sx, H);
          x.quadraticCurveTo(sx, H - 10, cx + (j - group / 2) * 1.2, H - 18);
          x.quadraticCurveTo(
            cx + (j - group / 2) * 2.2 + sway,
            H - 30,
            cx + (j - group / 2) * 3 + sway,
            2 + hash(j, i + 1) * 6,
          );
          x.stroke();
        }
        x.fillStyle = 'rgb(198,186,163)';
        x.beginPath();
        x.ellipse(cx, H - 18, 4.2, 3, 0, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = 'rgba(40,20,10,.35)';
        x.fillRect(cx - 4, H - 18, 8, 1);
      }
    };
    draw();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`klm-fringe ${flip ? 'klm-fringe-flip' : ''} ${className}`}
    />
  );
};

/**
 * The rug every page opens with: an eyebrow, the title woven into a framed
 * medallion field (contoured, so it reads on the field), the intro below,
 * then whatever controls the page needs. The real title is an h1 for
 * readers and the prerendered page; the rug is decoration.
 */
export const KilimRug = ({ eyebrow, title, intro, seed, minRows, children, className = '' }) => (
  <header className={`klm-rug ${className}`}>
    {eyebrow && <p className="klm-eyebrow">{eyebrow}</p>}
    <h1 className="sr-only">{title}</h1>
    <KilimCanvas
      className="klm-rug-loom"
      seed={seed || title}
      animate
      build={(cols) => rugGrid(cols, { title, seed: seed || title, minRows })}
      deps={[title, seed, minRows]}
    />
    {intro && <p className="klm-lede">{intro}</p>}
    {children}
  </header>
);

export const KilimNotice = ({ error = false, children, className = '' }) => (
  <p
    className={`klm-notice ${error ? 'klm-notice-error' : ''} ${className}`}
    role={error ? 'alert' : undefined}
  >
    {children}
  </p>
);
