import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CloudPlaylist from './components/CloudPlaylist';
import './CloudMusicPlayer.css';
import { useCloudMusic } from '../../../context/CloudMusicContext';
import { motion } from 'framer-motion';
import {
    PlusIcon, LinkIcon, PlayIcon, PauseIcon,
    SkipForwardIcon, SkipBackIcon, RepeatIcon,
    ShuffleIcon, SpeakerHighIcon, SpeakerSlashIcon, SpeakerLowIcon, SpeakerNoneIcon,
    WaveformIcon, ArrowLeftIcon, QuotesIcon
} from '@phosphor-icons/react';
import CustomSlider from '../../../components/CustomSlider';
import GenerativeArt from '../../../components/GenerativeArt';

const CloudMusicPlayer = () => {
  const {
      setPlaylist, playlist, currentTrack, isPlaying,
      togglePlay, nextTrack, prevTrack, seek,
      currentTime, duration,
      repeatMode, toggleRepeat,
      isShuffle, toggleShuffle,
      volume, setVolume, isMuted, toggleMute
  } = useCloudMusic();

  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  // Format time (mm:ss)
  const formatTime = (time) => {
      if (!time) return "00:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentTrack?.title || !currentTrack?.artist) {
          setLyrics('');
          return;
      }
      setLoadingLyrics(true);
      try {
        const response = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(currentTrack.artist)}&track_name=${encodeURIComponent(currentTrack.title)}`);
        if (response.ok) {
          const data = await response.json();
          setLyrics(data.plainLyrics || data.syncedLyrics?.replace(/\[\d+:\d+.\d+\]/g, '') || "LYRICS_NOT_FOUND");
        } else {
          setLyrics("LYRICS_NOT_FOUND");
        }
      } catch (err) {
        setLyrics("ERROR_FETCHING_DATA");
      } finally {
        setLoadingLyrics(false);
      }
    };

    if (showLyrics) {
      fetchLyrics();
    }
  }, [currentTrack, showLyrics]);

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!newUrl || !newTitle) return;

    setPlaylist([
      ...playlist,
      {
        title: newTitle,
        artist: newArtist || "UNKNOWN_ENTITY",
        url: newUrl,
        cover: null // Use GenerativeArt fallback
      }
    ]);
    setIsAdding(false);
    setNewUrl('');
    setNewTitle('');
    setNewArtist('');
  };

  const handleSeek = (val) => {
      seek(val);
  };

  const handleVolumeChange = (val) => {
      setVolume(val);
  };

  const getVolumeIcon = () => {
      if (isMuted || volume === 0) return <SpeakerSlashIcon size={20} />;
      if (volume < 0.3) return <SpeakerNoneIcon size={20} />;
      if (volume < 0.7) return <SpeakerLowIcon size={20} />;
      return <SpeakerHighIcon size={20} />;
  }

  return (
    <div className="min-h-screen relative font-mono bg-black text-cyan-500 selection:bg-cyan-500 selection:text-black py-24 px-6 md:px-12">

      {/* Generative Art Background */}
      <div className="absolute inset-0 z-0 opacity-50 filter hue-rotate-180 brightness-50 contrast-125 h-full w-full overflow-hidden">
         <GenerativeArt seed={currentTrack?.title || "AETHER_DECK"} className="w-full h-full" />
      </div>

      {/* CRT Scanlines & Vignette */}
      <div className="absolute inset-0 z-50 scanlines pointer-events-none h-full w-full"></div>

      {/* Background Grid */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none h-full w-full"
           style={{
               backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="mx-auto max-w-7xl relative z-30">
        <Link
          to="/apps"
          className="group inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-12"
        >
          <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
          <span>Exit_To_Center</span>
        </Link>

        {/* Main Deck Container */}
        <div className="w-full max-w-6xl h-auto md:h-[85vh] flex flex-col md:flex-row gap-6 mx-auto">

        {/* Left Column: Player Core */}
        <div className="w-full md:w-5/12 flex flex-col gap-4">

            {/* Header */}
            <div className="border-b-2 border-cyan-500/50 pb-2 mb-2 flex justify-between items-end bg-black/50 backdrop-blur-sm p-2">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white animate-pulse-fast drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                        AETHER<span className="text-cyan-500">_DECK</span>
                    </h1>
                    <p className="text-[10px] md:text-xs text-cyan-700 font-bold tracking-[0.3em] mt-1">
                        AUDIO_INTERFACE_V2.0
                    </p>
                </div>
                <div className="flex flex-col items-end text-[8px] md:text-[10px] text-cyan-800 font-bold">
                    <span>SYS: ONLINE</span>
                    <span>NET: CONNECTED</span>
                </div>
            </div>

            {/* Visualizer / Cover Art */}
            <div className="w-full aspect-square bg-black border-2 border-cyan-500/30 relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-10"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-10"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-10"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-10"></div>

                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

                {currentTrack?.cover ? (
                    <img
                        src={currentTrack.cover}
                        alt="cover"
                        className={`w-full h-full object-cover contrast-125 transition-all duration-700 opacity-80 ${!isPlaying ? 'grayscale' : 'grayscale-0'}`}
                    />
                ) : (
                    <div className={`w-full h-full ${!isPlaying ? 'grayscale opacity-50' : 'opacity-80'} transition-all duration-700`}>
                         <GenerativeArt seed={currentTrack?.title || "AETHER_DECK"} className="w-full h-full" />
                    </div>
                )}

                {/* Simulated Wave Visualizer Overlay */}
                {showVisualizer && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-screen">
                         {[...Array(6)].map((_, i) => (
                             <motion.div
                                key={i}
                                className="absolute border border-cyan-400 rounded-full opacity-0"
                                initial={{ width: "10%", height: "10%", opacity: 1, borderWidth: "4px" }}
                                animate={{
                                    width: ["10%", "160%"],
                                    height: ["10%", "160%"],
                                    opacity: [1, 0],
                                    borderWidth: ["4px", "1px"],
                                    scale: [1, 1 + Math.random() * 0.3]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: i * 0.4,
                                    repeatDelay: 0.2
                                }}
                                style={{
                                    boxShadow: `0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.4)`
                                }}
                             />
                         ))}
                         {/* Static Inner Distortion Circle */}
                         <motion.div
                            className="absolute w-1/3 h-1/3 border-4 border-cyan-300 rounded-full opacity-60"
                            animate={{
                                scale: [1, 1.2, 0.8, 1.3, 1],
                                rotate: [0, 120, -120, 240, 0],
                                borderRadius: ["50%", "30%", "70%", "40%", "50%"]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            style={{
                                boxShadow: `0 0 40px rgba(0, 255, 255, 0.6)`
                            }}
                         />
                    </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    <button
                        onClick={() => setShowLyrics(!showLyrics)}
                        className={`bg-black/80 border border-cyan-500 px-2 py-1 text-xs font-bold transition-colors ${showLyrics ? 'text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-cyan-800'}`}
                        title="Toggle Lyrics"
                    >
                        <QuotesIcon size={16} weight={showLyrics ? "fill" : "regular"} />
                    </button>
                    <button
                        onClick={() => setShowVisualizer(!showVisualizer)}
                        className={`bg-black/80 border border-cyan-500 px-2 py-1 text-xs font-bold transition-colors ${showVisualizer ? 'text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-cyan-800'}`}
                        title="Toggle Visualizer"
                    >
                        <WaveformIcon size={16} weight={showVisualizer ? "fill" : "regular"} />
                    </button>
                    <div className="bg-black/80 border border-cyan-500 px-2 py-1 text-xs text-cyan-400 font-bold">
                        {isPlaying ? 'PLAYING' : 'PAUSED'}
                    </div>
                </div>

                {/* Lyrics Display */}
                {showLyrics && (
                    <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col">
                        {/* Fixed Corner Accents for Lyrics */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-30"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-30"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-30"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-30"></div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start text-center custom-scrollbar">
                            {loadingLyrics ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-cyan-500 animate-pulse font-bold tracking-widest uppercase text-xs">
                                        [ FETCHING_LYRICS... ]
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full mt-8">
                                    <h3 className="text-[10px] text-cyan-700 font-bold mb-4 tracking-[0.5em] border-b border-cyan-900/50 pb-2 uppercase">
                                        DATA_STREAM: LYRICS
                                    </h3>
                                    <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-cyan-300">
                                        {lyrics || "NO_LYRICS_AVAILABLE"}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Track Info Display */}
            <div className="bg-black border border-cyan-500/20 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <h2 className="text-xl md:text-2xl font-bold text-white truncate mb-1 relative z-10">
                    {currentTrack?.title || "WAITING FOR INPUT..."}
                </h2>
                <p className="text-xs md:text-sm text-cyan-600 font-bold truncate tracking-widest relative z-10">
                    {currentTrack?.artist || "UNKNOWN"}
                </p>
                {/* Background Text Decoration */}
                <span className="absolute right-2 bottom-0 text-[3rem] md:text-[4rem] font-bold text-cyan-900/10 pointer-events-none select-none">
                    01
                </span>
            </div>

            {/* Main Controls */}
            <div className="grid grid-cols-4 gap-2 h-16">
                 <button onClick={toggleShuffle} className={`border border-cyan-500/30 hover:bg-cyan-900/20 hover:border-cyan-400 flex items-center justify-center transition-all ${isShuffle ? 'bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400' : 'text-cyan-700'}`}>
                     <ShuffleIcon size={20} weight="bold" />
                 </button>

                 <button onClick={prevTrack} className="border border-cyan-500/30 hover:bg-cyan-900/20 hover:border-cyan-400 text-cyan-500 flex items-center justify-center transition-all active:scale-95">
                     <SkipBackIcon size={24} weight="fill" />
                 </button>

                 <button onClick={togglePlay} className="col-span-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center transition-all active:scale-95 group">
                     {isPlaying ? <PauseIcon size={32} weight="fill" /> : <PlayIcon size={32} weight="fill" />}
                 </button>

                 <button onClick={nextTrack} className="border border-cyan-500/30 hover:bg-cyan-900/20 hover:border-cyan-400 text-cyan-500 flex items-center justify-center transition-all active:scale-95 col-start-2 col-end-3 row-start-2 hidden">
                    {/* Hidden grid placeholder if needed */}
                 </button>
            </div>

            {/* Secondary Controls Row */}
             <div className="grid grid-cols-4 gap-2">
                 <button onClick={toggleRepeat} className={`border border-cyan-500/30 hover:bg-cyan-900/20 hover:border-cyan-400 flex items-center justify-center transition-all h-12 relative overflow-hidden ${repeatMode !== 'off' ? 'bg-cyan-900/40 text-cyan-400 border-cyan-400' : 'text-cyan-700'}`}>
                     <RepeatIcon size={20} weight="bold" />
                     {repeatMode !== 'off' && (
                         <span className="absolute bottom-0 right-1 text-[8px] font-bold uppercase">{repeatMode}</span>
                     )}
                 </button>

                 <button onClick={nextTrack} className="border border-cyan-500/30 hover:bg-cyan-900/20 hover:border-cyan-400 text-cyan-500 flex items-center justify-center transition-all active:scale-95">
                     <SkipForwardIcon size={24} weight="fill" />
                 </button>

                  {/* Volume Control */}
                 <div className={`col-span-2 border border-cyan-500/30 flex items-center gap-2 px-2 transition-all ${isMuted ? 'border-red-900/50' : 'hover:border-cyan-400 hover:bg-cyan-900/10'}`}>
                     <button onClick={toggleMute} className={`${isMuted ? 'text-red-500' : 'text-cyan-600 hover:text-cyan-400'}`}>
                         {getVolumeIcon()}
                     </button>
                     <div className="flex-1">
                        <CustomSlider
                            value={isMuted ? 0 : volume}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={handleVolumeChange}
                            className="w-full"
                            variant="cyberpunk"
                        />
                     </div>
                 </div>
             </div>

             {/* Scrubber */}
             <div className="flex items-center gap-3 font-mono text-xs text-cyan-400 mt-2 bg-black/50 backdrop-blur-sm p-1">
                 <span>{formatTime(currentTime)}</span>
                 <div className="flex-1">
                     <CustomSlider
                        value={currentTime}
                        min={0}
                        max={duration || 0}
                        onChange={handleSeek}
                        className="w-full"
                        variant="cyberpunk"
                     />
                 </div>
                 <span>{formatTime(duration)}</span>
             </div>

        </div>

        {/* Right Column: Playlist Terminal */}
        <div className="w-full md:w-7/12 flex flex-col gap-4">

            {/* Terminal Header */}
            <div className="bg-cyan-900/20 border-t border-b border-cyan-500/30 p-2 flex justify-between items-center backdrop-blur-md">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500/50 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500/50 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500/50 rounded-full"></div>
                </div>
                <div className="text-xs font-bold text-cyan-600 tracking-widest">
                    {`// PLAYLIST_TERMINAL`}
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`
                        text-xs font-bold px-3 py-1 border transition-all flex items-center gap-1
                        ${isAdding ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-transparent text-cyan-500 border-cyan-500 hover:bg-cyan-500/10'}
                    `}
                >
                    <PlusIcon weight="bold" /> ADD_DATA
                </button>
            </div>

            {/* Input Panel */}
            <motion.div
                initial={false}
                animate={{ height: isAdding ? 'auto' : 0, opacity: isAdding ? 1 : 0 }}
                className="overflow-hidden border-x border-cyan-500/20 bg-black"
            >
                <form onSubmit={handleAddTrack} className="p-4 space-y-3 border-b border-cyan-500/30">
                    <div className="grid grid-cols-2 gap-4">
                         <input
                            type="text"
                            placeholder="TRACK_TITLE"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="bg-cyan-900/10 border border-cyan-500/30 p-2 text-cyan-300 placeholder-cyan-800 text-xs focus:outline-none focus:border-cyan-500 focus:bg-cyan-900/20"
                        />
                         <input
                            type="text"
                            placeholder="ARTIST_ID"
                            value={newArtist}
                            onChange={(e) => setNewArtist(e.target.value)}
                            className="bg-cyan-900/10 border border-cyan-500/30 p-2 text-cyan-300 placeholder-cyan-800 text-xs focus:outline-none focus:border-cyan-500 focus:bg-cyan-900/20"
                        />
                    </div>
                    <div className="flex gap-2">
                         <div className="flex-1 flex items-center bg-cyan-900/10 border border-cyan-500/30 px-2">
                            <LinkIcon className="text-cyan-700" size={16} />
                            <input
                                type="text"
                                placeholder="MP3_DATA_SOURCE_URL"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none p-2 text-cyan-300 placeholder-cyan-800 text-xs focus:outline-none"
                            />
                         </div>
                         <button type="submit" className="bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-4 py-2 text-xs font-bold transition-all">
                             EXECUTE
                         </button>
                    </div>
                </form>
            </motion.div>

            {/* Playlist Content */}
            <div className="h-96 md:h-auto md:flex-1 bg-black/80 backdrop-blur-sm border border-cyan-500/30 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                {/* Decorative Grid Lines inside terminal */}
                <div className="absolute inset-0 pointer-events-none opacity-10"
                     style={{ backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)`, backgroundSize: '50px 50px' }}
                ></div>

                <CloudPlaylist />
            </div>

            {/* Footer Logs */}
            <div className="h-24 bg-black border border-cyan-900/30 p-2 font-mono text-[10px] text-cyan-800 overflow-hidden flex flex-col justify-end">
                <div className="opacity-50"> > SYSTEM_INIT... OK</div>
                <div className="opacity-60"> > AUDIO_DRIVER... LOADED</div>
                <div className="opacity-70"> > CONNECTING_TO_CLOUD_NODE... SUCCESS</div>
                <div className="text-cyan-600"> > LISTENING_ON_PORT_8080...</div>
                {isPlaying && <div className="text-cyan-400 animate-pulse"> > STREAMING_DATA_PACKETS...</div>}
            </div>

        </div>

      </div>
      </div>
    </div>
  );
};

export default CloudMusicPlayer;
