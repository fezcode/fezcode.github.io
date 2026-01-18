import React from 'react';

export default function PowerLaw() {
  return (
    <div className="space-y-4">
      <p>
        A <strong>Power Law</strong> is a functional relationship between two quantities, where a relative change in one quantity results in a proportional relative change in the other quantity, independent of the initial size of those quantities.
      </p>
      <p>
        In statistics, it often manifests as a <strong>Long-Tail Distribution</strong>, where a small number of events (the "head") occur with high frequency, while a large number of events (the "tail") occur with low frequency.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-yellow-400 mb-2">Key Characteristics:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
          <li>
            <strong>Scale Invariance:</strong> The distribution looks the same regardless of the scale at which you observe it.
          </li>
          <li>
            <strong>Pareto Principle (80/20 Rule):</strong> A common manifestation where 80% of effects come from 20% of causes.
          </li>
          <li>
            <strong>Lack of "Average":</strong> Unlike a Normal Distribution (Bell Curve), the "average" in a power law is often misleading as it's heavily skewed by extreme outliers.
          </li>
        </ul>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-green-400 mb-2">Real-World Examples:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
          <li><strong>Wealth Distribution:</strong> A small percentage of the population holds the majority of the wealth.</li>
          <li><strong>City Populations:</strong> A few mega-cities vs. thousands of small towns.</li>
          <li><strong>Word Frequency (Zipf's Law):</strong> The most common words in a language appear significantly more often than the rest.</li>
          <li><strong>Internet Traffic:</strong> A few websites (Google, YouTube) receive the vast majority of all traffic.</li>
        </ul>
      </div>
    </div>
  );
}
