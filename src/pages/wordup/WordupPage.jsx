import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useWordupData, filterWordupWords } from '../../hooks/useWordupData';
import WordupShell from './WordupShell';
import LexicalSculpture from './LexicalSculpture';
import WordupAlphabeticalView from './WordupAlphabeticalView';

const places = [
  { left: '15%', top: '26%' },
  { left: '73%', top: '19%' },
  { left: '22%', top: '59%' },
  { left: '76%', top: '59%' },
  { left: '43%', top: '9%' },
  { left: '47%', top: '61%' },
];

export default function WordupPage() {
  const { words, loading, error } = useWordupData();
  const [language, setLanguage] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const isAlphabetical = searchParams.get('view') === 'index';
  const navigate = useNavigate();
  const changeView = (alphabetical) => {
    const next = new URLSearchParams(searchParams);
    if (alphabetical) next.set('view', 'index');
    else next.delete('view');
    setSearchParams(next, { preventScrollReset: true });
  };
  const visibleWords = useMemo(
    () => filterWordupWords(words, { language, query }),
    [words, language, query],
  );
  const pageCount = Math.max(1, Math.ceil(visibleWords.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const orbitWords = visibleWords.slice(currentPage * 6, currentPage * 6 + 6);
  const selected =
    orbitWords.find((word) => word.slug === selectedSlug) || orbitWords[0];
  const reset = () => {
    setQuery('');
    setLanguage('all');
    setPage(0);
  };
  const surprise = () => {
    if (words.length)
      navigate(
        '/wordup/' + words[Math.floor(Math.random() * words.length)].slug,
      );
  };

  return (
    <WordupShell>
      <Seo
        title="Wordup — A living lexicon | Fezcodex"
        description="Invented Turkish and English words for feelings that don't have a name yet. Explore a living lexicon by fezcode."
      />
      <h1 className="wf-sr-only">
        Wordup — a living lexicon of invented words
      </h1>
      <section
        className={'wf-field' + (isAlphabetical ? ' wf-field--index' : '')}
        aria-label="Explore invented words"
      >
        <div className="wf-field-tools">
          <div className="wf-browse-controls">
            <div
              className="wf-view-switch"
              role="group"
              aria-label="Collection view"
            >
              <button
                type="button"
                aria-pressed={!isAlphabetical}
                onClick={() => changeView(false)}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="5" />
                  <ellipse
                    cx="8"
                    cy="8"
                    rx="2"
                    ry="6.5"
                    transform="rotate(40 8 8)"
                  />
                </svg>
                Sculptures
              </button>
              <button
                type="button"
                aria-pressed={isAlphabetical}
                onClick={() => changeView(true)}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 4h9M5 8h9M5 12h9" />
                  <path d="M1 4h1M1 8h1M1 12h1" />
                </svg>
                A–Z index
              </button>
            </div>
            <div
              className="wf-language-filter"
              role="group"
              aria-label="Filter words by language"
            >
              {[
                ['all', 'All words'],
                ['tr', 'Türkçe'],
                ['en', 'English'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={language === value}
                  onClick={() => {
                    setLanguage(value);
                    setPage(0);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="wf-search">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <input
              type="search"
              aria-label="Search words and meanings"
              placeholder="Find a feeling"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
        {isAlphabetical ? (
          <WordupAlphabeticalView words={visibleWords} language={language} />
        ) : (
          <>
            <div className="wf-field-statement" aria-hidden="true">
              <span>
                Not every feeling
                <br />
                has found its word.
              </span>
              <span>
                {words.length === 1 ? 'This one has.' : 'These have.'}
              </span>
            </div>
            <div className="wf-orbital-lines" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>
            <LexicalSculpture
              seed={selected?.word || 'wordup'}
              className="wf-field-sculpture"
            />
            <div className="wf-form-caption" aria-hidden="true">
              <span className="wf-signal-dot" />
              <span>
                A language
                <br />
                taking shape
              </span>
            </div>
            <ul className="wf-constellation" aria-label="Word collection">
              {orbitWords.map((word, index) => (
                <li
                  key={word.slug}
                  className={
                    'wf-word-node ' +
                    (selected?.slug === word.slug ? 'is-selected' : '')
                  }
                  style={{
                    '--node-x': places[index].left,
                    '--node-y': places[index].top,
                    '--node-delay': index * 70 + 'ms',
                  }}
                >
                  <Link
                    to={'/wordup/' + word.slug}
                    onPointerEnter={() => setSelectedSlug(word.slug)}
                    onFocus={() => setSelectedSlug(word.slug)}
                  >
                    <span className="wf-node-overline">
                      <span className="wf-node-dot" />
                      {word.language === 'tr' ? 'Türkçe' : 'English'}
                      <span className="wf-node-invented"> / invented</span>
                    </span>
                    <h3 lang={word.language}>{word.word}</h3>
                    {word.roots && (
                      <span className="wf-node-root">{word.roots}</span>
                    )}
                    <span className="wf-node-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {loading && (
          <div className="wf-field-state" role="status">
            Finding the words…
          </div>
        )}
        {error && (
          <div className="wf-field-state" role="alert">
            <p>The words couldn't be loaded.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}
        {!loading && !error && visibleWords.length === 0 && (
          <div className="wf-field-state">
            <p>
              {words.length
                ? 'No word for that feeling. Yet.'
                : 'The first word is still becoming.'}
            </p>
            {words.length > 0 && (
              <button type="button" onClick={reset}>
                Show all words
              </button>
            )}
          </div>
        )}
        {!isAlphabetical && selected && (
          <div className="wf-preview" aria-label="Selected word">
            <div className="wf-preview-word">
              <span>Get to know</span>
              <strong lang={selected.language}>{selected.word}</strong>
            </div>
            <p>{selected.definition || 'Definition coming soon.'}</p>
            <Link
              to={'/wordup/' + selected.slug}
              aria-label={'Open ' + selected.word}
            >
              <span>Enter word</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
        <div className="wf-field-bottom">
          <span>
            {String(visibleWords.length).padStart(2, '0')} invented{' '}
            {visibleWords.length === 1 ? 'word' : 'words'}
            <span className="wf-collection-label"> · a personal lexicon</span>
          </span>
          {!isAlphabetical && pageCount > 1 && (
            <div className="wf-pages">
              <button
                aria-label="Previous words"
                type="button"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                ←
              </button>
              <span>
                {currentPage + 1} / {pageCount}
              </span>
              <button
                aria-label="Next words"
                type="button"
                disabled={currentPage === pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                →
              </button>
            </div>
          )}
          <button type="button" onClick={surprise} disabled={!words.length}>
            Take me somewhere <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    </WordupShell>
  );
}
