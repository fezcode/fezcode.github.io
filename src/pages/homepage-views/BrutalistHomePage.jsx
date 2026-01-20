import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  Cube,
  AppWindow,
  ArrowUpRight,
  Gear,
  Broadcast,
} from '@phosphor-icons/react';
import PostTile from '../../components/PostTile';
import ProjectTile from '../../components/ProjectTile';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../../utils/LocalStorageManager';
import SplashText from '../../components/SplashText';
import { useAchievements } from '../../context/AchievementContext';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`;

const StatusPill = () => {
  const [time, setTime] = useState('');
  const { config } = useSiteConfig();
  const { isSplashTextEnabled, fezcodexTheme, setFezcodexTheme } = useVisualSettings();
  const { showAchievementToast } = useAchievements();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-[#111] border border-white/10 p-4 rounded-lg shadow-2xl backdrop-blur-md mb-2 min-w-[200px]"
          >
            <div className="flex flex-col gap-3 text-xs font-mono">
              <div className="flex justify-between items-center text-gray-400">
                <span>KERNEL</span>
                <span className="text-emerald-500">{config?.kernel?.codename || 'UNKNOWN'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>TIME</span>
                <span>{time}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />

              <div className="flex justify-between items-center text-gray-400">
                <span>THEME</span>
                <button
                  onClick={() => setFezcodexTheme(fezcodexTheme === 'brutalist' ? 'luxe' : 'brutalist')}
                  className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded hover:bg-emerald-500 hover:text-black transition-colors uppercase"
                >
                  {fezcodexTheme}
                </button>
              </div>

              <div className="h-px bg-white/10 my-1" />

              {isSplashTextEnabled && (
                <Link to="/settings#visual-matrix" className="flex items-center justify-between group hover:text-white transition-colors text-gray-500">
                  <span>SPLASH_TXT</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">ACTIVE</span>
                </Link>
              )}
              {showAchievementToast && (
                <Link to="/settings#achievements" className="flex items-center justify-between group hover:text-white transition-colors text-gray-500">
                  <span>ACHIEVEMENTS</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">ON</span>
                </Link>
              )}
               <Link to="/welcome" className="flex items-center justify-between group hover:text-white transition-colors text-gray-500 pt-1 border-t border-white/5 mt-1">
                  <span>SYSTEM_INTRO</span>
                  <ArrowRight />
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#111] border border-white/10 hover:border-emerald-500/50 hover:bg-[#151515] text-gray-400 hover:text-emerald-500 px-4 py-2.5 rounded-full backdrop-blur-md transition-all group"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System_Status</span>
        </div>
        <Gear weight="fill" className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>
    </div>
  );
};

const Hero = () => {
  const { config } = useSiteConfig();
  const heroTitle = config?.hero?.title || 'Fezcodex';
  const heroTagline = config?.hero?.tagline || 'A digital vault of experimental software...';

  const mainTitle = heroTitle.toLowerCase().endsWith('codex')
    ? heroTitle.slice(0, -5)
    : heroTitle;
  const subTitle = heroTitle.toLowerCase().endsWith('codex') ? 'codex' : '';

  return (
    <div className="relative pt-40 pb-32 md:pt-52 md:pb-48 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-8 hover:bg-white/10 transition-colors cursor-default">
            <Broadcast size={12} className="text-emerald-500" />
            <span>Transmission_Received</span>
          </div>

          <h1 className="text-[14vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter text-white uppercase mb-6 select-none relative group">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">{mainTitle}</span>
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-800">{subTitle}</span>
            <div className="absolute -inset-x-8 -inset-y-4 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
          </h1>

          <div className="h-12 flex items-center justify-center mb-8 w-full max-w-2xl">
             <div className="opacity-80 scale-90 md:scale-100">
               <SplashText />
             </div>
          </div>

          <p className="max-w-xl text-lg md:text-xl text-gray-400 font-sans leading-relaxed text-balance mx-auto mb-10">
            {heroTagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="group relative px-8 py-3.5 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden rounded-sm"
            >
              <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                Explore Archives
                <ArrowRight weight="bold" />
              </span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 border border-white/20 hover:border-white text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors"
            >
              About Me
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative calm background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />
    </div>
  );
};

const QuickLinks = () => {
  const favorites = [
    { title: 'Logic Architect', to: '/apps/logic-architect', icon: Cube, color: 'text-emerald-400' },
    { title: 'Fezynth', to: '/apps/fezynth', icon: Broadcast, color: 'text-purple-400' },
    { title: 'Notepad', to: '/apps/notepad', icon: AppWindow, color: 'text-amber-200' },
    { title: 'Sprite Editor', to: '/apps/sprite-editor', icon: Terminal, color: 'text-rose-500' },
  ];

  return (
    <div className="py-16 border-t border-b border-white/5 bg-white/[0.01]">
       <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
            System_Favorites
          </h3>
          <Link to="/apps" className="text-xs font-mono text-gray-600 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2">
            View_All_Apps <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((app) => (
            <Link
              key={app.to}
              to={app.to}
              className="group p-5 border border-white/5 bg-[#0a0a0a] hover:bg-[#111] hover:border-white/20 transition-all duration-300 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden"
            >
               <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${app.color}`}>
                  <app.icon size={48} weight="duotone" />
               </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${app.color} group-hover:text-white transition-colors z-10`}>
                {app.title}
              </span>
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono text-gray-600 group-hover:text-gray-400 uppercase tracking-wider">Execute</span>
                <ArrowUpRight size={14} className="text-gray-700 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ num, title, link, linkText }) => (
  <div className="flex items-end justify-between mb-10 pb-4 border-b border-white/10">
    <div className="flex flex-col gap-2">
      <span className="font-mono text-emerald-500 text-xs font-bold tracking-[0.2em]">
        0{num} {'//'}
      </span>
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
        {title}
      </h2>
    </div>
    {link && (
      <Link
        to={link}
        className="hidden md:flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors px-4 py-2 border border-transparent hover:border-white/10 rounded-full"
      >
        {linkText}
        <ArrowRight />
      </Link>
    )}
  </div>
);

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { projects: pinnedProjects, loading: loadingProjects } =
    useProjects(true);

  const [homepageSectionOrder] = usePersistentState(
    KEY_HOMEPAGE_SECTION_ORDER,
    ['projects', 'blogposts'],
  );

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (response.ok) {
          const allPostsData = await response.json();
          const seriesMap = new Map();
          const individualPosts = [];
          allPostsData.forEach((item) => {
            if (item.series) {
              seriesMap.set(item.slug, {
                ...item,
                isSeries: true,
                posts: item.series.posts,
              });
            } else {
              individualPosts.push(item);
            }
          });
          const combinedItems = [
            ...Array.from(seriesMap.values()),
            ...individualPosts,
          ];
          combinedItems.sort((a, b) => {
            const dateA = new Date(
              a.isSeries ? a.updated || a.date : a.updated || a.date,
            );
            const dateB = new Date(
              b.isSeries ? b.updated || b.date : b.updated || b.date,
            );
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-white font-mono text-xs uppercase tracking-[0.3em] opacity-50">
           <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <span>Loading_System...</span>
        </div>
      </div>
    );
  }

  const renderSection = (sectionName, index) => {
    const sectionNum = String(index + 1);

    switch (sectionName) {
      case 'projects':
        return (
          <section className="py-20">
            <SectionHeader
              num={sectionNum}
              title="Selected Works"
              link="/projects"
              linkText="Full_Archive"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedProjects.map((project) => (
                <div key={project.slug} className="group">
                  <ProjectTile project={project} />
                </div>
              ))}
            </div>
             <div className="mt-8 md:hidden flex justify-center">
                 <Link to="/projects" className="text-xs font-mono uppercase tracking-widest text-gray-500 underline">View Full Archive</Link>
             </div>
          </section>
        );
      case 'blogposts':
        return (
          <section className="py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <SectionHeader
                  num={sectionNum}
                  title="Latest Transmissions"
                  link="/blog"
                  linkText="Read_All"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
                  {posts.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <PostTile post={item} />
                    </motion.div>
                  ))}
                </div>
                 <div className="mt-8 md:hidden flex justify-center">
                     <Link to="/blog" className="text-xs font-mono uppercase tracking-widest text-gray-500 underline">Read All Posts</Link>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-10 pt-4 lg:pt-0">
                 <div className="p-6 border border-white/5 rounded-lg bg-white/[0.02]">
                    <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                       <Terminal size={14} /> Quick_Navigation
                    </h3>
                    <div className="space-y-2">
                        <ExploreLink to="/apps" title="Tools & Apps" icon={AppWindow} />
                        <ExploreLink to="/roadmap" title="Fezzilla Hub" icon={Cube} />
                        <ExploreLink to="/commands" title="CLI Terminal" icon={Terminal} />
                    </div>
                 </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
      <Seo
        title="Fezcodex | Home"
        description="A digital garden of code, thoughts, and experiments."
        keywords={['Fezcodex', 'blog', 'portfolio', 'developer', 'brutalist']}
      />

      {/* Background Noise - Lower opacity for calmer feel */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <StatusPill />

      <Hero />

      <QuickLinks />

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {homepageSectionOrder.map((sectionName, idx) => (
          <React.Fragment key={sectionName}>
            {renderSection(sectionName, idx)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ExploreLink = ({ to, title, icon: Icon }) => (
  <Link
    to={to}
    className="group flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="text-gray-600 group-hover:text-emerald-500 transition-colors">
          <Icon size={18} />
      </div>
      <span className="font-bold uppercase tracking-wider text-xs text-gray-400 group-hover:text-white transition-colors">
        {title}
      </span>
    </div>
    <ArrowRight
      weight="bold"
      size={14}
      className="text-gray-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
    />
  </Link>
);

export default HomePage;
