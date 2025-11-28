import React, { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DownloadSimple } from '@phosphor-icons/react';

const GenerativeArt = () => {
  const art = useMemo(() => {
    const SVG_SIZE = 500;
    const NUM_SHAPES = 25;
    const shapes = [];

    const colors = ['#FBBF24', '#A7F3D0', '#F87171', '#60A5FA', '#A78BFA'];

    for (let i = 0; i < NUM_SHAPES; i++) {
      const x = Math.random() * SVG_SIZE;
      const y = Math.random() * SVG_SIZE;
      const width = 10 + Math.random() * 150;
      const height = 10 + Math.random() * 150;
      const fill = colors[Math.floor(Math.random() * colors.length)];
      const rotation = Math.random() * 360;
      const opacity = 0.5 + Math.random() * 0.5;

      shapes.push(
        <rect
          key={i}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={opacity}
          transform={`rotate(${rotation} ${x + width / 2} ${y + height / 2})`}
        />,
      );
    }

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="art-board">
            <rect width={SVG_SIZE} height={SVG_SIZE} />
          </clipPath>
        </defs>
        <rect width={SVG_SIZE} height={SVG_SIZE} fill="#1F2937" />
        <g clipPath="url(#art-board)">{shapes}</g>
      </svg>
    );
  }, []);

  const handleDownload = () => {
    const svgString = ReactDOMServer.renderToString(art);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generative-art.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '60vh',
          border: '1px solid #374151',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {art}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-lg font-arvo font-normal px-6 py-2 rounded-md border transition-colors duration-300 ease-in-out border-green-700 bg-green-800/50 text-white hover:bg-green-700/50"
        >
          <DownloadSimple size={24} />
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default GenerativeArt;
