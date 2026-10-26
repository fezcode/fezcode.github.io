import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KnitHero,
  KnitNotice,
  KnitAppCard,
  KnitText,
  YARN,
} from '../../components/knit';
import '../../styles/Knit.css';

const KnitPinnedAppPage = () => {
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
    <div className="knt-root">
      <Seo
        title="Kit | Fezcodex"
        description="The pinned kit — instruments kept within reach, ordered by pin rank."
      />
      <KnitHero
        eyebrow="Pinned kit · kept close"
        title="The kit"
        intro="Instruments kept within reach, ordered by pin rank. The full collection lives at /apps."
        wool="denim"
        motif="hearts"
      >
        <KnitText
          text={`${String(pinned.length).padStart(2, '0')} pinned`}
          size="small"
          fg={YARN.gold}
          className="mt-6"
        />
      </KnitHero>
      <div className="knt-page">
        {loading && <KnitNotice>Reading the pins…</KnitNotice>}
        {!loading && pinned.length === 0 && (
          <KnitNotice>
            Nothing pinned yet —{' '}
            <Link to="/apps" className="knt-link">
              open the full collection
            </Link>
          </KnitNotice>
        )}
        {!loading && pinned.length > 0 && (
          <ul className="knt-grid m-0 p-0">
            {pinned.map((app, i) => (
              <KnitAppCard
                key={app.slug}
                as="li"
                app={app}
                eyebrow={`Pin no. ${String(i + 1).padStart(2, '0')}`}
                meta={`Open ${app.to} →`}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default KnitPinnedAppPage;
