import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import {
  ArrowLeftIcon,
  Lightning,
  Circle,
  ArrowsClockwise,
  CheckCircle,
  PauseCircle,
  Fire,
  Equals,
  ArrowDown
} from '@phosphor-icons/react';
import {motion} from 'framer-motion';
import piml from 'piml'; // Import piml
import {getStatusClasses, getPriorityClasses} from '../../utils/roadmapHelpers';

const RoadmapItemDetailPage = () => {
  const {id} = useParams();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Planned':
        return <Circle weight="bold"/>;
      case 'In Progress':
        return <ArrowsClockwise weight="bold" className="animate-spin"/>;
      case 'Completed':
        return <CheckCircle weight="bold"/>;
      case 'On Hold':
        return <PauseCircle weight="bold"/>;
      default:
        return <Circle weight="bold"/>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <Fire weight="fill"/>;
      case 'Medium':
        return <Equals weight="bold"/>;
      case 'Low':
        return <ArrowDown weight="bold"/>;
      default:
        return <ArrowDown weight="bold"/>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 sm:py-16 text-center text-gray-400 font-mono animate-pulse">Loading...</div>
    );
  }

  if (!roadmapItem) {
    return (
      <div className="py-8 sm:py-16 text-center text-gray-400 font-mono">
        Roadmap item not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="py-8 sm:py-16 min-h-screen"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          to="/roadmap"
          className="group text-gray-400 hover:text-primary-400 flex items-center gap-2 text-sm font-mono mb-8 w-fit transition-colors"
        >
          <ArrowLeftIcon className="text-lg transition-transform group-hover:-translate-x-1"/>
          Back to Roadmap
        </Link>

        <div
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 lg:p-10 border border-gray-800 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <div className="relative z-10">
            {roadmapItem.epic && (
              <div
                className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                <Lightning weight="fill" size={12}/>
                {roadmapItem.epic}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-mono tracking-tight leading-tight">
              {roadmapItem.title}
            </h1>

            <p className="text-gray-300 text-lg mb-8 font-mono leading-relaxed">
              {roadmapItem.description}
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-black/20 rounded-xl border border-white/5">
              <div>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold mb-2">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-md shadow-sm ${getStatusClasses(roadmapItem.status || 'Planned')}`}
                >
                  {getStatusIcon(roadmapItem.status || 'Planned')}
                  {roadmapItem.status || 'Planned'}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold mb-2">Priority</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-md shadow-sm ${getPriorityClasses(roadmapItem.priority || 'Low')}`}
                >
                  {getPriorityIcon(roadmapItem.priority || 'Low')}
                  {roadmapItem.priority || 'Low'}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold mb-2">Category</p>
                <p className="text-white font-mono text-sm">{roadmapItem.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold mb-2">Created At</p>
                <p className="text-white font-mono text-sm">
                  {new Date(roadmapItem.created_at).toLocaleDateString()}
                </p>
              </div>
              {roadmapItem.due_date && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold mb-2">Due Date</p>
                  <p className="text-white font-mono text-sm">
                    {new Date(roadmapItem.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {roadmapItem.notes && (
              <div className="mt-8">
                <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider mb-3">Notes</h3>
                <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                  <p className="text-gray-300 font-mono whitespace-pre-wrap text-sm leading-relaxed">
                    {roadmapItem.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapItemDetailPage;
