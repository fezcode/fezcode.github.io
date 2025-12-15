import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  ArrowCounterClockwiseIcon,
  LadderSimpleIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { ToastContext } from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

// Placeholder dictionary - will be moved or loaded dynamically later
const DICTIONARY = new Set([
  'able',
  'acid',
  'aged',
  'also',
  'area',
  'army',
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
  'bear',
  'beat',
  'bell',
  'bend',
  'best',
  'bill',
  'bird',
  'bite',
  'black',
  'blow',
  'blue',
  'boat',
  'body',
  'bomb',
  'bond',
  'bone',
  'born',
  'boss',
  'both',
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
  'card',
  'care',
  'case',
  'cash',
  'cast',
  'cell',
  'cent',
  'chef',
  'chip',
  'city',
  'club',
  'coal',
  'coat',
  'code',
  'cold',
  'come',
  'cook',
  'cool',
  'copy',
  'core',
  'cost',
  'crew',
  'crop',
  'dark',
  'data',
  'dawn',
  'dead',
  'deal',
  'dean',
  'dear',
  'deep',
  'deny',
  'desk',
  'dial',
  'diet',
  'disc',
  'dish',
  'does',
  'done',
  'door',
  'down',
  'draw',
  'drew',
  'drop',
  'drug',
  'dump',
  'dust',
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
  'sense',
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
    if (word1[i] !== word2[i]) {
      diffCount++;
    }
  }
  return diffCount === 1;
};

const WordLadderPage = () => {
  useSeo({
    title: 'Word Ladder | Fezcodex',
    description:
      'A fun word transformation game where you change one letter at a time.',
    keywords: ['Fezcodex', 'word ladder', 'word game', 'puzzle', 'logic game'],
    ogTitle: 'Word Ladder | Fezcodex',
    ogDescription:
      'A fun word transformation game where you change one letter at a time.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Word Ladder | Fezcodex',
    twitterDescription:
      'A fun word transformation game where you change one letter at a time.',
    twitterImage: '/images/ogtitle.png',
  });

  const { addToast } = useContext(ToastContext);

  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [ladder, setLadder] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState('');

  const inputRef = useRef(null);

  const initGame = (wordLength = 4) => {
    let newStartWord = generateRandomWord(wordLength);
    let newEndWord = generateRandomWord(wordLength);

    // Ensure start and end words are different and a path might exist (basic check)
    while (
      newStartWord === newEndWord ||
      !newStartWord ||
      !newEndWord ||
      !hasPath(newStartWord, newEndWord, DICTIONARY)
    ) {
      newStartWord = generateRandomWord(wordLength);
      newEndWord = generateRandomWord(wordLength);
    }

    setStartWord(newStartWord);
    setEndWord(newEndWord);
    setLadder([newStartWord]);
    setGameStatus('playing');
    setMessage('');
    setCurrentGuess('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    initGame(4); // Always initialize with 4-letter words
  }, []); // Empty dependency array means it runs once on mount

  // Simple BFS to check if a path exists (expensive for large dictionaries)
  const hasPath = (start, end, dict) => {
    const queue = [{ word: start, path: [start] }];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const { word, path } = queue.shift();

      if (word === end) return true;

      for (const dictWord of dict) {
        if (!visited.has(dictWord) && isOneLetterDifferent(word, dictWord)) {
          visited.add(dictWord);
          queue.push({ word: dictWord, path: [...path, dictWord] });
        }
      }
    }
    return false;
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const guess = currentGuess.toLowerCase().trim();

    if (!guess) {
      addToast({ message: 'Please enter a word.', type: 'error' });
      return;
    }

    if (guess.length !== startWord.length) {
      addToast({
        message: `Your guess must be ${startWord.length} letters long.`,
        type: 'error',
      });
      return;
    }

    if (ladder.includes(guess)) {
      addToast({
        message: 'You already have this word in your ladder.',
        type: 'warning',
      });
      return;
    }

    if (!DICTIONARY.has(guess)) {
      addToast({
        message: 'Not a valid word in our dictionary.',
        type: 'error',
      });
      return;
    }

    const lastWordInLadder = ladder[ladder.length - 1];
    if (!isOneLetterDifferent(lastWordInLadder, guess)) {
      addToast({
        message: `Your guess must differ by only one letter from "${lastWordInLadder}".`,
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
        `Congratulations! You've completed the word ladder in ${newLadder.length - 1} steps!`,
      );
      addToast({ message: 'You won!', type: 'success' });
    } else {
      setMessage('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleResetGame = () => {
    initGame(4);
  };

  const gameControlsDisabled = gameStatus !== 'playing';

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Word Ladder" slug="wl" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-2xl">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-4">
              <h2 className="text-3xl font-arvo font-normal mb-2 text-app text-center">
                Word Ladder
              </h2>
              <p className="text-center text-app-light mb-4">
                Transform{' '}
                <span className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
                  {startWord}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
                  {endWord}
                </span>{' '}
                by changing one letter at a time. Each intermediate word must be
                a valid English word.
              </p>
              <hr className="border-gray-700 mb-6" />
              <div className="bg-gray-900/50 border border-app-alpha-50 rounded-md p-4 mb-6">
                <h3 className="text-xl font-bold mb-4 text-app-light text-center">
                  Your Ladder:
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {ladder.map((word, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-full text-lg font-mono shadow-md
                        ${index === 0 ? 'bg-green-700 text-green-100' : ''}
                        ${index === ladder.length - 1 && gameStatus === 'won' ? 'bg-yellow-700 text-yellow-100' : ''}
                        ${index > 0 && !(index === ladder.length - 1 && gameStatus === 'won') ? 'bg-blue-700 text-blue-100' : ''}
                        `}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {!gameControlsDisabled && (
                <form
                  onSubmit={handleGuessSubmit}
                  className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    maxLength={startWord.length}
                    className="flex-grow p-3 bg-gray-900/50 font-mono border rounded-md focus:ring-0 text-app-light border-app-alpha-50 text-center"
                    placeholder={`Enter a ${startWord.length}-letter word`}
                    disabled={gameControlsDisabled}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2 justify-center"
                    disabled={gameControlsDisabled}
                  >
                    <LadderSimpleIcon size={24} /> Submit Guess
                  </button>
                </form>
              )}

              {message && (
                <div
                  className={`p-4 rounded-md text-center font-semibold text-lg my-4
                    ${gameStatus === 'won' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}
                    `}
                >
                  {message}
                </div>
              )}

              <div className="flex justify-center mt-4">
                <button
                  onClick={handleResetGame}
                  className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                >
                  <ArrowCounterClockwiseIcon size={24} /> New Game
                </button>
              </div>

              <div className="bg-app-alpha-10 border border-app-alpha-50 text-app p-4 mt-8 rounded-md">
                <div className="flex items-center mb-2">
                  <LightbulbIcon size={24} className="mr-3" />
                  <p className="font-bold">How to Play:</p>
                </div>
                <ul className="list-disc list-inside ml-5 text-sm">
                  <li>Start with the given word.</li>
                  <li>Change one letter at a time to form a new valid word.</li>
                  <li>Continue until you reach the target word.</li>
                  <li>Each intermediate word must be a valid English word.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordLadderPage;
