import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ListIcon,
  ShieldCheckIcon,
  UserFocusIcon,
  TextAaIcon,
  MinusIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import SnfDecryptText from '../../components/snf/SnfDecryptText';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { useBooks, useEpisodeText } from '../../hooks/useStoriesData';

const SIZES = ['sm', 'md', 'lg'];

const ManifestField = ({ label, value, accent, children }) => (
  <div className="bg-[var(--snf-panel)] px-4 py-3">
    <div className="snf-mono text-[9px] tracking-[0.22em] snf-dim mb-1">
      {label}
    </div>
    {children || (
      <div
        className={`snf-mono text-xs md:text-sm truncate ${
          accent ? 'text-[var(--snf-phos)]' : 'text-[var(--snf-ink)]'
        }`}
      >
        {value}
      </div>
    )}
  </div>
);

const SnfDossierPage = () => {
  const { bookId, episodeId } = useParams();
  const {
    language,
    setBreadcrumbs,
    settings,
    setSetting,
    prefersReducedMotion,
    scrollRef,
  } = useSnf();
  const { data: books } = useBooks(language);

  const book = useMemo(
    () => (books || []).find((b) => Number(b.bookId) === Number(bookId)),
    [books, bookId],
  );
  const epIndex = useMemo(
    () =>
      book ? book.episodes.findIndex((e) => Number(e.id) === Number(episodeId)) : -1,
    [book, episodeId],
  );
  const episode = epIndex >= 0 ? book.episodes[epIndex] : null;
  const prev = epIndex > 0 ? book.episodes[epIndex - 1] : null;
  const next =
    book && epIndex >= 0 && epIndex < book.episodes.length - 1
      ? book.episodes[epIndex + 1]
      : null;

  const { text, loading } = useEpisodeText(episode?.filename);
  const tr = language === 'tr';

  useEffect(() => {
    setBreadcrumbs(
      [
        { label: 'ARCHIVE', path: '/snf/archive' },
        book ? { label: book.bookTitle, path: `/snf/archive/${book.bookId}` } : null,
        episode ? { label: episode.title } : null,
      ].filter(Boolean),
    );
  }, [setBreadcrumbs, book, episode]);

  // brief "decrypting" flash before body reveals
  const [decrypting, setDecrypting] = useState(true);
  useEffect(() => {
    if (!settings.decrypt || prefersReducedMotion) {
      setDecrypting(false);
      return undefined;
    }
    setDecrypting(true);
    const t = setTimeout(() => setDecrypting(false), 650);
    return () => clearTimeout(t);
  }, [episode?.filename, settings.decrypt, prefersReducedMotion]);

  // reading progress (the terminal <main> scrolls, not the window)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 4 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, episode?.filename, text, decrypting, settings.readingFont, settings.textSize]);

  const cycleSize = (dir) => {
    const i = SIZES.indexOf(settings.textSize);
    const ni = Math.min(SIZES.length - 1, Math.max(0, i + dir));
    setSetting('textSize', SIZES[ni]);
  };

  return (
    <SnfLayout>
      <Seo
        title={`${episode?.title || 'Dossier'} | Serfs and Frauds Terminal`}
        description={`Decrypted field report: ${episode?.title || ''} from From Serfs and Frauds.`}
        keywords={['serfs and frauds', 'dossier', episode?.title]}
      />

      {!episode && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          locating dossier…
        </div>
      )}

      {episode && (
        <>
          {/* decryption / reading progress */}
          <div className="sticky top-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-2 bg-[var(--snf-bg)]/95 backdrop-blur-sm">
            <div className="flex items-center justify-between snf-mono text-[9px] tracking-[0.22em] snf-dim mb-1.5">
              <span className="snf-phos-text">
                {tr ? 'ŞİFRE ÇÖZÜMÜ' : 'DECRYPTION'}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="snf-progress-track">
              <div className="snf-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <article className="max-w-4xl mx-auto pt-6">
            {/* Manifest header */}
            <header className="mb-6">
              <div className="snf-vt snf-phos-text text-base md:text-lg mb-3 flex items-center gap-3">
                <UserFocusIcon size={16} weight="bold" />
                DOSSIER {String(book.bookId).padStart(2, '0')}.
                {String(episode.id).padStart(2, '0')}
                <span className="snf-divider flex-grow" />
                <span className="snf-dim">{episode.date}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="snf-display snf-glow snf-aberrate text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.95] text-[var(--snf-phos)]">
                  <SnfDecryptText text={episode.title} speedMs={20} />
                </h1>
                <span className="snf-stamp text-[10px] md:text-xs mt-2 hidden sm:block flex-none">
                  {tr ? 'GİZLİ' : 'CLASSIFIED'}
                </span>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--snf-line)] border border-[var(--snf-line)] mb-6">
              <ManifestField label={tr ? 'KÂTİP' : 'SCRIBE'} value={episode.author} accent />
              <ManifestField label={tr ? 'DOSYALANDI' : 'FILED'} value={episode.date} />
              <ManifestField
                label={tr ? 'REVİZE' : 'REVISED'}
                value={episode.updated || '—'}
              />
              <ManifestField label={tr ? 'YETKİ' : 'CLEARANCE'}>
                <div className="snf-mono text-xs md:text-sm text-[var(--snf-phos)] flex items-center gap-1.5">
                  <ShieldCheckIcon size={14} weight="fill" /> LVL 20
                </div>
              </ManifestField>
            </div>

            {/* Reading controls */}
            <div className="snf-panel flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 mb-6">
              <span className="snf-mono text-[10px] tracking-[0.2em] snf-dim flex items-center gap-2">
                <TextAaIcon size={15} weight="bold" /> RENDER
              </span>
              <div className="flex items-center gap-1">
                {[
                  ['terminal', tr ? 'TERMİNAL' : 'TERMINAL'],
                  ['document', tr ? 'BELGE' : 'DOCUMENT'],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSetting('readingFont', val)}
                    className={`snf-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 border transition-colors ${
                      settings.readingFont === val
                        ? 'border-[rgba(var(--snf-phos-rgb),0.6)] text-[var(--snf-phos)] bg-[rgba(var(--snf-phos-rgb),0.08)]'
                        : 'border-transparent snf-dim hover:text-[var(--snf-phos)]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="snf-mono text-[10px] tracking-[0.2em] snf-dim">SIZE</span>
                <button
                  type="button"
                  onClick={() => cycleSize(-1)}
                  className="snf-btn !px-2 !py-1"
                  aria-label="decrease text size"
                >
                  <MinusIcon size={12} weight="bold" />
                </button>
                <span className="snf-mono text-[11px] snf-phos-text w-6 text-center uppercase">
                  {settings.textSize}
                </span>
                <button
                  type="button"
                  onClick={() => cycleSize(1)}
                  className="snf-btn !px-2 !py-1"
                  aria-label="increase text size"
                >
                  <PlusIcon size={12} weight="bold" />
                </button>
              </div>
            </div>

            {/* Printout */}
            <div className="snf-printout px-8 sm:px-12 md:px-16 py-8 md:py-10">
              <div className="snf-mono text-[10px] tracking-[0.25em] snf-dim mb-6 flex items-center gap-2">
                <span className="snf-rec" />
                {decrypting
                  ? tr
                    ? 'ŞİFRE ÇÖZÜLÜYOR…'
                    : 'INTERCEPT DECRYPTING…'
                  : tr
                    ? 'AKTARIM BAŞLIYOR'
                    : 'INTERCEPT BEGINS'}
              </div>

              {loading || decrypting ? (
                <div className="space-y-3 pl-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="h-3 snf-redact rounded-sm"
                      style={{ width: `${55 + ((i * 41) % 42)}%` }}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="snf-reading snf-printout-body pl-2 md:pl-6"
                  data-font={settings.readingFont}
                  data-size={settings.textSize}
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{text}</ReactMarkdown>
                </motion.div>
              )}

              {!loading && !decrypting && (
                <div className="mt-12 pt-6 border-t border-dashed border-[var(--snf-line)] flex items-end justify-between gap-4">
                  <span className="snf-mono text-[9px] uppercase tracking-[0.35em] snf-dim">
                    ▸ {tr ? 'AKTARIM SONU' : 'END OF TRANSMISSION'}
                  </span>
                  <span className="text-right">
                    <span className="block snf-display italic text-lg text-[var(--snf-phos)] snf-glow-soft">
                      {episode.author}
                    </span>
                    <span className="block snf-mono text-[8px] uppercase tracking-[0.3em] snf-dim mt-0.5">
                      verified_seal
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Prev / index / next */}
            <nav className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
              <div>
                {prev && (
                  <Link
                    to={`/snf/archive/${book.bookId}/${prev.id}`}
                    className="snf-row group flex items-center gap-3 px-4 py-3.5 h-full"
                  >
                    <CaretLeftIcon
                      size={18}
                      weight="bold"
                      className="snf-phos-text flex-none group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="min-w-0">
                      <span className="block snf-mono text-[9px] tracking-[0.2em] snf-dim">
                        {tr ? 'ÖNCEKİ' : 'PRIOR'}
                      </span>
                      <span className="block snf-mono text-xs text-[var(--snf-ink)] truncate">
                        {prev.title}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
              <Link
                to={`/snf/archive/${book.bookId}`}
                className="snf-row flex items-center justify-center gap-2 px-4 py-3.5 snf-mono text-[10px] uppercase tracking-[0.3em] text-[var(--snf-phos)]"
              >
                <ListIcon size={16} weight="bold" />
                {tr ? 'DİZİN' : 'INDEX'}
              </Link>
              <div>
                {next && (
                  <Link
                    to={`/snf/archive/${book.bookId}/${next.id}`}
                    className="snf-row group flex items-center justify-end gap-3 px-4 py-3.5 h-full text-right"
                  >
                    <span className="min-w-0">
                      <span className="block snf-mono text-[9px] tracking-[0.2em] snf-dim">
                        {tr ? 'SONRAKİ' : 'NEXT'}
                      </span>
                      <span className="block snf-mono text-xs text-[var(--snf-ink)] truncate">
                        {next.title}
                      </span>
                    </span>
                    <CaretRightIcon
                      size={18}
                      weight="bold"
                      className="snf-phos-text flex-none group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>
            </nav>
          </article>
        </>
      )}
    </SnfLayout>
  );
};

export default SnfDossierPage;
