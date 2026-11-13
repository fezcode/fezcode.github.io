import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BluetoothIcon,
  CheckIcon,
  GithubLogoIcon,
} from '@phosphor-icons/react';
import { useAnimation } from '../../context/AnimationContext';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';
import '../../styles/project-showcases/BeetleShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400&display=swap';
const SWATCHES = [
  { hue: 286, name: 'Orchid' },
  { hue: 342, name: 'Rose' },
  { hue: 26, name: 'Ember' },
  { hue: 78, name: 'Lime' },
  { hue: 168, name: 'Lagoon' },
  { hue: 218, name: 'Electric blue' },
];

function hueToHex(hue) {
  const channel = (offset) => {
    const k = (offset + hue / 30) % 12;
    return Math.round(
      255 * (0.65 - 0.85 * 0.35 * Math.max(-1, Math.min(k - 3, 9 - k, 1))),
    )
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

function SpectralOrbit() {
  return (
    <svg
      className="bt-orbit"
      viewBox="0 0 700 700"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="350"
        cy="350"
        r="310"
        stroke="currentColor"
        strokeOpacity=".12"
      />
      <circle
        cx="350"
        cy="350"
        r="286"
        stroke="currentColor"
        strokeOpacity=".08"
        strokeDasharray="2 9"
      />
      {Array.from({ length: 72 }, (_, index) => {
        const angle = (index * Math.PI) / 36;
        const radius = index % 6 === 0 ? 325 : 318;
        return (
          <path
            key={index}
            d={`M${350 + 310 * Math.cos(angle)} ${350 + 310 * Math.sin(angle)}L${350 + radius * Math.cos(angle)} ${350 + radius * Math.sin(angle)}`}
            stroke="currentColor"
            strokeOpacity={index % 6 === 0 ? '.38' : '.13'}
          />
        );
      })}
      <ellipse
        cx="350"
        cy="350"
        rx="326"
        ry="115"
        transform="rotate(-28 350 350)"
        stroke="currentColor"
        strokeOpacity=".3"
      />
      <ellipse
        cx="350"
        cy="350"
        rx="326"
        ry="115"
        transform="rotate(40 350 350)"
        stroke="currentColor"
        strokeOpacity=".15"
      />
      <circle cx="646" cy="214" r="5" fill="currentColor" />
      <circle cx="81" cy="529" r="3" fill="currentColor" />
    </svg>
  );
}

function LightControls({
  hue,
  brightness,
  onHue,
  onBrightness,
  id,
  compact = false,
}) {
  return (
    <div
      className={`bt-light-controls ${compact ? 'bt-controls-compact' : ''}`}
    >
      <div className="bt-control-heading">
        <span>YOUR COLOUR, YOUR CALL.</span>
        <output>{hueToHex(hue)}</output>
      </div>
      <div className="bt-swatches" aria-label="Illustration colour presets">
        {SWATCHES.map((swatch) => (
          <button
            type="button"
            key={swatch.name}
            aria-label={`Preview ${swatch.name}`}
            aria-pressed={hue === swatch.hue}
            onClick={() => onHue(swatch.hue)}
            style={{ '--swatch': hueToHex(swatch.hue) }}
          >
            {hue === swatch.hue && <CheckIcon size={13} weight="bold" />}
          </button>
        ))}
      </div>
      {!compact && (
        <div className="bt-control-row">
          <label htmlFor={`${id}-hue`}>Hue</label>
          <input
            id={`${id}-hue`}
            className="bt-hue-range"
            type="range"
            min="0"
            max="359"
            value={hue}
            aria-valuetext={hueToHex(hue)}
            onChange={(event) => onHue(Number(event.target.value))}
          />
          <output>{hue}°</output>
        </div>
      )}
      <div className="bt-control-row">
        <label htmlFor={`${id}-brightness`}>Intensity</label>
        <input
          id={`${id}-brightness`}
          type="range"
          min="10"
          max="100"
          value={brightness}
          onChange={(event) => onBrightness(Number(event.target.value))}
        />
        <output>{brightness}%</output>
      </div>
    </div>
  );
}

function RoomStudy({ mode }) {
  return (
    <div
      className={`bt-room bt-room-${mode}`}
      aria-label={`${mode} lighting illustration`}
      role="img"
    >
      <div className="bt-room-wall" />
      <div className="bt-room-floor" />
      <div className="bt-room-light" />
      <div className="bt-room-screen">
        <div className="bt-room-picture">
          <span />
          <span />
          <span />
        </div>
        <span className="bt-screen-detail">
          A LITTLE MORE
          <br />
          <em>atmosphere.</em>
        </span>
      </div>
      <div className="bt-room-console">
        <span />
        <span />
      </div>
      <div className="bt-room-vase" />
      <div className="bt-led-strip">
        {Array.from({ length: 21 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      {mode === 'music' && (
        <div className="bt-music-bars" aria-hidden="true">
          {Array.from({ length: 15 }, (_, index) => (
            <i key={index} style={{ '--bar': index }} />
          ))}
        </div>
      )}
      <span className="bt-room-coordinate">
        FIG. 01 / AN ILLUSTRATION OF FEELING
      </span>
    </div>
  );
}

export default function BeetleProjectPage() {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'beetle-showcase');
  const prefersReducedMotion = useReducedMotion();
  const { reduceMotion } = useAnimation();
  const [hue, setHue] = useState(286);
  const [brightness, setBrightness] = useState(80);
  const [mode, setMode] = useState('ambient');
  const [shotIndex, setShotIndex] = useState(0);

  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#08090b" color="#f7f4eb" />;

  const selectedMode =
    cfg.modes.find((item) => item.id === mode) || cfg.modes[0];
  const shot = cfg.shots[shotIndex];
  const setColour = (value) => {
    setHue(value);
    setMode('colour');
  };
  const motionOff = prefersReducedMotion || reduceMotion;

  return (
    <div
      className={`beetle-showcase ${motionOff ? 'bt-motion-off' : ''}`}
      style={{
        '--bt-colour': hueToHex(hue),
        '--bt-hue': hue,
        '--bt-power': brightness / 100,
      }}
      id="beetle-top"
    >
      <AppSeo cfg={cfg} project={project} />
      <a className="bt-skip" href="#beetle-study">
        Skip to the light study
      </a>
      <header className="bt-nav bt-container">
        <Link to="/projects" className="bt-back">
          <ArrowLeftIcon size={16} /> All projects
        </Link>
        <a className="bt-mini-brand" href="#beetle-top">
          <img
            src="/images/projects/beetle/scarab.webp"
            width="32"
            height="32"
            alt=""
          />
          BEETLE<span>by fezcode</span>
        </a>
        <a
          className="bt-nav-get"
          href={cfg.download}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get the app <ArrowUpRightIcon size={16} />
        </a>
      </header>

      <section className="bt-hero bt-container" aria-labelledby="beetle-title">
        <div className="bt-hero-topline">
          <span>LIGHT, WITH A LIFE OF ITS OWN.</span>
          <span>
            <BluetoothIcon size={14} /> A BLUETOOTH LIGHT CONTROLLER
          </span>
        </div>
        <h1 className="bt-wordmark" id="beetle-title">
          beetle<span aria-hidden="true">01</span>
        </h1>
        <div className="bt-hero-sculpture" aria-hidden="true">
          <div className="bt-sculpture-glow" />
          <SpectralOrbit />
          <img
            className="bt-scarab"
            src="/images/projects/beetle/scarab.webp"
            width="1100"
            height="1100"
            alt=""
            fetchPriority="high"
          />
          <span className="bt-sculpture-caption">
            SPECIMEN B—01
            <br />
            CHROME / COLOUR / CONNECTION
          </span>
        </div>
        <div className="bt-hero-copy">
          <p className="bt-micro">YOUR ROOM. REIMAGINED.</p>
          <h2>
            Give your room
            <br />
            <em>a pulse.</em>
          </h2>
          <p>
            Your screen, your sound, your mood. Let an ordinary LED strip become
            part of the experience.
          </p>
          <a
            href={cfg.download}
            className="bt-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for Windows <ArrowUpRightIcon size={18} />
          </a>
        </div>
        <aside className="bt-hero-controller">
          <span className="bt-micro">TOUCH THE ATMOSPHERE</span>
          <LightControls
            compact
            hue={hue}
            brightness={brightness}
            onHue={setColour}
            onBrightness={setBrightness}
            id="beetle-hero"
          />
          <span className="bt-preview-note">An interactive light study.</span>
        </aside>
        <div className="bt-hero-baseline">
          <span>ELK-BLEDOM / BLUETOOTH LE</span>
          <span>DESIGNED TO DISAPPEAR INTO THE FEELING.</span>
          <a href="#beetle-study">
            Enter the light study <ArrowDownIcon size={15} />
          </a>
        </div>
      </section>

      <section className="bt-manifesto" aria-label="The idea behind Beetle">
        <div className="bt-container">
          <span className="bt-micro">BEYOND THE EDGE OF YOUR SCREEN</span>
          <p>
            Some things don’t need
            <br />
            more <span>attention.</span>
            <br />
            They need more <em>atmosphere.</em>
          </p>
          <span className="bt-manifesto-note">
            A small app. A different room.
          </span>
        </div>
      </section>

      <section
        className="bt-study"
        id="beetle-study"
        aria-labelledby="beetle-study-title"
      >
        <div className="bt-container">
          <div className="bt-section-intro">
            <p className="bt-micro">01 / THE LIGHT STUDY</p>
            <h2 id="beetle-study-title">
              Change the colour.
              <br />
              <em>Change the feeling.</em>
            </h2>
            <p>
              Try a mood. Move the light. This is an illustration of Beetle’s
              modes; your desktop app makes the Bluetooth connection.
            </p>
          </div>
          <div className="bt-study-layout">
            <div className="bt-study-art">
              <RoomStudy mode={mode} />
              <div
                className="bt-mode-selector"
                aria-label="Preview a lighting mode"
              >
                {cfg.modes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={mode === item.id}
                    onClick={() => setMode(item.id)}
                  >
                    <span>{item.number}</span>
                    {item.name}
                    <ArrowUpRightIcon size={15} />
                  </button>
                ))}
              </div>
            </div>
            <div className="bt-study-copy">
              <span className="bt-mode-index">/{selectedMode.number}</span>
              <div className="bt-mode-story" aria-live="polite">
                <h3>{selectedMode.verb}</h3>
                <p>{selectedMode.body}</p>
                <span className="bt-mode-detail">{selectedMode.detail}</span>
              </div>
              <LightControls
                hue={hue}
                brightness={brightness}
                onHue={setColour}
                onBrightness={setBrightness}
                id="beetle-study"
              />
              <p className="bt-preview-note">
                Illustrative animation. One strip, one colour at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bt-native bt-container"
        aria-labelledby="beetle-native-title"
      >
        <div className="bt-native-copy">
          <p className="bt-micro">02 / MEET THE REAL THING</p>
          <h2 id="beetle-native-title">
            Small window.
            <br />
            <em>Big atmosphere.</em>
          </h2>
          <p>
            Connect your strip. Find your colour. Then let Beetle take its place
            in the tray while you get on with the good stuff.
          </p>
          <div className="bt-native-tabs" aria-label="App screenshots">
            {cfg.shots.map((item, index) => (
              <button
                type="button"
                key={item.label}
                onClick={() => setShotIndex(index)}
                aria-pressed={shotIndex === index}
              >
                {item.label}
                <ArrowUpRightIcon size={14} />
              </button>
            ))}
          </div>
          <p className="bt-image-caption" aria-live="polite">
            {shot.caption}
          </p>
          <a
            className="bt-text-link"
            href={cfg.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Look under the shell <GithubLogoIcon size={17} />
          </a>
        </div>
        <div className="bt-native-stage">
          <span className="bt-native-orbit" aria-hidden="true" />
          <img src={shot.src} alt={shot.caption} loading="lazy" />
          <span className="bt-native-number" aria-hidden="true">
            B.
          </span>
        </div>
      </section>

      <section
        className="bt-details bt-container"
        aria-labelledby="beetle-details-title"
      >
        <div className="bt-detail-title">
          <p className="bt-micro">03 / NO EXTRA BAGGAGE</p>
          <h2 id="beetle-details-title">
            Just you.
            <br />
            Your strip.
            <br />
            <em>The connection.</em>
          </h2>
        </div>
        <div className="bt-detail-list">
          <article>
            <span>01</span>
            <h3>From your PC to your light.</h3>
            <p>
              Bluetooth LE, directly to an ELK-BLEDOM strip. No cloud account,
              hub, or background service. Beetle reconnects to the strip it
              remembers.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Your soundtrack, in colour.</h3>
            <p>
              Music mode listens to what your PC is playing, through audio
              loopback. It never uses your microphone. Choose beat colours or
              let the wheel take over.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Good at staying out of the way.</h3>
            <p>
              Close the window and ambient lighting carries on from the tray.
              Your strip, colour, brightness, sample area, boost, and theme are
              remembered.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>A precise little instrument.</h3>
            <p>
              Built for Windows with C#, .NET 10 and Avalonia 12. Ambient
              sampling uses the primary monitor. The strip is one colour zone,
              beautifully in sync.
            </p>
          </article>
        </div>
      </section>

      <section className="bt-finale" aria-labelledby="beetle-download-title">
        <div className="bt-container">
          <p className="bt-micro">WINDOWS / ELK-BLEDOM / YOUR IMAGINATION</p>
          <h2 id="beetle-download-title">
            It’s time
            <br />
            <em>to glow.</em>
            <ArrowUpRightIcon weight="thin" aria-hidden="true" />
          </h2>
          <div className="bt-finale-actions">
            <a
              href={cfg.download}
              className="bt-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Beetle <ArrowUpRightIcon size={18} />
            </a>
            <a
              href={cfg.repo}
              className="bt-text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open source, open possibilities <GithubLogoIcon size={18} />
            </a>
          </div>
          <p className="bt-install-note">
            Windows 10 / 11 · Bluetooth LE · .NET 10 runtime required
          </p>
        </div>
      </section>
      <footer className="bt-footer bt-container">
        <Link to="/projects">
          <ArrowLeftIcon size={15} /> Back to the collection
        </Link>
        <span>BEETLE / v{project?.version || cfg.version}</span>
        <span>LIGHT BY YOU. BEETLE BY FEZCODE.</span>
      </footer>
    </div>
  );
}
