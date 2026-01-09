import React from 'react';

export default function ModulesVsIncludes() {
  return (
    <div className="space-y-4">
      <p>
        <strong>Modules</strong> are independent units of code with explicit interfaces (exports/imports). When imported, the compiler loads a semantic representation of the code, ensuring encapsulation and faster builds.
      </p>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-blue-400 mb-2">
          The C Approach (Includes):
        </h4>
        <p className="text-sm text-gray-300 mb-3">
          C lacks modules and relies on the <strong>Preprocessor</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
          <li>
            <strong className="text-white">Textual Copy-Paste:</strong> <code className="text-pink-400">#include "header.h"</code> literally copies the file's text into your source file.
          </li>
          <li>
            <strong className="text-white">Translation Unit:</strong> The Source file + all copied Headers = one massive unit of code to be compiled.
          </li>
          <li>
            <strong className="text-white">Object Files:</strong> The compiler turns this unit into an Object File (`.o`).
          </li>
          <li>
            <strong className="text-white">Linking:</strong> The Linker stitches these object files together to make the executable.
          </li>
        </ul>
      </div>

      <p className="text-sm italic text-gray-500">
        This "copy-paste" model is why C builds can be slow (headers are re-parsed every time) and why "include guards" are needed to prevent infinite loops.
      </p>
    </div>
  );
}
