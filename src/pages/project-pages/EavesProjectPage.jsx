import React, { useEffect, useState } from 'react';
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
 * "eaves" — Hisashi.
 *
 * The page builds the product rather than describing it: three
 * monitors on a desk, each wearing a live bar in a different bundled
 * theme, with widgets that actually tick. The claim is "every monitor,
 * independently themed" — so show three. Under it sit captures of the
 * real bar at native size, as proof the drawing is honest.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap';

const ROOM = '#0D1016';
const DESK = '#171B24';
const GLASS = '#0A0C11';
const CHALK = '#EAEDF2';
const DIM = '#77839A';
const EDGE = 'rgba(234,237,242,0.12)';

const JP = { fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif" };
const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

/* Three of the twenty bundled themes, so the row shows real variety. */
const BAR_THEMES = [
  { id: 'Pulse Dark', bar: '#151821', fg: '#E6E9F0', muted: '#7C879C', accent: '#F472B6' },
  { id: 'Fluent Accent', bar: '#1E3A5F', fg: '#EAF2FF', muted: '#9DB6D4', accent: '#5AC8FA' },
  { id: 'Newsprint', bar: '#EDE9E0', fg: '#20201D', muted: '#6B675E', accent: '#B2452F' },
];

const Meter = ({ color, seed }) => (
  <span className="inline-flex items-end gap-[2px]" style={{ height: 11 }} aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        style={{
          width: 3,
          background: color,
          borderRadius: 1,
          height: `${34 + ((seed * 7 + i * 23) % 60)}%`,
          animation: `eaves-meter 2.4s ${i * 0.18 + seed * 0.1}s ease-in-out infinite alternate`,
        }}
      />
    ))}
  </span>
);

/** A bar: the widget row Hisashi actually paints across the top. */
const Bar = ({ theme, time, i, compact = false }) => (
  <div
    className="flex items-center gap-3 px-3 select-none"
    style={{
      height: compact ? 24 : 30,
      background: theme.bar,
      color: theme.fg,
      fontSize: compact ? 9.5 : 11,
      ...MONO,
      borderBottom: `1px solid rgba(0,0,0,0.35)`,
    }}
  >
    {/* left zone */}
    <span style={{ color: theme.accent, fontWeight: 500 }}>▦</span>
    {!compact && <span style={{ color: theme.muted }}>Dock</span>}
    {/* centre zone */}
    <span className="mx-auto" style={{ fontWeight: 500 }}>
      {time}
    </span>
    {/* right zone */}
    {!compact && (
      <>
        <span style={{ color: theme.muted }}>CPU</span>
        <Meter color={theme.accent} seed={i + 1} />
      </>
    )}
    <span style={{ color: theme.muted }}>{compact ? '82%' : '82%'}</span>
    <span
      aria-hidden
      style={{
        width: compact ? 12 : 16,
        height: compact ? 6 : 7,
        border: `1px solid ${theme.muted}`,
        borderRadius: 2,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 1,
          right: '35%',
          background: theme.accent,
          borderRadius: 1,
        }}
      />
    </span>
  </div>
);

const Monitor = ({ theme, time, i, scale = 1, label }) => (
  <div className="flex flex-col items-center" style={{ width: `${100 * scale}%` }}>
    <div
      className="w-full overflow-hidden"
      style={{
        borderRadius: 6,
        border: `1px solid ${EDGE}`,
        background: GLASS,
        boxShadow: '0 26px 50px -30px rgba(0,0,0,0.95)',
      }}
    >
      <Bar theme={theme} time={time} i={i} compact={scale < 0.9} />
      {/* the desktop the bar sits above — wallpaper plus a couple of windows,
          so the screen reads as in use rather than switched off */}
      <div
        className="relative"
        style={{
          aspectRatio: '16 / 10',
          background: `radial-gradient(90% 70% at 22% 8%, ${theme.accent}3D 0%, transparent 62%), linear-gradient(160deg, ${theme.bar} 0%, ${GLASS} 70%)`,
        }}
      >
        <div
          aria-hidden
          className="absolute"
          style={{
            left: '10%',
            top: '16%',
            width: '52%',
            height: '54%',
            borderRadius: 3,
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 10px 22px -12px rgba(0,0,0,0.9)',
          }}
        >
          <div style={{ height: 6, background: `${theme.accent}99`, borderRadius: '3px 3px 0 0' }} />
        </div>
        <div
          aria-hidden
          className="absolute"
          style={{
            left: '40%',
            top: '38%',
            width: '50%',
            height: '50%',
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.11)',
            boxShadow: '0 12px 26px -12px rgba(0,0,0,0.95)',
          }}
        >
          <div style={{ height: 6, background: `${theme.accent}CC`, borderRadius: '3px 3px 0 0' }} />
        </div>
        <span
          className="absolute left-3 bottom-2 text-[9px]"
          style={{ ...MONO, color: DIM }}
        >
          {label}
        </span>
      </div>
    </div>
    {/* stand */}
    <div aria-hidden style={{ width: '14%', height: 12, background: DESK }} />
    <div aria-hidden style={{ width: '34%', height: 4, background: DESK, borderRadius: 2 }} />
  </div>
);

const Section = ({ children, className = '' }) => (
  <section className={`mx-auto w-full max-w-[1080px] px-5 sm:px-8 ${className}`}>
    {children}
  </section>
);

const Heading = ({ children, accent }) => (
  <h2 className="text-[24px] sm:text-[30px] mb-8" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
    <span aria-hidden style={{ color: accent, marginRight: 12 }}>▚</span>
    {children}
  </h2>
);

const EavesProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'eaves');

  // Rendered on the server as a fixed string, then live once mounted, so
  // prerendered markup and the first client render agree.
  const [time, setTime] = useState('09:41');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={ROOM} color={CHALK} />;

  const a = cfg.accent || '#F472B6';
  const b = cfg.accent2 || '#A78BFA';

  return (
    <div className="min-h-screen" style={{ background: ROOM, color: CHALK, ...JP }}>
      <AppSeo cfg={cfg} project={project} />

      <style>{`
        @keyframes eaves-meter { from { height: 22%; } to { height: 100%; } }
        @keyframes eaves-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .eaves-rise { animation: eaves-rise 700ms cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .eaves-rise { animation: none; }
          [style*="eaves-meter"] { animation: none !important; height: 60% !important; }
        }
      `}</style>

      <Section className="pt-6 pb-2">
        <BackLink color={CHALK} />
      </Section>

      {/* ---------- the desk ---------- */}
      <Section className="pt-8 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center">
          <div className="eaves-rise">
            <div
              aria-hidden
              className="leading-none mb-6"
              style={{
                fontSize: 66,
                fontWeight: 700,
                background: `linear-gradient(100deg, ${a}, ${b})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {cfg.mark || '庇'}
            </div>
            <h1
              className="text-[34px] sm:text-[46px] leading-[1.1]"
              style={{ fontWeight: 700, letterSpacing: '-0.03em', maxWidth: '15ch' }}
            >
              {cfg.tagline}
            </h1>
            <p className="mt-6 text-[15.5px] leading-[1.85]" style={{ color: DIM, maxWidth: '48ch' }}>
              {cfg.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {cfg.download && (
                <a
                  href={cfg.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-[14px] font-medium"
                  style={{ background: `linear-gradient(100deg, ${a}, ${b})`, color: '#fff', borderRadius: 6 }}
                >
                  {cfg.downloadLabel || 'Download'}
                </a>
              )}
              {cfg.repo && (
                <a
                  href={cfg.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-[14px]"
                  style={{ border: `1px solid ${EDGE}`, color: CHALK, borderRadius: 6 }}
                >
                  Read the source
                </a>
              )}
            </div>
            <p className="mt-6 text-[12px]" style={{ ...MONO, color: DIM }}>
              v{cfg.version} · {(cfg.platforms || []).join(' · ')}
            </p>
          </div>

          {/* three monitors, three themes, three live bars */}
          <div className="eaves-rise">
            <div className="flex items-end justify-center gap-3 sm:gap-4">
              <Monitor theme={BAR_THEMES[1]} time={time} i={1} scale={0.82} label="display 2" />
              <Monitor theme={BAR_THEMES[0]} time={time} i={0} scale={1} label="display 1" />
              <Monitor theme={BAR_THEMES[2]} time={time} i={2} scale={0.82} label="display 3" />
            </div>
            <div
              aria-hidden
              style={{
                height: 10,
                marginTop: 2,
                background: `linear-gradient(180deg, ${DESK}, transparent)`,
                borderRadius: 4,
              }}
            />
            <p className="mt-5 text-center text-[12px]" style={{ ...MONO, color: DIM }}>
              {BAR_THEMES.map((t) => t.id).join('  ·  ')} — three of twenty
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- the real bar ---------- */}
      {(cfg.shots || []).length > 0 && (
        <Section className="py-14">
          <Heading accent={a}>{cfg.shotsHeading || 'The real bar'}</Heading>
          {/* A bar is 39px tall and as wide as a monitor, so these stack full
              width and scroll sideways rather than shrinking into a grid. */}
          <div className="space-y-8">
            {cfg.shots.map((s, i) => (
              <figure key={i}>
                <div
                  className="overflow-x-auto"
                  style={{ border: `1px solid ${EDGE}`, background: GLASS, borderRadius: 6 }}
                >
                  <img
                    src={s.src}
                    alt={s.caption || cfg.name}
                    loading="lazy"
                    className="block"
                    style={{ minWidth: 1000, width: '100%' }}
                  />
                </div>
                <figcaption className="mt-3 text-[13px]" style={{ color: DIM }}>
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- zones, exploded ---------- */}
      <Section className="py-14" >
        <Heading accent={a}>Three zones on every bar</Heading>
        <div
          className="overflow-hidden"
          style={{ border: `1px solid ${EDGE}`, borderRadius: 8, background: DESK }}
        >
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: EDGE }}>
            {[
              { z: 'left', items: ['App Dock', 'Command Runner', 'Quick Notes', 'Todo', 'Menubar'] },
              { z: 'center', items: ['Clock', 'Separator'] },
              { z: 'right', items: ['System Stats', 'Battery', 'Weather', 'Media', 'Volume Mixer', 'Power'] },
            ].map((zone, zi) => (
              <div key={zone.z} className="p-5 sm:p-6" style={{ background: DESK }}>
                <p className="text-[11px] mb-4" style={{ ...MONO, color: zi === 1 ? a : DIM }}>
                  {zone.z}
                </p>
                <div className="flex flex-wrap gap-2">
                  {zone.items.map((w) => (
                    <span
                      key={w}
                      className="text-[12px] px-2.5 py-1.5"
                      style={{
                        background: ROOM,
                        border: `1px solid ${EDGE}`,
                        borderRadius: 4,
                        color: CHALK,
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- features ---------- */}
      {(cfg.panels || []).length > 0 && (
        <Section className="py-14">
          <Heading accent={a}>{cfg.panelsHeading}</Heading>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))' }}>
            {cfg.panels.map((p, i) => (
              <div
                key={i}
                className="p-6"
                style={{ background: DESK, border: `1px solid ${EDGE}`, borderRadius: 8 }}
              >
                <div
                  aria-hidden
                  className="mb-4"
                  style={{
                    width: 30,
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${a}, ${b})`,
                  }}
                />
                <h3 className="text-[16px] font-medium mb-2.5">{p.title}</h3>
                <p className="text-[14px] leading-[1.8]" style={{ color: DIM }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- twenty themes, as bars ---------- */}
      <Section className="py-14">
        <Heading accent={a}>Twenty themes, contrast-checked</Heading>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          {[
            ['Pulse Dark', '#151821', '#F472B6'],
            ['Pulse Light', '#EFEFF3', '#C0356F'],
            ['Aether Dark', '#101725', '#4CC2FF'],
            ['Geist Light', '#F5F5F5', '#111111'],
            ['Fluent Accent', '#1E3A5F', '#5AC8FA'],
            ['Aero Glass', '#20303F', '#9AD7F5'],
            ['Solarized Dark', '#002B36', '#B58900'],
            ['Sakura Dark', '#241A22', '#F2A0C0'],
            ['Aurora', '#0E1A22', '#54E6B5'],
            ['Cinema', '#121212', '#E0B15A'],
            ['Neon Tokyo', '#0F0B1E', '#FF4D9D'],
            ['Newsprint', '#EDE9E0', '#B2452F'],
            ['Phosphor CRT', '#0A1410', '#4BF07A'],
            ['Vintage', '#241F18', '#D0A257'],
          ].map(([name, bar, accent]) => (
            <div
              key={name}
              className="overflow-hidden"
              style={{ borderRadius: 6, border: `1px solid ${EDGE}` }}
            >
              <div
                className="flex items-center gap-2 px-2.5"
                style={{ height: 26, background: bar, ...MONO, fontSize: 10 }}
              >
                <span style={{ color: accent }}>▦</span>
                <span className="ml-auto" style={{ color: accent }}>
                  {time}
                </span>
                <span
                  aria-hidden
                  style={{ width: 14, height: 5, borderRadius: 2, background: accent, opacity: 0.8 }}
                />
              </div>
              <div className="px-2.5 py-2 text-[11px]" style={{ background: DESK, color: DIM, ...MONO }}>
                {name}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {cfg.terminal && (
        <Section className="py-14">
          <Heading accent={a}>{cfg.terminalHeading}</Heading>
          <pre
            className="overflow-x-auto text-[13px] leading-[2] px-5 py-5"
            style={{
              ...MONO,
              margin: 0,
              background: GLASS,
              border: `1px solid ${EDGE}`,
              borderRadius: 8,
              color: '#C9D1E0',
            }}
          >
            {(cfg.terminal.lines || []).map((l, i) => (
              <div key={i}>
                <span style={{ color: a }}>›</span> {l}
              </div>
            ))}
          </pre>
        </Section>
      )}

      {cfg.notes && (
        <Section className="py-14">
          <Heading accent={a}>{cfg.notesTitle}</Heading>
          <div className="text-[15px] leading-[1.9]" style={{ maxWidth: '70ch' }}>
            <MarkdownContent content={cfg.notes} />
          </div>
        </Section>
      )}

      {(cfg.colophon || []).length > 0 && (
        <Section className="py-14 pb-24">
          <div
            className="grid gap-y-7 gap-x-8 pt-8"
            style={{ borderTop: `1px solid ${EDGE}`, gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}
          >
            {cfg.colophon.map(([k, v], i) => (
              <div key={i}>
                <div className="text-[12px] mb-1.5" style={{ color: DIM }}>
                  {k}
                </div>
                <div className="text-[14px] break-words" style={/[\\%]/.test(String(v)) ? MONO : undefined}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default EavesProjectPage;
