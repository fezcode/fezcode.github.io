import { describe, expect, it } from 'vitest';
import { getAlphabetLetters, groupWordsAlphabetically } from './wordupAlphabet';

const entry = (word, language = 'tr', slug = word) => ({
  word,
  language,
  slug,
});

describe('Wordup alphabetical browsing', () => {
  it('uses the Turkish letter order and keeps dotted/dotless I and diacritics distinct', () => {
    const words = [
      'Veda',
      'üzüm',
      'ufuk',
      'tane',
      'şafak',
      'ses',
      'pencere',
      'öte',
      'orman',
      'jurnal',
      'İZ',
      'ışık',
      'hece',
      'ğam',
      'göl',
      'deniz',
      'çizgi',
      'can',
    ].map((word) => entry(word));
    expect(
      groupWordsAlphabetically(words).map((group) => group.letter),
    ).toEqual([
      'C',
      'Ç',
      'D',
      'G',
      'Ğ',
      'H',
      'I',
      'İ',
      'J',
      'O',
      'Ö',
      'P',
      'S',
      'Ş',
      'T',
      'U',
      'Ü',
      'V',
    ]);
    const initials = groupWordsAlphabetically([
      entry('IŞIK'),
      entry('ışın'),
      entry('İZ'),
      entry('i\u0307z'),
      entry('istanbul'),
    ]);
    expect(initials.map((group) => group.letter)).toEqual(['I', 'İ']);
    expect(initials[0].words).toHaveLength(2);
    expect(initials[1].words).toHaveLength(3);
  });

  it('sorts international Q/W/X naturally in the mixed view and puts nonletters last', () => {
    const words = [
      'xeno',
      'word10',
      'qalam',
      'vadi',
      'pöskürmek',
      'rüya',
      'word2',
      'yeni',
      '10am',
      '2am',
      '!ünlem',
    ].map((word) => entry(word));
    const grouped = groupWordsAlphabetically(words);
    expect(grouped.map((group) => group.letter)).toEqual([
      'P',
      'Q',
      'R',
      'V',
      'W',
      'X',
      'Y',
      '#',
    ]);
    expect(
      grouped
        .find((group) => group.letter === 'W')
        .words.map((word) => word.word),
    ).toEqual(['word2', 'word10']);
    expect(
      grouped
        .at(-1)
        .words.filter((word) => /^\d/.test(word.word))
        .map((word) => word.word),
    ).toEqual(['2am', '10am']);
  });

  it('filters by language and folds English accented initials without merging Turkish letters', () => {
    const words = [
      entry('Éclair', 'en'),
      entry('eon', 'en'),
      entry('öte'),
      entry('överture', 'en'),
      entry('çizgi'),
    ];
    const english = groupWordsAlphabetically(words, 'en');
    expect(english.map((group) => group.letter)).toEqual(['E', 'O']);
    expect(english[0].words.map((word) => word.word)).toEqual([
      'Éclair',
      'eon',
    ]);
    expect(
      groupWordsAlphabetically(words, 'tr').map((group) => group.letter),
    ).toEqual(['Ç', 'Ö']);
    expect(
      groupWordsAlphabetically(words).some((group) => group.letter === 'É'),
    ).toBe(true);
  });

  it('does not mutate the input and resolves collator ties by slug', () => {
    const second = Object.freeze(entry('Çağ', 'tr', 'z-entry'));
    const first = Object.freeze(entry('çağ', 'tr', 'a-entry'));
    const words = Object.freeze([second, first]);
    const grouped = groupWordsAlphabetically(words);
    expect(grouped[0].words).toEqual([first, second]);
    expect(grouped[0].words[0]).toBe(first);
    expect(words).toEqual([second, first]);
  });

  it('returns standard alphabets independently and handles empty collections', () => {
    expect(getAlphabetLetters('tr')).toHaveLength(29);
    expect(getAlphabetLetters('en')).toEqual(
      Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    );
    expect(getAlphabetLetters()).toEqual(
      Array.from('ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZ'),
    );
    const mutable = getAlphabetLetters('tr');
    mutable.pop();
    expect(getAlphabetLetters('tr')).toHaveLength(29);
    expect(groupWordsAlphabetically()).toEqual([]);
    expect(groupWordsAlphabetically([null, entry('  ')])).toEqual([]);
  });
});
