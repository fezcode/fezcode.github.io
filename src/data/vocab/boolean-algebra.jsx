import React from 'react';

export default function BooleanAlgebra() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Boolean Algebra</strong> is the branch of algebra in which the values of the variables are the truth values: true and false, usually denoted 1 and 0.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        1 AND 1 = 1 <br/>
        1 AND 0 = 0 <br/>
        1 OR 0 = 1
      </div>

      <p>Developed by George Boole in the 19th century, it uses basic operations:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>AND (Conjunction):</strong> Returns true only if both operands are true.
        </li>
        <li>
          <strong>OR (Disjunction):</strong> Returns true if at least one operand is true.
        </li>
        <li>
          <strong>NOT (Negation):</strong> Inverts the truth value.
        </li>
      </ul>
      <p>
        It is the foundational logic system that underlies all digital circuits and modern computing.
      </p>
    </div>
  );
}
