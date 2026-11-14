import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppWindowIcon,
  ArticleIcon,
  BrowserIcon,
  CircleIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  NotebookIcon,
  TerminalWindowIcon,
} from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import { BlissWindow, BlissIcon } from './bliss';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Bliss.css';

/* Each result type: its group heading and its icon tile. */
const TYPES = {
  page: { label: 'Pages', icon: BrowserIcon, tone: 'blue' },
  command: { label: 'Commands', icon: TerminalWindowIcon, tone: 'graphite' },
  post: { label: 'Writing', icon: ArticleIcon, tone: 'orange' },
  project: { label: 'Projects', icon: CubeIcon, tone: 'purple' },
  log: { label: 'Logs', icon: NotebookIcon, tone: 'teal' },
  app: { label: 'Apps', icon: AppWindowIcon, tone: 'green' },
};
const typeInfo = (type) =>
  TYPES[type] || { label: type || 'Other', icon: CircleIcon, tone: 'pink' };

/* Consecutive runs of the same type, keeping each item's flat index so
   arrow-key selection still walks the list in visual order. */
const groupRuns = (list) =>
  list.reduce((runs, item, index) => {
    const last = runs[runs.length - 1];
    if (last && last.type === item.type) {
      last.entries.push({ item, index });
    } else {
      runs.push({ type: item.type, start: index, entries: [{ item, index }] });
    }
    return runs;
  }, []);

const BlissCommandPalette = ({
  isOpen,
  setIsOpen,
  openGenericModal,
  toggleDigitalRain,
  toggleBSOD,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { items, isLoading } = useSearchableData();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const { unlockAchievement } = useAchievements();
  const { setTriggerCommand } = useCommandPalette();

  const { executeCommand } = useCommandRegistry({
    openGenericModal,
    toggleDigitalRain,
    toggleBSOD,
    items,
  });

  const filteredItems = filterItems(items, searchTerm);

  useEffect(() => {
    if (isOpen) {
      unlockAchievement('the_hacker');
    }
  }, [isOpen, unlockAchievement]);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    if (lowerTerm === 'hello?' || lowerTerm === 'is anyone there?') {
      unlockAchievement('echo_in_the_void');
    }
    if (lowerTerm === 'command palette' || lowerTerm === 'the hacker') {
      unlockAchievement('the_paradox');
    }
    if (lowerTerm === '0028:c0de1337') {
      unlockAchievement('code_1337');
    }
  }, [searchTerm, unlockAchievement]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, items]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, [setIsOpen]);

  const dialogRef = useOrbitDialog(isOpen, handleClose);

  const triggerBSOD = useCallback(() => {
    unlockAchievement('bsod');
    toggleBSOD();
  }, [unlockAchievement, toggleBSOD]);

  useEffect(() => {
    setTriggerCommand(() => executeCommand);
  }, [setTriggerCommand, executeCommand]);

  const handleItemClick = useCallback(
    (item) => {
      if (!item) return;
      if (item.type === 'command') {
        executeCommand(item.commandId);
      } else {
        navigate(item.path);
      }
      handleClose();
    },
    [executeCommand, navigate, handleClose],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, filteredItems.length - 1) : prev - 1,
        );
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev >= filteredItems.length - 1 ? 0 : prev + 1,
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (searchTerm.toLowerCase() === 'bsod') {
          triggerBSOD();
          handleClose();
        } else if (filteredItems[selectedIndex]) {
          handleItemClick(filteredItems[selectedIndex]);
        }
      } else if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === 'PageUp') {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 10));
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          Math.max(0, Math.min(filteredItems.length - 1, prev + 10)),
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    filteredItems,
    selectedIndex,
    searchTerm,
    triggerBSOD,
    handleItemClick,
    handleClose,
  ]);

  useEffect(() => {
    const selectedItem = resultsRef.current?.querySelector(
      `#bliss-command-${selectedIndex}`,
    );
    if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="bl-overlay"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="bl-modal"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <BlissWindow
          as="div"
          title="Run"
          icon={MagnifyingGlassIcon}
          tone="green"
          headingLevel={2}
          onClose={handleClose}
          flush
          status={
            <>
              <span className="flex items-center gap-3">
                <span>
                  <kbd className="bl-kbd">Esc</kbd> close
                </span>
                <span>
                  <kbd className="bl-kbd">↑</kbd> <kbd className="bl-kbd">↓</kbd>{' '}
                  move
                </span>
                <span>
                  <kbd className="bl-kbd">↵</kbd> open
                </span>
              </span>
              <span>Command palette</span>
            </>
          }
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <label htmlFor="bliss-command-input" className="bl-label shrink-0">
              Open:
            </label>
            <input
              id="bliss-command-input"
              ref={inputRef}
              role="combobox"
              aria-label="Search commands and pages"
              aria-controls="bliss-command-results"
              aria-expanded={isOpen}
              aria-activedescendant={
                filteredItems[selectedIndex]
                  ? `bliss-command-${selectedIndex}`
                  : undefined
              }
              type="text"
              placeholder={
                isLoading
                  ? 'Loading the index…'
                  : 'Find a page, instrument, or command…'
              }
              className="bl-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div
            ref={resultsRef}
            role="listbox"
            id="bliss-command-results"
            aria-label="Search results"
            className="overflow-y-auto mx-4 mb-4 p-1"
            style={{
              maxHeight: '50vh',
              background: 'var(--bl-paper)',
              border: '1px solid #7f9db9',
            }}
          >
            {filteredItems.length > 0 ? (
              groupRuns(filteredItems).map((run) => {
                const group = typeInfo(run.type);
                const headingId = `bliss-command-group-${run.start}`;
                return (
                  <div
                    key={`${run.type}-${run.start}`}
                    role="group"
                    aria-labelledby={headingId}
                  >
                    <div
                      id={headingId}
                      className="bl-label px-2 pt-2 pb-1"
                    >
                      {group.label}
                    </div>
                    {run.entries.map(({ item, index }) => {
                      const selected = selectedIndex === index;
                      return (
                        <div
                          key={`${item.type}-${item.slug || item.commandId}-${index}`}
                          className="bl-palette-item"
                          onClick={() => handleItemClick(item)}
                          onMouseMove={() => setSelectedIndex(index)}
                          id={`bliss-command-${index}`}
                          aria-selected={selected}
                          role="option"
                        >
                          <BlissIcon
                            icon={group.icon}
                            tone={group.tone}
                            size={26}
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate font-semibold">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="bl-meta truncate text-xs">
                                {item.description}
                              </span>
                            )}
                          </div>
                          <span className="bl-tag shrink-0">{item.type}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <p className="bl-notice m-2 justify-center">
                {isLoading
                  ? 'Loading the index…'
                  : `No results for “${searchTerm}”`}
              </p>
            )}
          </div>
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissCommandPalette;
