import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function ChestertonsFence() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Chesterton’s Fence</strong> is the rule
        that you should not remove something whose purpose you do not understand
        — not because old things are sacred, but because your ignorance of the
        reason is evidence about you, not about the fence.
      </p>

      <div className="border-l-2 border-purple-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Go away and think. Then, when you can come back and tell me that you do
        see the use of it, I may allow you to destroy it."
      </div>

      <p>
        G. K. Chesterton, <em>The Thing</em> (1929). It is an{' '}
        <strong className="text-current">anti-razor</strong>: where most razors
        license you to cut, this one withholds the license until you have gone
        and looked. In software it is the argument against deleting the
        uncommented sleep, the redundant check, the ugly special case.
      </p>

      <p>
        The abuse is the pause. Chesterton asks you to{' '}
        <em>find out why the fence is there</em>, which is a bounded piece of
        work. Quoted by whoever benefits from the fence, it becomes a permanent
        veto: nobody is ever quite certain enough, so nothing is ever removed.
        "I do not know why this exists" is a research task, not a verdict.
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
            href="/vocab/anti-pattern"
            className="text-emerald-400 hover:underline"
          >
            Anti-Pattern
          </MarkdownLink>
        </div>
      </div>
    </div>
  );
}
