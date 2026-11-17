import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  KilimRug,
  KilimText,
  KilimIcon,
  KilimBand,
  KilimBadge,
  KilimNotice,
  WOOL,
  useKilimIndex,
  kilimApps,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-content.css';

/** Each stall gets its own awning: a sawtooth in a different dye. */
const AWNINGS = [
  { ground: WOOL.madder, tooth: WOOL.ivory, edge: WOOL.indigo },
  { ground: WOOL.indigo, tooth: WOOL.saffron, edge: WOOL.ivory },
  { ground: WOOL.teal, tooth: WOOL.ivory, edge: WOOL.madder },
  { ground: WOOL.aubergine, tooth: WOOL.saffron, edge: WOOL.ivory },
  { ground: WOOL.pistachio, tooth: WOOL.ivory, edge: WOOL.walnut },
];

/** An app as an ivory tag hung on its stall's rack. */
const AppTag = ({ app }) => (
  <li>
    <Link to={app.to} className="klm-apps-tag">
      <KilimBadge seed={app.slug} size={13} />
      <div className="klm-apps-tag-body">
        <h3 className="klm-apps-tag-title">
          {app.title} <span aria-hidden="true">↗</span>
        </h3>
        {(app.kicker || app.tagline) && (
          <span className="klm-apps-tag-kicker">{app.kicker || app.tagline}</span>
        )}
        {app.description && <span className="klm-apps-tag-text">{app.description}</span>}
        {app.pinned_order ? <span className="klm-apps-tag-pin">Pinned</span> : null}
      </div>
    </Link>
  </li>
);

const KilimAppsPage = () => {
  const { data, loading, error } = useKilimIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = kilimApps(data);
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
    <div className="klm-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow={
            loading
              ? 'The app collection'
              : `${apps.length} apps · ${categories.length} collections`
          }
          title="Small instruments. Endless rabbit holes."
          intro="Experiments to play with, tools to think with, and useful little things made along the way."
          seed="apps"
        >
          <div className="klm-controls">
            <input
              type="search"
              aria-label="Search apps"
              className="klm-input"
              placeholder="Find an instrument…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="klm-chips" aria-label="App categories">
              <button
                type="button"
                className="klm-chip"
                aria-pressed={category === 'all'}
                onClick={() => setCategory('all')}
              >
                All stalls
              </button>
              {categories.map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  className="klm-chip"
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
        </KilimRug>
      </div>
      <div className="klm-page !pt-2">
        {loading ? (
          <KilimNotice>Opening the stalls…</KilimNotice>
        ) : error ? (
          <KilimNotice error>The app collection could not be loaded.</KilimNotice>
        ) : (
          <>
            <p className="klm-label klm-status" role="status">
              {filtered.length} instruments{query ? ` matching “${query}”` : ''}
            </p>
            {filtered.length === 0 && (
              <KilimNotice>
                No instruments match this search.
                <button
                  type="button"
                  className="klm-link klm-btn-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </KilimNotice>
            )}
            {categories.map(([key, value], index) => {
              const matches = filtered.filter((app) => app.categoryKey === key);
              if (!matches.length) return null;
              const folded =
                !!collapsed[key] && !query.trim() && category === 'all';
              return (
                <section className="klm-apps-stall" key={key}>
                  <KilimBand
                    pattern={[['teeth', AWNINGS[index % AWNINGS.length]]]}
                    className="klm-apps-awning"
                  />
                  <div className="klm-apps-sign">
                    <button
                      type="button"
                      className="klm-apps-toggle"
                      onClick={() =>
                        setCollapsed((old) => ({ ...old, [key]: !old[key] }))
                      }
                      aria-expanded={!folded}
                      aria-label={value.name}
                      disabled={!!query.trim() || category !== 'all'}
                    >
                      <KilimIcon
                        name={folded ? 'caretRight' : 'caretDown'}
                        fg={WOOL.saffron}
                      />
                      <KilimText as="h2" text={value.name} maxLines={2} />
                    </button>
                    <span className="klm-label">
                      {matches.length} instruments
                    </span>
                  </div>
                  {!folded && (
                    <ul className="klm-apps-rack">
                      {matches.map((app) => (
                        <AppTag key={app.slug} app={app} />
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </>
        )}
      </div>
      <KilimBand pattern="chain" className="mt-6" />
    </div>
  );
};

export default KilimAppsPage;
