import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, CaretDownIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import OrbitArt from '../../components/orbit/OrbitArt';
import { OrbitNotice } from '../../components/orbit';
import {
  useOrbitIndex,
  orbitApps,
} from '../../components/orbit/useOrbitContent';
import '../../styles/Orbit.css';

const OrbitAppsPage = () => {
  const { data, loading, error } = useOrbitIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = orbitApps(data);
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
    <div className="orb-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <div className="orb-page">
        <header className="mb-9">
          <p className="orb-eyebrow">
            {loading
              ? 'THE APP COLLECTION'
              : `${apps.length} APPS · ${categories.length} COLLECTIONS`}
          </p>
          <h1 className="orb-title mt-4">
            Small instruments.
            <br />
            Endless rabbit holes.
          </h1>
          <p className="orb-intro">
            Experiments to play with, tools to think with, and useful little
            things made along the way.
          </p>
        </header>
        <input
          type="search"
          aria-label="Search apps"
          className="orb-input"
          placeholder="Find an instrument…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 my-5" aria-label="App categories">
          <button
            type="button"
            className="orb-chip"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(([key, value]) => (
            <button
              type="button"
              key={key}
              className="orb-chip"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {value.name}
            </button>
          ))}
        </div>
        {loading ? (
          <OrbitNotice>Opening the workbench…</OrbitNotice>
        ) : error ? (
          <OrbitNotice error>
            The app collection could not be loaded.
          </OrbitNotice>
        ) : (
          <>
            <p className="orb-label" role="status">
              {filtered.length} instruments{query ? ` matching “${query}”` : ''}
            </p>
            {filtered.length === 0 && (
              <OrbitNotice>
                No instruments match this search.{' '}
                <button
                  type="button"
                  className="orb-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </OrbitNotice>
            )}
            {categories.map(([key, value]) => {
              const matches = filtered.filter((app) => app.categoryKey === key);
              if (!matches.length) return null;
              const folded =
                !!collapsed[key] && !query.trim() && category === 'all';
              return (
                <section className="orb-section" key={key}>
                  <div className="orb-section-head">
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
                    <span className="orb-label">
                      {matches.length} instruments
                    </span>
                  </div>
                  {!folded && (
                    <div className="orb-app-grid">
                      {matches.map((app) => (
                        <Link
                          to={app.to}
                          key={app.slug}
                          className="orb-app-card"
                        >
                          <OrbitArt item={app} />
                          <h3 className="flex justify-between items-start gap-2">
                            {app.title}
                            <ArrowUpRightIcon size={17} className="shrink-0" />
                          </h3>
                          <p>{app.description}</p>
                          <span className="orb-label">
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

export default OrbitAppsPage;
