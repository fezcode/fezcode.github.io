import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import piml from 'piml';
import VisionAwakeningCard from '../../components/VisionAwakeningCard';
import Loading from '../../components/Loading';
import {
  CaretLeftIcon,
  CaretRightIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react';

const SkillDeck = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch('/about-me/cards.piml');
        const text = await response.text();
        const parsed = piml.parse(text);

        // Robust handling of parsed piml structure
        let items = [];
        if (parsed.cards && Array.isArray(parsed.cards)) {
          items = parsed.cards;
        } else if (parsed.item) {
          items = Array.isArray(parsed.item) ? parsed.item : [parsed.item];
        } else if (Array.isArray(parsed)) {
          items = parsed;
        }
        setSkills(items);
      } catch (err) {
        console.error('Failed to load skills piml:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % skills.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + skills.length) % skills.length);

  useEffect(() => {
    if (skills.length === 0) return;
    const interval = setInterval(() => {
      setLoadingProgress((prev) =>
        prev >= 100 ? 0 : prev + Math.random() * 20,
      );
    }, 800);
    return () => clearInterval(interval);
  }, [index, skills]);

  if (loading) return <Loading />;
  if (!skills || skills.length === 0) return null;

  const currentSkill = skills[index] || {};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pb-32 md:pb-40 overflow-hidden select-none relative">
      {/* GTA Loading Screen Background Layer */}{' '}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSkill.id || 'fallback'}
          initial={{ opacity: 0, scale: 1.25 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat grayscale-[15%] contrast-[1.15] brightness-[0.4]"
            style={{
              backgroundImage: currentSkill.bgImage
                ? `url(${currentSkill.bgImage})`
                : 'none',
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            background:
              'repeating-linear-gradient(45deg, #000, #000 2px, #fff 2px, #fff 4px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.95)_100%)]" />
        <motion.div
          key={`glow-${currentSkill.id || 'fallback'}`}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentSkill.accentColor || '#ffffff'}55 0%, transparent 85%)`,
          }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] opacity-5 select-none pointer-events-none">
        <h2 className="text-[28vw] font-outfit font-black uppercase leading-none text-center whitespace-nowrap tracking-tighter">
          {currentSkill.id || ''}
        </h2>
      </div>
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10 w-full px-4">
        <h1 className="text-4xl md:text-8xl font-outfit font-black uppercase tracking-tighter mb-2 drop-shadow-[0_0_30px_rgba(0,0,0,1)]">
          the_deck
        </h1>
        <p className="font-mono text-[10px] md:text-xs text-white/60 uppercase tracking-[1em] animate-pulse">
          Cards of Experiences
        </p>
      </div>
      <div className="relative w-full max-w-6xl h-[500px] md:h-[650px] flex items-center justify-center mt-20 z-10">
        <AnimatePresence mode="popLayout" initial={false}>
          {skills.map((skill, i) => {
            let position = i - index;
            // Handle wrap-around
            if (position < -skills.length / 2) position += skills.length;
            if (position > skills.length / 2) position -= skills.length;

            // Only render current, prev, and next
            const isVisible = Math.abs(position) <= 1.1; // Small buffer for animations
            if (!isVisible) return null;

            const isCenter = Math.abs(position) < 0.1;

            return (
              <motion.div
                key={skill.id || `skill-${i}`}
                initial={{
                  opacity: 0,
                  x: position > 0 ? 500 : -500,
                  scale: 0.6,
                  rotate: position * 20,
                }}
                animate={{
                  opacity: isCenter ? 1 : 0.5,
                  x: position * (window.innerWidth < 768 ? 80 : 280),
                  scale: isCenter ? 1 : 0.65,
                  zIndex: isCenter ? 20 : 10,
                  rotate: position * 20,
                  filter: isCenter ? 'blur(0px)' : 'blur(10px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  x: position > 0 ? 700 : -700,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className={`absolute ${isCenter ? 'cursor-default' : 'cursor-pointer group/deckcard'}`}
                onClick={() => {
                  if (position > 0.1) next();
                  if (position < -0.1) prev();
                }}
              >
                {!isCenter && (
                  <div className="absolute inset-0 z-[30] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 rounded-full opacity-0 group-hover/deckcard:opacity-100 transition-opacity flex items-center gap-2 scale-150">
                      {position < 0 ? (
                        <CaretLeftIcon weight="bold" />
                      ) : (
                        <CaretRightIcon weight="bold" />
                      )}
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        {position < 0 ? 'Prev' : 'Next'}
                      </span>
                    </div>
                  </div>
                )}
                <div className="w-[280px] md:w-[520px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
                  <VisionAwakeningCard
                    variant={skill.variant}
                    topBadge={skill.topBadge}
                    title={skill.title}
                    description={skill.description}
                    tags={(() => {
                      if (!skill.tags) return [];
                      const t = skill.tags.tag || skill.tags;
                      return Array.isArray(t) ? t : [t];
                    })()}
                    secondaryTags={[]}
                    footerText=""
                    subNotes={[]}
                    showFooter={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-8 md:mt-20 flex items-center gap-20 z-20">
        <button
          onClick={prev}
          className="p-6 rounded-full border border-white/30 hover:bg-white/10 transition-all text-white/50 hover:text-white group bg-black/60 backdrop-blur-md shadow-[6px_6px_0_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none"
        >
          <CaretLeftIcon
            size={36}
            weight="bold"
            className="group-active:-translate-x-3 transition-transform"
          />
        </button>

        <div className="flex gap-4">
          {skills.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 transition-all duration-700 rounded-full cursor-pointer hover:scale-125 ${i === index ? 'w-24 bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse' : 'w-5 bg-white/10 hover:bg-white/30'}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-6 rounded-full border border-white/30 hover:bg-white/10 transition-all text-white/50 hover:text-white group bg-black/60 backdrop-blur-md shadow-[6px_6px_0_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none"
        >
          <CaretRightIcon
            size={36}
            weight="bold"
            className="group-active:translate-x-3 transition-transform"
          />
        </button>
      </div>
      <div className="absolute bottom-28 right-10 z-30 flex flex-col items-end gap-3 pointer-events-none">
        <div className="flex items-center gap-3 text-white/80 font-mono text-[10px] md:text-sm tracking-[0.4em] uppercase">
          <SpinnerGapIcon className="animate-spin" size={22} weight="bold" />
          <span>
            X_STREAM_{(currentSkill.id || 'NULL').toUpperCase()}_UPDATING...
          </span>
        </div>
        <div className="w-56 md:w-96 h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]"
            initial={{ width: '0%' }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
      </div>
      <div className="absolute bottom-28 left-10 z-[5] font-mono text-[8px] md:text-[11px] text-white/30 uppercase tracking-[0.5em] hidden lg:block leading-loose">
        <p>SYSTEM_ID: FEZCODEX_STABLE</p>
        <p>DOMAIN: {window.location.hostname}</p>
        <p>ACCESS: GRANTED_ROOT</p>
        <p>KERNEL: 5.15.0-GENERIC</p>
        <p>IO: BROADCASTING_V0.9</p>
      </div>
      <div className="absolute top-8 right-8 z-[5] font-mono text-[8px] md:text-[11px] text-white/30 uppercase tracking-[0.5em] text-right hidden lg:block leading-loose">
        <p>TIME: {new Date().toLocaleTimeString()}</p>
        <p>HEAT: 42°C_OPTIMAL</p>
        <p>STREAM: SYNCHRONIZED</p>
        <p>STATUS: OPERATIONAL</p>
      </div>
      <div className="absolute inset-0 z-[40] pointer-events-none opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-overlay" />
    </div>
  );
};

export default SkillDeck;
