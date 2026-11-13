import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useAppConfig,
  useThemeFonts,
  AppSeo,
  AppLoading,
  AppMissing,
} from './app-shell';
import '../../styles/project-showcases/GitlandShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap';
const REVISIONS = [
  {
    hash: 'a7c9e12',
    branch: 'main',
    title: 'Give the workspace a little room',
    description:
      'A small adjustment to the default layout. One file, one deliberate change.',
    additions: 1,
    deletions: 1,
    lines: [
      ['context', 'export const preferences = {'],
      ['context', '  theme: "graphite",'],
      ['remove', '  density: "compact",'],
      ['add', '  density: "comfortable",'],
      ['context', '  watchRepository: true,'],
      ['context', '};'],
    ],
  },
  {
    hash: 'e4b8f06',
    branch: 'feature/atelier',
    title: 'Let the material follow your colour',
    description:
      'An independent branch explores a different material, while keeping the source canvas clear.',
    additions: 2,
    deletions: 1,
    lines: [
      ['context', 'export const preferences = {'],
      ['remove', '  theme: "graphite",'],
      ['add', '  theme: "atelier",'],
      ['add', '  tint: "lavender",'],
      ['context', '  density: "comfortable",'],
      ['context', '  watchRepository: true,'],
      ['context', '};'],
    ],
  },
  {
    hash: 'd2f16aa',
    branch: 'main · merge',
    title: 'Bring the paths back together',
    description:
      'A shared destination, with the decisions along the way still visible in the history.',
    additions: 2,
    deletions: 1,
    lines: [
      ['context', 'export const preferences = {'],
      ['remove', '  theme: "graphite",'],
      ['add', '  theme: "atelier",'],
      ['add', '  tint: "lavender",'],
      ['context', '  density: "comfortable",'],
      ['context', '  watchRepository: true,'],
      ['context', '};'],
    ],
  },
];
const MERGE_CHOICES = {
  left: {
    code: 'const view = { theme: "atelier", density: "comfortable" };',
    message: 'Left version selected: Atelier, comfortable spacing.',
  },
  right: {
    code: 'const view = { theme: "graphite", density: "compact" };',
    message: 'Right version selected: Graphite, compact spacing.',
  },
  combined: {
    code: 'const view = { theme: "atelier", density: "compact" };',
    message: 'Independent token edits combined: Atelier, compact spacing.',
  },
};
const CONFLICT =
  '<<<<<<< ours\nconst view = { theme: "atelier", density: "comfortable" };\n=======\nconst view = { theme: "graphite", density: "compact" };\n>>>>>>> theirs';

const BranchAtlas = () => (
  <div className="gl-branch-atlas" aria-hidden="true">
    <svg viewBox="0 0 1300 690" fill="none" className="gl-atlas-svg">
      <defs>
        <linearGradient
          id="gl-river-ink"
          x1="700"
          y1="690"
          x2="850"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#433d86" />
          <stop offset=".55" stopColor="#7661b2" />
          <stop offset="1" stopColor="#c3b5e2" />
        </linearGradient>
        <linearGradient
          id="gl-river-rose"
          x1="700"
          y1="690"
          x2="1100"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b899d2" />
          <stop offset="1" stopColor="#e6b7c3" />
        </linearGradient>
      </defs>
      {Array.from({ length: 17 }, (_, index) => (
        <path
          key={index}
          transform={
            'translate(868 363) scale(' +
            (0.48 + index * 0.058) +
            ') translate(-868 -363)'
          }
          d="M1030 86C1134 110 1193 220 1155 325C1130 394 1026 380 1039 472C1053 563 973 637 876 620C795 605 800 539 714 520C628 502 588 423 630 348C663 289 728 299 732 226C736 141 815 80 887 98C942 114 977 65 1030 86Z"
          className="gl-contour"
        />
      ))}
      <path
        d="M700 713V594C700 541 834 540 834 482V54"
        className="gl-river-bank"
      />
      <path
        d="M700 713V594C700 541 834 540 834 482V54"
        stroke="url(#gl-river-ink)"
        strokeWidth="8"
      />
      <path
        d="M709 713V596C709 541 974 532 974 439V286C974 244 1082 229 1082 167V50"
        className="gl-river-bank"
      />
      <path
        d="M709 713V596C709 541 974 532 974 439V286C974 244 1082 229 1082 167V50"
        stroke="url(#gl-river-rose)"
        strokeWidth="5"
      />
      <path
        d="M692 713V593C692 531 692 491 692 442V326C692 264 834 273 834 201"
        className="gl-river-bank"
      />
      <path
        d="M692 713V593C692 531 692 491 692 442V326C692 264 834 273 834 201"
        stroke="#a2a6d3"
        strokeWidth="5"
      />
      <path
        d="M718 713V607C718 550 1171 563 1171 448V390C1171 322 974 340 974 285"
        className="gl-river-bank"
      />
      <path
        d="M718 713V607C718 550 1171 563 1171 448V390C1171 322 974 340 974 285"
        stroke="#b5c1aa"
        strokeWidth="3"
      />
      <path
        d="M683 713V608C683 551 576 541 576 471V411C576 351 691 374 691 327"
        stroke="#c0aed6"
        strokeWidth="2"
      />
      {[
        [834, 96],
        [834, 201],
        [834, 365],
        [834, 482],
        [692, 326],
        [692, 443],
        [974, 286],
        [974, 439],
        [1082, 108],
        [1082, 167],
        [1171, 448],
        [700, 621],
      ].map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r={index === 3 ? '15' : '9'}
            fill="#f6f3ed"
            stroke={index === 3 ? '#554597' : '#9384b4'}
            strokeWidth="2"
          />
          <circle
            cx={x}
            cy={y}
            r={index === 3 ? '6' : '3'}
            fill={index === 3 ? '#554597' : '#b2a3cb'}
          />
        </g>
      ))}
      <path d="M850 365h66m-80 0v-21" stroke="#b5a8c3" />
      <path d="M1082 108h72" stroke="#b5a8c3" />
      <path d="M674 443h-84" stroke="#b5a8c3" />
      <text x="855" y="73" className="gl-map-reference">
        MAIN
      </text>
      <text x="925" y="369" className="gl-map-label">
        A PLACE TO MERGE
      </text>
      <text x="1159" y="112" className="gl-map-label">
        ATELIER
      </text>
      <text x="490" y="447" className="gl-map-label">
        A NEW DIRECTION
      </text>
      <text x="866" y="218" className="gl-map-hash">
        a7c9e12
      </text>
      <text x="1003" y="442" className="gl-map-hash">
        e4b8f06
      </text>
      <text x="861" y="487" className="gl-map-hash">
        d2f16aa
      </text>
      <circle
        cx="1120"
        cy="589"
        r="37"
        stroke="#c0b3d0"
        strokeDasharray="1 4"
      />
      <path d="M1120 561v56m-28-28h56m-20-8-8-8-8 8" stroke="#9f90b8" />
      <text x="1117" y="546" className="gl-map-hash">
        N
      </text>
    </svg>
    <span className="gl-atlas-coordinate">ATLAS 001 / A DRAWN HISTORY</span>
  </div>
);

const RevisionExplorer = () => {
  const [selected, setSelected] = useState(1);
  const revision = REVISIONS[selected];
  return (
    <div className="gl-revision-workbench">
      <div
        className="gl-revision-list"
        aria-label="Choose an illustrative revision"
      >
        <div className="gl-workbench-label">THREE POINTS IN A STORY</div>
        {REVISIONS.map((item, index) => (
          <button
            key={item.hash}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span className="gl-revision-node" />
            <span>
              <span className="gl-revision-branch">{item.branch}</span>
              <strong>{item.title}</strong>
              <span className="gl-revision-hash">
                {item.hash} <span>↗</span>
              </span>
            </span>
          </button>
        ))}
        <span className="gl-example-note">
          Illustrative history. No repository connected.
        </span>
      </div>
      <div className="gl-revision-view" aria-live="polite" aria-atomic="true">
        <div className="gl-code-toolbar">
          <span>src / preferences.ts</span>
          <span className="gl-diff-count">
            <b>+{revision.additions}</b> −{revision.deletions}
          </span>
        </div>
        <div className="gl-revision-summary">
          <span>
            {revision.hash} / {revision.branch}
          </span>
          <h3>{revision.title}</h3>
          <p>{revision.description}</p>
        </div>
        <div className="gl-unified-diff" aria-label="Sample unified diff">
          {revision.lines.map(([tone, text], index) => (
            <div
              className={'gl-diff-line gl-diff-' + tone}
              key={revision.hash + index}
            >
              <span className="gl-line-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="gl-line-sign">
                {tone === 'add' ? '+' : tone === 'remove' ? '−' : ' '}
              </span>
              <code>{text}</code>
            </div>
          ))}
        </div>
        <div className="gl-code-footer">
          <span>UTF-8</span>
          <span>READ THE CHANGE. KEEP THE CONTEXT.</span>
        </div>
      </div>
    </div>
  );
};

const MergeStudio = () => {
  const [resolution, setResolution] = useState('');
  const result = MERGE_CHOICES[resolution];
  return (
    <div className="gl-merge-studio">
      <div className="gl-merge-sources">
        <div>
          <div className="gl-merge-pane-label">
            <span className="gl-source-dot" /> OURS <span>THEME CHANGE</span>
          </div>
          <pre>
            <code>{MERGE_CHOICES.left.code}</code>
          </pre>
          <button
            type="button"
            onClick={() => setResolution('left')}
            aria-pressed={resolution === 'left'}
          >
            Use left version <span>↘</span>
          </button>
        </div>
        <div>
          <div className="gl-merge-pane-label">
            <span className="gl-source-dot gl-source-rose" /> THEIRS{' '}
            <span>DENSITY CHANGE</span>
          </div>
          <pre>
            <code>{MERGE_CHOICES.right.code}</code>
          </pre>
          <button
            type="button"
            onClick={() => setResolution('right')}
            aria-pressed={resolution === 'right'}
          >
            Use right version <span>↙</span>
          </button>
        </div>
      </div>
      <div
        className={'gl-merge-result ' + (resolution ? 'gl-is-resolved' : '')}
      >
        <div className="gl-result-toolbar">
          <span>
            THE RESULT{' '}
            <span>
              {resolution ? '01 CHANGE RESOLVED' : '01 CONFLICT TO EXPLORE'}
            </span>
          </span>
          <button type="button" onClick={() => setResolution('')}>
            Reset ↺
          </button>
        </div>
        <pre aria-live="polite" aria-atomic="true">
          <code>{result ? result.code : CONFLICT}</code>
        </pre>
        <div className="gl-merge-actions">
          <button
            type="button"
            className="gl-combine-button"
            onClick={() => setResolution('combined')}
            aria-pressed={resolution === 'combined'}
          >
            Combine independent edits <span>✳</span>
          </button>
          <p role="status">
            {result
              ? result.message
              : 'Same source line. Two independent token edits. Try bringing both changes together.'}
          </p>
        </div>
      </div>
      <div className="gl-merge-note">
        <span>INTERACTIVE SAMPLE</span>
        <span>
          Local, deterministic text analysis in the app. Always review the
          result.
        </span>
      </div>
    </div>
  );
};

const GitlandProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'gitland-geographic');
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#f4f1e9" color="#3f355a" />;
  const version = project?.version || cfg.version;
  return (
    <div className="gitland-showcase" id="gitland-top">
      <AppSeo cfg={cfg} project={project} />
      <a href="#gl-content" className="gl-skip">
        Skip to content
      </a>
      <header className="gl-nav gl-shell">
        <Link className="gl-brand" to="/projects">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path
              d="M10 5v14c0 5 12 5 12 0V9M10 14c0 5 12 5 12 0"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="5" r="3" fill="currentColor" />
            <circle cx="22" cy="9" r="3" fill="currentColor" />
            <circle cx="10" cy="26" r="3" fill="currentColor" />
          </svg>
          <span>
            Gitland<span>A FIELD GUIDE TO YOUR CODE</span>
          </span>
        </Link>
        <nav aria-label="Gitland navigation">
          <a href="#gl-history">Explore</a>
          <a href="#gl-merge">Merge</a>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </nav>
        <a
          href={cfg.download}
          className="gl-download-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Gitland <span>↗</span>
        </a>
      </header>
      <main id="gl-content">
        <section className="gl-hero">
          <div className="gl-shell gl-hero-text">
            <p className="gl-eyebrow">
              NATIVE GIT CLIENT / WINDOWS / V{version}
            </p>
            <h1>
              A clear view
              <br />
              of your <em>code.</em>
            </h1>
            <p className="gl-hero-description">
              Every branch has a story.
              <br />
              Find your bearings. Follow the changes.
              <br />
              Bring good work together.
            </p>
            <a className="gl-hero-explore" href="#gl-history">
              <span>↓</span> EXPLORE THE TERRAIN
            </a>
          </div>
          <BranchAtlas />
          <div className="gl-hero-foot gl-shell">
            <span>
              <i className="gl-legend-main" /> READABLE DIFFS
            </span>
            <span>
              <i className="gl-legend-rose" /> THREE-WAY REVIEW
            </span>
            <span>
              <i className="gl-legend-green" /> EDITABLE MERGE RESULTS
            </span>
            <span>DRAWN WITH CARE / BUILT FOR REAL GIT</span>
          </div>
        </section>
        <section
          id="gl-history"
          className="gl-shell gl-section gl-history-section"
        >
          <div className="gl-section-heading">
            <div>
              <p className="gl-eyebrow">
                FIELD NOTE 01 / A CHANGE OF PERSPECTIVE
              </p>
              <h2>
                Follow the thread.
                <br />
                <em>See the whole story.</em>
              </h2>
            </div>
            <p>
              Branch lanes, curved joins, and reference badges make history
              legible. Open a commit. Read its file changes. Keep the journey in
              view.
            </p>
          </div>
          <RevisionExplorer />
          <div className="gl-feature-footnote">
            <span>IN THE REAL WORKSPACE</span>
            <p>
              Side-by-side or unified diffs. Line and word highlights. Search,
              context folding, whitespace filtering, and staging by hunk.
            </p>
            <a
              href={cfg.repo + '/blob/main/docs/git-client.md'}
              target="_blank"
              rel="noopener noreferrer"
            >
              The workflow guide ↗
            </a>
          </div>
        </section>
        <section className="gl-merge-section" id="gl-merge">
          <div className="gl-shell">
            <div className="gl-section-heading">
              <div>
                <p className="gl-eyebrow">FIELD NOTE 02 / WHEN PATHS CROSS</p>
                <h2>
                  Two directions.
                  <br />
                  <em>One considered result.</em>
                </h2>
              </div>
              <p>
                Ours. Theirs. The ancestor. An editable result below them.
                Gitland gives every side a place, and gives the final decision
                back to you.
              </p>
            </div>
            <MergeStudio />
            <div className="gl-merge-bottom">
              <p>
                Magic resolve previews identical, one-sided, and independent
                token edits. Ambiguous changes stay unresolved. Your review
                comes before the save.
              </p>
              <a
                href={cfg.repo + '#one-merge-workspace'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Inside the Merge workspace ↗
              </a>
            </div>
          </div>
        </section>
        <section className="gl-shell gl-section gl-workspace-section">
          <div className="gl-workspace-copy">
            <p className="gl-eyebrow">FIELD NOTE 03 / A WIDER HORIZON</p>
            <h2>
              Many repositories.
              <br />
              <em>One point of view.</em>
            </h2>
            <p>
              Choose a folder. See every repository directly inside it: branch,
              uncommitted changes, ahead or behind, and remotes. Filter the
              noise. Open the work that needs you.
            </p>
            <a
              href={cfg.repo + '#many-repositories-at-once'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet the Workspace ↗
            </a>
          </div>
          <div className="gl-workspace-ledger">
            <div className="gl-ledger-header">
              <span>WORKSPACE / YOUR PROJECTS</span>
              <span>ILLUSTRATIVE VIEW</span>
            </div>
            <div className="gl-ledger-columns">
              <span>REPOSITORY</span>
              <span>BRANCH</span>
              <span>STATE</span>
            </div>
            {[
              ['the-next-idea', 'main', 'clean'],
              ['little-observatory', 'feature/sky', '~ 3 changes'],
              ['weekend-atlas', 'main', '↑ 2 commits'],
            ].map(([name, branch, status], i) => (
              <div className="gl-ledger-row" key={name}>
                <span>
                  <span className={'gl-folder gl-folder-' + i} />
                  {name}
                </span>
                <span>{branch}</span>
                <span className={i === 0 ? 'gl-state-clean' : ''}>
                  {status}
                </span>
              </div>
            ))}
            <div className="gl-ledger-caption">
              <span>03 PLACES TO BUILD</span>
              <span>YOUR NEXT DIRECTION ↗</span>
            </div>
          </div>
        </section>
        <section className="gl-capabilities">
          <div className="gl-shell">
            <div className="gl-capability-title">
              <p className="gl-eyebrow">TOOLS FOR THE TERRITORY</p>
              <h2>
                Go a little <em>further.</em>
              </h2>
              <span className="gl-compass-mark" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="gl-capability-grid">
              <article>
                <span>01 / INTENTION</span>
                <h3>
                  Commit with
                  <br />
                  <em>precision.</em>
                </h3>
                <p>
                  Stage exactly the hunk you reviewed. Compose a summary and
                  description beside the files, or expand the writing window
                  when the change needs room.
                </p>
              </article>
              <article>
                <span>02 / MOVEMENT</span>
                <h3>
                  Take another
                  <br />
                  <em>route.</em>
                </h3>
                <p>
                  Branches, tags, worktrees, stash, cherry-pick, interactive
                  rebase, bisect, reflog. Native tools for the ordinary days and
                  the interesting ones.
                </p>
              </article>
              <article>
                <span>03 / REASSURANCE</span>
                <h3>
                  Keep a way
                  <br />
                  <em>back.</em>
                </h3>
                <p>
                  Tracked work is snapshotted before discard. Deleted untracked
                  files are copied aside. Recover earlier tips, removed stashes,
                  and deleted branches in Repository → Recovery.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="gl-shell gl-material-section">
          <div className="gl-material-art" aria-hidden="true">
            <div className="gl-material-pane gl-material-lilac" />
            <div className="gl-material-pane gl-material-rose" />
            <div className="gl-material-pane gl-material-paper">
              <span>
                the source
                <br />
                <em>stays clear.</em>
              </span>
              <span>ATELIER / MATERIAL STUDY</span>
            </div>
          </div>
          <div>
            <p className="gl-eyebrow">A WORKSPACE THAT FEELS LIKE YOURS</p>
            <h2>
              A little colour.
              <br />
              <em>A clear canvas.</em>
            </h2>
            <p>
              Atelier brings adjustable tinted glass to the shell while keeping
              the source canvas opaque. Tune material, tint, glassiness,
              transparency, and colour strength live. Choose interface and
              source fonts independently.
            </p>
            <span className="gl-material-label">
              NATIVE AVALONIA / .NET 10 / REAL GIT
            </span>
          </div>
        </section>
        <section className="gl-final-section">
          <div className="gl-shell">
            <p className="gl-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h2>
              Find your
              <br />
              <em>Gitland.</em>
            </h2>
            <a
              className="gl-primary-button"
              href={cfg.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download for Windows <span>↗</span>
            </a>
            <p>V{version} · Windows x64 · MIT licensed</p>
            <p className="gl-install-note">
              Includes the .NET runtime. Git for Windows is required.
            </p>
          </div>
          <div className="gl-final-contours" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} style={{ '--gl-ring': index }} />
            ))}
          </div>
        </section>
      </main>
      <footer className="gl-shell gl-footer">
        <div>
          <span className="gl-footer-brand">Gitland</span>
          <span>Charted by Fezcode.</span>
        </div>
        <nav aria-label="Gitland resources">
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            Source ↗
          </a>
          <a
            href={cfg.repo + '/blob/main/docs/git-client.md'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Field guide ↗
          </a>
          <Link to="/projects">All projects ↗</Link>
        </nav>
        <a href="#gitland-top" className="gl-top-link">
          N ↑
        </a>
      </footer>
    </div>
  );
};

export default GitlandProjectPage;
