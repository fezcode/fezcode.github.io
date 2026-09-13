import React, { useMemo, useState } from 'react';
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
 * "graph" — Descry.
 *
 * Two things make Descry Descry: the vault is a graph, and the editor
 * shows you source and rendered text at once. So the page opens on a
 * drifting constellation you can pick nodes out of, and then puts the
 * split editor on screen with the raw markdown beside its own preview.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&family=IBM+Plex+Mono:wght@400;500&display=swap';

const GROUND = '#14120F';
const CARD = '#1C1916';
const SUNK = '#110F0D';
const PAPER = '#E8E1D4';
const DIM = '#9A8F7E';
const EDGE = 'rgba(232,225,212,0.13)';

const SERIF = { fontFamily: "'Newsreader', Georgia, serif" };
const MONO = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

/* Deterministic so prerendered markup matches the first client render. */
const layout = (items, w, h) =>
  items.map((it, i) => {
    const t = (i / items.length) * Math.PI * 2 - Math.PI / 2.2;
    const ring = i % 2 === 0 ? 0.4 : 0.26;
    const wobble = Math.sin(i * 2.7) * 22;
    return {
      ...it,
      x: w / 2 + Math.cos(t) * (ring * Math.min(w, h * 1.7) + wobble),
      y: h / 2 + Math.sin(t) * (ring * h * 1.5 + wobble) * 0.7,
      drift: 3 + (i % 4),
      delay: (i % 5) * 0.7,
    };
  });

const Constellation = ({ items, accent, active, onPick }) => {
  const W = 1000;
  const H = 440;
  const pts = useMemo(() => layout(items, W, H), [items]);
  const cx = W / 2;
  const cy = H / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="The vault as a graph">
      <defs>
        <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.30" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={330} ry={190} fill="url(#g-halo)" />

      {pts.map((p, i) => (
        <line key={`v${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={PAPER} strokeOpacity="0.13" strokeWidth="1" />
      ))}
      {pts.map((p, i) => {
        const q = pts[(i + 2) % pts.length];
        return (
          <line
            key={`c${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke={accent}
            strokeOpacity={active === i || active === (i + 2) % pts.length ? 0.7 : 0.18}
            strokeWidth={active === i ? 1.6 : 1}
          />
        );
      })}

      <circle cx={cx} cy={cy} r="11" fill={accent} />
      <text x={cx} y={cy + 30} textAnchor="middle" style={MONO} fontSize="12" fill={PAPER} opacity="0.85">
        vault
      </text>

      {pts.map((p, i) => {
        const on = active === i;
        return (
          <g
            key={`n${i}`}
            className="g-node"
            style={{ animationDelay: `${p.delay}s`, animationDuration: `${5 + p.drift}s`, cursor: 'pointer' }}
            onMouseEnter={() => onPick(i)}
            onFocus={() => onPick(i)}
            tabIndex={0}
            role="button"
            aria-label={p.label}
          >
            {on && <circle cx={p.x} cy={p.y} r="16" fill={accent} opacity="0.18" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={p.tag ? 5 : 7.5}
              fill={p.tag ? GROUND : PAPER}
              stroke={p.tag ? accent : 'none'}
              strokeWidth="1.8"
              opacity={on ? 1 : 0.88}
            />
            <text
              x={p.x}
              y={p.y - 16}
              textAnchor="middle"
              style={MONO}
              fontSize="12"
              fill={p.tag ? accent : PAPER}
              opacity={on ? 1 : 0.8}
            >
              {p.tag ? `#${p.label}` : `[[${p.label}]]`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* The split the editor actually shows: source left, rendered right. */
const SOURCE = [
  ['# Field notes', 'h'],
  ['', ''],
  ['A vault is a graph, not a folder. See [[graph]]', 'p'],
  ['and the #plugins note for the Lua host.', 'p'],
  ['', ''],
  ['## What survives a restart', 'h2'],
  ['', ''],
  ['- [x] tab text, cursor and scroll', 'li'],
  ['- [x] undo history per tab', 'li'],
  ['- [ ] the coffee', 'li'],
  ['', ''],
  ['> Obsidian ergonomics, no Electron tax.', 'q'],
  ['', ''],
  ['$\\sum_{i=1}^{n} x_i^2$', 'm'],
];

const Preview = ({ accent }) => (
  <div style={{ ...SERIF, color: PAPER }} className="text-[14.5px] leading-[1.75]">
    <div className="text-[24px] mb-3" style={{ fontWeight: 600 }}>
      Field notes
    </div>
    <p className="mb-3" style={{ color: '#D3CABB' }}>
      A vault is a graph, not a folder. See{' '}
      <span style={{ color: accent }}>graph</span> and the{' '}
      <span style={{ color: accent }}>#plugins</span> note for the Lua host.
    </p>
    <div className="text-[17px] mt-4 mb-2" style={{ fontWeight: 600 }}>
      What survives a restart
    </div>
    <ul className="mb-3 space-y-1" style={{ color: '#D3CABB' }}>
      <li>☑ tab text, cursor and scroll</li>
      <li>☑ undo history per tab</li>
      <li>☐ the coffee</li>
    </ul>
    <blockquote
      className="pl-3 mb-3 italic"
      style={{ borderLeft: `2px solid ${accent}`, color: '#C6BCAB' }}
    >
      Obsidian ergonomics, no Electron tax.
    </blockquote>
    <div style={{ color: '#D3CABB' }}>∑ᵢ₌₁ⁿ xᵢ²</div>
  </div>
);

const Note = ({ title, children }) => (
  <section className="py-14" style={{ borderTop: `1px solid ${EDGE}` }}>
    {title && (
      <h2 className="text-[24px] sm:text-[31px] mb-7" style={{ ...SERIF, fontWeight: 500 }}>
        {title}
      </h2>
    )}
    {children}
  </section>
);

const GraphProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'graph');
  const [active, setActive] = useState(null);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={GROUND} color={PAPER} />;

  const a = cfg.accent || '#C98A5C';
  const panels = cfg.panels || [];
  const items = panels.map((p, i) => ({
    label: p.node || p.title.split(' ').pop().toLowerCase(),
    tag: i % 3 === 2,
  }));

  const tint = (hex, alpha) => `${hex}${alpha}`;

  return (
    <div className="min-h-screen" style={{ background: GROUND, color: PAPER, ...SERIF }}>
      <AppSeo cfg={cfg} project={project} />
      <style>{`
        @keyframes g-drift { from { transform: translateY(-5px) } to { transform: translateY(5px) } }
        .g-node { animation: g-drift ease-in-out infinite alternate; }
        .g-node:focus { outline: none; }
        @media (prefers-reduced-motion: reduce) { .g-node { animation: none } }
      `}</style>

      {/* ---------- the vault, full width ---------- */}
      <div className="relative">
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8 pt-7">
          <BackLink color={PAPER} />
        </div>

        <div className="relative mx-auto w-full max-w-[1120px] px-2 sm:px-6 pt-4">
          <Constellation items={items} accent={a} active={active} onPick={setActive} />
          <p className="text-center text-[12px] -mt-2 mb-2" style={{ ...MONO, color: DIM }}>
            {active === null
              ? 'hover a node — links are edges, tags are rings'
              : panels[active]?.title}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <header className="pb-14 pt-2">
          <h1
            className="text-[36px] sm:text-[58px] leading-[1.04]"
            style={{ maxWidth: '17ch', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {cfg.tagline}
          </h1>
          <p className="mt-6 text-[17px] leading-[1.75]" style={{ color: DIM, maxWidth: '60ch' }}>
            {cfg.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {cfg.download && (
              <a
                href={cfg.download}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-[14px]"
                style={{ background: a, color: GROUND, fontWeight: 600 }}
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
                style={{ border: `1px solid ${EDGE}`, color: PAPER }}
              >
                Read the source
              </a>
            )}
          </div>
          <p className="mt-6 text-[12px]" style={{ ...MONO, color: DIM }}>
            v{cfg.version} · {(cfg.platforms || []).join(' · ')} · {(cfg.stack || []).join(' / ')}
          </p>
        </header>

        {/* ---------- the split: source beside preview ---------- */}
        <Note title="Source on the left, rendered on the right">
          <div
            className="overflow-hidden"
            style={{ border: `1px solid ${EDGE}`, borderRadius: 4, background: CARD }}
          >
            <div
              className="flex items-center gap-3 px-4 py-2 text-[11.5px]"
              style={{ ...MONO, color: DIM, borderBottom: `1px solid ${EDGE}` }}
            >
              <span style={{ color: PAPER }}>field-notes.md</span>
              <span className="ml-auto">Ctrl+\ split</span>
            </div>
            <div className="grid md:grid-cols-2" style={{ background: EDGE, gap: 1 }}>
              <div className="p-5" style={{ background: SUNK }}>
                <pre className="text-[12.5px] leading-[1.8] overflow-x-auto" style={{ ...MONO, margin: 0 }}>
                  {SOURCE.map(([line, kind], i) => (
                    <div key={i}>
                      <span style={{ color: tint(PAPER, '4D'), marginRight: 14 }}>
                        {String(i + 1).padStart(2, ' ')}
                      </span>
                      <span
                        style={{
                          color:
                            kind === 'h' || kind === 'h2'
                              ? PAPER
                              : kind === 'q'
                                ? '#B8AE9C'
                                : '#CFC5B4',
                          fontWeight: kind === 'h' || kind === 'h2' ? 600 : 400,
                        }}
                      >
                        {line
                          .split(/(\[\[[^\]]+\]\]|#\w+|\$[^$]+\$|\[[ x]\])/g)
                          .map((seg, j) =>
                            /^\[\[|^#\w|^\$|^\[[ x]\]$/.test(seg) ? (
                              <span key={j} style={{ color: a }}>
                                {seg}
                              </span>
                            ) : (
                              <span key={j}>{seg}</span>
                            ),
                          )}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
              <div className="p-5" style={{ background: CARD }}>
                <Preview accent={a} />
              </div>
            </div>
          </div>
        </Note>

        {(cfg.summary || []).length > 0 && (
          <Note>
            <div className="grid gap-10 md:grid-cols-2">
              {cfg.summary.map((para, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-[1.85]"
                  style={{ color: i === 0 ? PAPER : DIM, maxWidth: '56ch' }}
                >
                  {para}
                </p>
              ))}
            </div>
          </Note>
        )}

        {panels.length > 0 && (
          <Note title={cfg.panelsHeading}>
            <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
              {panels.map((p, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    paddingLeft: 14,
                    borderLeft: `2px solid ${active === i ? a : EDGE}`,
                    transition: 'border-color 200ms',
                  }}
                >
                  <h3 className="text-[17px] mb-2" style={{ fontWeight: 600 }}>
                    <span style={{ ...MONO, color: a, fontSize: 13.5 }}>[[</span>
                    {p.title}
                    <span style={{ ...MONO, color: a, fontSize: 13.5 }}>]]</span>
                  </h3>
                  <p className="text-[15px] leading-[1.8]" style={{ color: DIM, maxWidth: '46ch' }}>
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </Note>
        )}

        {(cfg.shots || []).length > 0 && (
          <Note title={cfg.shotsHeading}>
            <div className="grid gap-8 md:grid-cols-2">
              {cfg.shots.map((s, i) => (
                <figure key={i}>
                  <img
                    src={s.src}
                    alt={s.caption || cfg.name}
                    loading="lazy"
                    className="w-full h-auto"
                    style={{ border: `1px solid ${EDGE}` }}
                  />
                  <figcaption className="mt-3 text-[13px]" style={{ ...MONO, color: DIM }}>
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Note>
        )}

        {(cfg.keys || []).length > 0 && (
          <Note title={cfg.keysHeading}>
            <dl className="grid gap-x-10 sm:grid-cols-2 max-w-[860px]">
              {cfg.keys.map((k, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-baseline gap-x-6 py-2.5"
                  style={{ borderBottom: `1px solid ${EDGE}` }}
                >
                  <dt className="text-[13px]" style={{ ...MONO, color: a, minWidth: 132 }}>
                    {k.k}
                  </dt>
                  <dd className="text-[15px]" style={{ color: DIM }}>
                    {k.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Note>
        )}

        {cfg.terminal && (
          <Note title={cfg.terminalHeading}>
            <pre
              className="overflow-x-auto text-[13px] leading-[2] px-5 py-5"
              style={{ ...MONO, margin: 0, background: SUNK, border: `1px solid ${EDGE}`, color: PAPER }}
            >
              {(cfg.terminal.lines || []).map((l, i) => (
                <div key={i}>
                  <span style={{ color: a }}>$</span> {l}
                </div>
              ))}
            </pre>
          </Note>
        )}

        {cfg.notes && (
          <Note title={cfg.notesTitle}>
            <div className="text-[16px] leading-[1.85]" style={{ maxWidth: '68ch' }}>
              <MarkdownContent content={cfg.notes} />
            </div>
          </Note>
        )}

        {(cfg.colophon || []).length > 0 && (
          <Note>
            <div
              className="grid gap-y-6 gap-x-8 pb-20"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}
            >
              {cfg.colophon.map(([k, v], i) => (
                <div key={i}>
                  <div className="text-[12px] mb-1.5" style={{ ...MONO, color: DIM }}>
                    {k}
                  </div>
                  <div className="text-[15px] break-words">{v}</div>
                </div>
              ))}
            </div>
          </Note>
        )}
      </div>
    </div>
  );
};

export default GraphProjectPage;
