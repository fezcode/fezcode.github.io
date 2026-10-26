import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitBand,
  KnitNotice,
  YARN,
} from '../../components/knit';
import '../../styles/Knit.css';

const Retrieving = () => (
  <div className="knt-root p-6">
    <KnitNotice>Finding the entry…</KnitNotice>
  </div>
);

const KnitVocabPage = () => {
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
    <div className="knt-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <KnitHero
        eyebrow="Terms the codex keeps returning to"
        title="Vocabulary"
        intro={`${entries.length} entries across ${allLetters.length} letters. Each one opens in the side panel.`}
        wool="teal"
        motif="stars"
      />
      <div className="knt-page">
        <div className="knt-sticky-tools">
          <input
            className="knt-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a word or idea…"
            aria-label="Search vocabulary"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="knt-tag"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              All
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="knt-tag"
                onClick={() => scrollToLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          {visibleLetters.length === 0 && (
            <KnitNotice>No entries match this search.</KnitNotice>
          )}
          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'mt-10'} scroll-mt-40`}
            >
              <div className="knt-section-head !mb-3">
                <KnitText as="h2" text={letter} scale={2} fg={YARN.gold} fit />
                <KnitText
                  text={`${grouped[letter].length} saved`}
                  size="small"
                  fg={YARN.wheat}
                  fit
                />
              </div>
              <ol className="list-none m-0 p-0 grid gap-2 sm:grid-cols-2">
                {grouped[letter].map((entry) => (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      className="knt-row w-full text-left !mb-0"
                      onClick={() => openVocab(entry)}
                      aria-label={`Open ${entry.title}`}
                    >
                      <div className="knt-row-body">
                        <KnitText text={entry.title} fg={YARN.cream} maxLines={2} />
                        <KnitText
                          text={`/${entry.slug}/ · ${entry.category || 'term'}`}
                          size="small"
                          fg={YARN.wheat}
                          maxLines={1}
                          className="mt-2"
                        />
                      </div>
                      <KnitIcon name="arrowRight" fg={YARN.gold} />
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p className="knt-label mt-12">
          Glossary · {entries.length} definitions on record · sorted A→Z
        </p>
      </div>
      <KnitBand pattern={['peerie', 'snow', 'peerie']} className="mt-8" />
    </div>
  );
};

export default KnitVocabPage;
