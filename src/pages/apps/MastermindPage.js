import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const MastermindPage = () => {
  useSeo({
    title: 'Mastermind Game | Fezcodex',
    description:
      'Play the classic code-breaking game of Mastermind (Bulls and Cows).',
    keywords: [
      'Fezcodex',
      'mastermind',
      'bulls and cows',
      'game',
      'logic game',
    ],
    ogTitle: 'Mastermind Game | Fezcodex',
    ogDescription:
      'Play the classic code-breaking game of Mastermind (Bulls and Cows).',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Mastermind Game | Fezcodex',
    twitterDescription:
      'Play the classic code-breaking game of Mastermind (Bulls and Cows).',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();
  const [secretCode, setSecretCode] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const MAX_GUESSES = 10;

  const generateSecretCode = () => {
    let digits = '0123456789'.split('');
    let code = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.random() * digits.length;
      code += digits.splice(randomIndex, 1)[0];
    }
    setSecretCode(code);
  };

  useEffect(() => {
    generateSecretCode();
  }, []);

  useEffect(() => {
    if (gameOver && message) {
      addToast({ title: 'Mastermind', message: message, duration: 5000 });
    }
  }, [gameOver, message, addToast]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (gameOver) return;

    if (
      currentGuess.length !== 4 ||
      !/^\d{4}$/.test(currentGuess) ||
      new Set(currentGuess).size !== 4
    ) {
      setMessage('Please enter a 4-digit number with unique digits.');
      addToast({
        title: 'Mastermind Error',
        message: 'Please enter a 4-digit number with unique digits.',
        duration: 3000,
      });
      return;
    }

    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === secretCode[i]) {
        bulls++;
      } else if (secretCode.includes(currentGuess[i])) {
        cows++;
      }
    }

    const newGuesses = [...guesses, { guess: currentGuess, bulls, cows }];
    setGuesses(newGuesses);

    if (bulls === 4) {
      setGameOver(true);
      setMessage(`You won! The code was ${secretCode}.`);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setMessage(`Game Over! The secret code was ${secretCode}.`);
    }

    setCurrentGuess('');
  };

  const handleResetGame = () => {
    generateSecretCode();
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
  };

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
        <BreadcrumbTitle title="Mastermind" slug="mm" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-lg">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-4">
              <h1 className="text-3xl font-arvo font-normal mb-2 text-app">
                Mastermind
              </h1>
              <p className="text-center text-app-light mb-4">
                Guess the secret 4-digit code. Digits are unique.
              </p>
              <hr className="border-gray-700 mb-6" />
              {!gameOver && (
                <form
                  onSubmit={handleGuessSubmit}
                  className="flex gap-2 justify-center mb-4"
                >
                  <input
                    type="text"
                    maxLength="4"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    className="w-32 text-center text-2xl p-2 bg-gray-900/50 font-mono border rounded-md focus:ring-0 text-app-light border-app-alpha-50"
                    disabled={gameOver}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                    disabled={gameOver}
                  >
                    <LightbulbIcon size={24} /> Guess
                  </button>
                </form>
              )}

              {message && (
                <p className="text-center text-lg font-semibold my-4">
                  {message}
                </p>
              )}
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleResetGame}
                  className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                >
                  <ArrowCounterClockwiseIcon size={24} /> New Game
                </button>
              </div>
              <div className="text-center text-lg font-semibold my-4">
                Guesses: {guesses.length} / {MAX_GUESSES}
              </div>
              <div className="h-64 overflow-y-auto border border-app-alpha-50 rounded-md p-2">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-app-alpha-50">
                      <th className="p-2">Guess</th>
                      <th className="p-2">Bulls (Correct)</th>
                      <th className="p-2">Cows (Present)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guesses
                      .slice(0)
                      .reverse()
                      .map((g, index) => (
                        <tr
                          key={index}
                          className="border-b border-app-alpha-50/50"
                        >
                          <td className="p-2">{g.guess}</td>
                          <td className="p-2">{g.bulls}</td>
                          <td className="p-2">{g.cows}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastermindPage;
