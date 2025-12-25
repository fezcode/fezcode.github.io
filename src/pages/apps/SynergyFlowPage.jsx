import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  TrendUpIcon,
  UsersThreeIcon,
  LightningIcon,
  HandshakeIcon,
  LightbulbIcon,
  ArrowLeftIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
  StarIcon,
  TrendDownIcon,
  FireIcon,
  ChartBarIcon
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';

const BUZZWORDS = {
  verbs: [
    'Leverage', 'Synergize', 'Pivot', 'Drill down', 'Unpack', 'Disrupt',
    'Empower', 'Ideate', 'Onboard', 'Streamline', 'Circle back', 'Touch base',
    'Incentivize', 'Gamify', 'Architect', 'Orchestrate', 'Re-imagine'
  ],
  adjectives: [
    'holistic', 'granular', 'robust', 'seamless', 'mission-critical',
    'next-gen', 'cutting-edge', 'value-added', 'customer-centric', 'agile',
    'scalable', 'disruptive', 'paradigm-shifting', 'bespoke', 'organic'
  ],
  nouns: [
    'deliverables', 'paradigms', 'synergies', 'bandwidth', 'pain points',
    'ecosystems', 'verticals', 'touchpoints', 'architectures', 'mindshare',
    'core competencies', 'low-hanging fruit', 'best practices', 'KPIs'
  ],
  suffixes: [
    'going forward', 'at the end of the day', 'in this space',
    'from a high-level perspective', 'to move the needle', 'for the win'
  ]
};

const CORPORATE_COLORS = [
  '#2F80ED', // Corporate Blue
  '#EB5757', // Alert Red
  '#F2C94C', // Optimistic Yellow
  '#6FCF97', // Growth Green
  '#9B51E0', // Innovative Purple
  '#F2994A', // Dynamic Orange
];

const FLOATING_TEXTS = [
    "+500% ROI", "Synergy Achieved", "Stakeholder Approved", "Value Unlocked",
    "Paradigm Shifted", "Quarterly Goal Met", "Bonus Secured", "Market Disrupted",
    "Alignment Reached", "Deep Dive Complete", "Impact Driven", "Growth Hacked"
];

const SynergyFlowPage = () => {
  useSeo({
    title: 'Synergy Flow | Fezcodex',
    description: 'Generate meaningless corporate buzzwords and joyful corporate art.',
    keywords: ['corporate', 'synergy', 'buzzword', 'generator', 'memphis', 'art'],
  });

  const [phrase, setPhrase] = useState('');
  const [shape, setShape] = useState(0);
  const [color, setColor] = useState(CORPORATE_COLORS[0]);
  const [iconIndex, setIconIndex] = useState(0);

  // Stats
  const [metrics, setMetrics] = useState({
      roi: 120,
      synergy: 850,
      impact: 42,
      burnRate: 2400,
      churn: 2.5,
      leadership: 100
  });

  // Floating Particles
  const [particles, setParticles] = useState([]);

  const icons = [BriefcaseIcon, TrendUpIcon, UsersThreeIcon, LightningIcon, HandshakeIcon, LightbulbIcon];
  const CurrentIcon = icons[iconIndex];

  const generateSynergy = useCallback(() => {
    const v = BUZZWORDS.verbs[Math.floor(Math.random() * BUZZWORDS.verbs.length)];
    const a = BUZZWORDS.adjectives[Math.floor(Math.random() * BUZZWORDS.adjectives.length)];
    const n = BUZZWORDS.nouns[Math.floor(Math.random() * BUZZWORDS.nouns.length)];
    const s = Math.random() > 0.7 ? ` ${BUZZWORDS.suffixes[Math.floor(Math.random() * BUZZWORDS.suffixes.length)]}` : '';

    setPhrase(`${v} ${a} ${n}${s}.`);
    setColor(CORPORATE_COLORS[Math.floor(Math.random() * CORPORATE_COLORS.length)]);
    setShape(Math.floor(Math.random() * 4));
    setIconIndex(Math.floor(Math.random() * icons.length));

    // Update Metrics
    setMetrics(prev => ({
        roi: prev.roi + Math.floor(Math.random() * 50) + 10,
        synergy: prev.synergy + Math.floor(Math.random() * 200) + 50,
        impact: prev.impact + Math.floor(Math.random() * 5) + 1,
        burnRate: prev.burnRate + Math.floor(Math.random() * 500) + 100, // Always burning more
        churn: Math.max(0, (prev.churn + (Math.random() - 0.5)).toFixed(2)), // Fluctuating
        leadership: prev.leadership + Math.floor(Math.random() * 10) + 1 // Always up
    }));

    // Add Particle
    const newParticle = {
        id: Date.now(),
        text: FLOATING_TEXTS[Math.floor(Math.random() * FLOATING_TEXTS.length)],
        x: Math.random() * 80 - 40, // Random X offset
        y: Math.random() * 50, // Random Y offset
    };
    setParticles(prev => [...prev, newParticle]);

    // Cleanup particle after animation
    setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  }, [icons.length]); // Keep linter happy with length (stable)

  useEffect(() => {
    generateSynergy();
  }, [generateSynergy]);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-hidden relative">
      {/* Navigation Return Link (Styled to clash) */}
      <div className="absolute top-4 left-4 z-50">
         <Link to="/apps" className="px-6 py-3 bg-black text-white font-mono uppercase text-sm tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 rounded-full shadow-lg">
            <ArrowLeftIcon weight="bold" />
            Return to Brutalism
         </Link>
      </div>

      <div className="container mx-auto px-4 h-screen flex flex-col md:flex-row items-center justify-center relative z-10">

        {/* Left: The "Art" */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8 relative">
          <motion.div
            key={color} // Re-animate on color change
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative w-64 h-64 md:w-96 md:h-96"
          >
            {/* Abstract Blob Background */}
            <svg viewBox="0 0 200 200" className="w-full h-full absolute top-0 left-0 text-opacity-20" style={{ color: color, fill: 'currentColor' }}>
              {shape === 0 && <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.2,28.8C50.2,39.1,41.5,47.4,31.9,54.6C22.3,61.8,11.8,67.9,-0.8,69.3C-13.4,70.7,-25.1,67.4,-36.3,60.8C-47.5,54.2,-58.2,44.3,-66.1,32.4C-74,20.5,-79.1,6.6,-77.3,-6.4C-75.5,-19.4,-66.8,-31.5,-56.3,-41.3C-45.8,-51.1,-33.5,-58.6,-20.9,-66.6C-8.3,-74.6,4.6,-83.1,17.2,-83.2C29.8,-83.3,42.1,-75,54.7,-66.7Z" transform="translate(100 100)" />}
              {shape === 1 && <path d="M38.9,-64.6C51.6,-59.1,64,-52.3,71.9,-42.2C79.8,-32.1,83.2,-18.7,81.3,-6.2C79.4,6.3,72.2,17.9,63.4,28C54.6,38.1,44.2,46.7,33.1,53.4C22,60.1,10.2,64.9,-1.4,67.3C-13,69.7,-24.3,69.7,-35.3,64.7C-46.3,59.7,-57,49.7,-64.6,37.8C-72.2,25.9,-76.7,12.1,-75.4,-1.1C-74.1,-14.3,-67,-26.9,-57.6,-36.8C-48.2,-46.7,-36.5,-53.9,-24.8,-60C-13.1,-66.1,-1.4,-71.1,10.6,-70.8C22.6,-70.5,35.2,-64.9,38.9,-64.6Z" transform="translate(100 100)" />}
              {shape === 2 && <circle cx="100" cy="100" r="80" />}
              {shape === 3 && <rect x="20" y="20" width="160" height="160" rx="40" />}
            </svg>

            {/* Floating Character/Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-lg">
                <CurrentIcon size={120} weight="fill" style={{ color: shape === 0 ? '#333' : 'white' }} />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-8 h-8 rounded-full bg-white opacity-50 animate-bounce" />
            <div className="absolute bottom-20 left-10 w-4 h-4 rounded-full bg-black opacity-10 animate-pulse" />
          </motion.div>
        </div>

        {/* Right: The Text */}
        <div className="w-full md:w-1/2 p-8 text-center md:text-left z-20 flex flex-col items-center md:items-start">
            <motion.div
                key={phrase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative"
            >
                <h1 className="text-5xl md:text-7xl font-playfairDisplay font-bold mb-6 tracking-tight leading-tight" style={{ color: color }}>
                    {phrase}
                </h1>
                <p className="text-gray-400 text-lg mb-8 italic font-arvo">
                    "Driving impact through {BUZZWORDS.adjectives[Math.floor(Math.random() * 5)]} engagement."
                </p>

                <div className="relative inline-block">
                    <button
                        onClick={generateSynergy}
                        className="px-8 py-4 rounded-full text-white font-mono font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform active:scale-95 relative z-10"
                        style={{ backgroundColor: color }}
                    >
                        Generate Value 🚀
                    </button>
                </div>
            </motion.div>

            {/* KPI Dashboard */}
            <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-lg relative">
                {/* ROI */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <ChartLineUpIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        {metrics.roi}%
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Proj. ROI
                    </div>
                </div>

                {/* Synergy */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <CurrencyDollarIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        {metrics.synergy}k
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Net Synergy
                    </div>
                </div>

                {/* Impact */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <StarIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        {metrics.impact}.0
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Impact Factor
                    </div>
                </div>

                {/* Burn Rate */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <FireIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        ${metrics.burnRate}
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Burn Rate/Hr
                    </div>
                </div>

                {/* Churn */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <TrendDownIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        {metrics.churn}%
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Churn Velocity
                    </div>
                </div>

                {/* Leadership */}
                <div className="bg-gray-50 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2" style={{ color: color }}>
                        <ChartBarIcon size={32} weight="duotone" />
                    </div>
                    <div className="text-3xl font-bold font-playfairDisplay text-gray-800">
                        {metrics.leadership}
                    </div>
                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        Thought Leadership
                    </div>
                </div>
            </div>

            {/* Floating Particles Container (Moved below dashboard) */}
            <div className="mt-8 relative w-full h-12">
                <AnimatePresence>
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            initial={{ opacity: 0, y: -20, x: particle.x, scale: 0.5 }}
                            animate={{ opacity: 1, y: 40 + particle.y, x: particle.x, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap font-mono font-bold text-xl italic"
                            style={{ color: color }}
                        >
                            {particle.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -z-0 transform -skew-x-12 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50" />
    </div>
  );
};

export default SynergyFlowPage;
