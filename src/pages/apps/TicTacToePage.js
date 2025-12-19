import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, X, Circle } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const TicTacToePage = () => {
  useSeo({
    title: 'Tic Tac Toe | Fezcodex',
    description:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    keywords: ['Fezcodex', 'tic tac toe', 'game', 'fun app'],
    ogTitle: 'Tic Tac Toe | Fezcodex',
    ogDescription:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Tic Tac Toe | Fezcodex',
    twitterDescription:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    twitterImage: '/images/ogtitle.png',
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const { addToast } = useToast();

  const handleClick = useCallback((i) => {
    if (winner || board[i]) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }, [board, winner, xIsNext]);

  // Minimax algorithm functions
  const minimax = useCallback((currentBoard, depth, isMaximizingPlayer) => {
    const result = calculateWinner(currentBoard);

    if (result === 'X') return -10 + depth; // Player X (human) wins
    if (result === 'O') return 10 - depth; // Player O (AI) wins
    if (currentBoard.every(Boolean)) return 0; // It's a draw

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'O';
          let score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'X';
          let score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, []);

  const findBestMove = useCallback((currentBoard) => {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }, [minimax]);

  const makeAiMove = useCallback(() => {
    const bestMove = findBestMove(board);
    if (bestMove !== null) {
      handleClick(bestMove);
    }
  }, [board, handleClick, findBestMove]);

  useEffect(() => {
    if (!xIsNext && !winner) {
      // AI's turn (simple AI for now)
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, winner, makeAiMove]);

  useEffect(() => {
    const calculatedWinner = calculateWinner(board);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      addToast({
        title: 'Game Over',
        message: `${calculatedWinner} wins!`,
        duration: 3000,
      });
    } else if (board.every(Boolean)) {
      setWinner('Draw');
      addToast({ title: 'Game Over', message: "It's a draw!", duration: 3000 });
    }
  }, [board, addToast]);

  const renderSquare = (i) => (
    <button
      className="w-24 h-24 bg-gray-800 border border-gray-600 text-5xl flex items-center justify-center"
      onClick={() => handleClick(i)}
      disabled={winner || board[i]}
    >
      {board[i] === 'X' && <X size={48} color={colors.red} />}
      {board[i] === 'O' && (
        <Circle size={40} color={colors.blue} weight="thin" />
      )}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const status = winner
    ? winner === 'Draw'
      ? 'Draw!'
      : `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

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
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Tic Tac Toe" slug="ttt" />
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
                Tic Tac Toe{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-col items-center gap-8">
                <div className="text-2xl font-medium mb-4">{status}</div>
                <div className="grid grid-cols-3 gap-1">
                  {Array(9)
                    .fill(null)
                    .map((_, i) => renderSquare(i))}
                </div>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-app/50 text-white hover:bg-app/70"
                  style={{ borderColor: colors['app-alpha-50'] }}
                >
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToePage;
