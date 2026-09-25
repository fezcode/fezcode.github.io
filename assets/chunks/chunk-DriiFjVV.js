import{r as n,j as e,L as u}from"../entries/pages.BWQb9Xz5.js";import{S as h}from"./chunk-DZBIj8id.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */const f=`
@import url('https://fonts.googleapis.com/css2?family=Ultra&family=Archivo+Narrow:wght@400;500;600;700&display=swap');

.bgo {
  --table:   #2a2320;
  --table-2: #1b1613;
  --card:    #dde5c9;
  --card-2:  #ccd6b3;
  --card-3:  #bcc8a0;
  --print:   #1c1f18;
  --print-2: #5d6552;
  --print-3: #8b9280;
  --dauber:  #8e3b93;

  font-family: 'Archivo Narrow', system-ui, sans-serif;
  color: var(--card);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,230,200,0.08), transparent 70%),
    var(--table-2);
  padding: 40px 20px 80px;
}

.bgo__shell { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }

.bgo__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 14px; color: #9c9184; text-decoration: none; transition: color .15s;
}
.bgo__back:hover { color: var(--card); }
.bgo__back:focus-visible { outline: 2px solid var(--dauber); outline-offset: 3px; }
.bgo__back svg { width: 13px; height: 13px; }

.bgo__lede { margin: 24px 0 0; max-width: 52ch; }
.bgo__lede h1 {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: clamp(26px, 4.6vw, 34px); font-weight: 700;
  line-height: 1.05; margin: 0; color: var(--card);
}
.bgo__lede p { font-size: 15px; line-height: 1.55; color: #9c9184; margin: 9px 0 0; }

/* — the card — */
.bgo__card {
  position: relative;
  margin: 30px 0 0;
  background: var(--card);
  color: var(--print);
  padding: 12px;
  border-radius: 2px;
  box-shadow: 0 20px 44px -18px rgba(0,0,0,0.85), 0 2px 5px rgba(0,0,0,0.4);
}
/* cheap stock speckle */
.bgo__card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  border-radius: 2px;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(28,31,24,0.6) 0.5px, transparent 0.6px),
    radial-gradient(circle at 70% 60%, rgba(28,31,24,0.4) 0.5px, transparent 0.6px);
  background-size: 6px 6px, 9px 9px;
  opacity: 0.2; mix-blend-mode: multiply;
}

.bgo__head {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;
  margin: 0 0 4px;
  background: var(--print); padding: 4px; border-radius: 2px;
}
.bgo__head span {
  font-family: 'Ultra', Georgia, serif;
  font-size: clamp(22px, 4.4vw, 34px);
  line-height: 1.1; text-align: center; color: var(--card);
  padding: 4px 0 6px;
}

.bgo__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }

.bgo__sq {
  position: relative; overflow: hidden;
  aspect-ratio: 1.22;
  background: var(--card-2);
  border: 1px solid var(--card-3);
  border-radius: 2px;
  padding: 8px 8px;
  cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; text-align: center;
  font-family: inherit;
  transition: background-color .12s;
}
.bgo__sq:hover { background: #d4dfb9; }
.bgo__sq:focus-visible { outline: 3px solid var(--dauber); outline-offset: -3px; }
.bgo__sq-n {
  font-size: clamp(11px, 1.6vw, 15px); font-weight: 700;
  line-height: 1.1; color: var(--print);
  letter-spacing: -0.008em;
}
.bgo__sq-d {
  font-size: clamp(9px, 1.15vw, 11px); font-weight: 400;
  line-height: 1.3; color: var(--print-2);
  display: none;
}
@media (min-width: 680px) { .bgo__sq-d { display: block; } }

.bgo__sq--free { background: var(--card-3); }
.bgo__sq--free .bgo__sq-n { font-family: 'Ultra', Georgia, serif; font-size: clamp(13px, 2vw, 19px); font-weight: 400; }

/* the dauber blot — translucent, never quite straight, never quite round */
.bgo__blot {
  position: absolute; left: 50%; top: 50%;
  width: 78%; height: 78%;
  transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1);
  border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%;
  background: radial-gradient(circle at 42% 38%, rgba(142,59,147,0.52), rgba(142,59,147,0.40) 62%, rgba(142,59,147,0.28));
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: bgo-stamp .16s cubic-bezier(.3,1.5,.5,1);
}
@keyframes bgo-stamp {
  from { transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(0.55); opacity: 0.3; }
}

/* — footer of the card — */
.bgo__foot {
  margin: 26px 0 0; display: flex; align-items: center;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.bgo__count { font-size: 15px; color: #9c9184; }
.bgo__count b { color: var(--card); font-weight: 700; font-variant-numeric: tabular-nums; }
.bgo__new {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 14.5px; font-weight: 600;
  background: var(--card); color: var(--table-2);
  border: 0; border-radius: 3px; padding: 11px 24px; cursor: pointer;
  transition: background-color .15s, color .15s;
}
.bgo__new:hover { background: var(--dauber); color: #fff; }
.bgo__new:focus-visible { outline: 2px solid var(--dauber); outline-offset: 3px; }

/* — the rubber stamp on a finished card — */
.bgo__stamp {
  position: absolute; right: 4%; top: 38%;
  transform: rotate(-13deg);
  border: 5px solid var(--dauber);
  border-radius: 6px;
  padding: 6px 20px 8px;
  color: var(--dauber);
  font-family: 'Ultra', Georgia, serif;
  font-size: clamp(30px, 7vw, 58px); line-height: 1;
  opacity: 0.82;
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: bgo-slam .22s cubic-bezier(.3,1.4,.5,1);
}
@keyframes bgo-slam {
  from { transform: rotate(-13deg) scale(1.7); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bgo__blot, .bgo__stamp { animation: none; }
}
`,x=[{name:"Ad hominem",desc:"Attacking the person instead of the argument."},{name:"Straw man",desc:"Misrepresenting an argument to make it easier to attack."},{name:"Slippery slope",desc:"Assuming a small step leads to a chain of extreme events."},{name:"False dilemma",desc:"Presenting only two options when more exist."},{name:"Post hoc",desc:"Assuming A caused B because A happened first."},{name:"Whataboutism",desc:"Deflecting by bringing up a different issue."},{name:"Red herring",desc:"Introducing an irrelevant topic to distract."},{name:"Confirmation bias",desc:"Favouring information that confirms existing beliefs."},{name:"Sunk cost",desc:"Continuing because of past investment, not future value."},{name:"Dunning-Kruger",desc:"Overestimating ability when knowledge is low."},{name:"No true Scotsman",desc:"Changing the definition to exclude counter-examples."},{name:"Texas sharpshooter",desc:"Cherry-picking data to fit a pattern."},{name:"Moving goalposts",desc:"Changing the criteria for proof after evidence is met."},{name:"Begging the question",desc:"The premise assumes the conclusion is true."},{name:"Appeal to authority",desc:"Saying it is true because an expert said so."},{name:"Appeal to emotion",desc:"Manipulating feelings instead of using logic."},{name:"Bandwagon",desc:"Saying it is true because many people believe it."},{name:"Appeal to ignorance",desc:"Assuming true because not proven false."},{name:"Burden of proof",desc:"Making a claim but expecting others to disprove it."},{name:"Personal incredulity",desc:"Saying it is false because it is hard to understand."},{name:"Ambiguity",desc:"Using double meanings to mislead."},{name:"Genetic fallacy",desc:"Judging something by where it came from."},{name:"Middle ground",desc:"Assuming the truth sits between two extremes."},{name:"Anecdotal",desc:"Using one story in place of sound evidence."}],_=[[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],[0,6,12,18,24],[4,8,12,16,20]],v=r=>`${(r*53%17-8)*1.4}deg`;function S(){const[r,g]=n.useState([]),[t,d]=n.useState(new Set),[c,l]=n.useState(!1),p=()=>{const o=[...x].sort(()=>Math.random()-.5),a=[];let i=0;for(let s=0;s<25;s++)s===12?a.push({name:"Free",desc:"You are on the internet.",isFree:!0}):(a.push(o[i]),i++);g(a),d(new Set([12])),l(!1)};n.useEffect(()=>{p()},[]);const m=o=>{l(_.some(a=>a.every(i=>o.has(i))))},b=o=>{if(o===12)return;const a=new Set(t);a.has(o)?a.delete(o):a.add(o),d(a),m(a)};return e.jsxs("div",{className:"bgo",children:[e.jsx("style",{children:f}),e.jsx(h,{title:"Logical Fallacies Bingo | Fezcodex",description:"A bingo card of the arguments you meet online. Mark them off as they turn up.",keywords:["bingo","logical fallacies","game","logic","internet arguments"]}),e.jsxs("div",{className:"bgo__shell",children:[e.jsxs(u,{to:"/apps",className:"bgo__back",children:[e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M10 3 L5 8 L10 13",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to apps"]}),e.jsxs("div",{className:"bgo__lede",children:[e.jsx("h1",{children:"Logical fallacies bingo"}),e.jsx("p",{children:"Take this into any comment section. Dab a square when you spot one; five in a row and the card is yours."})]}),e.jsxs("div",{className:"bgo__card",children:[e.jsxs("div",{className:"bgo__head","aria-hidden":"true",children:[e.jsx("span",{children:"B"}),e.jsx("span",{children:"I"}),e.jsx("span",{children:"N"}),e.jsx("span",{children:"G"}),e.jsx("span",{children:"O"})]}),e.jsx("div",{className:"bgo__grid",children:r.map((o,a)=>{const i=t.has(a);return e.jsxs("button",{className:`bgo__sq${o.isFree?" bgo__sq--free":""}`,onClick:()=>b(a),"aria-pressed":i,disabled:o.isFree,title:o.desc,children:[e.jsx("span",{className:"bgo__sq-n",children:o.name}),e.jsx("span",{className:"bgo__sq-d",children:o.desc}),i&&e.jsx("span",{className:"bgo__blot",style:{"--rot":v(a)},"aria-hidden":"true"})]},a)})}),c&&e.jsx("div",{className:"bgo__stamp",children:"Bingo"})]}),e.jsxs("div",{className:"bgo__foot",children:[e.jsx("p",{className:"bgo__count",role:"status",children:c?e.jsxs(e.Fragment,{children:["That is five in a row — ",e.jsx("b",{children:t.size})," dabbed in all."]}):e.jsxs(e.Fragment,{children:[e.jsx("b",{children:t.size})," of 25 dabbed."]})}),e.jsx("button",{className:"bgo__new",onClick:p,children:"New card"})]})]})]})}export{S as default};
