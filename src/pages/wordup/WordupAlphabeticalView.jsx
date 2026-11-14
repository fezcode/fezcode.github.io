import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAlphabetLetters, groupWordsAlphabetically } from './wordupAlphabet';

const turkishPartsOfSpeech = {
  noun: 'isim',
  verb: 'fiil',
  adjective: 'sıfat',
  adverb: 'zarf',
  phrase: 'söz öbeği',
  interjection: 'ünlem',
};

const letterSuffix = (letter) =>
  Array.from(letter, (character) => character.codePointAt(0).toString(16)).join(
    '-',
  );

export default function WordupAlphabeticalView({ words, language = 'all' }) {
  const groups = useMemo(
    () => groupWordsAlphabetically(words, language),
    [words, language],
  );
  const standardLetters = getAlphabetLetters(language);
  const availableLetters = new Set(groups.map((group) => group.letter));
  const letters = [
    ...standardLetters,
    ...groups
      .map((group) => group.letter)
      .filter((letter) => !standardLetters.includes(letter)),
  ];
  const headingId = (letter) => `wordup-letter-${letterSuffix(letter)}`;

  return (
    <div className="wf-alphabet">
      <header className="wf-alphabet-intro">
        <h2>The word index.</h2>
        <p>Every invented word, in alphabetical order.</p>
      </header>
      <nav className="wf-alphabet-nav" aria-label="Jump to a letter">
        {letters.map((letter) =>
          availableLetters.has(letter) ? (
            <a
              key={letter}
              className="wf-alphabet-letter"
              href={'#' + headingId(letter)}
              aria-label={
                letter === '#'
                  ? 'Words beginning with a number or symbol'
                  : `Words beginning with ${letter}`
              }
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              className="wf-alphabet-letter is-unavailable"
              aria-disabled="true"
              title={`No words beginning with ${letter}`}
            >
              {letter}
            </span>
          ),
        )}
      </nav>

      <div className="wf-alphabet-groups">
        {groups.map((group) => (
          <section
            key={group.letter}
            className="wf-alphabet-group"
            aria-labelledby={headingId(group.letter)}
          >
            <header className="wf-alphabet-group-heading">
              <h3 id={headingId(group.letter)} tabIndex={-1}>
                {group.letter}
              </h3>
              <span className="wf-alphabet-count">
                {group.words.length}{' '}
                {group.words.length === 1 ? 'word' : 'words'}
              </span>
            </header>
            <ul className="wf-alphabet-list">
              {group.words.map((word) => {
                const isTurkish = word.language === 'tr';
                const definition = isTurkish
                  ? word.translation || word.definition
                  : word.definition;
                const definitionLanguage =
                  isTurkish && word.translation ? 'tr' : 'en';
                const partOfSpeech = isTurkish
                  ? turkishPartsOfSpeech[word.partOfSpeech] || word.partOfSpeech
                  : word.partOfSpeech;

                return (
                  <li key={word.slug} className="wf-alphabet-item">
                    <Link
                      className="wf-alphabet-link"
                      to={'/wordup/' + word.slug}
                    >
                      <div className="wf-alphabet-word">
                        <span lang={word.language}>{word.word}</span>
                        <span
                          className="wf-alphabet-language"
                          lang={word.language}
                        >
                          {isTurkish ? 'Türkçe' : 'English'}
                        </span>
                        {partOfSpeech && (
                          <span
                            className="wf-alphabet-part"
                            lang={word.language}
                          >
                            {partOfSpeech}
                          </span>
                        )}
                      </div>
                      <p
                        className="wf-alphabet-definition"
                        lang={
                          definition
                            ? definitionLanguage
                            : isTurkish
                              ? 'tr'
                              : 'en'
                        }
                      >
                        {definition ||
                          (isTurkish
                            ? 'Tanım henüz eklenmedi.'
                            : 'Definition coming soon.')}
                      </p>
                      <span className="wf-alphabet-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
