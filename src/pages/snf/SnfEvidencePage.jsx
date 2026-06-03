import React, { useEffect, useMemo, useState } from 'react';
import {
  ToolboxIcon,
  FlaskIcon,
  PackageIcon,
  FingerprintIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import {
  SnfPageHeader,
  SnfSearchInput,
  SnfReveal,
  SnfEmpty,
  SnfModal,
} from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { useItems } from '../../hooks/useStoriesData';

const iconFor = (type = '') =>
  type.toLowerCase().includes('potion') || type.toLowerCase().includes('poison')
    ? FlaskIcon
    : PackageIcon;

const SnfEvidencePage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { data: items, loading } = useItems();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'EVIDENCE' }]);
  }, [setBreadcrumbs]);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return (items || []).filter(
      (it) =>
        it.name?.toLowerCase().includes(term) ||
        it.type?.toLowerCase().includes(term) ||
        it.description?.toLowerCase().includes(term),
    );
  }, [items, query]);

  return (
    <SnfLayout>
      <Seo
        title="Evidence | Serfs and Frauds Terminal"
        description="Recovered assets and artifacts from the From Serfs and Frauds anthology."
        keywords={['serfs and frauds', 'items', 'evidence', 'artifacts']}
      />
      <SnfPageHeader
        fileNo="004"
        label="RECOVERED ASSETS"
        title={language === 'tr' ? 'KANIT' : 'EVIDENCE'}
        subtitle={
          language === 'tr'
            ? 'Ele geçirilen varlıklar ve işaretli eserler.'
            : 'Recovered assets and flagged artifacts.'
        }
        icon={<ToolboxIcon size={40} weight="duotone" />}
      />

      <div className="max-w-xl mb-10">
        <SnfSearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            language === 'tr' ? 'eser ara…' : 'query by name / type / note…'
          }
        />
      </div>

      {loading && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          cataloguing evidence…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((it, i) => {
          const Icon = iconFor(it.type);
          return (
            <SnfReveal key={`${it.name}-${i}`} delay={Math.min(i * 0.04, 0.3)}>
              <button
                type="button"
                onClick={() => setActive(it)}
                className="snf-panel snf-panel-bracket text-left w-full h-full p-5 flex flex-col hover:border-[rgba(var(--snf-phos-rgb),0.5)] transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="snf-mono text-[10px] tracking-[0.16em] snf-phos-text">
                    EVD-{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="snf-mono text-[9px] tracking-[0.16em] snf-dim uppercase">
                    {it.type}
                  </span>
                </div>

                {it.image ? (
                  <div className="relative mb-4 border border-[var(--snf-line)] overflow-hidden bg-black/40">
                    <img
                      src={it.image}
                      alt={it.name}
                      loading="lazy"
                      className="w-full h-36 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                    />
                    <span className="absolute top-1.5 left-1.5 snf-mono text-[8px] tracking-[0.2em] snf-phos-text bg-black/70 px-1.5 py-0.5">
                      ◉ REC
                    </span>
                  </div>
                ) : (
                  <div className="mb-4 h-36 border border-[var(--snf-line)] flex items-center justify-center bg-black/30">
                    <Icon
                      size={42}
                      weight="duotone"
                      className="snf-phos-text snf-glow-soft opacity-70"
                    />
                  </div>
                )}

                <div className="snf-display text-lg font-bold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors leading-tight mb-2">
                  {it.name}
                </div>
                <p className="snf-mono text-[11px] snf-dim leading-relaxed line-clamp-2 flex-grow">
                  {it.description}
                </p>
                <span className="snf-mono text-[9px] uppercase tracking-[0.3em] snf-dim group-hover:text-[var(--snf-phos)] transition-colors mt-4 flex items-center gap-1.5">
                  <FingerprintIcon size={12} weight="bold" />
                  {language === 'tr' ? 'İNCELE ▸' : 'INSPECT ▸'}
                </span>
              </button>
            </SnfReveal>
          );
        })}
        {!loading && filtered.length === 0 && (
          <SnfEmpty>
            {language === 'tr' ? 'Kanıt bulunamadı.' : 'No evidence on file.'}
          </SnfEmpty>
        )}
      </div>

      <SnfModal
        open={!!active}
        onClose={() => setActive(null)}
        kicker={active ? `EVIDENCE :: ${active.name}` : ''}
      >
        {active && (
          <div>
            <div className="snf-mono text-[10px] tracking-[0.2em] snf-phos-text mb-2 uppercase">
              {active.type}
            </div>
            <h2 className="snf-display snf-glow text-3xl md:text-4xl font-bold uppercase leading-none text-[var(--snf-phos)] mb-5">
              {active.name}
            </h2>
            {active.image && (
              <div className="mb-6 border border-[var(--snf-line)] bg-black/40">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-auto object-contain"
                  style={{ filter: 'saturate(0.9) contrast(1.05)' }}
                />
              </div>
            )}
            <p className="snf-serif text-base md:text-lg text-[var(--snf-ink)] leading-relaxed mb-6">
              {active.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="snf-panel p-3">
                <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mb-1">
                  CUSTODY
                </div>
                <div className="snf-display text-[var(--snf-phos)] font-bold">
                  {active.owner}
                </div>
              </div>
              <div className="snf-panel p-3">
                <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mb-1">
                  RECOVERED FROM
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

export default SnfEvidencePage;
