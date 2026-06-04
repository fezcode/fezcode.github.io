import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ListBulletsIcon,
  TextAaIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import SnfV3Root from '../../components/snf-v3/SnfV3Root';
import SnfV3Prefs from '../../components/snf-v3/SnfV3Prefs';
import Seo from '../../components/Seo';
import { useSnfV3 } from '../../context/SnfV3Context';
import { useBooks, useEpisodeText } from '../../hooks/useStoriesData';

const SnfV3ReadPage = () => {
  const { bookId, episodeId } = useParams();
  const { language, settings } = useSnfV3();
  const { data: books } = useBooks(language);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tr = language === 'tr';

  const [prefsOpen, setPrefsOpen] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);

  const book = useMemo(
    () => (books || []).find((b) => Number(b.bookId) === Number(bookId)),
    [books, bookId],
  );
  const idx = book
    ? book.episodes.findIndex((e) => Number(e.id) === Number(episodeId))
    : -1;
  const episode = idx >= 0 ? book.episodes[idx] : null;
  const prev = idx > 0 ? book.episodes[idx - 1] : null;
  const next =
    book && idx >= 0 && idx < book.episodes.length - 1
      ? book.episodes[idx + 1]
      : null;
  const volTitle = book?.bookTitle.replace(/^Volume\s+[IVX]+:\s*/i, '');

  const { text, loading } = useEpisodeText(episode?.filename);

  // ----- pagination -----
  const viewportRef = useRef(null);
  const flowRef = useRef(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [fontsTick, setFontsTick] = useState(0);
  const startAtEnd = useRef(params.get('p') === 'last');

  const layout = useMemo(() => {
    const w = vp.w;
    const spread = w >= 820;
    const margin = spread ? 56 : 30;
    const gap = margin * 2;
    const contentW = Math.max(0, w - margin * 2);
    const colW = spread ? Math.floor((contentW - gap) / 2) : contentW;
    return { spread, margin, gap, colW };
  }, [vp.w]);

  useEffect(() => {
    if (!viewportRef.current) return undefined;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setVp({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => setFontsTick((t) => t + 1));
  }, []);

  // measure page count after layout
  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow || vp.w === 0) return;
    const total = flow.scrollWidth;
    const count = Math.max(1, Math.round(total / vp.w));
    setPages(count);
    setPage((p) => {
      if (startAtEnd.current) {
        startAtEnd.current = false;
        return count - 1;
      }
      return Math.min(p, count - 1);
    });
  }, [text, vp.w, vp.h, settings.size, settings.typeface, settings.theme, fontsTick, layout]);

  // reset to first page on chapter change
  useEffect(() => {
    if (!startAtEnd.current) setPage(0);
  }, [episode?.filename]);

  const turn = useCallback(
    (dir) => {
      if (dir > 0) {
        if (page < pages - 1) setPage(page + 1);
        else if (next) navigate(`/bookshelf/read/${bookId}/${next.id}`);
      } else if (page > 0) setPage(page - 1);
      else if (prev) navigate(`/bookshelf/read/${bookId}/${prev.id}?p=last`);
    },
    [page, pages, next, prev, navigate, bookId],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (prefsOpen || contentsOpen) return;
      if (e.key === 'ArrowRight') turn(1);
      else if (e.key === 'ArrowLeft') turn(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [turn, prefsOpen, contentsOpen]);

  // swipe
  const touch = useRef(null);
  const onTouchStart = (e) => {
    touch.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 45) turn(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  const flowStyle = {
    height: vp.h ? `${vp.h}px` : '100%',
    width: '100%',
    maxWidth: 'none',
    margin: 0,
    columnWidth: layout.colW ? `${layout.colW}px` : 'auto',
    columnGap: `${layout.gap}px`,
    columnFill: 'auto',
    padding: `${layout.spread ? 52 : 38}px ${layout.margin}px`,
    boxSizing: 'border-box',
    transform: `translateX(-${page * vp.w}px)`,
    transition: 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  };

  return (
    <SnfV3Root>
      <Seo
        title={`${episode?.title || 'Reading'} | The Reading Room`}
        description={`${episode?.title || ''} — from From Serfs and Frauds.`}
        keywords={['serfs and frauds', episode?.title, 'reading']}
      />

      <div className="h-full flex flex-col">
        {/* leather top bar */}
        <div className="snf3-bar flex-none relative z-30">
          <div className="max-w-5xl mx-auto px-3 md:px-5 h-14 flex items-center justify-between gap-3">
            <Link to="/bookshelf" className="snf3-bar-btn">
              <CaretLeftIcon size={18} weight="bold" />
              <span className="hidden sm:inline">{tr ? 'Raf' : 'Shelf'}</span>
            </Link>
            <div className="snf3-bar-title text-sm md:text-base truncate px-2">
              {volTitle}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="snf3-bar-btn"
                onClick={() => {
                  setContentsOpen((v) => !v);
                  setPrefsOpen(false);
                }}
                aria-label="Contents"
              >
                <ListBulletsIcon size={19} weight="bold" />
              </button>
              <button
                type="button"
                className="snf3-bar-btn"
                onClick={() => {
                  setPrefsOpen((v) => !v);
                  setContentsOpen(false);
                }}
                aria-label="Appearance"
              >
                <TextAaIcon size={20} weight="bold" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {prefsOpen && <SnfV3Prefs onClose={() => setPrefsOpen(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {contentsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setContentsOpen(false)} aria-hidden />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="snf3-sheet absolute left-3 md:left-5 top-full mt-2 z-50 w-80 max-w-[88vw] p-3 max-h-[70vh] overflow-y-auto"
                  role="dialog"
                  aria-label="Contents"
                >
                  <div
                    className="text-[0.7rem] tracking-[0.18em] uppercase px-2 py-1.5"
                    style={{ color: 'var(--snf3-sheet-muted)' }}
                  >
                    {tr ? 'İçindekiler' : 'Contents'}
                  </div>
                  {(book?.episodes || []).map((ep, i) => {
                    const active = Number(ep.id) === Number(episodeId);
                    return (
                      <Link
                        key={ep.id}
                        to={`/bookshelf/read/${book.bookId}/${ep.id}`}
                        onClick={() => setContentsOpen(false)}
                        className="snf3-sheet-item flex items-center gap-3 px-2 py-2 rounded-lg"
                        style={{ color: active ? 'var(--snf3-ribbon)' : 'var(--snf3-sheet-ink)' }}
                      >
                        <span className="text-xs w-5 text-right opacity-60" style={{ fontFamily: 'var(--snf3-serif)' }}>
                          {i + 1}
                        </span>
                        <span className="flex-1" style={{ fontFamily: 'var(--snf3-serif)' }}>
                          {ep.title}
                        </span>
                        {active && <CheckIcon size={14} weight="bold" />}
                      </Link>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* the desk + book */}
        <div
          className="flex-1 min-h-0 relative flex items-stretch justify-center px-3 md:px-12 py-4 md:py-8"
          style={{ background: 'var(--snf3-paper-edge)' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* turn zones */}
          {page > 0 || prev ? (
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => turn(-1)}
              className="absolute left-0 top-0 bottom-0 w-[22%] z-20 cursor-w-resize bg-transparent"
            />
          ) : null}
          {page < pages - 1 || next ? (
            <button
              type="button"
              aria-label="Next page"
              onClick={() => turn(1)}
              className="absolute right-0 top-0 bottom-0 w-[22%] z-20 cursor-e-resize bg-transparent"
            />
          ) : null}

          {/* desktop chevrons */}
          <button
            type="button"
            onClick={() => turn(-1)}
            disabled={page === 0 && !prev}
            aria-label="Previous"
            className="hidden md:flex absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 snf3-turn snf3-turn-prev"
          >
            <CaretLeftIcon size={30} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => turn(1)}
            disabled={page === pages - 1 && !next}
            aria-label="Next"
            className="hidden md:flex absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 snf3-turn snf3-turn-next"
          >
            <CaretRightIcon size={30} weight="bold" />
          </button>

          {/* the page surface */}
          <div
            ref={viewportRef}
            className="snf3-page relative w-full max-w-[1600px] rounded-sm overflow-hidden"
          >
            <span className="snf3-ribbon right-8 md:right-14" />
            {layout.spread && (
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.10) 55%, transparent)',
                }}
              />
            )}

            {!episode || loading ? (
              <div className="p-10 md:p-16 space-y-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded"
                    style={{ width: `${60 + ((i * 37) % 36)}%`, background: 'rgba(0,0,0,0.07)' }}
                  />
                ))}
              </div>
            ) : (
              <div ref={flowRef} className="snf3-read" style={flowStyle}>
                <header className="text-center mb-7" style={{ breakInside: 'avoid' }}>
                  <div
                    className="text-[0.7rem] tracking-[0.24em] uppercase mb-2"
                    style={{ color: 'var(--snf3-ink-soft)' }}
                  >
                    {tr ? 'Bölüm' : 'Chapter'} {idx + 1}
                  </div>
                  <h1
                    className="leading-tight"
                    style={{ fontFamily: 'var(--snf3-serif)', fontWeight: 600, fontSize: 'clamp(1.5rem,3.4vw,2.2rem)' }}
                  >
                    {episode.title}
                  </h1>
                  <div className="text-sm italic mt-2" style={{ color: 'var(--snf3-ink-soft)' }}>
                    {episode.author}
                  </div>
                </header>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{text}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* bottom: page count + progress */}
        <div
          className="flex-none px-5 py-2.5 flex items-center justify-center gap-4"
          style={{ background: 'var(--snf3-paper-edge)' }}
        >
          <div className="w-40 snf3-progress-track">
            <div
              className="snf3-progress-fill"
              style={{ width: `${pages > 1 ? ((page + 1) / pages) * 100 : 100}%` }}
            />
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ color: 'var(--snf3-ink-soft)', fontFamily: 'var(--snf3-serif)' }}
          >
            {tr ? 'Sayfa' : 'Page'} {page + 1} / {pages}
          </span>
        </div>
      </div>
    </SnfV3Root>
  );
};

export default SnfV3ReadPage;
