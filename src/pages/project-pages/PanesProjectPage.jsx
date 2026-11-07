import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';
import MarkdownContent from '../../components/MarkdownContent';
import '../../styles/ClocktProject.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';

const THEMES = [
  {
    id: 'Midnight',
    bg: '#12141C',
    fg: '#D6DAE6',
    dim: '#929CB3',
    accent: '#8793FF',
    green: '#63F5A6',
    yellow: '#E8C56B',
    red: '#F2708E',
  },
  {
    id: 'Phosphor',
    bg: '#07120C',
    fg: '#BFF5D2',
    dim: '#8AB99B',
    accent: '#4BF07A',
    green: '#4BF07A',
    yellow: '#B9F06B',
    red: '#F07A4B',
  },
  {
    id: 'Solarized',
    bg: '#002B36',
    fg: '#E3DCC6',
    dim: '#9BB0B8',
    accent: '#D9B549',
    green: '#B1BB41',
    yellow: '#D9B549',
    red: '#F06F65',
  },
  {
    id: 'Sakura',
    bg: '#1B1218',
    fg: '#F3DCE6',
    dim: '#BC9EAC',
    accent: '#F2A0C0',
    green: '#A8E6B0',
    yellow: '#F0D08A',
    red: '#F27B9D',
  },
  {
    id: 'Newsprint',
    bg: '#EDE9E0',
    fg: '#20201D',
    dim: '#6B675E',
    accent: '#B2452F',
    green: '#416D35',
    yellow: '#81651A',
    red: '#B2452F',
  },
  {
    id: 'Neon Tokyo',
    bg: '#0F0B1E',
    fg: '#E6DEFF',
    dim: '#A699D1',
    accent: '#FF73AF',
    green: '#5AF0C8',
    yellow: '#F5D76E',
    red: '#FF4D9D',
  },
];

const ICON_PATHS = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  external: 'M7 17 17 7M7 7h10v10',
  terminal: 'm5 7 5 5-5 5m8 0h6',
  copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
  check: 'm5 12 4 4L19 6',
  workspace: 'M3 4h18v16H3zM8 4v16M8 10h13',
  split: 'M3 4h18v16H3zM12 4v16',
  panels: 'M3 4h18v16H3zM3 14h18m-13 3h2m3 0h2',
  browser: 'M3 4h18v16H3zM3 9h18M6 6.5h.01M9 6.5h.01',
  palette:
    'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a6 6 0 0 0 6-6c0-2-4-4-9-4ZM7 8h.01M12 6h.01M17 8h.01M6 13h.01',
  session: 'M4 9a8 8 0 1 1 0 6m0-11v5h5m3-2v5l3 2',
  plugin: 'M9 3h6v5h5v6h-5v7H9v-7H4V8h5z',
};

const Icon = ({ name = 'arrow', ...props }) => (
  <svg
    className="ckt-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d={ICON_PATHS[name] || ICON_PATHS.arrow} />
  </svg>
);

const Wordmark = ({ name }) => (
  <a
    className="ckt-wordmark"
    href="#clockt-top"
    aria-label={`${name} — back to top`}
  >
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="27"
        height="27"
        rx="7"
        stroke="currentColor"
        strokeOpacity=".5"
      />
      <path
        d="m7 9 5 5-5 5m8 0h7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {name}
  </a>
);

const WindowTop = ({ title, children }) => (
  <div className="ckt-window-top">
    <span className="ckt-window-dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
    <span>{title}</span>
    {children}
  </div>
);

const SessionDemo = () => {
  const [stage, setStage] = useState(0);
  const labels = ['Create a session', 'Detach the window', 'Reattach'];

  return (
    <div className="ckt-session-demo">
      <WindowTop title="A session, from start to return" />
      <div className="ckt-terminal-body" aria-live="polite" aria-atomic="true">
        <p className="ckt-terminal-comment">
          # A little demo. Your shell stays yours.
        </p>
        <pre>
          <code>
            <span className="ckt-terminal-prompt">❯</span> clockt new -n build
          </code>
        </pre>
        <p className="ckt-terminal-output">
          Session “build” created. Attached.
        </p>
        {stage >= 1 && (
          <>
            <pre>
              <code>
                <span className="ckt-terminal-comment">
                  # ctrl + shift + alt + d
                </span>
              </code>
            </pre>
            <p className="ckt-terminal-output">
              Window detached. Session “build” is still running.
            </p>
          </>
        )}
        {stage === 2 && (
          <>
            <pre>
              <code>
                <span className="ckt-terminal-prompt">❯</span> clockt attach
                build
              </code>
            </pre>
            <p className="ckt-terminal-output">
              Reattached. Right where you left off.
            </p>
          </>
        )}
        <div
          className={`ckt-session-status ${stage === 1 ? 'is-detached' : ''}`}
        >
          <span className="ckt-status-dot" />
          <span>build</span>
          <span>
            {stage === 1 ? 'detached · running' : 'attached · running'}
          </span>
        </div>
      </div>
      <div
        className="ckt-demo-controls"
        aria-label="Explore the session lifecycle"
      >
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            className={stage === index ? 'is-active' : ''}
            aria-pressed={stage === index}
            onClick={() => setStage(index)}
          >
            <span aria-hidden="true">0{index + 1}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ThemeLab = ({ version }) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = THEMES[themeIndex];

  return (
    <div className="ckt-theme-lab">
      <div
        className="ckt-theme-preview"
        style={{
          '--terminal-bg': theme.bg,
          '--terminal-fg': theme.fg,
          '--terminal-dim': theme.dim,
          '--terminal-accent': theme.accent,
          '--terminal-green': theme.green,
          '--terminal-yellow': theme.yellow,
        }}
      >
        <WindowTop title={`${theme.id} / pwsh`} />
        <div className="ckt-terminal-body">
          <pre>
            <code>
              <span className="ckt-terminal-prompt">❯</span>{' '}
              <span className="ckt-terminal-accent">clockt</span> --version
            </code>
          </pre>
          <p className="ckt-terminal-output">clockt {version}</p>
          <pre>
            <code>
              <span className="ckt-terminal-prompt">❯</span> git status --short
            </code>
          </pre>
          <p className="ckt-terminal-output">
            <span className="ckt-terminal-prompt"> M</span>{' '}
            src/your-next-idea.cs
          </p>
          <p className="ckt-terminal-comment"># Make yourself at home.</p>
          <div className="ckt-ansi-palette" aria-hidden="true">
            {[
              theme.fg,
              theme.red,
              theme.green,
              theme.yellow,
              theme.accent,
              theme.dim,
            ].map((color, index) => (
              <span key={index} style={{ background: color }} />
            ))}
          </div>
        </div>
      </div>
      <div className="ckt-theme-options" aria-label="Preview a terminal theme">
        {THEMES.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={index === themeIndex ? 'is-active' : ''}
            aria-pressed={index === themeIndex}
            onClick={() => setThemeIndex(index)}
          >
            <span
              className="ckt-theme-swatch"
              style={{ background: option.accent }}
              aria-hidden="true"
            />
            {option.id}
          </button>
        ))}
      </div>
    </div>
  );
};

const PanesProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'clockt-frontier');
  const [copyState, setCopyState] = useState('');
  const copyTimer = useRef();

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#071e20" color="#f3efe3" />;

  const version = project?.version || cfg.version;
  const shot = cfg.shots?.[0];
  const documentation = `${cfg.repo}/tree/main/docs`;
  const featureIcons = [
    'session',
    'workspace',
    'split',
    'panels',
    'browser',
    'palette',
  ];
  const command =
    cfg.terminal?.lines?.[0]?.split('#')[0].trim() || 'clockt new -n build';

  const copyCommand = async () => {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(command);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    copyTimer.current = setTimeout(() => setCopyState(''), 3500);
  };

  return (
    <div className="clockt-page" id="clockt-top">
      <AppSeo cfg={cfg} project={project} />
      <a className="ckt-skip" href="#clockt-content">
        Skip to content
      </a>

      <div className="ckt-masthead">
        <div className="ckt-atmosphere" aria-hidden="true" />
        <header className="ckt-container ckt-nav">
          <Wordmark name={cfg.name} />
          <nav className="ckt-nav-links" aria-label="Clockt navigation">
            <a href="#workspace">Overview</a>
            <a href="#features">Features</a>
            <a href="#command-line">CLI</a>
            <a
              className="ckt-nav-source"
              href={cfg.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <Icon name="external" />
            </a>
            <a
              className="ckt-button ckt-button-small"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download <Icon />
            </a>
          </nav>
        </header>

        <section className="ckt-hero" aria-labelledby="clockt-title">
          <div className="ckt-floating-commands" aria-hidden="true">
            <span>clockt new -n build</span>
            <span>Split a pane. Find your flow.</span>
            <span>npm run dev</span>
            <span>One workspace for every idea.</span>
            <span>clockt attach build</span>
            <span>Your shells are still running.</span>
            <span>git switch something-great</span>
          </div>
          <div className="ckt-hero-content">
            <p className="ckt-eyebrow">YOUR TERMINAL. YOUR TERRITORY.</p>
            <h1 id="clockt-title">
              Close the window.
              <br />
              <em>Keep the shell.</em>
            </h1>
            <p className="ckt-hero-description">
              A terminal that keeps your work alive. Persistent sessions,
              thoughtful workspaces, and room for everything you’re building.
            </p>
            <div className="ckt-hero-actions">
              <a
                className="ckt-button"
                href={cfg.download}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get clockt for Windows <Icon />
              </a>
              <a
                className="ckt-text-link"
                href={cfg.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the source <Icon name="external" />
              </a>
            </div>
            <p className="ckt-hero-meta">
              Windows 10 & 11 <span aria-hidden="true">/</span> v{version}{' '}
              <span aria-hidden="true">/</span> Built by fezcode
            </p>
          </div>
        </section>

        <p className="ckt-intro-line">
          A terminal emulator and multiplexer for Windows.{' '}
          <span>Built to pick up where you left off.</span>
        </p>
      </div>

      <div id="clockt-content">
        <section
          className="ckt-container ckt-section ckt-workspace"
          id="workspace"
          aria-labelledby="workspace-title"
        >
          <div className="ckt-section-heading">
            <p className="ckt-eyebrow">A LITTLE SPACE TO DO GREAT WORK</p>
            <h2 id="workspace-title">
              Everything in its <em>right place.</em>
            </h2>
            <p>
              One home for your shells, projects, and all the work in between.
            </p>
          </div>
          <div className="ckt-feature-pills" aria-label="Workspace features">
            <span>
              <Icon name="workspace" /> Named workspaces
            </span>
            <span>
              <Icon name="split" /> Tabs & splits
            </span>
            <span>
              <Icon name="panels" /> Developer panels
            </span>
            <span>
              <Icon name="palette" /> 14 built-in themes
            </span>
          </div>
          {shot && (
            <figure className="ckt-product-shot">
              <img
                src={shot.src}
                alt={
                  shot.caption ||
                  'Clockt terminal with a workspace sidebar, colourful git output, and a plugin status bar'
                }
                width="1400"
                height="880"
                loading="lazy"
              />
              <figcaption>
                <span>
                  <span className="ckt-status-dot" /> A real workspace. A real
                  terminal.
                </span>
                <span>VT100 / xterm · 24-bit colour</span>
              </figcaption>
            </figure>
          )}
          {cfg.summary?.[1] && (
            <p className="ckt-emulator-note">{cfg.summary[1]}</p>
          )}
        </section>

        <section
          className="ckt-container ckt-section ckt-session-section"
          aria-labelledby="sessions-title"
        >
          <div className="ckt-two-column">
            <div className="ckt-section-copy">
              <p className="ckt-eyebrow">PICK UP WHERE YOU LEFT OFF</p>
              <h2 id="sessions-title">
                A window closes.
                <br />
                <em>Your work lives on.</em>
              </h2>
              <p>{cfg.summary?.[0]}</p>
              <p>
                Detach on purpose. Reattach from any console. Your next session
                starts right where this one ends.
              </p>
              <a
                className="ckt-text-link"
                href={`${cfg.repo}/blob/main/docs/session-updates.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Meet persistent sessions <Icon />
              </a>
            </div>
            <SessionDemo />
          </div>
        </section>

        <section
          className="ckt-container ckt-section"
          id="features"
          aria-labelledby="features-title"
        >
          <div className="ckt-section-heading">
            <p className="ckt-eyebrow">MADE FOR THE WAY YOU BUILD</p>
            <h2 id="features-title">
              Find your <em>flow.</em>
            </h2>
            <p>The small details that make a terminal feel like your own.</p>
          </div>
          <div className="ckt-feature-grid">
            {(cfg.panels || []).map((panel, index) => (
              <article className="ckt-feature" key={panel.title}>
                <Icon name={featureIcons[index]} />
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
                {panel.keys && <kbd>{panel.keys}</kbd>}
              </article>
            ))}
          </div>
        </section>

        <section
          className="ckt-container ckt-section ckt-themes-section"
          id="themes"
          aria-labelledby="themes-title"
        >
          <div className="ckt-two-column">
            <div className="ckt-section-copy">
              <p className="ckt-eyebrow">MAKE YOURSELF AT HOME</p>
              <h2 id="themes-title">
                Set the mood.
                <br />
                <em>Keep the focus.</em>
              </h2>
              <p>
                Fourteen built-in themes reach all the way into your terminal:
                the ANSI palette, cursor, selection, tab pills, and pane
                borders.
              </p>
              <p>Try a few here. There’s a whole palette waiting in the app.</p>
              <span className="ckt-eyebrow">SIX THEME PREVIEWS →</span>
            </div>
            <ThemeLab version={version} />
          </div>
        </section>

        <section
          className="ckt-container ckt-section ckt-cli-section"
          id="command-line"
          aria-labelledby="cli-title"
        >
          <div className="ckt-two-column">
            <div className="ckt-section-copy">
              <p className="ckt-eyebrow">A COMMAND AWAY</p>
              <h2 id="cli-title">
                Your terminal.
                <br />
                <em>On your terms.</em>
              </h2>
              <p>
                Create sessions, send commands, read output, and drive your
                workspace from scripts or agents. The same terminal, wherever
                your workflow takes you.
              </p>
              <a
                className="ckt-text-link"
                href={`${cfg.repo}/blob/main/docs/automation.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the CLI & automation <Icon />
              </a>
              <p className="ckt-copy-feedback" role="status">
                {copyState === 'copied'
                  ? 'Command copied. Paste it into your terminal.'
                  : copyState === 'failed'
                    ? `Select and copy the command: ${command}`
                    : 'Install clockt, then make your first session.'}
              </p>
            </div>
            <div className="ckt-cli-window">
              <WindowTop title="clockt / command line">
                <button
                  type="button"
                  className="ckt-copy-button"
                  onClick={copyCommand}
                  aria-label="Copy create session command"
                >
                  <Icon name={copyState === 'copied' ? 'check' : 'copy'} />
                  {copyState === 'copied' ? 'Copied' : 'Copy'}
                </button>
              </WindowTop>
              <div className="ckt-terminal-body">
                {(cfg.terminal?.lines || []).map((line) => {
                  const [input, comment] = line.split(/\s+#\s?/);
                  return (
                    <div className="ckt-code-line" key={line}>
                      {comment && (
                        <span className="ckt-terminal-comment">
                          # {comment}
                        </span>
                      )}
                      <code>
                        <span className="ckt-terminal-prompt">❯</span>{' '}
                        {input.trim()}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          className="ckt-container ckt-section ckt-toolbox"
          aria-label="Keyboard shortcuts and plugins"
        >
          <div className="ckt-two-column">
            <div className="ckt-keyboard">
              <p className="ckt-eyebrow">STAY ON THE KEYS</p>
              <h2>
                A shortcut to <em>everything.</em>
              </h2>
              <div className="ckt-keyboard-list">
                {(cfg.keys || []).map((binding) => (
                  <div key={binding.k}>
                    <span>{binding.a}</span>
                    <kbd>{binding.k}</kbd>
                  </div>
                ))}
              </div>
              <a
                className="ckt-text-link"
                href={`${cfg.repo}/blob/main/docs/keybindings.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Every binding is rebindable <Icon />
              </a>
            </div>
            <div className="ckt-plugin-copy">
              <span className="ckt-plugin-mark" aria-hidden="true">
                <Icon name="plugin" />
              </span>
              <p className="ckt-eyebrow">ROOM TO MAKE IT YOURS</p>
              <h2>
                Your very own <em>toolbox.</em>
              </h2>
              <div className="ckt-markdown">
                <MarkdownContent content={cfg.notes || ''} />
              </div>
              <div className="ckt-tag-list">
                <span>Sessions</span>
                <span>Working directory</span>
                <span>Git</span>
                <span>Clock</span>
              </div>
              <a
                className="ckt-text-link"
                href={`${cfg.repo}/blob/main/docs/plugin-sdk.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Build a status bar plugin <Icon />
              </a>
            </div>
          </div>
        </section>

        {(cfg.colophon || []).length > 0 && (
          <dl
            className="ckt-container ckt-specs"
            aria-label="Technical details"
          >
            {cfg.colophon.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <section className="ckt-final-cta" aria-labelledby="download-title">
          <div className="ckt-container">
            <p className="ckt-eyebrow">GOOD WORK DESERVES A GOOD HOME</p>
            <h2 id="download-title">
              Make room for
              <br />
              <em>your next idea.</em>
            </h2>
            <p>Your shells. Your workspace. Right where you left them.</p>
            <a
              className="ckt-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download clockt <Icon />
            </a>
            <p className="ckt-hero-meta">
              {(cfg.platforms || []).join(' & ')} · v{version}
            </p>
          </div>
        </section>
      </div>

      <footer className="ckt-footer">
        <div className="ckt-container">
          <div className="ckt-footer-main">
            <div>
              <Wordmark name={cfg.name} />
              <p>Your terminal. Your territory.</p>
            </div>
            <nav className="ckt-footer-links" aria-label="Clockt resources">
              <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
                GitHub <Icon name="external" />
              </a>
              <a href={documentation} target="_blank" rel="noopener noreferrer">
                Documentation <Icon name="external" />
              </a>
              <a
                href={`${cfg.repo}/issues`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue <Icon name="external" />
              </a>
              <a
                href={`${cfg.repo}/blob/main/LICENSE.txt`}
                target="_blank"
                rel="noopener noreferrer"
              >
                License <Icon name="external" />
              </a>
            </nav>
          </div>
          <div className="ckt-footer-bottom">
            <span>Made by fezcode · {(cfg.stack || []).join(' / ')}</span>
            <Link to="/projects">← Back to projects</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PanesProjectPage;
