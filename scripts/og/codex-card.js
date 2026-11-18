// Fezcodex share card. Data arrives as a base64url JSON `data` query param:
// { kind: 'default'|'blog'|'log', seed, title, desc, byline, pills[],
//   accent, header, footer, url }.
// The sculpture is a "folio": thin curved leaves fanned around a spine like
// the pages of a codex, seeded so every page gets its own.
import * as THREE from 'three';

function readData() {
  const raw = new URL(window.location.href).searchParams.get('data');
  if (!raw) throw new Error('Missing card data.');
  const json = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(json, (c) => c.charCodeAt(0))));
}

function rng(seedText) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619) >>> 0;
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeEnvironment(renderer, kind, accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const g = canvas.getContext('2d');
  const wash = g.createLinearGradient(0, 0, 0, 512);
  if (kind === 'blog') {
    wash.addColorStop(0, '#fff6ea');
    wash.addColorStop(0.45, '#b9a48c');
    wash.addColorStop(1, '#f7efe4');
  } else if (kind === 'log') {
    wash.addColorStop(0, '#5a5c70');
    wash.addColorStop(0.5, '#0c0c12');
    wash.addColorStop(1, '#3a3b4c');
  } else {
    wash.addColorStop(0, '#ffb3d9');
    wash.addColorStop(0.45, '#2a1663');
    wash.addColorStop(1, '#ffb27a');
  }
  g.fillStyle = wash;
  g.fillRect(0, 0, 1024, 512);
  g.fillStyle = '#ffffff';
  g.fillRect(70, 50, 120, 360);
  g.fillRect(600, 30, 230, 140);
  g.fillStyle = accent;
  g.fillRect(420, 70, 40, 360);
  g.fillRect(880, 120, 50, 300);
  g.fillStyle = '#0a0a10';
  g.fillRect(220, 90, 80, 340);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  texture.dispose();
  pmrem.dispose();
  return env;
}

function leafGeometry(width, height, bend, curl) {
  const geo = new THREE.BoxGeometry(width, height, 0.035, 48, 12, 1);
  geo.translate(width / 2, 0, 0); // spine at x = 0
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const u = x / width;
    // page bend away from the spine, plus a soft corner curl
    p.setZ(i, p.getZ(i) + bend * u * u + curl * u * (y / height) * Math.abs(y / height));
  }
  geo.computeVertexNormals();
  return geo;
}

function buildFolio(data, scene) {
  const rand = rng(data.seed || data.title || 'fezcodex');
  const accent = new THREE.Color(data.accent);
  const group = new THREE.Group();
  const count = 9 + Math.floor(rand() * 8);
  const fan = 2.2 + rand() * 1.8; // total fan angle (radians)
  const rise = 0.05 + rand() * 0.07;
  const twist = (rand() - 0.5) * 0.12;
  const width = 1.9 + rand() * 0.5;
  const height = 2.5 + rand() * 0.5;
  const accentLeaves = new Set();
  const accentCount = data.kind === 'blog' ? 2 : data.kind === 'log' ? count : 3;
  while (accentLeaves.size < Math.min(accentCount, count)) accentLeaves.add(Math.floor(rand() * count));

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const bend = 0.35 + rand() * 0.5;
    const curl = (rand() - 0.3) * 0.5;
    const geo = leafGeometry(width * (0.86 + rand() * 0.18), height, bend, curl);
    let material;
    if (data.kind === 'blog') {
      const tinted = accentLeaves.has(i);
      material = new THREE.MeshPhysicalMaterial({
        color: tinted ? accent : new THREE.Color('#f7f1e8'),
        roughness: tinted ? 0.22 : 0.32,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.6,
        sheenColor: new THREE.Color('#ffe9cf'),
      });
    } else if (data.kind === 'log') {
      const c = accent.clone().offsetHSL((t - 0.5) * 0.08, 0, (t - 0.5) * 0.12);
      material = new THREE.MeshPhysicalMaterial({
        color: c,
        roughness: 0.08,
        metalness: 0,
        transmission: 0.82,
        thickness: 0.6,
        ior: 1.45,
        attenuationColor: c,
        attenuationDistance: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      });
    } else {
      material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL((0.78 + t * 0.32) % 1, 0.85, 0.62),
        roughness: 0.12,
        metalness: 0.35,
        iridescence: 1,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [180, 620],
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      });
    }
    const leaf = new THREE.Mesh(geo, material);
    leaf.rotation.y = -fan / 2 + t * fan;
    leaf.rotation.z = i * twist;
    leaf.position.y = (i - count / 2) * rise;
    group.add(leaf);
  }
  group.rotation.x = 0.42 + rand() * 0.25;
  group.rotation.z = -0.35 + rand() * 0.3;
  // keep the fan opening toward the camera (a full turn can land edge-on)
  group.rotation.y = (rand() < 0.5 ? 0 : Math.PI) + (rand() - 0.5) * 1.1;
  scene.add(group);
  return { group, count };
}

// Default: leaves closed into a full rosette, an emblem rather than a book.
function buildRosette(data, scene) {
  const rand = rng(data.seed || 'fezcodex');
  const group = new THREE.Group();
  const count = 22;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const geo = leafGeometry(1.75, 1.15, 0.5, 0.25);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL((0.72 + t * 0.42) % 1, 0.9, 0.6),
      roughness: 0.1,
      metalness: 0.4,
      iridescence: 1,
      iridescenceIOR: 1.7,
      iridescenceThicknessRange: [200, 700],
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const leaf = new THREE.Mesh(geo, material);
    leaf.rotation.y = t * Math.PI * 2;
    leaf.rotation.x = 0.55 + Math.sin(t * Math.PI * 6) * 0.08;
    leaf.position.y = Math.sin(t * Math.PI * 4) * 0.05;
    group.add(leaf);
  }
  group.rotation.x = 0.62;
  group.rotation.z = (rand() - 0.5) * 0.1;
  scene.add(group);
  return { group };
}

// Log: a seeded stack of tinted glass tiles, like a card-catalogue drawer.
function buildStack(data, scene) {
  const rand = rng(data.seed || data.title || 'log');
  const accent = new THREE.Color(data.accent);
  const group = new THREE.Group();
  const count = 6 + Math.floor(rand() * 5);
  const size = 2.1;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const geo = new RoundedSlab(size, size * (0.62 + rand() * 0.12), 0.11);
    const c = accent.clone().offsetHSL((t - 0.5) * 0.1, 0, (0.5 - t) * 0.18);
    const material = new THREE.MeshPhysicalMaterial({
      color: c,
      roughness: 0.06,
      transmission: 0.78,
      thickness: 0.5,
      ior: 1.5,
      attenuationColor: c,
      attenuationDistance: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    const tile = new THREE.Mesh(geo, material);
    tile.position.set((rand() - 0.5) * 0.35, i * 0.24, (rand() - 0.5) * 0.35);
    tile.rotation.y = (rand() - 0.5) * 0.5;
    tile.rotation.x = -Math.PI / 2;
    group.add(tile);
  }
  group.rotation.x = 0.5;
  group.rotation.y = -0.6 + rand() * 0.3;
  group.rotation.z = 0.08;
  scene.add(group);
  return { group };
}

// Rounded rectangle slab with bevelled edges.
class RoundedSlab extends THREE.ExtrudeGeometry {
  constructor(w, h, depth) {
    const r = Math.min(w, h) * 0.12;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    super(shape, { depth, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4, curveSegments: 12 });
    this.center();
  }
}

// Log: a seeded colour field in the category's hues, soft blobs plus grain.
function paintField(data) {
  const canvas = document.getElementById('field');
  const g = canvas.getContext('2d');
  const rand = rng((data.seed || data.title || 'log') + ':field');
  const base = new THREE.Color(data.accent);
  const hsl = {};
  base.getHSL(hsl);
  const hue = (offset, s, l) => {
    const c = new THREE.Color().setHSL((hsl.h + offset + 1) % 1, s, l);
    return '#' + c.getHexString();
  };
  const spin = rand() < 0.5 ? 1 : -1;
  const palette = [
    hue(0, 0.9, 0.55),
    hue(spin * 0.08, 0.95, 0.5),
    hue(spin * 0.17, 0.85, 0.58),
    hue(-spin * 0.06, 0.8, 0.32),
    hue(spin * 0.3, 0.9, 0.62),
  ];
  g.fillStyle = hue(0, 0.75, 0.22);
  g.fillRect(0, 0, 1200, 630);
  g.filter = 'blur(70px)';
  for (let i = 0; i < 9; i++) {
    const x = rand() * 1300 - 50;
    const y = rand() * 700 - 40;
    const r = 180 + rand() * 280;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const color = palette[Math.floor(rand() * palette.length)];
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '00');
    g.fillStyle = grad;
    g.beginPath();
    g.ellipse(x, y, r * (0.8 + rand() * 0.6), r, rand() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.filter = 'none';
  // legibility: darken toward the bottom-left where the title sits
  const shade = g.createLinearGradient(0, 630, 700, 120);
  shade.addColorStop(0, '#00000073');
  shade.addColorStop(1, '#00000000');
  g.fillStyle = shade;
  g.fillRect(0, 0, 1200, 630);
  // film grain
  const img = g.getImageData(0, 0, 1200, 630);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 26;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
}

function fillCopy(data) {
  const card = document.getElementById('card');
  card.classList.add('card--' + data.kind);
  card.style.setProperty('--accent', data.accent);
  const title = document.getElementById('title');
  if (data.kind === 'default') {
    title.innerHTML = 'fezcodex<span class="mark">.</span>';
    const sections = document.getElementById('sections');
    document.querySelector('footer').insertBefore(sections, document.getElementById('page-url'));
    for (const label of ['writing', 'projects', 'discovery logs', 'apps', 'wordup']) {
      const s = document.createElement('span');
      s.textContent = label;
      sections.append(s);
    }
  } else {
    title.textContent = data.title;
  }
  document.getElementById('desc').textContent = data.desc || '';
  document.getElementById('byline').textContent = data.byline || '';
  document.getElementById('header-note').textContent = data.header || '';
  document.getElementById('footer-note').textContent = data.footer || '';
  document.getElementById('page-url').textContent = data.url || 'fezcode.com';
  const pills = document.getElementById('pills');
  (data.pills || []).forEach((label, i) => {
    const pill = document.createElement('span');
    if (i === 0) {
      const dot = document.createElement('b');
      dot.className = 'dot';
      pill.append(dot);
    }
    pill.append(label);
    pills.append(pill);
  });
}

function fitTitle() {
  const title = document.getElementById('title');
  const card = document.getElementById('card');
  if (card.classList.contains('card--default')) return;
  const desc = document.getElementById('desc');
  const isLog = card.classList.contains('card--log');
  const max = isLog ? 150 : 80;
  const lineH = isLog ? 0.98 : 1.04;
  for (let size = max; size >= 36; size -= 2) {
    title.style.fontSize = size + 'px';
    if (title.scrollWidth <= title.clientWidth && title.clientHeight <= size * lineH * 3 + 4) break;
  }
  // Long titles leave less room for the blurb.
  const lines = Math.round(title.clientHeight / (parseFloat(title.style.fontSize) * 1.04));
  desc.style.webkitLineClamp = lines >= 3 ? '2' : '3';
}

async function render() {
  const data = readData();
  fillCopy(data);
  await document.fonts.ready;
  if (!document.fonts.check('500 24px "Stack Sans Headline"')) throw new Error('Stack Sans did not load.');
  fitTitle();
  if (data.kind === 'log') {
    paintField(data);
    document.documentElement.dataset.ogReady = 'true';
    return;
  }

  const canvas = document.getElementById('sculpture');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(2);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  renderer.setSize(cw, ch, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = data.kind === 'log' ? 1.25 : 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer, data.kind, data.accent);
  const camera = new THREE.PerspectiveCamera(32, cw / ch, 0.1, 100);
  camera.position.set(0, 0.4, 9.2);
  camera.lookAt(0, 0, 0);
  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(data.accent, 2.2);
  rim.position.set(5, -2, -4);
  scene.add(rim);
  const build = { default: buildRosette, log: buildStack, blog: buildFolio }[data.kind] || buildFolio;
  const { group } = build(data, scene);

  // centre the folio in frame
  const box = new THREE.Box3().setFromObject(group);
  const centre = box.getCenter(new THREE.Vector3());
  group.position.sub(centre);
  const size = box.getSize(new THREE.Vector3());
  const fit = { default: [7.6, 4.6], log: [3.4, 3.6], blog: [3.9, 3.9] }[data.kind] || [3.9, 3.9];
  const scale = Math.min(fit[0] / size.x, fit[1] / size.y);
  group.scale.setScalar(scale);
  group.position.multiplyScalar(scale);

  renderer.render(scene, camera);
  await new Promise(requestAnimationFrame);
  renderer.render(scene, camera);
  document.documentElement.dataset.ogReady = 'true';
}

render().catch((error) => {
  document.documentElement.dataset.ogError = error.message;
  const message = document.createElement('p');
  message.className = 'error';
  message.textContent = error.message;
  document.getElementById('card').replaceChildren(message);
  console.error(error);
});
