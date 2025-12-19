import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TerminalWindow,
  Cpu,
  Article,
  RocketLaunch,
  Terminal, // For "Explore Commands"
  Cube,     // For "Explore Fezzilla"
  AppWindow // For "Explore Apps"
} from '@phosphor-icons/react';
import PostItem from '../components/PostItem';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import useSeo from '../hooks/useSeo';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../utils/LocalStorageManager';

const Hero = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentDateTime(now.toLocaleString('en-GB', options).replace(/,/, ''));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
       {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/40 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/30 border border-primary-500/30 text-white text-sm mb-6 font-mono">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
            {currentDateTime}
          </div>
          <h1 className="text-5xl md:text-7xl  tracking-tight text-white mb-6">
            Welcome to fez<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">codex</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto font-mono">
            A digital garden of code, thoughts, and experiments.
            Documenting the journey through software engineering.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/projects"
              className="group flex items-center gap-2 px-4 py-2 transition-all duration-300 bg-white text-black border-black border-2 font-mono uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-gray-900 hover:border-rose-500 rounded-none shadow-none"
            >
              <RocketLaunch weight="bold" className="group-hover:-translate-x-1 transition-transform" />
              Explore Projects
            </Link>
            <Link to="/about"
              className="group flex items-center gap-2 px-4 py-2 transition-all duration-300 bg-white text-black border-black border-2 font-mono uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-gray-900 hover:border-emerald-500 rounded-none shadow-none"
            >
              <ArrowRight weight="bold" className="group-hover:-translate-x-1 transition-transform" />
              About Me
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, link, linkText }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon size={24} className="text-green-300" />
      </div>
      <h2 className="text-2xl text-white font-arvo">{title}</h2>
    </div>
    {link && (
      <Link to={link} className="group flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mt-4 sm:mt-0">
        {linkText} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

// New component for the side navigation links
const ExploreLinkCard = ({ to, title, description, Icon }) => (
  <Link
    to={to}
    className="relative p-6 rounded-2xl bg-gradient-to-br from-primary-900/20 to-transparent border border-primary-500/20 group hover:border-primary-400 transition-colors duration-300 overflow-hidden flex flex-col"
  >
    {/* Optional: Background glitch effect on hover */}
    <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
    <div className="relative z-10"> {/* Wrap icon and text for better control */}
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon size={28} className="text-primary-400 group-hover:scale-110 transition-transform" />}
        <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
    </div>
    <div className="relative z-10 text-right"> {/* Position arrow at the end of the content flow */}
        <span className="inline-flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            Explore <ArrowRight size={20} weight="bold" className="ml-1" />
        </span>
    </div>
  </Link>
);

const HomePage = () => {
  useSeo({
    title: 'Fezcodex | Home',
    description: 'Exploring the world of code, one post at a time.',
    keywords: ['Fezcodex', 'blog', 'portfolio', 'developer', 'software engineer'],
  });

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { projects: pinnedProjects, loading: loadingProjects } = useProjects(true);
  const [activeProject, setActiveProject] = useState(null);

  // Use persistent state for homepage section order
  const [homepageSectionOrder] = usePersistentState(KEY_HOMEPAGE_SECTION_ORDER, ['projects', 'blogposts']);

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (response.ok) {
          const allPostsData = await response.json();
          // Process posts logic (same as before)
          const seriesMap = new Map();
          const individualPosts = [];
          allPostsData.forEach((item) => {
            if (item.series) {
              seriesMap.set(item.slug, { ...item, isSeries: true, posts: item.series.posts });
            } else {
              individualPosts.push(item);
            }
          });
          const combinedItems = [...Array.from(seriesMap.values()), ...individualPosts];
          combinedItems.sort((a, b) => {
             const dateA = new Date(a.isSeries ? (a.updated || a.date) : (a.updated || a.date));
             const dateB = new Date(b.isSeries ? (b.updated || b.date) : (b.updated || b.date));
             return dateB - dateA;
          });
          setPosts(combinedItems);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPostSlugs();
  }, []);

  if (loadingProjects || loadingPosts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-primary-400 font-mono text-sm animate-pulse">INITIALIZING...</div>
        </div>
      </div>
    );
  }

  // Helper function to render a section
  const renderSection = (sectionName) => {
    switch (sectionName) {
      case 'projects':
        return (
          <section className="mb-24 mt-8">
            <SectionHeader icon={Cpu} title="Pinned Projects" link="/projects" linkText="View all projects" />
            <div className="flex flex-col border-t border-white/10">
              {pinnedProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  isActive={activeProject?.slug === project.slug}
                  onHover={setActiveProject}
                />
              ))}
            </div>
          </section>
        );
      case 'blogposts':
        return (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Main Feed */}
            <div className="lg:col-span-8">
               <SectionHeader icon={Article} title="Latest Blogposts" link="/blog" linkText="Read archive" />
               <div className="space-y-4">
                  {posts.slice(0, 5).map((item, index) => (
                     <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                     >
                       {item.isSeries ? (
                          <PostItem
                            slug={`series/${item.slug}`}
                            title={item.title}
                            date={item.date}
                            updatedDate={item.updated}
                            category="series"
                            isSeries={true}
                          />
                        ) : (
                          <PostItem
                            slug={item.slug}
                            title={item.title}
                            date={item.date}
                            updatedDate={item.updated}
                            category={item.category}
                            series={item.series}
                            seriesIndex={item.seriesIndex}
                          />
                        )}
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* Side Widgets */}
            <div className="lg:col-span-4 space-y-4 lg:pt-14 sm:pb-14">
              <ExploreLinkCard
                to="/apps"
                title="Explore Apps"
                description="Discover a collection of custom-built web applications and tools."
                Icon={AppWindow}
              />
              <ExploreLinkCard
                to="/roadmap"
                title="Explore Fezzilla"
                description="Dive into the roadmap and development progress of Fezcodex."
                Icon={Cube}
              />
              <ExploreLinkCard
                to="/commands"
                title="Explore Commands"
                description="Learn about available commands and system interactions."
                Icon={Terminal}
              />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Hero />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        {homepageSectionOrder.map((sectionName) => (
          <React.Fragment key={sectionName}>
            {renderSection(sectionName)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
