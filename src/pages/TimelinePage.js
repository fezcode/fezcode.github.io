import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, TimerIcon } from '@phosphor-icons/react';
import { appIcons } from '../utils/appIcons';
import { motion } from 'framer-motion';
import useSeo from '../hooks/useSeo';
import colors from '../config/colors'; // Assuming colors is available for styling
import { useAchievements } from '../context/AchievementContext';

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

  return (
    <div className="py-16 sm:py-24 bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        {/* Back Link */}
        <Link
          to="/"
          className="group text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2 text-lg mb-8 transition-colors"
        >
          <ArrowLeftIcon
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />{' '}
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl mb-4 flex items-center text-white">
              <TimerIcon
                size={48}
                weight="duotone"
                className="mr-4 text-red-400"
              />
              <span className="text-gray-100">fc</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-100">timeline</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-500">[</span>
              <span className="text-gray-100">{milestones.length}</span>
              <span className="text-gray-500">]</span>
              {/*<span className="ml-4 text-2xl text-gray-500 bg-gray-800 px-3 py-1 rounded-full font-mono align-middle">*/}
              {/*  {milestones.length}*/}
              {/*</span>*/}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-mono">
              A journey through key milestones and achievements of Fez
              <span className="text-primary-400">codex</span>.
            </p>
          </div>
        </div>

        <hr className="border-gray-800 mb-12" />

        {loading ? (
          // Skeleton Loader
          <div className="relative pl-8 md:pl-20 py-8">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-800"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-10 flex items-start">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-700 absolute -left-2 md:-left-2.5 mt-2.5 animate-pulse"></div>
                <div className="flex-grow pl-8 md:pl-6">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-2 animate-pulse"></div>
                  {/* Date */}
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
                  {/* Title */}
                  <div className="h-4 bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
                  {/* Description line 1 */}
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  {/* Description line 2 */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Timeline Content
          <div className="relative pl-8 md:pl-20 py-8">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-800 hidden md:block"></div>
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-800 md:hidden"></div>
            {/* For smaller screens */}
            {milestones.map((milestone, index) => {
              const EventIcon = appIcons[milestone.icon] || StarIcon;
              const eventColor = getEventColor(milestone.type);
              const milestoneDate = new Date(milestone.date);
              const formattedDate = milestoneDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.div
                  key={index}
                  className="mb-10 flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Icon & Dot */}
                  <div className="flex-shrink-0 relative">
                    {/* Dot */}
                    <div
                      className="w-3 h-3 rounded-full absolute left-3 md:left-17 top-2.5"
                      style={{
                        backgroundColor: eventColor,
                        transform: 'translateX(-50%)',
                      }}
                    ></div>
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full border-2 absolute left-4 md:left-20 -top-1"
                      style={{
                        borderColor: eventColor,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        transform: 'translateX(-50%)',
                        color: eventColor,
                      }}
                    >
                      <EventIcon size={16} weight="bold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow pl-14 md:pl-28">
                    <p
                      className="text-sm text-gray-500 font-mono mb-1"
                      style={{ color: `${eventColor}90` }}
                    >
                      {' '}
                      {formattedDate}{' '}
                    </p>
                    <h2
                      className="text-xl font-bold font-mono text-gray-100 mb-2"
                      style={{ color: eventColor }}
                    >
                      {milestone.title}
                    </h2>
                    <p className="text-gray-400 font-mono leading-relaxed">
                      {' '}
                      {milestone.description}{' '}
                    </p>
                    {milestone.link && (
                      <a
                        href={milestone.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm mt-2 block"
                        style={{ color: `${eventColor}90` }}
                      >
                        Learn More &rarr;
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
