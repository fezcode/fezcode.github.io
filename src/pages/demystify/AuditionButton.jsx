import React from 'react';

const GLYPH = {
  idle: '►',
  resolving: '…',
  playing: '■',
  synth: '≈',
};

const HINT = {
  idle: 'Play a ten-second excerpt',
  resolving: 'Looking for a preview…',
  playing: 'Stop',
  synth: 'No preview found — playing a chord from this genre’s spectrum',
};

/**
 * One control, four states. `≈` means the catalogue had no match and the
 * fallback chord played instead, so a silent-looking press is never ambiguous.
 */
const AuditionButton = ({
  id,
  activeId,
  status,
  enabled,
  onPlay,
  label,
  wide = false,
}) => {
  const state = activeId === id ? status : 'idle';

  return (
    <button
      type="button"
      className={`dm-audition${wide ? ' is-wide' : ''}`}
      disabled={!enabled}
      onClick={onPlay}
      aria-label={enabled ? `${HINT[state]}: ${label}` : `Audio off: ${label}`}
      title={enabled ? HINT[state] : 'Audio is off'}
    >
      {!enabled
        ? wide
          ? '[MUTED]'
          : '[×]'
        : wide
          ? `[${GLYPH[state]} ${state === 'playing' ? 'STOP' : '10s EXCERPT'}]`
          : `[${GLYPH[state]}]`}
    </button>
  );
};

export default AuditionButton;
