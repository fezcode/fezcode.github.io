import{r as C,j as t,$ as J,W as Y,n as X,a0 as _,L as V,b as Z}from"../entries/pages.DMdlyjfO.js";import{o as U}from"./chunk-DyIT9c2g.js";import{e as Q}from"./chunk-CViWOw7B.js";import{S as ee}from"./chunk-BrPMSi7I.js";import{e as ae}from"./chunk-DA5umwxN.js";import{t as oe,a as te,e as re}from"./chunk-CIQq35sO.js";import{C as le}from"./chunk-D1vV3uUi.js";import"./chunk-BXl3LOEh.js";/* empty css              */import"./chunk-C92apCAb.js";const ne=({text:p,author:g,width:o,height:r,backgroundType:c,backgroundColor:u,gradientColor1:w,gradientColor2:j,gradientAngle:T,textColor:y,fontFamily:k,fontSize:h,fontWeight:$,textAlign:A,padding:F,lineHeight:W,backgroundImage:N,overlayOpacity:I,overlayColor:R,themeType:x,onDownload:z,triggerDownload:M})=>{const O=C.useRef(null),K=(n,e,a)=>{const l=e.split(" "),s=[];let i=l[0];for(let d=1;d<l.length;d++){const f=l[d];n.measureText(i+" "+f).width<a?i+=" "+f:(s.push(i),i=f)}return s.push(i),s},B=C.useCallback((n,e,a,l)=>{const s=e.width/e.height,i=a/l;let d,f,m,v;s>i?(f=l,d=l*s,m=(a-d)/2,v=0):(d=a,f=a/s,m=0,v=(l-f)/2),n.drawImage(e,m,v,d,f)},[]),H=C.useCallback((n,e,a)=>{n.clearRect(0,0,e,a);const l=60;n.beginPath(),n.moveTo(l,l);for(let f=l;f<=e-l;f+=5)n.lineTo(f,l+(Math.random()-.5)*8);for(let f=l;f<=a-l;f+=5)n.lineTo(e-l+(Math.random()-.5)*8,f);for(let f=e-l;f>=l;f-=5)n.lineTo(f,a-l+(Math.random()-.5)*8);for(let f=a-l;f>=l;f-=5)n.lineTo(l+(Math.random()-.5)*8,f);n.closePath(),n.save(),n.shadowColor="rgba(0,0,0,0.6)",n.shadowBlur=25,n.shadowOffsetX=10,n.shadowOffsetY=15,n.fillStyle=u,n.fill(),n.restore();const s=n.getImageData(0,0,e,a),i=s.data;for(let f=0;f<i.length;f+=4)if(i[f+3]>0){const m=(Math.random()-.5)*20;i[f]=Math.min(255,Math.max(0,i[f]+m)),i[f+1]=Math.min(255,Math.max(0,i[f+1]+m)),i[f+2]=Math.min(255,Math.max(0,i[f+2]+m))}n.putImageData(s,0,0),n.save(),n.globalCompositeOperation="source-atop";const d=n.createRadialGradient(e/2,a/2,e/3,e/2,a/2,e*.8);d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(1,"rgba(139, 69, 19, 0.2)"),n.fillStyle=d,n.fillRect(0,0,e,a),n.restore()},[u]),D=C.useCallback(n=>{n.fillStyle=y,n.font=`${$} ${h}px "${k}"`,n.textBaseline="top",x==="neon"?(n.shadowColor=y,n.shadowBlur=h*.4):(n.shadowColor="transparent",n.shadowBlur=0);const e=o-F*2,a=K(n,p,e),l=a.length*(h*W);let s=(r-l)/2;if(g&&(s-=h*.8),x==="polaroid"&&(s=r-F-l-(g?h*1.5:0)),a.forEach((i,d)=>{const f=n.measureText(i).width;let m;A==="center"?m=(o-f)/2:A==="right"?m=o-F-f:m=F;const v=s+d*h*W;if(x==="wordbox"){const S=h*.2;n.save(),n.shadowColor="transparent",n.shadowBlur=0,n.fillStyle=y,n.fillRect(m-S,v-S,f+S*2,h*W),n.fillStyle=u,n.fillText(i,m,v),n.restore()}else if(x==="brutalist"){const S=h*.1;n.save(),n.shadowColor="transparent",n.shadowBlur=0,n.fillStyle=y,n.fillText(i,m-S,v-S),n.fillStyle=u,n.fillText(i,m,v),n.restore()}else n.fillText(i,m,v)}),g){const i=h*.5;n.font=`italic ${$} ${i}px "${k}"`;const d=s+l+h*1.5,f=n.measureText("- "+g).width;let m;if(A==="center"?m=(o-f)/2:A==="right"?m=o-F-f:m=F,x==="brutalist"){const v=i*.1;n.save(),n.shadowColor="transparent",n.shadowBlur=0,n.fillStyle=y,n.fillText("- "+g,m-v,d-v),n.fillStyle=u,n.fillText("- "+g,m,d),n.restore()}else n.fillText("- "+g,m,d)}n.shadowColor="transparent",n.shadowBlur=0},[y,$,h,k,o,F,p,W,r,g,A,x,u]),q=C.useCallback((n,e,a)=>{if(c==="linear"){const l=T*Math.PI/180,s=Math.sqrt(e*e+a*a)/2,i=e/2-Math.cos(l)*s,d=a/2-Math.sin(l)*s,f=e/2+Math.cos(l)*s,m=a/2+Math.sin(l)*s,v=n.createLinearGradient(i,d,f,m);return v.addColorStop(0,w),v.addColorStop(1,j),v}else if(c==="radial"){const l=e/2,s=a/2,i=Math.max(e,a)/1.2,d=n.createRadialGradient(l,s,0,l,s,i);return d.addColorStop(0,w),d.addColorStop(1,j),d}return u},[c,u,w,j,T]),L=C.useCallback(()=>{const n=O.current;if(!n)return;const e=n.getContext("2d");if(n.width=o,n.height=r,x==="newspaper"?H(e,o,r):(e.fillStyle=q(e,o,r),e.fillRect(0,0,o,r)),N){const a=new Image;a.src=N,a.complete?B(e,a,o,r):a.onload=()=>{B(e,a,o,r),D(e)}}if(x==="polaroid"){const a=o*.05,l=r*.25;if(e.fillStyle="#ffffff",e.fillRect(0,0,o,r),e.fillStyle=q(e,o,r),e.fillRect(a,a,o-a*2,r-a-l),N){const s=new Image;s.src=N,s.complete&&(e.save(),e.beginPath(),e.rect(a,a,o-a*2,r-a-l),e.clip(),B(e,s,o,r),e.restore())}}if(I>0)if(x==="polaroid"){const a=o*.05,l=r*.25;e.save(),e.beginPath(),e.rect(a,a,o-a*2,r-a-l),e.clip(),e.fillStyle=R||"#000000",e.globalAlpha=I,e.fillRect(0,0,o,r),e.restore()}else e.fillStyle=R||"#000000",e.globalAlpha=I,e.fillRect(0,0,o,r),e.globalAlpha=1;if(x==="science"){e.save(),e.strokeStyle="rgba(0, 255, 65, 0.1)",e.lineWidth=1;for(let a=0;a<o;a+=40)e.beginPath(),e.moveTo(a,0),e.lineTo(a,r),e.stroke();for(let a=0;a<r;a+=40)e.beginPath(),e.moveTo(0,a),e.lineTo(o,a),e.stroke();e.restore()}else if(x==="kings")e.save(),e.strokeStyle="#ffd700",e.lineWidth=10,e.strokeRect(30,30,o-60,r-60),e.lineWidth=2,e.strokeRect(45,45,o-90,r-90),e.restore();else if(x==="birds"){e.save(),e.strokeStyle=y,e.lineWidth=2,e.globalAlpha=.5;for(let a=0;a<7;a++){const l=Math.random()*o,s=Math.random()*r*.5;e.beginPath(),e.moveTo(l,s),e.quadraticCurveTo(l+10,s-10,l+20,s),e.quadraticCurveTo(l+30,s-10,l+40,s),e.stroke()}e.restore()}else if(x==="rome"){e.save(),e.fillStyle="rgba(0,0,0,0.05)",e.fillRect(20,0,40,r),e.fillRect(o-60,0,40,r),e.strokeStyle="rgba(0,0,0,0.1)";for(let a=25;a<=55;a+=10)e.beginPath(),e.moveTo(a,0),e.lineTo(a,r),e.stroke(),e.beginPath(),e.moveTo(o-80+a,0),e.lineTo(o-80+a,r),e.stroke();e.restore()}else if(x==="french-girl"){const a=e.getImageData(0,0,o,r),l=a.data;for(let s=0;s<l.length;s+=4){const i=(Math.random()-.5)*30;l[s]=Math.min(255,Math.max(0,l[s]+i)),l[s+1]=Math.min(255,Math.max(0,l[s+1]+i)),l[s+2]=Math.min(255,Math.max(0,l[s+2]+i))}e.putImageData(a,0,0)}else if(x==="cia"||x==="fbi"||x==="espionage"){if(e.save(),x==="cia"||x==="fbi"){e.translate(o/2,r/2),e.rotate(-Math.PI/6),e.fillStyle="rgba(200, 0, 0, 0.6)",e.strokeStyle="rgba(200, 0, 0, 0.6)",e.lineWidth=10;const a=x==="cia"?"TOP SECRET":"CONFIDENTIAL";e.font=`bold ${o*.15}px Impact`,e.textBaseline="middle",e.textAlign="center";const l=e.measureText(a).width;e.strokeRect(-l/2-20,-o*.075-20,l+40,o*.15+40),e.fillText(a,0,0),e.rotate(Math.PI/6),e.translate(-o/2,-r/2)}x==="espionage"&&(e.strokeStyle="rgba(0, 255, 0, 0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(0,r/2),e.lineTo(o,r/2),e.stroke(),e.beginPath(),e.moveTo(o/2,0),e.lineTo(o/2,r),e.stroke(),e.beginPath(),e.arc(o/2,r/2,o*.2,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(o/2,r/2,o*.4,0,Math.PI*2),e.stroke()),e.restore()}else if(x==="control-panel"){e.save(),e.fillStyle="rgba(255,255,255,0.1)",e.strokeStyle="rgba(255,255,255,0.2)",e.lineWidth=3;for(let a=0;a<5;a++)e.beginPath(),e.arc(50+a*40,50,10,0,Math.PI*2),e.fill(),e.stroke();for(let a=0;a<3;a++){const l=o-80-a*80,s=r-80;e.beginPath(),e.arc(l,s,25,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(l,s),e.lineTo(l+Math.cos(Math.PI/4+a)*20,s+Math.sin(Math.PI/4+a)*20),e.stroke()}e.restore()}else if(x==="basketball")e.save(),e.strokeStyle="rgba(0,0,0,0.4)",e.lineWidth=15,e.beginPath(),e.moveTo(0,r/2),e.lineTo(o,r/2),e.stroke(),e.beginPath(),e.arc(o/2,r/2,o*.2,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(o*.2,0),e.quadraticCurveTo(o*.8,r/2,o*.2,r),e.stroke(),e.beginPath(),e.moveTo(o*.8,0),e.quadraticCurveTo(o*.2,r/2,o*.8,r),e.stroke(),e.restore();else if(x==="football"){e.save(),e.strokeStyle="rgba(255,255,255,0.8)",e.lineWidth=4;for(let a=100;a<o;a+=100)e.beginPath(),e.moveTo(a,0),e.lineTo(a,r),e.stroke(),e.beginPath(),e.moveTo(a-10,r*.3),e.lineTo(a+10,r*.3),e.stroke(),e.beginPath(),e.moveTo(a-10,r*.7),e.lineTo(a+10,r*.7),e.stroke();e.restore()}else if(x==="river"){e.save(),e.strokeStyle="rgba(255,255,255,0.3)",e.lineWidth=20,e.lineCap="round";for(let a=0;a<5;a++)e.beginPath(),e.moveTo(-100,r*(.2+a*.15)),e.bezierCurveTo(o*.3,r*(.1+a*.2),o*.7,r*(.4+a*.1),o+100,r*(.2+a*.15)),e.stroke();e.restore()}else if(x==="mountain")e.save(),e.fillStyle="rgba(0,0,0,0.5)",e.beginPath(),e.moveTo(0,r),e.lineTo(0,r*.7),e.lineTo(o*.2,r*.5),e.lineTo(o*.4,r*.8),e.lineTo(o*.7,r*.4),e.lineTo(o*.9,r*.6),e.lineTo(o,r*.5),e.lineTo(o,r),e.closePath(),e.fill(),e.fillStyle="rgba(255,255,255,0.2)",e.beginPath(),e.moveTo(0,r*.7),e.lineTo(o*.1,r*.75),e.lineTo(o*.2,r*.5),e.fill(),e.restore();else if(x==="cats"){e.save(),e.fillStyle="rgba(255,255,255,0.4)";const a=(l,s,i,d)=>{e.save(),e.translate(l,s),e.rotate(i),e.scale(d,d),e.beginPath(),e.ellipse(0,0,15,12,0,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(-15,-15,6,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(-5,-22,6,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(5,-22,6,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(15,-15,6,0,Math.PI*2),e.fill(),e.restore()};a(o*.1,r*.2,Math.PI/4,2),a(o*.8,r*.8,-Math.PI/3,1.5),a(o*.85,r*.15,Math.PI/6,1),a(o*.15,r*.85,-Math.PI/6,3),a(o*.5,r*.9,Math.PI/12,1.2),e.restore()}else if(x==="libretto"){e.save();const a=Math.min(o,r)*.035;e.strokeStyle="#C8A255",e.lineWidth=2,e.strokeRect(a,a,o-a*2,r-a*2),e.lineWidth=.8,e.strokeRect(a+6,a+6,o-a*2-12,r-a*2-12);const l=r*.08,s=e.createLinearGradient(0,a,0,a+l);s.addColorStop(0,"#7E1A24"),s.addColorStop(1,"#5A0F18"),e.fillStyle=s;for(let f=0;f<8;f++){const m=(o-a*2)/8,v=a+f*m;e.beginPath(),e.moveTo(v,a),e.quadraticCurveTo(v+m/2,a+l*(.8+f%2*.2),v+m,a),e.closePath(),e.fill(),e.fillStyle="#C8A255",e.beginPath(),e.arc(v+m/2,a+l*(.8+f%2*.2)-2,3,0,Math.PI*2),e.fill(),e.fillStyle=s}e.strokeStyle="#C8A255",e.lineWidth=1.5;const i=(f,m,v)=>{e.save(),e.translate(f,m),e.scale(v,1),e.beginPath(),e.moveTo(0,0),e.quadraticCurveTo(30,0,36,30),e.moveTo(0,0),e.quadraticCurveTo(0,30,30,36),e.stroke(),e.beginPath(),e.arc(14,14,2.5,0,Math.PI*2),e.fillStyle="#C8A255",e.fill(),e.restore()};i(a+14,a+l+14,1),i(o-a-14,a+l+14,-1),i(a+14,r-a-14,1),i(o-a-14,r-a-14,-1);const d=a+l+22;e.fillStyle="#C8A255",e.beginPath(),e.moveTo(o/2,d-8),e.quadraticCurveTo(o/2-12,d,o/2-18,d),e.quadraticCurveTo(o/2-12,d,o/2,d+8),e.quadraticCurveTo(o/2+12,d,o/2+18,d),e.quadraticCurveTo(o/2+12,d,o/2,d-8),e.fill(),e.restore()}else if(x==="chalkboard"){e.save(),e.globalAlpha=.12,e.fillStyle="#ffffff";for(let l=0;l<900;l++){const s=Math.random()*o,i=Math.random()*r,d=Math.random()*1.2;e.beginPath(),e.arc(s,i,d,0,Math.PI*2),e.fill()}e.globalAlpha=1,e.strokeStyle="rgba(255,255,255,0.55)",e.lineWidth=3,e.setLineDash([10,6]),e.strokeRect(40,40,o-80,r-80),e.setLineDash([]),e.strokeStyle="rgba(255,255,255,0.4)",e.lineWidth=2,((l,s,i)=>{e.beginPath();for(let d=0;d<5;d++){const f=-Math.PI/2+d*Math.PI*2/5,m=f+Math.PI/5;e.lineTo(l+Math.cos(f)*i,s+Math.sin(f)*i),e.lineTo(l+Math.cos(m)*(i*.45),s+Math.sin(m)*(i*.45))}e.closePath(),e.stroke()})(o-100,100,30),e.beginPath(),e.moveTo(o*.3,r-100),e.quadraticCurveTo(o*.5,r-90,o*.7,r-100),e.stroke(),e.restore()}else if(x==="tarot"){e.save(),e.strokeStyle="#D4A94A",e.lineWidth=8,e.strokeRect(30,30,o-60,r-60),e.lineWidth=2,e.strokeRect(48,48,o-96,r-96);const a=(l,s)=>{e.save(),e.translate(l,s),e.fillStyle="#D4A94A";for(let i=0;i<8;i++)e.rotate(Math.PI*2/8),e.beginPath(),e.ellipse(0,-12,3,8,0,0,Math.PI*2),e.fill();e.beginPath(),e.arc(0,0,4,0,Math.PI*2),e.fill(),e.restore()};a(70,70),a(o-70,70),a(70,r-70),a(o-70,r-70),e.fillStyle="#E8C878",e.beginPath(),e.arc(o/2,100,18,0,Math.PI*2),e.fill(),e.strokeStyle="#E8C878",e.lineWidth=2;for(let l=0;l<12;l++){const s=l*Math.PI*2/12;e.beginPath(),e.moveTo(o/2+Math.cos(s)*24,100+Math.sin(s)*24),e.lineTo(o/2+Math.cos(s)*34,100+Math.sin(s)*34),e.stroke()}e.fillStyle="#E8C878",e.beginPath(),e.arc(o/2,r-100,16,0,Math.PI*2),e.fill(),e.fillStyle=u,e.beginPath(),e.arc(o/2-6,r-100,14,0,Math.PI*2),e.fill(),e.fillStyle="rgba(232,200,120,0.35)";for(let l=0;l<40;l++){const s=60+Math.random()*(o-120),i=140+Math.random()*(r-280),d=Math.random()*1.8;e.beginPath(),e.arc(s,i,d,0,Math.PI*2),e.fill()}e.restore()}else if(x==="ransom"){e.save(),e.globalAlpha=.08,e.fillStyle="#000";for(let l=0;l<1600;l++){const s=Math.random()*o,i=Math.random()*r;e.fillRect(s,i,1.2,1.2)}e.globalAlpha=1;const a=["#F5E8C9","#E8D5B0","#F0E0C0","#D9C79E"];for(let l=0;l<18;l++){const s=70+Math.random()*140,i=50+Math.random()*90,d=Math.random()*(o-s),f=Math.random()*(r-i);e.save(),e.translate(d+s/2,f+i/2),e.rotate((Math.random()-.5)*.4),e.fillStyle=a[l%a.length],e.globalAlpha=.25,e.fillRect(-s/2,-i/2,s,i),e.restore()}e.restore()}D(e)},[o,r,q,N,I,R,B,D,x,H,y,u]);return C.useEffect(()=>{L(),document.fonts.ready.then(L)},[L]),C.useEffect(()=>{if(M&&z&&O.current){let n="image/png";M==="jpeg"||M==="jpg"?n="image/jpeg":M==="webp"&&(n="image/webp"),z(O.current.toDataURL(n,.9),M)}},[M,z]),t.jsx("div",{className:"w-full flex justify-center items-center overflow-hidden p-4",style:{background:"var(--wb-surface, #FFFFFF)",border:"1px solid var(--wb-hair, rgba(25,23,22,0.08))",borderRadius:14},children:t.jsx("canvas",{ref:O,style:{maxWidth:"100%",height:"auto",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}})})},se=`
  .wb-label {
    font-family: 'JetBrains Mono', 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--wb-ink-soft, #6B6A65);
    text-transform: lowercase;
  }
  .wb-value {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
    font-variant-numeric: tabular-nums;
  }
  .wb-card {
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 14px;
    padding: 20px;
  }
  .wb-section-head {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--wb-ink-soft, #6B6A65);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
  }

  /* Slider */
  .wb-slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 20px;
    width: 100%;
    outline: none;
    cursor: pointer;
  }
  .wb-slider::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      var(--wb-accent, #C4643A) var(--wb-pct, 0%),
      rgba(25,23,22,0.12) var(--wb-pct, 0%)
    );
  }
  .wb-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 14px; width: 14px;
    border-radius: 50%;
    background: var(--wb-bg, #FAF7F0);
    border: 2px solid var(--wb-accent, #C4643A);
    margin-top: -5.5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: transform .12s ease;
  }
  .wb-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
  .wb-slider::-moz-range-track {
    height: 3px;
    background: rgba(25,23,22,0.12);
    border-radius: 2px;
  }
  .wb-slider::-moz-range-progress {
    height: 3px;
    background: var(--wb-accent, #C4643A);
    border-radius: 2px;
  }
  .wb-slider::-moz-range-thumb {
    height: 14px; width: 14px;
    border-radius: 50%;
    background: var(--wb-bg, #FAF7F0);
    border: 2px solid var(--wb-accent, #C4643A);
    cursor: pointer;
  }

  /* Select (dropdown) */
  .wb-select {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 10px;
    padding: 10px 36px 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px;
    color: var(--wb-ink, #1A1918);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
    cursor: pointer;
  }
  .wb-select:hover { border-color: var(--wb-hair-hi, rgba(25,23,22,0.16)); }
  .wb-select:focus {
    border-color: var(--wb-accent, #C4643A);
    box-shadow: 0 0 0 3px var(--wb-accent-ring, rgba(196,100,58,0.22));
  }

  /* Text input + textarea */
  .wb-input, .wb-textarea {
    width: 100%;
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 10px;
    padding: 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px;
    color: var(--wb-ink, #1A1918);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-input:focus, .wb-textarea:focus {
    border-color: var(--wb-accent, #C4643A);
    box-shadow: 0 0 0 3px var(--wb-accent-ring, rgba(196,100,58,0.22));
  }
  .wb-textarea { resize: vertical; line-height: 1.5; }

  /* Color picker */
  .wb-swatch {
    width: 40px; height: 40px; border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(25,23,22,0.18), 0 1px 2px rgba(0,0,0,0.04);
    cursor: pointer;
    transition: transform .15s ease;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  .wb-swatch:hover { transform: scale(1.06); }
  .wb-hex {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
  }

  /* Preset buttons */
  .wb-preset-btn {
    padding: 8px 12px;
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    background: var(--wb-surface, #FFFFFF);
    border-radius: 10px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
    text-align: left;
    cursor: pointer;
    transition: all .15s ease;
  }
  .wb-preset-btn:hover {
    border-color: var(--wb-accent, #C4643A);
    background: var(--wb-accent-soft, rgba(196,100,58,0.10));
    color: var(--wb-accent, #C4643A);
  }

  /* Icon button (align toggle) */
  .wb-icon-btn {
    flex: 1;
    padding: 9px;
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    background: var(--wb-surface, #FFFFFF);
    border-radius: 10px;
    color: var(--wb-ink-soft, #6B6A65);
    cursor: pointer;
    transition: all .15s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .wb-icon-btn:hover {
    border-color: var(--wb-hair-hi, rgba(25,23,22,0.16));
    color: var(--wb-ink, #1A1918);
  }
  .wb-icon-btn--active {
    background: var(--wb-accent-soft, rgba(196,100,58,0.10));
    border-color: var(--wb-accent, #C4643A);
    color: var(--wb-accent, #C4643A);
  }
`,P=({label:p,value:g,min:o,max:r,step:c=1,onChange:u,format:w})=>{const j=Math.max(0,Math.min(100,(g-o)/(r-o)*100)),T=w?w(g):typeof g=="number"&&!Number.isInteger(g)?g.toFixed(2):g;return t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-baseline justify-between mb-2",children:[t.jsx("span",{className:"wb-label",children:p}),t.jsx("span",{className:"wb-value",children:T})]}),t.jsx("input",{type:"range",min:o,max:r,step:c,value:g,onChange:y=>u(parseFloat(y.target.value)),className:"wb-slider",style:{"--wb-pct":`${j}%`}})]})},G=({label:p,options:g,value:o,onChange:r,icon:c})=>t.jsxs("div",{children:[p&&t.jsxs("div",{className:"wb-label mb-2 flex items-center gap-2",children:[c&&t.jsx(c,{size:12}),t.jsx("span",{children:p})]}),t.jsxs("div",{className:"relative",children:[t.jsx("select",{value:o,onChange:u=>r(u.target.value),className:"wb-select",children:g.map(u=>t.jsx("option",{value:u.value,children:u.label},u.value))}),t.jsx(ae,{size:14,weight:"regular",className:"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",style:{color:"var(--wb-ink-soft, #6B6A65)"}})]})]}),E=({label:p,value:g,onChange:o})=>t.jsxs("div",{children:[p&&t.jsx("div",{className:"wb-label mb-2",children:p}),t.jsx(le,{value:g,onChange:o,variant:"brutalist"})]}),ie=[{value:"Inter",label:"Inter (Modern)"},{value:"Space Mono",label:"Space Mono"},{value:"Playfair Display",label:"Playfair Display (Serif)"},{value:"Courier New",label:"Courier New (Typewriter)"},{value:"Cinzel",label:"Cinzel (Fantasy)"},{value:"Impact",label:"Impact (Meme)"},{value:"Caveat",label:"Caveat (Handwritten)"},{value:"Oswald",label:"Oswald"},{value:"Lora",label:"Lora"},{value:"Montserrat",label:"Montserrat"},{value:"UnifrakturMaguntia",label:"UnifrakturMaguntia (Old English)"}],ce=[{name:"Modern",config:{fontFamily:"Inter",backgroundColor:"#ffffff",textColor:"#000000",fontWeight:800,themeType:"standard",textAlign:"left",overlayOpacity:0}},{name:"Typewriter",config:{fontFamily:"Courier New",backgroundColor:"#f4f4f0",textColor:"#333333",fontWeight:400,themeType:"typewriter",textAlign:"left",overlayOpacity:0}},{name:"Genius",config:{fontFamily:"Inter",backgroundColor:"#000000",textColor:"#ffffff",fontWeight:900,themeType:"standard",textAlign:"left",overlayOpacity:0}},{name:"Pastoral",config:{fontFamily:"Playfair Display",backgroundColor:"#e3dcd2",textColor:"#2c3e50",fontWeight:400,themeType:"standard",textAlign:"left",overlayOpacity:0}},{name:"Wordbox",config:{fontFamily:"Oswald",backgroundColor:"#f4f4f0",textColor:"#1a1a1a",fontWeight:700,themeType:"wordbox",textAlign:"center",overlayOpacity:0}},{name:"Newspaper",config:{fontFamily:"Playfair Display",backgroundColor:"#eeeae0",textColor:"#1a1a1a",fontWeight:700,themeType:"newspaper",textAlign:"center",overlayOpacity:0}},{name:"Handwritten",config:{fontFamily:"Caveat",backgroundColor:"#fdf6e3",textColor:"#444444",fontWeight:400,themeType:"standard",textAlign:"left",overlayOpacity:0}},{name:"Neon",config:{fontFamily:"Montserrat",backgroundColor:"#0a0a0a",textColor:"#00ffff",fontWeight:700,themeType:"neon",textAlign:"center",overlayOpacity:0}},{name:"Polaroid",config:{fontFamily:"Caveat",backgroundColor:"#e8e8e8",textColor:"#2c3e50",fontWeight:700,themeType:"polaroid",textAlign:"center",overlayOpacity:0}},{name:"Brutalist",config:{fontFamily:"Impact",backgroundColor:"#ff0000",textColor:"#ffff00",fontWeight:900,themeType:"brutalist",textAlign:"left",overlayOpacity:0}},{name:"Lana Del Rey",config:{fontFamily:"Lora",backgroundColor:"#f5f0ea",textColor:"#8b6e58",fontWeight:400,themeType:"standard",textAlign:"center",overlayOpacity:0}},{name:"Rome",config:{fontFamily:"Cinzel",backgroundColor:"#2c1810",textColor:"#d4af37",fontWeight:400,themeType:"rome",textAlign:"center",overlayOpacity:0}},{name:"Science",config:{fontFamily:"Courier New",backgroundColor:"#f0f4f8",textColor:"#1a3a5c",fontWeight:400,themeType:"science",textAlign:"left",overlayOpacity:0}},{name:"Drama",config:{fontFamily:"Playfair Display",backgroundColor:"#1a0f2e",textColor:"#f5e6d3",fontWeight:700,themeType:"wordbox",textAlign:"center",overlayOpacity:0}},{name:"Comedy",config:{fontFamily:"Caveat",backgroundColor:"#fff9e6",textColor:"#e74c3c",fontWeight:700,themeType:"standard",textAlign:"center",overlayOpacity:0}},{name:"Life",config:{fontFamily:"Lora",backgroundColor:"#e8f0e3",textColor:"#2d4a2b",fontWeight:400,themeType:"standard",textAlign:"left",overlayOpacity:0}},{name:"Birds",config:{fontFamily:"Caveat",backgroundColor:"#e3f2fd",textColor:"#1565c0",fontWeight:400,themeType:"birds",textAlign:"left",overlayOpacity:0}},{name:"Kings",config:{fontFamily:"Cinzel",backgroundColor:"#3e2723",textColor:"#d4af37",fontWeight:700,themeType:"kings",textAlign:"center",overlayOpacity:0}},{name:"French Girl",config:{fontFamily:"Playfair Display",backgroundColor:"#fce4ec",textColor:"#4a148c",fontWeight:400,themeType:"french-girl",textAlign:"center",overlayOpacity:0}},{name:"CIA",config:{fontFamily:"Courier New",backgroundColor:"#1a1a1a",textColor:"#ffffff",fontWeight:700,themeType:"cia",textAlign:"left",overlayOpacity:0}},{name:"FBI",config:{fontFamily:"Courier New",backgroundColor:"#0d1b2a",textColor:"#fca311",fontWeight:700,themeType:"fbi",textAlign:"left",overlayOpacity:0}},{name:"Espionage",config:{fontFamily:"Space Mono",backgroundColor:"#0a0a0a",textColor:"#00ff00",fontWeight:700,themeType:"espionage",textAlign:"left",overlayOpacity:0}},{name:"Control Panel",config:{fontFamily:"Space Mono",backgroundColor:"#1e293b",textColor:"#38bdf8",fontWeight:700,themeType:"control-panel",textAlign:"center",overlayOpacity:0}},{name:"Basketball",config:{fontFamily:"Oswald",backgroundColor:"#d2691e",textColor:"#ffffff",fontWeight:700,themeType:"basketball",textAlign:"center",overlayOpacity:0}},{name:"Football",config:{fontFamily:"Oswald",backgroundColor:"#2d5016",textColor:"#ffffff",fontWeight:700,themeType:"football",textAlign:"center",overlayOpacity:0}},{name:"River",config:{fontFamily:"Lora",backgroundColor:"#4a90a4",textColor:"#ffffff",fontWeight:400,themeType:"river",textAlign:"center",overlayOpacity:0}},{name:"Mountain",config:{fontFamily:"Montserrat",backgroundColor:"#5d6d7e",textColor:"#ffffff",fontWeight:700,themeType:"mountain",textAlign:"center",overlayOpacity:0}},{name:"Cats",config:{fontFamily:"Caveat",backgroundColor:"#ffb6c1",textColor:"#4a148c",fontWeight:700,themeType:"cats",textAlign:"center",overlayOpacity:0}},{name:"Libretto",config:{fontFamily:"Playfair Display",backgroundType:"radial",backgroundColor:"#F0E4C8",gradientColor1:"#F0E4C8",gradientColor2:"#E8D9B5",textColor:"#1A0A0D",fontWeight:400,themeType:"libretto",textAlign:"center",overlayOpacity:0}},{name:"Chalkboard",config:{fontFamily:"Caveat",backgroundColor:"#1F3228",textColor:"#F5F1E3",fontWeight:400,themeType:"chalkboard",textAlign:"center",overlayOpacity:0}},{name:"Tarot",config:{fontFamily:"Cinzel",backgroundType:"radial",backgroundColor:"#1A0A2E",gradientColor1:"#2D1B4F",gradientColor2:"#0F0520",textColor:"#E8C878",fontWeight:700,themeType:"tarot",textAlign:"center",overlayOpacity:0}},{name:"Ransom",config:{fontFamily:"Impact",backgroundColor:"#F5E8C9",textColor:"#0A0A0A",fontWeight:900,themeType:"ransom",textAlign:"center",overlayOpacity:0}}],fe=[{value:"standard",label:"Standard"},{value:"wordbox",label:"Wordbox"},{value:"typewriter",label:"Typewriter"},{value:"newspaper",label:"Newspaper"},{value:"neon",label:"Neon"},{value:"polaroid",label:"Polaroid"},{value:"brutalist",label:"Brutalist"},{value:"science",label:"Science"},{value:"french-girl",label:"French Girl"},{value:"kings",label:"Kings"},{value:"birds",label:"Birds"},{value:"rome",label:"Rome"},{value:"cia",label:"CIA"},{value:"fbi",label:"FBI"},{value:"espionage",label:"Espionage"},{value:"control-panel",label:"Control Panel"},{value:"basketball",label:"Basketball"},{value:"football",label:"Football"},{value:"river",label:"River"},{value:"mountain",label:"Mountain"},{value:"cats",label:"Cats"},{value:"libretto",label:"Libretto"},{value:"chalkboard",label:"Chalkboard"},{value:"tarot",label:"Tarot"},{value:"ransom",label:"Ransom"}],de=({state:p,updateState:g})=>{const o=(c,u)=>{g({[c]:u})},r=c=>{g({...p,...c.config})};return t.jsxs("div",{className:"space-y-4",children:[t.jsx("style",{children:se}),t.jsxs("div",{className:"wb-card",children:[t.jsxs("h3",{className:"wb-section-head",children:[t.jsx(Q,{weight:"regular"}),"Presets"]}),t.jsx("div",{className:"grid grid-cols-2 gap-1.5",children:ce.map(c=>t.jsx("button",{onClick:()=>r(c),className:"wb-preset-btn",children:c.name},c.name))})]}),t.jsxs("div",{className:"wb-card space-y-4",children:[t.jsxs("h3",{className:"wb-section-head",children:[t.jsx(J,{weight:"regular"}),"Content"]}),t.jsxs("div",{children:[t.jsx("div",{className:"wb-label mb-2",children:"Quote"}),t.jsx("textarea",{value:p.text,onChange:c=>o("text",c.target.value),rows:4,className:"wb-textarea",placeholder:"Enter your quote here…"})]}),t.jsxs("div",{children:[t.jsx("div",{className:"wb-label mb-2",children:"Author"}),t.jsx("input",{type:"text",value:p.author,onChange:c=>o("author",c.target.value),className:"wb-input",placeholder:"Author name"})]})]}),t.jsxs("div",{className:"wb-card space-y-4",children:[t.jsxs("h3",{className:"wb-section-head",children:[t.jsx(J,{weight:"regular"}),"Typography"]}),t.jsx(G,{label:"Font family",options:ie,value:p.fontFamily,onChange:c=>o("fontFamily",c)}),t.jsxs("div",{children:[t.jsx("div",{className:"wb-label mb-2",children:"Alignment"}),t.jsx("div",{className:"flex gap-2",children:[{v:"left",Icon:oe},{v:"center",Icon:te},{v:"right",Icon:re}].map(({v:c,Icon:u})=>{const w=p.textAlign===c;return t.jsx("button",{onClick:()=>o("textAlign",c),className:`wb-icon-btn ${w?"wb-icon-btn--active":""}`,"aria-label":`Align ${c}`,children:t.jsx(u,{size:16})},c)})})]}),t.jsx(P,{label:"Font size",value:p.fontSize,min:12,max:128,onChange:c=>o("fontSize",c)}),t.jsx(P,{label:"Line height",value:p.lineHeight,min:.8,max:3,step:.1,onChange:c=>o("lineHeight",c)}),t.jsx(P,{label:"Font weight",value:p.fontWeight,min:100,max:900,step:100,onChange:c=>o("fontWeight",c)})]}),t.jsxs("div",{className:"wb-card space-y-4",children:[t.jsxs("h3",{className:"wb-section-head",children:[t.jsx(Y,{weight:"regular"}),"Canvas"]}),t.jsx(P,{label:"Width",value:p.width,min:500,max:2e3,step:10,onChange:c=>o("width",c)}),t.jsx(P,{label:"Height",value:p.height,min:500,max:2e3,step:10,onChange:c=>o("height",c)})]}),t.jsxs("div",{className:"wb-card space-y-4",children:[t.jsxs("h3",{className:"wb-section-head",children:[t.jsx(Y,{weight:"regular"}),"Visuals"]}),t.jsx(G,{label:"Background type",options:[{value:"solid",label:"Solid color"},{value:"linear",label:"Linear gradient"},{value:"radial",label:"Radial gradient"}],value:p.backgroundType||"solid",onChange:c=>o("backgroundType",c)}),!p.backgroundType||p.backgroundType==="solid"?t.jsx(E,{label:"Background",value:p.backgroundColor,onChange:c=>o("backgroundColor",c)}):t.jsxs("div",{className:"space-y-4 pt-3",style:{borderTop:"1px solid var(--wb-hair)"},children:[t.jsx(E,{label:"Color 1",value:p.gradientColor1||"#ff0000",onChange:c=>o("gradientColor1",c)}),t.jsx(E,{label:"Color 2",value:p.gradientColor2||"#0000ff",onChange:c=>o("gradientColor2",c)}),p.backgroundType==="linear"&&t.jsx(P,{label:"Gradient angle",min:0,max:360,value:p.gradientAngle||135,onChange:c=>o("gradientAngle",c)})]}),t.jsx(E,{label:"Text color",value:p.textColor,onChange:c=>o("textColor",c)}),t.jsx("div",{className:"pt-3",style:{borderTop:"1px solid var(--wb-hair)"},children:t.jsx(P,{label:"Padding",min:0,max:200,value:p.padding,onChange:c=>o("padding",c)})}),t.jsx("div",{className:"pt-3",style:{borderTop:"1px solid var(--wb-hair)"},children:t.jsx(G,{label:"Theme style",options:fe,value:p.themeType,onChange:c=>o("themeType",c)})})]})]})},be=()=>{const{addToast:p}=X(),[g,o]=C.useState({text:"The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",author:"Albert Camus",width:1080,height:1080,backgroundType:"solid",backgroundColor:"#ffffff",gradientColor1:"#ff0000",gradientColor2:"#0000ff",gradientAngle:135,textColor:"#000000",fontFamily:"Inter",fontSize:48,fontWeight:800,textAlign:"left",padding:80,lineHeight:1.2,backgroundImage:null,overlayOpacity:0,overlayColor:"#000000",themeType:"standard"}),[r,c]=C.useState(null),u=y=>{o(k=>({...k,...y}))};C.useEffect(()=>{const y=["Inter:wght@400;700;900","Playfair+Display:ital,wght@0,400;0,700;1,400","Cinzel:wght@400;700","Caveat:wght@400;700","Oswald:wght@400;700","Lora:ital,wght@0,400;0,700;1,400","Montserrat:wght@400;700;900","Space+Mono:ital,wght@0,400;0,700;1,400","UnifrakturMaguntia"],k=document.createElement("link");return k.href=`https://fonts.googleapis.com/css2?family=${y.join("&")}&display=swap`,k.rel="stylesheet",document.head.appendChild(k),()=>{document.head.removeChild(k)}},[]);const w=(y,k)=>{const h=document.createElement("a");h.download=`quote-${Date.now()}.${k||"png"}`,h.href=y,h.click(),c(null),p({title:"Quote Downloaded",message:`Saved as ${k?.toUpperCase()||"PNG"}.`,type:"success"})},j=g.text.length,T=g.text.trim().split(/\s+/).filter(Boolean).length;return t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",children:[t.jsx("div",{className:"lg:col-span-7 xl:col-span-8 order-1 lg:order-1",children:t.jsxs("div",{className:"lg:sticky lg:top-20 space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[t.jsxs("div",{className:"flex items-center gap-4 qg-mono",style:{letterSpacing:"0.08em"},children:[t.jsx("span",{className:"qg-label",children:"preview"}),t.jsx("span",{className:"qg-dim",children:"·"}),t.jsxs("span",{className:"qg-dim",children:[g.width," × ",g.height]})]}),t.jsxs("div",{className:"flex items-center gap-3 qg-mono",style:{letterSpacing:"0.08em"},children:[t.jsxs("span",{className:"qg-dim",children:[T," words"]}),t.jsx("span",{className:"qg-dim",children:"·"}),t.jsxs("span",{className:"qg-dim",children:[j," chars"]})]})]}),t.jsx(ne,{...g,onDownload:w,triggerDownload:r}),t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[t.jsx("div",{className:"qg-mono text-[10px]",style:{letterSpacing:"0.1em",color:"var(--wb-ink-soft, #6B6A65)"},children:"export as"}),t.jsx("div",{className:"flex items-center gap-2",children:["png","jpeg","webp"].map(y=>t.jsxs("button",{onClick:()=>c(y),className:"wb-dl-btn",children:[t.jsx(_,{weight:"regular",size:13}),t.jsx("span",{children:y.toUpperCase()})]},y))})]})]})}),t.jsx("div",{className:"lg:col-span-5 xl:col-span-4 order-2 lg:order-2",children:t.jsx(de,{state:g,updateState:u})}),t.jsx("style",{children:`
        .qg-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }
        .qg-label { color: var(--wb-ink-soft, #6B6A65); text-transform: lowercase; }
        .qg-dim { color: var(--wb-ink-dim, #A8A49B); text-transform: lowercase; }
        .wb-dl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.08em;
          background: var(--wb-surface, #FFFFFF);
          color: var(--wb-ink, #1A1918);
          border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
          border-radius: 8px;
          cursor: pointer;
          transition: all .15s ease;
        }
        .wb-dl-btn:hover {
          background: var(--wb-accent, #C4643A);
          color: var(--wb-bg, #FAF7F0);
          border-color: var(--wb-accent, #C4643A);
        }
      `})]})},b={bg:"#FAF7F0",surface:"#FFFFFF",surface2:"#F6F1E4",hair:"rgba(25,23,22,0.08)",hairHi:"rgba(25,23,22,0.16)",ink:"#1A1918",inkSoft:"#6B6A65",inkDim:"#A8A49B",accent:"#C4643A",accentSoft:"rgba(196,100,58,0.10)",accentRing:"rgba(196,100,58,0.22)"},we=()=>{const[p,g]=C.useState("");return C.useEffect(()=>{const o=()=>{g(new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}).toLowerCase())};o();const r=setInterval(o,3e4);return()=>clearInterval(r)},[]),t.jsxs("div",{className:"workbench-page min-h-screen relative",style:{background:b.bg,color:b.ink},children:[t.jsx("style",{children:`
        .workbench-page { font-family: 'Instrument Sans', system-ui, sans-serif; }
        .wb-display { font-family: 'Fraunces', 'EB Garamond', serif; font-variation-settings: "opsz" 72, "SOFT" 0, "WONK" 0; }
        .wb-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }

        .workbench-page::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle at 30% 30%, rgba(25,23,22,0.025) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.6;
        }
        .workbench-page::after {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(60% 30% at 50% 0%, rgba(196,100,58,0.06), transparent 70%);
        }

        .wb-kbd {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 6px; border-radius: 5px;
          background: ${b.surface};
          border: 1px solid ${b.hair};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: ${b.inkSoft};
        }

        .wb-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid ${b.hair};
          background: ${b.surface};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: ${b.inkSoft};
        }

        @keyframes wb-reveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wb-reveal { animation: wb-reveal .5s cubic-bezier(.2,.7,.2,1) both; }

        /* Only element tints remain here — widget styling now lives in
           ControlPanel via native Workbench components. */

        .wb-focus-ring *:focus-visible {
          outline: 2px solid ${b.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Workbench-themed widget tokens (read by ControlPanel widgets) */
        :root {
          --wb-bg: ${b.bg};
          --wb-surface: ${b.surface};
          --wb-surface-2: ${b.surface2};
          --wb-hair: ${b.hair};
          --wb-hair-hi: ${b.hairHi};
          --wb-ink: ${b.ink};
          --wb-ink-soft: ${b.inkSoft};
          --wb-ink-dim: ${b.inkDim};
          --wb-accent: ${b.accent};
          --wb-accent-soft: ${b.accentSoft};
          --wb-accent-ring: ${b.accentRing};
        }
      `}),t.jsx(ee,{title:"Quote — Fezcodex",description:"A composer for quote images. Calm, modern, type-first.",keywords:["quote","generator","image","maker","typography","fezcodex"]}),t.jsx("div",{className:"sticky top-0 z-30 relative",style:{background:`${b.bg}E8`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:`1px solid ${b.hair}`},children:t.jsxs("div",{className:"mx-auto max-w-[1440px] px-6 md:px-10 h-14 flex items-center justify-between gap-4",children:[t.jsxs("div",{className:"flex items-center gap-5",children:[t.jsxs(V,{to:"/apps",className:"flex items-center gap-2 transition-opacity hover:opacity-70",style:{color:b.inkSoft},children:[t.jsx(Z,{size:13}),t.jsx("span",{className:"wb-mono text-[11px] tracking-[0.08em]",children:"apps"})]}),t.jsx("span",{className:"h-4 w-px",style:{background:b.hairHi}}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(U,{size:6,weight:"fill",style:{color:b.accent}}),t.jsx("span",{className:"wb-mono text-[11px]",style:{color:b.ink},children:"quote"}),t.jsx("span",{className:"wb-mono text-[11px]",style:{color:b.inkDim},children:"/ composer"})]})]}),t.jsxs("div",{className:"hidden md:flex items-center gap-5",children:[t.jsxs("span",{className:"wb-mono text-[10px]",style:{color:b.inkDim},children:[p," · local"]}),t.jsx("span",{className:"h-4 w-px",style:{background:b.hairHi}}),t.jsx("span",{className:"wb-mono text-[10px]",style:{color:b.inkDim},children:"v2026.1"})]})]})}),t.jsxs("header",{className:"wb-reveal relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-10 md:pt-14 pb-8",children:[t.jsxs("div",{className:"flex flex-col md:flex-row md:items-end md:justify-between gap-6",children:[t.jsxs("div",{className:"max-w-2xl",children:[t.jsxs("div",{className:"wb-mono text-[11px] mb-3 flex items-center gap-2",style:{color:b.inkSoft,letterSpacing:"0.08em"},children:[t.jsx(Q,{size:12,style:{color:b.accent}}),t.jsx("span",{children:"composer · beta"})]}),t.jsx("h1",{className:"wb-display leading-[1.05] tracking-[-0.01em]",style:{fontSize:"clamp(40px, 5vw, 64px)",color:b.ink,fontWeight:400},children:"Compose a quote."}),t.jsx("p",{className:"mt-3 text-[15px] md:text-[16px] max-w-xl leading-relaxed",style:{color:b.inkSoft},children:"Pick a surface, set the voice, export a piece — PNG, JPEG, or WebP at 1080². Twenty-five surfaces and eleven typefaces, built for writers who treat type like a medium."})]}),t.jsxs("div",{className:"flex flex-wrap items-center gap-2 md:justify-end",children:[t.jsxs("span",{className:"wb-pill",children:[t.jsx("span",{style:{color:b.ink},children:"25"})," surfaces"]}),t.jsxs("span",{className:"wb-pill",children:[t.jsx("span",{style:{color:b.ink},children:"11"})," typefaces"]}),t.jsxs("span",{className:"wb-pill",children:[t.jsx(_,{size:11}),"png · jpeg · webp"]})]})]}),t.jsxs("div",{className:"mt-10 relative",style:{height:1},children:[t.jsx("div",{className:"absolute inset-0",style:{background:b.hair}}),t.jsx("div",{className:"absolute left-0 top-0 bottom-0",style:{width:40,background:b.accent}})]})]}),t.jsx("main",{className:"wb-reveal relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pb-16 wb-focus-ring",style:{animationDelay:".08s"},children:t.jsx(be,{})}),t.jsxs("footer",{className:"relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3",style:{borderTop:`1px solid ${b.hair}`},children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(U,{size:6,weight:"fill",style:{color:b.accent}}),t.jsx("span",{className:"wb-mono text-[10px]",style:{color:b.inkDim,letterSpacing:"0.1em"},children:"fezcodex / composer"})]}),t.jsx("span",{className:"wb-display text-[14px]",style:{color:b.inkSoft},children:"type is a medium."}),t.jsx("span",{className:"wb-mono text-[10px]",style:{color:b.inkDim,letterSpacing:"0.1em"},children:"⌘ k to search"})]})]})};export{we as default};
