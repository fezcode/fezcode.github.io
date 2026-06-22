/**
 * imageFilters.js — pure image-processing engine for the Darkroom studio.
 *
 * Consolidates every effect that previously lived inside ImageToolkitPage into a
 * single, dependency-light module. The React layer stays presentational; all the
 * pixel math happens here. Each transform takes/returns ImageData (or mutates a
 * data buffer in place) so it can be unit-tested without a DOM.
 */
import { canvasRGBA } from 'stackblur-canvas';
import { getPalette } from 'color-thief-react';

/* ------------------------------------------------------------------ helpers */

const luma = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;

export function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function toGrayscaleData(imageData) {
  const data = new Uint8ClampedArray(imageData.data);
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  return data;
}

/* ----------------------------------------------------------------- effects */

function monochrome(data) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
}

function solarize(data, threshold = 128) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < threshold) data[i] = 255 - data[i];
    if (data[i + 1] < threshold) data[i + 1] = 255 - data[i + 1];
    if (data[i + 2] < threshold) data[i + 2] = 255 - data[i + 2];
  }
}

function sepia(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
}

function duotone(data, darkHex, lightHex) {
  const dark = hexToRgb(darkHex);
  const light = hexToRgb(lightHex);
  for (let i = 0; i < data.length; i += 4) {
    const t = luma(data[i], data[i + 1], data[i + 2]) / 255;
    data[i] = dark.r + (light.r - dark.r) * t;
    data[i + 1] = dark.g + (light.g - dark.g) * t;
    data[i + 2] = dark.b + (light.b - dark.b) * t;
  }
}

function bayerDither(imageData) {
  const { data, width, height } = imageData;
  const matrix = [
    [1, 9, 3, 11],
    [13, 5, 15, 7],
    [4, 12, 2, 10],
    [16, 8, 14, 6],
  ];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const gray = luma(data[i], data[i + 1], data[i + 2]);
      const threshold = matrix[y % 4][x % 4] * 16;
      data[i] = data[i + 1] = data[i + 2] = gray < threshold ? 0 : 255;
    }
  }
}

function quantizeColors(imageData, levels) {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / factor) * factor);
    data[i + 1] = Math.round(Math.round(data[i + 1] / factor) * factor);
    data[i + 2] = Math.round(Math.round(data[i + 2] / factor) * factor);
  }
  return new ImageData(data, imageData.width, imageData.height);
}

function posterize(imageData, levels) {
  return quantizeColors(imageData, Math.max(2, levels));
}

function sobel(imageData) {
  const { width, height } = imageData;
  const gray = toGrayscaleData(imageData);
  const out = new Uint8ClampedArray(gray.length);
  const gx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const gy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let px = 0;
      let py = 0;
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const v = gray[((y + j) * width + (x + i)) * 4];
          px += v * gx[j + 1][i + 1];
          py += v * gy[j + 1][i + 1];
        }
      }
      const mag = Math.sqrt(px * px + py * py);
      const idx = (y * width + x) * 4;
      out[idx] = out[idx + 1] = out[idx + 2] = mag;
      out[idx + 3] = 255;
    }
  }
  return new ImageData(out, width, height);
}

function combineCel(quantized, edges) {
  const q = quantized.data;
  const e = edges.data;
  const out = new Uint8ClampedArray(q.length);
  for (let i = 0; i < q.length; i += 4) {
    if (e[i] > 128) {
      out[i] = out[i + 1] = out[i + 2] = 0;
    } else {
      out[i] = q[i];
      out[i + 1] = q[i + 1];
      out[i + 2] = q[i + 2];
    }
    out[i + 3] = 255;
  }
  return new ImageData(out, quantized.width, quantized.height);
}

function halftone(imageData, gridSize) {
  const { width, height } = imageData;
  const gray = toGrayscaleData(imageData);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';
  const g = Math.max(2, gridSize);
  for (let y = 0; y < height; y += g) {
    for (let x = 0; x < width; x += g) {
      let total = 0;
      let count = 0;
      for (let j = 0; j < g; j++) {
        for (let i = 0; i < g; i++) {
          if (x + i < width && y + j < height) {
            total += gray[((y + j) * width + (x + i)) * 4];
            count++;
          }
        }
      }
      const radius = (g / 2) * (1 - total / count / 255);
      ctx.beginPath();
      ctx.arc(x + g / 2, y + g / 2, Math.max(0, radius), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return ctx.getImageData(0, 0, width, height);
}

function pixelize(ctx, w, h, size) {
  const block = Math.max(2, size);
  const sw = Math.max(1, Math.round(w / block));
  const sh = Math.max(1, Math.round(h / block));
  const tmp = document.createElement('canvas');
  tmp.width = sw;
  tmp.height = sh;
  tmp.getContext('2d').drawImage(ctx.canvas, 0, 0, sw, sh);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tmp, 0, 0, sw, sh, 0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
}

function asciiArt(imageData, ramp) {
  const data = toGrayscaleData(imageData);
  const { width, height } = imageData;
  let out = '';
  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 4) {
      const v = data[(y * width + x) * 4] / 255;
      out += ramp[Math.floor(v * (ramp.length - 1))];
    }
    out += '\n';
  }
  return out;
}

/* ------------------------------------------------------------ public API */

/**
 * EFFECT_GROUPS — declarative catalog driving the Develop station UI.
 * Each effect optionally declares `controls` (range/color) that the panel
 * renders dynamically and feeds back through `params`.
 */
export const EFFECT_GROUPS = [
  {
    label: 'Tone',
    effects: [
      { id: 'monochrome', label: 'Monochrome', hint: 'Neutral grayscale' },
      { id: 'sepia', label: 'Sepia', hint: 'Warm vintage wash' },
      { id: 'solarize', label: 'Solarize', hint: 'Sabattier reversal' },
      {
        id: 'duotone',
        label: 'Duotone',
        hint: 'Two-tone gradient map',
        controls: [
          { type: 'color', key: 'duoDark', label: 'Shadows', default: '#241036' },
          {
            type: 'color',
            key: 'duoLight',
            label: 'Highlights',
            default: '#ffcf8b',
          },
        ],
      },
    ],
  },
  {
    label: 'Screen',
    effects: [
      {
        id: 'posterize',
        label: 'Posterize',
        hint: 'Crush tonal levels',
        controls: [
          { type: 'range', key: 'levels', label: 'Levels', min: 2, max: 8, step: 1, default: 4 },
        ],
      },
      { id: 'dither', label: 'Bayer Dither', hint: '1-bit ordered screen' },
      {
        id: 'halftone',
        label: 'Halftone',
        hint: 'Newsprint dot screen',
        controls: [
          { type: 'range', key: 'grid', label: 'Cell', min: 4, max: 24, step: 1, default: 10, unit: 'px' },
        ],
      },
      {
        id: 'pixelize',
        label: 'Pixelate',
        hint: 'Mosaic resample',
        controls: [
          { type: 'range', key: 'pixel', label: 'Block', min: 2, max: 48, step: 1, default: 12, unit: 'px' },
        ],
      },
    ],
  },
  {
    label: 'Lens',
    effects: [
      {
        id: 'blur',
        label: 'Gaussian Blur',
        hint: 'Stack-blur softening',
        controls: [
          { type: 'range', key: 'blur', label: 'Radius', min: 0, max: 80, step: 1, default: 14, unit: 'px' },
        ],
      },
      { id: 'cel', label: 'Cel Shade', hint: 'Quantize + ink edges' },
      { id: 'ascii', label: 'ASCII', hint: 'Text-mode render' },
    ],
  },
];

export const EFFECTS = EFFECT_GROUPS.flatMap((group) => group.effects);

export const EFFECT_BY_ID = Object.fromEntries(EFFECTS.map((e) => [e.id, e]));

/** Default params derived from every effect's declared controls. */
export const DEFAULT_PARAMS = EFFECTS.reduce((acc, effect) => {
  (effect.controls || []).forEach((c) => {
    acc[c.key] = c.default;
  });
  return acc;
}, {});

/**
 * Render a single effect onto `canvas` from a loaded `img` element.
 * Returns `{ ascii }` when the ASCII effect is active, otherwise `{}`.
 */
export function renderEffect(canvas, img, effectId, params = {}) {
  const ctx = canvas.getContext('2d');
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;
  ctx.filter = 'none';
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  switch (effectId) {
    case 'monochrome': {
      const id = ctx.getImageData(0, 0, w, h);
      monochrome(id.data);
      ctx.putImageData(id, 0, 0);
      break;
    }
    case 'sepia': {
      const id = ctx.getImageData(0, 0, w, h);
      sepia(id.data);
      ctx.putImageData(id, 0, 0);
      break;
    }
    case 'solarize': {
      const id = ctx.getImageData(0, 0, w, h);
      solarize(id.data);
      ctx.putImageData(id, 0, 0);
      break;
    }
    case 'duotone': {
      const id = ctx.getImageData(0, 0, w, h);
      duotone(id.data, params.duoDark, params.duoLight);
      ctx.putImageData(id, 0, 0);
      break;
    }
    case 'posterize': {
      const src = ctx.getImageData(0, 0, w, h);
      ctx.putImageData(posterize(src, params.levels ?? 4), 0, 0);
      break;
    }
    case 'dither': {
      const id = ctx.getImageData(0, 0, w, h);
      bayerDither(id);
      ctx.putImageData(id, 0, 0);
      break;
    }
    case 'halftone': {
      const src = ctx.getImageData(0, 0, w, h);
      ctx.putImageData(halftone(src, params.grid ?? 10), 0, 0);
      break;
    }
    case 'pixelize': {
      pixelize(ctx, w, h, params.pixel ?? 12);
      break;
    }
    case 'blur': {
      canvasRGBA(canvas, 0, 0, w, h, Math.max(0, params.blur ?? 14));
      break;
    }
    case 'cel': {
      const src = ctx.getImageData(0, 0, w, h);
      const quant = quantizeColors(src, 4);
      const edges = sobel(src);
      ctx.putImageData(combineCel(quant, edges), 0, 0);
      break;
    }
    case 'ascii': {
      const src = ctx.getImageData(0, 0, w, h);
      return { ascii: asciiArt(src, params.ramp ?? '@%#*+=-:. ') };
    }
    default:
      break;
  }
  return {};
}

/** Extract the N dominant colors from an image source as hex strings. */
export function extractPalette(src, count = 5) {
  return getPalette(src, count, 'hex', { quality: 10 });
}
