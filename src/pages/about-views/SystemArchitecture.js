import React from 'react';
import { motion } from 'framer-motion';
import { aboutData } from './aboutData';
import {
  Cpu,
  HardDrives,
  Circuitry,
  ShareNetwork,
  Lightning,
} from '@phosphor-icons/react';

const BlueprintGrid = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '10px 10px'
      }}
    />
  </div>
);

const SchematicBox = ({ title, children, className = '', icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className={`relative border-2 border-white/80 bg-[#002b5c]/50 backdrop-blur-sm p-4 ${className}`}
  >
    {/* Technical Markers */}
    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />

    {/* Connector Nodes (Decorative) */}
    <div className="absolute top-1/2 -left-3 w-4 h-4 rounded-full border-2 border-white bg-[#002b5c]" />
    <div className="absolute top-1/2 -right-3 w-4 h-4 rounded-full border-2 border-white bg-[#002b5c]" />

    {/* Header */}
    <div className="flex items-center gap-2 border-b border-white/30 pb-2 mb-3">
      {Icon && <Icon size={20} className="text-cyan-300" />}
      <h3 className="font-mono text-sm uppercase tracking-widest text-cyan-300 font-bold">
        {title}
      </h3>
      <div className="flex-grow h-px bg-white/30 ml-2" />
      <span className="text-[10px] text-white/50 font-mono">FIG.{Math.floor(Math.random() * 99)}</span>
    </div>

    {children}
  </motion.div>
);

const ConnectorLine = ({ className }) => (
  <div className={`absolute bg-white/50 z-0 ${className}`} />
);

const SystemArchitecture = () => {
  return (
    <div className="relative min-h-screen bg-[#001e40] text-white overflow-hidden p-8 pt-24 font-mono selection:bg-cyan-500 selection:text-black">
      <BlueprintGrid />

      {/* Decorative Blueprint Header */}
      <div className="absolute bottom-8 right-8 border-2 border-white p-4 max-w-sm hidden md:block opacity-70">
        <div className="text-xs uppercase grid grid-cols-[80px_1fr] gap-y-1">
          <span className="text-white/60">Project:</span>
          <span className="font-bold">FEZ.ARCH.V1</span>
          <span className="text-white/60">Architect:</span>
          <span className="font-bold">{aboutData.profile.name}</span>
          <span className="text-white/60">Date:</span>
          <span>{new Date().toLocaleDateString()}</span>
          <span className="text-white/60">Scale:</span>
          <span>1:100</span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-16 items-start">

        {/* Central Processing Unit (Profile) */}
        <div className="col-span-1 md:col-span-4 md:col-start-5 relative">
           <SchematicBox title="Core Processor" icon={Cpu} className="z-10 bg-[#001e40]">
              <div className="flex flex-col items-center text-center p-4">
                 <div className="w-24 h-24 border-2 border-dashed border-cyan-400 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 animate-spin-slow border-t-2 border-cyan-400 rounded-full opacity-50"></div>
                    <span className="text-4xl">⚡</span>
                 </div>
                 <h1 className="text-xl font-bold uppercase mb-1">{aboutData.profile.name}</h1>
                 <p className="text-xs text-cyan-200 tracking-wider mb-4">{aboutData.profile.role}</p>
                 <div className="w-full bg-white/10 p-2 text-[10px] text-left">
                    <p>> SYS.INIT...</p>
                    <p>> LOADING DRIVERS...</p>
                    <p>> {aboutData.profile.tagline}</p>
                 </div>
              </div>
           </SchematicBox>
           {/* Vertical Connector Down */}
           <ConnectorLine className="h-16 w-0.5 left-1/2 -bottom-16 hidden md:block" />
        </div>

        {/* Experience Modules (Left Wing) */}
        <div className="col-span-1 md:col-span-4 relative">
           <ConnectorLine className="h-0.5 w-16 -right-8 top-12 hidden md:block" />
           <SchematicBox title="Memory Banks (Exp)" icon={HardDrives} delay={0.2}>
              <div className="space-y-4">
                 {aboutData.experience.map((exp, i) => (
                    <div key={i} className="relative pl-4 border-l border-white/20">
                       <div className="absolute left-[-5px] top-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
                       <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-sm">{exp.company}</span>
                          <span className="text-[10px] bg-white/10 px-1">{exp.period}</span>
                       </div>
                       <div className="text-xs text-cyan-200 mb-1">{exp.role}</div>
                       <p className="text-[10px] text-white/70 leading-relaxed">{exp.desc}</p>
                    </div>
                 ))}
              </div>
           </SchematicBox>
        </div>

        {/* Skills Modules (Right Wing) */}
        <div className="col-span-1 md:col-span-4 relative">
           <ConnectorLine className="h-0.5 w-16 -left-8 top-12 hidden md:block" />
           <SchematicBox title="I/O Interfaces (Skills)" icon={Circuitry} delay={0.3}>
              <div className="grid grid-cols-2 gap-3">
                 {aboutData.skills.map((skill, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-2 flex flex-col justify-between h-20 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                          {skill.icon && <skill.icon size={16} />}
                       </div>
                       <span className="text-xs font-bold z-10">{skill.name}</span>
                       <div className="w-full bg-black/50 h-1.5 mt-2">
                          <div className="bg-cyan-400 h-full" style={{ width: `${skill.level}%` }} />
                       </div>
                       <span className="text-[9px] text-right mt-1 font-mono">{skill.level}% EFFICIENCY</span>
                    </div>
                 ))}
              </div>
           </SchematicBox>
        </div>

        {/* Stats / Traits (Bottom) */}
        <div className="col-span-1 md:col-span-8 md:col-start-3 relative mt-8">
           <SchematicBox title="Auxiliary Systems" icon={ShareNetwork} delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Superpower */}
                 <div className="border border-white/20 p-3 relative">
                    <div className="absolute -top-3 left-4 bg-[#002b5c] px-2 text-xs text-cyan-300">SPECIAL_ABILITY</div>
                    <div className="flex items-center gap-3 mb-2">
                       <Lightning size={24} className="text-yellow-400" />
                       <div className="font-bold text-sm">{aboutData.traits.superpower.title}</div>
                    </div>
                    <p className="text-[10px] text-white/70">{aboutData.traits.superpower.desc}</p>
                 </div>

                 {/* Hobby */}
                 <div className="border border-white/20 p-3 relative">
                    <div className="absolute -top-3 left-4 bg-[#002b5c] px-2 text-xs text-cyan-300">AUDIO_DRIVER</div>
                     <div className="font-bold text-sm mb-2">{aboutData.traits.hobby.title}</div>
                     <p className="text-[10px] text-white/70">{aboutData.traits.hobby.desc}</p>
                 </div>

                 {/* Stats */}
                 <div className="grid grid-cols-2 gap-2">
                    {aboutData.stats.map((stat, i) => (
                       <div key={i} className="bg-cyan-900/30 p-2 text-center border border-cyan-500/30">
                          <div className="text-[10px] text-cyan-200">{stat.label}</div>
                          <div className="text-lg font-bold">{stat.value}</div>
                       </div>
                    ))}
                 </div>
              </div>
           </SchematicBox>
        </div>

      </div>
    </div>
  );
};

export default SystemArchitecture;
