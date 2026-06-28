import{r as m,j as e,L as ue,b as ye,A as be,m as _}from"../entries/pages.BLuD5Sbr.js";import{S as ve}from"./chunk-BXUwrkms.js";import"./chunk-BXl3LOEh.js";/* empty css              */const p=880,h=620,R=70,D=[{id:"ursa-major",name:"Ursa Major",subtitle:"The Great Bear · Septem Triones",epigraph:'"Septem stellae, currus caelestis quae circum polum aeternum vertuntur."',lore:"Seven stars that wheel forever about the pole. Sailors have long steered by Dubhe and Merak, the two pointers that aim toward Polaris. Mizar and its companion Alcor were once a test of eyesight for Roman legionaries.",starNames:["Alkaid","Mizar","Alioth","Megrez","Phecda","Merak","Dubhe"],stars:[{x:-.95,y:.32},{x:-.55,y:.18},{x:-.18,y:.06},{x:.08,y:-.05},{x:.36,y:.22},{x:.42,y:-.32},{x:.85,y:-.5}],edges:[[0,1],[1,2],[2,3],[3,5],[5,6],[3,4],[4,5]]},{id:"cassiopeia",name:"Cassiopeia",subtitle:"The Vain Queen",epigraph:'"Solium reginae vana superbia damnatae."',lore:"A queen of Aethiopia, bound by Poseidon to her throne and condemned to circle the pole forever as punishment for vanity. Her five brightest stars trace a great W against the polar dark.",starNames:["Caph","Schedar","Gamma Cas.","Ruchbah","Segin"],stars:[{x:-.9,y:.35},{x:-.4,y:-.12},{x:0,y:.42},{x:.45,y:-.05},{x:.9,y:.38}],edges:[[0,1],[1,2],[2,3],[3,4]]},{id:"orion",name:"Orion",subtitle:"The Hunter · Bellator Caelestis",epigraph:'"Cingulum trium stellarum aequatorem dividit."',lore:"The hunter of the heavens, eternally pursued by the scorpion. His belt of three stars — Mintaka, Alnilam, and Alnitak — marks the celestial equator and guides ships in both hemispheres.",starNames:["Betelgeuse","Bellatrix","Mintaka","Alnilam","Alnitak","Saiph","Rigel"],stars:[{x:-.55,y:-.78},{x:.5,y:-.72},{x:-.32,y:0},{x:0,y:.05},{x:.32,y:.1},{x:-.7,y:.7},{x:.72,y:.78}],edges:[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]]},{id:"lyra",name:"Lyra",subtitle:"The Lyre of Orpheus",epigraph:'"Cithara Orphei a Iove inter astra collocata."',lore:"The lyre of Orpheus, lifted into the heavens by Apollo after the bard's death. Vega — the brightest of its strings — is one of the closest bright stars to Earth, blazing fierce and blue.",starNames:["Vega","Sheliak","Zeta Lyrae","Sulafat","Delta Lyrae"],stars:[{x:0,y:-.7},{x:-.5,y:-.1},{x:.5,y:-.1},{x:-.5,y:.62},{x:.5,y:.62}],edges:[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]]},{id:"cygnus",name:"Cygnus",subtitle:"The Swan · Crux Septentrionalis",epigraph:'"Cycnus per Viam Lacteam volans."',lore:"A swan in flight along the Milky Way, also known as the Northern Cross. Deneb, brightest of its tail, is among the most luminous stars visible from Earth — a supergiant some sixty thousand times brighter than the Sun.",starNames:["Deneb","Sadr","Gienah","Delta Cyg.","Albireo"],stars:[{x:0,y:-.82},{x:0,y:-.1},{x:-.72,y:.02},{x:.72,y:.1},{x:0,y:.78}],edges:[[0,1],[1,2],[1,3],[1,4]]}],je=65,y={IDLE:"idle",PLAYING:"playing",COMPLETE:"complete"},Ne=(p-R*2)/2,Ce=(h-R*2)/2,le=o=>({x:p/2+o.x*Ne,y:h/2+o.y*Ce}),J=(o,a)=>o<a?`${o}-${a}`:`${a}-${o}`,Se=o=>{let a=o;return()=>(a=(a*9301+49297)%233280,a/233280)},ke=(o,a)=>{const l=Se(a),n=[],S=o.stars.map(le),f=26;let b=0;for(;n.length<je&&b<1500;){b+=1;const v=R+l()*(p-R*2),w=R+l()*(h-R*2);[...S,...n.map(c=>({x:c.x,y:c.y}))].some(c=>Math.hypot(c.x-v,c.y-w)<f)||n.push({x:v,y:w,brightness:.25+l()*.55,twinkleOffset:l()*Math.PI*2,twinkleSpeed:.5+l()*1.6,size:.6+l()*1.1})}return n},we=o=>{const a=o/p*24*60*60,l=Math.floor(a/3600),n=Math.floor(a%3600/60);return`${l.toString().padStart(2,"0")}h ${n.toString().padStart(2,"0")}m`},Me=o=>{const a=(o/h*-180+90).toFixed(1);return`${a>=0?"+":""}${a}°`},Ae=({size:o=88,className:a=""})=>e.jsxs("svg",{viewBox:"0 0 100 100",width:o,height:o,className:a,"aria-hidden":"true",children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"cr-grad",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"rgba(212, 175, 55, 0.18)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(212, 175, 55, 0)"})]})}),e.jsx("circle",{cx:"50",cy:"50",r:"48",fill:"url(#cr-grad)"}),e.jsx("circle",{cx:"50",cy:"50",r:"44",fill:"none",stroke:"currentColor",strokeWidth:"0.5",opacity:"0.45"}),e.jsx("circle",{cx:"50",cy:"50",r:"32",fill:"none",stroke:"currentColor",strokeWidth:"0.4",opacity:"0.35"}),[0,45,90,135,180,225,270,315].map(l=>{const n=(l-90)*Math.PI/180,S=50+Math.cos(n)*8,f=50+Math.sin(n)*8,b=50+Math.cos(n)*44,v=50+Math.sin(n)*44;return e.jsx("line",{x1:S,y1:f,x2:b,y2:v,stroke:"currentColor",strokeWidth:l%90===0?"0.8":"0.35",opacity:l%90===0?.85:.4},l)}),e.jsx("path",{d:"M50 6 L46 28 L50 24 L54 28 Z",fill:"currentColor",opacity:"0.9"}),e.jsx("text",{x:"50",y:"14",textAnchor:"middle",fontSize:"6",fontFamily:"Cardo, serif",fill:"currentColor",opacity:"0.85",children:"N"}),e.jsx("text",{x:"92",y:"52",textAnchor:"middle",fontSize:"5",fontFamily:"Cardo, serif",fill:"currentColor",opacity:"0.65",children:"E"}),e.jsx("text",{x:"50",y:"96",textAnchor:"middle",fontSize:"5",fontFamily:"Cardo, serif",fill:"currentColor",opacity:"0.65",children:"S"}),e.jsx("text",{x:"8",y:"52",textAnchor:"middle",fontSize:"5",fontFamily:"Cardo, serif",fill:"currentColor",opacity:"0.65",children:"W"}),e.jsx("circle",{cx:"50",cy:"50",r:"2",fill:"currentColor"})]}),Ie=({className:o=""})=>e.jsxs("svg",{viewBox:"0 0 200 80",className:o,fill:"none","aria-hidden":"true",children:[e.jsx("path",{d:"M10 70 A 90 90 0 0 1 190 70",stroke:"currentColor",strokeWidth:"0.6",opacity:"0.5"}),e.jsx("path",{d:"M20 70 A 80 80 0 0 1 180 70",stroke:"currentColor",strokeWidth:"0.4",opacity:"0.35"}),Array.from({length:19}).map((a,l)=>{const n=Math.PI-l/18*Math.PI,S=80,f=l%3===0?90:84,b=100,v=70,w=b+Math.cos(n)*S,g=v-Math.sin(n)*S,c=b+Math.cos(n)*f,d=v-Math.sin(n)*f;return e.jsx("line",{x1:w,y1:g,x2:c,y2:d,stroke:"currentColor",strokeWidth:l%3===0?"0.55":"0.3",opacity:l%3===0?.7:.4},l)})]}),Ee=({stars:o,edges:a,size:l=96})=>{const n=Math.min(...o.map(d=>d.x)),S=Math.max(...o.map(d=>d.x)),f=Math.min(...o.map(d=>d.y)),b=Math.max(...o.map(d=>d.y)),v=S-n||1,w=b-f||1,g=.18,c=o.map(d=>({x:(d.x-n)/v*(1-g*2)+g,y:(d.y-f)/w*(1-g*2)+g}));return e.jsxs("svg",{viewBox:"0 0 1 1",width:l,height:l,preserveAspectRatio:"xMidYMid meet","aria-hidden":"true",children:[a.map(([d,z],O)=>e.jsx("line",{x1:c[d].x,y1:c[d].y,x2:c[z].x,y2:c[z].y,stroke:"rgba(212, 175, 55, 0.55)",strokeWidth:"0.012",strokeLinecap:"round"},O)),c.map((d,z)=>e.jsx("circle",{cx:d.x,cy:d.y,r:"0.025",fill:"#fff8d5"},z))]})},Te=()=>{const o=m.useRef(null),[a,l]=m.useState(y.IDLE),[n,S]=m.useState(0),[f,b]=m.useState(new Set),[v,w]=m.useState([]),[g,c]=m.useState(null),[d,z]=m.useState({x:0,y:0}),[O,q]=m.useState(!1),[B,$]=m.useState(!1),[G,Q]=m.useState(null),[U,W]=m.useState(0),[V,F]=m.useState(0),[ee,ce]=m.useState(()=>Math.floor(Math.random()*1e5)),x=D[n],te=m.useMemo(()=>ke(x,ee+n*137),[x,ee,n]),M=m.useMemo(()=>x.stars.map(le),[x]),I=m.useMemo(()=>[...M.map((s,t)=>({...s,constIdx:t,size:1.6})),...te.map(s=>({...s,constIdx:null}))],[M,te]),T=m.useMemo(()=>new Set(x.edges.map(([s,t])=>J(s,t))),[x]);m.useEffect(()=>{const s=o.current;if(!s)return;const t=s.getContext("2d");let i,j=performance.now();const N=E=>{const u=(E-j)/1e3,H=t.createRadialGradient(p/2,h/2,100,p/2,h/2,Math.max(p,h)*.7);H.addColorStop(0,"#142035"),H.addColorStop(.6,"#0c1729"),H.addColorStop(1,"#070d1c"),t.fillStyle=H,t.fillRect(0,0,p,h);const K=t.createRadialGradient(p*.25,h*.7,20,p*.25,h*.7,420);K.addColorStop(0,"rgba(120, 90, 180, 0.10)"),K.addColorStop(1,"rgba(120, 90, 180, 0)"),t.fillStyle=K,t.fillRect(0,0,p,h);const Z=t.createRadialGradient(p*.78,h*.25,20,p*.78,h*.25,380);Z.addColorStop(0,"rgba(190, 120, 80, 0.08)"),Z.addColorStop(1,"rgba(190, 120, 80, 0)"),t.fillStyle=Z,t.fillRect(0,0,p,h),t.strokeStyle="rgba(212, 175, 55, 0.25)",t.lineWidth=1,t.strokeRect(8,8,p-16,h-16),t.strokeStyle="rgba(212, 175, 55, 0.12)",t.strokeRect(18,18,p-36,h-36),O&&a===y.PLAYING&&(t.strokeStyle="rgba(212, 175, 55, 0.18)",t.lineWidth=1,t.setLineDash([4,6]),x.edges.forEach(([r,k])=>{t.beginPath(),t.moveTo(M[r].x,M[r].y),t.lineTo(M[k].x,M[k].y),t.stroke()}),t.setLineDash([]));const X=f.size===T.size&&T.size>0;if(x.edges.forEach(([r,k])=>{const L=J(r,k);if(!f.has(L))return;const C=M[r],Y=M[k],P=t.createLinearGradient(C.x,C.y,Y.x,Y.y);P.addColorStop(0,"rgba(212, 175, 55, 0.95)"),P.addColorStop(.5,"rgba(255, 232, 150, 1)"),P.addColorStop(1,"rgba(212, 175, 55, 0.95)"),t.strokeStyle=P,t.lineWidth=X?2:1.6,t.shadowColor="rgba(255, 215, 100, 0.85)",t.shadowBlur=X?14:8,t.beginPath(),t.moveTo(C.x,C.y),t.lineTo(Y.x,Y.y),t.stroke(),t.shadowBlur=0}),G){const r=(E-G.time)/600;if(r<1){const k=I[G.a],L=I[G.b];t.strokeStyle=`rgba(196, 69, 42, ${1-r})`,t.lineWidth=1.5,t.setLineDash([4,4]),t.beginPath(),t.moveTo(k.x,k.y),t.lineTo(L.x,L.y),t.stroke(),t.setLineDash([])}}if(g!=null&&a===y.PLAYING){const r=I[g];t.strokeStyle="rgba(212, 175, 55, 0.4)",t.lineWidth=.8,t.setLineDash([3,5]),t.beginPath(),t.moveTo(r.x,r.y),t.lineTo(d.x,d.y),t.stroke(),t.setLineDash([])}I.forEach((r,k)=>{const L=.7+.3*Math.sin(u*(r.twinkleSpeed||1)+(r.twinkleOffset||k*.4)),C=r.constIdx!=null,P=(C?2.2:(r.size||1)*1.2)*(.85+.25*L),he=g===k,ie=C&&[...f].some(A=>A.split("-").includes(String(r.constIdx)));if(C&&(ie||X)){const A=t.createRadialGradient(r.x,r.y,0,r.x,r.y,18);A.addColorStop(0,"rgba(255, 232, 150, 0.55)"),A.addColorStop(.5,"rgba(212, 175, 55, 0.18)"),A.addColorStop(1,"rgba(212, 175, 55, 0)"),t.fillStyle=A,t.beginPath(),t.arc(r.x,r.y,18,0,Math.PI*2),t.fill()}const fe=ie||X?"#fff0b8":C?"#fff8d5":"#e6dfbe";t.fillStyle=fe;const ge=C?.5:.25;if(t.shadowColor=`rgba(255, 240, 200, ${ge*L})`,t.shadowBlur=C?6:3,t.beginPath(),t.arc(r.x,r.y,P,0,Math.PI*2),t.fill(),t.shadowBlur=0,he){const A=.6+.4*Math.sin(u*6);t.strokeStyle=`rgba(255, 215, 100, ${.5+.5*A})`,t.lineWidth=1.4,t.beginPath(),t.arc(r.x,r.y,P+5+A*2,0,Math.PI*2),t.stroke()}B&&C&&x.starNames[r.constIdx]&&(t.fillStyle="rgba(212, 175, 55, 0.75)",t.font="italic 10px Cardo, serif",t.textAlign="left",t.fillText(x.starNames[r.constIdx],r.x+8,r.y-6))}),i=requestAnimationFrame(N)};return i=requestAnimationFrame(N),()=>cancelAnimationFrame(i)},[x,M,I,f,T,g,d,O,G,a,B]);const de=(s,t)=>{let i=-1,j=1/0;return I.forEach((N,E)=>{const u=Math.hypot(N.x-s,N.y-t);u<j&&u<16&&(i=E,j=u)}),i===-1?null:i},ae=s=>{const i=o.current.getBoundingClientRect(),j=p/i.width,N=h/i.height;return{x:(s.clientX-i.left)*j,y:(s.clientY-i.top)*N}},xe=s=>{const t=ae(s);z(t)},me=s=>{if(a!==y.PLAYING)return;const t=ae(s),i=de(t.x,t.y);if(i==null){c(null);return}if(g==null){c(i);return}if(g===i){c(null);return}W(u=>u+1);const j=I[g],N=I[i];if(j.constIdx==null||N.constIdx==null){Q({a:g,b:i,time:performance.now()}),F(u=>u+1),c(null);return}const E=J(j.constIdx,N.constIdx);if(T.has(E)&&!f.has(E)){const u=new Set(f);u.add(E),b(u),c(i),u.size===T.size&&($(!0),c(null))}else Q({a:g,b:i,time:performance.now()}),F(u=>u+1),c(null)},se=m.useCallback(()=>{l(y.PLAYING),S(0),b(new Set),w([]),c(null),q(!1),$(!1),F(0),W(0),ce(Math.floor(Math.random()*1e5))},[]),pe=m.useCallback(()=>{const s={id:x.id,name:x.name,attempts:U,errors:V};w(t=>[...t,s]),n+1>=D.length?l(y.COMPLETE):(S(t=>t+1),b(new Set),c(null),q(!1),$(!1),W(0),F(0))},[x,U,V,n]);m.useEffect(()=>{const s=document.createElement("link");return s.href="https://fonts.googleapis.com/css2?family=Italiana&family=Cardo:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap",s.rel="stylesheet",document.head.appendChild(s),()=>document.head.removeChild(s)},[]);const re=f.size,ne=T.size,oe=["I","II","III","IV","V"][n];return e.jsxs("div",{className:"cartographer-root relative min-h-screen text-[#e6dfbe] overflow-hidden",children:[e.jsx(ve,{title:"Constellation Cartographer | Fezcodex",description:"An atlas of celestial mechanics. Trace constellations on the night sky in the manner of the 1660 Cellarius Harmonia Macrocosmica.",keywords:["constellation","cartographer","astronomy","star chart","puzzle","celestial atlas","cellarius"]}),e.jsx("style",{children:`
        .cartographer-root {
          background:
            radial-gradient(ellipse at 14% 10%, rgba(212, 175, 55, 0.06), transparent 35%),
            radial-gradient(ellipse at 88% 90%, rgba(120, 90, 180, 0.08), transparent 40%),
            #060c1a;
          font-family: 'Cardo', 'EB Garamond', Georgia, serif;
        }
        .stars-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(1px 1px at 14% 22%, rgba(255, 248, 213, 0.85), transparent 50%),
            radial-gradient(1px 1px at 28% 67%, rgba(255, 248, 213, 0.7), transparent 50%),
            radial-gradient(1.5px 1.5px at 47% 32%, rgba(255, 240, 184, 0.9), transparent 50%),
            radial-gradient(1px 1px at 64% 78%, rgba(255, 248, 213, 0.6), transparent 50%),
            radial-gradient(1px 1px at 82% 18%, rgba(255, 248, 213, 0.85), transparent 50%),
            radial-gradient(1px 1px at 92% 52%, rgba(255, 248, 213, 0.5), transparent 50%),
            radial-gradient(1px 1px at 8% 84%, rgba(255, 248, 213, 0.7), transparent 50%),
            radial-gradient(1.5px 1.5px at 36% 6%, rgba(255, 240, 184, 0.6), transparent 50%);
        }
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.7 0 0 0 0 0.4 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.045;
          mix-blend-mode: overlay;
        }
        @keyframes shooting-star {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(-280px, 140px); opacity: 0; }
        }
        .shooting-star {
          position: fixed; pointer-events: none; z-index: 0;
          width: 2px; height: 2px;
          background: #fff8d5;
          border-radius: 50%;
          box-shadow: 0 0 8px 1px #fff8d5, 0 0 24px 6px rgba(255, 248, 213, 0.6);
          animation: shooting-star 6s ease-in-out infinite;
        }
        .shooting-star::after {
          content: ''; position: absolute; right: 100%; top: 50%;
          width: 80px; height: 1px;
          background: linear-gradient(to left, rgba(255, 248, 213, 0.7), transparent);
          transform: translateY(-50%);
        }

        .display-font {
          font-family: 'Italiana', 'Cardo', serif;
          letter-spacing: 0.005em;
        }
        .body-font { font-family: 'Cardo', 'EB Garamond', Georgia, serif; }
        .mono-font {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          letter-spacing: 0.28em;
        }

        .gold-text {
          background: linear-gradient(180deg, #f3dc8f 0%, #c9a35e 55%, #8a6534 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .running-header {
          position: fixed; top: 1.1rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.42em;
          color: rgba(212, 175, 55, 0.55);
          text-transform: uppercase;
        }
        .folio-mark-l {
          position: fixed; top: 1.1rem; left: 1.5rem;
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.32em;
          color: rgba(212, 175, 55, 0.55);
          text-transform: uppercase;
        }
        .corner-glyph {
          position: fixed; top: 1rem; right: 1.5rem;
          z-index: 5;
          color: rgba(212, 175, 55, 0.7);
        }

        .gold-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.7) 50%, rgba(212, 175, 55, 0.5) 80%, transparent);
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) backwards; }

        .atlas-frame {
          position: relative;
          padding: 14px;
          background: rgba(7, 13, 28, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow:
            inset 0 0 0 1px rgba(212, 175, 55, 0.08),
            0 30px 60px -20px rgba(0, 0, 0, 0.7);
        }
        .atlas-frame::before, .atlas-frame::after,
        .atlas-frame > .af-tr, .atlas-frame > .af-br {
          content: ''; position: absolute; width: 24px; height: 24px;
          border: 1px solid rgba(212, 175, 55, 0.6);
          pointer-events: none;
        }
        .atlas-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
        .atlas-frame::after { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
        .atlas-frame > .af-tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
        .atlas-frame > .af-br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

        .progress-pip {
          width: 10px; height: 10px;
          transform: rotate(45deg);
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.5);
          transition: all 0.3s ease;
        }
        .progress-pip.filled {
          background: #d4af37;
          box-shadow: 0 0 10px rgba(255, 215, 100, 0.6);
        }
        .progress-pip.current {
          border-color: #ffd866;
          background: rgba(255, 215, 100, 0.2);
        }

        .start-cta, .next-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 1rem;
          padding: 1.1rem 2.2rem;
          background: linear-gradient(180deg, rgba(20, 16, 8, 0.7), rgba(7, 13, 28, 0.7));
          border: 1px solid rgba(212, 175, 55, 0.6);
          color: #f3dc8f;
          font-family: 'Italiana', serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .start-cta:hover, .next-cta:hover {
          color: #fff5cc;
          border-color: rgba(255, 215, 100, 0.9);
          background: linear-gradient(180deg, rgba(40, 30, 12, 0.8), rgba(20, 16, 8, 0.8));
          box-shadow: 0 0 32px rgba(255, 215, 100, 0.18);
        }

        .ghost-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.65);
          padding: 0.5rem 1rem;
          border: 1px dashed rgba(212, 175, 55, 0.35);
          background: transparent;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .ghost-btn:hover {
          color: #ffd866;
          border-color: rgba(212, 175, 55, 0.7);
          border-style: solid;
          background: rgba(212, 175, 55, 0.05);
        }

        .lore-card {
          background:
            radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.05), transparent 60%),
            rgba(243, 231, 200, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 1.5rem 1.75rem;
          position: relative;
        }

        .stat-num {
          font-family: 'Italiana', serif;
          font-size: 2.4rem;
          line-height: 1;
          color: #f3dc8f;
        }

        canvas { cursor: crosshair; touch-action: none; }
      `}),e.jsx("div",{className:"stars-bg","aria-hidden":"true"}),e.jsx("div",{className:"grain","aria-hidden":"true"}),e.jsx("div",{className:"shooting-star",style:{top:"15%",left:"85%",animationDelay:"0s"}}),e.jsx("div",{className:"shooting-star",style:{top:"45%",left:"95%",animationDelay:"3.2s"}}),e.jsx("div",{className:"shooting-star",style:{top:"72%",left:"88%",animationDelay:"6.5s"}}),e.jsxs("div",{className:"folio-mark-l",children:["FOL. ",oe," · CAELORUM"]}),e.jsx("div",{className:"running-header",children:"⁘ Atlas Coelestis Stellatorum ⁘"}),e.jsx("div",{className:"corner-glyph",children:e.jsx(Ae,{size:40,className:"text-[#d4af37]"})}),e.jsxs("div",{className:"relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12",children:[e.jsxs(ue,{to:"/apps",className:"inline-flex items-center gap-2 mb-10 mono-font text-[10px] text-[#d4af37]/70 hover:text-[#ffd866] transition-colors uppercase",children:[e.jsx(ye,{weight:"bold",size:11}),e.jsx("span",{children:"Return to Apps"})]}),e.jsx("header",{className:"mb-12",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 items-end",children:[e.jsxs("div",{className:"lg:col-span-8 space-y-5",children:[e.jsx("div",{className:"reveal mono-font text-[10px] text-[#d4af37]/80",style:{animationDelay:"0.05s"},children:"Tabula I · Harmonia Macrocosmica · Anno MMXXVI"}),e.jsxs("h1",{className:"display-font reveal leading-[0.92]",style:{animationDelay:"0.15s"},children:[e.jsx("span",{className:"block text-[clamp(3rem,7vw,6.5rem)] gold-text italic",children:"Constellation"}),e.jsx("span",{className:"block text-[clamp(3rem,7vw,6.5rem)] text-[#e6dfbe] -mt-1",children:"Cartographer"})]}),e.jsx("p",{className:"reveal body-font italic text-lg md:text-xl text-[#e6dfbe]/75 max-w-2xl leading-relaxed",style:{animationDelay:"0.3s"},children:"An atlas of celestial mechanics. Find each constellation hidden amongst the stars and trace its lines in gold leaf, in the manner of Cellarius and his Harmonia Macrocosmica."}),e.jsxs("div",{className:"reveal flex items-center gap-4 max-w-md",style:{animationDelay:"0.4s"},children:[e.jsx("span",{className:"mono-font text-[9px] text-[#d4af37]/70 whitespace-nowrap",children:"V folios · gold leaf on midnight"}),e.jsx("span",{className:"flex-1 gold-rule"})]})]}),e.jsx("div",{className:"lg:col-span-4 reveal flex justify-start lg:justify-end",style:{animationDelay:"0.5s"},children:e.jsx(Ie,{className:"w-64 h-24 text-[#d4af37]"})})]})}),e.jsxs("main",{className:"grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10",children:[e.jsxs("section",{className:"lg:col-span-8 space-y-6",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("span",{className:"mono-font text-[10px] text-[#d4af37]/70",children:["FOLIO ",oe," OF V"]}),e.jsx("span",{className:"display-font italic text-2xl text-[#f3dc8f]",children:a===y.IDLE?"Awaiting opening of the atlas":x.name})]}),e.jsx("div",{className:"flex items-center gap-2",children:D.map((s,t)=>e.jsx("span",{className:`progress-pip ${t<n?"filled":""} ${t===n&&a!==y.IDLE?"current":""}`,"aria-hidden":"true"},t))})]}),e.jsxs("div",{className:"atlas-frame",children:[e.jsx("span",{className:"af-tr"}),e.jsx("span",{className:"af-br"}),e.jsxs("div",{className:"relative",children:[e.jsx("canvas",{ref:o,width:p,height:h,onClick:me,onPointerMove:xe,className:"block w-full h-auto",style:{aspectRatio:`${p} / ${h}`}}),e.jsxs("div",{className:"absolute top-4 left-4 mono-font text-[9px] text-[#d4af37]/50 pointer-events-none",children:["RA ",we(d.x)," · DEC ",Me(d.y)]}),e.jsxs("div",{className:"absolute top-4 right-4 mono-font text-[9px] text-[#d4af37]/50 pointer-events-none text-right",children:["EDGES ",re.toString().padStart(2,"0")," / ",ne.toString().padStart(2,"0")]}),e.jsxs(be,{children:[a===y.IDLE&&e.jsx(_.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.6},className:"absolute inset-0 flex items-center justify-center",style:{background:"radial-gradient(ellipse at center, rgba(7, 13, 28, 0.7), rgba(7, 13, 28, 0.92))"},children:e.jsxs("div",{className:"text-center space-y-7 px-6 max-w-lg",children:[e.jsx("div",{className:"mono-font text-[10px] text-[#d4af37]/70 tracking-[0.5em]",children:"⁘ TABULA STELLARUM ⁘"}),e.jsx("div",{className:"display-font italic text-4xl md:text-5xl gold-text leading-tight",children:"Open the Atlas"}),e.jsx("div",{className:"body-font italic text-base text-[#e6dfbe]/70 max-w-md mx-auto",children:"Five folios await charting. Click two stars to draw a line between them. Lines that follow the canonical pattern lock in gold; errant strokes fade."}),e.jsxs("button",{type:"button",onClick:se,className:"start-cta",children:[e.jsx("span",{children:"Begin the Charting"}),e.jsx("span",{style:{fontSize:"1rem"},children:"✦"})]})]})},"idle"),a===y.PLAYING&&B&&e.jsx(_.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.6},className:"absolute bottom-4 left-1/2 -translate-x-1/2 z-10",children:e.jsxs("button",{type:"button",onClick:pe,className:"next-cta",children:[e.jsx("span",{children:n+1>=D.length?"Close the Atlas":"Continue to next folio"}),e.jsx("span",{children:"→"})]})},"revealed"),a===y.COMPLETE&&e.jsx(_.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8},className:"absolute inset-0 flex items-center justify-center p-6",style:{background:"radial-gradient(ellipse at center, rgba(7, 13, 28, 0.85), rgba(7, 13, 28, 0.97))"},children:e.jsxs("div",{className:"lore-card max-w-xl text-center space-y-5",children:[e.jsx("div",{className:"mono-font text-[10px] text-[#d4af37]/70 tracking-[0.5em]",children:"⁘ ATLAS COMPLETUS ⁘"}),e.jsx("div",{className:"display-font italic text-4xl gold-text",children:"The heavens are charted."}),e.jsx("div",{className:"body-font italic text-base text-[#e6dfbe]/75",children:"Five folios completed. The night sky surrenders its secrets to the patient cartographer."}),e.jsx("div",{className:"gold-rule"}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 pt-2",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"FOLIOS"}),e.jsx("div",{className:"stat-num",children:"V"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"EDGES"}),e.jsx("div",{className:"stat-num",children:D.reduce((s,t)=>s+t.edges.length,0)})]}),e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"ERRORS"}),e.jsx("div",{className:"stat-num",children:v.reduce((s,t)=>s+t.errors,0)})]})]}),e.jsxs("button",{type:"button",onClick:se,className:"start-cta mt-3",children:[e.jsx("span",{children:"Open Anew"}),e.jsx("span",{children:"✦"})]})]})},"complete")]})]})]}),e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{type:"button",className:"ghost-btn",disabled:a!==y.PLAYING,onClick:()=>q(s=>!s),style:{opacity:a!==y.PLAYING?.3:1},children:O?"⌁ Conceal Pattern":"⌁ Reveal Pattern"}),e.jsx("button",{type:"button",className:"ghost-btn",disabled:a!==y.PLAYING,onClick:()=>{b(new Set),c(null),$(!1),W(0),F(0)},style:{opacity:a!==y.PLAYING?.3:1},children:"⟲ Erase Strokes"})]}),e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/50",children:"Click two stars to draw an edge."})]})]}),e.jsxs("aside",{className:"lg:col-span-4 space-y-6",children:[e.jsxs("div",{className:"lore-card space-y-4",children:[e.jsxs("div",{className:"flex items-start justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"HOC FOLIO"}),e.jsx("div",{className:"display-font italic text-3xl gold-text leading-tight",children:x.name}),e.jsx("div",{className:"body-font italic text-sm text-[#e6dfbe]/70 mt-1",children:x.subtitle})]}),e.jsx("div",{className:"shrink-0 text-[#d4af37]",children:e.jsx(Ee,{stars:x.stars,edges:x.edges,size:84})})]}),e.jsx("div",{className:"gold-rule opacity-60"}),e.jsx("p",{className:"body-font italic text-sm text-[#e6dfbe]/65 leading-relaxed",children:x.epigraph}),B?e.jsxs(_.div,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},transition:{duration:.6},className:"space-y-3 pt-1",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/70",children:"⁘ LORE UNCHAINED ⁘"}),e.jsx("p",{className:"body-font text-sm text-[#e6dfbe]/85 leading-relaxed",children:x.lore})]}):e.jsx("p",{className:"body-font italic text-sm text-[#e6dfbe]/40 leading-relaxed",children:"Lore concealed until the pattern is traced in full."})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"EDGES"}),e.jsxs("div",{className:"stat-num",children:[re,e.jsxs("span",{className:"text-[#d4af37]/40",children:["/",ne]})]})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"STROKES"}),e.jsx("div",{className:"stat-num",children:U})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/60",children:"ERRANT"}),e.jsx("div",{className:"stat-num",style:{color:V>0?"#c4452a":void 0},children:V})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("h3",{className:"display-font italic text-xl text-[#e6dfbe]",children:"Folios Charted"}),e.jsxs("span",{className:"mono-font text-[9px] text-[#d4af37]/60",children:[v.length," / ",D.length]})]}),e.jsx("div",{className:"gold-rule opacity-60"}),e.jsx("div",{className:"space-y-2 pt-1",children:D.map((s,t)=>{const i=v.find(N=>N.id===s.id),j=t===n&&a===y.PLAYING;return e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:`mono-font text-[10px] ${i?"text-[#d4af37]":j?"text-[#ffd866]":"text-[#d4af37]/30"}`,children:["I","II","III","IV","V"][t]}),e.jsx("span",{className:`body-font italic ${i?"text-[#e6dfbe]/85":j?"text-[#ffd866]":"text-[#e6dfbe]/35"}`,children:s.name})]}),i&&e.jsx("span",{className:"mono-font text-[9px] text-[#d4af37]/60",children:i.errors===0?"PERFECT":`${i.errors} errant`})]},s.id)})})]})]})]}),e.jsxs("footer",{className:"mt-24 pt-8 border-t border-[#d4af37]/15 flex flex-col md:flex-row items-center justify-between gap-4",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/55",children:"⁘ Tabulae caelestes · Lordran-on-Sea · MMXXVI ⁘"}),e.jsx("div",{className:"mono-font text-[9px] text-[#d4af37]/50",children:"After Andreas Cellarius, 1660"})]})]})]})};export{Te as default};
