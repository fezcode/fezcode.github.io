import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
  CloudIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { MistVeil, MistOrb, MistHorizon } from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

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
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ];
  let v = n; let out = '';
  for (const [k, r] of map) while (v >= k) { out += r; v -= k; }
  return out;
};

const formatDrift = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toLowerCase();
};

const Whisper = ({ children, className = '' }) => (
  <span
    className={`font-ibm-plex-mono text-[10px] lowercase tracking-[0.26em] text-[#8A9894] ${className}`}
  >
    {children}
  </span>
);

const HorizonBreak = () => (
  <div className="flex items-center gap-3 my-3" aria-hidden="true">
    <MistHorizon />
    <span className="text-[#8FA8BC] text-[9px] shrink-0">◦</span>
    <MistHorizon />
  </div>
);

const MistSeriesPage = () => {
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
    const letters = 'abcdefghjklmnpqrstvwxyz';
    return [0, 1, 2].map((i) => letters[(h >> (i * 5)) & 0x1f % letters.length]).join('');
  }, [seriesSlug]);

  const isPlaceholder = (p) => !p?.image || p.image.includes('placeholder');

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center text-[#3C4845]"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-6">
          <MistOrb size={64} breathe />
          <Whisper>condensing…</Whisper>
        </div>
      </div>
    );
  }

  return (
    <div
      className="text-[#3C4845] font-outfit flex flex-col selection:bg-[#8FA8BC]/30 selection:text-[#3C4845] overflow-hidden relative"
      style={{
        height: 'calc(100svh - 64px)',
        background: '#EEF2F1',
        backgroundImage: FOG_GRADIENT,
      }}
    >
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`A drifting sequence of writings in the ${seriesTitle} series.`}
      />
      <MistVeil />

      {/* ─── top chrome ───────────────────────────────────────────── */}
      <header className="relative z-10 flex items-stretch font-ibm-plex-mono text-[10px] lowercase tracking-[0.26em] text-[#8A9894]">
        <Link
          to="/blog"
          className="px-6 flex items-center gap-2 hover:text-[#5F837B] transition-colors duration-[250ms] h-12"
        >
          <ArrowLeftIcon weight="regular" size={12} />
          <span>the archive</span>
        </Link>
        <div className="hidden md:flex px-6 items-center gap-3">
          <span>fezcodex</span>
          <span className="opacity-50">·</span>
          <span>drifts</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex px-6 items-center gap-3">
          <span>signature</span>
          <span className="text-[#5F837B]">{signature}</span>
          <span className="opacity-50">·</span>
          <span>fol. {toRoman(seriesPosts.length)}</span>
        </div>
        <div className="px-6 flex items-center gap-2">
          <CloudIcon weight="regular" size={14} className="text-[#8FA8BC]" />
          <span>mmxxvi</span>
        </div>
      </header>
      <MistHorizon className="relative z-10" />

      {/* ─── main spread ──────────────────────────────────────────── */}
      <main className="relative flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* left · the contents page */}
        <section className="flex-[1.1] min-w-0 relative z-10 flex flex-col min-h-0">
          {/* frontispiece */}
          <div className="px-10 md:px-16 pt-12 pb-6">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <Whisper className="text-[#5F837B]">
                  drift {volumeNumeral} — a bound sequence
                </Whisper>
                <motion.h1
                  initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9 }}
                  className="font-instr-serif font-normal text-5xl md:text-7xl leading-[0.95] tracking-[-0.015em] mt-2 text-[#3C4845]"
                >
                  {seriesTitle}
                </motion.h1>
                <p className="font-instr-serif italic text-[#5C6B67] text-lg mt-3 max-w-md">
                  — a sequence of writings in {toRoman(seriesPosts.length)}{' '}
                  parts, <em className="text-[#5F837B]">kept while waking</em>;
                  the fog keeps the rest.
                </p>
              </div>
              <div className="hidden md:block text-right shrink-0">
                <Whisper>parts</Whisper>
                <div className="font-instr-serif italic text-5xl leading-none text-[#5F837B] mt-1">
                  {toRoman(seriesPosts.length)}
                </div>
                <Whisper>{String(seriesPosts.length).padStart(2, '0')} folios</Whisper>
              </div>
            </div>
            <HorizonBreak />
            <div className="flex items-center justify-between">
              <Whisper>— contents —</Whisper>
              <Whisper>drift on ▸</Whisper>
            </div>
          </div>

          {/* contents list */}
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
                    className={`group relative flex items-baseline gap-4 py-4 border-b border-[#3C4845]/10 transition-colors duration-[250ms] ${
                      isActive ? 'text-[#3C4845]' : 'text-[#5C6B67] hover:text-[#3C4845]'
                    }`}
                  >
                    {/* active marker — a small glow surfacing */}
                    <span
                      className={`absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-opacity duration-[250ms] ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background:
                          'radial-gradient(circle at 40% 35%, #FFFFFF 0%, #8FA8BC 100%)',
                        boxShadow: '0 0 10px 2px rgba(143,168,188,0.5)',
                      }}
                      aria-hidden
                    />

                    {/* roman numeral */}
                    <span
                      className={`font-instr-serif italic text-xl w-14 shrink-0 tabular-nums transition-colors duration-[250ms] ${
                        isActive ? 'text-[#5F837B]' : 'text-[#8A9894] group-hover:text-[#5F837B]'
                      }`}
                    >
                      {toRoman(idx)}
                    </span>

                    {/* title with fading leader */}
                    <span className="flex-1 min-w-0 flex items-baseline overflow-hidden">
                      <span className="font-instr-serif text-xl md:text-2xl truncate">
                        {post.title}
                      </span>
                      <span
                        aria-hidden
                        className="flex-1 mx-3 h-px self-center"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(60,72,69,0.18), transparent)',
                        }}
                      />
                    </span>

                    {/* category whisper */}
                    <span className="hidden md:inline-block shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full font-ibm-plex-mono text-[9px] lowercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-[250ms] ${
                          isActive
                            ? 'bg-[#5F837B]/15 text-[#5F837B]'
                            : 'bg-white/40 text-[#8A9894]'
                        }`}
                      >
                        {(post.category || 'piece').toLowerCase()}
                      </span>
                    </span>

                    {/* folio number */}
                    <span
                      className={`font-ibm-plex-mono text-[10px] lowercase tracking-[0.2em] w-20 text-right shrink-0 transition-colors duration-[250ms] ${
                        isActive ? 'text-[#5F837B]' : 'text-[#8A9894]'
                      }`}
                    >
                      fol. {toRoman(idx)}
                    </span>
                  </Link>
                </li>
              );
            })}
            {seriesPosts.length === 0 && (
              <li className="py-16 text-center font-instr-serif italic text-[#8A9894]">
                — the fog kept this one entirely —
              </li>
            )}
          </ol>

          {/* index footer */}
          <div className="px-10 md:px-16 py-5 bg-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Whisper>set in instrument serif · read by half-light</Whisper>
              <Whisper>end of contents ◦</Whisper>
            </div>
          </div>
        </section>

        {/* vertical horizon between the two panes */}
        <div
          aria-hidden="true"
          className="hidden lg:block w-px self-stretch"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(60,72,69,0.18), transparent)',
          }}
        />

        {/* right · the surfacing spread */}
        <section className="flex-1 min-w-0 relative z-10 min-h-0 overflow-hidden bg-[#DFE5E3]">
          <AnimatePresence mode="wait">
            {activePost && (
              <motion.article
                key={activePost.slug}
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* backdrop — every image seen through fog */}
                <div className="absolute inset-0 z-0">
                  {isPlaceholder(activePost) ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#D2DBD8]">
                      <MistOrb size={260} breathe />
                    </div>
                  ) : (
                    <img
                      src={activePost.image}
                      alt=""
                      className="w-full h-full object-cover opacity-50"
                      style={{ filter: 'blur(2px) saturate(0.6)' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#EEF2F1] via-[#EEF2F1]/70 to-[#EEF2F1]/20" />
                </div>

                {/* top spread label */}
                <div className="relative z-10 flex items-stretch font-ibm-plex-mono text-[10px] lowercase tracking-[0.26em]">
                  <div className="px-6 py-3 flex items-center gap-2 text-[#5F837B]">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: '#8FA8BC',
                        boxShadow: '0 0 8px 2px rgba(143,168,188,0.5)',
                      }}
                    />
                    <span>now surfacing</span>
                  </div>
                  <div className="px-6 py-3 text-[#5C6B67]">
                    part {toRoman(activePost.seriesIndex ?? 1)} of {toRoman(seriesPosts.length)}
                  </div>
                  <div className="flex-1" />
                  <div className="px-6 py-3 text-[#8A9894]">
                    fol. {toRoman(activePost.seriesIndex ?? 1)}
                  </div>
                </div>
                <MistHorizon className="relative z-10" />

                {/* body */}
                <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end px-8 md:px-12 pb-10 pt-8 gap-6">
                  {/* eyebrow with part numeral + date */}
                  <div className="flex items-end gap-4">
                    <div className="font-instr-serif italic text-8xl leading-[0.8] text-[#5F837B]">
                      {toRoman(activePost.seriesIndex ?? 1)}
                    </div>
                    <div className="pb-1 flex flex-col gap-1">
                      <span className="font-ibm-plex-mono text-[10px] lowercase tracking-[0.24em] text-[#5C6B67] flex items-center gap-2">
                        <CalendarIcon size={12} />
                        {formatDrift(activePost.updated || activePost.date)}
                      </span>
                      <span className="font-ibm-plex-mono text-[10px] lowercase tracking-[0.24em] text-[#5F837B] flex items-center gap-2">
                        <TagIcon size={12} />
                        {(activePost.category || 'piece').toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* title */}
                  <h2 className="font-instr-serif font-normal text-4xl md:text-5xl leading-[1.02] tracking-[-0.015em] text-[#3C4845] max-w-xl">
                    {activePost.title}
                  </h2>

                  {/* description on a veil */}
                  <p className="max-w-xl font-outfit font-light text-lg leading-relaxed text-[#5C6B67] rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] p-5">
                    {activePost.description ||
                      'a sequential piece — half-remembered, half-imagined, bound into this drift.'}
                  </p>

                  {/* meta rules */}
                  <div className="flex items-center gap-4 text-[#8A9894] font-ibm-plex-mono text-[10px] lowercase tracking-[0.24em]">
                    <span>fezcodex</span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(60,72,69,0.18), transparent)',
                      }}
                    />
                    <span>drift {volumeNumeral}</span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(60,72,69,0.18), transparent)',
                      }}
                    />
                    <span>sig {signature}</span>
                  </div>

                  {/* cta */}
                  <div className="flex items-center gap-4 mt-2">
                    <Link
                      to={`/blog/series/${seriesSlug}/${activePost.slug}`}
                      className="group inline-flex items-center gap-3 rounded-full bg-[#5F837B] text-[#EEF2F1] hover:bg-[#3C4845] transition-colors duration-[250ms] px-6 py-3 font-ibm-plex-mono text-[11px] lowercase tracking-[0.26em] shadow-[0_8px_24px_rgba(95,131,123,0.35)]"
                    >
                      <BookOpenIcon weight="regular" size={14} />
                      <span>open the piece</span>
                    </Link>
                    <span className="font-instr-serif italic text-[#8A9894]">
                      — continued through the fog —
                    </span>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ─── bottom colophon ─────────────────────────────────────── */}
      <MistHorizon className="relative z-10" />
      <footer className="relative z-10 bg-white/30 backdrop-blur-sm flex items-stretch h-9 font-ibm-plex-mono text-[10px] lowercase tracking-[0.26em] text-[#8A9894]">
        <div className="px-6 flex items-center text-[#5F837B]">
          <span>drift {volumeNumeral}</span>
        </div>
        <div className="hidden md:flex px-6 items-center">
          <span>{seriesTitle}</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex px-6 items-center">
          <span>condensed · mmxxvi</span>
        </div>
        <div className="px-6 flex items-center">
          <span className="text-[#5F837B]">ƒ</span>
          <span className="ml-2">fezcodex</span>
        </div>
      </footer>
    </div>
  );
};

export default MistSeriesPage;
