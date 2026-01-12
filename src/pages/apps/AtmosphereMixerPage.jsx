import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  CloudRainIcon,
  TreeIcon,
  CoffeeIcon,
  WindIcon,
  PlayIcon
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const SOUNDS = [
  { id: 'rain', label: 'Urban Rain', icon: CloudRainIcon, url: '/sounds/rain.mp3' },
  { id: 'forest', label: 'Nocturnal Forest', icon: TreeIcon, url: '/sounds/forest.mp3' },
  { id: 'coffee', label: 'Static', icon: CoffeeIcon, url: '/sounds/static.mp3' },
  { id: 'wind', label: 'Wind', icon: WindIcon, url: '/sounds/wind.mp3' },
];

const AtmosphereMixerPage = () => {
  const appName = 'Atmosphere Mixer';

  const { addToast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [volumes, setVolumes] = useState({ rain: 0.3, forest: 0, coffee: 0, wind: 0.1 });
  const [mutedSounds, setMutedSounds] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRefs = useRef({});

  const initializeAudio = () => {
    setIsInitialized(true);
    const defaultVolumes = { rain: 0.3, forest: 0, coffee: 0, wind: 0.1 };
    setVolumes(defaultVolumes);

    // Give it a small tick to ensure state might be starting to propagate or just handle it directly
    Object.keys(audioRefs.current).forEach((id) => {
      const audio = audioRefs.current[id];
      if (audio) {
        const vol = defaultVolumes[id] || 0;
        audio.volume = vol;
        // Start all but pause those with 0 volume
        // Actually browsers prefer if you play everything after user interaction
        audio.play().then(() => {
          if (vol === 0) {
            audio.pause();
          }
        }).catch((e) => {
          console.error(`Error playing ${id}:`, e);
        });
      }
    });
    addToast({
      title: 'Audio Initialized',
      message: 'Soundscape engine is now active.',
    });
  };

  const toggleSoundMute = (id) => {
    setMutedSounds(prev => {
      const newMuted = { ...prev, [id]: !prev[id] };
      const audio = audioRefs.current[id];
      if (audio) {
        audio.volume = newMuted[id] || isMuted ? 0 : volumes[id];
      }
      return newMuted;
    });
  };

  const handleVolumeChange = useCallback((id, value) => {
    const vol = parseFloat(value);
    setVolumes(prev => ({ ...prev, [id]: vol }));

    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = isMuted || mutedSounds[id] ? 0 : vol;
      if (vol > 0 && isInitialized) {
        audio.play().catch(() => {});
      } else if (vol === 0) {
        audio.pause();
      }
    }
  }, [isMuted, isInitialized, mutedSounds]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Object.keys(volumes).forEach(id => {
      if (audioRefs.current[id]) {
        audioRefs.current[id].volume = newMuted || mutedSounds[id] ? 0 : volumes[id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Atmosphere Mixer | Fezcodex"
        description="Protocol for soundscape calibration. Blend background environments to create your ideal focus space."
        keywords={['Fezcodex', 'ambient noise', 'focus music', 'white noise', 'atmosphere mixer']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Atmosphere Mixer" slug="am" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Soundscape calibration protocol. Mix environmental layers to generate a balanced auditory background for focus and clarity.
              </p>
            </div>

            <div className="flex gap-4">
              {!isInitialized ? (
                <div className="flex gap-2">
                  <button
                    onClick={initializeAudio}
                    className="group relative inline-flex items-center gap-4 px-10 py-6 bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
                  >
                    <PlayIcon weight="fill" size={24} />
                    <span>Start Engine</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleMute}
                  className={`group relative inline-flex items-center gap-4 px-10 py-6 border transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0 ${isMuted ? 'bg-red-500 text-black border-red-400' : 'bg-white text-black border-white hover:bg-emerald-500'}`}
                >
                  {isMuted ? <SpeakerSlashIcon weight="bold" size={24} /> : <SpeakerHighIcon weight="bold" size={24} />}
                  <span>{isMuted ? 'System Silent' : 'System Active'}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + Object.values(volumes).join('')} className="w-full h-full" />
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 h-96">
                {SOUNDS.map((sound) => (
                  <div key={sound.id} className="flex flex-col items-center gap-8 h-full">
                    <div className="flex-1 w-full relative">
                      <div className="absolute inset-0 flex justify-center items-center">
                        {/* Container for vertical range */}
                        <div className="w-16 h-full bg-black/40 border border-white/5 rounded-sm relative overflow-hidden flex flex-col justify-end">
                          <motion.div
                            initial={false}
                            animate={{ height: `${volumes[sound.id] * 100}%` }}
                            className="w-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volumes[sound.id]}
                            onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            style={{
                              WebkitAppearance: 'none',
                              writingMode: 'bt-lr', /* IE/Edge */
                              transform: 'rotate(-90deg)',
                              width: '384px', /* Match height of container (h-96 = 24rem = 384px) */
                              height: '64px', /* Match width of container (w-16 = 4rem = 64px) */
                              position: 'absolute',
                              top: '160px', /* Centering logic for rotated element */
                              left: '-160px'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSoundMute(sound.id)}
                      className="text-center space-y-2 mt-4 group/icon"
                    >
                      <sound.icon
                        size={32}
                        weight={volumes[sound.id] > 0 && !mutedSounds[sound.id] ? "fill" : "regular"}
                        className={`mx-auto transition-colors ${volumes[sound.id] > 0 && !mutedSounds[sound.id] ? 'text-emerald-500' : 'text-gray-600'} group-hover/icon:text-white`}
                      />
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-gray-500">{sound.label}</span>
                      <span className={`block font-black ${mutedSounds[sound.id] ? 'text-red-500 line-through' : 'text-white'}`}>
                        {Math.round(volumes[sound.id] * 100)}%
                      </span>
                    </button>

                    <audio
                      ref={el => audioRefs.current[sound.id] = el}
                      src={sound.url}
                      loop
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-12">
            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <SpeakerHighIcon size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                {isInitialized ?
                  "Environmental audio layering is active. Adjust the vertical sliders to calibrate the intensity of each channel." :
                  "Engine standby. Initialize the soundscape protocol to begin audio transmission."}
              </p>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Audio_Matrix_v0.6.2</span>
          <span className="text-gray-800">MIXER_STATUS // {Object.values(volumes).some(v => v > 0) && !isMuted ? 'BROADCASTING' : 'STANDBY'}</span>
        </footer>
      </div>
    </div>
  );
};

export default AtmosphereMixerPage;