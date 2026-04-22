import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  PushPinIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import {
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

/**
 * Pinned instrument card — bone paper, hairline border, plumb-bob icon block.
 *
 *   ┌───────────────────────────┐
 *   │ No.01        /apps/...    │
 *   │                           │
 *   │   ▼ Icon      Title       │
 *   │              kicker      │
 *   │                           │
 *   │ ─────────────────────     │
 *   │ description line...       │
 *   │ OPEN INSTRUMENT  →        │
 *   └───────────────────────────┘
 */
const PinnedCard = ({ app, index }) => {
  const Icon = appIcons[app.icon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className="group relative border border-[#1A161320] bg-[#F3ECE0] hover:border-[#1A1613]/40 hover:bg-[#E8DECE]/30 transition-all overflow-hidden"
    >
      <Link to={app.to} className="block p-7 h-full">
        {/* top strip — kicker + path */}
        <div className="flex items-center justify-between pb-5 border-b border-dashed border-[#1A161320] font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/80">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[5px] h-[5px] rounded-full bg-[#C96442]"
            />
            No. {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[#2E2620]/50 truncate max-w-[50%]">
            {app.to}
          </span>
        </div>

        {/* body */}
        <div className="pt-6 grid grid-cols-[56px_1fr] gap-5 items-start">
          <div
            className="border border-[#1A161320] bg-[#E8DECE]/60 w-[56px] h-[56px] flex items-center justify-center text-[#9E4A2F] group-hover:bg-[#C96442] group-hover:text-[#F3ECE0] group-hover:border-[#C96442] transition-colors"
            aria-hidden="true"
          >
            {Icon ? (
              <Icon size={22} weight="light" />
            ) : (
              <TerracottaMark size={20} color="currentColor" />
            )}
          </div>
          <div className="min-w-0 pt-0.5">
            <h3
              className="font-fraunces text-[22px] md:text-[26px] tracking-[-0.02em] leading-[1.1] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
              style={{
                fontVariationSettings:
                  '"opsz" 32, "SOFT" 50, "WONK" 1, "wght" 460',
              }}
            >
              {app.title}
            </h3>
            {app.kicker || app.tagline ? (
              <p
                className="mt-1 font-fraunces italic text-[14px] leading-[1.35] text-[#2E2620]"
                style={{
                  fontVariationSettings:
                    '"opsz" 18, "SOFT" 100, "wght" 360',
                }}
              >
                {app.kicker || app.tagline}
              </p>
            ) : null}
          </div>
        </div>

        {/* description */}
        {app.description && (
          <p className="mt-6 font-ibm-plex-mono text-[11.5px] leading-[1.6] text-[#2E2620] line-clamp-3">
            {app.description}
          </p>
        )}

        {/* footer */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#1A161320] flex items-center justify-between font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase">
          <span className="text-[#2E2620]/60 group-hover:text-[#1A1613] transition-colors">
            Open instrument
          </span>
          <ArrowUpRightIcon
            size={14}
            weight="bold"
            className="text-[#9E4A2F] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
          />
        </div>
      </Link>
    </motion.article>
  );
};

const TerracottaPinnedAppPage = () => {
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/apps/apps.json');
        if (!res.ok) return;
        const data = await res.json();
        const all = Object.values(data).flatMap((cat) =>
          cat.apps.map((app) => ({ ...app, categoryName: cat.name })),
        );
        const list = all
          .filter((a) => a.pinned_order)
          .sort((a, b) => a.pinned_order - b.pinned_order);
        if (!cancelled) setPinned(list);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={52} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Fetching the kit
          </span>
        </div>
      </div>
    );
  }

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
        title="Kit | Fezcodex"
        description="A pinned toolkit — the instruments the archive returns to first."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio V · pinned kit"
          center="The instruments, kept within reach"
          right={`${pinned.length} pieces`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <PushPinIcon size={14} weight="fill" />
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>V</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                The<br />
                <ChapterEm>kit</ChapterEm>
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[20px] leading-[1.4] text-[#1A1613] max-w-[34ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                A mason's belt of instruments — the ones{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  used every day
                </span>
                , not just the ones bought once.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Pinned" value={`${pinned.length}`} />
                <TerracottaSpec label="Catalogue" value="See /apps" />
                <TerracottaSpec label="Sort" value="By rank" />
                <TerracottaSpec label="Updated" value="On whim" />
              </div>
            </aside>
          </div>
        </section>

        {/* chapter */}
        <section className="pt-16 border-t border-[#1A161320]">
          <TerracottaChapter
            numeral="I"
            label="In rank order"
            title={
              <>
                First <ChapterEm>to hand.</ChapterEm>
              </>
            }
            blurb="Ordered by pinned rank — the earlier the number, the closer to the belt."
          />

          {pinned.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#1A161320]">
              <p className="font-fraunces italic text-[20px] text-[#2E2620]/60">
                No instruments pinned yet.
              </p>
              <Link
                to="/apps"
                className="mt-4 inline-block font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
              >
                Browse all instruments →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {pinned.map((app, i) => (
                <PinnedCard key={app.slug} app={app} index={i} />
              ))}
            </div>
          )}
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Kit · folio {String(pinned.length).padStart(3, '0')}</span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TerracottaPinnedAppPage;
