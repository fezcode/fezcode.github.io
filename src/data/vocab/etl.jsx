import React from 'react';

export default function ETL() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">ETL (Extract, Transform, Load)</strong>{' '}
        is a data integration process that combines data from multiple sources
        into a single, consistent data store that is loaded into a data
        warehouse or other target system.
      </p>

      <div className="bg-black p-4 border border-white/10 font-mono text-xs my-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="border-l-2 border-pink-500 pl-3">
            <div className="text-pink-500 font-bold mb-1">1. EXTRACT</div>
            <div className="text-gray-400">
              Pull raw data from various sources (SQL, APIs, Logs, CSVs).
            </div>
          </div>

          <div className="border-l-2 border-purple-500 pl-3">
            <div className="text-purple-500 font-bold mb-1">2. TRANSFORM</div>
            <div className="text-gray-400">
              Clean, validate, and convert format (filtering, joins, sorting).
            </div>
          </div>

          <div className="border-l-2 border-emerald-500 pl-3">
            <div className="text-emerald-500 font-bold mb-1">3. LOAD</div>
            <div className="text-gray-400">
              Write processed data to destination (Data Warehouse, Data Lake).
            </div>
          </div>
        </div>
      </div>

      <p>
        In modern software engineering, ETL pipelines are crucial for analytics,
        business intelligence, and migrating legacy systems. They ensure data
        integrity and make raw information actionable.
      </p>

      <div className="border-l-2 border-white/20 pl-4 py-1">
        <strong className="text-rose-600 uppercase tracking-widest text-xs block mb-2">
          Common Tools
        </strong>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white/5 px-2 py-1 text-xs text-rose-600">
            Apache Airflow
          </span>
          <span className="bg-white/5 px-2 py-1 text-xs text-rose-600">
            Talend
          </span>
          <span className="bg-white/5 px-2 py-1 text-xs text-rose-600">
            AWS Glue
          </span>
          <span className="bg-white/5 px-2 py-1 text-xs text-rose-600">
            Pandas
          </span>
        </div>
      </div>
    </div>
  );
}
