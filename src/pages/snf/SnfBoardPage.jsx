import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PushPinIcon,
  UserFocusIcon,
  MapPinIcon,
  PackageIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import { SnfPageHeader, SnfPanel } from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import {
  useCharacters,
  usePlaces,
  useItems,
  useBooks,
} from '../../hooks/useStoriesData';

const TYPE_META = {
  personnel: { color: 'var(--snf-phos)', Icon: UserFocusIcon, label: 'PERSONNEL' },
  site: { color: '#7fc7ff', Icon: MapPinIcon, label: 'SITE' },
  evidence: { color: 'var(--snf-alert)', Icon: PackageIcon, label: 'EVIDENCE' },
};

const R_PCT = 36; // node ring radius as % of half-board

const SnfBoardPage = () => {
  const { language, setBreadcrumbs, prefersReducedMotion } = useSnf();
  const { data: characters } = useCharacters();
  const { data: places } = usePlaces();
  const { data: items } = useItems();
  const { data: books } = useBooks(language);

  const [activeCase, setActiveCase] = useState(null);
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'CASE BOARD' }]);
  }, [setBreadcrumbs]);

  const cases = useMemo(() => {
    const map = new Map();
    const add = (type, list) =>
      (list || []).forEach((e) => {
        const key = e.book || 'UNFILED';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push({ ...e, type });
      });
    add('personnel', characters);
    add('site', places);
    add('evidence', items);
    return [...map.entries()]
      .map(([name, nodes]) => ({ name, nodes }))
      .sort((a, b) => b.nodes.length - a.nodes.length);
  }, [characters, places, items]);

  useEffect(() => {
    if (!activeCase && cases.length) setActiveCase(cases[0].name);
  }, [cases, activeCase]);

  const current = cases.find((c) => c.name === activeCase) || cases[0];

  const dossierLink = useMemo(() => {
    if (!current || !books) return null;
    for (const b of books) {
      const ep = (b.episodes || []).find((e) => e.title === current.name);
      if (ep) return `/snf/archive/${b.bookId}/${ep.id}`;
    }
    return null;
  }, [current, books]);

  const nodes = current?.nodes || [];
  const positioned = nodes.map((n, i) => {
    const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      ...n,
      i,
      xPct: 50 + cos * R_PCT,
      yPct: 50 + sin * R_PCT,
      lx: 500 + cos * R_PCT * 10,
      ly: 500 + sin * R_PCT * 10,
      right: cos >= -0.15,
    };
  });

  return (
    <SnfLayout>
      <Seo
        title="Case Board | Serfs and Frauds Terminal"
        description="Trace the connections between people, places and evidence across From Serfs and Frauds."
        keywords={['serfs and frauds', 'case board', 'connections']}
      />
      <SnfPageHeader
        fileNo="006"
        label="LINK ANALYSIS"
        title={language === 'tr' ? 'KANIT PANOSU' : 'CASE BOARD'}
        subtitle={
          language === 'tr'
            ? 'Bir vaka seçin; kişiler, bölgeler ve kanıtlar arasındaki ipleri izleyin.'
            : 'Pick a case; trace the strings between people, sites and evidence.'
        }
        icon={<PushPinIcon size={40} weight="duotone" />}
      />

      {/* Case selector */}
      <div className="flex items-center gap-3 mb-3">
        <span className="snf-vt snf-phos-text text-base flex-none">CASES</span>
        <span className="snf-divider flex-grow" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {cases.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => {
              setActiveCase(c.name);
              setFocus(null);
            }}
            className={`flex-none snf-mono text-[11px] uppercase tracking-[0.1em] px-3 py-2 border transition-colors ${
              c.name === activeCase
                ? 'border-[rgba(var(--snf-phos-rgb),0.6)] text-[var(--snf-phos)] bg-[rgba(var(--snf-phos-rgb),0.08)]'
                : 'border-[var(--snf-line)] snf-dim hover:text-[var(--snf-phos)]'
            }`}
          >
            {c.name}{' '}
            <span className="snf-dim">[{String(c.nodes.length).padStart(2, '0')}]</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <SnfPanel bracket className="relative p-3 md:p-6 overflow-hidden">
          <div className="snf-mono text-[10px] tracking-[0.2em] snf-dim mb-2 flex items-center gap-2">
            <span className="snf-rec" />{' '}
            {language === 'tr' ? 'BAĞLANTI HARİTASI' : 'CONNECTION MAP'}
          </div>

          {/* Square board: SVG strings behind, HTML nodes on top */}
          <div className="relative w-full max-w-[560px] mx-auto aspect-square">
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {positioned.map((n) => {
                const mx = (500 + n.lx) / 2 + (n.ly - 500) * 0.1;
                const my = (500 + n.ly) / 2 + (500 - n.lx) * 0.1;
                const dim = focus !== null && focus !== n.i;
                return (
                  <motion.path
                    key={`s-${n.i}`}
                    d={`M 500 500 Q ${mx} ${my} ${n.lx} ${n.ly}`}
                    fill="none"
                    stroke="var(--snf-alert)"
                    strokeWidth={dim ? 1.5 : 2.5}
                    opacity={dim ? 0.15 : 0.55}
                    initial={
                      prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }
                    }
                    animate={{ pathLength: 1, opacity: dim ? 0.15 : 0.55 }}
                    transition={{ duration: 0.6, delay: n.i * 0.04 }}
                  />
                );
              })}
            </svg>

            {/* Centre case node */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-center bg-[#05080a] border-2 border-[var(--snf-phos)] snf-box-glow"
              style={{ left: '50%', top: '50%', width: '26%', height: '26%' }}
            >
              <span className="snf-display snf-glow text-[var(--snf-phos)] font-bold uppercase leading-tight text-[10px] sm:text-xs md:text-sm px-2">
                {current?.name}
              </span>
            </div>

            {/* Entity nodes (real HTML — readable + responsive) */}
            {positioned.map((n) => {
              const meta = TYPE_META[n.type];
              const focused = focus === n.i;
              const dim = focus !== null && !focused;
              return (
                <button
                  key={`n-${n.i}`}
                  type="button"
                  onMouseEnter={() => setFocus(n.i)}
                  onFocus={() => setFocus(n.i)}
                  onClick={() => setFocus(n.i)}
                  className={`absolute z-20 -translate-y-1/2 flex items-center gap-2 ${
                    n.right ? '' : 'flex-row-reverse -translate-x-full'
                  } ${dim ? 'opacity-40' : 'opacity-100'} transition-opacity`}
                  style={{ left: `${n.xPct}%`, top: `${n.yPct}%` }}
                >
                  <span
                    className="flex-none rounded-full border-2 border-[#05080a] transition-transform"
                    style={{
                      background: meta.color,
                      width: focused ? 16 : 12,
                      height: focused ? 16 : 12,
                      boxShadow: focused ? `0 0 12px ${meta.color}` : 'none',
                    }}
                  />
                  <span
                    className={`snf-mono text-[11px] md:text-xs leading-tight px-2 py-1 border bg-[#05080a]/90 max-w-[150px] truncate ${
                      n.right ? 'text-left' : 'text-right'
                    }`}
                    style={{
                      color: focused ? meta.color : 'var(--snf-ink)',
                      borderColor: focused ? meta.color : 'var(--snf-line)',
                    }}
                    title={n.name}
                  >
                    {n.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {Object.values(TYPE_META).map((m) => (
              <span
                key={m.label}
                className="flex items-center gap-1.5 snf-mono text-[10px] tracking-[0.16em] snf-dim"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
        </SnfPanel>

        {/* Detail / readout */}
        <div className="space-y-4">
          <SnfPanel bracket className="p-5 lg:sticky lg:top-4">
            {(() => {
              const node = positioned.find((n) => n.i === focus);
              if (!node) {
                return (
                  <div className="snf-mono text-xs snf-dim leading-relaxed">
                    <div className="snf-vt snf-phos-text text-base mb-3">
                      {language === 'tr' ? 'DÜĞÜM SEÇ' : 'SELECT A NODE'}
                    </div>
                    {language === 'tr'
                      ? 'İlişkiyi incelemek için panodaki bir noktanın üzerine gelin veya dokunun.'
                      : 'Hover or tap a pin on the board to inspect the connection.'}
                    <div className="mt-5 snf-divider" />
                    <div className="mt-4">
                      CASE :: <span className="text-[var(--snf-ink)]">{current?.name}</span>
                    </div>
                    <div>
                      NODES :: <span className="text-[var(--snf-ink)]">{nodes.length}</span>
                    </div>
                  </div>
                );
              }
              const meta = TYPE_META[node.type];
              const MetaIcon = meta.Icon;
              return (
                <div>
                  <div
                    className="flex items-center gap-2 snf-mono text-[10px] tracking-[0.2em] mb-3"
                    style={{ color: meta.color }}
                  >
                    <MetaIcon size={14} weight="fill" /> {meta.label}
                  </div>
                  <div className="snf-display text-xl font-bold uppercase leading-tight text-[var(--snf-ink)] mb-1">
                    {node.name}
                  </div>
                  {(node.role || node.type) && (
                    <div className="snf-mono text-[11px] snf-phos-text mb-3">
                      {node.role || node.type}
                    </div>
                  )}
                  <p className="snf-mono text-[11px] snf-dim leading-relaxed">
                    {node.description}
                  </p>
                  {node.status && (
                    <div className="mt-3 snf-mono text-[10px] snf-dim">
                      STATUS ::{' '}
                      <span className="text-[var(--snf-ink)]">{node.status}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </SnfPanel>

          {dossierLink && (
            <Link
              to={dossierLink}
              className="snf-row group flex items-center justify-between px-4 py-3.5 snf-mono text-[11px] uppercase tracking-[0.2em] text-[var(--snf-phos)]"
            >
              {language === 'tr' ? 'DOSYAYI AÇ' : 'OPEN DOSSIER'}
              <ArrowRightIcon size={14} weight="bold" className="snf-row-arrow" />
            </Link>
          )}
        </div>
      </div>
    </SnfLayout>
  );
};

export default SnfBoardPage;
