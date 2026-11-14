const TURKISH_ALPHABET = Array.from('ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ');
const ENGLISH_ALPHABET = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const LOCALES = { tr: 'tr', en: 'en', all: 'tr' };
const collators = {
  tr: new Intl.Collator('tr', { numeric: true, sensitivity: 'base' }),
  en: new Intl.Collator('en', { numeric: true, sensitivity: 'base' }),
};

const selectedLanguage = (language) =>
  Object.hasOwn(LOCALES, language) ? language : 'all';

const canonicalWord = (word) =>
  String(word ?? '')
    .normalize('NFC')
    .trim();

const initialLetter = (word, locale) => {
  let text = canonicalWord(word).toLocaleLowerCase(locale);
  // English browsing puts É with E. Turkish browsing deliberately keeps
  // Ç, Ğ, I, İ, Ö, Ş and Ü as separate letters rather than search-folding them.
  if (locale === 'en') text = text.normalize('NFD').replace(/\p{M}/gu, '');
  const first = Array.from(text)[0] || '';
  if (!/\p{L}/u.test(first)) return '#';
  return Array.from(first.toLocaleUpperCase(locale).normalize('NFC'))[0];
};

/** Official letter sets; the mixed view adds Q/W/X in Turkish sort order. */
export function getAlphabetLetters(language = 'all') {
  const selected = selectedLanguage(language);
  if (selected === 'en') return [...ENGLISH_ALPHABET];
  if (selected === 'tr') return [...TURKISH_ALPHABET];
  return [...TURKISH_ALPHABET, 'Q', 'W', 'X'].sort(collators.tr.compare);
}

/**
 * Group a collection without mutating its entries or source order. `tr` and
 * `en` also filter the collection; `all` uses Turkish case and collation.
 * Other Unicode initials remain valid groups; punctuation/numbers use #.
 */
export function groupWordsAlphabetically(words = [], language = 'all') {
  const selected = selectedLanguage(language);
  const locale = LOCALES[selected];
  const compare = collators[locale].compare;
  const groups = new Map();
  const entries = words
    .filter((word) => word && canonicalWord(word.word))
    .filter((word) => selected === 'all' || word.language === selected)
    .map((word, index) => ({ word, index }))
    .sort((first, second) => {
      const textOrder = compare(
        canonicalWord(first.word.word),
        canonicalWord(second.word.word),
      );
      if (textOrder) return textOrder;
      // A codepoint tie-break remains deterministic even for collator-equal
      // spellings, case variants and canonically equivalent display words.
      const a = canonicalWord(first.word.slug);
      const b = canonicalWord(second.word.slug);
      return (a < b ? -1 : a > b ? 1 : 0) || first.index - second.index;
    });

  entries.forEach(({ word }) => {
    const letter = initialLetter(word.word, locale);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(word);
  });

  return Array.from(groups, ([letter, groupedWords]) => ({
    letter,
    words: groupedWords,
  })).sort((first, second) => {
    if (first.letter === '#') return second.letter === '#' ? 0 : 1;
    if (second.letter === '#') return -1;
    return compare(first.letter, second.letter);
  });
}
