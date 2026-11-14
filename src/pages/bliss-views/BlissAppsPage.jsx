import React, { useState } from 'react';
import {
  CaretDownIcon,
  CaretRightIcon,
  FolderIcon,
  FolderOpenIcon,
  ShapesIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  BlissWindow,
  BlissNotice,
  BlissAppCard,
  toneFor,
  useBlissIndex,
  blissApps,
} from '../../components/bliss';
import '../../styles/Bliss.css';

const BlissAppsPage = () => {
  const { data, loading, error } = useBlissIndex('/apps/apps.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const apps = blissApps(data);
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
  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };
  const filtering = !!query.trim() || category !== 'all';

  return (
    <div className="bl-root">
      <Seo
        title="App collection | Fezcodex"
        description="Experiments to play with, tools to think with, and useful little things made along the way."
      />
      <div className="bl-page">
        <BlissWindow
          title="App collection"
          icon={ShapesIcon}
          tone="orange"
          headingLevel={null}
          status={
            !loading && !error ? (
              <>
                <span role="status">
                  {filtered.length} instruments
                  {query ? ` matching “${query}”` : ''}
                </span>
                <span>{categories.length} collections</span>
              </>
            ) : undefined
          }
        >
          <div className="py-2 sm:py-3">
            <p className="bl-eyebrow m-0">
              {loading
                ? 'The app collection'
                : `${apps.length} apps · ${categories.length} collections`}
            </p>
            <h1 className="bl-display mt-2">
              Small instruments. Endless rabbit holes.
            </h1>
            <p className="mt-4 mb-0 max-w-2xl text-lg leading-relaxed">
              Experiments to play with, tools to think with, and useful little
              things made along the way.
            </p>
            <div className="bl-groupbox mt-6">
              <span className="bl-groupbox-label">Find</span>
              <input
                type="search"
                aria-label="Search apps"
                className="bl-input max-w-2xl"
                placeholder="Find an instrument…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div
                className="flex flex-wrap gap-2 mt-4"
                role="group"
                aria-label="App categories"
              >
                <button
                  type="button"
                  className="bl-tag"
                  aria-pressed={category === 'all'}
                  onClick={() => setCategory('all')}
                >
                  All
                </button>
                {categories.map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    className="bl-tag"
                    aria-pressed={category === key}
                    onClick={() => setCategory(key)}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BlissWindow>

        {(loading || error || filtered.length === 0) && (
          <BlissWindow title="Workbench" icon={FolderOpenIcon} tone="blue">
            {loading ? (
              <BlissNotice>Laying out the workbench…</BlissNotice>
            ) : error ? (
              <BlissNotice error>
                The app collection could not be loaded.
              </BlissNotice>
            ) : (
              <BlissNotice>
                No instruments match this search.{' '}
                <button
                  type="button"
                  className="bl-link"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </BlissNotice>
            )}
          </BlissWindow>
        )}

        {!loading &&
          !error &&
          categories.map(([key, value]) => {
            const matches = filtered.filter((app) => app.categoryKey === key);
            if (!matches.length) return null;
            const folded = !!collapsed[key] && !filtering;
            return (
              <BlissWindow
                key={key}
                icon={folded ? FolderIcon : FolderOpenIcon}
                tone={toneFor(key)}
                flush={folded}
                title={
                  <button
                    type="button"
                    className="inline-flex gap-2 items-center max-w-full min-h-[32px] text-left bg-transparent border-0 p-0 text-inherit font-[inherit] cursor-pointer disabled:cursor-default"
                    onClick={() =>
                      setCollapsed((old) => ({ ...old, [key]: !old[key] }))
                    }
                    aria-expanded={!folded}
                    disabled={filtering}
                  >
                    {folded ? (
                      <CaretRightIcon
                        size={14}
                        weight="bold"
                        aria-hidden="true"
                      />
                    ) : (
                      <CaretDownIcon
                        size={14}
                        weight="bold"
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate">{value.name}</span>
                  </button>
                }
                actions={
                  <span className="shrink-0 font-normal text-[13px] whitespace-nowrap">
                    {matches.length} instruments
                  </span>
                }
              >
                {!folded && (
                  <div className="bl-grid">
                    {matches.map((app) => (
                      <BlissAppCard
                        key={app.slug}
                        app={app}
                        meta={`${app.pinned_order ? 'Pinned · ' : ''}${value.name}`}
                      />
                    ))}
                  </div>
                )}
              </BlissWindow>
            );
          })}
      </div>
    </div>
  );
};

export default BlissAppsPage;
