import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { normalizeTag } from '../utils/tagSlug.mjs';
import { tagPath } from '../utils/tagIndex';

/** Where a tag's filter page lives. Aliases resolve on the page itself. */
export const tagHref = (tag) => tagPath(normalizeTag(tag));

/**
 * A tag that opens its /tags/:tag page. Themes keep their own look: pass the
 * theme's existing tag className and children, only the element changes.
 *
 * Inside a card that is already a link, an <a> cannot nest; pass `nested` and
 * it renders a focusable span that navigates on click/Enter instead, without
 * also triggering the card.
 */
export default function TagLink({
  tag,
  className,
  children,
  nested = false,
  ...props
}) {
  const navigate = useNavigate();
  const to = tagHref(tag);
  if (!normalizeTag(tag))
    return (
      <span className={className} {...props}>
        {children ?? tag}
      </span>
    );
  if (nested) {
    const go = (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigate(to);
    };
    return (
      <span
        role="link"
        tabIndex={0}
        className={className}
        onClick={go}
        onKeyDown={(event) => {
          if (event.key === 'Enter') go(event);
        }}
        title={`More tagged ${tag}`}
        {...props}
      >
        {children ?? tag}
      </span>
    );
  }
  return (
    <Link to={to} className={className} title={`More tagged ${tag}`} {...props}>
      {children ?? tag}
    </Link>
  );
}
