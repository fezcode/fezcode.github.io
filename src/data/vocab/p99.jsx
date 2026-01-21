import React from 'react';

export default function P99() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">P99</strong> (or the 99th Percentile) is a statistical metric indicating the value below which 99% of the observations in a group of observations fall.
      </p>
      <p>
        In software engineering, it is widely used to measure <strong className="text-current">system latency</strong> and performance. If a system has a P99 response time of 500ms, it means that <strong className="text-current">99% of all requests</strong> are served in 500ms or less, while the remaining 1% (the outliers) take longer.
      </p>

      <div className="border border-white/10 p-6 my-6 bg-white/[0.02]">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Why not just use the Average?</h4>
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wide">
          Averages (Means) can be misleading because they hide extreme outliers.
        </p>
        <div className="space-y-4 text-xs text-gray-400">
          <div className="flex flex-col gap-1">
            <span className="text-current font-bold uppercase tracking-wider">Average</span>
            <span>If 9 users load in 1s and 1 user loads in 100s, the average is ~11s. This doesn't represent the typical user (1s) OR the worst case (100s).</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-current font-bold uppercase tracking-wider">P99</span>
            <span>Focuses on the "tail" latency—the worst experience that a significant chunk of your users might see. Optimizing for P99 ensures a consistent experience for everyone, not just the "lucky" ones.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
