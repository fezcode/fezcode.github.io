import React from 'react';

export default function NameMangling() {
  return (
    <div className="space-y-4">
      <p>
        <strong>Name Mangling</strong> (or name decoration) is a technique used by compilers to resolve unique names for programming entities (like functions, structure members, or variables) in modern programming languages.
      </p>
      <p>
        It provides a way to encode additional information about the name—such as the function's parameter types or scope—directly into the symbol name used by the linker. This is essential for supporting features like function overloading or namespacing, especially in languages like C++.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-yellow-400 mb-2">
          Example (C++):
        </h4>
        <p className="text-sm text-gray-400 mb-2">
          Two functions with the same name but different arguments:
        </p>
        <code className="block bg-black p-2 rounded text-xs text-green-400 mb-2">
          int foo(int i);<br/>
          int foo(char c);
        </code>
        <p className="text-sm text-gray-400 mb-2">
          Might be "mangled" by the compiler into unique symbols like:
        </p>
        <code className="block bg-black p-2 rounded text-xs text-blue-400">
          _Z3fooi  // for foo(int)<br/>
          _Z3fooc  // for foo(char)
        </code>
      </div>
    </div>
  );
}
