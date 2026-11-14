import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowsOutIcon,
  BookOpenIcon,
  CaretDownIcon,
  CircleNotchIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Seo from '../../components/Seo';
import LogViewSwitch from '../../components/LogViewSwitch';
import {
  entryPath,
  fetchDiscoveryEntries,
  filterDiscoveryEntries,
  getCategoryTheme,
  loadDiscoveryBody,
} from './discoveryData';
import useShelfWindow from './useShelfWindow';
import CategoryImprint from './CategoryImprint';
import { GameTray, GameLidInsert } from './GameCaseInterior';
import './discovery.css';

const PhysicalCover = lazy(() => import('./PhysicalCover'));

const PAGE_SIZE = 24;
const COVER_TRANSITION = { type: 'spring', stiffness: 180, damping: 26 };
function EntryVideo({ src, title, allow, allowFullScreen, referrerPolicy }) {
  return (
    <iframe
      className="dc-entry-video"
      src={src}
      title={title || 'Embedded video'}
      allow={allow}
      allowFullScreen={allowFullScreen}
      referrerPolicy={referrerPolicy}
      loading="lazy"
    />
  );
}
const dateLabel = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      });
};
const entryStyle = (entry) => {
  const theme = getCategoryTheme(entry.category);
  return {
    '--entry-accent': theme.accent,
    '--entry-ink': theme.ink,
    '--entry-paper': theme.paper,
  };
};
function Rating({ value }) {
  if (!(value > 0)) return null;
  return (
    <span className="dc-rating" aria-label={`Rated ${value} out of 5`}>
      <StarIcon size={13} weight="fill" aria-hidden="true" />
      <span>
        {value}
        <span className="dc-rating-total"> / 5</span>
      </span>
    </span>
  );
}

function Artwork({ entry, eager = false, className = '', spine = false }) {
  const primary =
    (spine && entry.spineImage) || entry.cover || entry.fallbackCover;
  const [source, setSource] = useState(primary);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setSource(primary);
    setFailed(false);
  }, [entry.id, primary]);
  return (
    <div
      className={`dc-artwork ${className}`}
      data-original={source !== entry.fallbackCover}
    >
      <div className="dc-artwork-fallback" aria-hidden="true">
        <span>{entry.categoryLabel}</span>
        <strong>{entry.title}</strong>
      </div>
      {!failed && (
        <img
          src={source}
          alt=""
          width="640"
          height="880"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            objectPosition: entry.imagePosition || 'center',
            objectFit:
              !spine && entry.coverFit === 'cover' ? 'cover' : undefined,
          }}
          onError={() => {
            if (source === primary && primary !== entry.cover && entry.cover)
              setSource(entry.cover);
            else if (source !== entry.fallbackCover)
              setSource(entry.fallbackCover);
            else setFailed(true);
          }}
        />
      )}
    </div>
  );
}
const ShelfSpine = React.memo(function ShelfSpine({
  entry,
  mediaLoaded,
  isVisible,
  openEntry,
}) {
  return (
    <Link
      to={entryPath(entry)}
      className="dc-spine"
      style={entryStyle(entry)}
      data-category={entry.category}
      data-entry-id={entry.id}
      data-authored-spine={Boolean(entry.spineImage)}
      data-media-loaded={mediaLoaded}
      aria-label={'Open ' + entry.title + ' from the shelf'}
      onClick={(event) => openEntry(event, entry)}
    >
      {mediaLoaded && (
        <motion.div
          className="dc-spine-cover"
          layoutId={'shelf-' + entry.id}
          transition={COVER_TRANSITION}
        >
          <Artwork entry={entry} spine eager={isVisible} />
        </motion.div>
      )}
      <span className="dc-spine-light" aria-hidden="true" />
      <span className="dc-spine-title">{entry.title}</span>
      {mediaLoaded ? (
        <CategoryImprint
          category={entry.category}
          label={entry.categoryLabel}
        />
      ) : (
        <span
          className="dc-spine-category dc-spine-category-placeholder"
          aria-hidden="true"
        />
      )}
    </Link>
  );
});

function Shelf({ entries, total, openEntry, shelfRef, sentinelRef, loadMore }) {
  const windowed = useShelfWindow(shelfRef, entries.length);
  const reducedMotion = useReducedMotion();
  const more = entries.length < total;
  const slide = (direction) => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const distance = Math.max(240, shelf.clientWidth * 0.75);
    const move = () =>
      shelf.scrollBy({
        left: direction * distance,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    if (direction > 0 && windowed.visibleEnd >= entries.length && more) {
      loadMore();
      window.requestAnimationFrame(move);
    } else move();
  };
  const onKeyDown = (event) => {
    const links = [...(shelfRef.current?.querySelectorAll('.dc-spine') || [])];
    const index = links.indexOf(event.target.closest('.dc-spine'));
    if (index >= 0 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const next = links[index + (event.key === 'ArrowRight' ? 1 : -1)];
      if (next) {
        event.preventDefault();
        next.focus({ preventScroll: true });
        next.scrollIntoView?.({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'smooth',
        });
      } else if (event.key === 'ArrowRight' && more) loadMore();
    }
  };
  return (
    <section className="dc-shelf-section" aria-label="Discovery shelf">
      <div
        id="discovery-shelf-scroll"
        className="dc-shelf-scroll"
        ref={shelfRef}
        role="region"
        aria-label="Discovery shelf, newest first"
        tabIndex={0}
        onKeyDown={onKeyDown}
        data-scrolling={windowed.isScrolling}
      >
        <div className="dc-shelf">
          {entries.map((entry, index) => {
            const isVisible =
              index >= windowed.visibleStart && index < windowed.visibleEnd;
            return (
              <ShelfSpine
                key={entry.id}
                entry={entry}
                mediaLoaded={index >= windowed.start && index < windowed.end}
                isVisible={isVisible}
                openEntry={openEntry}
              />
            );
          })}
          <span
            ref={sentinelRef}
            className="dc-shelf-sentinel"
            aria-hidden="true"
          />
          {more && (
            <button
              className="dc-shelf-more"
              onClick={loadMore}
              aria-label="Load more discoveries"
            >
              <ArrowRightIcon size={18} />
              <span>More</span>
            </button>
          )}
        </div>
      </div>
      {windowed.visibleStart > 0 && (
        <button
          type="button"
          className="dc-shelf-edge dc-shelf-edge-left"
          aria-label="Scroll shelf left"
          aria-controls="discovery-shelf-scroll"
          onClick={() => slide(-1)}
        >
          <ArrowLeftIcon size={20} aria-hidden="true" />
        </button>
      )}
      {(windowed.visibleEnd < entries.length || more) && (
        <button
          type="button"
          className="dc-shelf-edge dc-shelf-edge-right"
          aria-label="Scroll shelf right"
          aria-controls="discovery-shelf-scroll"
          onClick={() => slide(1)}
        >
          <ArrowRightIcon size={20} aria-hidden="true" />
        </button>
      )}
      <p className="sr-only" role="status">
        {entries.length} of {total} discoveries, newest first
      </p>
    </section>
  );
}

function OpenCase({ entry, origin, open, reducedMotion }) {
  const theme = getCategoryTheme(entry.category);
  return (
    <div className="dc-case-scene" data-medium={entry.category}>
      <div
        className={`dc-stage-motif dc-stage-motif-${theme.motif}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
      </div>
      <motion.div
        className="dc-case"
        style={{ aspectRatio: entry.coverAspect }}
        layoutId={`${origin}-${entry.id}`}
        transition={reducedMotion ? { duration: 0 } : COVER_TRANSITION}
      >
        <div className="dc-case-content">
          {entry.category === 'game' ? (
            <GameTray entry={entry} />
          ) : (
            <>
              <span className="dc-case-inner-category">
                {entry.categoryLabel}
              </span>
              <div className="dc-case-inner-symbol" aria-hidden="true">
                {entry.category === 'music'
                  ? '◎'
                  : entry.category === 'quote'
                    ? '“'
                    : '✳'}
              </div>
              <h2>{entry.title}</h2>
              {entry.credit && (
                <span className="dc-case-inner-credit">{entry.credit}</span>
              )}
              <p>
                {entry.description || 'A discovery worth keeping on the shelf.'}
              </p>
              <div className="dc-case-inner-footer">
                <Rating value={entry.rating} />
                <span>{dateLabel(entry.date)}</span>
              </div>
            </>
          )}
        </div>
        <motion.div
          className="dc-case-lid"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: open ? -110 : 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: open ? 0.95 : 0.32, ease: [0.22, 0.72, 0.15, 1] }
          }
        >
          <div className="dc-case-lid-front">
            <Artwork entry={entry} eager />
            <span className="dc-case-edge" />
          </div>
          <div className="dc-case-lid-back">
            {entry.category === 'game' ? (
              <GameLidInsert entry={entry} />
            ) : (
              <>
                <span>{entry.categoryLabel}</span>
                <strong>
                  Some things
                  <br />
                  are worth
                  <br />
                  keeping.
                </strong>
                <span>Fezcodex / Discovery</span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Showcase({
  entry,
  previous,
  next,
  onNavigate,
  onClose,
  origin,
  closing,
}) {
  const reducedMotion = useReducedMotion();
  const [caseOpen, setCaseOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [body, setBody] = useState('');
  const [bodyState, setBodyState] = useState('idle');
  const [bodyAttempt, setBodyAttempt] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenError, setFullScreenError] = useState('');
  const panel = useRef(null);
  const closeButton = useRef(null);
  const scrollArea = useRef(null);
  const notesArea = useRef(null);
  const theme = getCategoryTheme(entry.category);

  useEffect(() => {
    setCaseOpen(false);
    setNotesOpen(false);
    setBody('');
    setBodyState('idle');
    if (scrollArea.current) scrollArea.current.scrollTop = 0;
    const timer = setTimeout(() => setCaseOpen(true), reducedMotion ? 0 : 480);
    return () => clearTimeout(timer);
  }, [entry.id, reducedMotion]);

  useEffect(() => {
    if (closing) setCaseOpen(false);
  }, [closing]);
  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!notesOpen) return;
    const controller = new AbortController();
    setBodyState('loading');
    loadDiscoveryBody(entry, { signal: controller.signal })
      .then((text) => {
        setBody(text);
        setBodyState('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setBodyState('error');
      });
    return () => controller.abort();
  }, [entry, notesOpen, bodyAttempt]);

  useEffect(() => {
    if (notesOpen && bodyState === 'ready') {
      notesArea.current?.scrollIntoView?.({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'start',
      });
    }
  }, [notesOpen, bodyState, reducedMotion]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'ArrowLeft' && previous) {
        event.preventDefault();
        onNavigate(previous);
      }
      if (event.key === 'ArrowRight' && next) {
        event.preventDefault();
        onNavigate(next);
      }
      if (event.key === 'Tab') {
        const controls = [
          ...(panel.current?.querySelectorAll(
            'button:not(:disabled), a[href], [tabindex="0"]',
          ) || []),
        ].filter((el) => el.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const handleFullScreen = () =>
      setFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFullScreen);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFullScreen);
    };
  }, [onClose, onNavigate, previous, next]);

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (panel.current?.requestFullscreen)
        await panel.current.requestFullscreen();
      else
        setFullScreenError(
          'Fullscreen is unavailable in this browser. The showcase already fills your window.',
        );
    } catch {
      setFullScreenError(
        'Fullscreen is unavailable in this browser. The showcase already fills your window.',
      );
    }
  };

  return (
    <motion.section
      ref={panel}
      className="dc-showcase"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dc-showcase-title"
      style={entryStyle(entry)}
      data-category={entry.category}
      data-motif={theme.motif}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
    >
      <header className="dc-showcase-header">
        <span className="dc-showcase-breadcrumb">
          Discovery <span>/</span> {entry.categoryLabel}
        </span>
        <div>
          <button
            className="dc-icon-button"
            onClick={toggleFullScreen}
            aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <ArrowsOutIcon size={20} />
          </button>
          <button
            ref={closeButton}
            className="dc-close-button"
            onClick={onClose}
            aria-label="Close showcase"
          >
            <span>Back to the shelf</span>
            <XIcon size={22} />
          </button>
        </div>
      </header>
      <div className="dc-showcase-scroll" ref={scrollArea}>
        <div className="dc-showcase-hero">
          <div className="dc-showcase-stage">
            <span className="dc-stage-word" aria-hidden="true">
              {entry.categoryLabel}
            </span>
            {entry.category === 'music' ? (
              <OpenCase
                entry={entry}
                origin={origin}
                open={caseOpen}
                reducedMotion={reducedMotion}
              />
            ) : (
              <Suspense
                fallback={
                  <OpenCase
                    entry={entry}
                    origin={origin}
                    open={caseOpen}
                    reducedMotion={reducedMotion}
                  />
                }
              >
                <PhysicalCover
                  entry={entry}
                  open={caseOpen}
                  reducedMotion={reducedMotion}
                  fallback={
                    <OpenCase
                      entry={entry}
                      origin={origin}
                      open={caseOpen}
                      reducedMotion={reducedMotion}
                    />
                  }
                />
              </Suspense>
            )}
            <button
              className="dc-cover-control"
              onClick={() => setCaseOpen((value) => !value)}
              aria-pressed={caseOpen}
            >
              <BookOpenIcon size={17} />
              {caseOpen ? 'Close the cover' : 'Open the cover'}
            </button>
          </div>
          <div className="dc-showcase-info">
            <div className="dc-showcase-category">
              <span className="dc-category-dot" />
              {entry.categoryLabel}
              <span className="dc-showcase-rating">
                <Rating value={entry.rating} />
              </span>
            </div>
            <h1 id="dc-showcase-title">{entry.title}</h1>
            {entry.credit && (
              <p className="dc-showcase-credit">{entry.credit}</p>
            )}
            <p className="dc-showcase-description">{entry.description}</p>
            <div className="dc-showcase-meta">
              <time dateTime={entry.date}>
                Discovered {dateLabel(entry.date)}
              </time>
              {entry.platform && <span>{entry.platform}</span>}
            </div>
            {entry.tags?.length > 0 && (
              <div className="dc-showcase-tags">
                {entry.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <div className="dc-showcase-actions">
              <button
                className="dc-primary-button"
                onClick={() => setNotesOpen((value) => !value)}
                aria-expanded={notesOpen}
                aria-controls="dc-full-entry"
              >
                <BookOpenIcon size={18} />
                {notesOpen ? 'Close full entry' : 'Read the full entry'}
                <CaretDownIcon size={15} />
              </button>
              {entry.link && (
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dc-source-link"
                >
                  Visit source <ArrowUpRightIcon size={17} />
                </a>
              )}
            </div>
            {fullScreenError && (
              <p className="dc-inline-notice" role="status">
                {fullScreenError}
              </p>
            )}
          </div>
        </div>
        {notesOpen && (
          <section
            id="dc-full-entry"
            ref={notesArea}
            className="dc-full-entry"
            aria-label="Full discovery entry"
          >
            {bodyState === 'loading' && (
              <p role="status">
                <CircleNotchIcon className="dc-spinner" /> Opening the entry…
              </p>
            )}
            {bodyState === 'error' && (
              <div role="alert">
                <p>The full entry couldn’t be loaded.</p>
                <button
                  className="dc-text-button"
                  onClick={() => setBodyAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              </div>
            )}
            {bodyState === 'ready' && (
              <div className="dc-entry-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{ iframe: EntryVideo }}
                >
                  {body ||
                    entry.description ||
                    'This discovery has no additional notes yet.'}
                </ReactMarkdown>
              </div>
            )}
          </section>
        )}
      </div>
      <footer className="dc-showcase-footer">
        <span className="dc-key-hint">
          <kbd>esc</kbd> Close <kbd>←</kbd>
          <kbd>→</kbd> Explore
        </span>
        <nav aria-label="Browse discoveries">
          <button
            disabled={!previous || closing}
            onClick={() => onNavigate(previous)}
          >
            <ArrowLeftIcon size={18} />
            <span>Previous</span>
          </button>
          <button disabled={!next || closing} onClick={() => onNavigate(next)}>
            <span>Next discovery</span>
            <ArrowRightIcon size={18} />
          </button>
        </nav>
      </footer>
    </motion.section>
  );
}

export default function DiscoveryPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [data, setData] = useState({
    entries: [],
    categories: [],
    failedCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [closing, setClosing] = useState(false);
  const shelfRef = useRef(null);
  const sentinel = useRef(null);
  const unavailablePanel = useRef(null);
  const returnPosition = useRef(null);
  const returnFocus = useRef(null);
  const closeTimer = useRef(null);
  const openedFromShelf = useRef(false);
  const hasSelection = Boolean(category && slug);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetchDiscoveryEntries({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        if (!result.entries.length && result.failedCategories.length)
          setError('The shelf couldn’t be loaded.');
      })
      .catch((cause) => {
        if (cause.name !== 'AbortError')
          setError('The shelf couldn’t be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  const entries = useMemo(
    () => filterDiscoveryEntries(data.entries, { sort: 'newest' }),
    [data.entries],
  );
  const selected = useMemo(
    () =>
      entries.find(
        (entry) =>
          entry.category === category?.toLowerCase() && entry.slug === slug,
      ),
    [entries, category, slug],
  );
  const selectedIndex = entries.findIndex((entry) => entry.id === selected?.id);
  const loadMore = useCallback(
    () => setLimit((value) => Math.min(value + PAGE_SIZE, entries.length)),
    [entries.length],
  );
  useEffect(() => {
    if (
      hasSelection ||
      loading ||
      limit >= entries.length ||
      !sentinel.current ||
      !shelfRef.current ||
      typeof IntersectionObserver === 'undefined'
    )
      return;
    const observer = new IntersectionObserver(
      (items) => {
        if (items.some((item) => item.isIntersecting)) loadMore();
      },
      { root: shelfRef.current, rootMargin: '0px 600px 0px 0px' },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [limit, entries.length, loading, hasSelection, loadMore]);
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf || hasSelection) return;
    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
        return;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? shelf.clientWidth
            : 1);
      if (event.cancelable) event.preventDefault();
      shelf.scrollLeft += delta;
    };
    shelf.addEventListener('wheel', onWheel, { passive: false });
    return () => shelf.removeEventListener('wheel', onWheel);
  }, [loading, hasSelection]);
  useEffect(() => {
    if (!hasSelection) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
      setClosing(false);
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const left = returnPosition.current ?? shelfRef.current?.scrollLeft ?? 0;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (shelfRef.current) shelfRef.current.scrollLeft = left;
      const focusTarget = returnFocus.current?.isConnected
        ? returnFocus.current
        : shelfRef.current;
      focusTarget?.focus({ preventScroll: true });
      returnPosition.current = null;
    };
  }, [hasSelection]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  const openEntry = (event, entry) => {
    if (
      event &&
      (event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button > 0)
    )
      return;
    event?.preventDefault();
    returnPosition.current = shelfRef.current?.scrollLeft || 0;
    returnFocus.current = event?.currentTarget || document.activeElement;
    openedFromShelf.current = true;
    setClosing(false);
    navigate(entryPath(entry));
  };
  const closeShowcase = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(
      () => {
        if (document.fullscreenElement)
          document.exitFullscreen?.().catch(() => {});
        if (openedFromShelf.current) navigate(-1);
        else navigate('/logs', { replace: true });
        openedFromShelf.current = false;
        closeTimer.current = null;
      },
      reducedMotion ? 0 : 380,
    );
  }, [navigate, reducedMotion]);
  const navigateEntry = useCallback(
    (entry) => {
      if (entry && !closeTimer.current)
        navigate(entryPath(entry), { replace: true });
    },
    [navigate],
  );
  useEffect(() => {
    if (!hasSelection || selected) return;
    const controls = () => [
      ...(unavailablePanel.current?.querySelectorAll(
        'button:not(:disabled), a[href]',
      ) || []),
    ];
    controls()[0]?.focus({ preventScroll: true });
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeShowcase();
      }
      if (event.key === 'Tab') {
        const items = controls();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [hasSelection, selected, closeShowcase]);

  return (
    <LayoutGroup id="discovery">
      <div className="dc-root">
        <Seo
          title={
            selected
              ? `${selected.title} | Discovery | Fezcodex`
              : 'Discovery | Fezcodex'
          }
          description={
            selected?.description ||
            'A shelf of discoveries. Games, records, films, and books, from newest to oldest.'
          }
          image={selected?.cover}
          canonicalPath={selected ? entryPath(selected) : '/logs'}
        />
        <main
          className="dc-shelf-page dc-shelf-page-with-switch"
          inert={hasSelection ? true : undefined}
        >
          <h1 className="sr-only">Discovery shelf</h1>
          <Link
            className="dc-shelf-close"
            to="/"
            aria-label="Close shelf"
            title="Back to home"
          >
            <XIcon size={22} aria-hidden="true" />
          </Link>
          <LogViewSwitch view="shelf" />
          {loading ? (
            <div
              className="dc-shelf-loading"
              role="status"
              aria-label="Loading discovery shelf"
            >
              {Array.from({ length: 24 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="dc-shelf-status" role="alert">
              <p>{error}</p>
              <button
                className="dc-primary-button"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Try again
              </button>
              <Link to="/logs">Return to logs</Link>
            </div>
          ) : entries.length ? (
            <Shelf
              entries={entries.slice(0, limit)}
              total={entries.length}
              openEntry={openEntry}
              shelfRef={shelfRef}
              sentinelRef={sentinel}
              loadMore={loadMore}
            />
          ) : (
            <div className="dc-shelf-status">
              <p>No discoveries on this shelf yet.</p>
              <Link to="/logs">Return to logs</Link>
            </div>
          )}
          {data.failedCategories.length > 0 && entries.length > 0 && (
            <button
              className="dc-shelf-retry"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Some shelves didn’t load. Retry
            </button>
          )}
        </main>
        {hasSelection && selected && (
          <Showcase
            entry={selected}
            previous={entries[selectedIndex - 1]}
            next={entries[selectedIndex + 1]}
            onNavigate={navigateEntry}
            onClose={closeShowcase}
            origin="shelf"
            closing={closing}
          />
        )}
        {hasSelection && !selected && (
          <motion.section
            ref={unavailablePanel}
            className="dc-showcase dc-unavailable"
            role="dialog"
            aria-modal="true"
            aria-label="Discovery entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="dc-close-button"
              onClick={closeShowcase}
              aria-label="Close showcase"
            >
              <XIcon size={24} />
              Back to the shelf
            </button>
            <div>
              {loading ? (
                <p role="status">Finding your discovery…</p>
              ) : (
                <>
                  <h1>
                    {error
                      ? 'The shelf couldn’t be loaded.'
                      : 'This cover isn’t on the shelf.'}
                  </h1>
                  <p>
                    {error
                      ? 'Try loading it again, or return to the shelf.'
                      : 'The entry may have moved. There’s plenty more to discover.'}
                  </p>
                  {error && (
                    <button
                      className="dc-primary-button"
                      onClick={() => setAttempt((value) => value + 1)}
                    >
                      Try again
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </LayoutGroup>
  );
}
