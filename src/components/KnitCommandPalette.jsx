import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import { KnitText, KnitIcon, KnitBand, YARN } from './knit';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Knit.css';

const KnitCommandPalette = ({
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
      className="knt-overlay"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="knt-modal flex flex-col"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <KnitBand pattern="peerie" />
        <div className="flex items-center gap-3 px-4 py-3 knt-wool-bark">
          <KnitIcon name="search" fg={YARN.gold} />
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search commands and pages"
            aria-controls="knit-command-results"
            aria-expanded={isOpen}
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `knit-command-${selectedIndex}`
                : undefined
            }
            type="text"
            placeholder={
              isLoading
                ? 'Winding the index…'
                : 'Find a page, instrument, or command…'
            }
            className="knt-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div
          ref={resultsRef}
          role="listbox"
          id="knit-command-results"
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
                  className={`knt-palette-item ${selected ? 'knt-wool-gold' : ''}`}
                  onClick={() => handleItemClick(item)}
                  onMouseMove={() => setSelectedIndex(index)}
                  id={`knit-command-${index}`}
                  aria-selected={selected}
                  role="option"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <KnitText
                      text={item.title}
                      size="small"
                      fg={selected ? YARN.peat : YARN.cream}
                      maxLines={1}
                    />
                    {item.description && (
                      <span
                        className="truncate text-xs mt-1"
                        style={{ color: selected ? '#182b4a' : 'var(--knt-muted)' }}
                      >
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span className="knt-tag shrink-0">{item.type}</span>
                </div>
              );
            })
          ) : (
            <p className="knt-notice text-center">
              {isLoading
                ? 'Winding the index…'
                : `No results for “${searchTerm}”`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 knt-wool-bark">
          <div className="flex items-center gap-4">
            <span className="knt-label">
              <kbd className="knt-kbd">ESC</kbd> close
            </span>
            <span className="knt-label">
              <kbd className="knt-kbd">↑</kbd> <kbd className="knt-kbd">↓</kbd>{' '}
              move
            </span>
            <span className="knt-label">
              <kbd className="knt-kbd">↵</kbd> open
            </span>
          </div>
          <KnitText text="Knit" size="small" fg={YARN.wheat} fit />
        </div>
        <KnitBand pattern="peerie" />
      </div>
    </div>
  );
};

export default KnitCommandPalette;
