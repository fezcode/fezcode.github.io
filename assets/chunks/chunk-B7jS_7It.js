import{r as h,N as W,j as e,L as X,b as q,bg as O,b$ as V,cm as Y,bp as Q,a3 as J}from"../entries/pages.Bef1y-Vk.js";import{r as K}from"./chunk-CUsWdO6w.js";import{e as Z,r as ee}from"./chunk-Dduu6sZJ.js";import{r as D}from"./chunk-BkCANTKC.js";import{e as te}from"./chunk-PwBcrIAn.js";import{e as ae}from"./chunk-CagVNXc-.js";import{S as re}from"./chunk-BYuu-urj.js";import"./chunk-BXl3LOEh.js";/* empty css              */const ie=4096,oe=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,le=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg;
uniform vec2 uRes;
uniform float uSeed;
uniform float uVignette;
uniform float uGrain;

float hash1(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + uSeed);
  return fract(p.x * p.y);
}
vec2 hash2(vec2 p) {
  float n = hash1(p);
  return vec2(n, hash1(p + n + 1.7));
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash1(i), b = hash1(i + vec2(1.0, 0.0));
  float c = hash1(i + vec2(0.0, 1.0)), d = hash1(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
vec3 srcTap(vec2 uv) {
  return texture2D(uImg, clamp(uv, vec2(0.002), vec2(0.998))).rgb;
}
vec3 tapRot(vec2 base, vec2 rot, vec2 o, float radPx) {
  vec2 r = vec2(o.x * rot.x - o.y * rot.y, o.x * rot.y + o.y * rot.x);
  return srcTap(base + r * radPx / uRes);
}
vec3 frostSample(vec2 base, vec2 rot, float radPx) {
  if (radPx < 0.25) return srcTap(base);
  vec3 c = vec3(0.0);
  c += tapRot(base, rot, vec2( 0.940,  0.105), radPx);
  c += tapRot(base, rot, vec2(-0.532,  0.780), radPx);
  c += tapRot(base, rot, vec2(-0.870, -0.395), radPx);
  c += tapRot(base, rot, vec2( 0.310, -0.860), radPx);
  c += tapRot(base, rot, vec2( 0.420,  0.512), radPx);
  c += tapRot(base, rot, vec2(-0.150,  0.230), radPx);
  c += tapRot(base, rot, vec2(-0.380, -0.205), radPx);
  c += tapRot(base, rot, vec2( 0.166, -0.318), radPx);
  return c / 8.0;
}
vec3 post(vec3 col, vec2 uv) {
  float v = smoothstep(1.05, 0.35, distance(uv, vec2(0.5)));
  col *= mix(1.0, v, uVignette);
  col += (hash1(uv * uRes + 3.7) - 0.5) * uGrain * 0.25;
  return col;
}
`,se=`
uniform float uWidth;
uniform float uRefract;
uniform float uAngle;
uniform float uBlur;
uniform float uHighlight;
uniform float uProfile;
uniform float uSeam;

void main() {
  vec2 px = vUv * uRes;
  float ang = radians(uAngle);
  vec2 dir = vec2(cos(ang), sin(ang));
  vec2 axis = vec2(-dir.y, dir.x);
  float t = dot(px, dir) / uWidth;
  float f = fract(t) - 0.5;
  float af = abs(f);

  float r2 = max(0.26 - f * f, 0.002);
  float slopeRound = clamp(-f / sqrt(r2), -2.6, 2.6);
  float slopePrism = -sign(f) * 1.4;
  float slope = mix(slopeRound, slopePrism, uProfile);
  vec2 baseOff = dir * slope * uRefract * uWidth * 0.5;

  float blurPx = uBlur * uWidth * 0.45;
  vec3 col = vec3(0.0);
  for (int i = -4; i <= 4; i++) {
    float w = float(i) / 4.0;
    col += srcTap(vUv + (baseOff + axis * (w * blurPx)) / uRes);
  }
  col /= 9.0;

  float seamBand = smoothstep(0.5, 0.40, af);
  col *= mix(1.0, mix(0.45, 1.0, seamBand), uSeam);
  float hl = exp(-pow((af - 0.30) * 9.0, 2.0)) * 0.85
           + exp(-pow(af * 7.0, 2.0)) * 0.25;
  col += hl * uHighlight * 0.5;

  gl_FragColor = vec4(post(col, vUv), 1.0);
}
`,ne=`
uniform float uTile;
uniform float uGrout;
uniform float uFlatten;
uniform float uVariance;
uniform float uBevel;
uniform float uShape;
uniform vec3 uGroutCol;

vec4 hexCoords(vec2 uv) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  return vec4(gv, uv - gv);
}
float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, vec2(0.5, 0.8660254)), p.x);
}
// iq's voronoi-with-borders: x = distance to cell edge, yz = cell point
vec3 voro(vec2 p) {
  vec2 n = floor(p), f = fract(p);
  vec2 mg = vec2(0.0), mr = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + hash2(n + g) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  float bd = 8.0;
  for (int j = -2; j <= 2; j++)
  for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec2 r = g + hash2(n + g) - f;
    if (dot(mr - r, mr - r) > 0.00001) {
      bd = min(bd, dot(0.5 * (mr + r), normalize(r - mr)));
    }
  }
  return vec3(bd, n + mg + hash2(n + mg));
}

void main() {
  vec2 px = vUv * uRes;
  vec2 id;
  vec2 center;
  vec2 local;
  float borderPx;

  if (uShape < 0.5) {
    vec2 cell = floor(px / uTile);
    id = cell;
    center = (cell + 0.5) * uTile;
    local = (px - center) / uTile;
    borderPx = (0.5 - max(abs(local.x), abs(local.y))) * uTile;
  } else if (uShape < 1.5) {
    vec2 p = px / uTile;
    vec4 h = hexCoords(p);
    local = h.xy;
    id = h.zw;
    center = h.zw * uTile;
    borderPx = (0.5 - hexDist(local)) * uTile * 1.1547;
  } else {
    vec2 p = px / uTile;
    vec3 v = voro(p);
    borderPx = v.x * uTile;
    id = v.yz;
    center = v.yz * uTile;
    local = (px - center) / uTile;
  }

  vec3 cellCol = srcTap(center / uRes);
  vec3 col = mix(srcTap(vUv), cellCol, uFlatten);

  col *= 1.0 + (hash1(id + 7.3) - 0.5) * uVariance * 0.8;
  col += (vec3(hash1(id + 1.1), hash1(id + 2.2), hash1(id + 3.3)) - 0.5)
       * uVariance * 0.12;

  vec2 ld = normalize(vec2(-0.55, 0.84));
  float shade = dot(normalize(local + 0.0001), ld);
  col *= 1.0 + shade * uBevel * 0.28;
  float rim = smoothstep(uGrout * 0.5 + uTile * 0.16, uGrout * 0.5, borderPx);
  col += rim * max(shade, 0.0) * uBevel * 0.35;
  col -= rim * max(-shade, 0.0) * uBevel * 0.30;

  float g = smoothstep(uGrout * 0.5 + 0.8, uGrout * 0.5 - 0.8, borderPx)
          * step(0.01, uGrout);
  col = mix(col, uGroutCol, g);

  gl_FragColor = vec4(post(col, vUv), 1.0);
}
`,ce=`
uniform float uCell;
uniform float uShapeP;
uniform float uGap;
uniform float uQuant;
uniform float uJitter;
uniform float uContrast;

void main() {
  vec2 px = vUv * uRes;
  vec2 cellId = floor(px / uCell);
  vec2 center = (cellId + 0.5) * uCell;
  vec2 jit = (hash2(cellId) - 0.5) * uJitter * uCell * 0.8;
  vec3 col = srcTap((center + jit) / uRes);

  if (uQuant < 32.5) {
    col = floor(col * uQuant) / uQuant + 0.5 / uQuant;
  }
  col = (col - 0.5) * uContrast + 0.5;

  vec2 local = (px - center) / uCell * 2.0;
  float r = 1.0 - uGap;
  float aa = 3.0 / uCell;
  float metric;
  if (uShapeP < 0.5) metric = max(abs(local.x), abs(local.y));
  else if (uShapeP < 1.5) metric = length(local);
  else metric = (abs(local.x) + abs(local.y)) * 0.78;
  float m = 1.0 - smoothstep(r - aa, r + aa, metric);

  col = mix(col * 0.10, col, m);
  gl_FragColor = vec4(post(col, vUv), 1.0);
}
`,de=`
uniform float uType;
uniform float uScale;
uniform float uRefract;
uniform float uBlur;
uniform float uDropSize;
uniform float uDensity;
uniform float uTint;
uniform vec3 uTintCol;

vec3 voroPoint(vec2 p) {
  vec2 n = floor(p), f = fract(p);
  vec2 mr = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + hash2(n + g) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; }
  }
  return vec3(mr, md);
}

void main() {
  vec2 px = vUv * uRes;
  vec2 disp = vec2(0.0);
  float extraBlur = 0.0;
  float sparkle = 0.0;

  if (uType < 0.5) {
    // shower glass: layered value-noise displacement
    float n1 = vnoise(px / uScale) + 0.5 * vnoise(px / uScale * 2.7);
    float n2 = vnoise(px / uScale + 19.7) + 0.5 * vnoise(px / uScale * 2.7 + 31.1);
    disp = (vec2(n1, n2) * 0.6667 - 0.5) * 2.0;
  } else if (uType < 1.5) {
    // rain: droplet lenses over a fogged pane
    vec2 cell = floor(px / uDropSize);
    vec2 o = hash2(cell);
    vec2 dropPos = (cell + 0.15 + o * 0.7) * uDropSize;
    float rad = uDropSize * (0.16 + 0.20 * hash1(cell + 5.5));
    float exists = step(1.0 - uDensity, hash1(cell + 9.1));
    vec2 toC = px - dropPos;
    float d = length(toC) / rad;
    float inside = exists * smoothstep(1.0, 0.85, d);
    disp = -normalize(toC + 0.0001) * inside * max(1.0 - d * d, 0.0) * 2.4;
    extraBlur = 1.0 - inside;
    sparkle = exists * step(d, 1.0)
            * smoothstep(0.42, 0.0, length(toC / rad - vec2(-0.30, 0.35))) * 0.30;
  } else if (uType < 2.5) {
    // hammered: shallow cellular dimples
    vec3 v = voroPoint(px / uScale);
    disp = v.xy * smoothstep(0.0, 0.8, v.z) * 1.6;
  } else {
    // cathedral: slow molten ripples
    float w = 6.2831 / uScale;
    float nz = vnoise(px / (uScale * 2.0)) * 6.2831;
    disp = vec2(sin(px.y * w * 0.5 + nz), sin(px.x * w * 0.5 + nz * 1.3)) * 0.8;
  }

  vec2 baseUv = vUv + disp * uRefract * uScale * 0.45 / uRes;
  float a = hash1(px) * 6.2831;
  vec2 rot = vec2(cos(a), sin(a));
  float blurPx = uBlur * (1.0 + extraBlur * 0.8) * 14.0;
  vec3 col = frostSample(baseUv, rot, blurPx);

  col += sparkle;
  col = mix(col, col * uTintCol * 1.15, uTint);
  gl_FragColor = vec4(post(col, vUv), 1.0);
}
`,ue=`
uniform vec2 uCenter;
uniform vec2 uSize;
uniform float uRadius;
uniform float uEdge;
uniform float uRefract;
uniform float uDisperse;
uniform float uFrost;
uniform float uSpec;
uniform float uDim;

float sdRR(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 px = vUv * uRes;
  vec2 c = uCenter * uRes;
  vec2 halfSize = uSize * uRes * 0.5;
  float rad = min(uRadius, min(halfSize.x, halfSize.y));
  float d = sdRR(px - c, halfSize, rad);

  if (d > 0.0) {
    float sh = smoothstep(uEdge * 1.2, 0.0, d);
    vec3 col = srcTap(vUv) * (1.0 - uDim * 0.6) * (1.0 - sh * 0.22);
    gl_FragColor = vec4(post(col, vUv), 1.0);
    return;
  }

  vec2 e = vec2(1.5, 0.0);
  vec2 grad = vec2(
    sdRR(px - c + e.xy, halfSize, rad) - sdRR(px - c - e.xy, halfSize, rad),
    sdRR(px - c + e.yx, halfSize, rad) - sdRR(px - c - e.yx, halfSize, rad));
  vec2 n = normalize(grad + 0.0001);

  float edgeT = 1.0 - smoothstep(0.0, max(uEdge, 1.0), -d);
  float bend = pow(edgeT, 1.6) * uRefract * uEdge * 1.2;
  vec2 dispv = n * bend;

  float a = hash1(px) * 6.2831;
  vec2 rot = vec2(cos(a), sin(a));
  float blurPx = uFrost * 18.0;
  float lo = 1.0 - uDisperse * 0.25;
  float hi = 1.0 + uDisperse * 0.25;
  vec3 col;
  col.r = frostSample(vUv + dispv * hi / uRes, rot, blurPx).r;
  col.g = frostSample(vUv + dispv / uRes, rot, blurPx).g;
  col.b = frostSample(vUv + dispv * lo / uRes, rot, blurPx).b;
  col = mix(col, col * 0.92 + 0.08, 0.30);

  vec2 ld = normalize(vec2(-0.55, 0.84));
  float spec = pow(max(dot(n, ld), 0.0), 3.0) * edgeT;
  float counter = pow(max(dot(n, -ld), 0.0), 6.0) * edgeT * 0.4;
  col += (spec + counter) * uSpec * 0.8;
  col += smoothstep(2.5, 0.0, abs(d + 1.5)) * uSpec * 0.35;

  gl_FragColor = vec4(post(col, vUv), 1.0);
}
`,pe={fluted:se,mosaic:ne,pixel:ce,frosted:de,liquid:ue};function A(n,o,l){const a=n.createShader(o);if(n.shaderSource(a,l),n.compileShader(a),!n.getShaderParameter(a,n.COMPILE_STATUS)){const i=n.getShaderInfoLog(a);throw n.deleteShader(a),new Error(`Vitray shader compile failed: ${i}`)}return a}class me{constructor(o){if(this.canvas=o,this.gl=o.getContext("webgl",{preserveDrawingBuffer:!0,premultipliedAlpha:!1,antialias:!1}),this.programs={},this.locations={},this.texture=null,this.imgW=0,this.imgH=0,!this.gl)return;const l=this.gl,a=l.createBuffer();l.bindBuffer(l.ARRAY_BUFFER,a),l.bufferData(l.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),l.STATIC_DRAW),this.vert=A(l,l.VERTEX_SHADER,oe)}get ok(){return!!this.gl}get hasImage(){return!!this.texture}setImage(o,l,a){const i=this.gl;let d=l,c=a,m=o;const x=Math.max(d,c),y=Math.min(ie,i.getParameter(i.MAX_TEXTURE_SIZE));if(x>y){const u=y/x;d=Math.round(d*u),c=Math.round(c*u);const p=document.createElement("canvas");p.width=d,p.height=c;const g=p.getContext("2d");g.imageSmoothingEnabled=!0,g.imageSmoothingQuality="high",g.drawImage(o,0,0,d,c),m=p}return this.texture&&i.deleteTexture(this.texture),this.texture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.texture),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,m),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),this.imgW=d,this.imgH=c,{downscaled:x>y,width:d,height:c}}fitView(o=1600){const l=Math.min(1,o/Math.max(this.imgW,this.imgH));this.canvas.width=Math.max(1,Math.round(this.imgW*l)),this.canvas.height=Math.max(1,Math.round(this.imgH*l))}program(o){if(this.programs[o])return this.programs[o];const l=this.gl,a=A(l,l.FRAGMENT_SHADER,le+pe[o]),i=l.createProgram();if(l.attachShader(i,this.vert),l.attachShader(i,a),l.linkProgram(i),!l.getProgramParameter(i,l.LINK_STATUS))throw new Error(`Vitray program link failed: ${l.getProgramInfoLog(i)}`);return this.programs[o]=i,this.locations[o]={},i}loc(o,l){const a=this.locations[o];return l in a||(a[l]=this.gl.getUniformLocation(this.programs[o],l)),a[l]}render(o,l){const a=this.gl;if(!a||!this.texture)return;const i=this.program(o);a.useProgram(i),a.viewport(0,0,this.canvas.width,this.canvas.height);const d=a.getAttribLocation(i,"aPos");a.enableVertexAttribArray(d),a.vertexAttribPointer(d,2,a.FLOAT,!1,0,0),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.texture),a.uniform1i(this.loc(o,"uImg"),0),a.uniform2f(this.loc(o,"uRes"),this.imgW,this.imgH);for(const[c,m]of Object.entries(l)){const x=this.loc(o,c);x&&(Array.isArray(m)?m.length===2?a.uniform2f(x,m[0],m[1]):a.uniform3f(x,m[0],m[1],m[2]):a.uniform1f(x,m))}a.drawArrays(a.TRIANGLES,0,3)}exportPNG(o,l){const a=this.canvas.width,i=this.canvas.height;this.canvas.width=this.imgW,this.canvas.height=this.imgH,this.render(o,l);const d=this.canvas.toDataURL("image/png");return this.canvas.width=a,this.canvas.height=i,this.render(o,l),d}destroy(){const o=this.gl;o&&(this.texture&&o.deleteTexture(this.texture),Object.values(this.programs).forEach(l=>o.deleteProgram(l)),this.programs={})}}function fe(){const l=document.createElement("canvas");l.width=1440,l.height=960;const a=l.getContext("2d"),i=a.createLinearGradient(0,0,0,960*.72);i.addColorStop(0,"#1B2B5E"),i.addColorStop(.45,"#43508F"),i.addColorStop(.78,"#C2766B"),i.addColorStop(1,"#E8A05C"),a.fillStyle=i,a.fillRect(0,0,1440,960*.72);const d=1440*.62,c=960*.56,m=a.createRadialGradient(d,c,10,d,c,280);m.addColorStop(0,"rgba(255,228,170,0.95)"),m.addColorStop(.25,"rgba(255,200,120,0.45)"),m.addColorStop(1,"rgba(255,200,120,0)"),a.fillStyle=m,a.fillRect(0,0,1440,960*.72),a.fillStyle="#FFE9B8",a.beginPath(),a.arc(d,c,64,0,Math.PI*2),a.fill();const x=[{y:.46,amp:60,col:"#2E3A6E",step:11},{y:.56,amp:78,col:"#27305B",step:7},{y:.66,amp:52,col:"#1D2342",step:5}];for(const u of x){a.fillStyle=u.col,a.beginPath(),a.moveTo(0,960);for(let p=0;p<=1440;p+=8){const g=960*u.y+Math.sin(p/(u.step*16))*u.amp*.6+Math.sin(p/(u.step*5.3)+2.1)*u.amp*.3+Math.sin(p/(u.step*2.1)+.7)*u.amp*.1;a.lineTo(p,g)}a.lineTo(1440,960),a.closePath(),a.fill()}const y=a.createLinearGradient(0,960*.72,0,960);y.addColorStop(0,"#D98F58"),y.addColorStop(.3,"#8A5C66"),y.addColorStop(1,"#1E2547"),a.fillStyle=y,a.fillRect(0,960*.72,1440,960*.28);for(let u=0;u<90;u++){const p=u/90,g=960*.73+p*p*960*.25,w=30+Math.random()*180*(1-p*.5),k=d+(Math.random()-.5)*(140+p*700)-w/2;a.fillStyle=`rgba(255,214,150,${.32*(1-p*.75)})`,a.fillRect(k,g,w,1.6+p*2.4)}for(let u=0;u<60;u++){const p=Math.random()*1440,g=Math.random()*960*.38,w=Math.random()*1.4+.3;a.fillStyle=`rgba(255,255,255,${Math.random()*.7+.2})`,a.fillRect(p,g,w,w)}return l}const r={bg:"#0A0E1E",ink:"#F2F5FF",inkSoft:"rgba(228,234,255,0.62)",inkDim:"rgba(228,234,255,0.38)",cyan:"#5EE6D8",violet:"#8B7CFF",magenta:"#E66BC9",amber:"#FFC46B",glass:"rgba(255,255,255,0.07)",glassHi:"rgba(255,255,255,0.13)",edge:"rgba(255,255,255,0.16)",edgeHi:"rgba(255,255,255,0.30)"},xe=[r.cyan,r.violet,r.magenta,r.amber,"#6BB7FF","#9BE66B"],he=n=>{const o=parseInt(n.slice(1),16);return[(o>>16&255)/255,(o>>8&255)/255,(o&255)/255]},C=[{id:"fluted",tr:"Oluklu",en:"Fluted",Icon:V,tone:"#5EE6D8",hint:"Reeded architectural glass — parallel half-round ribs that smear the world sideways.",params:[{kind:"range",key:"uWidth",label:"Flute Width",min:6,max:120,step:1,def:28,unit:"px"},{kind:"range",key:"uRefract",label:"Refraction",min:0,max:1,step:.01,def:.55},{kind:"range",key:"uAngle",label:"Angle",min:0,max:180,step:1,def:0,unit:"°"},{kind:"range",key:"uBlur",label:"Rib Blur",min:0,max:1,step:.01,def:.15},{kind:"range",key:"uHighlight",label:"Highlight",min:0,max:1,step:.01,def:.35},{kind:"range",key:"uSeam",label:"Seam Shadow",min:0,max:1,step:.01,def:.4},{kind:"choice",key:"uProfile",label:"Profile",def:0,options:[{v:0,label:"Round"},{v:1,label:"Prism"}]}]},{id:"mosaic",tr:"Mozaik",en:"Mosaic",Icon:Y,tone:"#FFC46B",hint:"Tesserae leaded into a panel — each tile takes one color of the image behind it.",params:[{kind:"choice",key:"uShape",label:"Tessera",def:2,options:[{v:0,label:"Square"},{v:1,label:"Hex"},{v:2,label:"Voronoi"}]},{kind:"range",key:"uTile",label:"Tile Size",min:8,max:160,step:1,def:42,unit:"px"},{kind:"range",key:"uGrout",label:"Came Width",min:0,max:12,step:.5,def:2.5,unit:"px"},{kind:"color",key:"uGroutCol",label:"Came Color",def:"#16120D"},{kind:"range",key:"uFlatten",label:"Color Flatten",min:0,max:1,step:.01,def:.85},{kind:"range",key:"uVariance",label:"Pane Variance",min:0,max:1,step:.01,def:.25},{kind:"range",key:"uBevel",label:"Bevel Light",min:0,max:1,step:.01,def:.45}]},{id:"pixel",tr:"Piksel",en:"Privacy",Icon:Z,tone:"#E66BC9",hint:"Censor-glass pixelation — chunky cells, optional palette quantizing and jitter.",params:[{kind:"range",key:"uCell",label:"Cell Size",min:4,max:96,step:1,def:18,unit:"px"},{kind:"choice",key:"uShapeP",label:"Cell Shape",def:0,options:[{v:0,label:"Square"},{v:1,label:"Dot"},{v:2,label:"Diamond"}]},{kind:"range",key:"uGap",label:"Gap",min:0,max:.45,step:.01,def:.08},{kind:"range",key:"uQuant",label:"Palette Steps",min:2,max:33,step:1,def:33,fmt:n=>n>32.5?"∞":String(n)},{kind:"range",key:"uJitter",label:"Jitter",min:0,max:1,step:.01,def:0},{kind:"range",key:"uContrast",label:"Contrast",min:.5,max:2,step:.05,def:1}]},{id:"frosted",tr:"Buzlu",en:"Frosted",Icon:te,tone:"#6BB7FF",hint:"Bathroom panes — shower noise, rain droplets, hammered dimples, cathedral ripple.",params:[{kind:"choice",key:"uType",label:"Texture",def:0,options:[{v:0,label:"Shower"},{v:1,label:"Rain"},{v:2,label:"Hammered"},{v:3,label:"Cathedral"}]},{kind:"range",key:"uScale",label:"Texture Scale",min:8,max:200,step:1,def:60,unit:"px"},{kind:"range",key:"uRefract",label:"Refraction",min:0,max:1,step:.01,def:.5},{kind:"range",key:"uBlur",label:"Frost",min:0,max:1,step:.01,def:.35},{kind:"range",key:"uDropSize",label:"Drop Size",min:24,max:200,step:1,def:90,unit:"px",showIf:n=>n.uType===1},{kind:"range",key:"uDensity",label:"Drop Density",min:0,max:1,step:.01,def:.5,showIf:n=>n.uType===1},{kind:"range",key:"uTint",label:"Tint",min:0,max:1,step:.01,def:.15},{kind:"color",key:"uTintCol",label:"Tint Color",def:"#BFD8DF"}]},{id:"liquid",tr:"Akışkan",en:"Liquid",Icon:ee,tone:"#8B7CFF",hint:"A floating liquid-glass panel — drag it around the pane to reposition it.",params:[{kind:"range",key:"uSizeX",label:"Panel Width",min:.1,max:1,step:.01,def:.62},{kind:"range",key:"uSizeY",label:"Panel Height",min:.1,max:1,step:.01,def:.42},{kind:"range",key:"uCenterX",label:"Center X",min:0,max:1,step:.01,def:.5},{kind:"range",key:"uCenterY",label:"Center Y",min:0,max:1,step:.01,def:.5},{kind:"range",key:"uRadius",label:"Corner Radius",min:0,max:240,step:1,def:64,unit:"px"},{kind:"range",key:"uEdge",label:"Edge Band",min:4,max:140,step:1,def:46,unit:"px"},{kind:"range",key:"uRefract",label:"Refraction",min:0,max:1,step:.01,def:.6},{kind:"range",key:"uDisperse",label:"Dispersion",min:0,max:1,step:.01,def:.35},{kind:"range",key:"uFrost",label:"Frost",min:0,max:1,step:.01,def:.25},{kind:"range",key:"uSpec",label:"Specular",min:0,max:1,step:.01,def:.6},{kind:"range",key:"uDim",label:"Backdrop Dim",min:0,max:1,step:.01,def:.25}]}],$=Object.fromEntries(C.map(n=>[n.id,n])),ge=()=>Object.fromEntries(C.map(n=>[n.id,Object.fromEntries(n.params.map(o=>[o.key,o.def]))])),U=(n,o,l,a)=>{const i={uSeed:a,uVignette:l.vignette,uGrain:l.grain};for(const d of $[n].params)i[d.key]=d.kind==="color"?he(o[d.key]):o[d.key];return n==="liquid"&&(i.uSize=[o.uSizeX,o.uSizeY],i.uCenter=[o.uCenterX,o.uCenterY]),i};function Ce(){const n=h.useRef(null),o=h.useRef(null),l=h.useRef(null),a=h.useRef(0),i=h.useRef(!1),{addToast:d}=W(),[c,m]=h.useState("fluted"),[x,y]=h.useState(ge),[u,p]=h.useState({vignette:0,grain:.06}),[g,w]=h.useState(7.31),[k,P]=h.useState(null),[R,z]=h.useState(!1),[B,j]=h.useState(!1),S=$[c];h.useEffect(()=>{const t=new me(n.current);if(o.current=t,!t.ok)return z(!0),()=>t.destroy();const s=fe();return t.setImage(s,s.width,s.height),t.fitView(),P({name:"numune — dusk specimen",w:s.width,h:s.height,version:1}),()=>t.destroy()},[]),h.useEffect(()=>(cancelAnimationFrame(a.current),a.current=requestAnimationFrame(()=>{const t=o.current;if(!(!t?.ok||!t.hasImage))try{t.render(c,U(c,x[c],u,g))}catch(s){console.error(s)}}),()=>cancelAnimationFrame(a.current)),[c,x,u,g,k]);const T=(t,s)=>y(f=>({...f,[c]:{...f[c],[t]:s}})),M=()=>y(t=>({...t,[c]:Object.fromEntries(S.params.map(s=>[s.key,s.def]))})),E=t=>{if(!t||!t.type.startsWith("image/")){d({title:"Kırık Cam · Not Glass",message:"That file is not an image — the kiln only takes pictures.",duration:2600});return}const s=URL.createObjectURL(t),f=new Image;f.onload=()=>{const v=o.current,b=v.setImage(f,f.naturalWidth,f.naturalHeight);v.fitView(),URL.revokeObjectURL(s),P(L=>({name:t.name,w:b.width,h:b.height,version:(L?.version||0)+1})),b.downscaled&&d({title:"Pane Trimmed",message:`Large sheet — scaled to ${b.width}×${b.height} to fit the kiln.`,duration:3e3})},f.onerror=()=>{URL.revokeObjectURL(s),d({title:"Kırık Cam · Broken Pane",message:"Could not read that image file.",duration:2600})},f.src=s},I=t=>{t.preventDefault(),j(!1),E(t.dataTransfer.files?.[0])},_=()=>{const t=o.current;if(!t?.ok||!t.hasImage)return;const s=t.exportPNG(c,U(c,x[c],u,g)),f=document.createElement("a");f.download=`vitray_${c}_${Date.now()}.png`,f.href=s,f.click(),d({title:"Cam Alındı · Pane Lifted",message:"Your glass has been fired and saved at full resolution.",duration:3e3})},N=t=>{const s=n.current.getBoundingClientRect(),f=Math.min(1,Math.max(0,(t.clientX-s.left)/s.width)),v=Math.min(1,Math.max(0,1-(t.clientY-s.top)/s.height));y(b=>({...b,liquid:{...b.liquid,uCenterX:Math.round(f*100)/100,uCenterY:Math.round(v*100)/100}}))},G=t=>{c==="liquid"&&(i.current=!0,n.current.setPointerCapture?.(t.pointerId),N(t))},H=t=>{i.current&&N(t)},F=()=>{i.current=!1};return e.jsxs("div",{className:"vitray-page min-h-screen relative",style:{background:r.bg,color:r.ink},children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700&family=Sora:wght@300;400;500;600&display=swap');
        .vitray-page { font-family: 'Sora', 'Segoe UI', sans-serif; font-size: 14px; overflow: hidden; }
        .vitray-display { font-family: 'Unbounded', sans-serif; }
        .vitray-label { letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500; }

        /* aurora field */
        .vitray-aurora { position: fixed; inset: 0; pointer-events: none; }
        .vitray-aurora i {
          position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5;
          animation: vitray-float 26s ease-in-out infinite alternate;
        }
        .vitray-aurora i:nth-child(1) { width: 620px; height: 620px; left: -12%; top: -18%; background: ${r.violet}; }
        .vitray-aurora i:nth-child(2) { width: 540px; height: 540px; right: -10%; top: 4%; background: ${r.cyan}; animation-delay: -7s; opacity: 0.32; }
        .vitray-aurora i:nth-child(3) { width: 560px; height: 560px; left: 26%; bottom: -28%; background: ${r.magenta}; animation-delay: -14s; opacity: 0.30; }
        .vitray-aurora i:nth-child(4) { width: 340px; height: 340px; right: 22%; bottom: -10%; background: ${r.amber}; animation-delay: -20s; opacity: 0.22; }
        @keyframes vitray-float {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(60px, 40px, 0) scale(1.12); }
        }

        /* glass sheets */
        .vitray-sheet {
          background: linear-gradient(150deg, ${r.glassHi}, ${r.glass} 55%);
          backdrop-filter: blur(18px) saturate(1.5);
          -webkit-backdrop-filter: blur(18px) saturate(1.5);
          border: 1px solid ${r.edge};
          border-radius: 20px;
          box-shadow: 0 18px 48px -22px rgba(0,0,0,0.7), inset 0 1px 0 ${r.edgeHi};
        }
        .vitray-pill {
          background: ${r.glass};
          border: 1px solid ${r.edge};
          border-radius: 999px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
          transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .15s ease;
        }
        .vitray-pill:hover { background: ${r.glassHi}; border-color: ${r.edgeHi}; }
        .vitray-pill:active { transform: scale(0.97); }
        .vitray-effect { transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .15s ease; }
        .vitray-effect:hover { transform: translateX(3px); }

        .vitray-pane { display: block; width: 100%; height: auto; touch-action: none; border-radius: 12px; }
        .vitray-pane.liquid { cursor: grab; }
        .vitray-pane.liquid:active { cursor: grabbing; }

        input[type=range].vitray-range {
          -webkit-appearance: none; appearance: none; width: 100%; height: 22px; background: transparent; cursor: pointer;
        }
        input[type=range].vitray-range::-webkit-slider-runnable-track {
          height: 4px; border-radius: 999px;
          background: linear-gradient(90deg, ${r.cyan}, ${r.violet});
          box-shadow: inset 0 0 0 100px rgba(10,14,30,0.35);
        }
        input[type=range].vitray-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; margin-top: -6px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 10px rgba(94,230,216,0.55), inset 0 -2px 4px rgba(120,140,255,0.45);
        }
        input[type=range].vitray-range::-moz-range-track {
          height: 4px; border-radius: 999px; background: linear-gradient(90deg, ${r.cyan}, ${r.violet});
        }
        input[type=range].vitray-range::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 2px 10px rgba(94,230,216,0.55);
        }
        input[type=color].vitray-color {
          appearance: none; -webkit-appearance: none; border: 1px solid ${r.edgeHi};
          background: ${r.glass}; width: 38px; height: 24px; padding: 2px; cursor: pointer; border-radius: 999px;
        }
        input[type=color].vitray-color::-webkit-color-swatch-wrapper { padding: 0; }
        input[type=color].vitray-color::-webkit-color-swatch { border: none; border-radius: 999px; }

        .vitray-strip span {
          height: 8px; flex: 1; border-radius: 999px; opacity: 0.85;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .vitray-drop { outline: 2px dashed ${r.cyan}; outline-offset: -12px; }
        .vitray-title {
          background: linear-gradient(100deg, #FFFFFF 10%, ${r.cyan} 38%, ${r.violet} 62%, ${r.magenta} 90%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
      `}),e.jsx(re,{title:"Vitray — The Glass Workshop | Fezcodex",description:"A liquid-glass studio for your images. Refract any picture through fluted, mosaic, pixel, frosted or liquid glass — dozens of live parameters, full-resolution export.",keywords:["vitray","glass effect","fluted glass","stained glass","frosted glass","liquid glass","glassmorphism","image filter","webgl"]}),e.jsxs("div",{className:"vitray-aurora","aria-hidden":"true",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{})]}),e.jsx("div",{className:"sticky top-0 z-20",style:{background:"rgba(10,14,30,0.55)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid ${r.edge}`},children:e.jsxs("div",{className:"mx-auto max-w-[1500px] px-5 md:px-10 py-3 flex items-center justify-between gap-4",children:[e.jsxs(X,{to:"/apps",className:"vitray-pill flex items-center gap-2 px-3.5 py-1.5 hover:opacity-90",style:{color:r.inkSoft},children:[e.jsx(q,{size:13}),e.jsx("span",{className:"vitray-label text-[10px]",children:"Apps"})]}),e.jsxs("div",{className:"hidden md:flex items-center gap-3",style:{color:r.inkSoft},children:[e.jsx("span",{className:"vitray-label text-[10px]",children:"Cam Atölyesi"}),e.jsx("span",{className:"w-px h-3",style:{background:r.edge}}),e.jsx("span",{className:"text-[12px]",style:{color:r.cyan},children:k?`${k.w} × ${k.h}`:"— × —"})]})]})}),e.jsxs("div",{className:"relative mx-auto max-w-[1500px] px-4 md:px-10 py-6 md:py-10",children:[e.jsxs("header",{className:"text-center mb-7 md:mb-9",children:[e.jsx("h1",{className:"vitray-display vitray-title font-bold",style:{fontSize:"clamp(34px,5.5vw,56px)",lineHeight:1.1,letterSpacing:"0.04em"},children:"VITRAY"}),e.jsx("div",{className:"vitray-label text-[11px] mt-2.5",style:{color:r.inkSoft},children:"The Glass Workshop"}),e.jsx("div",{className:"vitray-strip mx-auto mt-4 flex gap-1.5",style:{maxWidth:300},children:xe.map((t,s)=>e.jsx("span",{style:{background:t}},s))})]}),e.jsxs("div",{className:"flex flex-col lg:flex-row gap-5 lg:gap-6 items-start",children:[e.jsxs("aside",{className:"w-full lg:w-[235px] shrink-0 flex flex-col gap-4",children:[e.jsxs("section",{className:"vitray-sheet p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",style:{color:r.inkSoft},children:[e.jsx(O,{size:14}),e.jsx("span",{className:"vitray-label text-[10px]",children:"Camlar · Glasses"})]}),e.jsx("div",{className:"flex flex-col gap-2",children:C.map(t=>{const s=c===t.id;return e.jsxs("button",{type:"button",onClick:()=>m(t.id),className:"vitray-effect flex items-center gap-3 px-3 py-2.5 text-left",style:{background:s?`linear-gradient(120deg, ${t.tone}33, rgba(255,255,255,0.06))`:"rgba(255,255,255,0.03)",color:s?r.ink:r.inkSoft,border:`1px solid ${s?`${t.tone}88`:r.edge}`,borderRadius:14,boxShadow:s?`0 0 22px -6px ${t.tone}66, inset 0 1px 0 ${r.edgeHi}`:"inset 0 1px 0 rgba(255,255,255,0.08)"},children:[e.jsx(t.Icon,{size:18,weight:s?"fill":"regular",style:{color:s?t.tone:r.inkSoft}}),e.jsxs("span",{children:[e.jsx("span",{className:"block text-[14px] leading-tight font-medium",children:t.tr}),e.jsx("span",{className:"vitray-label block text-[9px]",style:{opacity:.65},children:t.en})]})]},t.id)})}),e.jsx("p",{className:"text-[12px] leading-relaxed mt-3.5",style:{color:r.inkDim},children:S.hint})]}),e.jsxs("section",{className:"vitray-sheet p-4 flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2",style:{color:r.inkSoft},children:[e.jsx(D,{size:14}),e.jsx("span",{className:"vitray-label text-[10px]",children:"Finishing"})]}),e.jsxs("label",{className:"block",style:{color:r.inkSoft},children:[e.jsxs("div",{className:"flex justify-between text-[10px] vitray-label mb-0.5",children:[e.jsx("span",{children:"Vignette"}),e.jsx("span",{style:{color:r.ink},children:u.vignette.toFixed(2)})]}),e.jsx("input",{className:"vitray-range",type:"range",min:"0",max:"1",step:"0.01",value:u.vignette,onChange:t=>p(s=>({...s,vignette:Number(t.target.value)}))})]}),e.jsxs("label",{className:"block",style:{color:r.inkSoft},children:[e.jsxs("div",{className:"flex justify-between text-[10px] vitray-label mb-0.5",children:[e.jsx("span",{children:"Grain"}),e.jsx("span",{style:{color:r.ink},children:u.grain.toFixed(2)})]}),e.jsx("input",{className:"vitray-range",type:"range",min:"0",max:"1",step:"0.01",value:u.grain,onChange:t=>p(s=>({...s,grain:Number(t.target.value)}))})]}),e.jsxs("button",{type:"button",onClick:()=>w(Math.random()*100),className:"vitray-pill flex items-center justify-center gap-2 px-3 py-2 text-[10px] vitray-label",style:{color:r.inkSoft},children:[e.jsx(Q,{size:14})," Remix Texture"]})]})]}),e.jsxs("main",{className:"flex-1 w-full min-w-0",children:[e.jsx("div",{className:`vitray-sheet p-2.5 ${B?"vitray-drop":""}`,onDragOver:t=>{t.preventDefault(),j(!0)},onDragLeave:()=>j(!1),onDrop:I,children:e.jsx("div",{className:"relative",style:{background:"rgba(0,0,0,0.35)",borderRadius:12},children:R?e.jsx("div",{className:"flex items-center justify-center text-center px-8",style:{aspectRatio:"3 / 2"},children:e.jsx("p",{className:"text-[15px]",style:{color:r.inkSoft},children:"The kiln is cold — WebGL is unavailable in this browser, and glass cannot be fired without it."})}):e.jsx("canvas",{ref:n,className:`vitray-pane ${c==="liquid"?"liquid":""}`,style:k?{aspectRatio:`${k.w} / ${k.h}`}:{aspectRatio:"3 / 2"},onPointerDown:G,onPointerMove:H,onPointerUp:F,onPointerCancel:F})})}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2 mt-3 px-1",children:[e.jsxs("span",{className:"vitray-label text-[9px]",style:{color:r.inkDim},children:[k?k.name:"no pane loaded"," · Vitray · MMXXVI"]}),c==="liquid"&&e.jsx("span",{className:"text-[12px]",style:{color:r.violet},children:"drag the pane to move the panel"})]}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 mt-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{ref:l,type:"file",accept:"image/*",className:"hidden",onChange:t=>{E(t.target.files?.[0]),t.target.value=""}}),e.jsxs("button",{type:"button",onClick:()=>l.current?.click(),disabled:R,className:"vitray-pill flex items-center gap-2 px-4 py-2.5 text-[10px] vitray-label",style:{color:r.ink,opacity:R?.35:1},children:[e.jsx(ae,{size:15,style:{color:r.cyan}})," Load Image"]}),e.jsxs("button",{type:"button",onClick:M,className:"vitray-pill flex items-center gap-2 px-4 py-2.5 text-[10px] vitray-label",style:{color:r.inkSoft},children:[e.jsx(K,{size:15})," Reset"]})]}),e.jsxs("button",{type:"button",onClick:_,disabled:R,className:"vitray-pill flex items-center gap-2 px-5 py-2.5 text-[10px] vitray-label",style:{color:"#0A0E1E",background:`linear-gradient(110deg, ${r.cyan}, ${r.violet})`,border:"1px solid rgba(255,255,255,0.45)",boxShadow:`0 6px 26px -8px ${r.cyan}AA, inset 0 1px 0 rgba(255,255,255,0.6)`,fontWeight:600,opacity:R?.35:1},children:[e.jsx(J,{size:15,weight:"bold"})," Lift Pane"]})]})]}),e.jsx("aside",{className:"w-full lg:w-[270px] shrink-0",children:e.jsxs("div",{className:"vitray-sheet p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3.5",style:{color:r.inkSoft},children:[e.jsx(D,{size:14,style:{color:S.tone}}),e.jsxs("span",{className:"vitray-label text-[10px]",children:[S.tr," · Parameters"]})]}),e.jsx("div",{className:"flex flex-col gap-3",children:S.params.map(t=>{if(t.showIf&&!t.showIf(x[c]))return null;const s=x[c][t.key];if(t.kind==="choice")return e.jsxs("div",{children:[e.jsx("div",{className:"text-[10px] vitray-label mb-1.5",style:{color:r.inkSoft},children:t.label}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:t.options.map(v=>{const b=s===v.v;return e.jsx("button",{type:"button",onClick:()=>T(t.key,v.v),className:"vitray-pill px-3 py-1 text-[11px]",style:{background:b?`${S.tone}2E`:void 0,color:b?r.ink:r.inkSoft,borderColor:b?`${S.tone}99`:void 0,boxShadow:b?`0 0 14px -4px ${S.tone}77`:void 0},children:v.label},v.v)})})]},t.key);if(t.kind==="color")return e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-[10px] vitray-label",style:{color:r.inkSoft},children:t.label}),e.jsx("input",{type:"color",className:"vitray-color",value:s,onChange:v=>T(t.key,v.target.value)})]},t.key);const f=t.fmt?t.fmt(s):`${t.step<1?s.toFixed(2):s}${t.unit||""}`;return e.jsxs("label",{className:"block",style:{color:r.inkSoft},children:[e.jsxs("div",{className:"flex justify-between text-[10px] vitray-label mb-0.5",children:[e.jsx("span",{children:t.label}),e.jsx("span",{style:{color:r.ink},children:f})]}),e.jsx("input",{className:"vitray-range",type:"range",min:t.min,max:t.max,step:t.step,value:s,onChange:v=>T(t.key,Number(v.target.value))})]},t.key)})})]})})]})]})]})}export{Ce as default};
