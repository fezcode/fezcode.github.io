import React, { useMemo } from 'react';
import KilimCanvas from './KilimCanvas';
import { WOOL, HEAD } from './engine';
import { FONTS } from '../knit/fonts';
import { headingGrid } from './patterns';

/**
 * A woven heading. The real text stays in the DOM for screen readers, search
 * engines, copy and the prerendered page; the weave is decoration.
 *
 * Woven type is for headings and short titles only. Labels, meta, buttons
 * and body copy are set in Kilim UI (Jersey 15) / Bitter (see Kilim.css), because
 * small woven type does not survive the brick offset.
 *
 * edge: 'shadow' (section headings: a one-pip walnut drop shadow),
 * 'contour' (page titles: a full indigo outline) or 'none'.
 * scale: 2 is double gauge, every stroke two pips thick. fit: the canvas
 * hugs the text instead of filling (and wrapping within) the container.
 * size 'small' charts Knit's 3×5 font instead of the 5×7.
 */
const KilimText = ({
  text,
  as: Tag = 'span',
  scale = 2,
  size = 'big',
  fg = WOOL.ivory,
  edge = 'shadow',
  edgeColor,
  align = 'left',
  fit = false,
  maxLines,
  gauge = HEAD,
  animate = false,
  className = '',
  ...rest
}) => {
  const font = FONTS[size] || FONTS.big;
  const options = { text, fg, scale, edge, edgeColor, align, maxLines, font };
  const deps = [text, fg, scale, edge, edgeColor, align, maxLines, size];
  const fitted = useMemo(
    () => (fit ? headingGrid(options) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fit, ...deps],
  );
  return (
    <Tag className={`klm-text ${fit ? 'klm-text-fit' : ''} ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      <KilimCanvas
        gauge={gauge}
        seed={text}
        gap={-0.42}
        animate={animate}
        cols={fitted ? fitted.cols : undefined}
        build={(cols) => fitted || headingGrid({ ...options, maxCols: cols })}
        deps={[fitted, ...deps]}
      />
    </Tag>
  );
};

export default KilimText;
