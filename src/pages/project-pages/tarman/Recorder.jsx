import React, { useState } from 'react';

/* ============================================================
 * Interactive, illustrative ten-minute recording. Scrub the
 * window, switch metrics, read the top processes at that second.
 * Sample data only.
 * ============================================================ */

const CHANNELS = [
  { id: 'cpu', name: 'CPU', unit: '%', max: 100 },
  { id: 'memory', name: 'Memory', unit: 'GB', max: 32 },
  { id: 'disk', name: 'Disk I/O', unit: 'MB/s', max: 200 },
  { id: 'gpu', name: 'GPU', unit: '%', max: 100 },
];

const RECORD = Array.from({ length: 61 }, (_, index) => {
  const spike = Math.exp(-Math.pow((index - 37) / 3.2, 2));
  return {
    cpu: Math.round(16 + 8 * Math.abs(Math.sin(index * 0.53)) + spike * 67),
    memory: Math.round((9.2 + index * 0.046 + spike * 3.1) * 10) / 10,
    disk: Math.round(3 + 12 * Math.abs(Math.sin(index * 0.8)) + spike * 166),
    gpu: Math.round(8 + 12 * Math.abs(Math.cos(index * 0.28)) + spike * 34),
  };
});

const pad = (value) => String(value).padStart(2, '0');
const sampleTime = (index) =>
  '14:' + pad(32 + Math.floor(index / 6)) + ':' + pad((index % 6) * 10);

const Recorder = () => {
  const [index, setIndex] = useState(37);
  const [channelId, setChannelId] = useState('cpu');
  const channel = CHANNELS.find((item) => item.id === channelId);
  const sample = RECORD[index];
  const chartY = (value) => 237 - (value / channel.max) * 211;
  const points = RECORD.map(
    (item, i) => (i / 60) * 1000 + ',' + chartY(item[channel.id]),
  ).join(' ');
  const cursor = (index / 60) * 1000;
  const processNames =
    index >= 34 && index <= 41
      ? ['compiler.exe', 'renderer.exe', 'browser.exe']
      : ['browser.exe', 'editor.exe', 'system'];
  const processRatios = [0.61, 0.23, 0.11];

  return (
    <div className="trm-recorder">
      <div className="trm-recorder-bar">
        <span className="trm-eyebrow-inline">
          <i className="trm-dot trm-dot--live" /> Illustrative recording
        </span>
        <span>14:32:00 — 14:42:00</span>
      </div>
      <div className="trm-recorder-grid">
        <div className="trm-timeline">
          <div
            className="trm-tabs"
            role="group"
            aria-label="Choose a sample metric"
          >
            {CHANNELS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === channelId}
                onClick={() => setChannelId(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="trm-chart">
            <svg
              viewBox="0 0 1000 260"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="trm-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a8927b" stopOpacity=".42" />
                  <stop offset="100%" stopColor="#cbb9a6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[26, 79, 132, 185, 237].map((y) => (
                <path
                  key={y}
                  d={'M0 ' + y + 'H1000'}
                  className="trm-chart-grid"
                />
              ))}
              {[0, 200, 400, 600, 800, 1000].map((x) => (
                <path
                  key={x}
                  d={'M' + x + ' 0V260'}
                  className="trm-chart-grid"
                />
              ))}
              <polygon
                points={'0,260 ' + points + ' 1000,260'}
                fill="url(#trm-chart-fill)"
              />
              <polyline points={points} className="trm-chart-line" />
              <path d={'M' + cursor + ' 0V260'} className="trm-chart-cursor" />
            </svg>
            <span
              className="trm-chart-point"
              style={{
                left: `${(index / 60) * 100}%`,
                top: `${(chartY(sample[channel.id]) / 260) * 100}%`,
              }}
              aria-hidden="true"
            />
            <span className="trm-chart-unit">
              {channel.max} {channel.unit}
            </span>
            <span className="trm-chart-stamp">{sampleTime(index)}</span>
          </div>
          <label className="trm-slider-label" htmlFor="trm-history-scrubber">
            Scrub the ten-minute window <span>← move through time →</span>
          </label>
          <input
            id="trm-history-scrubber"
            className="trm-scrubber"
            type="range"
            min="0"
            max="60"
            step="1"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            aria-valuetext={
              sampleTime(index) +
              ', ' +
              channel.name +
              ' ' +
              sample[channel.id] +
              channel.unit
            }
          />
          <div className="trm-time-axis">
            <span>−10:00</span>
            <span>−05:00</span>
            <span>Now</span>
          </div>
        </div>
        <div className="trm-detail" aria-live="polite" aria-atomic="true">
          <div className="trm-detail-head">
            <span>Cursor / {sampleTime(index)}</span>
            <button type="button" onClick={() => setIndex(60)}>
              Latest ↗
            </button>
          </div>
          <strong className="trm-detail-metric">
            {sample[channel.id]}
            <span>{channel.unit}</span>
          </strong>
          <span className="trm-detail-caption">
            {channel.name} at this moment
          </span>
          <div className="trm-detail-procs">
            <div className="trm-detail-procs-head">
              <span>Top processes</span>
              <span>{channel.unit}</span>
            </div>
            {processNames.map((name, i) => (
              <div className="trm-detail-proc" key={name}>
                <span>{name}</span>
                <strong>
                  {(sample[channel.id] * processRatios[i]).toFixed(1)}
                </strong>
              </div>
            ))}
          </div>
          <p>
            Sample data, designed to explore the interaction. No device
            telemetry is collected.
          </p>
        </div>
      </div>
      <div className="trm-recorder-foot">
        <span>One shared sample clock</span>
        <span>Illustrative view · 10 s intervals</span>
        <span>Tarman records once per second</span>
      </div>
    </div>
  );
};

export default Recorder;
