import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSnf } from '../../context/SnfContext';
import SnfTopBar from './SnfTopBar';
import SnfStatusBar from './SnfStatusBar';
import SnfFxLayer from './SnfFxLayer';
import SnfBootSequence from './SnfBootSequence';
import SnfAmbientAudio from './SnfAmbientAudio';
import '../../styles/snf.css';

/**
 * Root frame for the entire /snf experience: a fixed-viewport CRT screen whose
 * <main> scrolls internally (so the chrome stays put and the screen can shake
 * without breaking layout). All effects read their state from SnfContext.
 */
const SnfLayout = ({ children, contentClassName = '' }) => {
  const { settings, prefersReducedMotion, hasBooted, markBooted, scrollRef } =
    useSnf();
  const location = useLocation();
  const showBoot = settings.boot && !hasBooted;

  // Reset the terminal viewport scroll on navigation.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, scrollRef]);

  const shake = settings.shake && !prefersReducedMotion
    ? settings.shakeIntensity
    : 'off';

  return (
    <div
      className="snf-root"
      data-snf-crt={settings.crt}
      data-snf-glow={settings.glow ? '1' : '0'}
      data-snf-flicker={settings.flicker ? '1' : '0'}
      data-snf-aberration={settings.aberration ? '1' : '0'}
      data-snf-curve={settings.curvature ? '1' : '0'}
      data-snf-scan={settings.scanlineIntensity}
      data-snf-shake={shake}
      data-snf-rm={prefersReducedMotion ? '1' : '0'}
    >
      <SnfAmbientAudio />

      <AnimatePresence>
        {showBoot && <SnfBootSequence onComplete={markBooted} />}
      </AnimatePresence>

      <div className="snf-housing">
        <span className="snf-screw tl" aria-hidden />
        <span className="snf-screw tr" aria-hidden />
        <span className="snf-screw bl" aria-hidden />
        <span className="snf-screw br" aria-hidden />

        <div className="snf-screen flex flex-col">
          <SnfTopBar />
          <main
            ref={scrollRef}
            className="flex-grow min-h-0 overflow-y-auto relative z-[10]"
          >
            <div
              className={`px-4 md:px-8 py-8 md:py-12 w-full max-w-[1400px] mx-auto ${contentClassName}`}
            >
              {children}
            </div>
          </main>
          <SnfStatusBar />
        </div>
      </div>

      {/* Viewport-fixed CRT overlays (stay still while the screen shakes). */}
      <SnfFxLayer />
    </div>
  );
};

export default SnfLayout;
