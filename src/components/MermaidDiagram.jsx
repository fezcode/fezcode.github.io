import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: "'JetBrains Mono', monospace",
      useMaxWidth: false,
      htmlLabels: true,
      flowchart: {
        padding: 15,
        useMaxWidth: false,
        htmlLabels: true,
      },
      themeVariables: {
        fontSize: '16px',
      },
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // mermaid.render returns an object { svg } in newer versions
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        // Mermaid might leave error text in the DOM, so we can also show a friendly message
        setError('Failed to render diagram. Check syntax.');
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 my-4 border border-red-500/20 bg-red-500/10 rounded text-red-400 text-sm font-mono">
        {error}
        <pre className="mt-2 text-xs opacity-50 overflow-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-container my-8 bg-gray-900/30 p-6 rounded-lg overflow-x-auto">
      <style>
        {`
          .mermaid-container svg {
            overflow: visible !important;
            max-width: none !important;
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
        className="flex justify-center min-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

export default MermaidDiagram;
