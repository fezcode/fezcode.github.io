/** Shared helpers for The Reading Room (/snf-v3). */

const ROMAN = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
  ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
];

export function toRoman(num) {
  let n = Number(num) || 0;
  let out = '';
  for (const [sym, val] of ROMAN) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out || '—';
}

/** "2025–26" style range from a book's episode dates. */
export function bookYears(book) {
  const years = (book.episodes || [])
    .map((e) => (e.date || '').slice(0, 4))
    .filter(Boolean)
    .sort();
  if (!years.length) return '';
  const a = years[0];
  const b = years[years.length - 1];
  return a === b ? a : `${a}–${b.slice(2)}`;
}

/** Lead scribe = most frequent author across a book's episodes. */
export function leadScribe(book) {
  const counts = {};
  (book.episodes || []).forEach((e) => {
    if (e.author) counts[e.author] = (counts[e.author] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
}
