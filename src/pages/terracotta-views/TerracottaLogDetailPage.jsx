import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  TerracottaStrip,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const CATEGORY_COLOR = {
  book: '#9E4A2F',
  movie: '#C96442',
  video: '#B88532',
  game: '#6B8E23',
  article: '#8A6A32',
  music: '#9E4A2F',
  series: '#B88532',
  food: '#C96442',
  websites: '#6B8E23',
  tools: '#2E2620',
  event: '#B88532',
};

const formatLong = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const TerracottaLogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const color = CATEGORY_COLOR[category?.toLowerCase()] || '#2E2620';

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
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={48} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Loading entry
          </span>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: '#F3ECE0' }}
      >
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/60">
          404 · entry not found
        </span>
        <Link
          to="/logs"
          className="font-fraunces italic text-[18px] text-[#9E4A2F] hover:text-[#C96442]"
        >
          ← Back to the catalogue
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
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left={`Folio VIII · ${category}`}
          center="A catalogued entry"
          right={`Slip · ${attributes.slug || slugId}`}
        />

        {/* hero */}
        <section className="pt-16 md:pt-24 pb-10">
          <Link
            to="/logs"
            className="inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors mb-10"
          >
            ← Catalogue
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 flex-wrap mb-6 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase">
              <span
                className="inline-flex items-center gap-2 px-2 py-1 border"
                style={{
                  color,
                  borderColor: color,
                  backgroundColor: `${color}10`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-[5px] h-[5px] rounded-full"
                  style={{ backgroundColor: color }}
                />
                {category}
              </span>
              {attributes.updated && (
                <span className="px-2 py-1 border border-[#1A161320] text-[#2E2620]/80">
                  revised · {formatLong(attributes.updated)}
                </span>
              )}
              <span className="text-[#2E2620]/60">
                logged · {formatLong(attributes.date)}
              </span>
            </div>

            <h1
              className="font-fraunces text-[44px] md:text-[96px] leading-[0.92] tracking-[-0.03em] text-[#1A1613] max-w-[18ch]"
              style={{
                fontVariationSettings:
                  '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
              }}
            >
              {attributes.title}
              <span
                aria-hidden="true"
                className="text-[#C96442]"
                style={{ fontVariationSettings: '"wght" 800' }}
              >
                .
              </span>
            </h1>
            {creator && (
              <div
                className="mt-4 font-fraunces italic text-[20px] md:text-[24px] text-[#2E2620]"
                style={{
                  fontVariationSettings:
                    '"opsz" 28, "SOFT" 100, "wght" 360',
                }}
              >
                by {creator}
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
                      style={{ color: i < rating ? '#B88532' : '#1A161325' }}
                    />
                  ))}
                </div>
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70">
                  {rating}/5 · plumb
                </span>
              </div>
            )}
          </motion.div>
        </section>

        {/* article + dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 pt-10 border-t border-[#1A161320]">
          <article
            className="prose prose-lg max-w-none font-fraunces
              prose-headings:font-fraunces prose-headings:italic prose-headings:tracking-tight prose-headings:text-[#1A1613]
              prose-p:text-[#2E2620] prose-p:leading-[1.65]
              prose-a:text-[#9E4A2F] prose-a:underline prose-a:decoration-[#C96442]/40 prose-a:underline-offset-4 hover:prose-a:decoration-[#C96442]
              prose-strong:text-[#1A1613] prose-strong:font-normal prose-strong:italic
              prose-blockquote:border-l-[3px] prose-blockquote:border-[#C96442] prose-blockquote:bg-[#E8DECE]/50 prose-blockquote:py-0.5 prose-blockquote:px-5 prose-blockquote:not-italic
              prose-code:text-[#9E4A2F] prose-code:font-mono prose-code:bg-[#C96442]/10 prose-code:px-1 prose-code:py-0.5"
            style={{
              fontVariationSettings:
                '"opsz" 24, "SOFT" 50, "WONK" 0, "wght" 400',
            }}
          >
            <MarkdownContent
              content={body}
              components={{
                a: (p) => (
                  <MarkdownLink
                    {...p}
                    className="text-[#9E4A2F] underline decoration-[#C96442]/40 underline-offset-4 hover:decoration-[#C96442]"
                  />
                ),
              }}
            />
          </article>

          <aside className="lg:sticky lg:top-24 self-start flex flex-col gap-6">
            <div className="border border-[#1A161320] p-6 bg-[#F3ECE0] relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: color }}
              />
              <h3 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-5 pb-3 border-b border-[#1A161320]">
                Manifest
              </h3>
              <div className="flex flex-col gap-4">
                <TerracottaSpec label="Category" value={attributes.category} />
                {creator && (
                  <TerracottaSpec label="Creator" value={creator} />
                )}
                {attributes.platform && (
                  <TerracottaSpec label="Platform" value={attributes.platform} />
                )}
                {attributes.source && !attributes.platform && (
                  <TerracottaSpec label="Source" value={attributes.source} />
                )}
                {attributes.year && (
                  <TerracottaSpec label="Year" value={attributes.year} />
                )}
                {attributes.updated && (
                  <TerracottaSpec
                    label="Updated"
                    value={formatLong(attributes.updated)}
                  />
                )}
                <TerracottaSpec
                  label="Dated"
                  value={formatLong(attributes.date)}
                />
                {rating > 0 && (
                  <TerracottaSpec
                    label="Rating"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              size={11}
                              weight={i < rating ? 'fill' : 'regular'}
                              style={{ color: i < rating ? '#B88532' : '#1A161325' }}
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
                  className="mt-6 flex items-center justify-between gap-3 p-3 border border-[#1A161320] hover:border-[#C96442] transition-colors group"
                >
                  <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#1A1613]">
                    External source
                  </span>
                  <ArrowUpRightIcon
                    size={14}
                    weight="bold"
                    className="text-[#9E4A2F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              )}
            </div>

            {attributes.tags && attributes.tags.length > 0 && (
              <div className="border border-dashed border-[#1A161320] p-6">
                <h4 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] uppercase text-[#2E2620]/80 mb-3">
                  Cross-references
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {attributes.tags.map((t) => (
                    <span
                      key={t}
                      className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#2E2620]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>
                {category} · slip {attributes.slug}
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TerracottaLogDetailPage;
