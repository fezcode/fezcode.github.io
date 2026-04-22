import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, InfoIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';
import GenerativeArt from './GenerativeArt';

const TerracottaSidePanel = () => {
  const {
    isOpen,
    closeSidePanel,
    panelTitle,
    panelContent,
    panelWidth,
    setPanelWidth,
  } = useSidePanel();
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) closeSidePanel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidePanel]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth * 0.9) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-[#1A1613]/50 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: panelWidth }}
            className="fixed top-0 right-0 h-full bg-[#F3ECE0] border-l border-[#1A161320] shadow-[0_40px_80px_-40px_#1A161340] z-[110] flex flex-col overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <GenerativeArt seed={panelTitle} className="w-full h-full" />
            </div>

            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#C96442]/50 transition-colors z-[120]"
              title="DRAG_TO_RESIZE"
            />

            <div className="relative z-10 flex items-center justify-between p-8 border-b border-[#1A161320] bg-[#E8DECE]/50">
              <div className="flex flex-col gap-1 min-w-0 pr-4">
                <span className="font-mono text-[9px] text-[#9E4A2F] uppercase tracking-[0.3em] font-bold">
                  Side_Panel
                </span>
                <h2 className="text-3xl font-fraunces italic tracking-tight text-[#1A1613] leading-none pr-2">
                  {panelTitle}
                </h2>
              </div>
              <button
                onClick={closeSidePanel}
                className="p-2 text-[#2E2620]/50 hover:text-[#9E4A2F] transition-colors flex-shrink-0"
              >
                <XIcon size={24} weight="bold" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar text-[#1A1613]">
              <div className="space-y-8">{panelContent}</div>
            </div>

            <div className="relative z-10 p-6 border-t border-[#1A161320] bg-[#E8DECE]/50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#2E2620]/50 font-mono text-[9px] uppercase tracking-[0.2em]">
                <InfoIcon weight="fill" size={14} className="text-[#C96442]/60" />
                <span>Buffer_Active // {Math.round(panelWidth)}PX</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-[#C96442] animate-pulse rounded-full" />
                <div className="w-1.5 h-1.5 bg-[#1A1613]/15 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TerracottaSidePanel;
