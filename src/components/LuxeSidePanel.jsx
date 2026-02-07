import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, InfoIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';
import LuxeArt from './LuxeArt';

const LuxeSidePanel = () => {
  const {
    isOpen,
    closeSidePanel,
    panelTitle,
    panelContent,
    panelWidth,
    setPanelWidth,
  } = useSidePanel();
  const [isResizing, setIsResizing] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeSidePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidePanel]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 350 && newWidth < window.innerWidth * 0.85) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, setPanelWidth]);

  const variants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Luxe blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-[#F5F5F0]/80 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ type: 'spring', stiffness: 200, damping: 35 }}
            style={{ width: panelWidth }}
            className="fixed top-0 right-0 h-full bg-white border-l border-black/5 shadow-2xl z-[110] flex flex-col overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
              <LuxeArt
                seed={panelTitle}
                className="w-full h-full"
                transparent={true}
              />
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-[#8D4004]/20 transition-all z-[120]"
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-10 border-b border-black/5 bg-[#FAFAF8]">
              <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                <span className="font-outfit text-[9px] text-[#8D4004] uppercase tracking-[0.4em] font-bold">
                  Reference Panel
                </span>
                <h2 className="text-3xl font-playfairDisplay italic text-[#1A1A1A] leading-tight">
                  {panelTitle}
                </h2>
              </div>
              <button
                onClick={closeSidePanel}
                className="p-2 text-[#1A1A1A]/20 hover:text-[#8D4004] transition-colors flex-shrink-0"
              >
                <XIcon size={24} weight="light" />
              </button>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-10 custom-scrollbar text-[#1A1A1A]/80 font-outfit leading-relaxed text-base">
              <div className="space-y-8">{panelContent}</div>
            </div>

            {/* Panel Footer */}
            <div className="relative z-10 p-6 border-t border-black/5 bg-[#FAFAF8] flex items-center justify-between">
              <div className="flex items-center gap-3 text-black/20 font-outfit text-[9px] uppercase tracking-[0.3em]">
                <InfoIcon
                  weight="light"
                  size={14}
                  className="text-[#8D4004]/40"
                />
                <span>Structural Node // {Math.round(panelWidth)}PX</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-[#8D4004]/40 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-black/5 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LuxeSidePanel;
