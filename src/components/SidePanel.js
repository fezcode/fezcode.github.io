import React, {useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {XIcon} from '@phosphor-icons/react';
import {useSidePanel} from '../context/SidePanelContext';

const SidePanel = () => {
  const {isOpen, closeSidePanel, panelTitle, panelContent} = useSidePanel();

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

  const variants = {
    open: {x: 0, opacity: 1}, closed: {x: '100%', opacity: 1},
  };

  return (<AnimatePresence>
      {isOpen && (<>
          {/* Overlay (optional, clicks close panel?) - Let's allow clicking outside to close */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{type: 'spring', damping: 25, stiffness: 200}}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.5)] z-[70] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-mono font-bold text-gray-100 truncate">
                {panelTitle}
              </h2>
              <button
                onClick={closeSidePanel}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              >
                <XIcon size={20}/>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 text-gray-300 font-mono">
              {panelContent}
            </div>
          </motion.div>
        </>)}
    </AnimatePresence>);
};

export default SidePanel;
