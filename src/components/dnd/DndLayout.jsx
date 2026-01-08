import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndNavbar from './DndNavbar';
import DndFooter from './DndFooter';
import dndWallpapers from '../../utils/dndWallpapers';
import { parseWallpaperName } from '../../utils/dndUtils';
import '../../styles/dnd-refactor.css';
import { GameController, Flame, TreasureChest } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';

const Lightning = () => (
  <div className="dnd-lightning-overlay" />
);

const LootDiscovery = () => {
  const { addToast } = useToast();
  const [showLoot, setShowLoot] = useState(false);
  const [lootPos, setLootPos] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    const interval = setInterval(() => {
      // 50% chance every 15 seconds
      if (Math.random() > 0.5) {
        setLootPos({
          top: `${30 + Math.random() * 40}%`,
          left: `${20 + Math.random() * 60}%`,
        });
        setShowLoot(true);
        setTimeout(() => setShowLoot(false), 8000); // Hide after 8s
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!showLoot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={() => {
        const currentCount = parseInt(localStorage.getItem('fezcodex_loot_count') || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem('fezcodex_loot_count', newCount.toString());

        addToast({
          title: 'Loot Discovered!',
          message: `You found an ancient relic in the archives. (Total Found: ${newCount})`,
          type: 'gold',
        });
        setShowLoot(false);
      }}
      className="fixed z-[150] dnd-loot-item text-dnd-gold"
      style={{ top: lootPos.top, left: lootPos.left }}
    >
      <TreasureChest size={32} weight="fill" />
    </motion.div>
  );
};

const FireplaceAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[110]">
      <audio
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/sounds/static.mp3`} // Using static.mp3 as a fireplace crackle proxy if specific fire sound doesn't exist
        loop
      />
      <button
        onClick={toggleAudio}
        className={`p-4 rounded-full border-2 transition-all shadow-2xl ${isPlaying ? 'bg-dnd-crimson border-dnd-gold text-white animate-pulse' : 'bg-black/40 border-white/10 text-white/40 hover:text-white'}`}
        title="Toggle Ambient Fireplace"
      >
        <Flame size={32} weight={isPlaying ? "fill" : "bold"} />
      </button>
    </div>
  );
};

const FireOverlay = () => (
  <div className="dnd-fire-overlay" />
);

const DustMotes = () => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="dnd-dust-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${100 + Math.random() * 20}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `${-Math.random() * 20}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
        }}
      />
    ))}
  </div>
);

const FloatingRunes = () => {
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="dnd-floating-rune text-4xl"
          initial={{ opacity: 0.02 }}
          whileHover={{ opacity: 0.1, scale: 1.5, filter: 'blur(0px)' }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {runes[Math.floor(Math.random() * runes.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const ViewportFrame = () => (
  <>
    <div className="dnd-viewport-frame" />
    <div className="fixed top-0 left-0 w-24 h-24 z-[210] pointer-events-none">
       <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-dnd-gold rounded-tl-lg" />
    </div>
    <div className="fixed top-0 right-0 w-24 h-24 z-[210] pointer-events-none">
       <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-dnd-gold rounded-tr-lg" />
    </div>
    <div className="fixed bottom-0 left-0 w-24 h-24 z-[210] pointer-events-none">
       <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-dnd-gold rounded-bl-lg" />
    </div>
    <div className="fixed bottom-0 right-0 w-24 h-24 z-[210] pointer-events-none">
       <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-dnd-gold rounded-br-lg" />
    </div>
  </>
);

const FireParticles = () => {
  const colors = [
    'radial-gradient(circle, #ff4500 0%, #ff8c00 70%, transparent 100%)', // Red-Orange
    'radial-gradient(circle, #ff8c00 0%, #ffd700 70%, transparent 100%)', // Orange-Gold
    'radial-gradient(circle, #ff0000 0%, #ff4500 70%, transparent 100%)', // Pure Red
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = 3 + Math.random() * 8;
        return (
          <div
            key={i}
            className="dnd-fire-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: colors[Math.floor(Math.random() * colors.length)],
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${-Math.random() * 15}s`,
              boxShadow: `0 0 ${size * 2}px #ff4500`,
            }}
          />
        );
      })}
    </div>
  );
};
const Torchlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100] hidden md:block"
      style={{
        background: `radial-gradient(circle 400px at ${springX}px ${springY}px, rgba(255, 180, 50, 0.08), transparent 80%)`,
      }}
    />
  );
};

const DiceRoller = () => {
  const [roll, setRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      setRoll(Math.floor(Math.random() * 20) + 1);
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-center gap-4">
      {roll !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-dnd-crimson border-2 border-dnd-gold text-white px-4 py-2 rounded-sm font-mono text-xs shadow-2xl"
        >
          {roll === 20 ? 'CRITICAL SUCCESS!' : roll === 1 ? 'CRITICAL FAILURE...' : `YOU ROLLED: ${roll}`}
        </motion.div>
      )}
      <button
        onClick={rollDice}
        className={`p-4 bg-dnd-crimson border-2 border-dnd-gold rounded-full text-white/50 shadow-2xl transition-all hover:scale-110 active:scale-95 ${isRolling ? 'dnd-dice-action' : ''}`}
      >
        <GameController size={32} weight="fill" />
      </button>
    </div>
  );
};

const DndLayout = ({ children }) => {
  const {
    setBgImageName,
    isLightningEnabled,
    isLootDiscoveryEnabled,
    isFireOverlayEnabled,
    isFireParticlesEnabled,
    isViewportFrameEnabled,
  } = useContext(DndContext);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const randomImage = dndWallpapers[Math.floor(Math.random() * dndWallpapers.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  return (
    <div className="dnd-theme-root min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="hidden md:block">
        {isViewportFrameEnabled && <ViewportFrame />}
        {isLightningEnabled && <Lightning />}
        {isLootDiscoveryEnabled && <LootDiscovery />}
        <FireplaceAudio />
        {isFireOverlayEnabled && <FireOverlay />}
        <Torchlight />
        <DiceRoller />
        {isFireParticlesEnabled && <FireParticles />}
        <DustMotes />
        <FloatingRunes />
      </div>

      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: bgImage ? `url(${process.env.PUBLIC_URL}${bgImage})` : 'none',
            filter: 'brightness(0.45) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <DndNavbar />
        <main className="flex-grow pt-24 pb-12">
          {children}
        </main>
        <DndFooter />
      </div>

      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
};

export default DndLayout;
