import React, { useState } from 'react';
import KnitCanvas from './KnitCanvas';
import KnitText from './KnitText';
import { YARN, GAUGE, FINE, makeGrid, stamp, vstack } from './engine';
import { BANDS, ICONS, badgeGrid, knitIconFor } from './patterns';

/** A knitted pictogram. name is a key of ICONS or a Phosphor icon name. */
export const KnitIcon = ({
  name,
  fg = YARN.cream,
  bg = null,
  pad = 0,
  scale = 1,
  gauge = FINE,
  className = '',
}) => {
  const bitmap = ICONS[name] || ICONS[knitIconFor(name)];
  const size = bitmap.length * scale + pad * 2;
  return (
    <KnitCanvas
      className={`knt-icon ${className}`}
      gauge={gauge}
      cols={size}
      build={() => {
        const g = makeGrid(size, size, bg);
        stamp(g, bitmap, pad, pad, { 1: fg }, scale);
        return g;
      }}
      deps={[name, fg, bg, pad, scale]}
    />
  );
};

/**
 * One or more colourwork bands running the full width.
 * pattern: a key of BANDS, or an array of keys / [key, colours] pairs.
 */
export const KnitBand = ({ pattern, colors, gauge = GAUGE, className = '' }) => {
  const parts = (Array.isArray(pattern) ? pattern : [pattern]).map((p) =>
    Array.isArray(p) ? p : [p, colors],
  );
  return (
    <KnitCanvas
      className={`knt-band ${className}`}
      gauge={gauge}
      build={(cols) => vstack(...parts.map(([name, c]) => BANDS[name](cols, c || {})))}
      deps={[JSON.stringify(parts)]}
    />
  );
};

/** A small square swatch with a motif, seeded so each item keeps its own. */
export const KnitBadge = ({ seed, size = 15, gauge = GAUGE, className = '' }) => (
  <KnitCanvas
    className={`knt-badge ${className}`}
    gauge={gauge}
    cols={size}
    build={() => badgeGrid(String(seed || 'fezcodex'), size)}
    deps={[seed, size]}
  />
);

/** A project's image framed on a felt mount, or its badge when it has none. */
export const KnitCover = ({ item, className = '' }) => {
  const [failed, setFailed] = useState(null);
  const hasImage = item.image && failed !== item.image;
  return (
    <div className={`knt-cover ${className}`} aria-hidden="true">
      {hasImage ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(item.image)}
        />
      ) : (
        <KnitBadge seed={item.slug || item.title} size={21} />
      )}
    </div>
  );
};

const WOOL_YARN = {
  moss: YARN.moss,
  rust: YARN.rust,
  teal: YARN.teal,
  ink: YARN.ink,
  denim: YARN.denim,
  plum: YARN.plum,
  walnut: YARN.walnut,
  bark: YARN.bark,
};

/**
 * The knitted header every page opens with: a motif yoke, a knitted eyebrow
 * and title, the intro on felt, then whatever controls the page needs.
 * motif: a BANDS key worked in the header's wool (null for none).
 */
export const KnitHero = ({
  eyebrow,
  title,
  intro,
  wool = 'moss',
  motif = 'stars',
  scale = 2,
  children,
}) => {
  const ground = WOOL_YARN[wool] || YARN.moss;
  return (
    <header className={`knt-wool-${wool}`}>
      <KnitBand
        pattern={motif ? ['peerie', [motif, { bg: ground }], 'peerie'] : 'peerie'}
      />
      <div className="knt-page !pb-8">
        {eyebrow && <KnitText text={eyebrow} size="small" fg={YARN.wheat} />}
        <KnitText
          as="h1"
          text={title}
          scale={scale}
          fg={YARN.cream}
          className="mt-4"
        />
        {intro && <p className="knt-patch mt-6 max-w-2xl text-lg">{intro}</p>}
        {children}
      </div>
      <KnitBand pattern="peerie" />
    </header>
  );
};

export const KnitNotice =({ error = false, children, className = '' }) => (
  <p
    className={`knt-notice ${error ? 'knt-notice-error' : ''} ${className}`}
    role={error ? 'alert' : undefined}
  >
    {children}
  </p>
);
