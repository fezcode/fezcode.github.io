import React, {useMemo} from 'react';
import {motion} from 'framer-motion';
import {
  SparkleIcon,
  AtomIcon,
} from '@phosphor-icons/react';
import {appIcons} from '../utils/appIcons';

/**
 * VisionAwakeningCard
 * A brutalist, futuristic card component inspired by the "A New Lens on Reality" design.
 */
const VisionAwakeningCard = ({
                               variant = 'dark',
                               colors: customColors,
                               showFooter = true,
                               topBadge,
                               title = "",
                               description,
                               tags = [],
                               secondaryTags = [],
                               footerText = "",
                               subNotes = []
                             }) => {
  const getIcon = (icon) => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'string' && appIcons[icon]) {
      const IconComp = appIcons[icon];
      return <IconComp weight="fill"/>;
    }
    return <SparkleIcon weight="fill"/>;
  };
  const getSecIcon = (icon) => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'string' && appIcons[icon]) {
      const IconComp = appIcons[icon];
      return <IconComp weight="bold"/>;
    }
    return <AtomIcon weight="bold"/>;
  };
  const defaultThemes = {
    dark: {
      container: "bg-[#1a1b3a] text-white border-[#2a2b5a]",
      pattern: "opacity-20 text-blue-400",
      pill: "bg-white/10 border-white/20 text-blue-100",
      pillIcon: "text-blue-300",
      footer: "text-white/60",
      subNote: "text-white/40",
      isDark: true,
    }, light: {
      container: "bg-[#e2e4ff] text-[#1a1b3a] border-white",
      pattern: "opacity-10 text-blue-900",
      pill: "bg-white border-blue-200 text-[#1a1b3a]",
      pillIcon: "text-blue-600",
      footer: "text-[#1a1b3a]/60",
      subNote: "text-[#1a1b3a]/40",
      isDark: false,
    }, emerald: {
      container: "bg-[#062c24] text-[#a7f3d0] border-[#064e3b]",
      pattern: "opacity-20 text-[#10b981]",
      pill: "bg-[#064e3b]/50 border-[#10b981]/30 text-[#a7f3d0]",
      pillIcon: "text-[#34d399]",
      footer: "text-[#a7f3d0]/60",
      subNote: "text-[#a7f3d0]/40",
      isDark: true,
    }, amber: {
      container: "bg-[#451a03] text-[#fde68a] border-[#78350f]",
      pattern: "opacity-20 text-[#f59e0b]",
      pill: "bg-[#78350f]/50 border-[#f59e0b]/30 text-[#fde68a]",
      pillIcon: "text-[#fbbf24]",
      footer: "text-[#fde68a]/60",
      subNote: "text-[#fde68a]/40",
      isDark: true,
    }, crimson: {
      container: "bg-[#450a0a] text-[#fecaca] border-[#7f1d1d]",
      pattern: "opacity-20 text-[#ef4444]",
      pill: "bg-[#7f1d1d]/50 border-[#ef4444]/30 text-[#fecaca]",
      pillIcon: "text-[#f87171]",
      footer: "text-[#fecaca]/60",
      subNote: "text-[#fecaca]/40",
      isDark: true,
    }
  };
  const themeClasses = customColors || defaultThemes[variant] || defaultThemes.dark;
  const isCustomDark = themeClasses.isDark;
  // Simulate the character pattern background
  const patternLines = useMemo(() => {
    const patternChars = "X01%&*#@+=-:. ".split("");
    return Array.from({length: 60}).map(() => Array.from({length: 150}).map(() => patternChars[Math.floor(Math.random() * patternChars.length)]).join(""));
  }, []);
  return (<motion.div
    className={`relative w-full max-w-xl h-[520px] md:h-[620px] rounded-[2rem] overflow-hidden border-8 p-6 md:p-8 flex flex-col transition-colors duration-500 group ${themeClasses.container}`}
  >        {/* Background Character Pattern */}
    <div
      className={`absolute inset-0 font-mono text-[6px] md:text-[8px] leading-none select-none pointer-events-none overflow-hidden whitespace-pre break-all ${themeClasses.pattern}`}>
      {patternLines.join('\n')}
    </div>
    {/* Hover Diagonal Scanline */}
    <div
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <motion.div
        animate={{
          x: ['-100%', '100%'], y: ['-100%', '100%'],
        }}
        transition={{
          duration: 2, repeat: Infinity, ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent h-[200%] w-[200%] -top-[50%] -left-[50%]"
        style={{rotate: '45deg'}}
      />
    </div>
    {/* Top Header Section */}
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-10 h-10 md:w-16 md:h-16 mb-8">
        <AtomIcon size="100%" weight="duotone" className={isCustomDark ? "text-blue-300" : "text-blue-600"}/>
      </div>
      <div
        className={`px-3 py-1 rounded-sm border text-[10px] font-mono uppercase tracking-widest ${themeClasses.pill} ${topBadge ? 'opacity-100' : 'opacity-0'}`}>
        {topBadge || '---'}
      </div>
    </div>
    <div className="relative z-10 space-y-3">
      <h2 className="text-2xl md:text-4xl font-outfit font-black uppercase leading-tight tracking-tight max-w-[95%]">
        {title}
      </h2>
      {description && (<p
        className="font-mono text-[10px] md:text-xs text-current opacity-70 leading-relaxed uppercase tracking-wider">
        {description}
      </p>)}
    </div>
    {/* Tags Grid */}
    <div className="relative z-10 space-y-4 mt-6 flex-grow overflow-y-auto">
      <div className="flex flex-wrap gap-2 md:gap-3">
        {tags.map((tag, i) => {
          const TagComp = tag.href ? 'a' : 'div';
          return (<TagComp
              key={i}
              href={tag.href}
              target={tag.href ? "_blank" : undefined}
              rel={tag.href ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border transition-all min-w-0 ${themeClasses.pill} ${tag.href ? `border-dashed hover:border-solid hover:bg-current/[0.2] cursor-pointer group/tag` : 'opacity-90'}`}
            >
                      <span className={`text-base md:text-xl flex-shrink-0 ${themeClasses.pillIcon}`}>
                        {getIcon(tag.icon)}
                      </span>
              <span
                className="font-syne font-bold text-[9px] md:text-xs uppercase tracking-wide min-w-0 flex items-center gap-1">
                        {tag.label}
                {tag.href && <span
                  className="text-[10px] opacity-40 group-hover/tag:opacity-100 group-hover/tag:translate-x-0.5 transition-all">↗</span>}
                      </span>
            </TagComp>);
        })}
      </div>
      {/* Secondary Wide Tags */}
      <div className="space-y-2">
        {secondaryTags.map((tag, i) => {
          const TagComp = tag.href ? 'a' : 'div';
          return (<TagComp
              key={i}
              href={tag.href}
              target={tag.href ? "_blank" : undefined}
              rel={tag.href ? "noopener noreferrer" : undefined}
              className={`flex items-center justify-between px-5 py-2 md:py-2.5 rounded-full border text-[9px] md:text-xs font-mono uppercase tracking-widest overflow-hidden transition-all ${themeClasses.pill} ${tag.href ? `border-dashed hover:border-solid hover:bg-current/[0.1] cursor-pointer group/sectag` : ''}`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className={`flex-shrink-0 ${themeClasses.pillIcon}`}>{getSecIcon(tag.icon)}</span>
                <span className="break-words">
                          {tag.label}
                  {tag.href && <span
                    className="ml-2 opacity-40 group-hover/sectag:opacity-100 inline-block group-hover/sectag:translate-x-0.5 transition-all">↗</span>}
                        </span>
              </div>
              {!tag.href && (<div className="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0 ml-2"/>)}
            </TagComp>);
        })}
      </div>
    </div>
    {/* Footer Section */}
    {showFooter && (<div
      className="relative z-10 mt-auto pt-6 border-t border-current/10 flex flex-col md:flex-row gap-6 md:gap-10 transition-opacity duration-200"
    >
      <p
        className={`flex-1 text-[10px] md:text-xs font-mono leading-relaxed uppercase tracking-tighter ${themeClasses.footer}`}>
        {footerText}
      </p>
      <div className="flex gap-4 md:w-1/3">
        {subNotes.map((note, i) => (<p key={i} className={`text-[8px] font-mono leading-tight ${themeClasses.subNote}`}>
          {note}
        </p>))}
      </div>
    </div>)}
    {/* Subtle Overlay Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"/>
  </motion.div>);
};
export default VisionAwakeningCard;
