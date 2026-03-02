import React from 'react';

export default function BaaderMeinhof() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-current">Baader-Meinhof Phenomenon</strong>, also known as the Frequency Illusion, occurs when something you've just noticed, experienced, or been told about suddenly seems to crop up everywhere.
      </p>

      <p>
        It is a cognitive bias caused by two processes: <em>selective attention</em> (your brain subconsciously looking out for the new information) and <em>confirmation bias</em> (reassuring you that each sighting is proof that the thing has gained overnight ubiquity).
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
          Why "Baader-Meinhof"?
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          The name was coined in 1994 by a commenter on a St. Paul Pioneer Press discussion board, who had recently learned about the 1970s West German militant group, the Baader-Meinhof Gang, and then suddenly started hearing about them everywhere. The scientific term for it is the <strong>Frequency Illusion</strong>.
        </p>
      </div>
    </div>
  );
}