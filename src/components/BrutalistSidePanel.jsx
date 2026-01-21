import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, InfoIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';
import GenerativeArt from './GenerativeArt';

const BrutalistSidePanel = () => {
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
      // Constrain width: min 300px, max 90% of screen
      if (newWidth > 300 && newWidth < window.innerWidth * 0.9) {
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
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: panelWidth }}
            className="fixed top-0 right-0 h-full bg-[#050505] border-l border-white/10 shadow-2xl z-[110] flex flex-col overflow-hidden"
          >
            {/* Background Art */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
              <GenerativeArt seed={panelTitle} className="w-full h-full" />
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-emerald-500/50 transition-colors z-[120]"
              title="DRAG_TO_RESIZE"
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/10 bg-black/40">
              <div className="flex flex-col gap-1 min-w-0 pr-4">
                <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-[0.3em] font-bold">
                  System_Panel_Node
                </span>
                <h2 className="text-2xl font-black font-mono tracking-tighter text-white uppercase italic leading-none pr-2">
                  {panelTitle}
                </h2>
              </div>
              <button
                onClick={closeSidePanel}
                className="p-2 text-gray-500 hover:text-white transition-colors flex-shrink-0"
              >
                <XIcon size={24} weight="bold" />
              </button>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar text-white">
              <div className="space-y-8">
                {panelContent}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="relative z-10 p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-600 font-mono text-[9px] uppercase tracking-[0.2em]">
                <InfoIcon weight="fill" size={14} className="text-emerald-500/50" />
                <span>Buffer_Active // {Math.round(panelWidth)}PX</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full" />
                <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BrutalistSidePanel;
