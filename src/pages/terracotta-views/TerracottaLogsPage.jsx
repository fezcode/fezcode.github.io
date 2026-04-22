import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FunnelIcon,
  XCircleIcon,
  InfoIcon,
  SquaresFourIcon,
  ListIcon,
  BookBookmarkIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import LogCard from '../../components/LogCard';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import colors from '../../config/colors';
import { useAchievements } from '../../context/AchievementContext';
import piml from 'piml';
import GenericModal from '../../components/GenericModal';
import { useSidePanel } from '../../context/SidePanelContext';
import RatingSystemDetail from '../../components/RatingSystemDetail';

const categories = [
  'Book', 'Movie', 'Video', 'Game', 'Article', 'Music', 'Series', 'Food', 'Websites', 'Tools', 'Event',
];

const TerracottaLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [viewMode, setViewMode] = usePersistentState('fez_logs_view_mode', 'grid');
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
          selectedCategories.length === 0 || selectedCategories.includes(log.category);
        const matchesSearch =
          log.title.toLowerCase().includes(lowerQuery) ||
          (log.author && log.author.toLowerCase().includes(lowerQuery)) ||
          (log.description && log.description.toLowerCase().includes(lowerQuery));
        return matchesCategory && matchesSearch;
      }),
    );
  }, [logs, selectedCategories, searchQuery]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25 font-fraunces">
      <Seo title="Logs | Fezcodex" description="A collection of logs and writings." />
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-fraunces italic tracking-tight text-[#1A1613] mb-4 leading-none">
                Logs
              </h1>
              <p className="text-[#2E2620]/60 font-mono text-sm max-w-sm uppercase tracking-widest">
                Total Entries: {logs.length}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex bg-[#E8DECE]/60 p-1 rounded-sm border border-[#1A161320]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-[#1A1613] text-[#F3ECE0]' : 'text-[#2E2620]/60 hover:text-[#1A1613]'}`}
                  title="Grid View"
                >
                  <SquaresFourIcon size={18} weight={viewMode === 'grid' ? 'fill' : 'regular'} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all ${viewMode === 'list' ? 'bg-[#1A1613] text-[#F3ECE0]' : 'text-[#2E2620]/60 hover:text-[#1A1613]'}`}
                  title="List View"
                >
                  <ListIcon size={18} weight={viewMode === 'list' ? 'fill' : 'regular'} />
                </button>
              </div>

              <Link
                to="/reading"
                className="flex items-center gap-2 px-4 py-2 bg-[#B88532]/15 border border-[#B88532]/60 text-[#B88532] hover:bg-[#B88532] hover:text-[#F3ECE0] transition-all font-mono text-xs uppercase tracking-widest font-bold rounded-sm"
              >
                <BookBookmarkIcon size={16} weight="bold" />
                <span>Reading</span>
              </Link>

              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-[#2E2620]/60 hover:text-[#9E4A2F] transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <InfoIcon size={16} />
                <span>Rating System</span>
              </button>
            </div>
          </div>
        </header>

        <div className="sticky top-0 z-30 bg-[#F3ECE0]/95 backdrop-blur-sm border-b border-[#1A161320] pb-6 pt-2 mb-12">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#1A161320] text-xl md:text-2xl text-[#1A1613] placeholder-[#2E2620]/30 focus:border-[#C96442] focus:outline-none py-2 transition-colors font-fraunces italic"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2 text-[#2E2620]/50 font-mono text-xs uppercase tracking-widest">
              <FunnelIcon size={14} weight="fill" />
              <span>Filter By</span>
            </div>

            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const color = colors[category.toLowerCase()] || colors.primary[400];

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1A1613] text-[#F3ECE0] border-[#1A1613]'
                      : 'bg-transparent text-[#2E2620]/60 border-[#1A161320] hover:border-[#1A1613] hover:text-[#1A1613]'
                  }`}
                  style={
                    isSelected
                      ? { borderColor: color, color: color, backgroundColor: `${color}15` }
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
                className="ml-auto text-[#9E4A2F] hover:text-[#C96442] transition-colors"
              >
                <XCircleIcon size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse'
                : 'flex flex-col gap-4 animate-pulse'
            }
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={viewMode === 'grid' ? 'h-64 w-full bg-[#E8DECE]/60 rounded-sm' : 'h-20 w-full bg-[#E8DECE]/60 rounded-sm'}
              />
            ))}
          </div>
        ) : (
          <div className="pb-32">
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col'
                }
              >
                {filteredLogs.map((log, ndx) => (
                  <motion.div
                    layout
                    key={log.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogCard log={log} index={ndx} totalLogs={logs.length} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredLogs.length === 0 && (
              <div className="py-20 text-center font-mono text-[#2E2620]/50 uppercase tracking-widest">
                No logs found.
              </div>
            )}
          </div>
        )}
      </div>

      <GenericModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Rating System"
      >
        <div className="font-mono text-sm space-y-6 text-[#2E2620]">
          <p className="tracking-wide leading-relaxed">
            This archive serves as a repository for tracking media consumption and subjective evaluation.
          </p>

          <div className="border border-[#1A161320] p-4 bg-[#E8DECE]/40">
            <h3 className="text-[#9E4A2F] font-bold mb-4 uppercase tracking-widest border-b border-[#9E4A2F]/30 pb-2">
              Rating Scale
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between"><span>5 Stars</span><span className="text-[#2E2620]/60 uppercase">Masterpiece</span></li>
              <li className="flex justify-between"><span>4 Stars</span><span className="text-[#2E2620]/60 uppercase">Highly Recommended</span></li>
              <li className="flex justify-between"><span>3 Stars</span><span className="text-[#2E2620]/60 uppercase">Good / Worthwhile</span></li>
              <li className="flex justify-between"><span>2 Stars</span><span className="text-[#2E2620]/60 uppercase">Flawed / Average</span></li>
              <li className="flex justify-between"><span>1 Star</span><span className="text-[#2E2620]/60 uppercase">Avoid</span></li>
            </ul>
          </div>

          <button
            onClick={() => {
              setIsInfoModalOpen(false);
              unlockAchievement('east_side');
              openSidePanel('Rating System Details', <RatingSystemDetail />, 600);
            }}
            className="w-full py-3 border border-[#C96442] text-[#9E4A2F] hover:bg-[#C96442] hover:text-[#F3ECE0] transition-all uppercase tracking-widest font-bold"
          >
            Read full guide
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default TerracottaLogsPage;
