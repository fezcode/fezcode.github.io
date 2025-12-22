import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  ArrowCounterClockwiseIcon,
  LadderSimpleIcon,
  HashIcon,
  TargetIcon,
} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';
import useSeo from '../../hooks/useSeo';
import {ToastContext} from '../../context/ToastContext';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

// Placeholder dictionary
const DICTIONARY = new Set([
  'able',
  'acid',
  'aged',
  'ally',
  'also',
  'arch',
  'area',
  'arid',
  'army',
  'atom',
  'aunt',
  'aura',
  'auto',
  'away',
  'baby',
  'back',
  'ball',
  'band',
  'bank',
  'bare',
  'bark',
  'barn',
  'base',
  'bath',
  'bead',
  'beam',
  'bean',
  'bear',
  'beat',
  'beef',
  'beer',
  'bell',
  'belt',
  'bend',
  'best',
  'beta',
  'bike',
  'bill',
  'bind',
  'bird',
  'bite',
  'blow',
  'blue',
  'blur',
  'boar',
  'boat',
  'body',
  'boil',
  'bold',
  'bolt',
  'bomb',
  'bond',
  'bone',
  'book',
  'boom',
  'boon',
  'boot',
  'bore',
  'born',
  'boss',
  'both',
  'bout',
  'bowl',
  'boys',
  'bulk',
  'burn',
  'bush',
  'busy',
  'call',
  'calm',
  'came',
  'camp',
  'cane',
  'cant',
  'cape',
  'card',
  'care',
  'cart',
  'case',
  'cash',
  'cast',
  'cave',
  'cell',
  'cent',
  'chat',
  'chef',
  'chew',
  'chin',
  'chip',
  'chop',
  'cite',
  'city',
  'clan',
  'clap',
  'claw',
  'clay',
  'clip',
  'club',
  'clue',
  'coal',
  'coat',
  'code',
  'coin',
  'cold',
  'come',
  'comb',
  'cone',
  'cook',
  'cool',
  'coop',
  'cope',
  'copy',
  'cord',
  'core',
  'cork',
  'corn',
  'cost',
  'crab',
  'crew',
  'crop',
  'crow',
  'cube',
  'cure',
  'curl',
  'dark',
  'data',
  'date',
  'dawn',
  'dead',
  'deaf',
  'deal',
  'dean',
  'dear',
  'deck',
  'deed',
  'deep',
  'deer',
  'dent',
  'deny',
  'desk',
  'dial',
  'dice',
  'diet',
  'dirt',
  'disc',
  'dish',
  'disk',
  'dive',
  'dock',
  'does',
  'doll',
  'dome',
  'done',
  'doom',
  'door',
  'dope',
  'down',
  'drag',
  'draw',
  'drew',
  'drop',
  'drug',
  'drum',
  'duck',
  'duel',
  'duke',
  'dull',
  'dumb',
  'dump',
  'dune',
  'dust',
  'duty',
  'earn',
  'east',
  'easy',
  'edge',
  'else',
  'even',
  'ever',
  'face',
  'fact',
  'fail',
  'fair',
  'fall',
  'farm',
  'fast',
  'fear',
  'feed',
  'feel',
  'feet',
  'fell',
  'felt',
  'file',
  'fill',
  'film',
  'find',
  'fine',
  'fire',
  'firm',
  'fish',
  'five',
  'flat',
  'flex',
  'flow',
  'foot',
  'form',
  'fort',
  'four',
  'free',
  'from',
  'full',
  'fund',
  'gain',
  'game',
  'gate',
  'gave',
  'gear',
  'gene',
  'gift',
  'girl',
  'give',
  'glad',
  'goal',
  'goes',
  'gold',
  'gone',
  'good',
  'gray',
  'grow',
  'grew',
  'hair',
  'half',
  'hall',
  'hand',
  'hang',
  'hard',
  'have',
  'head',
  'hear',
  'heat',
  'held',
  'hell',
  'help',
  'here',
  'hero',
  'hide',
  'high',
  'hill',
  'hire',
  'hold',
  'hole',
  'home',
  'hope',
  'host',
  'hour',
  'huge',
  'hung',
  'hunt',
  'hurt',
  'idea',
  'inch',
  'into',
  'iron',
  'item',
  'join',
  'jump',
  'just',
  'keep',
  'kept',
  'kick',
  'kill',
  'kind',
  'king',
  'knee',
  'knew',
  'know',
  'lack',
  'lady',
  'laid',
  'land',
  'last',
  'late',
  'lead',
  'leak',
  'lean',
  'left',
  'lend',
  'less',
  'life',
  'lift',
  'like',
  'limp',
  'line',
  'link',
  'live',
  'load',
  'long',
  'look',
  'lost',
  'loud',
  'love',
  'lows',
  'luck',
  'made',
  'mail',
  'main',
  'make',
  'male',
  'many',
  'mark',
  'mass',
  'mean',
  'meet',
  'menu',
  'mere',
  'mike',
  'mile',
  'milk',
  'mill',
  'mind',
  'mine',
  'miss',
  'mode',
  'mood',
  'moon',
  'more',
  'most',
  'move',
  'much',
  'must',
  'name',
  'near',
  'neck',
  'need',
  'news',
  'next',
  'nice',
  'nine',
  'none',
  'nose',
  'note',
  'okay',
  'once',
  'only',
  'open',
  'onto',
  'oral',
  'over',
  'pace',
  'pack',
  'page',
  'paid',
  'pain',
  'pair',
  'pale',
  'palm',
  'park',
  'part',
  'pass',
  'past',
  'path',
  'peak',
  'pick',
  'pile',
  'pill',
  'pipe',
  'plan',
  'play',
  'plot',
  'plug',
  'plus',
  'poem',
  'poet',
  'pole',
  'poll',
  'pool',
  'poor',
  'port',
  'post',
  'pull',
  'pure',
  'push',
  'race',
  'raid',
  'rail',
  'rain',
  'rank',
  'rare',
  'rate',
  'read',
  'real',
  'rear',
  'rely',
  'rent',
  'rest',
  'rice',
  'rich',
  'ride',
  'ring',
  'rise',
  'risk',
  'road',
  'rock',
  'role',
  'roll',
  'roof',
  'room',
  'root',
  'rose',
  'rule',
  'runs',
  'rush',
  'safe',
  'said',
  'sail',
  'sale',
  'salt',
  'same',
  'sand',
  'save',
  'says',
  'scan',
  'seat',
  'seed',
  'seek',
  'seem',
  'seen',
  'self',
  'sell',
  'send',
  'sent',
  'sets',
  'ship',
  'shoe',
  'shop',
  'shot',
  'show',
  'shut',
  'sick',
  'side',
  'sign',
  'sing',
  'sink',
  'site',
  'size',
  'skin',
  'slip',
  'slow',
  'snap',
  'snow',
  'soft',
  'soil',
  'sold',
  'some',
  'song',
  'soon',
  'sort',
  'soul',
  'soup',
  'spot',
  'star',
  'stay',
  'step',
  'stop',
  'such',
  'suit',
  'sure',
  'take',
  'talk',
  'tall',
  'tape',
  'task',
  'team',
  'tear',
  'tell',
  'tend',
  'tens',
  'test',
  'text',
  'than',
  'that',
  'them',
  'then',
  'they',
  'thin',
  'this',
  'thus',
  'tied',
  'till',
  'time',
  'tiny',
  'tire',
  'told',
  'tone',
  'took',
  'tool',
  'toss',
  'tour',
  'town',
  'tree',
  'trip',
  'true',
  'turn',
  'type',
  'unit',
  'upon',
  'used',
  'user',
  'vary',
  'vast',
  'very',
  'view',
  'vote',
  'wage',
  'wait',
  'walk',
  'wall',
  'want',
  'warm',
  'warn',
  'wash',
  'wave',
  'ways',
  'weak',
  'wear',
  'week',
  'well',
  'went',
  'were',
  'west',
  'what',
  'when',
  'whom',
  'wide',
  'wife',
  'wild',
  'will',
  'wind',
  'wine',
  'wing',
  'wise',
  'wish',
  'with',
  'wood',
  'word',
  'wore',
  'work',
  'yard',
  'yeah',
  'year',
  'yell',
  'your',
  'zero',
  'zone',
]);

const generateRandomWord = (length) => {
  const words = Array.from(DICTIONARY).filter((word) => word.length === length);
  if (words.length === 0) return '';
  return words[Math.floor(Math.random() * words.length)];
};

const isOneLetterDifferent = (word1, word2) => {
  if (word1.length !== word2.length) return false;
  let diffCount = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) diffCount++;
  }
  return diffCount === 1;
};

const WordLadderPage = () => {
  const appName = 'Word Ladder';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Transform words one letter at a time in this logic puzzle.',
    keywords: ['Fezcodex', 'word ladder', 'word game', 'puzzle', 'logic'],
  });

  const {addToast} = useContext(ToastContext);
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [ladder, setLadder] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('');
  const [solution, setSolution] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef(null);

  const findShortestPath = useCallback((start, end, dict) => {
    const queue = [{word: start, path: [start]}];
    const visited = new Set([start]);
    while (queue.length > 0) {
      const {word, path} = queue.shift();
      if (word === end) return path;
      for (const dictWord of dict) {
        if (
          dictWord.length === start.length &&
          !visited.has(dictWord) &&
          isOneLetterDifferent(word, dictWord)
        ) {
          visited.add(dictWord);
          queue.push({word: dictWord, path: [...path, dictWord]});
        }
      }
    }
    return null;
  }, []);

  const initGame = useCallback(
    (wordLength = 4) => {
      let newStartWord = generateRandomWord(wordLength);
      let newEndWord = generateRandomWord(wordLength);
      let path = findShortestPath(newStartWord, newEndWord, DICTIONARY);

      while (
        newStartWord === newEndWord ||
        !newStartWord ||
        !newEndWord ||
        !path ||
        path.length < 3
        ) {
        newStartWord = generateRandomWord(wordLength);
        newEndWord = generateRandomWord(wordLength);
        path = findShortestPath(newStartWord, newEndWord, DICTIONARY);
      }

      setStartWord(newStartWord);
      setEndWord(newEndWord);
      setLadder([newStartWord]);
      setGameStatus('playing');
      setMessage('');
      setCurrentGuess('');
      setSolution(path);
      setIsRevealed(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    },
    [findShortestPath],
  );

  useEffect(() => {
    initGame(4);
  }, [initGame]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const guess = currentGuess.toLowerCase().trim();
    if (!guess) return;

    if (guess.length !== startWord.length) {
      addToast({
        message: `Word must be ${startWord.length} letters.`,
        type: 'error',
      });
      return;
    }
    if (ladder.includes(guess)) {
      addToast({message: 'Word already used in ladder.', type: 'warning'});
      return;
    }
    if (!DICTIONARY.has(guess)) {
      addToast({message: 'Not a valid word.', type: 'error'});
      return;
    }

    const lastWordInLadder = ladder[ladder.length - 1];
    if (!isOneLetterDifferent(lastWordInLadder, guess)) {
      addToast({
        message: 'Must differ by exactly one letter.',
        type: 'error',
      });
      return;
    }

    const newLadder = [...ladder, guess];
    setLadder(newLadder);
    setCurrentGuess('');

    if (guess === endWord) {
      setGameStatus('won');
      setMessage(
        `Transformation Complete :: Success in ${newLadder.length - 1} steps.`,
      );
      addToast({message: 'Puzzle Solved!', type: 'success'});
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold"/>
            <span>Applications</span>
          </Link>

          <BreadcrumbTitle title={appName} slug="wl" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Transform{' '}
                <span className="text-emerald-400 font-bold">{startWord}</span>{' '}
                into{' '}
                <span className="text-emerald-400 font-bold">{endWord}</span>.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Steps
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {ladder.length - 1}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Status
                </span>
                <span
                  className={`text-3xl font-black ${gameStatus === 'won' ? 'text-emerald-500' : 'text-white'}`}
                >
                  {gameStatus === 'won' ? 'COMPLETED' : 'IN_PROGRESS'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Input Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <TargetIcon weight="fill"/>
                Word_Input
              </h3>

              {gameStatus === 'playing' ? (
                <form
                  onSubmit={handleGuessSubmit}
                  className="flex flex-col gap-8 relative z-10"
                >
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      Next Word Segment
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentGuess}
                      onChange={(e) =>
                        setCurrentGuess(
                          e.target.value.replace(/[^a-zA-Z]/g, ''),
                        )
                      }
                      maxLength={startWord.length}
                      className="bg-transparent border-b-2 border-white/10 py-4 text-5xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors tracking-[0.2em] text-center uppercase"
                      placeholder="----"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                  >
                    <LadderSimpleIcon weight="bold" size={18}/>
                    Submit Step
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 relative z-10">
                  <p className="text-xl font-mono text-emerald-400 mb-8 leading-relaxed uppercase">
                    {message}
                  </p>
                  <button
                    onClick={() => initGame(startWord.length)}
                    className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all text-sm"
                  >
                    New Transformation
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <LightbulbIcon size={20} weight="bold"/>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Rules of Engagement
                </h4>
              </div>
              <ul className="space-y-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
                <li className="flex gap-3">
                  <span className="text-emerald-500">01</span> Change exactly
                  one letter at a time.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">02</span> Every step must
                  be a valid word.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">03</span> Reach the target
                  word in the fewest steps possible.
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => initGame(startWord.length)}
                className="flex-1 py-3 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwiseIcon/>
                Reset Current
              </button>

              <button
                onClick={() => setIsRevealed(true)}
                disabled={isRevealed || gameStatus === 'won'}
                className="flex-1 py-3 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <LightbulbIcon/>
                Reveal Solution
              </button>
            </div>

            {isRevealed && solution && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-sm">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <LightbulbIcon size={20} weight="bold"/>
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                    Optimal Solution
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-gray-400 uppercase leading-relaxed">
                  {solution.map((word, idx) => (
                    <span key={word + idx} className="flex items-center gap-2">
                      <span
                        className={
                          idx === 0 || idx === solution.length - 1
                            ? 'text-emerald-400 font-bold'
                            : ''
                        }
                      >
                        {word}
                      </span>
                      {idx < solution.length - 1 && (
                        <span className="text-gray-700">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3
              className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <HashIcon weight="fill" className="text-emerald-500"/>
              Evolution_Path
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-8">
              <div className="flex flex-wrap gap-4 justify-center">
                <AnimatePresence>
                  {ladder.map((word, index) => (
                    <motion.div
                      key={word + index}
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`
                          px-6 py-3 border font-mono text-xl font-black uppercase tracking-widest rounded-sm transition-all
                          ${index === 0 ? 'border-white text-white bg-white/10' : ''}
                          ${index === ladder.length - 1 && gameStatus === 'won' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : ''}
                          ${index > 0 && !(index === ladder.length - 1 && gameStatus === 'won') ? 'border-white/10 text-gray-500 bg-white/5' : ''}
                        `}
                      >
                        {word}
                      </div>
                      {index < ladder.length - 1 && (
                        <span className="text-gray-700 font-mono">→</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordLadderPage;
