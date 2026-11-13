import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useAppConfig,
  useThemeFonts,
  AppSeo,
  AppLoading,
  AppMissing,
} from './app-shell';
import '../../styles/project-showcases/TarmanShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap';
const CHANNELS = [
  { id: 'cpu', name: 'CPU', unit: '%', max: 100 },
  { id: 'memory', name: 'MEMORY', unit: 'GB', max: 32 },
  { id: 'disk', name: 'DISK I/O', unit: 'MB/s', max: 200 },
  { id: 'gpu', name: 'GPU', unit: '%', max: 100 },
];
const RECORD = Array.from({ length: 61 }, (_, index) => {
  const spike = Math.exp(-Math.pow((index - 37) / 3.2, 2));
  return {
    cpu: Math.round(16 + 8 * Math.abs(Math.sin(index * 0.53)) + spike * 67),
    memory: Math.round((9.2 + index * 0.046 + spike * 3.1) * 10) / 10,
    disk: Math.round(3 + 12 * Math.abs(Math.sin(index * 0.8)) + spike * 166),
    gpu: Math.round(8 + 12 * Math.abs(Math.cos(index * 0.28)) + spike * 34),
  };
});
const pad = (value) => String(value).padStart(2, '0');
const sampleTime = (index) =>
  '14:' + pad(32 + Math.floor(index / 6)) + ':' + pad((index % 6) * 10);

const RecorderGraphic = () => (
  <div className="tm-instrument" aria-hidden="true">
    <div className="tm-instrument-coordinate tm-coordinate-top">
      REC / 600.000 S
    </div>
    <svg viewBox="0 0 600 600" className="tm-polar">
      <defs>
        <linearGradient id="tm-trace-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff733f" stopOpacity=".1" />
          <stop offset="100%" stopColor="#ff733f" />
        </linearGradient>
        <radialGradient id="tm-center-glow">
          <stop offset="0%" stopColor="#ff6c33" stopOpacity=".13" />
          <stop offset="100%" stopColor="#ff6c33" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="275" fill="url(#tm-center-glow)" />
      {[100, 150, 200, 250, 275].map((radius) => (
        <circle
          key={radius}
          cx="300"
          cy="300"
          r={radius}
          className="tm-orbit"
        />
      ))}
      <circle cx="300" cy="300" r="261" className="tm-orbit-ticks" />
      <path
        d="M25 300h550M300 25v550M105 105l390 390M105 495l390-390"
        className="tm-axis"
      />
      <path d="M300 50a250 250 0 0 1 227 354" className="tm-orbit-highlight" />
      <path
        d="M57 350 99 331 122 345 158 316 177 321 194 302 211 324 230 314 246 326 263 210 274 358 286 281 302 308 318 288 337 310 352 303 366 320 392 299 405 309 423 292 438 302 465 275 489 290 523 270 544 281"
        className="tm-hero-trace"
      />
      <circle cx="263" cy="210" r="5" fill="#ff733f" />
      <path d="M263 210v-60h70" className="tm-callout" />
      <text x="343" y="154" className="tm-svg-note">
        EVENT CAPTURED
      </text>
      {[0, 1, 2, 3].map((i) => (
        <text
          key={i}
          x={[300, 565, 300, 25][i]}
          y={[17, 305, 590, 305][i]}
          textAnchor="middle"
          className="tm-svg-coordinate"
        >
          {['000', '150', '300', '450'][i]}
        </text>
      ))}
    </svg>
    <div className="tm-instrument-core">
      <span>THE MOVING WINDOW</span>
      <strong>
        10<span>:</span>00
      </strong>
      <span>EVERY SECOND / EVERY PROCESS</span>
    </div>
    <div className="tm-instrument-coordinate tm-coordinate-bottom">
      <span className="tm-led" /> BLACK BOX: ONLINE
    </div>
  </div>
);

const Timeline = () => {
  const [index, setIndex] = useState(37);
  const [channelId, setChannelId] = useState('cpu');
  const channel = CHANNELS.find((item) => item.id === channelId);
  const sample = RECORD[index];
  const chartY = (value) => 237 - (value / channel.max) * 211;
  const points = RECORD.map(
    (item, i) => (i / 60) * 1000 + ',' + chartY(item[channel.id]),
  ).join(' ');
  const cursor = (index / 60) * 1000;
  const processNames =
    index >= 34 && index <= 41
      ? ['compiler.exe', 'renderer.exe', 'browser.exe']
      : ['browser.exe', 'editor.exe', 'system'];
  const processRatios = [0.61, 0.23, 0.11];
  return (
    <div className="tm-recorder">
      <div className="tm-recorder-toolbar">
        <span>
          <span className="tm-led" /> ILLUSTRATIVE RECORDING
        </span>
        <span>14:32:00 — 14:42:00</span>
      </div>
      <div className="tm-recorder-grid">
        <div className="tm-timeline">
          <div className="tm-channel-tabs" aria-label="Choose a sample metric">
            {CHANNELS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === channelId}
                onClick={() => setChannelId(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="tm-chart">
            <svg
              viewBox="0 0 1000 260"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="tm-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff733f" stopOpacity=".3" />
                  <stop offset="100%" stopColor="#ff733f" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[26, 79, 132, 185, 237].map((y) => (
                <path
                  key={y}
                  d={'M0 ' + y + 'H1000'}
                  className="tm-chart-grid"
                />
              ))}
              {[0, 200, 400, 600, 800, 1000].map((x) => (
                <path
                  key={x}
                  d={'M' + x + ' 0V260'}
                  className="tm-chart-grid"
                />
              ))}
              <polygon
                points={'0,260 ' + points + ' 1000,260'}
                fill="url(#tm-chart-fill)"
              />
              <polyline points={points} className="tm-chart-line" />
              <path d={'M' + cursor + ' 0V260'} className="tm-chart-cursor" />
              <circle
                cx={cursor}
                cy={chartY(sample[channel.id])}
                r="5"
                className="tm-chart-point"
              />
            </svg>
            <span className="tm-chart-unit">
              {channel.max} {channel.unit}
            </span>
            <span className="tm-chart-stamp">{sampleTime(index)}</span>
          </div>
          <label className="tm-slider-label" htmlFor="tm-history-scrubber">
            SCRUB THE TEN-MINUTE WINDOW <span>← MOVE THROUGH TIME →</span>
          </label>
          <input
            id="tm-history-scrubber"
            className="tm-scrubber"
            type="range"
            min="0"
            max="60"
            step="1"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            aria-valuetext={
              sampleTime(index) +
              ', ' +
              channel.name +
              ' ' +
              sample[channel.id] +
              channel.unit
            }
          />
          <div className="tm-time-axis">
            <span>−10:00</span>
            <span>−05:00</span>
            <span>NOW</span>
          </div>
        </div>
        <div className="tm-sample-detail" aria-live="polite" aria-atomic="true">
          <div className="tm-detail-head">
            <span>CURSOR / {sampleTime(index)}</span>
            <button type="button" onClick={() => setIndex(60)}>
              LATEST ↗
            </button>
          </div>
          <strong className="tm-big-metric">
            {sample[channel.id]}
            <span>{channel.unit}</span>
          </strong>
          <span className="tm-metric-caption">
            {channel.name} AT THIS MOMENT
          </span>
          <div className="tm-process-list">
            <div className="tm-process-table-head">
              <span>TOP PROCESSES</span>
              <span>{channel.unit}</span>
            </div>
            {processNames.map((name, i) => (
              <div className="tm-process-row" key={name}>
                <span>
                  <i />
                  {name}
                </span>
                <strong>
                  {(sample[channel.id] * processRatios[i]).toFixed(1)}
                </strong>
              </div>
            ))}
          </div>
          <p>
            Sample data, designed to explore the interaction. No device
            telemetry is collected.
          </p>
        </div>
      </div>
      <div className="tm-recorder-footer">
        <span>ONE SHARED SAMPLE CLOCK</span>
        <span>ILLUSTRATIVE VIEW · 10 S INTERVALS</span>
        <span>TARMAN RECORDS ONCE PER SECOND</span>
      </div>
    </div>
  );
};

const TarmanProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'tarman-blackbox');
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#090b0c" color="#ece9e1" />;
  const version = project?.version || cfg.version;
  return (
    <div className="tarman-showcase" id="tarman-top">
      <AppSeo cfg={cfg} project={project} />
      <a href="#tm-main" className="tm-skip">
        Skip to content
      </a>
      <header className="tm-nav tm-shell">
        <Link to="/projects" className="tm-brand">
          <span className="tm-brand-mark">T/</span>
          <span>
            TARMAN<span className="tm-brand-sub">SYSTEM OBSERVATORY</span>
          </span>
        </Link>
        <nav aria-label="Tarman navigation">
          <a href="#tm-recorder">The recorder</a>
          <a href="#tm-system">The system</a>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            Source ↗
          </a>
        </nav>
        <a
          className="tm-nav-download"
          href={cfg.download}
          target="_blank"
          rel="noopener noreferrer"
        >
          GET TARMAN <span>↗</span>
        </a>
      </header>
      <main id="tm-main">
        <section className="tm-hero">
          <div className="tm-hero-grid" aria-hidden="true" />
          <div className="tm-shell tm-hero-overline">
            <span>
              <span className="tm-led" /> WINDOWS SYSTEM FLIGHT RECORDER
            </span>
            <span>C11 / RAYLIB / WIN32</span>
          </div>
          <h1 className="tm-monument" aria-label="Tarman">
            TARMAN<span aria-hidden="true">01</span>
          </h1>
          <div className="tm-shell tm-hero-lower">
            <div className="tm-hero-copy">
              <p className="tm-index">SIGNAL 001 / THE MOMENT BEFORE</p>
              <h2>
                THE SPIKE IS GONE.
                <br />
                <em>THE EVIDENCE ISN’T.</em>
              </h2>
              <p>
                Your machine has a story. Tarman keeps the last ten minutes — so
                you can find the process behind the moment.
              </p>
              <a href="#tm-recorder" className="tm-enter">
                ENTER THE RECORD <span>↓</span>
              </a>
              <span className="tm-hero-version">
                NATIVE WINDOWS APP / V{version} / MIT LICENSE
              </span>
            </div>
            <RecorderGraphic />
          </div>
          <div className="tm-shell tm-hero-caption">
            <span>NO RUNTIME. NO GUESSWORK.</span>
            <span>PROCESS / PERFORMANCE / HISTORY</span>
            <span>SCROLL TO RECONSTRUCT ↓</span>
          </div>
        </section>
        <section id="tm-recorder" className="tm-section tm-shell">
          <div className="tm-section-top">
            <p className="tm-index">01 / TEMPORAL ANALYSIS</p>
            <span className="tm-fine">600 SECONDS OF CONTEXT</span>
          </div>
          <div className="tm-section-intro">
            <h2>
              GO BACK.
              <br />
              <em>KNOW WHY.</em>
            </h2>
            <p>
              One cursor. Every graph. System and process histories share a
              clock, so the CPU spike, disk burst, and process that already
              exited all meet at the same second.
            </p>
          </div>
          <Timeline />
          <div className="tm-explainer">
            <span>THE REAL APP</span>
            <p>
              Hover a graph to scrub every metric. Click to pin a moment. Zoom
              between one, five, and ten minutes while recording continues.
            </p>
            <a
              href={cfg.repo + '#the-10-minute-window'}
              target="_blank"
              rel="noopener noreferrer"
            >
              READ THE FIELD MANUAL ↗
            </a>
          </div>
        </section>
        <section className="tm-screen-section" id="tm-system">
          <div className="tm-shell">
            <div className="tm-section-top">
              <p className="tm-index">02 / THE OBSERVATION DECK</p>
              <span className="tm-fine">
                ACTUAL APPLICATION / DEMONSTRATION MACHINE
              </span>
            </div>
            <h2>
              EVERY SIGNAL.
              <br />
              <span>ONE FIELD OF VIEW.</span>
            </h2>
            <figure className="tm-main-shot">
              <div className="tm-shot-rail">
                <span>ANALYSIS / ALL CHANNELS</span>
                <span>↗ TARMAN.EXE</span>
              </div>
              <img
                src="/images/projects/tarman/analysis.webp"
                width="1600"
                height="991"
                loading="lazy"
                alt="Tarman Analysis page showing CPU, memory, disk, network and GPU graphs on one shared timeline, alongside process history."
              />
              <figcaption>
                Synthetic machine rendered by Tarman’s built-in demo mode. Real
                application interface.
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="tm-shell tm-section tm-capabilities">
          <div className="tm-section-top">
            <p className="tm-index">03 / TOTAL SYSTEM VISIBILITY</p>
            <span className="tm-fine">FROM THE PROCESS TO THE FIRMWARE</span>
          </div>
          <div className="tm-capability-grid">
            <article>
              <span className="tm-feature-number">A / 01</span>
              <h3>
                NOT JUST
                <br />
                WHAT’S RUNNING.
              </h3>
              <p>
                Process trees. Per-process sparklines. Loaded modules. Average
                and peak CPU, memory growth, total I/O, and lifetimes —
                including processes that exited during the window.
              </p>
              <span className="tm-feature-foot">
                PROCESS HISTORY / WINDOW SUMMARY
              </span>
            </article>
            <article>
              <span className="tm-feature-number">B / 02</span>
              <h3>
                FOLLOW
                <br />
                THE PRESSURE.
              </h3>
              <p>
                Per-core CPU, physical memory, each disk and adapter. GPU
                engines, dedicated and shared memory, and driver-reported
                temperatures. See which resource carried the load.
              </p>
              <span className="tm-feature-foot">
                CPU / MEMORY / DISK / NETWORK / GPU
              </span>
            </article>
            <article>
              <span className="tm-feature-number">C / 03</span>
              <h3>
                BELOW
                <br />
                THE SURFACE.
              </h3>
              <p>
                Explore Windows event channels, process starts and exits, and
                your own activity log. Inspect firmware, Secure Boot, TPM and
                SMBIOS data in a read-only view.
              </p>
              <span className="tm-feature-foot">
                EVENTS / FIRMWARE / ACTIVITY
              </span>
            </article>
          </div>
          <div className="tm-secondary-shot">
            <figure>
              <img
                src="/images/projects/tarman/processes.webp"
                width="1600"
                height="991"
                loading="lazy"
                alt="Tarman process list, with load indicators and individual CPU history graphs, using a synthetic demo machine."
              />
              <figcaption>PROCESS TREE / SYNTHETIC DEMO MACHINE</figcaption>
            </figure>
            <div>
              <p className="tm-index">BUILT CLOSE TO THE METAL</p>
              <h3>
                LESS BETWEEN
                <br />
                YOU AND
                <br />
                <em>THE MACHINE.</em>
              </h3>
              <p>
                Native C11 and raylib, with a dedicated Win32 sampler. A
                self-contained Windows installer. Dark and light themes,
                adjustable interface scale, and a frame rate that settles down
                when you do.
              </p>
              <a
                href={cfg.repo + '#how-it-is-put-together'}
                target="_blank"
                rel="noopener noreferrer"
              >
                INSPECT THE ARCHITECTURE ↗
              </a>
            </div>
          </div>
        </section>
        <section className="tm-install">
          <div className="tm-install-cross" aria-hidden="true">
            +
          </div>
          <div className="tm-shell tm-install-grid">
            <div>
              <p className="tm-index">YOUR NEXT SPIKE IS ALREADY ON ITS WAY.</p>
              <h2>
                KEEP
                <br />
                <em>THE RECORD.</em>
              </h2>
            </div>
            <div className="tm-install-actions">
              <p>
                Install Tarman. Let the next ten minutes tell you something.
              </p>
              <a
                href={cfg.download}
                className="tm-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOWNLOAD FOR WINDOWS <span>↗</span>
              </a>
              <div className="tm-install-meta">
                <span>V{version} / WINDOWS</span>
                <span>PER-USER INSTALL / NO RUNTIME</span>
              </div>
              <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
                MIT LICENSED. OPEN TO INSPECTION. ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="tm-shell tm-footer">
        <span>TARMAN / A FEZCODE INSTRUMENT</span>
        <Link to="/projects">← ALL PROJECTS</Link>
        <a href="#tarman-top">RETURN TO SURFACE ↑</a>
      </footer>
    </div>
  );
};

export default TarmanProjectPage;
