import React from 'react';

export default function Premise() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Premise</strong> is a statement or proposition that provides the foundation or evidence from which a conclusion is drawn in a logical argument.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "All planets in our solar system orbit the sun." (A premise used to support a conclusion about Earth.)
      </div>

      <p>Key aspects of premises:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Foundation:</strong> They are the building blocks of an argument. If the premises are false, the argument is unsound (even if it's logically valid).
        </li>
        <li>
          <strong>Assumptions:</strong> In some arguments, premises are stated outright; in others, they may be implicit or assumed (enthymemes).
        </li>
        <li>
          <strong>Role in Deductive Logic:</strong> In a standard syllogism, there is typically a "major premise" (a general rule) and a "minor premise" (a specific instance).
        </li>
      </ul>
    </div>
  );
}
