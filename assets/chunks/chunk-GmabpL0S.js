import{r,j as e,L as F}from"../entries/pages.DMdlyjfO.js";import{S as I}from"./chunk-BrPMSi7I.js";import"./chunk-BXl3LOEh.js";/* empty css              */const L=`
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
`,B=[{m:1,n:2,label:"1 · 2",name:"cross"},{m:2,n:3,label:"2 · 3",name:"lozenge"},{m:3,n:3,label:"3 · 3",name:"lattice"},{m:1,n:4,label:"1 · 4",name:"rays"},{m:4,n:5,label:"4 · 5",name:"weft"},{m:5,n:6,label:"5 · 6",name:"tartan"},{m:3,n:7,label:"3 · 7",name:"rose"},{m:6,n:8,label:"6 · 8",name:"mesh"}],V=(m,h,c,g)=>Math.cos(g*Math.PI*m)*Math.cos(c*Math.PI*h)-Math.cos(c*Math.PI*m)*Math.cos(g*Math.PI*h),p=600,K=()=>{const m=r.useRef(null),h=r.useRef(null),c=r.useRef(null),g=r.useRef({ctx:null,osc:null,gain:null}),[i,j]=r.useState(3),[o,w]=r.useState(5),[b,R]=r.useState(.018),[x,P]=r.useState(8e3),[_,S]=r.useState(!0),[v,J]=r.useState(!1),[y,T]=r.useState(.18),f=Math.round(110*Math.sqrt(i*i+o*o)),N=B.find(a=>a.m===i&&a.n===o),u=r.useCallback(()=>{const a=new Float32Array(x*2);for(let t=0;t<x;t++)a[t*2]=Math.random(),a[t*2+1]=Math.random();h.current=a},[x]);r.useEffect(()=>{u()},[u]),r.useEffect(()=>{const a=m.current;if(!a)return;const t=a.getContext("2d");a.width=p,a.height=p,t.fillStyle="#1a1411",t.fillRect(0,0,p,p);const k=()=>{const s=h.current;if(!s){c.current=requestAnimationFrame(k);return}if(t.fillStyle=`rgba(26,20,17,${y})`,t.fillRect(0,0,p,p),_)for(let n=0;n<s.length;n+=2){const z=s[n],M=s[n+1],G=Math.abs(V(z,M,i,o)),C=b*(G+.002),q=Math.random()*Math.PI*2;let l=z+Math.cos(q)*C,d=M+Math.sin(q)*C;l<0?l=-l:l>1&&(l=2-l),d<0?d=-d:d>1&&(d=2-d),s[n]=l,s[n+1]=d}t.fillStyle="#efe5cc";for(let n=0;n<s.length;n+=2)t.fillRect(s[n]*p,s[n+1]*p,1,1);c.current=requestAnimationFrame(k)};return c.current=requestAnimationFrame(k),()=>cancelAnimationFrame(c.current)},[i,o,b,_,y]),r.useEffect(()=>{const a=g.current;if(!v){if(a.osc){try{a.gain.gain.setTargetAtTime(0,a.ctx.currentTime,.05)}catch{}try{a.osc.stop(a.ctx.currentTime+.2)}catch{}a.osc=null}return}if(!a.ctx){const t=window.AudioContext||window.webkitAudioContext;a.ctx=new t}a.ctx.state==="suspended"&&a.ctx.resume().catch(()=>{}),a.osc?a.osc.frequency.setTargetAtTime(f,a.ctx.currentTime,.05):(a.osc=a.ctx.createOscillator(),a.gain=a.ctx.createGain(),a.gain.gain.value=0,a.osc.type="sine",a.osc.frequency.value=f,a.osc.connect(a.gain).connect(a.ctx.destination),a.osc.start(),a.gain.gain.setTargetAtTime(.06,a.ctx.currentTime,.05))},[v,f]),r.useEffect(()=>()=>{const a=g.current;if(a.osc)try{a.osc.stop()}catch{}if(a.ctx)try{a.ctx.close()}catch{}},[]);const A=()=>{const a=m.current,t=document.createElement("a");t.download=`chladni_${i}-${o}_${Date.now()}.png`,t.href=a.toDataURL("image/png"),t.click()},E=()=>{j(2+Math.floor(Math.random()*7)),w(2+Math.floor(Math.random()*7)),u()};return e.jsxs("div",{className:"cp",children:[e.jsx("style",{children:L}),e.jsx(I,{title:"Chladni Plate · Resonance Laboratorium | Fezcodex",description:"Vibrate a square plate at modal frequencies and watch sand settle along the nodal lines. Faithful to Ernst Chladni's 1787 acoustic experiment.",keywords:["chladni","cymatics","standing waves","physics","visualizer","sand","nodal lines"]}),e.jsx("div",{className:"cp__edge-title",children:"Resonantia · Plate № CXIV"}),e.jsxs("div",{className:"cp__shell",children:[e.jsxs("header",{className:"cp__band",children:[e.jsxs(F,{to:"/apps",className:"cp__sigil",children:[e.jsx("span",{className:"cp__sigil-mark",children:"f"}),e.jsx("span",{children:"← Index"})]}),e.jsx("div",{className:"cp__band-center",children:"Acta Phonica · Liber I"}),e.jsx("div",{children:"02·V·MMXXVI"})]}),e.jsxs("section",{className:"cp__mast",children:[e.jsxs("div",{children:[e.jsx("div",{className:"cp__eye",children:"Plate № CXIV — figurae sonorae"}),e.jsxs("h1",{className:"cp__title",children:["Resonance",e.jsx("em",{children:"Laboratorium"})]})]}),e.jsxs("p",{className:"cp__lede",children:[e.jsx("span",{className:"cp__lede-drop",children:"E"}),"rnst Chladni dusted square plates with fine sand, drew a violin bow across the edge, and made standing waves visible. Grains fled the antinodes and settled on the silent nodal lines — geometry from sound itself."]})]}),e.jsxs("section",{className:"cp__work",children:[e.jsxs("div",{className:"cp__rail",children:[e.jsxs("div",{className:"cp__card",children:[e.jsxs("div",{className:"cp__card-num",children:[e.jsx("span",{children:"i. modal index"}),e.jsx("span",{children:"m × n"})]}),e.jsx("div",{className:"cp__pad-row",children:"∙ m"}),e.jsx("div",{className:"cp__pad",children:[1,2,3,4,5,6,7,8].map(a=>e.jsx("button",{"data-on":i===a,onClick:()=>j(a),children:a},`m${a}`))}),e.jsx("div",{className:"cp__pad-row",style:{marginTop:16},children:"∙ n"}),e.jsx("div",{className:"cp__pad",children:[1,2,3,4,5,6,7,8].map(a=>e.jsx("button",{"data-on":o===a,onClick:()=>w(a),children:a},`n${a}`))})]}),e.jsxs("div",{className:"cp__card",children:[e.jsxs("div",{className:"cp__card-num",children:[e.jsx("span",{children:"ii. catalogue"}),e.jsx("span",{children:"cum nomine"})]}),e.jsx("div",{className:"cp__matrix",children:B.map(a=>e.jsxs("button",{onClick:()=>{j(a.m),w(a.n),u()},children:[e.jsx("span",{children:a.name}),e.jsx("span",{children:a.label})]},a.label))})]})]}),e.jsxs("div",{className:"cp__stage",children:[e.jsx("div",{className:"cp__stage-ticks",children:Array.from({length:21}).map((a,t)=>e.jsx("span",{},t))}),e.jsxs("div",{className:"cp__plate-wrap",children:[e.jsx("span",{className:"cp__plate-corner tl"}),e.jsx("span",{className:"cp__plate-corner tr"}),e.jsx("span",{className:"cp__plate-corner bl"}),e.jsx("span",{className:"cp__plate-corner br"}),e.jsx("canvas",{ref:m,className:"cp__plate"})]}),e.jsxs("div",{className:"cp__plaque",children:[e.jsxs("span",{children:[e.jsx("span",{className:"cp__plaque-led"}),_?"vibrating":"silenced"]}),e.jsxs("span",{className:"cp__plaque-mode",children:["figura (",i,", ",o,")",N&&` · ${N.name}`]}),e.jsxs("span",{style:{textAlign:"right"},children:[e.jsx("span",{className:"cp__plaque-hz",children:f})," hz"]})]}),e.jsxs("div",{className:"cp__actions",children:[e.jsx("button",{onClick:()=>S(a=>!a),"data-on":_,children:_?"❚❚ hold":"▶ bow"}),e.jsx("button",{onClick:()=>J(a=>!a),"data-on":v,children:v?"♪ tone":"✕ mute"}),e.jsx("button",{onClick:u,children:"re-dust"}),e.jsx("button",{onClick:E,children:"↻ roll"}),e.jsx("button",{onClick:A,children:"↓ plate"})]})]}),e.jsxs("div",{className:"cp__rail",children:[e.jsxs("div",{className:"cp__read",children:[e.jsx("span",{className:"cp__read-eye",children:"eigenfrequency"}),e.jsxs("span",{className:"cp__read-val",children:[f,e.jsx("small",{children:"Hz"})]}),e.jsx("span",{className:"cp__read-cap",children:"f ∝ √(m² + n²)"})]}),e.jsxs("div",{className:"cp__read",children:[e.jsx("span",{className:"cp__read-eye",children:"sand grains"}),e.jsxs("span",{className:"cp__read-val",children:[(x/1e3).toFixed(1),e.jsx("small",{children:"k"})]}),e.jsx("span",{className:"cp__read-cap",children:"quartz · 1px walk"})]}),e.jsxs("div",{className:"cp__card",children:[e.jsxs("div",{className:"cp__card-num",children:[e.jsx("span",{children:"iii. apparatus"}),e.jsx("span",{children:"iii."})]}),e.jsxs("div",{className:"cp__sld",children:[e.jsxs("div",{className:"cp__sld-row",children:[e.jsx("span",{children:"vibration"}),e.jsx("span",{children:b.toFixed(3)})]}),e.jsx("input",{type:"range",min:"0.001",max:"0.06",step:"0.001",value:b,onChange:a=>R(+a.target.value)})]}),e.jsxs("div",{className:"cp__sld",children:[e.jsxs("div",{className:"cp__sld-row",children:[e.jsx("span",{children:"quartz"}),e.jsx("span",{children:x})]}),e.jsx("input",{type:"range",min:"1000",max:"20000",step:"500",value:x,onChange:a=>P(+a.target.value)})]}),e.jsxs("div",{className:"cp__sld",children:[e.jsxs("div",{className:"cp__sld-row",children:[e.jsx("span",{children:"persistence"}),e.jsx("span",{children:y.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.02",max:"1",step:"0.01",value:y,onChange:a=>T(+a.target.value)})]})]})]})]}),e.jsxs("section",{className:"cp__colophon",children:[e.jsxs("div",{children:[e.jsx("h3",{children:"method"}),e.jsx("p",{children:"Each grain executes a random walk whose step length scales with the local amplitude of the standing wave. Where the wave vanishes — the nodal lines — the grain settles and the figure emerges."}),e.jsx("div",{className:"cp__formula",children:"χ(x,y) = cos nπx · cos mπy − cos mπx · cos nπy"})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"marginalia"}),e.jsx("p",{children:"Pairs (m,n) and (n,m) yield congruent figures rotated by a quarter turn. Equal indices m = n produce diagonal lattices; coprime indices produce lace-like asymmetry. Try (3, 7) at low vibration for the canonical Chladni rose."})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"colophon"}),e.jsxs("p",{children:["Set in Cormorant Garamond & JetBrains Mono. After Chladni's",e.jsx("span",{className:"cp__serif-i",children:" Entdeckungen über die Theorie des Klanges"}),", Leipzig 1787. Pressed in the Fezcodex laboratory, anno MMXXVI."]}),e.jsx("div",{className:"cp__sign",children:"— f."})]})]})]})]})};export{K as default};
