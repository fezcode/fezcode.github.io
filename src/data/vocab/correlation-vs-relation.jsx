import React from 'react';

export default function CorrelationVsRelation() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Relation</strong> is a broad term for any connection. <strong className="text-current">Correlation</strong> is a highly specific, mathematical connection where variables fluctuate together in a synchronized pattern.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "All correlations are relations, but not all relations are correlations."
      </div>

      <p>The key differences:</p>
      <ul className="space-y-4 text-xs opacity-80 list-none pl-0">
        <li className="pl-4 border-l border-white/10">
          <strong className="text-emerald-400 block mb-1">1. Measurement (The Coefficient)</strong>
          Correlation is quantifiable. We use a "correlation coefficient" (a number between -1 and 1) to prove exactly how strongly two things are linked. A relation is qualitative; you can't put a number on the "relation" between a dog and a bone.
        </li>
        <li className="pl-4 border-l border-white/10">
          <strong className="text-emerald-400 block mb-1">2. Directionality</strong>
          Correlation implies a directional movement:
          <br/>• <em>Positive:</em> As A goes up, B goes up (Height and Shoe Size).
          <br/>• <em>Negative:</em> As A goes up, B goes down.
          <br/>• <em>Zero:</em> The variables move completely independently.
          <br/>A relation just implies a link. (e.g., Typing the right password is related to your PC unlocking, but you can't say "the more I type it, the more it unlocks").
        </li>
        <li className="pl-4 border-l border-white/10">
          <strong className="text-emerald-400 block mb-1">3. The Causation Trap</strong>
          Neither inherently proves causation. Just because ice cream sales and shark attacks are highly correlated (they both spike in July), doesn't mean eating ice cream attracts sharks. (The hidden variable is summer heat).
        </li>
      </ul>
    </div>
  );
}
