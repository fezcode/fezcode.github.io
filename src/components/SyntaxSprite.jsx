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
import { TerracottaMark } from './terracotta';

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
  "The first bug was a literal moth found in a Mark II computer in 1947.",
  "Git was created by Linus Torvalds in just two weeks to manage Linux development.",
  "The term 'bit' (Binary Digit) was coined by John Tukey in 1946.",
  "JavaScript's 'typeof null' is 'object'. A legacy bug from the first version.",
  "Python was named after Monty Python's Flying Circus, not the reptile.",
  "The first website ever (info.cern.ch) went live on August 6, 1991.",
  "SpaceX's Crew Dragon runs on a customized Linux OS and Chromium-based UI.",
  "The Linux kernel surpassed 30 million lines of code in 2024.",
  "Nintendo started as a playing card company in 1889.",
  "The 'Save' icon is a 3.5-inch floppy disk. It held 1.44 MB of data.",
  "Ada Lovelace wrote the first algorithm intended for a machine in 1843.",
  "The C language was born at Bell Labs to rewrite the Unix operating system.",
  "A Yottabyte is 1,024 Zettabytes. We haven't even reached the Zettabyte era fully.",
  "The first computer mouse was made of wood and had only one button.",
  "The QWERTY keyboard layout was designed to slow down typists to prevent jams.",
  "Apollo 11's guidance computer had less processing power than a modern calculator.",
  "CAPTCHA stands for 'Completely Automated Public Turing test to tell Computers and Humans Apart'.",
  "The '404 Not Found' error was named after Room 404 at CERN where the first servers were.",
  "Domain names were free until 1995.",
  "The first banner ad was used in 1994 and had a 44% click-through rate.",
  "Linux is everywhere: from Android phones to the International Space Station.",
  "The 'Gopher' in Go isn't just a mascot; it's a symbol of efficiency and speed.",
  "Docker was originally an internal project at a company called dotCloud.",
  "Kubernetes is Greek for 'Helmsman' or 'Pilot'.",
  "The first 1GB hard drive (1980) weighed 550 pounds and cost $40,000.",
  "Programming is the art of telling a computer what to do. It's also the art of arguing with it.",
  "If you ever feel useless, remember that someone is maintaining the 'Scroll Lock' key.",
  "Wi-Fi doesn't stand for anything. It's just a catchy name.",

  // ─── Deeper notes — on computer science & craft ───
  "In Dijkstra's words: 'Simplicity is a prerequisite for reliability.'",
  "The essence of a system is what stays the same when you rewrite it.",
  "Premature abstraction is at least as costly as premature optimization.",
  "A type is a proposition; a program is its proof. Curry–Howard, 1934.",
  "The halting problem is not a bug — it's the first wall of mathematics itself.",
  "Turing's universal machine was, at heart, a machine that read itself.",
  "Every pure function is a tiny theorem. Every side effect, a small promise.",
  "A compiler is a sentence the computer reads about itself.",
  "Caches are the art of forgetting — just not what you'll need next.",
  "Bandwidth is a pipe. Latency is a trip. Don't mistake one for the other.",
  "Fred Brooks: 'All programmers are optimists.' We keep accepting the next deadline.",
  "A software project is a river: it deepens where it's forced to narrow.",
  "Edsger Dijkstra: 'The question of whether machines can think is about as relevant as whether submarines can swim.'",
  "Alan Kay: 'The best way to predict the future is to invent it.'",
  "Programming is the art of managing complexity while pretending you are not.",
  "Entropy always wins — software included. Deleted code is the only code that stays correct.",
  "The Unix philosophy is a eulogy for the shell as much as a design manifesto.",
  "Concurrency is about structure; parallelism is about execution. Rob Pike wrote that down.",
  "Lisp taught us that code is data. Forty years later, JSON is re-learning the lesson.",
  "Shannon's information theory made uncertainty measurable. We still round it to 'reasonable.'",
  "Grace Hopper ran COBOL on a machine that measured time in microseconds and her patience in decades.",
  "A good API is a good conversation: it tells you what it needs and nothing else.",
  "The best error message is the one the user never sees — because you caught it at compile time.",
  "In distributed systems, there are no partial failures — only unfinished truths.",
  "Leslie Lamport: 'A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.'",
  "Rust's borrow checker is less a tool and more a conversation about ownership.",
  "Every garbage collector is a tiny janitor with opinions about who dies first.",
  "Kernighan's law: debugging is twice as hard as writing the code in the first place.",
  "Conway's Law: any organization ships a product shaped like its own communication structure.",
  "The second-worst thing you can do to a codebase is rewrite it. The worst thing is to never stop.",
  "A log without a reader is a confession without a priest — write them anyway.",
  "Test-driven design is not about tests — it's about designing things testable.",
  "Every function has an invariant. You just haven't named it yet.",
  "A build system is a small language for asking: what, of this, is still true?",
  "Hickey's mantra: simple is not easy. Easy is familiar. Simple is untangled.",
  "Monads are just a way to hold a side effect at arm's length.",
  "SQL is declarative. SQL is also, very often, lying about how it'll run.",
  "A race condition is a bug that waits for an audience.",
  "You cannot add performance. You can only remove the reasons for its absence.",
  "In Go: don't communicate by sharing memory — share memory by communicating.",
  "The best thing about C is that it still surprises you. The worst thing is the same.",

  // ─── Broader notes — on craft, life, and honest work ───
  "Simone Weil: 'Attention is the rarest and purest form of generosity.'",
  "Good work asks the same thing of the worker: attention, held without strain.",
  "Vitruvius wrote of buildings: firmness, commodity, delight. Software deserves no less.",
  "A codebase is a diary you write in front of everyone you'll ever work with.",
  "The measure of a program is the weight it lifts, not the cleverness it shows.",
  "Christopher Alexander: 'Things don't work because they are new. They work because they were true.'",
  "Whitman wrote 'I am large, I contain multitudes.' He would have made a fine distributed system.",
  "Marcus Aurelius: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.'",
  "A craftsman is someone who refuses to be surprised by the nature of the material.",
  "Honesty scales. Cleverness does not.",
  "Seneca: 'We suffer more often in imagination than in reality.' — also true of on-call rotations.",
  "A plumb line is the oldest measurement tool. It does nothing but fall, and that is enough.",
  "The surest way to fail is to try to be right before you're interested.",
  "Borges: a book is a conversation with someone who isn't there. Software is, too.",
  "Mary Oliver: 'Attention is the beginning of devotion.' That includes code review.",
  "You don't finish a thing. You make peace with the version you're willing to ship.",
  "The honest craftsman knows the grain of the wood. The honest coder knows the shape of the data.",
  "Tolstoy: 'The two most powerful warriors are patience and time.' Compilers agree.",
  "A great deal of suffering, Camus said, is the refusal to let the present be what it is.",
  "Emerson: 'A foolish consistency is the hobgoblin of little minds.' Style guides exempt.",
  "Rumi: 'The wound is the place where the light enters you.' Every stacktrace agrees.",
  "Work that was built to measure, not just to move, lasts.",
  "Frank Lloyd Wright: 'The truth is more important than the facts.' The same is true of tests.",
  "Annie Dillard: 'How we spend our days is, of course, how we spend our lives.'",
  "A weighted line, a single point — the whole brief, in eight syllables.",
  "Dieter Rams: less, but better. He never had to maintain a JS monorepo, but he knew.",
  "Build the thing small enough that a year from now you still want to look at it.",
  "Ruskin: 'Quality is never an accident. It is always the result of intelligent effort.'",
  "Kazuo Ishiguro: the best stories are not told, they are overheard. Same with codebases.",
  "A good archive is one you could walk away from and still recognize.",
  "A file is a letter to the version of yourself who will read it next.",
  "Do the work. Write it down. Drop the line. Read it true.",
];

const SyntaxSprite = () => {
  const { isSyntaxSpriteEnabled, fezcodexTheme } = useVisualSettings();
  const location = useLocation();
  const [position, setPosition] = useState({ x: 100, direction: -1 }); // Spawn right, walk left
  const [state, setState] = useState('walking'); // idle, walking, thinking
  const [thought, setThought] = useState('');
  const [isJumping, setIsJumping] = useState(false);

  // Walking Logic
  useEffect(() => {
    if (!isSyntaxSpriteEnabled || state === 'thinking' || isJumping) return;

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
  }, [isSyntaxSpriteEnabled, state, isJumping]);

  // Jumping Logic
  useEffect(() => {
    if (!isSyntaxSpriteEnabled) return;

    const jumpInterval = setInterval(() => {
      // 5% chance every 4 seconds to jump if not already jumping or thinking
      if (Math.random() > 0.95 && !isJumping && state !== 'thinking') {
        setIsJumping(true);
        setTimeout(() => {
            setIsJumping(false);
        }, 800);
      }
    }, 4000);

    return () => clearInterval(jumpInterval);
  }, [isSyntaxSpriteEnabled, isJumping, state]);

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
    setIsJumping(true);
    setThought("I am Syntax, the Codex Companion. You can stow me in Settings anytime!");
    setState('thinking');
    setTimeout(() => {
        setState('idle');
        setThought('');
        setIsJumping(false);
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

  const isTerracotta = fezcodexTheme === 'terracotta';
  const spriteColor = isTerracotta
    ? '#C96442'
    : fezcodexTheme === 'luxe'
      ? '#8D4004'
      : '#10B981';

  /* -------------------------------------------------------------
   * TERRACOTTA COMPANION — a plumb bob on a short cord.
   * The bob swings as it "walks" (the cord translates to the sway);
   * jumping lifts the cord, thinking shows a bone-paper editorial note.
   * ------------------------------------------------------------- */
  if (isTerracotta) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-36 pointer-events-none z-[9999]">
        <motion.div
          animate={{ x: `${position.x}vw` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.1 }}
          className="absolute bottom-3 flex flex-col items-center pointer-events-auto cursor-help"
          style={{ width: '60px' }}
          onClick={handleSpriteClick}
        >
          {/* Editorial thought card — bone paper, hairline rule, terra dot */}
          <AnimatePresence>
            {thought && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="absolute bottom-full mb-5 max-w-[320px] w-max"
                style={{ right: 'auto', left: '50%', translate: '-50% 0' }}
              >
                <div className="relative bg-[#F3ECE0] border border-[#1A161320] shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)] px-4 pt-2.5 pb-3">
                  {/* top mono label strip */}
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-dashed border-[#1A161320] font-ibm-plex-mono text-[8.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
                    <span
                      aria-hidden="true"
                      className="inline-block w-[5px] h-[5px] rounded-full bg-[#C96442]"
                    />
                    <span>Syntax · margin note</span>
                  </div>
                  {/* italic quote */}
                  <p
                    className="font-fraunces italic text-[13px] leading-[1.45] text-[#1A1613] max-w-[46ch]"
                    style={{
                      fontVariationSettings:
                        '"opsz" 18, "SOFT" 100, "WONK" 0, "wght" 380',
                    }}
                  >
                    {thought}
                  </p>
                  {/* caret at bottom, centered — a small ink tick */}
                  <span
                    aria-hidden="true"
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #F3ECE0',
                      filter: 'drop-shadow(0 1px 0 rgba(26,22,19,0.12))',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The cord + bob — cord anchors invisibly above, bob bobs below */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={{ scaleX: position.direction }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* cord — stretches up and off the sprite box, swinging gently */}
            <motion.span
              aria-hidden="true"
              className="block absolute left-1/2 -translate-x-1/2"
              style={{
                top: -28,
                width: 1.5,
                height: 28,
                backgroundColor: '#1A1613',
                transformOrigin: 'top center',
              }}
              animate={
                isJumping
                  ? { rotate: [0, 12, -8, 0] }
                  : state === 'walking'
                    ? { rotate: [3, -3, 3] }
                    : { rotate: [1, -1, 1] }
              }
              transition={{
                duration: isJumping ? 0.8 : state === 'walking' ? 0.8 : 3.5,
                ease: 'easeInOut',
                repeat: isJumping ? 0 : Infinity,
              }}
            />

            {/* the plumb-bob body — lifts on jump, idles with a slow breathe */}
            <motion.div
              animate={
                isJumping
                  ? { y: [0, -34, 0] }
                  : state === 'walking'
                    ? { y: [0, -2, 0] }
                    : { y: [0, -1, 0] }
              }
              transition={
                isJumping
                  ? { duration: 0.8, ease: 'easeInOut' }
                  : {
                      repeat: Infinity,
                      duration: state === 'walking' ? 0.5 : 3,
                      ease: 'easeInOut',
                    }
              }
              className="relative"
              title="Syntax — the codex companion"
            >
              <TerracottaMark size={22} color="#C96442" />
              {/* thinking halo — a small terra ring that pulses when Syntax has a note */}
              <AnimatePresence>
                {state === 'thinking' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.6, 0.15, 0.6], scale: [1, 1.25, 1] }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    aria-hidden="true"
                    className="absolute inset-0 -m-2 rounded-full border border-[#C96442]/60 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* a single hairline tick as the "floor shadow" under the bob */}
            <motion.span
              aria-hidden="true"
              animate={
                state === 'walking' || isJumping
                  ? { scaleX: [1, 0.7, 1], opacity: [0.55, 0.3, 0.55] }
                  : { opacity: 0.45 }
              }
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="block mt-1 bg-[#1A1613]"
              style={{ width: 18, height: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
                animate={isJumping ? {
                    y: [0, -40, 0],
                    rotate: [0, 360, 0]
                } : (state === 'walking' ? {
                    y: [0, -4, 0],
                    rotate: [0, 5, -5, 0]
                } : {
                    scale: [1, 1.05, 1]
                })}
                transition={isJumping ? {
                    duration: 0.8,
                    ease: "easeInOut"
                } : {
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
                    animate={state === 'walking' || isJumping ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="w-3 h-2 rounded-full bg-current opacity-50"
                    style={{ color: spriteColor }}
                />
                <motion.div
                    animate={state === 'walking' || isJumping ? { y: [0, -2, 0] } : {}}
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
