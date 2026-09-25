import{r,S as g,j as s,L as k}from"../entries/pages.BWQb9Xz5.js";import{S as b}from"./chunk-DZBIj8id.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const w=`
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');

.rps {
  --news:     #ddd8c9;
  --news-lo:  #cbc5b1;
  --news-hi:  #e6e2d6;
  --ink:      #17150f;
  --ink-soft: #57513f;
  --verm:     #c8342a;

  font-family: 'Oswald', system-ui, sans-serif;
  color: var(--ink);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background: var(--news);
  padding: 40px 20px 80px;
}
/* newsprint fibre */
.rps::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle at 30% 40%, rgba(23,21,15,0.5) 0.5px, transparent 0.6px),
    radial-gradient(circle at 70% 80%, rgba(200,52,42,0.35) 0.5px, transparent 0.6px);
  background-size: 4px 4px, 7px 7px;
  opacity: 0.22; mix-blend-mode: multiply;
}

.rps__shell { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }

.rps__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 14px; font-weight: 400; color: var(--ink-soft);
  text-decoration: none; transition: color .15s;
}
.rps__back:hover { color: var(--ink); }
.rps__back:focus-visible { outline: 2px solid var(--verm); outline-offset: 3px; }
.rps__back svg { width: 13px; height: 13px; }

/* — masthead, set like a handbill — */
.rps__head { margin: 26px 0 0; border-bottom: 3px solid var(--ink); padding-bottom: 14px; }
.rps__title {
  font-weight: 600; font-size: clamp(38px, 8.4vw, 72px);
  line-height: 0.88; letter-spacing: -0.005em; margin: 0;
  text-transform: uppercase;
}
.rps__sub {
  font-family: 'Lora', Georgia, serif;
  font-size: 15px; line-height: 1.55; color: var(--ink-soft);
  margin: 12px 0 0; max-width: 44ch;
}

/* — the three carved blocks — */
.rps__blocks {
  margin: 34px 0 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.rps__block {
  position: relative;
  background: var(--news-hi);
  border: 2px solid var(--ink);
  padding: 20px 10px 12px;
  cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  transition: background-color .12s, transform .08s;
}
.rps__block:hover { background: var(--news-lo); }
.rps__block:active { transform: translateY(2px); }
.rps__block:focus-visible { outline: 3px solid var(--verm); outline-offset: 2px; }
.rps__block[aria-pressed="true"] { background: var(--ink); }
.rps__block[aria-pressed="true"] .rps__hand { fill: var(--news-hi); }
.rps__block[aria-pressed="true"] .rps__carve { stroke: var(--ink); }
.rps__block[aria-pressed="true"] .rps__name { color: var(--news-hi); }

.rps__hand-box { width: 100%; max-width: 92px; }
.rps__hand { fill: var(--ink); }
.rps__carve { stroke: var(--news-hi); stroke-width: 3.4; fill: none; stroke-linecap: round; }
.rps__name {
  font-size: 15px; font-weight: 500; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--ink);
}

/* — the throw, and the overprinted verdict — */
.rps__result { margin: 34px 0 0; border-top: 3px solid var(--ink); padding-top: 22px; }
.rps__throws {
  font-family: 'Lora', Georgia, serif; font-size: 16px; color: var(--ink-soft);
  line-height: 1.5;
}
.rps__throws b { font-family: 'Oswald', sans-serif; font-weight: 500; color: var(--ink); text-transform: uppercase; letter-spacing: 0.04em; }

.rps__verdict {
  position: relative;
  font-size: clamp(42px, 10vw, 84px); font-weight: 600; line-height: 0.9;
  text-transform: uppercase; margin: 12px 0 0; color: var(--ink);
}
/* the second pull of the press, 3px out of register */
.rps__verdict::before {
  content: attr(data-word);
  position: absolute; left: 3px; top: 3px;
  color: var(--verm); mix-blend-mode: multiply; z-index: -1;
}

.rps__empty {
  font-family: 'Lora', Georgia, serif; font-style: italic;
  font-size: 16px; color: var(--ink-soft); margin: 4px 0 0;
}

/* — scoreboard, kept as a printed rule — */
.rps__foot {
  margin: 30px 0 0; padding-top: 16px;
  border-top: 1px solid rgba(23,21,15,0.3);
  display: flex; justify-content: space-between; align-items: baseline;
  flex-wrap: wrap; gap: 16px;
}
.rps__score { font-size: 17px; letter-spacing: 0.02em; }
.rps__score b { font-weight: 600; font-variant-numeric: tabular-nums; }
.rps__score em { font-style: normal; color: var(--verm); }
.rps__again {
  font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
  background: var(--ink); color: var(--news-hi);
  border: 0; padding: 10px 20px; cursor: pointer;
  transition: background-color .15s;
}
.rps__again:hover { background: var(--verm); }
.rps__again:focus-visible { outline: 3px solid var(--verm); outline-offset: 2px; }

@media (max-width: 560px) {
  .rps__blocks { gap: 8px; }
  .rps__block { padding: 14px 6px 10px; }
  .rps__name { font-size: 12px; }
}
`,j={Rock:s.jsxs("svg",{viewBox:"0 0 100 110",className:"rps__hand-box","aria-hidden":"true",children:[s.jsx("path",{className:"rps__hand",d:"M24 82C18 74 18 59 24 49c6-10 20-16 32-16 14 0 24 8 26 20 2 12-2 24-12 30-8 6-36 7-46-1z"}),s.jsx("path",{className:"rps__carve",d:"M34 43v15"}),s.jsx("path",{className:"rps__carve",d:"M46 40v18"}),s.jsx("path",{className:"rps__carve",d:"M58 41v17"}),s.jsx("path",{className:"rps__carve",d:"M70 45v13"}),s.jsx("path",{className:"rps__carve",d:"M29 71 46 66"})]}),Paper:s.jsxs("svg",{viewBox:"0 0 100 110",className:"rps__hand-box","aria-hidden":"true",children:[s.jsx("path",{className:"rps__hand",d:"M28 96c-6-10-8-22-8-33V30c0-5 4-9 8-9s8 4 8 9v22V26c0-5 4-9 8-9s8 4 8 9v26V22c0-5 4-9 8-9s8 4 8 9v30V32c0-5 4-9 8-9s8 4 8 9v34c0 14-5 24-13 30z"}),s.jsx("path",{className:"rps__carve",d:"M44 40v26"}),s.jsx("path",{className:"rps__carve",d:"M60 36v30"})]}),Scissors:s.jsxs("svg",{viewBox:"0 0 100 110",className:"rps__hand-box","aria-hidden":"true",children:[s.jsx("path",{className:"rps__hand",d:"M30 98c-8-9-11-22-10-35l2-18c1-5 5-8 9-7s7 5 6 10l-3 17 9-48c1-5 5-8 9-7s7 5 6 10l-6 40 14-36c2-5 6-7 10-5s6 6 4 11L66 62c6-6 14-4 16 3 2 6-1 12-6 18l-12 15z"}),s.jsx("path",{className:"rps__carve",d:"M46 44 41 76"}),s.jsx("path",{className:"rps__carve",d:"M62 46 56 72"})]})},p=[{name:"Rock"},{name:"Paper"},{name:"Scissors"}],P=()=>{const[a,l]=r.useState(null),[c,d]=r.useState(null),[m,o]=r.useState(""),[_,h]=r.useState(0),[v,f]=r.useState(0),{addToast:i}=g(),x=r.useCallback((e,t)=>{e.name===t.name?o("A tie"):e.name==="Rock"&&t.name==="Scissors"||e.name==="Paper"&&t.name==="Rock"||e.name==="Scissors"&&t.name==="Paper"?(o("You win"),h(n=>n+1),i({title:"You win",message:`${e.name} beats ${t.name}.`,type:"success"})):(o("You lose"),f(n=>n+1),i({title:"You lose",message:`${t.name} beats ${e.name}.`,type:"error"}))},[i]);r.useEffect(()=>{if(a!==null){const e=p[Math.floor(Math.random()*p.length)];d(e),x(a,e)}},[a,x]);const u=()=>{l(null),d(null),o("")};return s.jsxs("div",{className:"rps",children:[s.jsx("style",{children:w}),s.jsx(b,{title:"Rock Paper Scissors | Fezcodex",description:"Throw against the machine. It picks at random, so the only edge is luck.",keywords:["Fezcodex","rock paper scissors","game","fun app"]}),s.jsxs("div",{className:"rps__shell",children:[s.jsxs(k,{to:"/apps",className:"rps__back",children:[s.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to apps"]}),s.jsxs("div",{className:"rps__head",children:[s.jsx("h1",{className:"rps__title",children:"Rock paper scissors"}),s.jsx("p",{className:"rps__sub",children:"The machine picks at random, so there is no pattern to read and no way to get good at this. Throw anyway."})]}),s.jsx("div",{className:"rps__blocks",children:p.map(e=>s.jsxs("button",{className:"rps__block","aria-pressed":a?.name===e.name,onClick:()=>l(e),children:[j[e.name],s.jsx("span",{className:"rps__name",children:e.name})]},e.name))}),s.jsx("div",{className:"rps__result",children:a&&c?s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"rps__throws",children:["You threw ",s.jsx("b",{children:a.name}),", it threw"," ",s.jsx("b",{children:c.name})]}),s.jsx("p",{className:"rps__verdict","data-word":m,role:"status",children:m})]}):s.jsx("p",{className:"rps__empty",children:"Pick a block to throw."})}),s.jsxs("div",{className:"rps__foot",children:[s.jsxs("div",{className:"rps__score",children:["You ",s.jsx("b",{children:_})," ",s.jsx("em",{children:"—"})," Machine ",s.jsx("b",{children:v})]}),s.jsx("button",{className:"rps__again",onClick:u,children:"Clear the throw"})]})]})]})};export{P as default};
