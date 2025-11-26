import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const ConnectFourPage = () => {
  useSeo({
    title: 'Connect Four | Fezcodex',
    description:
      'Play the classic game of Connect Four against another player or AI.',
    keywords: ['Fezcodex', 'connect four', 'game', 'fun app'],
    ogTitle: 'Connect Four | Fezcodex',
    ogDescription:
      'Play the classic game of Connect Four against another player or AI.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Connect Four | Fezcodex',
    twitterDescription:
      'Play the classic game of Connect Four against another player or AI.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();

  // Game state (to be implemented)
  const [board, setBoard] = useState([]); // 6 rows, 7 columns
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1 (Red), 2 for Player 2 (Yellow)
  const [winner, setWinner] = useState(null); // null, 1, 2, or 'Draw'

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(6)
      .fill(null)
      .map(() => Array(7).fill(0)); // 0 for empty, 1 for Player 1, 2 for Player 2
    setBoard(newBoard);
    setCurrentPlayer(1);
    setWinner(null);
  };

  const handleColumnClick = (colIndex) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);
    let rowIndex = -1;

    // Find the lowest empty spot in the column
    for (let r = 5; r >= 0; r--) {
      if (newBoard[r][colIndex] === 0) {
        newBoard[r][colIndex] = currentPlayer;
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) {
      addToast({
        title: 'Column Full',
        message: 'This column is full. Choose another one.',
        duration: 2000,
      });
      return;
    }

    setBoard(newBoard);

    if (checkWin(newBoard, rowIndex, colIndex, currentPlayer)) {
      setWinner(currentPlayer);
      addToast({
        title: 'Game Over',
        message: `Player ${currentPlayer} wins!`,
        duration: 3000,
      });
    } else if (newBoard.every((row) => row.every((cell) => cell !== 0))) {
      setWinner('Draw');
      addToast({ title: 'Game Over', message: "It's a draw!", duration: 3000 });
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const checkWin = (currentBoard, row, col, player) => {
    // Check horizontal
    for (let c = 0; c <= 3; c++) {
      if (
        currentBoard[row][c] === player &&
        currentBoard[row][c + 1] === player &&
        currentBoard[row][c + 2] === player &&
        currentBoard[row][c + 3] === player
      ) {
        return true;
      }
    }

    // Check vertical
    for (let r = 0; r <= 2; r++) {
      if (
        currentBoard[r][col] === player &&
        currentBoard[r + 1][col] === player &&
        currentBoard[r + 2][col] === player &&
        currentBoard[r + 3][col] === player
      ) {
        return true;
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let r = 0; r <= 2; r++) {
      for (let c = 0; c <= 3; c++) {
        if (
          currentBoard[r][c] === player &&
          currentBoard[r + 1][c + 1] === player &&
          currentBoard[r + 2][c + 2] === player &&
          currentBoard[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let r = 3; r <= 5; r++) {
      for (let c = 0; c <= 3; c++) {
        if (
          currentBoard[r][c] === player &&
          currentBoard[r - 1][c + 1] === player &&
          currentBoard[r - 2][c + 2] === player &&
          currentBoard[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const getCellColor = (cellValue) => {
    if (cellValue === 1) return 'bg-red-500';
    if (cellValue === 2) return 'bg-yellow-500';
    return 'bg-gray-700';
  };

  const status = winner
    ? winner === 'Draw'
      ? 'Draw!'
      : `Player ${winner} wins!`
    : `Current Player: ${currentPlayer === 1 ? 'Red' : 'Yellow'}`;

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
          <BreadcrumbTitle title="Connect Four" slug="c4" />
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
                Connect Four{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-col items-center gap-8">
                <div className="text-2xl font-medium mb-4">{status}</div>
                <div className="grid grid-cols-7 gap-1 p-2 bg-gray-800 rounded-lg">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleColumnClick(colIndex)}
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${getCellColor(cell)}`}
                        ></div>
                      </div>
                    )),
                  )}
                </div>
                <button
                  onClick={initializeBoard}
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

export default ConnectFourPage;
