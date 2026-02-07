import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PerceptionPlayground = () => {
  const [activeIllusion, setActiveIllusion] = useState('contrast');

  return (
    <div className="p-8 min-h-full flex flex-col items-center font-nunito bg-[#f4f4f0]">
      <div className="w-full max-w-5xl">
        <div className="flex justify-center gap-4 mb-12">
          {['contrast', 'vibration', 'mach-bands'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveIllusion(id)}
              className={`px-6 py-2 rounded-full border-2 border-[#1a1a1a] transition-all font-bold uppercase tracking-wider text-xs
                        ${
                          activeIllusion === id
                            ? 'bg-[#1a1a1a] text-white shadow-[4px_4px_0px_0px_#666]'
                            : 'hover:bg-white text-[#1a1a1a]'
                        }
                    `}
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {activeIllusion === 'contrast' && (
            <div className="flex flex-col items-center gap-8 w-full">
              <h3 className="text-3xl font-normal font-instr-serif text-[#1a1a1a]">
                Simultaneous Contrast
              </h3>
              <p className="text-[#666] text-center max-w-lg mb-4 text-lg">
                The small squares are the exact same color (#808080), but they
                appear different depending on the background.
              </p>{' '}
              <div className="flex gap-0 w-full max-w-2xl h-64">
                <div className="flex-1 bg-black flex items-center justify-center">
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className="w-24 h-24 bg-[#808080] cursor-grab active:cursor-grabbing shadow-lg"
                  />
                </div>
                <div className="flex-1 bg-white flex items-center justify-center">
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className="w-24 h-24 bg-[#808080] cursor-grab active:cursor-grabbing shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeIllusion === 'vibration' && (
            <div className="flex flex-col items-center gap-8 w-full">
              <h3 className="text-2xl font-bold">Chromatic Vibration</h3>
              <p className="text-gray-400 text-center max-w-lg mb-4">
                Bright red and bright blue (or green) create a "vibrating" edge
                when placed next to each other due to difficulty in focusing on
                both simultaneously.
              </p>
              <div className="relative w-64 h-64 bg-red-600 flex items-center justify-center rounded-full overflow-hidden">
                <div className="text-blue-600 font-black text-6xl">VIBE</div>
                <div className="absolute inset-0 border-[20px] border-blue-600 rounded-full mix-blend-difference opacity-50"></div>
              </div>
            </div>
          )}
          {activeIllusion === 'mach-bands' && (
            <div className="flex flex-col items-center gap-8 w-full">
              <h3 className="text-2xl font-bold">Mach Bands</h3>
              <p className="text-gray-400 text-center max-w-lg mb-4">
                The visual system exaggerates the contrast at edges of slightly
                differing shades, creating the illusion of darker or lighter
                bands.
              </p>
              <div className="flex w-full max-w-2xl h-64">
                {[10, 20, 30, 40, 50, 60, 70, 80].map((l) => (
                  <div
                    key={l}
                    className="flex-1"
                    style={{ backgroundColor: `hsl(0, 0%, ${l}%)` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerceptionPlayground;
