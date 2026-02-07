import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Crosshair,
  WifiHigh,
  ShieldChevron,
  LockKey,
  CornersOut,
  CaretRight,
  FileText,
  MapPin,
  Clock,
  User,
  ShareNetwork,
  Radioactive,
  TerminalWindow,
  X,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import piml from 'piml';
import TacticalGlobe from '../components/TacticalGlobe';

// Helper for scrambling text effect
const ScrambleText = ({ text, speed = 30, delay = 0 }) => {
  const [display, setDisplay] = useState('');
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    let iteration = 0;
    let timer = null;

    // Initial delay
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''),
        );

        if (iteration >= text.length) {
          clearInterval(timer);
        }

        iteration += 1; // Faster reveal
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, delay]);

  return <span>{display}</span>;
};

const THEMES = {
  matrix: {
    id: 'matrix',
    label: 'MATRIX_PROTO',
    primary: 'text-emerald-500',
    primaryHover: 'hover:text-emerald-400',
    primaryBg: 'bg-emerald-500',
    primaryBorder: 'border-emerald-500',
    primaryBorderHover: 'hover:border-emerald-500',
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-900',
    accentBorder: 'border-emerald-900',
    selection: 'selection:bg-emerald-500/50',

    // Specific Opacities
    bgMain10: 'bg-emerald-500/10',
    bgMain05: 'bg-emerald-500/5',
    bgMain20: 'bg-emerald-900/20',
    borderMain30: 'border-emerald-500/30',
    borderMain20: 'border-emerald-500/20',
    borderMain10: 'border-emerald-500/10',
    borderMain50: 'border-emerald-500/50',
    borderDim30: 'border-emerald-900/30',

    textMain50: 'text-emerald-500/50',
    textMain60: 'text-emerald-500/60',
    textDim600: 'text-emerald-600',
    textDim800: 'text-emerald-800',
    textBody: 'text-emerald-300',
    textBright: 'text-emerald-400',

    decoration: 'via-emerald-500/[0.03]',
    globe: '#10b981',
    globeActive: '#ef4444',
    glitchShadow1: '#00ff00',
    glitchShadow2: '#ff0000',
  },
  fallout: {
    id: 'fallout',
    label: 'NEW_VEGAS_OS',
    primary: 'text-amber-500',
    primaryHover: 'hover:text-amber-400',
    primaryBg: 'bg-amber-500',
    primaryBorder: 'border-amber-500',
    primaryBorderHover: 'hover:border-amber-500',
    accent: 'text-amber-700',
    accentBg: 'bg-amber-900',
    accentBorder: 'border-amber-900',
    selection: 'selection:bg-amber-500/50',

    // Specific Opacities
    bgMain10: 'bg-amber-500/10',
    bgMain05: 'bg-amber-500/5',
    bgMain20: 'bg-amber-900/20',
    borderMain30: 'border-amber-500/30',
    borderMain20: 'border-amber-500/20',
    borderMain10: 'border-amber-500/10',
    borderMain50: 'border-amber-500/50',
    borderDim30: 'border-amber-900/30',

    textMain50: 'text-amber-500/50',
    textMain60: 'text-amber-500/60',
    textDim600: 'text-amber-600',
    textDim800: 'text-amber-800',
    textBody: 'text-amber-300',
    textBright: 'text-amber-400',

    decoration: 'via-amber-500/[0.03]',
    globe: '#f59e0b',
    globeActive: '#ef4444',
    glitchShadow1: '#f59e0b',
    glitchShadow2: '#ff0000',
  },
};

const ReadingPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [globeColor, setGlobeColor] = useState('#10b981'); // Default Emerald
  const [theme, setTheme] = useState('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, UNREAD, READ

  const currentTheme = THEMES[theme];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'matrix' ? 'fallout' : 'matrix'));
  };

  useEffect(() => {
    const fetchReadings = async () => {
      // Simulate "Decrypting" delay
      setTimeout(async () => {
        try {
          const response = await fetch('/logs/reading/reading.piml');
          if (!response.ok) return;
          const text = await response.text();
          const data = piml.parse(text);

          const sortedItems = (data.logs || []).map((item, idx) => ({
            ...item,
            id: idx,
            status: item.status === 'read' ? 'COMPLETED' : 'ACTIVE',
            priority: item.status === 'read' ? 'LOW' : 'CRITICAL',
            clearance: ['TOP SECRET', 'CONFIDENTIAL', 'RESTRICTED'][idx % 3],
            // Fake coordinates for the gimmick
            lat: (Math.random() * 180 - 90).toFixed(4),
            lng: (Math.random() * 360 - 180).toFixed(4),
            sector: `SEC-${Math.floor(Math.random() * 999)}`,
          }));

          setItems(sortedItems);
        } catch (err) {
          console.error('Intel retrieval failed:', err);
        } finally {
          setLoading(false);
        }
      }, 800);
    };
    fetchReadings();
  }, []);

  const selectedItem = items.find((i) => i.id === selectedId);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.author?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'UNREAD')
      return matchesSearch && item.status === 'ACTIVE';
    if (filterStatus === 'READ')
      return matchesSearch && item.status === 'COMPLETED';
    return matchesSearch;
  });

  useEffect(() => {
    if (selectedItem) {
      // Update globe color based on item status
      setGlobeColor(
        selectedItem.status === 'ACTIVE'
          ? currentTheme.globeActive
          : currentTheme.globe,
      );
    } else {
      setGlobeColor(currentTheme.globe);
    }
  }, [selectedItem, currentTheme]);

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '').toUpperCase();
    } catch {
      return 'UNKNOWN_NET';
    }
  };

  return (
    <div
      className={`min-h-screen bg-black ${currentTheme.primary} font-mono ${currentTheme.selection} selection:text-black overflow-hidden relative flex flex-col`}
    >
      <Seo
        title="Mission Logs // Intel | Fezcodex"
        description="Classified operational intelligence and briefing materials."
        keywords={['Fezcodex', 'intel', 'mission', 'logs', 'reading']}
      />
      {/* HUD Overlays */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      <div
        className={`pointer-events-none fixed inset-0 z-50 bg-gradient-to-b from-transparent ${currentTheme.decoration} to-transparent bg-[length:100%_4px] animate-scanline`}
      ></div>
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

      {/* Top HUD Bar */}
      <header
        className={`flex-none flex items-center justify-between px-6 py-4 border-b-2 ${currentTheme.borderMain30} relative z-50 bg-black/80 backdrop-blur-md`}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`group flex items-center gap-2 text-xs font-bold ${currentTheme.accent} ${currentTheme.primaryHover} transition-colors uppercase tracking-[0.2em]`}
          >
            <ArrowLeft weight="bold" />
            <span>Abort</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 text-xs font-bold ${currentTheme.accent} ${currentTheme.primaryHover} transition-colors uppercase tracking-[0.2em] border ${currentTheme.borderMain30} px-3 py-1 hover:${currentTheme.bgMain10}`}
          >
            {theme === 'matrix' ? (
              <Radioactive weight="bold" />
            ) : (
              <TerminalWindow weight="bold" />
            )}
            <span>
              {theme === 'matrix' ? 'PROT: MATRIX' : 'PROT: NEW_VEGAS'}
            </span>
          </button>
        </div>

        <div className="text-right">
          <h1
            className={`text-2xl md:text-3xl font-black tracking-tighter ${currentTheme.primary} uppercase glitch-text`}
            data-text="MISSION_INTEL"
          >
            MISSION_INTEL
          </h1>
          <div
            className={`flex justify-end gap-4 text-[10px] tracking-widest ${currentTheme.accent} mt-1`}
          >
            <span className="flex items-center gap-1">
              <WifiHigh weight="bold" className="animate-pulse" /> NETWORK:
              SECURE
            </span>
            <span className="flex items-center gap-1">
              <ShieldChevron weight="bold" /> ENCRYPTION: AES-256
            </span>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <div className="flex-grow relative z-10 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Intel Feed (Scrollable) */}
        <div
          className={`w-full lg:w-5/12 xl:w-4/12 flex flex-col border-r ${currentTheme.borderMain20} bg-black/50 overflow-hidden relative`}
        >
          <div
            className={`flex-none flex flex-col px-4 py-3 ${currentTheme.bgMain10} border-b ${currentTheme.borderMain20}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`text-xs uppercase tracking-widest ${currentTheme.textDim600}`}
              >
                Feed // {filteredItems.length} Packets
              </span>
              <Crosshair
                className={`${currentTheme.textMain50} spin-slow`}
                size={20}
              />
            </div>

            {/* Search and Filter Controls */}
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <MagnifyingGlass
                  className={`absolute left-2 top-1/2 -translate-y-1/2 ${currentTheme.textDim600}`}
                  size={14}
                />
                <input
                  type="text"
                  placeholder="SEARCH INTEL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-black/50 border ${currentTheme.borderMain30} pl-8 pr-2 py-1 text-xs font-mono uppercase focus:outline-none focus:${currentTheme.borderMain50} ${currentTheme.primary} placeholder:${currentTheme.textMain50}`}
                />
              </div>
              <div className="relative">
                <div
                  className={`flex items-center border ${currentTheme.borderMain30} bg-black/50`}
                >
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-2 py-1 text-[10px] uppercase transition-colors ${filterStatus === 'ALL' ? `${currentTheme.bgMain20} ${currentTheme.textBright} font-bold` : `${currentTheme.textDim600} hover:${currentTheme.textBright}`}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('UNREAD')}
                    className={`px-2 py-1 text-[10px] uppercase border-l ${currentTheme.borderMain20} transition-colors ${filterStatus === 'UNREAD' ? `${currentTheme.bgMain20} ${currentTheme.textBright} font-bold` : `${currentTheme.textDim600} hover:${currentTheme.textBright}`}`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilterStatus('READ')}
                    className={`px-2 py-1 text-[10px] uppercase border-l ${currentTheme.borderMain20} transition-colors ${filterStatus === 'READ' ? `${currentTheme.bgMain20} ${currentTheme.textBright} font-bold` : `${currentTheme.textDim600} hover:${currentTheme.textBright}`}`}
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-24 scrollbar-hide">
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-16 ${currentTheme.bgMain05} border-l-2 ${currentTheme.borderMain20} animate-pulse rounded-r-sm`}
                  />
                ))}
                <div
                  className={`text-center text-xs animate-pulse mt-4 ${currentTheme.primary}`}
                >
                  DECRYPTING PACKETS...
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <IntelCard
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                  getDomain={getDomain}
                  theme={currentTheme}
                />
              ))
            ) : (
              <div
                className={`text-center mt-10 text-xs ${currentTheme.textDim600} uppercase tracking-widest`}
              >
                No Intel Found
              </div>
            )}
          </div>
        </div>
        {/* RIGHT: Tactical Briefing (Fixed/Sticky) */}
        <div className="hidden lg:flex flex-1 relative bg-black flex-col">
          {/* Tactical Globe Background */}
          <div className="absolute inset-0 z-0">
            <TacticalGlobe
              className="w-full h-full opacity-40"
              accentColor={globeColor}
            />
            {/* Grid Overlay on Globe */}
            <div
              className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${theme === 'matrix' ? 'rgba(16,185,129,0.05)' : 'rgba(245, 158, 11, 0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'matrix' ? 'rgba(16,185,129,0.05)' : 'rgba(245, 158, 11, 0.05)'} 1px, transparent 1px)`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>
          </div>

          {/* Briefing Content Overlay */}
          <div className="relative z-10 flex-grow flex flex-col justify-center p-12 pointer-events-none">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-black/80 backdrop-blur-md border ${currentTheme.borderMain30} p-8 max-w-3xl w-full mx-auto pointer-events-auto relative overflow-hidden`}
              >
                {/* Decorative Corners */}
                <CornersOut
                  className={`absolute top-0 left-0 ${currentTheme.primary} m-2`}
                  weight="bold"
                />
                <CornersOut
                  className={`absolute top-0 right-0 ${currentTheme.primary} m-2 rotate-90`}
                  weight="bold"
                />
                <CornersOut
                  className={`absolute bottom-0 right-0 ${currentTheme.primary} m-2 rotate-180`}
                  weight="bold"
                />
                <CornersOut
                  className={`absolute bottom-0 left-0 ${currentTheme.primary} m-2 -rotate-90`}
                  weight="bold"
                />

                <button
                  onClick={() => setSelectedId(null)}
                  className={`absolute top-2 right-2 z-20 ${currentTheme.primary} hover:text-white transition-colors bg-black/50 p-1 border border-transparent hover:border-current`}
                  title="Close Briefing"
                >
                  <X weight="bold" size={16} />
                </button>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold tracking-widest border ${
                          selectedItem.status === 'ACTIVE'
                            ? 'text-red-500 border-red-500 bg-red-500/10'
                            : `${currentTheme.primary} ${currentTheme.primaryBorder} ${currentTheme.bgMain10}`
                        }`}
                      >
                        <ScrambleText
                          text={
                            selectedItem.status === 'ACTIVE' ? 'UNREAD' : 'READ'
                          }
                        />{' '}
                        STATUS
                      </span>
                      <span
                        className={`text-[10px] ${currentTheme.textDim600} tracking-widest font-mono`}
                      >
                        ID:{' '}
                        <ScrambleText
                          text={`INTEL-${selectedItem.id}-${selectedItem.sector}`}
                        />
                      </span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
                      <ScrambleText text={selectedItem.title} speed={20} />
                    </h2>
                  </div>
                  <div
                    className={`text-right font-mono text-xs ${currentTheme.textMain60}`}
                  >
                    <div>
                      <MapPin className="inline mr-1" />{' '}
                      <ScrambleText
                        text={`${selectedItem.lat}, ${selectedItem.lng}`}
                      />
                    </div>
                    <div className="mt-1">
                      <Clock className="inline mr-1" /> {selectedItem.date}
                    </div>
                  </div>
                </div>

                <div
                  className={`border-t ${currentTheme.borderMain20} py-6 mb-6`}
                >
                  <h3
                    className={`text-[10px] ${currentTheme.accent} uppercase tracking-[0.2em] mb-2 flex items-center gap-2`}
                  >
                    <FileText /> Mission Briefing
                  </h3>
                  <p
                    className={`${currentTheme.textBody} font-mono text-sm leading-relaxed max-h-40 overflow-y-auto scrollbar-hide`}
                  >
                    {selectedItem.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className={`${currentTheme.bgMain20} p-3 border ${currentTheme.borderMain10} flex items-center gap-3`}
                  >
                    <User
                      className={currentTheme.primary.split(' ')[0]}
                      size={24}
                    />
                    <div>
                      <div
                        className={`text-[9px] ${currentTheme.accent} uppercase tracking-widest`}
                      >
                        Operative
                      </div>
                      <div
                        className={`${currentTheme.textBright} text-xs font-bold uppercase`}
                      >
                        {selectedItem.author}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${currentTheme.bgMain20} p-3 border ${currentTheme.borderMain10} flex items-center gap-3`}
                  >
                    <ShareNetwork
                      className={currentTheme.primary.split(' ')[0]}
                      size={24}
                    />
                    <div className="truncate w-full">
                      <div
                        className={`text-[9px] ${currentTheme.accent} uppercase tracking-widest`}
                      >
                        Uplink
                      </div>
                      <div
                        className={`${currentTheme.textBright} text-xs font-bold uppercase truncate`}
                      >
                        {getDomain(selectedItem.link)}
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center w-full ${currentTheme.primaryBg} text-black hover:bg-white border ${currentTheme.primaryBorder} py-3 uppercase font-bold tracking-[0.2em] transition-all duration-300`}
                >
                  <span>Initialize Connection</span>
                  <CaretRight
                    weight="bold"
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>
            ) : (
              <div
                className="h-full flex flex-col items-center justify-center text-emerald-800 gap-4 pointer-events-none pb-32"
                style={{ color: theme === 'fallout' ? '#92400e' : '#065f46' }}
              >
                <LockKey
                  size={80}
                  weight="duotone"
                  className="animate-pulse opacity-50"
                />
                <div className="text-center">
                  <div className="tracking-[0.5em] text-sm font-bold">
                    AWAITING TARGET SELECTION
                  </div>
                  <div className="text-xs mt-2 opacity-60">
                    SELECT INTEL PACKET TO DECRYPT
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 ${currentTheme.glitchShadow1};
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 ${currentTheme.glitchShadow2};
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% {
            clip: rect(38px, 9999px, 81px, 0);
          }
          5% {
            clip: rect(10px, 9999px, 86px, 0);
          }
          100% {
            clip: rect(69px, 9999px, 14px, 0);
          }
        }
        @keyframes glitch-anim2 {
          0% {
            clip: rect(21px, 9999px, 7px, 0);
          }
          5% {
            clip: rect(96px, 9999px, 90px, 0);
          }
          100% {
            clip: rect(8px, 9999px, 4px, 0);
          }
        }
        @keyframes scanline {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const IntelCard = ({ item, isSelected, onClick, getDomain, theme }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        x: 5,
        backgroundColor:
          theme.id === 'matrix'
            ? 'rgba(16, 185, 129, 0.05)'
            : 'rgba(245, 158, 11, 0.05)',
      }}
      className={`relative border-l-2 cursor-pointer overflow-hidden transition-all duration-300 group
            ${
              isSelected
                ? `${theme.bgMain10} ${theme.textBright.replace('text-', 'border-')}`
                : `bg-transparent ${theme.borderDim30} ${theme.primaryBorderHover.replace('hover:text-', 'hover:border-').replace('text-', 'border-')}`
            } p-4 mb-2`}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${item.status === 'ACTIVE' ? 'bg-red-500 animate-pulse' : theme.primaryBg}`}
              />
              <span
                className={`text-[10px] ${theme.accent} tracking-widest font-mono`}
              >
                {item.date}
              </span>
            </div>
            {isSelected && (
              <span
                className={`text-[9px] ${theme.primaryBg} text-black px-1 font-bold`}
              >
                SELECTED
              </span>
            )}
          </div>

          <h3
            className={`font-bold uppercase tracking-wider text-sm leading-tight mt-1 transition-colors truncate ${isSelected ? 'text-white' : `${theme.primary} ${theme.primaryHover.replace('hover:text-', 'group-hover:text-').replace('400', '300')}`}`}
          >
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[9px] font-mono ${theme.textDim800} ${theme.textDim600.replace('text-', 'group-hover:text-')} uppercase border ${theme.borderDim30} px-1`}
            >
              {getDomain(item.link)}
            </span>
            <span
              className={`text-[9px] font-mono ${theme.textDim800} uppercase`}
            >
              {item.clearance}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReadingPage;
