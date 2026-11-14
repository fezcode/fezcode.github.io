import React, { useEffect, useMemo, useState } from 'react';
import {
  CaretRightIcon,
  CommandIcon,
  CompassIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  TerminalWindowIcon,
  WrenchIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
import { BlissWindow, BlissIcon, BlissNotice } from '../../components/bliss';
import '../../styles/Bliss.css';

/** One glyph + tone per section, cycling for any new sections. */
const SECTION_ICONS = [
  [CompassIcon, 'blue'],
  [TerminalWindowIcon, 'green'],
  [WrenchIcon, 'orange'],
  [PaletteIcon, 'purple'],
  [GearSixIcon, 'graphite'],
];

const BlissCommandsPage = () => {
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
    <div className="bl-root">
      <Seo
        title="Commands | Fezcodex"
        description="Shortcuts and commands for exploring and customizing Fezcodex."
      />
      <div className="bl-page">
        <BlissWindow
          title="Commands"
          icon={CommandIcon}
          tone="blue"
          headingLevel={1}
          status={
            <>
              <span>
                {query ? `${shown} of ${total}` : total} commands
              </span>
              <span>{commandsData.length} sections</span>
            </>
          }
        >
          <div className="flex flex-wrap items-start gap-4">
            <BlissIcon
              icon={CommandIcon}
              tone="blue"
              size={56}
              className="hidden sm:inline-flex"
            />
            <div className="min-w-0 flex-1">
              <p className="bl-eyebrow">
                {total} commands · {commandsData.length} sections · ⌘ / ctrl + k
              </p>
              <p className="bl-display mt-1" aria-hidden="true">
                Commands
              </p>
              <p className="bl-muted mt-2">
                Every verb the codex answers to. Run one here, or summon the
                palette anywhere.
              </p>
            </div>
            <button
              type="button"
              className="bl-btn bl-btn-primary"
              onClick={togglePalette}
            >
              <CommandIcon size={18} weight="bold" aria-hidden="true" />
              Open palette
            </button>
          </div>
          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Find</span>
            <label className="flex items-center gap-2 max-w-2xl">
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
                placeholder="Find a command…"
                aria-label="Search commands"
              />
            </label>
            {query && (
              <p className="bl-label mt-2" role="status">
                {shown} of {total} commands match
              </p>
            )}
          </div>
        </BlissWindow>

        {filtered.length === 0 && (
          <BlissWindow title="No results" icon={MagnifyingGlassIcon} inactive>
            <BlissNotice>No commands match this search.</BlissNotice>
          </BlissWindow>
        )}

        {filtered.map((cat, catIdx) => {
          const [glyph, tone] = SECTION_ICONS[catIdx % SECTION_ICONS.length];
          return (
            <BlissWindow
              key={cat.category}
              title={`${String(catIdx + 1).padStart(2, '0')} · ${cat.category}`}
              icon={glyph}
              tone={tone}
              flush
              status={
                <>
                  <span>
                    {cat.items.length}{' '}
                    {cat.items.length === 1 ? 'command' : 'commands'}
                  </span>
                  <span>{cat.category}</span>
                </>
              }
            >
              <ol className="list-none m-0 p-0 grid md:grid-cols-2">
                {cat.items.map((cmd) => (
                  <li
                    key={cmd.commandId}
                    className="flex border-b border-dotted border-[#a7a28c]"
                  >
                    <button
                      type="button"
                      className="bl-row w-full h-full text-left cursor-pointer"
                      onClick={() => triggerCommand(cmd.commandId)}
                      aria-label={`Run ${cmd.title}`}
                    >
                      <BlissIcon icon={glyph} tone={tone} size={28} />
                      <span className="bl-row-body">
                        <span className="bl-row-title">{cmd.title}</span>
                        {cmd.description && (
                          <span className="bl-meta">{cmd.description}</span>
                        )}
                      </span>
                      <span
                        className="bl-meta font-bold shrink-0"
                        aria-hidden="true"
                      >
                        Run
                      </span>
                      <CaretRightIcon
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ol>
            </BlissWindow>
          );
        })}

        <BlissWindow title="Shortcuts" icon={CommandIcon} tone="graphite" inactive>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bl-meta">Shortcuts · {total} commands</span>
            <span className="bl-meta inline-flex items-center gap-2">
              Summon anywhere <kbd className="bl-kbd">⌘</kbd>
              <kbd className="bl-kbd">K</kbd>
            </span>
          </div>
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissCommandsPage;
