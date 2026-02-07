import React from 'react';

export default function Regex() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Regular Expressions (RegEx)</strong> are patterns used to match character combinations in strings.
        They are effectively a small, highly specialized programming language for text processing.
      </p>

      <p>
        While incredibly powerful for validation, searching, and extraction, they are notorious for their
        cryptic syntax and the potential for "catastrophic backtracking" if poorly designed.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
          The Regex Mantra
        </h4>
        <p className="text-xs italic text-gray-400">
          "Some people, when confronted with a problem, think 'I know, I'll use regular expressions.'
          Now they have two problems." — Jamie Zawinski
        </p>
      </div>

      <div className="bg-white/5 p-4 rounded-sm border border-white/10">
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
          Anatomy of a Disaster
        </h4>
        <code className="text-pink-400 block break-all">
          /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,6&#125;)$/
        </code>
        <p className="text-[10px] text-gray-500 mt-2">
          (A standard email validation regex. It works until it doesn't.)
        </p>
      </div>
    </div>
  );
}
