import{r as d,j as t,L as B}from"../entries/pages.BWQb9Xz5.js";import{S as A}from"./chunk-DZBIj8id.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const X=`
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Archivo:wght@400;500;600&display=swap');

.ttt {
  --desk:       #24211c;
  --desk-2:     #191713;
  --paper:      #e8eae2;
  --paper-warm: #eef0e8;
  --paper-edge: #cdd2c3;
  --grid:       #b9c5d6;
  --margin:     #cc6a5d;
  --graphite:   #343a40;
  --graphite-2: #5d656d;
  --graphite-3: #8b939b;
  --biro:       #2f4f9e;

  font-family: 'Archivo', system-ui, sans-serif;
  color: var(--graphite);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  /* the desk the sheet is lying on */
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,240,210,0.07), transparent 70%),
    var(--desk);
  padding: 44px 20px 80px;
}

.ttt__shell {
  position: relative; z-index: 1;
  max-width: 760px;
  margin: 0 auto;
}

/* — the sheet itself — */
.ttt__sheet {
  position: relative;
  background: var(--paper);
  padding: 44px 44px 40px 78px;
  transform: rotate(-0.35deg);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.28) inset,
    0 18px 40px -12px rgba(0,0,0,0.6),
    0 2px 6px rgba(0,0,0,0.35);
}
@media (max-width: 720px) {
  .ttt__sheet { padding: 30px 20px 30px 42px; transform: none; }
}
/* printed grid, clipped to the sheet */
.ttt__sheet::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 23px 23px;
  opacity: 0.5;
}
/* paper tooth */
.ttt__sheet::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 50% 50%, rgba(52,58,64,0.45) 0.5px, transparent 0.6px);
  background-size: 5px 5px;
  opacity: 0.14;
  mix-blend-mode: multiply;
}

/* red margin rule + punched holes down the left edge */
.ttt__margin {
  position: absolute; top: 0; bottom: 0; left: 62px;
  width: 1px; background: var(--margin); opacity: 0.45; z-index: 1;
}
.ttt__holes {
  position: absolute; top: 0; bottom: 0; left: 24px;
  width: 13px; z-index: 2;
  display: flex; flex-direction: column; justify-content: space-evenly;
  padding: 8% 0;
}
.ttt__hole {
  width: 13px; height: 13px; border-radius: 50%;
  background: var(--desk-2);
  box-shadow:
    inset 0 2px 2px rgba(0,0,0,0.75),
    inset 0 -1px 1px rgba(255,255,255,0.12),
    0 1px 0 rgba(255,255,255,0.65);
}
@media (max-width: 720px) {
  .ttt__margin { left: 30px; }
  .ttt__holes { left: 8px; width: 10px; }
  .ttt__hole { width: 10px; height: 10px; }
}

.ttt__inner { position: relative; z-index: 3; }

/* — masthead — */
/* sits on the desk, above the sheet */
.ttt__back {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 0 0 20px;
  font-size: 13px; color: #9a9184; text-decoration: none;
  transition: color .15s;
}
.ttt__back:hover { color: #e8eae2; }
.ttt__back:focus-visible { outline: 2px solid #9a9184; outline-offset: 3px; }
.ttt__back svg { width: 13px; height: 13px; }

.ttt__title {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  font-size: clamp(44px, 8vw, 66px);
  line-height: 0.95;
  color: var(--graphite);
  margin: 0;
  transform: rotate(-1deg);
  transform-origin: left center;
}
.ttt__sub {
  margin: 14px 0 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--graphite-2);
  max-width: 44ch;
}
.ttt__sub b { font-weight: 600; color: var(--graphite); }
.ttt__sub .ttt__biro { color: var(--biro); }

/* — the board — */
.ttt__board-wrap {
  margin: 34px 0 0;
  display: flex; justify-content: center;
}
.ttt__board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: min(330px, 78vw);
  aspect-ratio: 1;
}
.ttt__rule { position: absolute; pointer-events: none; z-index: 2; overflow: visible; }
.ttt__rule path {
  fill: none;
  stroke: var(--graphite);
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0.85;
}

.ttt__cell {
  position: relative;
  border: 0; padding: 0; margin: 0;
  background: transparent;
  cursor: pointer;
  display: grid; place-items: center;
  border-radius: 3px;
  transition: background-color .12s;
}
.ttt__cell:disabled { cursor: default; }
.ttt__cell:not(:disabled):hover { background: rgba(147,167,195,0.16); }
.ttt__cell:focus-visible {
  outline: 2px solid var(--biro);
  outline-offset: -3px;
}
.ttt__cell svg { width: 76%; aspect-ratio: 1; height: auto; overflow: visible; }
.ttt__cell path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ttt__cell--x path { stroke: var(--graphite); stroke-width: 7.5; }
.ttt__cell--o path { stroke: var(--biro); stroke-width: 6.4; }

/* the move is written on, not faded in */
@keyframes ttt-write { to { stroke-dashoffset: 0; } }
.ttt__cell path {
  stroke-dasharray: var(--len, 200);
  stroke-dashoffset: var(--len, 200);
  animation: ttt-write .26s ease-out forwards;
}
.ttt__cell path.ttt__s2 { animation-delay: .14s; }

/* the strike-through that ends the game */
.ttt__strike { position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: visible; }
.ttt__strike path {
  fill: none; stroke: var(--margin); stroke-width: 5; stroke-linecap: round;
  stroke-dasharray: 460; stroke-dashoffset: 460;
  animation: ttt-write .42s .18s ease-out forwards;
  opacity: 0.9;
}

/* — status line + action — */
.ttt__status-row {
  margin: 30px 0 0;
  display: flex; flex-wrap: wrap; align-items: baseline;
  justify-content: space-between; gap: 20px;
}
.ttt__status {
  font-family: 'Caveat', cursive;
  font-size: 27px;
  color: var(--graphite);
  min-height: 32px;
}
.ttt__status--win { color: var(--margin); }
.ttt__status--lose { color: var(--biro); }

.ttt__new {
  font-family: 'Archivo', sans-serif;
  font-size: 14px; font-weight: 500;
  color: var(--graphite);
  background: transparent;
  border: 1.5px solid var(--graphite-3);
  border-radius: 2px;
  padding: 9px 20px;
  cursor: pointer;
  transition: background-color .15s, border-color .15s, color .15s;
}
.ttt__new:hover { background: var(--graphite); border-color: var(--graphite); color: var(--paper-warm); }
.ttt__new:focus-visible { outline: 2px solid var(--biro); outline-offset: 2px; }

/* — tally scores, kept in the bottom margin — */
.ttt__scores {
  margin: 34px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--paper-edge);
  display: flex; flex-wrap: wrap; gap: 44px;
}
.ttt__score-k { font-size: 13px; color: var(--graphite-2); margin-bottom: 7px; }
.ttt__tally { display: flex; align-items: flex-end; gap: 7px; min-height: 30px; }
.ttt__tally svg { height: 26px; overflow: visible; }
.ttt__tally path { fill: none; stroke: var(--graphite); stroke-width: 2.6; stroke-linecap: round; }
.ttt__tally--biro path { stroke: var(--biro); }
.ttt__tally-zero { font-family: 'Caveat', cursive; font-size: 24px; color: var(--graphite-3); }

@media (prefers-reduced-motion: reduce) {
  .ttt__cell path, .ttt__strike path { animation: none; stroke-dashoffset: 0; }
}
`,C=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function T(r){for(const[a,i,o]of C)if(r[a]&&r[a]===r[i]&&r[a]===r[o])return r[a];return null}function O(r){for(const a of C){const[i,o,n]=a;if(r[i]&&r[i]===r[o]&&r[i]===r[n])return a}return null}const N=(r,a)=>((r*37+a*61)%100/100-.5)*2,E=({i:r})=>{const a=N(r,1)*3.5,i=N(r,2)*3.5;return t.jsxs("svg",{viewBox:"0 0 100 100","aria-hidden":"true",children:[t.jsx("path",{d:`M ${18+a} ${18+i} L ${82+i} ${82-a}`,style:{"--len":100}}),t.jsx("path",{className:"ttt__s2",d:`M ${82-i} ${18+a} L ${18-a} ${82+i}`,style:{"--len":100}})]})},I=({i:r})=>{const a=N(r,3)*3;return t.jsx("svg",{viewBox:"0 0 100 100","aria-hidden":"true",children:t.jsx("path",{d:`M 50 ${19+a} A 31 31 0 1 1 ${41-a} 20.5`,style:{"--len":195}})})},j=({n:r,biro:a})=>{if(!r)return t.jsx("span",{className:"ttt__tally-zero",children:"—"});const i=[];for(let o=0;o<r;o+=5)i.push(Math.min(5,r-o));return t.jsx("div",{className:`ttt__tally${a?" ttt__tally--biro":""}`,children:i.map((o,n)=>t.jsxs("svg",{viewBox:"0 0 34 26",width:o===5?34:o*7,children:[Array.from({length:Math.min(o,4)}).map((f,x)=>t.jsx("path",{d:`M ${3+x*7} 3 L ${4+x*7} 23`},x)),o===5&&t.jsx("path",{d:"M 1 20 L 31 5"})]},n))})},G=()=>{const[r,a]=d.useState(Array(9).fill(null)),[i,o]=d.useState(!0),[n,f]=d.useState(null),[x,$]=d.useState({you:0,book:0,draw:0}),g=d.useRef(!1),k=d.useCallback(e=>{if(n||r[e])return;const s=r.slice();s[e]=i?"X":"O",a(s),o(!i)},[r,n,i]),m=d.useCallback((e,s,_)=>{const c=T(e);if(c==="X")return-10+s;if(c==="O")return 10-s;if(e.every(Boolean))return 0;if(_){let l=-1/0;for(let h=0;h<e.length;h++)e[h]===null&&(e[h]="O",l=Math.max(m(e,s+1,!1),l),e[h]=null);return l}let p=1/0;for(let l=0;l<e.length;l++)e[l]===null&&(e[l]="X",p=Math.min(m(e,s+1,!0),p),e[l]=null);return p},[]),z=d.useCallback(e=>{let s=-1/0,_=null;for(let c=0;c<e.length;c++)if(e[c]===null){e[c]="O";const p=m(e,0,!1);e[c]=null,p>s&&(s=p,_=c)}return _},[m]);d.useEffect(()=>{if(!i&&!n){const e=setTimeout(()=>{const s=z(r.slice());s!==null&&k(s)},520);return()=>clearTimeout(e)}},[i,n,r,z,k]),d.useEffect(()=>{if(g.current)return;const e=T(r);e?(g.current=!0,f(e),$(s=>e==="X"?{...s,you:s.you+1}:{...s,book:s.book+1})):r.every(Boolean)&&(g.current=!0,f("Draw"),$(s=>({...s,draw:s.draw+1})))},[r]);const S=()=>{g.current=!1,a(Array(9).fill(null)),o(!0),f(null)},w=n&&n!=="Draw"?O(r):null;let u="Your turn.",y="";n==="X"?(u="You win.",y=" ttt__status--win"):n==="O"?(u="The book wins.",y=" ttt__status--lose"):n==="Draw"?u="Nobody wins. Again?":i||(u="The book is thinking…");const M=w?(()=>{const e=L=>[L%3*33.333+16.6,Math.floor(L/3)*33.333+16.6],[s,_]=e(w[0]),[c,p]=e(w[2]),l=c-s,h=p-_,v=Math.hypot(l,h)||1,b=7;return`M ${s-l/v*b} ${_-h/v*b} L ${c+l/v*b} ${p+h/v*b}`})():null;return t.jsxs("div",{className:"ttt",children:[t.jsx("style",{children:X}),t.jsx(A,{title:"Tic Tac Toe | Fezcodex",description:"Noughts and crosses against an opponent that never makes a mistake. The best you can do is draw.",keywords:["Fezcodex","tic tac toe","noughts and crosses","game"]}),t.jsxs("div",{className:"ttt__shell",children:[t.jsxs(B,{to:"/apps",className:"ttt__back",children:[t.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:t.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to apps"]}),t.jsxs("div",{className:"ttt__sheet",children:[t.jsx("div",{className:"ttt__margin","aria-hidden":"true"}),t.jsxs("div",{className:"ttt__holes","aria-hidden":"true",children:[t.jsx("div",{className:"ttt__hole"}),t.jsx("div",{className:"ttt__hole"}),t.jsx("div",{className:"ttt__hole"})]}),t.jsxs("div",{className:"ttt__inner",children:[t.jsx("h1",{className:"ttt__title",children:"Tic tac toe"}),t.jsxs("p",{className:"ttt__sub",children:["You are ",t.jsx("b",{children:"✕"}),", in pencil. The book is"," ",t.jsx("span",{className:"ttt__biro",children:t.jsx("b",{children:"○"})}),", in biro — and it never makes a mistake. The best you can get is a draw."]}),t.jsx("div",{className:"ttt__board-wrap",children:t.jsxs("div",{className:"ttt__board",children:[t.jsxs("svg",{className:"ttt__rule",style:{inset:0,width:"100%",height:"100%"},viewBox:"0 0 100 100",preserveAspectRatio:"none","aria-hidden":"true",children:[t.jsx("path",{d:"M 33.7 7 L 33.0 93"}),t.jsx("path",{d:"M 66.6 8 L 67.2 94"}),t.jsx("path",{d:"M 7 33.2 L 93 33.8"}),t.jsx("path",{d:"M 8 67.0 L 94 66.5"})]}),r.map((e,s)=>t.jsxs("button",{className:`ttt__cell${e==="X"?" ttt__cell--x":""}${e==="O"?" ttt__cell--o":""}`,onClick:()=>k(s),disabled:!!n||!!e||!i,"aria-label":e?`Square ${s+1}, ${e==="X"?"yours":"the book’s"}`:`Play square ${s+1}`,children:[e==="X"&&t.jsx(E,{i:s}),e==="O"&&t.jsx(I,{i:s})]},s)),M&&t.jsx("svg",{className:"ttt__strike",viewBox:"0 0 100 100",preserveAspectRatio:"none","aria-hidden":"true",children:t.jsx("path",{d:M,vectorEffect:"non-scaling-stroke"})})]})}),t.jsxs("div",{className:"ttt__status-row",children:[t.jsx("p",{className:`ttt__status${y}`,role:"status",children:u}),t.jsx("button",{className:"ttt__new",onClick:S,children:"New game"})]}),t.jsxs("div",{className:"ttt__scores",children:[t.jsxs("div",{children:[t.jsx("div",{className:"ttt__score-k",children:"You"}),t.jsx(j,{n:x.you})]}),t.jsxs("div",{children:[t.jsx("div",{className:"ttt__score-k",children:"The book"}),t.jsx(j,{n:x.book,biro:!0})]}),t.jsxs("div",{children:[t.jsx("div",{className:"ttt__score-k",children:"Draws"}),t.jsx(j,{n:x.draw})]})]})]})]})]})]})};export{G as default};
