import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Funnel, XCircle, Info } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import LogCard from '../components/LogCard';
import useSeo from '../hooks/useSeo';
import colors from '../config/colors';
import { useAchievements } from '../context/AchievementContext';
import piml from 'piml';
import GenericModal from '../components/GenericModal';
import { useSidePanel } from '../context/SidePanelContext';
import RatingSystemDetail from '../components/RatingSystemDetail';

const categories = [
  'Book',
  'Movie',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
  'Event',
];

const LogsPage = () => {
  useSeo({
    title: 'Logs | Fezcodex',
    description:
      'A collection of logs, thoughts, and other miscellaneous writings.',
    keywords: ['Fezcodex', 'logs', 'thoughts', 'writing'],
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { unlockAchievement } = useAchievements();
  const { openSidePanel } = useSidePanel();

  useEffect(() => {
    unlockAchievement('log_diver');
    const fetchLogs = async () => {
      try {
        const fetchPromises = categories.map(async (category) => {
          const response = await fetch(
            `/logs/${category.toLowerCase()}/${category.toLowerCase()}.piml`,
          );
          if (!response.ok) return [];
          const text = await response.text();
          const data = piml.parse(text);
          return data.logs || [];
        });

        const allLogsArrays = await Promise.all(fetchPromises);
        const combinedLogs = allLogsArrays.flat();

        const logsWithId = combinedLogs
          .map((log, index) => ({
            ...log,
            id: `${log.title}-${log.date}-${index}`,
            originalIndex: index,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logsWithId);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [unlockAchievement]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredLogs(
      logs.filter((log) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(log.category);
        const matchesSearch =
          log.title.toLowerCase().includes(lowerQuery) ||
          (log.author && log.author.toLowerCase().includes(lowerQuery)) ||
          (log.description &&
            log.description.toLowerCase().includes(lowerQuery));
        return matchesCategory && matchesSearch;
      }),
    );
  }, [logs, selectedCategories, searchQuery]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
                LOGS
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-sm uppercase tracking-widest">
                Total Entries: {logs.length}
              </p>
            </div>

            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-gray-500 hover:text-emerald-400 transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <Info size={16} />
              <span>Rating System</span>
            </button>
          </div>
        </header>

        {/* Controls: Search & Filter */}
        <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-sm border-b border-white/10 pb-6 pt-2 mb-12">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-gray-800 text-xl md:text-2xl font-light text-white placeholder-gray-700 focus:border-emerald-500 focus:outline-none py-2 transition-colors font-mono"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2 text-gray-600 font-mono text-xs uppercase tracking-widest">
              <Funnel size={14} weight="fill" />
              <span>Filter By</span>
            </div>

            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const color =
                colors[category.toLowerCase()] || colors.primary[400];

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: color,
                          color: color,
                          backgroundColor: `${color}10`,
                        }
                      : {}
                  }
                >
                  {category}
                </button>
              );
            })}
            {(selectedCategories.length > 0 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery('');
                }}
                className="ml-auto text-red-500 hover:text-red-400 transition-colors"
              >
                <XCircle size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 w-full bg-white/5 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="pb-32">
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredLogs.map((log) => (
                  <motion.div
                    layout
                    key={log.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogCard
                      log={log}
                      index={log.originalIndex}
                      totalLogs={logs.length}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredLogs.length === 0 && (
              <div className="py-20 text-center font-mono text-gray-600 uppercase tracking-widest">
                No logs found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Modal */}
      <GenericModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Rating System"
      >
        <div className="font-mono text-sm space-y-6 text-gray-300">
          <p className="tracking-wide leading-relaxed">
            This archive serves as a repository for tracking media consumption
            and subjective evaluation.
          </p>

          <div className="border border-white/10 p-4 bg-black">
            <h3 className="text-emerald-500 font-bold mb-4 uppercase tracking-widest border-b border-emerald-500/20 pb-2">
              Rating Scale
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>5 Stars</span>
                <span className="text-gray-500 uppercase">Masterpiece</span>
              </li>
              <li className="flex justify-between">
                <span>4 Stars</span>
                <span className="text-gray-500 uppercase">
                  Highly Recommended
                </span>
              </li>
              <li className="flex justify-between">
                <span>3 Stars</span>
                <span className="text-gray-500 uppercase">
                  Good / Worthwhile
                </span>
              </li>
              <li className="flex justify-between">
                <span>2 Stars</span>
                <span className="text-gray-500 uppercase">
                  Flawed / Average
                </span>
              </li>
              <li className="flex justify-between">
                <span>1 Star</span>
                <span className="text-gray-500 uppercase">Avoid</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setIsInfoModalOpen(false);
              unlockAchievement('east_side');
              openSidePanel(
                'Rating System Details',
                <RatingSystemDetail />,
                600,
              );
            }}
            className="w-full py-3 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest font-bold"
          >
            Read full guide
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default LogsPage;
