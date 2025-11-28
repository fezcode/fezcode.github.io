import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TerminalWindowIcon } from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import { useCommandPalette } from '../context/CommandPaletteContext';
import colors from '../config/colors';

const commandsData = [
  {
    category: 'Navigation & Socials',
    items: [
      {
        title: 'View Source on GitHub',
        description: 'See source code of Fezcodex on GitHub',
        color: 'red',
      },
      {
        title: 'Open GitHub Profile',
        description: 'Opens Github profile of Fezcode.',
        color: 'orange',
      },
      {
        title: 'Open Twitter Profile',
        description: 'Opens Twitter profile of Fezcode.',
        color: 'amber',
      },
      {
        title: 'Open LinkedIn Profile',
        description: 'Opens LinkedIn profile of Fezcode.',
        color: 'yellow',
      },
      { title: 'Send Email', description: 'Send me email.', color: 'lime' },
    ],
  },
  {
    category: 'Site Navigation',
    items: [
      {
        title: 'Navigate to a Random Post',
        description: 'Go to random blogpost.',
        color: 'green',
      },
      {
        title: 'Go to Latest Post',
        description: 'Opens the latest blogpost.',
        color: 'emerald',
      },
      {
        title: 'Go to Latest Log',
        description: 'Opens the latest log entry.',
        color: 'teal',
      },
      {
        title: 'Go to Random App',
        description: 'Opens an app randomly.',
        color: 'cyan',
      },
      {
        title: 'Scroll to Top',
        description: 'Go to the top of the page.',
        color: 'sky',
      },
      {
        title: 'Scroll to Bottom',
        description: 'Go to the bottom of the page.',
        color: 'blue',
      },
      {
        title: 'Previous Page',
        description: 'Go back to the previous page in your browser history.',
        color: 'sky',
      },
      {
        title: 'Next Page',
        description: 'Go forward to the next page in your browser history.',
        color: 'blue',
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
      },
      {
        title: 'Show Version',
        description: 'Opens a modal to show version number of Fezcodex.',
        color: 'violet',
      },
      {
        title: 'Show Current Time',
        description: 'Opens a modal to show local and UTC analog clock.',
        color: 'purple',
      },
      {
        title: 'Show Quick Stopwatch',
        description: 'Opens a modal for stopwatch, similar to stopwatch app.',
        color: 'fuchsia',
      },
      {
        title: 'Copy Current URL',
        description: 'Copies the current URL to your clipboard.',
        color: 'pink',
      },
      {
        title: 'Create Issue for This Page',
        description:
          'Opens Github Issues page to create an issue for the current URL.',
        color: 'rose',
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
      },
      {
        title: 'Toggle Digital Rain',
        description:
          'Opens matrix-like text rain, you need to toggle again to disable it, or refresh the page.',
        color: 'gray',
      },
      {
        title: 'Generate Art',
        description: 'Opens a modal to display a simple generative box art.',
        color: 'zinc',
      },
      {
        title: 'Leet Speak Transformer',
        description: 'Opens a modal convert given text to Leet speak.',
        color: 'neutral',
      },
      { title: 'Her Daim', description: 'Her Daim...', color: 'stone' },
      {
        title: 'Do a Barrel Roll',
        description: 'Spins the page 360 degrees. (Easter Egg)',
        color: 'red',
      },
      {
        title: 'Toggle Invert Colors',
        description: 'Inverts all colors on the page. (Easter Egg)',
        color: 'orange',
      },
      {
        title: 'Party Mode',
        description: 'Cycles hue colors for a disco effect. (Easter Egg)',
        color: 'amber',
      },
      {
        title: 'Toggle Retro Mode',
        description: 'Enables a retro CRT scanline effect. (Easter Egg)',
        color: 'yellow',
      },
      {
        title: 'Toggle Mirror Mode',
        description: 'Mirrors the entire page horizontally. (Easter Egg)',
        color: 'indigo',
      },
      {
        title: 'Toggle Noir Mode',
        description: 'Enables a black and white noir film effect. (Easter Egg)',
        color: 'gray',
      },
      {
        title: 'Toggle Terminal Mode',
        description:
          'Switch to a green monochrome hacker aesthetic. (Easter Egg)',
        color: 'green',
      },
      {
        title: 'Toggle Blueprint Mode',
        description: 'Switch to a blueprint schematic look. (Easter Egg)',
        color: 'blue',
      },
      {
        title: 'Toggle Sepia Mode',
        description: 'Switch to an old-timey sepia tone. (Easter Egg)',
        color: 'orange',
      },
      {
        title: 'Toggle Vaporwave Mode',
        description: 'Switch to a nostalgic vaporwave aesthetic. (Easter Egg)',
        color: 'pink',
      },
      {
        title: 'Toggle Cyberpunk Mode',
        description:
          'Switch to a high-tech, low-life dark neon look. (Easter Egg)',
        color: 'yellow',
      },
      {
        title: 'Toggle Game Boy Mode',
        description: 'Switch to a 4-color retro handheld look. (Easter Egg)',
        color: 'lime',
      },
      {
        title: 'Toggle Comic Book Mode',
        description: 'Switch to a vibrant pop-art comic style. (Easter Egg)',
        color: 'red',
      },
      {
        title: 'Toggle Sketchbook Mode',
        description: 'Switch to a hand-drawn sketchbook style. (Easter Egg)',
        color: 'stone',
      },
      {
        title: 'Toggle Hellenic Mode',
        description:
          'Switch to a classical Greek architecture style. (Easter Egg)',
        color: 'amber',
      },
      {
        title: 'Toggle Dystopian Glitch Mode',
        description: 'Switch to a corrupted digital data style. (Easter Egg)',
        color: 'slate',
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
      },
      {
        title: 'Show User/Browser Information',
        description:
          'Opens a modal to show User Agent, Platform, App Version, Language and Online information.',
        color: 'green',
      },
      {
        title: 'Clear Local Storage',
        description:
          "Removes every entry about Fezcodes in your browser's local storage.",
        color: 'emerald',
      },
      {
        title: 'Reload Page',
        description: 'Reloads the current page.',
        color: 'teal',
      },
      {
        title: 'Toggle Full Screen',
        description: 'Goes to fullscreen mode.',
        color: 'cyan',
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

function CommandsPage() {
  useSeo({
    title: 'All Commands | Fezcodex',
    description: 'All the available commands that can be used in Fezcodex.',
    keywords: ['Fezcodex', 'apps', 'applications', 'cmd', 'dev', 'commands'],
    ogTitle: 'All Commands | Fezcodex',
    ogDescription: 'All the available commands that can be used in Fezcodex.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'All Commands | Fezcodex',
    twitterDescription:
      'All the available commands that can be used in Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { togglePalette } = useCommandPalette();

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl flex items-center justify-center">
            <TerminalWindowIcon
              size={48}
              weight="fill"
              className="mr-4 mt-1 text-gray-100 "
            />
            <span className="text-orange-300">Command</span>&nbsp;Palette
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            See all available commands in Command Palette.
          </p>
        </div>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1 font-mono">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Command Palette{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="mb-6 ml-4 mr-4">
                <p className="text-gray-200 mb-4">
                  Press <kbd className="kbd kbd-sm text-emerald-300">Alt</kbd>+
                  <kbd className="kbd kbd-sm text-emerald-300">K</kbd> to open
                  Commands Palette. It lists all available
                  <code className="text-red-400"> PAGE</code>,
                  <code className="text-red-400"> POST</code>,
                  <code className="text-red-400"> PROJECT</code>,
                  <code className="text-red-400"> LOG</code>,
                  <code className="text-red-400"> APP</code> and
                  <code className="text-red-400"> COMMAND</code> that can be
                  used/consumed in Fezcodex.
                  <br />
                  <br />
                  You can type{' '}
                  <code className="text-emerald-300"> COMMAND </code> to see all
                  available commands.
                </p>
                <button
                  onClick={togglePalette}
                  className="border border-gray-200 bg-black/50 hover:bg-gray-50 text-white hover:text-black font-mono py-3 px-4 rounded w-full transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <TerminalWindowIcon size={24} />
                  Open Command Palette
                </button>
              </div>

              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Available Commands{' '}
              </h1>
              <hr className="border-gray-700 mb-6" />

              {commandsData.map((category, catIndex) => (
                <div key={catIndex} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2 inline-block">
                    {category.category}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {category.items.map((cmd, cmdIndex) => {
                      const classes =
                        colorClasses[cmd.color] || colorClasses.gray;
                      return (
                        <div
                          key={cmdIndex}
                          className={`${classes.bg} bg-opacity-30 border ${classes.border} ${classes.text} px-4 py-3 rounded relative`}
                          role="alert"
                        >
                          <strong className="font-bold">{cmd.title}:</strong>
                          <span className="block sm:inline ml-2">
                            {cmd.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandsPage;
