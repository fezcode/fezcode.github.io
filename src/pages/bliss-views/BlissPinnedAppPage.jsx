import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PushPinIcon, ShapesIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import {
  BlissWindow,
  BlissNotice,
  BlissAppCard,
  BlissTitleLink,
} from '../../components/bliss';
import '../../styles/Bliss.css';

const BlissPinnedAppPage = () => {
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

  const count = `${String(pinned.length).padStart(2, '0')} pinned`;

  return (
    <div className="bl-root">
      <Seo
        title="Kit | Fezcodex"
        description="The pinned kit — instruments kept within reach, ordered by pin rank."
      />
      <div className="bl-page">
        <BlissWindow
          title="Pinned kit"
          icon={PushPinIcon}
          tone="red"
          headingLevel={null}
        >
          <div className="py-2 sm:py-3">
            <p className="bl-eyebrow m-0">Pinned kit · kept close</p>
            <h1 className="bl-display mt-2">The kit</h1>
            <p className="mt-4 mb-0 max-w-2xl text-lg leading-relaxed">
              Instruments kept within reach, ordered by pin rank. The full
              collection lives at /apps.
            </p>
            <p className="bl-label mt-5 mb-0">{count}</p>
          </div>
        </BlissWindow>
        <BlissWindow
          title="Within reach"
          icon={ShapesIcon}
          tone="orange"
          actions={
            <BlissTitleLink to="/apps" aria-label="Full collection">
              Full collection →
            </BlissTitleLink>
          }
          status={
            !loading ? (
              <>
                <span>{pinned.length} objects</span>
                <span>Ordered by pin rank</span>
              </>
            ) : undefined
          }
        >
          {loading && <BlissNotice>Reading the pins…</BlissNotice>}
          {!loading && pinned.length === 0 && (
            <BlissNotice>
              Nothing pinned yet —{' '}
              <Link to="/apps" className="bl-link">
                open the full collection
              </Link>
            </BlissNotice>
          )}
          {!loading && pinned.length > 0 && (
            <ul className="bl-grid m-0 p-0">
              {pinned.map((app, i) => (
                <BlissAppCard
                  key={app.slug}
                  as="li"
                  app={app}
                  eyebrow={`Pin no. ${String(i + 1).padStart(2, '0')}`}
                  meta={`Open ${app.to} →`}
                />
              ))}
            </ul>
          )}
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissPinnedAppPage;
