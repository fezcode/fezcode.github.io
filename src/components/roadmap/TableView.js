import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Funnel,
  CaretUp,
  CaretDown,
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
    <div className="space-y-12">
      {/* Toolbar: Search and Filters */}
      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-sm flex flex-col lg:flex-row gap-12 justify-between items-start">
        {/* Search */}
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlass
              className="text-gray-600 group-focus-within:text-emerald-500 transition-colors"
              size={18}
              weight="bold"
            />
          </div>
          <input
            type="text"
            placeholder="Search artifacts by ID, title, or epic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-sm bg-black/40 text-gray-300 placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 transition-all duration-300 text-xs font-mono uppercase tracking-widest shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
            <Funnel size={14} weight="fill" /> Filter_Protocol
          </div>
          <div className="flex flex-wrap gap-2">
            {['Planned', 'In Progress', 'Completed', 'On Hold'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`
                  px-4 py-2 text-[9px] font-mono font-black uppercase tracking-widest transition-all duration-200 border rounded-sm
                  ${
                    activeFilters.includes(status)
                      ? `${getStatusClasses(status)} border-current shadow-[0_0_15px_rgba(16,185,129,0.1)]`
                      : 'bg-transparent border-white/5 text-gray-600 hover:border-white/20 hover:text-gray-400'
                  }
                `}
                >
                  <span className="flex items-center gap-2">
                    {status}
                    {activeFilters.includes(status) && <span>[X]</span>}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/10 bg-white/[0.01] rounded-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead>
              <tr className="bg-white/[0.03]">
                {[
                  { key: 'title', label: 'Artifact' },
                  { key: 'epic', label: 'Domain' },
                  { key: 'description', label: 'Manifest', noSort: true },
                  { key: 'status', label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'created_at', label: 'Timestamp' },
                  { key: 'notes', label: 'Intel', noSort: true },
                ].map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => !col.noSort && handleSort(col.key)}
                    className={`
                      px-6 py-5 text-left text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest group
                      ${!col.noSort ? 'cursor-pointer hover:text-white transition-colors select-none' : ''}
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
            <tbody className="divide-y divide-white/[0.03]">
              {sortedApps.length > 0 ? (
                sortedApps.map((app, index) => (
                  <tr
                    key={app.id}
                    onClick={(e) => {
                      if (!e.target.closest('a')) {
                        navigate(`/roadmap/${app.id}`);
                      }
                    }}
                    className="group transition-all duration-300 cursor-pointer hover:bg-emerald-500/[0.02]"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Link
                        to={`/roadmap/${app.id}`}
                        className="text-xs font-bold font-sans uppercase text-white group-hover:text-emerald-400 transition-colors"
                      >
                        {app.title}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {app.epic ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[9px] font-mono uppercase tracking-widest font-black">
                          {app.epic}
                        </span>
                      ) : (
                        <span className="text-gray-800 font-mono text-[10px]">
                          ---
                        </span>
                      )}
                    </td>
                    <td
                      className="px-6 py-5 text-[11px] text-gray-500 font-sans max-w-xs truncate group-hover:text-gray-400 transition-colors"
                      title={app.description}
                    >
                      {app.description}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 inline-flex items-center text-[9px] font-mono font-black uppercase tracking-widest border rounded-sm ${getStatusClasses(app.status)}`}
                      >
                        {app.status || 'Planned'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 border rounded-sm text-[9px] font-mono font-black uppercase tracking-widest ${getPriorityClasses(app.priority)}`}
                      >
                        {app.priority || 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-[10px] font-mono text-gray-600 uppercase">
                      {new Date(app.created_at).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-5 text-[10px] text-gray-700 font-mono italic max-w-xs truncate">
                      {app.notes || '---'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                        <MagnifyingGlass size={48} weight="thin" className="text-gray-800" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-mono font-black uppercase tracking-[0.3em] text-gray-500">
                          Query_Failed: No_Artifacts_Found
                        </p>
                        <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">
                          Adjust parameters and re-initialize search.
                        </p>
                      </div>
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
        <span className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.2em] bg-white/[0.03] border border-white/5 px-4 py-2 rounded-sm">
          Displaying_Entries:{' '}
          <span className="text-emerald-500">
            {sortedApps.length}
          </span>{' '}
          {'//'} Pool_Size: {issuesData.length}
        </span>
      </div>
    </div>
  );
};

export default TableView;
