import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
  CircleIcon,
  CaretRightIcon,
  TerminalIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import GenerativeArt from '../../components/GenerativeArt';

// Deterministic hash used for mission codes, coordinates, etc.
const hashString = (s) => {
  let h = 0x9e3779b9;
  for (let i = 0; i < (s || '').length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
  }
  return (h >>> 0);
};

const pad = (n, w = 2) => String(n).padStart(w, '0');

const formatEpoch = (d) => {
  if (!d) return '0000.00.00';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '0000.00.00';
  return `${dt.getUTCFullYear()}.${pad(dt.getUTCMonth() + 1)}.${pad(dt.getUTCDate())}`;
};

const BlinkingCursor = () => (
  <span
    className="inline-block w-[8px] h-[12px] bg-emerald-400 ml-1 align-middle"
    style={{ animation: 'brutalistBlink 1s steps(2) infinite' }}
  />
);

const SpecRow = ({ label, value, mono = true, accent = false }) => (
  <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-dashed border-white/8">
    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
      {label}
    </span>
    <span
      className={`${mono ? 'font-mono' : 'font-arvo'} text-xs ${
        accent ? 'text-emerald-400' : 'text-white'
      } uppercase tracking-wide`}
    >
      {value}
    </span>
  </div>
);

const BrutalistSeriesPage = () => {
  const { seriesSlug } = useParams();
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const fetchSeriesPosts = async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();
        const filtered = processedPosts
          .filter((p) => p.series && p.series.slug === seriesSlug)
          .sort((a, b) => (a.seriesIndex || 0) - (b.seriesIndex || 0));
        if (filtered.length > 0) {
          setSeriesPosts(filtered);
          setSeriesTitle(filtered[0].series.title);
          setActivePost(filtered[0]);
        } else {
          setSeriesPosts([]);
          setSeriesTitle('Series Not Found');
        }
      } catch (error) {
        console.error('Error fetching series posts:', error);
        setSeriesPosts([]);
        setSeriesTitle('Error');
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesPosts();
  }, [seriesSlug]);

  const missionCode = useMemo(() => {
    const h = hashString(seriesSlug || '');
    const letters = 'ACDEFHJKLMNPRTUVWXYZ';
    const code = [0, 1, 2].map((i) => letters[(h >> (i * 5)) & 0x1f % letters.length]).join('');
    const num = (h >>> 6) % 9000 + 1000;
    return `MX-${code}-${num}`;
  }, [seriesSlug]);

  const coordinates = useMemo(() => {
    const h = hashString(seriesSlug || '');
    const lat = ((h & 0xffff) / 0xffff) * 180 - 90;
    const lon = (((h >>> 16) & 0xffff) / 0xffff) * 360 - 180;
    const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(4)}°${v >= 0 ? pos : neg}`;
    return `${fmt(lat, 'N', 'S')}  ${fmt(lon, 'E', 'W')}`;
  }, [seriesSlug]);

  const isPlaceholder = (p) => !p?.image || p.image.includes('placeholder');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left" />
          </div>
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
            Accessing_Series_Data
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white selection:bg-emerald-500/30 flex flex-col overflow-hidden relative" style={{ height: 'calc(100svh - 64px)' }}>
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`Explore the sequential entries in the "${seriesTitle}" series.`}
      />

      <style>{`
        @keyframes brutalistBlink { to { visibility: hidden; } }
        @keyframes brutalistScan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
        @keyframes brutalistTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bz-scan::before{
          content:'';position:absolute;inset:0;pointer-events:none;z-index:30;
          background:repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.025) 0,
            rgba(255,255,255,0.025) 1px,
            transparent 1px,
            transparent 3px
          );
          mix-blend-mode:overlay;
        }
        .bz-scan::after{
          content:'';position:absolute;inset:0;pointer-events:none;z-index:30;
          background:linear-gradient(to bottom,rgba(16,185,129,0.0),rgba(16,185,129,0.07),rgba(16,185,129,0.0));
          height:120px;animation:brutalistScan 6s linear infinite;
          mix-blend-mode:screen;
        }
      `}</style>

      {/* Ambient noise / backdrop */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none z-0 overflow-hidden">
        {activePost &&
          (isPlaceholder(activePost) ? (
            <GenerativeArt seed={activePost.title} className="w-full h-full filter blur-3xl" />
          ) : (
            <img src={activePost.image} alt="bg" className="w-full h-full object-cover filter blur-3xl" />
          ))}
      </div>
      <div className="absolute inset-0 bz-scan pointer-events-none z-10" />

      {/* ─── TOP CHROME BAR ───────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="flex items-stretch font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 h-11">
          <Link
            to="/blog"
            className="px-5 flex items-center gap-2 border-r border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-colors"
          >
            <ArrowLeftIcon weight="bold" size={12} />
            <span>Archive</span>
          </Link>
          <div className="px-5 flex items-center gap-2 border-r border-white/10 text-white/50">
            <CircleIcon weight="fill" size={6} className="text-emerald-400 animate-pulse" />
            <span>Uplink · Stable</span>
          </div>
          <div className="px-5 flex items-center gap-3 border-r border-white/10 text-emerald-400">
            <span className="text-white/30">MISSION</span>
            <span>{missionCode}</span>
          </div>
          <div className="hidden md:flex px-5 items-center gap-3 border-r border-white/10 text-white/50">
            <span className="text-white/30">COORD</span>
            <span>{coordinates}</span>
          </div>
          <div className="ml-auto px-5 flex items-center gap-2 text-white/50 border-l border-white/10">
            <TerminalIcon weight="bold" size={12} />
            <span>FEZCODEX/SERIES.sys</span>
          </div>
        </div>
        {/* Sub-bar: series title */}
        <div className="flex items-end justify-between px-8 py-5 border-t border-white/5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-1">
              Classified / Sequential Transmission
            </div>
            <h1 className="font-playfairDisplay uppercase text-4xl md:text-5xl tracking-tighter leading-none text-white">
              {seriesTitle}
              <span className="text-emerald-400">.</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <div className="text-right">
              <div className="text-white/30">Entries</div>
              <div className="text-2xl text-white font-playfairDisplay normal-case">
                {pad(seriesPosts.length, 2)}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-white/30">Active</div>
              <div className="text-2xl text-emerald-400 font-playfairDisplay normal-case">
                {activePost ? pad(activePost.seriesIndex ?? 1, 2) : '—'}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-white/30">Status</div>
              <div className="text-white">Online<BlinkingCursor /></div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─────────────────────────────────────────────────── */}
      <main className="relative z-20 flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* LEFT · MANIFEST TABLE */}
        <section className="flex-[1.25] min-w-0 flex flex-col min-h-0 border-r border-white/10">
          {/* Table header */}
          <div className="flex-shrink-0 flex items-center px-8 py-3 border-b border-white/10 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40 bg-black/40">
            <span className="w-10">Idx</span>
            <span className="w-28">Timestamp</span>
            <span className="flex-1">Title</span>
            <span className="w-28 hidden md:block">Category</span>
            <span className="w-20 text-right">State</span>
          </div>

          <ul className="overflow-y-auto flex-1 no-scrollbar">
            {seriesPosts.map((post, i) => {
              const idx = post.seriesIndex ?? (i + 1);
              const isActive = activePost?.slug === post.slug;
              return (
                <li key={post.slug}>
                  <Link
                    to={`/blog/series/${seriesSlug}/${post.slug}`}
                    onMouseEnter={() => setActivePost(post)}
                    onFocus={() => setActivePost(post)}
                    className={`group relative flex items-center px-8 py-5 border-b border-white/5 transition-colors ${
                      isActive ? 'bg-emerald-500/5' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Active indicator bar */}
                    <span
                      className={`absolute left-0 top-0 h-full w-0.5 transition-all ${
                        isActive ? 'bg-emerald-400' : 'bg-transparent group-hover:bg-white/20'
                      }`}
                    />
                    <span className={`w-10 font-mono text-xs tracking-wider ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                      {pad(idx, 2)}
                    </span>
                    <span className={`w-28 font-mono text-[11px] tracking-wider ${isActive ? 'text-white' : 'text-white/50'}`}>
                      {formatEpoch(post.updated || post.date)}
                    </span>
                    <span className="flex-1 pr-4">
                      <span className={`block font-arvo text-base leading-snug ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                        {post.title}
                      </span>
                    </span>
                    <span className="w-28 hidden md:flex items-center">
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                        isActive
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5'
                          : 'border-white/10 text-white/50'
                      }`}>
                        {post.category || 'Ep'}
                      </span>
                    </span>
                    <span className={`w-20 text-right font-mono text-[10px] uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                      {isActive ? '▶ Active' : 'Archived'}
                    </span>
                  </Link>
                </li>
              );
            })}
            {seriesPosts.length === 0 && (
              <li className="px-8 py-14 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                // No transmission archived under this identifier.
              </li>
            )}
          </ul>

          {/* Bottom progress/meta */}
          <div className="px-8 py-4 border-t border-white/10 bg-black/40 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-4">
            <span className="text-white/30">Integrity</span>
            <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-emerald-400" style={{ width: '100%' }} />
            </div>
            <span className="text-emerald-400">100%</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-white/50">{pad(seriesPosts.length, 3)} packets</span>
          </div>
        </section>

        {/* RIGHT · STAGE */}
        <section className="flex-1 min-w-0 relative min-h-0 overflow-hidden bg-neutral-950">
          <AnimatePresence mode="wait">
            {activePost && (
              <motion.div
                key={activePost.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Generative / image backdrop */}
                <div className="absolute inset-0 z-0">
                  {isPlaceholder(activePost) ? (
                    <GenerativeArt seed={activePost.title} className="w-full h-full opacity-60" />
                  ) : (
                    <img src={activePost.image} alt="" className="w-full h-full object-cover opacity-55" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  {/* Cross-hair corner ticks */}
                  {[['top-4 left-4', 'border-t border-l'], ['top-4 right-4', 'border-t border-r'], ['bottom-4 left-4', 'border-b border-l'], ['bottom-4 right-4', 'border-b border-r']].map(
                    ([pos, brd], i) => (
                      <span
                        key={i}
                        className={`absolute ${pos} w-8 h-8 ${brd} border-emerald-400/60`}
                      />
                    ),
                  )}
                </div>

                {/* Top label strip inside stage */}
                <div className="relative z-10 flex items-center justify-between px-8 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm font-mono text-[9px] uppercase tracking-[0.22em]">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CircleIcon weight="fill" size={6} className="animate-pulse" />
                    Live feed
                  </span>
                  <span className="text-white/40">
                    FRAME {pad(activePost.seriesIndex ?? 1, 2)} / {pad(seriesPosts.length, 2)}
                  </span>
                </div>

                {/* Body */}
                <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end p-8 lg:p-10 gap-6 overflow-hidden">
                  <div className="flex items-end gap-4">
                    <div className="font-playfairDisplay text-7xl leading-none text-emerald-400/80">
                      {pad(activePost.seriesIndex ?? 1, 2)}
                    </div>
                    <div className="pb-2 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                        Transmission · {formatEpoch(activePost.updated || activePost.date)}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-emerald-400 text-emerald-400 bg-emerald-400/5 self-start">
                        {activePost.category || 'Episode'}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-playfairDisplay text-3xl md:text-4xl leading-[1.05] tracking-tight text-white">
                    {activePost.title}
                  </h2>
                  <p className="font-arvo text-sm text-white/70 leading-relaxed max-w-lg">
                    {activePost.description ||
                      'Part of a sequential data stream. Analysis and implementation logs curated for technical review.'}
                  </p>

                  {/* Spec block */}
                  <div className="grid grid-cols-2 gap-x-6 max-w-lg">
                    <SpecRow label="Index" value={`${pad(activePost.seriesIndex ?? 1, 2)} / ${pad(seriesPosts.length, 2)}`} />
                    <SpecRow label="Mission" value={missionCode} />
                    <SpecRow label="Filed" value={formatEpoch(activePost.date)} />
                    <SpecRow label="Updated" value={formatEpoch(activePost.updated || activePost.date)} accent />
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <Link
                      to={`/blog/series/${seriesSlug}/${activePost.slug}`}
                      className="group inline-flex items-center gap-3 px-5 py-3 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-colors font-mono text-[11px] uppercase tracking-[0.22em]"
                    >
                      <BookOpenIcon weight="bold" size={14} />
                      <span>Access Episode</span>
                      <CaretRightIcon weight="bold" size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="flex-1 h-px bg-white/10" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      Enc · SHA256
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ─── BOTTOM STATUS / TICKER BAR ──────────────────────────── */}
      <footer className="relative z-20 h-10 border-t border-white/10 bg-black/80 flex items-stretch font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
        <div className="px-5 flex items-center border-r border-white/10 gap-2 text-emerald-400">
          <ShareNetworkIcon weight="bold" size={12} />
          <span>Tx · {missionCode}</span>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap"
            style={{ animation: 'brutalistTicker 42s linear infinite' }}
          >
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center gap-6 px-6 text-white/40">
                <span>▲ STREAM_OK</span>
                <span>// SERIES · {seriesTitle.toUpperCase()}</span>
                <span>// PACKETS · {pad(seriesPosts.length, 3)}</span>
                <span>// LAST · {activePost ? formatEpoch(activePost.updated || activePost.date) : '—'}</span>
                <span>// MISSION · {missionCode}</span>
                <span>// COORD · {coordinates}</span>
                <span>◆ FEZCODEX_OS v0.24.31</span>
              </span>
            ))}
          </div>
        </div>
        <div className="px-5 flex items-center border-l border-white/10 text-white/40">
          <span>cursor</span>
          <BlinkingCursor />
        </div>
      </footer>
    </div>
  );
};

export default BrutalistSeriesPage;
