import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {aboutData} from './aboutData';
import {version} from '../../version';
import {
  Crosshair,
  ListDashes,
  Aperture,
  GitCommit,
  Cpu,
} from '@phosphor-icons/react';
import {useAchievements} from "../../context/AchievementContext";

const THEMES = {
  green: {
    text: 'text-green-500',
    textDim: 'text-green-500/80',
    textDark: 'text-green-900',
    border: 'border-green-500/30',
    borderStrong: 'border-green-500',
    bg: 'bg-green-900',
    bgDim: 'bg-green-900/10',
    accent: 'text-green-400',
    scanline: 'bg-green-500/30',
    grid: 'rgba(0, 255, 0, 0.1)',
    hudBorder: 'rgba(0, 255, 65, 0.5)',
    hudBorderTransparent: 'rgba(0, 255, 65, 0)',
    corner: 'border-green-400',
  },
  amber: {
    text: 'text-amber-500',
    textDim: 'text-amber-500/80',
    textDark: 'text-amber-900',
    border: 'border-amber-500/30',
    borderStrong: 'border-amber-500',
    bg: 'bg-amber-900',
    bgDim: 'bg-amber-900/10',
    accent: 'text-amber-400',
    scanline: 'bg-amber-500/30',
    grid: 'rgba(255, 176, 0, 0.1)',
    hudBorder: 'rgba(255, 176, 0, 0.5)',
    hudBorderTransparent: 'rgba(255, 176, 0, 0)',
    corner: 'border-amber-400',
  }
};

const HudBox = ({title, children, className = '', delay = 0, theme = 'green'}) => (
  <motion.div
    initial={{opacity: 0, scale: 0.9, borderColor: THEMES[theme].hudBorderTransparent}}
    animate={{opacity: 1, scale: 1, borderColor: THEMES[theme].hudBorder}}
    transition={{duration: 0.4, delay}}
    className={`relative border ${THEMES[theme].border} bg-black/80 p-4 ${className}`}
  >
    {/* Corner accents */}
    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${THEMES[theme].corner}`}/>
    <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${THEMES[theme].corner}`}/>
    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${THEMES[theme].corner}`}/>
    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${THEMES[theme].corner}`}/>

    {title && (
      <h3 className={`text-xs uppercase tracking-[0.2em] ${THEMES[theme].accent} mb-3 flex items-center gap-2`}>
        <Aperture className="animate-spin-slow"/> {title}
      </h3>
    )}
    <div className={`${THEMES[theme].textDim} font-mono text-sm`}>{children}</div>
  </motion.div>
);

const ScanLine = ({ theme = 'green' }) => (
  <motion.div
    animate={{top: ['0%', '100%'], opacity: [0, 0.5, 0]}}
    transition={{repeat: Infinity, duration: 3, ease: 'linear'}}
    className={`absolute left-0 right-0 h-1 ${THEMES[theme].scanline} z-10 pointer-events-none`}
  />
);

const MiniTerminal = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([
    {type: 'output', text: 'FEZ.OS Shell v0.4.0 initialized...'},
    {type: 'output', text: 'Type "help" for available commands.'},
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = React.useRef(null);
  const { unlockAchievement } = useAchievements();
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    // Input line style
    const newHistory = [...history, { type: 'input', text: cmd, className: `${THEMES[theme].text} font-bold` }];

    if (trimmed) {
      setCommandHistory(prev => [...prev, trimmed]);
    }
    setHistoryIndex(-1);

    const lowerCmd = trimmed.toLowerCase();

    switch (lowerCmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'AVAILABLE COMMANDS:', className: `${THEMES[theme].accent} font-bold mt-2` });
        const commands = [
          { cmd: 'status', desc: 'System diagnostic' },
          { cmd: 'whoami', desc: 'User identity' },
          { cmd: 'skills', desc: 'Technical capabilities' },
          { cmd: 'exp', desc: 'Mission logs' },
          { cmd: 'traits', desc: 'User characteristics' },
          { cmd: 'contact', desc: 'Communication channels' },
          { cmd: 'color', desc: 'Toggle display mode' },
          { cmd: 'version', desc: 'System version' },
          { cmd: 'home', desc: 'Return to base' },
          { cmd: 'history', desc: 'View command log' },
          { cmd: 'htop', desc: 'Process monitor' },
          { cmd: 'clear', desc: 'Clear display' },
          { cmd: 'sudo', desc: 'Run with the security privileges' },
          { cmd: 'date', desc: 'Display current date and time' },
          { cmd: 'motd', desc: 'Display Message Of The Day' },
          { cmd: 'ping', desc: 'Check terminal responsiveness' },
          { cmd: 'os', desc: 'Display operating system info' },
          { cmd: 'neofetch', desc: 'Display system information with ASCII art' },
        ];
        commands.forEach(c => {
           newHistory.push({ type: 'output', content: (
             <span><span className={`${THEMES[theme].text} font-bold`}>{c.cmd.padEnd(10)}</span> <span className={THEMES[theme].textDim}>- {c.desc}</span></span>
           )});
        });
        break;
      case 'htop':
        let memUsage = 0;
        let totalMem = 0;
        let memPercent = 0;
        if (window.performance && window.performance.memory) {
           memUsage = Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024);
           totalMem = Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024);
           memPercent = Math.round((memUsage / totalMem) * 100);
        } else {
           // Fallback for non-Chromium
           memUsage = Math.floor(Math.random() * 200 + 100);
           totalMem = 4096;
           memPercent = Math.round((memUsage / totalMem) * 100);
        }

        const barLength = 30;
        const filledLength = Math.round((barLength * memPercent) / 100);
        const bar = '|'.repeat(filledLength) + '.'.repeat(barLength - filledLength);
        // Color code the bar based on usage
        const barColor = memPercent > 80 ? 'text-red-500' : memPercent > 50 ? 'text-yellow-500' : THEMES[theme].accent;

        newHistory.push({ type: 'output', content: (
           <div className="mb-2">
              <div className="flex gap-2">
                 <span className={THEMES[theme].text}>CPU </span>
                 <span className={THEMES[theme].accent}>[{'|'.repeat(Math.floor(Math.random() * 10) + 5) + '.'.repeat(20)}]</span>
                 <span className={THEMES[theme].textDim}>{(Math.random() * 20 + 10).toFixed(1)}%</span>
              </div>
              <div className="flex gap-2">
                 <span className={THEMES[theme].text}>MEM </span>
                 <span className={barColor}>[{bar}]</span>
                 <span className={THEMES[theme].textDim}>{memPercent}% ({memUsage}/{totalMem}MB)</span>
              </div>
              <div className="flex gap-2">
                 <span className={THEMES[theme].text}>SWP </span>
                 <span className={THEMES[theme].accent}>[{'.'.repeat(30)}]</span>
                 <span className={THEMES[theme].textDim}>0% (0/0MB)</span>
              </div>
           </div>
        )});

        newHistory.push({ type: 'output', text: '  PID USER      PR  NI  VIRT  RES  SHR S  %CPU %MEM     TIME+ COMMAND', className: `${THEMES[theme].bg} text-black font-bold` });
        const processes = [
           { cmd: 'fez.os', user: 'root' },
        ];
        processes.forEach((p, i) => {
           const pid = Math.floor(Math.random() * 8000 + 1000);
           const cpu = (Math.random() * 5).toFixed(1);
           const mem = (Math.random() * 10).toFixed(1);
           const time = `${Math.floor(Math.random()*10)}:${Math.floor(Math.random()*60).toString().padStart(2, '0')}.${Math.floor(Math.random()*99)}`;
           const row = `${pid} ${p.user.padEnd(8)}  20   0 ${Math.floor(Math.random()*999)}M  ${Math.floor(Math.random()*99)}M 8840 S   ${cpu}  ${mem}   ${time} ${p.cmd}`;
           newHistory.push({ type: 'output', text: row, className: i % 2 === 0 ? THEMES[theme].text : THEMES[theme].textDim });
        });
        newHistory.push({ type: 'output', text: `Tasks: ${processes.length} total, 1 running, ${processes.length-1} sleeping`, className: `${THEMES[theme].accent} mt-2` });
        break;
      case 'color':
        const newTheme = theme === 'green' ? 'amber' : 'green';
        setTheme(newTheme);
        newHistory.push({ type: 'output', text: `DISPLAY MODE CHANGED TO: ${newTheme.toUpperCase()}`, className: `${THEMES[newTheme].accent} font-bold` }); // Use newTheme for immediate feedback color
        break;
      case 'traits':
        newHistory.push({ type: 'output', text: 'DETECTED TRAITS:', className: `${THEMES[theme].accent} font-bold mt-2` });
        Object.entries(aboutData.traits).forEach(([key, trait]) => {
          newHistory.push({ type: 'output', content: (
            <span><span className={THEMES[theme].text}>[{key.toUpperCase()}]</span> <span className={`${THEMES[theme].text} font-bold`}>{trait.title}</span></span>
          )});
          newHistory.push({ type: 'output', text: `  > ${trait.desc}`, className: `${THEMES[theme].textDim} pl-4` });
        });
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: 'INSTALLED MODULES:', className: `${THEMES[theme].accent} font-bold mt-2` });
        aboutData.skills.forEach(skill => {
          const bar = '█'.repeat(Math.floor(skill.level / 10)) + '░'.repeat(10 - Math.floor(skill.level / 10));
          newHistory.push({ type: 'output', content: (
             <span>
               <span className={`${THEMES[theme].text} font-bold inline-block w-24`}>{skill.name}</span>
               <span className={THEMES[theme].accent}>[{bar}]</span>
               <span className={THEMES[theme].textDim}> {skill.level}%</span>
             </span>
          )});
        });
        break;
      case 'exp':
        newHistory.push({ type: 'output', text: 'MISSION LOGS:', className: `${THEMES[theme].accent} font-bold mt-2` });
        aboutData.experience.forEach(exp => {
          newHistory.push({ type: 'output', content: (
             <span><span className={THEMES[theme].textDim}>[{exp.period}]</span> <span className={`${THEMES[theme].text} font-bold`}>{exp.company}</span></span>
          )});
          newHistory.push({ type: 'output', text: `  > ${exp.role}`, className: `${THEMES[theme].accent} pl-4` });
        });
        break;
      case 'status':
        newHistory.push({ type: 'output', text: 'SYSTEM NORMAL. ALL SYSTEMS GO.', className: `${THEMES[theme].text} font-bold` });
        newHistory.push({ type: 'output', text: `UPTIME: ${aboutData.stats.find(s => s.label === "Uptime")?.value || '99.9%'}`, className: THEMES[theme].textDim });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', text: `USER: ${aboutData.profile.name}`, className: `${THEMES[theme].text} font-bold` });
        newHistory.push({ type: 'output', text: `ROLE: ${aboutData.profile.role}`, className: THEMES[theme].textDim });
        break;
      case 'contact':
        newHistory.push({ type: 'output', text: 'CONNECTIVITY PROTOCOLS:', className: `${THEMES[theme].accent} font-bold mt-2` });
        const contacts = [
           { label: 'EMAIL', val: aboutData.profile.email },
           { label: 'LINKEDIN', val: '/in/ahmedsamilbulbul' },
           { label: 'GITHUB', val: '/fezcode' },
           { label: 'TWITTER', val: '@fezcode' },
        ];
        contacts.forEach(c => {
           newHistory.push({ type: 'output', content: (
              <span><span className={`${THEMES[theme].text} w-20 inline-block`}>{c.label}:</span> <span className={THEMES[theme].textDim}>{c.val}</span></span>
           )});
        });
        break;
      case 'version':
        newHistory.push({ type: 'output', text: `FEZ.OS BUILD v${version}`, className: `${THEMES[theme].accent} font-bold` });
        break;
      case 'history':
        if (commandHistory.length === 0) {
          newHistory.push({ type: 'output', text: 'No history found.', className: THEMES[theme].textDim });
        } else {
          commandHistory.forEach((cmd, i) => {
            newHistory.push({ type: 'output', text: `  ${i + 1}  ${cmd}`, className: THEMES[theme].textDim });
          });
        }
        break;
      case 'home':
        newHistory.push({ type: 'output', text: 'INITIATING TRANSPORT SEQUENCE...', className: 'animate-pulse text-red-500 font-bold' });
        setTimeout(() => navigate('/'), 800);
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        break;
      case 'sudo':
        newHistory.push({ type: 'output', text: 'Checking user privileges...', className: `${THEMES[theme].text} font-bold` });
        newHistory.push({ type: 'output', text: `Access Granted...`, className: THEMES[theme].textDim });
        unlockAchievement('su-done');
        break;
      case 'bsod':
        newHistory.push({ type: 'output', text: 'FEZ.OS cannot be crashed. Sorry, not sorry.', className: `${THEMES[theme].text} font-bold` });
        break;
      case 'date':
        newHistory.push({ type: 'output', text: new Date().toLocaleString(), className: THEMES[theme].text });
        break;
      case 'motd':
        newHistory.push({ type: 'output', text: 'WELCOME, OPERATOR. SYSTEM STATUS: OPTIMAL. ACCESS GRANTED.', className: `${THEMES[theme].accent} ` });
        break;
      case 'ping':
        newHistory.push({ type: 'output', text: 'pong', className: THEMES[theme].text });
        break;
      case 'os':
        newHistory.push({ type: 'output', text: 'OPERATING SYSTEM INFORMATION:', className: `${THEMES[theme].accent} font-bold mt-2` });
        newHistory.push({ type: 'output', text: `  OS Name: FEZ.OS Galactic Edition`, className: THEMES[theme].textDim });
        newHistory.push({ type: 'output', text: `  Architecture: x64`, className: THEMES[theme].textDim });
        newHistory.push({ type: 'output', text: `  Kernel Version: 3.5.0-2077-generic-cigdem-edition`, className: THEMES[theme].textDim });
        newHistory.push({ type: 'output', text: `  Build Date: ${new Date().toISOString().slice(0, 10)}`, className: THEMES[theme].textDim });
        newHistory.push({ type: 'output', text: `  Hostname: FEZ-GH_PAGES_SERVER-ALPHA-01`, className: THEMES[theme].textDim });
        newHistory.push({ type: 'output', text: `  GUI: FEZ.OS React Shell`, className: THEMES[theme].textDim });
        break;
      case 'neofetch':
        const uptimeSeconds = Math.floor(Math.random() * (24 * 3600 * 7)) + 3600; // Up to 7 days + 1 hour
        const days = Math.floor(uptimeSeconds / (3600 * 24));
        const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);

        const neofetchOutput = [
          `\n`,
          `    _.-^-._    ${THEMES[theme].accent}FEZ.OS${THEMES[theme].textDim}`,
          `   /_______\\   ------------------`,
          `  |   .-.   |   Host: FEZ-GH_PAGES_SERVER-ALPHA-01`,
          `  |   '-'   |   OS: FEZ.OS Galactic Edition`,
          `  \`---------'   Kernel: 3.5.0-2077-generic-cigdem-edition`,
          `                Uptime: ${days} days, ${hours} hours, ${minutes} minutes`,
          `                Shell: fesh`,
          `                Resolution: 1920x1080`,
          `                Terminal: FEZ.OS React Shell`,
          `                CPU: iMDtel Coreyzhen XX-1000Z (8) @ 5.00GHz`,
          `                GPU: Generic PnP Graphics Card 90960`,
          `                Memory: 8GB / 32GB`,
          `\n`
        ];
        neofetchOutput.forEach(line => {
          newHistory.push({ type: 'output', text: line, className: THEMES[theme].text });
        });
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${trimmed}`, className: 'text-red-500 font-bold' });
    }
    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <div className={`h-[400px] bg-black border ${THEMES[theme].border} p-2 font-mono text-xs overflow-hidden flex flex-col`}
         onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={`whitespace-pre ${line.className || (line.type === 'input' ? `${THEMES[theme].text} mt-1` : THEMES[theme].textDim)}`}>
            {line.type === 'input' ? '> ' : ''}
            {line.content || line.text}
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div className={`flex items-center gap-1 mt-1 ${THEMES[theme].text}`}>
        <span>$</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`bg-transparent border-none outline-none flex-grow ${THEMES[theme].text} font-bold`}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

const NeuromancerHUD = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [theme, setTheme] = useState('green');

  return (
    <div
      className={`relative h-full bg-black ${THEMES[theme].text} font-mono overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-24 pb-32`}>
      <ScanLine theme={theme} />

      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(${THEMES[theme].grid} 1px, transparent 1px), linear-gradient(90deg, ${THEMES[theme].grid} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Header / Identity Block */}
        <div
          className={`col-span-1 md:col-span-12 flex flex-col md:flex-row justify-between items-end border-b ${THEMES[theme].border} pb-4 mb-4`}>
          <div>
            <motion.h1
              initial={{x: -100, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
            >
              {aboutData.profile.name}
            </motion.h1>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className={`flex items-center gap-2 ${THEMES[theme].textDim}`}
            >
              <Cpu size={16}/>
              <span>{aboutData.profile.role}</span>
              <span className="mx-2">{`//`}</span>
              <span>ID: FEZ-8492</span>
            </motion.div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {aboutData.stats.map((stat, idx) => (
              <div key={idx} className="text-right">
                <div className={`text-xs ${THEMES[theme].textDim} uppercase`}>{stat.label}</div>
                <div className="text-xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Column: Navigation/Status */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <HudBox title="System Modules" delay={0.1} theme={theme}>
            <ul className="space-y-2">
              {[
                {id: 'status', label: 'Status Overview', icon: Crosshair},
                {id: 'skills', label: 'Skill Matrix', icon: ListDashes},
                {id: 'logs', label: 'Mission Logs', icon: GitCommit},
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-3 ${
                      activeTab === item.id
                        ? `${THEMES[theme].bg} text-black ${THEMES[theme].borderStrong} font-bold`
                        : `bg-transparent ${THEMES[theme].border} ${THEMES[theme].text} hover:${THEMES[theme].borderStrong}`
                    }`}
                  >
                    <item.icon/>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </HudBox>

          <HudBox title="Traits" delay={0.2} theme={theme}>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
               {Object.entries(aboutData.traits).map(([key, trait]) => (
                 <div key={key} className="group">
                    <div className={`${THEMES[theme].accent} text-xs mb-1 group-hover:text-white transition-colors uppercase`}>{key}</div>
                    <div className={`font-bold flex items-center gap-2 ${key === 'kryptonite' ? 'text-red-400' : ''}`}>
                      {trait.icon && <trait.icon className={key === 'superpower' ? 'animate-pulse' : ''} />}
                      {trait.title}
                    </div>
                 </div>
               ))}
            </div>
          </HudBox>
        </div>

        {/* Main Display Area */}
        <div className="col-span-1 md:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                className="space-y-6"
              >
                <HudBox title="Interactive Shell" theme={theme}>
                  <MiniTerminal theme={theme} setTheme={setTheme} />
                </HudBox>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HudBox title="War Story Analysis" theme={theme}>
                    <div className={THEMES[theme].textDim}>
                      <strong className="block text-white mb-2">{aboutData.traits.warStory.title}</strong>
                      {aboutData.traits.warStory.desc}
                    </div>
                  </HudBox>
                  <HudBox title="Audio Synthesis" theme={theme}>
                    <div className={THEMES[theme].textDim}>
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
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                className="grid grid-cols-1 gap-4"
              >
                {aboutData.skills.map((skill, i) => (
                  <div key={i} className={`flex items-center gap-4 ${THEMES[theme].bgDim} p-2 border ${THEMES[theme].border}`}>
                    <skill.icon size={24}/>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className={`h-2 ${THEMES[theme].bg} w-full overflow-hidden`}>
                        <motion.div
                          initial={{width: 0}}
                          animate={{width: `${skill.level}%`}}
                          transition={{delay: 0.2 + (i * 0.1), duration: 1}}
                          className={`h-full ${THEMES[theme].text.replace('text-', 'bg-')}`}
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
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                className="space-y-4"
              >
                {aboutData.experience.map((exp, i) => (
                  <div key={i} className={`border-l-2 ${THEMES[theme].borderStrong} pl-4 py-2 hover:${THEMES[theme].bgDim} transition-colors`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-white text-lg">{exp.company}</h4>
                      <span className={`text-xs ${THEMES[theme].bg} px-2 py-1 rounded text-black font-bold`}>{exp.period}</span>
                    </div>
                    <div className={`${THEMES[theme].accent} text-sm mb-2`}>{exp.role}</div>
                    <p className={THEMES[theme].textDim}>{exp.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Useless Footer */}
      <div className={`fixed bottom-2 right-4 text-[10px] ${THEMES[theme].textDim} font-mono opacity-50 select-none z-50 text-right`}>
         <div>MEM_ADDR: 0x8F4A2C1</div>
         <div>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
         <div>© 2077 FEZ.CORP // NO RIGHTS RESERVED</div>
      </div>
    </div>
  );
};

export default NeuromancerHUD;
