import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CloudRainIcon,
  CloudSnowIcon,
  FireIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon, WindIcon
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';

const CozyAppPage = () => {
  useSeo({
    title: 'Cozy Corner | Fezcodex',
    description: 'A place to relax, watch a fire, snow, rain, or just breathe.',
    keywords: [
      'cozy',
      'relax',
      'fire',
      'snow',
      'rain',
      'breathe',
      'meditation',
    ],
  });

  const [mode, setMode] = useState('fireplace'); // fireplace, breathe, snow, rain
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Audio Engine ---
  useEffect(() => {
    const cleanupAudio = () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };

    if (isMuted || mode === 'breathe') {
      cleanupAudio();
      return;
    }

    // Initialize Audio Context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // Create Master Gain (Volume)
    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.connect(ctx.destination);
    gainNodeRef.current.gain.value = 0.15; // Master volume

    // Generate Noise Buffer (Pink-ish Noise for nature sounds)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    // Source setup
    sourceNodeRef.current = ctx.createBufferSource();
    sourceNodeRef.current.buffer = noiseBuffer;
    sourceNodeRef.current.loop = true;

    // Filter setup based on mode
    const filter = ctx.createBiquadFilter();
    sourceNodeRef.current.connect(filter);
    filter.connect(gainNodeRef.current);

    if (mode === 'fireplace') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      gainNodeRef.current.gain.value = 0.15;
      // Simulate crackling? (Too complex for this simple setup, noise provides the "roar")
    } else if (mode === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      gainNodeRef.current.gain.value = 0.15;
    } else if (mode === 'snow') {
      filter.type = 'lowpass';
      filter.frequency.value = 200; // Deep, soft wind rumble
      gainNodeRef.current.gain.value = 0.05; // Very quiet and soothing
    }

    sourceNodeRef.current.start();

    return cleanupAudio;
  }, [mode, isMuted]);

  useEffect(() => {
    if (mode === 'breathe') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    let particleCount = 100;

    // Config based on mode
    if (mode === 'fireplace') particleCount = 300;
    if (mode === 'snow') particleCount = 200;
    if (mode === 'rain') particleCount = 500;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        if (mode === 'fireplace') {
          const spread = canvas.width * 0.5;
          this.x = canvas.width / 2 + (Math.random() - 0.5) * spread;
          this.y = canvas.height;
          this.size = Math.random() * 10 + 5;
          this.speedY = Math.random() * 5 + 2;
          this.speedX = (Math.random() - 0.5) * 2;
          this.color = `hsla(${Math.random() * 40 + 10}, 100%, 50%, ${Math.random() * 0.5 + 0.1})`;
          this.life = 150;
          this.decay = Math.random() * 0.5 + 0.2;
        } else if (mode === 'snow') {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height * -1; // Start above canvas
          this.size = Math.random() * 3 + 1;
          this.speedY = Math.random() * 1 + 0.5;
          this.speedX = (Math.random() - 0.5) * 0.5; // Gentle drift
          this.color = `hsla(0, 0%, 100%, ${Math.random() * 0.5 + 0.3})`;
        } else if (mode === 'rain') {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height * -1;
          this.size = Math.random() * 20 + 10; // Length of rain drop
          this.speedY = Math.random() * 10 + 15; // Fast
          this.speedX = 0;
          this.color = `hsla(210, 100%, 70%, ${Math.random() * 0.3 + 0.1})`;
        }
      }

      update() {
        this.x += this.speedX;
        this.y += (mode === 'fireplace' ? -1 : 1) * this.speedY; // Fire goes up, rain/snow goes down

        if (mode === 'fireplace') {
          this.size -= 0.1;
          this.life -= this.decay;
          if (this.size <= 0 || this.life <= 0) this.reset();
        } else {
          // Wrap around for snow/rain
          if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
          }
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        if (mode === 'rain') {
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y + this.size);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'fireplace') {
        // Draw log
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(
          canvas.width * 0.2,
          canvas.height - 20,
          canvas.width * 0.6,
          20,
        );
        ctx.globalCompositeOperation = 'screen';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col transition-colors duration-500">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col relative z-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8 justify-between">
          <Link
            to="/apps"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon /> Back to Apps
          </Link>
          <h1 className="text-3xl font-playfairDisplay font-bold tracking-wide text-amber-500">
            Cozy Corner
          </h1>
          <div className="flex gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full transition-colors mr-2 ${!isMuted ? 'bg-green-900/50 text-green-400' : 'text-gray-500 hover:bg-gray-800'}`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <SpeakerSlashIcon size={24} />
              ) : (
                <SpeakerHighIcon size={24} weight="fill" />
              )}
            </button>
            {/* Mode Toggles */}
            <button
              onClick={() => setMode('fireplace')}
              className={`p-2 rounded-full transition-colors ${mode === 'fireplace' ? 'bg-amber-900/50 text-amber-400' : 'text-gray-500 hover:bg-gray-800'}`}
              title="Fireplace"
            >
              <FireIcon
                size={24}
                weight={mode === 'fireplace' ? 'fill' : 'regular'}
              />
            </button>
            <button
              onClick={() => setMode('snow')}
              className={`p-2 rounded-full transition-colors ${mode === 'snow' ? 'bg-blue-900/50 text-blue-200' : 'text-gray-500 hover:bg-gray-800'}`}
              title="Snow"
            >
              <CloudSnowIcon
                size={24}
                weight={mode === 'snow' ? 'fill' : 'regular'}
              />
            </button>
            <button
              onClick={() => setMode('rain')}
              className={`p-2 rounded-full transition-colors ${mode === 'rain' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:bg-gray-800'}`}
              title="Rain"
            >
              <CloudRainIcon
                size={24}
                weight={mode === 'rain' ? 'fill' : 'regular'}
              />
            </button>
            <button
              onClick={() => setMode('breathe')}
              className={`p-2 rounded-full transition-colors ${mode === 'breathe' ? 'bg-cyan-900/50 text-cyan-400' : 'text-gray-500 hover:bg-gray-800'}`}
              title="Breathe"
            >
              <WindIcon
                size={24}
                weight={mode === 'breathe' ? 'fill' : 'regular'}
              />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow h-[80vh] relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          {mode !== 'breathe' && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="relative z-10 text-amber-200/50 font-mono text-sm select-none pointer-events-none mb-4">
                {mode === 'fireplace' && 'Warmth & comfort'}
                {mode === 'snow' && 'Silent snow'}
                {mode === 'rain' && 'Gentle rain'}
              </div>
            </div>
          )}

          {mode === 'breathe' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-cyan-500/20 rounded-full flex items-center justify-center animate-breathe relative">
                <div className="w-32 h-32 bg-cyan-400/30 rounded-full blur-md absolute animate-pulse-slow"></div>
                <span className="text-cyan-100 font-playfairDisplay text-xl z-10">
                  Breathe
                </span>
              </div>
              <p className="mt-8 text-cyan-200/60 font-mono text-sm">
                Inhale... Exhale...
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.5); }
            }
            .animate-breathe {
                animation: breathe 8s ease-in-out infinite;
            }
            @keyframes pulse-slow {
                 0%, 100% { opacity: 0.5; }
                 50% { opacity: 0.8; }
            }
            .animate-pulse-slow {
                animation: pulse-slow 4s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
};

export default CozyAppPage;
