import React from 'react';
import {motion} from 'framer-motion';
import {aboutData} from './aboutData';
import {
  Cpu,
  HardDrives,
  Circuitry,
  ShareNetwork,
  Lightning,
} from '@phosphor-icons/react';

const BlueprintGrid = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
    <div
      className="w-full h-full" style={{
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

const SchematicBox = ({title, children, className = '', icon: Icon, delay = 0, noBorder = false}) => (
  <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.5, delay}}
    className={`bg-[#002b5c]/80 backdrop-blur-sm p-4 relative ${!noBorder ? 'border border-cyan-500/30' : ''} ${className}`}
  >
    {/* Header */}
    <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-3">
      {Icon && <Icon size={16} className="text-cyan-300"/>}
      <h3 className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 font-bold">
        {title}
      </h3>
      <div className="flex-grow h-px bg-cyan-500/30 ml-2"/>
    </div>

    {children}
  </motion.div>
);

const SystemArchitecture = () => {
  return (
    <div className="relative min-h-full h-auto bg-[#001e40] text-white overflow-y-auto overflow-x-hidden p-4 pt-24 font-mono selection:bg-cyan-500 selection:text-black pb-32">
      <BlueprintGrid />
      <div
        className="relative z-10 max-w-5xl mx-auto flex flex-col gap-0 border-2 border-cyan-500/50 p-1 bg-[#001830]/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        {/* Top Section: Processor */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 mb-1">
          <SchematicBox title="CPU_CORE" icon={Cpu}
                        className="col-span-1 md:col-span-12 flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 relative">
              <div className="w-20 h-20 border border-cyan-400 flex items-center justify-center bg-[#001e40]">
                <Cpu size={48} className="text-cyan-400 animate-pulse"/>
              </div>
              {/* Connection Lines */}
              <div className="absolute top-1/2 -right-6 w-6 h-px bg-cyan-500 md:block hidden"/>
              <div className="absolute top-1/2 -left-6 w-6 h-px bg-cyan-500 md:block hidden"/>
            </div>

            <div className="flex-grow w-full">
              <div className="flex justify-between items-end border-b border-cyan-500/30 mb-2">
                <h1 className="text-2xl font-bold uppercase text-white">{aboutData.profile.name}</h1>
                <span className="text-xs text-cyan-400">{aboutData.profile.role}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-cyan-200/80">
                <div>> STATUS: ONLINE</div>
                <div>> LOC: {aboutData.profile.location}</div>
                <div>> UPTIME: {aboutData.stats.find(s => s.label === "Experience")?.value}</div>
              </div>
              <p className="mt-2 text-xs text-white/80 border-l-2 border-cyan-500 pl-2">
                {aboutData.profile.tagline}
              </p>
            </div>
          </SchematicBox>
        </div>

        {/* Middle Section: Memory & I/O */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
          {/* Left: Experience */}
          <SchematicBox title="MEMORY_BANKS (EXP)" icon={HardDrives} delay={0.2} className="h-full">
            <div className="space-y-0">
              {aboutData.experience.map((exp, i) => (
                <div key={i}
                     className="group relative pl-4 py-3 border-l border-cyan-500/20 hover:bg-white/5 transition-colors">
                  <div
                    className="absolute left-[-3px] top-4 w-1.5 h-1.5 bg-cyan-900 border border-cyan-500 group-hover:bg-cyan-400 transition-colors"/>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-white">{exp.company}</span>
                    <span
                      className="text-[9px] bg-cyan-900/50 px-1 border border-cyan-500/30 text-cyan-300">{exp.period}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 mb-1">{exp.role}</div>
                  <p className="text-[10px] text-white/60 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </SchematicBox>

          {/* Right: Skills */}
          <SchematicBox title="I/O_BUS (SKILLS)" icon={Circuitry} delay={0.3} className="h-full">
            <div className="grid grid-cols-2 gap-2 h-full content-start">
              {aboutData.skills.map((skill, i) => (
                <div key={i}
                     className="bg-[#001020] border border-cyan-500/20 p-2 flex flex-col justify-center relative overflow-hidden group">
                  {/* Background Bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-cyan-900/50 w-full">
                    <div className="h-full bg-cyan-500/50" style={{width: `${skill.level}%`}}/>
                  </div>
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[10px] font-bold text-cyan-100">{skill.name}</span>
                    <span className="text-[9px] text-cyan-500/80">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </SchematicBox>
        </div>

        {/* Bottom Section: Auxiliary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          <SchematicBox title="AUX_MODULES" icon={ShareNetwork} delay={0.4} className="col-span-1 md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Dynamic Traits Modules */}
              {Object.entries(aboutData.traits).map(([key, trait]) => (
                <div key={key}
                     className="flex items-start gap-3 bg-cyan-900/10 p-2 border border-cyan-500/10 relative overflow-hidden group">
                  {/* Corner marker */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/30"/>

                  <div className="mt-1 shrink-0">
                    {trait.icon &&
                      <trait.icon size={20} className={key === 'kryptonite' ? 'text-red-400' : 'text-cyan-300'}/>}
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-cyan-500 uppercase mb-0.5 tracking-wider">{key}</div>
                    <div className="text-xs font-bold text-white mb-1 leading-tight">{trait.title}</div>
                    <div
                      className="text-[9px] text-white/50 leading-tight line-clamp-3 group-hover:line-clamp-none transition-all bg-[#001e40]/50">{trait.desc}</div>
                  </div>
                </div>
              ))}

              {/* Stats Module */}
              <div className="grid grid-cols-2 gap-2 content-start">
                {aboutData.stats.map((stat, i) => (
                  <div key={i}
                       className="bg-cyan-900/30 p-2 text-center border border-cyan-500/30 flex flex-col justify-center h-full">
                    <div className="text-[9px] text-cyan-200 uppercase">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Links Module */}
              <div className="grid grid-cols-2 gap-2 content-start">
                {aboutData.profile.links && aboutData.profile.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer"
                     className="flex flex-col items-center justify-center gap-1 bg-[#001e40] border border-cyan-500/30 p-2 hover:bg-cyan-500/20 transition-colors group h-full">
                    <link.icon size={20} className="text-cyan-400 group-hover:text-white"/>
                    <span
                      className="text-[9px] text-cyan-200 group-hover:text-white uppercase tracking-wider">{link.label}</span>
                  </a>
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
