import React, { useEffect, useMemo, useState } from 'react';
import {
  UsersThreeIcon,
  UserFocusIcon,
  MapPinIcon,
} from '@phosphor-icons/react';
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
import { useCharacters } from '../../hooks/useStoriesData';

const SnfPersonnelPage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { data: characters, loading } = useCharacters();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'PERSONNEL' }]);
  }, [setBreadcrumbs]);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return (characters || []).filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.role?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term),
    );
  }, [characters, query]);

  return (
    <SnfLayout>
      <Seo
        title="Personnel | Serfs and Frauds Terminal"
        description="Persons of interest catalogued from the From Serfs and Frauds anthology."
        keywords={['serfs and frauds', 'characters', 'personnel']}
      />
      <SnfPageHeader
        fileNo="002"
        label="PERSONS OF INTEREST"
        title={language === 'tr' ? 'PERSONEL' : 'PERSONNEL'}
        subtitle={
          language === 'tr'
            ? 'Bilinen kişiler. Kimseye güvenme.'
            : 'Known persons of interest. Trust no one.'
        }
        icon={<UsersThreeIcon size={40} weight="duotone" />}
      />

      <div className="max-w-xl mb-10">
        <SnfSearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            language === 'tr' ? 'kişi ara…' : 'query by name / role / note…'
          }
        />
      </div>

      {loading && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          loading personnel files…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <SnfReveal key={`${c.name}-${i}`} delay={Math.min(i * 0.04, 0.3)}>
            <button
              type="button"
              onClick={() => setActive(c)}
              className="snf-panel snf-panel-bracket text-left w-full h-full p-5 flex flex-col hover:border-[rgba(var(--snf-phos-rgb),0.5)] transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="snf-mono text-[10px] tracking-[0.2em] snf-dim">
                  PSN-{String(i + 1).padStart(2, '0')}
                </span>
                <SnfPill status={c.status} />
              </div>
              <UserFocusIcon
                size={30}
                weight="duotone"
                className="snf-phos-text snf-glow-soft mb-3"
              />
              <div className="snf-display text-lg font-bold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors leading-tight">
                {c.name}
              </div>
              <div className="snf-mono text-[10px] tracking-[0.16em] snf-phos-text mt-1 mb-3">
                {c.role}
              </div>
              <p className="snf-mono text-[11px] snf-dim leading-relaxed line-clamp-3 flex-grow">
                {c.description}
              </p>
              <span className="snf-mono text-[9px] uppercase tracking-[0.3em] snf-dim group-hover:text-[var(--snf-phos)] transition-colors mt-4">
                {language === 'tr' ? 'DOSYAYI AÇ ▸' : 'OPEN FILE ▸'}
              </span>
            </button>
          </SnfReveal>
        ))}
        {!loading && filtered.length === 0 && (
          <SnfEmpty>
            {language === 'tr' ? 'Eşleşen kişi yok.' : 'No personnel matched.'}
          </SnfEmpty>
        )}
      </div>

      <SnfModal
        open={!!active}
        onClose={() => setActive(null)}
        kicker={active ? `PERSONNEL FILE :: ${active.name}` : ''}
      >
        {active && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="snf-display snf-glow text-3xl md:text-4xl font-bold uppercase leading-none text-[var(--snf-phos)]">
                {active.name}
              </h2>
              <SnfPill status={active.status} />
            </div>
            <div className="snf-mono text-[11px] tracking-[0.16em] snf-phos-text mb-5">
              {active.role}
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
                <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mb-1 flex items-center gap-1.5">
                  <MapPinIcon size={11} weight="fill" /> FIRST SIGHTED
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

export default SnfPersonnelPage;
