import React from 'react';
import { YoutubeLogoIcon } from '@phosphor-icons/react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Tremolo() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Tremolo</strong> describes two main effects: a rapid reiteration of a single note (classical/acoustic) or a rapid variation in volume (electronic/audio).
      </p>

      <div className="border-l-2 border-cyan-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Amplitude modulation (AM) - The volume goes loud and soft."
      </div>

      <p>
        Often confused with vibrato, especially in the context of guitar "tremolo arms" (which actually produce vibrato) and "vibrato channels" on amplifiers (which actually produce tremolo).
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          <span>See also:</span>
          <MarkdownLink href="/vocab/vibrato" className="text-purple-400 hover:underline" width={600}>Vibrato</MarkdownLink>
        </div>
        <a
          href="https://www.youtube.com/watch?v=PQkLPa1O3os"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <YoutubeLogoIcon size={16} weight="fill" />
          <span>Vibrato vs. Tremolo Explained</span>
        </a>
      </div>
    </div>
  );
}
