import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only.
// Aesthetic: 19th-century jobbing print shop. Type case, composing stick,
// chase, ink slab, platen press. Output is a real broadside.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=UnifrakturMaguntia&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

.lp {
  --bench:    #1a1410;
  --bench-2:  #241b14;
  --steel:    #2a221b;
  --steel-2:  #3a2e23;
  --iron:     #4a3d2e;
  --brass:    #b8924b;
  --brass-dk: #6e5424;
  --rust:     #8a3a1c;
  --paper:    #efe6cc;
  --paper-2:  #d8c89e;
  --paper-mut:#7d6a44;
  --ink-pitch:#0e0a07;
  --ink-verm: #a8331e;
  --ink-prus: #1a3458;
  --ink-spruce:#1f3826;

  font-family: 'JetBrains Mono', ui-monospace, monospace;
  background: var(--bench);
  color: var(--paper);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
}

/* workshop atmosphere — wood grain, smoke, gas-lamp pool of light */
.lp::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 28%, rgba(184,146,75,0.10), transparent 70%),
    radial-gradient(ellipse 60% 50% at 90% 95%, rgba(138,58,28,0.06), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
}
.lp::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    repeating-linear-gradient(
      90deg,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,0) 38px,
      rgba(0,0,0,0.20) 38px,
      rgba(0,0,0,0.20) 39px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(184,146,75,0.025) 0,
      rgba(184,146,75,0.025) 1px,
      transparent 1px,
      transparent 4px
    );
  mask-image: radial-gradient(ellipse at center, black 25%, transparent 80%);
}

.lp__shell { position: relative; z-index: 1; }
.lp__serif { font-family: 'Playfair Display', serif; }

/* ------- spine ------- */
.lp__spine {
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 24px;
  padding: 16px 36px;
  border-bottom: 1px solid var(--iron);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.32em;
  text-transform: uppercase; color: var(--paper-mut);
}
.lp__spine a { color: var(--paper-mut); text-decoration: none; }
.lp__spine a:hover { color: var(--brass); }
.lp__sigil { display: inline-flex; align-items: center; gap: 12px; }
.lp__sigil-mark {
  width: 22px; height: 22px;
  background: var(--brass);
  color: var(--bench);
  display: grid; place-items: center;
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-size: 13px;
}
.lp__spine-c {
  text-align: center; color: var(--brass);
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: 13px; letter-spacing: 0.38em;
}

.lp__edge {
  position: fixed; left: 18px; top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.6em;
  color: var(--brass-dk); text-transform: uppercase;
  white-space: nowrap; z-index: 2; pointer-events: none;
}
.lp__edge::before, .lp__edge::after {
  content: ""; display: inline-block; width: 28px; height: 1px;
  background: var(--brass-dk); vertical-align: middle; margin: 0 14px;
}

/* ------- masthead ------- */
.lp__mast {
  display: grid; grid-template-columns: 1.1fr 1fr;
  gap: 56px; align-items: end;
  padding: 72px 80px 50px 110px;
  border-bottom: 1px solid var(--iron);
}
.lp__mast-eye {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--brass);
  margin-bottom: 16px; display: inline-flex; gap: 14px; align-items: center;
}
.lp__mast-eye::before { content: "✦"; color: var(--brass); }
.lp__title {
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-style: normal;
  font-size: clamp(56px, 9vw, 132px);
  line-height: 0.84;
  letter-spacing: -0.025em;
  margin: 0; color: var(--paper);
  text-shadow: 0 1px 0 rgba(0,0,0,0.4);
}
.lp__title em {
  display: block;
  font-family: 'IM Fell English', serif;
  font-style: italic; font-weight: 400;
  color: var(--brass);
  font-size: 0.62em;
  padding-left: 0.4em;
  letter-spacing: 0;
}
.lp__lede {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 17px;
  line-height: 1.6;
  color: var(--paper-2);
  border-left: 1px solid var(--iron);
  padding-left: 22px;
}
.lp__lede-drop {
  float: left;
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-style: normal;
  font-size: 60px; line-height: 0.8;
  color: var(--brass);
  margin: 6px 12px -2px 0;
}

/* ------- workspace ------- */
.lp__work {
  display: grid;
  grid-template-columns: 360px 1fr 280px;
  gap: 38px;
  padding: 50px 80px 60px 110px;
  align-items: start;
}
@media (max-width: 1200px) {
  .lp__work { grid-template-columns: 1fr; padding: 36px 24px; gap: 28px; }
  .lp__mast { padding: 48px 24px 32px; grid-template-columns: 1fr; gap: 24px; }
  .lp__edge { display: none; }
}

.lp__panel-eye {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.36em;
  text-transform: uppercase; color: var(--brass);
  display: flex; justify-content: space-between;
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 1px solid var(--iron);
}
.lp__panel-eye span:last-child { color: var(--paper-mut); }

/* ------- type case (left) ------- */
.lp__case {
  background:
    linear-gradient(135deg, rgba(184,146,75,0.06), transparent 60%),
    var(--steel);
  border: 1px solid var(--iron);
  padding: 14px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4);
}
.lp__case-grid {
  display: grid; grid-template-columns: repeat(8, 1fr);
  gap: 1px; background: var(--steel-2);
  padding: 1px;
}
.lp__slug {
  background: var(--bench-2);
  color: var(--paper);
  border: 0;
  height: 36px;
  font-family: 'Old Standard TT', serif;
  font-size: 18px; font-weight: 700;
  cursor: pointer;
  transition: all 100ms ease;
  position: relative;
  display: grid; place-items: center;
}
.lp__slug::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(184,146,75,0.10), transparent 30%, rgba(0,0,0,0.4));
  pointer-events: none;
}
.lp__slug:hover {
  background: var(--brass);
  color: var(--bench);
}
.lp__slug:active { transform: translateY(1px); }
.lp__slug.lp__slug--num { color: var(--brass); }
.lp__slug.lp__slug--punct { color: var(--paper-2); font-size: 16px; }

.lp__case-divider {
  height: 1px; background: var(--iron); margin: 14px 0 10px;
  position: relative;
}
.lp__case-divider::after {
  content: attr(data-label);
  position: absolute; top: -7px; left: 12px;
  background: var(--steel); padding: 0 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--paper-mut);
}

.lp__furniture {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--steel-2); padding: 1px; margin-top: 8px;
}
.lp__furn {
  background: var(--bench-2); color: var(--paper-mut);
  border: 0; height: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; cursor: pointer;
  transition: all 120ms ease;
}
.lp__furn:hover { background: var(--iron); color: var(--brass); }

/* ------- center — composing stick & paper ------- */
.lp__stage { display: flex; flex-direction: column; gap: 28px; }

.lp__stick {
  background: linear-gradient(180deg, var(--steel-2), var(--steel));
  border: 1px solid var(--iron);
  border-top: 1px solid var(--brass-dk);
  padding: 18px 22px;
  position: relative;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.5),
    inset 0 -2px 0 rgba(0,0,0,0.6);
}
.lp__stick::before, .lp__stick::after {
  content: ""; position: absolute; top: -8px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--brass);
  box-shadow: 0 0 0 1px var(--brass-dk);
}
.lp__stick::before { left: 8px; }
.lp__stick::after  { right: 8px; }
.lp__stick-eye {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--brass);
  display: flex; justify-content: space-between;
  margin-bottom: 12px;
}
.lp__stick-eye span:last-child { color: var(--paper-mut); }
.lp__stick-input {
  width: 100%; min-height: 92px;
  background: var(--bench);
  border: 1px solid var(--iron);
  padding: 14px 16px;
  font-size: 18px; line-height: 1.4;
  color: var(--paper);
  resize: vertical;
  outline: none;
  box-shadow: inset 0 0 12px rgba(0,0,0,0.5);
}
.lp__stick-input:focus { border-color: var(--brass-dk); }
.lp__stick-foot {
  margin-top: 12px;
  display: flex; gap: 1px;
  background: var(--iron);
}
.lp__stick-foot button {
  flex: 1; background: var(--bench-2);
  color: var(--paper-2); border: 0;
  padding: 10px 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.32em;
  text-transform: uppercase; cursor: pointer;
  transition: all 120ms ease;
}
.lp__stick-foot button:hover { background: var(--bench); color: var(--brass); }

/* paper / impression */
.lp__bench {
  position: relative;
  background:
    repeating-linear-gradient(
      180deg, rgba(184,146,75,0.04), transparent 2px, transparent 28px
    ),
    var(--bench-2);
  padding: 32px;
  border: 1px solid var(--iron);
  box-shadow: inset 0 0 36px rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
}
.lp__paper-wrap {
  width: 100%; max-width: 540px;
  aspect-ratio: 1 / 1.32;
  position: relative;
  background: var(--paper);
  background-image:
    radial-gradient(circle at 22% 28%, rgba(125,106,68,0.10) 1px, transparent 2px),
    radial-gradient(circle at 78% 64%, rgba(125,106,68,0.08) 1px, transparent 2px),
    radial-gradient(circle at 48% 88%, rgba(168,51,30,0.04) 1px, transparent 3px);
  background-size: 280px 280px, 360px 360px, 220px 220px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.05),
    0 30px 60px -20px rgba(0,0,0,0.7),
    0 0 0 1px rgba(0,0,0,0.5);
  padding: 56px 48px 48px;
  overflow: hidden;
  display: flex; flex-direction: column; justify-content: center;
}
.lp__paper-wrap[data-paper="kraft"]  { background-color: #c2a878; color: var(--ink-pitch); }
.lp__paper-wrap[data-paper="laid"]   { background-color: #dadfe1; }
.lp__paper-wrap[data-paper="cream"]  { background-color: var(--paper); }

.lp__paper-wrap::before {
  content: ""; position: absolute; inset: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  pointer-events: none;
}
.lp__paper-wrap[data-pulled="true"]::after {
  content: ""; position: absolute; inset: 28px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.05);
  pointer-events: none;
}

.lp__impression {
  position: relative;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}
.lp__impression .lp-line {
  display: block;
  margin-bottom: var(--leading, 0.4em);
}
.lp__impression .lp-ch {
  display: inline-block;
  position: relative;
}

.lp__paper-empty {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  text-align: center;
  color: rgba(24,16,8,0.35);
  font-size: 16px;
}
.lp__paper-empty strong {
  display: block;
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 30px; letter-spacing: -0.02em;
  color: rgba(24,16,8,0.4);
  margin-bottom: 6px;
  font-style: normal;
}

.lp__paper-stamp {
  position: absolute; bottom: 18px; right: 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.3em;
  color: rgba(24,16,8,0.32);
  text-transform: uppercase;
}
.lp__paper-stamp[data-paper="kraft"] { color: rgba(24,16,8,0.5); }
.lp__paper-stamp[data-paper="laid"]  { color: rgba(0,0,0,0.4); }

/* big lever — pull impression */
.lp__lever {
  margin-top: 18px;
  display: grid; grid-template-columns: 1fr auto auto; gap: 14px;
}
.lp__lever-pull {
  background:
    linear-gradient(180deg, var(--brass) 0%, var(--brass-dk) 100%);
  color: var(--bench);
  border: 0;
  padding: 22px 28px;
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  box-shadow:
    0 0 0 1px var(--brass-dk),
    0 1px 0 rgba(255,255,255,0.25) inset,
    0 -2px 0 rgba(0,0,0,0.25) inset,
    0 8px 18px -8px rgba(0,0,0,0.6);
  transition: transform 80ms ease, box-shadow 80ms ease;
}
.lp__lever-pull:hover { transform: translateY(-1px); }
.lp__lever-pull:active {
  transform: translateY(2px);
  box-shadow:
    0 0 0 1px var(--brass-dk),
    0 1px 0 rgba(255,255,255,0.15) inset,
    0 -1px 0 rgba(0,0,0,0.3) inset,
    0 2px 4px -2px rgba(0,0,0,0.6);
}
.lp__lever-pull em {
  display: block;
  font-family: 'IM Fell English', serif;
  font-weight: 400; font-style: italic;
  font-size: 11px; letter-spacing: 0.26em;
  margin-top: 4px;
  color: rgba(26,20,16,0.7);
}
.lp__lever-export {
  background: var(--steel);
  color: var(--paper-2); border: 1px solid var(--iron);
  padding: 0 22px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.32em;
  text-transform: uppercase; cursor: pointer;
  transition: all 140ms ease;
  display: grid; place-items: center;
}
.lp__lever-export:hover:not(:disabled) { color: var(--brass); border-color: var(--brass-dk); }
.lp__lever-export:disabled { opacity: 0.4; cursor: not-allowed; }

@media print {
  @page { size: auto; margin: 14mm; }
  html, body { background: #fff !important; }
  /* hide ALL global chrome (Brutalist layout wraps the page); show only .lp */
  body * { visibility: hidden !important; }
  .lp, .lp * { visibility: visible !important; }
  .lp {
    position: absolute !important;
    left: 0; top: 0; right: 0;
    background: #fff !important;
    color: #000 !important;
  }
  .lp::before, .lp::after { display: none !important; }
  .lp__spine, .lp__edge, .lp__mast, .lp__colophon { display: none !important; }
  .lp__work {
    display: block !important;
    padding: 0 !important;
    grid-template-columns: 1fr !important;
  }
  .lp__work > div:first-child,
  .lp__rail,
  .lp__stick,
  .lp__lever { display: none !important; }
  .lp__stage { display: block !important; }
  .lp__bench {
    background: none !important;
    padding: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
    display: block !important;
  }
  .lp__paper-wrap {
    box-shadow: none !important;
    margin: 0 auto;
    max-width: none;
    width: 100%;
    aspect-ratio: auto;
    min-height: 80vh;
  }
}

/* ------- right rail — settings ------- */
.lp__rail { display: flex; flex-direction: column; gap: 22px; }
.lp__rail-card {
  background: var(--steel);
  border: 1px solid var(--iron);
  padding: 16px 18px 18px;
  position: relative;
}
.lp__rail-card::before {
  content: ""; position: absolute; top: 0; left: 0; width: 28px; height: 1px;
  background: var(--brass);
}

.lp__opt-row {
  display: grid; gap: 1px;
  background: var(--iron);
  border: 1px solid var(--iron);
  margin-top: 4px;
}
.lp__opt {
  background: var(--bench-2);
  color: var(--paper-2); border: 0;
  padding: 10px 12px; cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em;
  text-align: left;
  display: flex; justify-content: space-between; align-items: center;
  transition: all 120ms ease;
}
.lp__opt:hover { background: var(--bench); color: var(--brass); }
.lp__opt[data-on="true"] {
  background: var(--paper); color: var(--bench);
}
.lp__opt-sample {
  font-size: 16px;
}
.lp__swatch {
  display: inline-block; width: 16px; height: 10px;
  border: 1px solid rgba(0,0,0,0.4);
  margin-right: 6px; vertical-align: middle;
}
.lp__opt-paper {
  display: inline-block; width: 16px; height: 10px;
  border: 1px solid rgba(0,0,0,0.3);
  margin-right: 6px; vertical-align: middle;
}

.lp__sld {
  margin-top: 8px;
  display: flex; flex-direction: column; gap: 6px;
}
.lp__sld-row {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--paper-mut);
}
.lp__sld-row span:last-child {
  color: var(--brass);
  font-size: 13px; letter-spacing: 0.04em;
}
.lp__sld input[type="range"] {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 1px; background: var(--iron);
  cursor: pointer;
}
.lp__sld input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--brass); border: 0;
  box-shadow: 0 0 0 2px var(--steel), 0 0 0 3px var(--brass-dk);
}
.lp__sld input[type="range"]::-moz-range-thumb {
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--brass); border: 0;
  box-shadow: 0 0 0 2px var(--steel), 0 0 0 3px var(--brass-dk);
}

.lp__samples {
  display: grid; gap: 4px;
}
.lp__samples button {
  background: transparent;
  border: 0; border-bottom: 1px dashed var(--iron);
  padding: 8px 0;
  text-align: left;
  font-family: 'IM Fell English', serif;
  font-style: italic; font-size: 14px;
  color: var(--paper-2); cursor: pointer;
  transition: all 140ms ease;
}
.lp__samples button:hover { color: var(--brass); padding-left: 6px; }

/* ------- colophon ------- */
.lp__colophon {
  border-top: 1px solid var(--iron);
  padding: 56px 80px 80px 110px;
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 56px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; line-height: 1.62;
  color: var(--paper-2);
}
@media (max-width: 1200px) {
  .lp__colophon { padding: 36px 24px; grid-template-columns: 1fr; gap: 28px; }
}
.lp__colophon h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--brass);
  margin: 0 0 14px 0; font-weight: 500;
  display: flex; align-items: center; gap: 14px;
}
.lp__colophon h3::after {
  content: ""; flex: 1; height: 1px; background: var(--iron);
}
.lp__sign {
  font-family: 'IM Fell English', serif;
  font-style: italic; font-size: 22px;
  color: var(--brass); margin-top: 18px;
}
`;

const FONTS = [
  { id: 'fell',     name: "IM Fell English",  css: "'IM Fell English', serif" },
  { id: 'caslon',   name: "Cormorant",        css: "'Cormorant Garamond', serif" },
  { id: 'bodoni',   name: "Old Standard",     css: "'Old Standard TT', serif" },
  { id: 'fraktur',  name: "Fraktur",          css: "'UnifrakturMaguntia', serif" },
  { id: 'playfair', name: "Playfair",         css: "'Playfair Display', serif" },
];

const INKS = [
  { id: 'pitch', name: 'Pitch Black',   color: '#0e0a07' },
  { id: 'verm',  name: 'Vermilion',     color: '#a8331e' },
  { id: 'prus',  name: 'Prussian Blue', color: '#1a3458' },
  { id: 'spruce',name: 'Spruce Green',  color: '#1f3826' },
];

const PAPERS = [
  { id: 'cream', name: 'Cream Wove',  color: '#efe6cc' },
  { id: 'kraft', name: 'Kraft',       color: '#c2a878' },
  { id: 'laid',  name: 'Blue Laid',   color: '#dadfe1' },
];

const SAMPLES = [
  { label: 'Job ticket — auction notice', text: "PUBLIC AUCTION\nThe entire effects of\nNo. 14 Dover Street\nMonday next at noon" },
  { label: 'Manifesto fragment', text: "WE HOLD\nthese truths\nto be self-evident" },
  { label: 'Wedding announcement', text: "Eleanor & James\non the third of June\nat St. Bride's, Fleet Street" },
  { label: 'Foundry specimen', text: "ABCDEFGHIJ\nKLMNOPQRST\nUVWXYZ\n0123456789" },
  { label: 'Gnomic line', text: "TIME\nis the reef\nupon which all our frail mystic\nships are wrecked." },
];

const UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const LOWERS = "abcdefghijklmnopqrstuvwxyz".split('');
const DIGITS = "0123456789".split('');
const PUNCTS = ".,;:?!'\"-—&·/()§¶".split('');

// deterministic-ish jitter per character. seed = pull index + char index
const jitter = (seed) => {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

const LetterPressPage = () => {
  const [draft, setDraft] = useState("PRESSED\nat the Fezcodex\nFoundry · MMXXVI");
  const [fontId, setFontId] = useState('fell');
  const [inkId, setInkId] = useState('pitch');
  const [paperId, setPaperId] = useState('cream');
  const [bodySize, setBodySize] = useState(48);
  const [leading, setLeading] = useState(1.05);
  const [bleed, setBleed] = useState(0.45);
  const [pullSeed, setPullSeed] = useState(0);
  const [pulled, setPulled] = useState(null); // { lines, fontCss, ink, paper, size, leading, bleed }
  const stickRef = useRef(null);
  const paperRef = useRef(null);

  const font = FONTS.find(f => f.id === fontId);
  const ink = INKS.find(i => i.id === inkId);
  const paper = PAPERS.find(p => p.id === paperId);

  const append = (ch) => {
    setDraft(d => d + ch);
    if (stickRef.current) stickRef.current.focus();
  };
  const backspace = () => setDraft(d => d.slice(0, -1));
  const newline = () => setDraft(d => d + '\n');
  const space = () => setDraft(d => d + ' ');
  const clearStick = () => setDraft('');

  const pull = () => {
    const seed = pullSeed + 1;
    setPullSeed(seed);
    setPulled({
      lines: draft.split('\n'),
      fontCss: font.css,
      ink: ink.color,
      size: bodySize,
      leading,
      bleed,
      seed,
    });
    if (paperRef.current) {
      paperRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const downloadSVG = () => {
    if (!pulled) return;
    const W = 540, H = Math.round(540 * 1.32);
    const lineHeight = pulled.size * pulled.leading;
    const totalHeight = pulled.lines.length * lineHeight;
    const startY = (H - totalHeight) / 2 + pulled.size * 0.85;
    const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const s0 = pulled.seed * 1000;

    const lines = pulled.lines.map((line, li) => {
      const chars = [...line];
      if (chars.length === 0) return '';
      const seedLine = s0 + li * 100;
      // SVG arrays: per-character relative shifts & per-character glyph rotation
      const dxArr = chars.map((_, ci) => ((jitter(seedLine + ci) - 0.5) * 1.6).toFixed(2)).join(' ');
      const dyArr = chars.map((_, ci) => ((jitter(seedLine + ci + 999) - 0.5) * 1.6).toFixed(2)).join(' ');
      const rotArr = chars.map((_, ci) => ((jitter(seedLine + ci + 333) - 0.5) * 4).toFixed(2)).join(' ');
      const tspans = chars.map((ch, ci) => {
        const op = (0.7 + jitter(seedLine + ci + 17) * 0.3).toFixed(2);
        return `<tspan opacity="${op}">${escape(ch)}</tspan>`;
      }).join('');
      const y = startY + li * lineHeight;
      return `<text x="${W/2}" y="${y}" text-anchor="middle" dx="${dxArr}" dy="${dyArr}" rotate="${rotArr}" font-family="${pulled.fontCss}" font-size="${pulled.size}" font-weight="700" fill="${pulled.ink}">${tspans}</text>`;
    }).join('\n  ');

    const blurAmt = (0.35 + pulled.bleed * 0.7).toFixed(2);
    const grainSeed = (pulled.seed * 7) % 100;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&amp;family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&amp;family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&amp;family=UnifrakturMaguntia&amp;family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap');</style>
    <filter id="bleed" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="${blurAmt}"/>
    </filter>
    <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${grainSeed}"/>
      <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.18 0"/>
    </filter>
    <filter id="paper-fibre" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="${grainSeed + 1}"/>
      <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.5  0 0 0 0 0.3  0 0 0 0.05 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${paper.color}"/>
  <rect width="100%" height="100%" filter="url(#paper-fibre)"/>
  <rect width="100%" height="100%" filter="url(#paper-grain)" opacity="0.55"/>
  <g filter="url(#bleed)">
    ${lines}
  </g>
  <text x="${W - 24}" y="${H - 18}" text-anchor="end" font-family="ui-monospace, monospace" font-size="9" fill="${pulled.ink}" opacity="0.42" letter-spacing="2">FEZCODEX · № ${String(pulled.seed).padStart(3,'0')}</text>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `letterpress-${Date.now()}.svg`;
    a.click(); URL.revokeObjectURL(url);
  };

  const renderImpression = useMemo(() => {
    if (!pulled) return null;
    return (
      <div
        className="lp__impression"
        style={{
          fontFamily: pulled.fontCss,
          fontSize: pulled.size,
          color: pulled.ink,
          '--leading': `${(pulled.leading - 1) * pulled.size}px`,
          filter: `blur(${(pulled.bleed * 0.3).toFixed(2)}px)`,
        }}
      >
        {pulled.lines.map((line, li) => (
          <span key={li} className="lp-line">
            {line.length === 0 ? ' ' : [...line].map((ch, ci) => {
              const r = jitter(pulled.seed * 1000 + li * 100 + ci);
              const dx = (r - 0.5) * 0.8;
              const dy = (jitter(pulled.seed * 1000 + li * 100 + ci + 999) - 0.5) * 0.8;
              const dr = (jitter(pulled.seed * 1000 + li * 100 + ci + 333) - 0.5) * 1.2;
              const op = 0.78 + jitter(pulled.seed * 1000 + li * 100 + ci + 17) * 0.22;
              return (
                <span
                  key={ci}
                  className="lp-ch"
                  style={{
                    transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${dr.toFixed(2)}deg)`,
                    opacity: op.toFixed(2),
                  }}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    );
  }, [pulled]);

  // press the lever with Cmd/Ctrl + Enter from the stick
  const onStickKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); pull(); }
  };

  const todayLabel = useMemo(() => {
    const d = new Date();
    const months = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    return `${d.getDate()} · ${months[d.getMonth()]} · MMXXVI`;
  }, []);

  return (
    <div className="lp">
      <style>{CSS}</style>
      <Seo
        title="Letter Press · Hot-Metal Foundry | Fezcodex"
        description="A 19th-century jobbing print shop simulator. Set type from the case into a composing stick, ink, and pull a faithful impression onto cream wove, kraft, or blue laid paper."
        keywords={['letterpress', 'typesetting', 'foundry', 'hot metal', 'broadside', 'composition', 'platen press']}
      />

      <div className="lp__edge">FOUNDRY № VII · {todayLabel}</div>

      <div className="lp__shell">
        <header className="lp__spine">
          <Link to="/apps" className="lp__sigil">
            <span className="lp__sigil-mark">f</span>
            <span>← Index</span>
          </Link>
          <div className="lp__spine-c">F E Z C O D E X &nbsp;·&nbsp; T Y P E &nbsp;&amp;&nbsp; P R E S S</div>
          <div>{todayLabel}</div>
        </header>

        <section className="lp__mast">
          <div>
            <div className="lp__mast-eye">Job-press № VII · platen &amp; chase</div>
            <h1 className="lp__title">
              Letter Press
              <em>set, ink &amp; pull</em>
            </h1>
          </div>
          <p className="lp__lede">
            <span className="lp__lede-drop">P</span>
            ick a sort from the case, drop it into the composing stick,
            justify with quads and spaces, lock the form into the chase,
            and pull the lever. Every impression carries the bite of the
            type, the unevenness of the ink, the fibre of the paper.
          </p>
        </section>

        <section className="lp__work">
          {/* LEFT — type case */}
          <div>
            <div className="lp__panel-eye">
              <span>i. type case</span>
              <span>california layout</span>
            </div>

            <div className="lp__case">
              <div className="lp__case-grid">
                {UPPERS.map(c => (
                  <button key={c} className="lp__slug" onClick={() => append(c)}>{c}</button>
                ))}
              </div>

              <div className="lp__case-divider" data-label="lower case" />

              <div className="lp__case-grid">
                {LOWERS.map(c => (
                  <button key={c} className="lp__slug" onClick={() => append(c)}>{c}</button>
                ))}
              </div>

              <div className="lp__case-divider" data-label="figures" />

              <div className="lp__case-grid">
                {DIGITS.map(c => (
                  <button key={c} className="lp__slug lp__slug--num" onClick={() => append(c)}>{c}</button>
                ))}
              </div>

              <div className="lp__case-divider" data-label="punctuation" />

              <div className="lp__case-grid">
                {PUNCTS.map(c => (
                  <button key={c} className="lp__slug lp__slug--punct" onClick={() => append(c)}>{c}</button>
                ))}
              </div>

              <div className="lp__case-divider" data-label="furniture" />

              <div className="lp__furniture">
                <button className="lp__furn" onClick={space}>quad</button>
                <button className="lp__furn" onClick={newline}>↵ line</button>
                <button className="lp__furn" onClick={backspace}>← bksp</button>
                <button className="lp__furn" onClick={clearStick}>✕ pi</button>
              </div>
            </div>
          </div>

          {/* CENTER — composing stick + paper */}
          <div className="lp__stage">
            <div className="lp__stick">
              <div className="lp__stick-eye">
                <span>ii. composing stick</span>
                <span>{draft.length} sorts · {draft.split('\n').length} lines</span>
              </div>
              <textarea
                ref={stickRef}
                className="lp__stick-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onStickKey}
                style={{ fontFamily: font.css, fontSize: 18, lineHeight: 1.4 }}
                placeholder="Type, or click a sort from the case…"
              />
              <div className="lp__stick-foot">
                <button onClick={() => setDraft(d => d.toUpperCase())}>U/C</button>
                <button onClick={() => setDraft(d => d.toLowerCase())}>l/c</button>
                <button onClick={() => setDraft(d => d.replace(/^\s+|\s+$/g, ''))}>trim</button>
                <button onClick={clearStick}>distribute</button>
              </div>
            </div>

            <div className="lp__bench" ref={paperRef}>
              <div
                className="lp__paper-wrap"
                data-paper={paper.id}
                data-pulled={pulled ? "true" : "false"}
              >
                {pulled ? (
                  <>
                    {renderImpression}
                    <div className="lp__paper-stamp" data-paper={paper.id}>
                      Fezcodex · {todayLabel} · № {pullSeed.toString().padStart(3, '0')}
                    </div>
                  </>
                ) : (
                  <div className="lp__paper-empty">
                    <strong>The chase is open.</strong>
                    Set a line in the stick and pull the lever.
                  </div>
                )}
              </div>
            </div>

            <div className="lp__lever">
              <button className="lp__lever-pull" onClick={pull}>
                Pull Impression
                <em>(⌘ ↩ from the stick)</em>
              </button>
              <button className="lp__lever-export" onClick={downloadSVG} disabled={!pulled}>
                ↓ broadside
              </button>
              <button className="lp__lever-export" onClick={() => window.print()} disabled={!pulled}>
                ⎙ print
              </button>
            </div>
          </div>

          {/* RIGHT — typeface, ink, paper, size, leading, bleed */}
          <div className="lp__rail">
            <div className="lp__rail-card">
              <div className="lp__panel-eye">
                <span>iii. typeface</span>
                <span>five faces</span>
              </div>
              <div className="lp__opt-row">
                {FONTS.map(f => (
                  <button
                    key={f.id} className="lp__opt"
                    data-on={fontId === f.id}
                    onClick={() => setFontId(f.id)}
                  >
                    <span style={{ fontFamily: f.css }} className="lp__opt-sample">Aa</span>
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lp__rail-card">
              <div className="lp__panel-eye">
                <span>iv. ink</span>
                <span>oil-based</span>
              </div>
              <div className="lp__opt-row">
                {INKS.map(i => (
                  <button
                    key={i.id} className="lp__opt"
                    data-on={inkId === i.id}
                    onClick={() => setInkId(i.id)}
                  >
                    <span><span className="lp__swatch" style={{ background: i.color }} />{i.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lp__rail-card">
              <div className="lp__panel-eye">
                <span>v. paper</span>
                <span>stock</span>
              </div>
              <div className="lp__opt-row">
                {PAPERS.map(p => (
                  <button
                    key={p.id} className="lp__opt"
                    data-on={paperId === p.id}
                    onClick={() => setPaperId(p.id)}
                  >
                    <span><span className="lp__opt-paper" style={{ background: p.color }} />{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lp__rail-card">
              <div className="lp__panel-eye">
                <span>vi. body &amp; bleed</span>
                <span>pt</span>
              </div>
              <div className="lp__sld">
                <div className="lp__sld-row"><span>body</span><span>{bodySize}pt</span></div>
                <input type="range" min="14" max="96" step="1"
                  value={bodySize} onChange={(e) => setBodySize(+e.target.value)} />
              </div>
              <div className="lp__sld">
                <div className="lp__sld-row"><span>leading</span><span>{leading.toFixed(2)}</span></div>
                <input type="range" min="0.85" max="2.0" step="0.01"
                  value={leading} onChange={(e) => setLeading(+e.target.value)} />
              </div>
              <div className="lp__sld">
                <div className="lp__sld-row"><span>ink bleed</span><span>{bleed.toFixed(2)}</span></div>
                <input type="range" min="0" max="1.4" step="0.01"
                  value={bleed} onChange={(e) => setBleed(+e.target.value)} />
              </div>
            </div>

            <div className="lp__rail-card">
              <div className="lp__panel-eye">
                <span>vii. specimens</span>
                <span>jobbing</span>
              </div>
              <div className="lp__samples">
                {SAMPLES.map((s, i) => (
                  <button key={i} onClick={() => setDraft(s.text)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lp__colophon">
          <div>
            <h3>Method</h3>
            <p>
              The compositor lifts each sort — a single piece of metal type —
              from its compartment in the case and places it, mirror-image, in
              the composing stick. The set form is locked into a chase, inked
              with a brayer, and pressed onto paper by the platen. Variable
              ink density and the slight bite of the type are part of the
              record, not a defect.
            </p>
          </div>
          <div>
            <h3>On the impression</h3>
            <p>
              Each character on the broadside has its own micro-displacement,
              rotation and opacity, computed from the pull number. Pull again
              and the page is reset; the run is unique. The ink-bleed slider
              widens or tightens the gaussian halo carried by oily ink into
              paper fibre.
            </p>
          </div>
          <div>
            <h3>Colophon</h3>
            <p>
              Faces: IM Fell English (after the punches cut for John Fell,
              Oxford 1672), Old Standard, Cormorant Garamond, UnifrakturMaguntia,
              Playfair. Output as scalable vector — set in the Fezcodex foundry,
              anno MMXXVI.
            </p>
            <div className="lp__sign">— f.</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LetterPressPage;
