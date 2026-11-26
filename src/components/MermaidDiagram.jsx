import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { SITE_THEMES } from '../utils/siteThemes';

/*
 * Page-aware mermaid renderer.
 *
 * Reader views differ wildly (dark terminals, bone paper, felt, glossy
 * windows, an editorial page that inverts), so instead of one preset per
 * theme the diagram reads the page it sits on: the text colour of its
 * container and the first solid background behind it. The palette is built
 * from those two colours plus the theme's accent, with contrast checks, so
 * labels stay legible wherever the diagram lands.
 *
 * Callers may pass className to style the frame (its background is then what
 * the palette is built on) and accent to override the accent colour.
 */

// ---------------------------------------------------------------- colour

const parseColor = (value) => {
  const m = String(value || '').match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  const hex = String(value || '').replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(1);
  }
  return null;
};

const toHex = ([r, g, b]) =>
  '#' +
  [r, g, b]
    .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
    .join('');

const mix = (a, b, t) => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t).concat(1);

const luminance = ([r, g, b]) => {
  const ch = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Nudge a colour toward ink until it reaches the given contrast on bg. */
const ensureContrast = (color, bg, ink, min) => {
  let c = color;
  for (let t = 0; t <= 1 && contrast(c, bg) < min; t += 0.1) c = mix(color, ink, t);
  return c;
};

// ---------------------------------------------------------------- theme

const ACCENTS = Object.fromEntries(SITE_THEMES.map((t) => [t.id, t.accent]));

// Reader views with a colour of their own outrank the site theme's accent.
const READER_ACCENTS = {
  terminal: '#f97316',
  'terminal-green': '#10b981',
  old: '#22d3ee',
  dossier: '#b91c1c',
  dokument: '#111111',
  galley: '#c96442',
  terracotta: '#c96442',
  luxe: '#8d4004',
};

const FONTS = {
  brutalist: "'JetBrains Mono', monospace",
  luxe: "'Outfit', 'Inter', system-ui, sans-serif",
  terracotta: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  mist: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  ledger: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  orbit: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  knit: "'Nunito', 'Inter', system-ui, sans-serif",
  kilim: "'Bitter', Georgia, serif",
  bliss: "Tahoma, 'Segoe UI', Verdana, sans-serif",
};

/** The solid colours behind and in front of the diagram. */
const readSurface = (el) => {
  const ink = parseColor(getComputedStyle(el).color) || [26, 26, 26, 1];
  let bg = null;
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c && c[3] > 0.6) {
      bg = c;
      break;
    }
  }
  if (!bg) bg = luminance(ink) > 0.5 ? [10, 10, 10, 1] : [255, 255, 255, 1];
  // Text colour that doesn't read on its own background (a bad inherit):
  // fall back to black or white.
  const safeInk =
    contrast(ink, bg) >= 4.5 ? ink : luminance(bg) > 0.4 ? [17, 17, 17, 1] : [245, 245, 245, 1];
  return { ink: safeInk, bg };
};

const buildPalette = ({ ink, bg }, accentHex) => {
  const dark = luminance(bg) < 0.25;
  const accentRaw = parseColor(accentHex) || ink;
  const accent = ensureContrast(accentRaw, bg, ink, 3);
  const node = mix(bg, ink, dark ? 0.1 : 0.05);
  const node2 = mix(bg, accent, dark ? 0.22 : 0.12);
  const border = mix(bg, ink, 0.7);
  const line = mix(bg, ink, 0.8);
  const muted = ensureContrast(mix(bg, ink, 0.65), bg, ink, 4.5);
  const note = mix(bg, accent, dark ? 0.28 : 0.16);
  const frame = mix(bg, ink, 0.14);

  // Pie slices: the accent first, then a spread of hues pitched for the page.
  const hues = dark
    ? ['#7aa2ff', '#f08a6c', '#5fd3a0', '#f2c45a', '#c39bff', '#ff8fb8', '#5cc8c8', '#b7bec8']
    : ['#3157ce', '#c4553a', '#2f8f62', '#b07d12', '#7b4fb8', '#c23f78', '#1d6a69', '#5f6b78'];
  // Skip hues too close to the accent so neighbouring slices never match.
  const far = (hex) => {
    const c = parseColor(hex);
    return Math.hypot(c[0] - accent[0], c[1] - accent[1], c[2] - accent[2]) > 90;
  };
  const slices = [toHex(accent), ...hues.filter(far)].slice(0, 9);
  const sliceText = dark ? '#0b0b0b' : '#ffffff';

  const h = toHex;
  const vars = {
    darkMode: dark,
    background: h(bg),
    fontSize: '15px',

    primaryColor: h(node),
    primaryBorderColor: h(border),
    primaryTextColor: h(ink),
    secondaryColor: h(node2),
    secondaryBorderColor: h(accent),
    secondaryTextColor: h(ink),
    tertiaryColor: h(mix(bg, ink, dark ? 0.16 : 0.09)),
    tertiaryBorderColor: h(border),
    tertiaryTextColor: h(ink),

    mainBkg: h(node),
    nodeBorder: h(border),
    nodeTextColor: h(ink),
    textColor: h(ink),
    titleColor: h(ink),
    lineColor: h(line),
    defaultLinkColor: h(line),
    edgeLabelBackground: h(bg),
    clusterBkg: h(mix(bg, ink, 0.03)),
    clusterBorder: h(frame),

    // Sequence diagrams
    actorBkg: h(node),
    actorBorder: h(border),
    actorTextColor: h(ink),
    actorLineColor: h(mix(bg, ink, 0.45)),
    signalColor: h(line),
    signalTextColor: h(ink),
    labelBoxBkgColor: h(node),
    labelBoxBorderColor: h(border),
    labelTextColor: h(ink),
    loopTextColor: h(ink),
    noteBkgColor: h(note),
    noteBorderColor: h(accent),
    noteTextColor: h(ink),
    activationBkgColor: h(node2),
    activationBorderColor: h(accent),
    sequenceNumberColor: h(bg),

    // State / class diagrams
    labelColor: h(ink),
    altBackground: h(mix(bg, ink, 0.04)),

    // Pie charts
    pieTitleTextColor: h(ink),
    pieSectionTextColor: sliceText,
    pieLegendTextColor: h(ink),
    pieStrokeColor: h(bg),
    pieOuterStrokeColor: h(frame),
    pieStrokeWidth: '2px',
    pieOpacity: '1',
  };
  slices.forEach((c, i) => {
    vars[`pie${i + 1}`] = c;
  });
  return { vars, frame: h(frame), ink: h(ink), muted: h(muted) };
};

// ---------------------------------------------------------------- render

let renderQueue = Promise.resolve();

const MermaidDiagram = ({ chart, className, accent }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [palette, setPalette] = useState(null);
  const containerRef = useRef(null);

  const visualSettings = useVisualSettings();
  const themeKey = visualSettings?.fezcodexTheme || 'brutalist';
  const blogMode = visualSettings?.blogPostViewMode;
  const accentHex =
    accent || READER_ACCENTS[blogMode] || ACCENTS[themeKey] || '#10b981';
  const fontFamily = FONTS[themeKey] || FONTS.brutalist;

  // Read the page colours, and again whenever the page restyles itself
  // (appearance toggles, inverted reading modes).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = buildPalette(readSurface(el), accentHex);
        setPalette((prev) =>
          prev && JSON.stringify(prev.vars) === JSON.stringify(next.vars) ? prev : next,
        );
      });
    };
    measure();
    const observer = new MutationObserver(measure);
    const opts = { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);
    for (let n = el.parentElement, i = 0; n && i < 6; n = n.parentElement, i++) {
      observer.observe(n, opts);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [accentHex, themeKey, blogMode, className]);

  useEffect(() => {
    if (!chart || !palette) return undefined;
    let cancelled = false;
    // mermaid's config is global: render one diagram at a time so each gets
    // its own palette.
    renderQueue = renderQueue.then(async () => {
      if (cancelled) return;
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          fontFamily,
          themeVariables: { ...palette.vars, fontFamily },
          flowchart: { padding: 16, wrappingWidth: 260, useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true, mirrorActors: true, actorMargin: 60 },
          pie: { useMaxWidth: true, textPosition: 0.72 },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (!cancelled) setError('Failed to render diagram. Check syntax.');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, palette, fontFamily]);

  if (error) {
    return (
      <div className="p-4 my-4 border border-red-500/20 bg-red-500/10 rounded text-red-400 text-sm font-mono">
        {error}
        <pre className="mt-2 text-xs opacity-50 overflow-auto">{chart}</pre>
      </div>
    );
  }

  const frameStyle = className
    ? undefined
    : {
        border: `1px solid ${palette?.frame || 'transparent'}`,
        borderRadius: 10,
        padding: '24px',
        margin: '2rem 0',
        overflowX: 'auto',
        color: palette?.ink,
      };

  return (
    <div
      ref={containerRef}
      className={`mermaid-container not-prose ${className || ''}`}
      style={frameStyle}
    >
      <style>
        {`
          .mermaid-container svg {
            display: block;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0 auto;
          }
          .mermaid-container foreignObject {
            overflow: visible !important;
          }
          .mermaid-container p,
          .mermaid-container .label p,
          .mermaid-container .nodeLabel p,
          .mermaid-container .edgeLabel p {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.3 !important;
            font-size: inherit !important;
            font-family: inherit !important;
            color: inherit !important;
          }
          .mermaid-container .nodeLabel,
          .mermaid-container .edgeLabel {
            line-height: 1.3 !important;
            font-family: inherit !important;
          }
          .mermaid-container .edgeLabel,
          .mermaid-container .edgeLabel rect {
            opacity: 1 !important;
          }
        `}
      </style>
      <div className="w-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};

export default MermaidDiagram;
