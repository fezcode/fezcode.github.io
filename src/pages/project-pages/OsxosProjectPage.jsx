import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleNotchIcon,
  ShieldCheckIcon,
  EyeIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';
import '../../styles/project-showcases/OsxosShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
const STAGES = ['Explain', 'Review', 'Result'];

const OrbitalInstrument = () => (
  <div className="osx-instrument" aria-hidden="true">
    <svg className="osx-orbital-lines" viewBox="0 0 680 680" fill="none">
      <defs>
        <linearGradient
          id="osx-metal"
          x1="100"
          y1="100"
          x2="600"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset=".42" stopColor="#aeb5c6" />
          <stop offset=".6" stopColor="#fff" />
          <stop offset="1" stopColor="#8f96a8" />
        </linearGradient>
      </defs>
      <circle cx="340" cy="340" r="290" stroke="#c2c8d2" strokeWidth=".8" />
      <circle
        cx="340"
        cy="340"
        r="269"
        stroke="#b4bdcc"
        strokeWidth=".8"
        strokeDasharray="2 9"
      />
      {Array.from({ length: 72 }, (_, index) => (
        <path
          key={index}
          d={`M340 37v${index % 6 === 0 ? 17 : 6}`}
          stroke={index % 6 === 0 ? '#2449e8' : '#a9b1bf'}
          transform={`rotate(${index * 5} 340 340)`}
        />
      ))}
      <ellipse
        cx="340"
        cy="300"
        rx="238"
        ry="95"
        stroke="url(#osx-metal)"
        strokeWidth="22"
        transform="rotate(-26 340 300)"
      />
      <ellipse
        cx="340"
        cy="380"
        rx="238"
        ry="95"
        stroke="url(#osx-metal)"
        strokeWidth="12"
        transform="rotate(-26 340 380)"
      />
      <ellipse
        cx="340"
        cy="425"
        rx="203"
        ry="79"
        stroke="#2149e8"
        strokeWidth="3"
        transform="rotate(-26 340 425)"
      />
      <path
        d="M82 235H24v-64M565 150h83v80M554 523h94v69M104 513H30v69"
        stroke="#2449e8"
        strokeWidth="1"
      />
      <path d="M316 340h48m-24-24v48" stroke="#2449e8" />
      <circle cx="340" cy="340" r="6" fill="#2449e8" />
    </svg>
    <div className="osx-instrument-halo" />
    <img
      src="/images/projects/osxos/instrument.webp"
      width="900"
      height="900"
      alt=""
      className="osx-instrument-object"
    />
    <span className="osx-annotation osx-annotation-a">
      OBJECT 001 / USER SPACE
    </span>
    <span className="osx-annotation osx-annotation-b">
      INSPECT BEFORE ACTING <PlusIcon size={13} />
    </span>
    <div className="osx-spectrum">
      {Array.from({ length: 48 }, (_, index) => (
        <i
          key={index}
          style={{ height: `${12 + ((index * 17 + 9) % 38)}px` }}
        />
      ))}
    </div>
    <span className="osx-object-label">
      A FIELD GUIDE TO A<br />
      BETTER-KEPT MACHINE.
    </span>
  </div>
);

const OperationPreview = ({ tools }) => {
  const [toolIndex, setToolIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const tool = tools[toolIndex];

  return (
    <div className="osx-console">
      <div className="osx-console-top">
        <span>
          <i /> OPERATION THEATRE
        </span>
        <span>INTERACTIVE PREVIEW · SAMPLE DATA</span>
      </div>
      <div className="osx-console-grid">
        <div
          className="osx-tool-selector"
          role="group"
          aria-label="Choose an example maintenance tool"
        >
          <span className="osx-micro">SELECT AN INSTRUMENT</span>
          {tools.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={toolIndex === index}
              onClick={() => {
                setToolIndex(index);
                setStage(0);
              }}
            >
              <span>0{index + 1}</span>
              <strong>{item.name}</strong>
              <ArrowUpRightIcon size={19} />
            </button>
          ))}
          <p>
            This preview uses fixed examples. It never inspects or changes your
            device.
          </p>
        </div>
        <div className="osx-operation">
          <div
            className="osx-stage-nav"
            role="group"
            aria-label="Operation stage"
          >
            {STAGES.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={stage === index}
                onClick={() => setStage(index)}
              >
                <span>0{index + 1}</span>
                {label}
                {stage === index && <i />}
              </button>
            ))}
          </div>
          <div
            className="osx-operation-content"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="osx-operation-kicker">
              <span>{tool.category}</span>
              <span>{tool.scope}</span>
            </div>
            <h3>
              {tool.name}
              <span>.</span>
            </h3>
            {stage === 0 && (
              <>
                <p className="osx-operation-intro">{tool.description}</p>
                <ol className="osx-plan">
                  {tool.steps.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {stage === 1 && (
              <>
                <p className="osx-operation-intro">
                  The evidence, before the operation. These paths and sizes are
                  illustrative examples.
                </p>
                <div className="osx-evidence">
                  {tool.review.map((entry) => (
                    <div key={entry.path}>
                      <code>{entry.path}</code>
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
                <div className="osx-command">
                  <span>PLANNED OPERATION</span>
                  <code>{tool.command}</code>
                </div>
              </>
            )}
            {stage === 2 && (
              <>
                <p className="osx-operation-intro">
                  An illustrative result. Every completed step, exception, and
                  outcome belongs in the record.
                </p>
                <div className="osx-result-seal">
                  <CheckIcon size={30} weight="light" />
                  <span>{tool.resultLabel}</span>
                </div>
                <ul className="osx-results">
                  {tool.result.map((line) => (
                    <li key={line}>
                      <CheckIcon size={15} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="osx-operation-notice">
              <EyeIcon size={17} />
              {tool.notice}
            </p>
          </div>
          <div className="osx-console-action">
            <span>NO DEVICE ACCESS · NO REAL CHANGES</span>
            <button
              type="button"
              onClick={() => setStage((stage + 1) % STAGES.length)}
            >
              {stage === 0
                ? 'Continue to review'
                : stage === 1
                  ? 'Preview the result'
                  : 'Return to explanation'}
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OsxosProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'osxos-orbital');
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#f1f2ef" color="#1735cc" />;
  const version = project?.version || cfg.version;

  return (
    <div className="osxos-showcase" id="osx-top">
      <AppSeo cfg={cfg} project={project} />
      <a className="osx-skip" href="#osx-operation">
        Skip to interactive preview
      </a>
      <header className="osx-nav osx-wrap">
        <Link to="/projects" className="osx-brand">
          <CircleNotchIcon size={28} weight="bold" />
          <span>
            osXos<small>MAINTENANCE INSTRUMENTS</small>
          </span>
        </Link>
        <nav aria-label="osXos navigation">
          <a href="#osx-operation">The operation</a>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            Source <ArrowUpRightIcon />
          </a>
          <a
            className="osx-nav-download"
            href={cfg.download}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get osXos <ArrowUpRightIcon />
          </a>
        </nav>
      </header>
      <section className="osx-hero osx-wrap" aria-labelledby="osx-title">
        <div className="osx-hero-index">
          <span>FEZCODE / SYSTEMS DIVISION</span>
          <span>UTILITY OBJECT 006</span>
          <span>v{version}</span>
        </div>
        <div className="osx-hero-copy">
          <p className="osx-micro">THE ART OF KNOWING WHAT CHANGES.</p>
          <h1 id="osx-title">
            os<span>X</span>os<sup>01</sup>
          </h1>
          <div className="osx-hero-sub">
            <span className="osx-target" aria-hidden="true">
              +
            </span>
            <div>
              <h2>
                Your machine.
                <br />
                Understood.
              </h2>
              <p>{cfg.subtitle}</p>
              <a className="osx-link" href="#osx-operation">
                ENTER THE OPERATION THEATRE
                <ArrowDownRightIcon size={23} />
              </a>
            </div>
          </div>
        </div>
        <OrbitalInstrument />
        <div className="osx-hero-bottom">
          <span>EXPLAIN → REVIEW → RESULT</span>
          <span>MAINTENANCE IS A SERIES OF INFORMED DECISIONS.</span>
          <a href="#osx-operation" aria-label="Scroll to interactive preview">
            <ArrowDownRightIcon size={23} />
          </a>
        </div>
      </section>
      <section
        className="osx-theatre"
        id="osx-operation"
        aria-labelledby="osx-operation-title"
      >
        <div className="osx-wrap">
          <div className="osx-section-heading">
            <span className="osx-micro">01 / NOTHING HAPPENS IN THE DARK</span>
            <h2 id="osx-operation-title">
              First, the <em>why.</em>
              <br />
              Then, the <em>what.</em>
            </h2>
            <p>
              Every tool tells you what it intends to do, shows what it found,
              and reports what actually happened. Read it. Review it. Decide.
            </p>
          </div>
          <OperationPreview tools={cfg.demoTools} />
        </div>
      </section>
      <section
        className="osx-catalogue osx-wrap"
        aria-labelledby="osx-catalogue-title"
      >
        <div className="osx-catalogue-heading">
          <p className="osx-micro">02 / A WORKING COLLECTION</p>
          <h2 id="osx-catalogue-title">
            Small jobs.
            <br />
            <span>Exact intentions.</span>
          </h2>
          <p>
            The recurring maintenance jobs you know from a terminal, collected
            into a clear, inspectable toolkit. The catalogue follows the
            operating system.
          </p>
        </div>
        <div className="osx-inventory">
          {cfg.categories.map((category) => (
            <article key={category.number}>
              <span>{category.number}</span>
              <h3>{category.name}</h3>
              <p>{category.detail}</p>
              <PlusIcon size={20} aria-hidden="true" />
            </article>
          ))}
        </div>
        <div className="osx-batch-note">
          <span className="osx-batch-symbol" aria-hidden="true">
            ↳
          </span>
          <div>
            <h3>One task. Or a considered sequence.</h3>
            <p>
              All Tools brings the catalogue into a checklist with a review for
              every row. Select a batch, confirm its scope, and follow the
              operations one at a time. A run report keeps the full account.
            </p>
          </div>
          <a
            className="osx-link"
            href={`${cfg.repo}#all-tools`}
            target="_blank"
            rel="noopener noreferrer"
          >
            EXPLORE ALL TOOLS <ArrowUpRightIcon size={21} />
          </a>
        </div>
      </section>
      <section className="osx-observatory" aria-labelledby="osx-product-title">
        <div className="osx-wrap">
          <div className="osx-observatory-head">
            <span className="osx-micro">03 / THE ACTUAL INSTRUMENT</span>
            <h2 id="osx-product-title">
              A clear view.
              <br />
              <em>All the way through.</em>
            </h2>
            <p>
              Editorial palettes. OS-aware categories. Separate tool windows
              that keep the explanation beside the work.
            </p>
          </div>
          <figure className="osx-product-frame">
            <div>
              <i />
              <i />
              <i />
              <span>osXos / Windows / Maintenance</span>
            </div>
            <img
              src="/images/projects/osxos/library.webp"
              width="1180"
              height="760"
              loading="lazy"
              alt="The real osXos Windows application with its category sidebar and maintenance tool catalogue"
            />
            <figcaption>
              <span>ACTUAL APPLICATION · WINDOWS</span>
              <span>NINE PALETTES / SEVEN TYPEFACES</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        className="osx-principles osx-wrap"
        aria-labelledby="osx-principles-title"
      >
        <div className="osx-principle-title">
          <p className="osx-micro">04 / THE OPERATING PRINCIPLES</p>
          <h2 id="osx-principles-title">
            Less mystery.
            <br />
            <span>More agency.</span>
          </h2>
        </div>
        <div className="osx-principle-list">
          <article>
            <ShieldCheckIcon size={30} weight="light" />
            <div>
              <h3>Rights, precisely scoped.</h3>
              <p>
                The application normally runs as you. Tools that need
                administrator rights declare them and elevate the particular
                command, rather than the whole application.
              </p>
            </div>
          </article>
          <article>
            <EyeIcon size={30} weight="light" />
            <div>
              <h3>A report can be the whole job.</h3>
              <p>
                Read-only tools say so. A job with nothing useful to do says so.
                The result records skipped files and unsuccessful steps
                alongside successful ones.
              </p>
            </div>
          </article>
          <article>
            <CircleNotchIcon size={30} weight="light" />
            <div>
              <h3>A machine that stays local.</h3>
              <p>
                osXos makes no network requests. Settings live in a plain JSON
                file. The application tells you where that file is and opens the
                folder for you.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="osx-acquire">
        <div className="osx-wrap">
          <p className="osx-micro">INSTRUMENT READY FOR COLLECTION</p>
          <h2>
            A little care.
            <br />
            <span>A clearer system.</span>
          </h2>
          <div className="osx-acquire-bottom">
            <a
              className="osx-download"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download osXos <ArrowUpRightIcon size={29} />
            </a>
            <p>
              Windows installer available.
              <br />
              macOS and Linux builds are available; their tools have not been
              verified end to end on real systems.
            </p>
            <span>
              v{version}
              <br />
              C# / .NET 8 / AVALONIA
            </span>
          </div>
        </div>
      </section>
      <footer className="osx-footer osx-wrap">
        <Link to="/projects">← FEZCODE PROJECTS</Link>
        <span>osXos / OPEN SOURCE / MIT</span>
        <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
          INSPECT THE SOURCE <ArrowUpRightIcon size={16} />
        </a>
        <a href="#osx-top">BACK TO ORBIT ↑</a>
      </footer>
    </div>
  );
};

export default OsxosProjectPage;
