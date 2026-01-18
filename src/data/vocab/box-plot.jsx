import React from 'react';

export default function BoxPlot() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-white">Box Plot</strong> (or box-and-whisker plot) is a standardized way of displaying the distribution of data based on a five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum.
      </p>

      {/* Box Plot Diagram */}
      <div className="py-8 border-y border-white/5 my-8">
        <svg viewBox="0 0 400 140" className="w-full h-auto font-mono text-[10px]">
          {/* Main Range Line (Whiskers) */}
          <line x1="50" y1="70" x2="350" y2="70" stroke="#525252" strokeWidth="2" />

          {/* Whisker Ends (Min/Max) */}
          <line x1="50" y1="55" x2="50" y2="85" stroke="#525252" strokeWidth="2" />
          <text x="50" y="100" fill="#737373" textAnchor="middle">Min</text>

          <line x1="350" y1="55" x2="350" y2="85" stroke="#525252" strokeWidth="2" />
          <text x="350" y="100" fill="#737373" textAnchor="middle">Max</text>

          {/* The Box (IQR) - Green to match text */}
          <rect x="120" y="40" width="160" height="60" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" />
          <text x="200" y="30" fill="#10b981" textAnchor="middle" className="uppercase tracking-widest font-bold">IQR (Q1-Q3)</text>

          {/* Median Line - Blue to match text */}
          <line x1="180" y1="40" x2="180" y2="100" stroke="#3b82f6" strokeWidth="3" />
          <text x="180" y="120" fill="#3b82f6" textAnchor="middle" className="uppercase tracking-widest font-bold">Median</text>

          {/* Outliers - Red to match text */}
          <circle cx="20" cy="70" r="3" fill="#f87171" />
          <circle cx="380" cy="70" r="3" fill="#f87171" />
          <text x="20" y="100" fill="#f87171" textAnchor="middle">Outlier</text>
        </svg>
      </div>

      <div className="grid gap-6 my-8">
        <div className="border-l-2 border-blue-500/50 pl-4">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Median (Q2)</h4>
          <p className="text-xs text-gray-400">
            The middle value of the dataset. It splits the data into two equal halves. In a box plot, this is represented by the line inside the box.
          </p>
        </div>
        <div className="border-l-2 border-green-500/50 pl-4">
          <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Interquartile Range (IQR)</h4>
          <p className="text-xs text-gray-400">
            The distance between the first quartile (25th percentile) and the third quartile (75th percentile). It represents the "middle 50%" of the data and is shown as the height/width of the box itself.
          </p>
        </div>
        <div className="border-l-2 border-red-500/50 pl-4">
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Outliers</h4>
          <p className="text-xs text-gray-400">
            Data points that fall significantly outside the range of the rest of the data. Usually defined as points further than 1.5 × IQR from the edges of the box. They are typically plotted as individual dots beyond the whiskers.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 border border-white/10 p-4 uppercase tracking-wide">
        Box plots are exceptionally useful for comparing distributions between several groups at once, highlighting differences in spread and central tendency.
      </p>
    </div>
  );
}
