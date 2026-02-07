import React from 'react';
import { useCloudMusic } from '../../../../context/CloudMusicContext';
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import GenerativeArt from '../../../../components/GenerativeArt';
import { useLocation, useNavigate } from 'react-router-dom';

const TinyCloudPlayer = () => {
  const {
    isPlayerOpen,
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    closePlayer,
    currentTime,
    duration,
  } = useCloudMusic();
  const location = useLocation();
  const navigate = useNavigate();

  // Disable on the main Aether app page to avoid redundancy, and on About pages
  if (
    location.pathname.startsWith('/apps/aether') ||
    location.pathname.startsWith('/about')
  )
    return null;

  if (!isPlayerOpen) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isPlayerOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-md font-mono"
        >
          <div className="relative group">
            {/* Cyber Deck Container */}
            <div className="relative bg-black border border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)] p-1.5 pr-2 gap-2 md:p-2 md:pr-4 md:gap-4 flex items-center overflow-hidden clip-path-polygon">
              {/* Scanlines Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

              {/* Progress Bar Background */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-900 w-full border-t border-cyan-900">
                <motion.div
                  className="h-full bg-cyan-500 shadow-[0_0_10px_#0ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Cover Art / Icon - Square & Glitchy */}
              <div
                className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 border border-cyan-500/50 bg-black overflow-hidden cursor-pointer"
                onClick={() => {
                  navigate('/apps/aether');
                }}
              >
                {currentTrack?.cover ? (
                  <img
                    src={currentTrack.cover}
                    alt="cover"
                    className={`w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all`}
                  />
                ) : (
                  <div className="w-full h-full">
                    <GenerativeArt
                      seed={currentTrack?.title || 'TINY_AETHER'}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div
                onClick={() => navigate('/apps/aether')}
                className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 md:gap-1 cursor-pointer"
              >
                <h4 className="text-[10px] md:text-xs font-bold text-cyan-400 truncate uppercase tracking-widest hover:underline">
                  {currentTrack?.title || 'NO SIGNAL'}
                </h4>
                <p className="text-[9px] md:text-[10px] text-cyan-700 truncate font-bold hover:underline">
                  {currentTrack?.artist || 'UNKNOWN'}
                </p>
              </div>
              {/* Controls - Mechanical Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prevTrack}
                  className="p-1.5 md:p-2 hover:bg-cyan-900/30 text-cyan-600 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30"
                >
                  <SkipBackIcon
                    size={14}
                    className="md:w-4 md:h-4"
                    weight="bold"
                  />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-1.5 md:p-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                  {isPlaying ? (
                    <PauseIcon
                      size={14}
                      className="md:w-4 md:h-4"
                      weight="fill"
                    />
                  ) : (
                    <PlayIcon
                      size={14}
                      className="md:w-4 md:h-4"
                      weight="fill"
                    />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-1.5 md:p-2 hover:bg-cyan-900/30 text-cyan-600 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30"
                >
                  <SkipForwardIcon
                    size={14}
                    className="md:w-4 md:h-4"
                    weight="bold"
                  />
                </button>
              </div>
            </div>

            {/* Close Button - Technical Tab */}
            <button
              onClick={closePlayer}
              className="absolute -top-3 right-0 bg-black border border-b-0 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black px-2 py-0.5 text-[8px] md:text-[10px] uppercase tracking-wider font-bold transition-colors z-50 clip-path-top-tab"
            >
              EXIT
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TinyCloudPlayer;
