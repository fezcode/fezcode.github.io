import React from 'react';

export default function Existentialism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Existentialism</strong> is a
        philosophical movement that emphasizes individual existence, freedom,
        and choice.
      </p>

      <div className="border-l-2 border-yellow-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Existence precedes Essence."
      </div>

      <p>
        This core maxim by Jean-Paul Sartre means we are born first (exist), and
        then we define who we are (essence) through our actions. We have no
        pre-determined purpose (like a paperknife does). We are condemned to be
        free.
      </p>
    </div>
  );
}
