import React from 'react';

const CensoredPolaroid = ({
  imageUrl = '/images/herdaim.jpg',
  censored = true,
}) => (
  <div className="absolute top-32 -left-20 xl:-left-48 z-20 transform -rotate-3 pointer-events-none select-none hidden lg:block">
    {/* Paper Clip (CSS Only) */}
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-4 h-12 border-4 border-[#5d5d5d] rounded-full"
      style={{
        height: '30px',
        borderBottom: 'none',
        borderRadius: '10px 10px 0 0',
      }}
    />
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-4 h-12 border-4 border-[#333] opacity-30 rounded-full"
      style={{
        height: '32px',
        borderBottom: 'none',
        borderRadius: '10px 10px 0 0',
        transform: 'translate(1px, 1px)',
      }}
    />

    {/* Polaroid Frame */}
    <div className="bg-white p-2 pb-8 shadow-[0_4px_6px_rgba(0,0,0,0.3)] w-40 h-auto rotate-2 border border-gray-200">
      {/* Image Area */}
      <div className="relative bg-gray-200 aspect-square overflow-hidden filter grayscale contrast-125 sepia-[.3]">
        <img
          src={imageUrl}
          alt="Subject"
          className="w-full h-full object-cover opacity-90 mix-blend-multiply"
        />
        {/* Censor Bar */}
        {censored && (
          <div className="absolute top-[35%] left-[-10%] w-[120%] h-6 bg-black flex items-center justify-center transform -rotate-2">
            <span className="text-[0.3rem] text-white/50 tracking-[0.5em] font-mono">
              CONFIDENTIAL
            </span>
          </div>
        )}
      </div>

      {/* Handwritten Label */}
      <div className="mt-3 font-mono text-[0.6rem] text-center text-gray-500 tracking-widest uppercase">
        Fig. 1: The Architect
      </div>

      {/* Stamp over photo */}
      <div className="absolute bottom-12 right-2 opacity-40 transform -rotate-12 border-2 border-red-800 text-red-800 px-1 py-0.5 text-[0.5rem] font-black uppercase">
        VERIFIED
      </div>
    </div>
  </div>
);

export default CensoredPolaroid;
