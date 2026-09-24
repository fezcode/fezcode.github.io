import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { marked } from 'marked';
import {
  AppleLogoIcon,
  ArrowLeftIcon,
  CommandIcon,
  DownloadSimpleIcon,
  GithubLogoIcon,
  LinuxLogoIcon,
  MagnifyingGlassIcon,
  WindowsLogoIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useAppConfig, useThemeFonts, AppLoading, AppMissing, AppSeo } from './app-shell';

/* ============================================================
 * "graph" — Descry.
 *
 * Descry treats a vault as a graph, so the page opens on one: a live
 * force-directed map of notes and tags you can drag, hover to see
 * each node's neighbourhood, and click to read. Everything after it
 * is the editor doing its job: a source pane you can type into that
 * renders beside itself — [[wiki links]] and #tags included — and
 * grows its own little graph as you add them; the command palette,
 * opened with the keys Descry uses; the real Lua plugin; and the
 * release downloads for whichever OS you are on.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';

const GROUND = '#13110E';
const CARD = '#1C1915';
const SUNK = '#0F0D0B';
const PAPER = '#EFE7D8';
const DIM = '#A89C88';
const FAINT = '#6E6556';
const EDGE = 'rgba(239,231,216,0.11)';
const COPPER = '#F0975A';
const TEAL = '#4FD1C5';

const SERIF = { fontFamily: "'Newsreader', Georgia, serif" };
const SANS = { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" };
const MONO = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

const H2 = ({ eyebrow, children, body }) => (
  <Reveal className="mb-10 md:mb-14 max-w-[760px]">
    {eyebrow && (
      <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ ...MONO, color: COPPER }}>
        [[{eyebrow}]]
      </p>
    )}
    <h2 className="mt-4 leading-[1.02] tracking-[-0.02em]" style={{ ...SERIF, fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)' }}>
      {children}
    </h2>
    {body && (
      <p className="mt-5 text-[16.5px] leading-[1.7]" style={{ color: DIM }}>
        {body}
      </p>
    )}
  </Reveal>
);

const Kbd = ({ children, mac }) => {
  const label = mac ? children.replace(/Ctrl\+/g, '⌘').replace(/Alt\+/g, '⌥').replace(/Shift\+/g, '⇧') : children;
  return (
    <kbd className="inline-flex items-center h-6 px-2 rounded-[5px] text-[11.5px] whitespace-nowrap" style={{ ...MONO, color: PAPER, background: '#26221D', border: `1px solid ${EDGE}`, boxShadow: '0 2px 0 #0A0908' }}>
      {label}
    </kbd>
  );
};

/* ---------- a small force simulation, shared by both graphs ---------- */

const useForceGraph = (nodes, edges, { width, height, strength = 1 }) => {
  const [, setTick] = useState(0);
  const sim = useRef({ pos: {}, vel: {}, fixed: null });
  const reduce = useReducedMotion();

  useEffect(() => {
    const S = sim.current;
    nodes.forEach((n, i) => {
      if (!S.pos[n.id]) {
        const a = (i / Math.max(1, nodes.length)) * Math.PI * 2;
        S.pos[n.id] = { x: width / 2 + Math.cos(a) * width * 0.25, y: height / 2 + Math.sin(a) * height * 0.25 };
        S.vel[n.id] = { x: 0, y: 0 };
      }
    });
    Object.keys(S.pos).forEach((id) => {
      if (!nodes.find((n) => n.id === id)) {
        delete S.pos[id];
        delete S.vel[id];
      }
    });
    let frame = 0;
    let steps = 0;
    const step = () => {
      const P = S.pos;
      const V = S.vel;
      const ids = nodes.map((n) => n.id);
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          const a = P[ids[i]];
          const b = P[ids[j]];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          const d2 = Math.max(dx * dx + dy * dy, 40);
          const f = (9000 * strength) / d2;
          const d = Math.sqrt(d2);
          dx /= d;
          dy /= d;
          V[ids[i]].x += dx * f;
          V[ids[i]].y += dy * f;
          V[ids[j]].x -= dx * f;
          V[ids[j]].y -= dy * f;
        }
      }
      edges.forEach(([s, t]) => {
        const a = P[s];
        const b = P[t];
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - 125 * strength) * 0.01;
        V[s].x += (dx / d) * f;
        V[s].y += (dy / d) * f;
        V[t].x -= (dx / d) * f;
        V[t].y -= (dy / d) * f;
      });
      ids.forEach((id) => {
        if (S.fixed === id) return;
        V[id].x += (width / 2 - P[id].x) * 0.0025;
        V[id].y += (height / 2 - P[id].y) * 0.004;
        V[id].x *= 0.82;
        V[id].y *= 0.82;
        P[id].x = Math.max(24, Math.min(width - 24, P[id].x + V[id].x));
        P[id].y = Math.max(24, Math.min(height - 24, P[id].y + V[id].y));
      });
    };
    const loop = () => {
      step();
      steps += 1;
      setTick((t) => t + 1);
      if (steps < 400 || S.fixed) frame = requestAnimationFrame(loop);
    };
    if (reduce) {
      for (let k = 0; k < 300; k += 1) step();
      setTick((t) => t + 1);
    } else frame = requestAnimationFrame(loop);
    sim.current.kick = () => {
      steps = 0;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    return () => cancelAnimationFrame(frame);
  }, [nodes, edges, width, height, strength, reduce]);

  return sim.current;
};

/* ---------- the hero graph ---------- */

const VaultGraph = ({ vault }) => {
  const W = 900;
  const H = 520;
  const { nodes, edges } = useMemo(() => {
    const n = vault.notes.map((id) => ({ id, kind: 'note' }));
    const e = [...vault.links];
    Object.entries(vault.tags).forEach(([tag, notes]) => {
      n.push({ id: tag, kind: 'tag' });
      notes.forEach((x) => e.push([tag, x]));
    });
    return { nodes: n, edges: e };
  }, [vault]);
  const sim = useForceGraph(nodes, edges, { width: W, height: H });
  const [hover, setHover] = useState(null);
  const [sel, setSel] = useState('vault');
  const svg = useRef(null);
  const degree = (id) => edges.filter(([a, b]) => a === id || b === id).length;
  const near = (id) => new Set([id, ...edges.filter(([a, b]) => a === id || b === id).flat()]);
  const focus = hover || sel;
  const hood = focus ? near(focus) : null;

  const toLocal = (e) => {
    const r = svg.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const onDown = (id) => (e) => {
    e.preventDefault();
    sim.fixed = id;
    sim.kick?.();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!sim.fixed) return;
    const p = toLocal(e);
    sim.pos[sim.fixed] = p;
    sim.vel[sim.fixed] = { x: 0, y: 0 };
  };
  const onUp = () => {
    sim.fixed = null;
  };

  const blurb = vault.blurbs[sel] || (sel?.startsWith('#') ? `Tag · ${vault.tags[sel]?.length || 0} notes: ${(vault.tags[sel] || []).join(', ')}` : '');

  return (
    <div className="relative">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} role="img" aria-label="A force-directed graph of a Descry vault: notes and tags joined by links">
        <defs>
          <radialGradient id="dg-glow">
            <stop offset="0" stopColor={COPPER} stopOpacity="0.35" />
            <stop offset="1" stopColor={COPPER} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={W / 2} cy={H / 2} rx={W * 0.42} ry={H * 0.42} fill="url(#dg-glow)" opacity="0.5" />
        {edges.map(([a, b]) => {
          const p = sim.pos[a];
          const q = sim.pos[b];
          if (!p || !q) return null;
          const on = hood && hood.has(a) && hood.has(b) && (a === focus || b === focus);
          const tag = a.startsWith('#') || b.startsWith('#');
          return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={on ? (tag ? TEAL : COPPER) : PAPER} strokeOpacity={on ? 0.9 : hood ? 0.06 : 0.16} strokeWidth={on ? 1.6 : 1} strokeDasharray={tag ? '3 4' : undefined} />;
        })}
        {nodes.map((n) => {
          const p = sim.pos[n.id];
          if (!p) return null;
          const tag = n.kind === 'tag';
          const r = (tag ? 4.5 : 5) + degree(n.id) * 1.25;
          const dim = hood && !hood.has(n.id);
          const color = tag ? TEAL : n.id === sel ? COPPER : PAPER;
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`} style={{ cursor: 'grab', opacity: dim ? 0.22 : 1, transition: 'opacity 200ms' }} onPointerDown={onDown(n.id)} onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(null)} onClick={() => setSel(n.id)} tabIndex={0} role="button" aria-label={n.id} onKeyDown={(e) => e.key === 'Enter' && setSel(n.id)}>
              {n.id === sel && <circle r={r + 7} fill="none" stroke={COPPER} strokeOpacity="0.5" />}
              {tag ? <rect x={-r} y={-r} width={r * 2} height={r * 2} rx="2" fill={GROUND} stroke={color} strokeWidth="1.6" transform="rotate(45)" /> : <circle r={r} fill={color} />}
              <text y={-r - 8} textAnchor="middle" style={{ ...MONO, fontSize: 12, fill: n.id === focus ? PAPER : DIM }}>
                {tag ? n.id : `[[${n.id}]]`}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mx-auto -mt-2 max-w-[420px] rounded-[10px] p-4" style={{ background: 'rgba(19,17,14,0.88)', border: `1px solid ${EDGE}`, backdropFilter: 'blur(8px)' }} aria-live="polite">
        <p className="text-[13px]" style={{ ...MONO, color: sel?.startsWith('#') ? TEAL : COPPER }}>
          {sel?.startsWith('#') ? sel : `[[${sel}]]`}
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.5]" style={{ color: PAPER }}>
          {blurb}
        </p>
        <p className="mt-2 text-[12px]" style={{ color: FAINT }}>
          {degree(sel)} connections · drag a node, click to read
        </p>
      </div>
    </div>
  );
};

/* ---------- the live editor ---------- */

const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', i: 'ᵢ', n: 'ₙ', '=': '₌', '+': '₊', '-': '₋', j: 'ⱼ', k: 'ₖ' };
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ', i: 'ⁱ', '+': '⁺', '-': '⁻', '=': '⁼' };
const GREEK = { sum: '∑', prod: '∏', int: '∫', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', pi: 'π', theta: 'θ', lambda: 'λ', mu: 'μ', sigma: 'σ', infty: '∞', sqrt: '√', le: '≤', ge: '≥', neq: '≠', to: '→', cdot: '·' };
/** Descry's typographic math pass, in miniature: glyphs, not a TeX engine. */
const texToUnicode = (src) =>
  src
    .replace(/\\([a-z]+)/g, (m, w) => GREEK[w] || m)
    .replace(/_\{([^}]*)\}|_(\w)/g, (m, a, b) => [...(a ?? b)].map((c) => SUB[c] ?? c).join(''))
    .replace(/\^\{([^}]*)\}|\^(\w)/g, (m, a, b) => [...(a ?? b)].map((c) => SUP[c] ?? c).join(''));

// '>' is left alone so Markdown block quotes still parse; '<' is enough to keep tags inert.
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const renderNote = (src) => {
  // Escape first: this renders whatever is typed, so raw HTML stays text.
  let s = escapeHtml(src);
  s = s.replace(/\$([^$\n]+)\$/g, (m, t) => `<span class="dq-math">${texToUnicode(t)}</span>`);
  s = s.replace(/\[\[([^\]\n]+)\]\]/g, (m, t) => `<a class="dq-wiki" data-note="${t}">${t}</a>`);
  s = s.replace(/(^|\s)#([A-Za-z][\w-]*)/g, (m, pre, t) => `${pre}<span class="dq-tag">#${t}</span>`);
  return marked.parse(s, { gfm: true, breaks: false });
};

const extract = (src) => {
  const links = [...new Set([...src.matchAll(/\[\[([^\]\n]+)\]\]/g)].map((m) => m[1].toLowerCase()))];
  const tags = [...new Set([...src.matchAll(/(?:^|\s)#([A-Za-z][\w-]*)/g)].map((m) => `#${m[1].toLowerCase()}`))];
  return { links, tags };
};

const NoteGraph = ({ links, tags }) => {
  const W = 420;
  const H = 300;
  const nodes = useMemo(() => [{ id: 'field notes' }, ...links.map((id) => ({ id })), ...tags.map((id) => ({ id }))], [links, tags]);
  const edges = useMemo(() => [...links, ...tags].map((x) => ['field notes', x]), [links, tags]);
  const sim = useForceGraph(nodes, edges, { width: W, height: H, strength: 0.85 });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" role="img" aria-label="This note's links and tags">
      {edges.map(([a, b]) => {
        const p = sim.pos[a];
        const q = sim.pos[b];
        return p && q ? <line key={b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={b.startsWith('#') ? TEAL : COPPER} strokeOpacity="0.55" strokeDasharray={b.startsWith('#') ? '3 4' : undefined} /> : null;
      })}
      {nodes.map((n) => {
        const p = sim.pos[n.id];
        if (!p) return null;
        const root = n.id === 'field notes';
        const tag = n.id.startsWith('#');
        return (
          <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
            <circle r={root ? 10 : 6} fill={root ? COPPER : tag ? GROUND : PAPER} stroke={tag ? TEAL : 'none'} strokeWidth="1.5" />
            <text y={root ? -16 : -11} textAnchor="middle" style={{ ...MONO, fontSize: 11, fill: root ? PAPER : DIM }}>
              {tag ? n.id : `[[${n.id}]]`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LiveEditor = ({ sample }) => {
  const [src, setSrc] = useState(sample);
  const [tab, setTab] = useState('preview');
  const html = useMemo(() => renderNote(src), [src]);
  const { links, tags } = useMemo(() => extract(src), [src]);
  const words = (src.match(/\S+/g) || []).length;
  const lines = src.split('\n').length;
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ background: SUNK, border: `1px solid ${EDGE}`, boxShadow: '0 50px 100px -40px rgba(0,0,0,0.8)' }}>
      <div className="flex items-center h-10 px-3 text-[12px]" style={{ ...MONO, background: '#0B0A08', borderBottom: `1px solid ${EDGE}`, color: DIM }}>
        <span className="px-3 h-full inline-flex items-center" style={{ background: SUNK, color: PAPER, borderRight: `1px solid ${EDGE}` }}>
          field-notes.md ●
        </span>
        <span className="px-3 hidden sm:inline">graph-view.md</span>
        <span className="ml-auto flex gap-1">
          {['preview', 'graph'].map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className="px-2.5 h-7 rounded uppercase tracking-[0.08em] text-[11px]" style={tab === t ? { background: COPPER, color: GROUND } : { color: DIM }} aria-pressed={tab === t}>
              {t}
            </button>
          ))}
        </span>
      </div>
      <div className="grid md:grid-cols-2 min-h-[460px]">
        <label className="relative flex" style={{ borderRight: `1px solid ${EDGE}` }}>
          <span className="sr-only">Markdown source — type to see it render</span>
          <span className="shrink-0 w-10 pt-4 text-right pr-2 text-[12px] leading-[1.75] select-none" style={{ ...MONO, color: FAINT }} aria-hidden>
            {Array.from({ length: lines }, (_, i) => (
              <span key={i} className="block">
                {i + 1}
              </span>
            ))}
          </span>
          <textarea value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} className="flex-1 bg-transparent resize-none outline-none p-4 pl-2 text-[13px] leading-[1.75] min-h-[460px]" style={{ ...MONO, color: PAPER, caretColor: COPPER }} />
        </label>
        <div className="relative p-6 overflow-auto max-h-[560px]">
          {tab === 'preview' ? (
            <div className="dq-prose" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="h-[420px]">
              <NoteGraph links={links} tags={tags} />
              <p className="text-[12.5px] text-center" style={{ color: FAINT }}>
                Type a new [[link]] or #tag on the left and it joins the graph.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 h-9 text-[11.5px]" style={{ ...MONO, background: '#0B0A08', borderTop: `1px solid ${EDGE}`, color: FAINT }}>
        <span>EDIT · split preview</span>
        <span style={{ color: COPPER }}>{links.length} links</span>
        <span style={{ color: TEAL }}>{tags.length} tags</span>
        <span className="ml-auto">words: {words}</span>
      </div>
    </div>
  );
};

/* ---------- command palette ---------- */

const fuzzy = (q, s) => {
  let i = 0;
  const t = s.toLowerCase();
  for (const c of q.toLowerCase()) {
    i = t.indexOf(c, i);
    if (i < 0) return false;
    i += 1;
  }
  return true;
};

const Palette = ({ open, onClose, items, mac }) => {
  const [q, setQ] = useState('');
  const [at, setAt] = useState(0);
  const [ran, setRan] = useState(null);
  const input = useRef(null);
  const list = items.filter(([name, , cat]) => !q || fuzzy(q, `${name} ${cat}`));
  useEffect(() => {
    if (open) {
      setQ('');
      setAt(0);
      setRan(null);
      window.setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);
  const run = (item) => {
    if (!item) return;
    setRan(item[0]);
    window.setTimeout(onClose, 700);
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" style={{ background: 'rgba(8,7,6,0.6)', backdropFilter: 'blur(3px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-[600px] rounded-[12px] overflow-hidden" style={{ background: CARD, border: `1px solid ${EDGE}`, boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }} initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -8, scale: 0.98 }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 h-14" style={{ borderBottom: `1px solid ${EDGE}` }}>
              <MagnifyingGlassIcon size={17} color={DIM} />
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setAt(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setAt((a) => Math.min(list.length - 1, a + 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setAt((a) => Math.max(0, a - 1));
                  } else if (e.key === 'Enter') run(list[at]);
                  else if (e.key === 'Escape') onClose();
                }}
                placeholder="Run a command… try “graph” or “word”"
                className="flex-1 bg-transparent outline-none text-[15px]"
                style={{ ...SANS, color: PAPER }}
              />
              <button type="button" onClick={onClose} aria-label="Close" style={{ color: DIM }}>
                <XIcon size={16} />
              </button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto py-1.5">
              {list.map((it, i) => (
                <li key={it[0]}>
                  <button type="button" onMouseEnter={() => setAt(i)} onClick={() => run(it)} className="w-full flex items-center gap-3 px-4 h-11 text-left text-[14px]" style={{ ...SANS, background: i === at ? 'rgba(240,151,90,0.14)' : 'transparent', color: PAPER }}>
                    <span className="text-[10.5px] px-1.5 py-0.5 rounded uppercase tracking-[0.06em]" style={{ ...MONO, background: it[2].endsWith('.lua') ? 'rgba(79,209,197,0.15)' : 'rgba(239,231,216,0.08)', color: it[2].endsWith('.lua') ? TEAL : DIM }}>
                      {it[2]}
                    </span>
                    <span className="flex-1">{it[0]}</span>
                    {it[1] && <Kbd mac={mac}>{it[1]}</Kbd>}
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="px-4 py-6 text-[14px]" style={{ color: FAINT }}>No command matches.</li>}
            </ul>
            <div className="px-4 h-10 flex items-center text-[12px]" style={{ ...MONO, borderTop: `1px solid ${EDGE}`, color: ran ? COPPER : FAINT }}>
              {ran ? `ran “${ran}”` : '↑↓ to move · Enter to run · Esc to close'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Lua, lightly coloured ---------- */

const LuaCode = ({ code }) => (
  <pre className="m-0 p-6 overflow-x-auto text-[13px] leading-[1.75]" style={{ ...MONO, color: PAPER }}>
    {code.split('\n').map((line, i) => {
      const cm = line.indexOf('--');
      const body = cm >= 0 ? line.slice(0, cm) : line;
      const comment = cm >= 0 ? line.slice(cm) : '';
      const parts = body.split(/("[^"]*"|\bdescry\.[\w.]+|\b(?:local|function|end|return|select)\b)/g);
      return (
        <div key={i}>
          {parts.map((p, j) => (
            <span key={j} style={{ color: p.startsWith('"') ? '#A6E3A1' : p.startsWith('descry.') ? COPPER : /^(local|function|end|return|select)$/.test(p) ? '#C4A7E7' : undefined }}>
              {p}
            </span>
          ))}
          {comment && <span style={{ color: FAINT }}>{comment}</span>}
        </div>
      );
    })}
  </pre>
);

const PROSE_CSS = `
.dq-prose { font-family: 'IBM Plex Sans', system-ui, sans-serif; color: ${PAPER}; font-size: 15px; line-height: 1.7; }
.dq-prose h1 { font-family: 'Newsreader', Georgia, serif; font-size: 32px; font-weight: 400; margin: 0 0 12px; }
.dq-prose h2 { font-family: 'Newsreader', Georgia, serif; font-size: 23px; font-weight: 400; margin: 22px 0 8px; }
.dq-prose p { margin: 0 0 12px; }
.dq-prose ul { margin: 0 0 12px; padding-left: 4px; list-style: none; }
.dq-prose li { margin: 3px 0; }
.dq-prose li input { accent-color: ${COPPER}; margin-right: 8px; }
.dq-prose blockquote { margin: 0 0 12px; padding-left: 14px; border-left: 2px solid ${COPPER}; color: ${DIM}; font-style: italic; }
.dq-prose table { border-collapse: collapse; margin: 6px 0 14px; font-size: 13.5px; }
.dq-prose th, .dq-prose td { border: 1px solid ${EDGE}; padding: 6px 12px; text-align: left; }
.dq-prose th { background: rgba(239,231,216,0.05); }
.dq-prose code { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; background: rgba(239,231,216,0.07); padding: 1px 5px; border-radius: 4px; }
.dq-prose .dq-wiki { color: ${COPPER}; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; cursor: pointer; }
.dq-prose .dq-tag { color: ${TEAL}; background: rgba(79,209,197,0.1); padding: 0 5px; border-radius: 4px; font-size: 13.5px; }
.dq-prose .dq-math { font-family: 'Newsreader', Georgia, serif; font-style: italic; font-size: 17px; color: #F5D9A8; }
`;

/* ============================================================ */

const detectOs = () => {
  if (typeof navigator === 'undefined') return 'windows';
  const s = `${navigator.userAgent} ${navigator.platform}`;
  if (/Mac/i.test(s)) return 'mac';
  if (/Linux|X11/i.test(s) && !/Android/i.test(s)) return 'linux';
  return 'windows';
};

const OS_ICON = { windows: WindowsLogoIcon, mac: AppleLogoIcon, linux: LinuxLogoIcon };

const GraphProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'graph');
  const [palette, setPalette] = useState(false);
  const [os, setOs] = useState('windows');
  const [mac, setMac] = useState(false);
  const [shot, setShot] = useState(null);

  useEffect(() => {
    const d = detectOs();
    setOs(d);
    setMac(d === 'mac');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      // Ctrl+K belongs to the site's own command palette; Descry's binding is Ctrl+Shift+P.
      if (mod && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setPalette(true);
      } else if (e.key === 'Escape') setShot(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={GROUND} color={PAPER} />;

  const primary = (cfg.downloads || []).find((d) => d.os === os) || cfg.downloads?.[0];
  const OsIcon = OS_ICON[os];

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: GROUND, color: PAPER, ...SANS }}>
      <style>{PROSE_CSS}</style>
      <AppSeo cfg={cfg} project={project} />
      <Palette open={palette} onClose={() => setPalette(false)} items={cfg.palette || []} mac={mac} />

      {/* ---------- header ---------- */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(19,17,14,0.85)', borderBottom: `1px solid ${EDGE}`, backdropFilter: 'blur(10px)' }}>
        <div className="mx-auto max-w-[1280px] flex items-center gap-4 px-4 sm:px-8 h-14">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: DIM }}>
            <ArrowLeftIcon size={14} /> Projects
          </Link>
          <a href="#top" className="text-[23px]" style={{ ...SERIF }}>
            Descry
          </a>
          <span className="hidden sm:inline text-[11.5px] px-2 py-0.5 rounded" style={{ ...MONO, color: COPPER, border: `1px solid ${EDGE}` }}>
            v{cfg.version}
          </span>
          <nav className="ml-auto hidden md:flex gap-6 text-[13px]" style={{ color: DIM }}>
            {[
              ['#editor', 'Editor'],
              ['#new', 'What’s new'],
              ['#plugins', 'Plugins'],
              ['#keys', 'Keys'],
            ].map(([h, l]) => (
              <a key={h} href={h} className="hover:text-white">
                {l}
              </a>
            ))}
          </nav>
          <button type="button" onClick={() => setPalette(true)} className="ml-auto md:ml-2 h-9 px-3 inline-flex items-center gap-2 rounded-[8px] text-[12.5px]" style={{ border: `1px solid ${EDGE}`, color: DIM }}>
            <CommandIcon size={14} /> <span className="hidden sm:inline">Commands</span> <Kbd mac={mac}>Ctrl+Shift+P</Kbd>
          </button>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* ---------- hero ---------- */}
        <section className="pt-12 md:pt-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center [&>*]:min-w-0">
          <Reveal>
            <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ ...MONO, color: COPPER }}>
              {(cfg.stack || []).join(' · ')}
            </p>
            <h1 className="mt-5 leading-[0.98] tracking-[-0.025em]" style={{ ...SERIF, fontWeight: 300, fontSize: 'clamp(46px, 7vw, 96px)' }}>
              A markdown editor that <em style={{ color: COPPER }}>starts instantly.</em>
            </h1>
            <p className="mt-6 text-[17px] leading-[1.7] max-w-[50ch]" style={{ color: DIM }}>
              {cfg.subtitle}
            </p>
            {primary && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={primary.href} className="h-12 px-6 inline-flex items-center gap-2.5 rounded-[10px] text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5" style={{ background: COPPER, color: GROUND }}>
                  {OsIcon && <OsIcon size={18} weight="fill" />} Download for {primary.label.split(' ')[0]}
                </a>
                <a href={cfg.repo} target="_blank" rel="noopener noreferrer" className="h-12 px-6 inline-flex items-center gap-2 rounded-[10px] text-[14.5px]" style={{ border: `1px solid ${EDGE}`, color: PAPER }}>
                  <GithubLogoIcon size={17} /> Source
                </a>
              </div>
            )}
            <p className="mt-4 text-[12.5px]" style={{ ...MONO, color: FAINT }}>
              {primary?.file} · Windows, macOS and Linux · MIT
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <VaultGraph vault={cfg.vault} />
          </Reveal>
        </section>

        {/* ---------- summary as a pull quote ---------- */}
        <section className="mt-20 md:mt-28 grid md:grid-cols-2 gap-8 md:gap-16 py-12" style={{ borderTop: `1px solid ${EDGE}`, borderBottom: `1px solid ${EDGE}` }}>
          {cfg.summary.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="leading-[1.45]" style={{ ...SERIF, fontWeight: 300, fontSize: i === 0 ? 'clamp(24px, 2.6vw, 32px)' : '19px', color: i === 0 ? PAPER : DIM }}>
                {s}
              </p>
            </Reveal>
          ))}
        </section>

        {/* ---------- live editor ---------- */}
        <section id="editor" className="pt-24 md:pt-32 scroll-mt-20">
          <H2 eyebrow="live preview" body="This is a source pane you can type into. It renders beside itself — task lists, quotes, tables, [[wiki links]], #tags and typographic math — and the Graph tab grows as you add links.">
            Source on the left, <em>rendered on the right.</em>
          </H2>
          <Reveal>
            <LiveEditor sample={cfg.sample} />
          </Reveal>
        </section>

        {/* ---------- what works ---------- */}
        <section className="pt-24 md:pt-32">
          <H2 eyebrow="what works">{cfg.panelsHeading === 'What works' ? <>A real editor, <em>not a web page.</em></> : cfg.panelsHeading}</H2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cfg.panels.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.05}>
                <div className="h-full rounded-[14px] p-7" style={{ background: CARD, border: `1px solid ${EDGE}` }}>
                  <p className="text-[12.5px]" style={{ ...MONO, color: COPPER }}>
                    [[{p.node}]]
                  </p>
                  <h3 className="mt-4 text-[26px] leading-[1.1]" style={SERIF}>
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65]" style={{ color: DIM }}>
                    {p.body}
                  </p>
                  {p.keys && (
                    <div className="mt-5">
                      <Kbd mac={mac}>{p.keys.replace(/\b\w/g, (c) => c.toUpperCase())}</Kbd>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px rounded-[14px] overflow-hidden" style={{ background: EDGE }}>
            {cfg.features.map((f) => (
              <div key={f.t} className="p-5" style={{ background: GROUND }}>
                <p className="text-[14.5px] font-semibold">{f.t}</p>
                <p className="mt-1.5 text-[13px] leading-[1.55]" style={{ color: DIM }}>
                  {f.b}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- what's new ---------- */}
        {cfg.whatsNew && (
          <section id="new" className="pt-24 md:pt-32 scroll-mt-20">
            <H2 eyebrow="changelog">
              Six releases <em>in four days.</em>
            </H2>
            <ol className="relative pl-8" style={{ borderLeft: `1px solid ${EDGE}` }}>
              {cfg.whatsNew.map((w, i) => (
                <Reveal key={w.v} delay={i * 0.04}>
                  <li className="relative pb-10">
                    <span className="absolute -left-[37px] top-1.5 w-[10px] h-[10px] rounded-full" style={{ background: i === 0 ? COPPER : GROUND, border: `2px solid ${COPPER}` }} />
                    <div className="grid md:grid-cols-[120px_1fr] gap-2 md:gap-8">
                      <a href={w.v === 'CI' ? `${cfg.repo}/actions` : `${cfg.repo}/releases/tag/v${w.v}`} target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline" style={{ ...MONO, color: COPPER }}>
                        {w.v === 'CI' ? 'CI' : `v${w.v}`}
                      </a>
                      <div>
                        <h3 className="text-[24px] leading-tight" style={SERIF}>
                          {w.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-[1.65] max-w-[64ch]" style={{ color: DIM }}>
                          {w.body}
                        </p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {/* ---------- screenshots ---------- */}
        {(cfg.shots || []).length > 0 && (
          <section className="pt-16 md:pt-24">
            <H2 eyebrow="on screen">
              The real thing, <em>at work.</em>
            </H2>
            <div className="grid md:grid-cols-2 gap-4">
              {cfg.shots.map((s, i) => (
                <Reveal key={s.src} delay={(i % 2) * 0.06}>
                  <button type="button" onClick={() => setShot(s)} className="group block w-full text-left">
                    <div className="rounded-[12px] overflow-hidden" style={{ border: `1px solid ${EDGE}` }}>
                      <img src={s.src} alt={s.caption} loading="lazy" className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]" />
                    </div>
                    <p className="mt-3 text-[13px]" style={{ ...MONO, color: DIM }}>
                      {s.caption} <span style={{ color: FAINT }}>— click to enlarge</span>
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
            <AnimatePresence>
              {shot && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 cursor-zoom-out" style={{ background: 'rgba(8,7,6,0.9)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShot(null)} role="dialog" aria-label={shot.caption}>
                  <img src={shot.src} alt={shot.caption} className="max-w-full max-h-full rounded-[10px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* ---------- plugins ---------- */}
        {cfg.plugin && (
          <section id="plugins" className="pt-24 md:pt-32 scroll-mt-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start [&>*]:min-w-0">
            <div>
              <H2 eyebrow="plugins" body={cfg.notes?.split('\n\n')[0].replace(/`/g, '')}>
                Drop in a <em>.lua</em> file. That’s a plugin.
              </H2>
              <div className="flex flex-wrap gap-2 -mt-4">
                {cfg.plugin.api.map((a) => (
                  <code key={a} className="text-[12px] px-2.5 py-1 rounded-md" style={{ ...MONO, color: COPPER, background: 'rgba(240,151,90,0.08)', border: `1px solid ${EDGE}` }}>
                    {a}
                  </code>
                ))}
              </div>
              <button type="button" onClick={() => setPalette(true)} className="mt-8 h-11 px-5 inline-flex items-center gap-2 rounded-[10px] text-[14px]" style={{ border: `1px solid ${COPPER}`, color: COPPER }}>
                <CommandIcon size={15} /> Find “word count” in the palette
              </button>
            </div>
            <Reveal>
              <div className="rounded-[14px] overflow-hidden" style={{ background: SUNK, border: `1px solid ${EDGE}` }}>
                <div className="h-10 px-4 flex items-center text-[12px]" style={{ ...MONO, borderBottom: `1px solid ${EDGE}`, color: DIM }}>
                  {cfg.plugin.file}
                  <span className="ml-auto" style={{ color: TEAL }}>
                    hot-reloadable
                  </span>
                </div>
                <LuaCode code={cfg.plugin.code} />
              </div>
            </Reveal>
          </section>
        )}

        {/* ---------- keys ---------- */}
        {cfg.palette && (
          <section id="keys" className="pt-24 md:pt-32 scroll-mt-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <H2 eyebrow="keyboard" body="Every binding is editable from Settings › Keybindings and stored with the portable ctrl+ spelling, so settings.lua moves between machines unchanged.">
                Hands on the <em>keys.</em>
              </H2>
              <div className="mb-14 inline-flex p-1 rounded-[9px]" style={{ border: `1px solid ${EDGE}` }} role="radiogroup" aria-label="Key labels">
                {[
                  [false, 'Windows / Linux'],
                  [true, 'macOS'],
                ].map(([v, l]) => (
                  <button key={l} type="button" role="radio" aria-checked={mac === v} onClick={() => setMac(v)} className="h-8 px-3 rounded-[6px] text-[12.5px]" style={mac === v ? { background: COPPER, color: GROUND } : { color: DIM }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {cfg.palette
                .filter((p) => p[1])
                .map(([a, k]) => (
                  <div key={a} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: `1px solid ${EDGE}` }}>
                    <dt className="text-[14.5px]">{a}</dt>
                    <dd>
                      <Kbd mac={mac}>{k}</Kbd>
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        )}

        {/* ---------- downloads ---------- */}
        {cfg.downloads && (
          <section className="pt-24 md:pt-32">
            <H2 eyebrow="download" body="Every tag builds all of these on GitHub Actions.">
              Pick your <em>platform.</em>
            </H2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {cfg.downloads.map((d) => {
                const Icon = OS_ICON[d.os];
                const mine = d.os === os;
                return (
                  <a key={d.file} href={d.href} className="group rounded-[14px] p-5 flex flex-col gap-4 transition-colors" style={{ background: mine ? 'rgba(240,151,90,0.1)' : CARD, border: `1px solid ${mine ? COPPER : EDGE}` }}>
                    <span className="flex items-center justify-between">
                      <Icon size={26} weight="fill" color={mine ? COPPER : PAPER} />
                      <DownloadSimpleIcon size={17} color={DIM} className="transition-transform group-hover:translate-y-0.5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">{d.label}</span>
                      <span className="block mt-1 text-[11.5px] break-all" style={{ ...MONO, color: FAINT }}>
                        {d.file}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- build + colophon ---------- */}
        {cfg.terminal && (
          <section className="pt-20 grid lg:grid-cols-2 gap-4 [&>*]:min-w-0">
            <div className="rounded-[14px] overflow-hidden" style={{ background: SUNK, border: `1px solid ${EDGE}` }}>
              <div className="h-10 px-4 flex items-center text-[12px]" style={{ ...MONO, borderBottom: `1px solid ${EDGE}`, color: DIM }}>
                {cfg.terminal.caption} — build it yourself
              </div>
              <pre className="m-0 p-6 text-[13px] leading-[2] overflow-x-auto" style={{ ...MONO }}>
                {cfg.terminal.lines.map((l) => {
                  const [c, n] = l.split(/\s+#\s?/);
                  return (
                    <div key={l}>
                      <span style={{ color: COPPER }}>$</span> {c} {n && <span style={{ color: FAINT }}># {n}</span>}
                    </div>
                  );
                })}
              </pre>
            </div>
            <dl className="rounded-[14px] p-6 grid grid-cols-2 gap-6 content-start" style={{ background: CARD, border: `1px solid ${EDGE}` }}>
              {cfg.colophon.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] uppercase tracking-[0.14em]" style={{ ...MONO, color: FAINT }}>
                    {k}
                  </dt>
                  <dd className="mt-1.5 text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <footer className="mt-24 py-12 flex flex-wrap items-center justify-between gap-4 text-[13px]" style={{ borderTop: `1px solid ${EDGE}`, color: FAINT }}>
          <span style={MONO}>
            descry v{cfg.version} · MIT · © Fezcode
          </span>
          <span className="flex gap-6">
            <Link to="/projects/hisashi" className="hover:text-white">
              Hisashi
            </Link>
            <Link to="/projects/airlift" className="hover:text-white">
              Airlift
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-1.5 hover:text-white">
              <ArrowLeftIcon size={13} /> Back to projects
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default GraphProjectPage;
