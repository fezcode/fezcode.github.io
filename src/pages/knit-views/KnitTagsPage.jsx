import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KnitText,
  KnitIcon,
  KnitNotice,
  KnitBand,
  YARN,
} from '../../components/knit';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES } from '../tags/tagTypes';
import '../../styles/Knit.css';
import './knit-tags.css';

// Each content type is worked in its own yarn: the swatch colour of a tag is
// the yarn of the type it is used on most.
const TYPE_WOOL = {
  post: {
    wool: 'knt-wool-poppy',
    yarn: YARN.poppy,
    fg: YARN.cream,
    ink: false,
  },
  log: { wool: 'knt-wool-teal', yarn: YARN.teal, fg: YARN.cream, ink: false },
  project: { wool: 'knt-wool-gold', yarn: YARN.gold, fg: YARN.peat, ink: true },
};

// The heaviest tags take more cells on the chart.
const SPAN_CLASS = {
  cell: 'aspect-square',
  wide: 'col-span-2',
  big: 'col-span-2 row-span-2 aspect-square',
};
const spanFor = (size) => (size >= 4 ? 'big' : size === 3 ? 'wide' : 'cell');

const dominantType = (tag, type) =>
  type !== 'all'
    ? type
    : TAG_TYPES.reduce(
        (best, t) => (tag[t.plural] > tag[best.plural] ? t : best),
        TAG_TYPES[0],
      ).key;

// Knitted type only where every word fits across a big swatch.
const knits = (label) =>
  label.length <= 18 && label.split(/[\s-]+/).every((w) => w.length <= 9);

const Swatch = ({ tag, view }) => {
  const type = dominantType(tag, view.type);
  const yarn = TYPE_WOOL[type];
  const span = spanFor(view.sizeFor(tag.shown));
  const roomy = span !== 'cell';
  const mix = TAG_TYPES.filter((t) => tag[t.plural] > 0);
  const mostly = TAG_TYPES.find((t) => t.key === type);

  return (
    <li className={`min-w-0 ${SPAN_CLASS[span]}`}>
      <Link
        to={view.hrefFor(tag)}
        className={`knt-tg-swatch ${yarn.wool}`}
        data-span={span}
        data-ink={yarn.ink || undefined}
        aria-label={`${tag.label}, ${tag.shown} ${
          tag.shown === 1 ? 'item' : 'items'
        }, mostly ${mostly.plural}`}
      >
        {roomy && knits(tag.label) ? (
          <KnitText
            text={tag.label}
            size="small"
            fg={yarn.fg}
            maxLines={span === 'big' ? 3 : 2}
          />
        ) : (
          <span className="knt-tg-name">{tag.label}</span>
        )}
        <span className="flex flex-col gap-1.5">
          {span === 'big' && view.type === 'all' && mix.length > 1 && (
            <span className="knt-tg-mix" aria-hidden="true">
              {mix.map((t) => (
                <span
                  key={t.key}
                  style={{
                    width: `${(tag[t.plural] / tag.count) * 100}%`,
                    background: TYPE_WOOL[t.key].yarn,
                  }}
                />
              ))}
            </span>
          )}
          <span className="knt-tg-sts" aria-hidden="true">
            {tag.shown} sts
          </span>
        </span>
      </Link>
    </li>
  );
};

/** Knit /tags: a knitting chart of swatches, one per tag, sized by use. */
export default function KnitTagsPage({ view }) {
  const ready = view.status === 'ready';
  const nothing = ready && view.shared.length + view.single.length === 0;

  return (
    <div className="knt-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <header className="knt-wool-denim">
        <KnitBand
          pattern={[
            'peerie',
            ['checks', { a: YARN.cream, b: YARN.teal }],
            'peerie',
          ]}
        />
        <div className="knt-page !pb-8">
          <KnitText text="The swatch book" size="small" fg={YARN.wheat} />
          <KnitText
            as="h1"
            text="Tags"
            scale={2}
            fg={YARN.cream}
            className="mt-4"
          />
          <p className="mt-4 max-w-2xl text-base text-[color:var(--knt-fg)]">
            {ready
              ? `${view.totalTags} tags across ${view.totalItems} posts, logs and projects, charted as swatches. Pick one to see everything filed under it.`
              : 'Every thread the codex is filed under, charted as swatches.'}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
            <label className="block min-w-0">
              <span className="knt-label block mb-1.5">Find a swatch</span>
              <input
                type="search"
                className="knt-input"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search tags…"
              />
            </label>
            <div className="min-w-0">
              <span className="knt-label block mb-1.5" id="knt-tg-type-label">
                Yarn
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-labelledby="knt-tg-type-label"
              >
                {view.types.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className="knt-btn"
                    aria-pressed={view.type === t.key}
                    onClick={() => view.setType(t.key)}
                  >
                    {t.key !== 'all' && (
                      <span
                        aria-hidden="true"
                        className={`knt-tg-yarn !w-3 !h-3 ${TYPE_WOOL[t.key].wool}`}
                      />
                    )}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <span className="knt-label block mb-1.5" id="knt-tg-sort-label">
                Order
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-labelledby="knt-tg-sort-label"
              >
                <button
                  type="button"
                  className="knt-btn"
                  aria-pressed={view.sort === 'count'}
                  onClick={() => view.setSort('count')}
                >
                  Most used
                </button>
                <button
                  type="button"
                  className="knt-btn"
                  aria-pressed={view.sort === 'az'}
                  onClick={() => view.setSort('az')}
                >
                  A–Z
                </button>
              </div>
            </div>
          </div>
        </div>
        <KnitBand pattern="peerie" />
      </header>

      <div className="knt-page">
        {view.status === 'error' && <KnitNotice error>{view.error}</KnitNotice>}
        {view.status === 'loading' && (
          <KnitNotice>Winding the swatches…</KnitNotice>
        )}
        {nothing && (
          <KnitNotice>
            No tags match “{view.query}”, so the chart stays blank.{' '}
            <button
              type="button"
              className="knt-link"
              onClick={() => view.setQuery('')}
            >
              Clear the search
            </button>
          </KnitNotice>
        )}

        {view.shared.length > 0 && (
          <section aria-labelledby="knt-tg-chart-title">
            <div className="knt-section-head !mb-3">
              <KnitText
                as="h2"
                id="knt-tg-chart-title"
                text={view.query ? 'Matching swatches' : 'The chart'}
                fg={YARN.gold}
              />
              <KnitText
                text={`${view.shared.length} swatches`}
                size="small"
                fg={YARN.wheat}
                fit
              />
            </div>

            <ul
              className="list-none m-0 mb-4 p-0 flex flex-wrap items-center gap-x-5 gap-y-2"
              aria-label="Chart key"
            >
              {TAG_TYPES.map((t) => (
                <li key={t.key} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`knt-tg-yarn ${TYPE_WOOL[t.key].wool}`}
                  />
                  <span className="knt-label !text-[color:var(--knt-fg)]">
                    {t.label} yarn
                  </span>
                </li>
              ))}
              <li className="knt-label">
                1 cell under 10 sts · 2 cells 10–19 · 4 cells 20+
              </li>
            </ul>

            <div className="knt-tg-frame knt-wool-peat">
              <div className="knt-tg-chart-wrap">
                <ul className="knt-tg-chart" aria-label="Tags">
                  {view.shared.map((tag) => (
                    <Swatch key={tag.slug} tag={tag} view={view} />
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {view.single.length > 0 && (
          <details className="knt-patch knt-patch-tight knt-tg-loose mt-10 max-w-4xl">
            <summary>
              <span className="knt-tg-caret" aria-hidden="true">
                <KnitIcon name="caretRight" fg={YARN.rust} />
              </span>
              Loose ends ({view.single.length})
              <span className="knt-muted normal-case tracking-normal font-semibold text-sm">
                tags used once
              </span>
            </summary>
            <ul className="list-none m-0 p-0 mt-4 flex flex-wrap gap-2">
              {view.single.map((tag) => (
                <li key={tag.slug}>
                  <Link to={tagPath(tag.slug)} className="knt-tag knt-tg-chip">
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        {ready && !nothing && (
          <p className="knt-label mt-10">
            {view.shared.length + view.single.length} tags in this view
          </p>
        )}
      </div>
      <KnitBand pattern={['peerie', 'checks', 'peerie']} className="mt-8" />
    </div>
  );
}
