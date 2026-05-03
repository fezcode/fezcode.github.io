import{r as s,j as e,L as T}from"../entries/pages.DMdlyjfO.js";import{S as E}from"./chunk-BrPMSi7I.js";import"./chunk-BXl3LOEh.js";/* empty css              */const I=`
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=Zen+Maru+Gothic:wght@400;500;700&display=swap');

.pb {
  --washi:    #f1e9d2;
  --washi-2:  #e6dcc0;
  --washi-3:  #d8cba9;
  --sumi:     #181410;
  --sumi-2:   #2a231b;
  --sumi-mut: #6b5e4a;
  --shu:      #b73a2a;     /* vermillion */
  --shu-dk:   #7e2719;
  --ai:       #2a4869;     /* indigo */
  --ai-dk:    #1a2f47;
  --kin:      #a87434;     /* tarnished gold */
  --moss:     #5e6f3e;
  --rule:     #c8b88e;
  --rule-2:   #b8a574;

  font-family: 'Shippori Mincho B1', 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  background: var(--washi);
  color: var(--sumi);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
}

/* paper grain — layered noise & warm vignette */
.pb::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 90% 70% at 50% 35%, rgba(255,240,200,0.4), transparent 70%),
    radial-gradient(ellipse 60% 60% at 85% 95%, rgba(183,58,42,0.04), transparent 60%),
    radial-gradient(ellipse 60% 60% at 15% 5%, rgba(42,72,105,0.04), transparent 60%);
}
.pb::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(168,116,52,0.08) 1px, transparent 2px),
    radial-gradient(circle at 75% 70%, rgba(168,116,52,0.06) 1px, transparent 2px),
    radial-gradient(circle at 45% 85%, rgba(94,111,62,0.05) 1px, transparent 2px);
  background-size: 280px 280px, 360px 360px, 220px 220px;
  opacity: 0.6;
  mix-blend-mode: multiply;
}

.pb__shell { position: relative; z-index: 1; }

/* ------- top spine ------- */
.pb__spine {
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 28px;
  padding: 18px 40px;
  border-bottom: 1px solid var(--rule);
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 11px; letter-spacing: 0.32em;
  text-transform: uppercase; color: var(--sumi-mut);
}
.pb__spine a { color: var(--sumi-mut); text-decoration: none; }
.pb__spine a:hover { color: var(--shu); }
.pb__sigil { display: inline-flex; align-items: center; gap: 12px; }
.pb__sigil-mark {
  width: 24px; height: 24px;
  background: var(--shu); color: var(--washi);
  display: grid; place-items: center;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 14px; font-weight: 600;
}
.pb__spine-c {
  text-align: center; color: var(--shu);
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; letter-spacing: 0.5em;
}

/* vertical edge title */
.pb__edge {
  position: fixed; right: 18px; top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 13px; letter-spacing: 0.4em;
  color: var(--ai-dk); opacity: 0.55;
  z-index: 2; pointer-events: none;
  display: flex; align-items: center; gap: 18px;
}
.pb__edge-rule {
  width: 1px; height: 60px; background: var(--ai-dk); opacity: 0.4;
}

/* ------- masthead ------- */
.pb__mast {
  display: grid; grid-template-columns: 1.1fr 1fr;
  gap: 60px; align-items: end;
  padding: 80px 80px 56px;
  border-bottom: 1px solid var(--rule);
}
.pb__mast-eye {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 11px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--shu);
  margin-bottom: 18px; display: inline-flex; gap: 14px; align-items: center;
}
.pb__mast-eye::before {
  content: "枕"; font-family: 'Shippori Mincho B1', serif;
  font-size: 16px; letter-spacing: 0; color: var(--shu);
}
.pb__title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-weight: 400;
  font-size: clamp(56px, 8.6vw, 124px);
  line-height: 0.86;
  letter-spacing: -0.015em;
  margin: 0; color: var(--sumi);
}
.pb__title-jp {
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; font-weight: 500;
  display: block; color: var(--shu);
  font-size: 0.62em; letter-spacing: 0.18em;
  margin-top: 0.15em;
}
.pb__lede {
  font-size: 17px; line-height: 1.62;
  color: var(--sumi-2);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  border-left: 1px solid var(--rule-2);
  padding-left: 24px;
}
.pb__lede-drop {
  float: left;
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; font-weight: 600;
  font-size: 60px; line-height: 0.8;
  color: var(--shu);
  margin: 8px 12px 0 0;
}

/* ------- workspace ------- */
.pb__work {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 44px;
  padding: 56px 80px;
  align-items: start;
}
@media (max-width: 1100px) {
  .pb__work { grid-template-columns: 1fr; padding: 36px 24px; gap: 32px; }
  .pb__mast { padding: 48px 24px 32px; grid-template-columns: 1fr; gap: 24px; }
  .pb__edge { display: none; }
}

/* category list (left rail) */
.pb__cat-head {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--shu);
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.pb__cat-head span:first-child::before {
  content: "①   "; color: var(--sumi-mut);
}
.pb__cats { display: flex; flex-direction: column; }
.pb__cat {
  display: flex; align-items: baseline; gap: 12px;
  background: transparent; border: 0;
  text-align: left; cursor: pointer;
  padding: 12px 6px;
  border-bottom: 1px dashed var(--rule);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 17px;
  color: var(--sumi-2);
  transition: all 140ms ease;
  position: relative;
  line-height: 1.25;
}
.pb__cat:hover { color: var(--shu); padding-left: 14px; }
.pb__cat[data-on="true"] {
  color: var(--shu); font-weight: 500;
}
.pb__cat[data-on="true"]::before {
  content: "❋"; position: absolute; left: -14px; top: 14px;
  font-size: 11px; color: var(--shu); font-style: normal;
}
.pb__cat-num {
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; font-size: 13px;
  color: var(--kin); min-width: 22px;
}
.pb__cat-jp {
  display: block;
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; font-size: 11px;
  color: var(--sumi-mut); margin-top: 2px;
  letter-spacing: 0.06em;
}
.pb__cat-count {
  margin-left: auto;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; color: var(--sumi-mut);
  letter-spacing: 0.1em;
}

.pb__add-cat {
  margin-top: 14px;
  display: flex; gap: 6px;
}
.pb__add-cat input {
  flex: 1; min-width: 0;
  background: transparent;
  border: 0; border-bottom: 1px solid var(--rule-2);
  padding: 8px 0;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 14px;
  color: var(--sumi); outline: none;
}
.pb__add-cat input:focus { border-color: var(--shu); }
.pb__add-cat button {
  background: var(--sumi); color: var(--washi);
  border: 0; padding: 8px 12px;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 12px; cursor: pointer;
  transition: all 140ms ease;
}
.pb__add-cat button:hover { background: var(--shu); }

/* ------- center page ------- */
.pb__page {
  background: var(--washi-2);
  padding: 56px 60px 56px;
  position: relative;
  box-shadow:
    inset 0 0 0 1px var(--rule-2),
    0 30px 60px -30px rgba(24,20,16,0.2);
  min-height: 720px;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 38px,
      rgba(168,116,52,0.04) 38px,
      rgba(168,116,52,0.04) 39px
    );
}
.pb__page::before {
  content: ""; position: absolute; top: 12px; bottom: 12px; left: 12px; right: 12px;
  border: 1px solid var(--rule);
  pointer-events: none;
}
.pb__page-no {
  position: absolute; top: 24px; right: 36px;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 12px; color: var(--sumi-mut);
  letter-spacing: 0.2em;
}
.pb__page-head {
  text-align: center; margin-bottom: 34px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--rule);
}
.pb__page-eye {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.5em;
  text-transform: uppercase; color: var(--shu);
  margin-bottom: 14px;
}
.pb__page-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-weight: 500;
  font-size: clamp(28px, 3.2vw, 42px);
  line-height: 1.05;
  color: var(--sumi); margin: 0;
}
.pb__page-jp {
  display: block;
  font-family: 'Shippori Mincho B1', serif;
  font-style: normal; font-weight: 500;
  font-size: 16px; letter-spacing: 0.18em;
  color: var(--shu);
  margin-top: 12px;
}

.pb__entries { list-style: none; padding: 0; margin: 0 0 32px; }
.pb__entry {
  display: grid; grid-template-columns: 36px 1fr auto;
  align-items: baseline; gap: 16px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--rule);
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; line-height: 1.5; color: var(--sumi);
}
.pb__entry-num {
  font-family: 'Shippori Mincho B1', serif;
  font-size: 17px; color: var(--shu);
  text-align: right;
}
.pb__entry-text {
  font-style: italic;
  cursor: text;
  outline: none;
}
.pb__entry-text:focus {
  background: rgba(183,58,42,0.05);
  box-shadow: inset 0 -1px 0 var(--shu);
}
.pb__entry-del {
  background: transparent; border: 0;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 14px; color: var(--rule-2);
  cursor: pointer; padding: 0 4px;
  transition: color 140ms ease;
}
.pb__entry-del:hover { color: var(--shu); }
.pb__empty {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 16px;
  color: var(--sumi-mut);
  text-align: center; padding: 32px 8px;
}

/* inkstone composer */
.pb__compose {
  margin-top: 28px;
  padding: 18px 20px 16px;
  background: linear-gradient(180deg, rgba(24,20,16,0.04), rgba(24,20,16,0.08));
  border-top: 2px solid var(--sumi);
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.pb__compose-eye {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--sumi-mut);
  margin-bottom: 8px;
  display: flex; justify-content: space-between;
}
.pb__compose-eye span:last-child { color: var(--shu); }
.pb__compose-row { display: flex; gap: 12px; align-items: stretch; }
.pb__compose textarea {
  flex: 1; min-height: 56px; resize: vertical;
  background: var(--washi);
  border: 1px solid var(--rule);
  padding: 12px 14px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 17px;
  line-height: 1.45; color: var(--sumi);
  outline: none;
}
.pb__compose textarea:focus { border-color: var(--shu); }
.pb__compose-btn {
  background: var(--sumi); color: var(--washi);
  border: 0; padding: 0 22px;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 14px; letter-spacing: 0.12em;
  cursor: pointer; min-width: 88px;
  transition: all 140ms ease;
  display: grid; place-items: center;
}
.pb__compose-btn:hover {
  background: var(--shu);
}

/* ------- right rail ------- */
.pb__season {
  border: 1px solid var(--rule);
  background: var(--washi-2);
  padding: 22px 22px 18px;
  position: relative;
  margin-bottom: 28px;
}
.pb__season::before {
  content: ""; position: absolute; top: 0; left: 0; width: 36px; height: 2px;
  background: var(--shu);
}
.pb__season-eye {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.36em;
  text-transform: uppercase; color: var(--sumi-mut);
  margin-bottom: 12px;
  display: flex; justify-content: space-between;
}
.pb__season-eye span:last-child { color: var(--shu); }
.pb__season-name {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 38px;
  line-height: 1; color: var(--sumi);
  margin-bottom: 4px;
}
.pb__season-jp {
  font-family: 'Shippori Mincho B1', serif;
  font-size: 28px; color: var(--shu);
  letter-spacing: 0.06em;
  display: flex; align-items: baseline; gap: 14px;
}
.pb__season-jp small {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 13px;
  color: var(--sumi-mut); letter-spacing: 0.1em;
}
.pb__season-line {
  margin-top: 16px; padding-top: 14px;
  border-top: 1px dashed var(--rule);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 15px;
  line-height: 1.55; color: var(--sumi-2);
}

.pb__rail-card {
  border-top: 1px solid var(--rule);
  padding-top: 18px; margin-top: 18px;
}
.pb__rail-head {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--shu);
  margin-bottom: 10px;
}
.pb__rail-body {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; line-height: 1.55;
  color: var(--sumi-2);
}
.pb__rail-body em {
  color: var(--ai); font-style: italic;
}

.pb__tools {
  display: flex; flex-direction: column; gap: 4px;
  margin-top: 22px;
}
.pb__tools button {
  background: transparent;
  border: 0; border-bottom: 1px solid var(--rule);
  padding: 10px 0;
  text-align: left;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 11px; letter-spacing: 0.32em;
  text-transform: uppercase; color: var(--sumi-mut);
  cursor: pointer; transition: all 140ms ease;
  display: flex; justify-content: space-between;
}
.pb__tools button:hover { color: var(--shu); padding-left: 6px; }

/* ------- colophon ------- */
.pb__colophon {
  border-top: 1px solid var(--rule);
  padding: 56px 80px 80px;
  display: grid; grid-template-columns: 1fr 1fr 0.6fr;
  gap: 56px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; line-height: 1.62;
  color: var(--sumi-2);
}
@media (max-width: 1100px) {
  .pb__colophon { padding: 36px 24px; grid-template-columns: 1fr; gap: 28px; }
}
.pb__colophon h3 {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 10px; letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--shu);
  margin: 0 0 14px 0; font-weight: 500;
  display: flex; align-items: center; gap: 14px;
}
.pb__colophon h3::after {
  content: ""; flex: 1; height: 1px; background: var(--rule);
}
.pb__seal {
  align-self: end;
  display: inline-grid; grid-template-columns: auto auto;
  gap: 14px; align-items: center;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 13px; color: var(--sumi-mut);
  letter-spacing: 0.06em;
}
.pb__seal-stamp {
  width: 56px; height: 56px;
  background: var(--shu);
  color: var(--washi);
  display: grid; place-items: center;
  font-family: 'Shippori Mincho B1', serif;
  font-size: 26px; font-weight: 700;
  letter-spacing: 0;
  transform: rotate(-4deg);
  box-shadow: 0 0 0 1px var(--shu-dk) inset;
}

@media print {
  @page { size: A4; margin: 18mm; }
  html, body { background: #fff !important; }
  /* hide ALL global chrome (Brutalist layout wraps the page); show only .pb */
  body * { visibility: hidden !important; }
  .pb, .pb * { visibility: visible !important; }
  .pb {
    position: absolute !important;
    left: 0; top: 0; right: 0;
    background: #fff !important;
    color: #000 !important;
  }
  .pb::before, .pb::after { display: none !important; }
  .pb__spine, .pb__edge, .pb__mast, .pb__colophon, .pb__compose,
  .pb__page-no { display: none !important; }
  .pb__work {
    display: block !important;
    padding: 0 !important;
    grid-template-columns: 1fr !important;
  }
  .pb__work > div:first-child,
  .pb__work > div:last-child { display: none !important; }
  .pb__page {
    background: #fff !important;
    background-image: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    min-height: auto !important;
  }
  .pb__page::before { display: none !important; }
  .pb__page-head { border-bottom-color: #000 !important; }
  .pb__page-title, .pb__entry-text { color: #000 !important; }
  .pb__page-jp, .pb__entry-num, .pb__page-eye { color: #b73a2a !important; }
  .pb__entry { border-bottom: 1px solid #ccc !important; }
  .pb__entry-del { display: none !important; }
}
`,m=[{id:"quicken",en:"Things that quicken the heart",jp:"こころときめきするもの",seed:["Sparrows feeding their young.","To pass a place where babies are playing.","To hear a man's voice in the morning, when one had thought oneself alone."]},{id:"lost-power",en:"Things that have lost their power",jp:"勢ひこそなれにけるもの",seed:["A large boat which is high and dry in a creek at ebb-tide.","A woman who has taken off her false locks to comb the short hair that remains.","A great tree that has been blown down in a gale and lies on its side with its roots in the air."]},{id:"embarrassing",en:"Embarrassing things",jp:"はしたなきもの",seed:["To call up a person in the night and have someone else answer.","To be overheard talking ill of someone, especially when the person concerned hears it too."]},{id:"splendid",en:"Splendid things",jp:"めでたきもの",seed:["Chinese brocade. A sword with a decorated scabbard.","The grain of wood in a Buddhist statue.","Long flowering branches of beautifully coloured wisteria entwined about a pine tree."]},{id:"hateful",en:"Hateful things",jp:"にくきもの",seed:["A guest who arrives just as one is in a hurry to leave.","A man who, on parting, says one thing and writes another.","One has just retired into the inner room — a flea, hopping under one’s clothes."]},{id:"should-be-short",en:"Things that should be short",jp:"短くてありぬべきもの",seed:["A speech given by a young woman of a great house.","A piece of thread when one is in a hurry to sew.","The lamp-stand of a poor person."]},{id:"distant-near",en:"Things that are distant though near",jp:"近うて遠きもの",seed:["Festivals celebrated near the Palace.","Relations between brothers, sisters and other members of a family who do not love each other.","The zigzag path leading up to the temple at Kurama."]},{id:"painted-better",en:"Things that gain by being painted",jp:"絵にかきまさりするもの",seed:["Pines. Autumn fields. Mountain villages. Pathways in the mountains.","Cranes. Stags.","A very cold winter scene; an unspeakably hot summer scene."]},{id:"elegant",en:"Refined and elegant things",jp:"なまめかしきもの",seed:["A slender, handsome young man wearing white-lined hunting costume of pale violet.","Snow on the houses, capped with crystal.","A silver bowl filled with shaved ice, served on a stand of flowering plum."]},{id:"arouse-fond",en:"Things that arouse a fond memory of the past",jp:"過ぎにし方恋しきもの",seed:["Dried hollyhock. The objects used during the Display of Dolls.","Last year’s paper fan.","A moonlit night."]}],j=[{jp:"春",en:"Spring",romaji:"haru",months:[2,3,4],line:'"In spring, it is the dawn that is most beautiful."'},{jp:"夏",en:"Summer",romaji:"natsu",months:[5,6,7],line:'"In summer, the nights. Not only when the moon shines, but on dark nights too."'},{jp:"秋",en:"Autumn",romaji:"aki",months:[8,9,10],line:'"In autumn, the evenings — when the glittering sun sinks close to the edge of the hills."'},{jp:"冬",en:"Winter",romaji:"fuyu",months:[11,0,1],line:'"In winter, the early mornings. It is beautiful indeed when snow has fallen during the night."'}],f=["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],N="fezcodex.pillowBook.v1",D=()=>{try{const a=localStorage.getItem(N);return a?JSON.parse(a):null}catch{return null}},O=a=>{try{localStorage.setItem(N,JSON.stringify(a))}catch{}},k=()=>{const a={};for(const r of m)a[r.id]=r.seed.slice();return a},K=()=>{const[a,r]=s.useState(m),[d,p]=s.useState(k()),[g,c]=s.useState(m[0].id),[b,x]=s.useState(""),[u,_]=s.useState("");s.useEffect(()=>{const t=D();t&&(Array.isArray(t.categories)&&r(t.categories),t.entries&&typeof t.entries=="object"&&p(t.entries),t.activeId&&c(t.activeId))},[]),s.useEffect(()=>{O({categories:a,entries:d,activeId:g})},[a,d,g]);const n=a.find(t=>t.id===g)||a[0],y=d[n.id]||[],h=s.useMemo(()=>{const t=new Date().getMonth();return j.find(i=>i.months.includes(t))||j[0]},[]),S=s.useMemo(()=>{const t=new Date;return`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日`},[]),v=()=>{const t=b.trim();t&&(p(i=>({...i,[n.id]:[...i[n.id]||[],t]})),x(""))},z=(t,i)=>{p(o=>{const l=(o[n.id]||[]).slice();return l[t]=i,{...o,[n.id]:l}})},M=t=>{p(i=>{const o=(i[n.id]||[]).slice();return o.splice(t,1),{...i,[n.id]:o}})},w=()=>{const t=u.trim();if(!t)return;const i="c-"+Date.now().toString(36);r(o=>[...o,{id:i,en:t,jp:"ものごと",seed:[]}]),p(o=>({...o,[i]:[]})),c(i),_("")},C=()=>{a.length<=1||window.confirm(`Remove the category "${n.en}" and its entries?`)&&(r(t=>t.filter(i=>i.id!==n.id)),p(t=>{const{[n.id]:i,...o}=t;return o}),c(a[0].id===n.id?a[1].id:a[0].id))},A=()=>{window.confirm("Restore all categories and entries to the original Pillow Book?")&&(r(m),p(k()),c(m[0].id))},B=()=>{const t=JSON.stringify({categories:a,entries:d},null,2),i=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(i),l=document.createElement("a");l.href=o,l.download=`pillow-book-${Date.now()}.json`,l.click(),URL.revokeObjectURL(o)},G=t=>{t.key==="Enter"&&(t.metaKey||t.ctrlKey)&&(t.preventDefault(),v())};return e.jsxs("div",{className:"pb",children:[e.jsx("style",{children:I}),e.jsx(E,{title:"The Pillow Book · A Categorical Diary | Fezcodex",description:"A Heian-era pillow book in the voice of Sei Shōnagon. Compose and curate categorical lists — things that quicken the heart, things that have lost their power, things that should be short.",keywords:["pillow book","sei shonagon","heian","diary","journal","list","zuihitsu","makura no soshi"]}),e.jsxs("div",{className:"pb__edge",children:["枕草子",e.jsx("span",{className:"pb__edge-rule"}),"Liber Cervicalis · MMXXVI"]}),e.jsxs("div",{className:"pb__shell",children:[e.jsxs("header",{className:"pb__spine",children:[e.jsxs(T,{to:"/apps",className:"pb__sigil",children:[e.jsx("span",{className:"pb__sigil-mark",children:"f"}),e.jsx("span",{children:"← Index"})]}),e.jsx("div",{className:"pb__spine-c",children:"枕 · 草 · 子"}),e.jsx("div",{children:S})]}),e.jsxs("section",{className:"pb__mast",children:[e.jsxs("div",{children:[e.jsx("div",{className:"pb__mast-eye",children:"Liber Cervicalis · zuihitsu"}),e.jsxs("h1",{className:"pb__title",children:["The Pillow Book",e.jsx("span",{className:"pb__title-jp",children:"枕草子"})]})]}),e.jsxs("p",{className:"pb__lede",children:[e.jsx("span",{className:"pb__lede-drop",children:"S"}),"ei Shōnagon, gentlewoman to the Empress Teishi, kept beneath her pillow a stack of paper. She filled it with miscellaneous lists — things refined, things hateful, things that should be short — and in doing so invented the categorical essay a thousand years before the listicle."]})]}),e.jsxs("section",{className:"pb__work",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"pb__cat-head",children:[e.jsx("span",{children:"Categories"}),e.jsx("span",{children:a.length})]}),e.jsx("div",{className:"pb__cats",children:a.map((t,i)=>e.jsxs("button",{className:"pb__cat","data-on":t.id===g,onClick:()=>c(t.id),children:[e.jsx("span",{className:"pb__cat-num",children:f[i]||i+1}),e.jsxs("span",{style:{flex:1},children:[t.en,e.jsx("span",{className:"pb__cat-jp",children:t.jp})]}),e.jsx("span",{className:"pb__cat-count",children:(d[t.id]||[]).length})]},t.id))}),e.jsxs("div",{className:"pb__add-cat",children:[e.jsx("input",{type:"text",value:u,placeholder:"Things that…",onChange:t=>_(t.target.value),onKeyDown:t=>t.key==="Enter"&&w()}),e.jsx("button",{onClick:w,children:"＋"})]})]}),e.jsxs("article",{className:"pb__page",children:[e.jsxs("div",{className:"pb__page-no",children:["leaf ",f[a.indexOf(n)]||""]}),e.jsxs("header",{className:"pb__page-head",children:[e.jsxs("div",{className:"pb__page-eye",children:["section · ",f[a.indexOf(n)]||a.indexOf(n)+1]}),e.jsxs("h2",{className:"pb__page-title",children:[n.en,e.jsx("span",{className:"pb__page-jp",children:n.jp})]})]}),y.length===0?e.jsx("div",{className:"pb__empty",children:"The page lies empty. Note something below."}):e.jsx("ol",{className:"pb__entries",children:y.map((t,i)=>e.jsxs("li",{className:"pb__entry",children:[e.jsx("span",{className:"pb__entry-num",children:f[i]||i+1}),e.jsx("span",{className:"pb__entry-text",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:o=>z(i,o.currentTarget.textContent),children:t}),e.jsx("button",{className:"pb__entry-del",title:"strike out",onClick:()=>M(i),children:"✕"})]},i))}),e.jsxs("div",{className:"pb__compose",children:[e.jsxs("div",{className:"pb__compose-eye",children:[e.jsx("span",{children:"Inkstone · note a new thing"}),e.jsx("span",{children:"⌘ ↩ to set"})]}),e.jsxs("div",{className:"pb__compose-row",children:[e.jsx("textarea",{value:b,onChange:t=>x(t.target.value),onKeyDown:G,placeholder:"A flute heard at a great distance, growing slowly nearer…"}),e.jsx("button",{className:"pb__compose-btn",onClick:v,children:"set"})]})]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"pb__season",children:[e.jsxs("div",{className:"pb__season-eye",children:[e.jsx("span",{children:"Season"}),e.jsx("span",{children:h.romaji})]}),e.jsx("div",{className:"pb__season-name",children:h.en}),e.jsxs("div",{className:"pb__season-jp",children:[h.jp,e.jsxs("small",{children:[h.months.map(t=>t+1).join(" · "),"月"]})]}),e.jsx("div",{className:"pb__season-line",children:h.line})]}),e.jsxs("div",{className:"pb__rail-card",children:[e.jsx("div",{className:"pb__rail-head",children:"Marginalia"}),e.jsxs("div",{className:"pb__rail-body",children:["The categories begin with the originals from the",e.jsx("em",{children:" Makura no Sōshi "})," as recorded in section 14, 25, 28 and onward. Edit any entry by clicking it. Add your own categories below; they keep on this device."]})]}),e.jsxs("div",{className:"pb__tools",children:[e.jsxs("button",{onClick:B,children:[e.jsx("span",{children:"Export"}),e.jsx("span",{children:"↓"})]}),e.jsxs("button",{onClick:()=>window.print(),children:[e.jsx("span",{children:"Print spread"}),e.jsx("span",{children:"⎙"})]}),e.jsxs("button",{onClick:C,children:[e.jsx("span",{children:"Strike category"}),e.jsx("span",{children:"✕"})]}),e.jsxs("button",{onClick:A,children:[e.jsx("span",{children:"Restore canon"}),e.jsx("span",{children:"↺"})]})]})]})]}),e.jsxs("section",{className:"pb__colophon",children:[e.jsxs("div",{children:[e.jsx("h3",{children:"Method"}),e.jsxs("p",{children:["The pillow book — ",e.jsx("em",{style:{color:"var(--shu)"},children:"makura no sōshi"})," — is a form of ",e.jsx("em",{children:"zuihitsu"}),', "following the brush": miscellaneous notes set down in no particular order. Sei Shōnagon arranged hers as enumerated lists, observations, and short essays; her preferred unit was the categorical inventory.']})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"On categories"}),e.jsx("p",{children:'The discipline is in the heading, not the items. A good category ("Things that should be short") performs more work than the entries beneath it. When something will not slot beneath an existing heading, invent the heading first and let the items accrete.'})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"Colophon"}),e.jsx("p",{children:"Set in Cormorant Garamond italic & Shippori Mincho B1. Translations after Ivan Morris (Columbia, 1967) and Meredith McKinney (Penguin, 2006). All entries kept on this device."}),e.jsxs("div",{className:"pb__seal",children:[e.jsxs("span",{children:["fezcodex",e.jsx("br",{}),"MMXXVI"]}),e.jsx("span",{className:"pb__seal-stamp",children:"枕"})]})]})]})]})]})};export{K as default};
