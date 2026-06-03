import React, { useEffect, useMemo, useState } from 'react';
import { MapTrifoldIcon, MapPinIcon, CrosshairIcon } from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import {
  SnfPageHeader,
  SnfSearchInput,
  SnfReveal,
  SnfEmpty,
  SnfPill,
  SnfModal,
} from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { usePlaces } from '../../hooks/useStoriesData';

const SnfSitesPage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { data: places, loading } = usePlaces();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'SITES' }]);
  }, [setBreadcrumbs]);

  const grouped = useMemo(() => {
    const term = query.toLowerCase();
    const filtered = (places || []).filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.type?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
    );
    const map = filtered.reduce((acc, p) => {
      const cat = p.category || 'UNCHARTED';
      (acc[cat] = acc[cat] || []).push(p);
      return acc;
    }, {});
    return Object.keys(map)
      .sort()
      .map((cat) => ({ cat, items: map[cat] }));
  }, [places, query]);

  const total = grouped.reduce((n, g) => n + g.items.length, 0);

  return (
    <SnfLayout>
      <Seo
        title="Sites | Serfs and Frauds Terminal"
        description="Mapped locations from the From Serfs and Frauds anthology."
        keywords={['serfs and frauds', 'places', 'sites', 'locations']}
      />
      <SnfPageHeader
        fileNo="003"
        label="MAPPED LOCATIONS"
        title={language === 'tr' ? 'BÖLGELER' : 'SITES'}
        subtitle={
          language === 'tr'
            ? 'Bölge genelinde işaretli konumlar.'
            : 'Pinned locations across the territory.'
        }
        icon={<MapTrifoldIcon size={40} weight="duotone" />}
      />

      <div className="max-w-xl mb-10">
        <SnfSearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            language === 'tr' ? 'konum ara…' : 'query by name / type / note…'
          }
        />
      </div>

      {loading && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          triangulating sites…
        </div>
      )}

      <div className="space-y-12">
        {grouped.map((group) => (
          <section key={group.cat}>
            <div className="flex items-center gap-3 mb-5">
              <CrosshairIcon
                size={18}
                weight="bold"
                className="snf-phos-text flex-none"
              />
              <h2 className="snf-display text-lg md:text-xl font-bold uppercase tracking-wide text-[var(--snf-ink)]">
                {group.cat}
              </h2>
              <span className="snf-mono text-[10px] snf-dim tabular-nums">
                [{String(group.items.length).padStart(2, '0')}]
              </span>
              <span className="snf-divider flex-grow" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((p, i) => (
                <SnfReveal key={`${p.name}-${i}`} delay={Math.min(i * 0.04, 0.25)}>
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    className="snf-panel snf-panel-bracket text-left w-full h-full p-5 flex flex-col hover:border-[rgba(var(--snf-phos-rgb),0.5)] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="snf-mono text-[10px] tracking-[0.16em] snf-phos-text flex items-center gap-1.5">
                        <MapPinIcon size={12} weight="fill" /> {p.type}
                      </span>
                      <SnfPill status={p.status} />
                    </div>
                    <div className="snf-display text-lg font-bold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors leading-tight mb-3">
                      {p.name}
                    </div>
                    <p className="snf-mono text-[11px] snf-dim leading-relaxed line-clamp-3 flex-grow">
                      {p.description}
                    </p>
                    <span className="snf-mono text-[9px] uppercase tracking-[0.3em] snf-dim group-hover:text-[var(--snf-phos)] transition-colors mt-4">
                      {language === 'tr' ? 'KONUMU AÇ ▸' : 'OPEN SITE ▸'}
                    </span>
                  </button>
                </SnfReveal>
              ))}
            </div>
          </section>
        ))}
        {!loading && total === 0 && (
          <SnfEmpty>
            {language === 'tr' ? 'Konum bulunamadı.' : 'No sites located.'}
          </SnfEmpty>
        )}
      </div>

      <SnfModal
        open={!!active}
        onClose={() => setActive(null)}
        kicker={active ? `SITE :: ${active.name}` : ''}
      >
        {active && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="snf-display snf-glow text-3xl md:text-4xl font-bold uppercase leading-none text-[var(--snf-phos)]">
                {active.name}
              </h2>
              <SnfPill status={active.status} />
            </div>
            <div className="snf-mono text-[11px] tracking-[0.16em] snf-phos-text mb-5 flex items-center gap-1.5">
              <MapPinIcon size={12} weight="fill" /> {active.type} ·{' '}
              {active.category}
            </div>
            <div className="snf-divider mb-5" />
            <p className="snf-serif text-base md:text-lg text-[var(--snf-ink)] leading-relaxed mb-6">
              {active.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="snf-panel p-3">
                <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mb-1">
                  STATUS
                </div>
                <div className="snf-display text-[var(--snf-phos)] font-bold">
                  {active.status}
                </div>
              </div>
              <div className="snf-panel p-3">
                <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mb-1">
                  FIRST LOGGED
                </div>
                <div className="snf-mono text-sm text-[var(--snf-ink)]">
                  {active.book}
                </div>
              </div>
            </div>
          </div>
        )}
      </SnfModal>
    </SnfLayout>
  );
};

export default SnfSitesPage;
