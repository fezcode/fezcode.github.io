import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aboutData } from './aboutData';
import {
  Crosshair,
  ListDashes,
  Aperture,
  GitCommit,
  Cpu,
} from '@phosphor-icons/react';

const HudBox = ({ title, children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, borderColor: 'rgba(0, 255, 65, 0)' }}
    animate={{ opacity: 1, scale: 1, borderColor: 'rgba(0, 255, 65, 0.5)' }}
    transition={{ duration: 0.4, delay }}
    className={`relative border border-green-500/50 bg-black/80 p-4 ${className}`}
  >
    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-400" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-400" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-400" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-400" />

    {title && (
      <h3 className="text-xs uppercase tracking-[0.2em] text-green-400 mb-3 flex items-center gap-2">
        <Aperture className="animate-spin-slow" /> {title}
      </h3>
    )}
    <div className="text-green-300/90 font-mono text-sm">{children}</div>
  </motion.div>
);

const ScanLine = () => (
  <motion.div
    animate={{ top: ['0%', '100%'], opacity: [0, 0.5, 0] }}
    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
    className="absolute left-0 right-0 h-1 bg-green-500/30 z-10 pointer-events-none"
  />
);

const NeuromancerHUD = () => {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono overflow-hidden p-4 md:p-8 pt-24">
      <ScanLine />

      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Header / Identity Block */}
        <div className="col-span-1 md:col-span-12 flex flex-col md:flex-row justify-between items-end border-b border-green-500/30 pb-4 mb-4">
          <div>
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
            >
              {aboutData.profile.name}
            </motion.h1>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2 text-green-400/80"
                        >
                          <Cpu size={16} />
                          <span>{aboutData.profile.role}</span>
                          <span className="mx-2">{`//`}</span>
                          <span>ID: FEZ-8492</span>
                        </motion.div>          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             {aboutData.stats.map((stat, idx) => (
               <div key={idx} className="text-right">
                 <div className="text-xs text-green-500/60 uppercase">{stat.label}</div>
                 <div className="text-xl font-bold">{stat.value}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Left Column: Navigation/Status */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <HudBox title="System Modules" delay={0.1}>
            <ul className="space-y-2">
              {[
                { id: 'status', label: 'Status Overview', icon: Crosshair },
                { id: 'skills', label: 'Skill Matrix', icon: ListDashes },
                { id: 'logs', label: 'Mission Logs', icon: GitCommit },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-3 ${
                      activeTab === item.id
                        ? 'bg-green-500 text-black border-green-400 font-bold'
                        : 'bg-transparent border-green-500/30 text-green-500 hover:border-green-400'
                    }`}
                  >
                    <item.icon /> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </HudBox>

          <HudBox title="Traits" delay={0.2}>
            <div className="space-y-4">
               <div className="group">
                  <div className="text-green-400 text-xs mb-1 group-hover:text-white transition-colors">SUPERPOWER</div>
                  <div className="font-bold flex items-center gap-2">
                    <aboutData.traits.superpower.icon className="animate-pulse" />
                    {aboutData.traits.superpower.title}
                  </div>
               </div>
               <div>
                  <div className="text-green-400 text-xs mb-1">KRYPTONITE</div>
                  <div className="font-bold text-red-400 flex items-center gap-2">
                     <aboutData.traits.kryptonite.icon />
                     {aboutData.traits.kryptonite.title}
                  </div>
               </div>
            </div>
          </HudBox>
        </div>

        {/* Main Display Area */}
        <div className="col-span-1 md:col-span-9">
          <AnimatePresence mode="wait">
             {activeTab === 'status' && (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <HudBox title="Primary Directive" className="min-h-[200px] flex items-center justify-center text-center text-lg">
                      <p>"{aboutData.profile.tagline}"</p>
                   </HudBox>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <HudBox title="War Story Analysis">
                         <div className="text-green-300">
                            <strong className="block text-white mb-2">{aboutData.traits.warStory.title}</strong>
                            {aboutData.traits.warStory.desc}
                         </div>
                      </HudBox>
                      <HudBox title="Audio Synthesis">
                          <div className="text-green-300">
                            <strong className="block text-white mb-2">{aboutData.traits.hobby.title}</strong>
                            {aboutData.traits.hobby.desc}
                         </div>
                      </HudBox>
                   </div>
                </motion.div>
             )}

             {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 gap-4"
                >
                   {aboutData.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-4 bg-green-900/10 p-2 border border-green-500/20">
                         <skill.icon size={24} />
                         <div className="flex-1">
                            <div className="flex justify-between mb-1">
                               <span>{skill.name}</span>
                               <span>{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-green-900 w-full overflow-hidden">
                               <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${skill.level}%` }}
                                 transition={{ delay: 0.2 + (i * 0.1), duration: 1 }}
                                 className="h-full bg-green-500"
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                </motion.div>
             )}

             {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                   {aboutData.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-green-500 pl-4 py-2 hover:bg-green-500/5 transition-colors">
                         <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-white text-lg">{exp.company}</h4>
                            <span className="text-xs bg-green-900 px-2 py-1 rounded">{exp.period}</span>
                         </div>
                         <div className="text-green-400 text-sm mb-2">{exp.role}</div>
                         <p className="text-green-300/80">{exp.desc}</p>
                      </div>
                   ))}
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NeuromancerHUD;
