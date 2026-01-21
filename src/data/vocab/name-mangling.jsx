import React from 'react';

export default function NameMangling() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Name Mangling</strong> (or name decoration) is a technique used by compilers to resolve unique names for programming entities (like functions, structure members, or variables) in modern programming languages.
      </p>
      <p>
        It provides a way to encode additional information about the name—such as the function's parameter types or scope—directly into the symbol name used by the linker. This is essential for supporting features like function overloading or namespacing, especially in languages like C++.
      </p>

      <div className="border-l-2 border-yellow-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">
          Example (C++)
        </h4>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
          Two functions with the same name but different arguments:
        </p>
        <code className="block bg-black border border-white/10 p-3 text-xs text-green-400 mb-4">
          int foo(int i);<br/>
          int foo(char c);
        </code>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
          Might be "mangled" by the compiler into unique symbols like:
        </p>
        <code className="block bg-black border border-white/10 p-3 text-xs text-blue-400">
          _Z3fooi  // for foo(int)<br/>
          _Z3fooc  // for foo(char)
        </code>
      </div>
    </div>
  );
}
