import React from 'react';

export default function MSG() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">MSG (Monosodium Glutamate)</strong> is a simple sodium salt of glutamic acid, an amino acid found naturally in foods like tomatoes and parmesan cheese. In the kitchen, it's used as a seasoning to provide a savory, "umami" punch.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "A little bit of MSG makes a good dish great, but too much makes it all you can taste."
      </div>

      <p>When we talk about MSG in the context of characters or media, we’re talking about **Flavor Enhancers**: elements that don't provide the "substance" of a story, but make the experience much more enjoyable.</p>

      <ul className="space-y-4 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>The Savory Side Character:</strong> These are characters like Kramer from *Seinfeld* or Creed from *The Office*. They don't have to deal with the heavy "nutritional" parts of the show—like romantic arcs or moral dilemmas—they just show up to deliver a high-impact moment and leave.
        </li>
        <li>
          <strong>The "Small Dose" Rule:</strong> Just like in cooking, you use MSG sparingly. If a show tries to make the "MSG character" the lead, it usually doesn't work. The flavor becomes overwhelming and you lose the balance of the meal.
        </li>
        <li>
          <strong>Instant Recognition:</strong> MSG works fast. You don't need a 20-minute backstory to understand why a funny side character is there; you recognize the "flavor" they bring to the scene immediately.
        </li>
      </ul>

      <p>The "Balanced Meal" of a Series:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] uppercase tracking-wider opacity-90">
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>The Protein:</strong> The Protagonist (The moral weight)
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>The Carbs:</strong> The Setting (The energy of the show)
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>The Fiber:</strong> The Conflict (The "necessary" struggle)
        </div>
        <div className="p-2 border border-current/20 bg-current/5">
          <strong>The MSG:</strong> The Side Characters (The pure fun)
        </div>
      </div>

      <p className="text-xs italic opacity-70">
        Basically: MSG is what makes you keep coming back for another bite, even if the "main course" (the plot) is just okay.
      </p>
    </div>
  );
}
