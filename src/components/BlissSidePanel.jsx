import React, { useEffect, useState } from 'react';
import { BookOpenIcon } from '@phosphor-icons/react';
import { useSidePanel } from '../context/SidePanelContext';
import { BlissWindow } from './bliss';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Bliss.css';

const BlissSidePanel = () => {
  const {
    isOpen,
    closeSidePanel,
    panelTitle,
    panelContent,
    panelWidth,
    setPanelWidth,
  } = useSidePanel();
  const [isResizing, setIsResizing] = useState(false);
  const dialogRef = useOrbitDialog(isOpen, closeSidePanel);

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

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={closeSidePanel}
        className="fixed inset-0 z-[100]"
        style={{ backgroundColor: 'rgba(10, 30, 90, 0.35)' }}
      />
      <div
        style={{ width: `min(${panelWidth}px, 100vw)` }}
        className="bl-chrome fixed top-0 right-0 h-full z-[110] flex flex-col"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
      >
        {/* the window's left edge — drag to widen the panel */}
        <div
          onMouseDown={(e) => {
            setIsResizing(true);
            e.preventDefault();
          }}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-[120]"
          style={{
            background:
              'linear-gradient(90deg, var(--bl-title-hi), var(--bl-frame))',
            opacity: isResizing ? 1 : 0.65,
          }}
          title="Drag to resize"
        />
        <BlissWindow
          as="div"
          title={panelTitle}
          icon={BookOpenIcon}
          tone="blue"
          headingLevel={2}
          onClose={closeSidePanel}
          closeLabel="Close panel"
          className="h-full"
          bodyClassName="flex-1 min-h-0 overflow-y-auto"
          style={{
            borderRadius: '9px 0 0 0',
            boxShadow: '-12px 0 30px rgba(0, 20, 80, 0.35)',
          }}
          status={
            <>
              <span>Width {Math.round(panelWidth)}px</span>
              <span>
                <kbd className="bl-kbd">Esc</kbd> closes
              </span>
            </>
          }
        >
          <p className="bl-eyebrow m-0 mb-3">A closer look</p>
          <div className="bl-paper bl-prose">{panelContent}</div>
        </BlissWindow>
      </div>
    </>
  );
};

export default BlissSidePanel;
