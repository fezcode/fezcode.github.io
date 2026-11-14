import React from 'react';
import { CircleIcon } from '@phosphor-icons/react';
import { appIcons } from '../../utils/appIcons';

/** Saturated glossy tile colours: [top, bottom]. */
export const TONES = {
  blue: ['#6aa8ff', '#1e5fe0'],
  green: ['#86e05e', '#2f9e1e'],
  orange: ['#ffad6b', '#e0641e'],
  yellow: ['#ffd96b', '#d99a0b'],
  pink: ['#ff8fb4', '#d0346a'],
  purple: ['#b98cff', '#7a3fd0'],
  teal: ['#5fe0e6', '#0e8ea0'],
  red: ['#ff8a7a', '#d0341c'],
  graphite: ['#9aa7bd', '#3f4b63'],
};
const TONE_KEYS = Object.keys(TONES);

/** A stable tone for any string (slug, title, category). */
export const toneFor = (seed = '') => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1)
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return TONE_KEYS[Math.abs(hash) % TONE_KEYS.length];
};

/**
 * A glossy rounded tile with a white Phosphor glyph — the Bliss pictogram.
 * `icon` is a Phosphor component or an appIcons name ("HouseIcon").
 * Decorative unless `label` is given.
 */
const BlissIcon = ({
  icon,
  tone,
  seed,
  size = 32,
  label,
  className = '',
}) => {
  const Glyph =
    typeof icon === 'string'
      ? appIcons[icon] || appIcons[`${icon}Icon`] || CircleIcon
      : icon || CircleIcon;
  const [top, bottom] = TONES[tone] || TONES[toneFor(seed || String(icon))];
  return (
    <span
      className={`bl-icon ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, ${top}, ${bottom})`,
      }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Glyph size={Math.round(size * 0.58)} weight="fill" />
    </span>
  );
};

export default BlissIcon;
