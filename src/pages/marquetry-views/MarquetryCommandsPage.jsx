import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryBand,
  MarquetryNotice,
  WOOD,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const SECTION_BANDS = ['zigzag', 'checks', 'lice', 'hearts'];

const MarquetryCommandsPage = () => {
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

  return (
    <div className="mqt-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <MarquetryHero
        eyebrow={`${total} commands · ${commandsData.length} sections · ⌘ / ctrl + k`}
        title="Commands"
        intro="Every verb the codex answers to. Run one here, or summon the palette anywhere."
      >
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            className="mqt-btn mqt-btn-gold"
            onClick={togglePalette}
          >
            <MarquetryIcon name="command" fg={WOOD.peat} />
            <MarquetryText
              text="Open palette"
              size="small"
              fg={WOOD.peat}
              fit
            />
          </button>
        </div>
      </MarquetryHero>
      <div className="mqt-page">
        <input
          className="mqt-input max-w-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a command…"
          aria-label="Search commands"
        />
        {query && (
          <p className="mqt-label mt-2">
            {shown} of {total} commands match
          </p>
        )}
        {filtered.length === 0 && (
          <MarquetryNotice>No commands match this search.</MarquetryNotice>
        )}
        {filtered.map((cat, catIdx) => (
          <section key={cat.category} className="mqt-section">
            <div className="mqt-section-head !mb-3">
              <MarquetryText
                as="h2"
                text={`${String(catIdx + 1).padStart(2, '0')} · ${cat.category}`}
                fg={WOOD.teal}
              />
            </div>
            <MarquetryBand
              pattern={SECTION_BANDS[catIdx % SECTION_BANDS.length]}
              className="mb-4 rounded"
            />
            <ol className="list-none m-0 p-0 grid gap-2 md:grid-cols-2">
              {cat.items.map((cmd) => (
                <li key={cmd.commandId}>
                  <button
                    type="button"
                    className="mqt-row w-full text-left !mb-0 h-full"
                    onClick={() => triggerCommand(cmd.commandId)}
                    aria-label={`Run ${cmd.title}`}
                  >
                    <div className="mqt-row-body">
                      <MarquetryText
                        text={cmd.title}
                        fg={WOOD.ink}
                        maxLines={2}
                      />
                      {cmd.description && (
                        <p className="mqt-muted text-sm mt-2">
                          {cmd.description}
                        </p>
                      )}
                    </div>
                    <MarquetryText text="Run" size="small" fg={WOOD.teal} fit />
                    <MarquetryIcon name="arrowRight" fg={WOOD.teal} />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-12">
          <span className="mqt-label">Shortcuts · {total} commands</span>
          <span className="mqt-label inline-flex items-center gap-2">
            Summon anywhere <kbd className="mqt-kbd">⌘</kbd>
            <kbd className="mqt-kbd">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarquetryCommandsPage;
