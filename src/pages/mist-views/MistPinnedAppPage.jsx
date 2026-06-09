import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon, PushPinIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistChapter,
  ChapterEm,
  MistSpec,
  MistColophon,
} from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

/**
 * Pinned card — a veil of frosted white, no hard edges anywhere.
 * Icon floats in a soft wash; the whole card lifts gently on hover.
 */
const PinnedCard = ({ app, index }) => {
  const Icon = appIcons[app.icon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: Math.min(index, 6) * 0.06 }}
      className="group relative rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/50 hover:shadow-[0_22px_60px_rgba(60,72,69,0.14)] transition-all duration-[250ms] overflow-hidden"
    >
      <Link to={app.to} className="block p-7 h-full">
        {/* top strip — index + path */}
        <div className="flex items-center justify-between pb-5 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5C6B67]">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[6px] h-[6px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 40% 35%, #FFFFFF 0%, #8FA8BC 100%)',
                boxShadow: '0 0 8px 2px rgba(143,168,188,0.4)',
              }}
            />
            no. {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[#8A9894] truncate max-w-[50%]">{app.to}</span>
        </div>
        <MistHorizon tint="rgba(60,72,69,0.14)" />

        {/* body */}
        <div className="pt-6 grid grid-cols-[56px_1fr] gap-5 items-start">
          <div
            className="rounded-2xl bg-[#DFE5E3]/70 w-[56px] h-[56px] flex items-center justify-center text-[#5F837B] group-hover:bg-[#5F837B]/15 group-hover:shadow-[0_0_18px_rgba(143,168,188,0.4)] transition-all duration-[250ms]"
            aria-hidden="true"
          >
            {Icon ? (
              <Icon size={22} weight="light" />
            ) : (
              <MistOrb size={24} breathe={false} />
            )}
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="font-instr-serif font-normal text-[22px] md:text-[26px] tracking-[-0.01em] leading-[1.12] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
              {app.title}
            </h3>
            {app.kicker || app.tagline ? (
              <p className="mt-1 font-instr-serif italic text-[15px] leading-[1.35] text-[#5C6B67]">
                {app.kicker || app.tagline}
              </p>
            ) : null}
          </div>
        </div>

        {/* description */}
        {app.description && (
          <p className="mt-6 font-outfit font-light text-[13px] leading-[1.65] text-[#5C6B67] line-clamp-3">
            {app.description}
          </p>
        )}

        {/* footer */}
        <div className="mt-6 pt-4">
          <MistHorizon tint="rgba(60,72,69,0.14)" />
          <div className="pt-4 flex items-center justify-between font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase">
            <span className="text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
              drift in
            </span>
            <ArrowUpRightIcon
              size={14}
              weight="light"
              className="text-[#5F837B] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-[250ms]"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const MistPinnedAppPage = () => {
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

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Kit | Fezcodex"
        description="A pinned toolkit — the instruments kept close while waking."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift v · pinned kit"
          center="kept within reach, even half-asleep"
          right={`${pinned.length} kept close`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <PushPinIcon size={14} weight="light" />
                <span>fezcodex · drift</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 max-w-[60px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(95,131,123,0.5), transparent)',
                  }}
                />
                <span>v</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                the
                <br />
                <em className="italic text-[#5F837B]">kit</em>
              </motion.h1>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="flex flex-col gap-5"
            >
              <p className="font-instr-serif text-[20px] md:text-[22px] leading-[1.45] text-[#3C4845] max-w-[34ch]">
                The instruments kept on the nightstand — the ones{' '}
                <em className="italic text-[#5F837B]">reached for first</em>,
                before the eyes are fully open.
              </p>
              <div className="pt-4">
                <MistHorizon />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <MistSpec label="pinned" value={`${pinned.length}`} />
                  <MistSpec label="catalogue" value="see /apps" />
                  <MistSpec label="sort" value="by closeness" />
                  <MistSpec label="updated" value="between dreams" />
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* chapter */}
        <section className="pt-16">
          <MistHorizon className="mb-16" />
          <MistChapter
            numeral="i"
            label="kept close"
            title={
              <>
                first <ChapterEm>reached for.</ChapterEm>
              </>
            }
            blurb="ordered by pinned rank — the earlier the number, the nearer the hand."
          />

          {pinned.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)]">
              <p className="font-instr-serif italic text-[20px] text-[#8A9894]">
                nothing pinned yet — the fog keeps the rest.
              </p>
              <Link
                to="/apps"
                className="mt-4 inline-block font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
              >
                drift through all instruments →
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

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>
                kit · drift {String(pinned.length).padStart(3, '0')} — kept
                while waking
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistPinnedAppPage;
