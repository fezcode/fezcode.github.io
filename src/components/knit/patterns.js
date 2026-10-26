// Colourwork charts: text layout, icons, motifs and the bands that run across
// the site like the yoke of a Fair Isle sweater.
import {
  YARN,
  makeGrid,
  fillRect,
  fillRow,
  setCell,
  stamp,
  repeatX,
} from './engine';
import { FONTS, normalizeText, textWidth, wrapText } from './fonts';

// ---------------------------------------------------------------- text

export const writeText = (g, text, x, y, hex, font = FONTS.big, scale = 1) => {
  let cx = x;
  for (const ch of normalizeText(text, font)) {
    const glyph = font.glyphs[ch];
    stamp(g, glyph, cx, y, { 1: hex }, scale);
    cx += (glyph[0].length + font.gap) * scale;
  }
  return cx;
};

export const measureText = (text, font = FONTS.big, scale = 1) =>
  textWidth(normalizeText(text, font), font, scale);

/**
 * Chart a block of text. With maxCols the text wraps and the grid is that
 * wide; without it the grid fits the text. bg may be null (stitches only).
 */
export const textGrid = ({
  text,
  font = FONTS.big,
  scale = 1,
  fg = YARN.cream,
  bg = null,
  padX = 0,
  padY = 0,
  maxCols,
  align = 'left',
  lineGap = 2,
  maxLines,
}) => {
  const clean = normalizeText(text, font);
  const inner = maxCols ? Math.max(1, maxCols - padX * 2) : Infinity;
  let lines = maxCols ? wrapText(clean, inner, font, scale) : [clean];
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    let cut = last;
    while (cut.length && textWidth(`${cut}...`, font, scale) > inner)
      cut = cut.slice(0, -1);
    lines[maxLines - 1] = `${cut.trimEnd()}...`;
  }
  const widths = lines.map((l) => textWidth(l, font, scale));
  const cols = maxCols || Math.max(1, ...widths) + padX * 2;
  const lineH = font.height * scale;
  const rows = padY * 2 + lines.length * lineH + (lines.length - 1) * lineGap;
  const g = makeGrid(cols, rows, bg);
  lines.forEach((line, i) => {
    const free = cols - padX * 2 - widths[i];
    const x =
      padX + (align === 'center' ? Math.floor(free / 2) : align === 'right' ? free : 0);
    writeText(g, line, x, padY + i * (lineH + lineGap), fg, font, scale);
  });
  g.lines = lines.length;
  return g;
};

// ---------------------------------------------------------------- icons

export const ICONS = {
  search: ['0111000', '1000100', '1000100', '1000100', '0111000', '0000110', '0000011'],
  menu: ['0000000', '1111111', '0000000', '1111111', '0000000', '1111111', '0000000'],
  close: ['1000001', '0100010', '0010100', '0001000', '0010100', '0100010', '1000001'],
  gear: ['0010100', '0111110', '1100011', '0100010', '1100011', '0111110', '0010100'],
  command: ['1100011', '1010101', '0111110', '0010100', '0111110', '1010101', '1100011'],
  shuffle: ['0000010', '1100111', '0010010', '0001000', '0010010', '1100111', '0000010'],
  mail: ['1111111', '1100011', '1010101', '1001001', '1000001', '1000001', '1111111'],
  heart: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000', '0000000'],
  star: ['0001000', '0011100', '1111111', '0111110', '0011100', '0110110', '0100010'],
  home: ['0001000', '0011100', '0111110', '1111111', '0110110', '0110110', '0110110'],
  cube: ['0011100', '0110110', '1100011', '1011101', '1001001', '0101010', '0011100'],
  page: ['1111100', '1000110', '1011111', '1000001', '1011101', '1000001', '1111111'],
  grid: ['1110111', '1110111', '1110111', '0000000', '1110111', '1110111', '1110111'],
  bookmark: ['1111111', '1111111', '1111111', '1111111', '1110111', '1100011', '1000001'],
  graph: ['1100011', '1100011', '0010100', '0001000', '0001000', '0011100', '0011100'],
  book: ['1110111', '1001001', '1001001', '1001001', '1001001', '1110111', '0001000'],
  terminal: ['1111111', '1000001', '1010001', '1001001', '1010111', '1000001', '1111111'],
  user: ['0011100', '0011100', '0011100', '0000000', '0111110', '1111111', '1111111'],
  trophy: ['1111111', '1111111', '0111110', '0011100', '0001000', '0011100', '0111110'],
  wand: ['0000101', '0000010', '0000101', '0001000', '0010000', '0100000', '1000000'],
  arrowUpRight: ['0011111', '0000011', '0000101', '0001001', '0010000', '0100000', '1000000'],
  arrowRight: ['0001000', '0000100', '0000010', '1111111', '0000010', '0000100', '0001000'],
  arrowLeft: ['0001000', '0010000', '0100000', '1111111', '0100000', '0010000', '0001000'],
  sun: ['1001001', '0101010', '0011100', '1111111', '0011100', '0101010', '1001001'],
  moon: ['0011100', '0110000', '1100000', '1100000', '1100000', '0110000', '0011100'],
  rss: ['1000000', '0110000', '0001100', '1100010', '0010010', '1001001', '1101001'],
  copy: ['1111100', '1000100', '1011111', '1010001', '1110001', '0010001', '0011111'],
  expand: ['1110111', '1000001', '1000001', '0000000', '1000001', '1000001', '1110111'],
  check: ['0000001', '0000010', '0000100', '1001000', '0101000', '0010000', '0000000'],
  plus: ['0001000', '0001000', '0001000', '1111111', '0001000', '0001000', '0001000'],
  minus: ['0000000', '0000000', '0000000', '1111111', '0000000', '0000000', '0000000'],
  caretDown: ['0000000', '1000001', '0100010', '0010100', '0001000', '0000000', '0000000'],
  caretRight: ['0010000', '0001000', '0000100', '0000010', '0000100', '0001000', '0010000'],
  pin: ['0011100', '0111110', '0111110', '0011100', '0001000', '0001000', '0001000'],
  code: ['0000000', '0010100', '0100010', '1000001', '0100010', '0010100', '0000000'],
  note: ['0001111', '0001001', '0001001', '0001001', '0111001', '1111111', '0110110'],
  link: ['0000110', '0001001', '0001010', '0010100', '0101000', '1001000', '0110000'],
  lock: ['0011100', '0100010', '0100010', '1111111', '1110111', '1110111', '1111111'],
  dot: ['0000000', '0000000', '0011100', '0011100', '0011100', '0000000', '0000000'],
};

/** Phosphor icon names used in sidebar.piml and app data, charted as stitches. */
const PHOSPHOR_TO_KNIT = {
  House: 'home',
  Cube: 'cube',
  Article: 'page',
  Shapes: 'grid',
  BookmarkSimple: 'bookmark',
  Bookmark: 'bookmark',
  Graph: 'graph',
  BookOpen: 'book',
  Book: 'book',
  TerminalWindow: 'terminal',
  Terminal: 'terminal',
  User: 'user',
  Trophy: 'trophy',
  MagicWand: 'wand',
  Gear: 'gear',
  MagnifyingGlass: 'search',
  Envelope: 'mail',
  EnvelopeSimple: 'mail',
  Star: 'star',
  Heart: 'heart',
  Code: 'code',
  MusicNote: 'note',
  MusicNotes: 'note',
  Link: 'link',
  Lock: 'lock',
  Key: 'lock',
  Rss: 'rss',
  PushPin: 'pin',
  Sun: 'sun',
  Moon: 'moon',
};

export const knitIconFor = (phosphorName) => {
  const base = String(phosphorName || '').replace(/Icon$/, '');
  return PHOSPHOR_TO_KNIT[base] || 'heart';
};

// ---------------------------------------------------------------- motifs

export const MOTIFS = {
  hen: [
    '...rr.....',
    '..rrrr....',
    '..WWWW....',
    'rWkWWW..WW',
    '.WWWWWWWWW',
    '.WWWWWWWWW',
    '..WWWHWWW.',
    '...WWWWW..',
    '....y.y...',
    '....y.y...',
  ],
  flower: [
    '..r.r..',
    '.rrrrr.',
    'rrrYrrr',
    '.rrrrr.',
    '..r.r..',
    '...G...',
    'G..G..G',
    '.G.G.G.',
    '..GGG..',
    '...G...',
  ],
  snowflake: ['1001001', '0101010', '0011100', '1110111', '0011100', '0101010', '1001001'],
  star: [
    '000010000',
    '010111010',
    '001111100',
    '011010110',
    '111101111',
    '011010110',
    '001111100',
    '010111010',
    '000010000',
  ],
  tree: ['0001000', '0011100', '0111110', '0011100', '0111110', '1111111', '0001000', '0001000'],
  heart: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'],
  diamond: ['...X....', '..XXX...', '.XX.XX..', 'XX...XX.', '.XX.XX..', '..XXX...', '...X....', '........'],
};

// ---------------------------------------------------------------- bands

const solid = (cols, rows, hex) => makeGrid(cols, rows, hex);

export const BANDS = {
  peerie: (cols, { bg = YARN.bark, line = YARN.gold, dot = YARN.poppy } = {}) => {
    const g = solid(cols, 3, line);
    for (let c = 0; c < cols; c++) setCell(g, c, 1, c % 6 === 3 ? dot : bg);
    return g;
  },
  diamonds: (cols, { bg = YARN.ink, fg = YARN.cream } = {}) => {
    const g = solid(cols, 10, bg);
    repeatX(g, MOTIFS.diamond, 1, { X: fg }, 8);
    return g;
  },
  hens: (cols, { bg = YARN.walnut } = {}) => {
    const g = solid(cols, 14, bg);
    const bodies = [YARN.snow, YARN.peach, YARN.rust, YARN.wheat];
    for (let i = 0, x = 3; x < cols; i++, x += 15) {
      const body = bodies[i % bodies.length];
      stamp(g, MOTIFS.hen, x, 2, {
        r: YARN.poppy,
        W: body,
        k: YARN.jet,
        y: YARN.gold,
        H: body === YARN.snow ? YARN.oat : YARN.cream,
      });
    }
    return g;
  },
  flowers: (cols, { bg = YARN.oat, petal = YARN.poppy, eye = YARN.lemon, leaf = YARN.moss } = {}) => {
    const g = solid(cols, 20, bg);
    for (let c = 0; c < cols; c++) {
      if (c % 10 === 3) setCell(g, c, 1, petal);
      if (c % 10 === 8) setCell(g, c, 3, leaf);
    }
    for (let i = 0, x = -2; x < cols; i++, x += 9)
      stamp(g, MOTIFS.flower, x, i % 2 ? 8 : 6, { r: petal, Y: eye, G: leaf });
    fillRow(g, 19, leaf);
    return g;
  },
  snow: (cols, { bg = YARN.denim, fg = YARN.snow } = {}) => {
    const g = solid(cols, 11, bg);
    repeatX(g, MOTIFS.snowflake, 2, { 1: fg }, 12, 2);
    for (let c = 8; c < cols; c += 12) {
      setCell(g, c, 3, fg);
      setCell(g, c, 7, fg);
    }
    return g;
  },
  stars: (cols, { bg = YARN.moss, fg = YARN.cream, accent = YARN.gold } = {}) => {
    const g = solid(cols, 13, bg);
    repeatX(g, MOTIFS.star, 2, { 1: fg }, 14, 2);
    for (let c = 11; c < cols; c += 14) {
      setCell(g, c, 4, accent);
      setCell(g, c + 1, 6, accent);
      setCell(g, c, 8, accent);
    }
    return g;
  },
  trees: (cols, { bg = YARN.cream, fg = YARN.moss, trunk = YARN.walnut } = {}) => {
    const g = solid(cols, 11, bg);
    for (let x = 1; x < cols; x += 10) {
      stamp(g, MOTIFS.tree, x, 1, { 1: fg });
      setCell(g, x + 3, 7, trunk);
      setCell(g, x + 3, 8, trunk);
    }
    fillRow(g, 10, fg);
    return g;
  },
  hearts: (cols, { bg = YARN.cream, fg = YARN.poppy } = {}) => {
    const g = solid(cols, 9, bg);
    repeatX(g, MOTIFS.heart, 1, { 1: fg }, 11, 2);
    return g;
  },
  zigzag: (cols, { bg = YARN.walnut, fg = YARN.gold } = {}) => {
    const g = solid(cols, 5, bg);
    const wave = [0, 1, 2, 3, 2, 1];
    for (let c = 0; c < cols; c++) {
      setCell(g, c, 4 - wave[c % 6], fg);
      if (wave[c % 6] > 0) setCell(g, c, 4 - wave[c % 6] + 1, fg);
    }
    return g;
  },
  checks: (cols, { a = YARN.cream, b = YARN.poppy } = {}) => {
    const g = solid(cols, 4, a);
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < cols; c++)
        if ((Math.floor(c / 2) + Math.floor(r / 2)) % 2) setCell(g, c, r, b);
    return g;
  },
  ribbing: (cols, { a = YARN.walnut, b = YARN.bark, rows = 7 } = {}) => {
    const g = solid(cols, rows, a);
    for (let c = 1; c < cols; c += 2) fillRect(g, c, 0, 1, rows, b);
    return g;
  },
  lice: (cols, { bg = YARN.moss, fg = YARN.cream } = {}) => {
    const g = solid(cols, 6, bg);
    for (let c = 0; c < cols; c++) {
      if (c % 8 === 2) setCell(g, c, 1, fg);
      if (c % 8 === 6) setCell(g, c, 4, fg);
    }
    return g;
  },
};

/** A deterministic pick from a list, seeded by a string such as a slug. */
export const pickBySeed = (seed, list) => {
  let n = 0;
  for (const ch of String(seed || '')) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
  return list[n % list.length];
};

/** A pleasant colourway for a seed: a ground and a contrasting yarn. */
export const COLOURWAYS = [
  { bg: YARN.walnut, fg: YARN.cream, accent: YARN.gold },
  { bg: YARN.moss, fg: YARN.cream, accent: YARN.poppy },
  { bg: YARN.rust, fg: YARN.cream, accent: YARN.gold },
  { bg: YARN.teal, fg: YARN.snow, accent: YARN.gold },
  { bg: YARN.ink, fg: YARN.cream, accent: YARN.poppy },
  { bg: YARN.denim, fg: YARN.snow, accent: YARN.wheat },
  { bg: YARN.plum, fg: YARN.cream, accent: YARN.wheat },
  { bg: YARN.oat, fg: YARN.ink, accent: YARN.poppy },
];

/** A small knitted badge for an item: a motif in its colourway. */
export const badgeGrid = (seed, size = 15) => {
  const way = pickBySeed(seed, COLOURWAYS);
  const g = makeGrid(size, size, way.bg);
  const motif = pickBySeed(`${seed}:m`, ['star', 'snowflake', 'heart', 'tree']);
  const bmp = MOTIFS[motif];
  const x = Math.floor((size - bmp[0].length) / 2);
  const y = Math.floor((size - bmp.length) / 2);
  stamp(g, bmp, x, y, { 1: way.fg });
  // a peerie dot in each corner
  [
    [1, 1],
    [size - 2, 1],
    [1, size - 2],
    [size - 2, size - 2],
  ].forEach(([cx, cy]) => setCell(g, cx, cy, way.accent));
  return g;
};
