import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useSearchableData from '../hooks/useSearchableData';
import { useAchievements } from '../context/AchievementContext';
import { TerminalWindowIcon } from '@phosphor-icons/react';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { filterItems } from '../utils/search';
import { useCommandRegistry } from '../hooks/useCommandRegistry';

const categoryColorMap = {
  page: 'bg-red-400',
  command: 'bg-amber-400',
  post: 'bg-blue-400',
  project: 'bg-orange-400',
  log: 'bg-rose-400',
  app: 'bg-teal-400',
  story: 'bg-violet-400',
  notebook: 'bg-lime-400',
};

const getCategoryColorClass = (type) => {
  return categoryColorMap[type] || 'bg-gray-500';
};

const BrutalistCommandPalette = ({
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-start justify-center pt-16 md:pt-32 "
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-[#050505] text-white rounded-sm border border-white/10 shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Search */}
            <div className="p-6 flex items-center gap-4 bg-white/[0.02]">
              <TerminalWindowIcon
                size={32}
                weight="fill"
                className="text-emerald-500"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isLoading
                    ? 'Initialising Data...'
                    : 'Search registry...'
                }
                className="w-full bg-transparent text-xl md:text-2xl font-light placeholder-gray-700 focus:outline-none font-mono uppercase tracking-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Results Section */}
            <div
              ref={resultsRef}
              className="border-t border-white/10 max-h-[50vh] overflow-y-auto scrollbar-hide bg-black/20"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.slug || item.commandId}-${index}`}
                    className={`px-6 py-4 cursor-pointer flex justify-between items-center transition-all duration-200 border-l-2 ${
                      selectedIndex === index
                        ? 'bg-white/10 border-emerald-500 translate-x-1'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                    onClick={() => handleItemClick(item)}
                    onMouseMove={() => setSelectedIndex(index)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-lg font-medium tracking-tight ${selectedIndex === index ? 'text-white' : 'text-gray-400'}`}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600 truncate max-w-md">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-black ${getCategoryColorClass(item.type)} rounded-sm`}
                    >
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="font-mono text-sm text-gray-600 uppercase tracking-widest">
                    {isLoading
                      ? 'Fetching Registry...'
                      : `No matches found for "${searchTerm}"`}
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div className="border-t border-white/10 p-4 bg-white/[0.02] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">
                    ESC
                  </kbd>
                  <span>Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">
                      ↓
                    </kbd>
                  </div>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
              </div>

              <div className="font-bold text-gray-400 flex items-center gap-2">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                Fez<span className="text-white">codex</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrutalistCommandPalette;
