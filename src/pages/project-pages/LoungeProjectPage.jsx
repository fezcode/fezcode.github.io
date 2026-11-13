import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GameControllerIcon,
  GithubLogoIcon,
  PlayIcon,
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
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

const RoomArt = ({ room, slide }) => {
  if (room === 'music') {
    return (
      <div
        className={`lng-room-art lng-music-art lng-art-${slide}`}
        aria-hidden="true"
      >
        <div className="lng-record-orbit" />
        <div className="lng-vinyl">
          <span />
          <i />
        </div>
        <div className="lng-music-title">
          SIDE
          <br />
          <em>{['A', 'B', 'C'][slide]}</em>
        </div>
        <div className="lng-soundbars">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              style={{ '--bar-height': `${18 + ((index * 23) % 68)}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (room === 'games') {
    return (
      <div
        className={`lng-room-art lng-games-art lng-art-${slide}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lng-game-sky" x2="0" y2="1">
              <stop stopColor="#111437" />
              <stop offset=".6" stopColor="#5a316d" />
              <stop offset="1" stopColor="#1a162b" />
            </linearGradient>
            <linearGradient id="lng-game-sun" x2="0" y2="1">
              <stop stopColor="#ffdf9c" />
              <stop offset="1" stopColor="#d383b8" />
            </linearGradient>
          </defs>
          <path fill="url(#lng-game-sky)" d="M0 0h1200v660H0z" />
          <circle cx="810" cy="260" r="132" fill="url(#lng-game-sun)" />
          <path
            d="m0 418 137-79 90 46 120-85 115 91 125-36 91 61 122-89 132 50 118-39 150 80v242H0Z"
            fill="#18132b"
          />
          <g stroke="#aa84bd" strokeOpacity=".4">
            {Array.from({ length: 19 }, (_, i) => (
              <path key={i} d={`M600 420 ${-700 + i * 145} 660`} />
            ))}
            {[440, 466, 500, 546, 604].map((y) => (
              <path key={y} d={`M0 ${y}h1200`} />
            ))}
          </g>
          <path
            d="m580 389 34 60 84 13-72 30 20 72-64-48-63 48 17-72-72-30 83-13Z"
            fill="#ede0d2"
          />
          <path d="m582 424 6 59 40 17-46-4-40 26 26-35Z" fill="#b286b4" />
        </svg>
        <span className="lng-game-coordinate">
          {
            [
              'VECTOR 00.37 / HORIZON',
              'VECTOR 08.21 / RUNWAY',
              'VECTOR 21.04 / BETWEEN',
            ][slide]
          }
        </span>
      </div>
    );
  }
  return (
    <div
      className={`lng-room-art lng-cinema-art lng-art-${slide}`}
      aria-hidden="true"
    >
      <img src="/images/projects/lounge/midnight-reel.svg" alt="" />
      <div className="lng-film-typeset">
        <span>A LOUNGE PICTURE</span>
        <strong>
          {['THE LAST', 'BEYOND', 'AFTER THE'][slide]}
          <br />
          <em>{['LIGHT', 'THE BLUE', 'SATELLITES'][slide]}</em>
        </strong>
      </div>
      <span className="lng-film-credit">
        AN ILLUSTRATIVE WORLD / FROM YOUR OWN COLLECTION
      </span>
    </div>
  );
};

const ControllerDrawing = () => (
  <svg
    className="lng-controller-drawing"
    viewBox="0 0 760 440"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="lng-pad-body"
        x1="200"
        y1="80"
        x2="550"
        y2="400"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#eee0d9" />
        <stop offset="1" stopColor="#b6a0b4" />
      </linearGradient>
      <radialGradient id="lng-pad-stick">
        <stop stopColor="#292335" />
        <stop offset="1" stopColor="#4b3b53" />
      </radialGradient>
    </defs>
    <ellipse cx="380" cy="371" rx="250" ry="32" fill="#291e3a" opacity=".19" />
    <path
      d="M221 109c-26-13-45-2-55 25l-40 134c-23 78-4 122 35 122 27 0 54-39 83-67h272c29 28 56 67 83 67 39 0 58-44 35-122l-40-134c-10-27-29-38-55-25-95-20-223-20-318 0Z"
      fill="url(#lng-pad-body)"
      stroke="#f5eae3"
      strokeWidth="3"
    />
    <path
      d="M219 102v-19c0-12 12-22 30-22h70v39m122 0V61h70c18 0 30 10 30 22v19"
      fill="#3b2f46"
    />
    <path
      d="M198 123c85-30 277-30 364 0"
      stroke="#fff6e9"
      strokeOpacity=".6"
      strokeWidth="2"
    />
    <circle cx="249" cy="182" r="48" fill="#9c879f" />
    <circle cx="249" cy="182" r="37" fill="url(#lng-pad-stick)" />
    <circle cx="249" cy="182" r="25" stroke="#77617e" strokeWidth="2" />
    <circle cx="446" cy="276" r="45" fill="#9c879f" />
    <circle cx="446" cy="276" r="34" fill="url(#lng-pad-stick)" />
    <circle cx="446" cy="276" r="22" stroke="#77617e" strokeWidth="2" />
    <path
      d="M287 244h27v-27h28v27h27v28h-27v27h-28v-27h-27Z"
      fill="#43344b"
      stroke="#89728e"
      strokeWidth="2"
    />
    <circle cx="540" cy="179" r="18" fill="#d0af77" />
    <circle cx="540" cy="239" r="18" fill="#9fb587" />
    <circle cx="510" cy="209" r="18" fill="#8aa8b8" />
    <circle cx="570" cy="209" r="18" fill="#c78c9c" />
    <g fill="#25212b" fontFamily="sans-serif" fontSize="14" textAnchor="middle">
      <text x="540" y="184">
        Y
      </text>
      <text x="540" y="244">
        A
      </text>
      <text x="510" y="214">
        X
      </text>
      <text x="570" y="214">
        B
      </text>
    </g>
    <circle
      cx="380"
      cy="155"
      r="17"
      fill="#efe8db"
      stroke="#c0acb5"
      strokeWidth="2"
    />
    <path d="m371 149 18 13m0-13-18 13" stroke="#8f7898" strokeWidth="2" />
    <rect x="339" y="197" width="22" height="14" rx="7" fill="#5c4765" />
    <rect x="397" y="197" width="22" height="14" rx="7" fill="#5c4765" />
  </svg>
);

const LoungeProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'lounge-cinema');
  const [roomIndex, setRoomIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#0b0913" color="#f4e8d8" />;

  const rooms = cfg.rooms || [];
  const room = rooms[roomIndex];
  const chooseRoom = (index) => {
    setRoomIndex(index);
    setSlideIndex(0);
  };
  const browse = (direction) =>
    setSlideIndex(
      (index) => (index + direction + room.titles.length) % room.titles.length,
    );
  const handlePreviewKey = (event) => {
    if (
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') browse(-1);
    if (event.key === 'ArrowRight') browse(1);
    if (event.key === 'ArrowUp')
      chooseRoom((roomIndex + rooms.length - 1) % rooms.length);
    if (event.key === 'ArrowDown') chooseRoom((roomIndex + 1) % rooms.length);
  };

  return (
    <div className="lounge-showcase" id="lounge-top">
      <AppSeo cfg={cfg} project={project} />
      <a className="lng-skip" href="#lounge-content">
        Skip to the experience
      </a>
      <header className="lng-nav">
        <Link className="lng-back" to="/projects">
          <ArrowLeftIcon size={16} /> PROJECT INDEX
        </Link>
        <a className="lng-nav-logo" href="#lounge-top">
          Lounge<span>™</span>
        </a>
        <a
          className="lng-nav-download"
          href={cfg.download}
          target="_blank"
          rel="noopener noreferrer"
        >
          TAKE YOUR SEAT <ArrowUpRightIcon size={18} />
        </a>
      </header>

      <section className="lng-hero" aria-labelledby="lounge-title">
        <div className="lng-hero-landscape" aria-hidden="true" />
        <div className="lng-hero-vignette" aria-hidden="true" />
        <div className="lng-hero-topline">
          <span>PERSONAL CINEMA / OPEN LATE</span>
          <span>WINDOWS · XBOX CONTROLLER · YOU</span>
        </div>
        <div className="lng-hero-copy">
          <p className="lng-kicker">THE WORLD CAN WAIT A LITTLE.</p>
          <h1 id="lounge-title">
            The evening
            <br />
            <em>is yours.</em>
          </h1>
          <p>
            Your films. Your music. Your next obsession.
            <br />
            Your whole PC, from the best seat in the house.
          </p>
          <div className="lng-hero-actions">
            <a
              className="lng-cream-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Lounge <ArrowUpRightIcon size={20} />
            </a>
            <a className="lng-cinema-link" href="#lounge-experience">
              <PlayIcon weight="fill" size={14} /> Step inside
            </a>
          </div>
        </div>
        <div className="lng-hero-seal" aria-hidden="true">
          <span>NO DESK REQUIRED</span>
          <GameControllerIcon size={54} weight="light" />
          <span>A VERY GOOD EVENING</span>
        </div>
        <div className="lng-hero-bottom">
          <span>
            <i /> YOUR PC, ON THE COUCH.
          </span>
          <a href="#lounge-content">
            LOWER THE LIGHTS <ArrowDownIcon size={16} />
          </a>
          <span>VOL. {cfg.version}</span>
        </div>
        <div className="lng-hero-wordmark" aria-hidden="true">
          LOUNGE
        </div>
      </section>

      <main id="lounge-content">
        <section className="lng-introduction lng-width">
          <p className="lng-kicker">
            AN INVITATION TO DO LESS. AND ENJOY MORE.
          </p>
          <h2>
            There’s a whole world
            <br />
            on the other side of <em>“play.”</em>
          </h2>
          <p>
            Lounge turns a Windows PC into a full-screen media center. An Xbox
            controller takes you from your own film collection to an album, a
            game, or the web. Leave the keyboard where it is.
          </p>
          <span className="lng-section-no">ACT I / THE EVENING</span>
        </section>

        <section
          className="lng-experience-section"
          id="lounge-experience"
          aria-labelledby="lounge-experience-title"
        >
          <div className="lng-width lng-section-header">
            <p className="lng-kicker">
              THREE ROOMS. ONE VERY COMFORTABLE SEAT.
            </p>
            <h2 id="lounge-experience-title">
              What are you
              <br />
              <em>in the mood for?</em>
            </h2>
            <p>
              Explore an illustrated media concept.
              <br />
              The library, the accounts, and the evening are yours.
            </p>
          </div>
          <div
            className="lng-media-console"
            tabIndex={0}
            role="group"
            aria-label="Interactive media preview. Left and right browse artwork. Up and down change rooms."
            onKeyDown={handlePreviewKey}
          >
            <div className="lng-console-top">
              <span className="lng-console-brand">Lounge</span>
              <div className="lng-room-switcher" aria-label="Choose your room">
                {rooms.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={index === roomIndex}
                    onClick={() => chooseRoom(index)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="lng-console-clock">AFTER HOURS</span>
            </div>
            <div className="lng-scene" data-room={room.id}>
              <RoomArt room={room.id} slide={slideIndex} />
              <div className="lng-scene-shade" />
              <div className="lng-scene-caption" aria-live="polite">
                <span>{room.eyebrow}</span>
                <h3>{room.titles[slideIndex]}</h3>
                <p>{room.body}</p>
              </div>
              <div className="lng-scene-number" aria-hidden="true">
                0{slideIndex + 1}
                <span>/ 03</span>
              </div>
            </div>
            <div className="lng-console-bottom">
              <span>
                <i className="lng-a-button">A</i> EXPLORE YOUR EVENING
              </span>
              <span className="lng-key-hint">← → BROWSE · ↑ ↓ CHANGE ROOM</span>
              <div className="lng-carousel-controls">
                <button
                  type="button"
                  onClick={() => browse(-1)}
                  aria-label="Previous illustrative title"
                >
                  <ArrowLeftIcon size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => browse(1)}
                  aria-label="Next illustrative title"
                >
                  <ArrowRightIcon size={20} />
                </button>
              </div>
            </div>
            <div className="lng-reel-index">
              {room.titles.map((title, index) => (
                <button
                  key={title}
                  className={index === slideIndex ? 'is-selected' : ''}
                  type="button"
                  aria-pressed={index === slideIndex}
                  onClick={() => setSlideIndex(index)}
                >
                  <span>0{index + 1}</span>
                  {title}
                  <ArrowUpRightIcon size={16} />
                </button>
              ))}
            </div>
          </div>
          <p className="lng-preview-note lng-width">
            {room.meta}. Artwork and titles above are illustrative; this page
            does not play or include media.
          </p>
        </section>

        <section
          className="lng-player-section lng-width"
          aria-labelledby="lounge-player-title"
        >
          <div className="lng-player-head">
            <span className="lng-section-no">ACT II / THE REAL THING</span>
            <h2 id="lounge-player-title">
              Made for the screen
              <br />
              <em>across the room.</em>
            </h2>
            <p>
              The picture is big. The details matter. Lounge’s native player
              decodes your own collection with FFmpeg 8, hardware acceleration,
              proper subtitles, and exact seeks.
            </p>
          </div>
          <figure className="lng-real-screen">
            <img
              src="/images/projects/lounge/aurora-home.webp"
              width="1600"
              height="900"
              alt="Actual Lounge Aurora home screen, with controller navigation and a local video collection"
              loading="lazy"
            />
            <figcaption>
              <span>ACTUAL APPLICATION / AURORA HOME</span>
              <span>LOCAL LIBRARY · CONTROLLER FIRST</span>
            </figcaption>
          </figure>
          <div className="lng-player-specs">
            <div>
              <strong>FFmpeg 8</strong>
              <span>YOUR LOCAL FILMS, NATIVE PLAYBACK</span>
            </div>
            <div>
              <strong>libass</strong>
              <span>SIDECAR + BITMAP SUBTITLES</span>
            </div>
            <div>
              <strong>Pick up. Play.</strong>
              <span>RESUME / CHAPTERS / NEXT UP</span>
            </div>
          </div>
        </section>

        <section
          className="lng-controller-section"
          aria-labelledby="lounge-controller-title"
        >
          <div className="lng-width lng-controller-layout">
            <div className="lng-controller-copy">
              <p className="lng-kicker">ACT III / PUT YOUR FEET UP</p>
              <h2 id="lounge-controller-title">
                Give your keyboard
                <br />
                <em>the night off.</em>
              </h2>
              <p>
                Select with A. Go back with B. Squeeze a trigger to scrub
                through a film. Every press, hold, and combination can be
                remapped for the way you relax.
              </p>
              <a
                href={`${cfg.repo}/blob/main/README.md#on-the-couch`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Meet your remote <ArrowUpRightIcon size={18} />
              </a>
            </div>
            <div className="lng-controller-plate">
              <span className="lng-controller-annotation lng-controller-annotation-top">
                PRESS / HOLD / MAKE IT YOURS
              </span>
              <ControllerDrawing />
              <div className="lng-controller-legend">
                <span>
                  <b>A</b> SELECT
                </span>
                <span>
                  <b>B</b> BACK
                </span>
                <span>
                  <b>RT</b> SCRUB
                </span>
                <span>
                  <b>HOLD VIEW</b> HOME
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="lng-library-section lng-width"
          aria-labelledby="lounge-library-title"
        >
          <div className="lng-library-heading">
            <span className="lng-kicker">
              THE WHOLE EVENING, ACCOUNTED FOR.
            </span>
            <h2 id="lounge-library-title">
              All the things
              <br />
              you come <em>home to.</em>
            </h2>
          </div>
          <div className="lng-library-ledger">
            {cfg.library.map((item) => (
              <article key={item.number}>
                <span className="lng-ledger-number">{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
                <span className="lng-ledger-detail">{item.detail}</span>
              </article>
            ))}
          </div>
          <p className="lng-library-fineprint">
            Web services use your own accounts and subscriptions. Some protected
            video may need your full browser. Lounge keeps your media local; it
            does not supply a streaming catalogue.
          </p>
        </section>

        <section
          className="lng-closing"
          aria-labelledby="lounge-download-title"
        >
          <div className="lng-closing-orbit" aria-hidden="true" />
          <div className="lng-width">
            <p className="lng-kicker">
              YOUR EVENING. YOUR COLLECTION. YOUR SEAT.
            </p>
            <h2 id="lounge-download-title">
              Make yourself
              <br />
              <em>at home.</em>
            </h2>
            <a
              className="lng-cream-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Lounge for Windows <ArrowUpRightIcon size={20} />
            </a>
            <p>WINDOWS 10 / 11 · SELF-CONTAINED X64 BUILD · V{cfg.version}</p>
          </div>
        </section>
      </main>

      <footer className="lng-footer lng-width">
        <a className="lng-footer-logo" href="#lounge-top">
          Lounge
        </a>
        <p>
          A media center by fezcode.
          <br />A little closer to the good life.
        </p>
        <div>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            <GithubLogoIcon size={17} /> GitHub
          </a>
          <a
            href={`${cfg.repo}/blob/main/LICENSE.txt`}
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License <ArrowUpRightIcon size={15} />
          </a>
          <Link to="/projects">
            Project index <ArrowUpRightIcon size={15} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LoungeProjectPage;
