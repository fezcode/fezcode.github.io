import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function OccamsRazor() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Occam’s Razor</strong> is the principle
        that when two explanations account for the same observations, you should
        prefer the one that requires fewer assumed entities. It is a rule for
        choosing where to look first, not a proof that the simpler answer is
        true.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Pluralitas non est ponenda sine necessitate." — Plurality should not be
        posited without necessity.
      </div>

      <p>
        Named for William of Ockham, a 14th-century English friar, who never
        actually wrote the sentence most often attributed to him (
        <em>entia non sunt multiplicanda praeter necessitatem</em>, coined by
        John Punch in 1639). Ockham’s concern was ontological economy — how many
        kinds of thing you are obliged to believe exist — rather than the
        stylistic tidiness the razor is usually invoked for today.
      </p>

      <p>The two things it is routinely confused with:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Fewest entities ≠ shortest sentence.</strong> "A wizard did
          it" is a short explanation that posits an enormous new entity.
        </li>
        <li>
          <strong>It breaks ties, it does not settle them.</strong> Where the
          evidence already distinguishes two hypotheses, the razor has no work
          to do and no authority.
        </li>
      </ul>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink
            href="/vocab/hanlons-razor"
            className="text-emerald-400 hover:underline"
          >
            Hanlon’s Razor
          </MarkdownLink>
          <MarkdownLink
            href="/vocab/chestertons-fence"
            className="text-emerald-400 hover:underline"
          >
            Chesterton’s Fence
          </MarkdownLink>
        </div>
      </div>
    </div>
  );
}
