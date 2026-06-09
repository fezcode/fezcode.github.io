import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, InfoIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';
import { MistOrb, MistHorizon } from './mist';

const MistSidePanel = () => {
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
            className="fixed inset-0 bg-[#DFE5E3]/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: panelWidth }}
            className="fixed top-0 right-0 h-full bg-[#EEF2F1] shadow-[0_18px_50px_rgba(60,72,69,0.18)] z-[110] flex flex-col overflow-hidden selection:bg-[#8FA8BC]/30"
          >
            {/* fog washes drifting behind the content */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(420px 320px at 80% -10%, #E5EBE9 0%, transparent 60%), radial-gradient(360px 420px at -10% 110%, #D2DBD8 0%, transparent 55%)',
              }}
            />

            {/* left edge — a fading horizon instead of a border */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 bottom-0 w-px z-[115]"
              style={{
                background:
                  'linear-gradient(180deg, transparent, rgba(60,72,69,0.14) 30%, rgba(60,72,69,0.14) 70%, transparent)',
              }}
            />

            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#5F837B]/40 transition-colors z-[120]"
              title="drag to resize"
            />

            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-10 p-8 pb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                  <span className="font-ibm-plex-mono text-[9px] text-[#5F837B] lowercase tracking-[0.26em]">
                    side panel · open
                  </span>
                  <h2 className="text-3xl font-instr-serif italic text-[#3C4845] leading-none pr-2">
                    {panelTitle}
                  </h2>
                </div>
                <button
                  onClick={closeSidePanel}
                  className="p-2 text-[#8A9894] hover:text-[#5F837B] transition-colors flex-shrink-0"
                >
                  <XIcon size={22} weight="light" />
                </button>
              </div>
              <MistHorizon className="mt-6" />
            </motion.div>

            <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar text-[#3C4845]">
              <div className="space-y-8">{panelContent}</div>
            </div>

            <div className="relative z-10 px-6 pb-5">
              <MistHorizon className="mb-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#8A9894] font-ibm-plex-mono text-[9px] lowercase tracking-[0.2em]">
                  <InfoIcon
                    weight="light"
                    size={14}
                    className="text-[#5F837B]/70"
                  />
                  <span>
                    adrift at {Math.round(panelWidth)}px · visibility: low
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#8FA8BC] animate-pulse rounded-full" />
                  <MistOrb size={16} breathe={false} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MistSidePanel;
