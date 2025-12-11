import React, { useState, useEffect } from 'react';
import RoadmapCard from './RoadmapCard';
import { getStatusClasses } from '../../utils/roadmapHelpers';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useAchievements } from '../../context/AchievementContext';

const RoadmapView = ({ issuesData = [] }) => {
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { unlockAchievement } = useAchievements();

  const statusOrder = ['Planned', 'In Progress', 'Completed', 'On Hold'];

  const toggleColumnVisibility = (status) => {
    if (hiddenColumns.includes(status)) {
      setHiddenColumns(hiddenColumns.filter((s) => s !== status)); // Show column
    } else {
      setHiddenColumns([...hiddenColumns, status]); // Hide column
    }
  };

  useEffect(() => {
    // Check if all status columns are hidden
    if (hiddenColumns.length === statusOrder.length) {
      unlockAchievement('hide_and_seek_master');
    }
  }, [hiddenColumns, statusOrder.length, unlockAchievement]);

  const groupIssues = issuesData.reduce((acc, app) => {
    const status = app.status || 'Planned'; // Default to Planned if not specified
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(app);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusOrder.map((status) => {
        const isHidden = hiddenColumns.includes(status);
        return (
          <div
            key={status}
            className="bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-800"
          >
            <h3 className={`mb-4 flex items-center justify-between`}>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-mono font-bold uppercase tracking-wider ${getStatusClasses(status)}`}
              >
                {status}
                <span className="opacity-70">
                  ({groupIssues[status]?.length || 0})
                </span>
              </span>
              <button
                onClick={() => toggleColumnVisibility(status)}
                className="text-gray-400 hover:text-white transition-colors"
                title={isHidden ? 'Show column' : 'Hide column'}
              >
                {isHidden ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </h3>
            {!isHidden && (
              <div className="space-y-4">
                {groupIssues[status]?.map((app, appIndex) => (
                  <RoadmapCard key={app.id} app={app} index={appIndex} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoadmapView;
