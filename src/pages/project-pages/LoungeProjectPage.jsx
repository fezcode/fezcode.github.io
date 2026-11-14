import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  DownloadSimpleIcon,
  GameControllerIcon,
  GithubLogoIcon,
  PlayIcon,
  MusicNotesIcon,
  FilmStripIcon,
  SquaresFourIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppSeo,
  AppLoading,
  AppMissing,
} from './app-shell';
import '../../styles/project-showcases/LoungeShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap';
const ART = {
  'signal-bloom': { width: 1456, height: 816 },
  'night-frequency': { width: 1456, height: 816 },
  'chromatic-drift': { width: 1456, height: 816 },
  'magenta-horizon': { width: 1920, height: 1080 },
};
const HERO_ART = ['signal-bloom', 'night-frequency', 'chromatic-drift'];
const ROOM_ART = ['chromatic-drift', 'night-frequency', 'signal-bloom'];
const ROOM_ICONS = [FilmStripIcon, MusicNotesIcon, SquaresFourIcon];
const CONTROLS = [
  {
    key: 'A',
    label: 'Select',
    title: 'One press. You’re in.',
    body: 'Open a film, start an album, or launch an app. No keyboard on your lap.',
  },
  {
    key: 'B',
    label: 'Back',
    title: 'Find your way back.',
    body: 'Step back through your collection without losing your place. Presses, holds, and combinations can be remapped.',
  },
  {
    key: 'RT',
    label: 'Seek',
    title: 'Right to the good part.',
    body: 'Squeeze the trigger to scrub through a film. Native playback and exact seeking keep you in control.',
  },
  {
    key: 'View',
    label: 'Home',
    title: 'Back to your home screen.',
    body: 'Hold View to return home. A normal View press opens options. Remap the controls to the way you play.',
  },
];

const BackgroundArt = ({ name, className = '', priority = false }) => (
  <picture className={`lsg-art ${className}`}>
    <source
      media="(max-width: 760px)"
      srcSet={`/images/projects/lounge/backgrounds/${name}-768.webp`}
    />
    <img
      key={name}
      src={`/images/projects/lounge/backgrounds/${name}.webp`}
      width={ART[name].width}
      height={ART[name].height}
      alt=""
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  </picture>
);

export default function LoungeProjectPage() {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'lounge-signal');
  const [searchParams, setSearchParams] = useSearchParams();
  const [titleIndex, setTitleIndex] = useState(0);
  const [controlIndex, setControlIndex] = useState(0);
  if (loading) return <AppLoading />;
  if (failed || !cfg?.rooms?.length)
    return <AppMissing background="#03040a" color="#f5f6ff" />;
  const roomIndex = Math.max(
    0,
    cfg.rooms.findIndex((item) => item.id === searchParams.get('room')),
  );
  const room = cfg.rooms[roomIndex];
  const control = CONTROLS[controlIndex];
  const chooseRoom = (index) => {
    setTitleIndex(0);
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set('room', cfg.rooms[index].id);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };
  const browse = (direction) =>
    setTitleIndex(
      (index) => (index + direction + room.titles.length) % room.titles.length,
    );
  const handleCollectionKey = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') browse(-1);
    if (event.key === 'ArrowRight') browse(1);
    if (event.key === 'ArrowUp')
      chooseRoom((roomIndex + cfg.rooms.length - 1) % cfg.rooms.length);
    if (event.key === 'ArrowDown')
      chooseRoom((roomIndex + 1) % cfg.rooms.length);
  };

  return (
    <div className="lounge-showcase lsg" id="lounge-top">
      <AppSeo cfg={cfg} project={project} />
      <a href="#lounge-experience" className="lsg-skip">
        Skip to content
      </a>
      <header className="lsg-nav">
        <a
          href="#lounge-top"
          className="lsg-logo"
          aria-label="Lounge home"
          translate="no"
        >
          <span className="lsg-logo-mark" aria-hidden="true">
            <PlayIcon size={15} weight="fill" />
          </span>
          Lounge
        </a>
        <nav aria-label="Lounge sections">
          <a href="#lounge-experience">The app</a>
          <a href="#lounge-collection">Your collection</a>
          <a href="#lounge-controls">The controls</a>
        </nav>
        <a
          href={cfg.download}
          target="_blank"
          rel="noopener noreferrer"
          className="lsg-nav-download"
        >
          Download <DownloadSimpleIcon size={17} aria-hidden="true" />
        </a>
      </header>

      <section className="lsg-hero" aria-labelledby="lsg-title">
        <BackgroundArt
          name={HERO_ART[roomIndex]}
          priority
          className="lsg-hero-art"
        />
        <div className="lsg-hero-mask" aria-hidden="true" />
        <h1 id="lsg-title" translate="no">
          <span>Lounge</span>
          <span className="lsg-title-ghost" aria-hidden="true">
            Lounge
          </span>
        </h1>
        <div className="lsg-hero-intro">
          <p className="lsg-hero-lead">
            Your PC.
            <br />
            After hours.
          </p>
          <p>
            Films, music, games and apps.
            <br />
            One full-screen home, made for a controller.
          </p>
          <a href="#lounge-experience" className="lsg-inline-link">
            See Lounge <ArrowRightIcon size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="lsg-hero-bottom">
          <div
            className="lsg-atmospheres"
            role="group"
            aria-label="Change the hero atmosphere"
          >
            {cfg.rooms.map((item, index) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={index === roomIndex}
                onClick={() => chooseRoom(index)}
              >
                <span aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </div>
          <a
            href={cfg.download}
            target="_blank"
            rel="noopener noreferrer"
            className="lsg-download"
          >
            Download for Windows{' '}
            <DownloadSimpleIcon size={19} aria-hidden="true" />
          </a>
        </div>
        <p className="lsg-hero-platform">
          Windows 10 / 11 <span aria-hidden="true">/</span> Xbox controller{' '}
          <span aria-hidden="true">/</span> v{cfg.version}
        </p>
      </section>

      <section
        className="lsg-product"
        id="lounge-experience"
        aria-labelledby="lsg-product-title"
      >
        <BackgroundArt name="night-frequency" className="lsg-product-art" />
        <div className="lsg-product-copy">
          <span className="lsg-status">
            <span aria-hidden="true" /> A native Windows app
          </span>
          <h2 id="lsg-product-title">
            Your PC,
            <br />
            from the couch.
          </h2>
          <p>
            Lounge brings your own collection to the big screen. Pick up a
            controller and move from a film to an album, a game, or the rest of
            your PC.
          </p>
          <ul>
            <li>
              <FilmStripIcon size={19} aria-hidden="true" /> Native FFmpeg
              playback
            </li>
            <li>
              <MusicNotesIcon size={19} aria-hidden="true" /> Your albums,
              artists and songs
            </li>
            <li>
              <SquaresFourIcon size={19} aria-hidden="true" /> Apps, games and
              web tiles
            </li>
          </ul>
        </div>
        <figure className="lsg-app-frame">
          <div className="lsg-app-top">
            <span className="lsg-app-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Lounge / Aurora home</span>
            <span>Actual app</span>
          </div>
          <img
            src="/images/projects/lounge/aurora-home.webp"
            width="1600"
            height="900"
            alt="The real Lounge Aurora home screen showing a local film collection and controller navigation"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Your library. Your accounts. Your home screen.
          </figcaption>
        </figure>
        <div className="lsg-product-footer">
          <span>
            <CheckIcon size={16} aria-hidden="true" /> Local media stays yours
          </span>
          <span>
            <CheckIcon size={16} aria-hidden="true" /> Self-contained Windows
            x64 build
          </span>
          <span>
            <CheckIcon size={16} aria-hidden="true" /> Open source
          </span>
        </div>
      </section>

      <section
        className="lsg-collection"
        id="lounge-collection"
        aria-labelledby="lsg-collection-title"
      >
        <BackgroundArt
          name={ROOM_ART[roomIndex]}
          className="lsg-collection-art"
        />
        <div className="lsg-collection-mask" aria-hidden="true" />
        <div className="lsg-collection-heading">
          <h2 id="lsg-collection-title">
            Find your
            <br />
            frequency.
          </h2>
          <p>
            Three ways to spend the evening.
            <br />
            Explore an illustrated collection.
          </p>
        </div>
        <div
          className="lsg-collection-console"
          role="group"
          aria-label="Illustrative collection. Left and right browse titles. Up and down change rooms."
          onKeyDown={handleCollectionKey}
        >
          <div
            className="lsg-room-switch"
            role="group"
            aria-label="Choose a media room"
          >
            {cfg.rooms.map((item, index) => {
              const Icon = ROOM_ICONS[index];
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={roomIndex === index}
                  onClick={() => chooseRoom(index)}
                >
                  <Icon size={24} aria-hidden="true" />
                  <span>{item.label}</span>
                  <ArrowUpRightIcon size={20} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className="lsg-title-display" aria-live="polite">
            <span>{room.label} / Collection preview</span>
            <h3>{room.titles[titleIndex]}</h3>
            <p>{room.body}</p>
          </div>
          <div className="lsg-transport">
            <div
              className="lsg-title-dots"
              role="group"
              aria-label="Select an illustrative title"
            >
              {room.titles.map((title, index) => (
                <button
                  type="button"
                  key={title}
                  onClick={() => setTitleIndex(index)}
                  aria-label={`Preview ${title}`}
                  aria-pressed={titleIndex === index}
                >
                  <span />
                </button>
              ))}
            </div>
            <span>
              {titleIndex + 1} / {room.titles.length}
            </span>
            <div>
              <button
                type="button"
                aria-label="Previous illustrative title"
                onClick={() => browse(-1)}
              >
                <ArrowLeftIcon size={21} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next illustrative title"
                onClick={() => browse(1)}
              >
                <ArrowRightIcon size={21} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <p className="lsg-preview-note">
          Artwork and titles are illustrative. This page does not play or
          include media. Lounge plays the collection you bring.
        </p>
      </section>

      <section
        className="lsg-controls"
        id="lounge-controls"
        aria-labelledby="lsg-controls-title"
      >
        <div className="lsg-controls-copy">
          <GameControllerIcon size={40} weight="light" aria-hidden="true" />
          <h2 id="lsg-controls-title">
            Put your feet up.
            <br />
            You’re in control.
          </h2>
          <p>
            Play, pause, explore. Leave the keyboard where it is. Presses, holds
            and combinations can all be remapped.
          </p>
          <a
            className="lsg-inline-link"
            href={cfg.repo + '/blob/main/README.md#on-the-couch'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore controller controls{' '}
            <ArrowUpRightIcon size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="lsg-control-deck">
          <div
            className="lsg-control-buttons"
            role="group"
            aria-label="Explore controller actions"
          >
            {CONTROLS.map((item, index) => (
              <button
                type="button"
                key={item.key}
                aria-label={`Preview ${item.key}: ${item.label}`}
                aria-pressed={index === controlIndex}
                onClick={() => setControlIndex(index)}
              >
                <b>{item.key}</b>
                <span>
                  {item.key === 'View' ? 'Hold for home' : item.label}
                </span>
              </button>
            ))}
          </div>
          <div className="lsg-control-readout" aria-live="polite">
            <h3>{control.title}</h3>
            <p>{control.body}</p>
          </div>
          <span className="lsg-deck-line" aria-hidden="true" />
        </div>
      </section>

      <section className="lsg-details" aria-labelledby="lsg-details-title">
        <h2 id="lsg-details-title">
          The details,
          <br />
          taken care of.
        </h2>
        <div className="lsg-detail-list">
          {cfg.library.map((item) => (
            <details key={item.number}>
              <summary>
                <span>{item.title}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.body}</p>
              <span>{item.detail}</span>
            </details>
          ))}
          <p className="lsg-web-note">
            Web tiles use your own accounts and subscriptions. Some protected
            video may need a full browser. Lounge does not supply a streaming
            catalogue.
          </p>
        </div>
      </section>

      <section className="lsg-finale" aria-labelledby="lsg-finale-title">
        <BackgroundArt name="magenta-horizon" className="lsg-finale-art" />
        <div className="lsg-finale-copy">
          <h2 id="lsg-finale-title">
            All yours.
            <br />
            All evening.
          </h2>
          <p>Your PC. Your collection. Lounge.</p>
          <a
            href={cfg.download}
            className="lsg-download"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for Windows{' '}
            <DownloadSimpleIcon size={19} aria-hidden="true" />
          </a>
          <span>Windows 10 / 11 · Self-contained x64 · v{cfg.version}</span>
        </div>
      </section>
      <footer className="lsg-footer">
        <Link to="/projects">
          <ArrowLeftIcon size={16} aria-hidden="true" /> Projects
        </Link>
        <span>Independent software by Fezcode</span>
        <div>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            <GithubLogoIcon size={18} aria-hidden="true" /> Source
          </a>
          <a
            href={cfg.repo + '/blob/main/LICENSE.txt'}
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT license
          </a>
        </div>
      </footer>
    </div>
  );
}
