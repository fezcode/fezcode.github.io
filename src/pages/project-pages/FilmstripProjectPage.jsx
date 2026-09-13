import React, { useEffect, useRef, useState } from 'react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
  BackLink,
} from './app-shell';
import MarkdownContent from '../../components/MarkdownContent';

/* ============================================================
 * "filmstrip" — tivi.
 *
 * Film, before it was a file: perforated stock, frames in sequence, a
 * timeline you scrub. Scroll position drives the scrubber, section
 * copy is set like a subtitle, and the features run as numbered frames
 * because a reel genuinely is a sequence.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;500;700&family=Saira:wght@300;400;500&display=swap';

const STOCK = '#0B0B0C';
const FRAME = '#141416';
const LIGHT = '#EFE9DC';
const DIM = '#8A857C';
const EDGE = 'rgba(239,233,220,0.12)';

const COND = { fontFamily: "'Saira Condensed', system-ui, sans-serif" };
const BODY = { fontFamily: "'Saira', system-ui, sans-serif" };

/** Perforated edge, the give-away that this is film. */
const Sprockets = ({ count = 26 }) => (
  <div
    aria-hidden
    className="flex items-center justify-between px-2"
    style={{ height: 22, background: STOCK }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        style={{
          width: 11,
          height: 9,
          borderRadius: 2,
          background: '#2A2A2D',
          flex: 'none',
        }}
      />
    ))}
  </div>
);

const FilmstripProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'filmstrip');
  const [pos, setPos] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // the scroll container is whichever ancestor actually scrolls
    let node = el.parentElement;
    while (node && node.scrollHeight <= node.clientHeight + 4) node = node.parentElement;
    const target = node || window;
    const read = () => {
      const st = node ? node.scrollTop : window.scrollY;
      const max = node
        ? node.scrollHeight - node.clientHeight
        : document.body.scrollHeight - window.innerHeight;
      setPos(max > 0 ? Math.min(1, Math.max(0, st / max)) : 0);
    };
    read();
    target.addEventListener('scroll', read, { passive: true });
    return () => target.removeEventListener('scroll', read);
  }, [cfg]);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={STOCK} color={LIGHT} />;

  const a = cfg.accent || '#C9A45A';
  const shots = cfg.shots || [];

  return (
    <div ref={ref} className="min-h-screen" style={{ background: STOCK, color: LIGHT, ...BODY }}>
      <AppSeo cfg={cfg} project={project} />

      {/* scrubber — tracks how far through the reel you are */}
      <div
        className="sticky top-0 z-20"
        style={{ background: STOCK, borderBottom: `1px solid ${EDGE}` }}
      >
        <div className="flex items-center gap-4 px-4 sm:px-7 h-12">
          <BackLink color={LIGHT} />
          <span
            className="text-[13px] tracking-[0.22em] uppercase"
            style={{ ...COND, color: LIGHT }}
          >
            {cfg.name}
          </span>
          <span className="ml-auto text-[12px]" style={{ ...COND, color: DIM }}>
            v{cfg.version}
          </span>
        </div>
        <div style={{ height: 2, background: '#222226' }}>
          <div style={{ height: 2, width: `${pos * 100}%`, background: a }} />
        </div>
      </div>

      <Sprockets />

      {/* opening frame */}
      <section className="px-4 sm:px-7 py-16 sm:py-24" style={{ background: FRAME }}>
        <div className="mx-auto max-w-[1000px]">
          <h1
            className="uppercase leading-[0.92]"
            style={{
              ...COND,
              fontWeight: 700,
              fontSize: 'clamp(40px, 9vw, 104px)',
              letterSpacing: '-0.01em',
              maxWidth: '14ch',
            }}
          >
            {cfg.tagline}
          </h1>
          {/* set like a subtitle, because this is a video player */}
          <p
            className="mt-9 inline-block px-3 py-2 text-[15px] sm:text-[17px] leading-[1.55]"
            style={{ background: 'rgba(0,0,0,0.55)', color: LIGHT, maxWidth: '62ch' }}
          >
            {cfg.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {cfg.download && (
              <a
                href={cfg.download}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 text-[13px] uppercase tracking-[0.16em]"
                style={{ ...COND, background: a, color: STOCK, fontWeight: 700 }}
              >
                {cfg.downloadLabel || 'Download'}
              </a>
            )}
            {cfg.repo && (
              <a
                href={cfg.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 text-[13px] uppercase tracking-[0.16em]"
                style={{ ...COND, border: `1px solid ${EDGE}`, color: LIGHT }}
              >
                Source
              </a>
            )}
          </div>
        </div>
      </section>

      <Sprockets />

      {shots.length > 0 && (
        <section className="px-4 sm:px-7 py-14">
          <div className="mx-auto max-w-[1000px] grid gap-8 md:grid-cols-2">
            {shots.map((s, i) => (
              <figure key={i} className={shots.length === 1 ? 'md:col-span-2' : ''}>
                <div style={{ border: `1px solid ${EDGE}` }}>
                  <img src={s.src} alt={s.caption || cfg.name} loading="lazy" className="w-full h-auto block" />
                </div>
                <figcaption
                  className="mt-3 text-[12px] uppercase tracking-[0.18em]"
                  style={{ ...COND, color: DIM }}
                >
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {(cfg.summary || []).length > 0 && (
        <section className="px-4 sm:px-7 pb-14">
          <div className="mx-auto max-w-[1000px] grid gap-9 md:grid-cols-2">
            {cfg.summary.map((p, i) => (
              <p
                key={i}
                className="text-[15.5px] leading-[1.8]"
                style={{ color: i === 0 ? LIGHT : DIM, maxWidth: '58ch' }}
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* frames — a reel is genuinely a sequence, so these are numbered */}
      {(cfg.panels || []).length > 0 && (
        <section className="pb-6">
          <Sprockets />
          <div className="px-4 sm:px-7 py-14" style={{ background: FRAME }}>
            <div className="mx-auto max-w-[1000px]">
              <h2
                className="uppercase text-[13px] tracking-[0.28em] mb-10"
                style={{ ...COND, color: DIM }}
              >
                {cfg.panelsHeading}
              </h2>
              <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
                {cfg.panels.map((p, i) => (
                  <div key={i} className="flex gap-5">
                    <span
                      className="flex-none text-[13px] pt-1"
                      style={{ ...COND, color: a, letterSpacing: '0.1em' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3
                        className="text-[19px] uppercase mb-2"
                        style={{ ...COND, fontWeight: 500, letterSpacing: '0.02em' }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-[14.5px] leading-[1.75]" style={{ color: DIM, maxWidth: '46ch' }}>
                        {p.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Sprockets />
        </section>
      )}

      {(cfg.keys || []).length > 0 && (
        <section className="px-4 sm:px-7 py-12">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="uppercase text-[13px] tracking-[0.28em] mb-8" style={{ ...COND, color: DIM }}>
              {cfg.keysHeading}
            </h2>
            <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
              {cfg.keys.map((k, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-5 py-2.5"
                  style={{ borderBottom: `1px solid ${EDGE}` }}
                >
                  <span
                    className="flex-none text-[13px] uppercase tracking-[0.12em]"
                    style={{ ...COND, color: a, minWidth: 116 }}
                  >
                    {k.k}
                  </span>
                  <span className="text-[14px]" style={{ color: DIM }}>
                    {k.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {cfg.terminal && (
        <section className="px-4 sm:px-7 py-12">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="uppercase text-[13px] tracking-[0.28em] mb-6" style={{ ...COND, color: DIM }}>
              {cfg.terminalHeading}
            </h2>
            <pre
              className="overflow-x-auto text-[13px] leading-[2] px-5 py-5"
              style={{
                margin: 0,
                background: FRAME,
                border: `1px solid ${EDGE}`,
                color: LIGHT,
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              {(cfg.terminal.lines || []).map((l, i) => (
                <div key={i}>
                  <span style={{ color: a }}>$</span> {l}
                </div>
              ))}
            </pre>
          </div>
        </section>
      )}

      {cfg.notes && (
        <section className="px-4 sm:px-7 py-12">
          <div className="mx-auto max-w-[70ch] text-[15px] leading-[1.8]">
            <MarkdownContent content={cfg.notes} />
          </div>
        </section>
      )}

      {(cfg.colophon || []).length > 0 && (
        <>
          <Sprockets />
          <section className="px-4 sm:px-7 py-12">
            <div
              className="mx-auto max-w-[1000px] grid gap-y-6 gap-x-8"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}
            >
              {cfg.colophon.map(([k, v], i) => (
                <div key={i}>
                  <div
                    className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
                    style={{ ...COND, color: DIM }}
                  >
                    {k}
                  </div>
                  <div className="text-[14px] break-words">{v}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default FilmstripProjectPage;
