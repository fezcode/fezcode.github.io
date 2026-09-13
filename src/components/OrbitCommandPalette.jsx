import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import '../styles/Orbit.css';
import useOrbitDialog from './orbit/useOrbitDialog';

const OrbitCommandPalette = ({
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
    const selectedItem = resultsRef.current?.children[selectedIndex];
    if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="orb-scrim"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="orb-modal"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* command slip header */}
        <div
          className="flex items-baseline gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-eyebrow shrink-0">Find</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search commands and pages"
            aria-controls="orbit-command-results"
            aria-expanded={isOpen}
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `orbit-command-${selectedIndex}`
                : undefined
            }
            type="text"
            placeholder={
              isLoading
                ? 'Opening the index…'
                : 'Find a page, instrument, or command…'
            }
            className="w-full bg-transparent focus:outline-none"
            style={{
              fontFamily: 'inherit',
              fontSize: '1rem',
              letterSpacing: '1px',
              color: 'var(--orb-highlight)',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* results ruled like orbit rows */}
        <div
          ref={resultsRef}
          role="listbox"
          id="orbit-command-results"
          aria-label="Search results"
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
                    background: selected ? 'var(--orb-accent)' : 'transparent',
                    color: selected ? 'var(--orb-bg)' : 'var(--orb-fg)',
                    borderBottom: '1px solid var(--orb-sunken)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseMove={() => setSelectedIndex(index)}
                  id={`orbit-command-${index}`}
                  aria-selected={selected}
                  role="option"
                >
                  <span
                    className="shrink-0 font-bold"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '0.72rem',
                      opacity: selected ? 0.8 : undefined,
                      color: selected ? 'inherit' : 'var(--orb-muted)',
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
                          color: selected ? 'inherit' : 'var(--orb-muted)',
                        }}
                      >
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span
                    className="orb-badge shrink-0"
                    style={
                      selected
                        ? { color: 'inherit', background: 'transparent' }
                        : undefined
                    }
                  >
                    {item.type}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="orb-label" style={{ margin: 0 }}>
                {isLoading
                  ? 'Opening the index…'
                  : `No results for "${searchTerm.toUpperCase()}"`}
              </p>
            </div>
          )}
        </div>

        {/* key orbit */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3"
          style={{ borderTop: '1px solid var(--orb-rule)' }}
        >
          <div className="flex items-baseline gap-4">
            <span className="orb-label">
              <kbd className="orb-kbd">ESC</kbd> CLOSE
            </span>
            <span className="orb-label">
              <kbd className="orb-kbd">↑</kbd> <kbd className="orb-kbd">↓</kbd>{' '}
              MOVE
            </span>
            <span className="orb-label">
              <kbd className="orb-kbd">↵</kbd> OPEN
            </span>
          </div>
          <span className="orb-eyebrow">ORBIT</span>
        </div>
      </div>
    </div>
  );
};

export default OrbitCommandPalette;
