// Kilim charts: bands, the hooked-diamond göl, stars, the rug field that
// opens each page, and woven type. Text and icon bitmaps are Knit's charts,
// woven instead of knitted.
import { WOOL, makeGrid, getCell, setCell, vstack, seedOf } from './engine';
import { FONTS } from '../knit/fonts';
import { textGrid, ICONS, knitIconFor } from '../knit/patterns';

export { ICONS };
export const kilimIconFor = knitIconFor;

const rng = (seed) => {
  let s = (seed % 2147483646) + 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// ---------------------------------------------------------------- colourways

/** Ground and motif wools for a panel, card or badge. */
export const COLOURWAYS = [
  { name: 'ivory', ground: WOOL.ivory, rim: WOOL.madder, a: WOOL.indigo, b: WOOL.saffron, core: WOOL.teal, eye: WOOL.ivory, border: WOOL.indigo },
  { name: 'indigo', ground: WOOL.indigo, rim: WOOL.saffron, a: WOOL.madder, b: WOOL.ivory, core: WOOL.teal, eye: WOOL.saffron, border: WOOL.madder },
  { name: 'aubergine', ground: WOOL.aubergine, rim: WOOL.ivory, a: WOOL.pistachio, b: WOOL.saffron, core: WOOL.madder, eye: WOOL.ivory, border: WOOL.saffron },
  { name: 'pistachio', ground: WOOL.pistachio, rim: WOOL.ivory, a: WOOL.madder, b: WOOL.indigo, core: WOOL.saffron, eye: WOOL.ivory, border: WOOL.walnut },
  { name: 'teal', ground: WOOL.teal, rim: WOOL.saffron, a: WOOL.ivory, b: WOOL.madder, core: WOOL.indigo, eye: WOOL.saffron, border: WOOL.ivory },
  { name: 'madder', ground: WOOL.madder, rim: WOOL.ivory, a: WOOL.indigo, b: WOOL.saffron, core: WOOL.teal, eye: WOOL.madder, border: WOOL.saffron },
];

export const pickBySeed = (seed, list) => list[seedOf(seed) % list.length];

// ---------------------------------------------------------------- motifs

/** Hooked diamond (göl): stepped rings, an eye, ram's-horn hooks on the rim. */
export function medallion(g, cx, cy, R, way, { hooks = true } = {}) {
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) {
      const u = Math.abs(c - cx);
      const v = Math.abs(r - cy);
      const d = u + v;
      if (d <= R) {
        let hex;
        if (d === R || d === R - 1) hex = way.rim;
        else if (d <= 1) hex = way.eye;
        else if (d <= 3) hex = way.core;
        else hex = Math.floor((R - d) / 2) % 2 ? way.a : way.b;
        if (d > 4 && d < R - 2 && (u === v || u === v + 1) && d % 4 === 1) hex = way.rim;
        setCell(g, c, r, hex);
      } else if (hooks && d <= R + 3) {
        const m = (((u - v) % 6) + 6) % 6;
        const hook =
          (d === R + 1 && (m === 0 || m === 1)) ||
          (d === R + 2 && m === 1) ||
          (d === R + 3 && (m === 1 || m === 2));
        if (hook && u > 1 && v > 0) setCell(g, c, r, way.rim);
      }
    }
}

/** Eight-armed star (yıldız). */
export function star(g, cx, cy, hex, core = null) {
  [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0], [0, -2], [0, 2], [-2, 0], [2, 0], [-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(
    ([dx, dy]) => setCell(g, cx + dx, cy + dy, hex),
  );
  if (core) setCell(g, cx, cy, core);
}

// ---------------------------------------------------------------- bands

const fillRowWith = (g, r, fn) => {
  for (let c = 0; c < g.cols; c++) setCell(g, c, r, fn(c));
};

export const BANDS = {
  /** Diamond chain between two lines. */
  chain(cols, { ground = WOOL.indigo } = {}) {
    const g = makeGrid(cols, 15, ground);
    fillRowWith(g, 0, () => WOOL.walnut);
    fillRowWith(g, 14, () => WOOL.walnut);
    fillRowWith(g, 1, () => WOOL.ivory);
    fillRowWith(g, 13, () => WOOL.ivory);
    fillRowWith(g, 2, (c) => (c % 4 < 2 ? WOOL.saffron : WOOL.madder));
    fillRowWith(g, 12, (c) => (c % 4 < 2 ? WOOL.madder : WOOL.saffron));
    for (let r = 3; r <= 11; r++)
      for (let c = 0; c < cols; c++) {
        const x = c % 12;
        const d = Math.abs(x - 6) + Math.abs(r - 7);
        let hex = null;
        if (d === 4) hex = WOOL.saffron;
        else if (d === 3) hex = WOOL.madder;
        else if (d === 0) hex = ground;
        else if (d < 3) hex = WOOL.ivory;
        else if (r === 7 && x === 0) hex = WOOL.ivory;
        else if ((r === 4 || r === 10) && (x === 0 || x === 11 || x === 1)) hex = WOOL.teal;
        if (hex) setCell(g, c, r, hex);
      }
    return g;
  },
  /** Interlocking sawtooth (dişli): ivory teeth biting into the ground. */
  teeth(cols, { ground = WOOL.madder, tooth = WOOL.ivory, edge = WOOL.indigo } = {}) {
    const g = makeGrid(cols, 12, ground);
    fillRowWith(g, 0, () => WOOL.walnut);
    fillRowWith(g, 11, () => WOOL.walnut);
    fillRowWith(g, 1, () => WOOL.saffron);
    fillRowWith(g, 10, () => WOOL.saffron);
    for (let r = 2; r <= 9; r++)
      for (let c = 0; c < cols; c++) {
        const k = r - 2;
        const x = c % 8;
        if (x < k) setCell(g, c, r, tooth);
        if (x === k && r > 2 && r < 9) setCell(g, c, r, edge);
      }
    return g;
  },
  /** The plain-woven end of a kilim, just inside the fringe. */
  end(cols) {
    const g = makeGrid(cols, 7, WOOL.ivory);
    fillRowWith(g, 2, () => WOOL.walnut);
    fillRowWith(g, 4, (c) => (c % 2 ? WOOL.madder : WOOL.walnut));
    return g;
  },
  /** A three-row stripe (çubuk) for dividing list rows. */
  stripe(cols, { a = WOOL.ivory, b = WOOL.indigo, mid = WOOL.saffron } = {}) {
    const g = makeGrid(cols, 3, WOOL.walnut);
    fillRowWith(g, 0, (c) => (c % 4 < 2 ? a : b));
    fillRowWith(g, 1, () => mid);
    fillRowWith(g, 2, (c) => (c % 4 < 2 ? b : a));
    return g;
  },
  /** Running stars on a ground, a lighter band for page heads. */
  stars(cols, { ground = WOOL.madder } = {}) {
    const g = makeGrid(cols, 9, ground);
    for (let c = 4; c < cols; c += 10)
      star(g, c, 4, (c / 10) % 2 < 1 ? WOOL.ivory : WOOL.saffron, WOOL.madder);
    return g;
  },
};

/** The sidebar's edge: a sawtooth woven top to bottom, 8 pips wide. */
export const sideBandGrid = (rows) => {
  const g = makeGrid(8, rows, WOOL.madder);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < 8; c++) {
      let hex;
      if (c === 0 || c === 7) hex = WOOL.walnut;
      else if (c === 1 || c === 6) hex = WOOL.saffron;
      else {
        const k = c - 2;
        const x = r % 6;
        hex = x < k ? WOOL.ivory : x === k ? WOOL.indigo : WOOL.madder;
      }
      setCell(g, c, r, hex);
    }
  return g;
};

// ---------------------------------------------------------------- type

/** Grow a grid by n cells on the right and bottom (or all round). */
const grow = (g, { right = 0, bottom = 0, left = 0, top = 0 }) => {
  const out = makeGrid(g.cols + left + right, g.rows + top + bottom, null);
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) setCell(out, c + left, r + top, getCell(g, c, r));
  out.lines = g.lines;
  return out;
};

/** A one-pip drop shadow down and to the right of every set cell. */
export const withShadow = (g, hex = WOOL.walnut) => {
  const out = grow(g, { right: 1, bottom: 1 });
  const marks = [];
  for (let r = 1; r < out.rows; r++)
    for (let c = 1; c < out.cols; c++)
      if (!getCell(out, c, r) && getCell(g, c - 1, r - 1)) marks.push([c, r]);
  marks.forEach(([c, r]) => setCell(out, c, r, hex));
  return out;
};

/** A one-pip contour all round, so woven letters lift off any ground. */
export const withContour = (g, hex = WOOL.indigo) => {
  const out = grow(g, { left: 1, right: 1, top: 1, bottom: 1 });
  const marks = [];
  for (let r = 0; r < out.rows; r++)
    for (let c = 0; c < out.cols; c++) {
      if (getCell(out, c, r)) continue;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          if ((dx || dy) && getCell(g, c - 1 + dx, r - 1 + dy)) {
            marks.push([c, r]);
            dy = 2;
            break;
          }
    }
  marks.forEach(([c, r]) => setCell(out, c, r, hex));
  return out;
};

/**
 * A woven heading: Knit's 5×7 chart at double gauge, with a drop shadow
 * (section headings) or a contour (page titles). maxCols wraps the text.
 */
export const headingGrid = ({
  text,
  fg = WOOL.ivory,
  scale = 2,
  maxCols,
  maxLines,
  align = 'left',
  edge = 'shadow',
  edgeColor,
  font = FONTS.big,
}) => {
  const room = maxCols ? Math.max(8, maxCols - (edge === 'contour' ? 2 : 1)) : undefined;
  const g = textGrid({ text, font, scale, fg, maxCols: room, maxLines, align, lineGap: scale * 2 });
  if (edge === 'contour') return withContour(g, edgeColor || WOOL.indigo);
  if (edge === 'shadow') return withShadow(g, edgeColor || WOOL.walnut);
  return g;
};

/** Woven text at single gauge (short labels, badges). */
export const labelGrid = (options) => textGrid({ font: FONTS.small, ...options });

// ---------------------------------------------------------------- rugs

/**
 * The rug that opens a page: a framed field with half-medallions cut by the
 * side borders, a scatter of stars, and the title woven in the middle with
 * an indigo contour. The scale is the largest the title fits at.
 */
export const rugGrid = (cols, { title = '', seed = 'rug', ground = WOOL.madder, minRows = 50 } = {}) => {
  const B = 13;
  let scale = cols > 300 ? 3 : 2;
  let text;
  for (; scale >= 1; scale--) {
    text = headingGrid({ text: title, scale, maxCols: cols - 2 * (B + 8), maxLines: 3, align: 'center', edge: 'contour' });
    if (text.lines <= (scale === 1 ? 3 : 2)) break;
  }
  if (!text) text = headingGrid({ text: title, scale: 1, maxCols: cols - 2 * (B + 8), maxLines: 3, align: 'center', edge: 'contour' });
  const rows = Math.max(text.rows + B * 2 + 16, minRows);
  const g = makeGrid(cols, rows, ground);

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const er = Math.min(r, rows - 1 - r);
      const ec = Math.min(c, cols - 1 - c);
      const depth = Math.min(er, ec);
      let hex = null;
      if (depth === 0 || depth === 2 || depth === B - 1) hex = WOOL.walnut;
      else if (depth === 1) hex = WOOL.saffron;
      else if (depth < B - 2) {
        const along = er <= ec ? c : r;
        const k = depth - 3;
        const x = along % 8;
        hex = x < k ? WOOL.ivory : x === k ? WOOL.saffron : WOOL.indigo;
      } else if (depth === B - 2) hex = WOOL.ivory;
      if (hex) setCell(g, c, r, hex);
    }

  // where the title sits
  let textW = 0;
  for (let c = 0; c < text.cols; c++)
    for (let r = 0; r < text.rows; r++) if (getCell(text, c, r)) textW = Math.max(textW, c + 1);
  const tx = Math.floor((cols - text.cols) / 2);
  const ty = Math.floor((rows - text.rows) / 2);
  const firstInk = (() => {
    for (let c = 0; c < text.cols; c++)
      for (let r = 0; r < text.rows; r++) if (getCell(text, c, r)) return c;
    return 0;
  })();
  const inkLeft = tx + firstInk;
  const inkRight = tx + textW;

  const fieldTop = B;
  const fieldBot = rows - 1 - B;
  const cy = Math.round((fieldTop + fieldBot) / 2);
  let R = Math.min(Math.floor((fieldBot - fieldTop) / 2) - 3, inkLeft - B - 6, cols - inkRight - B - 6);
  if (R < 8) R = 0;
  const field = makeGrid(cols, rows, null);
  const way = { rim: WOOL.ivory, a: WOOL.indigo, b: WOOL.teal, core: WOOL.saffron, eye: WOOL.madder };
  if (R) {
    medallion(field, B - 1, cy, R, way);
    medallion(field, cols - B, cy, R, way);
  }
  const rand = rng(seedOf(seed));
  for (let r = fieldTop + 4; r < fieldBot - 3; r += 7)
    for (let c = B + 4; c < cols - B - 4; c += 9) {
      const jr = r + Math.floor(rand() * 3);
      const jc = c + ((r / 7) % 2 ? 4 : 0) + Math.floor(rand() * 2);
      const nearText = jr > ty - 3 && jr < ty + text.rows + 2 && jc > inkLeft - 5 && jc < inkRight + 5;
      const nearMedallion = R && (jc < B + R + 5 || jc > cols - B - R - 6);
      if (nearText || nearMedallion) continue;
      const pick = rand();
      star(field, jc, jr, pick < 0.45 ? WOOL.ivory : pick < 0.75 ? WOOL.saffron : WOOL.indigo, pick < 0.45 ? WOOL.madder : null);
    }
  for (let r = fieldTop; r <= fieldBot; r++)
    for (let c = B; c < cols - B; c++) {
      const hex = getCell(field, c, r);
      if (hex) setCell(g, c, r, hex);
    }
  for (let r = 0; r < text.rows; r++)
    for (let c = 0; c < text.cols; c++) {
      const hex = getCell(text, c, r);
      if (hex) setCell(g, tx + c, ty + r, hex);
    }
  return g;
};

/** A woven panel with a seeded medallion, for cards. */
export const panelGrid = (cols, seed, rows = 40) => {
  const way = pickBySeed(seed, COLOURWAYS);
  const g = makeGrid(cols, rows, way.ground);
  for (let c = 0; c < cols; c++) {
    setCell(g, c, 0, WOOL.walnut);
    setCell(g, c, rows - 1, WOOL.walnut);
    setCell(g, c, 1, c % 2 ? way.border : WOOL.walnut);
    setCell(g, c, rows - 2, c % 2 ? way.border : WOOL.walnut);
    for (let k = 0; k < 4; k++) {
      const x = c % 6;
      setCell(g, c, 2 + k, x < k + 1 ? way.border : way.ground);
      setCell(g, c, rows - 3 - k, x >= 5 - k ? way.border : way.ground);
    }
  }
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const R = Math.min(11, Math.floor(rows / 2) - 9);
  medallion(g, cx, cy, R, way);
  const side = { ...way, rim: way.border, a: way.b, b: way.a };
  medallion(g, -1, cy, Math.max(3, R - 4), side, { hooks: false });
  medallion(g, cols, cy, Math.max(3, R - 4), side, { hooks: false });
  return g;
};

/** A small square swatch with a göl, seeded so each item keeps its own. */
export const badgeGrid = (seed, size = 11) => {
  const way = pickBySeed(seed, COLOURWAYS);
  const rand = rng(seedOf(seed) + 3);
  const g = makeGrid(size, size, way.ground);
  const mid = Math.floor(size / 2);
  medallion(g, mid, mid, mid, { ...way, core: rand() < 0.5 ? way.b : way.core }, { hooks: false });
  for (let i = 0; i < size; i++) {
    setCell(g, i, 0, WOOL.walnut);
    setCell(g, i, size - 1, WOOL.walnut);
    setCell(g, 0, i, WOOL.walnut);
    setCell(g, size - 1, i, WOOL.walnut);
  }
  return g;
};

/** A woven icon: a Knit bitmap (or Phosphor name) on an optional ground. */
// Pictograms Kilim weaves its own way instead of borrowing Knit's chart.
const KILIM_ICONS = {
  // fezcode.studio: a stepped fez, knotted on top and fringed like a rug.
  fez: ['0001000', '0011100', '0011100', '0111110', '0111110', '1111111', '1010101'],
};

export const iconGrid = (name, { fg = WOOL.ivory, bg = null, pad = 0 } = {}) => {
  const key = ICONS[name] ? name : knitIconFor(name);
  const bitmap = KILIM_ICONS[name] || KILIM_ICONS[key] || ICONS[key] || ICONS.dot;
  const size = bitmap.length + pad * 2;
  const g = makeGrid(size, size, bg);
  bitmap.forEach((line, r) => {
    for (let c = 0; c < line.length; c++) if (line[c] === '1') setCell(g, pad + c, pad + r, fg);
  });
  return g;
};

export { vstack };
