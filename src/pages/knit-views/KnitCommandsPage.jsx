import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitBand,
  KnitNotice,
  YARN,
} from '../../components/knit';
import '../../styles/Knit.css';

const SECTION_BANDS = ['zigzag', 'checks', 'lice', 'hearts'];

const KnitCommandsPage = () => {
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
    <div className="knt-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <KnitHero
        eyebrow={`${total} commands · ${commandsData.length} sections · ⌘ / ctrl + k`}
        title="Commands"
        intro="Every verb the codex answers to. Run one here, or summon the palette anywhere."
        wool="ink"
        motif="diamonds"
      >
        <div className="flex flex-wrap gap-3 mt-6">
          <button type="button" className="knt-btn knt-btn-gold" onClick={togglePalette}>
            <KnitIcon name="command" fg={YARN.peat} />
            <KnitText text="Open palette" size="small" fg={YARN.peat} fit />
          </button>
        </div>
      </KnitHero>
      <div className="knt-page">
        <input
          className="knt-input max-w-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a command…"
          aria-label="Search commands"
        />
        {query && (
          <p className="knt-label mt-2">
            {shown} of {total} commands match
          </p>
        )}
        {filtered.length === 0 && (
          <KnitNotice>No commands match this search.</KnitNotice>
        )}
        {filtered.map((cat, catIdx) => (
          <section key={cat.category} className="knt-section">
            <div className="knt-section-head !mb-3">
              <KnitText
                as="h2"
                text={`${String(catIdx + 1).padStart(2, '0')} · ${cat.category}`}
                fg={YARN.gold}
              />
            </div>
            <KnitBand
              pattern={SECTION_BANDS[catIdx % SECTION_BANDS.length]}
              className="mb-4 rounded"
            />
            <ol className="list-none m-0 p-0 grid gap-2 md:grid-cols-2">
              {cat.items.map((cmd) => (
                <li key={cmd.commandId}>
                  <button
                    type="button"
                    className="knt-row w-full text-left !mb-0 h-full"
                    onClick={() => triggerCommand(cmd.commandId)}
                    aria-label={`Run ${cmd.title}`}
                  >
                    <div className="knt-row-body">
                      <KnitText text={cmd.title} fg={YARN.cream} maxLines={2} />
                      {cmd.description && (
                        <p className="knt-muted text-sm mt-2">{cmd.description}</p>
                      )}
                    </div>
                    <KnitText text="Run" size="small" fg={YARN.gold} fit />
                    <KnitIcon name="arrowRight" fg={YARN.gold} />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-12">
          <span className="knt-label">Shortcuts · {total} commands</span>
          <span className="knt-label inline-flex items-center gap-2">
            Summon anywhere <kbd className="knt-kbd">⌘</kbd>
            <kbd className="knt-kbd">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

export default KnitCommandsPage;
