import React, { useState } from 'react';
import {
  HouseIcon,
  CubeIcon,
  ArticleIcon,
  ShapesIcon,
  BookmarkSimpleIcon,
  GraphIcon,
  BookOpenIcon,
  UserIcon,
  GearIcon,
  XIcon,
  ListIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  CaretRightIcon,
  ArrowsOutIcon,
  ShuffleIcon,
  CheckIcon,
  HeartIcon,
  EnvelopeIcon,
  TerminalWindowIcon,
  CodeIcon,
  CopyIcon,
  TrophyIcon,
  InfoIcon,
  SunIcon,
  MoonIcon,
  CommandIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react';
import { appIcons } from '../../utils/appIcons';
import MarquetryText from './MarquetryText';
import MarquetryInlay from './MarquetryInlay';

const icons = {
  home: HouseIcon,
  projects: CubeIcon,
  writing: ArticleIcon,
  apps: ShapesIcon,
  logs: BookmarkSimpleIcon,
  graph: GraphIcon,
  book: BookOpenIcon,
  vocab: BookOpenIcon,
  user: UserIcon,
  settings: GearIcon,
  close: XIcon,
  menu: ListIcon,
  search: MagnifyingGlassIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  arrowUpRight: ArrowUpRightIcon,
  down: CaretDownIcon,
  up: CaretUpIcon,
  caretDown: CaretDownIcon,
  caretRight: CaretRightIcon,
  expand: ArrowsOutIcon,
  shuffle: ShuffleIcon,
  gear: GearIcon,
  check: CheckIcon,
  heart: HeartIcon,
  mail: EnvelopeIcon,
  terminal: TerminalWindowIcon,
  code: CodeIcon,
  copy: CopyIcon,
  trophy: TrophyIcon,
  info: InfoIcon,
  sun: SunIcon,
  moon: MoonIcon,
  command: CommandIcon,
  more: DotsThreeIcon,
};
export function MarquetryIcon({ name, fg, className = '', scale = 1 }) {
  const Icon =
    icons[name] ||
    appIcons[name] ||
    icons[name?.replace(/Icon$/, '').toLowerCase()] ||
    ShapesIcon;
  return (
    <Icon
      className={`mqt-icon ${className}`}
      size={20 * scale}
      color={fg}
      weight="regular"
      aria-hidden="true"
    />
  );
}
export const MarquetryBand = ({ className = '' }) => (
  <div className={`mqt-band ${className}`} aria-hidden="true" />
);
export const MarquetryBadge = ({ seed, size = 15, className = '' }) => (
  <MarquetryInlay
    seed={seed}
    size={Math.max(36, size * 4)}
    className={`mqt-badge ${className}`}
  />
);
export function MarquetryCover({ item, className = '', decorative = false }) {
  const [failed, setFailed] = useState(null);
  return (
    <div className={`mqt-cover ${className}`} aria-hidden="true">
      {!decorative && item.image && failed !== item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(item.image)}
        />
      ) : (
        <MarquetryInlay seed={item.slug || item.title} size={190} />
      )}
      <span className="mqt-corner mqt-corner-tl" />
      <span className="mqt-corner mqt-corner-tr" />
    </div>
  );
}
export function MarquetryHero({ eyebrow, title, intro, children }) {
  return (
    <header className="mqt-hero">
      <div className="mqt-page mqt-hero-inner">
        <div className="mqt-hero-copy">
          {eyebrow && (
            <MarquetryText
              text={eyebrow}
              size="small"
              className="mqt-eyebrow"
            />
          )}
          <MarquetryText as="h1" text={title} className="mqt-hero-title" />
          {intro && <p className="mqt-hero-intro">{intro}</p>}
          {children}
        </div>
        <MarquetryInlay seed="fezcodex" size={250} className="mqt-hero-inlay" />
      </div>
      <MarquetryBand />
    </header>
  );
}
export const MarquetryNotice = ({
  error = false,
  children,
  className = '',
}) => (
  <p
    className={`mqt-notice ${error ? 'mqt-notice-error' : ''} ${className}`}
    role={error ? 'alert' : 'status'}
  >
    {children}
  </p>
);
