import React, { useEffect, useRef, useState } from 'react';
import { useSnf } from '../../context/SnfContext';

const GLYPHS = '█▓▒░#@%&/\\<>=+*△○□01ABCDEFXYZ';

/**
 * Reveals a short string with a "decrypting" scramble.
 * Falls back to plain text when the `decrypt` setting is off or the user
 * prefers reduced motion. Intended for titles / labels, not long body copy.
 */
const SnfDecryptText = ({
  text = '',
  as: Tag = 'span',
  className = '',
  speedMs = 22,
  start = true,
  cursor = false,
  onDone,
}) => {
  const { settings, prefersReducedMotion } = useSnf();
  const enabled = settings.decrypt && !prefersReducedMotion && start;
  const [display, setDisplay] = useState(enabled ? '' : text);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled) {
      setDisplay(text);
      return undefined;
    }
    let revealed = 0;
    setDisplay('');
    const id = setInterval(() => {
      revealed += 1;
      if (revealed >= text.length) {
        setDisplay(text);
        clearInterval(id);
        onDoneRef.current?.();
        return;
      }
      const shown = text.slice(0, revealed);
      const scrambled = text
        .slice(revealed)
        .split('')
        .map((c) =>
          c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join('');
      setDisplay(shown + scrambled);
    }, speedMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled, speedMs]);

  return (
    <Tag className={`${className} ${cursor ? 'snf-cursor' : ''}`}>{display}</Tag>
  );
};

export default SnfDecryptText;
