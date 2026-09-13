import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import { OrbitFolio, OrbitNotice, OrbitRule } from '../../components/orbit';
import '../../styles/Orbit.css';

const CommandRow = ({ command, defIndex, onInvoke }) => (
  <li>
    <button
      type="button"
      className="orb-row-link w-full text-left"
      onClick={() => onInvoke(command.commandId)}
    >
      <span className="orb-rank">{String(defIndex).padStart(2, '0')}</span>
      <span className="font-bold whitespace-nowrap">{command.title}</span>
      {command.description && (
        <span
          className="orb-muted hidden md:block flex-1 min-w-0 truncate"
          style={{
            textTransform: 'none',
            letterSpacing: 0,
            fontSize: '0.8rem',
          }}
        >
          {command.description}
        </span>
      )}
      <span className="orb-leader md:hidden" aria-hidden="true" />
      <span className="orb-accent whitespace-nowrap ml-auto md:ml-0">
        RUN →
      </span>
    </button>
  </li>
);

const OrbitCommandsPage = () => {
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

  // Running entry number across every section, like a orbit's line count.
  let defCounter = 0;

  return (
    <div className="orb-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <div className="orb-page">
        <OrbitFolio
          folio="FOLIO NO. 09 — PROTOCOL"
          title="COMMANDS"
          sub="EVERY VERB THE CODEX ANSWERS TO"
          aside={
            <button
              type="button"
              className="orb-btn orb-btn-accent"
              onClick={togglePalette}
            >
              OPEN PALETTE [⌘K]
            </button>
          }
        >
          <p className="orb-stats mt-3">
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
        </OrbitFolio>

        <div className="mb-6">
          <input
            className="orb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a command…"
            aria-label="Search commands"
          />
          {query && (
            <p className="orb-label mt-2">
              {String(shown).padStart(2, '0')} OF{' '}
              {String(total).padStart(2, '0')} COMMANDS MATCH
            </p>
          )}
        </div>

        {filtered.length === 0 && (
          <OrbitNotice>No commands match this search.</OrbitNotice>
        )}

        {filtered.map((cat, catIdx) => (
          <section key={cat.category} className={catIdx === 0 ? '' : 'mt-10'}>
            <OrbitRule
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
          <OrbitRule className="mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="orb-label">
              SHORTCUTS · {String(total).padStart(2, '0')} COMMANDS
            </span>
            <span className="orb-label inline-flex items-baseline gap-2">
              SUMMON ANYWHERE
              <kbd className="orb-kbd">⌘</kbd>
              <kbd className="orb-kbd">K</kbd>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OrbitCommandsPage;
