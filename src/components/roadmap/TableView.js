import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Funnel,
  CaretUp,
  CaretDown,
  Check,
  Lightning,
  ArrowsDownUp,
} from '@phosphor-icons/react';
import {
  getStatusClasses,
  getPriorityClasses,
} from '../../utils/roadmapHelpers';

const TableView = ({ issuesData = [] }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [activeFilters, setActiveFilters] = useState([
    'Planned',
    'In Progress',
    'On Hold',
    'Completed',
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (status) => {
    if (activeFilters.includes(status)) {
      setActiveFilters(activeFilters.filter((s) => s !== status));
    } else {
      setActiveFilters([...activeFilters, status]);
    }
  };

  const filteredApps = issuesData.filter((app) => {
    const matchesFilter =
      activeFilters.length === 0 ||
      activeFilters.includes(app.status || 'Planned');
    const matchesSearch =
      (app.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (app.description?.toLowerCase() || '').includes(
        searchQuery.toLowerCase(),
      ) ||
      (app.epic?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
    } else if (sortBy === 'epic') {
      comparison = (a.epic || '').localeCompare(b.epic || '');
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

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return (
        <ArrowsDownUp
          size={14}
          weight="bold"
          className="text-gray-500 opacity-70 group-hover:opacity-100 group-hover:text-primary-400 transition-all"
        />
      );
    }
    return sortOrder === 'asc' ? (
      <CaretUp weight="bold" size={14} className="text-primary-400" />
    ) : (
      <CaretDown weight="bold" size={14} className="text-primary-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar: Search and Filters */}
      <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl p-4 md:p-5 flex flex-col lg:flex-row gap-6 justify-between items-center">
        {/* Search */}
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlass
              className="text-gray-500 group-focus-within:text-primary-400 transition-colors"
              size={20}
            />
          </div>
          <input
            type="text"
            placeholder="Search issues by title, description, or epic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-gray-800 transition-all duration-300 text-sm font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="flex items-center text-gray-400 font-mono text-xs uppercase tracking-wider">
            <Funnel size={16} className="mr-2" /> Filter Status:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Planned', 'In Progress', 'Completed', 'On Hold'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`
                  group relative px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 select-none
                  ${
                    activeFilters.includes(status)
                      ? `${getStatusClasses(status)} shadow-md ring-1 ring-white/10`
                      : 'bg-gray-800/40 border border-gray-700 text-gray-500 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-300'
                  }
                `}
                >
                  <span className="flex items-center gap-1.5">
                    {activeFilters.includes(status) && <Check weight="bold" />}
                    {status}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl shadow-2xl bg-gray-900/70 backdrop-blur-md border border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-gray-800/60">
                {[
                  { key: 'title', label: 'Title' },
                  { key: 'epic', label: 'Epic' },
                  { key: 'description', label: 'Description', noSort: true },
                  { key: 'status', label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'created_at', label: 'Created' },
                  { key: 'notes', label: 'Notes', noSort: true },
                ].map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => !col.noSort && handleSort(col.key)}
                    className={`
                      px-6 py-4 text-left text-xs font-mono font-bold text-gray-400 uppercase tracking-wider group
                      ${!col.noSort ? 'cursor-pointer hover:text-primary-400 hover:bg-gray-800/50 transition-colors select-none' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {!col.noSort && <SortIcon column={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {sortedApps.length > 0 ? (
                sortedApps.map((app, index) => (
                  <tr
                    key={app.id}
                    onClick={(e) => {
                      // Navigate if the click didn't originate from a link
                      if (!e.target.closest('a')) {
                        navigate(`/roadmap/${app.id}`);
                      }
                    }}
                    className={`
                      group transition-colors duration-200 cursor-pointer
                      ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-transparent'}
                      hover:!bg-gray-800/60
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/roadmap/${app.id}`}
                        className="text-sm font-mono font-bold text-white group-hover:text-primary-400 transition-colors"
                      >
                        {app.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.epic ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                          <Lightning weight="fill" size={10} />
                          {app.epic}
                        </span>
                      ) : (
                        <span className="text-gray-600 font-mono text-xs">
                          -
                        </span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-400 font-mono max-w-xs truncate"
                      title={app.description}
                    >
                      {app.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wide rounded-full ${getStatusClasses(app.status)} shadow-sm`}
                      >
                        {app.status || 'Planned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wide ${getPriorityClasses(app.priority)}`}
                      >
                        {app.priority || 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                      {new Date(app.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono italic max-w-xs truncate">
                      {app.notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-gray-500 font-mono"
                  >
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="p-4 rounded-full bg-gray-800/50">
                        <MagnifyingGlass size={32} className="opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-gray-400">
                        No issues found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex justify-end items-center px-2">
        <span className="text-xs font-mono text-gray-600 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800">
          Showing{' '}
          <span className="text-primary-400 font-bold">
            {sortedApps.length}
          </span>{' '}
          of {issuesData.length} issues
        </span>
      </div>
    </div>
  );
};

export default TableView;
