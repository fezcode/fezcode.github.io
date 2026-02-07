import React from 'react';

export default function PowerLaw() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Power Law</strong> is a functional
        relationship between two quantities, where a relative change in one
        quantity results in a proportional relative change in the other
        quantity, independent of the initial size of those quantities.
      </p>
      <p>
        In statistics, it often manifests as a{' '}
        <strong className="text-current">Long-Tail Distribution</strong>, where
        a small number of events (the "head") occur with high frequency, while a
        large number of events (the "tail") occur with low frequency.
      </p>

      <div className="space-y-8 my-6">
        <div className="border border-emerald-500/20 p-4 bg-emerald-500/[0.02]">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
            The "Pizza Party" Analogy
          </h4>
          <p className="text-xs leading-relaxed opacity-80">
            Imagine a party with 100 people and 100 slices of pizza.
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">Normal:</span>
              <span className="opacity-70">
                Everyone gets exactly 1 slice. (Bell Curve)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">Power Law:</span>
              <span>
                1 person eats 80 slices, and the other 99 people have to share
                the remaining 20 slices.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-[10px] text-emerald-500/50 uppercase italic font-bold">
            {'//'} This is why the "average" (1 slice per person) is useless
            here.
          </p>
        </div>

        <div className="border-l-2 border-yellow-500/50 pl-4 py-1">
          <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3">
            Key Characteristics
          </h4>
          <ul className="space-y-3 text-xs opacity-90">
            <li>
              <strong className="text-current block mb-1">
                Scale Invariance
              </strong>
              The distribution looks the same regardless of the scale at which
              you observe it.
            </li>
            <li>
              <strong className="text-current block mb-1">
                Pareto Principle (80/20 Rule)
              </strong>
              A common manifestation where 80% of effects come from 20% of
              causes.
            </li>
            <li>
              <strong className="text-current block mb-1">
                Lack of "Average"
              </strong>
              Unlike a Normal Distribution (Bell Curve), the "average" in a
              power law is often misleading as it's heavily skewed by extreme
              outliers.
            </li>
          </ul>
        </div>

        <div className="border-l-2 border-green-500/50 pl-4 py-1">
          <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
            Real-World Examples
          </h4>
          <ul className="space-y-3 text-xs opacity-90">
            <li>
              <strong className="text-current">Wealth Distribution:</strong> A
              small percentage of the population holds the majority of the
              wealth.
            </li>
            <li>
              <strong className="text-current">City Populations:</strong> A few
              mega-cities vs. thousands of small towns.
            </li>
            <li>
              <strong className="text-current">
                Word Frequency (Zipf's Law):
              </strong>{' '}
              The most common words in a language appear significantly more
              often than the rest.
            </li>
            <li>
              <strong className="text-current">Internet Traffic:</strong> A few
              websites (Google, YouTube) receive the vast majority of all
              traffic.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
