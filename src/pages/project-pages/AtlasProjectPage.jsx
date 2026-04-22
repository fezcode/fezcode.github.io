import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GithubLogoIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  ClipboardTextIcon,
  CheckIcon,
  ArrowLeftIcon,
  TerminalIcon,
  AppleLogoIcon,
  LinuxLogoIcon,
  WindowsLogoIcon,
  XIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useToast } from '../../hooks/useToast';

/*
 * Atlas Suite project page — a command-center catalogue of 38+ Go CLI tools.
 *
 * Aesthetic: phosphor-amber CRT terminal meets product index.
 * Monospace everywhere. Subtle scanlines, corner registration crosshairs,
 * and a boot-sequence reveal on load. Tool cards expose their actual
 * `atlas.<name>` invocation on hover. Category filter + fuzzy search keep
 * 38 entries discoverable without any wall-of-text scroll.
 */

/* ============================================================
 * Palette — warm near-black + phosphor amber + sage accent
 * ============================================================ */
const INK = '#0A0906';
const INK_RAISED = '#120E08';
const INK_ELEV = '#1A140C';
const AMBER = '#FFB000';
const AMBER_DIM = '#B87A00';
const SAGE = '#9AAF4F';
const RUST = '#D97706';
const DIM = '#5E4E3B';
const GRID = '#2A2218';
const TEXT = '#E8DBB7';

/* ============================================================
 * Catalogue data
 * ============================================================ */
const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'productivity', label: 'PRODUCTIVITY' },
  { id: 'dev', label: 'DEV' },
  { id: 'system', label: 'SYSTEM' },
  { id: 'media', label: 'MEDIA' },
  { id: 'data', label: 'DATA' },
  { id: 'network', label: 'NETWORK' },
  { id: 'security', label: 'SECURITY' },
  { id: 'games', label: 'GAMES' },
];

const TOOLS = [
  { n: 1,  name: 'hub',           cat: 'dev',          blurb: 'Centralized installer and manager for the whole suite.',                          sample: 'atlas.hub' },
  { n: 2,  name: 'todo',          cat: 'productivity', blurb: 'Keyboard-centric task TUI with Vim bindings and CLI quick-add.',                  sample: 'atlas.todo add "Finish Gemini @work !high"' },
  { n: 3,  name: 'stats',         cat: 'system',       blurb: 'Real-time system monitor — CPU, memory, disk, network.',                          sample: 'atlas.stats' },
  { n: 4,  name: 'websearch',     cat: 'network',      blurb: 'Web search across DuckDuckGo, Wikipedia, HN, and Reddit.',                         sample: 'atlas.websearch -e wiki "Go programming"' },
  { n: 5,  name: 'compass',       cat: 'security',     blurb: 'Local-first password manager with AES-256-GCM encryption.',                       sample: 'atlas.compass' },
  { n: 6,  name: 'clock',         cat: 'productivity', blurb: 'Multi-timezone dashboard with ms precision and IANA search.',                      sample: 'atlas.clock' },
  { n: 7,  name: 'cam',           cat: 'media',        blurb: 'Terminal webcam viewer with ASCII rendering and filters.',                         sample: 'atlas.cam' },
  { n: 8,  name: 'games',         cat: 'games',        blurb: "Collection including Wilson's Revenge and Wave Function Collapse.",               sample: 'atlas.games' },
  { n: 9,  name: 'bench',         cat: 'dev',          blurb: 'High-precision multi-command benchmarking with visual comparison.',                sample: 'atlas.bench "ls" "dir"' },
  { n: 10, name: 'radar',         cat: 'dev',          blurb: 'Monitor git statuses across multiple repositories simultaneously.',                 sample: 'atlas.radar --show unclean --watch ..' },
  { n: 11, name: 'otp',           cat: 'security',     blurb: 'Minimalist TOTP (2FA) manager with an onyx & gold theme.',                         sample: 'atlas.otp' },
  { n: 12, name: 'diff',          cat: 'dev',          blurb: 'Side-by-side terminal file diff with high visibility.',                            sample: 'atlas.diff file1.go file2.go' },
  { n: 13, name: 'screensaver',   cat: 'system',       blurb: 'Terminal screensavers — Pipes, Stars, Matrix, DNA, Waves.',                        sample: 'atlas.screensaver' },
  { n: 14, name: 'facade',        cat: 'network',      blurb: 'Retro-future mock API server for instant frontend prototyping.',                   sample: 'atlas.facade --file routes.piml' },
  { n: 15, name: 'pq',            cat: 'data',         blurb: 'Minimalist PIML processor — slice, filter, and map data.',                         sample: 'atlas.pq -q "tools.0.version" manifest.piml' },
  { n: 16, name: 'hash',          cat: 'data',         blurb: 'Generate and compare MD5, SHA1, SHA256, SHA512 hashes.',                           sample: 'atlas.hash my_file.zip' },
  { n: 17, name: 'grave',         cat: 'system',       blurb: 'Interactive process reaper with a Pip-Boy inspired TUI.',                          sample: 'atlas.grave' },
  { n: 18, name: 'radio',         cat: 'network',      blurb: 'Global terminal radio receiver with thousands of live stations.',                   sample: 'atlas.radio' },
  { n: 19, name: 'deck',          cat: 'productivity', blurb: 'Interactive TUI command deck — workflows as a grid of pads.',                      sample: 'atlas.deck' },
  { n: 20, name: 'convert',       cat: 'media',        blurb: 'Image conversion for JPEG, PNG, and HEIC formats.',                                sample: 'atlas.convert -s "*.heic" -t png' },
  { n: 21, name: 'conquistador',  cat: 'data',         blurb: 'Beautiful terminal file explorer — Finder/Explorer, re-done.',                     sample: 'atlas.conquistador' },
  { n: 22, name: 'horizon',       cat: 'system',       blurb: 'Environmental & weather dashboard with atmospheric monitoring.',                    sample: 'atlas.horizon' },
  { n: 23, name: 'cat',           cat: 'dev',          blurb: 'High-performance text viewer with syntax highlighting.',                           sample: 'atlas.cat main.go' },
  { n: 24, name: 'ed',            cat: 'dev',          blurb: 'High-performance text editor with highlighting, line nos, search.',               sample: 'atlas.ed README.md' },
  { n: 25, name: 'gitty',         cat: 'dev',          blurb: 'Comprehensive TUI git client — graphs, branches, multi-repo.',                    sample: 'atlas.gitty' },
  { n: 26, name: 'ip',            cat: 'system',       blurb: 'Fetch local and public IP addresses with geolocation data.',                       sample: 'atlas.ip' },
  { n: 27, name: 'sand',          cat: 'games',        blurb: 'Interactive falling sand and particle physics simulator.',                         sample: 'atlas.sand' },
  { n: 28, name: 'sql',           cat: 'data',         blurb: 'Terminal SQL client for SQLite & PostgreSQL with highlighting.',                    sample: 'atlas.sql' },
  { n: 29, name: 'color',         cat: 'dev',          blurb: 'Interactive color picker & converter (Hex, RGB, HSL).',                            sample: 'atlas.color' },
  { n: 30, name: 'archive',       cat: 'system',       blurb: 'Step-by-step archiver and extractor for compressed files.',                         sample: 'atlas.archive' },
  { n: 31, name: 'burner',        cat: 'media',        blurb: 'TUI image burner for OS images and USB drives.',                                    sample: 'atlas.burner' },
  { n: 32, name: 'batchdown',     cat: 'media',        blurb: 'Batch downloader that processes URLs sequentially.',                               sample: 'atlas.batchdown links.txt' },
  { n: 33, name: 'guide',         cat: 'productivity', blurb: 'Personal health & wellness — calories, gym activities, mood.',                     sample: 'atlas.guide' },
  { n: 34, name: 'notes',         cat: 'productivity', blurb: 'Markdown notes manager with editor and high-fidelity render.',                      sample: 'atlas.notes' },
  { n: 35, name: 'pilot',         cat: 'system',       blurb: 'Remote PC pilot — control windows, mouse, system over WiFi.',                      sample: 'atlas.pilot' },
  { n: 36, name: 'record',        cat: 'media',        blurb: 'Screen & audio recorder leveraging FFmpeg for hardware capture.',                   sample: 'atlas.record' },
  { n: 37, name: 'subs',          cat: 'media',        blurb: 'Beautiful terminal subtitle searcher and downloader.',                              sample: 'atlas.subs' },
  { n: 38, name: 'tones',         cat: 'media',        blurb: 'iPhone ringtone and notification sound manager.',                                   sample: 'atlas.tones' },
];

const REPO_BASE = 'https://github.com/fezcode';
const toolUrl = (name) => `${REPO_BASE}/atlas.${name}`;

const INSTALL_CMDS = [
  {
    os: 'unix',
    label: 'bash · macOS / Linux',
    cmd: 'curl -fsSL https://raw.githubusercontent.com/fezcode/atlas.hub/main/scripts/install.sh | bash',
  },
  {
    os: 'pwsh',
    label: 'powershell · Windows',
    cmd: 'irm https://raw.githubusercontent.com/fezcode/atlas.hub/main/scripts/install.ps1 | iex',
  },
];

const BOOT_LINES = [
  '[OK] loading /atlas/manifest.piml',
  '[OK] scanning bin/… 38 tools discovered',
  '[OK] verifying signatures · ed25519',
  '[OK] resolving categories · 8 groups',
  '[OK] handshake · atlas.hub v1.0.0',
  '',
  '> ready — press / to search, or tap a tile.',
];

/* ============================================================
 * Atmospheric overlays (scanlines + corners + vignette)
 * ============================================================ */
const Overlays = () => (
  <>
    {/* scanlines — horizontal 2px stripes, very subtle */}
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.12]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(180deg, rgba(255,176,0,0.35) 0 1px, transparent 1px 3px)',
        mixBlendMode: 'overlay',
      }}
    />
    {/* vignette */}
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[61]"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
      }}
    />
    {/* four corner registration crosshairs */}
    {[0, 1, 2, 3].map((i) => {
      const top = i === 0 || i === 1 ? '18px' : 'auto';
      const left = i === 0 || i === 2 ? '18px' : 'auto';
      const right = i === 1 || i === 3 ? '18px' : 'auto';
      const bottom = i === 2 || i === 3 ? '18px' : 'auto';
      return (
        <svg
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed w-[14px] h-[14px] z-[62]"
          style={{ top, left, right, bottom }}
          viewBox="0 0 14 14"
        >
          <circle cx="7" cy="7" r="3" fill="none" stroke={AMBER_DIM} strokeWidth="0.8" />
          <line x1="0" y1="7" x2="14" y2="7" stroke={AMBER_DIM} strokeWidth="0.8" />
          <line x1="7" y1="0" x2="7" y2="14" stroke={AMBER_DIM} strokeWidth="0.8" />
        </svg>
      );
    })}
  </>
);

/* ============================================================
 * Top bar — breadcrumb + version + github
 * ============================================================ */
const TopBar = ({ project }) => (
  <motion.header
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="sticky top-0 z-30 border-b"
    style={{
      backgroundColor: 'rgba(10,9,6,0.85)',
      backdropFilter: 'blur(8px)',
      borderColor: GRID,
    }}
  >
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-4 text-[11px] tracking-[0.22em] uppercase">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to="/projects"
          className="flex items-center gap-2 transition-colors"
          style={{ color: DIM }}
          onMouseOver={(e) => (e.currentTarget.style.color = AMBER)}
          onMouseOut={(e) => (e.currentTarget.style.color = DIM)}
        >
          <ArrowLeftIcon size={12} weight="bold" />
          <span className="hidden sm:inline">projects</span>
        </Link>
        <span style={{ color: DIM }}>/</span>
        <span style={{ color: AMBER_DIM }} className="truncate">
          fezcode/atlas
        </span>
        <span style={{ color: DIM }} className="hidden md:inline">/</span>
        <span style={{ color: TEXT }} className="hidden md:inline">catalog</span>
      </div>

      <div className="flex items-center gap-5">
        <span className="hidden md:flex items-center gap-2" style={{ color: DIM }}>
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: SAGE, boxShadow: `0 0 8px ${SAGE}` }}
          />
          <span>LIVE · v1.0.0 · MMXXVI</span>
        </span>
        <a
          href={project?.repo_link || REPO_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors"
          style={{ color: TEXT }}
          onMouseOver={(e) => (e.currentTarget.style.color = AMBER)}
          onMouseOut={(e) => (e.currentTarget.style.color = TEXT)}
        >
          <GithubLogoIcon size={14} weight="bold" />
          <span className="hidden sm:inline">stars/atlas</span>
          <ArrowUpRightIcon size={10} weight="bold" />
        </a>
      </div>
    </div>
  </motion.header>
);

/* ============================================================
 * Boot sequence — types the lines in at mount
 * ============================================================ */
const BootSequence = () => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < BOOT_LINES.length) {
        const value = BOOT_LINES[i];
        setLines((prev) => [...prev, value]);
        i += 1;
        setTimeout(tick, 140);
      }
    };
    const start = setTimeout(tick, 250);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  return (
    <pre
      className="text-[11px] leading-[1.75] whitespace-pre font-mono"
      style={{ color: DIM, fontFamily: "'JetBrains Mono', monospace" }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {!line ? (
            <>&nbsp;</>
          ) : line.startsWith('[OK]') ? (
            <>
              <span style={{ color: SAGE }}>{'[OK]'}</span>
              {line.slice(4)}
            </>
          ) : line.startsWith('>') ? (
            <span style={{ color: AMBER }}>{line}</span>
          ) : (
            line
          )}
        </span>
      ))}
      {lines.length < BOOT_LINES.length && (
        <span className="inline-block w-[8px] h-[12px] align-middle" style={{ backgroundColor: AMBER }}>
          &nbsp;
        </span>
      )}
    </pre>
  );
};

/* ============================================================
 * Copyable install command
 * ============================================================ */
const InstallRow = ({ label, cmd, os }) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(cmd).then(
      () => {
        setCopied(true);
        addToast({
          title: 'Copied',
          message: `${os === 'pwsh' ? 'PowerShell' : 'bash'} install command on clipboard.`,
          duration: 1800,
          type: 'success',
        });
        setTimeout(() => setCopied(false), 1600);
      },
      () => {
        addToast({
          title: 'Clipboard blocked',
          message: 'Copy manually from the terminal.',
          duration: 1800,
          type: 'error',
        });
      },
    );
  };

  return (
    <div
      className="group relative border font-mono text-[13px] transition-colors"
      style={{
        backgroundColor: INK_RAISED,
        borderColor: GRID,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: GRID, color: DIM }}
      >
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase">
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: AMBER, opacity: 0.85 }}
          />
          <span>{label}</span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase transition-colors"
          style={{ color: copied ? SAGE : DIM }}
          onMouseOver={(e) => {
            if (!copied) e.currentTarget.style.color = AMBER;
          }}
          onMouseOut={(e) => {
            if (!copied) e.currentTarget.style.color = DIM;
          }}
          aria-label="Copy to clipboard"
        >
          {copied ? <CheckIcon size={12} weight="bold" /> : <ClipboardTextIcon size={12} weight="bold" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="px-3 py-3 overflow-x-auto">
        <code className="block whitespace-nowrap">
          <span style={{ color: AMBER }}>$ </span>
          <span style={{ color: TEXT }}>{cmd}</span>
        </code>
      </div>
    </div>
  );
};

/* ============================================================
 * Platform chip
 * ============================================================ */
const PlatformChip = ({ icon: Icon, label }) => (
  <div
    className="flex items-center gap-2 px-2.5 py-1.5 border text-[10px] tracking-[0.22em] uppercase"
    style={{ borderColor: GRID, color: TEXT, backgroundColor: INK_RAISED }}
  >
    <Icon size={12} weight="bold" style={{ color: AMBER }} />
    <span>{label}</span>
  </div>
);

/* ============================================================
 * Category pill
 * ============================================================ */
const CategoryPill = ({ active, label, count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative px-3 py-1.5 border text-[10px] tracking-[0.22em] uppercase transition-colors"
    style={{
      borderColor: active ? AMBER : GRID,
      color: active ? INK : TEXT,
      backgroundColor: active ? AMBER : 'transparent',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: active ? 700 : 500,
    }}
  >
    {label}
    <span
      className="ml-2 inline-block text-[9px]"
      style={{ color: active ? INK_RAISED : DIM }}
    >
      · {count}
    </span>
  </button>
);

/* ============================================================
 * Tool card — hover reveals the terminal sample
 * ============================================================ */
const ToolCard = ({ tool }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href={toolUrl(tool.name)}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative block border overflow-hidden group"
      style={{
        backgroundColor: hover ? INK_ELEV : INK_RAISED,
        borderColor: hover ? AMBER : GRID,
        fontFamily: "'JetBrains Mono', monospace",
        transition: 'background-color 0.25s, border-color 0.25s',
      }}
    >
      {/* top bar — index + cat + arrow */}
      <div
        className="flex items-center justify-between px-4 pt-3 text-[9.5px] tracking-[0.26em] uppercase"
        style={{ color: DIM }}
      >
        <span>№ {String(tool.n).padStart(2, '0')}</span>
        <div className="flex items-center gap-2">
          <span style={{ color: AMBER_DIM }}>{tool.cat}</span>
          <ArrowUpRightIcon
            size={11}
            weight="bold"
            style={{
              color: hover ? AMBER : DIM,
              transform: hover ? 'translate(1px, -1px)' : 'none',
              transition: 'all 0.2s',
            }}
          />
        </div>
      </div>

      {/* command */}
      <div className="px-4 pt-2 pb-1.5">
        <div
          className="text-[20px] font-bold tracking-tight"
          style={{ color: hover ? AMBER : TEXT }}
        >
          atlas<span style={{ color: AMBER }}>.</span>
          {tool.name}
        </div>
      </div>

      {/* blurb */}
      <div className="px-4 pb-4">
        <p
          className="text-[12px] leading-[1.55]"
          style={{ color: DIM, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {tool.blurb}
        </p>
      </div>

      {/* sample command — slides up on hover */}
      <div
        className="border-t"
        style={{ borderColor: hover ? AMBER_DIM : GRID, backgroundColor: INK }}
      >
        <div className="px-4 py-2.5 overflow-hidden">
          <code
            className="block text-[11px] whitespace-nowrap"
            style={{
              color: hover ? AMBER : DIM,
              transition: 'color 0.25s',
            }}
          >
            <span style={{ color: hover ? SAGE : DIM }}>
              ➜
            </span>{' '}
            {tool.sample}
          </code>
        </div>
      </div>
    </motion.a>
  );
};

/* ============================================================
 * Manifesto footer
 * ============================================================ */
const Manifesto = () => (
  <section className="max-w-[1600px] mx-auto px-6 md:px-10 pt-28 pb-24">
    <div
      className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 border-t pt-16"
      style={{ borderColor: GRID }}
    >
      <div
        className="text-[11px] tracking-[0.3em] uppercase"
        style={{ color: AMBER, fontFamily: "'JetBrains Mono', monospace" }}
      >
        WHY ATLAS ?
      </div>
      <ul
        className="space-y-3 text-[14px] leading-relaxed"
        style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {[
          ['Go-powered', 'Built for speed and portability across Windows, Linux, and macOS.'],
          ['Beautiful TUIs', 'Bubble Tea and Lip Gloss give every tool a modern, high-fidelity terminal interface.'],
          ['Minimalist', 'No bloated UI. Each tool solves one problem exceptionally well.'],
          ['Local-first', 'Your data stays on your machine. No telemetry, no sign-ups.'],
          ['One line to install', 'atlas.hub brings the whole suite — pick what you need, skip the rest.'],
        ].map(([lead, rest]) => (
          <li key={lead} className="flex gap-3">
            <span className="mt-[6px] block w-[8px] h-[8px] shrink-0" style={{ backgroundColor: AMBER }} />
            <span>
              <span style={{ color: AMBER }}>{lead}</span>
              <span style={{ color: DIM }}> — {rest}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ============================================================
 * Main page
 * ============================================================ */
const AtlasProjectPage = () => {
  const { slug } = useParams();
  const { projects } = useProjects();
  const project = projects.find((p) => p.slug === slug) || null;

  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  /* keyboard: `/` to focus search, ESC to clear */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const countsByCat = useMemo(() => {
    const counts = { all: TOOLS.length };
    for (const tool of TOOLS) counts[tool.cat] = (counts[tool.cat] || 0) + 1;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (activeCat !== 'all' && t.cat !== activeCat) return false;
      if (!q) return true;
      return (
        t.name.includes(q) ||
        t.blurb.toLowerCase().includes(q) ||
        t.cat.includes(q) ||
        t.sample.toLowerCase().includes(q)
      );
    });
  }, [activeCat, query]);

  const isFiltering = activeCat !== 'all' || Boolean(query.trim());

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: INK,
        color: TEXT,
        fontFamily: "'JetBrains Mono', monospace",
        backgroundImage: `
          radial-gradient(1200px 600px at 80% -10%, rgba(255,176,0,0.045) 0%, transparent 60%),
          radial-gradient(900px 500px at -10% 110%, rgba(154,175,79,0.035) 0%, transparent 60%)
        `,
      }}
    >
      <Seo
        title="Atlas Suite | Fezcodex"
        description="A family of 38+ minimalist, high-performance Go CLI tools built with Bubble Tea — one install line, one philosophy, eight categories."
        keywords={['atlas', 'atlas suite', 'go', 'cli', 'tui', 'bubble tea', 'productivity']}
      />

      <style>{`
        @keyframes atlas-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .atlas-caret { animation: atlas-blink 0.9s steps(1, end) infinite; }
      `}</style>

      <Overlays />
      <TopBar project={project} />

      {/* ============================================================
       * Hero — asymmetric split: wordmark left, install + boot right
       * ============================================================ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-20 md:pb-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-20 items-start">
          {/* left: identity */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 text-[10.5px] tracking-[0.3em] uppercase mb-8"
              style={{ color: AMBER }}
            >
              <span
                className="inline-block w-[7px] h-[7px]"
                style={{ backgroundColor: AMBER, boxShadow: `0 0 10px ${AMBER}` }}
              />
              <span>ATLAS · SUITE · CATALOGUE</span>
              <span
                aria-hidden="true"
                className="inline-block h-px w-12"
                style={{ backgroundColor: AMBER_DIM }}
              />
              <span style={{ color: DIM }}>MMXXVI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-[72px] md:text-[120px] xl:text-[148px] leading-[0.86] font-black tracking-[-0.045em]"
              style={{ color: TEXT }}
            >
              atlas
              <span style={{ color: AMBER }}>.</span>
              <br />
              <span style={{ color: AMBER_DIM }}>suite</span>
              <span
                aria-hidden="true"
                className="inline-block ml-2 align-middle atlas-caret"
                style={{
                  width: '0.45em',
                  height: '0.85em',
                  backgroundColor: AMBER,
                  boxShadow: `0 0 14px ${AMBER}`,
                }}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 max-w-[56ch] text-[15px] md:text-[17px] leading-relaxed"
              style={{ color: TEXT }}
            >
              A family of <span style={{ color: AMBER }}>38 minimalist</span>, high-performance
              command-line tools built with Go and Bubble Tea. Each one solves a single
              problem well. Together, they form a terminal-native productivity stack.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-3 text-[10.5px] tracking-[0.22em] uppercase" style={{ color: DIM }}>
                <span style={{ color: AMBER }}>{TOOLS.length}</span> tools
                <span className="inline-block w-1 h-1" style={{ backgroundColor: DIM }} />
                <span style={{ color: AMBER }}>8</span> categories
                <span className="inline-block w-1 h-1" style={{ backgroundColor: DIM }} />
                <span style={{ color: AMBER }}>1</span> install line
              </div>
              <div className="flex items-center gap-2">
                <PlatformChip icon={AppleLogoIcon} label="macOS" />
                <PlatformChip icon={LinuxLogoIcon} label="Linux" />
                <PlatformChip icon={WindowsLogoIcon} label="Windows" />
              </div>
            </motion.div>
          </div>

          {/* right: install + boot */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="flex flex-col gap-5 w-full"
          >
            <div className="flex items-center gap-2 text-[10.5px] tracking-[0.3em] uppercase" style={{ color: AMBER }}>
              <TerminalIcon size={14} weight="bold" />
              <span>install</span>
              <span aria-hidden="true" className="flex-1 h-px" style={{ backgroundColor: GRID }} />
              <span style={{ color: DIM }}>one liner</span>
            </div>
            {INSTALL_CMDS.map((c) => (
              <InstallRow key={c.os} {...c} />
            ))}
            <div
              className="border px-4 py-4 mt-2"
              style={{ borderColor: GRID, backgroundColor: INK_RAISED }}
            >
              <BootSequence />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
       * Catalogue — sticky filter bar + tool grid
       * ============================================================ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10">
        {/* section heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-end justify-between gap-6 pb-5 border-b"
          style={{ borderColor: GRID }}
        >
          <div>
            <div
              className="text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: AMBER }}
            >
              § catalogue
            </div>
            <h2
              className="text-[32px] md:text-[44px] font-black tracking-tight"
              style={{ color: TEXT }}
            >
              the <span style={{ color: AMBER }}>tool</span> index
            </h2>
          </div>
          <div
            className="hidden md:block text-[10.5px] tracking-[0.22em] uppercase text-right"
            style={{ color: DIM }}
          >
            <div>
              <span style={{ color: SAGE }}>{filtered.length}</span>
              {' · '}
              <span>of {TOOLS.length} visible</span>
            </div>
            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  setActiveCat('all');
                  setQuery('');
                }}
                className="mt-1 text-[9.5px] tracking-[0.22em] transition-colors"
                style={{ color: RUST }}
                onMouseOver={(e) => (e.currentTarget.style.color = AMBER)}
                onMouseOut={(e) => (e.currentTarget.style.color = RUST)}
              >
                clear all filters ↺
              </button>
            )}
          </div>
        </motion.div>

        {/* sticky filter bar */}
        <div
          className="sticky top-[52px] z-20 py-5 border-b"
          style={{
            backgroundColor: 'rgba(10,9,6,0.92)',
            backdropFilter: 'blur(6px)',
            borderColor: GRID,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {CATEGORIES.map((c) => (
                <CategoryPill
                  key={c.id}
                  active={activeCat === c.id}
                  label={c.label}
                  count={countsByCat[c.id] || 0}
                  onClick={() => setActiveCat(c.id)}
                />
              ))}
            </div>
            <div
              className="relative flex items-center border lg:max-w-[320px] w-full"
              style={{
                borderColor: GRID,
                backgroundColor: INK_RAISED,
              }}
            >
              <MagnifyingGlassIcon
                size={14}
                weight="bold"
                className="ml-3"
                style={{ color: AMBER_DIM }}
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search tools · press / to focus"
                className="flex-1 bg-transparent px-3 py-2 text-[12px] placeholder:text-[#5E4E3B] focus:outline-none"
                style={{ color: TEXT, fontFamily: "'JetBrains Mono', monospace" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mr-2 p-1 transition-colors"
                  style={{ color: DIM }}
                  onMouseOver={(e) => (e.currentTarget.style.color = AMBER)}
                  onMouseOut={(e) => (e.currentTarget.style.color = DIM)}
                  aria-label="Clear search"
                >
                  <XIcon size={12} weight="bold" />
                </button>
              )}
              <span
                className="mr-3 px-1.5 py-0.5 border text-[9px] tracking-[0.2em] uppercase hidden sm:inline"
                style={{ borderColor: GRID, color: DIM }}
              >
                /
              </span>
            </div>
          </div>
        </div>

        {/* grid */}
        <div className="pt-8 pb-12">
          {filtered.length === 0 ? (
            <div
              className="py-32 text-center text-[13px] tracking-[0.2em] uppercase border"
              style={{ borderColor: GRID, color: DIM }}
            >
              <div className="mb-3">no tools match your filter.</div>
              <button
                type="button"
                onClick={() => {
                  setActiveCat('all');
                  setQuery('');
                }}
                className="text-[11px] transition-colors"
                style={{ color: AMBER }}
                onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
                onMouseOut={(e) => (e.currentTarget.style.color = AMBER)}
              >
                ↺ reset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Manifesto />

      {/* footer strip — keyboard hints */}
      <footer
        className="border-t"
        style={{ borderColor: GRID, backgroundColor: INK_RAISED }}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.22em] uppercase">
          <div className="flex flex-wrap items-center gap-4" style={{ color: DIM }}>
            <span className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 border" style={{ borderColor: GRID, color: AMBER }}>/</span>
              <span>search</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 border" style={{ borderColor: GRID, color: AMBER }}>esc</span>
              <span>clear</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 border" style={{ borderColor: GRID, color: AMBER }}>↵</span>
              <span>open repo</span>
            </span>
          </div>
          <div style={{ color: DIM }}>
            <span style={{ color: AMBER_DIM }}>atlas.hub</span> · © {new Date().getFullYear()} · fezcode
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AtlasProjectPage;
