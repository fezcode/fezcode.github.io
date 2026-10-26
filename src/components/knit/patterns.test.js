import { describe, it, expect } from 'vitest';
import { FONTS, normalizeText, textWidth, wrapText } from './fonts';
import { textGrid, BANDS, knitIconFor, ICONS } from './patterns';
import { getCell } from './engine';

describe('stitch fonts', () => {
  it('knits capitals and folds accents, dotless i and dashes', () => {
    expect(normalizeText('Kanije — Tiryaki Hasan Paşa, ıI')).toBe(
      'KANIJE - TIRYAKI HASAN PASA, II',
    );
  });

  it('drops characters it has no chart for', () => {
    expect(normalizeText('a~b{c}')).toBe('ABC');
  });

  it('every glyph in a font is as tall as the font', () => {
    const ragged = [];
    Object.entries(FONTS).forEach(([name, font]) => {
      Object.entries(font.glyphs).forEach(([ch, rows]) => {
        if (
          rows.length !== font.height ||
          new Set(rows.map((r) => r.length)).size !== 1
        )
          ragged.push(`${name}:${ch}`);
      });
    });
    expect(ragged).toEqual([]);
  });

  it('measures a word as glyph widths plus one-stitch gaps', () => {
    expect(textWidth('HI', FONTS.big)).toBe(5 + 1 + 3);
  });

  it('wraps on word boundaries within the width', () => {
    // ONE and TWO are 17 stitches each, THREE is 29
    const lines = wrapText('ONE TWO THREE', 30, FONTS.big);
    expect(lines).toEqual(['ONE', 'TWO', 'THREE']);
    lines.forEach((line) => expect(textWidth(line, FONTS.big)).toBeLessThanOrEqual(30));
  });

  it('splits a word longer than the line', () => {
    const lines = wrapText('ABCDEFGHIJ', 20, FONTS.big);
    expect(lines.join('')).toBe('ABCDEFGHIJ');
    lines.forEach((line) => expect(textWidth(line, FONTS.big)).toBeLessThanOrEqual(20));
  });
});

describe('charts', () => {
  it('fits a text grid to its text and stitches only the letters', () => {
    const g = textGrid({ text: 'I', fg: '#ffffff' });
    expect(g.cols).toBe(3);
    expect(g.rows).toBe(7);
    expect(getCell(g, 0, 0)).toBe('#ffffff');
    expect(getCell(g, 0, 1)).toBeNull();
  });

  it('ellipsizes text beyond maxLines', () => {
    const g = textGrid({ text: 'ONE TWO THREE FOUR', maxCols: 24, maxLines: 1 });
    expect(g.lines).toBe(1);
  });

  it('every band fills the requested width', () => {
    const short = Object.entries(BANDS)
      .filter(([, band]) => {
        const g = band(37);
        return g.cols !== 37 || !g.cells.every(Boolean);
      })
      .map(([name]) => name);
    expect(short).toEqual([]);
  });

  it('maps Phosphor icon names onto knitted pictograms', () => {
    expect(knitIconFor('HouseIcon')).toBe('home');
    expect(knitIconFor('NoSuchIcon')).toBe('heart');
    expect(ICONS[knitIconFor('ArticleIcon')]).toBeDefined();
  });
});
