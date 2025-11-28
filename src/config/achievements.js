import {
  CompassIcon,
  ClockIcon,
  TerminalWindowIcon,
  PaintBrushIcon,
  GameControllerIcon,
  ColumnsIcon,
  SunglassesIcon,
  UserIcon,
  LightningIcon,
  SkullIcon,
  BookOpenIcon,
  BookBookmarkIcon,
  BooksIcon
} from '@phosphor-icons/react';

export const ACHIEVEMENTS = [
  {
    id: 'hello_world',
    title: 'Hello World',
    description: 'Welcome to Fezcodex.',
    icon: <CompassIcon size={32} weight="duotone" />,
    category: 'Exploration'
  },
  {
    id: 'curious_soul',
    title: 'Curious Soul',
    description: 'Visited the About Me page to learn who is behind this.',
    icon: <UserIcon size={32} weight="duotone" />,
    category: 'Exploration'
  },
  {
    id: 'the_hacker',
    title: 'The Hacker',
    description: 'Opened the Command Palette.',
    icon: <TerminalWindowIcon size={32} weight="duotone" />,
    category: 'Tools'
  },
  {
    id: 'the_architect',
    title: 'The Architect',
    description: 'Enabled Blueprint or Hellenic mode.',
    icon: <ColumnsIcon size={32} weight="duotone" />,
    category: 'Visuals'
  },
  {
    id: 'retro_futurist',
    title: 'Retro Futurist',
    description: 'Enabled Vaporwave or Cyberpunk mode.',
    icon: <SunglassesIcon size={32} weight="duotone" />,
    category: 'Visuals'
  },
  {
    id: 'the_artist',
    title: 'The Artist',
    description: 'Enabled Sketchbook mode.',
    icon: <PaintBrushIcon size={32} weight="duotone" />,
    category: 'Visuals'
  },
  {
    id: 'retro_gamer',
    title: 'Retro Gamer',
    description: 'Enabled Game Boy mode.',
    icon: <GameControllerIcon size={32} weight="duotone" />,
    category: 'Visuals'
  },
  {
    id: 'glitch_hunter',
    title: 'Glitch Hunter',
    description: 'Discovered the Dystopian Glitch mode.',
    icon: <SkullIcon size={32} weight="duotone" />,
    category: 'Visuals'
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Visited the Settings page.',
    icon: <LightningIcon size={32} weight="duotone" />,
    category: 'Tools'
  },
  {
    id: 'novice_reader',
    title: 'Novice Reader',
    description: 'Read your first blog post.',
    icon: <BookOpenIcon size={32} weight="duotone" />,
    category: 'Content'
  },
  {
    id: 'avid_reader',
    title: 'Avid Reader',
    description: 'Read 5 different blog posts.',
    icon: <BookBookmarkIcon size={32} weight="duotone" />,
    category: 'Content'
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Read 10 different blog posts. Impressive!',
    icon: <BooksIcon size={32} weight="duotone" />,
    category: 'Content'
  }
];
