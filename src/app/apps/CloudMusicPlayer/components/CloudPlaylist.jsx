import React from 'react';
import { useCloudMusic } from '../../../../context/CloudMusicContext';
import { PauseIcon, WaveformIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const CloudPlaylist = () => {
  const { playlist, currentTrack, isPlaying, playTrack, togglePlay } =
    useCloudMusic();

  return (
    <div className="w-full h-full flex flex-col font-mono text-sm">
      <div className="grid grid-cols-[3rem_1fr_4rem] gap-2 px-4 py-2 border-b border-cyan-900/50 text-cyan-700/60 text-xs font-bold uppercase tracking-wider">
        <div>Idx</div>
        <div>Signal Source</div>
        <div className="text-right">Stat</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber p-2 space-y-1">
        {playlist.map((track, index) => {
          const isCurrent = currentTrack === track;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => (isCurrent ? togglePlay() : playTrack(index))}
              className={`
                group relative grid grid-cols-[3rem_1fr_4rem] gap-2 items-center p-2 cursor-pointer transition-all duration-200
                border border-transparent hover:border-cyan-500/30
                ${
                  isCurrent
                    ? 'bg-cyan-900/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)]'
                    : 'text-gray-500 hover:text-cyan-300 hover:bg-black/40'
                }
              `}
            >
              {/* Index / Status Icon */}
              <div className="font-bold opacity-60 flex items-center justify-center">
                {isCurrent ? (
                  isPlaying ? (
                    <WaveformIcon className="animate-pulse" size={16} />
                  ) : (
                    <PauseIcon size={16} />
                  )
                ) : (
                  <span className="text-xs">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Track Info */}
              <div className="min-w-0 flex flex-col">
                <span
                  className={`font-bold truncate ${isCurrent ? 'text-cyan-300' : 'text-gray-300 group-hover:text-cyan-200'}`}
                >
                  {track.title}
                </span>
                <span className="text-xs truncate opacity-60">
                  {track.artist}
                </span>
              </div>

              {/* Status Text */}
              <div className="text-right text-xs font-mono opacity-50">
                {isCurrent ? (isPlaying ? 'RUN' : 'PAUSE') : 'RDY'}
              </div>

              {/* Selection Marker */}
              {isCurrent && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 box-shadow-[0_0_8px_#0ff]"></div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudPlaylist;
