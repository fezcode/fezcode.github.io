import React from 'react';

export default function Ontology() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Ontology</strong> is the branch of metaphysics dealing with the nature of being. It focuses on the categories of being and their relations.
      </p>

      <div className="border-l-2 border-red-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "What does it mean for something to 'exist'? Do numbers exist? Do holes exist?"
      </div>

      <p>
        In computer science, an ontology is a data model that represents a set of concepts within a domain and the relationships between those concepts (like the Fezcodex Knowledge Graph).
      </p>
    </div>
  );
}
