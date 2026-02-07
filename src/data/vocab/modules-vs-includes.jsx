import React from 'react';

export default function ModulesVsIncludes() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Modules</strong> are independent units
        of code with explicit interfaces (exports/imports). When imported, the
        compiler loads a semantic representation of the code, ensuring
        encapsulation and faster builds.
      </p>

      <div className="border-l-2 border-blue-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
          The C Approach (Includes)
        </h4>
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">
          C lacks modules and relies on the{' '}
          <strong className="text-current">Preprocessor</strong>.
        </p>
        <ul className="space-y-3 text-xs text-gray-400">
          <li>
            <strong className="text-current block mb-1">
              Textual Copy-Paste
            </strong>
            <code className="text-pink-400">#include "header.h"</code> literally
            copies the file's text into your source file.
          </li>
          <li>
            <strong className="text-current block mb-1">
              Translation Unit
            </strong>
            The Source file + all copied Headers = one massive unit of code to
            be compiled.
          </li>
          <li>
            <strong className="text-current block mb-1">Object Files</strong>
            The compiler turns this unit into an Object File (`.o`).
          </li>
          <li>
            <strong className="text-current block mb-1">Linking</strong>
            The Linker stitches these object files together to make the
            executable.
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-500 border border-white/10 p-4 uppercase tracking-wide">
        This "copy-paste" model is why C builds can be slow (headers are
        re-parsed every time) and why "include guards" are needed to prevent
        infinite loops.
      </p>
    </div>
  );
}
