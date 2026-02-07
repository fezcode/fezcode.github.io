import React from 'react';
import { YoutubeLogoIcon } from '@phosphor-icons/react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Legato() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Legato</strong> is a form of musical articulation. In modern notation, it indicates that musical notes are played or sung smoothly and connected.
      </p>

      <div className="border-l-2 border-blue-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Tied together, smooth, and flowing."
      </div>

      <p>
        It is often indicated with a slur (a curved line) over or under the notes that are to be joined.
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          <span>See also:</span>
          <MarkdownLink href="/vocab/staccato" className="text-orange-400 hover:underline" width={600}>Staccato</MarkdownLink>
        </div>

        <a
          href="https://www.youtube.com/watch?v=ikppWbkG5TQ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <YoutubeLogoIcon size={16} weight="fill" />
          <span>Visualizing Staccato vs Legato</span>
        </a>
      </div>
    </div>
  );
}
