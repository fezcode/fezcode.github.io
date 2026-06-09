import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';
import { MistOrb, MistHorizon } from './mist';

const categoryToneMap = {
  page: 'text-[#5F837B] bg-[#5F837B]/10',
  command: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  post: 'text-[#5F837B] bg-[#5F837B]/10',
  project: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  log: 'text-[#5C6B67] bg-[#5C6B67]/10',
  app: 'text-[#5F837B] bg-[#5F837B]/10',
  story: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  notebook: 'text-[#5C6B67] bg-[#5C6B67]/10',
};

const getCategoryTone = (type) =>
  categoryToneMap[type] || 'text-[#5C6B67] bg-[#5C6B67]/10';

const Key = ({ children }) => (
  <kbd className="px-1.5 py-0.5 bg-white/70 rounded-md shadow-[0_1px_3px_rgba(60,72,69,0.12)] text-[#3C4845] font-ibm-plex-mono lowercase">
    {children}
  </kbd>
);

const MistCommandPalette = ({
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#DFE5E3]/60 backdrop-blur-sm z-[1000] flex items-start justify-center pt-16 md:pt-32"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white/80 backdrop-blur-md text-[#3C4845] rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)] w-full max-w-2xl mx-4 overflow-hidden selection:bg-[#8FA8BC]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center gap-4">
              <MistOrb size={32} />
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isLoading ? 'condensing index…' : 'search the fog…'
                }
                className="w-full bg-transparent text-xl md:text-2xl font-instr-serif italic placeholder-[#8A9894]/70 focus:outline-none text-[#3C4845]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <MistHorizon />

            <div
              ref={resultsRef}
              className="max-h-[50vh] overflow-y-auto scrollbar-hide"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.slug || item.commandId}-${index}`}
                    className={`relative px-6 py-4 cursor-pointer flex justify-between items-center transition-all duration-[250ms] ${
                      selectedIndex === index
                        ? 'bg-[#8FA8BC]/15 translate-x-1'
                        : 'hover:bg-[#8FA8BC]/10'
                    }`}
                    onClick={() => handleItemClick(item)}
                    onMouseMove={() => setSelectedIndex(index)}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-opacity duration-[250ms] ${
                        selectedIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background:
                          'linear-gradient(180deg, transparent, rgba(95,131,123,0.65), transparent)',
                      }}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className={`text-lg font-instr-serif leading-snug ${
                          selectedIndex === index
                            ? 'italic text-[#3C4845]'
                            : 'text-[#5C6B67]'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-[10px] font-ibm-plex-mono lowercase tracking-[0.16em] text-[#8A9894] truncate max-w-md">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <span
                      className={`flex-shrink-0 px-2.5 py-0.5 text-[9px] font-ibm-plex-mono lowercase tracking-[0.2em] rounded-full ${getCategoryTone(item.type)}`}
                    >
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="font-ibm-plex-mono text-sm text-[#5C6B67] lowercase tracking-[0.22em]">
                    {isLoading
                      ? 'condensing index…'
                      : `nothing surfaced for "${searchTerm}"`}
                  </p>
                  {!isLoading && (
                    <p className="mt-2 font-ibm-plex-mono text-[9px] text-[#8A9894] lowercase tracking-[0.22em]">
                      visibility: low
                    </p>
                  )}
                </div>
              )}
            </div>

            <MistHorizon />

            <div className="p-4 bg-[#E5EBE9]/60 flex items-center justify-between text-[10px] font-ibm-plex-mono lowercase tracking-[0.2em]">
              <div className="flex items-center gap-6 text-[#5C6B67]">
                <div className="flex items-center gap-2">
                  <Key>esc</Key>
                  <span>close</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <Key>↑</Key>
                    <Key>↓</Key>
                  </div>
                  <span>drift</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key>↵</Key>
                  <span>settle</span>
                </div>
              </div>

              <div className="text-[#5F837B] flex items-center gap-2">
                <span className="h-1 w-1 bg-[#8FA8BC] rounded-full animate-pulse" />
                mist
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MistCommandPalette;
