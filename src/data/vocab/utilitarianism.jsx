import React from 'react';

export default function Utilitarianism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Utilitarianism</strong> is an ethical
        theory that determines right from wrong by focusing on outcomes. It
        holds that the most ethical choice is the one that will produce the
        greatest good for the greatest number.
      </p>

      <div className="border-l-2 border-green-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Maximize utility (happiness/well-being), minimize suffering."
      </div>

      <p>
        Championed by Jeremy Bentham and John Stuart Mill. It is often
        contrasted with <strong>Deontology</strong> (duty-based ethics), which
        argues that some actions are inherently wrong regardless of their
        consequences.
      </p>
    </div>
  );
}
