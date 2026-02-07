import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon,
  TerminalIcon,
  CubeIcon,
  AppWindowIcon,
  ArrowUpRightIcon,
  GearIcon,
  BroadcastIcon,
  LightningIcon,
  CpuIcon,
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

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`;

const StatusPill = () => {
  const [time, setTime] = useState('');
  const { config } = useSiteConfig();
  const { isSplashTextEnabled, fezcodexTheme, setFezcodexTheme } =
    useVisualSettings();
  const { showAchievementToast } = useAchievements();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () =>
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-0">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-black border-2 border-white p-4 mb-4 min-w-[240px] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
          >
            <div className="flex flex-col gap-3 text-xs font-mono uppercase tracking-wider">
              <div className="flex justify-between items-center text-gray-400">
                <span>VERSION</span>
                <span className="text-white bg-emerald-600 px-1">
                  {config?.kernel?.codename || 'v1.0.0'}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>LOCAL TIME</span>
                <span className="text-white">{time}</span>
              </div>
              <div className="h-px bg-transparent border-t border-dashed border-blue-100/30 my-1" />

              <div className="flex justify-between items-center text-gray-400">
                <span>THEME</span>
                <button
                  onClick={() =>
                    setFezcodexTheme(
                      fezcodexTheme === 'brutalist' ? 'luxe' : 'brutalist',
                    )
                  }
                  className="text-[10px] border border-white/40 text-white px-2 py-0.5 hover:bg-white hover:text-black transition-colors"
                >
                  [{fezcodexTheme}]
                </button>
              </div>

              <div className="h-px bg-transparent border-t border-dashed border-blue-100/30 my-1" />

              {isSplashTextEnabled && (
                <Link
                  to="/settings#visual-matrix"
                  className="flex items-center justify-between group hover:text-white transition-colors text-gray-500"
                >
                  <span>SPLASH</span>
                  <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
                </Link>
              )}
              {showAchievementToast && (
                <Link
                  to="/settings#achievements"
                  className="flex items-center justify-between group hover:text-white transition-colors text-gray-500"
                >
                  <span>ACHIEVEMENTS</span>
                  <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
                </Link>
              )}
              <Link
                to="/welcome"
                className="flex items-center justify-between group hover:bg-white hover:text-black transition-colors text-gray-500 pt-2 mt-1 border-t-2 border-white/10 px-1 -mx-1"
              >
                <span>INTRO</span>
                <ArrowRightIcon weight="bold" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-black border-2 border-white hover:bg-white hover:text-black text-white px-6 py-3 transition-all group shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <div className="flex items-center gap-2 text-sm font-mono uppercase font-bold tracking-widest">
          <span
            className={`w-2 h-2 bg-emerald-500 ${!isOpen && 'animate-pulse'}`}
          />
          <span>STATUS</span>
        </div>
        <GearIcon
          weight="fill"
          className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
    </div>
  );
};

const Hero = () => {
  const { config } = useSiteConfig();
  const heroTitle = config?.hero?.title || 'Fezcodex';
  const heroTagline =
    config?.hero?.tagline || 'A digital vault of experimental software...';

  const mainTitle = heroTitle.toLowerCase().endsWith('codex')
    ? heroTitle.slice(0, -5)
    : heroTitle;
  const subTitle = heroTitle.toLowerCase().endsWith('codex') ? 'codex' : '';

  return (
    <div className="relative pt-32 pb-24 md:pt-48 md:pb-36 border-b border-dashed border-blue-100/20 bg-[#080808]">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          className="flex flex-col items-start border-l-4 border-emerald-600 pl-6 md:pl-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-[0.1em] mb-8 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(50,205,50,0.5)]">
            <BroadcastIcon size={16} weight="bold" />
            <span>ONLINE</span>
          </div>

          <h1 className="text-[15vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter text-white uppercase mb-6 relative select-none mix-blend-difference">
            <span>{mainTitle}</span>
            <span className="text-emerald-600 opacity-50">{subTitle}</span>
          </h1>

          <div className="h-16 flex items-center justify-start mb-10 w-full max-w-3xl border-t border-b border-dashed border-blue-100/20 py-4">
            <div className="opacity-90 w-full">
              <SplashText />
            </div>
          </div>

          <p className="max-w-2xl text-xl md:text-2xl text-gray-400 font-mono leading-relaxed text-balance mb-12 border-l border-blue-100/20 pl-6">
            {heroTagline}
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              to="/projects"
              className="group relative px-10 py-4 bg-white text-black font-bold font-mono uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <span className="relative flex items-center gap-3">
                VIEW ARCHIVE
                <ArrowRightIcon weight="bold" />
              </span>
            </Link>
            <Link
              to="/about"
              className="group px-10 py-4 border-2 border-white text-white font-bold font-mono uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
            >
              <span className="flex items-center gap-2">
                ABOUT ME
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  ?
                </span>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-0 p-4 font-mono text-[10px] text-gray-700 opacity-50 hidden md:block">
        COORDS: {Math.random().toFixed(4)}, {Math.random().toFixed(4)}
      </div>
    </div>
  );
};

const QuickLinks = () => {
  const favorites = [
    {
      title: 'Logic Architect',
      to: '/apps/logic-architect',
      icon: CubeIcon,
      desc: 'Circuit Design',
    },
    {
      title: 'Fezynth',
      to: '/apps/fezynth',
      icon: BroadcastIcon,
      desc: 'Audio Synthesis',
    },
    {
      title: 'Notepad',
      to: '/apps/notepad',
      icon: AppWindowIcon,
      desc: 'Text Buffer',
    },
    {
      title: 'Sprite Editor',
      to: '/apps/sprite-editor',
      icon: TerminalIcon,
      desc: 'Pixel Matrix',
    },
  ];

  return (
    <div className="border-b border-dashed border-blue-100/20 bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-blue-100/20">
        {favorites.map((app, idx) => (
          <Link
            key={app.to}
            to={app.to}
            className="group relative p-8 hover:bg-white hover:text-black transition-colors duration-200 h-48 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <app.icon
                size={32}
                weight="fill"
                className="text-gray-500 group-hover:text-black transition-colors"
              />
              <span className="font-mono text-[10px] opacity-40">
                0{idx + 1}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider mb-1 group-hover:translate-x-1 transition-transform">
                {app.title}
              </h3>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 font-mono uppercase tracking-tight">
                {app.desc}
              </p>
            </div>

            <ArrowUpRightIcon
              size={24}
              weight="bold"
              className="absolute top-4 right-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ num, title, link, linkText }) => (
  <div className="flex items-end justify-between mb-12 border-b-4 border-white pb-6">
    <div className="flex items-baseline gap-4">
      <span className="bg-emerald-600 text-black font-mono text-lg font-bold px-3 py-1 -skew-x-12">
        0{num}
      </span>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
        {title}
      </h2>
    </div>
    {link && (
      <Link
        to={link}
        className="hidden md:flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-white hover:text-emerald-400 transition-colors"
      >
        [{linkText}]
        <ArrowRightIcon weight="bold" />
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
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-white border-t-emerald-500 rounded-none animate-spin" />
          <span className="font-mono text-sm uppercase tracking-[0.3em] animate-pulse">
            System_Boot...
          </span>
        </div>
      </div>
    );
  }

  const renderSection = (sectionName, index) => {
    const sectionNum = String(index + 1);

    switch (sectionName) {
      case 'projects':
        return (
          <section className="py-24">
            <SectionHeader
              num={sectionNum}
              title="Selected Works"
              link="/projects"
              linkText="FULL ARCHIVE"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pinnedProjects.map((project) => (
                <div
                  key={project.slug}
                  className="group border border-white/10 hover:border-emerald-500/50 transition-colors p-1 bg-[#0a0a0a]"
                >
                  <ProjectTile project={project} />
                </div>
              ))}
            </div>
            <div className="mt-12 md:hidden flex justify-center">
              <Link
                to="/projects"
                className="px-6 py-3 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </section>
        );
      case 'blogposts':
        return (
          <section className="py-24 border-t border-dashed border-blue-100/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <SectionHeader
                  num={sectionNum}
                  title="LATEST LOGS"
                  link="/blog"
                  linkText="READ ALL"
                />
                <div className="flex flex-col gap-6">
                  {posts.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-b border-white/5 pb-6 last:border-0"
                    >
                      <PostTile post={item} />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12 md:hidden flex justify-center">
                  <Link
                    to="/blog"
                    className="px-6 py-3 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
                  >
                    ReadAll Logs
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-12 pt-4 lg:pt-0">
                <div className="p-8 border-2 border-white/10 bg-[#0a0a0a] relative overflow-hidden group hover:border-white/30 transition-colors">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <TerminalIcon size={64} />
                  </div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-500 mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500" /> NAVIGATION
                  </h3>
                  <div className="space-y-1">
                    <ExploreLink to="/apps" title="APPS" icon={AppWindowIcon} />
                    <ExploreLink
                      to="/roadmap"
                      title="ROADMAP"
                      icon={CubeIcon}
                    />
                    <ExploreLink
                      to="/terminal"
                      title="TERMINAL"
                      icon={TerminalIcon}
                    />
                    <ExploreLink to="/about" title="ABOUT" icon={CpuIcon} />
                  </div>
                </div>

                <div className="p-6 border border-dashed border-blue-100/20">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-xs uppercase mb-4">
                    <LightningIcon weight="fill" className="text-yellow-500" />
                    <span>TIP</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-mono">
                    Try navigating with keyboard shortcuts. Press{' '}
                    <span className="text-white border border-white/20 px-1">
                      CMD/CTRL + K
                    </span>{' '}
                    to view the command palette.
                  </p>
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black relative overflow-x-hidden font-sans">
      <Seo
        title="Fezcodex // ROOT"
        description="Experimental software vault and digital garden."
        keywords={[
          'Fezcodex',
          'brutalist',
          'portfolio',
          'experimental',
          'react',
        ]}
      />

      {/* Background Noise */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <StatusPill />

      <Hero />

      <QuickLinks />

      <div className="mx-auto max-w-7xl px-6 pb-32">
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
    className="group flex items-center justify-between p-3 border border-transparent hover:border-white/20 hover:bg-white/5 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-500 group-hover:text-emerald-500 transition-colors">
        <Icon size={20} />
      </div>
      <span className="font-bold font-mono uppercase tracking-wider text-xs text-gray-300 group-hover:text-white transition-colors">
        {title}
      </span>
    </div>
    <ArrowRightIcon
      weight="bold"
      size={14}
      className="text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
    />
  </Link>
);

export default HomePage;
