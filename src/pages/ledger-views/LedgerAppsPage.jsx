import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
  LedgerStamp,
} from '../../components/ledger';
import '../../styles/Ledger.css';

const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 45;

const matchesQuery = (app, categoryName, q) => {
  if (!q) return true;
  const n = q.toLowerCase();
  return (
    (app.title || '').toLowerCase().includes(n) ||
    (app.description || '').toLowerCase().includes(n) ||
    (app.slug || '').toLowerCase().includes(n) ||
    (categoryName || '').toLowerCase().includes(n)
  );
};

/**
 * One instrument, entered on its ruled line: serial, name, annotation,
 * dotted leader out to its route. The whole line inverts on hover — the
 * archive's handshake.
 */
const InstrumentRow = ({ app, serial, categoryName }) => {
  const isNew =
    app.created_at &&
    Date.now() - new Date(app.created_at).getTime() < NEW_WINDOW_MS;

  return (
    <li>
      <Link to={app.to} className="ldg-row-link">
        <span className="ldg-rank shrink-0">
          {String(serial).padStart(3, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-3 flex-wrap">
            <span className="font-bold ldg-highlight">{app.title}</span>
            {app.pinned_order && <span className="ldg-badge">PINNED</span>}
            {isNew && <span className="ldg-badge">NEW</span>}
          </span>
          {app.description && (
            <span
              className="block ldg-muted normal-case"
              style={{ fontSize: '0.78rem', letterSpacing: 0 }}
            >
              {app.description}
            </span>
          )}
        </span>
        <span className="ldg-leader hidden md:block" aria-hidden="true" />
        <span className="ldg-muted hidden md:inline" style={{ fontSize: '0.74rem' }}>
          {categoryName}
        </span>
        <span className="ldg-accent font-bold" aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
};

/**
 * A section of the instruments register: numbered head-rule, the count of
 * filed entries, and a fold control whose state persists between visits.
 */
const CategorySection = ({
  categoryKey,
  category,
  sectionIndex,
  serialStart,
  isCollapsed,
  onToggle,
  query,
}) => {
  const apps = category.apps || [];
  const kept = apps.filter((app) => matchesQuery(app, category.name, query));

  return (
    <section id={`section-${categoryKey}`} className="mb-8">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        className="ldg-leader-row w-full bg-transparent border-0 p-0 text-left cursor-pointer font-bold uppercase"
        style={{
          fontFamily: 'inherit',
          fontSize: '0.76rem',
          letterSpacing: '1.5px',
          color: 'var(--ldg-accent)',
        }}
      >
        <span
          aria-hidden="true"
          className="inline-block"
          style={{
            transform: isCollapsed ? 'none' : 'rotate(90deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          ▸
        </span>
        <span>
          SECTION {String(sectionIndex + 1).padStart(2, '0')} — {category.name}
        </span>
        <span className="ldg-leader" aria-hidden="true" />
        <span className="ldg-rank">
          {String(apps.length).padStart(2, '0')} FILED
        </span>
      </button>
      {category.description && !isCollapsed && (
        <p
          className="ldg-muted mt-1 mb-2"
          style={{ fontSize: '0.78rem', maxWidth: '68ch' }}
        >
          {category.description}
        </p>
      )}
      {!isCollapsed && (
        <>
          <LedgerRule className="mt-2 mb-1" />
          <ul className="list-none m-0 p-0 flex flex-col gap-px">
            {kept.map((app) => (
              <InstrumentRow
                key={app.slug}
                app={app}
                serial={serialStart + apps.indexOf(app)}
                categoryName={category.name}
              />
            ))}
          </ul>
        </>
      )}
      {isCollapsed && (
        <p className="ldg-label mt-1 mb-0" style={{ paddingLeft: '1.5rem' }}>
          {apps.length} {apps.length === 1 ? 'ENTRY' : 'ENTRIES'} FOLDED AWAY
        </p>
      )}
    </section>
  );
};

/**
 * The instruments register — every app in the codex, filed by section,
 * serially numbered across the whole book. Search narrows the register;
 * sections fold and stay folded between visits.
 */
const LedgerAppsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/apps/apps.json');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setGrouped(data);
          setCollapsed((prev) => {
            const next = { ...prev };
            Object.keys(data).forEach((k) => {
              if (next[k] === undefined) next[k] = false;
            });
            return next;
          });
        }
      } catch (e) {
        // swallowed — the empty register reads as its own notice below
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setCollapsed]);

  const orderedCategoryKeys = useMemo(
    () =>
      Object.keys(grouped).sort(
        (a, b) => (grouped[a]?.order || 0) - (grouped[b]?.order || 0),
      ),
    [grouped],
  );

  const allApps = useMemo(() => {
    const out = [];
    orderedCategoryKeys.forEach((k) => {
      (grouped[k].apps || []).forEach((app) => {
        out.push({ ...app, categoryKey: k, categoryName: grouped[k].name });
      });
    });
    return out;
  }, [grouped, orderedCategoryKeys]);

  const total = allApps.length;
  const pinnedCount = allApps.filter((a) => a.pinned_order).length;

  const visibleKeys = useMemo(() => {
    if (!query) return orderedCategoryKeys;
    return orderedCategoryKeys.filter((k) =>
      (grouped[k].apps || []).some((app) =>
        matchesQuery(app, grouped[k].name, query),
      ),
    );
  }, [grouped, orderedCategoryKeys, query]);

  const matchCount = useMemo(() => {
    if (!query) return total;
    return allApps.filter((app) =>
      matchesQuery(app, app.categoryName, query),
    ).length;
  }, [allApps, query, total]);

  // running serial across the whole register
  const serialMap = useMemo(() => {
    let running = 1;
    const map = {};
    orderedCategoryKeys.forEach((k) => {
      map[k] = running;
      running += grouped[k].apps?.length || 0;
    });
    return map;
  }, [grouped, orderedCategoryKeys]);

  const setAll = (value) => {
    const next = {};
    Object.keys(grouped).forEach((k) => {
      next[k] = value;
    });
    setCollapsed(next);
  };

  const jumpTo = (k) => {
    setCollapsed((prev) => ({ ...prev, [k]: false }));
    requestAnimationFrame(() => {
      const el = document.getElementById(`section-${k}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="ldg-root">
      <div className="ldg-page">
        <Seo
          title="Instruments | Fezcodex"
          description="The instruments register — every app in the codex, filed by section, serially numbered, searchable."
        />

        <LedgerFolio
          folio="FOLIO NO. 06 — INSTRUMENTS"
          title="INSTRUMENTS"
          sub="SMALL USEFUL THINGS, FILED BY SECTION"
          aside={<LedgerStamp>IN SERVICE</LedgerStamp>}
        >
          <p className="ldg-stats mt-3">
            <span>
              <strong>{String(total).padStart(3, '0')}</strong> FILED
            </span>
            <span>
              <strong>{String(orderedCategoryKeys.length).padStart(2, '0')}</strong>{' '}
              SECTIONS
            </span>
            <span>
              <strong>{String(pinnedCount).padStart(2, '0')}</strong> PINNED
            </span>
          </p>
        </LedgerFolio>

        {/* controls */}
        <div className="flex flex-col gap-3 mb-2">
          <input
            className="ldg-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH THE REGISTER — NAME, NOTE, SECTION…"
            aria-label="Search instruments"
          />
          <div className="flex flex-wrap gap-2 items-baseline">
            <button type="button" className="ldg-chip" onClick={() => setAll(false)}>
              UNFOLD ALL
            </button>
            <button type="button" className="ldg-chip" onClick={() => setAll(true)}>
              FOLD ALL
            </button>
            <span className="ldg-label" aria-hidden="true">
              ·
            </span>
            {orderedCategoryKeys.map((k, idx) => (
              <button
                key={k}
                type="button"
                className="ldg-chip"
                onClick={() => jumpTo(k)}
                title={grouped[k].name}
              >
                {String(idx + 1).padStart(2, '0')} {grouped[k].name}{' '}
                <span className="ldg-rank">
                  {grouped[k].apps?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        <LedgerRule className="mb-4" />

        {query && (
          <p className="ldg-label mb-4">
            {String(matchCount).padStart(2, '0')}{' '}
            {matchCount === 1 ? 'ENTRY ANSWERS' : 'ENTRIES ANSWER'} “
            {query.toUpperCase()}”
          </p>
        )}

        {loading && <LedgerNotice>OPENING THE CABINET…</LedgerNotice>}

        {!loading && total === 0 && (
          <LedgerNotice error>COULD NOT READ /apps/apps.json</LedgerNotice>
        )}

        {!loading && total > 0 && visibleKeys.length === 0 && (
          <LedgerNotice>
            NO INSTRUMENT ANSWERS THAT NAME —{' '}
            <button
              type="button"
              onClick={() => setQuery('')}
              className="ldg-btn ldg-btn-accent"
            >
              CLEAR THE QUERY
            </button>
          </LedgerNotice>
        )}

        {!loading &&
          visibleKeys.map((k) => (
            <CategorySection
              key={k}
              categoryKey={k}
              category={grouped[k]}
              sectionIndex={orderedCategoryKeys.indexOf(k)}
              serialStart={serialMap[k] || 1}
              isCollapsed={!!collapsed[k] && !query}
              onToggle={() =>
                setCollapsed((prev) => ({ ...prev, [k]: !prev[k] }))
              }
              query={query}
            />
          ))}

        {/* recapitulation */}
        {!loading && !query && total > 0 && (
          <section className="mt-12">
            <LedgerRule label="RECAPITULATION" className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
              {orderedCategoryKeys.map((k, idx) => (
                <div key={k} className="ldg-leader-row">
                  <span className="ldg-rank">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="uppercase font-bold"
                    style={{ fontSize: '0.82rem', letterSpacing: '1px' }}
                  >
                    {grouped[k].name}
                  </span>
                  <span className="ldg-leader" aria-hidden="true" />
                  <span className="ldg-accent" style={{ fontSize: '0.82rem' }}>
                    {String(grouped[k].apps?.length || 0).padStart(2, '0')}
                  </span>
                </div>
              ))}
              <div className="ldg-leader-row">
                <span className="ldg-rank" aria-hidden="true">
                  ══
                </span>
                <span
                  className="uppercase font-bold ldg-highlight"
                  style={{ fontSize: '0.82rem', letterSpacing: '1px' }}
                >
                  CARRIED FORWARD
                </span>
                <span className="ldg-leader" aria-hidden="true" />
                <span
                  className="ldg-accent font-bold"
                  style={{ fontSize: '0.82rem' }}
                >
                  {String(total).padStart(3, '0')}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LedgerAppsPage;
