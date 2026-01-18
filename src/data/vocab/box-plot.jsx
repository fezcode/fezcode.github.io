import React from 'react';

export default function BoxPlot() {
  return (
    <div className="space-y-4">
      <p>
        A <strong>Box Plot</strong> (or box-and-whisker plot) is a standardized way of displaying the distribution of data based on a five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-blue-400">Median (Q2)</h4>
          <p className="text-sm text-gray-400">
            The middle value of the dataset. It splits the data into two equal halves. In a box plot, this is represented by the line inside the box.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-green-400">Interquartile Range (IQR)</h4>
          <p className="text-sm text-gray-400">
            The distance between the first quartile (25th percentile) and the third quartile (75th percentile). It represents the "middle 50%" of the data and is shown as the height/width of the box itself.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-400">Outliers</h4>
          <p className="text-sm text-gray-400">
            Data points that fall significantly outside the range of the rest of the data. Usually defined as points further than 1.5 × IQR from the edges of the box. They are typically plotted as individual dots beyond the whiskers.
          </p>
        </div>
      </div>
      <p className="text-sm italic text-gray-500">
        Box plots are exceptionally useful for comparing distributions between several groups at once, highlighting differences in spread and central tendency.
      </p>
    </div>
  );
}
