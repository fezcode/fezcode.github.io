import React, { Suspense, useMemo, useState } from 'react';
import {
  BookOpenTextIcon,
  CaretRightIcon,
  InfoIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import { getCategoryColor } from '../../utils/categoryColors';
import { BlissWindow, BlissIcon, BlissNotice } from '../../components/bliss';
import '../../styles/Bliss.css';

const Retrieving = () => (
  <div className="bl-root p-6">
    <BlissNotice>Finding the entry…</BlissNotice>
  </div>
);

const BlissVocabPage = () => {
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
    <div className="bl-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <div className="bl-page">
        <BlissWindow
          title="Vocabulary"
          icon={BookOpenTextIcon}
          tone="teal"
          headingLevel={1}
          status={
            <>
              <span>
                {filtered.length} of {entries.length} entries
              </span>
              <span>Sorted A→Z</span>
            </>
          }
        >
          <div className="flex items-start gap-4">
            <BlissIcon
              icon={BookOpenTextIcon}
              tone="teal"
              size={56}
              className="hidden sm:inline-flex"
            />
            <div className="min-w-0">
              <p className="bl-eyebrow">Terms the codex keeps returning to</p>
              <p className="bl-display mt-1" aria-hidden="true">
                Vocabulary
              </p>
              <p className="bl-muted mt-2">
                {entries.length} entries across {allLetters.length} letters.
                Each one opens in the side panel.
              </p>
            </div>
          </div>
          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Find</span>
            <label className="flex items-center gap-2">
              <MagnifyingGlassIcon
                size={18}
                weight="bold"
                className="shrink-0 text-[#0b3fb0]"
                aria-hidden="true"
              />
              <input
                className="bl-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a word or idea…"
                aria-label="Search vocabulary"
              />
            </label>
            <div
              className="mt-3 flex flex-wrap gap-1.5"
              role="group"
              aria-label="Jump to letter"
            >
              <button
                type="button"
                className="bl-tag"
                aria-pressed={activeLetter === 'all'}
                onClick={() => setActiveLetter('all')}
              >
                All
              </button>
              {allLetters.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="bl-tag"
                  onClick={() => scrollToLetter(l)}
                  aria-label={`Jump to ${l}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </BlissWindow>

        {visibleLetters.length === 0 && (
          <BlissWindow title="No results" icon={MagnifyingGlassIcon} inactive>
            <BlissNotice>No entries match this search.</BlissNotice>
          </BlissWindow>
        )}

        {visibleLetters.map((letter) => (
          <BlissWindow
            key={letter}
            id={`letter-${letter}`}
            className="scroll-mt-40"
            title={letter}
            icon={BookOpenTextIcon}
            tone="blue"
            flush
            status={
              <>
                <span>{grouped[letter].length} saved</span>
                <span>Letter {letter}</span>
              </>
            }
          >
            <ol className="list-none m-0 p-0 grid sm:grid-cols-2">
              {grouped[letter].map((entry) => (
                <li
                  key={entry.slug}
                  className="flex border-b border-dotted border-[#a7a28c]"
                >
                  <button
                    type="button"
                    className="bl-row w-full text-left cursor-pointer"
                    onClick={() => openVocab(entry)}
                    aria-label={`Open ${entry.title}`}
                  >
                    <BlissIcon
                      icon={BookOpenTextIcon}
                      seed={entry.category || entry.slug}
                      size={28}
                    />
                    <span className="bl-row-body">
                      <span className="bl-row-title">{entry.title}</span>
                      <span className="bl-meta inline-flex items-center gap-1.5 flex-wrap">
                        <span>/{entry.slug}/ ·</span>
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full border border-white"
                          style={{
                            background: getCategoryColor(
                              'bliss',
                              entry.category || 'term',
                            ),
                          }}
                          aria-hidden="true"
                        />
                        <span className="font-bold">
                          {entry.category || 'term'}
                        </span>
                      </span>
                    </span>
                    <CaretRightIcon size={16} weight="bold" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </BlissWindow>
        ))}

        <BlissWindow title="Glossary details" icon={InfoIcon} inactive>
          <p className="bl-meta">
            Glossary · {entries.length} definitions on record · sorted A→Z
          </p>
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissVocabPage;
