import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import { KilimText, KilimIcon, KilimBand, WOOL } from './kilim';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Kilim.css';
import '../styles/kilim-chrome.css';

const KilimCommandPalette = ({
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
      className="klm-overlay"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="klm-modal"
        style={{ maxWidth: '680px', maxHeight: '86vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <KilimBand pattern="end" />
        <div className="klm-modal-head">
          <KilimText text="FIND" scale={1} fg={WOOL.saffron} fit />
          <span className="klm-label">Pages, instruments, commands</span>
        </div>
        <div className="klm-palette-input">
          <KilimIcon name="search" fg={WOOL.saffron} />
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search commands and pages"
            aria-controls="kilim-command-results"
            aria-expanded={isOpen}
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `kilim-command-${selectedIndex}`
                : undefined
            }
            type="text"
            placeholder={
              isLoading
                ? 'Winding the yarn…'
                : 'Find a page, instrument, or command…'
            }
            className="klm-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div
          ref={resultsRef}
          role="listbox"
          id="kilim-command-results"
          aria-label="Search results"
          className="klm-palette-list"
          style={{ maxHeight: '50vh' }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const selected = selectedIndex === index;
              return (
                <div
                  key={`${item.type}-${item.slug || item.commandId}-${index}`}
                  className="klm-palette-item"
                  onClick={() => handleItemClick(item)}
                  onMouseMove={() => setSelectedIndex(index)}
                  id={`kilim-command-${index}`}
                  aria-selected={selected}
                  role="option"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="klm-palette-title">{item.title}</span>
                    {item.description && (
                      <span className="klm-palette-desc">{item.description}</span>
                    )}
                  </div>
                  <span className="klm-tag shrink-0">{item.type}</span>
                </div>
              );
            })
          ) : (
            <p className="klm-notice text-center m-0">
              {isLoading
                ? 'Winding the yarn…'
                : `No results for “${searchTerm}”`}
            </p>
          )}
        </div>
        <div className="klm-modal-foot">
          <div className="klm-palette-keys">
            <span className="klm-label">
              <kbd className="klm-kbd">ESC</kbd> close
            </span>
            <span className="klm-label">
              <kbd className="klm-kbd">↑</kbd> <kbd className="klm-kbd">↓</kbd>{' '}
              move
            </span>
            <span className="klm-label">
              <kbd className="klm-kbd">↵</kbd> open
            </span>
          </div>
          <span className="klm-label">Kilim</span>
        </div>
        <KilimBand pattern="end" />
      </div>
    </div>
  );
};

export default KilimCommandPalette;
