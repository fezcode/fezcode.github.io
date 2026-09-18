import{S as N,r,j as e,L as S}from"../entries/pages.oA0Bx7eH.js";import{S as z}from"./chunk-BE2Ikc_1.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const C=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.bnc {
  --board:    #23262a;
  --board-2:  #16181b;
  --board-3:  #2c3036;
  --flap:     #efeadf;
  --flap-2:   #d5cfc0;
  --hinge:    #9d9687;
  --bull:     #b5442f;
  --cow:      #d99a2b;
  --quiet:    #8d9198;
  --quiet-2:  #5f646b;

  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: var(--flap);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.05), transparent 70%),
    var(--board-2);
  padding: 40px 20px 80px;
}

.bnc__shell { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; }

.bnc__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: var(--quiet); text-decoration: none;
  transition: color .15s;
}
.bnc__back:hover { color: var(--flap); }
.bnc__back:focus-visible { outline: 2px solid var(--cow); outline-offset: 3px; }
.bnc__back svg { width: 13px; height: 13px; }

.bnc__head {
  margin: 26px 0 0; display: flex; justify-content: space-between;
  align-items: flex-end; gap: 22px; flex-wrap: wrap;
}
.bnc__title {
  font-size: clamp(30px, 5.6vw, 42px); font-weight: 700;
  letter-spacing: -0.022em; line-height: 1; margin: 0;
}
.bnc__sub {
  font-size: 14.5px; line-height: 1.55; color: var(--quiet);
  margin: 10px 0 0; max-width: 44ch;
}
.bnc__left { font-size: 14px; color: var(--quiet); }
.bnc__left b { color: var(--flap); font-weight: 600; font-variant-numeric: tabular-nums; }

/* — the flap row you type into — */
.bnc__entry {
  margin: 30px 0 0; padding: 20px;
  background: var(--board); border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px -14px #000;
}
.bnc__flaps { display: flex; gap: 10px; justify-content: center; cursor: text; }
.bnc__flap {
  position: relative; width: 58px; height: 78px; border-radius: 4px;
  background: linear-gradient(180deg, var(--flap) 0 50%, var(--flap-2) 50% 100%);
  color: #1d1f22;
  display: grid; place-items: center;
  font-size: 44px; font-weight: 500; line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
/* the hinge line across the middle of every flap */
.bnc__flap::after {
  content: ""; position: absolute; left: 0; right: 0; top: 50%;
  height: 2px; transform: translateY(-1px);
  background: rgba(0,0,0,0.30);
}
.bnc__flap--empty { background: var(--board-3); color: transparent; box-shadow: inset 0 0 0 1px #3a3f46; }
.bnc__flap--empty::after { background: rgba(0,0,0,0.35); }
.bnc__flaps:focus-within .bnc__flap--next { box-shadow: 0 0 0 2px var(--cow); }

.bnc__input {
  position: absolute; opacity: 0; pointer-events: none;
  width: 1px; height: 1px;
}

.bnc__actions { margin: 18px 0 0; display: flex; gap: 10px; justify-content: center; align-items: center; }
.bnc__go {
  font-family: inherit; font-size: 14.5px; font-weight: 600;
  background: var(--flap); color: #1d1f22;
  border: 0; border-radius: 4px; padding: 11px 26px; cursor: pointer;
  transition: background-color .15s, opacity .15s;
}
.bnc__go:hover:not(:disabled) { background: var(--cow); }
.bnc__go:disabled { opacity: 0.35; cursor: default; }
.bnc__go:focus-visible { outline: 2px solid var(--cow); outline-offset: 3px; }
.bnc__ghost {
  font-family: inherit; font-size: 14px; color: var(--quiet);
  background: none; border: 0; cursor: pointer; padding: 11px 10px;
}
.bnc__ghost:hover { color: var(--flap); }
.bnc__ghost:focus-visible { outline: 2px solid var(--cow); outline-offset: 2px; }

/* — the key to the markers — */
.bnc__key {
  margin: 24px 0 0; display: flex; gap: 22px; flex-wrap: wrap;
  font-size: 13px; color: var(--quiet);
}
.bnc__key span { display: inline-flex; align-items: center; gap: 7px; }

.bnc__pip { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
.bnc__pip--bull { background: var(--bull); }
.bnc__pip--cow { background: transparent; box-shadow: inset 0 0 0 2px var(--cow); }
.bnc__pip--none { background: transparent; box-shadow: inset 0 0 0 1px #40454c; }

/* — the log of attempts — */
.bnc__log { margin: 22px 0 0; display: flex; flex-direction: column; gap: 6px; }
.bnc__row {
  display: flex; align-items: center; gap: 16px;
  background: var(--board); border-radius: 5px; padding: 11px 16px;
}
.bnc__row-n { font-size: 12.5px; color: var(--quiet-2); width: 20px; font-variant-numeric: tabular-nums; }
.bnc__row-digits { display: flex; gap: 7px; }
.bnc__row-digit {
  width: 27px; height: 34px; border-radius: 3px;
  background: linear-gradient(180deg, var(--flap) 0 50%, var(--flap-2) 50% 100%);
  color: #1d1f22; display: grid; place-items: center;
  font-size: 18px; font-weight: 500; font-variant-numeric: tabular-nums;
}
.bnc__row-pips { display: flex; gap: 5px; margin-left: auto; }
.bnc__row-say { font-size: 13px; color: var(--quiet); min-width: 74px; text-align: right; }

/* — the verdict — */
.bnc__verdict {
  margin: 24px 0 0; padding: 18px 20px; border-radius: 6px;
  background: var(--board); border-left: 3px solid var(--cow);
  font-size: 15.5px; line-height: 1.5;
}
.bnc__verdict--won { border-left-color: var(--bull); }
.bnc__verdict b { font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.1em; }

.bnc__empty { margin: 22px 0 0; font-size: 14.5px; color: var(--quiet-2); }

@media (max-width: 560px) {
  .bnc__flap { width: 46px; height: 62px; font-size: 34px; }
  .bnc__row-say { display: none; }
}
`,w=10,F=()=>{const{addToast:d}=N(),[c,v]=r.useState(""),[o,f]=r.useState([]),[a,b]=r.useState(""),[p,u]=r.useState(!1),[g,h]=r.useState(!1),x=r.useRef(null),_=r.useCallback(()=>{const s="0123456789".split("");let n="";for(let i=0;i<4;i++){const t=Math.floor(Math.random()*s.length);n+=s.splice(t,1)[0]}v(n)},[]);r.useEffect(()=>{_()},[_]);const m=a.length===4&&/^\d{4}$/.test(a)&&new Set(a).size===4,y=s=>{if(s.preventDefault(),p)return;if(!m){d({title:"Four different digits",message:"Each digit can only appear once.",duration:3e3});return}let n=0,i=0;for(let l=0;l<4;l++)a[l]===c[l]?n++:c.includes(a[l])&&i++;const t=[{guess:a,bulls:n,cows:i,id:Date.now()},...o];f(t),n===4?(u(!0),h(!0),d({title:"Cracked it",message:`${c} in ${t.length} guesses.`,type:"success"})):t.length>=w&&(u(!0),d({title:"Out of guesses",message:`The code was ${c}.`,type:"error"})),b("")},k=()=>{_(),f([]),b(""),u(!1),h(!1),x.current?.focus()},j=a.padEnd(4," ").split("");return e.jsxs("div",{className:"bnc",children:[e.jsx("style",{children:C}),e.jsx(z,{title:"Mastermind | Fezcodex",description:"Work out a four-digit code from bulls-and-cows feedback, in ten guesses or fewer.",keywords:["Fezcodex","mastermind","bulls and cows","code breaking"]}),e.jsxs("div",{className:"bnc__shell",children:[e.jsxs(S,{to:"/apps",className:"bnc__back",children:[e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to apps"]}),e.jsxs("div",{className:"bnc__head",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"bnc__title",children:"Bulls and cows"}),e.jsx("p",{className:"bnc__sub",children:"A hidden code of four different digits. Each guess tells you how many are right, and how many are right but misplaced."})]}),e.jsxs("div",{className:"bnc__left",children:[e.jsx("b",{children:w-o.length})," guesses left"]})]}),e.jsxs("form",{className:"bnc__entry",onSubmit:y,children:[e.jsxs("div",{className:"bnc__flaps",onClick:()=>x.current?.focus(),role:"presentation",children:[j.map((s,n)=>e.jsx("div",{className:`bnc__flap${s===" "?" bnc__flap--empty":""}${n===a.length?" bnc__flap--next":""}`,children:s===" "?"0":s},n)),e.jsx("input",{ref:x,className:"bnc__input",value:a,onChange:s=>b(s.target.value.replace(/\D/g,"").slice(0,4)),inputMode:"numeric",autoComplete:"off","aria-label":"Your four-digit guess",disabled:p})]}),e.jsxs("div",{className:"bnc__actions",children:[e.jsx("button",{className:"bnc__go",type:"submit",disabled:!m||p,children:"Check"}),e.jsx("button",{className:"bnc__ghost",type:"button",onClick:k,children:"New code"})]})]}),e.jsxs("div",{className:"bnc__key",children:[e.jsxs("span",{children:[e.jsx("i",{className:"bnc__pip bnc__pip--bull"})," right digit, right place"]}),e.jsxs("span",{children:[e.jsx("i",{className:"bnc__pip bnc__pip--cow"})," right digit, wrong place"]})]}),p&&e.jsx("div",{className:`bnc__verdict${g?" bnc__verdict--won":""}`,role:"status",children:g?e.jsxs(e.Fragment,{children:["Cracked it — the code was ",e.jsx("b",{children:c}),", found in"," ",o.length," ",o.length===1?"guess":"guesses","."]}):e.jsxs(e.Fragment,{children:["Out of guesses. The code was ",e.jsx("b",{children:c}),"."]})}),o.length===0?e.jsx("p",{className:"bnc__empty",children:"Type four digits to make your first guess."}):e.jsx("div",{className:"bnc__log",children:o.map((s,n)=>e.jsxs("div",{className:"bnc__row",children:[e.jsx("span",{className:"bnc__row-n",children:o.length-n}),e.jsx("span",{className:"bnc__row-digits",children:s.guess.split("").map((i,t)=>e.jsx("span",{className:"bnc__row-digit",children:i},t))}),e.jsx("span",{className:"bnc__row-pips",children:Array.from({length:4}).map((i,t)=>e.jsx("i",{className:`bnc__pip bnc__pip--${t<s.bulls?"bull":t<s.bulls+s.cows?"cow":"none"}`},t))}),e.jsxs("span",{className:"bnc__row-say",children:[s.bulls," in place, ",s.cows," moved"]})]},s.id))})]})]})};export{F as default};
