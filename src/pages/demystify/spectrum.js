/**
 * Renders a genre's frequency-energy profile as monospace block art.
 *
 * The atlas draws this as an SVG bar chart; here it becomes the same chart in
 * the character grid the rest of /demystify lives in, so it sits beside the
 * hand-drawn ASCII banners without looking imported.
 *
 * Bars are scaled to each genre's own range rather than to an absolute 0–100.
 * These profiles cluster in a narrow band — most sit between 40 and 90 — so an
 * absolute scale renders the lower two thirds as a featureless slab and squeezes
 * every difference into the top row. What matters here is the shape of the
 * curve, not its absolute height, and the shape is only legible if it uses the
 * full chart.
 */

// U+2581..U+2588 climb in eighths, so a column's partial top cell can land on
// any of eight sub-row heights.
const EIGHTHS = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

/** The quietest band still gets a visible sliver rather than nothing. */
const FLOOR = 0.7;

const AXIS = [
  { at: 0, label: 'SUB' },
  { at: 4, label: 'LOW' },
  { at: 9, label: 'MID' },
  { at: 14, label: 'UPPER' },
  { at: 19, label: 'AIR' },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * @param {number[]} spec  energy per band, 0–100
 * @param {{rows?: number, cell?: number}} options
 * @returns {string} newline-joined block art, or '' when there is no data
 */
export const renderSpectrum = (spec, { rows = 9, cell = 2 } = {}) => {
  if (!Array.isArray(spec) || spec.length === 0) return '';

  const values = spec.map((value) => clamp(Number(value) || 0, 0, 100));
  const lo = Math.min(...values);
  const hi = Math.max(...values);

  // A flat profile would divide by zero; render it as a uniform mid-height bar.
  const heights = values.map((value) => {
    const t = hi === lo ? 0.5 : (value - lo) / (hi - lo);
    return FLOOR + t * (rows - FLOOR);
  });

  const lines = [];
  for (let row = rows - 1; row >= 0; row -= 1) {
    let line = '';
    heights.forEach((height) => {
      const fill = clamp(height - row, 0, 1);
      line += EIGHTHS[Math.round(fill * 8)].repeat(cell);
    });
    lines.push(line.replace(/\s+$/, ''));
  }

  // Axis ruler: a tick under each labelled band, then the labels, centred on
  // their tick and nudged inward so nothing overflows the chart.
  const width = spec.length * cell;
  const ticks = Array.from({ length: width }, () => '─');
  const labels = Array.from({ length: width }, () => ' ');
  AXIS.filter((mark) => mark.at < spec.length).forEach((mark) => {
    const centre = clamp(mark.at * cell, 0, width - 1);
    ticks[centre] = '┴';
    const start = clamp(
      centre - Math.floor(mark.label.length / 2),
      0,
      Math.max(0, width - mark.label.length),
    );
    [...mark.label].forEach((ch, i) => {
      if (start + i < width) labels[start + i] = ch;
    });
  });

  lines.push(ticks.join(''));
  lines.push(labels.join('').replace(/\s+$/, ''));
  return lines.join('\n');
};

export default renderSpectrum;
