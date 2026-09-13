import React from 'react';
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
 * "shelf" — Cogas.
 *
 * Seven storefronts, seven brand colours. The page is built out of
 * those: a saturated hero with the real library bleeding off the right
 * edge, a solid band of platform names, and price cards that look like
 * the deals feed rather than generic panels. No invented cover art —
 * the screenshot has the real thing in it.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap';

const INK = '#08090C';
const CARD = '#13161D';
const LIGHT = '#EDEFF4';
const DIM = '#858FA2';
const EDGE = 'rgba(237,239,244,0.12)';

const UI = { fontFamily: "'Outfit', system-ui, sans-serif" };
const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

const PLATFORMS = [
  { id: 'Steam', c: '#1B6DA8' },
  { id: 'Epic', c: '#4A4A4A' },
  { id: 'GOG', c: '#7A3BA8' },
  { id: 'Ubisoft', c: '#0A7EA4' },
  { id: 'Battle.net', c: '#1B5FA8' },
  { id: 'EA', c: '#C4402E' },
  { id: 'Microsoft Store', c: '#2E7D32' },
];

const DEALS = [
  { store: 'Steam', cut: '-75%', now: '£4.99', low: '£3.74' },
  { store: 'GOG', cut: '-60%', now: '£11.99', low: '£9.99' },
  { store: 'Epic', cut: '-50%', now: '£14.99', low: '£12.49' },
  { store: 'Battle.net', cut: '-40%', now: '£23.99', low: '£19.99' },
];

const Band = ({ children, style = {}, className = '' }) => (
  <section className={className} style={style}>
    <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">{children}</div>
  </section>
);

const ShelfProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'shelf');

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={INK} color={LIGHT} />;

  const a = cfg.accent || '#6B3AA0';
  const b = cfg.accent2 || '#1F4F86';
  const shot = (cfg.shots || [])[0];

  return (
    <div className="min-h-screen" style={{ background: INK, color: LIGHT, ...UI }}>
      <AppSeo cfg={cfg} project={project} />
      <style>{`
        @keyframes sh-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .sh-marquee { animation: sh-marquee 34s linear infinite; width: max-content; }
        @media (prefers-reduced-motion: reduce) { .sh-marquee { animation: none } }
      `}</style>

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 pt-6">
        <BackLink color={LIGHT} />
      </div>

      {/* ── hero: saturated, with the library bleeding off the right ── */}
      <header
        className="relative overflow-hidden mt-4"
        style={{
          background: `linear-gradient(122deg, ${a} 0%, ${b} 52%, #101828 100%)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 100% at 0% 0%, rgba(0,0,0,0.10) 0%, rgba(8,9,12,0.72) 78%)' }}
        />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-center gap-y-10">
            <div className="py-14 sm:py-20">
              <h1
                className="font-extrabold leading-[0.94]"
                style={{ fontSize: 'clamp(42px, 5.6vw, 82px)', letterSpacing: '-0.045em', maxWidth: '11ch' }}
              >
                {cfg.tagline}
              </h1>
              <p className="mt-7 text-[16.5px] leading-[1.65]" style={{ color: 'rgba(237,239,244,0.82)', maxWidth: '46ch' }}>
                {cfg.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {cfg.download && (
                  <a
                    href={cfg.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 text-[15px] font-bold"
                    style={{ background: LIGHT, color: INK, borderRadius: 7 }}
                  >
                    {cfg.downloadLabel || 'Download'}
                  </a>
                )}
                {cfg.repo && (
                  <a
                    href={cfg.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 text-[15px] font-semibold"
                    style={{ border: '1px solid rgba(237,239,244,0.4)', color: LIGHT, borderRadius: 7 }}
                  >
                    Read the source
                  </a>
                )}
              </div>
              <div className="mt-9 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                {[['928', 'games indexed'], ['84', 'installed'], ['7', 'storefronts']].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-[30px] font-extrabold leading-none" style={{ letterSpacing: '-0.04em' }}>{n}</div>
                    <div className="text-[12px] mt-1" style={{ color: 'rgba(237,239,244,0.66)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* the real window, angled, running off the edge */}
            <div className="relative h-full min-h-[320px] hidden lg:block">
              {shot && (
                <img
                  src={shot.src}
                  alt={shot.caption || cfg.name}
                  className="absolute block"
                  style={{
                    top: 48,
                    left: 28,
                    width: 'calc(100% + 230px)',
                    maxWidth: 'none',
                    borderRadius: 10,
                    border: `1px solid ${EDGE}`,
                    boxShadow: '0 46px 80px -34px rgba(0,0,0,0.95)',
                    transform: 'perspective(1500px) rotateY(-13deg) rotateX(2deg)',
                    transformOrigin: 'left center',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* small screens get the screenshot straight */}
      {shot && (
        <div className="lg:hidden px-5 sm:px-8 py-8">
          <img src={shot.src} alt={shot.caption || cfg.name} className="w-full h-auto block" style={{ borderRadius: 8, border: `1px solid ${EDGE}` }} />
        </div>
      )}

      {/* ── the storefront band ── */}
      <div className="overflow-hidden py-4" style={{ background: LIGHT, color: INK }}>
        <div className="sh-marquee flex items-center gap-8">
          {[0, 1].map((pass) => (
            <React.Fragment key={pass}>
              {PLATFORMS.map((p) => (
                <span key={`${pass}-${p.id}`} className="flex items-center gap-8 flex-none">
                  <span className="text-[22px] sm:text-[27px] font-extrabold" style={{ letterSpacing: '-0.035em', color: p.c }}>
                    {p.id}
                  </span>
                  <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: INK, opacity: 0.28 }} />
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── deals ── */}
      <Band className="py-16" style={{ background: INK }}>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3 mb-9">
          <h2 className="font-extrabold" style={{ fontSize: 'clamp(28px,3.4vw,44px)', letterSpacing: '-0.04em' }}>
            Every store, one search
          </h2>
          <p className="text-[14.5px]" style={{ color: DIM, maxWidth: '46ch' }}>
            Historical lows beside the current price, the live discount feed, and target prices that
            tell you when they are hit.
          </p>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(238px,1fr))' }}>
          {DEALS.map((d) => {
            const c = PLATFORMS.find((p) => p.id === d.store)?.c || a;
            return (
              <div key={d.store} className="overflow-hidden" style={{ background: CARD, borderRadius: 10, border: `1px solid ${EDGE}` }}>
                <div className="px-4 py-2.5 flex items-center" style={{ background: c }}>
                  <span className="text-[12.5px] font-semibold" style={{ color: '#fff' }}>{d.store}</span>
                  <span className="ml-auto text-[12.5px] font-bold" style={{ color: '#fff' }}>{d.cut}</span>
                </div>
                <div className="px-4 py-5">
                  <div className="text-[34px] font-extrabold leading-none" style={{ letterSpacing: '-0.04em' }}>{d.now}</div>
                  <div className="text-[12.5px] mt-2" style={{ ...MONO, color: DIM }}>all-time low {d.low}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Band>

      {/* ── how it finds them ── */}
      {(cfg.summary || []).length > 0 && (
        <Band className="py-14" style={{ background: CARD, borderTop: `1px solid ${EDGE}`, borderBottom: `1px solid ${EDGE}` }}>
          <div className="grid gap-10 md:grid-cols-2">
            {cfg.summary.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.8]" style={{ color: i === 0 ? LIGHT : DIM, maxWidth: '54ch' }}>
                {p}
              </p>
            ))}
          </div>
        </Band>
      )}

      {/* ── features ── */}
      {(cfg.panels || []).length > 0 && (
        <Band className="py-16" style={{ background: INK }}>
          <h2 className="font-extrabold mb-10" style={{ fontSize: 'clamp(28px,3.4vw,44px)', letterSpacing: '-0.04em' }}>
            {cfg.panelsHeading}
          </h2>
          <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
            {cfg.panels.map((p, i) => (
              <div key={i} className="flex gap-5">
                <span
                  className="flex-none flex items-center justify-center text-[13px] font-bold"
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: PLATFORMS[i % PLATFORMS.length].c, color: '#fff',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold mb-1.5">{p.title}</h3>
                  <p className="text-[14.5px] leading-[1.75]" style={{ color: DIM, maxWidth: '46ch' }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Band>
      )}

      {cfg.terminal && (
        <Band className="py-14" style={{ background: CARD, borderTop: `1px solid ${EDGE}` }}>
          <h2 className="text-[24px] font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>{cfg.terminalHeading}</h2>
          <pre
            className="overflow-x-auto text-[13px] leading-[2] px-5 py-5"
            style={{ ...MONO, margin: 0, background: INK, border: `1px solid ${EDGE}`, borderRadius: 9, color: LIGHT }}
          >
            {(cfg.terminal.lines || []).map((l, i) => (
              <div key={i}><span style={{ color: '#5BC08A' }}>$</span> {l}</div>
            ))}
          </pre>
        </Band>
      )}

      {cfg.notes && (
        <Band className="py-14" style={{ background: INK }}>
          <h2 className="text-[24px] font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>{cfg.notesTitle}</h2>
          <div className="text-[15px] leading-[1.8]" style={{ maxWidth: '74ch' }}>
            <MarkdownContent content={cfg.notes} />
          </div>
        </Band>
      )}

      {(cfg.colophon || []).length > 0 && (
        <Band className="py-12 pb-20" style={{ background: INK, borderTop: `1px solid ${EDGE}` }}>
          <div className="grid gap-y-7 gap-x-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}>
            {cfg.colophon.map(([k, v], i) => (
              <div key={i}>
                <div className="text-[12px] mb-1.5" style={{ color: DIM }}>{k}</div>
                <div className="text-[14px] break-words" style={/[\\%]/.test(String(v)) ? MONO : undefined}>{v}</div>
              </div>
            ))}
          </div>
        </Band>
      )}
    </div>
  );
};

export default ShelfProjectPage;
