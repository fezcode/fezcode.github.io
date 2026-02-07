import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import piml from 'piml';

const CloudMusicContext = createContext();

export const useCloudMusic = () => useContext(CloudMusicContext);

export const CloudMusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one
  const [isShuffle, setIsShuffle] = useState(false);

  // Volume State
  const [volume, setVolumeState] = useState(1); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  // Audio Ref
  const audioRef = useRef(null);

  // Initialize Audio Object once
  if (!audioRef.current) {
    audioRef.current = new Audio();
    // No crossOrigin or Web Audio API nodes to avoid silence with local/opaque sources
  }

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Fetch playlist from PIML
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const publicUrl = process.env.PUBLIC_URL || '';
        const response = await fetch(`${publicUrl}/media_player/musics.piml`);
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          if (parsed && parsed.musics) {
            setPlaylist(parsed.musics);
          }
        }
      } catch (error) {
        console.error('Error loading musics.piml:', error);
      }
    };

    fetchMusics();
  }, []);

  // Helper to get random index
  const getRandomIndex = useCallback((currentIndex, length) => {
    if (length <= 1) return 0;
    let newIndex = currentIndex;
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * length);
    }
    return newIndex;
  }, []);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      if (isShuffle) return getRandomIndex(prevIndex, playlist.length);
      return (prevIndex + 1) % playlist.length;
    });
    setIsPlaying(true);
  }, [playlist.length, isShuffle, getRandomIndex]);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      if (isShuffle) return getRandomIndex(prevIndex, playlist.length);
      return (prevIndex - 1 + playlist.length) % playlist.length;
    });
    setIsPlaying(true);
  }, [playlist.length, isShuffle, getRandomIndex]);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      playNext();
    } else {
      if (currentTrackIndex === playlist.length - 1 && !isShuffle) {
        setIsPlaying(false);
      } else {
        playNext();
      }
    }
  }, [repeatMode, currentTrackIndex, playlist.length, isShuffle, playNext]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('ended', handleTrackEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('ended', handleTrackEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [handleTrackEnded]);

  useEffect(() => {
    if (playlist.length > 0 && playlist[currentTrackIndex]) {
      const audio = audioRef.current;
      const currentTrack = playlist[currentTrackIndex];
      const publicUrl = process.env.PUBLIC_URL || '';

      const trackUrl = currentTrack.url.startsWith('http')
        ? currentTrack.url
        : `${publicUrl}${currentTrack.url}`; // Use PUBLIC_URL for local assets

      if (
        audio.src !== trackUrl &&
        audio.src !== window.location.origin + trackUrl
      ) {
        audio.src = trackUrl;
        if (isPlaying) {
          audio.play().catch((e) => console.error('Play error:', e));
        }
      }
    }
  }, [currentTrackIndex, playlist, isPlaying]);

  // Handle Play/Pause side effects
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch((e) => {
        console.error('Play failed', e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setIsPlayerOpen(true);
  };

  const togglePlay = () => {
    if (playlist.length === 0) return;
    if (!isPlayerOpen) setIsPlayerOpen(true);
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setIsPlayerOpen(false);
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolumeState(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume || 1); // Restore previous volume
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolumeState(0);
    }
  };

  const value = {
    isPlaying,
    currentTrack: playlist[currentTrackIndex],
    playlist,
    isPlayerOpen,
    repeatMode,
    isShuffle,
    volume,
    isMuted,
    togglePlay,
    playTrack,
    nextTrack: playNext,
    prevTrack: playPrev,
    toggleRepeat,
    toggleShuffle,
    closePlayer,
    currentTime,
    duration,
    seek,
    setPlaylist,
    setVolume,
    toggleMute,
  };

  return (
    <CloudMusicContext.Provider value={value}>
      {children}
    </CloudMusicContext.Provider>
  );
};
