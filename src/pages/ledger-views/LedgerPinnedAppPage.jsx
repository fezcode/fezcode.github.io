import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerStamp,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * One pinned instrument, filed on its own card: pin rank and route on the
 * head line, the name and annotation beneath, a dotted leader out to the
 * open mark. The whole card inverts on hover.
 */
const PinnedCard = ({ app, index }) => (
  <li className="ldg-card">
    <Link to={app.to} className="ldg-card-link h-full flex flex-col gap-3">
      <span className="flex items-baseline justify-between gap-3">
        <span className="ldg-eyebrow">
          PIN NO. {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="ldg-muted truncate"
          style={{ fontSize: '0.72rem', letterSpacing: '1px' }}
        >
          {app.to}
        </span>
      </span>
      <span
        className="font-bold uppercase ldg-highlight"
        style={{ fontSize: '1rem', letterSpacing: '1px' }}
      >
        {app.title}
      </span>
      {(app.kicker || app.tagline) && (
        <span className="ldg-accent" style={{ fontSize: '0.8rem' }}>
          {app.kicker || app.tagline}
        </span>
      )}
      {app.description && (
        <span className="ldg-muted" style={{ fontSize: '0.8rem' }}>
          {app.description}
        </span>
      )}
      <span className="ldg-leader-row mt-auto pt-2">
        <span className="ldg-label">OPEN</span>
        <span className="ldg-leader" aria-hidden="true" />
        <span className="ldg-accent font-bold" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  </li>
);

/**
 * The pinned kit — instruments kept within reach, ordered by pin rank.
 * Pins come from `pinned_order` in /apps/apps.json; the register here only
 * reads them.
 */
const LedgerPinnedAppPage = () => {
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/apps/apps.json');
        if (!res.ok) return;
        const data = await res.json();
        const all = Object.values(data).flatMap((cat) =>
          cat.apps.map((app) => ({ ...app, categoryName: cat.name })),
        );
        const list = all
          .filter((a) => a.pinned_order)
          .sort((a, b) => a.pinned_order - b.pinned_order);
        if (!cancelled) setPinned(list);
      } catch (e) {
        // swallowed — the empty notice below covers it
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ldg-root">
      <div className="ldg-page">
        <Seo
          title="Kit | Fezcodex"
          description="The pinned kit — instruments kept within reach, ordered by pin rank."
        />

        <LedgerFolio
          folio="FOLIO NO. 05 — PINNED KIT"
          title="THE KIT"
          sub="KEPT WITHIN REACH, ORDERED BY PIN RANK"
          aside={<LedgerStamp>KEPT CLOSE</LedgerStamp>}
        >
          <p className="ldg-stats mt-3">
            <span>
              <strong>{String(pinned.length).padStart(2, '0')}</strong> PINNED
            </span>
            <span>
              FULL REGISTER AT <strong>/APPS</strong>
            </span>
          </p>
        </LedgerFolio>

        {loading && <LedgerNotice>READING THE PINS…</LedgerNotice>}

        {!loading && pinned.length === 0 && (
          <LedgerNotice>
            NOTHING PINNED YET —{' '}
            <Link to="/apps" className="ldg-btn ldg-btn-accent">
              OPEN THE FULL REGISTER
            </Link>
          </LedgerNotice>
        )}

        {!loading && pinned.length > 0 && (
          <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinned.map((app, i) => (
              <PinnedCard key={app.slug} app={app} index={i} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LedgerPinnedAppPage;
