import React from 'react';

export default function Million() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Million</strong> is, quite literally,
        a "big thousand." The word descends from the Italian <em>milione</em> —{' '}
        <em>mille</em> ("thousand") fused with the augmentative suffix{' '}
        <em>-one</em>, the same ending that turns a <em>minestra</em> (soup)
        into a hearty <em>minestrone</em>. A million is simply a thousand made
        enormous.
      </p>

      <div className="border-l-2 border-sky-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "A thousand thousands, packed into a single word."
      </div>

      <p>
        Before the merchants of the late Middle Ages needed to reckon such sums,
        English had no name for it — you simply said "a thousand thousand." The
        term arrived in the 14th century alongside the spread of Hindu-Arabic
        numerals and double-entry bookkeeping: new arithmetic demanding new
        vocabulary.
      </p>
    </div>
  );
}
