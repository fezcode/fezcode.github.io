import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CardsThreeIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import '../../styles/CardGamePage.css';

const suits = ['♠', '♥', '♦', '♣'];
const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

const getDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, value: ranks.indexOf(rank) + 2 }); // Value 2-14 (A)
    }
  }
  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const CardGamePage = () => {
  useSeo({
    title: 'Higher or Lower Card Game | Fezcodex',
    description:
      'Play a simple Higher or Lower card game. Guess if the next card will be higher or lower than the current one.',
    keywords: [
      'Fezcodex',
      'card game',
      'higher or lower',
      'game',
      'react game',
    ],
    ogTitle: 'Higher or Lower Card Game | Fezcodex',
    ogDescription:
      'Play a simple Higher or Lower card game. Guess if the next card will be higher or lower than the current one.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Higher or Lower Card Game | Fezcodex',
    twitterDescription:
      'Play a simple Higher or Lower card game. Guess if the next card will be higher or lower than the current one.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = useCallback(() => {
    const newDeck = getDeck();
    const firstCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(firstCard);
    setNextCard(null);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [addToast]);

  useEffect(() => {
    if (!gameStarted) {
      startGame();
    }
  }, [gameStarted, startGame]);

  const drawNextCard = () => {
    if (deck.length === 0) {
      startGame();
      return null;
    }
    const drawnCard = deck.pop();
    setDeck([...deck]); // Trigger re-render for deck length
    return drawnCard;
  };

  const handleGuess = (guess) => {
    if (gameOver || !currentCard) return;

    const drawnNextCard = drawNextCard();
    if (!drawnNextCard) return; // If deck was empty and reset

    setNextCard(drawnNextCard);

    const isHigher = drawnNextCard.value > currentCard.value;
    const isLower = drawnNextCard.value < currentCard.value;
    const isSame = drawnNextCard.value === currentCard.value;

    let correct = false;
    if (guess === 'higher' && isHigher) {
      correct = true;
    } else if (guess === 'lower' && isLower) {
      correct = true;
    } else if (isSame) {
      // If cards are the same, it's a draw, player doesn't lose, but doesn't win either.
      setCurrentCard(drawnNextCard);
      setNextCard(null);
      return;
    }

    if (correct) {
      setScore(score + 1);
      setCurrentCard(drawnNextCard);
      setNextCard(null);
    } else {
      setGameOver(true);
      addToast({
        title: 'Game Over!',
        message: `It was a ${drawnNextCard.rank} of ${drawnNextCard.suit}. Final score: ${score}`,
        duration: 7500,
        type: 'error',
      });
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const renderCard = (card, isNext = false) => {
    if (!card)
      return (
        <div
          className={`card-placeholder ${isNext ? 'next-card-placeholder' : ''}`}
        >
          ?
        </div>
      );

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div
        className={`card ${isRed ? 'red' : 'black'} ${isNext ? 'next-card' : ''}`}
      >
        <div className="card-corner top-left">
          <span className="rank">{card.rank}</span>
          <span className="suit">{card.suit}</span>
        </div>
        <div className="card-suit-center">{card.suit}</div>
        <div className="card-corner bottom-right">
          <span className="rank">{card.rank}</span>
          <span className="suit">{card.suit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">card</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center gap-2">
                <CardsThreeIcon size={32} /> Higher or Lower
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="flex flex-col items-center justify-center gap-4 mb-6">
                <p className="text-xl">Score: {score}</p>
                <div className="flex gap-8 items-center">
                  {renderCard(currentCard)}
                  <span className="text-4xl font-bold text-gray-400">VS</span>
                  {renderCard(nextCard, true)}
                </div>
                <p className="text-sm text-gray-400">
                  Cards left: {deck.length}
                </p>
              </div>

              {!gameOver && currentCard && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => handleGuess('higher')}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      border: '1px solid',
                    }}
                  >
                    Higher
                  </button>
                  <button
                    onClick={() => handleGuess('lower')}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      border: '1px solid',
                    }}
                  >
                    Lower
                  </button>
                </div>
              )}

              {gameOver && (
                <div className="text-center mt-6">
                  <p className="text-2xl font-bold text-red-500 mb-4">
                    Game Over! Final Score: {score}
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      border: '1px solid',
                    }}
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGamePage;
