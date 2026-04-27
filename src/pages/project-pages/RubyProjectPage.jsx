import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import Loading from '../../components/Loading';
import MarkdownContent from '../../components/MarkdownContent';
import {
  GithubLogoIcon,
  CopyIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Caveat:wght@400..700&family=JetBrains+Mono:wght@300..700&display=swap';

const Fleuron = ({ className = '', tone = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 320 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M4 14 H120" stroke={tone} strokeWidth="0.8" />
    <path d="M200 14 H316" stroke={tone} strokeWidth="0.8" />
    <path
      d="M130 14 C 138 4, 146 4, 154 14 C 162 24, 170 24, 178 14"
      stroke={tone}
      strokeWidth="1"
      fill="none"
    />
    <circle cx="124" cy="14" r="1.6" fill={tone} />
    <circle cx="196" cy="14" r="1.6" fill={tone} />
    <circle cx="160" cy="14" r="2.6" fill={tone} />
    <path d="M156 14 L160 8 L164 14 L160 20 Z" fill={tone} opacity="0.55" />
  </svg>
);

const CornerOrnament = ({ className = '', flip = '' }) => (
  <svg
    className={className}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip }}
    aria-hidden
  >
    <path d="M2 2 H30 M2 2 V30" stroke="currentColor" strokeWidth="1" />
    <path d="M2 2 L18 18" stroke="currentColor" strokeWidth="0.6" />
    <circle cx="22" cy="22" r="2" fill="currentColor" />
    <path
      d="M30 2 C 40 2, 48 8, 48 18"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M2 30 C 2 40, 8 48, 18 48"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
  </svg>
);

const Whisk = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M50 8 V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M50 42 C 30 50, 28 70, 36 88"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 42 C 70 50, 72 70, 64 88"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 42 C 42 52, 42 72, 50 90"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 42 C 58 52, 58 72, 50 90"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx="50" cy="42" rx="14" ry="4" fill="currentColor" opacity="0.85" />
    <rect x="46" y="0" width="8" height="14" rx="2" fill="currentColor" opacity="0.7" />
  </svg>
);

const OvenIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect x="10" y="14" width="80" height="76" stroke="currentColor" strokeWidth="1.4" />
    <rect x="18" y="34" width="64" height="48" stroke="currentColor" strokeWidth="1" />
    <circle cx="28" cy="24" r="2.5" fill="currentColor" />
    <circle cx="42" cy="24" r="2.5" fill="currentColor" />
    <circle cx="78" cy="24" r="3" stroke="currentColor" strokeWidth="1" />
    <line x1="76" y1="24" x2="80" y2="24" stroke="currentColor" />
    <line x1="78" y1="22" x2="78" y2="26" stroke="currentColor" />
    <path d="M50 50 C 44 56, 44 64, 50 70 C 56 64, 56 56, 50 50 Z" fill="currentColor" opacity="0.6" />
    <path d="M50 60 C 47 64, 47 68, 50 72 C 53 68, 53 64, 50 60 Z" fill="currentColor" />
  </svg>
);

const WaxSeal = ({ version = '0.4.0', kicker = 'New Edition', items = [] }) => (
  <div className="relative w-44 h-44 md:w-52 md:h-52 select-none">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 32% 28%, #f29659 0%, #c14228 38%, #6b1d18 100%)',
        boxShadow:
          'inset -10px -14px 26px rgba(20,5,5,0.55), inset 8px 10px 18px rgba(255,200,160,0.45), 0 18px 38px rgba(94,24,18,0.45)',
        clipPath:
          'polygon(50% 0%, 58% 5%, 67% 1%, 74% 9%, 84% 9%, 89% 18%, 98% 25%, 95% 36%, 100% 46%, 96% 56%, 100% 65%, 92% 73%, 91% 84%, 81% 88%, 75% 96%, 65% 95%, 56% 100%, 45% 96%, 35% 99%, 26% 91%, 17% 90%, 12% 81%, 3% 73%, 7% 64%, 0% 54%, 5% 44%, 1% 34%, 9% 27%, 11% 17%, 21% 13%, 27% 4%, 38% 6%, 44% 1%)',
      }}
    />
    <div
      className="absolute inset-[14%] rounded-full border-2 border-[#fae8b8]/30"
      style={{ boxShadow: 'inset 0 0 18px rgba(0,0,0,0.45)' }}
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#fae8b8] text-center px-6 transform -rotate-[6deg]">
      <div className="text-[9px] tracking-[0.45em] uppercase font-bold opacity-90">
        {kicker}
      </div>
      <div
        className="text-[2.6rem] md:text-[3rem] leading-none"
        style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 800,
          fontVariationSettings: '"opsz" 144, "SOFT" 80',
        }}
      >
        v{version}
      </div>
      <div className="flex flex-col items-center gap-0.5 mt-1.5">
        {items.map((it, i) => (
          <div
            key={i}
            className="text-[8px] tracking-[0.3em] uppercase font-bold opacity-90"
          >
            · {it} ·
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecipeNumber = ({ n }) => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="text-[5.5rem] md:text-[7rem] leading-[0.8] text-[#c5642a]"
        style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontVariationSettings: '"opsz" 144',
        }}
      >
        {romans[n] || n + 1}
      </span>
      <span
        className="text-[10px] tracking-[0.5em] uppercase text-[#6e2a2f]/70 font-bold"
        style={{ fontFamily: 'EB Garamond, serif' }}
      >
        Recipe №{String(n + 1).padStart(2, '0')}
      </span>
    </div>
  );
};

const RubyProjectPage = () => {
  const { slug } = useParams();
  const productSlug = slug || 'gobake';

  const [content, setContent] = useState({
    hero: '',
    features: '',
    details: '',
    cta: '',
    terminal: '',
    guide: '',
    examples: '',
  });
  const [metadata, setMetadata] = useState({
    title: '',
    tagline: '',
    repo_link: '',
    shortDescription: '',
    image: '',
    technologies: [],
    version: '0.1.0',
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedCard, setCopiedCard] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector(`link[data-gobake-fonts]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    link.setAttribute('data-gobake-fonts', 'true');
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const files = ['hero', 'features', 'details', 'cta', 'terminal', 'guide', 'examples'];
        const responses = await Promise.all(
          files.map((f) => fetch(`/projects/${productSlug}/${f}.txt`))
        );
        const texts = await Promise.all(responses.map((r) => r.text()));
        const next = Object.fromEntries(files.map((f, i) => [f, texts[i]]));
        setContent(next);

        const heroLines = next.hero.split('\n');
        const title = heroLines[0]?.replace('#', '').trim() || productSlug;
        const tagline = heroLines[1]?.trim() || '';
        const versionMatch = next.hero.match(/\(version\)\s*([^\n\r]+)/);
        const version = versionMatch ? versionMatch[1].trim() : '0.1.0';
        const repoMatch = next.terminal.match(/btnLink:\s*(https:\/\/github\.com\/[^\s\n]+)/);
        const repo_link = repoMatch ? repoMatch[1] : '';

        setMetadata({
          title,
          tagline,
          repo_link,
          shortDescription: tagline,
          image: `/images/projects/${productSlug}/${productSlug}-banner.png`,
          technologies: ['Go', 'Build Tool', 'Orchestrator', 'Automation'],
          version,
        });
      } catch (error) {
        console.error('Error fetching project content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [productSlug]);

  const copyToClipboard = (text, key = null) => {
    navigator.clipboard.writeText(text);
    if (key) {
      setCopiedCard(key);
      setTimeout(() => setCopiedCard(null), 1800);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (loading) return <Loading />;

  const parseBlocks = (text, blockType) => {
    const blocks = [];
    if (!text || text.includes('<!DOCTYPE html>')) return blocks;
    const regex = new RegExp(`:::${blockType}([\\s\\S]*?):::`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const blockContent = match[1].trim();
      const lines = blockContent.split('\n');
      const obj = {};
      lines.forEach((line) => {
        const sep = line.indexOf(':');
        if (sep !== -1) {
          obj[line.substring(0, sep).trim()] = line.substring(sep + 1).trim();
        }
      });
      blocks.push(obj);
    }
    return blocks;
  };

  const features = parseBlocks(content.features, 'feature');
  const cards = parseBlocks(content.terminal, 'card');
  const installBlock = cards.find((c) => c.type === 'install');
  const installCommand = installBlock ? installBlock.code : '';

  const heroBody = content.hero
    .split('\n')
    .filter((l) => !l.startsWith('#') && !l.startsWith('(') && l.trim().length > 0)
    .join(' ')
    .trim();

  const renderCardCode = (card) => {
    if (card.type === 'install') {
      return (
        <code
          className="block leading-relaxed text-[#f3e9d2]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span className="text-[#7d8a76] italic"># add to your toolchain</span>
          <br />
          <span className="text-[#e08436] font-bold">go</span>{' '}
          <span className="text-[#fae8b8]">install</span>{' '}
          <span className="text-[#cfbe87]">{card.code.split('install ')[1]}</span>
        </code>
      );
    }
    if (card.type === 'code') {
      return (
        <code
          className="block leading-relaxed text-[#f3e9d2] text-[13px]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span className="text-[#7d8a76] italic"># Recipe.go</span>
          <br />
          <span className="text-[#cfbe87]">bake</span>.
          <span className="text-[#e08436]">Task</span>(
          <span className="text-[#a8c19a]">"test"</span>, <span className="text-[#a8c19a]">"…"</span>, run)
          <br />
          <span className="text-[#cfbe87]">bake</span>.
          <span className="text-[#e08436]">TaskWithDeps</span>(
          <span className="text-[#a8c19a]">"build"</span>,
          <br />
          &nbsp;&nbsp;<span className="text-[#a8c19a]">"…"</span>,{' '}
          <span className="text-[#cfbe87]">[]string</span>{'{'}
          <span className="text-[#a8c19a]">"test"</span>
          {'}'}, run)
          <br />
          <br />
          <span className="text-[#7d8a76] italic">$ gobake test build deploy</span>
        </code>
      );
    }
    return (
      <code
        className="block leading-relaxed text-[#f3e9d2]"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="text-[#e08436] font-bold">$</span>{' '}
        <span className="text-[#fae8b8]">{card.code}</span>
        <br />
        <span className="text-[#7d8a76] italic"># test → build → deploy, in order</span>
      </code>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#f3e9d2] text-[#3a1518] overflow-x-hidden selection:bg-[#c5642a] selection:text-[#fae8b8]"
      style={{ fontFamily: 'EB Garamond, Georgia, serif' }}
    >
      <style>{`
        .gb-paper {
          background-color: #f3e9d2;
          background-image:
            radial-gradient(circle at 18% 22%, rgba(197,100,42,0.08) 0%, transparent 32%),
            radial-gradient(circle at 82% 78%, rgba(74,26,31,0.07) 0%, transparent 28%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.29 0 0 0 0 0.10 0 0 0 0 0.12 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
          background-size: auto, auto, 240px;
        }
        .gb-paper-shade {
          background-color: #ecdfc0;
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0.27 0 0 0 0 0.12 0 0 0 0 0.10 0 0 0 0.22 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
          background-size: 240px;
        }
        .gb-ash {
          background-color: #1a1410;
          background-image:
            radial-gradient(circle at 30% 0%, rgba(229,130,69,0.18) 0%, transparent 55%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='2'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.78 0 0 0 0 0.45 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }
        .gb-display {
          font-family: 'Fraunces', 'Playfair Display', Georgia, serif;
          font-variation-settings: "opsz" 144, "SOFT" 50;
        }
        .gb-display-soft {
          font-family: 'Fraunces', 'Playfair Display', Georgia, serif;
          font-variation-settings: "opsz" 144, "SOFT" 100;
        }
        .gb-script { font-family: 'Caveat', cursive; }
        .gb-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .gb-body { font-family: 'EB Garamond', Georgia, serif; }
        .gb-drop-cap::first-letter {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 5.5rem;
          line-height: 0.85;
          float: left;
          padding: 0.4rem 0.7rem 0 0;
          color: #c5642a;
          font-variation-settings: "opsz" 144, "SOFT" 80;
        }
        .gb-leader {
          background-image: radial-gradient(circle, currentColor 0.8px, transparent 1.2px);
          background-size: 8px 8px;
          background-repeat: repeat-x;
          background-position: bottom 6px left 0;
        }
        .gb-stamp-rotate { transform: rotate(-8deg); transition: transform 300ms ease; }
        .gb-stamp-rotate:hover { transform: rotate(-3deg) scale(1.04); }
        .gb-rule {
          background-image: linear-gradient(to right, #4a1a1f 50%, transparent 0);
          background-size: 6px 1px;
          background-repeat: repeat-x;
        }
        .gb-rule-thick {
          background-image: linear-gradient(to right, #4a1a1f 60%, transparent 0);
          background-size: 8px 2px;
          background-repeat: repeat-x;
        }
        .gb-glow-text {
          text-shadow: 0 1px 0 rgba(255,255,255,0.4), 0 0 28px rgba(197,100,42,0.18);
        }
        .gb-card-shadow {
          box-shadow:
            0 1px 0 rgba(74,26,31,0.12),
            0 8px 24px rgba(74,26,31,0.10),
            0 24px 48px -12px rgba(74,26,31,0.18);
        }
        .gb-prose h1, .gb-prose h2, .gb-prose h3 {
          font-family: 'Fraunces', serif;
          color: #4a1a1f;
          font-weight: 700;
          font-variation-settings: "opsz" 144;
        }
        .gb-prose h1 { font-size: 2.4rem; margin-top: 2rem; margin-bottom: 1rem; letter-spacing: -0.01em; }
        .gb-prose h2 {
          font-size: 1.7rem; margin-top: 2.4rem; margin-bottom: 1rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid rgba(74,26,31,0.2);
          letter-spacing: -0.01em;
        }
        .gb-prose h3 { font-size: 1.25rem; margin-top: 1.6rem; margin-bottom: 0.6rem; font-style: italic; color: #6e2a2f; }
        .gb-prose p { color: #3a1518; line-height: 1.75; margin-bottom: 1rem; font-size: 1.0625rem; }
        .gb-prose ul, .gb-prose ol { margin: 1rem 0 1rem 1.5rem; }
        .gb-prose li { margin-bottom: 0.4rem; line-height: 1.6; }
        .gb-prose a { color: #c5642a; font-weight: 600; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; }
        .gb-prose a:hover { color: #4a1a1f; }
        .gb-prose code {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(197,100,42,0.12);
          color: #4a1a1f;
          padding: 0.1em 0.35em;
          border-radius: 3px;
          font-size: 0.92em;
        }
        .gb-prose pre {
          background: #1a1410;
          color: #f3e9d2;
          padding: 1.5rem 1.75rem;
          border-radius: 0;
          border-left: 4px solid #c5642a;
          margin: 1.4rem 0;
          overflow-x: auto;
          font-size: 0.9rem;
          line-height: 1.65;
          box-shadow: inset 0 1px 0 rgba(255,200,140,0.05), 0 12px 24px rgba(26,20,16,0.18);
        }
        .gb-prose pre code {
          background: transparent;
          color: #f3e9d2;
          padding: 0;
        }
        .gb-prose strong { color: #4a1a1f; font-weight: 700; }
        .gb-prose blockquote {
          border-left: 3px solid #c5642a;
          padding-left: 1rem;
          font-style: italic;
          color: #6e2a2f;
        }
        @keyframes gb-rise {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .gb-rise { animation: gb-rise 700ms ease-out forwards; }
        @keyframes gb-steam {
          0%   { opacity: 0.0; transform: translate(0, 0) scale(0.9); }
          50%  { opacity: 0.7; transform: translate(2px, -22px) scale(1.05); }
          100% { opacity: 0;  transform: translate(-2px, -52px) scale(0.85); }
        }
        .gb-steam path { animation: gb-steam 4.5s ease-in-out infinite; transform-origin: center; }
        .gb-steam path:nth-child(2) { animation-delay: 1.4s; }
        .gb-steam path:nth-child(3) { animation-delay: 2.6s; }
      `}</style>

      <Seo
        title={`${metadata.title} · The Engineer's Cookbook | Fezcodex`}
        description={metadata.shortDescription}
        image={metadata.image}
        keywords={metadata.technologies}
      />

      {/* ───────── Top edition strip ───────── */}
      <header className="sticky top-0 z-40 gb-paper border-b border-[#4a1a1f]/25">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-12 flex items-center justify-between text-[10px] tracking-[0.35em] uppercase text-[#4a1a1f]/85">
          <Link
            to="/projects"
            className="flex items-center gap-2 hover:text-[#c5642a] transition-colors font-bold"
          >
            <ArrowRightIcon size={12} weight="bold" className="rotate-180" />
            Fezcode Press · Catalog
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#pantry" className="hover:text-[#c5642a] transition-colors">
              Pantry
            </a>
            <span className="opacity-30">·</span>
            <a href="#recipes" className="hover:text-[#c5642a] transition-colors">
              Recipes
            </a>
            <span className="opacity-30">·</span>
            <a href="#installation" className="hover:text-[#c5642a] transition-colors">
              Order
            </a>
            <span className="opacity-30">·</span>
            {metadata.repo_link && (
              <a
                href={metadata.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#c5642a] transition-colors"
              >
                <GithubLogoIcon size={14} weight="bold" /> GitHub
              </a>
            )}
          </div>
          <div className="font-bold tabular-nums">
            VOL. IV · ED.{' '}
            <span className="text-[#c5642a]">{metadata.version}</span>
          </div>
        </div>
      </header>

      {/* ───────── Cover ───────── */}
      <section className="gb-paper relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, #4a1a1f 0px, #4a1a1f 1px, transparent 1px, transparent 80px), repeating-linear-gradient(to bottom, #4a1a1f 0px, #4a1a1f 1px, transparent 1px, transparent 80px)',
          }}
        />
        <CornerOrnament className="absolute top-6 left-6 w-14 h-14 text-[#4a1a1f]/40" />
        <CornerOrnament
          className="absolute top-6 right-6 w-14 h-14 text-[#4a1a1f]/40"
          flip="scaleX(-1)"
        />
        <CornerOrnament
          className="absolute bottom-6 left-6 w-14 h-14 text-[#4a1a1f]/40"
          flip="scaleY(-1)"
        />
        <CornerOrnament
          className="absolute bottom-6 right-6 w-14 h-14 text-[#4a1a1f]/40"
          flip="scale(-1,-1)"
        />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 pb-32 md:pt-28 md:pb-44 relative">
          <div className="flex items-start justify-between mb-8 text-[11px] tracking-[0.4em] uppercase text-[#4a1a1f]/80 font-bold">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#4a1a1f]/60" />
              <span>An Almanac of Builds</span>
            </div>
            <div className="hidden md:block">
              Quarterly · MMXXVI ·{' '}
              <span className="text-[#c5642a]">First Printing</span>
            </div>
          </div>

          <div className="text-center relative gb-rise">
            <div className="gb-script text-3xl md:text-4xl text-[#c5642a] -mb-2 md:-mb-3">
              the engineer's
            </div>
            <h1
              className="gb-display text-[22vw] sm:text-[18vw] md:text-[15.5rem] lg:text-[18rem] leading-[1.05] text-[#4a1a1f] tracking-[-0.04em] gb-glow-text pb-2"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              {metadata.title}
            </h1>

            <div className="flex items-center justify-center gap-5 mt-10 md:mt-14">
              <span className="h-px w-16 md:w-24 bg-[#4a1a1f]/60" />
              <span
                className="gb-display italic text-[#4a1a1f] text-xl md:text-3xl"
                style={{ fontVariationSettings: '"opsz" 80, "SOFT" 100' }}
              >
                {metadata.tagline || 'A Go-Native Build Orchestrator'}
              </span>
              <span className="h-px w-16 md:w-24 bg-[#4a1a1f]/60" />
            </div>

            <Fleuron className="mx-auto mt-10 w-72 md:w-96 text-[#c5642a]" />

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-3xl mx-auto text-left">
              {[
                ['Yield', 'one binary, any platform'],
                ['Prep', '~30 seconds'],
                ['Difficulty', 'beginner — go install'],
                ['Pantry', 'Go toolchain only'],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-[#4a1a1f]/30 pt-3">
                  <div className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#c5642a] mb-1">
                    {k}
                  </div>
                  <div
                    className="gb-display text-[#4a1a1f] text-base md:text-lg"
                    style={{ fontVariationSettings: '"opsz" 30' }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-24 right-6 md:right-16 lg:right-24 hidden md:block gb-stamp-rotate">
            <WaxSeal
              version={metadata.version}
              kicker="Fresh Edition"
              items={['multi-task cli', 'runin · runout', 'sorted help']}
            />
            <div className="gb-script text-[#4a1a1f] text-2xl mt-3 text-center -rotate-[6deg] -ml-4">
              hot from the oven!
            </div>
          </div>
        </div>

        {/* Wavy boundary into the dark "today's special" */}
        <div className="absolute -bottom-px left-0 right-0 h-8 text-[#1a1410]" aria-hidden>
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,12 C25,2 50,22 75,12 C100,2 125,22 150,12 C175,2 200,22 225,12 C250,2 275,22 300,12 C325,2 350,22 375,12 C400,2 400,2 400,24 L0,24 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ───────── Today's Special — three recipe cards on charred-oven ───────── */}
      <section className="gb-ash relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 18%, rgba(229,130,69,0.18) 0%, transparent 28%), radial-gradient(circle at 88% 82%, rgba(229,130,69,0.12) 0%, transparent 32%)',
            }}
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="text-[10px] tracking-[0.5em] uppercase text-[#e08436] font-bold mb-3">
                ※ Today's Special ※
              </div>
              <h2
                className="gb-display text-5xl md:text-6xl text-[#fae8b8] leading-[0.95]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                Three ways
                <br />
                <span className="italic text-[#e08436]">to start baking.</span>
              </h2>
            </div>
            <div
              className="gb-mono text-[10px] text-[#cfbe87]/70 max-w-xs"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#e08436] animate-pulse" />
                oven preheated · 350°F
              </div>
              Pick a card. Each one delivers a working pipeline in under a minute.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {cards.map((card, i) => {
              const isCopied = copiedCard === i;
              return (
                <article
                  key={i}
                  className="relative group bg-[#221814] border border-[#4a1a1f]/60 hover:border-[#e08436]/70 transition-colors duration-500 flex flex-col"
                >
                  <div className="absolute -top-3 left-6 bg-[#e08436] text-[#1a1410] text-[9px] tracking-[0.4em] uppercase font-bold px-3 py-1">
                    Card №{String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="px-6 pt-8 pb-3 flex items-center justify-between border-b border-[#4a1a1f]/50">
                    <div
                      className="gb-display italic text-[#fae8b8] text-xl"
                      style={{ fontVariationSettings: '"opsz" 60' }}
                    >
                      {card.title}
                    </div>
                    {card.type === 'install' && (
                      <span className="gb-mono text-[9px] uppercase tracking-[0.3em] text-[#7d8a76]">
                        bash
                      </span>
                    )}
                    {card.type === 'code' && (
                      <span className="gb-mono text-[9px] uppercase tracking-[0.3em] text-[#7d8a76]">
                        recipe.go
                      </span>
                    )}
                    {card.type === 'command' && (
                      <span className="gb-mono text-[9px] uppercase tracking-[0.3em] text-[#7d8a76]">
                        cli
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-7 flex-1 min-h-[180px] overflow-x-auto">
                    {renderCardCode(card)}
                  </div>
                  <div className="px-6 py-5 border-t border-[#4a1a1f]/50 flex items-center justify-between gap-3">
                    {card.type === 'install' ? (
                      <button
                        onClick={() => copyToClipboard(card.code, i)}
                        className="flex items-center gap-2 bg-[#e08436] hover:bg-[#fae8b8] text-[#1a1410] px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase font-bold transition-colors group/btn"
                      >
                        {isCopied ? (
                          <CheckIcon size={14} weight="bold" />
                        ) : (
                          <CopyIcon size={14} weight="bold" />
                        )}
                        {isCopied ? 'Copied' : card.btnText}
                      </button>
                    ) : (
                      <a
                        href={card.btnLink}
                        target={card.btnLink?.startsWith('http') ? '_blank' : '_self'}
                        rel={card.btnLink?.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="flex items-center gap-2 bg-[#e08436] hover:bg-[#fae8b8] text-[#1a1410] px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase font-bold transition-colors"
                      >
                        {card.btnText}
                        <ArrowRightIcon size={12} weight="bold" />
                      </a>
                    )}
                    <div className="gb-script text-[#cfbe87]/70 text-lg leading-none">
                      {card.type === 'install' && '~30s'}
                      {card.type === 'code' && 'tasty'}
                      {card.type === 'command' && 'one-liner'}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex items-center gap-6 mt-16 text-[#cfbe87]/70 gb-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="h-px flex-1 bg-[#cfbe87]/20" />
            <span>baked, not boiled</span>
            <span className="h-px flex-1 bg-[#cfbe87]/20" />
          </div>
        </div>

        {/* Wavy boundary back to paper */}
        <div className="absolute -bottom-px left-0 right-0 h-8 text-[#f3e9d2]" aria-hidden>
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,12 C25,22 50,2 75,12 C100,22 125,2 150,12 C175,22 200,2 225,12 C250,22 275,2 300,12 C325,22 350,2 375,12 C400,22 400,22 400,24 L0,24 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ───────── Editorial column: tagline body, drop cap ───────── */}
      <section className="gb-paper py-24 md:py-32">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.5em] uppercase text-[#c5642a] font-bold">
              From the Editor
            </div>
            <Fleuron className="mx-auto mt-4 w-72 text-[#4a1a1f]/70" />
          </div>
          <div
            className="gb-drop-cap gb-body text-[1.25rem] md:text-[1.4rem] leading-[1.7] text-[#3a1518]"
            style={{ columnRule: '1px solid rgba(74,26,31,0.2)' }}
          >
            {heroBody ||
              'gobake replaces Makefiles, shell scripts, and yet-another-build-tool with a single, type-safe Recipe.go. Inspired by nob.h, your build logic compiles on the fly. Version 0.4.0 introduces multi-task CLI invocation, scoped working directories via RunIn, and captured stdout via RunOutput.'}
          </div>
          <div className="mt-10 flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-[#4a1a1f]/70 font-bold">
            <span>Filed by</span>
            <span className="gb-script text-[#c5642a] text-2xl tracking-normal normal-case">
              Fezcode
            </span>
            <span className="flex-1 h-px bg-[#4a1a1f]/30" />
            <span>{metadata.version}</span>
          </div>
        </div>
      </section>

      {/* ───────── Why Bake — six numbered features ───────── */}
      <section id="recipes" className="gb-paper-shade py-24 md:py-32 border-y-2 border-[#4a1a1f]/15">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="text-[10px] tracking-[0.5em] uppercase text-[#c5642a] font-bold mb-3">
              Six Reasons Your Builds Deserve Better
            </div>
            <h2
              className="gb-display text-5xl md:text-7xl text-[#4a1a1f] leading-[0.95]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
            >
              Why bake with{' '}
              <span className="italic text-[#c5642a]">{metadata.title}</span>?
            </h2>
            <Fleuron className="mx-auto mt-8 w-96 text-[#4a1a1f]/60" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
            {features.map((feature, idx) => (
              <article
                key={idx}
                className="relative bg-[#f3e9d2] border border-[#4a1a1f]/15 gb-card-shadow p-8 md:p-10 group"
              >
                <CornerOrnament className="absolute -top-2 -left-2 w-10 h-10 text-[#c5642a]/60" />
                <CornerOrnament
                  className="absolute -top-2 -right-2 w-10 h-10 text-[#c5642a]/60"
                  flip="scaleX(-1)"
                />

                <div className="flex items-start justify-between gap-6 mb-6">
                  <RecipeNumber n={idx} />
                  <div className="text-right">
                    <div className="text-[9px] tracking-[0.45em] uppercase text-[#c5642a] font-bold">
                      {feature.creator || 'Fezcode'}
                    </div>
                    <div
                      className="gb-script text-[#4a1a1f] text-xl leading-none -mt-0.5"
                      style={{ fontFamily: 'Caveat, cursive' }}
                    >
                      {feature.role || ''}
                    </div>
                  </div>
                </div>

                <h3
                  className="gb-display text-3xl md:text-4xl text-[#4a1a1f] leading-tight mb-3"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
                >
                  {feature.title}
                </h3>
                <div className="gb-rule h-px w-24 mb-5" />
                <p
                  className="gb-display italic text-lg text-[#6e2a2f] mb-4"
                  style={{ fontVariationSettings: '"opsz" 60' }}
                >
                  {feature.subtitle}
                </p>
                <p className="gb-body text-[1.0625rem] leading-relaxed text-[#3a1518] mb-6">
                  {feature.description}
                </p>

                {feature.quote && (
                  <figure className="relative bg-[#ecdfc0] border-l-2 border-[#c5642a] px-6 py-5 mt-6">
                    <span
                      className="absolute -top-7 -left-2 text-[110px] leading-none text-[#c5642a]/30 select-none pointer-events-none gb-display"
                      aria-hidden
                    >
                      “
                    </span>
                    <blockquote
                      className="gb-body italic text-[#4a1a1f] text-[1.0625rem] leading-relaxed relative z-10"
                    >
                      {feature.quote}
                    </blockquote>
                    <figcaption className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[#6e2a2f]/80 font-bold flex items-center gap-2">
                      <span className="w-6 h-px bg-[#c5642a]" />
                      In the kitchen
                    </figcaption>
                  </figure>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── The Pantry: dotted-leader TOC + cookbook prose ───────── */}
      <section id="pantry" className="gb-paper py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="text-[10px] tracking-[0.5em] uppercase text-[#c5642a] font-bold mb-3">
              The Pantry
            </div>
            <h2
              className="gb-display text-5xl md:text-7xl text-[#4a1a1f] leading-[0.95] mb-3"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
            >
              Documentation,
              <br />
              <span className="italic text-[#c5642a]">stocked & labeled.</span>
            </h2>
            <Fleuron className="mx-auto mt-8 w-72 text-[#4a1a1f]/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4">
              <div className="sticky top-20 bg-[#ecdfc0] border-2 border-[#4a1a1f]/15 p-8 gb-card-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] tracking-[0.4em] uppercase text-[#c5642a] font-bold">
                    Table of Contents
                  </div>
                  <Whisk className="w-7 h-7 text-[#c5642a]/70" />
                </div>
                <ul className="space-y-4">
                  {[
                    ['Quick Start', '#quick-start', 'I'],
                    ['Core Concepts', '#quick-start', 'II'],
                    ['CLI Reference', '#quick-start', 'III'],
                    ['Multi-Task Invocation', '#quick-start', 'IV'],
                    ['Recipes (`recipe.piml`)', '#quick-start', 'V'],
                    ['Scoped Shell Helpers', '#quick-start', 'VI'],
                    ['Examples', '#examples', 'VII'],
                    ['Installation', '#installation', 'VIII'],
                  ].map(([label, href, num]) => (
                    <li key={label} className="flex items-baseline gap-2 text-[#4a1a1f]">
                      <span
                        className="gb-display italic text-[#c5642a] text-sm w-6"
                        style={{ fontVariationSettings: '"opsz" 60' }}
                      >
                        {num}.
                      </span>
                      <a
                        href={href}
                        className="flex-1 flex items-baseline gap-2 group"
                      >
                        <span className="gb-display text-[1rem] tracking-tight group-hover:text-[#c5642a] transition-colors">
                          {label}
                        </span>
                        <span className="gb-leader text-[#4a1a1f]/60 flex-1 h-3" />
                        <span className="gb-mono text-[10px] text-[#6e2a2f]/70 tabular-nums">
                          {String((parseInt(num === 'I' ? 1 : num === 'II' ? 2 : num === 'III' ? 3 : num === 'IV' ? 4 : num === 'V' ? 5 : num === 'VI' ? 6 : num === 'VII' ? 7 : 8) * 4 + 8)).padStart(3, '0')}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-[#4a1a1f]/20 gb-script text-[#6e2a2f] text-xl leading-tight">
                  margin note —{' '}
                  <span className="text-[#c5642a]">
                    every section yields a working pipeline.
                  </span>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 relative">
              <div
                id="quick-start"
                className="gb-prose bg-[#f3e9d2] border border-[#4a1a1f]/15 p-8 md:p-12 gb-card-shadow relative"
              >
                <div className="absolute -top-3 left-8 bg-[#4a1a1f] text-[#fae8b8] text-[9px] tracking-[0.4em] uppercase font-bold px-3 py-1">
                  § Guide
                </div>
                <MarkdownContent content={content.guide} className="no-underline-hover" />
              </div>

              <div className="flex items-center gap-4 my-12">
                <span className="flex-1 gb-rule h-px" />
                <Fleuron className="w-32 text-[#c5642a]" />
                <span className="flex-1 gb-rule h-px" />
              </div>

              <div
                id="examples"
                className="gb-prose bg-[#f3e9d2] border border-[#4a1a1f]/15 p-8 md:p-12 gb-card-shadow relative"
              >
                <div className="absolute -top-3 left-8 bg-[#c5642a] text-[#fae8b8] text-[9px] tracking-[0.4em] uppercase font-bold px-3 py-1">
                  § Recipes
                </div>
                <MarkdownContent content={content.examples} className="no-underline-hover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── The Order — install CTA as a baker's receipt ───────── */}
      {installCommand && (
        <section
          id="installation"
          className="gb-paper-shade py-24 md:py-32 border-t-2 border-[#4a1a1f]/15 relative overflow-hidden"
        >
          <Whisk className="absolute top-12 left-8 w-20 h-20 text-[#c5642a]/15 -rotate-12 hidden md:block" />
          <OvenIcon className="absolute bottom-12 right-8 w-24 h-24 text-[#4a1a1f]/15 hidden md:block" />

          <div className="max-w-[820px] mx-auto px-6 lg:px-10 relative">
            <div className="text-center mb-12">
              <div className="text-[10px] tracking-[0.5em] uppercase text-[#c5642a] font-bold mb-3">
                Place Your Order
              </div>
              <h2
                className="gb-display text-5xl md:text-7xl text-[#4a1a1f] leading-[0.95]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                Ready to{' '}
                <span className="italic text-[#c5642a]">{metadata.title}</span>?
              </h2>
            </div>

            <div className="bg-[#f3e9d2] border-2 border-[#4a1a1f]/30 gb-card-shadow relative">
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{
                  background:
                    'repeating-linear-gradient(45deg, #c5642a 0 8px, transparent 8px 16px)',
                  opacity: 0.55,
                }}
              />
              <div className="px-8 pt-10 pb-8">
                <div className="flex items-center justify-between mb-6 text-[10px] tracking-[0.4em] uppercase text-[#4a1a1f]/80 font-bold">
                  <div>Order ticket · #{String(Math.floor(Math.random() * 9000) + 1000)}</div>
                  <div className="tabular-nums">{new Date().toISOString().split('T')[0]}</div>
                </div>

                <div className="border-y border-dashed border-[#4a1a1f]/40 py-6 my-2">
                  <div className="text-[10px] tracking-[0.4em] uppercase text-[#c5642a] font-bold mb-3">
                    Today's Order
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="gb-display text-2xl md:text-3xl text-[#4a1a1f] leading-none flex-1"
                      style={{ fontVariationSettings: '"opsz" 60' }}
                    >
                      gobake
                    </span>
                    <span className="gb-leader flex-1 h-3 text-[#4a1a1f]/50" />
                    <span className="gb-mono text-sm text-[#4a1a1f] tabular-nums">
                      v{metadata.version}
                    </span>
                  </div>
                  <div className="bg-[#1a1410] border-l-4 border-[#c5642a] p-5 mt-4 flex items-center justify-between gap-4 group">
                    <code
                      className="gb-mono text-[#fae8b8] text-sm md:text-base break-all flex items-center gap-3"
                    >
                      <span className="text-[#e08436] font-bold">$</span>
                      {installCommand}
                    </code>
                    <button
                      onClick={() => copyToClipboard(installCommand)}
                      className="flex items-center gap-2 bg-[#e08436] hover:bg-[#fae8b8] text-[#1a1410] px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-colors shrink-0"
                    >
                      {copied ? (
                        <CheckIcon size={12} weight="bold" />
                      ) : (
                        <CopyIcon size={12} weight="bold" />
                      )}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 py-4 text-left">
                  {[
                    ['License', 'MIT'],
                    ['Runtime', 'Go ≥ 1.21'],
                    ['Deps', 'zero'],
                    ['Yields', 'one binary'],
                    ['Cross-compile', 'all GOOS/GOARCH'],
                    ['Source', 'github.com/fezcode'],
                  ].map(([k, v]) => (
                    <div key={k} className="text-[#4a1a1f]">
                      <div className="text-[9px] tracking-[0.4em] uppercase text-[#c5642a] font-bold mb-0.5">
                        {k}
                      </div>
                      <div
                        className="gb-display text-sm md:text-base"
                        style={{ fontVariationSettings: '"opsz" 30' }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-[#4a1a1f]/40 mt-6 pt-6 flex items-end justify-between gap-6">
                  <div className="gb-script text-[#c5642a] text-2xl md:text-3xl leading-none">
                    enjoy your build!
                  </div>
                  <div className="text-right">
                    <div className="gb-stamp-rotate inline-block">
                      <div
                        className="border-[3px] border-[#c5642a] text-[#c5642a] px-5 py-2"
                        style={{ fontFamily: 'Fraunces, serif', fontWeight: 800 }}
                      >
                        <div className="text-[8px] tracking-[0.4em] uppercase">
                          Fezcode
                        </div>
                        <div className="text-xl tracking-tight leading-none">
                          GENUINE
                        </div>
                        <div className="text-[8px] tracking-[0.4em] uppercase">
                          baking co.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-3"
                style={{
                  background:
                    'repeating-linear-gradient(-45deg, #c5642a 0 8px, transparent 8px 16px)',
                  opacity: 0.55,
                }}
              />
            </div>

            <div className="text-center mt-10 text-[10px] tracking-[0.4em] uppercase text-[#4a1a1f]/70 font-bold">
              ※ baked fresh · no preservatives · no node_modules ※
            </div>
          </div>
        </section>
      )}

      {/* ───────── Footer / colophon ───────── */}
      <footer className="gb-paper border-t-4 border-[#4a1a1f] relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#c5642a]" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div>
              <div className="gb-script text-[#c5642a] text-3xl">happy hacking,</div>
              <div
                className="gb-display text-6xl text-[#4a1a1f] leading-none -mt-1"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {metadata.title}
              </div>
              <div className="mt-3 text-[10px] tracking-[0.4em] uppercase text-[#4a1a1f]/70 font-bold">
                Vol. IV · Edition {metadata.version}
              </div>
            </div>

            <nav className="space-y-2 text-[#4a1a1f]">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#c5642a] font-bold mb-3">
                Sections
              </div>
              {[
                ['Pantry (docs)', '#pantry'],
                ['Recipes (features)', '#recipes'],
                ['Place an order', '#installation'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-baseline gap-2 hover:text-[#c5642a] transition-colors"
                >
                  <span
                    className="gb-display text-lg"
                    style={{ fontVariationSettings: '"opsz" 60' }}
                  >
                    {label}
                  </span>
                  <span className="gb-leader flex-1 h-3 text-[#4a1a1f]/40" />
                  <ArrowRightIcon size={12} weight="bold" />
                </a>
              ))}
            </nav>

            <div className="text-[#4a1a1f]">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#c5642a] font-bold mb-3">
                Colophon
              </div>
              <p
                className="gb-body text-[1rem] leading-relaxed text-[#3a1518]"
              >
                Set in <em>Fraunces</em>, <em>EB Garamond</em>, and{' '}
                <em>JetBrains Mono</em>. Hand-noted in <em>Caveat</em>. Printed in
                Go on cream paper, somewhere quiet.
              </p>
              {metadata.repo_link && (
                <a
                  href={metadata.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[10px] tracking-[0.4em] uppercase font-bold text-[#4a1a1f] hover:text-[#c5642a] transition-colors"
                >
                  <GithubLogoIcon size={14} weight="bold" /> source on github
                </a>
              )}
            </div>
          </div>

          <Fleuron className="mx-auto mt-16 w-96 text-[#4a1a1f]/40" />

          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.5em] uppercase text-[#4a1a1f]/60 font-bold">
            <div>© {new Date().getFullYear()} Fezcode Press · All rights reserved</div>
            <div>※ no Makefiles were harmed in the making of this build tool ※</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RubyProjectPage;
