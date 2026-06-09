import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistSpec,
  MistColophon,
} from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

const CATEGORY_TINT = {
  book: '#5F837B',
  movie: '#8FA8BC',
  video: '#7E99A8',
  game: '#6F9184',
  article: '#8A9894',
  music: '#7C8FA0',
  series: '#7E99A8',
  food: '#8FA89E',
  websites: '#6F9184',
  tools: '#5C6B67',
  event: '#7C8FA0',
  quote: '#8FA8BC',
};

const formatLong = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toLowerCase();

const MistLogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const tint = CATEGORY_TINT[category?.toLowerCase()] || '#5C6B67';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/logs/${category}/${category}.piml`);
        if (!res.ok) {
          if (!cancelled) setLog(null);
          return;
        }
        const txt = await res.text();
        const data = piml.parse(txt);
        const meta = (data.logs || []).find((l) => l.slug === slugId);
        if (!meta) {
          if (!cancelled) setLog(null);
          return;
        }
        let body = meta.description || '';
        try {
          const r = await fetch(`/logs/${category}/${slugId}.txt`);
          if (r.ok) body = await r.text();
        } catch (e) {
          // ignore
        }
        if (!cancelled) setLog({ attributes: meta, body });
      } catch (e) {
        if (!cancelled) setLog(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, slugId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-6">
          <MistOrb size={64} breathe />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
            condensing…
          </span>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <MistOrb size={48} breathe={false} className="opacity-60" />
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
          404 · lost to the fog
        </span>
        <Link
          to="/logs"
          className="font-instr-serif italic text-[19px] text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
        >
          ← back to the catalogue
        </Link>
      </div>
    );
  }

  const { attributes, body } = log;
  const creator =
    attributes.author ||
    attributes.director ||
    attributes.artist ||
    attributes.creator ||
    attributes.by ||
    attributes.studio;
  const rating = Number(attributes.rating) || 0;

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left={`drift viii · ${category}`}
          center="a kept entry — read gently"
          right={`slip · ${attributes.slug || slugId}`}
        />

        {/* hero */}
        <section className="pt-16 md:pt-24 pb-10">
          <Link
            to="/logs"
            className="inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894] hover:text-[#5F837B] transition-colors duration-[250ms] mb-10"
          >
            ← the catalogue
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2.5 flex-wrap mb-6 font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase">
              <span
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ color: tint, backgroundColor: `${tint}1A` }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-[5px] h-[5px] rounded-full"
                  style={{
                    backgroundColor: tint,
                    boxShadow: `0 0 8px 1px ${tint}66`,
                  }}
                />
                {category}
              </span>
              {attributes.updated && (
                <span className="px-2.5 py-1 rounded-full bg-white/40 backdrop-blur-sm text-[#5C6B67]">
                  revised · {formatLong(attributes.updated)}
                </span>
              )}
              <span className="text-[#8A9894]">
                kept · {formatLong(attributes.date)}
              </span>
            </div>

            <h1 className="font-instr-serif font-normal text-[44px] md:text-[88px] leading-[0.96] tracking-[-0.02em] text-[#3C4845] max-w-[18ch]">
              {attributes.title}
            </h1>
            {creator && (
              <div className="mt-4 font-instr-serif italic text-[21px] md:text-[25px] text-[#5C6B67]">
                by <em className="italic text-[#5F837B]">{creator}</em>
              </div>
            )}

            {rating > 0 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size={18}
                      weight={i < rating ? 'fill' : 'regular'}
                      style={{
                        color: i < rating ? '#8FA8BC' : 'rgba(60,72,69,0.18)',
                      }}
                    />
                  ))}
                </div>
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#8A9894]">
                  {rating}/5 · how much stayed
                </span>
              </div>
            )}
          </motion.div>
        </section>

        <MistHorizon />

        {/* article + manifest */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 pt-10">
          <article
            className="prose prose-lg max-w-none font-outfit font-light
              prose-headings:font-instr-serif prose-headings:font-normal prose-headings:italic prose-headings:tracking-tight prose-headings:text-[#3C4845]
              prose-p:text-[#5C6B67] prose-p:leading-[1.75] prose-p:font-light
              prose-a:text-[#5F837B] prose-a:underline prose-a:decoration-[#8FA8BC]/40 prose-a:underline-offset-4 hover:prose-a:decoration-[#5F837B]
              prose-strong:text-[#3C4845] prose-strong:font-normal
              prose-em:text-[#5F837B]
              prose-blockquote:border-l-2 prose-blockquote:border-[#8FA8BC]/60 prose-blockquote:bg-white/40 prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-2xl prose-blockquote:py-0.5 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-[#5C6B67]
              prose-code:text-[#5F837B] prose-code:font-mono prose-code:bg-[#5F837B]/10 prose-code:rounded prose-code:px-1 prose-code:py-0.5
              prose-li:text-[#5C6B67]"
          >
            <MarkdownContent
              content={body}
              components={{
                a: (p) => (
                  <MarkdownLink
                    {...p}
                    className="text-[#5F837B] underline decoration-[#8FA8BC]/40 underline-offset-4 hover:decoration-[#5F837B] transition-colors duration-[250ms]"
                  />
                ),
              }}
            />
          </article>

          <aside className="lg:sticky lg:top-24 self-start flex flex-col gap-6">
            <div className="relative rounded-2xl bg-white/50 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] p-7 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tint}99, transparent)`,
                }}
              />
              <h3 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] lowercase text-[#5F837B] mb-4">
                what remains
              </h3>
              <MistHorizon tint="rgba(60,72,69,0.12)" />
              <div className="flex flex-col gap-4 pt-5">
                <MistSpec
                  label="category"
                  value={(attributes.category || category || '').toLowerCase()}
                />
                {creator && <MistSpec label="creator" value={creator} />}
                {attributes.platform && (
                  <MistSpec label="platform" value={attributes.platform} />
                )}
                {attributes.source && !attributes.platform && (
                  <MistSpec label="source" value={attributes.source} />
                )}
                {attributes.year && (
                  <MistSpec label="year" value={attributes.year} />
                )}
                {attributes.updated && (
                  <MistSpec
                    label="revised"
                    value={formatLong(attributes.updated)}
                  />
                )}
                <MistSpec label="kept on" value={formatLong(attributes.date)} />
                {rating > 0 && (
                  <MistSpec
                    label="rating"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              size={11}
                              weight={i < rating ? 'fill' : 'regular'}
                              style={{
                                color:
                                  i < rating
                                    ? '#8FA8BC'
                                    : 'rgba(60,72,69,0.18)',
                              }}
                            />
                          ))}
                        </span>
                        <span>{rating}/5</span>
                      </span>
                    }
                  />
                )}
              </div>
              {attributes.link && (
                <a
                  href={attributes.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-between gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/70 transition-colors duration-[250ms] group"
                >
                  <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase text-[#5C6B67] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
                    where it surfaced
                  </span>
                  <ArrowUpRightIcon
                    size={14}
                    weight="regular"
                    className="text-[#5F837B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-[250ms]"
                  />
                </a>
              )}
            </div>

            {attributes.tags && attributes.tags.length > 0 && (
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-6">
                <h4 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] lowercase text-[#8A9894] mb-3">
                  drifts alongside
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {attributes.tags.map((t) => (
                    <span
                      key={t}
                      className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase px-2 py-0.5 rounded-full bg-white/50 text-[#5C6B67]"
                    >
                      #{String(t).toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode / a. s. bulbul</span>
              <span>
                {category} · slip {attributes.slug} — the fog keeps the rest
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistLogDetailPage;
