import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { vocabulary } from '../data/vocabulary';
import {
  ArrowLeft,
  FloppyDisk,
  TerminalWindow,
  FileText,
  Globe,
  Monitor,
  Clock,
  ChatText,
  X,
  User,
  Folder,
  Book,
  Brain,
  Gear,
} from '@phosphor-icons/react';
import 'katex/dist/katex.min.css';

// --- Assets & Constants ---
const QUOTES = [
  'The work is mysterious and important.',
  'Praise Kier.',
  'A handshake is available upon request.',
  'Please try to enjoy each fact equally.',
  'Defiant jazz is not permitted.',
  'The board is watching.',
  'Your outie has a life.',
  'Serve Kier, and you shall be served.',
  'Visualise the data.',
  'Refine the temper.',
];

// --- Audio Utility ---
const useRetroAudio = () => {
  const audioCtxRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((freq, type, duration, vol = 0.1) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

    gain.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtxRef.current.currentTime + duration,
    );

    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  }, []);

  const playClick = useCallback(
    () => playTone(800, 'square', 0.05, 0.05),
    [playTone],
  );
  const playKeystroke = useCallback(
    () => playTone(600 + Math.random() * 200, 'triangle', 0.03, 0.03),
    [playTone],
  );
  const playEnter = useCallback(
    () => playTone(400, 'sine', 0.2, 0.1),
    [playTone],
  );
  const playError = useCallback(
    () => playTone(150, 'sawtooth', 0.3, 0.1),
    [playTone],
  );
  const playBoot = useCallback(() => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.frequency.setValueAtTime(100, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      800,
      audioCtxRef.current.currentTime + 2,
    );
    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 1);
    gain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 3);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 3);
  }, []);

  return {
    initAudio,
    playClick,
    playKeystroke,
    playEnter,
    playError,
    playBoot,
  };
};

// --- Sub-Components ---

const BootScreen = ({ onComplete, initAudio }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      {
        t: 100,
        action: () => {
          initAudio();
          setStep(1);
        },
      }, // Blank start
      { t: 300, action: () => setStep(2) }, // Logo/Init
      { t: 400, action: () => setStep(4) }, // Fast Progress
      { t: 200, action: () => onComplete() }, // Done
    ];

    let accumulatedTime = 0;
    sequence.forEach(({ t, action }) => {
      accumulatedTime += t;
      setTimeout(action, accumulatedTime);
    });
  }, [onComplete, initAudio]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#000505] text-[#4fffa8] font-mono select-none cursor-none">
      {step >= 2 && (
        <div className="mb-12 flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-[#4fffa8] rounded-full flex items-center justify-center mb-4">
            <div className="text-3xl font-black italic">L</div>
          </div>
          <h1 className="text-2xl tracking-[0.5em] font-bold uppercase">
            Lumon
          </h1>
        </div>
      )}

      {step >= 2 && (
        <div className="w-64">
          <div className="h-1 w-full bg-[#00333b]">
            <div
              className="h-full bg-[#4fffa8] transition-all duration-[500ms] ease-linear"
              style={{ width: step >= 4 ? '100%' : '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondsDegrees = (time.getSeconds() / 60) * 360 + 90;
  const minsDegrees = (time.getMinutes() / 60) * 360 + 90;
  const hourDegrees =
    ((time.getHours() % 12) / 12) * 360 + (time.getMinutes() / 60) * 30 + 90;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Analog Clock */}
      <div className="w-20 h-20 border-2 border-[#4fffa8] rounded-full relative bg-[#001a1f] shadow-[0_0_10px_rgba(79,255,168,0.2)]">
        <div
          className="absolute top-1/2 left-1/2 w-[35%] h-[2px] bg-[#4fffa8] origin-[0%_50%] rounded-full"
          style={{ transform: `translate(0, -50%) rotate(${hourDegrees}deg)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[45%] h-[1px] bg-[#4fffa8] origin-[0%_50%] rounded-full"
          style={{ transform: `translate(0, -50%) rotate(${minsDegrees}deg)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[48%] h-[1px] bg-[#ff4f4f] origin-[0%_50%]"
          style={{
            transform: `translate(0, -50%) rotate(${secondsDegrees}deg)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#4fffa8] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Digital Clock */}
      <div className="font-mono text-xl font-bold tracking-widest text-[#4fffa8]">
        {time.toLocaleTimeString([], { hour12: false })}
      </div>
    </div>
  );
};

const VocabModal = ({ termKey, onClose, playClick }) => {
  const [ContentComponent, setContentComponent] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const loadVocab = async () => {
      const entry = vocabulary[termKey];
      if (entry) {
        setTitle(entry.title);
        try {
          const module = await entry.loader();
          // The vocab files export a React component as default
          setContentComponent(() => module.default);
        } catch (e) {
          console.error(e);
          setContentComponent(() => () => (
            <div className="text-red-500">Error loading definition data.</div>
          ));
        }
      } else {
        setTitle('Unknown Term');
        setContentComponent(() => () => (
          <div className="text-yellow-500">
            Definition not found in local database.
          </div>
        ));
      }
    };
    loadVocab();
  }, [termKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#001a1f] border-2 border-[#4fffa8] shadow-[0_0_20px_rgba(79,255,168,0.3)] animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-[#005f6b] bg-[#001014]">
          <h3 className="text-xl font-bold text-[#4fffa8] uppercase tracking-widest">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[#005f6b] hover:text-[#ff4f4f] transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-invert prose-p:text-[#e8f7f7] prose-headings:text-[#4fffa8] prose-a:text-[#4fffa8]">
          {ContentComponent ? <ContentComponent /> : 'Loading definition...'}
        </div>
        <div className="p-4 border-t border-[#005f6b] bg-[#001014] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4fffa8] text-[#001a1f] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

const FileViewer = ({ file, type, onClose, playClick, onVocabClick }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'post') {
      setLoading(true);
      const fetchPath = file.content
        ? null
        : `/posts/${file.filename || file.slug + '.txt'}`;

      if (fetchPath) {
        fetch(fetchPath)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to load');
            return res.text();
          })
          .then((text) => {
            const cleanText = text.replace(/^---[\s\S]*?---/, '').trim();
            setContent(cleanText);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setContent('Error: Data file corrupted or missing from archives.');
            setLoading(false);
          });
      } else {
        setContent(file.content || file.excerpt);
        setLoading(false);
      }
    } else if (type === 'about') {
      // About content passed directly
      setContent(file.content);
    }
  }, [file, type]);

  const MarkdownComponents = {
    a: ({ href, children, ...props }) => {
      const isVocab = href && href.startsWith('/vocab/');
      const handleClick = (e) => {
        if (isVocab) {
          e.preventDefault();
          const term = href.replace('/vocab/', '');
          onVocabClick(term);
          playClick();
        }
      };

      if (isVocab) {
        return (
          <a
            href={href}
            onClick={handleClick}
            className="text-[#4fffa8] underline decoration-dashed cursor-pointer"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4fffa8] hover:text-white"
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="h-full flex flex-col bg-[#001a1f] text-[#e8f7f7] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* File Header */}
      <div className="border-b border-[#005f6b] p-6 flex justify-between items-start bg-[#001014] shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#4fffa8] mb-2 flex items-center gap-2">
            {type === 'about' ? <User size={16} /> : <FileText size={16} />}
            {type === 'project'
              ? 'Project_Manifest'
              : type === 'about'
                ? 'Personnel_File'
                : 'Blog_Transmission'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            {file.title || file.name}
          </h2>
          {file.date && (
            <div className="text-xs text-[#005f6b] font-mono">
              {new Date(file.date).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {type === 'project' && (
            <>
              <Link
                to={`/projects/${file.slug}`}
                target="_blank"
                className="px-4 py-2 border border-[#4fffa8] text-[#4fffa8] text-xs uppercase tracking-widest hover:bg-[#4fffa8] hover:text-[#001a1f] transition-colors flex items-center gap-2"
              >
                <Monitor size={16} />
                GUI View
              </Link>
              {file.url && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  className="px-4 py-2 border border-[#4fffa8] bg-[#4fffa8] text-[#001a1f] text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Globe size={16} />
                  Launch
                </a>
              )}
            </>
          )}
          {onClose && (
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="px-4 py-2 border border-[#4fffa8] text-[#4fffa8] text-xs uppercase tracking-widest hover:bg-[#4fffa8] hover:text-[#001a1f] transition-colors"
            >
              Close_File
            </button>
          )}
        </div>
      </div>

      {/* File Content */}
      <div className="flex-grow p-8 overflow-y-auto font-mono leading-relaxed space-y-6">
        {type === 'project' && file.shortDescription && (
          <div className="text-[#4fffa8] text-xl font-bold mb-2">
            {file.shortDescription}
          </div>
        )}
        {file.description && type === 'project' && (
          <div className="border-l-2 border-[#4fffa8] pl-4 py-1 text-lg opacity-90">
            {file.description}
          </div>
        )}

        {type === 'project' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#00252b] p-4">
                <h4 className="text-[10px] uppercase tracking-widest text-[#4fffa8] mb-2">
                  Status
                </h4>
                <div className="text-sm">{file.status || 'Archived'}</div>
              </div>
              <div className="bg-[#00252b] p-4">
                <h4 className="text-[10px] uppercase tracking-widest text-[#4fffa8] mb-2">
                  Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {file.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs border border-[#005f6b] px-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(type === 'post' || type === 'about') && (
          <div className="max-w-3xl pb-20 prose prose-invert prose-p:text-[#e8f7f7] prose-headings:text-[#4fffa8] prose-a:text-[#4fffa8] prose-code:text-[#ff4f4f] prose-pre:bg-[#00252b] prose-pre:border prose-pre:border-[#005f6b]">
            {loading ? (
              <div className="animate-pulse text-[#4fffa8]">
                Decryption in progress...
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={MarkdownComponents}
              >
                {content || file.excerpt || 'No content data available.'}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TerminalOutput = ({ history, isMinimized, scrollRef }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (isMinimized) return null;

  return (
    <div className="h-1/3 border-t border-[#00333b] bg-[#001014] flex flex-col shrink-0 transition-all duration-300">
      <div className="bg-[#00252b] px-4 py-1 text-[10px] uppercase tracking-widest text-[#4fffa8] flex justify-between items-center border-b border-[#00333b]">
        <span>Terminal Output</span>
        <span>Active Process: SHELL</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 font-mono text-sm space-y-2"
      >
        {history.map((entry, i) => (
          <div key={i}>
            <div className="opacity-50 text-xs mb-1">{entry.timestamp}</div>
            {entry.command && (
              <div className="text-[#80a0a0]">
                <span className="text-[#4fffa8] mr-2">{'>'}</span>
                {entry.command}
              </div>
            )}
            <div className="text-[#e8f7f7] whitespace-pre-wrap pl-4 border-l border-[#00333b] ml-1">
              {entry.response}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const CommandLine = ({ onCommand, playKeystroke, playEnter, onScroll }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    playEnter();
    onCommand(input.trim());
    setInput('');
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    playKeystroke();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onScroll('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onScroll('down');
    }
  };

  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 100);
    return () => clearInterval(focusInterval);
  }, []);

  return (
    <div className="h-12 bg-[#001014] border-t border-[#00333b] flex items-center px-4 font-mono text-sm z-30 shrink-0">
      <span className="text-[#4fffa8] mr-2 shrink-0">{'>'}</span>
      <form onSubmit={handleSubmit} className="flex-grow">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-[#e8f7f7] placeholder-[#00333b] uppercase caret-[#4fffa8]"
          placeholder="TYPE 'HELP' FOR COMMANDS..."
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

const Workstation = ({
  initAudio,
  playClick,
  playKeystroke,
  playEnter,
  playError,
}) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState([
    {
      timestamp: new Date().toLocaleTimeString(),
      response: "WELCOME TO LUMON OS v2.0.26. TYPE 'HELP' FOR INSTRUCTIONS.",
    },
  ]);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const terminalScrollRef = useRef(null);

  // Vocab Modal State
  const [vocabTerm, setVocabTerm] = useState(null);

  // Footer Widget State
  const [showClock, setShowClock] = useState(true);

  const { projects, loading: loadingProjects } = useProjects();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Vocab List
  const vocabList = Object.keys(vocabulary)
    .map((key) => ({
      id: key,
      title: vocabulary[key].title,
      name: vocabulary[key].title, // Normalized prop
      type: 'vocab',
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    // Fetch posts
    fetch('/posts/posts.json')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));

    // Fetch About
    fetch('/about-me/about.txt')
      .then((res) => res.text())
      .then((text) => setAboutContent(text))
      .catch((err) => console.error(err));
  }, []);

  const handleScroll = (direction) => {
    if (terminalScrollRef.current) {
      const scrollAmount = 50;
      terminalScrollRef.current.scrollTop +=
        direction === 'up' ? -scrollAmount : scrollAmount;
    }
  };
  const getFilteredData = () => {
    if (activeTab === 'projects')
      return searchQuery
        ? projects.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : projects;
    if (activeTab === 'blog')
      return searchQuery
        ? posts.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : posts;
    if (activeTab === 'vocab')
      return searchQuery
        ? vocabList.filter((v) =>
            v.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : vocabList;
    return [];
  };

  const filteredData = getFilteredData();

  const addLog = (command, response) => {
    setTerminalHistory((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        command,
        response,
      },
    ]);
  };

  const handleCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // Command Logic
    if (command === 'help') {
      const helpText = `AVAILABLE COMMANDS:
    -------------------
    LIST / LS       : List files in current directory
    OPEN / VIEW <ID>: Open file by ID (e.g. OPEN 1) or Name
    SEARCH / FIND   : Filter current list by <TEXT>
    BACK / CLOSE    : Close current file / Return to list
    RUN / LAUNCH    : Open external live project URL
    VISIT / GUI     : Open project in standard GUI mode
    TERM            : Toggle terminal window visibility
    FULLSCREEN      : Toggle terminal fullscreen mode
    PROJECTS        : Switch to Macrodata directory
    BLOG            : Switch to Handbook directory
    VOCAB           : Switch to Knowledge directory
    ABOUT           : View Personnel File
    SYSTEM          : Switch to System Config directory
    CLEAR           : Clear terminal history
    EXIT            : Return to standard homepage`;
      addLog(cmd, helpText);
    } else if (command === 'term') {
      setIsTerminalMinimized((prev) => !prev);
      addLog(
        cmd,
        isTerminalMinimized ? 'TERMINAL RESTORED' : 'TERMINAL MINIMIZED',
      );
    } else if (command === 'list' || command === 'ls') {
      if (activeTab === 'about' || activeTab === 'system') {
        addLog(cmd, 'NO LISTABLE ITEMS IN THIS DIRECTORY.');
      } else {
        setSearchQuery('');
        const itemsList = filteredData
          .map(
            (item, idx) =>
              `[${String(idx + 1).padStart(2, '0')}] ${item.title || item.name}`,
          )
          .join('\n');
        addLog(
          cmd,
          `LISTING ALL ${activeTab.toUpperCase()} FILES...\n\n${itemsList}\n\nTOTAL: ${filteredData.length} ITEMS.`,
        );
      }
    } else if (command === 'search' || command === 'find') {
      if (activeTab === 'about' || activeTab === 'system') {
        addLog(cmd, 'SEARCH NOT AVAILABLE IN THIS DIRECTORY.');
      } else {
        setSearchQuery(args);
        const itemsList = getFilteredData()
          .map(
            (item, idx) =>
              `[${String(idx + 1).padStart(2, '0')}] ${item.title || item.name}`,
          )
          .join('\n');

        addLog(
          cmd,
          args
            ? `FILTERING BY "${args.toUpperCase()}"...\n\n${itemsList}\n\nFOUND ${getFilteredData().length} MATCHES.`
            : 'CLEARED SEARCH FILTER.',
        );
      }
    } else if (command === 'open' || command === 'view') {
      if (activeTab === 'about' || activeTab === 'system') {
        addLog(cmd, 'NO FILES TO OPEN IN THIS DIRECTORY.');
        return;
      }
      if (!args) {
        addLog(cmd, 'ERROR: SPECIFY FILE ID OR NAME.');
        playError();
        return;
      }

      const index = parseInt(args) - 1;
      if (!isNaN(index) && index >= 0 && index < filteredData.length) {
        const item = filteredData[index];
        if (activeTab === 'vocab') {
          setVocabTerm(item.id);
          addLog(cmd, `OPENING DEFINITION: ${item.title.toUpperCase()}...`);
        } else {
          handleFileClick(item, activeTab === 'projects' ? 'project' : 'post');
          addLog(cmd, `OPENING FILE ID ${args}: ${item.title || item.name}...`);
        }
        return;
      }

      const match = filteredData.find((f) =>
        (f.title || f.name).toLowerCase().includes(args.toLowerCase()),
      );
      if (match) {
        if (activeTab === 'vocab') {
          setVocabTerm(match.id);
          addLog(cmd, `OPENING DEFINITION: ${match.title.toUpperCase()}...`);
        } else {
          handleFileClick(match, activeTab === 'projects' ? 'project' : 'post');
          addLog(
            cmd,
            `OPENING "${(match.title || match.name).toUpperCase()}"...`,
          );
        }
      } else {
        addLog(cmd, `ERROR: FILE "${args.toUpperCase()}" NOT FOUND.`);
        playError();
      }
    } else if (command === 'back' || command === 'close') {
      if (selectedFile) {
        setSelectedFile(null);
        addLog(cmd, 'FILE CLOSED.');
      } else {
        addLog(cmd, 'NO FILE OPEN.');
      }
    } else if (command === 'run' || command === 'launch') {
      if (selectedFile && selectedFile.type === 'project' && selectedFile.url) {
        window.open(selectedFile.url, '_blank');
        addLog(cmd, 'LAUNCHING EXTERNAL ARTIFACT...');
      } else {
        addLog(cmd, 'ERROR: NO EXECUTABLE ARTIFACT LOADED.');
        playError();
      }
    } else if (command === 'visit' || command === 'gui') {
      if (selectedFile && selectedFile.type === 'project') {
        window.open(`/projects/${selectedFile.slug}`, '_blank');
        addLog(cmd, 'OPENING ARTIFACT IN GUI VISUALIZER...');
      } else {
        addLog(cmd, 'ERROR: NO PROJECT LOADED TO VISIT.');
        playError();
      }
    } else if (command === 'projects' || command === 'cd projects') {
      handleTabChange('projects');
      addLog(cmd, 'DIRECTORY CHANGED: MACRODATA (PROJECTS)');
    } else if (command === 'blog' || command === 'cd blog') {
      handleTabChange('blog');
      addLog(cmd, 'DIRECTORY CHANGED: HANDBOOK (BLOG)');
    } else if (command === 'vocab' || command === 'cd vocab') {
      handleTabChange('vocab');
      addLog(cmd, 'DIRECTORY CHANGED: KNOWLEDGE (VOCAB)');
    } else if (command === 'about' || command === 'cd about') {
      handleTabChange('about');
      addLog(cmd, 'DIRECTORY CHANGED: PERSONNEL FILE');
    } else if (command === 'system' || command === 'cd system') {
      handleTabChange('system');
      addLog(cmd, 'DIRECTORY CHANGED: SYSTEM CONFIG');
    } else if (command === 'exit') {
      navigate('/');
    } else if (command === 'clear') {
      setTerminalHistory([]);
      setSearchQuery('');
    } else if (command === 'fullscreen') {
      toggleFullscreen();
      addLog(cmd, 'TOGGLING FULLSCREEN MODE...');
    } else {
      addLog(cmd, `UNKNOWN COMMAND: ${command}`);
      playError();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleFileClick = (file, type) => {
    playClick();
    setSelectedFile({ ...file, type });
  };

  const handleTabChange = (tab) => {
    playClick();
    setActiveTab(tab);
    setSelectedFile(null);
    setSearchQuery('');
  };

  const renderList = () => {
    if (activeTab === 'about') {
      return (
        <FileViewer
          file={{
            title: 'PERSONNEL FILE: A. SAMIL BULBUL',
            content: aboutContent,
            date: new Date().toISOString(),
          }}
          type="about"
          playClick={playClick}
          onVocabClick={(term) => {
            setVocabTerm(term);
            playClick();
          }}
        />
      );
    }

    if (activeTab === 'projects') {
      if (loadingProjects)
        return (
          <div className="p-8 text-[#4fffa8] animate-pulse">
            Scanning Archives...
          </div>
        );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6 pb-20">
          {filteredData.map((p, idx) => (
            <button
              key={p.slug}
              onClick={() => handleFileClick(p, 'project')}
              className="group text-left border border-[#005f6b] bg-[#00252b] p-4 hover:border-[#4fffa8] hover:bg-[#00333b] transition-all relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity font-mono text-2xl font-bold">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#e8f7f7] uppercase tracking-wide truncate pr-6">
                  {p.title}
                </h3>
              </div>

              <p className="text-xs text-[#80a0a0] line-clamp-2 mb-4 flex-grow">
                {p.shortDescription || p.description}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                {' '}
                <div className="text-[10px] uppercase tracking-widest text-[#4fffa8] flex justify-between w-full">
                  <span>{p.technologies?.[0] || 'Unknown'}</span>
                  <span>{p.size || '1'}KB</span>
                </div>
                <div className="pt-2 border-t border-[#005f6b]/30 flex justify-between">
                  <span className="text-[9px] uppercase font-bold text-[#4fffa8]/60 group-hover:text-[#4fffa8] transition-colors">
                    [View Manifest]
                  </span>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                      }}
                      className="text-[9px] uppercase font-bold text-[#ff4f4f] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Globe size={10} />
                      Launch Ext
                    </a>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-[#005f6b] text-center py-12 uppercase tracking-widest">
              No artifacts found matching query.
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'blog') {
      return (
        <div className="flex flex-col gap-1 p-6 pb-20">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-[#005f6b] text-[10px] uppercase tracking-widest text-[#80a0a0] font-bold">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-5">Subject</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2 text-right">Size</div>
          </div>
          {filteredData.map((post, idx) => (
            <button
              key={post.slug}
              onClick={() => handleFileClick(post, 'post')}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#00333b] text-left border-b border-[#005f6b]/30 items-center group transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-[#005f6b] group-hover:text-[#4fffa8]">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="col-span-2 text-xs font-mono text-[#005f6b] group-hover:text-[#4fffa8]">
                {post.date
                  ? new Date(post.date).toLocaleDateString(undefined, {
                      month: '2-digit',
                      day: '2-digit',
                      year: '2-digit',
                    })
                  : 'Unknown'}
              </div>
              <div className="col-span-5 font-medium text-[#e8f7f7] group-hover:text-white truncate">
                {post.title}
              </div>
              <div className="col-span-2">
                {post.tags?.[0] && (
                  <span className="text-[9px] border border-[#005f6b] text-[#80a0a0] px-1 uppercase">
                    {post.tags[0]}
                  </span>
                )}
              </div>
              <div className="col-span-2 text-right text-xs font-mono text-[#005f6b]">
                {Math.floor(Math.random() * 800) + 200} B
              </div>
            </button>
          ))}
          {filteredData.length === 0 && (
            <div className="text-[#005f6b] text-center py-12 uppercase tracking-widest">
              No transmissions found matching query.
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'vocab') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-20">
          {filteredData.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                playClick();
                setVocabTerm(item.id);
              }}
              className="group text-left border border-[#005f6b] bg-[#00252b] p-4 hover:border-[#4fffa8] hover:bg-[#00333b] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity font-mono text-2xl font-bold">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h3 className="font-bold text-[#e8f7f7] uppercase tracking-wide truncate pr-6 mb-2">
                {item.title}
              </h3>
              <div className="text-[10px] uppercase tracking-widest text-[#005f6b] group-hover:text-[#4fffa8]">
                [Access Definition]
              </div>
            </button>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-[#005f6b] text-center py-12 uppercase tracking-widest">
              No definitions found matching query.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-12 flex flex-col items-center justify-center h-full text-center">
        <FloppyDisk size={48} className="mb-6 text-[#005f6b]" />
        <h2 className="text-xl uppercase tracking-widest text-[#e8f7f7] mb-2">
          System Config
        </h2>
        <p className="text-[#80a0a0] max-w-md mb-8">
          User customization is restricted by Lumon Compliance Standards. Please
          contact your department head for ergonomic adjustments.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              playClick();
              toggleFullscreen();
            }}
            className="px-6 py-3 border border-[#4fffa8] text-[#4fffa8] uppercase tracking-widest text-xs hover:bg-[#4fffa8] hover:text-[#001a1f] transition-colors flex items-center gap-2"
          >
            <Monitor size={16} />
            Toggle Fullscreen
          </button>
          <Link
            to="/"
            className="px-6 py-3 border border-[#ff4f4f] text-[#ff4f4f] uppercase tracking-widest text-xs hover:bg-[#ff4f4f] hover:text-[#001a1f] transition-colors"
          >
            Emergency Exit (Return to GUI)
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#001a1f] text-[#e8f7f7] font-sans cursor-custom select-none">
      {/* Sidebar */}
      <aside className="w-64 bg-[#001014] border-r border-[#00333b] flex flex-col z-20 shrink-0">
        <div className="p-6 border-b border-[#00333b]">
          <h1 className="text-2xl font-black italic tracking-widest text-[#4fffa8] mb-1">
            Lumon
          </h1>
          <div className="text-[9px] uppercase tracking-[0.2em] text-[#005f6b]">
            Workstation 492-E
          </div>
        </div>

        <nav className="flex-grow py-6 space-y-1">
          <button
            onClick={() => handleTabChange('projects')}
            className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold border-l-2 transition-colors flex items-center gap-3 ${activeTab === 'projects' ? 'border-[#4fffa8] bg-[#00252b] text-white' : 'border-transparent text-[#80a0a0] hover:text-white hover:bg-[#001a1f]'}`}
          >
            <Folder
              size={18}
              weight={activeTab === 'projects' ? 'fill' : 'regular'}
            />
            Macrodata (Projects)
          </button>
          <button
            onClick={() => handleTabChange('blog')}
            className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold border-l-2 transition-colors flex items-center gap-3 ${activeTab === 'blog' ? 'border-[#4fffa8] bg-[#00252b] text-white' : 'border-transparent text-[#80a0a0] hover:text-white hover:bg-[#001a1f]'}`}
          >
            <Book
              size={18}
              weight={activeTab === 'blog' ? 'fill' : 'regular'}
            />
            Handbook (Posts)
          </button>
          <button
            onClick={() => handleTabChange('vocab')}
            className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold border-l-2 transition-colors flex items-center gap-3 ${activeTab === 'vocab' ? 'border-[#4fffa8] bg-[#00252b] text-white' : 'border-transparent text-[#80a0a0] hover:text-white hover:bg-[#001a1f]'}`}
          >
            <Brain
              size={18}
              weight={activeTab === 'vocab' ? 'fill' : 'regular'}
            />
            Knowledge (Vocab)
          </button>
          <button
            onClick={() => handleTabChange('about')}
            className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold border-l-2 transition-colors flex items-center gap-3 ${activeTab === 'about' ? 'border-[#4fffa8] bg-[#00252b] text-white' : 'border-transparent text-[#80a0a0] hover:text-white hover:bg-[#001a1f]'}`}
          >
            <User
              size={18}
              weight={activeTab === 'about' ? 'fill' : 'regular'}
            />
            Personnel (About)
          </button>
          <button
            onClick={() => handleTabChange('system')}
            className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold border-l-2 transition-colors flex items-center gap-3 ${activeTab === 'system' ? 'border-[#4fffa8] bg-[#00252b] text-white' : 'border-transparent text-[#80a0a0] hover:text-white hover:bg-[#001a1f]'}`}
          >
            <Gear
              size={18}
              weight={activeTab === 'system' ? 'fill' : 'regular'}
            />
            System
          </button>
        </nav>

        <div className="p-6 border-t border-[#00333b] flex flex-col items-center min-h-[220px]">
          {showClock ? (
            <ClockWidget />
          ) : (
            <div className="text-center">
              <div className="text-[10px] text-[#005f6b] uppercase tracking-widest mb-2">
                Quote of the Day
              </div>
              <p className="text-xs italic text-[#80a0a0] leading-relaxed">
                "{QUOTES[Math.floor(Math.random() * QUOTES.length)]}"
              </p>
            </div>
          )}
          <button
            onClick={() => {
              playClick();
              setShowClock((prev) => !prev);
            }}
            className="mt-4 p-2 text-[#005f6b] hover:text-[#4fffa8] transition-colors"
            title="Toggle Widget"
          >
            {showClock ? <ChatText size={20} /> : <Clock size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative z-10 w-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-[#00333b] bg-[#001a1f] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {selectedFile && (
              <button
                onClick={() => {
                  playClick();
                  setSelectedFile(null);
                }}
                className="text-[#4fffa8] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="text-xs uppercase tracking-[0.2em] font-bold">
              {selectedFile
                ? `Viewing: ${selectedFile.title || selectedFile.name}`
                : 'LUMON INDUSTRIES // WORKSTATION'}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#4fffa8]/80 font-mono hidden md:block">
              {`/root/${activeTab}`}
            </div>
            <div className="w-px h-8 bg-[#00333b]"></div>
            <TerminalWindow
              size={24}
              weight="fill"
              className="text-[#005f6b]"
            />
          </div>
        </header>
        {/* Viewport (Scrollable) */}
        <div className="flex-grow overflow-auto bg-[#001519] relative">
          {selectedFile ? (
            <FileViewer
              file={selectedFile}
              type={selectedFile.type}
              onClose={() => setSelectedFile(null)}
              playClick={playClick}
              onVocabClick={(term) => {
                setVocabTerm(term);
                playClick();
              }}
            />
          ) : (
            renderList()
          )}
        </div>

        {/* Persistent Terminal Output */}
        <TerminalOutput
          history={terminalHistory}
          isMinimized={isTerminalMinimized}
          scrollRef={terminalScrollRef}
        />

        {/* CLI Input */}
        <CommandLine
          onCommand={handleCommand}
          playKeystroke={playKeystroke}
          playEnter={playEnter}
          onScroll={handleScroll}
        />
      </main>

      {/* Vocab Modal */}
      {vocabTerm && (
        <VocabModal
          termKey={vocabTerm}
          onClose={() => {
            setVocabTerm(null);
            playClick();
          }}
          playClick={playClick}
        />
      )}

      {/* Retro Overlay Effects */}
      <div
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-20"
        style={{
          background:
            'radial-gradient(circle at center, transparent 60%, black 100%)',
        }}
      ></div>

      {/* Enhanced Grain with SVG Noise */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.08] noise-bg"></div>

      <div className="pointer-events-none fixed inset-0 z-50 bg-gradient-to-b from-transparent via-[rgba(79,255,168,0.03)] to-transparent bg-[length:100%_4px] animate-scanline"></div>

      <style>{`
        /* Custom Cursor */
        .cursor-custom {
          cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2L17 12L12 14L15 20L13 21L10 15L6 19V2Z" fill="%234fffa8" stroke="%23001a1f" stroke-width="2"/></svg>') 0 0, auto;
        }
        button, a, input {
          cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2L17 12L12 14L15 20L13 21L10 15L6 19V2Z" fill="%234fffa8" stroke="%23001a1f" stroke-width="2"/></svg>') 0 0, pointer;
        }

        /* Scanline Animation */
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        /* Improved High-Res Noise */
        .noise-bg {
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E");
           background-repeat: repeat;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #001014;
        }
        ::-webkit-scrollbar-thumb {
          background: #00333b;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #005f6b;
        }
      `}</style>
    </div>
  );
};

const RetroTerminalPage = () => {
  const [booted, setBooted] = useState(false);
  const audio = useRetroAudio();

  return booted ? (
    <Workstation {...audio} />
  ) : (
    <BootScreen
      onComplete={() => {
        setBooted(true);
        audio.playBoot();
      }}
      initAudio={audio.initAudio}
    />
  );
};

export default RetroTerminalPage;
