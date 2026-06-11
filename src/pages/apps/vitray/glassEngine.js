// ─── VITRAY :: glass engine ──────────────────────────────────────────────
// A WebGL1 fragment-shader engine for refracting an uploaded image through
// different kinds of glass. The source image is a texture; every effect is a
// single-pass shader whose parameters arrive as uniforms, so all controls
// retune live. Coordinates inside shaders are in *image pixels* regardless of
// preview canvas size, so the exported full-resolution render matches the
// preview exactly.

const MAX_IMAGE_DIM = 4096;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Shared helpers prepended to every fragment shader. uRes is the *image*
// resolution; vUv spans the image. post() applies the global vignette/grain.
const COMMON = `
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
`;

// ── Oluklu · fluted / reeded glass ───────────────────────────────────────
const FLUTED = `
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
`;

// ── Mozaik · stained-glass tesserae ──────────────────────────────────────
const MOSAIC = `
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
`;

// ── Piksel · privacy-glass pixelation ────────────────────────────────────
const PIXEL = `
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
`;

// ── Buzlu · frosted & textured glass ─────────────────────────────────────
const FROSTED = `
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
`;

// ── Akışkan · liquid glass panel ─────────────────────────────────────────
const LIQUID = `
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
`;

const FRAGS = {
  fluted: FLUTED,
  mosaic: MOSAIC,
  pixel: PIXEL,
  frosted: FROSTED,
  liquid: LIQUID,
};

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Vitray shader compile failed: ${log}`);
  }
  return sh;
}

export class GlassEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    this.programs = {};
    this.locations = {};
    this.texture = null;
    this.imgW = 0;
    this.imgH = 0;
    if (!this.gl) return;
    const gl = this.gl;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    this.vert = compile(gl, gl.VERTEX_SHADER, VERT);
  }

  get ok() {
    return !!this.gl;
  }

  get hasImage() {
    return !!this.texture;
  }

  // source: HTMLImageElement / canvas. Caps the longest side at MAX_IMAGE_DIM.
  setImage(source, srcW, srcH) {
    const gl = this.gl;
    let w = srcW;
    let h = srcH;
    let src = source;
    const longest = Math.max(w, h);
    const maxDim = Math.min(MAX_IMAGE_DIM, gl.getParameter(gl.MAX_TEXTURE_SIZE));
    if (longest > maxDim) {
      const s = maxDim / longest;
      w = Math.round(w * s);
      h = Math.round(h * s);
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const ctx = off.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(source, 0, 0, w, h);
      src = off;
    }
    if (this.texture) gl.deleteTexture(this.texture);
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    this.imgW = w;
    this.imgH = h;
    return { downscaled: longest > maxDim, width: w, height: h };
  }

  // Size the on-screen canvas to a preview cap; rendering stays in image space.
  fitView(maxPreview = 1600) {
    const s = Math.min(1, maxPreview / Math.max(this.imgW, this.imgH));
    this.canvas.width = Math.max(1, Math.round(this.imgW * s));
    this.canvas.height = Math.max(1, Math.round(this.imgH * s));
  }

  program(effectId) {
    if (this.programs[effectId]) return this.programs[effectId];
    const gl = this.gl;
    const frag = compile(gl, gl.FRAGMENT_SHADER, COMMON + FRAGS[effectId]);
    const prog = gl.createProgram();
    gl.attachShader(prog, this.vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`Vitray program link failed: ${gl.getProgramInfoLog(prog)}`);
    }
    this.programs[effectId] = prog;
    this.locations[effectId] = {};
    return prog;
  }

  loc(effectId, name) {
    const cache = this.locations[effectId];
    if (!(name in cache)) {
      cache[name] = this.gl.getUniformLocation(this.programs[effectId], name);
    }
    return cache[name];
  }

  // params: flat object of uniform name → number | [x,y] | [r,g,b]
  render(effectId, params) {
    const gl = this.gl;
    if (!gl || !this.texture) return;
    const prog = this.program(effectId);
    gl.useProgram(prog);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.loc(effectId, 'uImg'), 0);
    gl.uniform2f(this.loc(effectId, 'uRes'), this.imgW, this.imgH);
    for (const [name, value] of Object.entries(params)) {
      const l = this.loc(effectId, name);
      if (!l) continue;
      if (Array.isArray(value)) {
        if (value.length === 2) gl.uniform2f(l, value[0], value[1]);
        else gl.uniform3f(l, value[0], value[1], value[2]);
      } else {
        gl.uniform1f(l, value);
      }
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // Re-renders at full image resolution and returns a PNG data URL, then
  // restores the preview size.
  exportPNG(effectId, params) {
    const prevW = this.canvas.width;
    const prevH = this.canvas.height;
    this.canvas.width = this.imgW;
    this.canvas.height = this.imgH;
    this.render(effectId, params);
    const url = this.canvas.toDataURL('image/png');
    this.canvas.width = prevW;
    this.canvas.height = prevH;
    this.render(effectId, params);
    return url;
  }

  destroy() {
    const gl = this.gl;
    if (!gl) return;
    if (this.texture) gl.deleteTexture(this.texture);
    Object.values(this.programs).forEach((p) => gl.deleteProgram(p));
    this.programs = {};
  }
}

// A small procedural dusk landscape so the atelier never opens onto an empty
// pane — drawn once on a 2D canvas and handed to the engine as the demo image.
export function makeDemoImage() {
  const W = 1440;
  const H = 960;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.72);
  sky.addColorStop(0, '#1B2B5E');
  sky.addColorStop(0.45, '#43508F');
  sky.addColorStop(0.78, '#C2766B');
  sky.addColorStop(1, '#E8A05C');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.72);

  const sunX = W * 0.62;
  const sunY = H * 0.56;
  const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 280);
  halo.addColorStop(0, 'rgba(255,228,170,0.95)');
  halo.addColorStop(0.25, 'rgba(255,200,120,0.45)');
  halo.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H * 0.72);
  ctx.fillStyle = '#FFE9B8';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 64, 0, Math.PI * 2);
  ctx.fill();

  const ridges = [
    { y: 0.46, amp: 60, col: '#2E3A6E', step: 11 },
    { y: 0.56, amp: 78, col: '#27305B', step: 7 },
    { y: 0.66, amp: 52, col: '#1D2342', step: 5 },
  ];
  for (const r of ridges) {
    ctx.fillStyle = r.col;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const y = H * r.y
        + Math.sin(x / (r.step * 16)) * r.amp * 0.6
        + Math.sin(x / (r.step * 5.3) + 2.1) * r.amp * 0.3
        + Math.sin(x / (r.step * 2.1) + 0.7) * r.amp * 0.1;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }

  const water = ctx.createLinearGradient(0, H * 0.72, 0, H);
  water.addColorStop(0, '#D98F58');
  water.addColorStop(0.3, '#8A5C66');
  water.addColorStop(1, '#1E2547');
  ctx.fillStyle = water;
  ctx.fillRect(0, H * 0.72, W, H * 0.28);

  for (let i = 0; i < 90; i++) {
    const t = i / 90;
    const y = H * 0.73 + t * t * H * 0.25;
    const len = 30 + Math.random() * 180 * (1 - t * 0.5);
    const x = sunX + (Math.random() - 0.5) * (140 + t * 700) - len / 2;
    ctx.fillStyle = `rgba(255,214,150,${0.32 * (1 - t * 0.75)})`;
    ctx.fillRect(x, y, len, 1.6 + t * 2.4);
  }

  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H * 0.38;
    const r = Math.random() * 1.4 + 0.3;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.2})`;
    ctx.fillRect(x, y, r, r);
  }

  return cv;
}
