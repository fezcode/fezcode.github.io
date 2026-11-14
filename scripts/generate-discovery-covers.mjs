// Each discovery gets a small, self-contained vector sleeve. Run from any cwd.
// Existing metadata artwork remains untouched; these are collectible fallbacks.
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import piml from 'piml';

const root = join(dirname(fileURLToPath(import.meta.url)), '../public');
const logsRoot = join(root, 'logs');
const outputRoot = join(root, 'images/discovery/covers');
const escape = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const palette = {
  game: ['#182D28', '#C5F0C9', '#728B71', '#E1E7CE'],
  movie: ['#33261E', '#F0BE76', '#A46845', '#E4DBCC'],
  music: ['#27243A', '#C6B9EC', '#7C78A4', '#ECE3F0'],
  book: ['#34392F', '#E5D8B8', '#9AA587', '#F0EADD'],
  series: ['#173039', '#86CCD5', '#40838C', '#DFE6DD'],
  article: ['#25374B', '#B9D2ED', '#6486A4', '#EBEDE6'],
  food: ['#5A3025', '#F0AF89', '#9C593B', '#EFE1C3'],
  video: ['#47252A', '#ED9F98', '#AD655B', '#F0E2D1'],
  quote: ['#3D2732', '#DFC0C5', '#9E7586', '#F0E8DB'],
  tools: ['#243847', '#AFC9D7', '#678894', '#E3E9DF'],
  websites: ['#333D24', '#D3D98E', '#8B9B53', '#EBE9CE'],
  event: ['#4A3924', '#E4CB80', '#9E8250', '#F0E5C8'],
};
const sans = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const serif = "Georgia, 'Times New Roman', serif";
const mono = 'Consolas, monospace';
const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const circle = (x, y, r, fill, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const path = (d, fill, extra = '') =>
  `<path d="${d}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, width = 1, extra = '') =>
  path(
    `M${x1} ${y1}L${x2} ${y2}`,
    'none',
    `stroke="${stroke}" stroke-width="${width}" ${extra}`,
  );
const text = (x, y, label, size, fill, extra = '', font = sans) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" ${extra}>${escape(label)}</text>`;
const seeded = (value) => {
  let seed = 2166136261;
  for (const char of value)
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
};

// Width estimates deliberately leave breathing room for font substitutions.
const measure = (value) =>
  [...value].reduce(
    (n, char) =>
      n +
      (/[WM@%]/.test(char)
        ? 1.1
        : /[ilI1.,'!:;]/.test(char)
          ? 0.36
          : /\s/.test(char)
            ? 0.38
            : /[A-Z]/.test(char)
              ? 0.79
              : 0.63),
    0,
  );
const wrap = (value, size, width) => {
  const words = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (current && measure(`${current} ${word}`) * size > width) {
      lines.push(current);
      current = '';
    }
    if (measure(word) * size > width) {
      let fragment = '';
      for (const char of word) {
        if (fragment && measure(fragment + char) * size > width) {
          lines.push(fragment);
          fragment = '';
        }
        fragment += char;
      }
      current = fragment;
    } else current = current ? `${current} ${word}` : word;
  }
  if (current) lines.push(current);
  return lines;
};
const titleBlock = (entry, opts = {}) => {
  const {
    x = 44,
    bottom = 770,
    width = 552,
    height = 240,
    size = 60,
    color,
    font = sans,
    uppercase = true,
    italic = false,
  } = opts;
  const title = String(entry.title || entry.slug)
    .replace(/\s*\(Album\)$/i, '')
    .replace(/^"+|"+$/g, '')
    .trim();
  const label = uppercase ? title.toLocaleUpperCase('en-US') : title;
  let fontSize = size;
  let lines = wrap(label, fontSize, width);
  while (lines.length * fontSize * 1.05 > height && fontSize > 20) {
    fontSize -= 2;
    lines = wrap(label, fontSize, width);
  }
  const top = bottom - (lines.length - 1) * fontSize * 1.05;
  return lines
    .map((label, index) =>
      text(
        x,
        top + index * fontSize * 1.05,
        label,
        fontSize,
        color,
        `font-weight="${font === serif ? '400' : '900'}" letter-spacing="${font === serif ? '-1' : '-1.8'}" ${italic ? 'font-style="italic"' : ''}`,
        font,
      ),
    )
    .join('');
};
const short = (value, max = 58) => {
  const clean = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
};
const year = (entry) => String(entry.date || '').slice(0, 4);
const credit = (entry) =>
  short(
    entry.artist ||
      entry.author ||
      entry.director ||
      entry.creator ||
      entry.platform ||
      '',
    50,
  );
const mini = (entry, category, c) =>
  `${text(44, 52, category.charAt(0).toUpperCase() + category.slice(1), 17, c[1], 'letter-spacing="1"', mono)}${text(596, 52, year(entry), 16, c[1], 'text-anchor="end"', mono)}`;
const grain = (color, opacity = 0.13) =>
  rect(0, 0, 640, 880, 'url(#grain)', `opacity="${opacity}"`);
const outer = (entry, category, c, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="880" viewBox="0 0 640 880" role="img" aria-labelledby="title desc"><title id="title">${escape(entry.title)} — discovery cover</title><desc id="desc">Original ${escape(category)} sleeve artwork for ${escape(entry.title)}${credit(entry) ? `, ${escape(credit(entry))}` : ''}.</desc><defs><pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse">${circle(1, 1, 0.7, c[3])}${circle(5, 4, 0.5, c[0])}</pattern><clipPath id="bounds">${rect(0, 0, 640, 880, 'white')}</clipPath></defs><g clip-path="url(#bounds)">${body}</g></svg>\n`;

function game(entry, c, random) {
  const horror = /resident|alan wake|prey|dying|bloodline|horror/i.test(
    `${entry.title} ${entry.tags}`,
  );
  const variant = Math.floor(random() * 3);
  let art = '';
  if (horror) {
    const doorX = 250 + Math.floor(random() * 60);
    art = `${rect(0, 95, 640, 530, c[2])}${path('M0 95H640L500 520H140Z', c[0])}${line(100, 95, 210, 570, c[1], 2)}${line(540, 95, 430, 570, c[1], 2)}${rect(doorX - 28, 210, 130, 300, c[2])}${rect(doorX - 18, 220, 110, 290, c[1])}${path(`M${doorX - 18} 220l68 35v255h-68Z`, c[0])}${circle(doorX + 40, 374, 5, c[1])}${Array.from({ length: 7 }, (_, i) => line(75 - i * 20, 525 + i * 16, 565 + i * 20, 525 + i * 16, c[2], 3)).join('')}${path('M305 510v-77q0-25 16-25t16 25v77Z', c[0])}${circle(321, 394, 11, c[0])}`;
  } else if (variant === 0) {
    art = `${circle(430, 280, 170, c[2])}${circle(430, 280, 132, c[0])}${circle(430, 280, 101, 'none', `stroke="${c[1]}" stroke-width="2"`)}${path('M-50 588 172 245 303 438 410 303 690 619Z', c[2])}${path('M-40 650 173 341 276 491 413 382 700 690Z', c[0])}${line(320, 125, 320, 552, c[1], 1)}${line(112, 338, 556, 338, c[1], 1)}`;
  } else if (variant === 1) {
    art =
      Array.from({ length: 10 }, (_, i) =>
        rect(
          44 + i * 58,
          200 + Math.floor(random() * 190),
          38,
          300 + Math.floor(random() * 170),
          i % 3 ? c[2] : c[1],
        ),
      ).join('') +
      `${circle(450, 210, 95, c[1])}${circle(450, 210, 64, c[0])}${path('M0 540 640 420V680H0Z', c[0])}${line(0, 538, 640, 418, c[1], 3)}`;
  } else {
    art = `${path('M320 130 620 360 320 590 20 360Z', c[2])}${path('M320 193 541 360 320 527 99 360Z', c[0])}${path('M320 263 449 360 320 457 191 360Z', c[1])}${line(320, 105, 320, 620, c[3], 1)}${line(0, 360, 640, 360, c[3], 1)}${circle(320, 360, 25, c[0])}`;
  }
  return `${rect(0, 0, 640, 880, c[0])}${rect(0, 0, 15, 880, c[2])}${mini(entry, 'game', c)}${line(44, 75, 596, 75, c[2])}${art}${rect(0, 614, 640, 266, c[0])}${titleBlock(entry, { color: c[1], bottom: 784, height: 175, size: 62 })}${text(44, 836, short(entry.platform || 'Interactive worlds', 50), 14, c[2], '', mono)}${grain(c[3], 0.09)}`;
}

function movie(entry, c, random) {
  const variant = Math.floor(random() * 3);
  const sunX = 175 + Math.floor(random() * 280);
  let art = `${rect(34, 103, 572, 452, c[2])}${circle(sunX, 275, 144, c[1])}`;
  if (variant === 0)
    art += `${path('M34 555V422l130-80 77 80 108-150 164 143 93-58v198Z', c[0])}${rect(251, 282, 120, 273, c[0])}${rect(274, 311, 75, 160, c[2])}${path('M307 555v-115q0-25 14-25t14 25v115Z', c[0])}${circle(321, 401, 10, c[0])}`;
  else if (variant === 1)
    art += `${path('M34 421 606 214V555H34Z', c[0])}${Array.from({ length: 5 }, (_, i) => path(`M${71 + i * 125} 555v-140q0-51 42-51t42 51v140Z`, c[2])).join('')}${path('M0 565 640 475V620H0Z', c[0])}`;
  else
    art += `${rect(96, 150, 448, 405, c[0])}${rect(114, 168, 412, 369, c[2])}${circle(320, 285, 110, c[1])}${rect(305, 168, 30, 369, c[0])}${rect(114, 355, 412, 18, c[0])}${path('M114 537 240 398 319 483 430 397 526 537Z', c[0])}`;
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'movie', c)}${art}${Array.from({ length: 10 }, (_, i) => `${rect(10, 118 + i * 42, 10, 20, c[2])}${rect(620, 118 + i * 42, 10, 20, c[2])}`).join('')}${text(44, 606, credit(entry), 18, c[2], '', serif)}${titleBlock(entry, { color: c[1], bottom: 794, height: 167, size: 57 })}${line(44, 827, 596, 827, c[2])}${grain(c[3])}`;
}

function music(entry, c, random) {
  const x = 360 + Math.floor(random() * 160);
  const y = 486 + Math.floor(random() * 100);
  const rings = Array.from({ length: 21 }, (_, i) =>
    circle(
      x,
      y,
      74 + i * 11,
      'none',
      `stroke="${i % 4 ? c[2] : c[1]}" stroke-width="${i % 4 ? 1 : 2}" opacity="${i % 4 ? 0.45 : 0.65}"`,
    ),
  ).join('');
  const wave = Array.from({ length: 42 }, (_, i) => {
    const amp = 15 + Math.round(random() * 100);
    return line(
      28 + i * 14,
      345 - amp,
      28 + i * 14,
      345 + amp,
      i % 4 ? c[2] : c[1],
      5,
    );
  }).join('');
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'music', c)}${titleBlock(entry, { color: c[1], bottom: 220, height: 120, size: 68 })}${text(44, 266, short(entry.artist, 42), 21, c[3], '', serif)}${wave}${rings}${circle(x, y, 70, c[1])}${circle(x, y, 29, c[0])}${circle(x, y, 7, c[1])}${rect(0, 762, 640, 118, c[0])}${text(44, 809, short(entry.album || entry.title, 43), 19, c[1], '', serif)}${line(44, 838, 448, 838, c[2], 2)}${circle(477, 838, 3, c[1])}${circle(498, 838, 3, c[1])}${circle(519, 838, 3, c[1])}${grain(c[3], 0.12)}`;
}

function book(entry, c, random) {
  const variant = Math.floor(random() * 3);
  let art = '';
  if (variant === 0)
    art = `${circle(320, 426, 190, c[2])}${path('M130 617V427a190 190 0 0 1 380 0v190Z', c[0])}${path('M179 617V427a141 141 0 0 1 282 0v190Z', c[1])}${circle(320, 379, 77, c[0])}${path('M226 617V515a94 94 0 0 1 188 0v102Z', c[0])}`;
  else if (variant === 1)
    art = `${Array.from({ length: 7 }, (_, i) => `<ellipse cx="320" cy="446" rx="${36 + i * 24}" ry="${110 + i * 15}" fill="none" stroke="${c[0]}" stroke-width="2" transform="rotate(${i * 24} 320 446)"/>`).join('')}${circle(320, 446, 52, c[0])}`;
  else
    art = `${rect(110, 315, 420, 340, c[0])}${path('M110 315h420L110 655Z', c[2])}${circle(320, 485, 126, c[1])}${path('M320 359v252M194 485h252', 'none', `stroke="${c[0]}" stroke-width="2"`)}`;
  return `${rect(0, 0, 640, 880, c[1])}${rect(0, 0, 26, 880, c[0])}${text(55, 66, short(entry.author, 40), 24, c[0], '', serif)}${line(55, 93, 587, 93, c[0])}${titleBlock(entry, { color: c[0], bottom: 234, height: 120, size: 57, font: serif, uppercase: false })}${art}${text(55, 813, 'A life between the lines', 19, c[0], 'font-style="italic"', serif)}${text(587, 845, year(entry), 15, c[0], 'text-anchor="end"', mono)}${grain(c[0], 0.15)}`;
}

function series(entry, c, random) {
  const n = Math.floor(random() * 9) + 1;
  const buildings = Array.from({ length: 14 }, (_, i) => {
    const h = 40 + Math.floor(random() * 180);
    return `${rect(32 + i * 44, 548 - h, 34, h, i % 3 === 0 ? c[1] : c[2])}${Array.from({ length: Math.floor(h / 25) }, (_, j) => rect(40 + i * 44, 538 - j * 25, 4, 9, c[0])).join('')}`;
  }).join('');
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'series', c)}${rect(31, 109, 578, 453, c[2], `rx="30"`)}${rect(43, 121, 554, 429, c[0], `rx="20"`)}${circle(420, 282, 110, c[2])}${circle(420, 282, 77, c[1])}${buildings}${Array.from({ length: 10 }, (_, i) => line(44, 148 + i * 37, 596, 148 + i * 37, c[1], 1, 'opacity="0.16"')).join('')}${text(63, 172, `${n < 10 ? '0' : ''}${n}`, 18, c[1], '', mono)}${titleBlock(entry, { color: c[1], bottom: 779, height: 178, size: 60 })}${text(44, 836, short(entry.creator || entry.platform || 'One more episode', 49), 15, c[2], '', mono)}${grain(c[3], 0.1)}`;
}

function article(entry, c, random) {
  const points = Array.from({ length: 8 }, (_, i) => [
    80 + (i % 4) * 160 + Math.floor(random() * 25),
    330 + Math.floor(i / 4) * 180 + Math.floor(random() * 55),
  ]);
  const network = points
    .map(
      ([x, y], i) =>
        `${i ? line(points[i - 1][0], points[i - 1][1], x, y, c[2], 2) : ''}${circle(x, y, 12 + (i % 3) * 7, c[i % 2 ? 2 : 1])}${circle(x, y, 5, c[0])}`,
    )
    .join('');
  return `${rect(0, 0, 640, 880, c[0])}${Array.from({ length: 13 }, (_, i) => `${line(i * 54, 0, i * 54, 880, c[2], 1, 'opacity="0.15"')}${line(0, i * 72, 640, i * 72, c[2], 1, 'opacity="0.15"')}`).join('')}${mini(entry, 'article', c)}${network}${circle(548, 445, 110, 'none', `stroke="${c[1]}" stroke-width="2"`)}${rect(30, 102, 580, 195, c[0])}${titleBlock(entry, { color: c[1], bottom: 260, height: 145, size: 49 })}${rect(30, 662, 580, 180, c[0])}${text(44, 720, short(entry.author || 'Notes worth keeping', 43), 20, c[1], '', serif)}${Array.from({ length: 4 }, (_, i) => line(44, 758 + i * 17, 440 - i * 36, 758 + i * 17, c[2], 4)).join('')}${grain(c[3], 0.07)}`;
}

function food(entry, c, random) {
  const seeds = Array.from({ length: 13 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 13;
    const r = 60 + random() * 85;
    const x = 320 + Math.cos(angle) * r;
    const y = 358 + Math.sin(angle) * r;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${12 + Math.floor(random() * 13)}" ry="9" fill="${i % 3 === 0 ? c[3] : c[0]}" transform="rotate(${i * 47} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join('');
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'food', c)}${circle(320, 358, 228, c[2])}${circle(320, 358, 208, c[3])}${circle(320, 358, 178, c[1])}${circle(320, 358, 164, c[2])}${seeds}${path('M309 365q-67-78-9-111 55 17 9 111Z', c[0])}${path('M309 365q62-75 96-20-12 48-96 20Z', c[0])}${line(304, 395, 320, 320, c[3], 3)}${rect(0, 619, 640, 261, c[0])}${titleBlock(entry, { color: c[1], bottom: 777, height: 165, size: 60 })}${text(44, 835, 'At the table', 20, c[3], 'font-style="italic"', serif)}${grain(c[3], 0.13)}`;
}

function video(entry, c, random) {
  const variant = Math.floor(random() * 3);
  const blocks = Array.from({ length: 7 }, (_, i) =>
    rect(45 + i * 79, 145, 79, 345, i % 3 ? c[2] : c[1]),
  ).join('');
  const waves = Array.from({ length: 14 }, (_, i) =>
    path(
      `M-50 ${195 + i * 23} Q150 ${110 + i * 23} 320 ${232 + i * 23}T690 ${210 + i * 23}`,
      'none',
      `stroke="${i % 2 ? c[1] : c[2]}" stroke-width="11"`,
    ),
  ).join('');
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'video', c)}${rect(32, 111, 576, 448, c[2], 'rx="6"')}${variant === 0 ? blocks : waves}${rect(45, 490, 551, 56, c[0])}${circle(320, 334, 83, c[0])}${path('M302 295 358 334 302 373Z', c[1])}${line(62, 517, 570, 517, c[2], 4)}${line(62, 517, 230 + Math.floor(random() * 200), 517, c[1], 4)}${titleBlock(entry, { color: c[1], bottom: 790, height: 183, size: 54 })}${text(44, 838, 'Seen. Saved. Replayed.', 16, c[2], '', mono)}${grain(c[3], 0.12)}`;
}

function quote(entry, c) {
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'quote', c)}${text(20, 330, '“', 340, c[2], '', serif)}${line(44, 144, 596, 144, c[2], 1)}${titleBlock(entry, { color: c[3], bottom: 646, height: 345, size: 50, font: serif, uppercase: false, italic: true })}${line(44, 707, 122, 707, c[1], 3)}${wrap(
    short(entry.author, 85),
    22,
    530,
  )
    .map((label, i) => text(44, 754 + i * 28, label, 22, c[1], '', serif))
    .join('')}${grain(c[3], 0.08)}`;
}

function tools(entry, c, random) {
  const n = Math.floor(random() * 4) + 3;
  let circuits = '';
  for (let i = 0; i < n; i++) {
    const x = 92 + i * 79;
    const y = 240 + Math.floor(random() * 225);
    circuits += `${path(`M${x} 122v${y - 122}h${Math.floor(random() * 65) - 25}v150`, 'none', `stroke="${c[2]}" stroke-width="4"`)}${circle(x, 122, 7, c[1])}${rect(x - 12, y + 110, 25, 25, c[1])}`;
  }
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'tools', c)}${circuits}${rect(149, 204, 342, 292, c[0], `rx="12" stroke="${c[1]}" stroke-width="2"`)}${path('M246 281 204 350 246 419M394 281 436 350 394 419', 'none', `stroke="${c[1]}" stroke-width="13" stroke-linejoin="round"`)}${line(348, 273, 294, 427, c[2], 13)}${titleBlock(entry, { color: c[1], bottom: 781, height: 170, size: 66 })}${text(44, 836, 'Made for making', 19, c[2], '', mono)}${grain(c[3], 0.1)}`;
}

function websites(entry, c, random) {
  const radius = 35 + Math.floor(random() * 50);
  const x = 190 + Math.floor(random() * 210);
  const y = 310 + Math.floor(random() * 60);
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'websites', c)}${rect(36, 112, 568, 440, c[2], `rx="16"`)}${rect(48, 124, 544, 416, c[0], 'rx="10"')}${line(48, 178, 592, 178, c[2], 2)}${[72, 94, 116].map((cx) => circle(cx, 151, 5, c[1])).join('')}${rect(190, 141, 283, 20, c[2], 'rx="10"')}${circle(x, y, radius + 70, c[2])}${circle(x, y, radius + 40, c[1])}${circle(x, y, radius, c[0])}${path('M371 356v120l35-31 30 59 24-13-31-57 44-9Z', c[3], `stroke="${c[0]}" stroke-width="4"`)}${line(78, 497, 281, 497, c[2], 5)}${titleBlock(entry, { color: c[1], bottom: 786, height: 180, size: 62 })}${text(44, 837, 'A good corner of the internet', 16, c[2], '', mono)}${grain(c[3], 0.1)}`;
}

function event(entry, c, random) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 11) * Math.PI;
    return line(
      320,
      456,
      320 + Math.cos(angle) * 390,
      456 - Math.sin(angle) * 390,
      i % 2 ? c[1] : c[2],
      24,
      'opacity="0.7"',
    );
  }).join('');
  return `${rect(0, 0, 640, 880, c[0])}${mini(entry, 'event', c)}${rays}${circle(320, 392, 80, c[0])}${circle(320, 392, 62, c[1])}${Array.from({ length: 6 }, (_, i) => rect(50 + i * 105, 528 - Math.floor(random() * 60), 83, 55 + Math.floor(random() * 40), c[2], 'rx="8"')).join('')}${line(44, 617, 596, 617, c[2], 2, 'stroke-dasharray="7 10"')}${circle(0, 617, 25, '#151515')}${circle(640, 617, 25, '#151515')}${titleBlock(entry, { color: c[1], bottom: 788, height: 140, size: 57 })}${text(44, 839, String(entry.date || ''), 18, c[2], '', mono)}${grain(c[3], 0.14)}`;
}

const renderers = {
  game,
  movie,
  music,
  book,
  series,
  article,
  food,
  video,
  quote,
  tools,
  websites,
  event,
};
const categoryCounts = {};
let written = 0;
let total = 0;
for (const dir of readdirSync(logsRoot, { withFileTypes: true })) {
  if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;
  const file = join(logsRoot, dir.name, `${dir.name}.piml`);
  if (!existsSync(file)) continue;
  const category = dir.name;
  const content = readFileSync(file, 'utf8');
  if (!/^\s*\(category\)/m.test(content)) continue;
  const parsed = piml.parse(content);
  const entries = parsed.logs || parsed.items || [];
  const c = palette[category] || palette.article;
  for (const entry of entries) {
    if (!entry.slug || !/^[a-z0-9][a-z0-9._-]*$/i.test(entry.slug)) continue;
    const random = seeded(`${category}/${entry.slug}`);
    const svg = outer(
      entry,
      category,
      c,
      (renderers[category] || article)(entry, c, random),
    );
    const dir = join(outputRoot, category);
    const file = join(dir, `${entry.slug}.svg`);
    mkdirSync(dir, { recursive: true });
    if (!existsSync(file) || readFileSync(file, 'utf8') !== svg) {
      writeFileSync(file, svg, 'utf8');
      written++;
    }
    total++;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }
}
console.log(
  `Discovery covers: ${total} sleeves in ${Object.keys(categoryCounts).length} categories; ${written} written.`,
);
