import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeftIcon, KanbanIcon, ListBulletsIcon, FunnelIcon } from '@phosphor-icons/react';
import CustomDropdown from '../../components/CustomDropdown';
import RoadmapCard from '../../components/roadmap/RoadmapCard'; // Added import for RoadmapCard
import piml from 'piml'; // Import piml

const RoadmapViewerPage = () => {
  useSeo({
    title: 'Apps Roadmap | Fezcodex',
    description: 'Roadmap and status of all applications and tools.',
    keywords: ['Fezcodex', 'roadmap', 'apps', 'status', 'tools'],
    ogTitle: 'Apps Roadmap | Fezcodex',
    ogDescription: 'Roadmap and status of all applications and tools.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Apps Roadmap | Fezcodex',
    twitterDescription: 'Roadmap and status of all applications and tools.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [issuesData, setIssuesData] = useState([]);
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' or 'table'

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (!pimlResponse.ok) {
          throw new Error(`HTTP error! status: ${pimlResponse.status}`);
        }
        const issuesPimlText = await pimlResponse.text();
        const issuesData = piml.parse(issuesPimlText);
        setIssuesData(issuesData.issues);
      } catch (error) {
        console.error('Failed to fetch roadmap data:', error);
      }
    };

    fetchRoadmap();
  }, []);

  const getStatusClasses = (status) => {
    let bgColor = '';
    let borderColor = '';
    switch (status) {
      case 'Planned':
        bgColor = 'bg-blue-500';
        borderColor = 'border-blue-700';
        break;
      case 'In Progress':
        bgColor = 'bg-orange-500';
        borderColor = 'border-orange-700';
        break;
      case 'Completed':
        bgColor = 'bg-green-500';
        borderColor = 'border-green-700';
        break;
      case 'On Hold':
        bgColor = 'bg-red-500';
        borderColor = 'border-red-700';
        break;
      default:
        bgColor = 'bg-gray-500';
        borderColor = 'border-gray-700';
    }
    return `${bgColor} ${borderColor}`;
  };

  const getPriorityClasses = (priority) => {
    let textColor = '';
    let borderColor = '';
    switch (priority) {
      case 'High':
        textColor = 'text-red-400';
        borderColor = 'border-red-700';
        break;
      case 'Medium':
        textColor = 'text-yellow-400';
        borderColor = 'border-yellow-700';
        break;
      case 'Low':
        textColor = 'text-green-400';
        borderColor = 'border-green-700';
        break;
      default:
        textColor = 'text-gray-400';
        borderColor = 'border-gray-700';
    }
    return `${textColor} ${borderColor}`;
  };

  const getOnlyBgStatusColor = (status) => {
    const classes = getStatusClasses(status);
    return classes.split(' ')[0]; // Returns only the bgColor class (e.g., "bg-blue-500")
  };

  const statusTextColor = (status) => {
    if (status === 'Planned') return 'text-white';
    return 'text-black';
  };

  const RoadmapView = () => {
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

  const TableView = () => {
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
                    className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getStatusClasses(app.status)} ${statusTextColor(app.status)} `}
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

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="group text-primary-400 hover:underline flex items-center gap-2 text-lg mb-8"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>

        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-mono mb-4">
            FEZZILLA <span className="text-gray-600">//</span> ROADMAP
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-mono tracking-wide">
            [ TRACKING PROJECT STATUS AND PROGRESS ]
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4 p-1 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-5 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 flex items-center gap-2 border-2 ${
              viewMode === 'roadmap'
                ? 'bg-indigo-500/30 text-white shadow-lg border-indigo-500'
                : 'bg-transparent text-gray-300 border-gray-700 hover:border-indigo-500 hover:bg-primary-700/20'
            }`}
          >
            <KanbanIcon size={20} /> Roadmap View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-5 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 flex items-center gap-2 border-2 ${
              viewMode === 'table'
                ? 'bg-indigo-500/30 text-white shadow-lg border-indigo-500'
                : 'bg-transparent text-gray-300 border-gray-700 hover:border-indigo-500 hover:bg-primary-700/20'
            }`}
          >
          <ListBulletsIcon size={20} /> Table View
          </button>
        </div>

        {viewMode === 'roadmap' ? <RoadmapView /> : <TableView />}
      </div>
    </div>
  );
};

export default RoadmapViewerPage;
