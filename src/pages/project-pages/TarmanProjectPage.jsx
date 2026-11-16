import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CaretRightIcon,
  ClockCounterClockwiseIcon,
  CpuIcon,
  DownloadSimpleIcon,
  GithubLogoIcon,
  GraphicsCardIcon,
  HardDrivesIcon,
  MemoryIcon,
  ShieldCheckIcon,
  ThermometerIcon,
  TreeStructureIcon,
  WifiHighIcon,
} from '@phosphor-icons/react';
import { useAppConfig, AppSeo, AppLoading, AppMissing } from './app-shell';
import AsciiField from './tarman/AsciiField';
import MonitorPanel from './tarman/MonitorPanel';
import Recorder from './tarman/Recorder';
import '../../styles/project-showcases/TarmanShowcase.css';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

const Reveal = ({ children, className = '', delay = 0, as = 'div' }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
};

const Eyebrow = ({ children }) => (
  <p className="trm-eyebrow">
    <i className="trm-dot" aria-hidden="true" />
    {children}
  </p>
);

const LEFT_TILES = [
  { Icon: CpuIcon, label: 'Per-core CPU' },
  { Icon: MemoryIcon, label: 'Physical memory' },
  { Icon: HardDrivesIcon, label: 'Every disk' },
];
const RIGHT_TILES = [
  { Icon: WifiHighIcon, label: 'Each adapter' },
  { Icon: GraphicsCardIcon, label: 'GPU engines' },
  { Icon: ThermometerIcon, label: 'Temperatures' },
];

const FEATURES = [
  {
    Icon: TreeStructureIcon,
    tag: 'A / 01',
    title: ['Not just', 'what’s running.'],
    body: 'Process trees. Per-process sparklines. Loaded modules. Average and peak CPU, memory growth, total I/O, and lifetimes — including processes that exited during the window.',
    foot: 'Process history / window summary',
  },
  {
    Icon: CpuIcon,
    tag: 'B / 02',
    title: ['Follow', 'the pressure.'],
    body: 'Per-core CPU, physical memory, each disk and adapter. GPU engines, dedicated and shared memory, and driver-reported temperatures. See which resource carried the load.',
    foot: 'CPU / memory / disk / network / GPU',
  },
  {
    Icon: ShieldCheckIcon,
    tag: 'C / 03',
    title: ['Below', 'the surface.'],
    body: 'Explore Windows event channels, process starts and exits, and your own activity log. Inspect firmware, Secure Boot, TPM and SMBIOS data in a read-only view.',
    foot: 'Events / firmware / activity',
  },
];

const Tile = ({ Icon, label, tone }) => (
  <li className={`trm-tile trm-tile--${tone}`}>
    <span className="trm-tile-box">
      <Icon size={26} weight="duotone" aria-hidden="true" />
    </span>
    <span className="trm-tile-label">{label}</span>
  </li>
);

const TarmanProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#efeeec" color="#1c1b19" />;
  const version = project?.version || cfg.version;
  const stack = cfg.stack || ['C11', 'raylib', 'Win32'];

  return (
    <div className="trm-root" id="trm-top">
      <AppSeo cfg={cfg} project={project} />
      <a href="#trm-main" className="trm-skip">
        Skip to content
      </a>
      <div className="trm-frame">
        <header className="trm-nav trm-shell">
          <a href="#trm-top" className="trm-brand">
            <span className="trm-brand-mark" aria-hidden="true">
              T/
            </span>
            <span>Tarman</span>
          </a>
          <nav className="trm-nav-links" aria-label="Tarman sections">
            <a href="#trm-recorder">Recorder</a>
            <a href="#trm-features">Features</a>
            <a href="#trm-gallery">Gallery</a>
            <a href="#trm-stack">Stack</a>
          </nav>
          <div className="trm-nav-actions">
            <Link to="/projects" className="trm-btn trm-btn--light trm-btn--sm">
              <ArrowLeftIcon size={13} aria-hidden="true" />
              Projects
            </Link>
            <a
              href={cfg.download}
              {...ext}
              className="trm-btn trm-btn--dark trm-btn--sm"
            >
              Download
            </a>
          </div>
        </header>

        <main id="trm-main">
          {/* ---------------- HERO ---------------- */}
          <section className="trm-hero">
            <AsciiField variant="hero" className="trm-ascii--hero" />
            <div className="trm-hero-main trm-shell">
              <a href={cfg.download} {...ext} className="trm-badge">
                <span className="trm-badge-chip">New</span>
                <span className="trm-badge-text">
                  v{version} · Native Windows system monitor
                </span>
                <CaretRightIcon size={13} weight="bold" aria-hidden="true" />
              </a>
              <h1 className="trm-display trm-hero-title">
                <span>The spike is gone.</span> <span>The evidence isn’t.</span>
              </h1>
              <p className="trm-hero-sub">{cfg.subtitle}</p>
              <div className="trm-hero-ctas">
                <a
                  href={cfg.download}
                  {...ext}
                  className="trm-btn trm-btn--dark"
                >
                  <DownloadSimpleIcon size={15} aria-hidden="true" />
                  Download for Windows
                  <CaretRightIcon size={12} weight="bold" aria-hidden="true" />
                </a>
                <a href={cfg.repo} {...ext} className="trm-btn trm-btn--light">
                  <GithubLogoIcon size={15} aria-hidden="true" />
                  View on GitHub
                </a>
              </div>
              <ul className="trm-marks" aria-label="Built with">
                {[...stack, 'MIT license', 'No runtime'].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="trm-hero-object">
                <MonitorPanel version={version} />
                <span className="trm-hero-note">
                  Illustrative readout · no device telemetry
                </span>
              </div>
            </div>
          </section>

          {/* ---------------- TEN-MINUTE MEMORY ---------------- */}
          <section className="trm-section trm-memory">
            <AsciiField variant="map" className="trm-ascii--section" />
            <div className="trm-shell">
              <Reveal>
                <Eyebrow>Ten-minute moving history</Eyebrow>
              </Reveal>
              <div className="trm-split">
                <Reveal as="h2" className="trm-display trm-h2">
                  Go back ten minutes
                  <br />
                  and know why.
                </Reveal>
                <Reveal as="p" className="trm-lede" delay={0.08}>
                  Your machine has a story. Tarman keeps the last ten minutes —
                  every second, every process — so you can find what was behind
                  the moment after it has passed.
                </Reveal>
              </div>
              <div className="trm-stage">
                <ul className="trm-tiles trm-tiles--left">
                  {LEFT_TILES.map((t, i) => (
                    <Tile
                      key={t.label}
                      {...t}
                      tone={['sand', 'stone', 'clay'][i]}
                    />
                  ))}
                </ul>
                <Reveal className="trm-stack" delay={0.1}>
                  <span className="trm-stack-ghost trm-stack-ghost--back" />
                  <span className="trm-stack-ghost trm-stack-ghost--mid" />
                  <MonitorPanel version={version} mode="window" />
                </Reveal>
                <ul className="trm-tiles trm-tiles--right">
                  {RIGHT_TILES.map((t, i) => (
                    <Tile
                      key={t.label}
                      {...t}
                      tone={['clay', 'stone', 'sand'][i]}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ---------------- RECORDER ---------------- */}
          <section id="trm-recorder" className="trm-section trm-shell">
            <Reveal>
              <Eyebrow>Temporal analysis</Eyebrow>
            </Reveal>
            <div className="trm-split">
              <Reveal as="h2" className="trm-display trm-h2">
                One cursor.
                <br />
                Every graph.
              </Reveal>
              <Reveal as="p" className="trm-lede" delay={0.08}>
                System and process histories share a clock, so the CPU spike,
                the disk burst, and the process that already exited all meet at
                the same second.
              </Reveal>
            </div>
            <Reveal>
              <Recorder />
            </Reveal>
            <div className="trm-explainer">
              <span className="trm-eyebrow-inline">
                <ClockCounterClockwiseIcon size={14} aria-hidden="true" /> The
                real app
              </span>
              <p>
                Hover a graph to scrub every metric. Click to pin a moment. Zoom
                between one, five, and ten minutes while recording continues.
              </p>
              <a
                href={cfg.repo + '#the-10-minute-window'}
                {...ext}
                className="trm-textlink"
              >
                Read the field manual{' '}
                <ArrowUpRightIcon size={12} aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* ---------------- FEATURES ---------------- */}
          <section id="trm-features" className="trm-section trm-shell">
            <Reveal>
              <Eyebrow>Total system visibility</Eyebrow>
            </Reveal>
            <div className="trm-split">
              <Reveal as="h2" className="trm-display trm-h2">
                From the process
                <br />
                to the firmware.
              </Reveal>
              <Reveal as="p" className="trm-lede" delay={0.08}>
                A task manager, a resource monitor, and an event viewer that all
                look at the same ten minutes.
              </Reveal>
            </div>
            <div className="trm-features">
              {FEATURES.map((f, i) => (
                <Reveal
                  as="article"
                  key={f.tag}
                  className="trm-feature"
                  delay={i * 0.06}
                >
                  <div className="trm-feature-top">
                    <span className="trm-tile-box trm-tile-box--sm">
                      <f.Icon size={22} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="trm-feature-tag">{f.tag}</span>
                  </div>
                  <h3 className="trm-display">
                    {f.title[0]}
                    <br />
                    {f.title[1]}
                  </h3>
                  <p>{f.body}</p>
                  <span className="trm-feature-foot">{f.foot}</span>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------------- GALLERY ---------------- */}
          <section id="trm-gallery" className="trm-section trm-shell">
            <Reveal>
              <Eyebrow>The observation deck</Eyebrow>
            </Reveal>
            <div className="trm-split">
              <Reveal as="h2" className="trm-display trm-h2">
                Every signal.
                <br />
                One field of view.
              </Reveal>
              <Reveal as="p" className="trm-lede" delay={0.08}>
                The actual application, running Tarman’s built-in demo mode on a
                synthetic machine.
              </Reveal>
            </div>
            <Reveal as="figure" className="trm-shot trm-shot--main">
              <div className="trm-shot-bar" aria-hidden="true">
                <span className="trm-shot-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Analysis / all channels</span>
                <span>tarman.exe</span>
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
            </Reveal>
            <div className="trm-shot-pair">
              <Reveal as="figure" className="trm-shot">
                <img
                  src="/images/projects/tarman/processes.webp"
                  width="1600"
                  height="991"
                  loading="lazy"
                  alt="Tarman process list, with load indicators and individual CPU history graphs, using a synthetic demo machine."
                />
                <figcaption>Process tree / synthetic demo machine</figcaption>
              </Reveal>
              <Reveal as="figure" className="trm-shot" delay={0.08}>
                <img
                  src="/images/projects/tarman/performance.webp"
                  width="1600"
                  height="991"
                  loading="lazy"
                  alt="Tarman Performance page with a CPU utilisation graph over sixty seconds, a list of resources with sparklines, and live CPU, memory, disk and network meters."
                />
                <figcaption>Performance / CPU over sixty seconds</figcaption>
              </Reveal>
            </div>
          </section>

          {/* ---------------- STACK ---------------- */}
          <section id="trm-stack" className="trm-section trm-shell">
            <Reveal>
              <Eyebrow>Built close to the metal</Eyebrow>
            </Reveal>
            <div className="trm-split">
              <Reveal as="h2" className="trm-display trm-h2">
                Less between you
                <br />
                and the machine.
              </Reveal>
              <div className="trm-stack-copy">
                <Reveal as="p" className="trm-lede" delay={0.08}>
                  Native C11 and raylib, with a dedicated Win32 sampler. A
                  self-contained Windows installer. Dark and light themes,
                  adjustable interface scale, and a frame rate that settles down
                  when you do.
                </Reveal>
                <a
                  href={cfg.repo + '#how-it-is-put-together'}
                  {...ext}
                  className="trm-textlink"
                >
                  Inspect the architecture{' '}
                  <ArrowUpRightIcon size={12} aria-hidden="true" />
                </a>
              </div>
            </div>
            <ul className="trm-specs">
              {stack.map((item, i) => (
                <li key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <strong className="trm-display">{item}</strong>
                </li>
              ))}
              <li>
                <span>{String(stack.length + 1).padStart(2, '0')}</span>
                <strong className="trm-display">
                  {(cfg.platforms || ['Windows']).join(' / ')}
                </strong>
              </li>
            </ul>
          </section>

          {/* ---------------- CTA ---------------- */}
          <section className="trm-cta">
            <AsciiField variant="wash" className="trm-ascii--cta" />
            <div className="trm-shell trm-cta-inner">
              <Eyebrow>Your next spike is already on its way</Eyebrow>
              <h2 className="trm-display trm-cta-title">Keep the record.</h2>
              <p className="trm-hero-sub">
                Install Tarman. Let the next ten minutes tell you something.
              </p>
              <div className="trm-hero-ctas">
                <a
                  href={cfg.download}
                  {...ext}
                  className="trm-btn trm-btn--dark"
                >
                  <DownloadSimpleIcon size={15} aria-hidden="true" />
                  Download for Windows
                  <CaretRightIcon size={12} weight="bold" aria-hidden="true" />
                </a>
                <a href={cfg.repo} {...ext} className="trm-btn trm-btn--light">
                  <GithubLogoIcon size={15} aria-hidden="true" />
                  MIT licensed source
                </a>
              </div>
              <ul className="trm-marks trm-marks--cta">
                <li>v{version} / Windows</li>
                <li>Per-user install</li>
                <li>No runtime</li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="trm-footer trm-shell">
          <span>Tarman / a fezcode instrument</span>
          <Link to="/projects" className="trm-textlink">
            <ArrowLeftIcon size={12} aria-hidden="true" /> All projects
          </Link>
          <a href="#trm-top" className="trm-textlink">
            Back to top <ArrowUpIcon size={12} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  );
};

export default TarmanProjectPage;
