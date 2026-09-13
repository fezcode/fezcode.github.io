import React, { useState } from 'react';
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
 * "gallery" — Atelier.
 *
 * A page for an image viewer has to be full of images, and it should
 * let you do the thing the app does. So the hero is a working viewer:
 * a real photograph on a checkerboard mat, arrows and a filmstrip that
 * walk the folder, and a zoom control that actually zooms. The claims
 * about sharpness are then demonstrated rather than asserted.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Karla:wght@300;400;500;600&display=swap';

const ROOM = '#0B0B0C';
const MAT = '#141416';
const CHALK = '#E6E3DE';
const LABEL = '#8B8780';
const EDGE = 'rgba(230,227,222,0.13)';

const DISPLAY = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const UI = { fontFamily: "'Karla', system-ui, sans-serif" };

const CHECKER = `
  linear-gradient(45deg, #202023 25%, transparent 25%),
  linear-gradient(-45deg, #202023 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #202023 75%),
  linear-gradient(-45deg, transparent 75%, #202023 75%)`;

/* The site's own picture set, so the viewer has something real in it. */
const ROLL = [
  { src: '/images/bg/3.webp', name: 'storm-over-the-citadel.webp', w: 1920, h: 1080 },
  { src: '/images/bg/1.webp', name: 'second-light.webp', w: 1920, h: 1080 },
  { src: '/images/bg/emre.jpg', name: 'leaves.jpg', w: 2400, h: 1600 },
  { src: '/images/bg/7.webp', name: 'long-exposure.webp', w: 1920, h: 1080 },
  { src: '/images/bg/4.webp', name: 'blue-hour.webp', w: 1920, h: 1080 },
  { src: '/images/bg/0.webp', name: 'first-frame.webp', w: 1920, h: 1080 },
  { src: '/images/bg/8.webp', name: 'late-room.webp', w: 1920, h: 1080 },
  { src: '/images/bg/2.webp', name: 'quiet-street.webp', w: 1920, h: 1080 },
];

const FORMATS = ['SVG', 'HEIC', 'HEIF', 'AVIF', 'WebP', 'ICO', 'PNG', 'JPEG'];

const Chip = ({ children }) => (
  <span
    className="text-[11.5px] px-2.5 py-1"
    style={{ border: `1px solid ${EDGE}`, color: CHALK, borderRadius: 3 }}
  >
    {children}
  </span>
);

/** The six wallpaper placements, each shown with the picture on screen. */
const wallpaperStyle = (mode, src) => {
  const base = { position: 'absolute', inset: 0, backgroundImage: `url(${src})` };
  switch (mode) {
    case 'Fill':
      return { ...base, backgroundSize: 'cover', backgroundPosition: 'center' };
    case 'Fit':
      return { ...base, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' };
    case 'Stretch':
      return { ...base, backgroundSize: '100% 100%' };
    case 'Center':
      return { ...base, backgroundSize: '62%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' };
    case 'Tile':
      return { ...base, backgroundSize: '34%', backgroundRepeat: 'repeat' };
    default:
      return { ...base, backgroundSize: '175% auto', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' };
  }
};

const GalleryProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'gallery');
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={ROOM} color={CHALK} />;

  const a = cfg.accent || '#8A2226';
  const pic = ROLL[idx];
  const go = (n) => {
    setIdx(((n % ROLL.length) + ROLL.length) % ROLL.length);
    setZoom(100);
  };

  return (
    <div className="min-h-screen" style={{ background: ROOM, color: CHALK, ...UI }}>
      <AppSeo cfg={cfg} project={project} />

      <div
        className="sticky top-0 z-20 flex items-center gap-4 px-5 sm:px-8 h-12"
        style={{ background: 'rgba(11,11,12,0.92)', borderBottom: `1px solid ${EDGE}`, backdropFilter: 'blur(8px)' }}
      >
        <BackLink color={CHALK} />
        <span className="text-[13px]" style={{ opacity: 0.85 }}>
          {cfg.name}
        </span>
        <span className="ml-auto text-[12px]" style={{ color: LABEL }}>
          v{cfg.version}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8">
        <section className="pt-12 pb-8">
          <h1
            className="leading-[1.02]"
            style={{
              ...DISPLAY,
              fontWeight: 300,
              fontSize: 'clamp(36px, 6vw, 74px)',
              maxWidth: '16ch',
              letterSpacing: '-0.01em',
            }}
          >
            {cfg.tagline}
          </h1>
          <p className="mt-6 text-[16px] leading-[1.75]" style={{ color: LABEL, maxWidth: '56ch' }}>
            {cfg.subtitle}
          </p>
        </section>

        {/* ---------- the viewer, doing its job ---------- */}
        <section className="pb-6">
          <div style={{ border: `1px solid ${EDGE}` }}>
            <div
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                height: 'clamp(280px, 52vh, 560px)',
                background: `${CHECKER}, #1A1A1C`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              <img
                key={pic.src}
                src={pic.src}
                alt={pic.name}
                className="block select-none"
                style={{
                  maxWidth: `${zoom}%`,
                  maxHeight: `${zoom}%`,
                  objectFit: 'contain',
                  transition: 'max-width 180ms ease, max-height 180ms ease',
                }}
              />
              <button
                type="button"
                onClick={() => go(idx - 1)}
                aria-label="Previous picture"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[18px]"
                style={{ background: 'rgba(11,11,12,0.62)', color: CHALK, border: `1px solid ${EDGE}`, borderRadius: 999 }}
              >
                &lsaquo;
              </button>
              <button
                type="button"
                onClick={() => go(idx + 1)}
                aria-label="Next picture"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[18px]"
                style={{ background: 'rgba(11,11,12,0.62)', color: CHALK, border: `1px solid ${EDGE}`, borderRadius: 999 }}
              >
                &rsaquo;
              </button>
            </div>

            {/* the status bar Atelier keeps under the picture */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5"
              style={{ background: MAT, borderTop: `1px solid ${EDGE}` }}
            >
              <span className="text-[12px] truncate" style={{ color: CHALK, maxWidth: '34ch' }}>
                {pic.name}
              </span>
              <span className="text-[12px]" style={{ color: LABEL }}>
                {pic.w} &times; {pic.h}
              </span>
              <span className="text-[12px]" style={{ color: LABEL }}>
                {idx + 1} of {ROLL.length}
              </span>
              <label
                className="ml-auto text-[11.5px] flex items-center gap-3"
                htmlFor="at-zoom"
                style={{ color: LABEL }}
              >
                Zoom
                <input
                  id="at-zoom"
                  type="range"
                  min="40"
                  max="260"
                  step="10"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ accentColor: a, width: 140 }}
                />
              </label>
              <span className="text-[12px] tabular-nums" style={{ color: CHALK, minWidth: 46, textAlign: 'right' }}>
                {zoom}%
              </span>
            </div>

            {/* the folder, as a filmstrip */}
            <div
              className="flex gap-2 overflow-x-auto px-3 py-3"
              style={{ background: ROOM, borderTop: `1px solid ${EDGE}` }}
            >
              {ROLL.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={p.name}
                  aria-current={i === idx}
                  className="flex-none overflow-hidden"
                  style={{
                    width: 108,
                    height: 66,
                    border: `2px solid ${i === idx ? a : 'transparent'}`,
                    outline: `1px solid ${EDGE}`,
                    opacity: i === idx ? 1 : 0.6,
                  }}
                >
                  <img src={p.src} alt="" loading="lazy" className="w-full h-full" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {cfg.download && (
              <a
                href={cfg.download}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-[13.5px] font-semibold"
                style={{ background: a, color: CHALK }}
              >
                {cfg.downloadLabel || 'Download'}
              </a>
            )}
            {cfg.repo && (
              <a
                href={cfg.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-[13.5px]"
                style={{ border: `1px solid ${EDGE}`, color: CHALK }}
              >
                Read the source
              </a>
            )}
            <span className="flex flex-wrap gap-1.5 sm:ml-3">
              {FORMATS.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </span>
          </div>
        </section>

        {/* ---------- the application itself ---------- */}
        {(cfg.shots || []).length > 0 && (
          <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
            <h2 className="text-[27px] mb-7" style={{ ...DISPLAY, fontWeight: 400 }}>
              {cfg.shotsHeading || 'The application'}
            </h2>
            <div className="space-y-10">
              {cfg.shots.map((s, i) => (
                <figure key={i}>
                  <div className="p-3 sm:p-5" style={{ background: MAT, border: `1px solid ${EDGE}` }}>
                    <img src={s.src} alt={s.caption || cfg.name} loading="lazy" className="w-full h-auto block" />
                  </div>
                  <figcaption className="mt-3 text-[12.5px]" style={{ color: LABEL }}>
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ---------- vector vs raster ---------- */}
        <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
          <h2 className="text-[27px] mb-2" style={{ ...DISPLAY, fontWeight: 400 }}>
            The same magnification, twice
          </h2>
          <p className="text-[14.5px] mb-8" style={{ color: LABEL, maxWidth: '58ch' }}>
            Vector art is re-rendered at the zoom you ask for, not scaled from a bitmap. Push into a
            raster and you meet its pixels; push into an SVG and there is nothing to meet.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <figure>
              <div
                className="overflow-hidden flex items-center justify-center"
                style={{
                  height: 260,
                  background: `${CHECKER}, #1A1A1C`,
                  backgroundSize: '20px 20px',
                  border: `1px solid ${EDGE}`,
                }}
              >
                <svg viewBox="122 24 52 40" style={{ width: '100%', height: '100%' }} aria-label="Vector at high magnification">
                  <rect x="100" y="0" width="100" height="100" fill="#2A3550" />
                  <circle cx="148" cy="40" r="18" fill="#E8C98A" />
                  <path d="M108 56 L124 76 L92 76 Z" fill="#E6E3DE" />
                </svg>
              </div>
              <figcaption className="mt-3 text-[12.5px]" style={{ color: CHALK }}>
                SVG &middot; rendered at zoom &mdash; the edges stay exact
              </figcaption>
            </figure>
            <figure>
              <div
                className="overflow-hidden flex items-center justify-center"
                style={{
                  height: 260,
                  background: `${CHECKER}, #1A1A1C`,
                  backgroundSize: '20px 20px',
                  border: `1px solid ${EDGE}`,
                }}
              >
                <img
                  src="/images/bg/emre.jpg"
                  alt="A bitmap magnified until its pixels show"
                  style={{ width: '1600%', maxWidth: 'none', imageRendering: 'pixelated', transform: 'translate(2%, 6%)' }}
                />
              </div>
              <figcaption className="mt-3 text-[12.5px]" style={{ color: LABEL }}>
                Raster &middot; the same zoom &mdash; you arrive at the pixels
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- wallpaper modes, with the picture on screen ---------- */}
        <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
          <h2 className="text-[27px] mb-2" style={{ ...DISPLAY, fontWeight: 400 }}>
            Six ways onto the desktop
          </h2>
          <p className="text-[14.5px] mb-8" style={{ color: LABEL, maxWidth: '58ch' }}>
            SVG, HEIC, AVIF, WebP and ICO are converted on the way out, since Windows itself only
            accepts JPG, PNG and BMP. Pick a different picture above and these follow it.
          </p>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(158px,1fr))' }}>
            {['Fill', 'Fit', 'Stretch', 'Center', 'Tile', 'Span'].map((mode) => (
              <div key={mode}>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '16/10', background: '#101012', border: `1px solid ${EDGE}` }}
                >
                  <div style={wallpaperStyle(mode, pic.src)} />
                </div>
                <p className="mt-2 text-[12px]" style={{ color: LABEL }}>
                  {mode}
                </p>
              </div>
            ))}
          </div>
        </section>

        {(cfg.summary || []).length > 0 && (
          <section className="py-14 grid gap-10 md:grid-cols-2" style={{ borderTop: `1px solid ${EDGE}` }}>
            {cfg.summary.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.85]"
                style={{ ...DISPLAY, color: i === 0 ? CHALK : LABEL, maxWidth: '52ch' }}
              >
                {p}
              </p>
            ))}
          </section>
        )}

        {(cfg.panels || []).length > 0 && (
          <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
            <h2 className="text-[27px] mb-9" style={{ ...DISPLAY, fontWeight: 400 }}>
              {cfg.panelsHeading}
            </h2>
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              {cfg.panels.map((p, i) => (
                <div key={i} className="flex gap-5">
                  <span className="flex-none text-[11px] pt-1.5" style={{ color: a, letterSpacing: '0.14em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[20px] mb-1.5" style={{ ...DISPLAY, fontWeight: 500 }}>
                      {p.title}
                    </h3>
                    <p className="text-[14px] leading-[1.75]" style={{ color: LABEL, maxWidth: '44ch' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(cfg.keys || []).length > 0 && (
          <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
            <h2 className="text-[27px] mb-8" style={{ ...DISPLAY, fontWeight: 400 }}>
              {cfg.keysHeading}
            </h2>
            <dl className="grid gap-x-12 sm:grid-cols-2 max-w-[860px]">
              {cfg.keys.map((k, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-baseline gap-x-6 py-2.5"
                  style={{ borderBottom: `1px solid ${EDGE}` }}
                >
                  <dt className="text-[13px]" style={{ color: CHALK, minWidth: 132 }}>
                    {k.k}
                  </dt>
                  <dd className="text-[14px]" style={{ color: LABEL }}>
                    {k.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {cfg.terminal && (
          <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
            <h2 className="text-[27px] mb-6" style={{ ...DISPLAY, fontWeight: 400 }}>
              {cfg.terminalHeading}
            </h2>
            <pre
              className="overflow-x-auto text-[13px] leading-[2] px-6 py-6"
              style={{ margin: 0, background: MAT, border: `1px solid ${EDGE}`, color: CHALK, fontFamily: 'ui-monospace, monospace' }}
            >
              {(cfg.terminal.lines || []).map((l, i) => (
                <div key={i}>
                  <span style={{ color: a }}>$</span> {l}
                </div>
              ))}
            </pre>
          </section>
        )}

        {cfg.notes && (
          <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
            <div className="text-[16px] leading-[1.85]" style={{ maxWidth: '70ch' }}>
              <MarkdownContent content={cfg.notes} />
            </div>
          </section>
        )}

        {(cfg.colophon || []).length > 0 && (
          <section
            className="grid gap-y-7 gap-x-10 py-14 pb-24"
            style={{ borderTop: `1px solid ${EDGE}`, gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}
          >
            {cfg.colophon.map(([k, v], i) => (
              <div key={i}>
                <div className="text-[11px] mb-2" style={{ color: LABEL, letterSpacing: '0.1em' }}>
                  {k}
                </div>
                <div className="text-[14px] break-words">{v}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default GalleryProjectPage;
