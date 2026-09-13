// Editable, project-specific vector covers. Run from any working directory.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicRoot = join(dirname(fileURLToPath(import.meta.url)), '../public');
const output = join(publicRoot, 'images/projects/covers');
const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const rect = (x, y, w, h, fill, stroke = 'none', radius = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
const line = (x1, y1, x2, y2, stroke, width = 3) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
const text = (x, y, value, size, color, extra = '') =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Arial, sans-serif" ${extra}>${escape(value)}</text>`;
const mono = (x, y, value, size, color) =>
  text(x, y, value, size, color, 'style="font-family:Consolas,monospace"');

const palettes = {
  blue: ['#f2f0e9', '#263b71', '#3764bf', '#dce5f5'],
  rust: ['#f4eee4', '#442f29', '#ae573e', '#ead5c6'],
  green: ['#eef1e9', '#233a35', '#447768', '#d4e3d7'],
  plum: ['#f3edf2', '#432e47', '#825184', '#e8d7e7'],
  dark: ['#171f29', '#f3f0e5', '#9ab5e9', '#2a394e'],
};
const cards = [
  [
    'bm',
    ['bm'],
    'BOOKMARK MANAGER / RUST',
    'Directories, within reach.',
    'rust',
    'bookmark',
  ],
  [
    'stroque',
    ['Stroque'],
    'PROCEDURAL ART / SVG',
    'Order. Variation. A little chance.',
    'blue',
    'boxes',
  ],
  [
    'scrappy',
    ['Scrappy.js'],
    'WEB SCRAPING / JAVASCRIPT',
    'From web pages to structured data.',
    'green',
    'scrape',
  ],
  [
    'go-piml',
    ['go-piml'],
    'PIML / GO LIBRARY',
    'Human-readable data, parsed in Go.',
    'blue',
    'go-code',
  ],
  [
    'piml.js',
    ['piml.js'],
    'PIML / JAVASCRIPT LIBRARY',
    'Readable by people. Parsed by code.',
    'rust',
    'js-code',
  ],
  [
    'piml-highlighter',
    ['PIML', 'Highlighter'],
    'EDITOR EXTENSION / VS CODE',
    'Give structure a little color.',
    'plum',
    'highlight',
  ],
  [
    'go-homo-sapiens-time',
    ['Homo Sapiens', 'Time'],
    'DURATION PARSING / GO',
    'Time, in human terms.',
    'green',
    'time',
  ],
  [
    'go-tournament-brackets',
    ['Tournament', 'Brackets'],
    'TOURNAMENTS / GO',
    'One round closer.',
    'blue',
    'brackets',
  ],
  [
    'open-tab-with-respect',
    ['Open Tab', 'with Respect'],
    'BROWSER EXTENSION / FIREFOX',
    'Every tab in its right place.',
    'plum',
    'tabs',
  ],
  [
    'clipboard-concat',
    ['Clipboard', 'Concat'],
    'BROWSER EXTENSION / FIREFOX',
    'Copy. Collect. Combine.',
    'green',
    'clipboard',
  ],
  [
    'boxer',
    ['Boxer'],
    'ARCHIVES / C++',
    'Instructions in. Archive out.',
    'rust',
    'archive',
  ],
  [
    'firefox-themes',
    ['Firefox', 'Themes'],
    'BROWSER THEMES / FIREFOX',
    'A different view of the web.',
    'dark',
    'themes',
  ],
  [
    'atelier',
    ['Atelier'],
    'IMAGE & SVG VIEWER / C#',
    'Let the picture take the stage.',
    'dark',
    'atelier',
  ],
  [
    'pidi',
    ['pidi'],
    'PDF READER / C + RAYLIB',
    'A little room for every page.',
    'rust',
    'pdf',
  ],
  [
    'dush',
    ['Dush'],
    'TERMINAL SHELL / GO',
    'A shell with its own language.',
    'dark',
    'dush',
  ],
];

const artwork = (kind, colors) => {
  const [bg, ink, accent, soft] = colors;
  const panel = (x = 675, y = 130, w = 430, h = 320) =>
    rect(x, y, w, h, bg, accent, 14);
  const bars = (x, y, lengths, color = accent) =>
    lengths.map((w, i) => rect(x, y + i * 28, w, 7, color, 'none', 3)).join('');
  if (kind === 'bookmark')
    return `${rect(702, 145, 150, 270, soft)}${rect(760, 170, 150, 270, bg, accent)}<path d="M925 125H1070V415L998 360L925 415Z" fill="${accent}"/>${line(954, 186, 1040, 186, bg, 6)}${line(954, 218, 1015, 218, bg, 6)}${mono(700, 485, '~/.bm/store.toml', 20, accent)}`;
  if (kind === 'boxes')
    return `<g stroke="${ink}" stroke-width="5">${[
      [680, 110, 220, 110, soft],
      [900, 110, 185, 110, accent],
      [680, 220, 115, 230, bg],
      [795, 220, 180, 140, bg],
      [975, 220, 110, 230, soft],
      [795, 360, 180, 90, accent],
    ]
      .map(([x, y, w, h, fill]) => rect(x, y, w, h, fill, ink, 0))
      .join('')}</g>${line(680, 470, 1085, 470, accent)}`;
  if (kind === 'scrape')
    return `${panel(650, 125, 285, 280)}${line(650, 170, 935, 170, accent)}${bars(678, 200, [182, 137, 185, 152, 98], soft)}${rect(830, 287, 270, 183, accent)}${mono(852, 338, '{', 38, bg)}${mono(877, 374, 'title: "..."', 20, bg)}${mono(877, 407, 'url: "..."', 20, bg)}${mono(852, 443, '}', 38, bg)}<path d="M985 193V240H1040" stroke="${accent}" stroke-width="5" fill="none"/><path d="M1025 225L1040 240L1025 255" stroke="${accent}" stroke-width="5" fill="none"/>`;
  if (['go-code', 'js-code', 'highlight'].includes(kind)) {
    const code = [
      ['(project)', accent],
      ['  (name) codex', ink],
      ['  (status) curious', ink],
      ['  (built) with care', ink],
    ];
    return `${panel(650, 123, 455, 326)}${line(650, 180, 1105, 180, accent)}${mono(679, 160, kind === 'highlight' ? 'notes.piml' : kind === 'go-code' ? 'parse.go' : 'parse.js', 19, accent)}${code.map(([value, color], i) => mono(685, 238 + i * 42, value, 24, color)).join('')}${rect(984, 393, 88, 84, accent)}${text(1028, 446, kind === 'go-code' ? 'Go' : kind === 'js-code' ? 'JS' : '(p)', 30, bg, 'text-anchor="middle"')}`;
  }
  if (kind === 'time')
    return `<circle cx="900" cy="270" r="142" fill="${soft}"/><circle cx="900" cy="270" r="119" fill="${bg}" stroke="${accent}" stroke-width="4"/>${Array.from(
      { length: 12 },
      (_, i) => {
        const a = (i * Math.PI) / 6;
        return line(
          900 + 104 * Math.sin(a),
          270 - 104 * Math.cos(a),
          900 + 114 * Math.sin(a),
          270 - 114 * Math.cos(a),
          accent,
        );
      },
    ).join(
      '',
    )}<path d="M900 190V270L955 303" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>${rect(739, 438, 325, 49, accent)}${mono(760, 470, '2h 30m  →  9000000', 22, bg)}`;
  if (kind === 'brackets')
    return `${[135, 223, 335, 423].map((y) => rect(667, y, 125, 44, soft)).join('')}${[157, 245, 357, 445].map((y, i) => line(792, y, 842, y, accent)).join('')}${line(842, 157, 842, 245, accent)}${line(842, 357, 842, 445, accent)}${line(842, 201, 886, 201, accent)}${line(842, 401, 886, 401, accent)}${rect(886, 180, 116, 44, accent)}${rect(886, 380, 116, 44, accent)}${line(1002, 201, 1050, 201, accent)}${line(1002, 401, 1050, 401, accent)}${line(1050, 201, 1050, 401, accent)}${line(1050, 301, 1082, 301, accent)}<circle cx="1095" cy="301" r="25" fill="${ink}"/>`;
  if (kind === 'tabs')
    return `${panel(649, 190, 465, 270)}${rect(669, 153, 117, 80, soft, accent)}${rect(794, 131, 138, 102, accent)}${rect(940, 153, 155, 80, soft, accent)}${rect(669, 244, 425, 192, bg)}${bars(697, 281, [190, 310, 267, 160], soft)}<path d="M728 100C728 60 870 60 870 100" fill="none" stroke="${accent}" stroke-width="5"/><path d="M854 85L870 105L886 85" stroke="${accent}" stroke-width="5" fill="none"/>`;
  if (kind === 'clipboard')
    return `${rect(670, 132, 170, 230, soft, accent)}${rect(691, 115, 128, 32, accent)}${bars(695, 182, [118, 102, 118, 72])}${rect(743, 205, 170, 230, bg, accent)}${rect(764, 188, 128, 32, accent)}${bars(768, 255, [118, 75, 110, 91])}${rect(969, 205, 128, 230, accent)}${line(935, 295, 959, 295, ink, 4)}${line(947, 283, 947, 307, ink, 4)}${bars(990, 255, [84, 66, 84, 77, 58], bg)}`;
  if (kind === 'archive')
    return `<path d="M694 244L891 145L1094 244L891 346Z" fill="${soft}" stroke="${accent}" stroke-width="4"/><path d="M694 244V412L891 512V346Z" fill="${accent}"/><path d="M891 346L1094 244V412L891 512Z" fill="${ink}"/><path d="M835 174L1036 273L980 301L779 202Z" fill="${bg}" opacity=".7"/>${rect(839, 98, 155, 90, bg, accent)}${bars(861, 122, [109, 70])}`;
  if (kind === 'themes')
    return ['#793b59', '#8da784', '#49738b']
      .map(
        (color, i) =>
          `${rect(663 + i * 33, 115 + i * 73, 352, 178, color, soft, 12)}${rect(681 + i * 33, 132 + i * 73, 100, 18, bg)}${line(681 + i * 33, 169 + i * 73, 996 + i * 33, 169 + i * 73, bg)}${bars(681 + i * 33, 191 + i * 73, [215, 172], bg)}`,
      )
      .join('');
  if (kind === 'pdf')
    return `${rect(705, 119, 258, 333, soft, accent)}${rect(767, 155, 258, 333, bg, accent)}${rect(788, 208, 53, 228, soft)}${bars(859, 207, [133, 111, 133, 82, 133], soft)}${rect(856, 284, 132, 27, accent)}${mono(867, 305, 'a thought', 16, bg)}${line(863, 409, 983, 409, accent)}${text(864, 465, 'PDF', 25, accent)}`;
  if (kind === 'atelier') {
    const logo = readFileSync(
      join(publicRoot, 'images/projects/atelier/logo.svg'),
      'utf8',
    )
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '');
    return `<g transform="translate(742 100) scale(1.4)">${logo}</g>${mono(735, 498, 'SVG · HEIC · AVIF · WEBP', 21, accent)}`;
  }
  if (kind === 'dush') {
    const logo = readFileSync(
      join(publicRoot, 'images/projects/dush/logo.svg'),
      'utf8',
    )
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '');
    return `<g transform="translate(725 100) scale(.74)">${logo}</g>`;
  }
  return '';
};

mkdirSync(output, { recursive: true });
for (const [slug, title, category, caption, palette, kind] of cards) {
  const colors = palettes[palette];
  const [bg, ink, accent, soft] = colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" role="img" aria-labelledby="title desc"><title id="title">${escape(title.join(' '))}</title><desc id="desc">${escape(caption)}</desc>${rect(0, 0, 1200, 600, bg, 'none', 0)}${line(64, 91, 1136, 91, soft, 2)}${mono(64, 63, 'FEZCODE / INDEPENDENT SOFTWARE', 16, accent)}<circle cx="1119" cy="58" r="6" fill="${accent}"/>${title.map((part, i) => text(64, 248 + i * 83, part, part.length > 12 ? 55 : 73, ink, 'font-weight="600" letter-spacing="-3"')).join('')}${text(67, 429, caption, 24, accent)}${mono(67, 518, category, 16, accent)}${artwork(kind, colors)}</svg>\n`;
  writeFileSync(join(output, `${slug}.svg`), svg);
}
console.log(
  `Wrote ${cards.length} project covers to public/images/projects/covers.`,
);
