import React, { useMemo } from 'react';
import { spectrumBars, SPECTRUM_AXIS } from './spectrumScale';

// Chart geometry in user units; the SVG scales to its container.
const BAR = 10;
const GAP = 2;
const PLOT = 90;
const AXIS = 18;
const PAD = 1;

/**
 * A genre's frequency-energy profile, drawn as SVG so the bars tile exactly.
 * Colours come from the demystify palette via currentColor and CSS variables,
 * so it follows the theme without any per-theme markup.
 */
const Spectrum = ({ spec }) => {
  const bars = useMemo(() => spectrumBars(spec), [spec]);
  if (!bars.length) return null;

  const width = bars.length * BAR + (bars.length - 1) * GAP;
  const height = PLOT + AXIS;

  return (
    <figure className="dm-figure">
      <svg
        className="dm-spectrum"
        viewBox={`${-PAD} 0 ${width + PAD * 2} ${height}`}
        role="img"
        aria-label="Characteristic frequency-energy profile"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="dm-spectrum-bars">
          {bars.map((value, i) => {
            const barHeight = Math.max(1, value * PLOT);
            return (
              <rect
                key={i}
                x={i * (BAR + GAP)}
                y={PLOT - barHeight}
                width={BAR}
                height={barHeight}
              />
            );
          })}
        </g>

        <line
          className="dm-spectrum-axis"
          x1={-PAD}
          y1={PLOT + 0.5}
          x2={width + PAD}
          y2={PLOT + 0.5}
        />

        {SPECTRUM_AXIS.filter((mark) => mark.at < bars.length).map((mark) => {
          const x = mark.at * (BAR + GAP) + BAR / 2;
          return (
            <g key={mark.label}>
              <line
                className="dm-spectrum-axis"
                x1={x}
                y1={PLOT}
                x2={x}
                y2={PLOT + 4}
              />
              <text
                className="dm-spectrum-label"
                x={x}
                y={PLOT + 14}
                textAnchor={
                  mark.at === 0
                    ? 'start'
                    : mark.at === bars.length - 1
                      ? 'end'
                      : 'middle'
                }
              >
                {mark.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="dm-figcaption">
        Characteristic frequency-energy profile
      </figcaption>
    </figure>
  );
};

export default Spectrum;
