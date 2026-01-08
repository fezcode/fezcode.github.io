import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  GlobeHemisphereWestIcon,
  CrosshairIcon,
} from '@phosphor-icons/react';
import { appIcons } from '../utils/appIcons';
import { motion } from 'framer-motion';
import piml from 'piml';
import useSeo from '../hooks/useSeo';
import { useAchievements } from '../context/AchievementContext';
import TacticalGlobe from '../components/TacticalGlobe';
import colors from '../config/colors';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const TimelinePage = () => {
  useSeo({
    title: 'Timeline | Fezcodex',
    description: 'A chronological overview of key milestones and events.',
    keywords: ['Fezcodex', 'timeline', 'milestones', 'history', 'achievements'],
    ogTitle: 'Timeline | Fezcodex',
    ogDescription: 'A chronological overview of key milestones and events.',
    ogImage: '/images/asset/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Timeline | Fezcodex',
    twitterDescription:
      'A chronological overview of key milestones and events.',
    twitterImage: '/images/asset/ogtitle.png',
  });

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unlockAchievement } = useAchievements();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredMilestone, setHoveredMilestone] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    unlockAchievement('time_traveler');
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/timeline/timeline.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);

          let eventList = [];
          if (parsed.timeline) {
              eventList = Array.isArray(parsed.timeline) ? parsed.timeline : [parsed.timeline];
          }

          // Sort milestones by date, newest first
          eventList.sort((a, b) => new Date(b.date) - new Date(a.date));
          setMilestones(eventList);
          if (eventList.length > 0) {
            setHoveredMilestone(eventList[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [unlockAchievement]);

  const getEventColor = (type) => {
    switch (String(type).toLowerCase()) {
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-[10px]">
        <span className="animate-pulse">Retrieving_Chronological_Data...</span>
      </div>
    );
  }

  const activeColor = hoveredMilestone
    ? getEventColor(hoveredMilestone.type)
    : colors.emerald;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Left Column: Tactical Globe & HUD (Sticky on Desktop) */}
      <div className="w-full lg:w-5/12 h-[50vh] lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-white/10 z-20 bg-black relative flex flex-col">
        {/* Map / Globe Background */}
        <div className="absolute inset-0 opacity-60">
            <TacticalGlobe className="w-full h-full" accentColor={activeColor} />
        </div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500"
          style={{
             backgroundImage: `linear-gradient(${activeColor}08 1px, transparent 1px), linear-gradient(90deg, ${activeColor}08 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />

        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-full p-6 md:p-8 lg:p-12 pointer-events-none flex flex-col justify-between z-10">
            {/* Top Bar HUD */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 animate-pulse" style={{ color: activeColor }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }} />
                        <span className="font-mono text-xs font-bold tracking-widest">LIVE FEED</span>
                    </div>
                    <h2 className="font-mono text-4xl lg:text-5xl font-black text-white/90 tracking-tighter mt-2">
                        {hoveredMilestone ? 'LOG INSPECTION' : 'MISSION BRIEFING'}
                    </h2>
                    {hoveredMilestone && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         key={hoveredMilestone.title}
                         className="mt-2"
                       >
                           <div className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-1">Current Objective</div>
                           <div className="text-xl lg:text-2xl font-bold uppercase tracking-tight leading-none" style={{ color: activeColor }}>
                              {hoveredMilestone.title}
                           </div>
                       </motion.div>
                    )}
                </div>
                <div className="text-right hidden md:block">
                     <div className="font-mono text-xs text-gray-500 tracking-widest mb-1">
                        SYSTEM TIME
                     </div>
                     <div className="font-mono text-3xl font-bold text-white tracking-widest tabular-nums">
                        {formatTime(currentTime)}
                     </div>
                     <div className="font-mono text-xs text-gray-500 tracking-widest mt-1">
                        {formatDate(currentTime)}
                     </div>
                </div>
            </div>

            {/* Bottom Bar HUD */}
            <div className="flex justify-between items-end">
                 <div className="pointer-events-auto">
                    <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-none border border-white/10 bg-black/40 px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white hover:text-black group"
                    style={{ borderColor: `${activeColor}44` }}
                    >
                    <ArrowLeftIcon weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                    <span>ABORT</span>
                    </Link>
                 </div>

                 <div className="flex flex-col gap-4 text-right">
                    <div className="hidden md:block">
                        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Target Sector</div>
                        <div
                          className="font-mono text-sm uppercase tracking-wider flex items-center justify-end gap-2 transition-colors duration-300"
                          style={{ color: activeColor }}
                        >
                             <GlobeHemisphereWestIcon /> {hoveredMilestone ? hoveredMilestone.type : 'ALL SECTORS'}
                        </div>
                    </div>
                    <div>
                        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Operation ID</div>
                        <div className="font-mono text-sm text-white uppercase tracking-wider flex items-center justify-end gap-2">
                             <CrosshairIcon className="animate-pulse" style={{ color: activeColor }} />
                             {hoveredMilestone ? `OP-${hoveredMilestone.title.substring(0, 8).replace(/\s/g, '-')}` : 'OP-TIMELINE'}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* Right Column: Timeline Content */}
      <div className="w-full lg:w-7/12 relative bg-[#050505] p-6 md:p-12 lg:p-24 overflow-y-auto">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-12 lg:left-24 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-16 pb-32">
            {milestones.map((milestone, index) => {
              const EventIcon = appIcons[milestone.icon] || StarIcon;
              const milestoneDate = new Date(milestone.date);
              const eventColor = getEventColor(milestone.type);
              const isHovered = hoveredMilestone === milestone;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative pl-12 group cursor-default"
                  onMouseEnter={() => setHoveredMilestone(milestone)}
                >
                  {/* Dot / Icon Container */}
                  <div
                    className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 -ml-4 bg-[#050505] border transition-all duration-300 z-10 ${isHovered ? 'scale-125 border-white' : 'border-white/20 scale-100'}`}
                    style={{ borderColor: isHovered ? eventColor : `${eventColor}44` }}
                  >
                    <EventIcon size={14} style={{ color: eventColor }} />
                  </div>

                  {/* Content Card */}
                  <div
                    className={`border p-6 transition-all duration-300 relative overflow-hidden ${isHovered ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/2'}`}
                  >
                    {/* Color Accent */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none rounded-full blur-3xl -mr-16 -mt-16 transition-colors duration-500"
                      style={{ backgroundColor: eventColor }}
                    />

                    <div className="flex flex-wrap items-center gap-4 mb-3 font-mono text-[10px] uppercase tracking-widest">
                      <span
                        className="px-2 py-1 flex items-center gap-1"
                        style={{
                          color: eventColor,
                          backgroundColor: `${eventColor}11`,
                        }}
                      >
                        <CalendarIcon size={12} />{' '}
                        {milestoneDate.toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <TagIcon size={12} /> {milestone.type}
                      </span>
                    </div>

                    <h2
                      className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3 transition-colors font-sans"
                    >
                      <span className={isHovered ? 'text-white' : 'text-gray-300'}>
                        {milestone.title}
                      </span>
                    </h2>

                    <p className="text-gray-400 font-sans leading-relaxed text-sm md:text-base">
                      {milestone.description}
                    </p>

                    {milestone.link && (
                      <div className="mt-6 pt-4 border-t border-white/5">
                        <Link
                          to={milestone.link}
                          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                          style={{ color: eventColor }}
                        >
                          Access Linked Asset &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default TimelinePage;
