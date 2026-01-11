import React, { useState, useEffect, useRef, useMemo } from 'react';
import { XCircleIcon } from '@phosphor-icons/react';
import { useAchievements } from '../context/AchievementContext';

const BOOT_SEQUENCE = [
  'INITIALIZING SYSTEM...',
  'LOADING KERNEL... OK',
  'MOUNTING VOLUMES... OK',
  'CONNECTING TO SATELLITE... SUCCESS',
  'DECRYPTING ARCHIVES...',
  'WELCOME TO VAGUE_OS v1.0',
  'TYPE "help" FOR INSTRUCTIONS.'
];

const COMMANDS = ['help', 'ls', 'cd', 'cat', 'view', 'download', 'clear', 'exit', 'unlock'];

const TheVagueTerminal = ({ issues, onExit, onOpenIssue }) => {
  const { unlockAchievement } = useAchievements();
  // File System Simulation
  // Structure: { 'filename': { type: 'file' | 'dir', content: ..., metadata: ... } }

  const fileSystem = useMemo(() => {
    const fs = {
      'README.TXT': {
        type: 'file',
        content: 'WELCOME TO THE VAGUE ARCHIVES.\nACCESS IS RESTRICTED.\nUSE STANDARD COMMANDS TO NAVIGATE.\n\nCOMMANDS:\n  ls    - LIST ARTIFACTS\n  cat   - READ ARTIFACT\n  view  - VISUALIZE ARTIFACT\n  clear - FLUSH BUFFER\n  exit  - TERMINATE SESSION'
      },
      'ISSUES': {
        type: 'dir',
        children: {}
      }
    };

    // Populate Issues
    issues.forEach((issue, index) => {
      let baseName = issue.id || `issue_${(index + 1).toString().padStart(2, '0')}`;
      const filename = `${baseName.toLowerCase()}.dat`;
      fs['ISSUES'].children[filename] = {
        type: 'file',
        content: `Title: ${issue.title}\nDate: ${issue.date}\n---\n${issue.description}\n---\nLink: ${issue.link}`,
        metadata: issue
      };
    });

    return fs;
  }, [issues]);

  const [history, setHistory] = useState([]); // Output history
  const [commandHistory, setCommandHistory] = useState([]); // Input history
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 = new line
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState(['ROOT']); // Path stack
  const [isBooting, setIsBooting] = useState(true);
  const [activeProcess, setActiveProcess] = useState(null); // { type: 'download', file: object, progress: 0 }
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Boot Effect
  useEffect(() => {
    let timer;
    let step = 0;

    const runBoot = () => {
      if (step < BOOT_SEQUENCE.length) {
        setHistory(prev => [...prev, { type: 'system', text: BOOT_SEQUENCE[step] }]);
        step++;
        timer = setTimeout(runBoot, 800);
      } else {
        setIsBooting(false);
      }
    };

    runBoot();
    return () => clearTimeout(timer);
  }, []);

  // Process Effect (Download Simulation)
  useEffect(() => {
    if (!activeProcess) return;

    if (activeProcess.type === 'download') {
        if (activeProcess.progress < 100) {
            const timeout = setTimeout(() => {
                setActiveProcess(prev => ({ ...prev, progress: prev.progress + 5 })); // Increment
            }, 150); // Speed of download
            return () => clearTimeout(timeout);
        } else {
            // Complete
            setHistory(prev => [...prev, { type: 'response', text: `DOWNLOAD COMPLETE: ${activeProcess.file.metadata.title}` }]);

            // Trigger Actual Download
            const issue = activeProcess.file.metadata;
            if (issue.link) {
                const link = document.createElement('a');
                let url = issue.link;
                if (!url.startsWith('http') && !url.startsWith('https')) {
                    url = `/the_vague/${url}`;
                }

                link.href = url;
                link.setAttribute('download', issue.title || 'download');
                link.setAttribute('target', '_blank'); // Fallback for some browsers
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                setHistory(prev => [...prev, { type: 'error', text: 'ERROR: NO LINK DATA CORRUPTED.' }]);
            }

            setActiveProcess(null);
        }
    }
  }, [activeProcess, onOpenIssue]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, input, activeProcess]);

  // Focus keeper
  useEffect(() => {
    if (!isBooting && !activeProcess) {
        inputRef.current?.focus();
    }
  }, [isBooting, history, activeProcess]);

  const getCurrentDirObj = () => {
    let current = fileSystem;
    // Special case for ROOT which is the container
    if (cwd.length === 1) return current;

    // Traverse
    for (let i = 1; i < cwd.length; i++) {
        const part = cwd[i];
        if (current[part] && current[part].type === 'dir') {
             if (i === 1 && part === 'ISSUES') return current['ISSUES'].children;
        }
    }
    return current;
  };

      const findEntry = (dir, name) => {
          if (!name) return null;
          const lowerName = name.toLowerCase();

          // Exact match
          let key = Object.keys(dir).find(k => k.toLowerCase() === lowerName);
          if (key) return dir[key];

          // Try extensions
          key = Object.keys(dir).find(k => k.toLowerCase() === `${lowerName}.dat`);
          if (key) return dir[key];

          key = Object.keys(dir).find(k => k.toLowerCase() === `${lowerName}.txt`);
          if (key) return dir[key];

          return null;
      };
  const renderProgressBar = (percent) => {
      const width = 20;
      const filled = Math.floor((percent / 100) * width);
      const empty = width - filled;
      const bar = '█'.repeat(filled) + '.'.repeat(empty);
      return `[${bar}] ${percent}%`;
  };

  const executeCommand = () => {
      const cmdLine = input.trim();
      setHistory(prev => [...prev, { type: 'input', text: `${cwd.join('/')}> ${cmdLine}` }]);

      if (cmdLine) {
          setCommandHistory(prev => [...prev, cmdLine]);
      }
      setHistoryIndex(-1); // Reset history index when a new command is entered
      setInput('');

      if (!cmdLine) return;

      const args = cmdLine.split(' ');
      const cmd = args[0].toLowerCase();
      const param = args[1];

      const currentDir = getCurrentDirObj();

      switch (cmd) {
        case 'help':
          setHistory(prev => [...prev, { type: 'response', text: 'AVAILABLE COMMANDS:\n  ls              List directory contents\n  cd [dir]        Change directory\n  cat [file]      Display file contents\n  view [file]     View visual data (Image)\n  download [file] Download artifact to local storage\n  unlock          Unlock restricted protocols\n  clear           Clear screen\n  exit            Return to GUI' }]);
          break;

        case 'clear':
          setHistory([]);
          break;

        case 'ls':
          const files = Object.keys(currentDir).map(k => {
             const type = (currentDir[k] && currentDir[k].type === 'dir') ? '<DIR>' : '     ';
             return `${type}  ${k}`;
          });
          setHistory(prev => [...prev, { type: 'response', text: files.join('\n') }]);
          break;

        case 'cd':
          if (!param) break;
          if (param === '..') {
            if (cwd.length > 1) setCwd(prev => prev.slice(0, -1));
          } else {
             const target = findEntry(currentDir, param);
             if (target && target.type === 'dir') {
                const realName = Object.keys(currentDir).find(k => k.toLowerCase() === param.toLowerCase());
                setCwd(prev => [...prev, realName]);
             } else {
                setHistory(prev => [...prev, { type: 'error', text: `DIRECTORY NOT FOUND: ${param}` }]);
             }
          }
          break;

        case 'cat':
          if (!param) {
              setHistory(prev => [...prev, { type: 'error', text: 'USAGE: cat [filename]' }]);
              break;
          }
          const fileToCat = findEntry(currentDir, param);
          if (fileToCat && fileToCat.type === 'file') {
             setHistory(prev => [...prev, { type: 'response', text: fileToCat.content }]);
          } else {
             setHistory(prev => [...prev, { type: 'error', text: `FILE NOT FOUND: ${param}` }]);
          }
          break;

        case 'view':
          if (!param) {
              setHistory(prev => [...prev, { type: 'error', text: 'USAGE: view [filename]' }]);
              break;
          }
          const fileToView = findEntry(currentDir, param);
          if (fileToView && fileToView.type === 'file' && fileToView.metadata) {
             const issue = fileToView.metadata;
             setHistory(prev => [...prev, {
                 type: 'image',
                 src: issue.thumbnail ? `/the_vague/${issue.thumbnail}` : null,
                 alt: issue.title
             }]);
          } else {
             setHistory(prev => [...prev, { type: 'error', text: `VISUAL DATA NOT FOUND: ${param}` }]);
          }
          break;

        case 'download':
           if (!param) {
               setHistory(prev => [...prev, { type: 'error', text: 'USAGE: download [filename]' }]);
               break;
           }
           const fileToDL = findEntry(currentDir, param);
           if (fileToDL && fileToDL.type === 'file' && fileToDL.metadata) {
               setActiveProcess({ type: 'download', file: fileToDL, progress: 0 });
           } else {
               setHistory(prev => [...prev, { type: 'error', text: `CANNOT DOWNLOAD: ${param}` }]);
           }
           break;

        case 'unlock':
           unlockAchievement('access_granted');
           setHistory(prev => [...prev, { type: 'response', text: 'ACCESS GRANTED.\nPROTOCOL OVERRIDE INITIATED.\nACHIEVEMENT UNLOCKED.' }]);
           break;

        case 'exit':
          onExit();
          break;

                default:
                    const fileAsCmd = findEntry(currentDir, cmd);
                    if (fileAsCmd && fileAsCmd.type === 'file') {
                        if (fileAsCmd.metadata) {
                            setHistory(prev => [...prev, { type: 'response', text: `BINARY FILE DETECTED.\nUSE 'view' OR 'download'.` }]);
                        } else {
                            setHistory(prev => [...prev, { type: 'response', text: fileAsCmd.content }]);
                        }
                    } else {
                        setHistory(prev => [...prev, { type: 'error', text: `UNKNOWN COMMAND: ${cmd}` }]);
                    }
              }  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        executeCommand();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.trim().split(' ');

        if (parts.length === 1) {
            // Autocomplete Command
            const partial = parts[0].toLowerCase();
            const match = COMMANDS.find(c => c.startsWith(partial));
            if (match) setInput(match + ' ');
        } else if (parts.length === 2) {
            // Autocomplete File/Dir
            const cmd = parts[0];
            const partial = parts[1].toLowerCase();
            const currentDir = getCurrentDirObj();
            const match = Object.keys(currentDir).find(k => k.toLowerCase().startsWith(partial));
            if (match) setInput(`${cmd} ${match}`);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;

        if (historyIndex < commandHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        } else {
            setHistoryIndex(-1);
            setInput('');
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111] p-4 font-mono">

      {/* CRT CHASSIS */}
      <div className="relative w-full max-w-5xl aspect-[4/3] bg-[#2a2825] rounded-3xl p-8 sm:p-12 shadow-[0_0_0_2px_#3a3835,0_20px_50px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,0.5)] border-t border-[#444]">

        {/* BRANDING */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#1a1815] font-bold tracking-[0.3em] text-xs shadow-[0_1px_0_rgba(255,255,255,0.1)]">
           FEZ-TERMINAL 6000
        </div>

        {/* POWER BUTTON */}
        <button
           onClick={onExit}
           className="absolute bottom-6 right-12 flex items-center gap-2 group cursor-pointer outline-none"
           title="Power Off System"
        >
           <span className="text-[9px] text-[#444] font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors">Power</span>
           <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red] animate-pulse group-hover:bg-red-400 group-hover:shadow-[0_0_10px_red] transition-all"></div>
        </button>

        {/* SCREEN BEZEL INSET */}
        <div className="w-full h-full bg-[#050505] rounded-[50%_/_10%] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-4 border-[#151515]">

            {/* SCREEN GLASS EFFECTS */}
            <div className="absolute inset-0 z-20 pointer-events-none rounded-[50%_/_10%] shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]"></div>
            {/* Reflection */}
            <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-gradient-to-bl from-white/5 to-transparent rounded-[50%_/_10%] pointer-events-none z-30 filter blur-xl transform rotate-12"></div>

            {/* CONTENT AREA */}
            <div
              className="absolute inset-0 z-10 p-8 overflow-y-auto scrollbar-hide text-amber-500 font-bold text-sm sm:text-base leading-relaxed"
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              style={{ textShadow: '0 0 4px rgba(245, 158, 11, 0.5)' }}
            >
               {history.map((line, idx) => {
                  if (line.type === 'image') {
                      return (
                          <div key={idx} className="my-4 border-2 border-amber-900/50 p-2 inline-block max-w-[300px]">
                              {/* ASCII/MONOTONE SIMULATION */}
                              {line.src ? (
                                  <img
                                    src={line.src}
                                    alt={line.alt}
                                    className="w-full h-auto filter grayscale contrast-[1.5] brightness-75 sepia"
                                    style={{ imageRendering: 'pixelated' }}
                                  />
                              ) : (
                                  <div className="w-[200px] h-[200px] flex items-center justify-center border border-amber-500/20 text-xs">
                                      [NO VISUAL DATA]
                                  </div>
                              )}
                              <div className="text-[10px] mt-1 text-center border-t border-amber-900/50 pt-1">FIG. {idx} - MONOTONE RENDER</div>
                          </div>
                      );
                  }
                  return (
                      <div key={idx} className={`${line.type === 'error' ? 'text-red-400' : (line.type === 'input' ? 'text-amber-300 mt-2' : 'text-amber-500')}`}>
                          <pre className="whitespace-pre-wrap font-inherit">{line.text}</pre>
                      </div>
                  );
               })}

               {!isBooting && !activeProcess && (
                   <div className="flex items-center gap-2 mt-2">
                       <span>{cwd.join('/')}></span>
                       <input
                         ref={inputRef}
                         type="text"
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         onKeyDown={handleKeyDown}
                         className="bg-transparent border-none outline-none flex-1 text-amber-500 placeholder-amber-900/50"
                         autoFocus
                         spellCheck={false}
                         autoComplete="off"
                       />
                       <span className="animate-pulse bg-amber-500 w-2 h-4 -ml-1"></span>
                   </div>
               )}

               {activeProcess && activeProcess.type === 'download' && (
                   <div className="mt-4 text-amber-500 animate-pulse">
                       <div>DOWNLOADING {activeProcess.file.metadata.title}...</div>
                       <div className="font-mono mt-1">{renderProgressBar(activeProcess.progress)}</div>
                   </div>
               )}
            </div>

            {/* SCANLINES OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
        </div>
      </div>

      {/* EXIT HINT (Outside Monitor) */}
      <button onClick={onExit} className="absolute top-4 right-4 text-white hover:text-red-500 flex items-center gap-2 text-xs uppercase tracking-widest transition-colors z-[110]">
          <XCircleIcon size={24} />
          <span>Jack Out</span>
      </button>

    </div>
  );
};

export default TheVagueTerminal;
