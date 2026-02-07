import React from 'react';

export default function CogitoErgoSum() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Cogito, ergo sum</strong> is a Latin
        philosophical proposition by René Descartes, usually translated into
        English as "I think, therefore I am."
      </p>

      <div className="border-l-2 border-cyan-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "I can doubt everything, even my own body, but I cannot doubt that I am
        doubting."
      </div>

      <p>
        It is the "first principle" of Descartes' philosophy. He sought a
        foundational truth that could not be doubted, serving as a bedrock for
        all other knowledge.
      </p>
    </div>
  );
}
