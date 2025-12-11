import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';

const SidePanel = () => {
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ width: panelWidth }}
            className="fixed top-0 right-0 h-full bg-gray-900 border-l border-gray-700 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.5)] z-[70] flex flex-col overflow-hidden"
          >
            {/* Resize Handle */}
            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-primary-500/50 transition-colors z-50"
              title="Drag to resize"
            />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-mono font-bold text-gray-100 truncate pr-4">
                {panelTitle}
              </h2>
              <button
                onClick={closeSidePanel}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 text-gray-300 font-mono">
              {panelContent}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
