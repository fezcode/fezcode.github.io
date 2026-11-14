import * as THREE from 'three';

const TAU = Math.PI * 2;
const FAMILIES = ['knot', 'bloom', 'weave', 'orbit', 'links'];
const ACCENTS = ['#708ecb', '#8d82b8', '#748ea1', '#9c8dbe', '#6f9daa'];
const PEARLS = ['#dbe1f0', '#e2e5ed', '#e2deee', '#d9e6e8', '#e7e3ec'];

export const normalizeSculptureWord = (word = '') =>
  String(word ?? '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('tr');

const hashWord = (word) => {
  let hash = 2166136261;
  for (const character of word) {
    hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
};

const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

/** Every aspect of the visual identity comes from the normalized word. */
export function getSculptureParameters(word) {
  const identity = normalizeSculptureWord(word);
  const hash = hashWord(identity);
  const random = seededRandom(hash);
  const pick = (values) => values[Math.floor(random() * values.length)];
  const range = (minimum, maximum) => minimum + random() * (maximum - minimum);
  const family = FAMILIES[(hash >>> 8) % FAMILIES.length];
  const section = random() < 0.58 ? 'ribbon' : 'tube';
  const knot = pick([
    [2, 3],
    [2, 5],
    [3, 4],
    [3, 5],
  ]);
  const width = section === 'ribbon' ? range(0.2, 0.31) : range(0.15, 0.235);
  return {
    identity,
    hash,
    family,
    section,
    winding: knot[0],
    lobes: family === 'knot' ? knot[1] : pick([2, 3, 4, 5]),
    phase: range(0, TAU),
    amplitude: range(0.18, 0.36),
    depth: range(0.4, 0.78),
    proportions: [range(0.82, 1.23), range(0.8, 1.22), range(0.8, 1.15)],
    width,
    thickness:
      section === 'ribbon' ? range(0.06, 0.105) : width * range(0.82, 1),
    twist: pick([-3, -2, -1, 1, 2, 3]),
    pulse: range(0.07, 0.2),
    pose: [range(0.18, 0.65), range(-1.1, 0.5), range(-0.4, 0.4)],
    accent: pick(ACCENTS),
    pearl: pick(PEARLS),
    roughness: range(0.14, 0.23),
    iridescence: range(0.55, 0.87),
    film: [range(120, 190), range(380, 460)],
  };
}

/** Closed paths are centered and sphere-bounded before any tube is added. */
export function getSculpturePaths(parameters, samples = 240) {
  const p = parameters;
  const paths = Array.from(
    { length: p.family === 'links' ? 2 : 1 },
    (_, strand) =>
      Array.from({ length: samples }, (_, index) => {
        const t = (index / samples) * TAU;
        let x;
        let y;
        let z;
        if (p.family === 'knot') {
          const radius = 1 + Math.cos(t * p.lobes) * p.amplitude;
          x = Math.cos(t * p.winding) * radius;
          y = Math.sin(t * p.winding) * radius;
          z = Math.sin(t * p.lobes) * p.depth;
        } else if (p.family === 'bloom') {
          const radius = 1 + Math.cos(t * p.lobes + p.phase) * p.amplitude;
          x = Math.cos(t) * radius;
          y = Math.sin(t) * radius;
          z = Math.sin(t * p.lobes + p.phase) * p.depth;
        } else if (p.family === 'weave') {
          // A folded loop with an embedded elliptical spine. The x/z angle
          // winds once and its radius stays positive, so separate portions
          // cannot share a centerline point as Lissajous harmonics can.
          const radius =
            1 + Math.cos(t * p.lobes + p.phase) * p.amplitude * 0.16;
          x = Math.sin(t) * radius;
          y = Math.sin(t * 2 + p.phase * 0.15) * 0.55;
          z = Math.cos(t) * (0.7 + p.depth * 0.3) * radius;
        } else if (p.family === 'orbit') {
          x = Math.cos(t) + Math.cos(t * 3 + p.phase) * p.amplitude;
          y = Math.sin(t) * 0.82 + Math.sin(t * 2) * p.amplitude;
          z = Math.sin(t * 2 + p.phase) * p.depth;
        } else {
          // Two linked hoops in perpendicular planes, with no shared vertices.
          x = Math.cos(t) + (strand === 0 ? -0.42 : 0.42);
          y = strand === 0 ? Math.sin(t) : Math.sin(t) * 0.1;
          z = strand === 0 ? Math.sin(t) * 0.1 : Math.sin(t);
        }
        return new THREE.Vector3(
          x * p.proportions[0],
          y * p.proportions[1],
          z * p.proportions[2],
        );
      }),
  );
  const bounds = new THREE.Box3().setFromPoints(paths.flat());
  const center = bounds.getCenter(new THREE.Vector3());
  let radius = 0;
  paths.forEach((path) =>
    path.forEach((point) => {
      point.sub(center);
      radius = Math.max(radius, point.length());
    }),
  );
  const scale = 1.3 / radius;
  paths.forEach((path) => path.forEach((point) => point.multiplyScalar(scale)));
  return paths;
}

export function createSculptureGeometry(parameters) {
  const samples = 240;
  const sides = 16;
  const positions = [];
  const indices = [];
  const edges = [];
  for (const points of getSculpturePaths(parameters, samples)) {
    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
    const frames = curve.computeFrenetFrames(samples, true);
    const edge = [];
    const offset = positions.length / 3;
    for (let index = 0; index <= samples; index += 1) {
      const t = index / samples;
      const center = curve.getPointAt(t);
      const twist = t * TAU * parameters.twist + parameters.phase;
      const wide = frames.normals[index]
        .clone()
        .multiplyScalar(Math.cos(twist))
        .addScaledVector(frames.binormals[index], Math.sin(twist));
      const narrow = frames.binormals[index]
        .clone()
        .multiplyScalar(Math.cos(twist))
        .addScaledVector(frames.normals[index], -Math.sin(twist));
      const width =
        parameters.width *
        (1 + Math.sin(t * TAU * parameters.lobes) * parameters.pulse);
      edge.push(center.clone().addScaledVector(wide, width));
      for (let side = 0; side <= sides; side += 1) {
        const angle = (side / sides) * TAU;
        const point = center
          .clone()
          .addScaledVector(wide, Math.cos(angle) * width)
          .addScaledVector(narrow, Math.sin(angle) * parameters.thickness);
        positions.push(point.x, point.y, point.z);
        if (index < samples && side < sides) {
          const a = offset + index * (sides + 1) + side;
          const b = a + sides + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    }
    edges.push(edge);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return { geometry, edges };
}

/** Project the same seeded paths for the no-WebGL version, sorted by depth. */
export function getSculptureFallback(parameters) {
  const rotation = new THREE.Euler(...parameters.pose);
  const segments = [];
  const count = 144;
  getSculpturePaths(parameters, count).forEach((path) => {
    const projected = path.map((point) => point.clone().applyEuler(rotation));
    for (let start = 0; start < count; start += 6) {
      const section = Array.from(
        { length: 8 },
        (_, offset) => projected[(start + offset) % count],
      );
      const depth =
        section.reduce((total, point) => total + point.z, 0) / section.length;
      const width =
        parameters.width *
        256 *
        (1 +
          Math.sin((start / count) * TAU * parameters.lobes) *
            parameters.pulse);
      segments.push({
        path: section
          .map(
            (point, index) =>
              `${index ? 'L' : 'M'} ${(320 + point.x * 128).toFixed(2)} ${(268 - point.y * 128).toFixed(2)}`,
          )
          .join(' '),
        depth,
        width,
      });
    }
  });
  return segments.sort((a, b) => a.depth - b.depth);
}
