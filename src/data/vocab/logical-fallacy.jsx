import React from 'react';

export default function LogicalFallacy() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Logical Fallacy</strong> is an error in reasoning that invalidates an argument. They are common pitfalls in debate and rhetoric, often used intentionally to manipulate or mislead.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "You're just a philosophy major, so your opinion on the economy is wrong." (Ad Hominem)
      </div>

      <p>Common types of fallacies include:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Ad Hominem:</strong> Attacking the person rather than the argument.
        </li>
        <li>
          <strong>Straw Man:</strong> Misrepresenting someone's argument to make it easier to attack.
        </li>
        <li>
          <strong>Post Hoc:</strong> Assuming correlation implies causation.
        </li>
        <li>
          <strong>False Dilemma:</strong> Presenting only two options when more exist.
        </li>
      </ul>
    </div>
  );
}
