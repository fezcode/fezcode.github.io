import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryBand,
  MarquetryNotice,
  WOOD,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const Retrieving = () => (
  <div className="mqt-root p-6">
    <MarquetryNotice>Finding the entry…</MarquetryNotice>
  </div>
);

const MarquetryVocabPage = () => {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const { openSidePanel } = useSidePanel();

  const entries = useMemo(
    () =>
      Object.entries(vocabulary)
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const filtered = useMemo(() => {
    let list = entries;
    if (activeLetter !== 'all') {
      list = list.filter(
        (e) => e.title.charAt(0).toUpperCase() === activeLetter,
      );
    }
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [entries, activeLetter, query]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((e) => {
      const letter = e.title.charAt(0).toUpperCase();
      if (!g[letter]) g[letter] = [];
      g[letter].push(e);
    });
    return g;
  }, [filtered]);

  const allLetters = useMemo(() => {
    const s = new Set();
    entries.forEach((e) => s.add(e.title.charAt(0).toUpperCase()));
    return [...s].sort();
  }, [entries]);

  const visibleLetters = Object.keys(grouped).sort();

  const openVocab = (entry) => {
    const LazyComponent = React.lazy(entry.loader);
    openSidePanel(
      entry.title,
      <Suspense fallback={<Retrieving />}>
        <LazyComponent />
      </Suspense>,
      600,
    );
  };

  const scrollToLetter = (letter) => {
    setActiveLetter('all');
    requestAnimationFrame(() => {
      const el = document.getElementById(`letter-${letter}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="mqt-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <MarquetryHero
        eyebrow="Terms the codex keeps returning to"
        title="Vocabulary"
        intro={`${entries.length} entries across ${allLetters.length} letters. Each one opens in the side panel.`}
      />
      <div className="mqt-page">
        <div className="mqt-sticky-tools">
          <input
            className="mqt-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a word or idea…"
            aria-label="Search vocabulary"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="mqt-tag"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              All
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="mqt-tag"
                onClick={() => scrollToLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          {visibleLetters.length === 0 && (
            <MarquetryNotice>No entries match this search.</MarquetryNotice>
          )}
          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'mt-10'} scroll-mt-40`}
            >
              <div className="mqt-section-head !mb-3">
                <MarquetryText
                  as="h2"
                  text={letter}
                  scale={2}
                  fg={WOOD.teal}
                  fit
                />
                <MarquetryText
                  text={`${grouped[letter].length} saved`}
                  size="small"
                  fg={WOOD.bark}
                  fit
                />
              </div>
              <ol className="list-none m-0 p-0 grid gap-2 sm:grid-cols-2">
                {grouped[letter].map((entry) => (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      className="mqt-row w-full text-left !mb-0"
                      onClick={() => openVocab(entry)}
                      aria-label={`Open ${entry.title}`}
                    >
                      <div className="mqt-row-body">
                        <MarquetryText
                          text={entry.title}
                          fg={WOOD.ink}
                          maxLines={2}
                        />
                        <MarquetryText
                          text={`/${entry.slug}/ · ${entry.category || 'term'}`}
                          size="small"
                          fg={WOOD.bark}
                          maxLines={1}
                          className="mt-2"
                        />
                      </div>
                      <MarquetryIcon name="arrowRight" fg={WOOD.teal} />
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p className="mqt-label mt-12">
          Glossary · {entries.length} definitions on record · sorted A→Z
        </p>
      </div>
      <MarquetryBand pattern={['peerie', 'snow', 'peerie']} className="mt-8" />
    </div>
  );
};

export default MarquetryVocabPage;
