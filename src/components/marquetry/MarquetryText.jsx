import React from 'react';

// Native text preserves selection, browser search, Unicode and accessible names.
// Display headings use walnut veneer clipped to the actual letterforms.
export default function MarquetryText({
  text,
  children,
  as: Tag = 'span',
  size = 'big',
  scale = 1,
  fg,
  align,
  fit = false,
  maxLines,
  bg,
  padX,
  padY,
  className = '',
  style,
  ...props
}) {
  return (
    <Tag
      {...props}
      className={`mqt-text ${size === 'small' ? 'mqt-text-small' : 'mqt-text-display'} ${fit ? 'mqt-text-fit' : ''} ${maxLines ? 'mqt-text-clamp' : ''} ${className}`}
      style={{
        '--mqt-text-scale': scale,
        '--mqt-text-lines': maxLines,
        color: fg,
        textAlign: align,
        backgroundColor: bg || undefined,
        paddingInline: padX,
        paddingBlock: padY,
        ...style,
      }}
    >
      {text ?? children}
    </Tag>
  );
}
