import React from 'react';

export default function LinguaFranca() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-white">Lingua Franca</strong> (literally "Frankish language") is a
        language or way of communicating which is used between people who do not
        speak each other's native language.
      </p>
      <p>
        In modern contexts, it often refers to a common language that is
        adopted as a bridge for communication across different linguistic
        groups.
      </p>
      <div className="border-l-2 border-blue-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Examples</h4>
        <ul className="space-y-3 text-xs">
          <li className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wide">English</span>
            <span className="text-gray-400">The global lingua franca of science, aviation, and the internet.</span>
          </li>
          <li className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wide">Latin</span>
            <span className="text-gray-400">The lingua franca of scholars and the Catholic Church in Europe for centuries.</span>
          </li>
          <li className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wide">Swahili</span>
            <span className="text-gray-400">A major lingua franca in East Africa.</span>
          </li>
          <li className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wide">JavaScript</span>
            <span className="text-gray-400">Often called the lingua franca of the web.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
