import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSeo from '../hooks/useSeo';
import { useCommandPalette } from '../context/CommandPaletteContext';
import {
  ArrowLeftIcon,
  TerminalWindowIcon,
  CommandIcon,
} from '@phosphor-icons/react';
import GenerativeArt from '../components/GenerativeArt';

const commandsData = [
  {
    category: 'Navigation & Socials',
    items: [
      {
        title: 'View Source on GitHub',
        description: 'See source code of Fezcodex on GitHub',
        color: 'red',
        commandId: 'viewSource',
      },
      {
        title: 'Open GitHub Profile',
        description: 'Opens Github profile of Fezcode.',
        color: 'orange',
        commandId: 'openGitHub',
      },
      {
        title: 'Open Twitter Profile',
        description: 'Opens Twitter profile of Fezcode.',
        color: 'amber',
        commandId: 'openTwitter',
      },
      {
        title: 'Open LinkedIn Profile',
        description: 'Opens LinkedIn profile of Fezcode.',
        color: 'yellow',
        commandId: 'openLinkedIn',
      },
      {
        title: 'Send Email',
        description: 'Send me email.',
        color: 'lime',
        commandId: 'sendEmailFezcode',
      },
    ],
  },
  {
    category: 'Site Navigation',
    items: [
      {
        title: 'Navigate to a Random Post',
        description: 'Go to random blogpost.',
        color: 'green',
        commandId: 'randomPost',
      },
      {
        title: 'Go to Latest Post',
        description: 'Opens the latest blogpost.',
        color: 'emerald',
        commandId: 'latestPost',
      },
      {
        title: 'Go to Latest Log',
        description: 'Opens the latest log entry.',
        color: 'teal',
        commandId: 'latestLog',
      },
      {
        title: 'Go to Random App',
        description: 'Opens an app randomly.',
        color: 'cyan',
        commandId: 'randomApp',
      },
      {
        title: 'Scroll to Top',
        description: 'Go to the top of the page.',
        color: 'sky',
        commandId: 'scrollToTop',
      },
      {
        title: 'Scroll to Bottom',
        description: 'Go to the bottom of the page.',
        color: 'blue',
        commandId: 'scrollToBottom',
      },
      {
        title: 'Previous Page',
        description: 'Go back to the previous page in your browser history.',
        color: 'sky',
        commandId: 'previousPage',
      },
      {
        title: 'Next Page',
        description: 'Go forward to the next page in your browser history.',
        color: 'blue',
        commandId: 'nextPage',
      },
    ],
  },
  {
    category: 'Site Utilities',
    items: [
      {
        title: 'Show Site Stats',
        description:
          'Opens a modal to show number of Posts, Projects, Logs and Apps.',
        color: 'indigo',
        commandId: 'showSiteStats',
      },
      {
        title: 'Show Version',
        description: 'Opens a modal to show version number of Fezcodex.',
        color: 'violet',
        commandId: 'showVersion',
      },
      {
        title: 'Show Current Time',
        description: 'Opens a modal to show local and UTC analog clock.',
        color: 'purple',
        commandId: 'showTime',
      },
      {
        title: 'Show Quick Stopwatch',
        description: 'Opens a modal for stopwatch, similar to stopwatch app.',
        color: 'fuchsia',
        commandId: 'stopwatch',
      },
      {
        title: 'Copy Current URL',
        description: 'Copies the current URL to your clipboard.',
        color: 'pink',
        commandId: 'copyCurrentURL',
      },
      {
        title: 'Create Issue for This Page',
        description:
          'Opens Github Issues page to create an issue for the current URL.',
        color: 'rose',
        commandId: 'openGitHubIssue',
      },
    ],
  },
  {
    category: 'Visual Effects & Fun',
    items: [
      {
        title: 'Toggle Animations',
        description: 'Enable/Disable all animations in Fezcodex.',
        color: 'slate',
        commandId: 'toggleAnimations',
      },
      {
        title: 'Toggle Digital Rain',
        description:
          'Opens matrix-like text rain, you need to toggle again to disable it, or refresh the page.',
        color: 'gray',
        commandId: 'digitalRain',
      },
      {
        title: 'Generate Art',
        description: 'Opens a modal to display a simple generative box art.',
        color: 'zinc',
        commandId: 'generateArt',
      },
      {
        title: 'Leet Speak Transformer',
        description: 'Opens a modal convert given text to Leet speak.',
        color: 'neutral',
        commandId: 'leetTransformer',
      },
      {
        title: 'Her Daim',
        description: 'Her Daim...',
        color: 'stone',
        commandId: 'herDaim',
      },
      {
        title: 'Do a Barrel Roll',
        description: 'Spins the page 360 degrees.',
        color: 'red',
        commandId: 'doBarrelRoll',
      },
      {
        title: 'Toggle Invert Colors',
        description: 'Inverts all colors on the page.',
        color: 'orange',
        commandId: 'toggleInvertColors',
      },
      {
        title: 'Party Mode',
        description: 'Cycles hue colors for a disco effect.',
        color: 'amber',
        commandId: 'partyMode',
      },
      {
        title: 'Toggle Retro Mode',
        description: 'Enables a retro CRT scanline effect.',
        color: 'yellow',
        commandId: 'toggleRetroMode',
      },
      {
        title: 'Toggle Mirror Mode',
        description: 'Mirrors the entire page horizontally.',
        color: 'lime',
        commandId: 'toggleMirrorMode',
      },
      {
        title: 'Toggle Noir Mode',
        description: 'Enables a black and white noir film effect.',
        color: 'green',
        commandId: 'toggleNoirMode',
      },
      {
        title: 'Toggle Terminal Mode',
        description: 'Switch to a green monochrome hacker aesthetic.',
        color: 'emerald',
        commandId: 'toggleTerminalMode',
      },
      {
        title: 'Toggle Blueprint Mode',
        description: 'Switch to a blueprint schematic look.',
        color: 'teal',
        commandId: 'toggleBlueprintMode',
      },
      {
        title: 'Toggle Sepia Mode',
        description: 'Switch to an old-timey sepia tone.',
        color: 'cyan',
        commandId: 'toggleSepiaMode',
      },
      {
        title: 'Toggle Vaporwave Mode',
        description: 'Switch to a nostalgic vaporwave aesthetic.',
        color: 'sky',
        commandId: 'toggleVaporwaveMode',
      },
      {
        title: 'Toggle Cyberpunk Mode',
        description: 'Switch to a high-tech, low-life dark neon look.',
        color: 'blue',
        commandId: 'toggleCyberpunkMode',
      },
      {
        title: 'Toggle Game Boy Mode',
        description: 'Switch to a 4-color retro handheld look.',
        color: 'indigo',
        commandId: 'toggleGameboyMode',
      },
      {
        title: 'Toggle Comic Book Mode',
        description: 'Switch to a vibrant pop-art comic style.',
        color: 'violet',
        commandId: 'toggleComicMode',
      },
      {
        title: 'Toggle Sketchbook Mode',
        description: 'Switch to a hand-drawn sketchbook style.',
        color: 'purple',
        commandId: 'toggleSketchbookMode',
      },
      {
        title: 'Toggle Hellenic Mode',
        description: 'Switch to a classical Greek architecture style.',
        color: 'fuchsia',
        commandId: 'toggleHellenicMode',
      },
      {
        title: 'Toggle Dystopian Glitch Mode',
        description: 'Switch to a corrupted digital data style.',
        color: 'pink',
        commandId: 'toggleGlitchMode',
      },
      {
        title: 'Toggle Garden Mode',
        description: 'Bloom where you are planted.',
        color: 'rose',
        commandId: 'toggleGardenMode',
      },
      {
        title: 'Toggle Autumn Mode',
        description: 'Winter is coming.',
        color: 'slate',
        commandId: 'toggleAutumnMode',
      },
      {
        title: 'Toggle Rain Mode',
        description: 'Let it rain.',
        color: 'gray',
        commandId: 'toggleRainMode',
      },
    ],
  },
  {
    category: 'System & Debug',
    items: [
      {
        title: 'Reset Sidebar State',
        description: 'Remove all sidebar states.',
        color: 'lime',
        commandId: 'resetSidebarState',
      },
      {
        title: 'Show User/Browser Information',
        description:
          'Opens a modal to show User Agent, Platform, App Version, Language and Online information.',
        color: 'green',
        commandId: 'showOSInfo',
      },
      {
        title: 'Clear Local Storage',
        description:
          "Removes every entry about Fezcodes in your browser's local storage.",
        color: 'emerald',
        commandId: 'clearLocalStorage',
      },
      {
        title: 'Reload Page',
        description: 'Reloads the current page.',
        color: 'teal',
        commandId: 'reloadPage',
      },
      {
        title: 'Toggle Full Screen',
        description: 'Goes to fullscreen mode.',
        color: 'cyan',
        commandId: 'toggleFullScreen',
      },
    ],
  },
];

const colorClasses = {
  red: { bg: 'bg-red-900', border: 'border-red-700', text: 'text-red-300' },
  orange: {
    bg: 'bg-orange-900',
    border: 'border-orange-700',
    text: 'text-orange-300',
  },
  amber: {
    bg: 'bg-amber-900',
    border: 'border-amber-700',
    text: 'text-amber-300',
  },
  yellow: {
    bg: 'bg-yellow-900',
    border: 'border-yellow-700',
    text: 'text-yellow-300',
  },
  lime: { bg: 'bg-lime-900', border: 'border-lime-700', text: 'text-lime-300' },
  green: {
    bg: 'bg-green-900',
    border: 'border-green-700',
    text: 'text-green-300',
  },
  emerald: {
    bg: 'bg-emerald-900',
    border: 'border-emerald-700',
    text: 'text-emerald-300',
  },
  teal: { bg: 'bg-teal-900', border: 'border-teal-700', text: 'text-teal-300' },
  cyan: { bg: 'bg-cyan-900', border: 'border-cyan-700', text: 'text-cyan-300' },
  sky: { bg: 'bg-sky-900', border: 'border-sky-700', text: 'text-sky-300' },
  blue: { bg: 'bg-blue-900', border: 'border-blue-700', text: 'text-blue-300' },
  indigo: {
    bg: 'bg-indigo-900',
    border: 'border-indigo-700',
    text: 'text-indigo-300',
  },
  violet: {
    bg: 'bg-violet-900',
    border: 'border-violet-700',
    text: 'text-violet-300',
  },
  purple: {
    bg: 'bg-purple-900',
    border: 'border-purple-700',
    text: 'text-purple-300',
  },
  fuchsia: {
    bg: 'bg-fuchsia-900',
    border: 'border-fuchsia-700',
    text: 'text-fuchsia-300',
  },
  pink: { bg: 'bg-pink-900', border: 'border-pink-700', text: 'text-pink-300' },
  rose: { bg: 'bg-rose-900', border: 'border-rose-700', text: 'text-rose-300' },
  slate: {
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    text: 'text-slate-300',
  },
  gray: { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-gray-300' },
  zinc: { bg: 'bg-zinc-900', border: 'border-zinc-700', text: 'text-zinc-300' },
  neutral: {
    bg: 'bg-neutral-900',
    border: 'border-neutral-700',
    text: 'text-neutral-300',
  },
  stone: {
    bg: 'bg-stone-900',
    border: 'border-stone-700',
    text: 'text-stone-300',
  },
};

const CommandListItem = ({ cmd, isActive, onHover, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(cmd)}
      onClick={onClick}
      className="relative pl-6 md:pl-8 py-3 group cursor-pointer"
    >
      {/* Active Indicator */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 ${
          isActive
            ? 'bg-emerald-400 h-full'
            : 'bg-transparent h-0 group-hover:h-full group-hover:bg-white/20'
        }`}
      />

      <div className="flex items-baseline justify-between pr-4">
        <h3
          className={`text-lg font-playfairDisplay transition-all duration-300 ${
            isActive
              ? 'text-white translate-x-2'
              : 'text-gray-500 group-hover:text-gray-300'
          }`}
        >
          {cmd.title}
        </h3>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block text-emerald-400"
          >
            <ArrowLeftIcon className="rotate-180" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

function CommandsPage() {
  useSeo({
    title: 'All Commands | Fezcodex',
    description: 'All the available commands that can be used in Fezcodex.',
    keywords: ['Fezcodex', 'apps', 'applications', 'cmd', 'dev', 'commands'],
    ogTitle: 'All Commands | Fezcodex',
    ogDescription: 'All the available commands that can be used in Fezcodex.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'All Commands | Fezcodex',
    twitterDescription:
      'All the available commands that can be used in Fezcodex.',
    twitterImage: '/images/ogtitle.png',
  });

  const { togglePalette, triggerCommand } = useCommandPalette();
  const [activeCommand, setActiveCommand] = useState(null);

  // Flattened list for random selection if needed, but not used currently
  // const allCommands = commandsData.flatMap(c => c.items);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30">
      {/* Mobile Background */}
      <div className="absolute inset-0 xl:hidden opacity-20 pointer-events-none z-0">
        <GenerativeArt
          seed="Commands"
          className="w-full h-full filter blur-3xl"
        />
      </div>

      {/* LEFT PANEL: The Index */}
      <div className="w-full xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-20 text-center md:text-left">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            CMDS
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-sm uppercase tracking-widest mb-8">
            Available Commands
          </p>

          <button
            onClick={togglePalette}
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all duration-300 font-mono uppercase tracking-widest text-xs rounded-sm mb-12"
          >
            <CommandIcon size={18} />
            <span>Open Palette</span>
          </button>
        </header>

        <div className="flex flex-col pb-32 gap-12">
          {commandsData.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                {category.category}
              </h2>
              <div className="flex flex-col">
                {category.items.map((cmd, cmdIndex) => (
                  <CommandListItem
                    key={cmd.title}
                    cmd={cmd}
                    isActive={activeCommand?.title === cmd.title}
                    onHover={setActiveCommand}
                    onClick={() => triggerCommand(cmd.commandId)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: The Stage (Desktop Only) */}
      <div className="hidden xl:flex fixed right-0 top-0 h-screen w-1/2 bg-neutral-900 overflow-hidden border-l border-white/10 z-20 flex-col">
        {' '}
        {/* Main Content Area (Grows) */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeCommand ? (
              <motion.div
                key={activeCommand.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-end p-20 pb-8"
              >
                {/* Background */}
                <div className="absolute inset-0 z-0">
                  <GenerativeArt
                    seed={activeCommand.title}
                    className="w-full h-full opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                  <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border bg-opacity-20 backdrop-blur-md mb-4 ${
                        colorClasses[activeCommand.color]?.text || 'text-white'
                      } ${colorClasses[activeCommand.color]?.border || 'border-white'} ${colorClasses[activeCommand.color]?.bg || 'bg-gray-800'}`}
                    >
                      {activeCommand.color}
                    </span>
                  </div>

                  <h2 className="text-5xl font-playfairDisplay text-white mb-6 leading-tight">
                    {activeCommand.title}
                  </h2>

                  <p className="text-xl text-gray-300 font-light max-w-xl leading-relaxed">
                    {activeCommand.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-12 text-center"
              >
                <div className="absolute inset-0 z-0 opacity-20">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
                </div>

                <div className="relative z-10 max-w-lg">
                  <TerminalWindowIcon
                    size={64}
                    className="mx-auto mb-8 text-emerald-500/50"
                  />
                  <h2 className="text-4xl font-playfairDisplay text-white mb-6">
                    Command Palette
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Access all features and navigations quickly.
                    <br />
                    Hover over the list to see details.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Persistent Footer (Always Visible) */}
        <div className="p-8 border-t border-white/10 bg-neutral-900/80 backdrop-blur-md z-30 flex items-center justify-between gap-6">
          <div className="hidden xl:flex items-center gap-4 text-sm font-mono text-gray-400">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white">
                Ctrl
              </kbd>
              <span className="self-center">+</span>
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white">
                K
              </kbd>
            </div>
            <span>to open anywhere</span>
          </div>

          <button
            onClick={togglePalette}
            className="flex-1 xl:flex-none group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-black hover:bg-emerald-400 transition-colors duration-300 font-mono uppercase tracking-widest text-sm"
          >
            <CommandIcon size={20} />
            <span>Open Palette</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommandsPage;
