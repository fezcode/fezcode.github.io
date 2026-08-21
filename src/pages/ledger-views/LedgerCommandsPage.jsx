import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * Ledger view of the command registry — the PROTOCOL folio. Every verb the
 * codex answers to, filed by section and numbered straight through, each row
 * inverting on hover the way a ledger line takes ink. ⌘K opens the palette
 * from anywhere on the page.
 */
const CommandRow = ({ command, defIndex, onInvoke }) => (
  <li>
    <button
      type="button"
      className="ldg-row-link w-full text-left"
      onClick={() => onInvoke(command.commandId)}
    >
      <span className="ldg-rank">{String(defIndex).padStart(2, '0')}</span>
      <span className="font-bold whitespace-nowrap">{command.title}</span>
      {command.description && (
        <span
          className="ldg-muted hidden md:block flex-1 min-w-0 truncate"
          style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}
        >
          {command.description}
        </span>
      )}
      <span className="ldg-leader md:hidden" aria-hidden="true" />
      <span className="ldg-accent whitespace-nowrap ml-auto md:ml-0">
        RUN →
      </span>
    </button>
  </li>
);

const LedgerCommandsPage = () => {
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

  // Running entry number across every section, like a ledger's line count.
  let defCounter = 0;

  return (
    <div className="ldg-root">
      <Seo
        title="Commands | Fezcodex"
        description="The protocol — every verb the codex answers to, filed and numbered."
      />
      <div className="ldg-page">
        <LedgerFolio
          folio="FOLIO NO. 09 — PROTOCOL"
          title="COMMANDS"
          sub="EVERY VERB THE CODEX ANSWERS TO"
          aside={
            <button
              type="button"
              className="ldg-btn ldg-btn-accent"
              onClick={togglePalette}
            >
              OPEN PALETTE [⌘K]
            </button>
          }
        >
          <p className="ldg-stats mt-3">
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
        </LedgerFolio>

        <div className="mb-6">
          <input
            className="ldg-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH THE PROTOCOL…"
            aria-label="Search commands"
          />
          {query && (
            <p className="ldg-label mt-2">
              {String(shown).padStart(2, '0')} OF{' '}
              {String(total).padStart(2, '0')} VERBS MATCH
            </p>
          )}
        </div>

        {filtered.length === 0 && (
          <LedgerNotice>NO VERB ANSWERS TO THAT QUERY</LedgerNotice>
        )}

        {filtered.map((cat, catIdx) => (
          <section key={cat.category} className={catIdx === 0 ? '' : 'mt-10'}>
            <LedgerRule
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
          <LedgerRule className="mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="ldg-label">
              PROTOCOL · {String(total).padStart(2, '0')} VERBS ON RECORD
            </span>
            <span className="ldg-label inline-flex items-baseline gap-2">
              SUMMON ANYWHERE
              <kbd className="ldg-kbd">⌘</kbd>
              <kbd className="ldg-kbd">K</kbd>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LedgerCommandsPage;
