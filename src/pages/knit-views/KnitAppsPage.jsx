import React, { useState } from 'react';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitNotice,
  KnitBand,
  KnitAppCard,
  YARN,
  useKnitIndex,
  knitApps,
} from '../../components/knit';
import '../../styles/Knit.css';

const SECTION_BANDS = ['zigzag', 'checks', 'lice', 'hearts'];

const KnitAppsPage = () => {
  const { data, loading, error } = useKnitIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = knitApps(data);
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
    <div className="knt-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <KnitHero
        eyebrow={
          loading
            ? 'The app collection'
            : `${apps.length} apps · ${categories.length} collections`
        }
        title="Small instruments. Endless rabbit holes."
        intro="Experiments to play with, tools to think with, and useful little things made along the way."
        wool="plum"
        motif="diamonds"
      >
        <input
          type="search"
          aria-label="Search apps"
          className="knt-input mt-7 max-w-2xl"
          placeholder="Find an instrument…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-4" aria-label="App categories">
          <button
            type="button"
            className="knt-tag"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(([key, value]) => (
            <button
              type="button"
              key={key}
              className="knt-tag"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {value.name}
            </button>
          ))}
        </div>
      </KnitHero>
      <div className="knt-page">
        {loading ? (
          <KnitNotice>Laying out the workbench…</KnitNotice>
        ) : error ? (
          <KnitNotice error>The app collection could not be loaded.</KnitNotice>
        ) : (
          <>
            <p className="knt-label" role="status">
              {filtered.length} instruments{query ? ` matching “${query}”` : ''}
            </p>
            {filtered.length === 0 && (
              <KnitNotice>
                No instruments match this search.{' '}
                <button
                  type="button"
                  className="knt-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </KnitNotice>
            )}
            {categories.map(([key, value], index) => {
              const matches = filtered.filter((app) => app.categoryKey === key);
              if (!matches.length) return null;
              const folded =
                !!collapsed[key] && !query.trim() && category === 'all';
              return (
                <section className="knt-section" key={key}>
                  <KnitBand
                    pattern={SECTION_BANDS[index % SECTION_BANDS.length]}
                    className="mb-5 rounded"
                  />
                  <div className="knt-section-head">
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
                      <KnitIcon
                        name={folded ? 'caretRight' : 'caretDown'}
                        fg={YARN.gold}
                      />
                      <KnitText
                        as="h2"
                        text={value.name}
                        fg={YARN.cream}
                        className="flex-1"
                      />
                    </button>
                    <KnitText
                      text={`${matches.length} instruments`}
                      size="small"
                      fg={YARN.wheat}
                      fit
                    />
                  </div>
                  {!folded && (
                    <div className="knt-grid">
                      {matches.map((app) => (
                        <KnitAppCard
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

export default KnitAppsPage;
