import React, {useState, useEffect, useCallback, useContext} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowCounterClockwiseIcon,
  CircleIcon,
  TrophyIcon,
  UsersIcon,
  GridNineIcon,
} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';
import {ToastContext} from '../../context/ToastContext';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const ConnectFourPage = () => {
  const appName = 'Connect Four';

  const {addToast} = useContext(ToastContext);

  const [board, setBoard] = useState(() =>
    Array(6).fill(null).map(() => Array(7).fill(0))
  ); // 6 rows, 7 columns
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1 (Emerald), 2 for Player 2 (White)
  const [winner, setWinner] = useState(null); // null, 1, 2, or 'Draw'
  const [winningCells, setWinningCells] = useState([]);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(6)
      .fill(null)
      .map(() => Array(7).fill(0));
    setBoard(newBoard);
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const checkWin = (currentBoard, row, col, player) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    for (const [dr, dc] of directions) {
      let count = 1;
      let cells = [[row, col]];

      // Check one direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (
          r >= 0 &&
          r < 6 &&
          c >= 0 &&
          c < 7 &&
          currentBoard[r][c] === player
        ) {
          count++;
          cells.push([r, c]);
        } else {
          break;
        }
      }

      // Check opposite direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (
          r >= 0 &&
          r < 6 &&
          c >= 0 &&
          c < 7 &&
          currentBoard[r][c] === player
        ) {
          count++;
          cells.push([r, c]);
        } else {
          break;
        }
      }

      if (count >= 4) {
        return cells;
      }
    }
    return null;
  };

  const handleColumnClick = (colIndex) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);
    let rowIndex = -1;

    for (let r = 5; r >= 0; r--) {
      if (newBoard[r][colIndex] === 0) {
        newBoard[r][colIndex] = currentPlayer;
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) {
      addToast({
        message: 'Column is full.',
        type: 'error',
      });
      return;
    }

    setBoard(newBoard);

    const winResult = checkWin(newBoard, rowIndex, colIndex, currentPlayer);
    if (winResult) {
      setWinner(currentPlayer);
      setWinningCells(winResult);
      addToast({
        message: `PLAYER_${currentPlayer === 1 ? 'EMERALD' : 'WHITE'} WINS!`,
        type: 'success',
      });
    } else if (newBoard.every((row) => row.every((cell) => cell !== 0))) {
      setWinner('Draw');
      addToast({message: "IT'S A DRAW!", type: 'warning'});
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Connect Four | Fezcodex"
        description="Play the classic Connect Four game in your browser."
        keywords={['Connect Four', 'game', 'React', 'strategy', 'brutalist']}
      />
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
          <BreadcrumbTitle title={appName} slug="c4" variant={'brutalist'}/>
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Classic strategy board game. Align four segments to{' '}
                <span className="text-emerald-400 font-bold">dominate</span>.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Active_Player
                </span>
                <span className={`text-3xl font-black ${currentPlayer === 1 ? 'text-emerald-500' : 'text-white'}`}>
                  {currentPlayer === 1 ? 'EMERALD' : 'WHITE'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Game_Status
                </span>
                <span
                  className={`text-3xl font-black ${winner ? 'text-emerald-500' : 'text-white'}`}
                >
                  {winner ? (winner === 'Draw' ? 'DRAW' : 'GAME_OVER') : 'PLAYING'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div
              className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <UsersIcon weight="fill"/>
                Player_Info
              </h3>

              <div className="space-y-6 relative z-10">
                <div
                  className={`p-4 border ${currentPlayer === 1 && !winner ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5'} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Player 01</span>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"/>
                  </div>
                  <div className="text-xl font-black font-mono">EMERALD_CORP</div>
                </div>

                <div
                  className={`p-4 border ${currentPlayer === 2 && !winner ? 'border-white bg-white/10' : 'border-white/5'} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Player 02</span>
                    <div className="w-3 h-3 rounded-full bg-white"/>
                  </div>
                  <div className="text-xl font-black font-mono">WHITE_NULL</div>
                </div>
              </div>

              {winner && (
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  className="mt-8 p-6 bg-emerald-500 text-black text-center rounded-sm relative z-10"
                >
                  <TrophyIcon size={32} weight="fill" className="mx-auto mb-2"/>
                  <div className="font-black uppercase tracking-[0.2em] text-sm">
                    {winner === 'Draw' ? 'Match Draw' : `Winner: Player ${winner === 1 ? '01' : '02'}`}
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={initializeBoard}
              className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <ArrowCounterClockwiseIcon weight="bold" size={16}/>
              Reset_System_State
            </button>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <GridNineIcon size={20} weight="bold"/>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Game_Tactics
                </h4>
              </div>
              <ul className="space-y-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
                <li className="flex gap-3">
                  <span className="text-emerald-500">01</span> Connect four pieces in any direction.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">02</span> Block your opponent's progression.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">03</span> Gravity applies: pieces fall to the lowest spot.
                </li>
              </ul>
            </div>
          </div>

          {/* Board Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3
              className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <CircleIcon weight="fill" className="text-emerald-500"/>
              Tactical_Grid_Overlay
            </h3>

                        <div className="bg-white/[0.01] border border-white/10 p-4 md:p-8 rounded-sm overflow-x-auto flex justify-center">

                          <div className="grid grid-cols-7 gap-2 md:gap-4 w-full max-w-4xl">

                            {board[0].map((_, colIdx) => (

                              <button

                                key={`col-head-${colIdx}`}

                                onClick={() => handleColumnClick(colIdx)}

                                disabled={!!winner}

                                className="h-10 md:h-16 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-center group/btn"

                              >

                                <div className={`w-1.5 h-6 md:h-10 transition-all ${currentPlayer === 1 ? 'bg-emerald-500/20 group-hover/btn:bg-emerald-500' : 'bg-white/20 group-hover/btn:bg-white'}`} />

                              </button>

                            ))}

                            {board.map((row, rowIndex) =>

                              row.map((cell, colIndex) => {
                                const isWinningCell = winningCells.some(([r, c]) => r === rowIndex && c === colIndex);

                                return (

                                  <div

                                    key={`${rowIndex}-${colIndex}`}

                                    className={`

                                      aspect-square w-full border flex items-center justify-center transition-all duration-500 relative

                                      ${isWinningCell ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/5 bg-black/40'}

                                    `}

                                  >

                                    <AnimatePresence>

                                      {cell !== 0 && (

                                        <motion.div

                                          initial={{ y: -300, opacity: 0 }}

                                          animate={{ y: 0, opacity: 1 }}

                                          transition={{ type: 'spring', damping: 20, stiffness: 100 }}

                                          className={`

                                            w-4/5 h-4/5 rounded-full

                                            ${cell === 1 ? 'bg-emerald-500' : 'bg-white'}

                                            ${isWinningCell ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}

                                          `}

                                        />

                                      )}

                                    </AnimatePresence>

                                  </div>

                                );
                              }),

                            )}

                          </div>

                        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectFourPage;
