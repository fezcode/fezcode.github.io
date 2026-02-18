import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import {
  BrainIcon,
  ChatCircleDotsIcon,
  CodeIcon,
  LightbulbIcon,
  TerminalIcon,
  BriefcaseIcon,
  ScrollIcon,
  UserIcon,
  TrophyIcon,
  GearIcon,
  BookIcon,
} from '@phosphor-icons/react';

const QUOTES = [
  "Go's defer statement executes in LIFO order (Last-In, First-Out).",
  "XOR distance in Kademlia is a true metric: it satisfies triangle inequality.",
  "Distributed Hash Tables (DHT) provide O(log N) lookup complexity.",
  "In Go, a nil slice has a length and capacity of 0, but no underlying array.",
  "Semantic file systems use metadata to provide associative access to data.",
  "The 'Gopher' was designed by Renée French. Go was born at Google.",
  "Channels in Go are first-class citizens: they can be passed as variables.",
  "Goroutines start with a tiny 2KB stack that grows and shrinks dynamically.",
  "A Tag File System solves the 'Hierarchy Trap' where files belong in multiple places.",
  "In Kademlia, nodes are organized into 'k-buckets' based on their ID prefix.",
  "Go's 'select' statement blocks until one of its cases can run.",
  "FUSE (Filesystem in Userspace) allows non-privileged users to create filesystems.",
  "A 'Pointer' stores the memory address of another value. Use with care!",
  "Immutable data structures are safer for concurrent programming.",
  "Clean code is not just about logic; it's about empathy for future readers.",
  "In a DHT, each node is responsible for a specific segment of the keyspace.",
  "The 'empty interface' interface{} can hold values of any type in Go.",
  "Go's scheduler uses 'work stealing' to balance goroutines across CPU cores.",
  "TCP ensures ordered delivery, while UDP is fire-and-forget.",
  "The CAP theorem states you can only have two: Consistency, Availability, or Partition Tolerance.",
  "A mutex (Mutual Exclusion) prevents race conditions in concurrent code.",
  "Big-O notation describes the upper bound of an algorithm's complexity.",
  "Hash collisions occur when two different keys produce the same hash value.",
  "In Go, methods can be defined on any named type, not just structs.",
  "A 'deadlock' happens when two processes wait for each other to release resources.",
  "Environment variables are a great way to handle configuration secrets.",
  "Binary search requires a sorted collection and runs in O(log N) time.",
  "The 'Init' function in Go runs automatically before main.",
  "Standard library documentation is a developer's best friend.",
  "Zero memory allocation is the holy grail of performance optimization.",
  "HTTP/2 multiplexing allows multiple requests over a single TCP connection.",
  "A 'Race Condition' occurs when the output depends on the timing of events.",
  "JWT (JSON Web Tokens) consist of Header, Payload, and Signature.",
  "In Go, a map is a reference to a runtime.hmap header.",
  "The 'Decorator Pattern' allows behavior to be added to an object dynamically.",
  "SQL injection can be prevented by using prepared statements and parameters.",
  "DNS (Domain Name System) translates human-readable names into IP addresses.",
  "Eventual consistency means all nodes will eventually have the latest data.",
  "The 'Single Responsibility Principle' (SRP) states a class should have one job.",
  "Go's garbage collector uses a 'tri-color mark-and-sweep' algorithm.",
  "A 'Slice Header' contains a pointer to the array, a length, and a capacity.",
  "Semantic Versioning: Major.Minor.Patch (e.g., 1.2.3).",
  "Tailwind CSS uses 'Utility-First' methodology for rapid UI development.",
  "A 'Closure' is a function that references variables from outside its scope.",
  "RAID 0 provides performance, while RAID 1 provides data redundancy.",
  "The 'Observer Pattern' defines a one-to-many dependency between objects.",
  "Go's 'context' package is used for timeouts and cancellation signals.",
  "Docker containers share the host's OS kernel for lightweight virtualization.",
  "A 'Load Balancer' distributes network traffic across multiple servers.",
  "The 'Law of Demeter' suggests objects should only talk to their neighbors.",
  "There's no place like 127.0.0.1.",
  "I'd tell you a joke about UDP, but you might not get it.",
  "It works on my machine!",
  "CSS is like magic, but the kind where you accidentally set your house on fire.",
  "A Gopher walks into a bar... and parallelizes the drink orders.",
  "My code doesn't have bugs, it just has undocumented features.",
  "The best part about Go? No semicolons to lose in the couch cushions.",
  "To understand recursion, you must first understand recursion.",
  "Real programmers count from 0.",
  "Cache invalidation and naming things: the two hardest problems in CS.",
  "A SQL query walks into a bar, walks up to two tables, and asks... 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "I have a joke about stack overflow, but it's too long to tell.",
  "Go: come for the speed, stay because you can't figure out why your pointer is nil.",
  "Wait, where did the semicolon go? Oh right, I'm in Go mode.",
  "If at first you don't succeed, call it version 1.0.",
  "Software is like entropy: it's difficult to grasp, weighs nothing, and obeys the second law of thermodynamics.",
  "Why do Java developers wear glasses? Because they can't C#!",
  "Debugging is like being the detective in a crime movie where you are also the murderer.",
];

const SyntaxSprite = () => {
  const { isSyntaxSpriteEnabled, fezcodexTheme } = useVisualSettings();
  const location = useLocation();
  const [position, setPosition] = useState({ x: 100, direction: -1 }); // Spawn right, walk left
  const [state, setState] = useState('walking'); // idle, walking, thinking
  const [thought, setThought] = useState('');

  // Walking Logic
  useEffect(() => {
    if (!isSyntaxSpriteEnabled || state === 'thinking') return;

    const moveInterval = setInterval(() => {
      setPosition((prev) => {
        const step = 0.3; // Slower, smoother step
        const nextX = prev.x + step * prev.direction;

        // Boundary checks (percent of screen)
        if (nextX >= 100) return { x: 100, direction: -1 };
        if (nextX <= 0) return { x: 0, direction: 1 };
        return { ...prev, x: nextX };
      });

      // Randomly switch to idle
      if (Math.random() > 0.98) setState('idle');
      else if (state === 'idle' && Math.random() > 0.9) setState('walking');
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isSyntaxSpriteEnabled, state]);

  // Thinking Logic - MORE FREQUENT
  useEffect(() => {
    if (!isSyntaxSpriteEnabled) return;

    const thoughtInterval = setInterval(() => {
      // 40% chance every 8 seconds if not already thinking
      if (Math.random() > 0.6 && !thought) {
        setThought(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setState('thinking');
        setTimeout(() => {
          setState('idle');
          setThought('');
        }, 10000);
      }
    }, 8000);

    return () => clearInterval(thoughtInterval);
  }, [isSyntaxSpriteEnabled, thought]);

  // Feed on Knowledge (Location Change)
  useEffect(() => {
    if (location.pathname.startsWith('/blog/')) {
        setThought("Analyzing data structures... Delicious.");
        setState('thinking');
        setTimeout(() => {
            setState('idle');
            setThought('');
        }, 3000);
    }
  }, [location.pathname]);

  const handleSpriteClick = () => {
    setThought("I am Syntax, the Codex Companion. You can stow me in Settings anytime!");
    setState('thinking');
    setTimeout(() => {
        setState('idle');
        setThought('');
    }, 8000);
  };

  const getIcon = () => {
    if (state === 'thinking') return <BrainIcon size={24} weight="duotone" />;
    const path = location.pathname;
    if (path.startsWith('/apps')) return <CodeIcon size={24} weight="duotone" />;
    if (path.startsWith('/blog')) return <LightbulbIcon size={24} weight="duotone" />;
    if (path.startsWith('/projects')) return <BriefcaseIcon size={24} weight="duotone" />;
    if (path.startsWith('/logs')) return <ScrollIcon size={24} weight="duotone" />;
    if (path.startsWith('/about')) return <UserIcon size={24} weight="duotone" />;
    if (path.startsWith('/achievements')) return <TrophyIcon size={24} weight="duotone" />;
    if (path.startsWith('/settings')) return <GearIcon size={24} weight="duotone" />;
    if (path.startsWith('/vocab')) return <BookIcon size={24} weight="duotone" />;
    return <TerminalIcon size={24} weight="duotone" />;
  };

  if (!isSyntaxSpriteEnabled) return null;

  const spriteColor = fezcodexTheme === 'luxe' ? '#8D4004' : '#10B981';

  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-[9999]">
      <motion.div
        animate={{
            x: `${position.x}vw`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.1 }}
        className="absolute bottom-2 flex flex-col items-center pointer-events-auto cursor-help"
        style={{ width: '60px' }}
        onClick={handleSpriteClick}
      >
        {/* Thought Bubble */}
        <AnimatePresence>
          {thought && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className={`absolute bottom-full mb-4 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-tighter whitespace-nowrap border ${
                fezcodexTheme === 'luxe'
                    ? 'bg-white text-[#8D4004] border-[#8D4004]/20 shadow-sm'
                    : 'bg-[#050505] text-[#10B981] border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ChatCircleDotsIcon size={14} weight="fill" />
                {thought}
              </div>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${
                fezcodexTheme === 'luxe' ? 'border-t-white' : 'border-t-[#050505]'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Sprite Body */}
        <motion.div
            animate={{ scaleX: position.direction }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative"
        >
            <motion.div
                animate={state === 'walking' ? {
                    y: [0, -4, 0],
                    rotate: [0, 5, -5, 0]
                } : {
                    scale: [1, 1.05, 1]
                }}
                transition={{
                    repeat: Infinity,
                    duration: state === 'walking' ? 0.4 : 2
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 ${
                    fezcodexTheme === 'luxe'
                        ? 'bg-white border-[#8D4004]/40 text-[#8D4004]'
                        : 'bg-[#050505] border-[#10B981]/40 text-[#10B981]'
                } shadow-lg`}
            >
                {getIcon()}

                {/* Eyes */}
                <div className="absolute top-2 left-2 flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                </div>
            </motion.div>

            {/* Little Feet */}
            <div className="flex justify-around mt-[-4px]">
                <motion.div
                    animate={state === 'walking' ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="w-3 h-2 rounded-full bg-current opacity-50"
                    style={{ color: spriteColor }}
                />
                <motion.div
                    animate={state === 'walking' ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2, delay: 0.1 }}
                    className="w-3 h-2 rounded-full bg-current opacity-50"
                    style={{ color: spriteColor }}
                />
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SyntaxSprite;
