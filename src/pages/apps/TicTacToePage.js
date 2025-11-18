import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, Circle } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';

const TicTacToePage = () => {
  useSeo({
    title: 'Tic Tac Toe | Fezcodex',
    description:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    keywords: ['Fezcodex', 'tic tac toe', 'game', 'fun app'],
    ogTitle: 'Tic Tac Toe | Fezcodex',
    ogDescription:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Tic Tac Toe | Fezcodex',
    twitterDescription:
      'Play the classic game of Tic Tac Toe against another player or AI.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!xIsNext && !winner) {
      // AI's turn (simple AI for now)
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winner]);

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

  const makeAiMove = () => {
    const bestMove = findBestMove(board);
    if (bestMove !== null) {
      handleClick(bestMove);
    }
  };

  const handleClick = (i) => {
    if (winner || board[i]) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Minimax algorithm functions
  const minimax = (currentBoard, depth, isMaximizingPlayer) => {
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
  };

  const findBestMove = (currentBoard) => {
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
  };

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
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeft size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">ttt</span>
        </h1>
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
