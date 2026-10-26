import React, { useMemo } from 'react';
import KnitCanvas from './KnitCanvas';
import { YARN, GAUGE, FINE } from './engine';
import { FONTS } from './fonts';
import { textGrid } from './patterns';

/**
 * Text knitted into the fabric. The real text stays in the DOM for screen
 * readers, search engines and copy; the stitches are decoration.
 *
 * size: 'big' (5×7 chart) or 'small' (3×5). fit: the canvas hugs the text
 * instead of filling (and wrapping within) the container.
 */
const KnitText = ({
  text,
  as: Tag = 'span',
  size = 'big',
  scale = 1,
  fg = YARN.cream,
  bg = null,
  padX = 0,
  padY = 0,
  align = 'left',
  fit = false,
  maxLines,
  lineGap = 2,
  gauge = size === 'small' ? FINE : GAUGE,
  className = '',
  ...rest
}) => {
  const font = FONTS[size] || FONTS.big;
  const options = { text, font, scale, fg, bg, padX, padY, align, maxLines, lineGap };
  const deps = [text, size, scale, fg, bg, padX, padY, align, maxLines, lineGap];
  const fitted = useMemo(
    () => (fit ? textGrid(options) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fit, ...deps],
  );
  return (
    <Tag className={`knt-text ${fit ? 'knt-text-fit' : ''} ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      <KnitCanvas
        gauge={gauge}
        cols={fitted ? fitted.cols : undefined}
        build={(cols) => fitted || textGrid({ ...options, maxCols: cols })}
        deps={[fitted, ...deps]}
      />
    </Tag>
  );
};

export default KnitText;
