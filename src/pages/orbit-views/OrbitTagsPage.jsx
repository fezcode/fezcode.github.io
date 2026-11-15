import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { OrbitFolio, OrbitNotice, OrbitRule } from '../../components/orbit';
import { TAG_TYPES } from '../tags/tagTypes';
import '../../styles/Orbit.css';
import './orbit-tags.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');
const entries = (n) => `${n} ${n === 1 ? 'entry' : 'entries'}`;

// Chart geometry, in viewBox units. The chart scales with its container.
const SIZE = 1240;
const C = SIZE / 2;
const FONT = 16;
const CORE = 72;
// Frequency bands, heaviest tags on the innermost ring.
const BANDS = [
  { key: 'b20', label: '≥20', min: 20, max: Infinity, r: 130 },
  { key: 'b10', label: '10–19', min: 10, max: 19, r: 255 },
  { key: 'b5', label: '5–9', min: 5, max: 9, r: 380 },
  { key: 'b3', label: '3–4', min: 3, max: 4, r: 505 },
];
const PLOT_MIN = BANDS[BANDS.length - 1].min;
// A wedge at the top of every ring stays clear for the band labels.
const GAP = (14 * Math.PI) / 180;
const TOP = -Math.PI / 2;

const dominantType = (tag) =>
  TAG_TYPES.reduce(
    (best, t) => ((tag[t.plural] || 0) > (tag[best.plural] || 0) ? t : best),
    TAG_TYPES[0],
  ).key;

const clip = (text, max) =>
  text.length > max ? `${text.slice(0, Math.max(1, max - 1))}…` : text;

/** Place each tag as a star on its band's ring. */
function plotRings(tags, type) {
  return BANDS.map((band, b) => {
    const members = tags.filter(
      (tag) => tag.shown >= band.min && tag.shown <= band.max,
    );
    const n = members.length;
    const step = n ? (2 * Math.PI - 2 * GAP) / n : 0;
    const arc = step * band.r;
    // Label a ring only while its stars sit far enough apart to read.
    const labelled = n > 0 && arc >= FONT * 1.15;
    const outer = b < BANDS.length - 1 ? BANDS[b + 1].r : C;
    const maxChars = Math.max(
      4,
      Math.floor((outer - band.r - 34) / (FONT * 0.6)),
    );

    const stars = members.map((tag, i) => {
      const angle = TOP + GAP + step * (i + 0.5);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dot = Math.min(
        15,
        3.5 + Math.sqrt(tag.shown) * 1.5,
        Math.max(2.5, arc / 2 - 1),
      );
      const reach = band.r + dot + 7;
      const left = cos < -1e-6;
      return {
        tag,
        x: C + band.r * cos,
        y: C + band.r * sin,
        dot,
        lx: C + reach * cos,
        ly: C + reach * sin,
        deg: (angle * 180) / Math.PI + (left ? 180 : 0),
        anchor: left ? 'end' : 'start',
        text: clip(tag.label, maxChars),
        ink: type === 'all' ? dominantType(tag) : type,
      };
    });
    return { ...band, n, labelled, stars };
  });
}

/** ORBIT /tags: a star atlas. Tags orbit the index on rings by frequency. */
export default function OrbitTagsPage({ view }) {
  const ready = view.status === 'ready';
  const shownCount = view.shared.length + view.single.length;

  const rings = useMemo(
    () => plotRings(view.shared, view.type),
    [view.shared, view.type],
  );
  const plotted = rings.reduce((sum, ring) => sum + ring.n, 0);
  const inkOf = (tag) => (view.type === 'all' ? dominantType(tag) : view.type);

  return (
    <div className="orb-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <div className="orb-page">
        <OrbitFolio
          folio="INDEX"
          title="Tags"
          sub="A star atlas of every thread through the posts, logs and projects. The heaviest tags orbit closest to the centre."
        >
          {ready && (
            <p className="orb-stats mt-4">
              <span>
                <strong>{pad(view.totalTags)}</strong> TAGS
              </span>
              <span>
                <strong>{pad(view.totalItems)}</strong> ENTRIES INDEXED
              </span>
              <span>
                <strong>{pad(shownCount)}</strong> IN VIEW
              </span>
            </p>
          )}
        </OrbitFolio>

        {/* instrument panel */}
        <div
          className="flex flex-col gap-3 mb-8 pb-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <input
            type="search"
            className="orb-input"
            value={view.query}
            onChange={(event) => view.setQuery(event.target.value)}
            placeholder="Find a tag…"
            aria-label="Search tags"
          />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Content type"
            >
              <span className="orb-label mr-1">SPECTRUM</span>
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`orb-chip orb-tg-type-${t.key}`}
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span className="orb-tg-pip" aria-hidden="true" />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Sort tags"
            >
              <span className="orb-label mr-1">SORT</span>
              <button
                type="button"
                className="orb-chip"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
              >
                Most used
              </button>
              <button
                type="button"
                className="orb-chip"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>

        {view.status === 'error' && (
          <OrbitNotice error>{view.error}</OrbitNotice>
        )}
        {view.status === 'loading' && (
          <OrbitNotice>Aligning the instruments…</OrbitNotice>
        )}
        {ready && shownCount === 0 && (
          <OrbitNotice>
            No objects match “{view.query}”.{' '}
            <button
              type="button"
              className="orb-link"
              onClick={() => view.setQuery('')}
            >
              Clear the search
            </button>
          </OrbitNotice>
        )}

        {/* the orbital chart; narrow screens get the catalogue only */}
        {plotted > 0 && (
          <figure className="orb-tg-atlas hidden sm:block m-0 mb-10">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="block w-full h-auto mx-auto max-w-[860px]"
              role="group"
              aria-label={`Orbital chart of ${plotted} tags, grouped into rings by how often they are used`}
            >
              <line
                x1={C}
                y1={C - CORE}
                x2={C}
                y2={C - BANDS[BANDS.length - 1].r - 26}
                className="orb-tg-meridian"
              />
              {rings.map((ring) => (
                <g key={ring.key}>
                  <circle cx={C} cy={C} r={ring.r} className="orb-tg-ring" />
                  {ring.stars.map((star) => (
                    <Link
                      key={star.tag.slug}
                      to={view.hrefFor(star.tag)}
                      className={`orb-tg-star orb-tg-type-${star.ink}`}
                      aria-label={`${star.tag.label}, ${entries(star.tag.shown)}`}
                    >
                      <title>{`${star.tag.label} · ${entries(star.tag.shown)}`}</title>
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r={Math.max(star.dot + 4, 10)}
                        className="orb-tg-star-hit"
                      />
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r={star.dot}
                        className="orb-tg-star-dot"
                      />
                      {ring.labelled && (
                        <text
                          x={star.lx}
                          y={star.ly}
                          textAnchor={star.anchor}
                          dominantBaseline="central"
                          transform={`rotate(${star.deg.toFixed(2)} ${star.lx.toFixed(
                            2,
                          )} ${star.ly.toFixed(2)})`}
                          className="orb-tg-star-label"
                        >
                          {star.text}
                        </text>
                      )}
                    </Link>
                  ))}
                  <text
                    x={C}
                    y={C - ring.r}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="orb-tg-ring-label"
                  >
                    {`${ring.label} · ${ring.n}`}
                  </text>
                </g>
              ))}
              <circle cx={C} cy={C} r={CORE} className="orb-tg-core" />
              <text
                x={C}
                y={C - 8}
                textAnchor="middle"
                dominantBaseline="central"
                className="orb-tg-core-num"
              >
                {shownCount}
              </text>
              <text
                x={C}
                y={C + 30}
                textAnchor="middle"
                dominantBaseline="central"
                className="orb-tg-core-label"
              >
                TAGS
              </text>
            </svg>
            <figcaption className="orb-label mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center">
              {TAG_TYPES.map((t) => (
                <span
                  key={t.key}
                  className={`inline-flex items-center gap-2 orb-tg-type-${t.key}`}
                >
                  <span className="orb-tg-pip" aria-hidden="true" />
                  {t.label.toUpperCase()}
                </span>
              ))}
              <span>COLOUR = DOMINANT TYPE · SIZE = ENTRIES</span>
              {plotted < view.shared.length && (
                <span>
                  {view.shared.length - plotted} BELOW {PLOT_MIN} ENTRIES:
                  CATALOGUE ONLY
                </span>
              )}
            </figcaption>
          </figure>
        )}

        {view.shared.length > 0 && (
          <section aria-label="Catalogue">
            <h2 className="sr-only">Catalogue</h2>
            <OrbitRule
              label={
                view.query
                  ? `CATALOGUE · MATCHES · ${pad(view.shared.length)}`
                  : `CATALOGUE · ${pad(view.shared.length)}`
              }
              className="mb-3"
            />
            <ul className="list-none m-0 p-0 columns-1 gap-x-8 min-[440px]:columns-2 md:columns-3 lg:columns-4">
              {view.shared.map((tag) => (
                <li key={tag.slug} className="break-inside-avoid min-w-0">
                  <Link
                    to={view.hrefFor(tag)}
                    className={`orb-tg-cat orb-tg-type-${inkOf(tag)}`}
                    data-size={view.sizeFor(tag.shown)}
                    aria-label={`${tag.label}, ${entries(tag.shown)}`}
                  >
                    <span className="orb-tg-pip" aria-hidden="true" />
                    <span className="orb-tg-cat-name">{tag.label}</span>
                    <span className="orb-tg-cat-leader" aria-hidden="true" />
                    <span className="orb-tg-cat-count" aria-hidden="true">
                      {tag.shown}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view.single.length > 0 && (
          <details className="mt-10">
            <summary className="orb-summary orb-label">
              <span className="orb-accent">
                FAINT OBJECTS ({view.single.length})
              </span>
            </summary>
            <p className="orb-muted text-sm mt-3 mb-3">
              Tags seen on a single entry.
            </p>
            <ul className="list-none m-0 p-0 columns-1 gap-x-8 min-[440px]:columns-2 md:columns-3 lg:columns-4">
              {view.single.map((tag) => (
                <li key={tag.slug} className="break-inside-avoid min-w-0">
                  <Link
                    to={view.hrefFor(tag)}
                    className={`orb-tg-cat orb-tg-type-${inkOf(tag)}`}
                    data-size={0}
                    aria-label={`${tag.label}, ${entries(tag.shown)}`}
                  >
                    <span className="orb-tg-pip" aria-hidden="true" />
                    <span className="orb-tg-cat-name">{tag.label}</span>
                    <span className="orb-tg-cat-leader" aria-hidden="true" />
                    <span className="orb-tg-cat-count" aria-hidden="true">
                      {tag.shown}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        {ready && (
          <footer className="mt-12">
            <OrbitRule className="mb-4" />
            <span className="orb-label">
              ATLAS · {pad(view.totalTags)} OBJECTS ON RECORD ·{' '}
              {view.sort === 'az' ? 'CATALOGUED A→Z' : 'CATALOGUED BY USE'}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
}
