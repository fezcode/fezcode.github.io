import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BrainIcon } from '@phosphor-icons/react'; // Using BrainIcon for memory game
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import '../../styles/MemoryGamePage.css';

const cardValues = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍓', '🍉']; // Example card values

const MemoryGamePage = () => {
  useSeo({
    title: 'Memory Game | Fezcodex',
    description: 'A classic memory game to test your concentration.',
    keywords: ['Fezcodex', 'memory game', 'match pairs', 'brain game', 'concentration'],
    ogTitle: 'Memory Game | Fezcodex',
    ogDescription: 'A classic memory game to test your concentration.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Memory Game | Fezcodex',
    twitterDescription: 'A classic memory game to test your concentration.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffledCards = shuffleCards(cardValues);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchesFound(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(false); // Game starts when "Play Game" is clicked
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const shuffleCards = (values) => {
    let id = 0;
    const initialCards = [...values, ...values].map(value => ({
      id: id++,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    // Fisher-Yates shuffle algorithm
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }
    return initialCards;
  };

  const handleCardClick = (clickedCard) => {
    if (!gameStarted || gameOver || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length === 2) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards(prev => [...prev, clickedCard.id]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(card => card.id === flippedCards[0]);
      const secondCard = clickedCard;

      if (firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          const matchedCards = newCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, isMatched: true } : card
          );
          setCards(matchedCards);
          setMatchesFound(prev => prev + 1);
          setFlippedCards([]);
        }, 700);
      } else {
        // No match, flip back
        setTimeout(() => {
          const flippedBackCards = newCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card
          );
          setCards(flippedBackCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchesFound === cardValues.length) {
      setGameOver(true);
    }
  }, [matchesFound]);

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
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
          <span className="single-app-color">mg</span>
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
                <BrainIcon size={32} /> Memory Game
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="memory-game-area">
                <div className="game-info mb-4 text-xl font-bold">
                  Moves: {moves} | Matches: {matchesFound}/{cardValues.length}
                </div>

                {gameOver && (
                  <div className="game-over-message text-center text-3xl font-bold mb-4">
                    You Won!
                    <button
                      onClick={initializeGame}
                      className="block mx-auto mt-4 px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
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

                {!gameStarted && (
                  <div className="start-game-message text-center text-3xl font-bold mb-4">
                    Click "Play Game" to Start!
                    <button
                      onClick={() => setGameStarted(true)}
                      className="block mx-auto mt-4 px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: cardStyle.color,
                        borderColor: cardStyle.borderColor,
                        border: '1px solid',
                      }}
                    >
                      Play Game
                    </button>
                  </div>
                )}

                <div className={`cards-grid ${!gameStarted || gameOver ? 'blurred' : ''}`}>
                  {cards.map(card => (
                    <div
                      key={card.id}
                      className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                      onClick={() => handleCardClick(card)}
                    >
                      <div className="card-inner">
                        <div className="card-face card-back"></div>
                        <div className="card-face card-front">
                          {card.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGamePage;
