import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  DownloadSimpleIcon,
  VinylRecordIcon,
  CopyIcon,
  CheckIcon,
} from '@phosphor-icons/react';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Unbounded:wght@300..900&family=Hanken+Grotesk:ital,wght@0,300..800;1,300..800&family=Spline+Sans+Mono:wght@300..700&display=swap';

const INK = '#0F0C0A';
const PANEL = '#191411';
const CREAM = '#F2EDE4';
const MUTED = '#96897B';

const DISPLAY = { fontFamily: "'Unbounded', sans-serif" };
const BODY = { fontFamily: "'Hanken Grotesk', sans-serif" };
const MONO = { fontFamily: "'Spline Sans Mono', monospace" };

// Deterministic pseudo-heights so SSR and client render the same bars.
const barHeight = (i) => {
  const v = Math.sin(i * 1.7) + Math.sin(i * 0.53 + 2.1) * 0.6 + Math.sin(i * 3.3 + 0.4) * 0.35;
  return 0.18 + ((v + 1.95) / 3.9) * 0.82;
};

const formatTime = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const Eyebrow = ({ children }) => (
  <div
    className="text-[11px] uppercase tracking-[0.45em] text-[var(--acc)] transition-colors duration-700"
    style={MONO}
  >
    {children}
  </div>
);

const SpectrumStrip = ({ playing, bars = 56, className = '' }) => (
  <div className={`flex items-end gap-[3px] h-10 ${className}`} aria-hidden>
    {Array.from({ length: bars }, (_, i) => (
      <span
        key={i}
        className="hifi-bar flex-1 rounded-t-[2px] bg-[var(--acc)] transition-colors duration-700"
        style={{
          height: `${barHeight(i) * 100}%`,
          animationDelay: `${(i % 9) * 0.11}s`,
          animationPlayState: playing ? 'running' : 'paused',
          opacity: 0.85,
        }}
      />
    ))}
  </div>
);

const MiniBars = () => (
  <span className="flex items-end gap-[2px] h-3.5 w-4" aria-hidden>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="hifi-minibar w-[3px] rounded-sm bg-[var(--acc)]"
        style={{ animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </span>
);

const CoverArt = ({ palette, wordmark }) => (
  <div className="relative w-full aspect-square select-none">
    <AnimatePresence mode="sync">
      <motion.div
        key={palette.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-[28px] overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${palette.b} 0%, ${palette.a} 100%)`,
        }}
      >
        {/* The soft circle Timp draws on generated covers */}
        <div
          className="absolute rounded-full"
          style={{
            inset: '18%',
            background:
              'radial-gradient(circle at 42% 38%, rgba(255,244,230,0.5), rgba(255,244,230,0.18) 62%, rgba(255,244,230,0.05) 100%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(200deg, rgba(255,255,255,0.14) 0%, transparent 34%), linear-gradient(20deg, rgba(10,6,4,0.35) 0%, transparent 45%)',
          }}
        />
        <div
          className="absolute bottom-5 left-6 text-[11px] uppercase tracking-[0.5em] text-black/50"
          style={MONO}
        >
          {wordmark}
        </div>
        <div
          className="absolute bottom-5 right-6 text-[11px] tracking-[0.2em] text-black/45"
          style={MONO}
        >
          {palette.name}
        </div>
      </motion.div>
    </AnimatePresence>
    {/* Accent glow under the sleeve */}
    <div
      className="absolute -inset-4 -z-10 rounded-[40px] opacity-40 blur-3xl transition-colors duration-700 bg-[var(--acc)]"
      aria-hidden
    />
  </div>
);

const HifiProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: loadingProjects } = useProjects();
  const [cfg, setCfg] = useState(null);
  const [failed, setFailed] = useState(false);

  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [activeLyric, setActiveLyric] = useState(-1);
  const [activeBand, setActiveBand] = useState(null);
  const [copied, setCopied] = useState(false);

  const lyricsRef = useRef(null);
  const project = projects.find((p) => p.slug === slug);

  // Theme fonts, injected once.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector('link[data-hifi-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    link.setAttribute('data-hifi-fonts', 'true');
    document.head.appendChild(link);
  }, []);

  // Page config.
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    fetch(`/projects/${slug}/hifi.txt`)
      .then((res) => {
        if (!res.ok) throw new Error(`hifi.txt missing for ${slug}`);
        return res.json();
      })
      .then((data) => alive && setCfg(data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  const queue = cfg?.queue || [];
  const trackSeconds = cfg?.trackSeconds || 24;
  const track = queue[trackIdx] || null;
  const palette = track?.palette || { name: '—', a: '#F27BB4', b: '#6C5BD4' };

  const goTo = useCallback(
    (idx, andPlay = false) => {
      if (!queue.length) return;
      setTrackIdx(((idx % queue.length) + queue.length) % queue.length);
      setProgress(0);
      if (andPlay) setPlaying(true);
    },
    [queue.length],
  );

  // Transport clock — the "record" plays and the next one re-tints the page.
  useEffect(() => {
    if (!playing || !queue.length) return;
    const step = 0.1 / trackSeconds;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + step >= 1) {
          setTrackIdx((t) => (t + 1) % queue.length);
          return 0;
        }
        return p + step;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing, queue.length, trackSeconds]);

  // Mini player appears once the hero player scrolls away.
  // The site scrolls <body> (html/body are height:100%), so listen there too.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getTop = () =>
      window.scrollY ||
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      0;
    const onScroll = () => setPastHero(getTop() > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Karaoke highlight for the lyric lines.
  useEffect(() => {
    if (typeof window === 'undefined' || !cfg || !lyricsRef.current) return;
    const lines = lyricsRef.current.querySelectorAll('[data-lyric]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLyric(Number(entry.target.getAttribute('data-lyric')));
          }
        });
      },
      { rootMargin: '-46% 0px -46% 0px' },
    );
    lines.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cfg]);

  const copyBuild = () => {
    if (!cfg?.build?.lines || typeof navigator === 'undefined') return;
    navigator.clipboard.writeText(cfg.build.lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loadingProjects || (!cfg && !failed)) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-xs uppercase tracking-[0.4em]"
        style={{ ...MONO, backgroundColor: INK, color: MUTED }}
      >
        <span className="animate-pulse">Dropping the needle…</span>
      </div>
    );
  }

  if (failed || !cfg || !project) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 text-xs uppercase tracking-[0.4em]"
        style={{ ...MONO, backgroundColor: INK, color: MUTED }}
      >
        <span>Nothing on the platter.</span>
        <Link to="/projects" className="text-[#F27BB4] hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const elapsed = progress * trackSeconds;
  const trackNo = String(trackIdx + 1).padStart(2, '0');
  const shownBand = cfg.eq?.bands?.[activeBand ?? (cfg.eq?.bands?.length || 1) - 1];

  return (
    <div
      className={`hifi-root min-h-screen overflow-x-hidden ${pastHero ? 'pb-24' : ''}`}
      style={{
        ...BODY,
        backgroundColor: INK,
        color: CREAM,
        '--acc': palette.a,
        '--acc2': palette.b,
      }}
    >
      <Seo
        title={`${project.title} | Fezcodex`}
        description={project.shortDescription}
        image={project.image}
        keywords={project.technologies}
      />

      <style>{`
        .hifi-root ::selection { background: var(--acc); color: ${INK}; }
        .hifi-root :focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; border-radius: 4px; }
        @keyframes hifi-eq {
          0%, 100% { transform: scaleY(0.35); }
          20% { transform: scaleY(1); }
          45% { transform: scaleY(0.5); }
          70% { transform: scaleY(0.85); }
        }
        .hifi-bar { transform-origin: bottom; animation: hifi-eq 1.35s ease-in-out infinite; }
        @keyframes hifi-mini {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .hifi-minibar { animation: hifi-mini 0.9s ease-in-out infinite; }
        .hifi-screens { scrollbar-width: thin; scrollbar-color: var(--acc) transparent; }
        .hifi-screens::-webkit-scrollbar { height: 6px; }
        .hifi-screens::-webkit-scrollbar-thumb { background: var(--acc); border-radius: 3px; }
        .hifi-screens::-webkit-scrollbar-track { background: rgba(242,237,228,0.06); }
        @media (prefers-reduced-motion: reduce) {
          .hifi-bar, .hifi-minibar { animation: none !important; }
        }
      `}</style>

      {/* Title bar, the way Timp draws its own */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0F0C0A]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <Link
            to="/projects"
            className="flex items-center gap-2 text-sm text-[#96897B] hover:text-[var(--acc)] transition-colors"
            style={MONO}
          >
            <ArrowLeftIcon weight="bold" />
            <span className="hidden sm:inline uppercase tracking-[0.25em] text-[11px]">Projects</span>
          </Link>
          <div
            className="uppercase text-[12px] tracking-[0.6em] text-[#96897B] translate-x-[0.3em]"
            style={MONO}
          >
            {cfg.wordmark}
          </div>
          <div className="flex items-center gap-4">
            <span
              className="hidden sm:inline text-[11px] tracking-[0.2em] text-[#96897B]"
              style={MONO}
            >
              v{cfg.version}
            </span>
            <a
              href={cfg.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub"
              className="text-[#96897B] hover:text-[var(--acc)] transition-colors"
            >
              <GithubLogoIcon size={20} weight="fill" />
            </a>
          </div>
        </div>
      </header>

      {/* NOW PLAYING — the hero is a working player: each record re-tints the page */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-md mx-auto w-full lg:max-w-none"
          >
            <CoverArt palette={palette} wordmark={cfg.wordmark} />
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2" style={MONO}>
                {[palette.a, palette.b].map((hex) => (
                  <span key={hex} className="flex items-center gap-1.5 text-[11px] text-[#96897B]">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: hex }}
                    />
                    {hex}
                  </span>
                ))}
              </div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#96897B]" style={MONO}>
                sampled
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <Eyebrow>Now Playing</Eyebrow>
            <h1
              className="mt-4 text-6xl md:text-8xl font-extrabold leading-none tracking-tight"
              style={DISPLAY}
            >
              {cfg.wordmark.charAt(0) + cfg.wordmark.slice(1).toLowerCase()}
            </h1>
            <p className="mt-3 text-[#96897B] text-sm tracking-[0.08em]" style={MONO}>
              {cfg.artist}
            </p>
            <p className="mt-6 text-lg md:text-xl text-[#CFC6B8] leading-relaxed max-w-xl">
              {cfg.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {cfg.formats.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] tracking-[0.2em] text-[#CFC6B8]"
                  style={MONO}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Transport */}
            <div className="mt-10">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => goTo(trackIdx - 1)}
                  aria-label="Previous record"
                  className="text-[#CFC6B8] hover:text-[var(--acc)] transition-colors"
                >
                  <SkipBackIcon size={26} weight="fill" />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause the palette playlist' : 'Play the palette playlist'}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--acc)] text-[#14100C] transition-all duration-700 hover:scale-105 active:scale-95"
                  style={{ boxShadow: '0 12px 40px -8px var(--acc)' }}
                >
                  {playing ? (
                    <PauseIcon size={28} weight="fill" />
                  ) : (
                    <PlayIcon size={28} weight="fill" className="translate-x-[2px]" />
                  )}
                </button>
                <button
                  onClick={() => goTo(trackIdx + 1)}
                  aria-label="Next record"
                  className="text-[#CFC6B8] hover:text-[var(--acc)] transition-colors"
                >
                  <SkipForwardIcon size={26} weight="fill" />
                </button>

                <div className="ml-2 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {trackNo} · {track?.title}
                  </div>
                  <div className="text-[11px] text-[#96897B] tracking-[0.15em] truncate" style={MONO}>
                    {palette.name}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3" style={MONO}>
                <span className="text-[11px] text-[#96897B] w-10">{formatTime(elapsed)}</span>
                <div
                  className="relative flex-1 h-1 rounded-full bg-white/10 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(Math.min(0.999, Math.max(0, (e.clientX - rect.left) / rect.width)));
                  }}
                  role="slider"
                  aria-label="Seek within this record"
                  aria-valuemin={0}
                  aria-valuemax={trackSeconds}
                  aria-valuenow={Math.round(elapsed)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setProgress((p) => Math.min(0.999, p + 0.05));
                    if (e.key === 'ArrowLeft') setProgress((p) => Math.max(0, p - 0.05));
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--acc)] transition-colors duration-700"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--acc)] transition-colors duration-700"
                    style={{ left: `calc(${progress * 100}% - 6px)` }}
                  />
                </div>
                <span className="text-[11px] text-[#96897B] w-12 text-right">
                  -{formatTime(trackSeconds - elapsed)}
                </span>
              </div>

              {/* The record rack — every sleeve re-samples the page */}
              <div className="mt-8">
                <div className="flex items-center gap-3 flex-wrap">
                  {queue.map((q, i) => (
                    <button
                      key={q.palette.name}
                      onClick={() => goTo(i, true)}
                      aria-label={`Play ${q.title} — ${q.palette.name}`}
                      className={`relative w-11 h-11 rounded-lg overflow-hidden transition-transform hover:scale-110 ${
                        i === trackIdx
                          ? 'ring-2 ring-offset-2 ring-offset-[#0F0C0A] ring-[var(--acc)]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{
                        background: `linear-gradient(160deg, ${q.palette.b}, ${q.palette.a})`,
                      }}
                    >
                      <span
                        className="absolute rounded-full"
                        style={{
                          inset: '22%',
                          background: 'radial-gradient(circle at 40% 36%, rgba(255,244,230,0.45), rgba(255,244,230,0.08))',
                        }}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[#96897B] max-w-lg leading-relaxed">{cfg.rackLabel}</p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={cfg.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[var(--acc)] text-[#14100C] font-semibold transition-all duration-700 hover:brightness-110"
                >
                  <GithubLogoIcon size={20} weight="fill" />
                  <span>Source on GitHub</span>
                  <ArrowUpRightIcon
                    weight="bold"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
                {cfg.download && (
                  <a
                    href={cfg.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 text-[#F2EDE4] hover:border-[var(--acc)] hover:text-[var(--acc)] transition-colors"
                  >
                    <DownloadSimpleIcon size={20} weight="bold" />
                    <span>
                      One exe, no installer
                    </span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SpectrumStrip playing={playing} />
      </div>

      {/* THE QUEUE — features, keyed with Timp's real hotkeys */}
      <section id="shot-queue" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Eyebrow>The Queue</Eyebrow>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight max-w-2xl" style={DISPLAY}>
          Eight tracks, one tiny player
        </h2>
        <p className="mt-4 text-[#96897B] max-w-xl">
          Every row is a real feature and every key is Timp's real shortcut. Click one to drop the
          needle on its record.
        </p>

        <div className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {queue.map((q, i) => {
            const isCurrent = i === trackIdx;
            return (
              <button
                key={q.title}
                onClick={() => goTo(i, true)}
                aria-current={isCurrent ? 'true' : undefined}
                className={`group w-full text-left grid grid-cols-[1.75rem_1fr_auto] sm:grid-cols-[3rem_2.5rem_1fr_auto] items-center gap-3 sm:gap-4 py-5 px-2 md:px-4 transition-colors ${
                  isCurrent ? 'bg-white/[0.045]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span className="text-sm text-[#96897B] tabular-nums flex items-center justify-center" style={MONO}>
                  {isCurrent ? (
                    <MiniBars />
                  ) : (
                    <>
                      <span className="group-hover:hidden">{String(i + 1).padStart(2, '0')}</span>
                      <PlayIcon
                        size={14}
                        weight="fill"
                        className="hidden group-hover:inline text-[var(--acc)]"
                      />
                    </>
                  )}
                </span>
                <span
                  className="hidden sm:block w-8 h-8 md:w-9 md:h-9 rounded-md shrink-0"
                  style={{ background: `linear-gradient(160deg, ${q.palette.b}, ${q.palette.a})` }}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span
                    className={`block font-semibold text-base md:text-lg transition-colors duration-700 ${
                      isCurrent ? 'text-[var(--acc)]' : 'text-[#F2EDE4]'
                    }`}
                  >
                    {q.title}
                  </span>
                  <span className="block text-sm text-[#96897B] leading-snug mt-1 max-w-2xl">
                    {q.desc}
                  </span>
                </span>
                <span className="flex gap-1.5 justify-self-end" style={MONO}>
                  {q.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2 py-1 rounded border border-white/15 bg-white/[0.04] text-[10px] tracking-[0.15em] text-[#CFC6B8]"
                    >
                      {k}
                    </kbd>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* LYRICS — the manifesto, karaoke-highlighted on scroll */}
      <section id="shot-lyrics" className="py-20 md:py-28 border-y border-white/[0.06] bg-[#120E0B]">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Eyebrow>Lyrics</Eyebrow>
          <p className="mt-3 text-[11px] tracking-[0.3em] text-[#96897B] uppercase" style={MONO}>
            {cfg.lyrics.caption}
          </p>
          <div ref={lyricsRef} className="mt-14 space-y-7">
            {cfg.lyrics.lines.map((line, i) => (
              <p
                key={i}
                data-lyric={i}
                className={`text-2xl md:text-4xl font-bold tracking-tight transition-all duration-500 ${
                  activeLyric === i ? 'text-[#F2EDE4] scale-100' : 'text-[#4A4038] scale-[0.97]'
                }`}
                style={DISPLAY}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* EQUALIZER — the codebase as a mixing board */}
      <section id="shot-eq" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Eyebrow>Equalizer</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight max-w-2xl" style={DISPLAY}>
              {cfg.eq.heading}
            </h2>
          </div>
          <div className="flex gap-2" style={MONO}>
            <span className="px-3 py-1.5 rounded border border-white/15 text-[10px] tracking-[0.25em] bg-[var(--acc)] text-[#14100C] transition-colors duration-700 uppercase">
              On
            </span>
            <span className="px-3 py-1.5 rounded border border-white/15 text-[10px] tracking-[0.25em] text-[#96897B] uppercase">
              Flat
            </span>
          </div>
        </div>
        <p className="mt-4 text-[#96897B] max-w-xl">{cfg.eq.note}</p>

        <div className="mt-12 rounded-2xl border border-white/[0.08] p-6 md:p-10" style={{ backgroundColor: PANEL }}>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-x-3 md:gap-x-4 gap-y-8">
            {cfg.eq.bands.map((band, i) => (
              <button
                key={band.file}
                onMouseEnter={() => setActiveBand(i)}
                onFocus={() => setActiveBand(i)}
                onClick={() => setActiveBand(i)}
                aria-label={`${band.file} — ${band.role}`}
                className="flex flex-col items-center gap-3 group"
              >
                <span className="relative h-36 md:h-48 w-2 rounded-full bg-white/[0.07] flex items-end justify-center">
                  <span
                    className="w-full rounded-full transition-all duration-700 bg-[var(--acc)]"
                    style={{
                      height: `${band.level * 100}%`,
                      opacity: activeBand === i ? 1 : 0.55,
                    }}
                  />
                  <span
                    className="absolute w-6 h-2.5 rounded-sm"
                    style={{
                      bottom: `calc(${band.level * 100}% - 5px)`,
                      backgroundColor: CREAM,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  />
                </span>
                <span
                  className={`text-[9px] md:text-[10px] tracking-tight transition-colors ${
                    activeBand === i ? 'text-[var(--acc)]' : 'text-[#96897B]'
                  }`}
                  style={MONO}
                >
                  {band.file}
                </span>
              </button>
            ))}
          </div>
          <div
            className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-baseline gap-x-4 gap-y-1"
            style={MONO}
          >
            <span className="text-[var(--acc)] text-sm transition-colors duration-700">
              {shownBand?.file}
            </span>
            <span className="text-[#CFC6B8] text-sm">{shownBand?.role}</span>
            <span className="text-[#96897B] text-xs">{shownBand?.kb} KB</span>
          </div>
        </div>
      </section>

      {/* SCREENS — the app itself */}
      <section id="shot-screens" className="py-20 md:py-28 border-y border-white/[0.06] bg-[#120E0B]">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Eyebrow>Screens</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight" style={DISPLAY}>
            Borderless, rounded, no console
          </h2>
        </div>
        <div className="hifi-screens mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-10 pb-6 max-w-6xl mx-auto">
          {cfg.screens.map((s) => (
            <figure key={s.src} className="snap-center shrink-0 w-[260px] md:w-[300px]">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <img src={s.src} alt={s.caption} loading="lazy" className="w-full h-auto block" />
              </div>
              <figcaption className="mt-3 text-xs text-[#96897B] leading-relaxed" style={MONO}>
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* LINER NOTES */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Eyebrow>Liner Notes</Eyebrow>
        <div className="mt-10 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-14">
          <div className="space-y-6">
            {cfg.liner.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-[#CFC6B8]">
                {p}
              </p>
            ))}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#96897B]" style={MONO}>
                  {cfg.build.caption}
                </span>
                <button
                  onClick={copyBuild}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#96897B] hover:text-[var(--acc)] transition-colors"
                  style={MONO}
                >
                  {copied ? <CheckIcon className="text-[var(--acc)]" /> : <CopyIcon />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div
                className="rounded-xl border border-white/[0.08] p-5 text-sm space-y-2 overflow-x-auto"
                style={{ ...MONO, backgroundColor: PANEL }}
              >
                {cfg.build.lines.map((line, i) => (
                  <div key={i} className="whitespace-nowrap">
                    <span className="text-[var(--acc)] select-none transition-colors duration-700">
                      ${' '}
                    </span>
                    <span className="text-[#CFC6B8]">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.06]">
              {cfg.stats.map((s) => (
                <div key={s.label} className="p-6" style={{ backgroundColor: PANEL }}>
                  <div
                    className="text-2xl md:text-3xl font-bold text-[var(--acc)] transition-colors duration-700"
                    style={DISPLAY}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#96897B]" style={MONO}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#96897B]" style={MONO}>
                Credits
              </span>
              <ul className="mt-4 space-y-3">
                {cfg.credits.map((c) => (
                  <li key={c.name} className="flex items-baseline gap-3 text-sm">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F2EDE4] font-semibold hover:text-[var(--acc)] transition-colors shrink-0"
                    >
                      {c.name}
                    </a>
                    <span className="text-[#96897B]">{c.role}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-[#96897B] italic">{cfg.license}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Outro */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
          <SpectrumStrip playing={playing} bars={72} className="opacity-60" />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <Link
              to="/projects"
              className="flex items-center gap-2 text-sm text-[#96897B] hover:text-[var(--acc)] transition-colors"
              style={MONO}
            >
              <ArrowLeftIcon weight="bold" />
              <span className="uppercase tracking-[0.25em] text-[11px]">All projects</span>
            </Link>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#96897B]" style={MONO}>
              <VinylRecordIcon size={16} className="text-[var(--acc)] transition-colors duration-700" />
              Pressed by {cfg.artist}
            </div>
          </div>
        </div>
      </footer>

      {/* Mini player — slides in when the hero scrolls away */}
      <AnimatePresence>
        {pastHero && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.08] bg-[#14100C]/90 backdrop-blur-lg"
          >
            <div
              className="absolute top-0 inset-x-0 h-[2px] bg-white/10"
              aria-hidden
            >
              <div
                className="h-full bg-[var(--acc)] transition-colors duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-10 h-16 flex items-center gap-4">
              <span
                className="w-9 h-9 rounded-md shrink-0"
                style={{ background: `linear-gradient(160deg, ${palette.b}, ${palette.a})` }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">
                  {trackNo} · {track?.title}
                </div>
                <div className="text-[10px] text-[#96897B] tracking-[0.15em] truncate" style={MONO}>
                  {cfg.wordmark} — {palette.name}
                </div>
              </div>
              <div className="flex items-center gap-3 mr-12 sm:mr-0">
                <button
                  onClick={() => goTo(trackIdx - 1)}
                  aria-label="Previous record"
                  className="text-[#CFC6B8] hover:text-[var(--acc)] transition-colors"
                >
                  <SkipBackIcon size={18} weight="fill" />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--acc)] text-[#14100C] transition-colors duration-700"
                >
                  {playing ? (
                    <PauseIcon size={18} weight="fill" />
                  ) : (
                    <PlayIcon size={18} weight="fill" className="translate-x-[1px]" />
                  )}
                </button>
                <button
                  onClick={() => goTo(trackIdx + 1)}
                  aria-label="Next record"
                  className="text-[#CFC6B8] hover:text-[var(--acc)] transition-colors"
                >
                  <SkipForwardIcon size={18} weight="fill" />
                </button>
              </div>
              <a
                href={cfg.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source on GitHub"
                className="hidden sm:block text-[#96897B] hover:text-[var(--acc)] transition-colors"
              >
                <GithubLogoIcon size={20} weight="fill" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HifiProjectPage;
