// Small, cached, seamless veneer textures. Grain is periodic in both axes so
// large panels repeat without visible joins; each species has its own cut.
export const WOOD = {
  walnut: '#3d2a1e',
  bark: '#62432d',
  peat: '#241b16',
  maple: '#d9b982',
  birch: '#f0e4ce',
  cherry: '#99543a',
  cream: '#eee1c7',
  snow: '#fff4dc',
  oat: '#bda788',
  gold: '#b38a4e',
  poppy: '#8b3928',
  peach: '#c98a5a',
  rust: '#8a4b31',
  wheat: '#d2b17b',
  moss: '#53523b',
  lemon: '#c69646',
  ink: '#302318',
  teal: '#245260',
  jet: '#211914',
  denim: '#345967',
  plum: '#674338',
};

export const VENEERS = ['maple', 'walnut', 'teal', 'cherry', 'birch', 'bark'];
export const seedNumber = (value = '') => {
  let hash = 2166136261;
  for (const letter of String(value))
    hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return hash >>> 0;
};

let textureCache;
export function woodTextures() {
  if (textureCache) return textureCache;
  if (typeof document === 'undefined') return {};
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return {};
  const textures = {};
  for (const name of [...VENEERS, 'peat', 'gold']) {
    const hex = WOOD[name];
    const base = [1, 3, 5].map((offset) =>
      parseInt(hex.slice(offset, offset + 2), 16),
    );
    const data = ctx.createImageData(canvas.width, canvas.height);
    const seed = (seedNumber(name) / 4294967296) * Math.PI * 2;
    const strength = name === 'birch' ? 0.45 : name === 'maple' ? 0.7 : 1;
    for (let y = 0; y < canvas.height; y++) {
      const v = (y / canvas.height) * Math.PI * 2;
      for (let x = 0; x < canvas.width; x++) {
        const u = (x / canvas.width) * Math.PI * 2;
        const bend = Math.sin(u + seed) * 1.5 + Math.sin(u * 2 + seed) * 0.6;
        const figure =
          Math.sin(v * 3 + bend) * 0.6 + Math.sin(v * 7 + bend * 2) * 0.35;
        const grain = Math.sin(v * 29 + bend * 3 + figure * 1.4);
        const fiber = Math.sin(v * 91 + bend * 5 + Math.sin(u * 3 + v * 5));
        const pore = Math.pow(Math.max(0, Math.sin(v * 53 + bend * 3)), 16);
        const noise = (((Math.imul(x + 17, y + 131) * 13) % 31) / 31 - 0.5) * 2;
        const shade =
          (figure * 5 + grain * 3 + fiber * 1.7 - pore * 4 + noise) * strength;
        const offset = (y * canvas.width + x) * 4;
        for (let channel = 0; channel < 3; channel++) {
          data.data[offset + channel] = Math.max(
            0,
            Math.min(255, base[channel] + shade),
          );
        }
        data.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
    textures[name] = canvas.toDataURL('image/png');
  }
  textureCache = textures;
  return textures;
}
