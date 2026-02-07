import React from 'react';
import { YoutubeLogoIcon } from '@phosphor-icons/react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Vibrato() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Vibrato</strong> is a musical effect consisting of a regular, pulsating change of pitch. It is used to add expression and warmth to vocal and instrumental music.
      </p>

      <div className="border-l-2 border-purple-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Frequency modulation (FM) - The pitch goes up and down."
      </div>

      <p>
        In string instruments, it is produced by rocking the finger back and forth on the string. In singing, it is a natural fluctuation of the voice.
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          <span>See also:</span>
          <MarkdownLink href="/vocab/tremolo" className="text-cyan-400 hover:underline" width={600}>Tremolo</MarkdownLink>
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
