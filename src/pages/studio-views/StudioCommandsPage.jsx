import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import { StudioFolio, StudioNotice, StudioRule } from '../../components/studio';
import '../../styles/Studio.css';

const CommandRow = ({ command, defIndex, onInvoke }) => (
  <li>
    <button
      type="button"
      className="std-row-link w-full text-left"
      onClick={() => onInvoke(command.commandId)}
    >
      <span className="std-rank">{String(defIndex).padStart(2, '0')}</span>
      <span className="font-bold whitespace-nowrap">{command.title}</span>
      {command.description && (
        <span
          className="std-muted hidden md:block flex-1 min-w-0 truncate"
          style={{
            textTransform: 'none',
            letterSpacing: 0,
            fontSize: '0.8rem',
          }}
        >
          {command.description}
        </span>
      )}
      <span className="std-leader md:hidden" aria-hidden="true" />
      <span className="std-accent whitespace-nowrap ml-auto md:ml-0">
        RUN →
      </span>
    </button>
  </li>
);

const StudioCommandsPage = () => {
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

  // Running entry count across every section.
  let defCounter = 0;

  return (
    <div className="std-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <div className="std-page">
        <StudioFolio
          folio="FOLIO NO. 09 — PROTOCOL"
          title="COMMANDS"
          sub="EVERY VERB THE CODEX ANSWERS TO"
          aside={
            <button
              type="button"
              className="std-btn std-btn-accent"
              onClick={togglePalette}
            >
              OPEN PALETTE [⌘K]
            </button>
          }
        >
          <p className="std-stats mt-3">
            <span>
              <strong>{String(total).padStart(2, '0')}</strong> DEFINED
            </span>
            <span>
              <strong>{String(commandsData.length).padStart(2, '0')}</strong>{' '}
              SECTIONS
            </span>
            <span>
              INVOCATION <strong>⌘ / CTRL + K</strong>
            </span>
          </p>
        </StudioFolio>

        <div className="mb-6">
          <input
            className="std-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a command…"
            aria-label="Search commands"
          />
          {query && (
            <p className="std-label mt-2">
              {String(shown).padStart(2, '0')} OF{' '}
              {String(total).padStart(2, '0')} COMMANDS MATCH
            </p>
          )}
        </div>

        {filtered.length === 0 && (
          <StudioNotice>No commands match this search.</StudioNotice>
        )}

        {filtered.map((cat, catIdx) => (
          <section key={cat.category} className={catIdx === 0 ? '' : 'mt-10'}>
            <StudioRule
              label={`${String(catIdx + 1).padStart(2, '0')} · ${cat.category}`}
              className="mb-2"
            />
            <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
              {cat.items.map((cmd) => {
                defCounter += 1;
                return (
                  <CommandRow
                    key={cmd.commandId}
                    command={cmd}
                    defIndex={defCounter}
                    onInvoke={triggerCommand}
                  />
                );
              })}
            </ol>
          </section>
        ))}

        <footer className="mt-12">
          <StudioRule className="mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="std-label">
              SHORTCUTS · {String(total).padStart(2, '0')} COMMANDS
            </span>
            <span className="std-label inline-flex items-baseline gap-2">
              SUMMON ANYWHERE
              <kbd className="std-kbd">⌘</kbd>
              <kbd className="std-kbd">K</kbd>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudioCommandsPage;
