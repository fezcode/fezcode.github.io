import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Timer, Star, Calendar, Tag } from '@phosphor-icons/react';
import { appIcons } from '../utils/appIcons';
import { motion } from 'framer-motion';
import useSeo from '../hooks/useSeo';
import { useAchievements } from '../context/AchievementContext';
import GenerativeArt from '../components/GenerativeArt';
import colors from '../config/colors';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const TimelinePage = () => {
  useSeo({
    title: 'Timeline | Fezcodex',
    description: 'A chronological overview of key milestones and events.',
    keywords: ['Fezcodex', 'timeline', 'milestones', 'history', 'achievements'],
    ogTitle: 'Timeline | Fezcodex',
    ogDescription: 'A chronological overview of key milestones and events.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Timeline | Fezcodex',
    twitterDescription:
      'A chronological overview of key milestones and events.',
    twitterImage: '/images/ogtitle.png',
  });

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('time_traveler');
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/timeline/timeline.json');
        if (response.ok) {
          const data = await response.json();
          // Sort milestones by date, newest first
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setMilestones(data);
        } else {
          console.error('Failed to fetch timeline data');
          setMilestones([]);
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [unlockAchievement]);

  const getEventColor = (type) => {
    switch (type) {
      case 'project':
        return colors.game;
      case 'content':
        return colors.article;
      case 'app':
        return colors.music;
      case 'feature':
        return colors.websites;
      case 'refactor':
        return colors.food;
      default:
        return colors.tools;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-[10px]">
        <span className="animate-pulse">Retrieving_Chronological_Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pb-32 relative">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt seed="Fezcodex Timeline" className="w-full h-full opacity-40 filter brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
            <div className="mb-6 flex items-center gap-4">
                <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black">
                  <ArrowLeft weight="bold" />
                  <span>Back to Home</span>
                </Link>
                <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-sm flex items-center gap-2">
                   <Timer size={14} /> SYSTEM_HISTORY
                </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl">
                The Timeline
            </h1>
            <p className="mt-4 text-gray-400 font-mono text-sm max-w-xl">
               A journey through {milestones.length} key milestones and achievements of Fezcodex, meticulously archived and indexed.
            </p>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">

        <div className="lg:col-span-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-16">
            {milestones.map((milestone, index) => {
              const EventIcon = appIcons[milestone.icon] || Star;
              const milestoneDate = new Date(milestone.date);
              const eventColor = getEventColor(milestone.type);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative pl-12 md:pl-20 group"
                >
                  {/* Dot / Icon Container */}
                  <div
                    className="absolute left-0 md:left-0 top-0 flex items-center justify-center w-8 md:w-12 h-8 md:h-12 bg-[#050505] border border-white/20 group-hover:border-white transition-colors z-10"
                    style={{ borderColor: `${eventColor}44` }}
                  >
                    <EventIcon size={18} style={{ color: eventColor }} />
                  </div>

                  {/* Content Card */}
                  <div className="border border-white/5 bg-white/2 backdrop-blur-sm p-8 hover:border-white/10 transition-colors relative overflow-hidden">
                    {/* Color Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none rounded-full blur-3xl -mr-16 -mt-16" style={{ backgroundColor: eventColor }} />

                    <div className="flex flex-wrap items-center gap-4 mb-4 font-mono text-[10px] uppercase tracking-widest">
                       <span className="px-2 py-1 flex items-center gap-1" style={{ color: eventColor, backgroundColor: `${eventColor}11` }}>
                          <Calendar size={12} /> {milestoneDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                       </span>
                       <span className="text-gray-500 flex items-center gap-1">
                          <Tag size={12} /> {milestone.type}
                       </span>
                    </div>

                    <h2
                      className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4 transition-colors"
                      style={{ '--hover-color': eventColor }}
                    >
                        <span className="group-hover:text-[var(--hover-color)] transition-colors duration-300">
                          {milestone.title}
                        </span>
                    </h2>

                    <p className="text-gray-400 font-sans leading-relaxed text-lg">
                        {milestone.description}
                    </p>

                    {milestone.link && (
                      <div className="mt-8 pt-6 border-t border-white/5">
                        <a
                          href={milestone.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                          style={{ color: eventColor }}
                        >
                          Access_Linked_Asset &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-16 lg:col-span-4 lg:mt-0">
            <div className="sticky top-24 space-y-12">
                <div>
                    <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">_CHRONO_STATISTICS</h3>
                    <div className="space-y-6 border-l border-white/10 pl-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Event_Count</span>
                            <span className="font-mono text-2xl uppercase text-emerald-500 font-black">{milestones.length}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Active_Since</span>
                            <span className="font-mono text-sm uppercase text-white">
                                {milestones.length > 0 && new Date(milestones[milestones.length - 1].date).getFullYear()}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Status</span>
                            <span className="font-mono text-sm uppercase text-emerald-400 font-bold animate-pulse">RECORDING...</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border border-white/10 bg-white/2 backdrop-blur-md">
                   <p className="text-xs text-gray-500 font-mono leading-relaxed uppercase tracking-wider">
                      {/* Evolutionary path log */}
                      This log represents the evolutionary path of Fezcodex. Every entry is a milestone in our digital convergence.
                   </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
