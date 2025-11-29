import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import piml from 'piml'; // Import piml

const RoadmapItemDetailPage = () => {
  const { id } = useParams();
  const [roadmapItem, setRoadmapItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useSeo({
    title: roadmapItem ? `${roadmapItem.title} | Roadmap` : 'Roadmap Item | Fezcodex',
    description: roadmapItem ? roadmapItem.description : 'Details of a roadmap item.',
    keywords: ['Fezcodex', 'roadmap', 'item', id],
    ogTitle: roadmapItem ? `${roadmapItem.title} | Roadmap` : 'Roadmap Item | Fezcodex',
    ogDescription: roadmapItem ? roadmapItem.description : 'Details of a roadmap item.',
    ogImage: 'https://fezcode.github.io/logo512.png', // Assuming a default image
    twitterCard: 'summary_large_image',
    twitterTitle: roadmapItem ? `${roadmapItem.title} | Roadmap` : 'Roadmap Item | Fezcodex',
    twitterDescription: roadmapItem ? roadmapItem.description : 'Details of a roadmap item.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  useEffect(() => {
    const fetchRoadmapItem = async () => {
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (!pimlResponse.ok) {
          throw new Error(`HTTP error! status: ${pimlResponse.status}`);
        }
        const issuesPimlText = await pimlResponse.text();
        const issuesData = piml.parse(issuesPimlText);
        const foundItem = issuesData.issues.find((item) => item.id === id);
        setRoadmapItem(foundItem);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch roadmap item:', error);
        setIsLoading(false);
      }
    };

    fetchRoadmapItem();
  }, [id]);

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

  const statusTextColor = (status) => {
    if (status === 'Planned') return 'text-white';
    return 'text-black';
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

  if (isLoading) {
    return (
      <div className="py-8 sm:py-16 text-center text-gray-400">Loading...</div>
    );
  }

  if (!roadmapItem) {
    return (
      <div className="py-8 sm:py-16 text-center text-gray-400">
        Roadmap item not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 sm:py-16"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          to="/roadmap"
          className="group text-primary-400 hover:underline flex items-center gap-2 text-lg mb-8"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Roadmap
        </Link>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-xl p-6 lg:p-8 border border-gray-700 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
          <h1 className="text-4xl font-bold text-white mb-4 relative z-10 font-mono tracking-tight">
            {roadmapItem.title}
          </h1>
          <p className="text-gray-300 text-lg mb-6 relative z-10 font-mono">
            {roadmapItem.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
            <div>
              <p className="text-gray-400 font-mono font-medium">Status:</p>
              <span
                className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getStatusClasses(roadmapItem.status)} ${statusTextColor(roadmapItem.status)}`}
              >
                {roadmapItem.status || 'Planned'}
              </span>
            </div>
            <div>
              <span
                className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getPriorityClasses(roadmapItem.priority)}`}
              >
                {roadmapItem.priority || 'Low'}
              </span>
            </div>
            <div>
              <p className="text-gray-400 font-mono font-medium">Category:</p>
              <p className="text-white font-mono">{roadmapItem.category}</p>
            </div>
            <div>
              <p className="text-gray-400 font-mono font-medium">Created At:</p>
              <p className="text-white font-mono">
                {new Date(roadmapItem.created_at).toLocaleDateString()}
              </p>
            </div>
            {roadmapItem.due_date && (
              <div>
                <p className="text-gray-400 font-mono font-medium">Due Date:</p>
                <p className="text-white font-mono">
                  {new Date(roadmapItem.due_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {roadmapItem.notes && (
            <div className="mt-6 border-t border-gray-700 pt-6 relative z-10">
              <h3 className="text-xl font-mono font-semibold text-white mb-2">Notes:</h3>
              <p className="text-gray-300 font-mono whitespace-pre-wrap">
                {roadmapItem.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapItemDetailPage;
