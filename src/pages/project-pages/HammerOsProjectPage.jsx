import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
  GridFourIcon,
  HashIcon,
  TerminalWindowIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppSeo,
  AppLoading,
  AppMissing,
} from './app-shell';
import '../../styles/project-showcases/HammerOsShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap';

const DepartmentMark = ({ className = '' }) => (
  <span className={'hmr-department-mark ' + className} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </span>
);

const DepartmentGlobe = ({ className = '' }) => (
  <svg
    className={'hmr-department-globe ' + className}
    viewBox="0 0 640 640"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="320" cy="320" r="272" />
    {[50, 110, 175, 232].map((radius) => (
      <ellipse key={radius} cx="320" cy="320" rx={radius} ry="272" />
    ))}
    {[-220, -160, -85, 0, 85, 160, 220].map((offset) => (
      <ellipse
        key={offset}
        cx="320"
        cy={320 + offset}
        rx={Math.sqrt(272 * 272 - offset * offset)}
        ry={29 + Math.abs(offset) * 0.1}
      />
    ))}
    <path d="M320 48v544M48 320h544" />
    <path
      className="hmr-globe-land"
      d="m177 145 36-17 40 16 18 32 42 10 1 29-23 13-9 39-25 15 3 33-30-14-22-40-31-14-12-42-26-15Zm78 182 35-14 43 19 16 39-27 32-5 47-33 40-13-26-5-52-24-30Zm118-150 36-29 54 13 41 39-11 26-48 2-27 29-20-20-30 1-9-34Zm9 89 40-12 36 28 5 44-22 38-13 60-31-27-8-40-25-29Zm105 168 28-10 20 28-15 20-34-11Z"
    />
    <circle cx="320" cy="320" r="296" strokeDasharray="2 12" />
    <path d="M12 320h24m568 0h24M320 12v24m0 568v24" strokeWidth="2" />
  </svg>
);

const DESKTOP_APPS = [
  { id: 'terminal', title: 'Terminal', icon: TerminalWindowIcon },
  { id: 'refinement', title: 'Refinement', icon: HashIcon },
  { id: 'workspaces', title: 'Workspaces', icon: GridFourIcon },
];
const NUMBERS = Array.from(
  { length: 48 },
  (_, index) => (index * 7 + Math.floor(index / 5) * 3) % 10,
);

const DepartmentDesktop = () => {
  const [activeApp, setActiveApp] = useState('terminal');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [filedNumbers, setFiledNumbers] = useState([]);
  const [lastAssignment, setLastAssignment] = useState(
    'Select a number. Then choose a bin.',
  );
  const [workspace, setWorkspace] = useState(0);
  const workspaceNames = ['Operations', 'Quiet work', 'After hours'];

  const fileNumber = (bin) => {
    if (selectedNumber === null) return;
    setFiledNumbers((numbers) => [...numbers, selectedNumber]);
    setLastAssignment(
      'Number ' +
        NUMBERS[selectedNumber] +
        ' assigned to bin 0' +
        bin +
        '. Your contribution is appreciated.',
    );
    setSelectedNumber(null);
  };

  return (
    <div className="hmr-desktop-preview">
      <div className="hmr-desktop-bar">
        <span>
          <DepartmentMark /> hammer
        </span>
        <div>
          <span>Workspace</span>
          <span>Window</span>
          <span>System</span>
        </div>
        <span className="hmr-desktop-indicator">
          <i /> LOCAL DEMONSTRATION
        </span>
      </div>
      <div className="hmr-desktop-surface">
        <DepartmentGlobe className="hmr-desktop-globe" />
        <nav
          className="hmr-desktop-apps"
          aria-label="Explore the illustrated HammerOS desktop"
        >
          {DESKTOP_APPS.map((app) => {
            const AppIcon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                aria-pressed={activeApp === app.id}
                onClick={() => setActiveApp(app.id)}
              >
                <AppIcon size={24} weight="light" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </nav>
        <div className={'hmr-demo-window hmr-demo-window-' + activeApp}>
          <div className="hmr-demo-window-bar">
            <span>
              {DESKTOP_APPS.find((app) => app.id === activeApp).title}
            </span>
            <span aria-hidden="true">— □ ×</span>
          </div>
          {activeApp === 'terminal' && (
            <div className="hmr-demo-terminal">
              <div className="hmr-host-label">
                <span>HOST MACHINE / POWERSHELL</span>
                <span>EXAMPLE OUTPUT</span>
              </div>
              <pre>
                <code>
                  <span>PS C:\Users\Operator&gt;</span> Get-Location{'\n\n'}Path
                  {'\n'}----{'\n'}C:\Users\Operator{'\n\n'}
                  <span>PS C:\Users\Operator&gt;</span> Write-Output "Make room
                  for good ideas."{'\n\n'}Make room for good ideas.{'\n\n'}
                  <span>PS C:\Users\Operator&gt;</span>{' '}
                  <i className="hmr-demo-caret" />
                </code>
              </pre>
              <p>
                This is an illustrated terminal. No commands run in this page.
              </p>
            </div>
          )}
          {activeApp === 'refinement' && (
            <div className="hmr-demo-refinement">
              <div className="hmr-refinement-heading">
                <div>
                  <span>ACTIVE FILE / ILLUSTRATIVE</span>
                  <strong>Aster</strong>
                </div>
                <div>
                  <span>NUMBERS FILED</span>
                  <strong>
                    {String(filedNumbers.length).padStart(2, '0')} / 48
                  </strong>
                </div>
              </div>
              <div
                className="hmr-number-field"
                aria-label="Choose a number to refine"
              >
                {NUMBERS.map((number, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={filedNumbers.includes(index)}
                    aria-label={
                      'Select number ' + number + ', position ' + (index + 1)
                    }
                    aria-pressed={selectedNumber === index}
                    onClick={() => setSelectedNumber(index)}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <p className="hmr-refinement-message" role="status">
                {lastAssignment}
              </p>
              <div
                className="hmr-refinement-bins"
                aria-label="Assign selected number to a bin"
              >
                {[1, 2, 3, 4, 5].map((bin) => (
                  <button
                    key={bin}
                    type="button"
                    disabled={selectedNumber === null}
                    onClick={() => fileNumber(bin)}
                    aria-label={'Assign to bin ' + bin}
                  >
                    <span>0{bin}</span>
                    <i />
                    <small>ASSIGN</small>
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeApp === 'workspaces' && (
            <div className="hmr-demo-workspaces">
              <span>CHOOSE A PLACE TO BEGIN</span>
              <h3>Your work has room.</h3>
              <div className="hmr-workspace-choices">
                {workspaceNames.map((name, index) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={workspace === index}
                    onClick={() => setWorkspace(index)}
                  >
                    <span
                      className={'hmr-mini-desktop hmr-mini-desktop-' + index}
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>
                      0{index + 1} / {name}
                    </span>
                  </button>
                ))}
              </div>
              <p role="status">
                CURRENT DESKTOP: {workspaceNames[workspace].toUpperCase()}
              </p>
              <p>
                In the Windows app, add up to nine desktops and move real
                application windows between them.
              </p>
            </div>
          )}
        </div>
        <div className="hmr-preview-annotation">
          <span>PERSONNEL / 004</span>
          <strong>
            Welcome back,
            <br />
            <em>Operator.</em>
          </strong>
          <span>
            DISPOSITION <b>● NOMINAL</b>
          </span>
        </div>
      </div>
      <div className="hmr-desktop-taskbar">
        <span>
          <DepartmentMark /> Applications
        </span>
        <span>
          {DESKTOP_APPS.find((app) => app.id === activeApp).title} / ACTIVE
        </span>
        <span>WORKSPACE 0{workspace + 1}</span>
      </div>
    </div>
  );
};

const HammerOsProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'hammeros-department');

  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#e9e7d4" color="#173f41" />;

  return (
    <div className="hammeros-showcase" id="hammeros-top">
      <AppSeo cfg={cfg} project={project} />
      <a className="hmr-skip" href="#hammeros-content">
        Skip to orientation
      </a>
      <header className="hmr-nav">
        <a className="hmr-brand" href="#hammeros-top">
          <DepartmentMark />
          <span>
            hammer<span className="hmr-brand-sup">OS</span>
          </span>
        </a>
        <nav aria-label="HammerOS navigation">
          <a href="#hammeros-orientation">Orientation</a>
          <a href="#hammeros-workstation">Workstation</a>
          <a href="#hammeros-records">Field notes</a>
        </nav>
        <Link to="/projects">
          <span>RETURN TO INDEX</span>
          <ArrowUpRightIcon size={17} />
        </Link>
      </header>

      <section className="hmr-hero" aria-labelledby="hammeros-title">
        <div className="hmr-hero-index">
          <span>DEPARTMENT OF EVERYDAY COMPUTING</span>
          <span>PERSONNEL ACCESS / WINDOWS X64 / V{cfg.version}</span>
        </div>
        <h1 id="hammeros-title">
          HAMMER<span>OS</span>
        </h1>
        <div className="hmr-hero-grid">
          <div className="hmr-intake-copy">
            <span className="hmr-micro">ORIENTATION DOCUMENT / 001</span>
            <h2>
              Your work has
              <br />
              <em>a new world.</em>
            </h2>
            <p>
              A native, full-screen Windows workspace with real files, real
              terminals, and an entirely different atmosphere to work inside.
            </p>
            <a
              className="hmr-download-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Accept your assignment <ArrowRightIcon size={20} />
            </a>
            <div className="hmr-intake-stamp">
              <span>APPLICATION CLASS</span>
              <strong>WINDOWS WORKSPACE</strong>
              <span>RUNS ON YOUR EXISTING SYSTEM</span>
            </div>
          </div>
          <div className="hmr-assignment-panel">
            <DepartmentGlobe className="hmr-hero-globe" />
            <span className="hmr-assignment-id">
              HMR / 004 — LOCAL OPERATIONS
            </span>
            <div className="hmr-assignment-note">
              <span>
                THE DEPARTMENT IS PLEASED
                <br />
                TO HAVE YOU HERE.
              </span>
              <p>
                Make room
                <br />
                for good ideas.
              </p>
            </div>
            <span className="hmr-assignment-coordinates">
              51° 30′ N / 00° 07′ W<br />
              ILLUSTRATIVE DEPARTMENT GRID
            </span>
            <DepartmentMark className="hmr-panel-mark" />
          </div>
        </div>
        <div className="hmr-hero-footer">
          <span>
            <i /> YOUR PRESENCE HAS BEEN NOTED.
          </span>
          <a href="#hammeros-orientation">
            BEGIN ORIENTATION <ArrowRightIcon size={17} />
          </a>
          <span>C# / .NET 10 / AVALONIA</span>
        </div>
      </section>

      <main id="hammeros-content">
        <section
          className="hmr-orientation hmr-width"
          id="hammeros-orientation"
          aria-labelledby="hmr-orientation-title"
        >
          <div className="hmr-section-heading">
            <span className="hmr-micro">
              01 / ENVIRONMENTAL FAMILIARISATION
            </span>
            <h2 id="hmr-orientation-title">
              Somewhere familiar.
              <br />
              <em>Somehow, elsewhere.</em>
            </h2>
            <p>
              Cream institutional chrome. Petrol-blue surfaces. Phosphor type.
              HammerOS gives your everyday tools a setting worth stepping into.
            </p>
          </div>
          <figure className="hmr-actual-desktop">
            <div className="hmr-photo-corners" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <img
              src="/images/projects/hammeros/desktop.webp"
              width="1600"
              height="1000"
              alt="Actual HammerOS desktop with Refinement, a Department terminal, cream window bars, and petrol-blue surfaces"
              loading="lazy"
            />
            <figcaption>
              <span>EXHIBIT A / ACTUAL APPLICATION</span>
              <span>THE HAMMEROS DESKTOP · WINDOWS</span>
            </figcaption>
          </figure>
          <div className="hmr-orientation-caption">
            <span>PLEASE RETAIN FOR YOUR RECORDS.</span>
            <p>
              HammerOS is an application on Windows. Its Department setting is
              fictional; your files, host shells, and supported attached
              application windows are real.
            </p>
          </div>
        </section>

        <section
          className="hmr-workstation-section"
          id="hammeros-workstation"
          aria-labelledby="hmr-workstation-title"
        >
          <div className="hmr-width">
            <div className="hmr-dark-heading">
              <span className="hmr-micro">02 / YOUR ASSIGNED WORKSTATION</span>
              <h2 id="hmr-workstation-title">
                Please make yourself
                <br />
                <em>operational.</em>
              </h2>
              <p>
                Try the illustrated desktop. Open a terminal scene, file a few
                numbers, or choose a workspace. This browser tour stays inside
                this page.
              </p>
            </div>
            <DepartmentDesktop />
            <div className="hmr-demo-caption">
              <span>INTERACTIVE BROWSER ILLUSTRATION</span>
              <p>
                This demonstration does not access your files, run PowerShell,
                or control Windows. Install the native application for the
                actual workspace.
              </p>
            </div>
          </div>
        </section>

        <section
          className="hmr-tools-section hmr-width"
          id="hammeros-records"
          aria-labelledby="hmr-records-title"
        >
          <div className="hmr-tools-heading">
            <DepartmentMark />
            <span className="hmr-micro">03 / TOOLS ISSUED TO PERSONNEL</span>
            <h2 id="hmr-records-title">
              Useful work.
              <br />
              <em>Unusual surroundings.</em>
            </h2>
            <p>
              A proper workspace underneath the institution. Open your
              documents, arrange your applications, and give every task a place
              to live.
            </p>
          </div>
          <div className="hmr-tool-ledger">
            {cfg.tools.map((tool) => (
              <article key={tool.code}>
                <span className="hmr-micro">{tool.code}</span>
                <h3>{tool.title}</h3>
                <div>
                  <p>{tool.body}</p>
                  <small>{tool.note}</small>
                </div>
              </article>
            ))}
          </div>
          <figure className="hmr-files-proof">
            <img
              src="/images/projects/hammeros/files.webp"
              width="1400"
              height="875"
              alt="Actual HammerOS File Explorer browsing a real drive beside its UTF-8 Text Editor"
              loading="lazy"
            />
            <figcaption>
              <span>EXHIBIT B / REAL FILES + UTF-8 TEXT EDITING</span>
              <a
                href={cfg.repo + '/blob/main/README.md#real-files'}
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW THE FIELD MANUAL <ArrowUpRightIcon size={16} />
              </a>
            </figcaption>
          </figure>
        </section>

        <section
          className="hmr-department-section"
          aria-labelledby="hmr-department-title"
        >
          <div className="hmr-width">
            <div className="hmr-department-titleline">
              <span className="hmr-micro">04 / A NOTE FROM MANAGEMENT</span>
              <span>ALL WORK IS VALUED.</span>
            </div>
            <h2 id="hmr-department-title">
              EVERY NUMBER.
              <br />
              <span>EVERY DAY.</span>
            </h2>
            <div className="hmr-department-grid">
              <div className="hmr-department-explanation">
                <p>
                  The Department has its own peculiar rhythm. Sort number
                  clusters, read the company intranet, take a guided breath, or
                  get pleasantly lost in the scenery.
                </p>
                <p>
                  These are the fictional parts of HammerOS: a local, playful
                  world woven around your real Windows workspace.
                </p>
                <div className="hmr-approved-stamp">
                  APPROVED
                  <br />
                  <span>FOR EVERYDAY USE</span>
                </div>
              </div>
              <div className="hmr-department-directory">
                {cfg.department.map((item, index) => (
                  <article key={item.name}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <ArrowUpRightIcon size={18} />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="hmr-install-section hmr-width"
          aria-labelledby="hmr-install-title"
        >
          <div className="hmr-install-label">
            <span className="hmr-micro">05 / COMMENCE YOUR NEW ROUTINE</span>
            <span>INSTALLATION IS A LOCAL AFFAIR.</span>
          </div>
          <h2 id="hmr-install-title">
            REPORT FOR
            <br />
            <em>SOMETHING DIFFERENT.</em>
          </h2>
          <div className="hmr-install-bottom">
            <p>
              A self-contained Windows x64 application.
              <br />
              Your existing Windows installation stays right where it is.
            </p>
            <a
              className="hmr-download-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download HammerOS <ArrowUpRightIcon size={22} />
            </a>
            <span>
              BUILD {cfg.version}
              <br />
              NATIVE / C# / AVALONIA
            </span>
          </div>
        </section>
      </main>

      <footer className="hmr-footer">
        <div className="hmr-width">
          <a className="hmr-brand" href="#hammeros-top">
            <DepartmentMark />
            <span>
              hammer<span className="hmr-brand-sup">OS</span>
            </span>
          </a>
          <p>
            A WORKSPACE BY FEZCODE.
            <br />
            THE DEPARTMENT THANKS YOU FOR YOUR TIME.
          </p>
          <div>
            <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon size={17} /> GitHub <ArrowUpRightIcon size={14} />
            </a>
            <a
              href={cfg.repo + '/blob/main/LICENSE.txt'}
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License <ArrowUpRightIcon size={14} />
            </a>
            <Link to="/projects">
              <ArrowLeftIcon size={14} /> Project index
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HammerOsProjectPage;
