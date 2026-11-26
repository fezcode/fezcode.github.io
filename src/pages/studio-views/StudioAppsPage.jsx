import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, CaretDownIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import StudioArt from '../../components/studio/StudioArt';
import { StudioNotice } from '../../components/studio';
import {
  useStudioIndex,
  studioApps,
} from '../../components/studio/useStudioContent';
import '../../styles/Studio.css';

const StudioAppsPage = () => {
  const { data, loading, error } = useStudioIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = studioApps(data);
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
    <div className="std-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <div className="std-page">
        <header className="mb-9">
          <p className="std-eyebrow">
            {loading
              ? 'THE APP COLLECTION'
              : `${apps.length} APPS · ${categories.length} COLLECTIONS`}
          </p>
          <h1 className="std-title mt-4">
            Small instruments.
            <br />
            Endless rabbit holes.
          </h1>
          <p className="std-intro">
            Experiments to play with, tools to think with, and useful little
            things made along the way.
          </p>
        </header>
        <input
          type="search"
          aria-label="Search apps"
          className="std-input"
          placeholder="Find an instrument…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 my-5" aria-label="App categories">
          <button
            type="button"
            className="std-chip"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(([key, value]) => (
            <button
              type="button"
              key={key}
              className="std-chip"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {value.name}
            </button>
          ))}
        </div>
        {loading ? (
          <StudioNotice>Opening the workbench…</StudioNotice>
        ) : error ? (
          <StudioNotice error>
            The app collection could not be loaded.
          </StudioNotice>
        ) : (
          <>
            <p className="std-label" role="status">
              {filtered.length} instruments{query ? ` matching “${query}”` : ''}
            </p>
            {filtered.length === 0 && (
              <StudioNotice>
                No instruments match this search.{' '}
                <button
                  type="button"
                  className="std-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </StudioNotice>
            )}
            {categories.map(([key, value]) => {
              const matches = filtered.filter((app) => app.categoryKey === key);
              if (!matches.length) return null;
              const folded =
                !!collapsed[key] && !query.trim() && category === 'all';
              return (
                <section className="std-section" key={key}>
                  <div className="std-section-head">
                    <button
                      type="button"
                      className="flex gap-3 items-center text-xl"
                      onClick={() =>
                        setCollapsed((old) => ({ ...old, [key]: !old[key] }))
                      }
                      aria-expanded={!folded}
                      disabled={!!query.trim() || category !== 'all'}
                    >
                      <CaretDownIcon
                        size={18}
                        style={{
                          transform: folded ? 'rotate(-90deg)' : 'none',
                        }}
                      />
                      {value.name}
                    </button>
                    <span className="std-label">
                      {matches.length} instruments
                    </span>
                  </div>
                  {!folded && (
                    <div className="std-app-grid">
                      {matches.map((app) => (
                        <Link
                          to={app.to}
                          key={app.slug}
                          className="std-app-card"
                        >
                          <StudioArt item={app} />
                          <h3 className="flex justify-between items-start gap-2">
                            {app.title}
                            <ArrowUpRightIcon size={17} className="shrink-0" />
                          </h3>
                          <p>{app.description}</p>
                          <span className="std-label">
                            {app.pinned_order ? 'Pinned · ' : ''}
                            {value.name}
                          </span>
                        </Link>
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

export default StudioAppsPage;
