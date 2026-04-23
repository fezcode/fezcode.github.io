import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
  FeatherIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import TerracottaGenerativeArt from '../../components/TerracottaGenerativeArt';

const hashString = (s) => {
  let h = 0x9e3779b9;
  for (let i = 0; i < (s || '').length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
  }
  return (h >>> 0);
};

const toRoman = (num) => {
  const n = Math.max(0, Math.min(3999, parseInt(num, 10) || 0));
  if (n === 0) return '—';
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let v = n; let out = '';
  for (const [k, r] of map) while (v >= k) { out += r; v -= k; }
  return out;
};

const formatFolio = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const Colophon = ({ children }) => (
  <span className="font-ibm-plex-mono text-[10px] uppercase tracking-[0.28em] text-[#1A1613]/50">
    {children}
  </span>
);

const Dividers = () => (
  <div className="flex items-center gap-2 text-[#C96442]/50 my-3">
    <span className="h-px flex-1 bg-[#1A161320]" />
    <span className="text-[10px]">❧</span>
    <span className="h-px flex-1 bg-[#1A161320]" />
  </div>
);

const TerracottaSeriesPage = () => {
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

  const volumeNumeral = useMemo(() => {
    const h = hashString(seriesSlug || '');
    return toRoman((h % 24) + 1);
  }, [seriesSlug]);

  const signature = useMemo(() => {
    const h = hashString(seriesSlug || '');
    const letters = 'ABCDEFGHJKLMNPQRSTVWXYZ';
    return [0, 1, 2].map((i) => letters[(h >> (i * 5)) & 0x1f % letters.length]).join('');
  }, [seriesSlug]);

  const isPlaceholder = (p) => !p?.image || p.image.includes('placeholder');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-progress origin-left" />
          </div>
          <Colophon>Loading · volume</Colophon>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3ECE0] text-[#1A1613] flex flex-col selection:bg-[#C96442]/25 overflow-hidden relative" style={{ height: 'calc(100svh - 64px)' }}>
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`A bound collection of writings in the ${seriesTitle} series.`}
      />

      <style>{`
        @keyframes tcGrain { 0%{transform:translate(0,0)} 25%{transform:translate(-2%,1%)} 50%{transform:translate(1%,-2%)} 75%{transform:translate(-1%,-1%)} 100%{transform:translate(0,0)} }
        .tc-grain::before{
          content:'';position:absolute;inset:-10%;pointer-events:none;z-index:0;
          background-image:radial-gradient(#1A161310 1px, transparent 1px);
          background-size:3px 3px;
          opacity:.35;
          animation:tcGrain 8s steps(4) infinite;
        }
      `}</style>

      {/* ─── TOP CHROME ───────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-[#1A161318] flex items-stretch font-ibm-plex-mono text-[10px] uppercase tracking-[0.28em] text-[#1A1613]/55">
        <Link
          to="/blog"
          className="px-6 flex items-center gap-2 border-r border-[#1A161318] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors h-12"
        >
          <ArrowLeftIcon weight="bold" size={12} />
          <span>The Archive</span>
        </Link>
        <div className="hidden md:flex px-6 items-center gap-3 border-r border-[#1A161318] text-[#1A1613]/40">
          <span>Fezcodex</span>
          <span>·</span>
          <span>Volumes</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex px-6 items-center gap-3 border-l border-[#1A161318] text-[#1A1613]/40">
          <span>Signature</span>
          <span className="text-[#C96442]">{signature}</span>
          <span>·</span>
          <span>fol. {toRoman(seriesPosts.length)}</span>
        </div>
        <div className="px-6 flex items-center gap-2 border-l border-[#1A161318] text-[#1A1613]/40">
          <FeatherIcon weight="regular" size={14} />
          <span>MMXXVI</span>
        </div>
      </header>

      {/* ─── MAIN SPREAD ──────────────────────────────────────────── */}
      <main className="relative flex-1 min-h-0 flex flex-col lg:flex-row tc-grain">
        {/* LEFT · The Index page */}
        <section className="flex-[1.1] min-w-0 relative z-10 flex flex-col min-h-0 border-r border-[#1A161318] bg-[#F3ECE0]">
          {/* Frontispiece */}
          <div className="px-10 md:px-16 pt-12 pb-6">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <Colophon>Volume {volumeNumeral} · A Bound Series</Colophon>
                <h1 className="font-fraunces italic text-5xl md:text-7xl leading-[0.95] tracking-tight mt-2 text-[#1A1613]">
                  {seriesTitle}
                  <span className="text-[#C96442]">.</span>
                </h1>
                <p className="font-fraunces italic text-[#1A1613]/60 text-lg mt-3 max-w-md">
                  — being a sequence of writings, set forth in {toRoman(seriesPosts.length)} parts
                  and imprinted in terracotta ink.
                </p>
              </div>
              <div className="hidden md:block text-right shrink-0">
                <Colophon>Parts</Colophon>
                <div className="font-fraunces italic text-5xl leading-none text-[#C96442] mt-1">
                  {toRoman(seriesPosts.length)}
                </div>
                <Colophon>{String(seriesPosts.length).padStart(2, '0')} folios</Colophon>
              </div>
            </div>
            <Dividers />
            <div className="flex items-center justify-between">
              <Colophon>— Contents —</Colophon>
              <Colophon>Turn page ▸</Colophon>
            </div>
          </div>

          {/* Contents list */}
          <ol className="overflow-y-auto flex-1 no-scrollbar px-10 md:px-16 pb-8">
            {seriesPosts.map((post, i) => {
              const idx = post.seriesIndex ?? (i + 1);
              const isActive = activePost?.slug === post.slug;
              return (
                <li key={post.slug}>
                  <Link
                    to={`/blog/series/${seriesSlug}/${post.slug}`}
                    onMouseEnter={() => setActivePost(post)}
                    onFocus={() => setActivePost(post)}
                    className={`group relative flex items-baseline gap-4 py-4 border-b border-dotted border-[#1A161320] transition-colors ${
                      isActive ? 'text-[#1A1613]' : 'text-[#1A1613]/80 hover:text-[#1A1613]'
                    }`}
                  >
                    {/* Active marker */}
                    <span
                      className={`absolute -left-5 top-1/2 -translate-y-1/2 font-fraunces italic text-xl transition-opacity ${
                        isActive ? 'opacity-100 text-[#C96442]' : 'opacity-0'
                      }`}
                      aria-hidden
                    >
                      ❦
                    </span>

                    {/* Roman numeral */}
                    <span
                      className={`font-fraunces italic text-xl w-14 shrink-0 tabular-nums ${
                        isActive ? 'text-[#C96442]' : 'text-[#1A1613]/45 group-hover:text-[#C96442]'
                      }`}
                    >
                      {toRoman(idx).padEnd(5, ' ')}
                    </span>

                    {/* Title (truncated) with leader dots */}
                    <span className="flex-1 min-w-0 flex items-baseline overflow-hidden">
                      <span className="font-fraunces italic text-xl md:text-2xl truncate">
                        {post.title}
                      </span>
                      <span
                        aria-hidden
                        className="flex-1 mx-2 translate-y-[-2px] truncate text-[#1A161330] select-none"
                        style={{ letterSpacing: '2px' }}
                      >
                        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                      </span>
                    </span>

                    {/* Category badge */}
                    <span className="hidden md:inline-block shrink-0">
                      <span
                        className={`px-2 py-0.5 font-ibm-plex-mono text-[9px] uppercase tracking-[0.22em] border ${
                          isActive
                            ? 'border-[#C96442] text-[#C96442] bg-[#C96442]/5'
                            : 'border-[#1A161330] text-[#1A1613]/55'
                        }`}
                      >
                        {post.category || 'Piece'}
                      </span>
                    </span>

                    {/* Folio number */}
                    <span
                      className={`font-ibm-plex-mono text-[10px] uppercase tracking-[0.22em] w-20 text-right shrink-0 ${
                        isActive ? 'text-[#C96442]' : 'text-[#1A1613]/40'
                      }`}
                    >
                      fol. {toRoman(idx)}
                    </span>
                  </Link>
                </li>
              );
            })}
            {seriesPosts.length === 0 && (
              <li className="py-16 text-center font-fraunces italic text-[#1A1613]/50">
                — the volume is empty —
              </li>
            )}
          </ol>

          {/* Index footer */}
          <div className="px-10 md:px-16 py-5 border-t border-[#1A161318] flex items-center justify-between bg-[#EDE4D1]">
            <Colophon>Set in Fraunces · Printed in Terracotta</Colophon>
            <Colophon>End of Contents ⁘</Colophon>
          </div>
        </section>

        {/* RIGHT · Featured spread */}
        <section className="flex-1 min-w-0 relative z-10 min-h-0 overflow-hidden bg-[#1A1613] text-[#F3ECE0]">
          <AnimatePresence mode="wait">
            {activePost && (
              <motion.article
                key={activePost.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Backdrop art */}
                <div className="absolute inset-0 z-0">
                  {isPlaceholder(activePost) ? (
                    <TerracottaGenerativeArt
                      seed={activePost.title}
                      className="w-full h-full opacity-75"
                    />
                  ) : (
                    <img
                      src={activePost.image}
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1613] via-[#1A1613]/55 to-transparent" />
                </div>

                {/* Top spread label */}
                <div className="relative z-10 flex items-stretch font-ibm-plex-mono text-[10px] uppercase tracking-[0.28em] border-b border-[#F3ECE0]/15">
                  <div className="px-6 py-3 flex items-center gap-2 text-[#C96442] border-r border-[#F3ECE0]/15">
                    <span className="w-1 h-1 rounded-full bg-[#C96442]" />
                    <span>Now Reading</span>
                  </div>
                  <div className="px-6 py-3 text-[#F3ECE0]/60 border-r border-[#F3ECE0]/15">
                    Part {toRoman(activePost.seriesIndex ?? 1)} of {toRoman(seriesPosts.length)}
                  </div>
                  <div className="flex-1" />
                  <div className="px-6 py-3 text-[#F3ECE0]/40">
                    fol. {toRoman(activePost.seriesIndex ?? 1)}
                  </div>
                </div>

                {/* Body */}
                <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end px-8 md:px-12 pb-10 pt-8 gap-6">
                  {/* Eyebrow with part numeral + date */}
                  <div className="flex items-end gap-4">
                    <div className="font-fraunces italic text-8xl leading-[0.8] text-[#C96442]">
                      {toRoman(activePost.seriesIndex ?? 1)}
                    </div>
                    <div className="pb-1 flex flex-col gap-1">
                      <span className="font-ibm-plex-mono text-[10px] uppercase tracking-[0.25em] text-[#F3ECE0]/55 flex items-center gap-2">
                        <CalendarIcon size={12} />
                        {formatFolio(activePost.updated || activePost.date)}
                      </span>
                      <span className="font-ibm-plex-mono text-[10px] uppercase tracking-[0.25em] text-[#C96442] flex items-center gap-2">
                        <TagIcon size={12} />
                        {activePost.category || 'Piece'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-fraunces italic text-4xl md:text-5xl leading-[1.02] tracking-tight text-[#F3ECE0] max-w-xl">
                    {activePost.title}
                  </h2>

                  {/* Description with drop cap */}
                  <p className="max-w-xl font-fraunces text-lg leading-relaxed text-[#F3ECE0]/80">
                    <span className="float-left font-fraunces italic text-6xl leading-[0.85] text-[#C96442] pr-3 pt-1">
                      {(activePost.description || 'A')[0]}
                    </span>
                    {(activePost.description ||
                      'A sequential piece — reflections and logs bound as part of this volume.').slice(1)}
                  </p>

                  {/* Meta rules */}
                  <div className="flex items-center gap-4 text-[#F3ECE0]/40 font-ibm-plex-mono text-[10px] uppercase tracking-[0.25em]">
                    <span>Fezcodex</span>
                    <span className="h-px flex-1 bg-[#F3ECE0]/15" />
                    <span>Volume {volumeNumeral}</span>
                    <span className="h-px flex-1 bg-[#F3ECE0]/15" />
                    <span>Sig {signature}</span>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4 mt-2">
                    <Link
                      to={`/blog/series/${seriesSlug}/${activePost.slug}`}
                      className="group inline-flex items-center gap-3 border border-[#C96442] text-[#C96442] hover:bg-[#C96442] hover:text-[#F3ECE0] transition-colors px-5 py-3 font-ibm-plex-mono text-[11px] uppercase tracking-[0.28em]"
                    >
                      <BookOpenIcon weight="bold" size={14} />
                      <span>Open the piece</span>
                    </Link>
                    <span className="font-fraunces italic text-[#F3ECE0]/40">
                      — continued overleaf —
                    </span>
                  </div>
                </div>

                {/* Stage corner flourishes */}
                <span className="absolute top-3 right-3 font-fraunces italic text-[#C96442] text-lg z-10" aria-hidden>❧</span>
                <span className="absolute bottom-3 left-3 font-fraunces italic text-[#C96442]/60 text-lg z-10" aria-hidden>⁘</span>
              </motion.article>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ─── BOTTOM COLOPHON ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#1A161318] bg-[#EDE4D1] flex items-stretch h-9 font-ibm-plex-mono text-[10px] uppercase tracking-[0.28em] text-[#1A1613]/50">
        <div className="px-6 flex items-center border-r border-[#1A161318] text-[#C96442]">
          <span>Vol. {volumeNumeral}</span>
        </div>
        <div className="hidden md:flex px-6 items-center border-r border-[#1A161318]">
          <span>{seriesTitle}</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex px-6 items-center border-l border-[#1A161318]">
          <span>Imprinted · MMXXVI</span>
        </div>
        <div className="px-6 flex items-center border-l border-[#1A161318]">
          <span className="text-[#C96442]">ƒ</span>
          <span className="ml-2">Fezcodex</span>
        </div>
      </footer>
    </div>
  );
};

export default TerracottaSeriesPage;
