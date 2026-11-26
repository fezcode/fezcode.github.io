import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  StudioFolio,
  StudioNotice,
  StudioStamp,
} from '../../components/studio';
import '../../styles/Studio.css';

const PinnedCard = ({ app, index }) => (
  <li className="std-card">
    <Link to={app.to} className="std-card-link h-full flex flex-col gap-3">
      <span className="flex items-baseline justify-between gap-3">
        <span className="std-eyebrow">
          PIN NO. {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="std-muted truncate"
          style={{ fontSize: '0.72rem', letterSpacing: '1px' }}
        >
          {app.to}
        </span>
      </span>
      <span
        className="font-bold uppercase std-highlight"
        style={{ fontSize: '1rem', letterSpacing: '1px' }}
      >
        {app.title}
      </span>
      {(app.kicker || app.tagline) && (
        <span className="std-accent" style={{ fontSize: '0.8rem' }}>
          {app.kicker || app.tagline}
        </span>
      )}
      {app.description && (
        <span className="std-muted" style={{ fontSize: '0.8rem' }}>
          {app.description}
        </span>
      )}
      <span className="std-leader-row mt-auto pt-2">
        <span className="std-label">OPEN</span>
        <span className="std-leader" aria-hidden="true" />
        <span className="std-accent font-bold" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  </li>
);

const StudioPinnedAppPage = () => {
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
    <div className="std-root">
      <div className="std-page">
        <Seo
          title="Kit | Fezcodex"
          description="The pinned kit — instruments kept within reach, ordered by pin rank."
        />

        <StudioFolio
          folio="FOLIO NO. 05 — PINNED KIT"
          title="THE KIT"
          sub="KEPT WITHIN REACH, ORDERED BY PIN RANK"
          aside={<StudioStamp>Kept close</StudioStamp>}
        >
          <p className="std-stats mt-3">
            <span>
              <strong>{String(pinned.length).padStart(2, '0')}</strong> PINNED
            </span>
            <span>
              FULL COLLECTION AT <strong>/APPS</strong>
            </span>
          </p>
        </StudioFolio>

        {loading && <StudioNotice>READING THE PINS…</StudioNotice>}

        {!loading && pinned.length === 0 && (
          <StudioNotice>
            NOTHING PINNED YET —{' '}
            <Link to="/apps" className="std-btn std-btn-accent">
              OPEN THE FULL COLLECTION
            </Link>
          </StudioNotice>
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

export default StudioPinnedAppPage;
