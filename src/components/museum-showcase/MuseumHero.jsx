import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MuseumHero = ({ title, subtitle, image, date, technologies }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="min-h-screen pt-40 pb-40 px-8 md:px-24 flex flex-col relative overflow-hidden bg-[#FDFAF5]">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col relative z-10">
        {/* Refined Meta Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32 py-10 border-y border-black/10"
        >
          {[
            {
              label: 'Artifact',
              value: title,
            },
            {
              label: 'Timeline',
              value: date || '2026',
            },
            {
              label: 'Category',
              value: 'Digital Specimen',
            },
            {
              label: 'Core Tech',
              value: technologies?.slice(0, 2).join(', ') || 'Various',
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 font-ibm-plex-mono">
                {item.label}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest font-ibm-plex-mono text-black/70">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Cinematic Title Area */}
        <div className="mb-40 relative">
          <motion.div
            style={{ opacity }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[14vw] md:text-[10vw] font-medium font-instr-serif leading-[0.85] tracking-tighter text-[#1a1a1a] mb-12">
              {title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-end gap-12 md:gap-32">
              <p className="text-2xl md:text-4xl text-black/40 font-instr-serif italic max-w-2xl leading-[1.4] tracking-tight">
                {subtitle}
              </p>
              <div className="hidden md:block pb-4">
                <div className="w-px h-24 bg-gradient-to-b from-black/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Large Scale Visual with Exhibition Plinth Look */}
        <div className="relative">
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[21/9] w-full overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)] border border-black/5 z-10"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 ease-in-out"
              onError={(e) => {
                e.target.src =
                  '/images/defaults/esma-melike-sezer-YpUj3dD0YzU-unsplash.jpg';
              }}
            />
            {/* Subtle Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </motion.div>

          {/* Architectural Plinth Shadow/Base */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-black/5 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10" />
        </div>
      </div>
    </section>
  );
};

export default MuseumHero;
