import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { TerminalWindowIcon } from '@phosphor-icons/react';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';

const luxeCategoryColors = {
  page: 'text-red-600 bg-red-50',
  command: 'text-amber-600 bg-amber-50',
  post: 'text-blue-600 bg-blue-50',
  project: 'text-orange-600 bg-orange-50',
  log: 'text-rose-600 bg-rose-50',
  app: 'text-teal-600 bg-teal-50',
  story: 'text-violet-600 bg-violet-50',
  notebook: 'text-lime-600 bg-lime-50',
};

const getCategoryColorClass = (type) => {
  return luxeCategoryColors[type] || 'text-gray-600 bg-gray-50';
};

const LuxeCommandPalette = ({
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
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1,
        );
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1,
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
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 10,
        );
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex >= filteredItems.length - 10 ? 0 : prevIndex + 10,
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
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#F5F5F0]/90 backdrop-blur-md z-[1000] flex items-start justify-center pt-16 md:pt-32"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white border border-black/5 shadow-2xl w-full max-w-2xl mx-4 overflow-hidden rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Search */}
            <div className="p-6 flex items-center gap-4 bg-[#FAFAF8] border-b border-black/5">
              <TerminalWindowIcon
                size={32}
                weight="light"
                className="text-[#8D4004]"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isLoading
                    ? 'Synchronizing Registry...'
                    : 'Search directory...'
                }
                className="w-full bg-transparent text-xl md:text-2xl font-playfairDisplay italic focus:outline-none text-[#1A1A1A] placeholder-[#1A1A1A]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Results Section */}
            <div
              ref={resultsRef}
              className="max-h-[50vh] overflow-y-auto scrollbar-hide bg-white"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.slug || item.commandId}-${index}`}
                    className={`px-6 py-4 cursor-pointer flex justify-between items-center transition-all duration-200 border-l-2 ${
                      selectedIndex === index
                        ? 'bg-[#F5F5F0] border-[#8D4004] translate-x-1'
                        : 'hover:bg-black/5 border-transparent'
                    }`}
                    onClick={() => handleItemClick(item)}
                    onMouseMove={() => setSelectedIndex(index)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-lg font-medium tracking-tight ${selectedIndex === index ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-[10px] font-outfit uppercase tracking-widest text-black/30 truncate max-w-md">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-outfit font-bold uppercase tracking-widest rounded-sm shadow-sm ${getCategoryColorClass(item.type)}`}
                    >
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="font-playfairDisplay italic text-[#1A1A1A]/30 text-sm">
                    {isLoading
                      ? 'Fetching Registry...'
                      : `No results found for "${searchTerm}"`}
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div className="border-t border-black/5 p-4 bg-[#FAFAF8] flex items-center justify-between text-[10px] font-outfit uppercase tracking-[0.2em] text-[#1A1A1A]/40">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-black/10 text-black">
                    ESC
                  </kbd>
                  <span>Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-black/10 text-black">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-black/10 text-black">
                      ↓
                    </kbd>
                  </div>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-black/10 text-black">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
              </div>

              <div className="font-playfairDisplay italic text-black/20 flex items-center gap-2">
                <span className="h-1 w-1 bg-[#8D4004] rounded-full animate-pulse" />
                Fezcodex
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LuxeCommandPalette;
