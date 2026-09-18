import{S as H,r as h,j as e,L as E,b as U,m as C,W as Q,at as X}from"../entries/pages.oA0Bx7eH.js";import{e as B}from"./chunk-DLDMTGv0.js";import{S as Z}from"./chunk-BE2Ikc_1.js";import{B as G}from"./chunk-27eCNl3A.js";import{B as K}from"./chunk-zNt3J6vB.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const M=`
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;500;600&family=Saira:wght@400;500;600&display=swap');

.lga {
  --table:    #2b3138;
  --table-2:  #1e2328;
  --vellum:   #e7e5d8;
  --graphite: #2c3138;
  --graphite-2: #767d84;
  --graphite-3: #a7adb3;
  --live:     #c2482c;
  --annot:    #34557a;

  font-family: 'Saira', system-ui, sans-serif;
  color: var(--vellum);
  min-height: 100vh; width: 100%;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
  background: var(--table-2);
}

.lga__bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
  padding: 16px 24px;
  background: var(--table);
  border-bottom: 1px solid #101418;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
  z-index: 20;
}
.lga__id { display: flex; align-items: center; gap: 16px; }
.lga__back { color: var(--graphite-3); display: inline-flex; transition: color .15s; }
.lga__back:hover { color: var(--vellum); }
.lga__back:focus-visible { outline: 2px solid var(--live); outline-offset: 3px; }
.lga__back svg { width: 18px; height: 18px; }
.lga__title {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 22px; font-weight: 600; line-height: 1; margin: 0;
}
.lga__desc { font-size: 12.5px; color: var(--graphite-3); margin: 2px 0 0; }

.lga__tools { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.lga__tool {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #39414a; color: var(--vellum);
  border: 0; border-radius: 3px; padding: 7px 12px; cursor: pointer;
  transition: background-color .14s, color .14s;
}
.lga__tool:hover { background: var(--vellum); color: var(--table); }
.lga__tool:focus-visible { outline: 2px solid var(--live); outline-offset: 2px; }
.lga__tool--danger { background: transparent; color: #d98c7a; box-shadow: inset 0 0 0 1px #7a4134; margin-left: 8px; }
.lga__tool--danger:hover { background: var(--live); color: #fff; box-shadow: none; }

/* skin switch, shown in both skins */
.lga__skin {
  display: inline-flex; align-items: center; gap: 0;
  border-radius: 3px; overflow: hidden; margin-right: 4px;
  box-shadow: inset 0 0 0 1px #4a525b;
}
.lga__skin button {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 12.5px; font-weight: 500; letter-spacing: 0.04em;
  text-transform: uppercase;
  background: transparent; color: var(--graphite-3);
  border: 0; padding: 7px 11px; cursor: pointer;
  transition: background-color .14s, color .14s;
}
.lga__skin button[aria-pressed='true'] { background: var(--vellum); color: var(--table); }
.lga__skin button:focus-visible { outline: 2px solid var(--live); outline-offset: -2px; }

.lga__sheet {
  flex: 1; position: relative;
  background-color: var(--vellum);
  background-image:
    linear-gradient(rgba(120,140,125,0.20) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,140,125,0.20) 1px, transparent 1px),
    linear-gradient(rgba(120,140,125,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,140,125,0.10) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  overflow: hidden;
}

.lga__wires { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.lga__wire { fill: none; stroke: var(--graphite-2); stroke-width: 1.4; }
.lga__wire--live { stroke: var(--live); stroke-width: 2.2; }
.lga__wire-hit { fill: none; stroke: transparent; stroke-width: 14; pointer-events: auto; cursor: pointer; }
.lga__wire-hit:hover + .lga__wire { stroke: var(--live); stroke-dasharray: 4 3; }

.lga__junction { fill: var(--graphite); }
.lga__junction--live { fill: var(--live); }

.lga__part { position: absolute; width: 140px; height: 100px; z-index: 10; cursor: grab; }
.lga__part:active { cursor: grabbing; }
.lga__sym { width: 100%; height: 100%; overflow: visible; }
.lga__sym-body {
  fill: rgba(255,255,255,0.55);
  stroke: var(--graphite); stroke-width: 2.2; stroke-linejoin: round;
}
.lga__sym-body--live { stroke: var(--live); fill: rgba(194,72,44,0.10); }
.lga__sym-lead { stroke: var(--graphite); stroke-width: 1.6; fill: none; }
.lga__sym-lead--live { stroke: var(--live); stroke-width: 2.2; }
.lga__sym-txt {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 15px; font-weight: 600; letter-spacing: 0.06em;
  fill: var(--graphite); text-anchor: middle;
}
.lga__sym-ref {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em;
  fill: var(--annot); text-anchor: middle;
}

.lga__kill {
  position: absolute; top: -2px; right: -2px;
  width: 20px; height: 20px; border-radius: 3px;
  background: transparent; border: 0; cursor: pointer;
  color: var(--graphite-2); opacity: 0;
  display: grid; place-items: center;
  transition: opacity .14s, color .14s;
}
.lga__part:hover .lga__kill, .lga__kill:focus-visible { opacity: 1; }
.lga__kill:hover { color: var(--live); }
.lga__kill svg { width: 13px; height: 13px; }

.lga__pin {
  position: absolute; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid var(--graphite); background: var(--vellum);
  padding: 0; cursor: pointer;
  transition: transform .12s, border-color .12s, background-color .12s;
}
.lga__pin:hover { transform: scale(1.25); border-color: var(--live); }
.lga__pin:focus-visible { outline: 2px solid var(--live); outline-offset: 2px; }
.lga__pin--live { background: var(--live); border-color: var(--live); }
.lga__pin--armed { border-color: var(--live); background: var(--live); transform: scale(1.3); }

.lga__lever {
  position: absolute; inset: 0; margin: auto;
  width: 54px; height: 30px;
  background: none; border: 0; padding: 0; cursor: pointer;
}
.lga__lever:focus-visible { outline: 2px solid var(--live); outline-offset: 3px; }

.lga__prompt {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  z-index: 40;
  background: var(--graphite); color: var(--vellum);
  font-size: 13px; padding: 7px 16px; border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.lga__foot {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; flex-wrap: wrap;
  padding: 10px 24px; background: var(--table);
  font-family: 'Saira Condensed', sans-serif;
  font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--graphite-3);
}
.lga__foot b { color: var(--vellum); font-weight: 600; }

.lga__scrim {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(16,20,24,0.66);
  display: grid; place-items: center; padding: 20px;
}
.lga__modal {
  background: var(--vellum); color: var(--graphite);
  max-width: 400px; width: 100%; padding: 24px;
  border-radius: 3px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.lga__modal h2 { font-family: 'Saira Condensed', sans-serif; font-size: 21px; font-weight: 600; margin: 0 0 8px; }
.lga__modal p { font-size: 14.5px; line-height: 1.55; color: #4e555c; margin: 0 0 20px; }
.lga__modal-row { display: flex; gap: 10px; justify-content: flex-end; }
.lga__modal-btn {
  font-family: 'Saira', sans-serif; font-size: 14px; font-weight: 500;
  border: 0; border-radius: 3px; padding: 9px 18px; cursor: pointer;
}
.lga__modal-btn--go { background: var(--live); color: #fff; }
.lga__modal-btn--no { background: transparent; color: #4e555c; box-shadow: inset 0 0 0 1px #b4b0a1; }
.lga__modal-btn:focus-visible { outline: 2px solid var(--annot); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lga__pin, .lga__part { transition: none; }
}
`,y={and:{label:"AND",inputs:2,color:"#10b981"},or:{label:"OR",inputs:2,color:"#10b981"},xor:{label:"XOR",inputs:2,color:"#10b981"},not:{label:"NOT",inputs:1,color:"#10b981"},input:{label:"SOURCE",inputs:0,color:"#60a5fa"},output:{label:"PROBE",inputs:1,color:"#f87171"}},P=["input","and","or","not","xor","output"],W=(l,p)=>y[l].inputs===1?50:p===0?32:68,Y=({type:l,live:p})=>{const i=`lga__sym-body${p?" lga__sym-body--live":""}`,c=`lga__sym-lead${p?" lga__sym-lead--live":""}`;if(l==="input")return e.jsxs("svg",{className:"lga__sym",viewBox:"0 0 140 100","aria-hidden":"true",children:[e.jsx("line",{className:c,x1:"96",y1:"50",x2:"140",y2:"50"}),e.jsx("circle",{className:i,cx:"44",cy:"50",r:"5"}),e.jsx("circle",{className:i,cx:"96",cy:"50",r:"5"}),e.jsx("line",{className:c,x1:"44",y1:"50",x2:p?96:88,y2:p?50:28,strokeWidth:"3"}),e.jsx("text",{className:"lga__sym-ref",x:"70",y:"84",children:"SOURCE"})]});if(l==="output")return e.jsxs("svg",{className:"lga__sym",viewBox:"0 0 140 100","aria-hidden":"true",children:[e.jsx("line",{className:c,x1:"0",y1:"50",x2:"42",y2:"50"}),e.jsx("circle",{className:i,cx:"66",cy:"50",r:"24"}),e.jsx("line",{className:i,x1:"49",y1:"33",x2:"83",y2:"67"}),e.jsx("line",{className:i,x1:"83",y1:"33",x2:"49",y2:"67"}),e.jsx("text",{className:"lga__sym-ref",x:"70",y:"92",children:"LAMP"})]});if(l==="not")return e.jsxs("svg",{className:"lga__sym",viewBox:"0 0 140 100","aria-hidden":"true",children:[e.jsx("line",{className:c,x1:"0",y1:"50",x2:"38",y2:"50"}),e.jsx("line",{className:c,x1:"112",y1:"50",x2:"140",y2:"50"}),e.jsx("path",{className:i,d:"M38 24 L38 76 L100 50 Z"}),e.jsx("circle",{className:i,cx:"106",cy:"50",r:"6"}),e.jsx("text",{className:"lga__sym-ref",x:"66",y:"92",children:"NOT"})]});const m=e.jsxs(e.Fragment,{children:[e.jsx("line",{className:c,x1:"0",y1:"32",x2:"40",y2:"32"}),e.jsx("line",{className:c,x1:"0",y1:"68",x2:"40",y2:"68"}),e.jsx("line",{className:c,x1:"104",y1:"50",x2:"140",y2:"50"})]});if(l==="and")return e.jsxs("svg",{className:"lga__sym",viewBox:"0 0 140 100","aria-hidden":"true",children:[m,e.jsx("path",{className:i,d:"M40 20 H68 A30 30 0 0 1 68 80 H40 Z"}),e.jsx("text",{className:"lga__sym-txt",x:"66",y:"56",children:"&"}),e.jsx("text",{className:"lga__sym-ref",x:"70",y:"94",children:"AND"})]});const x=l==="xor";return e.jsxs("svg",{className:"lga__sym",viewBox:"0 0 140 100","aria-hidden":"true",children:[m,e.jsx("path",{className:i,d:"M40 20 Q58 50 40 80 Q78 80 104 50 Q78 20 40 20 Z"}),x&&e.jsx("path",{className:i,style:{fill:"none"},d:"M30 20 Q48 50 30 80"}),e.jsx("text",{className:"lga__sym-txt",x:"66",y:"56",children:"≥1"}),e.jsx("text",{className:"lga__sym-ref",x:"70",y:"94",children:x?"XOR":"OR"})]})},F=({skin:l,setSkin:p,variant:i="draft"})=>{if(i==="classic"){const c=m=>`px-3 py-1 border text-[10px] font-bold uppercase transition-all ${m?"bg-white text-black border-white":"border-white/10 text-gray-500 hover:text-white"}`;return e.jsxs("div",{className:"flex mr-3",role:"group","aria-label":"Choose a look",children:[e.jsx("button",{type:"button",className:c(l==="draft"),"aria-pressed":l==="draft",onClick:()=>p("draft"),children:"Sheet"}),e.jsx("button",{type:"button",className:c(l==="classic"),"aria-pressed":l==="classic",onClick:()=>p("classic"),children:"Terminal"})]})}return e.jsxs("div",{className:"lga__skin",role:"group","aria-label":"Choose a look",children:[e.jsx("button",{type:"button","aria-pressed":l==="draft",onClick:()=>p("draft"),children:"Drafting sheet"}),e.jsx("button",{type:"button","aria-pressed":l==="classic",onClick:()=>p("classic"),children:"Terminal"})]})},ie=()=>{const{addToast:l}=H(),[p,i]=h.useState(!1),[c,m]=h.useState("draft"),[x,_]=h.useState([{id:"node-1",type:"input",x:100,y:150,state:!1},{id:"node-2",type:"and",x:350,y:200,state:!1},{id:"node-3",type:"output",x:600,y:200,state:!1}]),[f,j]=h.useState([{from:"node-1",to:"node-2",inputIdx:0}]),[d,w]=h.useState(null),S=h.useRef(null),$=h.useCallback(()=>{_(t=>{const a=[...t];let s=!1;return a.forEach(r=>{if(r.type==="input")return;const o=[];f.filter(g=>g.to===r.id).forEach(g=>{const b=a.find(u=>u.id===g.from);o[g.inputIdx]=b?b.state:!1});let n=!1;r.type==="output"?n=o[0]||!1:r.type==="and"?n=o[0]===!0&&o[1]===!0:r.type==="or"?n=o[0]===!0||o[1]===!0:r.type==="xor"?n=o[0]!==o[1]&&(o[0]!==void 0||o[1]!==void 0):r.type==="not"&&(n=!o[0]),n!==r.state&&(r.state=n,s=!0)}),s?[...a]:t})},[f]);h.useEffect(()=>{const t=setInterval($,50);return()=>clearInterval(t)},[$]);const z=t=>{const a=`node-${Date.now()}`;_(s=>[...s,{id:a,type:t,x:100,y:100,state:!1}]),l({title:`${y[t].label} added`,message:"Drag it into place, then wire it up."})},I=t=>{_(a=>a.filter(s=>s.id!==t)),j(a=>a.filter(s=>s.from!==t&&s.to!==t))},v=(t,a,s)=>{if(d){if(d.nodeId===t){w(null);return}if(a==="in"){const r={from:d.nodeId,to:t,inputIdx:s};j(o=>[...o.filter(n=>!(n.to===t&&n.inputIdx===s)),r]),l({title:"Wired up",message:"Signal will follow.",type:"success"})}w(null)}else{if(a==="in")return;w({nodeId:t,type:a,idx:s})}},L=t=>{_(a=>a.map(s=>s.id===t?{...s,state:!s.state}:s))},k=(t,a)=>{j(s=>s.filter(r=>!(r.to===t&&r.inputIdx===a))),l({title:"Wire removed",message:"That input is free again.",type:"info"})},T=(t,a)=>{_(s=>s.map(r=>r.id===t?{...r,x:r.x+a.delta.x,y:r.y+a.delta.y}:r))},A=()=>{_([]),j([]),i(!1),l({title:"Sheet cleared",message:"Start a fresh drawing.",type:"info"})},D=f.filter(t=>x.find(a=>a.id===t.from)?.state).length,O=e.jsx(Z,{title:"Logic Architect | Fezcodex",description:"Wire up logic gates and watch the signal propagate.",keywords:["logic gates","circuit simulator","digital logic","schematic","engineering"]});return c==="classic"?e.jsxs("div",{className:"min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30 overflow-hidden flex flex-col",children:[e.jsx("style",{children:M}),O,e.jsxs("div",{className:"p-6 md:p-12 border-b border-white/10 flex justify-between items-center gap-6 flex-wrap bg-black/50 backdrop-blur-md z-50",children:[e.jsxs("div",{className:"flex items-center gap-8",children:[e.jsx(E,{to:"/apps",className:"text-gray-500 hover:text-white transition-colors",children:e.jsx(U,{size:24,weight:"bold"})}),e.jsxs("div",{children:[e.jsx(K,{title:"Logic Architect",slug:"la",variant:"brutalist"}),e.jsx("p",{className:"text-[10px] text-gray-600 uppercase tracking-widest mt-1",children:"Experimental_Circuit_Lab"})]})]}),e.jsxs("div",{className:"flex gap-2 items-center flex-wrap justify-end",children:[e.jsx(F,{skin:c,setSkin:m,variant:"classic"}),P.map(t=>e.jsxs("button",{onClick:()=>z(t),className:"px-3 py-1 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all",children:["+",t]},t)),e.jsx("button",{onClick:()=>i(!0),className:"px-3 py-1 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black text-[10px] font-bold uppercase transition-all ml-4",children:"Flush_All"})]})]}),e.jsx(G,{isOpen:p,onClose:()=>i(!1),onConfirm:A,title:"FLUSH_WORKSPACE",message:"This will permanently delete all logic gates and connections. proceed with protocol?",confirmText:"CONFIRM_PURGE",cancelText:"ABORT_FLUSH"}),e.jsxs("div",{className:"flex-grow relative bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]",ref:S,children:[e.jsx("svg",{className:"absolute inset-0 w-full h-full pointer-events-none z-0",children:f.map(t=>{const a=x.find(u=>u.id===t.from),s=x.find(u=>u.id===t.to);if(!a||!s)return null;const r=a.x+140,o=a.y+50,n=s.x,g=s.y+(t.inputIdx===0?32:68),b=`M ${r} ${o} C ${r+50} ${o}, ${n-50} ${g}, ${n} ${g}`;return e.jsxs("g",{className:"cursor-pointer pointer-events-auto",children:[e.jsx("path",{d:b,stroke:"transparent",strokeWidth:"15",fill:"none",onClick:()=>k(t.to,t.inputIdx)}),e.jsx(C.path,{d:b,stroke:a.state?"#10b981":"#ffffff15",strokeWidth:"3",fill:"none",initial:{pathLength:0},animate:{pathLength:1},className:"hover:stroke-red-500 transition-colors",onClick:()=>k(t.to,t.inputIdx)})]},`${t.from}-${t.to}-${t.inputIdx}`)})}),x.map(t=>e.jsxs(C.div,{onPan:(a,s)=>T(t.id,s),style:{left:t.x,top:t.y},className:`absolute w-[140px] h-[100px] border-2 bg-black/90 p-3 z-10 group cursor-grab active:cursor-grabbing transition-shadow
                ${t.state?"border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]":"border-white/10"}`,children:[e.jsxs("div",{className:"flex justify-between items-start mb-4",children:[e.jsx("span",{className:`text-[9px] font-black uppercase tracking-widest ${t.state?"text-emerald-500":"text-gray-600"}`,children:t.type}),e.jsx("button",{onClick:()=>I(t.id),className:"opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-500 transition-all",children:e.jsx(Q,{size:12})})]}),e.jsx("div",{className:"flex flex-col items-center gap-2 py-2",children:t.type==="input"?e.jsx("button",{onClick:()=>L(t.id),className:`w-10 h-10 border-2 flex items-center justify-center transition-all ${t.state?"bg-emerald-500 border-emerald-400 text-black":"border-white/10 text-gray-700"}`,children:t.state?e.jsx(B,{weight:"bold"}):e.jsx(B,{})}):t.type==="output"?e.jsx("div",{className:`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all ${t.state?"bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]":"border-white/10"}`,children:e.jsx(X,{weight:t.state?"fill":"regular",className:t.state?"text-white":"text-gray-800"})}):e.jsx("div",{className:"text-2xl font-black text-white/20 select-none",children:y[t.type].label})}),t.type!=="input"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>v(t.id,"in",0),className:`absolute -left-2 top-6 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${d?.nodeId===t.id&&d.type==="in"?"border-emerald-500":"border-white/20"}`}),y[t.type].inputs>1&&e.jsx("button",{onClick:()=>v(t.id,"in",1),className:`absolute -left-2 bottom-6 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${d?.nodeId===t.id&&d.type==="in"?"border-emerald-500":"border-white/20"}`})]}),t.type!=="output"&&e.jsx("button",{onClick:()=>v(t.id,"out",0),className:`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${d?.nodeId===t.id&&d.type==="out"?"border-emerald-500":"border-white/20"} ${t.state?"border-emerald-500 bg-emerald-500":""}`})]},t.id)),d&&e.jsx("div",{className:"fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full z-[100] animate-pulse",children:"Select target input port to connect..."})]}),e.jsxs("footer",{className:"p-4 bg-black/80 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase tracking-widest",children:[e.jsxs("div",{className:"flex gap-6",children:[e.jsxs("span",{children:["Nodes: ",x.length]}),e.jsxs("span",{children:["Links: ",f.length]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-2 h-2 rounded-full bg-emerald-500 animate-pulse"}),e.jsx("span",{children:"Real-time Simulation Active"})]})]})]}):e.jsxs("div",{className:"lga",children:[e.jsx("style",{children:M}),O,e.jsxs("div",{className:"lga__bar",children:[e.jsxs("div",{className:"lga__id",children:[e.jsx(E,{to:"/apps",className:"lga__back","aria-label":"Back to apps",children:e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsxs("div",{children:[e.jsx("h1",{className:"lga__title",children:"Logic Architect"}),e.jsx("p",{className:"lga__desc",children:"Throw a source, wire the pins, watch the signal go through."})]})]}),e.jsxs("div",{className:"lga__tools",children:[e.jsx(F,{skin:c,setSkin:m}),P.map(t=>e.jsx("button",{className:"lga__tool",onClick:()=>z(t),children:y[t].label},t)),e.jsx("button",{className:"lga__tool lga__tool--danger",onClick:()=>i(!0),children:"Clear sheet"})]})]}),e.jsxs("div",{className:"lga__sheet",ref:S,children:[e.jsx("svg",{className:"lga__wires",children:f.map(t=>{const a=x.find(N=>N.id===t.from),s=x.find(N=>N.id===t.to);if(!a||!s)return null;const r=a.x+140,o=a.y+50,n=s.x,g=s.y+W(s.type,t.inputIdx),b=n-24>r+24?(r+n)/2:r+24,u=`M ${r} ${o} H ${b} V ${g} H ${n}`,R=a.state;return e.jsxs("g",{children:[e.jsx("path",{className:"lga__wire-hit",d:u,onClick:()=>k(t.to,t.inputIdx)}),e.jsx("path",{className:`lga__wire${R?" lga__wire--live":""}`,d:u}),e.jsx("circle",{className:`lga__junction${R?" lga__junction--live":""}`,cx:n,cy:g,r:"3"})]},`${t.from}-${t.to}-${t.inputIdx}`)})}),x.map(t=>{const a=y[t.type];return e.jsxs(C.div,{onPan:(s,r)=>T(t.id,r),style:{left:t.x,top:t.y},className:"lga__part",children:[e.jsx(Y,{type:t.type,live:t.state}),e.jsx("button",{className:"lga__kill",onClick:()=>I(t.id),"aria-label":`Remove this ${a.label} part`,children:e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M4 4 L12 12 M12 4 L4 12",strokeLinecap:"round"})})}),t.type==="input"&&e.jsx("button",{className:"lga__lever",onClick:()=>L(t.id),"aria-pressed":t.state,"aria-label":t.state?"Switch source off":"Switch source on"}),t.type!=="input"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:`lga__pin${d?.nodeId===t.id&&d.type==="in"?" lga__pin--armed":""}`,style:{left:-7,top:W(t.type,0)-7},onClick:()=>v(t.id,"in",0),"aria-label":a.inputs>1?"First input pin":"Input pin"}),a.inputs>1&&e.jsx("button",{className:"lga__pin",style:{left:-7,top:61},onClick:()=>v(t.id,"in",1),"aria-label":"Second input pin"})]}),t.type!=="output"&&e.jsx("button",{className:`lga__pin${t.state?" lga__pin--live":""}${d?.nodeId===t.id&&d.type==="out"?" lga__pin--armed":""}`,style:{right:-7,top:43},onClick:()=>v(t.id,"out",0),"aria-label":"Output pin"})]},t.id)}),d&&e.jsx("div",{className:"lga__prompt",role:"status",children:"Now click an input pin to land the wire."})]}),e.jsxs("div",{className:"lga__foot",children:[e.jsxs("span",{children:[e.jsx("b",{children:x.length})," parts · ",e.jsx("b",{children:f.length})," wires ·"," ",e.jsx("b",{children:D})," carrying signal"]}),e.jsx("span",{children:"Sheet 1 of 1"})]}),p&&e.jsx("div",{className:"lga__scrim",onClick:t=>t.target===t.currentTarget&&i(!1),children:e.jsxs("div",{className:"lga__modal",role:"dialog","aria-modal":"true",children:[e.jsx("h2",{children:"Clear the sheet?"}),e.jsx("p",{children:"Every part and wire on this drawing goes. There is no way back to what is here now."}),e.jsxs("div",{className:"lga__modal-row",children:[e.jsx("button",{className:"lga__modal-btn lga__modal-btn--no",onClick:()=>i(!1),children:"Keep it"}),e.jsx("button",{className:"lga__modal-btn lga__modal-btn--go",onClick:A,children:"Clear it"})]})]})})]})};export{ie as default};
