import React from 'react';

export default function P99() {
  return (
    <div className="space-y-4">
      <p>
        <strong>P99</strong> (or the 99th Percentile) is a statistical metric indicating the value below which 99% of the observations in a group of observations fall.
      </p>
      <p>
        In software engineering, it is widely used to measure <strong>system latency</strong> and performance. If a system has a P99 response time of 500ms, it means that <strong>99% of all requests</strong> are served in 500ms or less, while the remaining 1% (the outliers) take longer.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-purple-400 mb-2">Why not just use the Average?</h4>
        <p className="text-sm text-gray-400 mb-3">
          Averages (Means) can be misleading because they hide extreme outliers.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
          <li>
            <strong>Average:</strong> If 9 users load in 1s and 1 user loads in 100s, the average is ~11s. This doesn't represent the typical user (1s) OR the worst case (100s).
          </li>
          <li>
            <strong>P99:</strong> Focuses on the "tail" latency—the worst experience that a significant chunk of your users might see. Optimizing for P99 ensures a consistent experience for everyone, not just the "lucky" ones.
          </li>
        </ul>
      </div>
    </div>
  );
}
