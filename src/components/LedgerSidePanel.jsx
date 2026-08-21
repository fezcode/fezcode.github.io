import React, { useEffect, useState } from 'react';
import { useSidePanel } from '../context/SidePanelContext';
import { LedgerRule } from './ledger';
import '../styles/Ledger.css';

/**
 * Ledger theme side panel — a slip pulled out of the register from the page
 * edge. Double-ruled along its spine, headed by a classification line and an
 * uppercase title, closed by the slip's measured width. Escape refiles it;
 * the spine can be dragged to widen the slip.
 */
const LedgerSidePanel = () => {
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

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={closeSidePanel}
        className="fixed inset-0 z-[100]"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--ldg-highlight) 40%, transparent)',
          backdropFilter: 'blur(2px)',
        }}
      />

      <div
        style={{
          width: panelWidth,
          boxShadow:
            '-4px 0 0 0 var(--ldg-bg), -5px 0 0 0 var(--ldg-rule), -24px 0 60px -24px rgba(0, 0, 0, 0.5)',
          borderLeft: '1px solid var(--ldg-rule)',
        }}
        className="ldg-chrome fixed top-0 right-0 h-full z-[110] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
      >
        {/* spine — drag to widen the slip */}
        <div
          onMouseDown={(e) => {
            setIsResizing(true);
            e.preventDefault();
          }}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-[120] transition-colors"
          style={{
            backgroundColor: isResizing ? 'var(--ldg-accent)' : 'transparent',
          }}
          title="Drag to resize"
        />

        <div className="relative z-10 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="ldg-eyebrow m-0 mb-1">SLIP · PULLED FROM THE REGISTER</p>
              <h2 className="ldg-title" style={{ fontSize: '1.15rem' }}>
                {panelTitle}
              </h2>
            </div>
            <button
              onClick={closeSidePanel}
              aria-label="Close panel"
              className="ldg-btn shrink-0"
            >
              [×]
            </button>
          </div>
          <LedgerRule className="mt-4" />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6">{panelContent}</div>
        </div>

        <div className="relative z-10 px-6 pb-5">
          <LedgerRule className="mb-3" />
          <div className="ldg-leader-row" style={{ fontSize: '0.76rem' }}>
            <span className="ldg-label">WIDTH</span>
            <span className="ldg-leader" aria-hidden="true" />
            <span className="ldg-highlight">
              {Math.round(panelWidth)}PX
            </span>
            <span className="ldg-dot ldg-muted" aria-hidden="true">
              ·
            </span>
            <span className="ldg-label">ESC REFILES</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LedgerSidePanel;
