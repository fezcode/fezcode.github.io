import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InfoIcon, WarningIcon } from '@phosphor-icons/react';
import BlissIcon from './BlissIcon';

/** Loading / error text in a yellow balloon-style notice. */
export const BlissNotice = ({ error = false, children }) => (
  <div
    className={`bl-notice ${error ? 'bl-notice-error' : ''}`}
    role={error ? 'alert' : 'status'}
  >
    {error ? (
      <WarningIcon size={22} weight="fill" color="#e0502c" aria-hidden="true" />
    ) : (
      <InfoIcon size={22} weight="fill" color="#1e5fe0" aria-hidden="true" />
    )}
    <span>{children}</span>
  </div>
);

/** ★★★★☆ with an accessible label. `value` out of `max`. */
export const BlissStars = ({ value = 0, max = 5, className = '' }) => {
  const n = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  return (
    <span
      className={`bl-stars ${className}`}
      role="img"
      aria-label={`Rated ${n} out of ${max}`}
    >
      {'★'.repeat(n)}
      {'☆'.repeat(max - n)}
    </span>
  );
};

/** A block progress bar. `value` 0–100. */
export const BlissProgress = ({ value = 0, label }) => (
  <div
    className="bl-progress"
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value)}
    aria-label={label}
  >
    <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

/** An item's image (16:9), falling back to a large glossy icon tile. */
export const BlissCover = ({ item, icon = 'CubeIcon', className = '' }) => {
  const [failed, setFailed] = useState(null);
  const hasImage = item.image && failed !== item.image;
  return hasImage ? (
    <img
      src={item.image}
      alt=""
      loading="lazy"
      decoding="async"
      className={`bl-cover ${className}`}
      onError={() => setFailed(item.image)}
    />
  ) : (
    <div
      className={`bl-cover flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <BlissIcon icon={icon} seed={item.slug || item.title} size={64} />
    </div>
  );
};

/** A desktop shortcut on the wallpaper: icon tile + shadowed caption. */
export const BlissDesktopIcon = ({ to, icon, tone, label }) => (
  <Link to={to} className="bl-desktop-icon">
    <BlissIcon icon={icon} tone={tone} size={46} />
    <span>{label}</span>
  </Link>
);

/** Window-title-bar link ("The archive →"). */
export const BlissTitleLink = ({ to, children, ...rest }) => (
  <Link to={to} className="bl-titlebar-link" {...rest}>
    {children}
  </Link>
);
