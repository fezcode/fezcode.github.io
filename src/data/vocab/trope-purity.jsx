import React from 'react';

export default function TropePurity() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Trope Purity</strong> refers to the degree to which a character or narrative element adheres to a specific, unadulterated archetype or "trope" without the "contamination" of human complexity, moral growth, or psychological realism.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Complexity is the enemy of comedy; purity is its fuel."
      </div>

      <p>In the context of sitcoms and long-running series, Trope Purity often manifests in three distinct forms:</p>

      <ul className="space-y-4 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Static Purity:</strong> The character is immune to the "Success Requirement" of protagonists. They never learn, never grow, and never change. This allows them to remain funny indefinitely because they never resolve the conflict that makes them interesting.
          <br /><em className="block mt-1 opacity-60">Examples: Peter Griffin (Post-Season 4), The Joker, Rick Sanchez (at his most toxic).</em>
        </li>
        <li>
          <strong>Archetypal Purity:</strong> The character is a distilled concentrate of a single human flaw or trait. They don't have hobbies or "off-screen lives" that don't serve the trope.
          <br /><em className="block mt-1 opacity-60">Examples: Gunther (Pure Pining), Creed Bratton (Pure Chaos), Jean-Ralphio Saperstein (Pure Garbage).</em>
        </li>
        <li>
          <strong>Narrative Purity:</strong> When a plot follows "Genre Logic" over "Real-World Logic." In a sitcom, this means the status quo must be restored by the end of the 22nd minute, maintaining the purity of the setup.
        </li>
      </ul>

      <p>The Detective's Log of Purity Suspects:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] uppercase tracking-wider opacity-90">
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>Suspect:</strong> The Waitress (Always Sunny)<br />
          <strong>Trope:</strong> The Unattainable/The Ruined Life
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>Suspect:</strong> Hans Moleman (Simpsons)<br />
          <strong>Trope:</strong> Cosmic Bad Luck
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>Suspect:</strong> Leon Black (Curb Your Enthusiasm)<br />
          <strong>Trope:</strong> The Professional House Guest
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>Suspect:</strong> Newman (Seinfeld)<br />
          <strong>Trope:</strong> The Pure Antagonist
        </div>
      </div>

      <p className="text-xs italic opacity-70">
        Note: High Trope Purity is usually why side characters "steal" the show from protagonists, who are weighed down by the need to be "real" people.
      </p>
    </div>
  );
}
