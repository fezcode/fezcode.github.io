import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Solipsism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Solipsism</strong> is the philosophical
        idea that only one's own mind is sure to exist. As an epistemological
        position, it holds that knowledge of anything outside one's own mind is
        unsure; the external world and other minds cannot be known and might not
        exist outside the mind.
      </p>

      <div className="border-l-2 border-indigo-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "I think, therefore I am... but I'm not so sure about you."
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink
            href="/vocab/epistemology"
            className="text-purple-400 hover:underline"
          >
            Epistemology
          </MarkdownLink>
        </div>
      </div>
    </div>
  );
}
