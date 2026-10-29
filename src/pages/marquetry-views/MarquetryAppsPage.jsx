import React, { useState } from 'react';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryNotice,
  MarquetryBand,
  MarquetryAppCard,
  WOOD,
  useMarquetryIndex,
  marquetryApps,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const SECTION_BANDS = ['zigzag', 'checks', 'lice', 'hearts'];

const MarquetryAppsPage = () => {
  const { data, loading, error } = useMarquetryIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = marquetryApps(data);
  const categories = Object.entries(data || {}).sort(
    ([, a], [, b]) => (a.order || 0) - (b.order || 0),
  );
  const filtered = apps.filter(
    (app) =>
      (category === 'all' || app.categoryKey === category) &&
      `${app.title} ${app.description} ${app.categoryName}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="mqt-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <MarquetryHero
        eyebrow={
          loading
            ? 'The app collection'
            : `${apps.length} apps · ${categories.length} collections`
        }
        title="Small instruments. Endless rabbit holes."
        intro="Experiments to play with, tools to think with, and useful little things made along the way."
      >
        <input
          type="search"
          aria-label="Search apps"
          className="mqt-input mt-7 max-w-2xl"
          placeholder="Find an instrument…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-4" aria-label="App categories">
          <button
            type="button"
            className="mqt-tag"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(([key, value]) => (
            <button
              type="button"
              key={key}
              className="mqt-tag"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {value.name}
            </button>
          ))}
        </div>
      </MarquetryHero>
      <div className="mqt-page">
        {loading ? (
          <MarquetryNotice>Laying out the workbench…</MarquetryNotice>
        ) : error ? (
          <MarquetryNotice error>
            The app collection could not be loaded.
          </MarquetryNotice>
        ) : (
          <>
            <p className="mqt-label" role="status">
              {filtered.length} instruments{query ? ` matching “${query}”` : ''}
            </p>
            {filtered.length === 0 && (
              <MarquetryNotice>
                No instruments match this search.{' '}
                <button
                  type="button"
                  className="mqt-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </MarquetryNotice>
            )}
            {categories.map(([key, value], index) => {
              const matches = filtered.filter((app) => app.categoryKey === key);
              if (!matches.length) return null;
              const folded =
                !!collapsed[key] && !query.trim() && category === 'all';
              return (
                <section className="mqt-section" key={key}>
                  <MarquetryBand
                    pattern={SECTION_BANDS[index % SECTION_BANDS.length]}
                    className="mb-5 rounded"
                  />
                  <div className="mqt-section-head">
                    <button
                      type="button"
                      className="flex gap-3 items-center flex-1 min-w-0 text-left"
                      onClick={() =>
                        setCollapsed((old) => ({ ...old, [key]: !old[key] }))
                      }
                      aria-expanded={!folded}
                      aria-label={value.name}
                      disabled={!!query.trim() || category !== 'all'}
                    >
                      <MarquetryIcon
                        name={folded ? 'caretRight' : 'caretDown'}
                        fg={WOOD.teal}
                      />
                      <MarquetryText
                        as="h2"
                        text={value.name}
                        fg={WOOD.ink}
                        className="flex-1"
                      />
                    </button>
                    <MarquetryText
                      text={`${matches.length} instruments`}
                      size="small"
                      fg={WOOD.bark}
                      fit
                    />
                  </div>
                  {!folded && (
                    <div className="mqt-grid">
                      {matches.map((app) => (
                        <MarquetryAppCard
                          key={app.slug}
                          app={app}
                          meta={`${app.pinned_order ? 'Pinned · ' : ''}${value.name}`}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MarquetryAppsPage;
