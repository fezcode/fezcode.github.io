import React from 'react';

/**
 * The atlas prose marks names and key claims with emphasis. Carrying that
 * through the text files needs a markup that survives a plain-text round trip,
 * so `*bold*` and `_italic_` are the only two things recognised here — no
 * general markdown, no HTML, nothing that could inject markup from a data file.
 */
const TOKEN = /(\*[^*\n]+\*|_[^_\n]+_)/g;

export const renderInline = (text) =>
  String(text)
    .split(TOKEN)
    .filter((part) => part !== '')
    .map((part, i) => {
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i}>{part.slice(1, -1)}</strong>;
      }
      if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

/** A prose section: a labelled heading over one or more paragraphs. */
const RichText = ({ label, paragraphs }) => {
  if (!paragraphs || paragraphs.length === 0) return null;
  return (
    <section className="dm-prose">
      <h3 className="dm-section-title">{label}</h3>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{renderInline(paragraph)}</p>
      ))}
    </section>
  );
};

export default RichText;
