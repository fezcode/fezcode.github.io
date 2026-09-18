import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function HanlonsRazor() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Hanlon’s Razor</strong> says never to
        attribute to malice that which is adequately explained by incompetence.
        It is a prior about intent, useful because incompetence is vastly more
        common than conspiracy and far cheaper to check.
      </p>

      <div className="border-l-2 border-amber-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Never attribute to malice that which is adequately explained by
        stupidity."
      </div>

      <p>
        Attributed to Robert J. Hanlon, who submitted it to a 1980 joke
        collection, though Robert Heinlein wrote a near-identical line in 1941
        and Goethe made the same observation in 1774. The load-bearing word is{' '}
        <strong className="text-current">adequately</strong>: the razor only
        applies while incompetence actually covers the facts.
      </p>

      <p>
        Its failure mode is institutional. Repeated, one-directional
        "incompetence" that always profits the same party is not adequately
        explained by incompetence, and{' '}
        <strong className="text-current">Grey’s Law</strong> — sufficiently
        advanced incompetence is indistinguishable from malice — exists to say
        so.
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink
            href="/vocab/occams-razor"
            className="text-emerald-400 hover:underline"
          >
            Occam’s Razor
          </MarkdownLink>
          <MarkdownLink
            href="/vocab/hitchens-razor"
            className="text-emerald-400 hover:underline"
          >
            Hitchens’s Razor
          </MarkdownLink>
        </div>
      </div>
    </div>
  );
}
