import React, { useEffect, useRef, useState } from 'react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';
import { Link } from 'react-router-dom';
import MarkdownContent from '../../components/MarkdownContent';

/* ============================================================
 * "panes" — clockt.
 *
 * clockt tiles. So does the page: no centred column anywhere, every
 * section a pane running edge to edge, divided by the same hairlines
 * the app draws between splits. A tab strip on top, a status line
 * pinned at the bottom, and the whole thing recolours when you pick a
 * theme — because in clockt a theme reaches the ANSI palette, not just
 * the chrome.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

const SANS = { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" };
const MONO = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

const THEMES = [
  { id: 'Midnight', bg: '#12141C', pane: '#171A24', deep: '#0C0E15', fg: '#D6DAE6', dim: '#79839B', accent: '#6472E8', green: '#63F5A6', yellow: '#E8C56B', red: '#F2708E' },
  { id: 'Phosphor', bg: '#07120C', pane: '#0B1A11', deep: '#050D08', fg: '#BFF5D2', dim: '#5E8F72', accent: '#4BF07A', green: '#4BF07A', yellow: '#B9F06B', red: '#F07A4B' },
  { id: 'Solarized', bg: '#002B36', pane: '#073642', deep: '#00212B', fg: '#E3DCC6', dim: '#7B9098', accent: '#B58900', green: '#859900', yellow: '#B58900', red: '#DC322F' },
  { id: 'Sakura', bg: '#1B1218', pane: '#241A22', deep: '#140D12', fg: '#F3DCE6', dim: '#9C7E8C', accent: '#F2A0C0', green: '#A8E6B0', yellow: '#F0D08A', red: '#F27B9D' },
  { id: 'Newsprint', bg: '#EDE9E0', pane: '#E2DCD0', deep: '#F5F2EB', fg: '#20201D', dim: '#6B675E', accent: '#B2452F', green: '#4C7A3E', yellow: '#9A7A22', red: '#B2452F' },
  { id: 'Neon Tokyo', bg: '#0F0B1E', pane: '#171130', deep: '#0A0716', fg: '#E6DEFF', dim: '#8579B5', accent: '#FF4D9D', green: '#5AF0C8', yellow: '#F5D76E', red: '#FF4D9D' },
];

const SCRIPT = [
  { cmd: 'clockt new -n build', out: [['[clockt] session "build" created · attached', 'dim']] },
  { cmd: 'clockt ls', out: [['NAME     PANES  STATUS', 'dim'], ['build    1      attached', 'green'], ['agent    1      detached', 'dim']] },
  { cmd: 'clockt cmd pane.split.right', out: [['[clockt] pane 2 opened →', 'yellow']], split: true },
  { cmd: 'npm test', out: [['✓ 1519 passing', 'green']], pane: 2 },
];

const useSession = (on) => {
  const [step, setStep] = useState(on ? 0 : SCRIPT.length);
  const [typed, setTyped] = useState(on ? '' : null);
  const timer = useRef();
  useEffect(() => {
    if (!on) return undefined;
    let i = 0;
    let ch = 0;
    let dead = false;
    const run = () => {
      if (dead) return;
      const line = SCRIPT[i];
      if (!line) {
        timer.current = setTimeout(() => {
          i = 0; ch = 0; setStep(0); run();
        }, 4200);
        return;
      }
      if (ch <= line.cmd.length) {
        setTyped(line.cmd.slice(0, ch));
        ch += 1;
        timer.current = setTimeout(run, 34);
      } else {
        setStep(i + 1); setTyped(null); i += 1; ch = 0;
        timer.current = setTimeout(run, 760);
      }
    };
    timer.current = setTimeout(run, 600);
    return () => { dead = true; clearTimeout(timer.current); };
  }, [on]);
  return { step, typed };
};

const PanesProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'panes');
  const [ti, setTi] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const { step, typed } = useSession(animate);
  const t = THEMES[ti];

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background="#12141C" color="#D6DAE6" />;

  const RULE = `${t.dim}3D`;
  const shot = (cfg.shots || [])[0];
  const visible = SCRIPT.slice(0, step);
  const split = visible.some((l) => l.split);
  const onDark = t.id !== 'Newsprint';

  const Pane = ({ children, className = '', style = {} }) => (
    <div className={className} style={{ borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, ...style }}>
      {children}
    </div>
  );

  const PaneLabel = ({ children }) => (
    <div className="px-5 pt-4 pb-3 text-[10.5px]" style={{ ...MONO, color: t.dim, letterSpacing: '0.14em' }}>
      {children}
    </div>
  );

  const Prompt = ({ children, caret }) => (
    <div className="whitespace-pre overflow-hidden">
      <span style={{ color: t.green }}>➜</span> <span style={{ color: t.accent }}>build</span>{' '}
      <span style={{ color: t.fg }}>{children}</span>
      {caret && (
        <span
          style={{
            display: 'inline-block', width: 8, height: 14, background: t.fg,
            verticalAlign: '-2px', animation: animate ? 'pn-caret 1s steps(1) infinite' : 'none',
          }}
        />
      )}
    </div>
  );

  const Term = ({ lines, label, caret }) => (
    <div className="flex-1 min-w-0 px-5 pb-5" style={{ background: t.pane }}>
      <div className="pt-4 pb-3 text-[10.5px]" style={{ ...MONO, color: t.dim }}>{label}</div>
      <div className="text-[12.5px] leading-[1.8]" style={MONO}>
        {lines.map((l, i) => (
          <div key={i}>
            <Prompt>{l.cmd}</Prompt>
            {(l.out || []).map(([text, tone], j) => (
              <div key={j} className="whitespace-pre overflow-hidden" style={{ color: t[tone] || t.fg }}>{text}</div>
            ))}
          </div>
        ))}
        {caret && typed !== null && <Prompt caret>{typed}</Prompt>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.deep, color: t.fg, ...SANS, transition: 'background 300ms, color 300ms' }}>
      <AppSeo cfg={cfg} project={project} />
      <style>{`
        @keyframes pn-caret { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }
        @keyframes pn-in { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:none} }
        .pn-split { animation: pn-in 340ms cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce){ .pn-split{animation:none} }
      `}</style>

      {/* ── tab strip, edge to edge ── */}
      <div className="flex items-stretch text-[12px] overflow-x-auto" style={{ ...MONO, background: t.bg, borderBottom: `1px solid ${RULE}` }}>
        <Link to="/projects" className="px-4 flex items-center flex-none" style={{ color: t.dim, borderRight: `1px solid ${RULE}` }}>
          ←
        </Link>
        <span className="px-5 py-3 flex-none" style={{ color: t.fg, background: t.pane, borderRight: `1px solid ${RULE}`, borderTop: `2px solid ${t.accent}` }}>
          0: {cfg.name}
        </span>
        {['1: panes', '2: themes', '3: keys'].map((x) => (
          <span key={x} className="px-5 py-3 flex-none hidden sm:block" style={{ color: t.dim, borderRight: `1px solid ${RULE}` }}>{x}</span>
        ))}
        <span className="ml-auto px-5 py-3 flex-none" style={{ color: t.dim }}>v{cfg.version}</span>
      </div>

      {/* ── hero: two panes, the window bleeding off the right edge ── */}
      <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <Pane className="px-6 sm:px-10 py-12 sm:py-16 flex flex-col justify-center" style={{ background: t.bg }}>
          <h1
            className="font-bold leading-[0.98]"
            style={{ fontSize: 'clamp(38px, 4.6vw, 68px)', letterSpacing: '-0.045em', maxWidth: '13ch' }}
          >
            {cfg.tagline}
          </h1>
          <p className="mt-7 text-[15.5px] leading-[1.75]" style={{ color: t.dim, maxWidth: '46ch' }}>
            {cfg.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {cfg.download && (
              <a href={cfg.download} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 text-[14px] font-semibold"
                style={{ background: t.accent, color: onDark ? '#0B0D14' : '#fff' }}>
                {cfg.downloadLabel || 'Download'}
              </a>
            )}
            {cfg.repo && (
              <a href={cfg.repo} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 text-[14px]" style={{ border: `1px solid ${RULE}`, color: t.fg }}>
                Read the source
              </a>
            )}
          </div>
          <p className="mt-8 text-[11.5px]" style={{ ...MONO, color: t.dim, letterSpacing: '0.08em' }}>
            {(cfg.platforms || []).join('  ·  ')}  ·  {(cfg.stack || []).join('  /  ')}
          </p>
        </Pane>

        <Pane className="relative overflow-hidden" style={{ background: t.pane, borderRight: 'none', minHeight: 340 }}>
          {shot && (
            <img
              src={shot.src}
              alt={shot.caption || cfg.name}
              className="block"
              style={{
                position: 'absolute', top: 32, left: 34, width: 'calc(100% + 190px)', maxWidth: 'none',
                border: `1px solid ${RULE}`, borderRadius: 6,
                boxShadow: '0 40px 70px -34px rgba(0,0,0,0.95)',
              }}
            />
          )}
        </Pane>
      </div>

      {/* ── the live session + the palette, tiled ── */}
      <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Pane style={{ background: t.pane }}>
          <PaneLabel>LIVE SESSION — SPLIT ARRIVES ON CUE</PaneLabel>
          <div className="flex" style={{ borderTop: `1px solid ${RULE}`, minHeight: 228 }}>
            <Term lines={visible.filter((l) => l.pane !== 2)} label="pane 1 — pwsh" caret={!split || typed !== null} />
            {split && (
              <>
                <div aria-hidden style={{ width: 1, background: RULE }} />
                <div className="flex-1 min-w-0 pn-split flex">
                  <Term lines={visible.filter((l) => l.pane === 2)} label="pane 2 — pwsh" caret={false} />
                </div>
              </>
            )}
          </div>
        </Pane>

        <Pane style={{ background: t.bg, borderRight: 'none' }}>
          <PaneLabel>FOURTEEN THEMES — THE PALETTE, NOT THE CHROME</PaneLabel>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', borderTop: `1px solid ${RULE}` }}>
            {THEMES.map((th, i) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setTi(i)}
                aria-pressed={i === ti}
                className="text-left px-4 py-4"
                style={{
                  background: th.bg, color: th.fg,
                  borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`,
                  outline: i === ti ? `2px solid ${th.accent}` : 'none', outlineOffset: -2,
                }}
              >
                <span className="flex gap-1 mb-2.5" aria-hidden>
                  {[th.accent, th.green, th.yellow, th.red].map((c) => (
                    <span key={c} style={{ width: 14, height: 7, background: c }} />
                  ))}
                </span>
                <span className="text-[12px]" style={{ ...MONO }}>{th.id}</span>
              </button>
            ))}
          </div>
        </Pane>
      </div>

      {/* ── summary, two panes ── */}
      {(cfg.summary || []).length > 0 && (
        <div className="grid md:grid-cols-2">
          {cfg.summary.map((p, i) => (
            <Pane key={i} className="px-6 sm:px-10 py-10" style={{ background: i ? t.bg : t.pane, borderRight: i ? 'none' : undefined }}>
              <p className="text-[15.5px] leading-[1.85]" style={{ color: i ? t.dim : t.fg, maxWidth: '52ch' }}>{p}</p>
            </Pane>
          ))}
        </div>
      )}

      {/* ── features: a tiled grid, full bleed ── */}
      {(cfg.panels || []).length > 0 && (
        <>
          <div className="px-6 sm:px-10 py-7" style={{ background: t.deep, borderBottom: `1px solid ${RULE}` }}>
            <h2 className="font-bold" style={{ fontSize: 'clamp(24px,2.6vw,34px)', letterSpacing: '-0.03em' }}>
              {cfg.panelsHeading}
            </h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))' }}>
            {cfg.panels.map((p, i) => (
              <Pane key={i} className="px-6 sm:px-8 py-8" style={{ background: i % 2 ? t.pane : t.bg }}>
                <span className="text-[11px]" style={{ ...MONO, color: t.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-[16px] font-semibold mt-3 mb-2.5">{p.title}</h3>
                <p className="text-[14px] leading-[1.78]" style={{ color: t.dim, maxWidth: '42ch' }}>{p.body}</p>
                {p.keys && (
                  <code className="mt-4 inline-block px-2.5 py-1.5 text-[12px]"
                    style={{ ...MONO, background: t.deep, border: `1px solid ${RULE}`, color: t.accent }}>
                    {p.keys}
                  </code>
                )}
              </Pane>
            ))}
          </div>
        </>
      )}

      {/* ── keys + cli, side by side ── */}
      <div className="grid lg:grid-cols-2">
        {(cfg.keys || []).length > 0 && (
          <Pane style={{ background: t.bg }}>
            <PaneLabel>{(cfg.keysHeading || 'KEYS').toUpperCase()}</PaneLabel>
            <div style={{ borderTop: `1px solid ${RULE}` }}>
              {cfg.keys.map((k, i) => (
                <div key={i} className="flex flex-wrap items-baseline gap-x-5 px-5 py-2.5"
                  style={{ borderBottom: i === cfg.keys.length - 1 ? 'none' : `1px solid ${RULE}` }}>
                  <span className="text-[12.5px]" style={{ ...MONO, color: t.accent, minWidth: 172 }}>{k.k}</span>
                  <span className="text-[14px]" style={{ color: t.dim }}>{k.a}</span>
                </div>
              ))}
            </div>
          </Pane>
        )}
        {cfg.terminal && (
          <Pane style={{ background: t.pane, borderRight: 'none' }}>
            <PaneLabel>{(cfg.terminalHeading || 'CLI').toUpperCase()}</PaneLabel>
            <pre className="px-5 pb-6 overflow-x-auto text-[12.5px] leading-[2.05]"
              style={{ ...MONO, margin: 0, color: t.fg, borderTop: `1px solid ${RULE}`, paddingTop: 16 }}>
              {(cfg.terminal.lines || []).map((l, i) => (
                <div key={i}><span style={{ color: t.green }}>➜</span> {l}</div>
              ))}
            </pre>
          </Pane>
        )}
      </div>

      {cfg.notes && (
        <Pane className="px-6 sm:px-10 py-10" style={{ background: t.bg, borderRight: 'none' }}>
          <h2 className="text-[22px] font-bold mb-5" style={{ letterSpacing: '-0.025em' }}>{cfg.notesTitle}</h2>
          <div className="text-[15px] leading-[1.85]" style={{ maxWidth: '72ch' }}>
            <MarkdownContent content={cfg.notes} />
          </div>
        </Pane>
      )}

      <div className="flex-1" style={{ background: t.deep }} />

      {/* ── status line, pinned ── */}
      <div className="sticky bottom-0 flex items-center gap-5 px-4 py-2 text-[11.5px] overflow-x-auto"
        style={{ ...MONO, background: t.accent, color: onDark ? '#0B0D14' : '#fff' }}>
        <span className="font-semibold flex-none">{cfg.name}</span>
        {(cfg.colophon || []).slice(0, 3).map(([k, v], i) => (
          <span key={i} className="flex-none hidden sm:inline" style={{ opacity: 0.88 }}>{k}: {v}</span>
        ))}
        <span className="ml-auto flex-none">{t.id}</span>
      </div>
    </div>
  );
};

export default PanesProjectPage;
