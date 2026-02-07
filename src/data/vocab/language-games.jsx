import React from 'react';

export default function LanguageGames() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Language Games</strong> is a concept by
        Ludwig Wittgenstein. He argued that language doesn't have a fixed,
        essential meaning.
      </p>

      <div className="border-l-2 border-green-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "The meaning of a word is its use in the language."
      </div>

      <p>
        Words function like pieces in a game (chess, soccer). Their meaning
        depends on the rules of the specific "game" (context) being played. You
        can't understand a word by looking it up in a dictionary; you have to
        look at how it is *used* in a specific form of life.
      </p>
    </div>
  );
}
