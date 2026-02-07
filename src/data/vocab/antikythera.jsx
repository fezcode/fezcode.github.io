import React from 'react';
import { YoutubeLogoIcon } from '@phosphor-icons/react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Antikythera() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-current">Antikythera Mechanism</strong> is an ancient Greek hand-powered analog computer. Found in a shipwreck in 1901, it is the oldest known example of a complex scientific calculator.
      </p>

      <div className="border-l-2 border-amber-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "A 2,000-year-old leap in computational history."
      </div>

      <p>
        The device used a complex system of over 30 bronze gears to track the cycles of the Solar System, predict eclipses, and even mark the four-year cycle of the ancient Olympic Games. Its level of mechanical sophistication was not seen again in history for another thousand years.
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink href="/vocab/power-law" className="text-emerald-400 hover:underline">Power Law</MarkdownLink>
        </div>

        <a
          href="https://www.youtube.com/watch?v=UpLcnAIpVRA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <YoutubeLogoIcon size={16} weight="fill" />
          <span>Reconstructing the Antikythera Mechanism (Clickspring)</span>
        </a>
      </div>
    </div>
  );
}
