import React, { createContext, useContext, useEffect, useRef } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { useAchievements } from './AchievementContext';

const VisualSettingsContext = createContext();

export const useVisualSettings = () => {
  return useContext(VisualSettingsContext);
};

export const VisualSettingsProvider = ({ children }) => {
  const { unlockAchievement } = useAchievements();
  const themeChangeTimestamps = useRef([]); // Track theme changes

  const availableFonts = [
    { id: 'font-sans', name: 'Space Mono' },
    { id: 'font-mono', name: 'JetBrains Mono' },
    { id: 'font-inter', name: 'Inter' },
    { id: 'font-arvo', name: 'Arvo' },
    { id: 'font-playfairDisplay', name: 'Playfair Display' },
    { id: 'font-syne', name: 'Syne' },
    { id: 'font-outfit', name: 'Outfit' },
    { id: 'font-ibm-plex-mono', name: 'IBM Plex Mono' },
    { id: 'font-instr-serif', name: 'Instrument Serif' },
    { id: 'font-nunito', name: 'Nunito' },
  ];

  const [headerFont, setHeaderFont] = usePersistentState(
    'header-font',
    'font-outfit',
  );
  const [bodyFont, setBodyFont] = usePersistentState(
    'body-font',
    'font-outfit',
  );
  const [isInverted, setIsInverted] = usePersistentState('is-inverted', false);
  const [isRetro, setIsRetro] = usePersistentState('is-retro', false);
  const [isParty, setIsParty] = usePersistentState('is-party', false);
  const [isMirror, setIsMirror] = usePersistentState('is-mirror', false);
  const [isNoir, setIsNoir] = usePersistentState('is-noir', false);
  const [isTerminal, setIsTerminal] = usePersistentState('is-terminal', false);
  const [isBlueprint, setIsBlueprint] = usePersistentState(
    'is-blueprint',
    false,
  );
  const [isSepia, setIsSepia] = usePersistentState('is-sepia', false);
  const [isVaporwave, setIsVaporwave] = usePersistentState(
    'is-vaporwave',
    false,
  );
  const [isCyberpunk, setIsCyberpunk] = usePersistentState(
    'is-cyberpunk',
    false,
  );
  const [isGameboy, setIsGameboy] = usePersistentState('is-gameboy', false);
  const [isComic, setIsComic] = usePersistentState('is-comic', false);
  const [isSketchbook, setIsSketchbook] = usePersistentState(
    'is-sketchbook',
    false,
  );
  const [isHellenic, setIsHellenic] = usePersistentState('is-hellenic', false);
  const [isGlitch, setIsGlitch] = usePersistentState('is-glitch', false);
  const [isGarden, setIsGarden] = usePersistentState('is-garden', false);
  const [isAutumn, setIsAutumn] = usePersistentState('is-autumn', false);
  const [isRain, setIsRain] = usePersistentState('is-rain', false);
  const [isFalloutOverlay, setIsFalloutOverlay] = usePersistentState(
    'is-fallout-overlay',
    false,
  );
  const [falloutVariant, setFalloutVariant] = usePersistentState(
    'fallout-variant',
    'amber',
  ); // 'amber' or 'green'
  const [isFalloutNoiseEnabled, setIsFalloutNoiseEnabled] = usePersistentState(
    'fallout-noise',
    true,
  );
  const [isFalloutScanlinesEnabled, setIsFalloutScanlinesEnabled] =
    usePersistentState('fallout-scanlines', true);
  const [isFalloutVignetteEnabled, setIsFalloutVignetteEnabled] =
    usePersistentState('fallout-vignette', true);
  const [blogPostViewMode, setBlogPostViewMode] = usePersistentState(
    'blog-post-view-mode',
    'editorial',
  );
  const [isSplashTextEnabled, setIsSplashTextEnabled] = usePersistentState(
    'is-splash-text-enabled',
    true,
  );
  const [isAppFullscreen, setIsAppFullscreen] = usePersistentState(
    'is-app-fullscreen',
    false,
  );
  const [fezcodexTheme, setFezcodexTheme] = usePersistentState(
    'fezcodex-theme',
    'brutalist',
  ); // 'brutalist' or 'luxe'

  // URL Parameter Observer - Consumes ?fezTheme=... and ?fezBlogMode=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('fezTheme');
    const blogModeParam = params.get('fezBlogMode');
    let changed = false;

    if (themeParam && ['brutalist', 'luxe'].includes(themeParam)) {
      setFezcodexTheme(themeParam);
      changed = true;
    }

    if (
      blogModeParam &&
      [
        'brutalist',
        'editorial',
        'dossier',
        'terminal',
        'dokument',
        'terminal-green',
        'old',
        'luxe',
      ].includes(blogModeParam)
    ) {
      setBlogPostViewMode(blogModeParam);
      changed = true;
    }

    if (changed) {
      // Clean up the URL
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('fezTheme');
      newParams.delete('fezBlogMode');
      const newSearch = newParams.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : '') +
        window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, [setFezcodexTheme, setBlogPostViewMode]);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(
    window.innerWidth > 768,
  );
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Chaos Theory Achievement Tracker
  useEffect(() => {
    const now = Date.now();
    // Filter timestamps older than 10 seconds
    themeChangeTimestamps.current = themeChangeTimestamps.current.filter(
      (t) => now - t < 10000,
    );
    // Add current timestamp
    themeChangeTimestamps.current.push(now);

    // Check if 10 changes happened in 10 seconds
    if (themeChangeTimestamps.current.length >= 10) {
      unlockAchievement('chaos_theory');
    }
  }, [
    isInverted,
    isRetro,
    isParty,
    isMirror,
    isNoir,
    isTerminal,
    isBlueprint,
    isSepia,
    isVaporwave,
    isCyberpunk,
    isGameboy,
    isComic,
    isSketchbook,
    isHellenic,
    isGlitch,
    isGarden,
    isAutumn,
    isRain,
    blogPostViewMode,
    unlockAchievement,
  ]);

  useEffect(() => {
    if (isInverted) {
      document.body.classList.add('invert-mode');
    } else {
      document.body.classList.remove('invert-mode');
    }
  }, [isInverted]);

  useEffect(() => {
    if (isRetro) {
      document.documentElement.classList.add('retro-mode');
    } else {
      document.documentElement.classList.remove('retro-mode');
    }
  }, [isRetro]);

  useEffect(() => {
    if (isParty) {
      document.body.classList.add('party-mode');
    } else {
      document.body.classList.remove('party-mode');
    }
  }, [isParty]);

  useEffect(() => {
    if (isMirror) {
      document.documentElement.classList.add('mirror-mode');
    } else {
      document.documentElement.classList.remove('mirror-mode');
    }
  }, [isMirror]);

  useEffect(() => {
    if (isNoir) {
      document.body.classList.add('noir-mode');
    } else {
      document.body.classList.remove('noir-mode');
    }
  }, [isNoir]);

  useEffect(() => {
    if (isTerminal) {
      document.body.classList.add('terminal-mode');
    } else {
      document.body.classList.remove('terminal-mode');
    }
  }, [isTerminal]);

  useEffect(() => {
    if (isBlueprint) {
      document.body.classList.add('blueprint-mode');
      unlockAchievement('the_architect');
    } else {
      document.body.classList.remove('blueprint-mode');
    }
  }, [isBlueprint, unlockAchievement]);

  useEffect(() => {
    if (isSepia) {
      document.body.classList.add('sepia-mode');
    } else {
      document.body.classList.remove('sepia-mode');
    }
  }, [isSepia]);

  useEffect(() => {
    if (isVaporwave) {
      document.body.classList.add('vaporwave-mode');
      unlockAchievement('retro_futurist');
    } else {
      document.body.classList.remove('vaporwave-mode');
    }
  }, [isVaporwave, unlockAchievement]);

  useEffect(() => {
    if (isCyberpunk) {
      document.body.classList.add('cyberpunk-mode');
      unlockAchievement('retro_futurist');
    } else {
      document.body.classList.remove('cyberpunk-mode');
    }
  }, [isCyberpunk, unlockAchievement]);

  useEffect(() => {
    if (isGameboy) {
      document.body.classList.add('gameboy-mode');
      unlockAchievement('retro_gamer');
    } else {
      document.body.classList.remove('gameboy-mode');
    }
  }, [isGameboy, unlockAchievement]);

  useEffect(() => {
    if (isComic) {
      document.body.classList.add('comic-mode');
    } else {
      document.body.classList.remove('comic-mode');
    }
  }, [isComic]);

  useEffect(() => {
    if (isSketchbook) {
      document.body.classList.add('sketchbook-mode');
      unlockAchievement('the_artist');
    } else {
      document.body.classList.remove('sketchbook-mode');
    }
  }, [isSketchbook, unlockAchievement]);

  useEffect(() => {
    if (isHellenic) {
      document.body.classList.add('hellenic-mode');
      unlockAchievement('the_architect');
    } else {
      document.body.classList.remove('hellenic-mode');
    }
  }, [isHellenic, unlockAchievement]);

  useEffect(() => {
    if (isGlitch) {
      document.body.classList.add('glitch-mode');
      unlockAchievement('glitch_hunter');
    } else {
      document.body.classList.remove('glitch-mode');
    }
  }, [isGlitch, unlockAchievement]);

  useEffect(() => {
    if (isGarden && isAutumn && isRain) {
      unlockAchievement('zen');
    }
  }, [isGarden, isAutumn, isRain, unlockAchievement]);

  useEffect(() => {
    if (isFalloutOverlay) {
      document.body.classList.add('fallout-mode');
    } else {
      document.body.classList.remove('fallout-mode');
    }
  }, [isFalloutOverlay]);

  const toggleInvert = () => setIsInverted((prev) => !prev);
  const toggleRetro = () => setIsRetro((prev) => !prev);
  const toggleParty = () => setIsParty((prev) => !prev);
  const toggleMirror = () => setIsMirror((prev) => !prev);
  const toggleNoir = () => setIsNoir((prev) => !prev);
  const toggleTerminal = () => setIsTerminal((prev) => !prev);
  const toggleBlueprint = () => setIsBlueprint((prev) => !prev);
  const toggleSepia = () => setIsSepia((prev) => !prev);
  const toggleVaporwave = () => setIsVaporwave((prev) => !prev);
  const toggleCyberpunk = () => setIsCyberpunk((prev) => !prev);
  const toggleGameboy = () => setIsGameboy((prev) => !prev);
  const toggleComic = () => setIsComic((prev) => !prev);
  const toggleSketchbook = () => setIsSketchbook((prev) => !prev);
  const toggleHellenic = () => setIsHellenic((prev) => !prev);
  const toggleGlitch = () => setIsGlitch((prev) => !prev);
  const toggleGarden = () => setIsGarden((prev) => !prev);
  const toggleAutumn = () => setIsAutumn((prev) => !prev);
  const toggleRain = () => setIsRain((prev) => !prev);
  const toggleFalloutOverlay = () => setIsFalloutOverlay((prev) => !prev);
  const toggleFalloutNoise = () => setIsFalloutNoiseEnabled((prev) => !prev);
  const toggleFalloutScanlines = () =>
    setIsFalloutScanlinesEnabled((prev) => !prev);
  const toggleFalloutVignette = () =>
    setIsFalloutVignetteEnabled((prev) => !prev);
  const toggleSplashText = () => setIsSplashTextEnabled((prev) => !prev);
  const toggleAppFullscreen = () => setIsAppFullscreen((prev) => !prev);

  return (
    <VisualSettingsContext.Provider
      value={{
        isInverted,
        toggleInvert,
        isRetro,
        toggleRetro,
        isParty,
        toggleParty,
        isMirror,
        toggleMirror,
        isNoir,
        toggleNoir,
        isTerminal,
        toggleTerminal,
        isBlueprint,
        toggleBlueprint,
        isSepia,
        toggleSepia,
        isVaporwave,
        toggleVaporwave,
        isCyberpunk,
        toggleCyberpunk,
        isGameboy,
        toggleGameboy,
        isComic,
        toggleComic,
        isSketchbook,
        toggleSketchbook,
        isHellenic,
        toggleHellenic,
        isGlitch,
        toggleGlitch,
        isGarden,
        toggleGarden,
        isAutumn,
        toggleAutumn,
        isRain,
        toggleRain,
        isFalloutOverlay,
        toggleFalloutOverlay,
        falloutVariant,
        setFalloutVariant,
        isFalloutNoiseEnabled,
        toggleFalloutNoise,
        isFalloutScanlinesEnabled,
        toggleFalloutScanlines,
        isFalloutVignetteEnabled,
        toggleFalloutVignette,
        blogPostViewMode,
        setBlogPostViewMode,
        headerFont,
        setHeaderFont,
        bodyFont,
        setBodyFont,
        availableFonts,
        isSplashTextEnabled,
        toggleSplashText,
        isAppFullscreen,
        toggleAppFullscreen,
        fezcodexTheme,
        setFezcodexTheme,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </VisualSettingsContext.Provider>
  );
};
