import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArchiveIcon,
  UsersThreeIcon,
  MapTrifoldIcon,
  ToolboxIcon,
  UserFocusIcon,
  PushPinIcon,
  GearSixIcon,
  ArrowRightIcon,
  FileTextIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import SnfDecryptText from '../../components/snf/SnfDecryptText';
import { SnfButton, SnfReveal } from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { useAchievements } from '../../context/AchievementContext';
import {
  useBooks,
  useCharacters,
  usePlaces,
  useItems,
  useAuthors,
} from '../../hooks/useStoriesData';

const SECTIONS = [
  {
    to: '/snf/archive',
    icon: ArchiveIcon,
    en: { title: 'THE ARCHIVE', desc: 'Case files & decrypted field reports.' },
    tr: { title: 'ARŞİV', desc: 'Dosyalar ve çözülmüş saha raporları.' },
    count: 'dossiers',
  },
  {
    to: '/snf/personnel',
    icon: UsersThreeIcon,
    en: { title: 'PERSONNEL', desc: 'Persons of interest. Trust no one.' },
    tr: { title: 'PERSONEL', desc: 'İlgi çeken kişiler. Kimseye güvenme.' },
    count: 'personnel',
  },
  {
    to: '/snf/sites',
    icon: MapTrifoldIcon,
    en: { title: 'SITES', desc: 'Mapped locations across the territory.' },
    tr: { title: 'BÖLGELER', desc: 'Bölge genelinde işaretli konumlar.' },
    count: 'sites',
  },
  {
    to: '/snf/evidence',
    icon: ToolboxIcon,
    en: { title: 'EVIDENCE', desc: 'Recovered assets & flagged artifacts.' },
    tr: { title: 'KANIT', desc: 'Ele geçirilen varlıklar ve eserler.' },
    count: 'evidence',
  },
  {
    to: '/snf/agents',
    icon: UserFocusIcon,
    en: { title: 'OPERATORS', desc: 'The scribes who filed these reports.' },
    tr: { title: 'AJANLAR', desc: 'Bu raporları yazan kâtipler.' },
    count: 'operators',
  },
  {
    to: '/snf/board',
    icon: PushPinIcon,
    en: { title: 'CASE BOARD', desc: 'Trace the strings between everything.' },
    tr: { title: 'KANIT PANOSU', desc: 'Her şey arasındaki ipleri izle.' },
    count: null,
  },
];

const SnfHubPage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { unlockAchievement } = useAchievements();
  const { data: books } = useBooks(language);
  const { data: characters } = useCharacters();
  const { data: places } = usePlaces();
  const { data: items } = useItems();
  const { data: authors } = useAuthors();

  useEffect(() => {
    setBreadcrumbs([]);
    unlockAchievement('story_explorer');
  }, [setBreadcrumbs, unlockAchievement]);

  const dossiers = useMemo(
    () => (books || []).reduce((n, b) => n + (b.episodes?.length || 0), 0),
    [books],
  );

  const counts = {
    dossiers,
    volumes: books?.length ?? null,
    personnel: characters?.length ?? null,
    sites: places?.length ?? null,
    evidence: items?.length ?? null,
    operators: authors?.length ?? null,
  };

  const latest = useMemo(() => {
    let best = null;
    (books || []).forEach((b) => {
      (b.episodes || []).forEach((ep) => {
        if (!best || (ep.date || '') > (best.ep.date || '')) {
          best = { book: b, ep };
        }
      });
    });
    return best;
  }, [books]);

  const fmt = (n) => (n == null ? '––' : String(n).padStart(2, '0'));
  const t = (item) => (language === 'tr' ? item.tr : item.en);

  return (
    <SnfLayout>
      <Seo
        title="From Serfs and Frauds | Archive Terminal"
        description="A retro-futuristic intelligence terminal for the neo-noir anthology From Serfs and Frauds."
        keywords={['fezcodex', 'serfs and frauds', 'snf', 'terminal', 'noir']}
      />

      {/* HERO */}
      <section className="relative mb-12 md:mb-16">
        <div className="snf-vt snf-phos-text text-lg md:text-xl mb-4 flex items-center gap-3">
          <span className="snf-led snf-led-blink" />
          BLACK_RAGNAROK // CLEARANCE LVL 20
        </div>

        <h1 className="snf-display snf-glow snf-aberrate text-[clamp(2.6rem,9vw,7rem)] font-bold uppercase leading-[0.86] text-[var(--snf-phos)]">
          <SnfDecryptText text="FROM SERFS" speedMs={26} as="span" />
          <br />
          <span className="text-[var(--snf-ink)]">
            <SnfDecryptText text="& FRAUDS" speedMs={26} as="span" />
          </span>
        </h1>

        <p className="snf-serif italic text-lg md:text-2xl snf-dim mt-6 max-w-2xl leading-relaxed">
          “Every serf has a story, and every fraud a hidden truth.”
          <span className="block snf-mono not-italic text-xs uppercase tracking-[0.3em] mt-3 snf-phos-text">
            — recovered transmission, source redacted
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <SnfButton to="/snf/archive" primary>
            <span className="flex items-center gap-2">
              {language === 'tr' ? 'ARŞİVE GİR' : 'ENTER ARCHIVE'}
              <ArrowRightIcon size={16} weight="bold" />
            </span>
          </SnfButton>
          <SnfButton to="/snf/settings">
            <span className="flex items-center gap-2">
              <GearSixIcon size={15} weight="bold" />
              {language === 'tr' ? 'YAPILANDIR' : 'CONFIGURE'}
            </span>
          </SnfButton>
          <Link
            to="/stories"
            className="snf-mono text-[10px] uppercase tracking-[0.25em] snf-dim hover:text-[var(--snf-phos)] transition-colors ml-1"
            title="The original medieval archive"
          >
            {'// legacy_archive'}
          </Link>
        </div>
      </section>

      {/* READOUT STRIP */}
      <SnfReveal className="mb-12">
        <div className="snf-panel snf-panel-bracket grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['VOLUMES', counts.volumes],
            ['DOSSIERS', counts.dossiers],
            ['PERSONNEL', counts.personnel],
            ['SITES', counts.sites],
            ['EVIDENCE', counts.evidence],
            ['OPERATORS', counts.operators],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`px-4 py-5 border-[var(--snf-line)] ${
                i % 2 === 0 ? 'border-r' : 'sm:border-r'
              } ${i < 3 ? 'border-b lg:border-b-0' : ''} border-r last:border-r-0`}
            >
              <div className="snf-display snf-glow text-3xl md:text-4xl font-bold text-[var(--snf-phos)] tabular-nums">
                {fmt(v)}
              </div>
              <div className="snf-mono text-[9px] tracking-[0.2em] snf-dim mt-1">
                {k}
              </div>
            </div>
          ))}
        </div>
      </SnfReveal>

      {/* DIRECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="snf-vt snf-phos-text text-lg">DIRECTORY</span>
            <span className="snf-divider flex-grow" />
            <span className="snf-mono text-[10px] snf-dim tracking-[0.2em]">
              SELECT_NODE
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <SnfReveal key={s.to} delay={i * 0.05}>
                  <Link
                    to={s.to}
                    className="snf-row group flex items-start gap-4 p-4 md:p-5 h-full"
                  >
                    <span className="snf-phos-text snf-glow-soft mt-0.5 flex-none">
                      <Icon size={28} weight="duotone" />
                    </span>
                    <span className="min-w-0 flex-grow">
                      <span className="flex items-center justify-between gap-2">
                        <span className="snf-display text-base md:text-lg font-semibold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors">
                          {t(s).title}
                        </span>
                        {s.count && (
                          <span className="snf-mono text-[10px] snf-dim tabular-nums">
                            [{fmt(counts[s.count])}]
                          </span>
                        )}
                      </span>
                      <span className="block snf-mono text-[11px] snf-dim leading-relaxed mt-1">
                        {t(s).desc}
                      </span>
                    </span>
                    <CaretRightIcon
                      size={16}
                      className="snf-row-arrow snf-dim mt-1 flex-none"
                      weight="bold"
                    />
                  </Link>
                </SnfReveal>
              );
            })}
          </div>
        </div>

        {/* LATEST INTERCEPT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="snf-vt snf-phos-text text-lg">LATEST</span>
            <span className="snf-divider flex-grow" />
          </div>
          {latest ? (
            <SnfReveal>
              <Link
                to={`/snf/archive/${latest.book.bookId}/${latest.ep.id}`}
                className="snf-panel snf-panel-bracket block p-5 group hover:border-[rgba(var(--snf-phos-rgb),0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 snf-mono text-[10px] tracking-[0.2em] snf-phos-text mb-4">
                  <FileTextIcon size={14} weight="bold" />
                  INCOMING DOSSIER
                  <span className="snf-rec ml-auto" />
                </div>
                <div className="snf-display text-xl md:text-2xl font-bold uppercase leading-tight text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors">
                  {latest.ep.title}
                </div>
                <div className="snf-mono text-[11px] snf-dim mt-3 space-y-1">
                  <div>SCRIBE :: {latest.ep.author}</div>
                  <div>FILED&nbsp; :: {latest.ep.date}</div>
                  <div className="truncate">VOL&nbsp;&nbsp;&nbsp; :: {latest.book.bookTitle}</div>
                </div>
                <div className="mt-5 snf-mono text-[10px] uppercase tracking-[0.3em] snf-phos-text flex items-center gap-2">
                  DECRYPT
                  <ArrowRightIcon
                    size={13}
                    weight="bold"
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            </SnfReveal>
          ) : (
            <div className="snf-panel p-5 snf-mono text-xs snf-dim">
              awaiting transmission…
            </div>
          )}
        </div>
      </div>
    </SnfLayout>
  );
};

export default SnfHubPage;
