import React from 'react';

export default function Pluribus() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-white">Pluribus</strong> is Latin for "from many" or "more". It is most
        famously known as part of the United States motto{' '}
        <em className="text-white not-italic">E pluribus unum</em> ("Out of many, one").
      </p>
      <p>
        Thematically, it represents the concept of{' '}
        <strong className="text-white">unity from diversity</strong>.
      </p>
      <div className="border border-white/10 bg-white/[0.02] p-4 text-xs text-gray-400">
        <p>
          In the context of sci-fi or hive-mind narratives, "Pluribus" often
          ironically contrasts the loss of individual identity against the
          strength of the collective.
        </p>
      </div>
    </div>
  );
}
