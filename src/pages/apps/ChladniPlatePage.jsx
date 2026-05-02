import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: 18th-century natural-philosophy plate × modern instrument panel.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;700&display=swap');

.cp {
  --ink:       #08060a;
  --ink-2:     #110b10;
  --plate:     #1a1411;
  --paper:     #efe5cc;
  --paper-dim: #b9ad8d;
  --paper-mut: #5e5544;
  --brass:     #c89b5e;
  --brass-dk:  #6b4f25;
  --copper:    #a85c2c;
  --phos:      #7fd9c8;
  --rule:      #2a2018;
  --rule-2:    #3a2c20;

  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  background: var(--ink);
  color: var(--paper);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  font-feature-settings: "kern", "liga", "onum";
}

/* full-bleed atmosphere: faint engraved grid + warm vignette */
.cp::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,155,94,0.05), transparent 70%),
    radial-gradient(ellipse 60% 50% at 80% 90%, rgba(127,217,200,0.03), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
}
.cp::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(239,229,204,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239,229,204,0.025) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 35%, transparent 80%);
}

.cp__shell { position: relative; z-index: 1; }

.cp__mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.cp__serif-i { font-family: 'Cormorant Garamond', serif; font-style: italic; }

/* — top header band — */
.cp__band {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 18px 36px;
  border-bottom: 1px solid var(--rule);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--paper-dim);
}
.cp__band a { color: var(--paper-dim); text-decoration: none; }
.cp__band a:hover { color: var(--brass); }
.cp__sigil {
  display: inline-flex; align-items: center; gap: 10px;
}
.cp__sigil-mark {
  width: 22px; height: 22px;
  border: 1px solid var(--brass);
  display: grid; place-items: center;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 14px;
  color: var(--brass);
}
.cp__band-center { text-align: center; color: var(--brass); }

/* — left vertical title rule — */
.cp__edge-title {
  position: fixed;
  left: 22px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.6em;
  color: var(--brass-dk);
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 2;
  pointer-events: none;
}
.cp__edge-title::before, .cp__edge-title::after {
  content: ""; display: inline-block; width: 30px; height: 1px;
  background: var(--brass-dk); vertical-align: middle; margin: 0 14px;
}

/* — masthead — */
.cp__mast {
  padding: 80px 80px 60px 120px;
  display: grid;
  grid-template-columns: 1fr 0.7fr;
  gap: 60px;
  align-items: end;
  border-bottom: 1px solid var(--rule);
}
.cp__eye {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--brass);
  margin-bottom: 18px;
  display: inline-flex; align-items: center; gap: 14px;
}
.cp__eye::before {
  content: "❋"; color: var(--brass); font-size: 12px; letter-spacing: 0;
}
.cp__title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: clamp(56px, 9vw, 132px);
  line-height: 0.86;
  letter-spacing: -0.02em;
  margin: 0;
}
.cp__title em {
  font-style: italic;
  color: var(--brass);
  font-weight: 400;
  display: block;
  padding-left: 0.6em;
}
.cp__lede {
  font-size: 16px;
  line-height: 1.55;
  color: var(--paper-dim);
  font-style: italic;
  border-left: 1px solid var(--rule-2);
  padding-left: 22px;
}
.cp__lede-drop {
  float: left;
  font-family: 'Cormorant Garamond', serif;
  font-style: normal;
  font-size: 56px;
  line-height: 0.85;
  color: var(--brass);
  margin: 4px 10px -2px 0;
}

/* — workspace grid — */
.cp__work {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 48px;
  padding: 60px 80px 60px 120px;
  align-items: start;
}
@media (max-width: 1100px) {
  .cp__work { grid-template-columns: 1fr; padding: 40px 28px; gap: 32px; }
  .cp__mast { padding: 48px 28px 32px 28px; grid-template-columns: 1fr; gap: 28px; }
  .cp__edge-title { display: none; }
}

/* — rail cards — */
.cp__rail { display: flex; flex-direction: column; gap: 28px; }
.cp__card {
  position: relative;
  padding: 22px 22px 24px;
}
.cp__card::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, var(--brass) 0%, var(--brass) 24px, transparent 24px);
}
.cp__card::after {
  content: ""; position: absolute; bottom: 0; right: 0; width: 24px; height: 1px;
  background: var(--brass);
}
.cp__card-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--brass);
  letter-spacing: 0.32em; text-transform: uppercase;
  display: flex; justify-content: space-between; margin-bottom: 14px;
}
.cp__card-num span:last-child { color: var(--paper-mut); }

/* — mode pad — */
.cp__pad-row {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--paper-mut); letter-spacing: 0.3em;
  text-transform: uppercase; margin: 4px 0 8px;
}
.cp__pad {
  display: grid; grid-template-columns: repeat(8, 1fr); gap: 1px;
  background: var(--rule); padding: 1px;
}
.cp__pad button {
  height: 30px;
  background: var(--ink-2);
  color: var(--paper-dim);
  border: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;
}
.cp__pad button:hover { color: var(--brass); }
.cp__pad button[data-on="true"] {
  background: var(--paper);
  color: var(--ink);
}

/* — preset matrix — */
.cp__matrix {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
  background: var(--rule); border: 1px solid var(--rule);
}
.cp__matrix button {
  background: var(--ink-2);
  color: var(--paper-dim);
  border: 0;
  padding: 11px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em;
  cursor: pointer;
  transition: all 140ms ease;
  display: flex; justify-content: space-between; align-items: center;
}
.cp__matrix button:hover { color: var(--brass); background: var(--ink); }
.cp__matrix button > span:first-child { color: var(--paper-mut); font-size: 9px; }

/* — slider — */
.cp__sld { display: grid; gap: 8px; margin-bottom: 18px; }
.cp__sld-row {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.28em; text-transform: uppercase;
}
.cp__sld-row span:first-child { color: var(--paper-mut); }
.cp__sld-row span:last-child {
  color: var(--phos); font-size: 13px; letter-spacing: 0.04em;
  text-shadow: 0 0 8px rgba(127,217,200,0.4);
}
.cp__sld input[type="range"] {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 1px; background: var(--rule-2);
  cursor: pointer;
}
.cp__sld input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--brass); border: 0;
  box-shadow: 0 0 0 2px var(--ink), 0 0 0 3px var(--brass-dk);
}
.cp__sld input[type="range"]::-moz-range-thumb {
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--brass); border: 0;
  box-shadow: 0 0 0 2px var(--ink), 0 0 0 3px var(--brass-dk);
}

/* — center: plate stage — */
.cp__stage {
  display: flex; flex-direction: column; align-items: center;
  position: relative;
}
.cp__stage-ticks {
  position: absolute; inset: -32px -32px auto -32px; height: 16px;
  display: flex; justify-content: space-between; align-items: flex-end;
  pointer-events: none;
}
.cp__stage-ticks span { width: 1px; background: var(--brass-dk); }
.cp__stage-ticks span:nth-child(5n+1) { height: 14px; background: var(--brass); }
.cp__stage-ticks span:not(:nth-child(5n+1)) { height: 6px; }
.cp__plate-wrap {
  position: relative;
  width: min(60vh, 640px);
  max-width: 100%;
  aspect-ratio: 1;
  background: var(--plate);
  box-shadow:
    inset 0 0 0 1px var(--rule-2),
    inset 0 0 90px rgba(0,0,0,0.85),
    0 50px 90px -40px rgba(0,0,0,0.95),
    0 0 0 1px var(--rule);
  padding: 14px;
}
.cp__plate-wrap::before, .cp__plate-wrap::after {
  content: ""; position: absolute; pointer-events: none;
  border: 1px solid var(--brass-dk);
}
.cp__plate-wrap::before { inset: 4px; }
.cp__plate-wrap::after  {
  inset: -14px; border-color: var(--rule-2);
}
.cp__plate {
  display: block; width: 100%; height: 100%;
  background: var(--plate);
  image-rendering: pixelated;
}
.cp__plate-corner {
  position: absolute; width: 14px; height: 14px;
  border: 1px solid var(--brass);
  z-index: 2;
}
.cp__plate-corner.tl { top: -4px; left: -4px;  border-right: 0; border-bottom: 0; }
.cp__plate-corner.tr { top: -4px; right: -4px; border-left: 0;  border-bottom: 0; }
.cp__plate-corner.bl { bottom: -4px; left: -4px;  border-right: 0; border-top: 0; }
.cp__plate-corner.br { bottom: -4px; right: -4px; border-left: 0;  border-top: 0; }

.cp__plaque {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: center; gap: 16px;
  width: min(60vh, 640px); max-width: 100%;
  margin-top: 24px;
  padding: 12px 4px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--paper-mut);
}
.cp__plaque-mode {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 22px; letter-spacing: 0;
  color: var(--brass);
  text-transform: none;
}
.cp__plaque-led {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%;
  background: var(--phos);
  margin-right: 8px;
  box-shadow: 0 0 8px var(--phos);
  animation: cpBlink 2s ease-in-out infinite;
}
@keyframes cpBlink { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }
.cp__plaque-hz { color: var(--phos); text-shadow: 0 0 6px rgba(127,217,200,0.4); }

/* — action row — */
.cp__actions {
  width: min(60vh, 640px); max-width: 100%;
  margin-top: 18px;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--rule); border: 1px solid var(--rule);
}
.cp__actions button {
  background: var(--ink-2); color: var(--paper-dim);
  border: 0; padding: 14px 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase;
  cursor: pointer; transition: all 140ms ease;
}
.cp__actions button:hover { color: var(--brass); background: var(--ink); }
.cp__actions button[data-on="true"] { color: var(--phos); }

/* — readouts — */
.cp__read {
  display: flex; flex-direction: column; gap: 4px;
  padding: 18px 20px;
  border: 1px solid var(--rule);
  background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6));
  position: relative;
}
.cp__read-eye {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: var(--paper-mut);
  letter-spacing: 0.36em; text-transform: uppercase;
}
.cp__read-val {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 38px; line-height: 1;
  color: var(--phos);
  text-shadow: 0 0 12px rgba(127,217,200,0.35);
  letter-spacing: -0.01em;
}
.cp__read-val small {
  font-style: normal;
  font-size: 11px;
  color: var(--paper-mut);
  margin-left: 6px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.16em;
}
.cp__read-cap {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--paper-mut); margin-top: 2px;
}

/* — colophon — */
.cp__colophon {
  padding: 60px 80px 80px 120px;
  border-top: 1px solid var(--rule);
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 60px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--paper-dim);
}
@media (max-width: 1100px) {
  .cp__colophon { padding: 40px 28px; grid-template-columns: 1fr; gap: 32px; }
}
.cp__colophon h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--brass);
  margin: 0 0 14px 0;
  font-weight: 500;
  display: flex; align-items: center; gap: 14px;
}
.cp__colophon h3::after {
  content: ""; flex: 1; height: 1px; background: var(--rule);
}
.cp__formula {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 18px;
  color: var(--paper);
  margin-top: 10px;
  letter-spacing: 0.01em;
}
.cp__sign {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 22px;
  color: var(--brass);
  margin-top: 18px;
  letter-spacing: 0.01em;
}
`;

const PRESETS = [
  { m: 1, n: 2, label: '1 · 2', name: 'cross'   },
  { m: 2, n: 3, label: '2 · 3', name: 'lozenge' },
  { m: 3, n: 3, label: '3 · 3', name: 'lattice' },
  { m: 1, n: 4, label: '1 · 4', name: 'rays'    },
  { m: 4, n: 5, label: '4 · 5', name: 'weft'    },
  { m: 5, n: 6, label: '5 · 6', name: 'tartan'  },
  { m: 3, n: 7, label: '3 · 7', name: 'rose'    },
  { m: 6, n: 8, label: '6 · 8', name: 'mesh'    },
];

const chladni = (x, y, m, n) =>
  Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) -
  Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);

const PLATE = 600;

const ChladniPlatePage = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const rafRef = useRef(null);
  const audioRef = useRef({ ctx: null, osc: null, gain: null });

  const [m, setM] = useState(3);
  const [n, setN] = useState(5);
  const [vibration, setVibration] = useState(0.018);
  const [particleCount, setParticleCount] = useState(8000);
  const [running, setRunning] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [trail, setTrail] = useState(0.18);

  const baseHz = 110;
  const frequencyHz = Math.round(baseHz * Math.sqrt(m * m + n * n));
  const currentPreset = PRESETS.find(p => p.m === m && p.n === n);

  const seedParticles = useCallback(() => {
    const arr = new Float32Array(particleCount * 2);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 2] = Math.random();
      arr[i * 2 + 1] = Math.random();
    }
    particlesRef.current = arr;
  }, [particleCount]);

  useEffect(() => { seedParticles(); }, [seedParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = PLATE;
    canvas.height = PLATE;
    ctx.fillStyle = '#1a1411';
    ctx.fillRect(0, 0, PLATE, PLATE);

    const tick = () => {
      const arr = particlesRef.current;
      if (!arr) { rafRef.current = requestAnimationFrame(tick); return; }

      ctx.fillStyle = `rgba(26,20,17,${trail})`;
      ctx.fillRect(0, 0, PLATE, PLATE);

      if (running) {
        for (let i = 0; i < arr.length; i += 2) {
          const px = arr[i], py = arr[i + 1];
          const amp = Math.abs(chladni(px, py, m, n));
          const step = vibration * (amp + 0.002);
          const angle = Math.random() * Math.PI * 2;
          let nx = px + Math.cos(angle) * step;
          let ny = py + Math.sin(angle) * step;
          if (nx < 0) nx = -nx; else if (nx > 1) nx = 2 - nx;
          if (ny < 0) ny = -ny; else if (ny > 1) ny = 2 - ny;
          arr[i] = nx; arr[i + 1] = ny;
        }
      }

      ctx.fillStyle = '#efe5cc';
      for (let i = 0; i < arr.length; i += 2) {
        ctx.fillRect(arr[i] * PLATE, arr[i + 1] * PLATE, 1, 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m, n, vibration, running, trail]);

  useEffect(() => {
    const a = audioRef.current;
    if (!soundOn) {
      if (a.osc) {
        try { a.gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.05); } catch {}
        try { a.osc.stop(a.ctx.currentTime + 0.2); } catch {}
        a.osc = null;
      }
      return;
    }
    if (!a.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      a.ctx = new Ctor();
    }
    if (a.ctx.state === 'suspended') {
      a.ctx.resume().catch(() => {});
    }
    if (!a.osc) {
      a.osc = a.ctx.createOscillator();
      a.gain = a.ctx.createGain();
      a.gain.gain.value = 0;
      a.osc.type = 'sine';
      a.osc.frequency.value = frequencyHz;
      a.osc.connect(a.gain).connect(a.ctx.destination);
      a.osc.start();
      a.gain.gain.setTargetAtTime(0.06, a.ctx.currentTime, 0.05);
    } else {
      a.osc.frequency.setTargetAtTime(frequencyHz, a.ctx.currentTime, 0.05);
    }
  }, [soundOn, frequencyHz]);

  useEffect(() => () => {
    const a = audioRef.current;
    if (a.osc) { try { a.osc.stop(); } catch {} }
    if (a.ctx) { try { a.ctx.close(); } catch {} }
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `chladni_${m}-${n}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const randomize = () => {
    setM(2 + Math.floor(Math.random() * 7));
    setN(2 + Math.floor(Math.random() * 7));
    seedParticles();
  };

  return (
    <div className="cp">
      <style>{CSS}</style>
      <Seo
        title="Chladni Plate · Resonance Laboratorium | Fezcodex"
        description="Vibrate a square plate at modal frequencies and watch sand settle along the nodal lines. Faithful to Ernst Chladni's 1787 acoustic experiment."
        keywords={['chladni', 'cymatics', 'standing waves', 'physics', 'visualizer', 'sand', 'nodal lines']}
      />

      <div className="cp__edge-title">Resonantia · Plate № CXIV</div>

      <div className="cp__shell">
        {/* — top hairline band — */}
        <header className="cp__band">
          <Link to="/apps" className="cp__sigil">
            <span className="cp__sigil-mark">f</span>
            <span>← Index</span>
          </Link>
          <div className="cp__band-center">Acta Phonica · Liber I</div>
          <div>02·V·MMXXVI</div>
        </header>

        {/* — masthead — */}
        <section className="cp__mast">
          <div>
            <div className="cp__eye">Plate № CXIV — figurae sonorae</div>
            <h1 className="cp__title">
              Resonance
              <em>Laboratorium</em>
            </h1>
          </div>
          <p className="cp__lede">
            <span className="cp__lede-drop">E</span>
            rnst Chladni dusted square plates with fine sand, drew a violin bow
            across the edge, and made standing waves visible. Grains fled the
            antinodes and settled on the silent nodal lines — geometry from
            sound itself.
          </p>
        </section>

        {/* — workspace — */}
        <section className="cp__work">
          {/* LEFT — modal selectors */}
          <div className="cp__rail">
            <div className="cp__card">
              <div className="cp__card-num">
                <span>i. modal index</span>
                <span>m × n</span>
              </div>
              <div className="cp__pad-row">∙ m</div>
              <div className="cp__pad">
                {[1,2,3,4,5,6,7,8].map(v => (
                  <button key={`m${v}`} data-on={m===v} onClick={() => setM(v)}>{v}</button>
                ))}
              </div>
              <div className="cp__pad-row" style={{ marginTop: 16 }}>∙ n</div>
              <div className="cp__pad">
                {[1,2,3,4,5,6,7,8].map(v => (
                  <button key={`n${v}`} data-on={n===v} onClick={() => setN(v)}>{v}</button>
                ))}
              </div>
            </div>

            <div className="cp__card">
              <div className="cp__card-num">
                <span>ii. catalogue</span>
                <span>cum nomine</span>
              </div>
              <div className="cp__matrix">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => { setM(p.m); setN(p.n); seedParticles(); }}>
                    <span>{p.name}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER — the plate */}
          <div className="cp__stage">
            <div className="cp__stage-ticks">
              {Array.from({ length: 21 }).map((_, i) => <span key={i} />)}
            </div>

            <div className="cp__plate-wrap">
              <span className="cp__plate-corner tl" />
              <span className="cp__plate-corner tr" />
              <span className="cp__plate-corner bl" />
              <span className="cp__plate-corner br" />
              <canvas ref={canvasRef} className="cp__plate" />
            </div>

            <div className="cp__plaque">
              <span><span className="cp__plaque-led" />{running ? 'vibrating' : 'silenced'}</span>
              <span className="cp__plaque-mode">
                figura ({m}, {n}){currentPreset && ` · ${currentPreset.name}`}
              </span>
              <span style={{ textAlign: 'right' }}>
                <span className="cp__plaque-hz">{frequencyHz}</span> hz
              </span>
            </div>

            <div className="cp__actions">
              <button onClick={() => setRunning(r => !r)} data-on={running}>
                {running ? '❚❚ hold' : '▶ bow'}
              </button>
              <button onClick={() => setSoundOn(s => !s)} data-on={soundOn}>
                {soundOn ? '♪ tone' : '✕ mute'}
              </button>
              <button onClick={seedParticles}>re-dust</button>
              <button onClick={randomize}>↻ roll</button>
              <button onClick={handleDownload}>↓ plate</button>
            </div>
          </div>

          {/* RIGHT — readouts & physics */}
          <div className="cp__rail">
            <div className="cp__read">
              <span className="cp__read-eye">eigenfrequency</span>
              <span className="cp__read-val">{frequencyHz}<small>Hz</small></span>
              <span className="cp__read-cap">f ∝ √(m² + n²)</span>
            </div>
            <div className="cp__read">
              <span className="cp__read-eye">sand grains</span>
              <span className="cp__read-val">{(particleCount/1000).toFixed(1)}<small>k</small></span>
              <span className="cp__read-cap">quartz · 1px walk</span>
            </div>

            <div className="cp__card">
              <div className="cp__card-num">
                <span>iii. apparatus</span>
                <span>iii.</span>
              </div>
              <div className="cp__sld">
                <div className="cp__sld-row"><span>vibration</span><span>{vibration.toFixed(3)}</span></div>
                <input type="range" min="0.001" max="0.06" step="0.001"
                  value={vibration} onChange={e => setVibration(+e.target.value)} />
              </div>
              <div className="cp__sld">
                <div className="cp__sld-row"><span>quartz</span><span>{particleCount}</span></div>
                <input type="range" min="1000" max="20000" step="500"
                  value={particleCount} onChange={e => setParticleCount(+e.target.value)} />
              </div>
              <div className="cp__sld">
                <div className="cp__sld-row"><span>persistence</span><span>{trail.toFixed(2)}</span></div>
                <input type="range" min="0.02" max="1" step="0.01"
                  value={trail} onChange={e => setTrail(+e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* — colophon — */}
        <section className="cp__colophon">
          <div>
            <h3>method</h3>
            <p>
              Each grain executes a random walk whose step length scales with
              the local amplitude of the standing wave. Where the wave vanishes
              — the nodal lines — the grain settles and the figure emerges.
            </p>
            <div className="cp__formula">
              χ(x,y) = cos nπx · cos mπy − cos mπx · cos nπy
            </div>
          </div>
          <div>
            <h3>marginalia</h3>
            <p>
              Pairs (m,n) and (n,m) yield congruent figures rotated by a quarter
              turn. Equal indices m = n produce diagonal lattices; coprime
              indices produce lace-like asymmetry. Try (3, 7) at low vibration
              for the canonical Chladni rose.
            </p>
          </div>
          <div>
            <h3>colophon</h3>
            <p>
              Set in Cormorant Garamond &amp; JetBrains Mono. After Chladni's
              <span className="cp__serif-i"> Entdeckungen über die Theorie des Klanges</span>,
              Leipzig 1787. Pressed in the Fezcodex laboratory, anno MMXXVI.
            </p>
            <div className="cp__sign">— f.</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChladniPlatePage;
