import React, { useEffect, useState } from 'react';
import { useSidePanel } from '../context/SidePanelContext';
import { KilimText, KilimIcon, KilimBand, WOOL } from './kilim';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Kilim.css';
import '../styles/kilim-chrome.css';

const KilimSidePanel = () => {
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
      <div onClick={closeSidePanel} className="klm-sidepanel-scrim" />
      <div
        style={{ width: `min(${panelWidth}px, 100vw)` }}
        className="klm-chrome klm-sidepanel klm-wool-indigo"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
      >
        {/* the selvedge: drag to widen the panel */}
        <div
          onMouseDown={(e) => {
            setIsResizing(true);
            e.preventDefault();
          }}
          className="klm-sidepanel-grip"
          style={{ opacity: isResizing ? 1 : 0.7 }}
          title="Drag to resize"
        />
        <KilimBand pattern="end" />
        <div className="klm-sidepanel-head">
          <div className="min-w-0 flex-1">
            <p className="klm-eyebrow">A closer look</p>
            <KilimText as="h2" text={panelTitle} maxLines={3} />
          </div>
          <button
            type="button"
            onClick={closeSidePanel}
            aria-label="Close panel"
            className="klm-btn klm-btn-icon shrink-0"
          >
            <KilimIcon name="close" fg={WOOL.walnut} />
          </button>
        </div>
        <div className="klm-sidepanel-body klm-prose">{panelContent}</div>
        <div className="klm-sidepanel-foot klm-wool-walnut">
          <span className="klm-label">Width {Math.round(panelWidth)}px</span>
          <span className="klm-label">
            <kbd className="klm-kbd">Esc</kbd> closes
          </span>
        </div>
        <KilimBand pattern="end" />
      </div>
    </>
  );
};

export default KilimSidePanel;
