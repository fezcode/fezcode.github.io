import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KilimRug,
  KilimBand,
  KilimStripe,
  KilimBadge,
  KilimNotice,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-content.css';

const KilimPinnedAppPage = () => {
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
    <div className="klm-root">
      <Seo
        title="Kit | Fezcodex"
        description="The pinned kit — instruments kept within reach, ordered by pin rank."
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="Pinned kit · kept close"
          title="The kit"
          intro="Instruments kept within reach, ordered by pin rank. The full collection lives at /apps."
          seed="kit"
        >
          <span className="klm-kit-count">
            {String(pinned.length).padStart(2, '0')} pinned
          </span>
        </KilimRug>
      </div>
      <div className="klm-page">
        {loading && <KilimNotice>Reading the pins…</KilimNotice>}
        {!loading && pinned.length === 0 && (
          <KilimNotice>
            Nothing pinned yet —{' '}
            <Link to="/apps" className="klm-link">
              open the full collection
            </Link>
          </KilimNotice>
        )}
        {!loading && pinned.length > 0 && (
          <div className="klm-kit-runner">
            <KilimBand pattern={['end', 'chain']} />
            <ol className="klm-kit-list">
              {pinned.map((app, i) => (
                <li key={app.slug}>
                  {i > 0 && <KilimStripe />}
                  <Link to={app.to} className="klm-kit-knot">
                    <div className="klm-date">
                      <span>Pin</span>
                      <b>{String(i + 1).padStart(2, '0')}</b>
                    </div>
                    <KilimBadge seed={app.slug} size={15} />
                    <div className="min-w-0">
                      <h2 className="klm-row-title">{app.title}</h2>
                      <div className="klm-row-meta">
                        {app.kicker || app.tagline || app.categoryName}
                      </div>
                      {app.description && (
                        <p className="klm-kit-text">{app.description}</p>
                      )}
                    </div>
                    <span className="klm-row-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <KilimBand pattern={['chain', 'end']} />
          </div>
        )}
      </div>
    </div>
  );
};

export default KilimPinnedAppPage;
