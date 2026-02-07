import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimation } from '../context/AnimationContext';
import { useToast } from './useToast';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { useAchievements } from '../context/AchievementContext';
import { useAboutData } from './useAboutData';
import { version } from '../version';
import {
  KEY_SIDEBAR_STATE,
  remove as removeLocalStorageItem,
} from '../utils/LocalStorageManager';
import LiveClock from '../components/LiveClock';
import GenerativeArt from '../components/GenerativeArt';
import LuxeArt from '../components/LuxeArt';
import TextTransformer from '../components/TextTransformer';
import Stopwatch from '../components/Stopwatch';
import { BugIcon, SparkleIcon } from '@phosphor-icons/react';

// Wrapper for GenerativeArt to handle state locally
const GenerativeArtCommand = () => {
  const [seed, setSeed] = React.useState(() =>
    Math.random().toString(36).substring(7),
  );

  const handleRegenerate = () => {
    setSeed(Math.random().toString(36).substring(7));
  };

  return (
    <GenerativeArt
      seed={seed}
      showDownload={true}
      downloadResolution={3840} // 4K Resolution
      onRegenerate={handleRegenerate}
    />
  );
};

// Theme Switcher Modal Content
const ThemeSwitcherContent = ({ currentTheme, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* BRUFEZ */}
      <button
        onClick={() => onSelect('brutalist')}
        className={`group relative text-left p-8 border transition-all duration-500 rounded-sm overflow-hidden bg-[#050505] ${currentTheme === 'brutalist' ? 'border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10 hover:border-white/30'}`}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale">
          <GenerativeArt seed="brufez" className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-sm mb-6 transition-colors ${currentTheme === 'brutalist' ? 'bg-[#10B981] text-black' : 'bg-white/5 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black'}`}
          >
            <BugIcon size={24} weight="fill" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
            Brufez
          </h3>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
            Systemic Brutalism
          </p>
        </div>
      </button>

      {/* FEZLUXE */}
      <button
        onClick={() => onSelect('luxe')}
        className={`group relative text-left p-8 border transition-all duration-500 rounded-sm overflow-hidden bg-white ${currentTheme === 'luxe' ? 'border-[#8D4004] shadow-[0_0_20px_rgba(141,64,4,0.2)]' : 'border-black/5 hover:border-black/20'}`}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <LuxeArt
            seed="fezluxe"
            className="w-full h-full mix-blend-multiply"
            transparent={true}
          />
        </div>
        <div className="relative z-10">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full mb-6 transition-all duration-500 ${currentTheme === 'luxe' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F0] text-[#8D4004] shadow-sm group-hover:bg-[#1A1A1A] group-hover:text-white'}`}
          >
            <SparkleIcon size={24} weight="light" />
          </div>
          <h3 className="text-2xl font-playfairDisplay italic text-[#1A1A1A] mb-2 leading-none">
            Fezluxe
          </h3>
          <p className="font-outfit text-[10px] text-black/40 uppercase tracking-[0.2em] leading-relaxed">
            Refined Elegance
          </p>
        </div>
      </button>
    </div>
  );
};

export const useCommandRegistry = ({
  openGenericModal,
  toggleDigitalRain,
  toggleBSOD,
  items,
}) => {
  const navigate = useNavigate();
  const { reduceMotion, toggleReduceMotion } = useAnimation();
  const { addToast } = useToast();
  const { unlockAchievement } = useAchievements();
  const aboutData = useAboutData();

  const {
    fezcodexTheme,
    setFezcodexTheme,
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
  } = useVisualSettings();

  const commandHandlers = useMemo(
    () => ({
      toggleAnimations: () => {
        toggleReduceMotion();
        addToast({
          title: 'Settings Updated',
          message: `Reduced Motion has been ${!reduceMotion ? 'enabled' : 'disabled'}.`,
        });
      },
      switchTheme: () => {
        openGenericModal(
          'Aesthetic Configuration',
          <ThemeSwitcherContent
            currentTheme={fezcodexTheme}
            onSelect={(theme) => {
              setFezcodexTheme(theme);
              addToast({
                title: 'Aesthetic Reconfigured',
                message: `System interface shifted to ${theme.toUpperCase()} architecture.`,
                type: 'success',
              });
            }}
          />,
        );
      },
      resetSidebarState: () => {
        removeLocalStorageItem(KEY_SIDEBAR_STATE);
        addToast({
          title: 'Success',
          message: 'Sidebar state has been reset. The page will now reload.',
          duration: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      viewSource: () => {
        window.open(
          aboutData.profile.links.find((l) => l.id === 'repo')?.url ||
            'https://github.com/fezcode/fezcode.github.io',
          '_blank',
          'noopener,noreferrer',
        );
      },
      randomPost: () => {
        const posts = items.filter((i) => i.type === 'post');
        if (posts.length > 0) {
          const randomPost = posts[Math.floor(Math.random() * posts.length)];
          navigate(randomPost.path);
        }
      },
      sendEmailFezcode: () => {
        window.open(
          aboutData.profile.links.find((l) => l.id === 'email')?.url ||
            'mailto:samil.bulbul@gmail.com',
          '_blank',
          'noopener,noreferrer',
        );
      },
      openGitHub: () => {
        window.open(
          aboutData.profile.links.find((l) => l.id === 'github')?.url ||
            'https://github.com/fezcode',
          '_blank',
          'noopener,noreferrer',
        );
      },
      openTwitter: () => {
        window.open(
          aboutData.profile.links.find((l) => l.id === 'twitter')?.url ||
            'https://x.com/fezcoddy',
          '_blank',
          'noopener,noreferrer',
        );
      },
      openLinkedIn: () => {
        window.open(
          aboutData.profile.links.find((l) => l.id === 'linkedin')?.url ||
            'https://www.linkedin.com/in/ahmed-samil-bulbul/?locale=en_US',
          '_blank',
          'noopener,noreferrer',
        );
      },
      scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      scrollToBottom: () => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      },
      showSiteStats: () => {
        const postCount = items.filter((i) => i.type === 'post').length;
        const projectCount = items.filter((i) => i.type === 'project').length;
        const logCount = items.filter((i) => i.type === 'log').length;
        const appCount = items.filter((i) => i.type === 'app').length;
        openGenericModal(
          'Site Statistics',
          <div>
            <p>
              <strong>Posts:</strong> {postCount}
            </p>
            <p>
              <strong>Projects:</strong> {projectCount}
            </p>
            <p>
              <strong>Logs:</strong> {logCount}
            </p>
            <p>
              <strong>Apps:</strong> {appCount}
            </p>
          </div>,
        );
      },
      showVersion: () => {
        unlockAchievement('leave_no_stone_unturned');
        openGenericModal(
          'Application Version',
          <p>
            Version: <strong>v{version}</strong>
          </p>,
        );
      },
      latestPost: () => {
        const posts = items.filter((i) => i.type === 'post');
        if (posts.length > 0) {
          posts.sort((a, b) => new Date(b.date) - new Date(a.date));
          navigate(posts[0].path);
        }
      },
      latestLog: () => {
        const logs = items.filter((i) => i.type === 'log');
        if (logs.length > 0) {
          logs.sort((a, b) => new Date(b.date) - new Date(a.date));
          navigate(logs[0].path);
        }
      },
      herDaim: () => {
        unlockAchievement('her_daim');
        openGenericModal(
          'Her Daim',
          <img
            src="/images/herdaim.jpg"
            alt="Her Daim"
            className="max-w-full h-auto"
          />,
        );
      },
      doBarrelRoll: () => {
        unlockAchievement('do_a_barrel_roll');
        document.body.classList.add('do-a-barrel-roll');
        addToast({
          title: 'Wheeeee!',
          message: 'Do a Barrel Roll!',
          duration: 1000,
        });
        setTimeout(() => {
          document.body.classList.remove('do-a-barrel-roll');
        }, 1000);
      },
      toggleInvertColors: () => {
        toggleInvert();
        addToast({
          title: !isInverted ? 'Colors Inverted' : 'Colors Restored',
          message: !isInverted
            ? 'Welcome to the upside down!'
            : 'Back to normal!',
          duration: 2000,
        });
      },
      partyMode: () => {
        toggleParty();
        addToast({
          title: !isParty ? "Let's Party!" : 'Party Over',
          message: !isParty
            ? 'Boots and cats and boots and cats!'
            : "Party's over...",
          duration: 2000,
        });
      },
      toggleRetroMode: () => {
        toggleRetro();
        addToast({
          title: !isRetro ? 'Retro Mode On' : 'Retro Mode Off',
          message: !isRetro ? '80s Vibes Initiated.' : 'Back to the future!',
          duration: 2000,
        });
      },
      toggleMirrorMode: () => {
        toggleMirror();
        addToast({
          title: !isMirror ? 'Mirror Mode On' : 'Mirror Mode Off',
          message: !isMirror
            ? 'Through the looking glass...'
            : 'Reflections normalized.',
          duration: 2000,
        });
      },
      toggleNoirMode: () => {
        toggleNoir();
        addToast({
          title: !isNoir ? 'Noir Mode On' : 'Noir Mode Off',
          message: !isNoir
            ? 'It was a dark and stormy night...'
            : 'Color returns to the world.',
          duration: 2000,
        });
      },
      toggleTerminalMode: () => {
        toggleTerminal();
        addToast({
          title: !isTerminal ? 'Terminal Mode On' : 'Terminal Mode Off',
          message: !isTerminal ? 'System Online.' : 'System Offline.',
          duration: 2000,
        });
      },
      toggleBlueprintMode: () => {
        toggleBlueprint();
        addToast({
          title: !isBlueprint ? 'Blueprint Mode On' : 'Blueprint Mode Off',
          message: !isBlueprint
            ? 'Entering Construction Mode.'
            : 'Blueprint Stored.',
          duration: 2000,
        });
      },
      toggleSepiaMode: () => {
        toggleSepia();
        addToast({
          title: !isSepia ? 'Sepia Mode On' : 'Sepia Mode Off',
          message: !isSepia ? 'Time travel initiated.' : 'Back to the present.',
          duration: 2000,
        });
      },
      toggleVaporwaveMode: () => {
        toggleVaporwave();
        addToast({
          title: !isVaporwave ? 'Vaporwave Mode On' : 'Vaporwave Mode Off',
          message: !isVaporwave ? 'A E S T H E T I C S.' : 'Reality restored.',
          duration: 2000,
        });
      },
      toggleCyberpunkMode: () => {
        toggleCyberpunk();
        addToast({
          title: !isCyberpunk ? 'Cyberpunk Mode On' : 'Cyberpunk Mode Off',
          message: !isCyberpunk ? 'Wake up, Samurai.' : 'System normal.',
          duration: 2000,
        });
      },
      toggleGameboyMode: () => {
        toggleGameboy();
        addToast({
          title: !isGameboy ? 'Game Boy Mode On' : 'Game Boy Mode Off',
          message: !isGameboy ? 'Press Start to play.' : 'Game Over.',
          duration: 2000,
        });
      },
      toggleComicMode: () => {
        toggleComic();
        addToast({
          title: !isComic ? 'Comic Mode On' : 'Comic Mode Off',
          message: !isComic ? 'BAM! POW! ZAP!' : 'Story arc ended.',
          duration: 2000,
        });
      },
      toggleSketchbookMode: () => {
        toggleSketchbook();
        addToast({
          title: !isSketchbook ? 'Sketchbook Mode On' : 'Sketchbook Mode Off',
          message: !isSketchbook ? 'Pencil sharpened.' : 'Notebook closed.',
          duration: 2000,
        });
      },
      toggleHellenicMode: () => {
        toggleHellenic();
        addToast({
          title: !isHellenic ? 'Hellenic Mode On' : 'Hellenic Mode Off',
          message: !isHellenic ? 'Welcome to Olympus.' : 'Leaving the Agora.',
          duration: 2000,
        });
      },
      toggleGlitchMode: () => {
        toggleGlitch();
        addToast({
          title: !isGlitch ? 'Glitch Mode On' : 'Glitch Mode Off',
          message: !isGlitch
            ? 'System corruption detected.'
            : 'Signal stabilized.',
          duration: 2000,
        });
      },
      toggleGardenMode: () => {
        toggleGarden();
        addToast({
          title: !isGarden ? 'Garden Mode On' : 'Garden Mode Off',
          message: !isGarden
            ? 'Bloom where you are planted.'
            : 'Winter is coming.',
          duration: 2000,
        });
      },
      toggleAutumnMode: () => {
        toggleAutumn();
        addToast({
          title: !isAutumn ? 'Autumn Mode On' : 'Autumn Mode Off',
          message: !isAutumn ? 'The leaves are falling.' : 'Spring has sprung.',
          duration: 2000,
        });
      },
      toggleRainMode: () => {
        toggleRain();
        addToast({
          title: !isRain ? 'Rain Mode On' : 'Rain Mode Off',
          message: !isRain ? "It's raining, it's pouring." : 'The sun is out.',
          duration: 2000,
        });
      },
      toggleFalloutMode: () => {
        toggleFalloutOverlay();
        addToast({
          title: !isFalloutOverlay
            ? 'Fallout Overlay Active'
            : 'Fallout Overlay Disabled',
          message: !isFalloutOverlay
            ? `Welcome to the Wasteland. (${falloutVariant.toUpperCase()})`
            : 'Returning to pre-war reality.',
          duration: 2000,
        });
      },
      switchFalloutVariant: () => {
        const newVariant = falloutVariant === 'amber' ? 'green' : 'amber';
        setFalloutVariant(newVariant);
        addToast({
          title: 'Fallout Overlay Color Changed',
          message: `HUD Color set to: ${newVariant.toUpperCase()}`,
          duration: 2000,
        });
      },
      showTime: () => {
        unlockAchievement('time_teller');
        openGenericModal('Current Time', <LiveClock />);
      },
      digitalRain: () => {
        toggleDigitalRain();
      },
      generateArt: () => {
        openGenericModal('Generative Art', <GenerativeArtCommand />);
      },
      leetTransformer: () => {
        openGenericModal('Leet Speak Transformer', <TextTransformer />);
      },
      stopwatch: () => {
        openGenericModal('Stopwatch', <Stopwatch />);
      },
      showOSInfo: () => {
        const osInfo = (
          <div>
            <p>
              <strong>User Agent:</strong> {navigator.userAgent}
            </p>
            <br />
            <p>
              <strong>Platform:</strong> {navigator.platform}
            </p>
            <br />
            <p>
              <strong>App Version:</strong> {navigator.appVersion}
            </p>
            <br />
            <p>
              <strong>Language:</strong> {navigator.language}
            </p>
            <br />
            <p>
              <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
            </p>
          </div>
        );
        openGenericModal('User/Browser Information', osInfo);
      },
      copyCurrentURL: () => {
        navigator.clipboard.writeText(window.location.href);
        addToast({
          title: 'Copied',
          message: 'Current URL copied to clipboard!',
          duration: 3000,
        });
      },
      clearLocalStorage: () => {
        localStorage.clear();
        addToast({
          title: 'Success',
          message: 'Local storage cleared!',
          duration: 3000,
        });
      },
      reloadPage: () => {
        addToast({
          title: 'Reloading',
          message: 'Page will reload shortly...',
          duration: 1500,
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      randomApp: () => {
        const apps = items.filter((i) => i.type === 'app');
        if (apps.length > 0) {
          const randomApp = apps[Math.floor(Math.random() * apps.length)];
          addToast({
            title: 'Random App',
            message: `Navigating to ${randomApp.title}`,
            duration: 2000,
          });
          navigate(randomApp.path);
        } else {
          addToast({
            title: 'Random App',
            message: 'No apps found to navigate to.',
            duration: 2000,
          });
        }
      },
      toggleFullScreen: () => {
        if (!document.fullscreenElement) {
          document.documentElement
            .requestFullscreen()
            .then(() => {
              addToast({
                title: 'Full Screen',
                message: 'Entered full screen mode.',
                duration: 2000,
              });
            })
            .catch((err) => {
              addToast({
                title: 'Error',
                message: `Could not enter full screen: ${err.message}`,
                duration: 3000,
              });
            });
        } else {
          if (document.exitFullscreen) {
            document
              .exitFullscreen()
              .then(() => {
                addToast({
                  title: 'Full Screen',
                  message: 'Exited full screen mode.',
                  duration: 2000,
                });
              })
              .catch((err) => {
                addToast({
                  title: 'Error',
                  message: `Could not exit full screen: ${err.message}`,
                  duration: 3000,
                });
              });
          }
        }
      },
      openGitHubIssue: () => {
        const issueTitle = encodeURIComponent(
          `Issue on page: ${window.location.pathname}`,
        );
        const issueBody = encodeURIComponent(
          `Found an issue on:\n${window.location.href}\n\n[Please describe the issue here]`,
        );
        const repoUrl =
          aboutData.profile.links.find((l) => l.id === 'repo')?.url ||
          'https://github.com/fezcode/fezcode.github.io';
        const githubIssueUrl = `${repoUrl}/issues/new?title=${issueTitle}&body=${issueBody}`;
        window.open(githubIssueUrl, '_blank', 'noopener,noreferrer');
        addToast({
          title: 'GitHub Issue',
          message: 'Opening new GitHub issue tab!',
          duration: 3000,
        });
      },
      previousPage: () => {
        addToast({
          title: 'Previous Page',
          duration: 1500,
        });
        navigate(-1);
      },
      nextPage: () => {
        addToast({
          title: 'Next Page',
          duration: 1500,
        });
        navigate(1);
      },
    }),
    [
      addToast,
      reduceMotion,
      items,
      navigate,
      openGenericModal,
      toggleReduceMotion,
      unlockAchievement,
      toggleDigitalRain,
      aboutData,

      // Visual Settings dependencies
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
      toggleRain,
      isFalloutOverlay,
      toggleFalloutOverlay,
      falloutVariant,
      setFalloutVariant,
      fezcodexTheme,
      setFezcodexTheme,
    ],
  );

  const executeCommand = useCallback(
    (commandId) => {
      const handler = commandHandlers[commandId];
      if (handler) {
        handler();
      } else {
        console.warn(`Command "${commandId}" not found in registry.`);
      }
    },
    [commandHandlers],
  );

  return { executeCommand };
};
