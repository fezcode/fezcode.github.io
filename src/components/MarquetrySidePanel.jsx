import React, { useEffect, useState } from 'react';
import { useSidePanel } from '../context/SidePanelContext';
import { MarquetryText, MarquetryIcon, MarquetryBand, WOOD } from './marquetry';
import useOrbitDialog from './orbit/useOrbitDialog';
import '../styles/Marquetry.css';

const MarquetrySidePanel = () => {
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
        style={{ backgroundColor: 'rgba(25, 17, 12, 0.6)' }}
      />
      <div
        style={{ width: `min(${panelWidth}px, 100vw)` }}
        className="mqt-chrome mqt-wool-walnut fixed top-0 right-0 h-full z-[110] flex flex-col overflow-hidden shadow-[-12px_0_30px_rgba(0,0,0,0.5)]"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
      >
        {/* the edge — drag to widen the panel */}
        <button
          type="button"
          role="separator"
          tabIndex={0}
          aria-label="Resize side panel"
          aria-orientation="vertical"
          aria-valuemin={300}
          aria-valuemax={Math.round(window.innerWidth * 0.9)}
          aria-valuenow={Math.round(panelWidth)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              const direction = event.key === 'ArrowLeft' ? 1 : -1;
              setPanelWidth(
                Math.max(
                  300,
                  Math.min(
                    window.innerWidth * 0.9,
                    panelWidth + direction * 24,
                  ),
                ),
              );
            }
          }}
          onMouseDown={(e) => {
            setIsResizing(true);
            e.preventDefault();
          }}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-[120] mqt-wool-gold"
          style={{ opacity: isResizing ? 1 : 0.65 }}
          title="Drag to resize"
        />
        <MarquetryBand pattern="peerie" />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
          <div className="min-w-0 flex-1">
            <MarquetryText text="A closer look" size="small" fg={WOOD.wheat} />
            <MarquetryText
              as="h2"
              text={panelTitle}
              fg={WOOD.cream}
              maxLines={3}
              className="mt-3"
            />
          </div>
          <button
            type="button"
            onClick={closeSidePanel}
            aria-label="Close panel"
            className="mqt-btn mqt-btn-icon shrink-0"
          >
            <MarquetryIcon name="close" fg={WOOD.ink} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mqt-patch mqt-prose mqt-panel-prose">
            {panelContent}
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-3 mqt-wool-bark">
          <span className="mqt-label">Width {Math.round(panelWidth)}px</span>
          <span className="mqt-label">Esc closes</span>
        </div>
      </div>
    </>
  );
};

export default MarquetrySidePanel;
