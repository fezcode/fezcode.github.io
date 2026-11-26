import '../styles/Studio.css';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { useToast } from '../hooks/useToast';
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
import { MistOrb } from './mist';
import { KnitCanvas, YARN, MOTIFS } from './knit';
import { makeGrid, stamp } from './knit/engine';
import { KilimCanvas, WOOL as KILIM_WOOL, FINE, medallion } from './kilim';
import '../styles/kilim-chrome.css';

/**
 * Syntax in Kilim: a small hooked göl woven on the loom. Thinking re-dyes
 * it, a saffron rim and a teal field, and weaves it again.
 */
const KILIM_WAYS = {
  calm: {
    rim: KILIM_WOOL.ivory,
    a: KILIM_WOOL.madder,
    b: KILIM_WOOL.saffron,
    core: KILIM_WOOL.teal,
    eye: KILIM_WOOL.ivory,
  },
  thinking: {
    rim: KILIM_WOOL.saffron,
    a: KILIM_WOOL.teal,
    b: KILIM_WOOL.ivory,
    core: KILIM_WOOL.madder,
    eye: KILIM_WOOL.saffron,
  },
};
// a radius-6 göl: rim, one dyed ring, core and eye, with ram's-horn hooks
// reaching three pips past the rim (19 × 19 in all)
const GOL_GAUGE = { w: FINE.w * 0.85, h: FINE.h * 0.85 };
const KilimGol = ({ thinking }) => (
  <KilimCanvas
    cols={19}
    gauge={GOL_GAUGE}
    lazy={false}
    seed="syntax"
    animate
    replay={thinking ? 1 : 0}
    build={() => {
      const g = makeGrid(19, 19, null);
      medallion(g, 9, 9, 6, thinking ? KILIM_WAYS.thinking : KILIM_WAYS.calm);
      return g;
    }}
    deps={[thinking]}
  />
);

/** Syntax in Knit: the hen from the yoke, its comb turning gold in thought. */
const KnitHen = ({ thinking }) => (
  <KnitCanvas
    cols={12}
    gauge={{ w: 3.5, h: 3 }}
    build={() => {
      const g = makeGrid(12, 12, null);
      stamp(g, MOTIFS.hen, 1, 1, {
        r: thinking ? YARN.gold : YARN.poppy,
        W: YARN.snow,
        k: YARN.jet,
        y: YARN.gold,
        H: YARN.oat,
      });
      return g;
    }}
    deps={[thinking]}
  />
);

// Clicks in a streak before Syntax gives up and leaves.
const SHOVE_CLICKS = 10;
// Max gap between two clicks for them to count as one streak (ms).
const CLICK_STREAK_GAP = 2500;

const QUOTES = [
  // ─── Systems, under the hood ───
  'Go randomizes map iteration order on purpose, so no program can come to depend on it.',
  "A Go interface holding a nil pointer is not nil: the interface still carries the pointer's type.",
  'Go 1.22 made loop variables per-iteration, ending a decade of closures capturing the same variable.',
  'Go 1.24 rebuilt maps on Swiss Tables: slots in groups of eight, scanned via one control byte each.',
  'A growing goroutine stack is copied to a buffer twice its size, and every pointer into it is rewritten.',
  'False sharing: two cores writing different variables on one 64-byte cache line take turns owning it, and both slow down.',
  'An L1 cache hit costs about a nanosecond; main memory, around a hundred. Data layout beats clever code.',
  'Structure-of-arrays often beats array-of-structures: each cache line then carries only the fields you read.',
  'Spectre made speculation a side channel: the CPU rolls back the results, not the cache footprint.',
  'Copy-on-write makes fork() cheap: parent and child share every page until one of them writes.',
  'sendfile() moves file bytes straight to a socket without ever copying them through user space.',
  'io_uring lets Linux programs queue I/O through shared ring buffers instead of paying a syscall per operation.',
  'fsync on a new file is not enough to survive a crash. The directory entry needs its own fsync.',
  "In 2018 PostgreSQL found Linux could report a failed fsync once, then mark the pages clean. 'fsyncgate'.",
  'SQLite carries roughly 590 lines of test code for every line of library code.',
  'A B-tree node is sized to a disk page, so finding one row among a billion touches only a handful of pages.',
  'LSM trees turn random writes into sequential ones, and pay the bill later in compaction.',
  'Write-ahead logging: record what you are about to do before doing it, so a crash leaves something to replay.',
  "Nagle's algorithm plus delayed ACKs can stall small TCP writes by tens of milliseconds. Hence TCP_NODELAY.",
  'QUIC runs over UDP partly because middleboxes ossified TCP: packets with unfamiliar TCP options got dropped.',
  'TLS 1.3 needs one round trip to set up; its optional zero-RTT data can be replayed by an attacker.',
  'BGP believes what neighbours announce. In 2008 one bad announcement from Pakistan took YouTube offline worldwide.',
  'There are 13 DNS root server names, answered by well over a thousand anycast instances around the world.',
  'IANA handed out its last blocks of IPv4 addresses in February 2011.',
  'A MAC address with the second-lowest bit of its first byte set is locally administered. Randomized Wi-Fi MACs set it.',
  'Tony Hoare calls the null reference his billion-dollar mistake. He added it to ALGOL W in 1965.',
  'Rust stores Option<&T> in the space of a bare pointer: the impossible null value means None.',
  'Garbage collection predates most languages that use it: John McCarthy invented it for Lisp around 1959.',
  "Dijkstra's famous 1968 letter was titled by its editor, Niklaus Wirth: 'Go To Statement Considered Harmful'.",
  "Ken Thompson's 'Reflections on Trusting Trust' (1984): a compiler can plant a backdoor that survives a rebuild from clean source.",

  // ─── Distributed systems ───
  'FLP (1985): in a fully asynchronous network, no deterministic consensus protocol can guarantee progress if one process may crash.',
  'CAP only bites during a partition. PACELC adds: otherwise, you trade latency against consistency.',
  'Raft and Paxos survive f crashed nodes with 2f+1 replicas. Byzantine (lying) nodes need 3f+1.',
  "Lamport clocks respect causality, but a smaller timestamp doesn't prove cause. Vector clocks can tell.",
  'Spanner waits out its clock uncertainty before committing: a few milliseconds of patience buys external consistency.',
  "Exactly-once delivery doesn't exist on a lossy network. Systems fake it with at-least-once plus idempotent handlers.",
  'Consistent hashing moves about K/N keys when a node joins, instead of reshuffling almost all of them.',
  "Little's law: items in a system = arrival rate × time each spends there. It holds for caches and checkout lines alike.",
  'In a simple queue, wait time grows like 1/(1−ρ). Run a server at 99% busy and the queue explodes.',
  "Amdahl's law: if 5% of a job must run serially, no number of cores makes it more than 20× faster.",
  'Google smears leap seconds across a whole day after a 2012 leap second hung Linux servers. Leap seconds are due to be dropped by 2035.',

  // ─── Algorithms, numbers and text ───
  "Bloom filters answer 'definitely not' or 'maybe'. Never a definite yes.",
  'HyperLogLog counts billions of distinct items in about 12 KB, within roughly 0.8% error.',
  'The birthday bound: random 64-bit IDs reach a 50% collision chance after about five billion of them.',
  'Quicksort is O(n²) in the worst case. Introsort falls back to heapsort when recursion runs too deep.',
  "In 2015, researchers formally verifying Timsort found a bug in it: Java's and Python's sort, used by billions.",
  "Java's binary search hid an overflow for about nine years: (low + high) / 2 breaks once arrays pass 2³⁰ elements.",
  '0.1 + 0.2 = 0.30000000000000004, because 0.1 has no finite binary expansion.',
  "Floating-point addition isn't associative, so a parallel sum can change with the number of threads.",
  "NaN is the only value not equal to itself. That's why x != x works as an isnan test.",
  'Signed 32-bit Unix time runs out at 03:14:07 UTC on 19 January 2038, then wraps to 1901.',
  'UTF-8 bytes label themselves: 10xxxxxx is always a continuation, so a reader can resync mid-stream.',
  'Ken Thompson and Rob Pike sketched UTF-8 on a placemat in a New Jersey diner in 1992.',
  "'é' can be one code point or two (e plus a combining accent): identical on screen, unequal to a naive compare.",
  "Two's complement makes −x equal to ~x + 1, so one adder circuit serves signed and unsigned arithmetic.",
  'x & (x − 1) clears the lowest set bit. Loop it and you count bits in as many steps as there are ones.',
  "Quake III's fast inverse square root: reinterpret the float as an integer, subtract from 0x5f3759df, one Newton step.",
  "Duff's device interleaves a switch with a do-while to unroll a loop. It is perfectly legal C.",
  "Regexes with backreferences aren't regular any more: matching them is NP-complete.",
  "Catastrophic backtracking in a single regex took down Cloudflare's network for 27 minutes in 2019.",
  "Rice's theorem: every non-trivial question about what a program does is undecidable.",
  'Hindley–Milner infers every type with no annotations, yet its worst case is exponential in program size.',
  'The Y combinator gives recursion to a language that has no names to recurse by.',

  // ─── Security ───
  'Diffie–Hellman lets two strangers agree on a secret over a channel everyone can read.',
  "Forward secrecy: steal a TLS 1.3 server's key tomorrow and yesterday's recorded traffic stays sealed.",
  'Comparing secrets with == leaks, through timing, how many leading bytes matched. Use a constant-time compare.',
  'bcrypt, scrypt and Argon2 are slow on purpose. A fast password hash is a gift to anyone with a GPU.',
  'Heartbleed (2014): one trusted length field let anyone read up to 64 KB of server memory per request.',
  "Shor's algorithm would break RSA on a large quantum computer. NIST finalized the ML-KEM replacement in 2024.",

  // ─── History, precisely ───
  "The 1947 Mark II moth was logged as the 'first actual case of bug being found'. Engineers already said 'bug'.",
  "During Apollo 11's landing the guidance computer threw 1202 alarms, shed low-priority work and kept flying.",
  'ENIAC was programmed by rewiring it. Its six original programmers, all women, went uncredited for decades.',
  'The Morris worm (1988) hit roughly 10% of the 60,000 machines then on the Internet, and led to the first CERT.',
  "Ariane 5's first flight (1996) was lost when reused Ariane 4 code squeezed a 64-bit float into a 16-bit integer.",
  'Therac-25 overdosed patients through a race condition that only fast, experienced operators could trigger.',
  'NASA lost the Mars Climate Orbiter in 1999: one team worked in pound-force seconds, the other in newton-seconds.',
  'Knight Capital lost $440 million in 45 minutes in 2012 when a reused flag woke up retired trading code.',
  'Early Unix counted time in sixtieths of a second from 1971. The 1970 epoch came later.',

  // ─── Deeper notes — on computer science & craft ───
  "In Dijkstra's words: 'Simplicity is a prerequisite for reliability.'",
  'The essence of a system is what stays the same when you rewrite it.',
  'Premature abstraction is at least as costly as premature optimization.',
  'A type is a proposition; a program is its proof. Curry–Howard, 1934.',
  "The halting problem is not a bug — it's the first wall of mathematics itself.",
  "Turing's universal machine was, at heart, a machine that read itself.",
  'Every pure function is a tiny theorem. Every side effect, a small promise.',
  'A compiler is a sentence the computer reads about itself.',
  "Caches are the art of forgetting — just not what you'll need next.",
  "Bandwidth is a pipe. Latency is a trip. Don't mistake one for the other.",
  "Fred Brooks: 'All programmers are optimists.' We keep accepting the next deadline.",
  "A software project is a river: it deepens where it's forced to narrow.",
  "Edsger Dijkstra: 'The question of whether machines can think is about as relevant as whether submarines can swim.'",
  "Alan Kay: 'The best way to predict the future is to invent it.'",
  'Programming is the art of managing complexity while pretending you are not.',
  'Entropy always wins — software included. Deleted code is the only code that stays correct.',
  'The Unix philosophy is a eulogy for the shell as much as a design manifesto.',
  'Concurrency is about structure; parallelism is about execution. Rob Pike wrote that down.',
  'Lisp taught us that code is data. Forty years later, JSON is re-learning the lesson.',
  "Shannon's information theory made uncertainty measurable. We still round it to 'reasonable.'",
  'Grace Hopper ran COBOL on a machine that measured time in microseconds and her patience in decades.',
  'A good API is a good conversation: it tells you what it needs and nothing else.',
  'The best error message is the one the user never sees — because you caught it at compile time.',
  'In distributed systems, there are no partial failures — only unfinished truths.',
  "Leslie Lamport: 'A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.'",
  "Rust's borrow checker is less a tool and more a conversation about ownership.",
  'Every garbage collector is a tiny janitor with opinions about who dies first.',
  "Kernighan's law: debugging is twice as hard as writing the code in the first place.",
  "Conway's Law: any organization ships a product shaped like its own communication structure.",
  'The second-worst thing you can do to a codebase is rewrite it. The worst thing is to never stop.',
  'A log without a reader is a confession without a priest — write them anyway.',
  "Test-driven design is not about tests — it's about designing things testable.",
  "Every function has an invariant. You just haven't named it yet.",
  'A build system is a small language for asking: what, of this, is still true?',
  "Hickey's mantra: simple is not easy. Easy is familiar. Simple is untangled.",
  "Monads are just a way to hold a side effect at arm's length.",
  "SQL is declarative. SQL is also, very often, lying about how it'll run.",
  'A race condition is a bug that waits for an audience.',
  'You cannot add performance. You can only remove the reasons for its absence.',
  "In Go: don't communicate by sharing memory — share memory by communicating.",
  'The best thing about C is that it still surprises you. The worst thing is the same.',

  // ─── Broader notes — on craft, life, and honest work ───
  "Simone Weil: 'Attention is the rarest and purest form of generosity.'",
  'Good work asks the same thing of the worker: attention, held without strain.',
  'Vitruvius wrote of buildings: firmness, commodity, delight. Software deserves no less.',
  "A codebase is a diary you write in front of everyone you'll ever work with.",
  'The measure of a program is the weight it lifts, not the cleverness it shows.',
  "Christopher Alexander: 'Things don't work because they are new. They work because they were true.'",
  "Whitman wrote 'I am large, I contain multitudes.' He would have made a fine distributed system.",
  "Marcus Aurelius: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.'",
  'A craftsman is someone who refuses to be surprised by the nature of the material.',
  'Honesty scales. Cleverness does not.',
  "Seneca: 'We suffer more often in imagination than in reality.' — also true of on-call rotations.",
  'A plumb line is the oldest measurement tool. It does nothing but fall, and that is enough.',
  "The surest way to fail is to try to be right before you're interested.",
  "Borges: a book is a conversation with someone who isn't there. Software is, too.",
  "Mary Oliver: 'Attention is the beginning of devotion.' That includes code review.",
  "You don't finish a thing. You make peace with the version you're willing to ship.",
  'The honest craftsman knows the grain of the wood. The honest coder knows the shape of the data.',
  "Tolstoy: 'The two most powerful warriors are patience and time.' Compilers agree.",
  'A great deal of suffering, Camus said, is the refusal to let the present be what it is.',
  "Emerson: 'A foolish consistency is the hobgoblin of little minds.' Style guides exempt.",
  "Rumi: 'The wound is the place where the light enters you.' Every stacktrace agrees.",
  'Work that was built to measure, not just to move, lasts.',
  "Frank Lloyd Wright: 'The truth is more important than the facts.' The same is true of tests.",
  "Annie Dillard: 'How we spend our days is, of course, how we spend our lives.'",
  'A weighted line, a single point — the whole brief, in eight syllables.',
  'Dieter Rams: less, but better. He never had to maintain a JS monorepo, but he knew.',
  'Build the thing small enough that a year from now you still want to look at it.',
  "Ruskin: 'Quality is never an accident. It is always the result of intelligent effort.'",
  'Kazuo Ishiguro: the best stories are not told, they are overheard. Same with codebases.',
  'A good archive is one you could walk away from and still recognize.',
  'A file is a letter to the version of yourself who will read it next.',
  'Do the work. Write it down. Drop the line. Read it true.',

  // ─── Science and mathematics ───
  'There are exactly as many even numbers as whole numbers, and strictly more real numbers than either. Cantor.',
  'Gödel: any consistent formal system strong enough for arithmetic contains true statements it cannot prove.',
  "Benford's law: in many real datasets about 30% of numbers start with 1. Fraud auditors check for it.",
  'A random walk on a line or a plane returns home with certainty. In three dimensions, only about 34% of the time.',
  'The four colour theorem (1976) was the first major proof that needed a computer to check its cases.',
  "Landauer's limit: erasing one bit costs at least kT ln 2 of energy. Forgetting has a price.",
  'GPS satellite clocks run about 38 microseconds a day fast against ours. Relativity, corrected in orbit.',
  "Light in optical fibre travels about a third slower than in vacuum: New York–London can't round-trip in under ~56 ms.",
  'Every gold atom on Earth was forged in a cosmic catastrophe, such as a supernova or a neutron-star merger.',
  "Pressure waves in the Perseus cluster's gas form a note about 57 octaves below middle C.",
  "Two-thirds of an octopus's neurons sit in its arms. A severed arm will still reach for food.",
  'Mitochondria carry their own DNA, inherited almost entirely from the mother.',
  'Each of your cells packs about two metres of DNA into a nucleus a few micrometres wide.',
  'Tardigrades survive drying out by turning their insides to glass: sugars and proteins vitrify in place of water.',
  'Honeybees can learn that zero is less than one, according to a 2018 study.',
  'Water is densest at about 4 °C, so lakes freeze from the top down and life survives underneath.',
  'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.',
  'The Monty Hall problem: switching wins two times in three. Paul Erdős reportedly needed a simulation to believe it.',
];

const SyntaxSprite = () => {
  const { isSyntaxSpriteEnabled, toggleSyntaxSprite, fezcodexTheme } =
    useVisualSettings();
  const { addToast } = useToast() || {};
  const clickStreak = useRef(0);
  const lastClickAt = useRef(0);
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
      setThought('Analyzing data structures... Delicious.');
      setState('thinking');
      setTimeout(() => {
        setState('idle');
        setThought('');
      }, 3000);
    }
  }, [location.pathname]);

  const handleSpriteClick = () => {
    // Ten clicks in a row (each within CLICK_STREAK_GAP of the last) and
    // Syntax takes the hint: it leaves and says where to bring it back.
    const now = Date.now();
    clickStreak.current =
      now - lastClickAt.current <= CLICK_STREAK_GAP ? clickStreak.current + 1 : 1;
    lastClickAt.current = now;

    if (clickStreak.current >= SHOVE_CLICKS) {
      clickStreak.current = 0;
      setThought('');
      setState('idle');
      setIsJumping(false);
      toggleSyntaxSprite();
      addToast?.({
        title: 'Syntax has left',
        message:
          'Ten pokes was enough. Bring your companion back any time in Settings.',
        duration: 6000,
      });
      return;
    }

    setIsJumping(true);
    const left = SHOVE_CLICKS - clickStreak.current;
    setThought(
      clickStreak.current >= 5
        ? left === 1
          ? 'One more and I am gone. I mean it.'
          : `Easy there. ${left} more pokes and I am leaving.`
        : 'I am Syntax, the Codex Companion. You can stow me in Settings anytime!',
    );
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
    if (path.startsWith('/apps'))
      return <CodeIcon size={24} weight="duotone" />;
    if (path.startsWith('/blog'))
      return <LightbulbIcon size={24} weight="duotone" />;
    if (path.startsWith('/projects'))
      return <BriefcaseIcon size={24} weight="duotone" />;
    if (path.startsWith('/logs'))
      return <ScrollIcon size={24} weight="duotone" />;
    if (path.startsWith('/about'))
      return <UserIcon size={24} weight="duotone" />;
    if (path.startsWith('/achievements'))
      return <TrophyIcon size={24} weight="duotone" />;
    if (path.startsWith('/settings'))
      return <GearIcon size={24} weight="duotone" />;
    if (path.startsWith('/vocab'))
      return <BookIcon size={24} weight="duotone" />;
    return <TerminalIcon size={24} weight="duotone" />;
  };

  if (!isSyntaxSpriteEnabled) return null;

  const isTerracotta = fezcodexTheme === 'terracotta';
  const isMist = fezcodexTheme === 'mist';
  const isLedger = fezcodexTheme === 'ledger';
  /* BLISS COMPANION — Syntax as a tray helper with a balloon tip */
  if (fezcodexTheme === 'bliss') {
    return (
      <div
        className="fixed right-4 z-[9999] max-w-[calc(100vw-2rem)] flex flex-col items-end bl-chrome"
        style={{ bottom: 'calc(var(--bl-taskbar-h) + 12px)' }}
      >
        {thought && (
          <div className="bl-balloon mb-3 max-w-xs" role="status">
            <p className="m-0 mb-1 font-bold">Syntax</p>
            <p className="m-0">{thought}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="Talk to Syntax, the codex companion"
          className={`bl-icon ${isJumping ? '-translate-y-2' : ''}`}
          style={{
            width: 44,
            height: 44,
            border: 0,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            background: 'linear-gradient(180deg, #6aa8ff, #1e5fe0)',
          }}
        >
          {getIcon()}
        </button>
      </div>
    );
  }
  /* KNIT COMPANION — Syntax as a little knitted hen pecking in the corner */
  if (fezcodexTheme === 'knit') {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] max-w-[calc(100vw-2rem)] flex flex-col items-end">
        {thought && (
          <div className="knt-patch knt-patch-tight mb-3 max-w-xs text-sm">
            <p className="knt-label mb-1">Syntax · a passing thought</p>
            <p>{thought}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="Talk to Syntax, the codex companion"
          className={`knt-btn knt-btn-icon !w-auto !p-1.5 ${isJumping ? '-translate-y-2' : ''}`}
          style={{ transition: 'transform 0.2s ease' }}
        >
          <KnitHen thinking={state === 'thinking'} />
        </button>
      </div>
    );
  }
  /* KILIM COMPANION: Syntax as a small woven göl that re-dyes in thought */
  if (fezcodexTheme === 'kilim') {
    return (
      <div className="klm-chrome fixed bottom-4 right-4 z-[9999] max-w-[calc(100vw-2rem)] flex flex-col items-end">
        {thought && (
          <div className="klm-sprite-note klm-wool-indigo" role="status">
            <p className="klm-label mb-1">Syntax · a passing thought</p>
            <p className="klm-sprite-note-text">{thought}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="Talk to Syntax, the codex companion"
          className={`klm-btn klm-btn-indigo klm-btn-icon klm-sprite-btn ${isJumping ? 'is-jumping' : ''}`}
        >
          <KilimGol thinking={state === 'thinking'} />
        </button>
      </div>
    );
  }
  if (fezcodexTheme === 'studio') {
    return (
      <div
        className="fixed bottom-4 right-4 z-[9999] max-w-[calc(100vw-2rem)]"
        style={{ fontFamily: "'Studio Inter', sans-serif" }}
      >
        {thought && (
          <div className="std-toast mb-3 max-w-xs">
            <p className="std-eyebrow mb-2">Syntax · a passing thought</p>
            <p className="text-sm">{thought}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="Talk to Syntax, the codex companion"
          className="std-btn float-right"
          style={{
            borderRadius: '50%',
            width: 42,
            height: 42,
            color: 'var(--std-accent)',
            fontSize: 23,
          }}
        >
          ◎
        </button>
      </div>
    );
  }

  if (fezcodexTheme === 'orbit') {
    return (
      <div
        className="fixed bottom-4 right-4 z-[9999] max-w-[calc(100vw-2rem)]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {thought && (
          <div className="orb-toast mb-3 max-w-xs">
            <p className="orb-eyebrow mb-2">Syntax · a passing thought</p>
            <p className="text-sm">{thought}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="Talk to Syntax, the codex companion"
          className="orb-btn float-right"
          style={{
            borderRadius: '50%',
            width: 42,
            height: 42,
            color: 'var(--orb-accent)',
            fontSize: 23,
          }}
        >
          ◎
        </button>
      </div>
    );
  }
  const spriteColor = isTerracotta
    ? '#C96442'
    : fezcodexTheme === 'luxe'
      ? '#8D4004'
      : '#10B981';

  /* -------------------------------------------------------------
   * MIST COMPANION — a small wisp of fog that drifts, never walks.
   * The orb hovers above its own soft shadow; jumping is a slow
   * float upward, thinking surfaces a veil card with a whispered
   * note in Instrument Serif italic.
   * ------------------------------------------------------------- */
  if (isMist) {
    return (
      <div
        key="mist-syntax"
        className="fixed bottom-0 left-0 w-full h-36 pointer-events-none z-[9999]"
      >
        <motion.div
          key="mist-wisp"
          animate={{ x: `${position.x}vw` }}
          transition={{ type: 'spring', stiffness: 60, damping: 22, mass: 0.3 }}
          className="absolute bottom-3 flex flex-col items-center pointer-events-auto cursor-help"
          style={{ width: '60px' }}
          onClick={handleSpriteClick}
        >
          {/* Veil thought card — frosted white, fading rule, whispered note */}
          <AnimatePresence>
            {thought && (
              <motion.div
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute bottom-full mb-5 max-w-[320px] w-max"
                style={{ right: 'auto', left: '50%', translate: '-50% 0' }}
              >
                <div className="relative bg-white/75 backdrop-blur-md rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)] px-4 pt-2.5 pb-3">
                  {/* top whisper strip */}
                  <div className="flex items-center gap-2 pb-2 mb-2 font-ibm-plex-mono text-[8.5px] tracking-[0.22em] lowercase text-[#5F837B]">
                    <span
                      aria-hidden="true"
                      className="inline-block w-[5px] h-[5px] rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 40% 35%, #FFFFFF 0%, #8FA8BC 100%)',
                        boxShadow: '0 0 6px 1px rgba(143,168,188,0.5)',
                      }}
                    />
                    <span>syntax · a passing thought</span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-px w-full mb-2"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(60,72,69,0.2), transparent)',
                    }}
                  />
                  {/* whispered quote */}
                  <p className="font-instr-serif italic text-[13.5px] leading-[1.45] text-[#3C4845] max-w-[46ch]">
                    {thought}
                  </p>
                  {/* caret — a soft white tick */}
                  <span
                    aria-hidden="true"
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(255,255,255,0.78)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The wisp — hovers and breathes; floats higher on a "jump" */}
          <motion.div
            animate={
              isJumping
                ? { y: [0, -30, 0] }
                : state === 'walking'
                  ? { y: [0, -5, 0] }
                  : { y: [0, -3, 0] }
            }
            transition={
              isJumping
                ? { duration: 0.8, ease: 'easeInOut' }
                : {
                    repeat: Infinity,
                    duration: state === 'walking' ? 1.6 : 3.2,
                    ease: 'easeInOut',
                  }
            }
            className="relative"
            title="Syntax — the codex companion"
          >
            {/* drift-blue halo so the wisp reads against the fog */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(143,168,188,0.6) 0%, rgba(143,168,188,0) 70%)',
                filter: 'blur(3px)',
              }}
            />
            <MistOrb size={30} className="relative" />
            {/* defined edge — a faint eucalyptus ring so the orb holds its shape */}
            <span
              aria-hidden="true"
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: 5,
                boxShadow:
                  'inset 0 0 0 1px rgba(95,131,123,0.35), 0 3px 8px rgba(60,72,69,0.25)',
              }}
            />
            {/* thinking halo — drift-blue ring, pulsing like held breath */}
            <AnimatePresence>
              {state === 'thinking' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0.55, 0.15, 0.55], scale: [1, 1.3, 1] }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  aria-hidden="true"
                  className="absolute inset-0 -m-2 rounded-full border border-[#8FA8BC]/60 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* soft ground shadow — the only proof it has somewhere to land */}
          <motion.span
            aria-hidden="true"
            animate={
              state === 'walking' || isJumping
                ? { scaleX: [1, 0.65, 1], opacity: [0.25, 0.12, 0.25] }
                : { opacity: 0.2 }
            }
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="block mt-1.5 rounded-full bg-[#3C4845]"
            style={{ width: 18, height: 3, filter: 'blur(2px)' }}
          />
        </motion.div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * LEDGER COMPANION — the registrar's seal. A small square stamp
   * bearing § that rocks along the bottom rule of the page; jumping
   * is a press-and-lift, thinking produces a double-ruled marginal
   * note. Inked entirely from the --ldg-* vars, so the seal follows
   * whichever register the reader has open.
   * ------------------------------------------------------------- */
  if (isLedger) {
    return (
      <div
        key="ledger-syntax"
        className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-[9999]"
        style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
      >
        <motion.div
          key="ledger-seal"
          animate={{ x: `${position.x}vw` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 0.1,
          }}
          className="absolute bottom-2 flex flex-col items-center pointer-events-auto cursor-help"
          style={{ width: '60px' }}
          onClick={handleSpriteClick}
        >
          {/* Marginal note — a double-ruled slip in the register's ink */}
          <AnimatePresence>
            {thought && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-full mb-5 max-w-[320px] w-max"
                style={{ right: 'auto', left: '50%', translate: '-50% 0' }}
              >
                <div
                  className="relative px-4 pt-2.5 pb-3"
                  style={{
                    background: 'var(--ldg-bg)',
                    color: 'var(--ldg-fg)',
                    border: '1px solid var(--ldg-rule)',
                    borderRadius: 2,
                    boxShadow:
                      '0 0 0 3px var(--ldg-bg), 0 0 0 4px var(--ldg-rule), 0 18px 40px -18px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="flex items-center gap-2 pb-2 mb-2 text-[8.5px] font-bold uppercase"
                    style={{
                      letterSpacing: '0.22em',
                      color: 'var(--ldg-accent)',
                      borderBottom: '1px dashed var(--ldg-rule)',
                    }}
                  >
                    <span aria-hidden="true">§</span>
                    <span>SYNTAX · MARGINAL NOTE</span>
                  </div>
                  <p
                    className="text-[11px] leading-[1.55] max-w-[46ch]"
                    style={{ color: 'var(--ldg-fg)' }}
                  >
                    {thought}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid var(--ldg-rule)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The seal — rocks on its edge as it walks, presses down on a jump */}
          <motion.div
            animate={
              isJumping
                ? { y: [0, -30, 2, 0], rotate: [0, 0, 0, 0] }
                : state === 'walking'
                  ? { rotate: [-4, 4, -4], y: [0, -1.5, 0] }
                  : { rotate: [0, 1, 0, -1, 0] }
            }
            transition={
              isJumping
                ? { duration: 0.8, ease: 'easeInOut' }
                : {
                    repeat: Infinity,
                    duration: state === 'walking' ? 0.6 : 4,
                    ease: 'easeInOut',
                  }
            }
            className="relative w-10 h-10 flex items-center justify-center"
            title="Syntax — the codex companion"
            style={{
              background: 'var(--ldg-bg)',
              border: '1.5px solid var(--ldg-accent)',
              borderRadius: 2,
              boxShadow:
                '0 0 0 3px var(--ldg-bg), 0 0 0 4px var(--ldg-accent), 0 6px 14px -6px rgba(0,0,0,0.45)',
            }}
          >
            <span
              className="text-[20px] font-bold select-none"
              style={{ color: 'var(--ldg-accent)', lineHeight: 1 }}
              aria-hidden="true"
            >
              §
            </span>
            {/* thinking ring — the seal considering where to stamp */}
            <AnimatePresence>
              {state === 'thinking' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0.6, 0.15, 0.6], scale: [1, 1.25, 1] }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  aria-hidden="true"
                  className="absolute -inset-2 pointer-events-none"
                  style={{
                    border: '1px solid var(--ldg-accent)',
                    borderRadius: 2,
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* the rule it walks on — a hairline tick, inked heavier on a press */}
          <motion.span
            aria-hidden="true"
            animate={
              state === 'walking' || isJumping
                ? { scaleX: [1, 0.7, 1], opacity: [0.7, 0.4, 0.7] }
                : { opacity: 0.55 }
            }
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="block mt-1.5"
            style={{
              width: 20,
              height: 1,
              background: 'var(--ldg-rule)',
            }}
          />
        </motion.div>
      </div>
    );
  }

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
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 0.1,
          }}
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
        role="button"
        aria-label="Talk to Syntax, the codex companion"
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
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${
                  fezcodexTheme === 'luxe'
                    ? 'border-t-white'
                    : 'border-t-[#050505]'
                }`}
              />
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
            animate={
              isJumping
                ? {
                    y: [0, -40, 0],
                    rotate: [0, 360, 0],
                  }
                : state === 'walking'
                  ? {
                      y: [0, -4, 0],
                      rotate: [0, 5, -5, 0],
                    }
                  : {
                      scale: [1, 1.05, 1],
                    }
            }
            transition={
              isJumping
                ? {
                    duration: 0.8,
                    ease: 'easeInOut',
                  }
                : {
                    repeat: Infinity,
                    duration: state === 'walking' ? 0.4 : 2,
                  }
            }
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
              animate={
                state === 'walking' || isJumping ? { y: [0, -2, 0] } : {}
              }
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="w-3 h-2 rounded-full bg-current opacity-50"
              style={{ color: spriteColor }}
            />
            <motion.div
              animate={
                state === 'walking' || isJumping ? { y: [0, -2, 0] } : {}
              }
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
