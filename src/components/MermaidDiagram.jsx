import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useVisualSettings } from '../context/VisualSettingsContext';

/*
 * Theme-aware mermaid renderer.
 *
 * Reads fezcodexTheme from VisualSettingsContext (falling back safely if the
 * provider isn't in the tree) and picks a palette + container style that fits:
 *
 *   terracotta — bone paper, terra ink, Fraunces-friendly warm ink text
 *   luxe       — off-white card, charcoal line, muted accent
 *   brutalist  — dark card, emerald accent (default legacy look)
 *
 * Callers can still override theme / className explicitly.
 */

const THEME_PRESETS = {
  terracotta: {
    mermaidTheme: 'base',
    themeVariables: {
      background: '#F3ECE0',
      primaryColor: '#E8DECE',
      primaryBorderColor: '#1A1613',
      primaryTextColor: '#1A1613',
      secondaryColor: '#F3ECE0',
      secondaryBorderColor: '#1A161360',
      secondaryTextColor: '#1A1613',
      tertiaryColor: '#C96442',
      tertiaryBorderColor: '#9E4A2F',
      tertiaryTextColor: '#F3ECE0',
      lineColor: '#1A1613',
      textColor: '#1A1613',
      mainBkg: '#E8DECE',
      nodeBorder: '#1A1613',
      clusterBkg: '#F3ECE0',
      clusterBorder: '#1A161340',
      edgeLabelBackground: '#F3ECE0',
      titleColor: '#1A1613',
      noteBkgColor: '#E8DECE',
      noteTextColor: '#1A1613',
      noteBorderColor: '#C96442',
      fontSize: '15px',
    },
    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    container:
      'mermaid-container my-8 border border-[#1A161330] bg-[#F3ECE0] p-6 overflow-x-auto relative',
    labelClass: 'Diagram · figure',
    labelColor: '#C96442',
  },
  luxe: {
    mermaidTheme: 'base',
    themeVariables: {
      background: '#FAFAF8',
      primaryColor: '#FFFFFF',
      primaryBorderColor: '#1A1A1A',
      primaryTextColor: '#1A1A1A',
      secondaryColor: '#FAFAF8',
      secondaryBorderColor: '#1A1A1A40',
      secondaryTextColor: '#1A1A1A',
      tertiaryColor: '#8D4004',
      tertiaryBorderColor: '#8D4004',
      tertiaryTextColor: '#FFFFFF',
      lineColor: '#1A1A1A',
      textColor: '#1A1A1A',
      mainBkg: '#FFFFFF',
      nodeBorder: '#1A1A1A',
      clusterBkg: '#FAFAF8',
      clusterBorder: '#1A1A1A20',
      edgeLabelBackground: '#FAFAF8',
      titleColor: '#1A1A1A',
      noteBkgColor: '#FAFAF8',
      noteTextColor: '#1A1A1A',
      noteBorderColor: '#8D4004',
      fontSize: '15px',
    },
    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
    container:
      'mermaid-container my-8 border border-[#1A1A1A10] bg-[#FAFAF8] p-6 rounded-sm shadow-sm overflow-x-auto',
    labelClass: null,
    labelColor: null,
  },
  brutalist: {
    mermaidTheme: 'dark',
    themeVariables: {
      fontSize: '16px',
    },
    fontFamily: "'JetBrains Mono', monospace",
    container:
      'mermaid-container my-8 bg-gray-900/30 p-6 rounded-lg overflow-x-auto',
    labelClass: null,
    labelColor: null,
  },
};

const MermaidDiagram = ({ chart, theme, className }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const visualSettings = useVisualSettings();
  const activeThemeKey = (() => {
    if (theme === 'dark' || theme === 'default' || theme === 'base' || theme === 'neutral' || theme === 'forest') {
      return null;
    }
    return visualSettings?.fezcodexTheme || 'brutalist';
  })();
  const preset =
    (activeThemeKey && THEME_PRESETS[activeThemeKey]) || THEME_PRESETS.brutalist;

  const mermaidTheme = theme || preset.mermaidTheme;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
      fontFamily: preset.fontFamily,
      useMaxWidth: true,
      htmlLabels: true,
      flowchart: {
        padding: 15,
        useMaxWidth: true,
        htmlLabels: true,
      },
      themeVariables: preset.themeVariables,
    });
  }, [mermaidTheme, preset]);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        setSvg(rendered);
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram. Check syntax.');
      }
    };

    renderChart();
  }, [chart, mermaidTheme, preset]);

  if (error) {
    return (
      <div className="p-4 my-4 border border-red-500/20 bg-red-500/10 rounded text-red-400 text-sm font-mono">
        {error}
        <pre className="mt-2 text-xs opacity-50 overflow-auto">{chart}</pre>
      </div>
    );
  }

  const containerClass = className || preset.container;

  return (
    <div ref={containerRef} className={containerClass}>
      {preset.labelClass && (
        <div
          className="absolute top-0 left-4 -translate-y-1/2 bg-[#F3ECE0] px-2 font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase"
          style={{ color: preset.labelColor }}
        >
          {preset.labelClass}
        </div>
      )}
      <style>
        {`
          .mermaid-container svg {
            display: block;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .mermaid-container foreignObject {
            overflow: visible !important;
          }
          .mermaid-container .label {
            color: inherit;
          }
        `}
      </style>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

export default MermaidDiagram;
