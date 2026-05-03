import{n as se,r as L,j as a,L as ne,b as oe,I as ce,a0 as le,bh as A,W as ie,bo as I}from"../entries/pages.DMdlyjfO.js";import{e as de}from"./chunk-DA5umwxN.js";import{o as Z}from"./chunk-DyIT9c2g.js";import{e as pe}from"./chunk-CmaC6N5x.js";import{o as G}from"./chunk-BYlJu_D7.js";import{S as be}from"./chunk-BrPMSi7I.js";import{C as he}from"./chunk-D1vV3uUi.js";import"./chunk-BXl3LOEh.js";/* empty css              */import"./chunk-C92apCAb.js";const s={bg:"#0F0F10",surface:"#17171A",surface2:"#1E1E22",hair:"rgba(239,236,228,0.08)",hairHi:"rgba(239,236,228,0.16)",ink:"#EFECE4",inkSoft:"#A8A49B",inkDim:"#6E6B64",accent:"#C4643A",accentSoft:"rgba(196,100,58,0.14)",accentRing:"rgba(196,100,58,0.28)"},me=()=>"#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0"),fe=`
  .wb-label {
    font-family: 'JetBrains Mono', 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 0.08em;
    color: var(--wb-ink-soft); text-transform: lowercase;
  }
  .wb-value {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 13px; color: var(--wb-ink);
    font-variant-numeric: tabular-nums;
  }
  .wb-card {
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 14px;
    padding: 20px;
  }
  .wb-section-head {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--wb-ink-soft);
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid var(--wb-hair);
  }
  .wb-slider {
    -webkit-appearance: none; appearance: none;
    background: transparent; height: 20px; width: 100%;
    outline: none; cursor: pointer;
  }
  .wb-slider::-webkit-slider-runnable-track {
    height: 3px; border-radius: 2px;
    background: linear-gradient(to right,
      var(--wb-accent) var(--wb-pct, 0%),
      rgba(25,23,22,0.12) var(--wb-pct, 0%));
  }
  .wb-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    height: 14px; width: 14px; border-radius: 50%;
    background: var(--wb-bg);
    border: 2px solid var(--wb-accent);
    margin-top: -5.5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: transform .12s ease;
  }
  .wb-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
  .wb-slider::-moz-range-track { height: 3px; background: rgba(25,23,22,0.12); border-radius: 2px; }
  .wb-slider::-moz-range-progress { height: 3px; background: var(--wb-accent); border-radius: 2px; }
  .wb-slider::-moz-range-thumb {
    height: 14px; width: 14px; border-radius: 50%;
    background: var(--wb-bg); border: 2px solid var(--wb-accent); cursor: pointer;
  }
  .wb-select {
    width: 100%; appearance: none; -webkit-appearance: none;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    padding: 10px 36px 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px; color: var(--wb-ink);
    outline: none; cursor: pointer;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-select:hover { border-color: var(--wb-hair-hi); }
  .wb-select:focus {
    border-color: var(--wb-accent);
    box-shadow: 0 0 0 3px var(--wb-accent-ring);
  }
  .wb-input {
    width: 100%;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    padding: 6px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; color: var(--wb-ink);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-input:focus {
    border-color: var(--wb-accent);
    box-shadow: 0 0 0 3px var(--wb-accent-ring);
  }
  .wb-swatch {
    width: 40px; height: 40px; border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(25,23,22,0.18), 0 1px 2px rgba(0,0,0,0.04);
    cursor: pointer; transition: transform .15s ease; flex-shrink: 0;
    overflow: hidden; position: relative;
  }
  .wb-swatch:hover { transform: scale(1.06); }
  .wb-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.08em;
    background: var(--wb-surface);
    color: var(--wb-ink);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    cursor: pointer;
    transition: all .15s ease;
  }
  .wb-btn:hover {
    background: var(--wb-accent);
    color: var(--wb-bg);
    border-color: var(--wb-accent);
  }
  .wb-btn--primary {
    background: var(--wb-accent);
    color: var(--wb-bg);
    border-color: var(--wb-accent);
  }
  .wb-btn--primary:hover {
    background: #A85430;
    border-color: #A85430;
  }
  .wb-micro-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: var(--wb-ink-soft);
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .wb-micro-btn:hover {
    background: var(--wb-accent-soft);
    color: var(--wb-accent);
  }
  .wb-kbd {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 6px; border-radius: 5px;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--wb-ink-soft);
  }
  .wb-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 999px;
    border: 1px solid var(--wb-hair);
    background: var(--wb-surface);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.12em;
    color: var(--wb-ink-soft);
  }
  .wb-display {
    font-family: 'Fraunces', 'EB Garamond', serif;
    font-variation-settings: "opsz" 72, "SOFT" 0, "WONK" 0;
  }
  .wb-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }
  @keyframes wb-reveal {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wb-reveal { animation: wb-reveal .5s cubic-bezier(.2,.7,.2,1) both; }
  :root {
    --wb-bg: ${s.bg}; --wb-surface: ${s.surface}; --wb-surface-2: ${s.surface2};
    --wb-hair: ${s.hair}; --wb-hair-hi: ${s.hairHi};
    --wb-ink: ${s.ink}; --wb-ink-soft: ${s.inkSoft}; --wb-ink-dim: ${s.inkDim};
    --wb-accent: ${s.accent}; --wb-accent-soft: ${s.accentSoft}; --wb-accent-ring: ${s.accentRing};
  }
  .wb-page *:focus-visible {
    outline: 2px solid var(--wb-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
  .wb-page::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle at 30% 30%, rgba(25,23,22,0.025) 1px, transparent 1px);
    background-size: 3px 3px; opacity: 0.6;
  }
  .wb-page::after {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(60% 30% at 50% 0%, rgba(196,100,58,0.06), transparent 70%);
  }
`,xe=({label:S,value:u,min:b,max:M,step:$=1,onChange:w,format:f})=>{const D=Math.max(0,Math.min(100,(u-b)/(M-b)*100)),y=f?f(u):typeof u=="number"&&!Number.isInteger(u)?u.toFixed(2):u;return a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-baseline justify-between mb-2",children:[a.jsx("span",{className:"wb-label",children:S}),a.jsx("span",{className:"wb-value",children:y})]}),a.jsx("input",{type:"range",min:b,max:M,step:$,value:u,onChange:P=>w(parseFloat(P.target.value)),className:"wb-slider",style:{"--wb-pct":`${D}%`}})]})},F=({label:S,options:u,value:b,onChange:M,icon:$})=>a.jsxs("div",{children:[S&&a.jsxs("div",{className:"wb-label mb-2 flex items-center gap-2",children:[$&&a.jsx($,{size:12}),a.jsx("span",{children:S})]}),a.jsxs("div",{className:"relative",children:[a.jsx("select",{value:b,onChange:w=>M(w.target.value),className:"wb-select",children:u.map(w=>a.jsx("option",{value:w.value,children:w.label},w.value))}),a.jsx(de,{size:14,className:"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",style:{color:s.inkSoft}})]})]}),E=[["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],["#cdb4db","#ffc8dd","#ffafcc","#bde0fe","#a2d2ff"],["#003049","#d62828","#f77f00","#fcbf49","#eae2b7"],["#606c38","#283618","#fefae0","#dda15e","#bc6c25"],["#2b2d42","#8d99ae","#edf2f4","#ef233c","#d90429"],["#000000","#14213d","#fca311","#e5e5e5","#ffffff"],["#5f0f40","#9a031e","#fb8b24","#e36414","#0f4c5c"]],O=["square","circle","triangle-tl","triangle-tr","triangle-bl","triangle-br","quarter-tl","quarter-tr","quarter-bl","quarter-br","half-t","half-b","half-l","half-r"],ue=[{value:"bauhaus",label:"Bauhaus Shapes"},{value:"mosaic",label:"Mosaic Triangles"},{value:"rings",label:"Concentric Rings"},{value:"stripes",label:"Directions"},{value:"pyramids",label:"Pyramids"},{value:"cubist",label:"Cubist Blocks"}],ge={square:{w:3840,h:3840},landscape:{w:3840,h:2160},portrait:{w:2160,h:3840}},$e=[{value:"square",label:"Square (1:1)"},{value:"landscape",label:"Landscape (16:9)"},{value:"portrait",label:"Portrait (9:16)"}],De=()=>{const{addToast:S}=se(),u=L.useRef(null),[b,M]=L.useState(E[0]),[$,w]=L.useState("square"),[f,D]=L.useState("bauhaus"),[y,P]=L.useState(10),[U,W]=L.useState([]),[H,J]=L.useState(0),h=ge[$],C=y,v=h.w/C,R=Math.ceil(h.h/v),B=L.useCallback(()=>{const n=[],t=(r=2)=>{const e=[];for(;e.length<r;){const o=Math.floor(Math.random()*5);e.includes(o)||e.push(o)}return e};for(let r=0;r<R;r++){const e=[];for(let o=0;o<C;o++){let i={};if(f==="bauhaus"){const[l,p]=t(2),c=O[Math.floor(Math.random()*O.length)];i={bgIndex:l,fgIndex:p,shape:c}}else if(f==="mosaic"){const[l,p]=t(2),c=Math.random()>.5?"backslash":"slash";i={c1:l,c2:p,type:c}}else if(f==="rings"){const l=Math.floor(Math.random()*3)+2;i={indices:t(l)}}else if(f==="stripes"){const[l,p]=t(2),c=Math.floor(Math.random()*4);i={c1:l,c2:p,direction:c}}else if(f==="pyramids")i={indices:t(4)};else if(f==="cubist"){const l=t(4),p=.3+Math.random()*.5,c=(Math.random()-.5)*.8,m=(Math.random()-.5)*.8;i={indices:l,scale:p,shiftX:c,shiftY:m}}e.push(i)}n.push(e)}W(n)},[C,R,f]);L.useEffect(()=>{B()},[B,H]);const K=()=>{const n=E[Math.floor(Math.random()*E.length)];M(n)},T=(n,t)=>{const r=[...b];r[n]=t,M(r)},V=()=>J(Math.random()),Y=()=>{if(!u.current)return;const n=new XMLSerializer().serializeToString(u.current),t=new Blob([n],{type:"image/svg+xml;charset=utf-8"}),r=URL.createObjectURL(t),e=document.createElement("a");e.href=r,e.download=`pattern-${f}-${$}-${Date.now()}.svg`,document.body.appendChild(e),e.click(),document.body.removeChild(e),S({title:"Downloaded",message:"SVG saved.",duration:3e3})},q=(n,t,r="4K")=>{const e=u.current;if(!e)return;const o=n||h.w,i=t||h.h,l=new XMLSerializer().serializeToString(e),p=document.createElement("canvas"),c=p.getContext("2d"),m=new Image;p.width=o,p.height=i;const d=new Blob([l],{type:"image/svg+xml;charset=utf-8"}),N=URL.createObjectURL(d);m.onload=()=>{c.clearRect(0,0,o,i),c.drawImage(m,0,0,o,i);const x=p.toDataURL("image/png"),g=document.createElement("a");g.href=x,g.download=`pattern-${f}-${$}-${r}-${Date.now()}.png`,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(N),S({title:"Downloaded",message:`${r} PNG saved.`,duration:3e3})},m.src=N},X=()=>q(h.w/2,h.h/2,"1080p"),_=(n,t,r,e)=>{const{bgIndex:o,fgIndex:i,shape:l}=n;if(o===void 0||i===void 0||!l)return null;const p=b[o]||"#000",c=b[i]||"#fff",m=a.jsx("rect",{x:t,y:r,width:e,height:e,fill:p});let d=null;const N=t+e/2,x=r+e/2,g=e/2;switch(l){case"square":d=a.jsx("rect",{x:t,y:r,width:e,height:e,fill:c});break;case"circle":d=a.jsx("circle",{cx:N,cy:x,r:g,fill:c});break;case"triangle-tl":d=a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${t},${r+e} Z`,fill:c});break;case"triangle-tr":d=a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${t+e},${r+e} Z`,fill:c});break;case"triangle-bl":d=a.jsx("path",{d:`M${t},${r} L${t},${r+e} L${t+e},${r+e} Z`,fill:c});break;case"triangle-br":d=a.jsx("path",{d:`M${t+e},${r} L${t+e},${r+e} L${t},${r+e} Z`,fill:c});break;case"quarter-tl":d=a.jsx("path",{d:`M${t},${r} L${t+e},${r} A${e},${e} 0 0 1 ${t},${r+e} Z`,fill:c});break;case"quarter-tr":d=a.jsx("path",{d:`M${t+e},${r} L${t+e},${r+e} A${e},${e} 0 0 1 ${t},${r} Z`,fill:c});break;case"quarter-bl":d=a.jsx("path",{d:`M${t},${r+e} L${t},${r} A${e},${e} 0 0 1 ${t+e},${r+e} Z`,fill:c});break;case"quarter-br":d=a.jsx("path",{d:`M${t+e},${r+e} L${t},${r+e} A${e},${e} 0 0 1 ${t+e},${r} Z`,fill:c});break;case"half-t":d=a.jsx("rect",{x:t,y:r,width:e,height:e/2,fill:c});break;case"half-b":d=a.jsx("rect",{x:t,y:r+e/2,width:e,height:e/2,fill:c});break;case"half-l":d=a.jsx("rect",{x:t,y:r,width:e/2,height:e,fill:c});break;case"half-r":d=a.jsx("rect",{x:t+e/2,y:r,width:e/2,height:e,fill:c});break}return a.jsxs("g",{children:[m,d]},`${t}-${r}`)},Q=(n,t,r,e)=>{const{c1:o,c2:i,type:l}=n;if(o===void 0||i===void 0)return null;const p=b[o],c=b[i];return l==="backslash"?a.jsxs("g",{children:[a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${t+e},${r+e} Z`,fill:p}),a.jsx("path",{d:`M${t},${r} L${t+e},${r+e} L${t},${r+e} Z`,fill:c})]},`${t}-${r}`):a.jsxs("g",{children:[a.jsx("path",{d:`M${t+e},${r} L${t+e},${r+e} L${t},${r+e} Z`,fill:p}),a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${t},${r+e} Z`,fill:c})]},`${t}-${r}`)},z=(n,t,r,e)=>{const{indices:o}=n;if(!o)return null;const i=t+e/2,l=r+e/2;return a.jsx("g",{children:o.map((p,c)=>{const m=e/2*(1-c/o.length);return a.jsx("circle",{cx:i,cy:l,r:m,fill:b[p]},c)})},`${t}-${r}`)},ee=(n,t,r,e)=>{const{c1:o,c2:i,direction:l}=n;if(o===void 0||i===void 0)return null;const p=b[o],c=b[i];let m,d;return l===0?(m=`M${t},${r} L${t+e},${r} L${t+e},${r+e/2} L${t},${r+e/2} Z`,d=`M${t},${r+e/2} L${t+e},${r+e/2} L${t+e},${r+e} L${t},${r+e} Z`):l===1?(m=`M${t},${r} L${t+e/2},${r} L${t+e/2},${r+e} L${t},${r+e} Z`,d=`M${t+e/2},${r} L${t+e},${r} L${t+e},${r+e} L${t+e/2},${r+e} Z`):l===2?(m=`M${t},${r} L${t+e},${r} L${t},${r+e} Z`,d=`M${t+e},${r} L${t+e},${r+e} L${t},${r+e} Z`):(m=`M${t},${r} L${t+e},${r} L${t+e},${r+e} Z`,d=`M${t},${r} L${t},${r+e} L${t+e},${r+e} Z`),a.jsxs("g",{children:[a.jsx("path",{d:m,fill:p}),a.jsx("path",{d,fill:c})]},`${t}-${r}`)},ae=(n,t,r,e)=>{const{indices:o}=n;if(!o||o.length<4)return null;const i=t+e/2,l=r+e/2,[p,c,m,d]=o.map(N=>b[N]);return a.jsxs("g",{children:[a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${i},${l} Z`,fill:p}),a.jsx("path",{d:`M${t+e},${r} L${t+e},${r+e} L${i},${l} Z`,fill:c}),a.jsx("path",{d:`M${t+e},${r+e} L${t},${r+e} L${i},${l} Z`,fill:m}),a.jsx("path",{d:`M${t},${r+e} L${t},${r} L${i},${l} Z`,fill:d})]},`${t}-${r}`)},te=(n,t,r,e)=>{const{indices:o,scale:i,shiftX:l,shiftY:p}=n;if(!o||o.length<4)return null;const c=b[o[0]],m=b[o[1]],d=b[o[2]],N=b[o[3]],x=e*i,g=e-x,j=t+g*(.5+l/2),k=r+g*(.5+p/2);return a.jsxs("g",{children:[a.jsx("rect",{x:t,y:r,width:e,height:e,fill:c}),a.jsx("path",{d:`M${t},${r} L${t+e},${r} L${j+x},${k} L${j},${k} Z`,fill:m}),a.jsx("path",{d:`M${t},${r+e} L${t+e},${r+e} L${j+x},${k+x} L${j},${k+x} Z`,fill:m}),a.jsx("path",{d:`M${t},${r} L${t},${r+e} L${j},${k+x} L${j},${k} Z`,fill:d}),a.jsx("path",{d:`M${t+e},${r} L${t+e},${r+e} L${j+x},${k+x} L${j+x},${k} Z`,fill:d}),a.jsx("rect",{x:j,y:k,width:x,height:x,fill:N})]},`${t}-${r}`)},re=(n,t,r)=>{const e=r*v,o=t*v;switch(f){case"bauhaus":return _(n,e,o,v);case"mosaic":return Q(n,e,o,v);case"rings":return z(n,e,o,v);case"stripes":return ee(n,e,o,v);case"pyramids":return ae(n,e,o,v);case"cubist":return te(n,e,o,v);default:return null}};return a.jsxs("div",{className:"wb-page min-h-screen relative",style:{background:s.bg,color:s.ink,fontFamily:"'Instrument Sans', system-ui, sans-serif"},children:[a.jsx("style",{children:fe}),a.jsx(be,{title:"Pattern Generator — Fezcodex",description:"Generate seamless geometric vector patterns in 4K resolution.",keywords:["pattern","generator","svg","geometric","design","4k","wallpaper"]}),a.jsx("div",{className:"sticky top-0 z-30 relative",style:{background:`${s.bg}E8`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:`1px solid ${s.hair}`},children:a.jsxs("div",{className:"mx-auto max-w-[1600px] px-6 md:px-10 h-14 flex items-center justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-5",children:[a.jsxs(ne,{to:"/apps",className:"flex items-center gap-2 transition-opacity hover:opacity-70",style:{color:s.inkSoft},children:[a.jsx(oe,{size:13}),a.jsx("span",{className:"wb-mono text-[11px] tracking-[0.08em]",children:"apps"})]}),a.jsx("span",{className:"h-4 w-px",style:{background:s.hairHi}}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(Z,{size:6,weight:"fill",style:{color:s.accent}}),a.jsx("span",{className:"wb-mono text-[11px]",style:{color:s.ink},children:"pattern"}),a.jsx("span",{className:"wb-mono text-[11px]",style:{color:s.inkDim},children:"/ generator"})]})]}),a.jsxs("div",{className:"hidden md:flex items-center gap-5",children:[a.jsxs("span",{className:"wb-mono text-[10px]",style:{color:s.inkDim},children:[h.w,"×",h.h]}),a.jsx("span",{className:"h-4 w-px",style:{background:s.hairHi}}),a.jsx("span",{className:"wb-mono text-[10px]",style:{color:s.inkDim},children:"v2026.1"})]})]})}),a.jsxs("header",{className:"wb-reveal relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 pt-10 md:pt-14 pb-8",children:[a.jsxs("div",{className:"flex flex-col md:flex-row md:items-end md:justify-between gap-6",children:[a.jsxs("div",{className:"max-w-2xl",children:[a.jsxs("div",{className:"wb-mono text-[11px] mb-3 flex items-center gap-2",style:{color:s.inkSoft,letterSpacing:"0.08em"},children:[a.jsx(G,{size:12,style:{color:s.accent}}),a.jsx("span",{children:"pattern · generator"})]}),a.jsx("h1",{className:"wb-display leading-[1.05] tracking-[-0.01em]",style:{fontSize:"clamp(40px, 5vw, 64px)",color:s.ink,fontWeight:400},children:"Compose a pattern."}),a.jsx("p",{className:"mt-3 text-[15px] md:text-[16px] max-w-xl leading-relaxed",style:{color:s.inkSoft},children:"Six generative styles, seven curated palettes, vector output at 4K. Re-seed and export as SVG for infinite scaling, or rasterize to PNG."})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.jsxs("button",{onClick:V,className:"wb-btn wb-btn--primary",children:[a.jsx(ce,{size:13}),a.jsx("span",{children:"re-seed"})]}),a.jsxs("button",{onClick:Y,className:"wb-btn",children:[a.jsx(le,{size:13}),a.jsx("span",{children:"SVG · 4K"})]}),a.jsxs("button",{onClick:()=>q(null,null,"4K"),className:"wb-btn",children:[a.jsx(A,{size:13}),a.jsx("span",{children:"PNG · 4K"})]}),a.jsxs("button",{onClick:X,className:"wb-btn",children:[a.jsx(A,{size:13}),a.jsx("span",{children:"PNG · 1080p"})]})]})]}),a.jsxs("div",{className:"mt-10 relative",style:{height:1},children:[a.jsx("div",{className:"absolute inset-0",style:{background:s.hair}}),a.jsx("div",{className:"absolute left-0 top-0 bottom-0",style:{width:40,background:s.accent}})]})]}),a.jsx("main",{className:"wb-reveal relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 pb-16",style:{animationDelay:".08s"},children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",children:[a.jsx("div",{className:"lg:col-span-8 order-1",children:a.jsxs("div",{className:"lg:sticky lg:top-20 space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[a.jsxs("div",{className:"flex items-center gap-4 wb-mono",style:{letterSpacing:"0.08em"},children:[a.jsx("span",{style:{color:s.inkSoft},children:"preview"}),a.jsx("span",{style:{color:s.inkDim},children:"·"}),a.jsxs("span",{style:{color:s.inkDim},children:[h.w," × ",h.h]})]}),a.jsxs("div",{className:"flex items-center gap-3 wb-mono",style:{letterSpacing:"0.08em"},children:[a.jsxs("span",{style:{color:s.inkDim},children:[C," × ",R]}),a.jsx("span",{style:{color:s.inkDim},children:"·"}),a.jsx("span",{style:{color:s.inkDim},children:f})]})]}),a.jsx("div",{className:"flex items-center justify-center p-4 md:p-6 overflow-hidden",style:{background:s.surface,border:`1px solid ${s.hair}`,borderRadius:14,minHeight:400},children:a.jsx("svg",{ref:u,width:h.w,height:h.h,viewBox:`0 0 ${h.w} ${h.h}`,style:{maxHeight:"70vh",maxWidth:"100%",aspectRatio:`${h.w}/${h.h}`,display:"block"},children:U.map((n,t)=>n.map((r,e)=>re(r,t,e)))})}),a.jsxs("div",{className:"flex items-start gap-3 p-4",style:{background:s.accentSoft,border:"1px solid rgba(196,100,58,0.18)",borderRadius:10},children:[a.jsx(Z,{size:8,weight:"fill",style:{color:s.accent,marginTop:4,flexShrink:0}}),a.jsxs("p",{className:"wb-mono text-[11px]",style:{color:s.ink,letterSpacing:"0.02em"},children:["Output renders at ",h.w,"×",h.h,". Vector patterns scale infinitely — export to SVG for design work, PNG for quick posts."]})]})]})}),a.jsxs("div",{className:"lg:col-span-4 order-2 space-y-4",children:[a.jsxs("div",{className:"wb-card space-y-4",children:[a.jsxs("h3",{className:"wb-section-head",children:[a.jsx(pe,{size:12}),"Canvas Setup"]}),a.jsx(F,{label:"Pattern style",options:ue,value:f,onChange:D,icon:G}),a.jsx(F,{label:"Aspect ratio",options:$e,value:$,onChange:w}),a.jsx(xe,{label:"Grid density",value:y,min:4,max:40,step:2,onChange:P,format:n=>`${n} cols · ${Math.ceil(h.h/(h.w/n))} rows`})]}),a.jsxs("div",{className:"wb-card",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4 pb-3",style:{borderBottom:`1px solid ${s.hair}`},children:[a.jsxs("h3",{className:"wb-mono text-[10px] uppercase",style:{color:s.inkSoft,letterSpacing:"0.16em",display:"inline-flex",alignItems:"center",gap:8},children:[a.jsx(ie,{size:12}),"Color Palette"]}),a.jsx("button",{onClick:K,className:"p-1.5 rounded-md transition-colors",style:{color:s.accent},title:"Shuffle palette",onMouseEnter:n=>n.currentTarget.style.background=s.accentSoft,onMouseLeave:n=>n.currentTarget.style.background="transparent",children:a.jsx(I,{size:14})})]}),a.jsx("div",{className:"space-y-4",children:b.map((n,t)=>a.jsxs("div",{className:"space-y-1.5",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("span",{className:"wb-label",children:["Color ",t+1]}),a.jsx("button",{onClick:()=>T(t,me()),className:"wb-micro-btn",title:"Randomize this color","aria-label":"Randomize this color",children:a.jsx(I,{size:11})})]}),a.jsx(he,{value:n,onChange:r=>T(t,r),variant:"brutalist"})]},t))})]})]})]})}),a.jsxs("footer",{className:"relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3",style:{borderTop:`1px solid ${s.hair}`},children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(Z,{size:6,weight:"fill",style:{color:s.accent}}),a.jsx("span",{className:"wb-mono text-[10px]",style:{color:s.inkDim,letterSpacing:"0.1em"},children:"fezcodex / pattern"})]}),a.jsx("span",{className:"wb-display text-[14px]",style:{color:s.inkSoft},children:"shapes speak in sequence."}),a.jsx("span",{className:"wb-mono text-[10px]",style:{color:s.inkDim,letterSpacing:"0.1em"},children:"vector · 4k · svg"})]})]})};export{De as default};
