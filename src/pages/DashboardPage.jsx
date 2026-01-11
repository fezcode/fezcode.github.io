import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSeo from '../hooks/useSeo';
import piml from 'piml';
import {
  Newspaper,
  AppWindow,
  BookOpen,
  Scroll,
  ArrowUpRight,
  Wallet,
  Circle,
  TrendUp,
  Gear,
  Kanban,
  Database,
  TerminalWindow,
  FilePdf,
  Info
} from '@phosphor-icons/react';
import { version } from '../version';
import TacticalGlobe from '../components/TacticalGlobe';

// --- STYLED COMPONENTS ---

const DashboardButton = ({ children, icon: Icon, primary = false }) => (
  <button className={`
    flex items-center gap-2 px-5 py-2.5 rounded-full font-inter text-sm font-medium transition-all duration-300
    ${primary
      ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
      : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-white/10 hover:border-white/20'}
  `}>
    {Icon && <Icon size={16} weight="regular" />}
    {children}
  </button>
);

const Badge = ({ children, color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }) => (
  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border ${color} flex items-center gap-1.5 w-fit shadow-sm font-inter`}>
    <Circle weight="fill" size={6} className="animate-pulse" />
    {children}
  </span>
);

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors shadow-lg`}
  >
    {/* Subtle colored tint overlay instead of transparent background */}
    <div className={`absolute inset-0 opacity-5 pointer-events-none ${bgClass.replace('bg-', 'bg-')}`} />

    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={64} weight="duotone" />
    </div>
    <div className="relative z-10">
      <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2 font-inter">{title}</div>
      <div className="text-4xl font-normal text-white font-inter tracking-tight">{value}</div>
    </div>
  </motion.div>
);

const DetailCard = ({ title, icon: Icon, children, bgClass, delay, footerLink, footerLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl flex flex-col h-full hover:border-white/20 transition-colors shadow-xl relative overflow-hidden"
  >
     {/* Subtle colored tint overlay */}
    <div className={`absolute inset-0 opacity-5 pointer-events-none ${bgClass}`} />

    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
      <div className="p-2 bg-[#1a1a1a] rounded-xl text-white/70 border border-white/5">
        <Icon size={20} weight="duotone" />
      </div>
      <h3 className="text-lg font-playfairDisplay font-medium text-white">{title}</h3>
    </div>
    <div className="flex-grow font-inter relative z-10">
      {children}
    </div>
    {footerLink && footerLabel && (
      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
        <Link to={footerLink}>
           <button className="w-full py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors font-inter border border-white/10 hover:border-white/20 flex items-center justify-center gap-2">
              {footerLabel} <ArrowUpRight size={14} weight="bold" />
           </button>
        </Link>
      </div>
    )}
  </motion.div>
);

const ProgressBar = ({ label, value, max, color = "bg-blue-500" }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium text-white/60 mb-1.5 font-inter">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
};

const TableRow = ({ index, name, type, status, metric, actionLabel, actionLink }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="grid grid-cols-12 gap-6 items-center py-5 border-b border-white/5 hover:bg-[#111] transition-colors px-6 group"
  >
    <div className="col-span-1 text-white/30 text-xs font-medium font-inter">{index}</div>
    <div className="col-span-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:border-white/20 transition-all shadow-sm">
        {type === 'blog' && <Newspaper size={18} weight="duotone" />}
        {type === 'app' && <AppWindow size={18} weight="duotone" />}
        {type === 'story' && <BookOpen size={18} weight="duotone" />}
        {type === 'log' && <Scroll size={18} weight="duotone" />}
        {type === 'project' && <Kanban size={18} weight="duotone" />}
        {type === 'vague' && <FilePdf size={18} weight="duotone" />}
      </div>
      <div>
        <div className="text-sm font-medium text-white font-inter tracking-tight group-hover:text-blue-200 transition-colors line-clamp-1">{name}</div>
        <div className="text-[11px] text-white/50 uppercase tracking-wider font-normal mt-0.5 font-inter">{type}</div>
      </div>
    </div>
    <div className="col-span-2">
      <Badge color={status === 'Active' || status === 'Published' || status === 'Ongoing' || status === 'Released' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}>
        {status}
      </Badge>
    </div>
    <div className="col-span-3 text-sm text-white/70 font-normal font-inter">
      {metric}
    </div>
    <div className="col-span-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
      <Link to={actionLink} className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#1a1a1a] hover:bg-[#252525] px-4 py-2 rounded-full transition-all border border-white/10 hover:border-white/20 font-inter">
        {actionLabel} <ArrowUpRight size={12} weight="regular" />
      </Link>
    </div>
  </motion.div>
);

const NavTab = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={`relative px-1 py-4 text-sm font-medium transition-colors font-inter ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
  >
    {label}
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      />
    )}
  </Link>
);

const DashboardPage = () => {
  useSeo({
    title: 'Dashboard | Fezcodex',
    description: 'System overview and metrics for Fezcodex.',
    keywords: ['dashboard', 'metrics', 'stats', 'fezcodex', 'web3-style'],
  });

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    posts: [],
    apps: {},
    books: [],
    projects: [],
    logs: {},
    vagueIssues: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [postsRes, appsRes, storiesRes, projectsRes, vagueRes] = await Promise.all([
          fetch('/posts/posts.json'),
          fetch('/apps/apps.json'),
          fetch('/stories/books_en.piml'),
          fetch('/projects/projects.piml'),
          fetch('/the_vague/issues.piml')
        ]);

        const postsData = await postsRes.json();
        const appsData = await appsRes.json();
        const storiesText = await storiesRes.text();
        const projectsText = await projectsRes.text();
        const vagueText = await vagueRes.text();

        const storiesParsed = piml.parse(storiesText);
        const projectsParsed = piml.parse(projectsText);
        const vagueParsed = piml.parse(vagueText);

        const logCategories = ['article', 'book', 'event', 'food', 'game', 'movie', 'music', 'reading', 'series', 'tools', 'video', 'websites'];
        const logsData = {};

        // Fetch actual log counts
        await Promise.all(logCategories.map(async (cat) => {
          try {
            const res = await fetch(`/logs/${cat}/${cat}.piml`);
            if (res.ok) {
              const text = await res.text();
              const parsed = piml.parse(text);
              logsData[cat] = { length: (parsed.items || parsed.logs || []).length };
            } else {
              logsData[cat] = { length: 0 };
            }
          } catch (e) {
            console.error(`Error fetching logs for ${cat}:`, e);
            logsData[cat] = { length: 0 };
          }
        }));

        setData({
          posts: postsData,
          apps: appsData,
          books: storiesParsed.books || [],
          projects: projectsParsed.projects || [],
          logs: logsData,
          vagueIssues: vagueParsed.issues || [],
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full animate-ping" /></div>;

  // Metrics
  const totalPosts = data.posts.length;
  const totalApps = Object.values(data.apps).reduce((acc, cat) => acc + (cat.apps?.length || 0), 0);
  const totalProjects = data.projects.length;
  const totalLogs = Object.values(data.logs).reduce((acc, cat) => acc + (cat.length || 0), 0);
  const totalVagueIssues = data.vagueIssues.length;

  // Latest Items
  const latestPost = data.posts[0];
  const latestVague = data.vagueIssues[data.vagueIssues.length - 1];

  // App flattening for latest
  let allApps = [];
  Object.values(data.apps).forEach(cat => allApps = [...allApps, ...(cat.apps || [])]);
  allApps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const latestApp = allApps[0];

  // Derived Distribution Data
  const postsByCategory = data.posts.reduce((acc, post) => {
    const cat = post.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const projectStatus = {
    active: data.projects.filter(p => p.isActive === true || p.isActive === 'true').length,
    archived: data.projects.filter(p => p.isActive !== true && p.isActive !== 'true').length
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-inter selection:bg-[#5c6aff] selection:text-white pb-20 pt-24 overflow-hidden relative">

      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <TacticalGlobe className="absolute inset-0 w-full h-full opacity-20" accentColor="#3b82f6" />
      </div>

      {/* INTERNAL HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12 border-b border-white/5 bg-[#020202]/80 backdrop-blur-sm">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 pr-8 border-r border-white/5">
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-medium font-playfairDisplay">F</div>
                   <span className="text-white font-playfairDisplay font-medium text-lg tracking-tight">Fezcodex</span>
                </div>
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                   <NavTab to="/dashboard" label="Dashboard" isActive={location.pathname === '/dashboard'} />
                   <NavTab to="/graph" label="Graph" isActive={location.pathname === '/graph'} />
                   <NavTab to="/logs" label="Logs" isActive={location.pathname === '/logs'} />
                   <NavTab to="/settings" label="Settings" isActive={location.pathname === '/settings'} />
                </div>
             </div>

             <div className="flex items-center gap-4 pb-2 md:pb-0">
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] rounded-full border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-xs font-medium text-white/70 tracking-wide font-inter">v{version} Stable</span>
                </div>
                <Link to="/about/skills">
                   <DashboardButton icon={Info} primary>About</DashboardButton>
                </Link>
             </div>
         </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto px-6"
      >

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           <div className="lg:col-span-2 bg-[#080808] border border-white/10 rounded-[32px] p-10 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
              <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-gradient-to-b from-blue-600/10 to-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
              <div>
                 <h1 className="text-3xl font-playfairDisplay text-white mb-2 tracking-tight font-medium">System Overview</h1>
                 <p className="text-white/50 text-sm font-medium font-inter">Real-time metrics from the Fezcodex network.</p>
              </div>
              <div className="mt-12">
                 <div className="text-7xl font-normal text-white tracking-tighter font-inter">{totalPosts + totalApps + totalProjects + totalLogs + totalVagueIssues}</div>
                 <div className="text-sm font-medium text-white/50 mt-2 flex items-center gap-2 font-inter">
                    <span className="text-emerald-400 flex items-center gap-1"><TrendUp weight="bold" /> Live</span>
                    <span className="flex items-center gap-1">Total Indexed Items <Info className="text-white/30" weight="fill" /></span>
                 </div>
                 <div className="text-xs text-white/30 mt-1 font-inter">
                    Sum of all Blog Posts, Applications, Projects, Log Entries, and Vague Issues currently active in the database.
                 </div>
              </div>
           </div>

           <div className="bg-[#080808] border border-white/10 rounded-[32px] p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                 <TerminalWindow size={48} weight="duotone" className="text-white/60" />
              </div>
              <h2 className="text-xl font-playfairDisplay text-white mb-2 font-medium">Command Center</h2>
              <p className="text-white/50 text-xs font-inter mb-6 max-w-[200px] font-normal">Access global system settings and developer tools.</p>
              <Link to="/commands">
                 <DashboardButton>Open Terminal</DashboardButton>
              </Link>
           </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
           <StatCard title="Blog Posts" value={totalPosts} icon={Newspaper} colorClass="text-blue-500" bgClass="bg-blue-500" delay={0.1} />
           <StatCard title="Applications" value={totalApps} icon={AppWindow} colorClass="text-purple-500" bgClass="bg-purple-500" delay={0.2} />
           <StatCard title="Projects" value={totalProjects} icon={Kanban} colorClass="text-orange-500" bgClass="bg-orange-500" delay={0.3} />
           <StatCard title="The Vague" value={totalVagueIssues} icon={FilePdf} colorClass="text-red-500" bgClass="bg-red-500" delay={0.35} />
           <StatCard title="Log Entries" value={totalLogs} icon={Database} colorClass="text-green-500" bgClass="bg-green-500" delay={0.4} />
        </div>

        {/* DETAIL BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
           <DetailCard
             title="Content Distribution"
             icon={Newspaper}
             bgClass="bg-blue-500/5"
             delay={0.5}
             footerLink="/blog"
             footerLabel="View Blog"
           >
              <div className="space-y-1">
                 {Object.entries(postsByCategory).slice(0, 5).map(([cat, count]) => (
                    <ProgressBar key={cat} label={cat} value={count} max={totalPosts} color="bg-blue-500" />
                 ))}
              </div>
           </DetailCard>

           <DetailCard
             title="App Ecosystem"
             icon={AppWindow}
             bgClass="bg-purple-500/5"
             delay={0.6}
             footerLink="/apps"
             footerLabel="Explore Apps"
           >
              <div className="space-y-1">
                 {Object.keys(data.apps).map((cat) => (
                    <ProgressBar key={cat} label={cat} value={data.apps[cat].apps.length} max={totalApps} color="bg-purple-500" />
                 ))}
              </div>
           </DetailCard>

           <DetailCard
             title="Project Health"
             icon={Kanban}
             bgClass="bg-orange-500/5"
             delay={0.7}
             footerLink="/projects"
             footerLabel="View All Projects"
           >
              <div className="flex gap-4 mb-2">
                 <div className="flex-1 bg-[#1a1a1a] p-4 rounded-2xl text-center border border-white/5">
                    <div className="text-2xl font-normal text-white font-inter">{projectStatus.active}</div>
                    <div className="text-[10px] uppercase text-white/50 tracking-widest font-inter">Active</div>
                 </div>
                 <div className="flex-1 bg-[#1a1a1a] p-4 rounded-2xl text-center border border-white/5">
                    <div className="text-2xl font-normal text-white/60 font-inter">{projectStatus.archived}</div>
                    <div className="text-[10px] uppercase text-white/50 tracking-widest font-inter">Archived</div>
                 </div>
              </div>
           </DetailCard>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="bg-[#080808] border border-white/10 rounded-[32px] p-8 shadow-2xl">
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-playfairDisplay text-white font-medium">Latest Activity</h3>
              <Link to="/settings" className="text-white/40 hover:text-white transition-colors">
                 <Gear size={20} />
              </Link>
           </div>

           {/* Table Header */}
           <div className="grid grid-cols-12 gap-6 text-[10px] uppercase font-medium text-white/30 px-6 pb-4 border-b border-white/10 mb-2 tracking-widest font-inter">
              <div className="col-span-1">No</div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Metric</div>
              <div className="col-span-2 text-right">Action</div>
           </div>

           {/* Rows */}
           <div className="space-y-1">
              <TableRow
                index="01"
                name={latestPost?.title}
                type="blog"
                status="Published"
                metric={latestPost?.date}
                actionLabel="Read"
                actionLink={`/blog/${latestPost?.slug}`}
              />
              <TableRow
                index="02"
                name={latestApp?.title}
                type="app"
                status="Active"
                metric="React/JS"
                actionLabel="Open"
                actionLink={latestApp?.to}
              />
              <TableRow
                index="03"
                name={data.projects[0]?.title}
                type="project"
                status={data.projects[0]?.isActive ? 'Active' : 'Archived'}
                metric="Repo Size: 1"
                actionLabel="View"
                actionLink={`/projects/${data.projects[0]?.slug}`}
              />
              <TableRow
                index="04"
                name="Volume IV: Resistance"
                type="story"
                status="Ongoing"
                metric="Episodes: 5"
                actionLabel="Read"
                actionLink="/stories"
              />
              <TableRow
                 index="05"
                 name={latestVague ? latestVague.title : "The Vague"}
                 type="vague"
                 status="Released"
                 metric={latestVague ? latestVague.date : "N/A"}
                 actionLabel="View"
                 actionLink="/the-vague"
              />
           </div>

           <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center px-6">
              <div className="text-xs font-medium text-white/40 tracking-widest font-inter">TOTAL NODES LOADED</div>
              <div className="text-sm font-medium text-white font-inter">100%</div>
           </div>
        </div>

      </motion.main>
    </div>
  );
};

export default DashboardPage;