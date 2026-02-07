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
            className="bg-white/[0.02] border border-white/10 p-6 rounded-sm space-y-8"
          >
            <h3
              className={`flex items-center justify-between border-b border-white/5 pb-4`}
            >
              <span
                className={`inline-flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.2em] ${getStatusClasses(status)}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status}
                <span className="text-gray-600 font-normal">
                  [{groupIssues[status]?.length || 0}]
                </span>
              </span>
              <button
                onClick={() => toggleColumnVisibility(status)}
                className="text-gray-700 hover:text-white transition-colors"
                title={isHidden ? 'Show column' : 'Hide column'}
              >
                {isHidden ? (
                  <EyeSlashIcon size={16} weight="bold" />
                ) : (
                  <EyeIcon size={16} weight="bold" />
                )}
              </button>
            </h3>
            {!isHidden && (
              <div className="space-y-6">
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
