import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KilimRug,
  KilimText,
  KilimBand,
  KilimNotice,
  WOOL,
} from '../../components/kilim';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES } from '../tags/tagTypes';
import '../../styles/Kilim.css';
import './kilim-tags.css';

// Each content type is its own dye: posts madder, logs teal, projects saffron.
export const TYPE_DYE = {
  post: WOOL.madder,
  log: WOOL.teal,
  project: WOOL.saffron,
};

// With "Most used", the chart is split into dye lots by weight.
const LOTS = [
  { size: 4, name: 'Lot I', note: '20 or more uses' },
  { size: 3, name: 'Lot II', note: '10 to 19 uses' },
  { size: 2, name: 'Lot III', note: '5 to 9 uses' },
  { size: 1, name: 'Lot IV', note: 'under 5 uses' },
];

const initialOf = (label) => {
  const ch = (label || '').trim().charAt(0).toUpperCase();
  return /[A-ZÇĞİÖŞÜ]/.test(ch) ? ch : '#';
};

/**
 * One tag as a hank of yarn on the dye chart: its name, its count, and a
 * hank whose length grows with use, dyed in the types it is used on.
 */
const Hank = ({ tag, view, longest }) => {
  const parts =
    view.type === 'all'
      ? TAG_TYPES.filter((t) => tag[t.plural] > 0)
      : TAG_TYPES.filter((t) => t.key === view.type);
  const mostly = parts.reduce(
    (best, t) => (!best || tag[t.plural] > tag[best.plural] ? t : best),
    null,
  );
  // Square root, so the long tail still shows some yarn.
  const length = 10 + 90 * Math.sqrt(tag.shown / Math.max(1, longest));

  return (
    <li className="min-w-0">
      <Link
        to={view.hrefFor(tag)}
        className="klm-tags-hank"
        aria-label={`${tag.label}, ${tag.shown} ${
          tag.shown === 1 ? 'item' : 'items'
        }${mostly ? `, mostly ${mostly.plural}` : ''}`}
      >
        <span className="klm-tags-hank-name">{tag.label}</span>
        <span className="klm-tags-hank-count" aria-hidden="true">
          {tag.shown}
        </span>
        <span
          className="klm-tags-yarn"
          style={{ width: `${length}%` }}
          aria-hidden="true"
        >
          {parts.map((t) => (
            <span
              key={t.key}
              className="klm-tags-ply"
              style={{
                flexGrow: view.type === 'all' ? tag[t.plural] : 1,
                '--dye': TYPE_DYE[t.key],
              }}
            />
          ))}
        </span>
      </Link>
    </li>
  );
};

/**
 * Kilim /tags: the dye house's chart. Tags hang as hanks of yarn, grouped
 * into dye lots by weight (or by initial when sorted A–Z); a hank's length
 * is its use and its plies are the content types it dyes.
 */
export default function KilimTagsPage({ view }) {
  const ready = view.status === 'ready';
  const nothing = ready && view.shared.length + view.single.length === 0;

  const longest = useMemo(
    () => view.shared.reduce((max, tag) => Math.max(max, tag.shown), 1),
    [view.shared],
  );

  const lots = useMemo(() => {
    if (view.sort === 'az') {
      const byLetter = [];
      view.shared.forEach((tag) => {
        const key = initialOf(tag.label);
        const last = byLetter[byLetter.length - 1];
        if (last && last.key === key) last.tags.push(tag);
        else byLetter.push({ key, name: key, note: null, tags: [tag] });
      });
      return byLetter;
    }
    return LOTS.map((lot) => ({
      key: lot.name,
      name: lot.name,
      note: lot.note,
      tags: view.shared.filter((tag) => view.sizeFor(tag.shown) === lot.size),
    })).filter((lot) => lot.tags.length > 0);
    // view.sizeFor is recreated every render but depends only on the count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.shared, view.sort]);

  return (
    <div className="klm-root klm-tags">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="The dye house"
          title="Tags"
          intro={
            ready
              ? `${view.totalTags} tags across ${view.totalItems} posts, logs and projects, hung as hanks of yarn. Pick one to see everything woven with it.`
              : 'Every thread the codex is woven from, hung as hanks of yarn.'
          }
          seed="tags-dye-house"
        />

        {/* ---- the dyer's controls ---- */}
        <div className="klm-tags-controls">
          <label className="block min-w-0">
            <span className="klm-label block mb-1.5">Find a hank</span>
            <input
              type="search"
              className="klm-input"
              value={view.query}
              onChange={(event) => view.setQuery(event.target.value)}
              placeholder="Search tags…"
            />
          </label>
          <div className="min-w-0">
            <span className="klm-label block mb-1.5" id="klm-tags-type-label">
              Dye
            </span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="klm-tags-type-label"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="klm-chip"
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span
                      aria-hidden="true"
                      className="klm-tags-dot"
                      style={{ '--dye': TYPE_DYE[t.key] }}
                    />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <span className="klm-label block mb-1.5" id="klm-tags-sort-label">
              Hang by
            </span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="klm-tags-sort-label"
            >
              <button
                type="button"
                className="klm-chip"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
              >
                Most used
              </button>
              <button
                type="button"
                className="klm-chip"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="klm-page">
        {view.status === 'error' && (
          <KilimNotice error>{view.error}</KilimNotice>
        )}
        {view.status === 'loading' && (
          <KilimNotice>Lifting the hanks out of the dye…</KilimNotice>
        )}
        {nothing && (
          <KilimNotice>
            No tags match “{view.query}”, so the drying rod stays bare.{' '}
            <button
              type="button"
              className="klm-link"
              onClick={() => view.setQuery('')}
            >
              Clear the search
            </button>
          </KilimNotice>
        )}

        {view.shared.length > 0 && (
          <section aria-labelledby="klm-tags-chart-title">
            <div className="klm-section-head !mb-3">
              <KilimText
                as="h2"
                id="klm-tags-chart-title"
                text={view.query ? 'Matching hanks' : 'The dye chart'}
                fg={WOOL.saffron}
              />
              <span className="klm-label">{view.shared.length} hanks</span>
            </div>

            <ul className="klm-tags-key" aria-label="Chart key">
              {TAG_TYPES.map((t) => (
                <li key={t.key}>
                  <span
                    aria-hidden="true"
                    className="klm-tags-dot"
                    style={{ '--dye': TYPE_DYE[t.key] }}
                  />
                  {t.label}
                </li>
              ))}
              <li className="klm-tags-key-note">
                Longer hank, more uses · plies show the mix
              </li>
            </ul>

            <KilimBand pattern="teeth" className="mb-6" />

            {lots.map((lot) => (
              <section key={lot.key} className="klm-tags-lot">
                <div className="klm-tags-lot-head">
                  <KilimText as="h3" text={lot.name} fg={WOOL.ivory} fit />
                  {lot.note && (
                    <span className="klm-label">
                      {lot.note} · {lot.tags.length}
                    </span>
                  )}
                </div>
                <ul className="klm-tags-rod">
                  {lot.tags.map((tag) => (
                    <Hank
                      key={tag.slug}
                      tag={tag}
                      view={view}
                      longest={longest}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </section>
        )}

        {view.single.length > 0 && (
          <details className="klm-tags-thrums">
            <summary>
              <span className="klm-tags-caret" aria-hidden="true">
                ▸
              </span>
              Thrums ({view.single.length})
              <span className="klm-tags-thrums-note">
                the loose ends: tags used once
              </span>
            </summary>
            <ul className="klm-tags-thrum-list">
              {view.single.map((tag) => (
                <li key={tag.slug}>
                  <Link to={tagPath(tag.slug)} className="klm-tags-thrum">
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        {ready && !nothing && (
          <p className="klm-label mt-10">
            {view.shared.length + view.single.length} tags in this view
          </p>
        )}
      </div>
    </div>
  );
}
