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
  SpeakerHighIcon,
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

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.22 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const StatusPill = () => {
  const [time, setTime] = useState('');
  const { config } = useSiteConfig();
  const {
    isSplashTextEnabled,
    fezcodexTheme,
    setFezcodexTheme,
    isSyntaxSpriteEnabled,
    toggleSyntaxSprite,
  } = useVisualSettings();
  const { showAchievementToast } = useAchievements();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () =>
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const cycleTheme = () => {
    const order = ['brutalist', 'luxe', 'terracotta'];
    const next = order[(order.indexOf(fezcodexTheme) + 1) % order.length];
    setFezcodexTheme(next);
  };

  const playAttackSound = () => {
    const audio = new Audio('/sounds/faah.mp3');
    audio.play().catch((e) => console.error('Audio play failed', e));
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-0">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-[#F3ECE0] border border-[#1A1613] p-4 mb-4 min-w-[240px] shadow-[8px_8px_0px_0px_rgba(26,22,19,0.08)] relative overflow-hidden"
          >
            <div className="flex flex-col gap-3 text-xs font-mono uppercase tracking-wider">
              <div className="flex justify-between items-center text-[#2E2620]/70">
                <span>VERSION</span>
                <span className="text-[#F3ECE0] bg-[#9E4A2F] px-1">
                  {config?.kernel?.codename || 'v1.0.0'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#2E2620]/70">
                <span>LOCAL TIME</span>
                <span className="text-[#1A1613]">{time}</span>
              </div>
              <div className="h-px border-t border-dashed border-[#1A161320] my-1" />

              <div className="flex justify-between items-center text-[#2E2620]/70">
                <span>AUDIO</span>
                <button
                  onClick={playAttackSound}
                  className="text-[10px] border border-[#1A161320] text-[#1A1613] px-2 py-0.5 hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors flex items-center gap-2"
                >
                  <span>[ATTACK!!!]</span>
                  <SpeakerHighIcon size={12} weight="fill" />
                </button>
              </div>

              <div className="flex justify-between items-center text-[#2E2620]/70">
                <span>THEME</span>
                <button
                  onClick={cycleTheme}
                  className="text-[10px] border border-[#1A161320] text-[#1A1613] px-2 py-0.5 hover:bg-[#C96442] hover:text-[#F3ECE0] hover:border-[#C96442] transition-colors"
                >
                  [{fezcodexTheme.toUpperCase()}]
                </button>
              </div>

              <div className="flex justify-between items-center text-[#2E2620]/70">
                <span>BUDDY</span>
                <button
                  onClick={toggleSyntaxSprite}
                  className="text-[10px] border border-[#1A161320] text-[#1A1613] px-2 py-0.5 hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors"
                >
                  [{isSyntaxSpriteEnabled ? 'ACTIVE' : 'STOWED'}]
                </button>
              </div>

              <div className="h-px border-t border-dashed border-[#1A161320] my-1" />

              {isSplashTextEnabled && (
                <Link
                  to="/settings#visual-matrix"
                  className="flex items-center justify-between hover:text-[#1A1613] transition-colors text-[#2E2620]/60"
                >
                  <span>SPLASH</span>
                  <div className="w-2 h-2 bg-[#6B8E23] animate-pulse" />
                </Link>
              )}
              {showAchievementToast && (
                <Link
                  to="/settings#achievements"
                  className="flex items-center justify-between hover:text-[#1A1613] transition-colors text-[#2E2620]/60"
                >
                  <span>ACHIEVEMENTS</span>
                  <div className="w-2 h-2 bg-[#6B8E23] animate-pulse" />
                </Link>
              )}
              <Link
                to="/welcome"
                className="flex items-center justify-between hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors text-[#2E2620]/60 pt-2 mt-1 border-t border-[#1A161320] px-1 -mx-1"
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
        className="flex items-center gap-3 bg-[#F3ECE0] border border-[#1A1613] hover:bg-[#1A1613] hover:text-[#F3ECE0] text-[#1A1613] px-6 py-3 transition-all group shadow-[4px_4px_0px_0px_#1A1613] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <div className="flex items-center gap-2 text-sm font-mono uppercase font-bold tracking-widest">
          <span className={`w-2 h-2 bg-[#6B8E23] ${!isOpen && 'animate-pulse'}`} />
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
    <div className="relative pt-32 pb-24 md:pt-48 md:pb-36 border-b border-[#1A161320] bg-[#F3ECE0]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          className="flex flex-col items-start border-l-2 border-[#C96442] pl-6 md:pl-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#C96442] text-[#F3ECE0] text-xs font-mono font-bold uppercase tracking-[0.1em] mb-8">
            <BroadcastIcon size={16} weight="bold" />
            <span>ONLINE</span>
          </div>

          <h1 className="text-[15vw] md:text-[11vw] font-fraunces italic leading-[0.82] tracking-tighter text-[#1A1613] mb-6 relative select-none">
            <span>{mainTitle}</span>
            <span className="text-[#C96442]">{subTitle}</span>
            <span className="text-[#C96442] font-black">.</span>
          </h1>

          <div className="h-16 flex items-center justify-start mb-10 w-full max-w-3xl border-t border-b border-dashed border-[#1A161320] py-4">
            <div className="opacity-90 w-full">
              <SplashText />
            </div>
          </div>

          <p className="max-w-2xl text-xl md:text-2xl text-[#2E2620] font-fraunces leading-relaxed text-balance mb-12 border-l-2 border-[#B88532]/40 pl-6">
            {heroTagline}
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              to="/projects"
              className="group relative px-10 py-4 bg-[#1A1613] text-[#F3ECE0] font-bold font-mono uppercase tracking-widest text-sm hover:bg-[#C96442] transition-colors shadow-[6px_6px_0px_0px_rgba(26,22,19,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <span className="relative flex items-center gap-3">
                VIEW ARCHIVE
                <ArrowRightIcon weight="bold" />
              </span>
            </Link>
            <Link
              to="/about"
              className="group px-10 py-4 border border-[#1A1613] text-[#1A1613] font-bold font-mono uppercase tracking-widest text-sm hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-all"
            >
              <span className="flex items-center gap-2">
                ABOUT ME
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">?</span>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-0 p-4 font-mono text-[10px] text-[#2E2620]/30 hidden md:block">
        COORDS: 0.7734, 0.4219
      </div>
    </div>
  );
};

const QuickLinks = () => {
  const favorites = [
    { title: 'Logic Architect', to: '/apps/logic-architect', icon: CubeIcon, desc: 'Circuit Design', hoverBg: 'hover:bg-[#C96442]', borderAccent: 'border-l-[#C96442]' },
    { title: 'Fezynth', to: '/apps/fezynth', icon: BroadcastIcon, desc: 'Audio Synthesis', hoverBg: 'hover:bg-[#B88532]', borderAccent: 'border-l-[#B88532]' },
    { title: 'Notepad', to: '/apps/notepad', icon: AppWindowIcon, desc: 'Text Buffer', hoverBg: 'hover:bg-[#6B8E23]', borderAccent: 'border-l-[#6B8E23]' },
    { title: 'Sprite Editor', to: '/apps/sprite-editor', icon: TerminalIcon, desc: 'Pixel Matrix', hoverBg: 'hover:bg-[#9E4A2F]', borderAccent: 'border-l-[#9E4A2F]' },
  ];

  return (
    <div className="border-b border-[#1A161320] bg-[#E8DECE]/40 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1A161320] relative z-10">
        {favorites.map((app, idx) => (
          <Link
            key={app.to}
            to={app.to}
            className={`group relative p-8 ${app.hoverBg} hover:text-[#F3ECE0] transition-all duration-200 h-48 flex flex-col justify-between overflow-hidden border-l-2 ${app.borderAccent} md:border-l-0`}
          >
            <div className="flex justify-between items-start">
              <app.icon size={32} weight="light" className="text-[#2E2620]/60 group-hover:text-[#F3ECE0] transition-colors" />
              <span className="font-mono text-[10px] opacity-40">0{idx + 1}</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-fraunces italic tracking-tight mb-1 group-hover:translate-x-1 transition-transform text-[#1A1613] group-hover:text-[#F3ECE0]">
                {app.title}
              </h3>
              <p className="text-xs text-[#2E2620]/60 group-hover:text-[#F3ECE0]/70 font-mono uppercase tracking-tight">
                {app.desc}
              </p>
            </div>

            <ArrowUpRightIcon
              size={24}
              weight="bold"
              className="absolute top-4 right-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-[#F3ECE0]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ num, title, link, linkText }) => (
  <div className="flex items-end justify-between mb-12 border-b border-[#1A1613] pb-6 border-l-2 border-l-[#C96442] pl-6">
    <div className="flex items-baseline gap-4">
      <span className="bg-[#C96442] text-[#F3ECE0] font-mono text-lg font-bold px-3 py-1">
        0{num}
      </span>
      <h2 className="text-4xl md:text-5xl font-fraunces italic tracking-tight text-[#1A1613]">
        {title}
      </h2>
    </div>
    {link && (
      <Link
        to={link}
        className="hidden md:flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#1A1613] hover:text-[#9E4A2F] transition-colors"
      >
        [{linkText}]
        <ArrowRightIcon weight="bold" />
      </Link>
    )}
  </div>
);

const ExploreLink = ({ to, title, icon: Icon }) => (
  <Link
    to={to}
    className="group flex items-center justify-between p-3 border border-transparent hover:border-[#1A161320] hover:bg-[#E8DECE]/60 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="text-[#2E2620]/60 group-hover:text-[#C96442] transition-colors">
        <Icon size={20} />
      </div>
      <span className="font-mono uppercase tracking-wider text-xs text-[#2E2620] group-hover:text-[#1A1613] transition-colors">
        {title}
      </span>
    </div>
    <ArrowRightIcon
      weight="bold"
      size={14}
      className="text-[#1A1613] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
    />
  </Link>
);

const TerracottaHomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { projects: pinnedProjects, loading: loadingProjects } = useProjects(true);

  const [homepageSectionOrder] = usePersistentState(KEY_HOMEPAGE_SECTION_ORDER, [
    'projects',
    'blogposts',
  ]);

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
          const combinedItems = [...Array.from(seriesMap.values()), ...individualPosts];
          combinedItems.sort((a, b) => {
            const dateA = new Date(a.updated || a.date);
            const dateB = new Date(b.updated || b.date);
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
      <div className="min-h-screen bg-[#F3ECE0] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-1 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-[pulse_1s_ease-in-out_infinite] origin-left" />
          </div>
          <span className="font-mono text-sm uppercase tracking-[0.3em] animate-pulse text-[#2E2620]">
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
            <SectionHeader num={sectionNum} title="Selected Works" link="/projects" linkText="FULL ARCHIVE" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pinnedProjects.map((project) => (
                <div
                  key={project.slug}
                  className="group border border-[#1A161320] hover:border-[#C96442]/60 transition-all p-1 bg-[#F3ECE0] hover:shadow-[0_30px_60px_-30px_#1A161330] relative overflow-hidden"
                >
                  <ProjectTile project={project} />
                </div>
              ))}
            </div>
            <div className="mt-12 md:hidden flex justify-center">
              <Link
                to="/projects"
                className="px-6 py-3 border border-[#1A161320] text-xs font-mono uppercase tracking-widest text-[#1A1613] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </section>
        );
      case 'blogposts':
        return (
          <section className="py-24 border-t border-dashed border-[#1A161320]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <SectionHeader num={sectionNum} title="Latest Logs" link="/blog" linkText="READ ALL" />
                <div className="flex flex-col gap-6">
                  {posts.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-b border-[#1A161320] pb-6 last:border-0"
                    >
                      <PostTile post={item} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-12 pt-4 lg:pt-0">
                <div className="p-8 border border-[#1A161320] bg-[#E8DECE]/40 relative overflow-hidden group hover:border-[#C96442]/50 transition-colors">
                  <div className="absolute top-0 right-0 p-2 opacity-[0.08]">
                    <TerminalIcon size={80} />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C96442]/60 via-transparent to-transparent" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#9E4A2F] mb-8 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 bg-[#C96442]" /> NAVIGATION
                  </h3>
                  <div className="space-y-1">
                    <ExploreLink to="/apps" title="APPS" icon={AppWindowIcon} />
                    <ExploreLink to="/roadmap" title="ROADMAP" icon={CubeIcon} />
                    <ExploreLink to="/terminal" title="TERMINAL" icon={TerminalIcon} />
                    <ExploreLink to="/about" title="ABOUT" icon={CpuIcon} />
                  </div>
                </div>

                <div className="p-6 border border-dashed border-[#B88532]/40 bg-[#B88532]/[0.04] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#B88532]/40" />
                  <div className="flex items-center gap-2 text-[#B88532] font-mono text-xs uppercase mb-4">
                    <LightningIcon weight="fill" className="text-[#B88532]" />
                    <span>TIP</span>
                  </div>
                  <p className="text-sm text-[#2E2620] leading-relaxed font-mono">
                    Try navigating with keyboard shortcuts. Press{' '}
                    <span className="text-[#1A1613] border border-[#1A161320] px-1">CMD/CTRL + K</span>{' '}
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
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25 selection:text-[#1A1613] relative overflow-x-hidden font-fraunces">
      <Seo
        title="Fezcodex // Terracotta"
        description="Experimental software vault rendered in warm editorial tones."
        keywords={['Fezcodex', 'terracotta', 'portfolio', 'editorial']}
      />

      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.35] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <StatusPill />
      <Hero />
      <QuickLinks />

      <div className="mx-auto max-w-7xl px-6 pb-32 relative z-10">
        {homepageSectionOrder.map((sectionName, idx) => (
          <React.Fragment key={sectionName}>{renderSection(sectionName, idx)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TerracottaHomePage;
