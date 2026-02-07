import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  WavesIcon,
  BroadcastIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  InfoIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import CustomSlider from '../../components/CustomSlider';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const THEMES = {
  default: {
    color: '#0a1a0a',
    secondary: '#050505',
    glow: '#00ff00',
    horizon: 'linear-gradient(to top, #050505, #0a1a0a)',
  },
  genesis: {
    color: '#ffd700',
    secondary: '#1a0f00',
    glow: '#ffdf00',
    horizon: 'linear-gradient(to top, #cc8400, #ffdf00)',
  },
  biolume: {
    color: '#00ff7f',
    secondary: '#0a001a',
    glow: '#00ff7f',
    horizon: 'linear-gradient(to top, #004d26, #00ff7f)',
  },
  void: {
    color: '#9370db',
    secondary: '#05000a',
    glow: '#9370db',
    horizon: 'linear-gradient(to top, #000000, #4b0082)',
  },
  flare: {
    color: '#ff4500',
    secondary: '#1a0500',
    glow: '#ff4500',
    horizon: 'linear-gradient(to top, #800000, #ff4500)',
  },
  nebula: {
    color: '#00bfff',
    secondary: '#000a1a',
    glow: '#00bfff',
    horizon: 'linear-gradient(to top, #003366, #00bfff)',
  },
};

const VoyagerTerminalPage = () => {
  const [frequency, setFrequency] = useState(440);
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [signalLocked, setSignalLocked] = useState(false);
  const [telemetry, setTelemetry] = useState(
    'SYSTEM BOOT... INITIALIZING RECEIVER.',
  );
  const [volume, setVolume] = useState(0.3);
  const [targets, setTargets] = useState([]);
  const [signalStrength, setSignalStrength] = useState(0);
  const [activeTheme, setActiveTheme] = useState('default');

  // Audio Refs
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const lfoRef = useRef(null);
  const gainRef = useRef(null);
  const noiseRef = useRef(null);

  // Canvas Ref for Oscilloscope
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize random targets on mount
  useEffect(() => {
    const pool = [
      {
        msg: 'NON-TERRESTRIAL HEARTBEAT DETECTED. BIOLOGICAL ORIGIN PROBABLE.',
        theme: 'biolume',
      },
      {
        msg: 'VOYAGER 1 PING RECEIVED. STATUS: BEYOND HELIOPAUSE.',
        theme: 'nebula',
      },
      {
        msg: 'REPEATING FAST RADIO BURST (FRB). FREQUENCY: 1.4 GHz.',
        theme: 'flare',
      },
      {
        msg: 'EXTRAGALACTIC NEUTRINO FLUX DETECTED. ORIGIN: BLAZAR.',
        theme: 'flare',
      },
      {
        msg: 'ENCRYPTED BINARY STREAM INTERCEPTED. DECRYPTING...',
        theme: 'void',
      },
      {
        msg: 'GRAVITATIONAL WAVE ANOMALY. SOURCE: BLACK HOLE MERGER.',
        theme: 'void',
      },
      {
        msg: 'SCHUMANN RESONANCE OSCILLATION. SOURCE: PLANETARY CORE.',
        theme: 'biolume',
      },
      {
        msg: 'HYPER-DIMENSIONAL BURST. SPATIAL RIFT SUSPECTED.',
        theme: 'void',
      },
      {
        msg: 'ANOMALOUS WHISTLER WAVE. ORIGIN: IONOSPHERIC DISCHARGE.',
        theme: 'nebula',
      },
      {
        msg: 'DISTANT PROBE RECOVERY PING. UNIT: PIONEER 10.',
        theme: 'nebula',
      },
      {
        msg: 'STELLAR NUCLEOSYNTHESIS HARMONIC. VECTOR: ANDROMEDA.',
        theme: 'genesis',
      },
      {
        msg: 'VOYAGER 2 DATA STREAM. STATUS: DEEP INTERSTELLAR SPACE.',
        theme: 'nebula',
      },
    ];
    const newTargets = [
      {
        freq: Math.floor(Math.random() * 400) + 100,
        msg: 'CMB RADIATION PEAK. ECHO OF CREATION.',
        theme: 'genesis',
      },
      {
        freq: Math.floor(Math.random() * 500) + 600,
        ...pool[Math.floor(Math.random() * pool.length)],
      },
      {
        freq: Math.floor(Math.random() * 800) + 1200,
        ...pool[Math.floor(Math.random() * pool.length)],
      },
    ];
    setTargets(newTargets);
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = 0;
      gainRef.current.connect(audioCtxRef.current.destination);

      const bufferSize = 2 * audioCtxRef.current.sampleRate;
      const noiseBuffer = audioCtxRef.current.createBuffer(
        1,
        bufferSize,
        audioCtxRef.current.sampleRate,
      );
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      noiseRef.current = audioCtxRef.current.createBufferSource();
      noiseRef.current.buffer = noiseBuffer;
      noiseRef.current.loop = true;
      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      noiseRef.current.connect(filter);
      filter.connect(gainRef.current);
      noiseRef.current.start();

      oscRef.current = audioCtxRef.current.createOscillator();
      oscRef.current.type = 'sine';
      oscRef.current.frequency.value = frequency;
      lfoRef.current = audioCtxRef.current.createOscillator();
      lfoRef.current.frequency.value = 0;
      const lfoGain = audioCtxRef.current.createGain();
      lfoGain.gain.value = 0.5;
      lfoRef.current.connect(lfoGain);
      lfoGain.connect(oscRef.current.frequency);
      lfoRef.current.start();
      oscRef.current.connect(gainRef.current);
      oscRef.current.start();
    }
  };

  const togglePower = () => {
    if (!isPowerOn) {
      initAudio();
      gainRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current.currentTime,
        0.1,
      );
    } else if (gainRef.current) {
      gainRef.current.gain.setTargetAtTime(
        0,
        audioCtxRef.current.currentTime,
        0.1,
      );
    }
    setIsPowerOn(!isPowerOn);
  };

  useEffect(() => {
    if (oscRef.current && isPowerOn) {
      oscRef.current.frequency.setTargetAtTime(
        frequency,
        audioCtxRef.current.currentTime,
        0.05,
      );
      let maxStrength = 0;
      let matchedTarget = null;
      targets.forEach((t) => {
        const diff = Math.abs(frequency - t.freq);
        const strength = Math.max(0, 100 - diff * 2);
        if (strength > maxStrength) {
          maxStrength = strength;
          if (strength > 90) matchedTarget = t;
        }
      });
      setSignalStrength(maxStrength);
      if (matchedTarget) {
        setSignalLocked(true);
        setTelemetry(`SIGNAL LOCKED: ${matchedTarget.msg}`);
        setActiveTheme(matchedTarget.theme);
        if (lfoRef.current) lfoRef.current.frequency.value = 5;
      } else {
        setSignalLocked(false);
        setActiveTheme('default');
        const targetList = targets.map((t) => t.freq).join(', ');
        setTelemetry(`SEARCHING... [ANOMALIES DETECTED NEAR: ${targetList}]`);
        if (lfoRef.current) lfoRef.current.frequency.value = 0;
      }
    }
  }, [frequency, isPowerOn, targets]);

  const drawScope = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    if (isPowerOn) {
      ctx.beginPath();
      const themeColors = {
        default: '#00ff00',
        genesis: '#ffdf00',
        biolume: '#00ff7f',
        void: '#9370db',
        flare: '#ff4500',
        nebula: '#00bfff',
      };
      ctx.strokeStyle = themeColors[activeTheme] || '#00ff00';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;
      const sliceWidth = width / 100;
      let x = 0;
      for (let i = 0; i < 100; i++) {
        const noise = (Math.random() - 0.5) * (signalLocked ? 5 : 40);
        const sine =
          Math.sin(i * (frequency / 100) + Date.now() / 50) *
          (signalLocked ? 60 : 20);
        const y = height / 2 + sine + noise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    }
    animationRef.current = requestAnimationFrame(drawScope);
  }, [isPowerOn, frequency, signalLocked, activeTheme]);

  useEffect(() => {
    drawScope();
    return () => cancelAnimationFrame(animationRef.current);
  }, [drawScope]);

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center justify-center font-mono text-[#00ff00] relative overflow-hidden">
      <Seo
        title="The Voyager Terminal | Fezcodex"
        description="Intercept deep space signals with this analog 1970s telemetry receiver."
        keywords={[
          'voyager',
          'nasa',
          'space',
          'radio',
          'oscilloscope',
          'analog',
          'signals',
        ]}
      />
      {/* FULL PLANETARY SCENERY BACKDROP */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        {/* Deep Space / Atmospheric sky */}
        <motion.div
          animate={{
            background: `linear-gradient(to bottom, ${THEMES[activeTheme].secondary} 0%, ${THEMES[activeTheme].color}88 100%)`,
          }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        />

        {/* Starfield */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'url(https://www.transparenttextures.com/patterns/stardust.png)',
          }}
        />

        {/* THE PLANET HORIZON */}
        <motion.div
          animate={{
            y: signalLocked ? '0%' : '100%',
            opacity: signalLocked ? 1 : 0,
            scale: signalLocked ? 1 : 1.2,
          }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute bottom-0 left-[-10%] right-[-10%] h-[60vh] rounded-t-[100%] shadow-[0_-50px_200px_rgba(0,0,0,0.5)]"
          style={{
            background: THEMES[activeTheme].horizon,
            boxShadow: `inset 0 100px 100px rgba(255,255,255,0.1), 0 -50px 150px ${THEMES[activeTheme].color}44`,
          }}
        >
          {/* Surface Texture */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay rounded-t-[100%]"
            style={{
              backgroundImage:
                'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)',
            }}
          />

          {/* Atmospheric Glow on Horizon */}
          <div className="absolute top-0 left-0 right-0 h-20 rounded-t-[100%] bg-white/10 blur-xl" />
        </motion.div>

        {/* Distant Glows */}
        <motion.div
          animate={{ backgroundColor: THEMES[activeTheme].glow }}
          className="absolute top-0 left-0 w-full h-1/2 opacity-5 blur-[120px]"
        />
      </div>

      {/* Return Link */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/apps"
          className="flex items-center gap-2 text-[#00ff00] hover:text-white transition-colors opacity-50 hover:opacity-100 uppercase text-xs tracking-[0.3em]"
        >
          <ArrowLeftIcon weight="bold" />
          <span>Abort Mission</span>
        </Link>
      </div>

      {/* Main Panel Box */}
      <div className="relative bg-[#2a2a2a] border-[8px] border-[#333] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden max-w-5xl w-full flex flex-col md:flex-row z-10">
        <div
          className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              'url(https://www.transparenttextures.com/patterns/brushed-alum.png)',
          }}
        />

        {/* Left Side: Visuals & Telemetry */}
        <div className="flex-1 p-8 border-r-4 border-[#333]">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <BreadcrumbTitle
                title="VOYAGER_TERML_V1"
                slug="vt"
                variant="brutalist"
                className="!text-[#00ff00]"
              />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Deep Space Intercept Module
              </p>
            </div>
            <div
              className={`w-4 h-4 rounded-full ${isPowerOn ? 'bg-red-600 shadow-[0_0_10px_red] animate-pulse' : 'bg-gray-800'}`}
            />
          </div>

          <div className="relative aspect-video bg-black border-4 border-[#444] rounded-lg overflow-hidden shadow-inner mb-8">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full h-full"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-green-900/20" />
            <div className="absolute top-2 right-2 flex gap-2">
              <WavesIcon
                size={16}
                className={isPowerOn ? 'animate-bounce' : 'opacity-20'}
              />
              <BroadcastIcon
                size={16}
                className={isPowerOn ? 'animate-pulse' : 'opacity-20'}
              />
            </div>
          </div>

          <div className="bg-black/50 p-6 border-2 border-[#00ff00]/20 rounded-md font-mono text-sm leading-relaxed min-h-[160px] shadow-inner relative overflow-hidden">
            <div className="absolute top-2 right-4 text-[10px] opacity-30">
              DATA_STREAM
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-5 animate-crt-flicker bg-[#00ff00]" />
            <motion.div
              key={telemetry}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`relative z-10 ${signalLocked ? 'text-[#ffaa00]' : 'text-[#00ff00]'}`}
            >
              {`> ${telemetry}`}
            </motion.div>
            {isPowerOn && (
              <div className="mt-6 space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] opacity-50 uppercase">
                    Strength:
                  </span>
                  <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden border border-[#00ff00]/20">
                    <motion.div
                      className={`h-full ${signalStrength > 80 ? 'bg-[#ffaa00]' : 'bg-[#00ff00]'}`}
                      animate={{ width: `${signalStrength}%` }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] w-8 font-bold">
                    {Math.round(signalStrength)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[10px] opacity-60">
                  <div>LAT: 14.23984</div>
                  <div>VEL: 17.02 KM/S</div>
                  <div>TEMP: -270.45 C</div>
                  <div>
                    STATUS: {signalLocked ? 'LOCK_STABLE' : 'SCANNING...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-full md:w-80 bg-[#222] p-8 flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] mb-4 text-gray-500 font-bold uppercase tracking-[0.2em]">
              System Power
            </span>
            <button
              onClick={togglePower}
              className={`w-16 h-24 rounded-lg border-4 border-[#444] flex flex-col items-center justify-between p-2 transition-all ${isPowerOn ? 'bg-[#333] shadow-inner' : 'bg-[#444] shadow-lg'}`}
            >
              <div
                className={`w-full h-1/2 rounded ${!isPowerOn ? 'bg-[#555] shadow-md' : 'bg-[#222]'}`}
              />
              <div
                className={`w-full h-1/2 rounded ${isPowerOn ? 'bg-[#ff3300] shadow-[0_0_10px_#ff3300]' : 'bg-[#222]'}`}
              />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <span>Frequency</span>
              <span className="text-[#00ff00]">{frequency} MHz</span>
            </div>
            <CustomSlider
              min={100}
              max={2000}
              value={frequency}
              onChange={setFrequency}
              variant="brutalist"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <div className="flex items-center gap-2">
                {volume > 0 ? (
                  <SpeakerHighIcon size={14} />
                ) : (
                  <SpeakerSlashIcon size={14} />
                )}
                <span>Gain</span>
              </div>
              <span className="text-[#00ff00]">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <CustomSlider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(val) => {
                setVolume(val);
                if (gainRef.current)
                  gainRef.current.gain.setTargetAtTime(
                    val,
                    audioCtxRef.current.currentTime,
                    0.05,
                  );
              }}
              variant="brutalist"
            />
          </div>
          <div className="mt-auto pt-8 border-t border-[#333] flex flex-col gap-4">
            <div className="bg-black/30 p-3 rounded border border-[#00ff00]/10 text-[9px] leading-relaxed text-gray-500">
              <div className="flex gap-2 mb-1 text-white opacity-80">
                <InfoIcon size={14} />
                <span>OPERATOR MANUAL v1.9</span>
              </div>
              THIS TERMINAL INTERCEPTS DEEP SPACE TELEMETRY. SCAN THE FREQUENCY
              BAND TO ISOLATE ANOMALIES. TARGETS ARE DYNAMIC PER SESSION. WATCH
              THE STRENGTH METER FOR SIGNAL PROXIMITY.
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @keyframes crt-flicker {
          0% {
            opacity: 0.05;
          }
          5% {
            opacity: 0.02;
          }
          10% {
            opacity: 0.08;
          }
          15% {
            opacity: 0.04;
          }
          20% {
            opacity: 0.01;
          }
          25% {
            opacity: 0.06;
          }
          100% {
            opacity: 0.05;
          }
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
        canvas::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.06),
              rgba(0, 255, 0, 0.02),
              rgba(0, 0, 255, 0.06)
            );
          background-size:
            100% 2px,
            3px 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default VoyagerTerminalPage;
