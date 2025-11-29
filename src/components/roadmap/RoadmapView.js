import React from 'react';
import RoadmapCard from './RoadmapCard';
import { getOnlyBgStatusColor, statusTextColor } from '../../utils/roadmapHelpers';

const RoadmapView = ({ issuesData = [] }) => {
  const groupedApps = issuesData.reduce((acc, app) => {
    const status = app.status || 'Planned'; // Default to Planned if not specified
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(app);
    return acc;
  }, {});

  const statusOrder = ['Planned', 'In Progress', 'Completed', 'On Hold'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusOrder.map((status) => (
        <div key={status} className="bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-800">
          <h3
            className={`text-lg font-mono tracking-wider mb-4 flex items-center gap-2 text-white`}
          >
            <span
              className={`w-3 h-3 rounded-full ${getOnlyBgStatusColor(status)} ${statusTextColor(status)}`}
            ></span>
            {status} ({groupedApps[status]?.length || 0})
          </h3>
          <div className="space-y-4">
            {groupedApps[status]?.map((app, appIndex) => (
              <RoadmapCard key={app.id} app={app} index={appIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapView;
