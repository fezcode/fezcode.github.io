import {ArrowLeft, ArrowLeftIcon, Handshake} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const choices = [
  { name: 'Rock', emoji: '🪨' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Scissors', emoji: '✂️' },
];

const RockPaperScissorsPage = () => {
  useSeo({
    title: 'Rock Paper Scissors | Fezcodex',
    description:
      'Play the classic game of Rock Paper Scissors against the computer.',
    keywords: ['Fezcodex', 'rock paper scissors', 'game', 'fun app'],
    ogTitle: 'Rock Paper Scissors | Fezcodex',
    ogDescription:
      'Play the classic game of Rock Paper Scissors against the computer.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Rock Paper Scissors | Fezcodex',
    twitterDescription:
      'Play the classic game of Rock Paper Scissors against the computer.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  useEffect(() => {
    if (playerChoice !== null) {
      const computerRandomChoice =
        choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerRandomChoice);
      determineWinner(playerChoice, computerRandomChoice);
    }
  }, [playerChoice]);

  const determineWinner = (pChoice, cChoice) => {
    if (pChoice.name === cChoice.name) {
      setResult("It's a tie!");
    } else if (
      (pChoice.name === 'Rock' && cChoice.name === 'Scissors') ||
      (pChoice.name === 'Paper' && cChoice.name === 'Rock') ||
      (pChoice.name === 'Scissors' && cChoice.name === 'Paper')
    ) {
      setResult('You win!');
      setPlayerScore((prevScore) => prevScore + 1);
    } else {
      setResult('Computer wins!');
      setComputerScore((prevScore) => prevScore + 1);
    }
  };

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  const { addToast } = useToast();

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Rock Paper Scissors" slug="rps" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Rock Paper Scissors{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-col items-center gap-8">
                <div className="flex justify-center space-x-4 mb-8">
                  {choices.map((choice) => (
                    <button
                      key={choice.name}
                      onClick={() => handlePlayerChoice(choice)}
                      className="p-4 rounded-lg shadow-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-6xl"
                    >
                      {choice.emoji}
                    </button>
                  ))}
                </div>

                {playerChoice && computerChoice && (
                  <div className="text-center mb-8">
                    <p className="text-2xl mb-2">
                      You chose: {playerChoice.emoji} {playerChoice.name}
                    </p>
                    <p className="text-2xl mb-4">
                      Computer chose: {computerChoice.emoji}{' '}
                      {computerChoice.name}
                    </p>
                    <p className="text-3xl font-semibold text-blue-400">
                      {result}
                    </p>
                    <button
                      onClick={resetGame}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Play Again
                    </button>
                  </div>
                )}

                <div className="flex justify-center space-x-8 text-2xl font-medium">
                  <p>
                    Player Score:{' '}
                    <span className="text-green-400">{playerScore}</span>
                  </p>
                  <p>
                    Computer Score:{' '}
                    <span className="text-red-400">{computerScore}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissorsPage;
