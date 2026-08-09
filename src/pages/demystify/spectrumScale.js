/**
 * Geometry for a genre's frequency-energy profile.
 *
 * This used to be drawn with block-element characters (▁▂▃▄▅▆▇█). It looked
 * right in a terminal and wrong in a browser: a font's FULL BLOCK glyph is
 * designed to fill the em box, which is not the same height as a `line-height: 1`
 * line box, so the rows never tiled exactly — every bar showed horizontal seams
 * and ragged edges, and subpixel antialiasing added colour fringing on top.
 * The shape is data, so it is drawn as SVG now and the character grid is left
 * to the hand-drawn banners, which do not depend on glyph metrics lining up.
 *
 * Bars are scaled to each genre's own range rather than to an absolute 0–100.
 * These profiles cluster in a narrow band — most sit between 40 and 90 — so an
 * absolute scale renders the lower two thirds as a featureless slab and squeezes
 * every difference into the top. What matters is the shape of the curve, not
 * its absolute height, and the shape is only legible if it uses the full chart.
 */

/** The quietest band still gets a visible sliver rather than nothing. */
const FLOOR = 0.06;

export const SPECTRUM_AXIS = [
  { at: 0, label: 'SUB' },
  { at: 4, label: 'LOW' },
  { at: 9, label: 'MID' },
  { at: 14, label: 'UPPER' },
  { at: 19, label: 'AIR' },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * @param {number[]} spec energy per band, 0–100
 * @returns {number[]} height of each bar as a fraction of the chart, 0–1
 */
export const spectrumBars = (spec) => {
  if (!Array.isArray(spec) || spec.length === 0) return [];

  const values = spec.map((value) => clamp(Number(value) || 0, 0, 100));
  const lo = Math.min(...values);
  const hi = Math.max(...values);

  // A flat profile would divide by zero; render it at a uniform mid height.
  return values.map((value) => {
    const t = hi === lo ? 0.5 : (value - lo) / (hi - lo);
    return FLOOR + t * (1 - FLOOR);
  });
};

export default spectrumBars;
