import React from 'react';
import { motion } from 'framer-motion';

const MuseumGallery = ({ image, title, caption }) => {
  return (
    <section className="bg-[#FDFAF5] py-40 px-8 md:px-24 overflow-hidden relative">
      {/* Dynamic Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white blur-[120px] opacity-40 pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Subtle Frame Effect */}
          <div className="relative aspect-[16/10] w-full p-4 md:p-8 bg-white shadow-[0_80px_120px_-20px_rgba(0,0,0,0.12)] border border-black/[0.03]">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={image}
                alt={title || 'Gallery Image'}
                className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-[1.01] transition-all duration-[2000ms] ease-out"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Artistic Texture Overlay */}
              <div className="absolute inset-0 bg-black/5 mix-blend-soft-light pointer-events-none" />
            </div>
          </div>

          {caption && (
            <div className="mt-16 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-[1px] bg-black/10" />
              <p className="text-sm md:text-base font-instr-serif italic text-black/40 tracking-wide max-w-xl leading-relaxed">
                {caption}
              </p>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/10 font-ibm-plex-mono">
                Gallery Exhibit Item
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MuseumGallery;
