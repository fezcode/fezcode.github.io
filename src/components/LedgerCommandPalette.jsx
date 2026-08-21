import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import '../styles/Ledger.css';

/**
 * Ledger theme command palette — the registrar's command slip. A double-ruled
 * frame over the page, one input line, and results written as ledger rows:
 * rank, title, dotted leader, classification badge. The selected row takes
 * the accent ink, exactly like a pressed chip.
 */
const LedgerCommandPalette = ({
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
      inputRef.current?.focus();
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
          prev === 0 ? filteredItems.length - 1 : prev - 1,
        );
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev === filteredItems.length - 1 ? 0 : prev + 1,
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
        setSelectedIndex((prev) =>
          prev <= 0 ? filteredItems.length - 1 : prev - 10,
        );
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev >= filteredItems.length - 10 ? 0 : prev + 10,
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
    const selectedItem = resultsRef.current?.children[selectedIndex];
    if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="ldg-scrim"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="ldg-modal"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* command slip header */}
        <div
          className="flex items-baseline gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-eyebrow shrink-0">CMD</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? 'OPENING THE INDEX…' : 'TYPE A COMMAND…'}
            className="w-full bg-transparent focus:outline-none"
            style={{
              fontFamily: 'inherit',
              fontSize: '1rem',
              letterSpacing: '1px',
              color: 'var(--ldg-highlight)',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* results ruled like ledger rows */}
        <div
          ref={resultsRef}
          className="overflow-y-auto"
          style={{ maxHeight: '50vh' }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const selected = selectedIndex === index;
              return (
                <div
                  key={`${item.type}-${item.slug || item.commandId}-${index}`}
                  className="flex items-baseline gap-3 px-5 py-2.5 cursor-pointer"
                  style={{
                    background: selected ? 'var(--ldg-accent)' : 'transparent',
                    color: selected ? 'var(--ldg-bg)' : 'var(--ldg-fg)',
                    borderBottom: '1px solid var(--ldg-sunken)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseMove={() => setSelectedIndex(index)}
                  aria-selected={selected}
                  role="option"
                >
                  <span
                    className="shrink-0 font-bold"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '0.72rem',
                      opacity: selected ? 0.8 : undefined,
                      color: selected ? 'inherit' : 'var(--ldg-muted)',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className="truncate font-bold uppercase"
                      style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                    >
                      {item.title}
                    </span>
                    {item.description && (
                      <span
                        className="truncate"
                        style={{
                          fontSize: '0.72rem',
                          opacity: selected ? 0.8 : undefined,
                          color: selected ? 'inherit' : 'var(--ldg-muted)',
                        }}
                      >
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span
                    className="ldg-badge shrink-0"
                    style={selected ? { color: 'inherit' } : undefined}
                  >
                    {item.type}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="ldg-label" style={{ margin: 0 }}>
                {isLoading
                  ? 'OPENING THE INDEX…'
                  : `NO ENTRY FILED UNDER "${searchTerm.toUpperCase()}"`}
              </p>
            </div>
          )}
        </div>

        {/* key ledger */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3"
          style={{ borderTop: '1px solid var(--ldg-rule)' }}
        >
          <div className="flex items-baseline gap-4">
            <span className="ldg-label">
              <kbd className="ldg-kbd">ESC</kbd> CLOSE
            </span>
            <span className="ldg-label">
              <kbd className="ldg-kbd">↑</kbd> <kbd className="ldg-kbd">↓</kbd>{' '}
              MOVE
            </span>
            <span className="ldg-label">
              <kbd className="ldg-kbd">↵</kbd> FILE
            </span>
          </div>
          <span className="ldg-eyebrow">LEDGER</span>
        </div>
      </div>
    </div>
  );
};

export default LedgerCommandPalette;
