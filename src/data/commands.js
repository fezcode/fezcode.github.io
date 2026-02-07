export const commands = [
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
    category: 'Interface & Settings',
    items: [
      {
        title: 'Switch Visual Theme',
        description:
          'Open a modal to choose between Brufez and Fezluxe aesthetics.',
        color: 'amber',
        commandId: 'switchTheme',
      },
      {
        title: 'Toggle Reduced Motion',
        description: 'Reduce or disable all animations in Fezcodex.',
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
