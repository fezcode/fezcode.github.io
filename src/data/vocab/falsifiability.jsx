import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function Falsifiability() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Falsifiability</strong> is Karl
        Popper’s criterion for separating scientific claims from unscientific
        ones. A theory counts as scientific if it forbids something — if there
        exists an observation that, were you to make it, would refute the
        theory.
      </p>

      <div className="border-l-2 border-blue-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "A theory that explains everything explains nothing."
      </div>

      <p>
        From <em>The Logic of Scientific Discovery</em> (1934). Popper’s target
        was the confirmation habit: theories that could absorb any outcome as
        further proof of themselves. Einstein’s general relativity impressed him
        for the opposite reason — it predicted a specific deflection of starlight
        that the 1919 eclipse could have shown was wrong.
      </p>

      <p>Two things worth keeping straight:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Falsifiable ≠ false.</strong> It is a compliment about a
          claim’s structure, not a verdict on its truth.
        </li>
        <li>
          <strong>The Duhem–Quine problem.</strong> A failed prediction never
          refutes one hypothesis cleanly; it indicts the whole bundle of
          assumptions, instruments and auxiliary theories that produced it.
        </li>
      </ul>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink
            href="/vocab/inductive-reasoning"
            className="text-emerald-400 hover:underline"
          >
            Inductive Reasoning
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
