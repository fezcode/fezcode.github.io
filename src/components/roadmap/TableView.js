import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../CustomDropdown';
import { FunnelIcon } from '@phosphor-icons/react';
import { getStatusClasses, getPriorityClasses } from '../../utils/roadmapHelpers';

const TableView = ({ issuesData = [] }) => {
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredApps = issuesData.filter((app) =>
    filterStatus === 'All' ? true : (app.status || 'Planned') === filterStatus,
  );

  const sortedApps = [...filteredApps].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'status') {
      const statusOrder = ['Planned', 'In Progress', 'On Hold', 'Completed'];
      comparison =
        statusOrder.indexOf(a.status || 'Planned') -
        statusOrder.indexOf(b.status || 'Planned');
    } else if (sortBy === 'created_at') {
      comparison = new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'priority') {
      const priorityOrder = ['High', 'Medium', 'Low'];
      comparison =
        priorityOrder.indexOf(a.priority || 'Low') -
        priorityOrder.indexOf(b.priority || 'Low');
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const renderSortArrow = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-900/70 backdrop-blur-sm border border-gray-800">
      <div className="mb-4 mt-4 flex justify-center items-center">
        <CustomDropdown
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Planned', value: 'Planned' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'On Hold', value: 'On Hold' },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          icon={FunnelIcon}
          label="Filter by Status"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-700 text-white">
        <thead className="bg-gray-800/60 border-b border-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('title')}
            >
              Title {renderSortArrow('title')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('status')}
            >
              Status {renderSortArrow('status')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('priority')}
            >
              Priority {renderSortArrow('priority')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('created_at')}
            >
              Created At {renderSortArrow('created_at')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-mono font-bold text-gray-400 uppercase tracking-wide"
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sortedApps.map((app, index) => (
            <tr key={app.id} className={`group hover:bg-indigo-500/20 transition-colors ${index % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-800/40'}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-white">
                <Link to={`/roadmap/${app.id}`} className="hover:underline text-purple-400">
                  {app.title}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-400">
                {app.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getStatusClasses(app.status)}`}
                >
                  {app.status || 'Planned'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getPriorityClasses(app.priority)}`}
                >
                  {app.priority || 'Low'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">
                {new Date(app.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-500">
                {app.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
