/**
 * Renders a genre's frequency-energy profile as monospace block art.
 *
 * The atlas draws this as an SVG bar chart; here it becomes the same chart in
 * the character grid the rest of /demystify lives in, so it sits beside the
 * hand-drawn ASCII banners without looking imported.
 */

// U+2581..U+2588 climb in eighths, so a column's partial top cell can land on
// any of eight sub-row heights.
const EIGHTHS = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

const AXIS = [
  { at: 0, label: 'SUB' },
  { at: 4, label: 'LOW' },
  { at: 9, label: 'MID' },
  { at: 14, label: 'UPPER' },
  { at: 19, label: 'AIR' },
];

/**
 * @param {number[]} spec  energy per band, 0–100
 * @param {{rows?: number, cell?: number}} options
 * @returns {string} newline-joined block art, or '' when there is no data
 */
export const renderSpectrum = (spec, { rows = 7, cell = 2 } = {}) => {
  if (!Array.isArray(spec) || spec.length === 0) return '';

  const columns = spec.map((value) => {
    const clamped = Math.min(100, Math.max(0, Number(value) || 0));
    return (clamped / 100) * rows;
  });

  const lines = [];
  for (let row = rows - 1; row >= 0; row -= 1) {
    let line = '';
    columns.forEach((height) => {
      const fill = Math.min(1, Math.max(0, height - row));
      line += EIGHTHS[Math.round(fill * 8)].repeat(cell);
    });
    lines.push(line.replace(/\s+$/, ''));
  }

  // Axis ruler: a tick under each labelled band, then the labels themselves.
  const width = spec.length * cell;
  const ticks = Array.from({ length: width }, () => '─');
  const labels = Array.from({ length: width }, () => ' ');
  AXIS.filter((mark) => mark.at < spec.length).forEach((mark) => {
    const centre = mark.at * cell;
    ticks[Math.min(centre, width - 1)] = '┴';
    // Nudge the last label left so it cannot overflow the chart width.
    const start = Math.min(centre, Math.max(0, width - mark.label.length));
    [...mark.label].forEach((ch, i) => {
      if (start + i < width) labels[start + i] = ch;
    });
  });

  lines.push(ticks.join(''));
  lines.push(labels.join('').replace(/\s+$/, ''));
  return lines.join('\n');
};

export default renderSpectrum;
