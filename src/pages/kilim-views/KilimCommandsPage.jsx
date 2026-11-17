import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import {
  KilimText,
  KilimRug,
  KilimIcon,
  KilimBadge,
  KilimBand,
  KilimNotice,
  WOOL,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-utility.css';

/*
 * Commands as the pattern key printed beside a weaving chart: every command
 * is one legend line with its own woven motif and a chart code (section.row),
 * and a chart index runs down the margin so any section is one jump away.
 */

const sectionId = (idx) => `cmd-section-${idx + 1}`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const KilimCommandsPage = () => {
  const { togglePalette, triggerCommand } = useCommandPalette();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePalette]);

  const filtered = useMemo(() => {
    if (!query) return commandsData;
    const q = query.toLowerCase();
    return commandsData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(q) ||
            (cmd.description || '').toLowerCase().includes(q) ||
            cat.category.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length);
  }, [query]);

  const total = commandsData.reduce((n, c) => n + c.items.length, 0);
  const shown = filtered.reduce((n, c) => n + c.items.length, 0);

  const jumpTo = (idx) => {
    const el = document.getElementById(sectionId(idx));
    if (el)
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
  };

  return (
    <div className="klm-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <div className="klm-page">
        <KilimRug
          eyebrow={`${total} commands · ${commandsData.length} sections · ⌘ / ctrl + k`}
          title="Commands"
          intro="Every verb the codex answers to, keyed like a weaving chart. Run one here, or summon the palette anywhere."
          seed="kilim-commands"
        >
          <div className="klm-cmd-tools">
            <button type="button" className="klm-btn" onClick={togglePalette}>
              <KilimIcon name="command" fg={WOOL.walnut} />
              Open palette
            </button>
            <input
              className="klm-input klm-cmd-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a command…"
              aria-label="Search commands"
            />
          </div>
          {query && (
            <p className="klm-label klm-cmd-match">
              {shown} of {total} commands match
            </p>
          )}
        </KilimRug>

        {filtered.length === 0 ? (
          <KilimNotice>No commands match this search.</KilimNotice>
        ) : (
          <div className="klm-cmd-layout">
            <nav className="klm-cmd-index" aria-label="Command sections">
              <p className="klm-label klm-cmd-index-title">Chart index</p>
              <ol className="klm-cmd-index-list">
                {filtered.map((cat, catIdx) => (
                  <li key={cat.category}>
                    <button
                      type="button"
                      className="klm-cmd-index-link"
                      onClick={() => jumpTo(catIdx)}
                    >
                      <span className="klm-cmd-index-no">
                        {String(catIdx + 1).padStart(2, '0')}
                      </span>
                      <span className="klm-cmd-index-name">{cat.category}</span>
                      <span className="klm-cmd-index-count">
                        {cat.items.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="klm-cmd-chart">
              {filtered.map((cat, catIdx) => {
                const no = String(catIdx + 1).padStart(2, '0');
                return (
                  <section
                    key={cat.category}
                    id={sectionId(catIdx)}
                    className="klm-cmd-section"
                  >
                    <KilimText
                      as="h2"
                      text={`${no} · ${cat.category}`}
                      fg={WOOL.saffron}
                    />
                    <ol className="klm-cmd-key">
                      {cat.items.map((cmd, i) => (
                        <li key={cmd.commandId}>
                          <button
                            type="button"
                            className="klm-cmd-entry"
                            onClick={() => triggerCommand(cmd.commandId)}
                            aria-label={`Run ${cmd.title}`}
                          >
                            <KilimBadge seed={cmd.commandId} size={9} />
                            <span className="klm-cmd-code" aria-hidden="true">
                              {no}.{String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="klm-cmd-text">
                              <span className="klm-cmd-title">{cmd.title}</span>
                              {cmd.description && (
                                <span className="klm-cmd-desc">
                                  {cmd.description}
                                </span>
                              )}
                            </span>
                            <span className="klm-cmd-run" aria-hidden="true">
                              Run →
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        <div className="klm-cmd-foot">
          <span className="klm-label">Shortcuts · {total} commands</span>
          <span className="klm-label klm-cmd-summon">
            Summon anywhere <kbd className="klm-kbd">⌘</kbd>
            <kbd className="klm-kbd">K</kbd>
          </span>
        </div>
      </div>
      <KilimBand pattern={['stripe', 'teeth', 'stripe']} />
    </div>
  );
};

export default KilimCommandsPage;
