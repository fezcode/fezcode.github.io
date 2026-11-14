import React from 'react';
import { MinusIcon, SquareIcon, XIcon } from '@phosphor-icons/react';
import BlissIcon from './BlissIcon';

/**
 * Bliss's one container: a window. A glossy title bar (icon, title, optional
 * actions, decorative minimise/maximise, optional real close) over a cream
 * body. The title is the section's heading (`headingLevel`, default h2).
 *
 *   <BlissWindow title="Selected works" icon="CubeIcon"
 *     actions={<Link to="/projects">The archive →</Link>}>…</BlissWindow>
 */
const BlissWindow = ({
  title,
  icon,
  tone,
  headingLevel = 2,
  as: Tag = 'section',
  actions,
  onClose,
  closeLabel = 'Close',
  status,
  inactive = false,
  flush = false,
  className = '',
  bodyClassName = '',
  titleId,
  children,
  ...rest
}) => {
  const Heading = headingLevel ? `h${headingLevel}` : 'span';
  return (
    <Tag
      className={`bl-window ${inactive ? 'bl-window-inactive' : ''} ${className}`}
      aria-labelledby={titleId && Tag === 'section' ? titleId : undefined}
      {...rest}
    >
      <div className="bl-titlebar">
        {icon && <BlissIcon icon={icon} tone={tone} size={18} />}
        <Heading id={titleId} className="bl-titlebar-title">
          {title}
        </Heading>
        {actions}
        <span className="bl-tbtn bl-tbtn-deco bl-hide-sm" aria-hidden="true">
          <MinusIcon size={12} weight="bold" />
        </span>
        <span className="bl-tbtn bl-tbtn-deco bl-hide-sm" aria-hidden="true">
          <SquareIcon size={11} weight="bold" />
        </span>
        {onClose ? (
          <button
            type="button"
            className="bl-tbtn bl-tbtn-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <XIcon size={13} weight="bold" />
          </button>
        ) : (
          <span className="bl-tbtn bl-tbtn-close bl-tbtn-deco" aria-hidden="true">
            <XIcon size={13} weight="bold" />
          </span>
        )}
      </div>
      <div
        className={`bl-window-body ${flush ? 'bl-window-body-flush' : ''} ${bodyClassName}`}
      >
        {children}
      </div>
      {status && <div className="bl-statusbar">{status}</div>}
    </Tag>
  );
};

export default BlissWindow;
