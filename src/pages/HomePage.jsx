import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  Cube,
  AppWindow,
  ArrowUpRight,
} from '@phosphor-icons/react';
import PostTile from '../components/PostTile';
import ProjectTile from '../components/ProjectTile';
import { useProjects } from '../utils/projectParser';
import useSeo from '../hooks/useSeo';
import usePersistentState from '../hooks/usePersistentState';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../utils/LocalStorageManager';
import SplashText from '../components/SplashText';
import {useAchievements} from "../context/AchievementContext";

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`;

const Hero = () => {
  const [time, setTime] = useState('');
  const { config } = useSiteConfig();
  const { isSplashTextEnabled } = useVisualSettings();
  const { showAchievementToast } = useAchievements();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const heroTitle = config?.hero?.title || 'Fezcodex';

  const heroTagline = config?.hero?.tagline || 'A digital vault of experimental software...';

  // Split title if it contains codex

  const mainTitle = heroTitle.toLowerCase().endsWith('codex')

    ? heroTitle.slice(0, -5)

    : heroTitle;

  const subTitle = heroTitle.toLowerCase().endsWith('codex') ? 'codex' : '';

  return (

    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/10">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 z-20">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span>System: {heroTitle}</span>
            {config?.kernel && (
                <span>Kernel: {config.kernel.codename}</span>
            )}
          </div>
          <Link
            to="/welcome"
            className="inline-flex items-center gap-2 text-emerald-500 hover:text-white transition-colors group"
          >
            <span className="h-1 w-1 bg-current" />
            <span>Show_Welcome</span>
          </Link>
        </div>
          <div className="text-right flex flex-col items-end gap-1">
          <span>Local_Time: {time}</span>
            {isSplashTextEnabled && (
              <Link
                to="/settings#visual-matrix"
                className="text-orange-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
              >
                [Splash Text On // Go To Settings]
              </Link>
            )}
            {showAchievementToast && (
              <Link
                to="/settings#achievements"
                className="text-orange-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
              >
                [Achievement Toasts On // Go To Settings]
              </Link>
            )}
            <div className="flex items-center gap-2 justify-end mt-1 text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter text-white uppercase mb-8 relative">
            {mainTitle}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              {subTitle}
            </span>
            <SplashText />
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mt-12">
            <p className="max-w-xl text-lg md:text-xl text-gray-400 font-sans leading-relaxed text-wrap">
              {heroTagline}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-all hover:bg-emerald-400"
              >
                Explore Archives
                <ArrowRight
                  weight="bold"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/about"
                className="group flex items-center gap-3 border border-white/20 px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs text-white transition-all hover:bg-white/5"
              >
                About Me
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const QuickLinks = () => {
  const favorites = [
    { title: 'Logic Architect', to: '/apps/logic-architect', color: 'text-emerald-500' },
    { title: 'Fezynth', to: '/apps/fezynth', color: 'text-purple-400' },
    { title: 'Notepad', to: '/apps/notepad', color: 'text-amber-200' },
    { title: 'Sprite Editor', to: '/apps/sprite-editor', color: 'text-rose-500' },
  ];

  return (
    <div className="py-12 border-b border-white/10">
      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 mb-6 px-2">
        {'//'} SOME_FAVORITES
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favorites.map((app) => (
          <Link
            key={app.to}
            to={app.to}
            className="group p-4 border border-white/5 bg-white/[0.02] hover:bg-white hover:border-white transition-all flex flex-col gap-2"
          >
            <span className={`text-[10px] font-black uppercase tracking-widest ${app.color} group-hover:text-black transition-colors`}>
              {app.title}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-gray-600 group-hover:text-black/50 uppercase">RUN THE APP</span>
              <ArrowUpRight size={12} className="text-gray-700 group-hover:text-black transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ num, title, link, linkText }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-emerald-500 text-sm font-bold tracking-widest">
        {'//'} {num}
      </span>
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
        {title}
      </h2>
    </div>{' '}
    {link && (
      <Link
        to={link}
        className="group flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
      >
        {linkText}{' '}
        <ArrowUpRight
          weight="bold"
          className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    )}
  </div>
);

const HomePage = () => {
  useSeo({
    title: 'Fezcodex | Home',
    description: 'A digital garden of code, thoughts, and experiments.',
    keywords: ['Fezcodex', 'blog', 'portfolio', 'developer', 'brutalist'],
  });

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
        <div className="flex flex-col items-center gap-6 text-white font-mono text-xs uppercase tracking-[0.3em] max-w-md text-center">
          <div className="h-px w-32 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white animate-progress origin-left"></div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Initialising_System</span>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (sectionName, index) => {
    const sectionNum = String(index + 1).padStart(2, '0');

    switch (sectionName) {
      case 'projects':
        return (
          <section className="py-24 border-b border-white/10">
            <SectionHeader
              num={sectionNum}
              title="Works"
              link="/projects"
              linkText="View all entries"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {pinnedProjects.map((project) => (
                <div key={project.slug} className="bg-[#050505]">
                  <ProjectTile project={project} />
                </div>
              ))}
            </div>
          </section>
        );
      case 'blogposts':
        return (
          <section className="py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
              <div className="lg:col-span-8">
                <SectionHeader
                  num={sectionNum}
                  title="Posts"
                  link="/blog"
                  linkText="Read archive"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="lg:col-span-4 space-y-12">
                <div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">
                    {'//'} QUICK_ACCESS
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <ExploreLink
                      to="/apps"
                      title="Tools & Apps"
                      icon={AppWindow}
                    />
                    <ExploreLink
                      to="/roadmap"
                      title="Fezzilla Hub"
                      icon={Cube}
                    />
                    <ExploreLink
                      to="/commands"
                      title="CLI Terminal"
                      icon={Terminal}
                    />
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black relative">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <Hero />

      <div className="mx-auto max-w-7xl px-6">
        <QuickLinks />
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
    className="group flex items-center justify-between border border-white/10 bg-white/5 p-6 transition-all hover:bg-white hover:text-black"
  >
    <div className="flex items-center gap-4">
      <Icon size={20} weight="bold" />
      <span className="font-bold uppercase tracking-widest text-xs">
        {title}
      </span>
    </div>
    <ArrowRight
      weight="bold"
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    />
  </Link>
);

export default HomePage;
