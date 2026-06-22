import{N as le,r as s,j as e,L as ne,b as ce,a3 as de}from"../entries/pages.DxDrk8tT.js";import{o as fe}from"./chunk-wBeSETI3.js";import{S as pe}from"./chunk-DkrbRqZJ.js";import{C as Q}from"./chunk-CBt7N5hu.js";import"./chunk-BXl3LOEh.js";/* empty css              */import"./chunk-CapCiz2q.js";const A={YOU_DIED:{text:"YOU DIED",textColor:"#7a0000",glowColor:"#ff1a1a",fontSize:140,fontFamily:"Cinzel",fontWeight:700,letterSpacing:14,overlayOpacity:.65,italic:!0,streakIntensity:.55,glowIntensity:.45,vignette:.5},VICTORY_ACHIEVED:{text:"VICTORY ACHIEVED",textColor:"#e6c66b",glowColor:"#ffcb4a",fontSize:100,fontFamily:"Cinzel",fontWeight:700,letterSpacing:8,overlayOpacity:.55,italic:!0,streakIntensity:.7,glowIntensity:.5,vignette:.45},ENEMY_FELLED:{text:"ENEMY FELLED",textColor:"#e6c66b",glowColor:"#ffcb4a",fontSize:110,fontFamily:"Cinzel",fontWeight:700,letterSpacing:6,overlayOpacity:.5,italic:!0,streakIntensity:.65,glowIntensity:.45,vignette:.4},GREAT_ENEMY_FELLED:{text:"GREAT ENEMY FELLED",textColor:"#f0d68c",glowColor:"#ffd866",fontSize:96,fontFamily:"Cinzel",fontWeight:700,letterSpacing:6,overlayOpacity:.6,italic:!0,streakIntensity:.85,glowIntensity:.6,vignette:.5},HEIR_OF_FIRE_DESTROYED:{text:"HEIR OF FIRE DESTROYED",textColor:"#f3dc8f",glowColor:"#ffd866",fontSize:84,fontFamily:"Cinzel",fontWeight:700,letterSpacing:6,overlayOpacity:.65,italic:!0,streakIntensity:.95,glowIntensity:.65,vignette:.55},GREAT_SOUL_EMBRACED:{text:"GREAT SOUL EMBRACED",textColor:"#f3dc8f",glowColor:"#ffd866",fontSize:86,fontFamily:"Cinzel",fontWeight:700,letterSpacing:6,overlayOpacity:.6,italic:!0,streakIntensity:.9,glowIntensity:.6,vignette:.5},HUMANITY_RESTORED:{text:"HUMANITY RESTORED",textColor:"#f5f1e0",glowColor:"#fff5cc",fontSize:96,fontFamily:"Cinzel",fontWeight:400,letterSpacing:8,overlayOpacity:.55,italic:!0,streakIntensity:.6,glowIntensity:.5,vignette:.4},BONFIRE_LIT:{text:"BONFIRE LIT",textColor:"#ffb347",glowColor:"#ff8c00",fontSize:110,fontFamily:"Cinzel",fontWeight:400,letterSpacing:6,overlayOpacity:.5,italic:!0,streakIntensity:.55,glowIntensity:.5,vignette:.45},AREA_NAME:{text:"ANOR LONDO",textColor:"#f0e6c8",glowColor:"#fff2b8",fontSize:72,fontFamily:"Cinzel",fontWeight:400,letterSpacing:14,overlayOpacity:.35,italic:!1,streakIntensity:.35,glowIntensity:.3,vignette:.35}},me=[{value:"Cinzel",label:"Cinzel (Souls)"},{value:"Cormorant Garamond",label:"Cormorant Garamond"},{value:"IM Fell English SC",label:"IM Fell (Archaic)"},{value:"Playfair Display",label:"Playfair Display"},{value:"Arvo",label:"Arvo"},{value:"Instrument Serif",label:"Instrument Serif"},{value:"Space Mono",label:"Space Mono"},{value:"JetBrains Mono",label:"JetBrains Mono"},{value:"VT323",label:"VT323 (Retro)"}],xe={YOU_DIED:"You Died",VICTORY_ACHIEVED:"Victory Achieved",ENEMY_FELLED:"Enemy Felled",GREAT_ENEMY_FELLED:"Great Enemy Felled",HEIR_OF_FIRE_DESTROYED:"Heir of Fire",GREAT_SOUL_EMBRACED:"Great Soul",HUMANITY_RESTORED:"Humanity Restored",BONFIRE_LIT:"Bonfire Lit",AREA_NAME:"Area Name"},ge={YOU_DIED:"crimson",VICTORY_ACHIEVED:"gold",ENEMY_FELLED:"gold",GREAT_ENEMY_FELLED:"gold",HEIR_OF_FIRE_DESTROYED:"gold",GREAT_SOUL_EMBRACED:"gold",HUMANITY_RESTORED:"pale",BONFIRE_LIT:"ember",AREA_NAME:"pale"},he={crimson:{border:"rgba(178, 34, 34, 0.35)",text:"#c44a4a",hoverBorder:"rgba(220, 70, 70, 0.7)",hoverBg:"rgba(110, 13, 18, 0.18)",hoverText:"#ff7a7a"},gold:{border:"rgba(176, 140, 79, 0.35)",text:"#b08c4f",hoverBorder:"rgba(212, 175, 55, 0.75)",hoverBg:"rgba(176, 140, 79, 0.10)",hoverText:"#e6c66b"},ember:{border:"rgba(200, 132, 30, 0.40)",text:"#c8841e",hoverBorder:"rgba(255, 179, 71, 0.75)",hoverBg:"rgba(200, 132, 30, 0.10)",hoverText:"#ffb347"},pale:{border:"rgba(216, 200, 154, 0.30)",text:"#d8c89a",hoverBorder:"rgba(232, 220, 196, 0.65)",hoverBg:"rgba(216, 200, 154, 0.08)",hoverText:"#f0e6c8"}},Y=["I","II","III"],b=(p,l)=>{const x=p.replace("#",""),i=x.length===3?x.split("").map(d=>d+d).join(""):x,r=parseInt(i.substring(0,2),16),n=parseInt(i.substring(2,4),16),u=parseInt(i.substring(4,6),16);return`rgba(${r}, ${n}, ${u}, ${l})`},be=`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 0.85 0 0 0 0 0.55 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,ue=({className:p=""})=>e.jsxs("svg",{viewBox:"0 0 24 24",className:p,fill:"none","aria-hidden":"true",children:[e.jsx("path",{d:"M12 2c0 4-2 6-4 6 2 0 4 2 4 6 0-4 2-6 4-6-2 0-4-2-4-6Z",fill:"currentColor",opacity:"0.85"}),e.jsx("circle",{cx:"12",cy:"12",r:"1",fill:"currentColor"}),e.jsx("path",{d:"M12 14c0 4-2 6-4 6 2 0 4 2 4 6 0-4 2-6 4-6-2 0-4-2-4-6Z",transform:"translate(0 -2)",fill:"currentColor",opacity:"0.6"})]}),ye=({tone:p="#b08c4f"})=>e.jsxs("div",{className:"flex items-center gap-4 w-full",style:{color:p},"aria-hidden":"true",children:[e.jsx("span",{className:"flex-1 h-px",style:{background:`linear-gradient(to right, transparent, ${b(p,.7)}, transparent)`}}),e.jsx(ue,{className:"w-4 h-4 shrink-0"}),e.jsx("span",{className:"flex-1 h-px",style:{background:`linear-gradient(to right, transparent, ${b(p,.7)}, transparent)`}})]}),ve=["#7a0000","#9d0a0a","#c44a4a","#ff1a1a","#c8841e","#ff8c00","#ffb347","#ffcb4a","#b08c4f","#d4af37","#e6c66b","#f3dc8f","#ffd866","#fff5cc","#d8c89a","#f0e6c8","#f5f1e0","#3a2a1a"];function Z({label:p,value:l,onChange:x}){return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70",children:p}),e.jsx("span",{className:"font-mono text-[10px] text-[#b08c4f]/80 tracking-widest uppercase",children:l})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("label",{className:"relative shrink-0 cursor-pointer",children:[e.jsx("input",{type:"color",value:l,onChange:i=>x(i.target.value),className:"absolute inset-0 opacity-0 cursor-pointer","aria-label":`${p} custom hue`}),e.jsx("span",{className:"block w-11 h-11 transition-shadow",style:{background:l,boxShadow:"0 0 0 1px rgba(176, 140, 79, 0.55), inset 0 0 0 2px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.6)"},"aria-hidden":"true"})]}),e.jsx("div",{className:"grid grid-cols-9 gap-1 flex-1",children:ve.map(i=>{const r=i.toLowerCase()===l.toLowerCase();return e.jsx("button",{type:"button",onClick:()=>x(i),className:"h-5 w-full transition-all",style:{background:i,boxShadow:r?"0 0 0 1px #fff5cc, 0 0 0 2px rgba(212, 175, 55, 0.6)":"0 0 0 1px rgba(176, 140, 79, 0.25)"},"aria-label":`Choose ${i}`},i)})})]})]})}function k({label:p,value:l,min:x=0,max:i=100,step:r=1,onChange:n}){const u=Math.max(0,Math.min(100,(l-x)/(i-x)*100)),d=r<1?Number(l).toFixed(2):Math.round(l);return e.jsxs("div",{className:"grimoire-slider space-y-2",children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-3",children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70",children:p}),e.jsx("span",{className:"font-mono text-[10px] text-[#e6c66b] tracking-wider",children:d})]}),e.jsxs("div",{className:"gs-track-area relative h-5 flex items-center",children:[e.jsx("span",{className:"gs-track"}),e.jsx("span",{className:"gs-fill",style:{width:`${u}%`}}),e.jsx("span",{className:"gs-tick",style:{left:"25%"}}),e.jsx("span",{className:"gs-tick",style:{left:"50%"}}),e.jsx("span",{className:"gs-tick",style:{left:"75%"}}),e.jsx("span",{className:"gs-thumb",style:{left:`${u}%`}}),e.jsx("input",{type:"range",min:x,max:i,step:r,value:l,onChange:m=>n(parseFloat(m.target.value)),className:"gs-input","aria-label":p})]})]})}function we({label:p,options:l,value:x,onChange:i}){const[r,n]=s.useState(!1),u=s.useRef(null);s.useEffect(()=>{if(!r)return;const m=v=>{u.current&&!u.current.contains(v.target)&&n(!1)};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[r]);const d=l.find(m=>m.value===x);return e.jsxs("div",{className:"relative",ref:u,children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70 block mb-2",children:p}),e.jsxs("button",{type:"button",onClick:()=>n(m=>!m),className:"w-full flex items-center justify-between gap-3 border-b border-[#b08c4f]/40 hover:border-[#d4af37] focus:border-[#d4af37] outline-none transition-colors py-2 group","aria-haspopup":"listbox","aria-expanded":r,children:[e.jsx("span",{className:"display-font italic text-lg text-[#f0e6c8] group-hover:text-[#fff5cc] transition-colors",style:{fontFamily:`"${x}", serif`},children:d?.label}),e.jsx("span",{className:"text-[#b08c4f] transition-transform duration-300",style:{transform:r?"rotate(180deg)":"rotate(0deg)"},"aria-hidden":"true",children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:e.jsx("path",{d:"M3 5 L7 9 L11 5",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),r&&e.jsx("div",{className:"absolute z-30 left-0 right-0 mt-1 bg-[#0a0807] border border-[#b08c4f]/40 max-h-72 overflow-y-auto shadow-[0_18px_40px_-10px_rgba(0,0,0,0.8)] grimoire-menu",role:"listbox",children:l.map(m=>{const v=m.value===x;return e.jsxs("button",{type:"button",role:"option","aria-selected":v,onClick:()=>{i(m.value),n(!1)},className:`w-full flex items-center justify-between px-4 py-2.5 text-base transition-colors text-left border-b border-[#b08c4f]/10 last:border-0 ${v?"bg-[#b08c4f]/10 text-[#e6c66b]":"text-[#d8c89a]/75 hover:bg-[#b08c4f]/8 hover:text-[#fff5cc]"}`,children:[e.jsx("span",{className:"italic",style:{fontFamily:`"${m.value}", serif`},children:m.label}),v&&e.jsx("span",{className:"text-[#d4af37] text-xs","aria-hidden":"true",children:"✦"})]},m.value)})})]})}const je=()=>e.jsxs("svg",{viewBox:"0 0 100 180",className:"w-24 h-44","aria-hidden":"true",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"flame-grad",cx:"50%",cy:"65%",r:"55%",children:[e.jsx("stop",{offset:"0%",stopColor:"#fff7d6"}),e.jsx("stop",{offset:"35%",stopColor:"#ffd866"}),e.jsx("stop",{offset:"70%",stopColor:"#ffb347"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(200,132,30,0)"})]}),e.jsxs("radialGradient",{id:"halo-grad",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"rgba(255,179,71,0.45)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(255,179,71,0)"})]})]}),e.jsx("circle",{cx:"50",cy:"55",r:"48",fill:"url(#halo-grad)",className:"halo",children:e.jsx("animate",{attributeName:"r",values:"44;52;44",dur:"4s",repeatCount:"indefinite"})}),e.jsx("rect",{x:"42",y:"80",width:"16",height:"80",fill:"#1a140e"}),e.jsx("rect",{x:"42",y:"80",width:"16",height:"3",fill:"#3a2a1a"}),e.jsx("path",{d:"M42 90 Q39 96 42 102",stroke:"#3a2a1a",strokeWidth:"2",fill:"none"}),e.jsx("path",{d:"M58 96 Q61 102 58 108",stroke:"#3a2a1a",strokeWidth:"2",fill:"none"}),e.jsx("line",{x1:"50",y1:"78",x2:"50",y2:"72",stroke:"#1a140e",strokeWidth:"1.5"}),e.jsxs("g",{className:"flame-flicker",children:[e.jsx("path",{d:"M50 75 Q43 60 47 45 Q49 35 50 22 Q51 35 53 45 Q57 60 50 75 Z",fill:"url(#flame-grad)"}),e.jsx("ellipse",{cx:"50",cy:"58",rx:"2.5",ry:"6",fill:"#fff7d6",opacity:"0.9"})]})]});function De(){const{addToast:p}=le(),[l,x]=s.useState(null),i=s.useRef(null),r=A.ENEMY_FELLED,[n,u]=s.useState(r.text),[d,m]=s.useState(r.fontSize),[v,G]=s.useState(r.textColor),[g,B]=s.useState(r.glowColor),[S,$]=s.useState(r.overlayOpacity),[j,H]=s.useState(r.letterSpacing),[F,K]=s.useState(50),[R,q]=s.useState(!0),[M,W]=s.useState(r.fontFamily),[L,V]=s.useState(r.fontWeight),[D,U]=s.useState(r.italic),[E,P]=s.useState(r.streakIntensity),[I,X]=s.useState(r.glowIntensity),[O,J]=s.useState(r.vignette),[ee,te]=s.useState("ENEMY_FELLED");s.useEffect(()=>{const a=document.createElement("link");return a.href="https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=IM+Fell+English+SC&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Arvo:wght@400;700&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@300;400;700&family=VT323&display=swap",a.rel="stylesheet",document.head.appendChild(a),()=>document.head.removeChild(a)},[]);const ae=s.useMemo(()=>Array.from({length:16}).map((a,t)=>({left:`${t*13.7%100}%`,size:1.5+t%3*.8,delay:-(t*1.9)%22,duration:16+t%5*3,drift:(t%2===0?1:-1)*(10+t%4*8),opacity:.4+t*17%5*.1})),[]),re=a=>{const t=a.target.files[0],w=new FileReader;w.onload=y=>{x(y.target.result)},t&&w.readAsDataURL(t)},z=s.useCallback(()=>{if(!l||!i.current)return;const a=i.current,t=a.getContext("2d"),w=new Image;w.crossOrigin="anonymous",w.src=l,w.onload=()=>{a.width=w.width,a.height=w.height,t.drawImage(w,0,0);const y=a.width/2,h=a.height*F/100;if(O>0){const o=Math.max(a.width,a.height)*.75,c=t.createRadialGradient(y,h,o*.35,y,h,o);c.addColorStop(0,"rgba(0,0,0,0)"),c.addColorStop(1,`rgba(0,0,0,${O})`),t.fillStyle=c,t.fillRect(0,0,a.width,a.height)}if(R){const o=d*3,c=h-o/2,f=t.createLinearGradient(0,c,0,c+o);f.addColorStop(0,"rgba(0,0,0,0)"),f.addColorStop(.18,`rgba(0,0,0,${S*.85})`),f.addColorStop(.5,`rgba(0,0,0,${S})`),f.addColorStop(.82,`rgba(0,0,0,${S*.85})`),f.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=f,t.fillRect(0,c,a.width,o)}if(I>0){const o=d*6,c=t.createRadialGradient(y,h,0,y,h,o);c.addColorStop(0,b(g,I*.85)),c.addColorStop(.35,b(g,I*.35)),c.addColorStop(1,b(g,0)),t.fillStyle=c,t.fillRect(0,h-o,a.width,o*2)}if(E>0){t.save(),t.globalCompositeOperation="lighter";const o=t.createLinearGradient(0,0,a.width,0);o.addColorStop(0,"rgba(0,0,0,0)"),o.addColorStop(.18,b(g,0)),o.addColorStop(.42,b(g,E*.6)),o.addColorStop(.5,b(g,E)),o.addColorStop(.58,b(g,E*.6)),o.addColorStop(.82,b(g,0)),o.addColorStop(1,"rgba(0,0,0,0)");const c=Math.max(2,d*.04);t.fillStyle=o,t.fillRect(0,h-c/2,a.width,c);const f=t.createLinearGradient(0,0,a.width,0);f.addColorStop(0,"rgba(0,0,0,0)"),f.addColorStop(.5,b(g,E*.35)),f.addColorStop(1,"rgba(0,0,0,0)");const N=d*.6;t.fillStyle=f,t.fillRect(0,h-N/2,a.width,N);const C=d*.45,T=t.createLinearGradient(0,0,a.width,0);T.addColorStop(0,"rgba(0,0,0,0)"),T.addColorStop(.5,b(g,E*.25)),T.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=T,t.fillRect(0,h-C,a.width,1),t.fillRect(0,h+C,a.width,1),t.restore()}t.save();const ie=D?"italic":"normal";t.font=`${ie} ${L} ${d}px "${M}", serif`,t.textAlign="center",t.textBaseline="middle";const _=()=>{if(j>0){const o=t.measureText(n).width+(n.length-1)*j;let c=y-o/2;for(let f=0;f<n.length;f++){const N=n[f],C=t.measureText(N).width;t.fillText(N,c+C/2,h),c+=C+j}}else t.fillText(n,y,h)};if(t.fillStyle=b(g,.9),t.shadowColor=g,t.shadowBlur=Math.max(30,d*.6),_(),t.shadowBlur=Math.max(14,d*.25),_(),t.shadowBlur=0,t.lineWidth=Math.max(1,d*.012),t.strokeStyle="rgba(0,0,0,0.55)",j>0){const o=t.measureText(n).width+(n.length-1)*j;let c=y-o/2;for(let f=0;f<n.length;f++){const N=n[f],C=t.measureText(N).width;t.strokeText(N,c+C/2,h),c+=C+j}}else t.strokeText(n,y,h);t.fillStyle=v,t.shadowColor=g,t.shadowBlur=Math.max(6,d*.1),_(),t.restore()}},[l,n,d,v,g,S,F,R,j,M,L,D,E,I,O]);s.useEffect(()=>{z(),document.fonts.ready.then(z)},[z]);const se=()=>{if(i.current){const a=i.current,t=document.createElement("a");t.download=`dark-souls-banner-${Date.now()}.png`,t.href=a.toDataURL("image/png"),t.click(),p({title:"Sealed",message:"Banner inscribed and preserved.",type:"success"})}},oe=a=>{const t=A[a];u(t.text),G(t.textColor),B(t.glowColor),m(t.fontSize),W(t.fontFamily),V(t.fontWeight),H(t.letterSpacing),$(t.overlayOpacity),U(t.italic),P(t.streakIntensity),X(t.glowIntensity),J(t.vignette),te(a)};return e.jsxs("div",{className:"souls-banner-root relative min-h-screen text-[#d8c89a] selection:bg-[#6e0d12] selection:text-[#f0e6c8] overflow-hidden",children:[e.jsx(pe,{title:"Dark Souls Banner Generator | Fezcodex",description:"Inscribe Dark Souls style banners — YOU DIED, VICTORY ACHIEVED, BONFIRE LIT, HEIR OF FIRE DESTROYED — with the signature horizontal light streaks and ornate glow.",keywords:["dark souls","you died","victory achieved","bonfire lit","banner generator","meme","image editor"]}),e.jsx("style",{children:`
        .souls-banner-root {
          background:
            radial-gradient(ellipse at 12% 8%, rgba(200, 132, 30, 0.08), transparent 45%),
            radial-gradient(ellipse at 88% 92%, rgba(110, 13, 18, 0.10), transparent 50%),
            radial-gradient(ellipse at 50% 50%, #0d0a08 0%, #050403 100%);
          font-family: 'Cormorant Garamond', 'Cormorant', Georgia, serif;
        }
        .grain-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: ${be};
          background-size: 220px 220px;
          opacity: 0.06;
          mix-blend-mode: overlay;
        }
        .vignette-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
        }
        .ember {
          position: absolute;
          bottom: -10px;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #ffb347;
          box-shadow: 0 0 6px rgba(255, 179, 71, 0.9), 0 0 14px rgba(255, 140, 0, 0.5);
          animation: ember-rise linear infinite;
          pointer-events: none;
        }
        @keyframes ember-rise {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
          8% { opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translate3d(var(--drift, 20px), -110vh, 0) scale(0.6); opacity: 0; }
        }
        @keyframes flame-flicker {
          0%, 100% { transform: scale(1, 1) translateY(0); opacity: 1; }
          25% { transform: scale(0.96, 1.06) translateY(-1px); opacity: 0.92; }
          50% { transform: scale(1.04, 0.95) translateY(1px); opacity: 1; }
          75% { transform: scale(0.98, 1.03) translateY(0); opacity: 0.95; }
        }
        .flame-flicker {
          transform-origin: 50px 75px;
          animation: flame-flicker 1.6s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(255, 179, 71, 0.55));
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .reveal {
          animation: reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        @keyframes hairline-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hairline-grow {
          transform-origin: left;
          animation: hairline-grow 1.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .display-font {
          font-family: 'IM Fell English SC', 'Cormorant Unicase', Georgia, serif;
          letter-spacing: 0.02em;
        }
        .body-font {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .label-font {
          font-family: 'JetBrains Mono', 'Space Mono', monospace;
          letter-spacing: 0.32em;
        }
        .gold-text {
          background: linear-gradient(180deg, #f3dc8f 0%, #b08c4f 55%, #6e4f1f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .gold-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(176, 140, 79, 0.55) 20%, rgba(212, 175, 55, 0.7) 50%, rgba(176, 140, 79, 0.55) 80%, transparent);
        }
        .corner-mark::before, .corner-mark::after {
          content: ''; position: absolute; width: 16px; height: 16px;
          border-color: rgba(176, 140, 79, 0.55);
          border-style: solid; border-width: 0;
        }
        .corner-mark.tl::before { top: -1px; left: -1px; border-top-width: 1px; border-left-width: 1px; }
        .corner-mark.tr::before { top: -1px; right: -1px; border-top-width: 1px; border-right-width: 1px; }
        .corner-mark.bl::after { bottom: -1px; left: -1px; border-bottom-width: 1px; border-left-width: 1px; }
        .corner-mark.br::after { bottom: -1px; right: -1px; border-bottom-width: 1px; border-right-width: 1px; }
        .corner-frame { position: relative; }
        .corner-frame::before, .corner-frame::after,
        .corner-frame > .cf-tr, .corner-frame > .cf-br {
          content: ''; position: absolute; width: 22px; height: 22px;
          border: 1px solid rgba(176, 140, 79, 0.55);
          pointer-events: none;
        }
        .corner-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
        .corner-frame::after { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
        .corner-frame > .cf-tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
        .corner-frame > .cf-br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

        .archaic-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(176, 140, 79, 0.4);
          color: #f0e6c8;
          font-family: 'IM Fell English SC', 'Cormorant Garamond', serif;
          letter-spacing: 0.18em;
          font-size: 1.25rem;
          padding: 0.5rem 0;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .archaic-input:focus {
          border-bottom-color: rgba(212, 175, 55, 0.95);
          color: #fff5cc;
        }

        .upload-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 1rem;
          padding: 1rem 2rem 1rem 1.4rem;
          background: linear-gradient(180deg, rgba(20, 14, 9, 0.6), rgba(8, 6, 4, 0.6));
          border: 1px solid rgba(176, 140, 79, 0.55);
          color: #e6c66b;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 0.78rem;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.4s ease, border-color 0.4s ease, transform 0.3s ease;
        }
        .upload-cta::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at left, rgba(255, 179, 71, 0.18), transparent 65%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .upload-cta:hover {
          color: #fff5cc;
          border-color: rgba(212, 175, 55, 0.9);
          transform: translateY(-1px);
        }
        .upload-cta:hover::before { opacity: 1; }
        .upload-cta .cap {
          font-size: 1.6rem; line-height: 1;
          color: #d4af37;
          font-family: 'IM Fell English SC', serif;
          padding-right: 0.85rem;
          border-right: 1px solid rgba(176, 140, 79, 0.4);
        }

        .seal-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 0.85rem;
          padding: 1rem 2.2rem;
          background: linear-gradient(180deg, #2a1c0d, #150d05);
          border: 1px solid rgba(212, 175, 55, 0.7);
          color: #f3dc8f;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .seal-cta:hover {
          background: linear-gradient(180deg, #3a2814, #1f1308);
          color: #fff5cc;
          box-shadow: 0 0 24px rgba(255, 179, 71, 0.25);
        }

        .preset-stamp {
          position: relative;
          padding: 0.85rem 0.6rem;
          border: 1px solid var(--stamp-border);
          color: var(--stamp-text);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.92rem;
          letter-spacing: 0.05em;
          text-align: center;
          cursor: pointer;
          transition: all 0.35s ease;
          background: transparent;
        }
        .preset-stamp::after {
          content: '';
          position: absolute; left: 50%; bottom: 6px;
          transform: translateX(-50%);
          width: 24px; height: 1px;
          background: var(--stamp-text);
          opacity: 0;
          transition: opacity 0.35s ease, width 0.35s ease;
        }
        .preset-stamp:hover {
          border-color: var(--stamp-hover-border);
          background: var(--stamp-hover-bg);
          color: var(--stamp-hover-text);
        }
        .preset-stamp:hover::after { opacity: 0.7; width: 36px; }
        .preset-stamp.active {
          border-color: var(--stamp-hover-border);
          background: var(--stamp-hover-bg);
          color: var(--stamp-hover-text);
        }
        .preset-stamp.active::after { opacity: 1; width: 36px; }

        .running-header {
          position: fixed; top: 1.25rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.42em;
          color: rgba(176, 140, 79, 0.55);
          text-transform: uppercase;
        }
        .folio-mark {
          position: fixed; top: 1.25rem; right: 1.5rem;
          z-index: 5;
          font-family: 'IM Fell English SC', serif;
          font-size: 0.85rem;
          color: rgba(176, 140, 79, 0.7);
          letter-spacing: 0.18em;
        }
        .folio-mark-l {
          position: fixed; top: 1.25rem; left: 1.5rem;
          z-index: 5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: rgba(176, 140, 79, 0.5);
          letter-spacing: 0.3em;
        }
        .footer-mark {
          font-family: 'IM Fell English SC', serif;
          font-size: 0.75rem;
          letter-spacing: 0.32em;
          color: rgba(176, 140, 79, 0.5);
          text-transform: uppercase;
        }

        .roman {
          font-family: 'IM Fell English SC', serif;
          font-size: 2.6rem;
          line-height: 1;
          background: linear-gradient(180deg, #d4af37, #6e4f1f);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes menu-enter {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grimoire-menu {
          animation: menu-enter 0.22s cubic-bezier(0.22, 1, 0.36, 1) backwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(176, 140, 79, 0.4) transparent;
        }
        .grimoire-menu::-webkit-scrollbar { width: 6px; }
        .grimoire-menu::-webkit-scrollbar-track { background: transparent; }
        .grimoire-menu::-webkit-scrollbar-thumb {
          background: rgba(176, 140, 79, 0.35);
        }
        .grimoire-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.6);
        }

        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }

        .grimoire-slider .gs-track {
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px;
          background: rgba(176, 140, 79, 0.22);
          transform: translateY(-50%);
          pointer-events: none;
        }
        .grimoire-slider .gs-fill {
          position: absolute; left: 0; top: 50%;
          height: 1px;
          background: linear-gradient(to right, rgba(176, 140, 79, 0.55), #d4af37);
          transform: translateY(-50%);
          pointer-events: none;
          transition: box-shadow 0.3s ease;
        }
        .grimoire-slider:hover .gs-fill,
        .grimoire-slider:focus-within .gs-fill {
          box-shadow: 0 0 8px rgba(255, 179, 71, 0.55);
        }
        .grimoire-slider .gs-tick {
          position: absolute; top: 50%;
          width: 1px; height: 6px;
          background: rgba(176, 140, 79, 0.28);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .grimoire-slider .gs-thumb {
          position: absolute; top: 50%;
          width: 10px; height: 10px;
          background: #1a140e;
          border: 1px solid #d4af37;
          transform: translate(-50%, -50%) rotate(45deg);
          transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, width 0.2s ease, height 0.2s ease;
          pointer-events: none;
          z-index: 2;
        }
        .grimoire-slider:hover .gs-thumb,
        .grimoire-slider:focus-within .gs-thumb {
          box-shadow: 0 0 14px rgba(255, 179, 71, 0.7), 0 0 2px rgba(255, 179, 71, 0.9);
          border-color: #ffd866;
          background: #2a1c0d;
        }
        .grimoire-slider:active .gs-thumb {
          width: 12px; height: 12px;
          background: #3a2814;
        }
        .grimoire-slider .gs-input {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          margin: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 3;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .grimoire-slider .gs-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px; height: 22px;
          background: transparent;
          cursor: pointer;
        }
        .grimoire-slider .gs-input::-moz-range-thumb {
          width: 22px; height: 22px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
      `}),e.jsx("div",{className:"grain-layer"}),e.jsx("div",{className:"vignette-layer"}),e.jsx("div",{className:"fixed inset-0 pointer-events-none z-0","aria-hidden":"true",children:ae.map((a,t)=>e.jsx("span",{className:"ember",style:{left:a.left,width:`${a.size}px`,height:`${a.size}px`,animationDelay:`${a.delay}s`,animationDuration:`${a.duration}s`,opacity:a.opacity,"--drift":`${a.drift}px`}},t))}),e.jsx("div",{className:"folio-mark-l",children:"FOL. I — CODEX"}),e.jsx("div",{className:"running-header",children:"⁘ Codex of Kindled Inscriptions ⁘"}),e.jsx("div",{className:"folio-mark",children:"✦"}),e.jsxs("div",{className:"relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12",children:[e.jsxs(ne,{to:"/apps",className:"inline-flex items-center gap-2 mb-12 text-[10px] label-font text-[#b08c4f]/70 hover:text-[#e6c66b] transition-colors",children:[e.jsx(ce,{weight:"bold",size:11}),e.jsx("span",{children:"Return to Apps"})]}),e.jsxs("header",{className:"mb-20",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-10 items-end",children:[e.jsxs("div",{className:"lg:col-span-8 space-y-7",children:[e.jsx("div",{className:"reveal label-font text-[10px] text-[#b08c4f]/80",style:{animationDelay:"0.05s"},children:"Liber I · Tractatus de Vexillis"}),e.jsxs("h1",{className:"display-font reveal leading-[0.95] tracking-tight",style:{animationDelay:"0.15s"},children:[e.jsx("span",{className:"block text-[clamp(3rem,8vw,7.5rem)] gold-text",children:"Banner of the"}),e.jsx("span",{className:"block text-[clamp(3rem,8vw,7.5rem)] italic body-font font-light text-[#f0e6c8] -mt-2",children:"Hollow"})]}),e.jsxs("div",{className:"reveal flex items-center gap-4 max-w-md",style:{animationDelay:"0.3s"},children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70 whitespace-nowrap",children:"Dark Souls Banner Generator"}),e.jsx("span",{className:"hairline-grow flex-1 h-px bg-[#b08c4f]/40"})]}),e.jsxs("p",{className:"reveal body-font italic text-lg md:text-xl text-[#d8c89a]/75 max-w-xl leading-relaxed",style:{animationDelay:"0.45s"},children:['"The flow of time itself is convoluted; with heroes centuries old phasing in and out."',e.jsx("span",{className:"block mt-2 not-italic text-xs label-font text-[#b08c4f]/60 tracking-[0.4em]",children:"— Hawkeye Gough"})]})]}),e.jsx("div",{className:"lg:col-span-4 reveal flex justify-start lg:justify-end",style:{animationDelay:"0.6s"},children:e.jsxs("label",{htmlFor:"image-upload",className:"upload-cta",children:[e.jsx("span",{className:"cap",children:"℣"}),e.jsxs("span",{className:"flex flex-col items-start gap-1",children:[e.jsx("span",{children:"Inscribe Vellum"}),e.jsx("span",{className:"text-[9px] tracking-[0.4em] text-[#b08c4f]/70 normal-case",children:"upload an effigy"})]}),e.jsx("input",{id:"image-upload",type:"file",accept:"image/*",onChange:re,className:"hidden"})]})})]}),e.jsx("div",{className:"reveal mt-14",style:{animationDelay:"0.75s"},children:e.jsx(ye,{})})]}),e.jsxs("main",{className:"grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-16",children:[e.jsxs("aside",{className:"lg:col-span-5 space-y-16 h-fit lg:sticky lg:top-12",children:[e.jsxs("section",{className:"reveal space-y-6",style:{animationDelay:"0.85s"},children:[e.jsxs("div",{className:"flex items-baseline gap-5",children:[e.jsx("span",{className:"roman",children:Y[0]}),e.jsxs("div",{children:[e.jsx("h2",{className:"display-font text-2xl text-[#f0e6c8]",children:"Inscription"}),e.jsx("p",{className:"label-font text-[9px] text-[#b08c4f]/70 mt-1",children:"Manus · Verbum · Forma"})]})]}),e.jsx("div",{className:"gold-rule"}),e.jsxs("div",{className:"space-y-7 pl-2",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"label-font text-[9px] text-[#b08c4f]/70 block",children:"Verbum"}),e.jsx("input",{type:"text",value:n,onChange:a=>u(a.target.value.toUpperCase()),className:"archaic-input"})]}),e.jsx(we,{label:"Typeform",options:me,value:M,onChange:W}),e.jsx(k,{label:"Weight",min:100,max:900,step:100,value:L,onChange:a=>V(a)}),e.jsx(k,{label:"Stature",min:20,max:400,value:d,onChange:a=>m(a)}),e.jsx(k,{label:"Tracking",min:0,max:50,value:j,onChange:a=>H(a)}),e.jsx(k,{label:"Elevation",min:0,max:100,value:F,onChange:a=>K(a)}),e.jsxs("div",{className:"flex items-center justify-between pt-1",children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70",children:"Slanted (italic)"}),e.jsx(Q,{variant:"brutalist",checked:D,onChange:()=>U(!D)})]})]})]}),e.jsxs("section",{className:"reveal space-y-6",style:{animationDelay:"0.95s"},children:[e.jsxs("div",{className:"flex items-baseline gap-5",children:[e.jsx("span",{className:"roman",children:Y[1]}),e.jsxs("div",{children:[e.jsx("h2",{className:"display-font text-2xl text-[#f0e6c8]",children:"Sigils"}),e.jsx("p",{className:"label-font text-[9px] text-[#b08c4f]/70 mt-1",children:"Stamped & Calibrated"})]})]}),e.jsx("div",{className:"gold-rule"}),e.jsx("div",{className:"grid grid-cols-3 gap-2 pl-2",children:Object.keys(A).map(a=>{const t=he[ge[a]];return e.jsx("button",{onClick:()=>oe(a),className:`preset-stamp ${ee===a?"active":""}`,style:{"--stamp-border":t.border,"--stamp-text":t.text,"--stamp-hover-border":t.hoverBorder,"--stamp-hover-bg":t.hoverBg,"--stamp-hover-text":t.hoverText},children:xe[a]},a)})})]}),e.jsxs("section",{className:"reveal space-y-6",style:{animationDelay:"1.05s"},children:[e.jsxs("div",{className:"flex items-baseline gap-5",children:[e.jsx("span",{className:"roman",children:Y[2]}),e.jsxs("div",{children:[e.jsx("h2",{className:"display-font text-2xl text-[#f0e6c8]",children:"Embers & Shadow"}),e.jsx("p",{className:"label-font text-[9px] text-[#b08c4f]/70 mt-1",children:"Lumen · Halitus · Tenebrae"})]})]}),e.jsx("div",{className:"gold-rule"}),e.jsxs("div",{className:"space-y-7 pl-2",children:[e.jsxs("div",{className:"grid grid-cols-1 gap-6",children:[e.jsx(Z,{label:"Hue of Letters",value:v,onChange:G}),e.jsx(Z,{label:"Hue of Glow",value:g,onChange:B})]}),e.jsxs("div",{className:"pt-2 border-t border-[#b08c4f]/15 space-y-6",children:[e.jsx(k,{label:"Veil Opacity",min:0,max:1,step:.05,value:S,onChange:a=>$(a)}),e.jsx(k,{label:"Light Streak",min:0,max:1,step:.05,value:E,onChange:a=>P(a)}),e.jsx(k,{label:"Radial Halo",min:0,max:1,step:.05,value:I,onChange:a=>X(a)}),e.jsx(k,{label:"Penumbra",min:0,max:1,step:.05,value:O,onChange:a=>J(a)}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"label-font text-[9px] text-[#b08c4f]/70",children:"Show veil band"}),e.jsx(Q,{variant:"brutalist",checked:R,onChange:()=>q(!R)})]})]})]})]})]}),e.jsxs("section",{className:"lg:col-span-7 reveal",style:{animationDelay:"1.15s"},children:[e.jsxs("div",{className:"flex items-baseline justify-between mb-5",children:[e.jsx("div",{className:"label-font text-[9px] text-[#b08c4f]/70",children:"Folio · Effigy"}),e.jsx("div",{className:"display-font text-[10px] text-[#b08c4f]/60 tracking-[0.4em]",children:l?"KINDLED":"AWAITING EFFIGY"})]}),e.jsxs("div",{className:"corner-frame relative bg-black/55 p-5 backdrop-blur-[1px]",children:[e.jsx("span",{className:"cf-tr"}),e.jsx("span",{className:"cf-br"}),l?e.jsx("div",{className:"flex flex-col items-center",children:e.jsx("canvas",{ref:i,className:"max-w-full h-auto block",style:{boxShadow:"0 0 0 1px rgba(176, 140, 79, 0.35), 0 30px 60px -20px rgba(0,0,0,0.9)"}})}):e.jsxs("div",{className:"aspect-video w-full flex flex-col items-center justify-center text-center gap-6 bg-[#050403] border border-dashed border-[#b08c4f]/25 relative",children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none opacity-30",style:{background:"radial-gradient(ellipse at 50% 60%, rgba(255, 179, 71, 0.18), transparent 55%)"}}),e.jsx(je,{}),e.jsxs("div",{className:"space-y-2 relative",children:[e.jsx("div",{className:"display-font text-2xl text-[#f0e6c8] tracking-wider",children:"Awaiting Effigy"}),e.jsx("div",{className:"body-font italic text-sm text-[#d8c89a]/60 max-w-sm",children:"Upload an image to kindle the bonfire and inscribe thy banner."})]})]})]}),l&&e.jsxs("div",{className:"mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"label-font text-[9px] text-[#b08c4f]/70",children:"Inscription Preview"}),e.jsx("div",{className:"display-font italic text-xl text-[#f0e6c8]",children:n})]}),e.jsxs("button",{onClick:se,className:"seal-cta",children:[e.jsx(fe,{weight:"duotone",size:16}),e.jsx("span",{children:"Seal Banner"}),e.jsx(de,{weight:"bold",size:14})]})]})]})]}),e.jsxs("footer",{className:"mt-32 pt-10 border-t border-[#b08c4f]/15 flex flex-col md:flex-row items-center justify-between gap-4",children:[e.jsx("div",{className:"footer-mark",children:"⁘ Editio Prima · Anno MMXXVI ⁘"}),e.jsx("div",{className:"label-font text-[9px] text-[#b08c4f]/50",children:"Mucked from the ashes of Lordran"})]})]})]})}export{De as default};
