import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import { MarquetryText, MarquetryIcon, MarquetryBand, WOOD } from './marquetry';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Marquetry.css';

const MarquetryCommandPalette = ({
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
    if (isOpen && !isLoading) inputRef.current?.focus();
  }, [isOpen, isLoading]);

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
      className="mqt-overlay"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="mqt-modal flex flex-col"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <MarquetryBand pattern="peerie" />
        <div className="flex items-center gap-3 px-4 py-3 mqt-wool-bark">
          <MarquetryIcon name="search" fg={WOOD.gold} />
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search commands and pages"
            aria-controls="marquetry-command-results"
            aria-expanded={isOpen}
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `marquetry-command-${selectedIndex}`
                : undefined
            }
            type="text"
            placeholder={
              isLoading
                ? 'Opening the index…'
                : 'Find a page, instrument, or command…'
            }
            className="mqt-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="mqt-btn mqt-btn-icon shrink-0"
            onClick={handleClose}
            aria-label="Close command palette"
          >
            <MarquetryIcon name="close" fg={WOOD.ink} />
          </button>
        </div>
        <div
          ref={resultsRef}
          role="listbox"
          id="marquetry-command-results"
          aria-label="Search results"
          className="overflow-y-auto p-2"
          style={{ maxHeight: '50vh' }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const selected = selectedIndex === index;
              return (
                <div
                  key={`${item.type}-${item.slug || item.commandId}-${index}`}
                  className={`mqt-palette-item ${selected ? 'mqt-wool-gold' : ''}`}
                  onClick={() => handleItemClick(item)}
                  onMouseMove={() => setSelectedIndex(index)}
                  id={`marquetry-command-${index}`}
                  aria-selected={selected}
                  role="option"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="mqt-palette-title truncate">
                      {item.title}
                    </span>
                    {item.description && (
                      <span
                        className="truncate text-xs mt-1"
                        style={{ color: 'var(--mqt-ink-muted)' }}
                      >
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span className="mqt-tag shrink-0">{item.type}</span>
                </div>
              );
            })
          ) : (
            <p className="mqt-notice text-center">
              {isLoading
                ? 'Opening the index…'
                : `No results for “${searchTerm}”`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 mqt-wool-bark">
          <div className="flex items-center gap-4">
            <span className="mqt-label">
              <kbd className="mqt-kbd">ESC</kbd> close
            </span>
            <span className="mqt-label">
              <kbd className="mqt-kbd">↑</kbd> <kbd className="mqt-kbd">↓</kbd>{' '}
              move
            </span>
            <span className="mqt-label">
              <kbd className="mqt-kbd">↵</kbd> open
            </span>
          </div>
          <MarquetryText text="Marquetry" size="small" fg={WOOD.wheat} fit />
        </div>
        <MarquetryBand pattern="peerie" />
      </div>
    </div>
  );
};

export default MarquetryCommandPalette;
