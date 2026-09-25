import{r as a,j as e,L}from"../entries/pages.BWQb9Xz5.js";import{S as P}from"./chunk-DZBIj8id.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const E=`
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Manrope:wght@500;600;700&display=swap');

.fzt {
  --room:     #191613;
  --machine:  #33302b;
  --machine-2:#232019;
  --machine-3:#454038;
  --platen:   #16130f;
  --paper:    #ece8dc;
  --paper-2:  #dcd7c7;
  --ink:      #23201c;
  --ink-weak: #a29b8c;
  --ink-mid:  #6d6659;
  --red:      #a8332c;
  --quiet:    #8e857a;

  font-family: 'Manrope', system-ui, sans-serif;
  color: var(--paper);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,235,205,0.07), transparent 70%),
    var(--room);
  padding: 40px 20px 80px;
}

.fzt__shell { position: relative; z-index: 1; max-width: 740px; margin: 0 auto; }

.fzt__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: var(--quiet); text-decoration: none;
  transition: color .15s;
}
.fzt__back:hover { color: var(--paper); }
.fzt__back:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }
.fzt__back svg { width: 13px; height: 13px; }

.fzt__head { margin: 26px 0 0; }
.fzt__title {
  font-size: clamp(30px, 5.4vw, 42px); font-weight: 700;
  letter-spacing: -0.02em; line-height: 1; margin: 0;
}
.fzt__sub {
  font-size: 14.5px; line-height: 1.55; color: var(--quiet);
  margin: 10px 0 0; max-width: 46ch;
}

/* — the machine — */
.fzt__machine { margin: 30px 0 0; }

/* platen: the rubber roller the paper wraps around */
.fzt__platen {
  position: relative; height: 26px; border-radius: 13px;
  background: linear-gradient(180deg, #2b2620, var(--platen) 60%, #0d0b08);
  box-shadow: 0 2px 6px rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 10px;
}
.fzt__knob {
  width: 30px; height: 30px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--machine-3), var(--machine-2));
  box-shadow: 0 2px 4px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1);
  margin: 0 -18px;
}

/* the sheet */
.fzt__sheet {
  position: relative;
  background: linear-gradient(180deg, var(--paper), var(--paper-2));
  padding: 44px 44px 40px;
  margin: -2px 14px 0;
  min-height: 250px;
  box-shadow: 0 16px 34px -16px rgba(0,0,0,0.8), inset 0 6px 12px -8px rgba(0,0,0,0.4);
}
@media (max-width: 560px) { .fzt__sheet { padding: 24px 18px; margin: -2px 4px 0; } }

.fzt__line {
  font-family: 'Courier Prime', 'Courier New', monospace;
  font-size: clamp(16px, 2.2vw, 19px);
  line-height: 2.1;
  color: var(--ink-weak);
  /* pre-wrap keeps the spacing of the typed line but still breaks at spaces,
     which per-character spans otherwise prevent */
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin: 0;
  max-width: 52ch;
}
.fzt__ch { position: relative; }
/* a struck character: full ribbon black, sitting a hair off the baseline */
.fzt__ch--hit {
  color: var(--ink);
  opacity: var(--imp, 1);
  top: var(--jit, 0px);
}
.fzt__ch--miss {
  color: var(--red);
  opacity: var(--imp, 1);
  top: var(--jit, 0px);
  background: rgba(168,51,44,0.11);
}
.fzt__ch--at {
  color: var(--ink);
  box-shadow: inset 0 -2px 0 var(--ink);
}

.fzt__field {
  width: 100%; max-width: 52ch; margin: 30px 0 0;
  font-family: 'Courier Prime', monospace; font-size: 16px;
  color: var(--ink); background: transparent;
  border: 0; border-bottom: 1px dashed rgba(35,32,28,0.35);
  padding: 8px 2px; outline: none;
}
.fzt__field::placeholder { color: var(--ink-weak); }
.fzt__field:focus { border-bottom-color: var(--ink); }
.fzt__field:disabled { opacity: 0.5; }

/* — the chassis strip under the sheet carries the readings — */
.fzt__chassis {
  margin: 0 0 0; padding: 16px 22px;
  background: linear-gradient(180deg, var(--machine), var(--machine-2));
  border-radius: 0 0 8px 8px;
  display: flex; align-items: center; gap: 30px; flex-wrap: wrap;
  box-shadow: 0 10px 22px -14px #000;
}
.fzt__gauge { display: flex; align-items: baseline; gap: 7px; }
.fzt__gauge-n {
  font-family: 'Courier Prime', monospace;
  font-size: 26px; font-weight: 700; line-height: 1;
  font-variant-numeric: tabular-nums; color: var(--paper);
}
.fzt__gauge-k { font-size: 12.5px; color: var(--quiet); }
.fzt__gauge--bell .fzt__gauge-n { color: var(--red); }

.fzt__bell {
  margin-left: auto; display: inline-flex; align-items: center; gap: 7px;
  font-size: 13px; color: var(--red);
}
.fzt__bell svg { width: 15px; height: 15px; fill: currentColor; }

.fzt__actions { margin: 22px 0 0; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.fzt__btn {
  font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600;
  background: var(--paper); color: #23201c;
  border: 0; border-radius: 3px; padding: 11px 24px; cursor: pointer;
  transition: background-color .15s;
}
.fzt__btn:hover { background: #fff; }
.fzt__btn:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }
.fzt__note { font-size: 13.5px; color: var(--quiet); }

/* — the finished slip — */
.fzt__result {
  margin: 24px 0 0; padding: 20px 24px;
  background: var(--paper); color: var(--ink);
  border-left: 4px solid var(--red);
  font-family: 'Courier Prime', monospace;
}
.fzt__result-h { font-size: 15px; font-weight: 700; margin: 0 0 8px; }
.fzt__result-l { font-size: 14px; line-height: 1.7; margin: 0; }

@media (prefers-reduced-motion: reduce) {
  .fzt__ch { transition: none; }
}
`,M=["The quick brown fox jumps over the lazy dog.","Never underestimate the power of a good book.","Coding is like poetry; it should be beautiful and efficient.","The early bird catches the worm, but the second mouse gets the cheese.","Innovation distinguishes between a leader and a follower.","Success is not final, failure is not fatal: it is the courage to continue that counts."],F=r=>.82+r*41%19/100,R=r=>`${(r*29%3-1)*.5}px`;function K(){const[r,x]=a.useState(""),[c,u]=a.useState(""),[o,_]=a.useState(60),[m,g]=a.useState(!1),[p,z]=a.useState(!1),[l,b]=a.useState(!1),[v,w]=a.useState(0),[k,y]=a.useState(0),[d,j]=a.useState(0),[f,T]=a.useState(0),N=a.useRef(null),h=a.useCallback(s=>{let t;do t=M[Math.floor(Math.random()*M.length)];while(t===s);return t},[]);a.useEffect(()=>{x(h(""))},[h]);const C=a.useCallback(()=>{const s=(60-o)/60,t=s===0?0:d/5/s,n=f===0?0:d/f*100;w(Math.round(t)),y(n.toFixed(2))},[d,f,o]);a.useEffect(()=>{let s=null;return m&&o>0?s=setInterval(()=>{_(t=>t-1)},1e3):o===0&&m&&(g(!1),b(!0),C()),()=>clearInterval(s)},[m,o,C]);const q=s=>{if(l)return;p||(z(!0),g(!0));const t=s.target.value;if(u(t),t.length===r.length){let n=0;for(let i=0;i<r.length;i++)t[i]===r[i]&&n++;j(i=>i+n),T(i=>i+r.length),x(i=>h(i)),u("")}},A=()=>{b(!1),z(!1),g(!1),_(60),w(0),y(0),j(0),T(0),x(h("")),u(""),setTimeout(()=>N.current?.focus(),10)},S=p&&!l&&o<=10;return e.jsxs("div",{className:"fzt",children:[e.jsx("style",{children:E}),e.jsx(P,{title:"FezType | Fezcodex",description:"A one-minute typing test. Type what is on the page and see how far you get.",keywords:["Fezcodex","typing test","wpm","typing speed","keyboard","games"]}),e.jsxs("div",{className:"fzt__shell",children:[e.jsxs(L,{to:"/apps",className:"fzt__back",children:[e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to apps"]}),e.jsxs("div",{className:"fzt__head",children:[e.jsx("h1",{className:"fzt__title",children:"FezType"}),e.jsx("p",{className:"fzt__sub",children:"One minute. Type the line on the sheet; a new one is rolled in each time you finish. The clock starts on your first keystroke."})]}),e.jsxs("div",{className:"fzt__machine",children:[e.jsxs("div",{className:"fzt__platen","aria-hidden":"true",children:[e.jsx("span",{className:"fzt__knob"}),e.jsx("span",{className:"fzt__knob"})]}),e.jsxs("div",{className:"fzt__sheet",children:[e.jsx("p",{className:"fzt__line",children:r.split("").map((s,t)=>{let n="";return t<c.length?n=s===c[t]?" fzt__ch--hit":" fzt__ch--miss":t===c.length&&!l&&(n=" fzt__ch--at"),e.jsx("span",{className:`fzt__ch${n}`,style:{"--imp":F(t),"--jit":R(t)},children:s},t)})}),e.jsx("input",{ref:N,className:"fzt__field",type:"text",value:c,onChange:q,disabled:l,placeholder:p?"":"Start typing the line above to begin…",autoComplete:"off",autoCorrect:"off",spellCheck:"false","aria-label":"Type the line shown above"})]}),e.jsxs("div",{className:"fzt__chassis",children:[e.jsxs("div",{className:`fzt__gauge${S?" fzt__gauge--bell":""}`,children:[e.jsx("span",{className:"fzt__gauge-n",children:o}),e.jsx("span",{className:"fzt__gauge-k",children:"seconds left"})]}),e.jsxs("div",{className:"fzt__gauge",children:[e.jsx("span",{className:"fzt__gauge-n",children:v}),e.jsx("span",{className:"fzt__gauge-k",children:"words a minute"})]}),e.jsxs("div",{className:"fzt__gauge",children:[e.jsx("span",{className:"fzt__gauge-n",children:k}),e.jsx("span",{className:"fzt__gauge-k",children:"% accurate"})]}),S&&e.jsxs("span",{className:"fzt__bell",children:[e.jsx("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e.jsx("path",{d:"M8 1a1 1 0 0 1 1 1v.3a4.5 4.5 0 0 1 3.5 4.4v2.6l1.2 2H2.3l1.2-2V6.7A4.5 4.5 0 0 1 7 2.3V2a1 1 0 0 1 1-1zM6.2 12.3h3.6a1.8 1.8 0 0 1-3.6 0z"})}),"bell"]})]})]}),l&&e.jsxs("div",{className:"fzt__result",role:"status",children:[e.jsx("p",{className:"fzt__result-h",children:"Time."}),e.jsxs("p",{className:"fzt__result-l",children:[v," words a minute at ",k,"% accuracy — ",d," ","characters landed out of ",f,"."]})]}),e.jsxs("div",{className:"fzt__actions",children:[e.jsx("button",{className:"fzt__btn",onClick:A,children:l?"Roll in a fresh sheet":"Start over"}),!p&&!l&&e.jsx("span",{className:"fzt__note",children:"The clock has not started yet."})]})]})]})}export{K as default};
