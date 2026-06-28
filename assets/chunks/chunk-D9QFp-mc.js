import{r as d,aa as pe,j as e,L as fe,b as ge,A as ye,m as X}from"../entries/pages.BLuD5Sbr.js";import{S as be}from"./chunk-BXUwrkms.js";import"./chunk-BXl3LOEh.js";/* empty css              */const l=800,s=400,k=12,f=90,n=9,z=7,A=5,ue=11,je=.18,M=10,Y=60,O=2,ve=`url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.10 0 0 0 0 0.23 0 0 0 0 0.32 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,we=["Whistle blown — kick off taken at the centre spot.","The crowd settles. Floodlights tilt to vertical.","Both keepers test the wind. Play resumes."],Ne=["A clinical strike, low and hard past the keeper.","HOME finds the corner — the cream stand erupts.","A deflected effort creeps in. They will all count.","Beautifully worked from the centre line."],ke=["AWAY break with pace and bury it.","A cool finish. The travelling support roar.","Clinical. AWAY restore parity.","Tucked into the side netting — no chance."],ee={HOME:"Full time. HOME take the points and the headlines.",AWAY:"Full time. AWAY silence the home faithful."},B=p=>p[Math.floor(Math.random()*p.length)],Me=p=>{const w=Math.floor(p/60),S=p%60;return`${w.toString().padStart(2,"0")}'${S.toString().padStart(2,"0")}`},te=({size:p=56})=>e.jsxs("svg",{viewBox:"0 0 60 72",width:p,height:p*72/60,"aria-hidden":"true",children:[e.jsx("path",{d:"M5 5 L55 5 L55 36 Q55 56 30 68 Q5 56 5 36 Z",fill:"#d94232",stroke:"#1a3a52",strokeWidth:"2.5"}),e.jsx("path",{d:"M14 22 L30 38 L46 22 L30 30 Z",fill:"#f3e9d2",stroke:"#1a3a52",strokeWidth:"1"}),e.jsx("circle",{cx:"30",cy:"52",r:"4",fill:"#f3e9d2",stroke:"#1a3a52",strokeWidth:"1"}),e.jsx("text",{x:"30",y:"14",textAnchor:"middle",fontSize:"6",fontFamily:"DM Mono, monospace",fill:"#f3e9d2",letterSpacing:"2",children:"H · F · C"})]}),ae=({size:p=56})=>e.jsxs("svg",{viewBox:"0 0 60 72",width:p,height:p*72/60,"aria-hidden":"true",children:[e.jsx("path",{d:"M5 5 L55 5 L55 36 Q55 56 30 68 Q5 56 5 36 Z",fill:"#1a3a52",stroke:"#d94232",strokeWidth:"2.5"}),e.jsx("rect",{x:"10",y:"22",width:"40",height:"3",fill:"#f3e9d2"}),e.jsx("rect",{x:"10",y:"30",width:"40",height:"3",fill:"#e8a838"}),e.jsx("rect",{x:"10",y:"38",width:"40",height:"3",fill:"#f3e9d2"}),e.jsx("circle",{cx:"30",cy:"54",r:"3.5",fill:"none",stroke:"#f3e9d2",strokeWidth:"1.5"}),e.jsx("text",{x:"30",y:"14",textAnchor:"middle",fontSize:"6",fontFamily:"DM Mono, monospace",fill:"#f3e9d2",letterSpacing:"2",children:"A · F · C"})]}),Se=({className:p=""})=>e.jsxs("svg",{viewBox:"0 0 200 60",className:p,fill:"none","aria-hidden":"true",children:[e.jsx("defs",{children:e.jsx("pattern",{id:"halftone-stadium",width:"3",height:"3",patternUnits:"userSpaceOnUse",children:e.jsx("circle",{cx:"1.5",cy:"1.5",r:"0.6",fill:"currentColor"})})}),e.jsx("path",{d:"M0 60 L0 40 L20 40 L25 28 L40 28 L42 18 L70 18 L72 10 L128 10 L130 18 L158 18 L160 28 L175 28 L180 40 L200 40 L200 60 Z",fill:"url(#halftone-stadium)"}),e.jsx("line",{x1:"0",y1:"40",x2:"200",y2:"40",stroke:"currentColor",strokeWidth:"0.6"}),[8,22,36,50,64,78,92,108,122,136,150,164,178,192].map((w,S)=>e.jsx("line",{x1:w,y1:S%2===0?12:14,x2:w,y2:3,stroke:"currentColor",strokeWidth:"0.5"},S))]}),Pe=()=>e.jsxs("svg",{className:"absolute right-0 top-2 bottom-2 hidden lg:block",width:"2","aria-hidden":"true",preserveAspectRatio:"none",children:[e.jsxs("pattern",{id:"perfs",width:"2",height:"14",patternUnits:"userSpaceOnUse",children:[e.jsx("circle",{cx:"1",cy:"3",r:"0.9",fill:"rgba(26, 58, 82, 0.45)"}),e.jsx("circle",{cx:"1",cy:"11",r:"0.9",fill:"rgba(26, 58, 82, 0.45)"})]}),e.jsx("rect",{width:"2",height:"100%",fill:"url(#perfs)"})]}),Ee=()=>{const{addToast:p}=d.useContext(pe),w=d.useRef(null),[S,F]=d.useState(0),[_,U]=d.useState(0),[u,L]=d.useState(!1),[N,se]=d.useState(!1),[G,C]=d.useState(null),[I,H]=d.useState({active:!1,scorer:null}),[P,ie]=d.useState(5),[T,K]=d.useState(0),[V,$]=d.useState([{min:0,text:"Programme on sale at the gates. Two pence, sixpence with crest."}]),le=d.useMemo(()=>Math.floor(Math.random()*700+200).toString().padStart(3,"0"),[]),r=d.useRef({playerPaddleY:s/2-f/2,aiPaddleY:s/2-f/2,ballX:l/2,ballY:s/2,ballDx:A,ballDy:A,ballSpeed:A,rallyHits:0,playerMoveUp:!1,playerMoveDown:!1,pointerY:null,obstacles:[],aiOffset:0}),R=d.useCallback((o,a)=>{$(j=>[{min:o,text:a},...j].slice(0,12))},[]),E=d.useCallback(o=>{const a=o==="player"?-1:o==="ai"||Math.random()>.5?1:-1;r.current.ballX=l/2,r.current.ballY=s/2,r.current.ballSpeed=A,r.current.ballDx=a*A,r.current.ballDy=(Math.random()-.5)*A*.6,r.current.rallyHits=0,r.current.aiOffset=(Math.random()-.5)*30},[]),W=d.useCallback(()=>{r.current.obstacles=[{x:l/4-M/2,y:s/4,width:M,height:Y,dy:O},{x:l/4-M/2,y:s*3/4-Y,width:M,height:Y,dy:-O},{x:l*3/4-M/2,y:s/4,width:M,height:Y,dy:-O},{x:l*3/4-M/2,y:s*3/4-Y,width:M,height:Y,dy:O}]},[]),Q=d.useCallback(()=>{F(0),U(0),L(!1),C(null),H({active:!1,scorer:null}),K(0),$([{min:0,text:B(we)}]),E(),W(),r.current.playerPaddleY=s/2-f/2,r.current.aiPaddleY=s/2-f/2,se(!0),p({message:"Kick off — first whistle blown.",type:"info"})},[E,W,p]);d.useEffect(()=>{const o=document.createElement("link");return o.href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;800;900&family=Newsreader:ital,wght@0,400;0,500;1,300;1,400;1,500&family=DM+Mono:wght@400;500&display=swap",o.rel="stylesheet",document.head.appendChild(o),()=>document.head.removeChild(o)},[]),d.useEffect(()=>{if(!N||u||I.active)return;const o=setInterval(()=>K(a=>a+1),1e3);return()=>clearInterval(o)},[N,u,I.active]),d.useEffect(()=>{const o=w.current;if(!o)return;const a=o.getContext("2d");let j;const D=()=>{const x=Math.ceil(l/50);for(let h=0;h<x;h+=1)a.fillStyle=h%2===0?"#5a8c44":"#4a7a3a",a.fillRect(h*50,0,50,s);const c=a.createRadialGradient(l/2,s/2,100,l/2,s/2,500);c.addColorStop(0,"rgba(0,0,0,0)"),c.addColorStop(1,"rgba(0,0,0,0.35)"),a.fillStyle=c,a.fillRect(0,0,l,s),a.strokeStyle="rgba(243, 233, 210, 0.85)",a.lineWidth=2,a.beginPath(),a.moveTo(l/2,0),a.lineTo(l/2,s),a.stroke(),a.beginPath(),a.arc(l/2,s/2,60,0,Math.PI*2),a.stroke(),a.fillStyle="rgba(243, 233, 210, 0.9)",a.beginPath(),a.arc(l/2,s/2,3,0,Math.PI*2),a.fill();const y=70,i=200;a.strokeRect(0,s/2-i/2,y,i),a.strokeRect(l-y,s/2-i/2,y,i);const g=28,b=110;a.strokeRect(0,s/2-b/2,g,b),a.strokeRect(l-g,s/2-b/2,g,b),a.beginPath(),a.arc(50,s/2,40,-Math.PI/2.5,Math.PI/2.5),a.stroke(),a.beginPath(),a.arc(l-50,s/2,40,Math.PI-Math.PI/2.5,Math.PI+Math.PI/2.5),a.stroke();const v=12;a.beginPath(),a.arc(0,0,v,0,Math.PI/2),a.stroke(),a.beginPath(),a.arc(l,0,v,Math.PI/2,Math.PI),a.stroke(),a.beginPath(),a.arc(0,s,v,-Math.PI/2,0),a.stroke(),a.beginPath(),a.arc(l,s,v,Math.PI,-Math.PI/2),a.stroke(),a.fillStyle="rgba(26, 58, 82, 0.45)",a.fillRect(0,s/2-60,4,120),a.fillRect(l-4,s/2-60,4,120),a.strokeStyle="rgba(243, 233, 210, 0.18)",a.lineWidth=1;for(let h=s/2-60;h<s/2+60;h+=6)a.beginPath(),a.moveTo(0,h),a.lineTo(8,h+6),a.stroke();for(let h=s/2-60;h<s/2+60;h+=6)a.beginPath(),a.moveTo(l,h),a.lineTo(l-8,h+6),a.stroke()},m=(t,x,c,y)=>{a.fillStyle=c,a.fillRect(t,x,k,f),a.fillStyle=y,a.fillRect(t,x,k,4),a.fillRect(t,x+f-4,k,4),a.fillStyle="rgba(255,255,255,0.18)",a.fillRect(t+1,x+6,2,f-12)},de=t=>{a.fillStyle="rgba(232, 168, 56, 0.18)",a.fillRect(t.x,t.y,t.width,t.height),a.strokeStyle="rgba(232, 168, 56, 0.55)",a.lineWidth=1,a.strokeRect(t.x,t.y,t.width,t.height),a.fillStyle="rgba(232, 168, 56, 0.9)",a.fillRect(t.x,t.y,t.width,3),a.fillRect(t.x,t.y+t.height-3,t.width,3)},me=(t,x)=>{a.fillStyle="#f3e9d2",a.beginPath(),a.arc(t,x,n,0,Math.PI*2),a.fill(),a.fillStyle="#1a3a52",a.beginPath();for(let c=0;c<5;c+=1){const y=c/5*Math.PI*2-Math.PI/2,i=t+Math.cos(y)*n*.45,g=x+Math.sin(y)*n*.45;c===0?a.moveTo(i,g):a.lineTo(i,g)}a.closePath(),a.fill(),a.strokeStyle="#1a3a52",a.lineWidth=1.4,a.beginPath(),a.arc(t,x,n,0,Math.PI*2),a.stroke(),a.fillStyle="rgba(0,0,0,0.25)",a.beginPath(),a.ellipse(t,x+n+2,n*.7,1.5,0,0,Math.PI*2),a.fill()},Z=()=>{D(),r.current.obstacles.forEach(de),m(0,r.current.playerPaddleY,"#d94232","#f3e9d2"),m(l-k,r.current.aiPaddleY,"#1a3a52","#e8a838"),me(r.current.ballX,r.current.ballY)},xe=()=>{if(u||I.active||!N)return;const t=r.current;if(t.pointerY!=null){const g=t.pointerY-f/2-t.playerPaddleY,b=Math.sign(g)*Math.min(Math.abs(g),z*1.4);t.playerPaddleY=Math.max(0,Math.min(s-f,t.playerPaddleY+b))}else t.playerMoveUp&&(t.playerPaddleY=Math.max(0,t.playerPaddleY-z)),t.playerMoveDown&&(t.playerPaddleY=Math.min(s-f,t.playerPaddleY+z));const x=t.ballY+t.aiOffset-f/2,c=z*.72;t.aiPaddleY<x?t.aiPaddleY=Math.min(s-f,t.aiPaddleY+c):t.aiPaddleY>x&&(t.aiPaddleY=Math.max(0,t.aiPaddleY-c)),t.obstacles.forEach(i=>{i.y+=i.dy,(i.y<0||i.y+i.height>s)&&(i.dy*=-1)}),t.ballX+=t.ballDx,t.ballY+=t.ballDy,t.ballY-n<0?(t.ballY=n,t.ballDy*=-1):t.ballY+n>s&&(t.ballY=s-n,t.ballDy*=-1);const y=(i,g)=>{const h=(t.ballY-(i+f/2))/(f/2)*(Math.PI/3.2);t.rallyHits+=1,t.ballSpeed=Math.min(ue,A+t.rallyHits*je);const he=g==="left"?1:-1;t.ballDx=he*t.ballSpeed*Math.cos(h),t.ballDy=t.ballSpeed*Math.sin(h),t.aiOffset=(Math.random()-.5)*36};t.ballDx<0&&t.ballX-n<k&&t.ballX-n>-n&&t.ballY>t.playerPaddleY&&t.ballY<t.playerPaddleY+f&&(t.ballX=k+n,y(t.playerPaddleY,"left")),t.ballDx>0&&t.ballX+n>l-k&&t.ballX+n<l+n&&t.ballY>t.aiPaddleY&&t.ballY<t.aiPaddleY+f&&(t.ballX=l-k-n,y(t.aiPaddleY,"right")),t.obstacles.forEach(i=>{if(!(t.ballX+n>i.x&&t.ballX-n<i.x+i.width&&t.ballY+n>i.y&&t.ballY-n<i.y+i.height))return;const b=Math.min(t.ballX+n-i.x,i.x+i.width-(t.ballX-n)),v=Math.min(t.ballY+n-i.y,i.y+i.height-(t.ballY-n));b<v?(t.ballDx*=-1,t.ballX+=t.ballX<i.x+i.width/2?-b:b):(t.ballDy*=-1,t.ballY+=t.ballY<i.y+i.height/2?-v:v)}),t.ballX<-n?q("AI"):t.ballX>l+n&&q("Player")},q=t=>{H({active:!0,scorer:t});const x=Math.floor(T/60)+1;R(x,B(t==="Player"?Ne:ke)),setTimeout(()=>{H({active:!1,scorer:null}),t==="Player"?F(c=>c+1>=P?(L(!0),C("Player"),R(x,ee.HOME),c+1):(E("ai"),c+1)):U(c=>c+1>=P?(L(!0),C("AI"),R(x,ee.AWAY),c+1):(E("player"),c+1))},1100)},J=()=>{xe(),Z(),j=requestAnimationFrame(J)};return N&&!u?J():Z(),()=>cancelAnimationFrame(j)},[N,u,E,I.active,P,W,T,R]),d.useEffect(()=>{const o=m=>m==="w"||m==="W"||m==="ArrowUp",a=m=>m==="s"||m==="S"||m==="ArrowDown",j=m=>{o(m.key)&&(r.current.playerMoveUp=!0,r.current.pointerY=null,m.key==="ArrowUp"&&m.preventDefault()),a(m.key)&&(r.current.playerMoveDown=!0,r.current.pointerY=null,m.key==="ArrowDown"&&m.preventDefault())},D=m=>{o(m.key)&&(r.current.playerMoveUp=!1),a(m.key)&&(r.current.playerMoveDown=!1)};return window.addEventListener("keydown",j),window.addEventListener("keyup",D),()=>{window.removeEventListener("keydown",j),window.removeEventListener("keyup",D)}},[]);const ne=o=>{const a=w.current;if(!a)return;const j=a.getBoundingClientRect(),D=s/j.height;r.current.pointerY=(o.clientY-j.top)*D},re=()=>{r.current.pointerY=null},oe=Me(T),ce=Math.floor(T/60)+1;return e.jsxs("div",{className:"matchday-root relative min-h-screen text-[#1a3a52]",children:[e.jsx(be,{title:"Soccer Pong | Fezcodex",description:"A pong-style soccer match presented as a 1974 risograph matchday programme. Outscore the AI to take the points.",keywords:["Fezcodex","soccer pong","pong","soccer","matchday","risograph","programme"]}),e.jsx("style",{children:`
        .matchday-root {
          background:
            radial-gradient(ellipse at 8% 6%, rgba(217, 66, 50, 0.10), transparent 35%),
            radial-gradient(ellipse at 94% 92%, rgba(26, 58, 82, 0.10), transparent 40%),
            #f3e9d2;
          font-family: 'Newsreader', 'Source Serif Pro', Georgia, serif;
        }
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: ${ve};
          background-size: 240px 240px;
          opacity: 0.18;
          mix-blend-mode: multiply;
        }
        .halftone-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, rgba(26, 58, 82, 0.08) 1px, transparent 1.4px);
          background-size: 14px 14px;
          mask-image: radial-gradient(ellipse at center, transparent 30%, black 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 30%, black 100%);
        }

        .display-font {
          font-family: 'Big Shoulders Display', 'Anton', 'Impact', sans-serif;
          font-weight: 800;
          letter-spacing: 0.005em;
        }
        .body-font { font-family: 'Newsreader', 'Source Serif Pro', Georgia, serif; }
        .mono-font {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          letter-spacing: 0.18em;
        }

        .running-header {
          position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.4em;
          color: rgba(26, 58, 82, 0.55);
          text-transform: uppercase;
        }
        .corner-stamp {
          position: fixed; top: 1.25rem; right: 1.5rem;
          z-index: 5;
          padding: 0.4rem 0.7rem;
          border: 1.5px solid rgba(217, 66, 50, 0.6);
          color: #d94232;
          font-family: 'DM Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          transform: rotate(-4deg);
          background: rgba(243, 233, 210, 0.6);
        }
        .folio-mark {
          position: fixed; top: 1.25rem; left: 1.5rem;
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.32em;
          color: rgba(26, 58, 82, 0.55);
          text-transform: uppercase;
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) backwards; }

        .bar-rule {
          height: 4px;
          background: linear-gradient(to right, #d94232 0%, #d94232 30%, #1a3a52 30%, #1a3a52 70%, #e8a838 70%, #e8a838 100%);
        }
        .ink-rule { height: 1.5px; background: #1a3a52; }

        .ticket-stub {
          position: relative;
          background:
            radial-gradient(circle at top right, transparent 6px, rgba(243, 233, 210, 0.6) 6px),
            #f7eed5;
          border: 1.5px solid rgba(26, 58, 82, 0.85);
          padding: 1.75rem 1.75rem 1.5rem;
        }
        .ticket-stub::before {
          content: '';
          position: absolute; top: -2px; left: 12px; right: 12px;
          height: 4px;
          background: repeating-linear-gradient(90deg, #d94232 0 6px, transparent 6px 12px);
        }

        .kickoff-btn {
          position: relative;
          width: 100%;
          padding: 1.1rem 1.4rem;
          background: #d94232;
          color: #f3e9d2;
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: 2px solid #1a3a52;
          box-shadow: 4px 4px 0 #1a3a52;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .kickoff-btn:hover {
          background: #c93222;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #1a3a52;
        }
        .kickoff-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 0 #1a3a52;
        }
        .kickoff-btn:disabled {
          opacity: 0.45; cursor: not-allowed;
        }

        .abort-btn {
          width: 100%;
          padding: 0.85rem 1rem;
          background: transparent;
          color: rgba(26, 58, 82, 0.7);
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          border: 1.5px solid rgba(26, 58, 82, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .abort-btn:hover {
          background: rgba(26, 58, 82, 0.06);
          color: #1a3a52;
          border-color: #1a3a52;
        }

        .score-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(26, 58, 82, 0.4);
          padding: 0.4rem 0;
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          color: #1a3a52;
          outline: none;
          transition: border-color 0.2s;
        }
        .score-input:focus { border-bottom-color: #d94232; }
        .score-input:disabled { opacity: 0.4; }

        .arena-frame {
          position: relative;
          padding: 18px;
          background:
            linear-gradient(135deg, #1a3a52 0%, #1a3a52 100%);
          box-shadow: 8px 8px 0 rgba(217, 66, 50, 0.85);
        }
        .arena-frame::before {
          content: '';
          position: absolute; inset: 4px;
          border: 1px solid rgba(243, 233, 210, 0.25);
          pointer-events: none;
        }

        .scoreline-digit {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          line-height: 0.85;
          font-size: clamp(4rem, 8vw, 7rem);
          color: #1a3a52;
          letter-spacing: -0.04em;
        }
        .scoreline-digit.home { color: #d94232; }
        .scoreline-divider {
          font-family: 'Big Shoulders Display', sans-serif;
          font-size: clamp(3rem, 6vw, 5rem);
          color: rgba(26, 58, 82, 0.4);
          font-weight: 400;
          line-height: 1;
        }

        .commentary-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.85rem;
          padding: 0.6rem 0;
          border-bottom: 1px dashed rgba(26, 58, 82, 0.2);
        }
        .commentary-row:last-child { border-bottom: 0; }
        .commentary-min {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #d94232;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .commentary-text {
          font-family: 'Newsreader', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: rgba(26, 58, 82, 0.85);
          line-height: 1.4;
        }

        .goal-stamp {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: clamp(4rem, 12vw, 9rem);
          color: #d94232;
          letter-spacing: 0.02em;
          padding: 0.9rem 2.2rem;
          border: 8px solid #d94232;
          background: rgba(217, 66, 50, 0.08);
          text-shadow: 3px 3px 0 rgba(243, 233, 210, 0.5);
          filter: contrast(1.05);
        }

        .key-cap {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 1.85rem; height: 1.85rem;
          border: 1.5px solid #1a3a52;
          background: #f7eed5;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: #1a3a52;
          box-shadow: 2px 2px 0 rgba(26, 58, 82, 0.6);
        }

        .commentary-scroll {
          max-height: 260px;
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(26, 58, 82, 0.3) transparent;
        }
        .commentary-scroll::-webkit-scrollbar { width: 5px; }
        .commentary-scroll::-webkit-scrollbar-thumb { background: rgba(26, 58, 82, 0.3); }

        .award-card {
          padding: 1.5rem 1.75rem;
          background: #f7eed5;
          border: 1.5px solid #1a3a52;
          box-shadow: 4px 4px 0 #d94232;
        }

        .canvas-cursor { cursor: ns-resize; }
      `}),e.jsx("div",{className:"grain","aria-hidden":"true"}),e.jsx("div",{className:"halftone-bg","aria-hidden":"true"}),e.jsx("div",{className:"folio-mark",children:"FOL. III · MATCHDAY № 147"}),e.jsx("div",{className:"running-header",children:"⌁ The Risograph Annual of Athletic Geometries ⌁"}),e.jsx("div",{className:"corner-stamp",children:"Imprimatur · MMXXVI"}),e.jsxs("div",{className:"relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12",children:[e.jsxs(fe,{to:"/apps",className:"inline-flex items-center gap-2 mb-10 mono-font text-[10px] text-[#1a3a52]/70 hover:text-[#d94232] transition-colors uppercase",children:[e.jsx(ge,{weight:"bold",size:11}),e.jsx("span",{children:"Return to Apps"})]}),e.jsxs("header",{className:"mb-16",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8 items-end",children:[e.jsxs("div",{className:"lg:col-span-7 space-y-5",children:[e.jsx("div",{className:"reveal mono-font text-[10px] text-[#d94232]",style:{animationDelay:"0.05s"},children:"Liber IV · Programme Officiel · Volume IV"}),e.jsxs("h1",{className:"display-font reveal leading-[0.78] tracking-tight",style:{animationDelay:"0.15s"},children:[e.jsx("span",{className:"block text-[clamp(3.5rem,10vw,8.5rem)] text-[#1a3a52]",children:"Soccer"}),e.jsx("span",{className:"block text-[clamp(3.5rem,10vw,8.5rem)] text-[#d94232] -mt-3",style:{fontStyle:"italic"},children:"Pong."})]}),e.jsxs("p",{className:"reveal body-font italic text-lg md:text-xl text-[#1a3a52]/80 max-w-xl leading-relaxed",style:{animationDelay:"0.3s"},children:["A binary athletics fixture, presented in two-ink offset for the discerning supporter. Outscore the visiting computation by"," ",e.jsx("span",{className:"not-italic font-semibold text-[#d94232]",children:P})," ","clear strikes."]}),e.jsxs("div",{className:"reveal flex items-center gap-3 max-w-md",style:{animationDelay:"0.4s"},children:[e.jsxs("span",{className:"mono-font text-[9px] text-[#1a3a52]/60 whitespace-nowrap",children:["Riso №",P.toString().padStart(2,"0")," / 2 colours"]}),e.jsx("span",{className:"flex-1 ink-rule"})]})]}),e.jsxs("div",{className:"lg:col-span-5 reveal",style:{animationDelay:"0.5s"},children:[e.jsxs("div",{className:"flex items-center justify-between gap-4 px-4 py-5 border-y-[3px] border-[#1a3a52]",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(te,{size:62}),e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"HOME"}),e.jsx("div",{className:"display-font text-2xl text-[#1a3a52]",children:"Hollow F.C."})]})]}),e.jsxs("div",{className:"flex items-baseline gap-3",children:[e.jsx("span",{className:"scoreline-digit home",children:S.toString().padStart(2,"0")}),e.jsx("span",{className:"scoreline-divider",children:":"}),e.jsx("span",{className:"scoreline-digit",children:_.toString().padStart(2,"0")})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"AWAY"}),e.jsx("div",{className:"display-font text-2xl text-[#1a3a52]",children:"Algorithm A.C."})]}),e.jsx(ae,{size:62})]})]}),e.jsxs("div",{className:"flex items-center justify-between mt-3 px-2",children:[e.jsxs("div",{className:"mono-font text-[10px] text-[#1a3a52]/70",children:["CLOCK ",e.jsx("span",{className:"text-[#d94232] font-bold ml-1",children:oe})]}),e.jsxs("div",{className:"mono-font text-[10px] text-[#1a3a52]/70",children:["FIRST TO ",P.toString().padStart(2,"0")]}),e.jsxs("div",{className:"mono-font text-[10px] text-[#1a3a52]/70",children:["MIN ",e.jsxs("span",{className:"text-[#d94232] font-bold ml-1",children:[ce.toString().padStart(2,"0"),"'"]})]})]})]})]}),e.jsx("div",{className:"reveal mt-10 bar-rule",style:{animationDelay:"0.6s"}})]}),e.jsxs("main",{className:"grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12",children:[e.jsxs("aside",{className:"lg:col-span-4 space-y-8 relative",children:[e.jsx(Pe,{}),e.jsxs("section",{className:"ticket-stub reveal",style:{animationDelay:"0.7s"},children:[e.jsxs("div",{className:"flex items-baseline justify-between mb-5",children:[e.jsxs("div",{children:[e.jsx("div",{className:"display-font text-3xl text-[#d94232] leading-none",children:"Admit One."}),e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/70 mt-2",children:"Section B · Row XII · Seat 4"})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/70",children:"No."}),e.jsx("div",{className:"display-font text-3xl text-[#1a3a52] leading-none",children:le})]})]}),e.jsx("div",{className:"ink-rule mb-5 opacity-50"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"mono-font text-[9px] text-[#1a3a52]/70 block",children:"Target Score"}),e.jsx("input",{type:"number",min:"1",max:"20",value:P,onChange:o=>ie(Math.max(1,Math.min(20,parseInt(o.target.value,10)||1))),disabled:N&&!u,className:"score-input"})]}),!N||u?e.jsxs("button",{type:"button",onClick:Q,className:"kickoff-btn",children:[e.jsx("span",{children:u?"Replay Fixture":"Kick Off"}),e.jsx("span",{style:{fontSize:"1.6rem",lineHeight:1},children:"⚽"})]}):e.jsx("button",{type:"button",onClick:()=>{L(!0),C(null)},className:"abort-btn",children:"Abandon Match"}),e.jsxs("div",{className:"flex items-center justify-between mt-2",children:[e.jsx("span",{className:"mono-font text-[8px] text-[#1a3a52]/60",children:"Kick Off · 15:00"}),e.jsx("span",{className:"mono-font text-[8px] text-[#1a3a52]/60",children:"Two pence, sixpence with crest"})]})]})]}),e.jsxs("section",{className:"reveal space-y-3",style:{animationDelay:"0.8s"},children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("h3",{className:"display-font text-xl text-[#1a3a52]",children:"Touchline Controls"}),e.jsx("span",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"§ Manus"})]}),e.jsx("div",{className:"ink-rule opacity-50"}),e.jsxs("div",{className:"space-y-3 pt-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"key-cap",children:"W"}),e.jsx("span",{className:"key-cap",children:"↑"})]}),e.jsx("span",{className:"mono-font text-[10px] text-[#1a3a52]/80",children:"Defend High"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"key-cap",children:"S"}),e.jsx("span",{className:"key-cap",children:"↓"})]}),e.jsx("span",{className:"mono-font text-[10px] text-[#1a3a52]/80",children:"Defend Low"})]}),e.jsx("div",{className:"flex items-center justify-between pt-2 border-t border-dashed border-[#1a3a52]/20",children:e.jsx("span",{className:"mono-font text-[10px] text-[#1a3a52]/80",children:"Or drag pointer over the pitch"})})]})]}),e.jsxs("section",{className:"reveal space-y-3",style:{animationDelay:"0.9s"},children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("h3",{className:"display-font text-xl text-[#1a3a52]",children:"Match Notes"}),e.jsx("span",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"§ Acta"})]}),e.jsx("div",{className:"ink-rule opacity-50"}),e.jsx("div",{className:"commentary-scroll",children:V.length===0?e.jsx("div",{className:"commentary-text py-2",children:"Awaiting first whistle."}):V.map((o,a)=>e.jsxs("div",{className:"commentary-row",children:[e.jsxs("span",{className:"commentary-min",children:[o.min.toString().padStart(2,"0"),"'"]}),e.jsx("span",{className:"commentary-text",children:o.text})]},a))})]})]}),e.jsxs("section",{className:"lg:col-span-8 space-y-8",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"mono-font text-[9px] text-[#1a3a52]/70",children:"FIXTURE"}),e.jsx("span",{className:"display-font text-2xl text-[#1a3a52]",style:{fontStyle:"italic"},children:"Hollow F.C. v Algorithm A.C."})]}),e.jsx(Se,{className:"w-32 h-10 text-[#1a3a52]/55"})]}),e.jsx("div",{className:"arena-frame reveal",style:{animationDelay:"0.7s"},children:e.jsxs("div",{className:"relative",children:[e.jsx("canvas",{ref:w,width:l,height:s,onPointerMove:ne,onPointerLeave:re,className:"block w-full h-auto canvas-cursor",style:{aspectRatio:`${l} / ${s}`,touchAction:"none"}}),e.jsxs(ye,{children:[!N&&!u&&e.jsx(X.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"absolute inset-0 flex flex-col items-center justify-center z-20",style:{background:"rgba(26, 58, 82, 0.84)"},children:e.jsxs("div",{className:"text-center space-y-5 px-6",children:[e.jsx("div",{className:"mono-font text-[10px] text-[#e8a838] tracking-[0.5em]",children:"⌁ AWAITING KICK OFF ⌁"}),e.jsx("div",{className:"display-font text-5xl md:text-6xl text-[#f3e9d2] leading-none",style:{fontStyle:"italic"},children:"The pitch is dressed."}),e.jsxs("div",{className:"body-font italic text-base text-[#f3e9d2]/80 max-w-md mx-auto",children:["Step onto the touchline. Press ",e.jsx("span",{className:"not-italic font-semibold text-[#e8a838]",children:"Kick Off"})," to begin the fixture."]})]})},"start"),I.active&&e.jsx(X.div,{initial:{scale:.4,rotate:-25,opacity:0},animate:{scale:1,rotate:-7,opacity:1},exit:{scale:1.5,rotate:-3,opacity:0},transition:{type:"spring",damping:9,stiffness:220},className:"absolute inset-0 flex items-center justify-center z-30 pointer-events-none",children:e.jsx("span",{className:"goal-stamp",children:"GOAL!"})},"goal"),u&&e.jsx(X.div,{initial:{opacity:0},animate:{opacity:1},className:"absolute inset-0 flex items-center justify-center z-40 p-6",style:{background:"rgba(26, 58, 82, 0.92)"},children:e.jsxs("div",{className:"award-card max-w-md w-full text-center space-y-5",children:[e.jsx("div",{className:"mono-font text-[10px] text-[#d94232] tracking-[0.4em]",children:"⌁ FULL TIME ⌁"}),e.jsxs("div",{className:"flex items-center justify-center gap-4",children:[G==="Player"?e.jsx(te,{size:70}):e.jsx(ae,{size:70}),e.jsxs("div",{className:"text-left",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/70",children:"Match Honours to"}),e.jsx("div",{className:"display-font text-3xl text-[#1a3a52] leading-none",style:{fontStyle:"italic"},children:G==="Player"?"Hollow F.C.":"Algorithm A.C."})]})]}),e.jsx("div",{className:"ink-rule opacity-50"}),e.jsxs("div",{className:"flex items-center justify-around",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"HOME"}),e.jsx("div",{className:"scoreline-digit home",style:{fontSize:"3rem"},children:S})]}),e.jsx("span",{className:"scoreline-divider",style:{fontSize:"2.5rem"},children:":"}),e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60",children:"AWAY"}),e.jsx("div",{className:"scoreline-digit",style:{fontSize:"3rem"},children:_})]})]}),e.jsxs("button",{type:"button",onClick:Q,className:"kickoff-btn",style:{fontSize:"1rem",padding:"0.85rem 1.2rem"},children:[e.jsx("span",{children:"Re-fixture"}),e.jsx("span",{style:{fontSize:"1.2rem",lineHeight:1},children:"↻"})]})]})},"end")]})]})}),e.jsxs("div",{className:"grid grid-cols-3 gap-6 pt-2",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60 mb-1",children:"RALLY"}),e.jsx("div",{className:"display-font text-3xl text-[#1a3a52]",children:r.current.rallyHits.toString().padStart(2,"0")})]}),e.jsxs("div",{children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60 mb-1",children:"VENUE"}),e.jsx("div",{className:"display-font text-3xl text-[#1a3a52]",children:"Terminal XXIII"})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/60 mb-1",children:"EDITION"}),e.jsx("div",{className:"display-font text-3xl text-[#d94232]",children:"Riso · 1974"})]})]})]})]}),e.jsxs("footer",{className:"mt-24 pt-8 border-t-[3px] border-[#1a3a52] flex flex-col md:flex-row items-start md:items-center justify-between gap-4",children:[e.jsx("div",{className:"mono-font text-[9px] text-[#1a3a52]/70",children:"⌁ Printed in two-ink halftone · Lordran-on-Sea · MMXXVI ⌁"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("span",{className:"bar-rule w-20 inline-block"}),e.jsx("span",{className:"mono-font text-[9px] text-[#1a3a52]/70",children:"Programme priced two pence"})]})]})]})]})};export{Ee as default};
