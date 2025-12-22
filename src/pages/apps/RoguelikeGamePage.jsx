import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon } from '@phosphor-icons/react'; // Using CubeIcon as a placeholder icon for now
import useSeo from '../../hooks/useSeo';

const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;
const TILE_FLOOR = '.';
const TILE_WALL = '#';
const ENTITY_PLAYER = '@';
const ENTITY_ENEMY = 'E';
const ENTITY_EXIT = 'X';

const POSSIBLE_MOVES = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

function RoguelikeGamePage() {
  useSeo({
    ogTitle: 'Roguelike Game | Fezcodex',
    ogDescription:
      'Explore a procedurally generated dungeon in this browser-based roguelike.',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Roguelike Game | Fezcodex',
    twitterDescription:
      'Explore a procedurally generated dungeon in this browser-based roguelike.',
  });

  const [gameMap, setGameMap] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [enemyPositions, setEnemyPositions] = useState([]);
  const [exitPosition, setExitPosition] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

  // Utility to get a random empty position
  const getRandomEmptyPosition = useCallback((map) => {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
    } while (map[y][x] !== TILE_FLOOR);
    return { x, y };
  }, []);

  // Map Generation
  const generateMap = useCallback(() => {
    // Initialize map with walls
    let newMap = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(TILE_WALL));

    // Simple room generation
    const roomCount = 5 + Math.floor(Math.random() * 5); // 5-9 rooms
    for (let i = 0; i < roomCount; i++) {
      const roomW = 5 + Math.floor(Math.random() * 5); // 5-9 width
      const roomH = 3 + Math.floor(Math.random() * 5); // 3-7 height
      const roomX = 1 + Math.floor(Math.random() * (MAP_WIDTH - roomW - 2));
      const roomY = 1 + Math.floor(Math.random() * (MAP_HEIGHT - roomH - 2));

      for (let y = roomY; y < roomY + roomH; y++) {
        for (let x = roomX; x < roomX + roomW; x++) {
          newMap[y][x] = TILE_FLOOR;
        }
      }
    }

    // Place Player
    const playerPos = getRandomEmptyPosition(newMap);
    setPlayerPosition(playerPos);

    // Place Exit
    let exitPos;
    do {
      exitPos = getRandomEmptyPosition(newMap);
    } while (exitPos.x === playerPos.x && exitPos.y === playerPos.y);
    setExitPosition(exitPos);

    // Place Enemies
    const numEnemies = 3 + Math.floor(Math.random() * 3); // 3-5 enemies
    const newEnemyPositions = [];
    for (let i = 0; i < numEnemies; i++) {
      let enemyPos;
      let isOccupied;
      do {
        enemyPos = getRandomEmptyPosition(newMap);
        isOccupied = false;
        for (let j = 0; j < newEnemyPositions.length; j++) {
          if (
            newEnemyPositions[j].x === enemyPos.x &&
            newEnemyPositions[j].y === enemyPos.y
          ) {
            isOccupied = true;
            break;
          }
        }
      } while (
        (enemyPos.x === playerPos.x && enemyPos.y === playerPos.y) ||
        (enemyPos.x === exitPos.x && enemyPos.y === exitPos.y) ||
        isOccupied
      );
      newEnemyPositions.push(enemyPos);
    }
    setEnemyPositions(newEnemyPositions);

    setGameMap(newMap);
    setGameStatus('playing');
  }, [getRandomEmptyPosition]);

  useEffect(() => {
    generateMap();
  }, [generateMap]);

  // Enemy AI - Simple random movement (will be handled by player move)
  const moveEnemies = useCallback(
    (currentPlayerPos) => {
      let collisionOccurred = false;
      const nextEnemyPositions = [];

      for (let i = 0; i < enemyPositions.length; i++) {
        const enemy = enemyPositions[i];
        const randomMove =
          POSSIBLE_MOVES[Math.floor(Math.random() * POSSIBLE_MOVES.length)];

        const newX = enemy.x + randomMove.dx;
        const newY = enemy.y + randomMove.dy;

        // Check boundaries and walls
        if (
          newX >= 0 &&
          newX < MAP_WIDTH &&
          newY >= 0 &&
          newY < MAP_HEIGHT &&
          gameMap[newY][newX] !== TILE_WALL
        ) {
          if (newX === currentPlayerPos.x && newY === currentPlayerPos.y) {
            collisionOccurred = true;
          }
          nextEnemyPositions.push({ x: newX, y: newY });
        } else {
          nextEnemyPositions.push(enemy); // Stay if cannot move
        }
      }

      if (collisionOccurred) {
        setGameStatus('lost');
      }
      setEnemyPositions(nextEnemyPositions);
    },
    [gameMap, setGameStatus, enemyPositions],
  );

  // Player Movement
  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameStatus !== 'playing') return;

      const newX = playerPosition.x + dx;
      const newY = playerPosition.y + dy;

      // Check boundaries
      if (
        newX < 0 ||
        newX >= MAP_WIDTH ||
        newY < 0 ||
        newY >= MAP_HEIGHT ||
        gameMap[newY][newX] === TILE_WALL
      ) {
        return; // Can't move through walls or out of bounds
      }

      const nextPlayerPos = { x: newX, y: newY };
      setPlayerPosition(nextPlayerPos);

      // Check for exit
      if (newX === exitPosition.x && newY === exitPosition.y) {
        setGameStatus('won');
        return;
      }

      // Check for enemy collision immediately after player moves
      for (const enemy of enemyPositions) {
        if (newX === enemy.x && newY === enemy.y) {
          setGameStatus('lost');
          return;
        }
      }

      // If no win/loss condition, then enemies move
      moveEnemies(nextPlayerPos);
    },
    [
      playerPosition,
      gameMap,
      exitPosition,
      enemyPositions,
      gameStatus,
      moveEnemies,
    ],
  );

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
        case 'W':
          movePlayer(0, -1);
          break;
        case 's':
        case 'S':
          movePlayer(0, 1);
          break;
        case 'a':
        case 'A':
          movePlayer(-1, 0);
          break;
        case 'd':
        case 'D':
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Render the game map
  const renderMap = () => {
    if (!gameMap.length) return null;

    return (
      <div
        className="grid gap-px bg-gray-700 p-px"
        style={{
          gridTemplateColumns: `repeat(${MAP_WIDTH}, minmax(0, 1fr))`,
          width: `${MAP_WIDTH * 24}px`, // Assuming 24px per tile
        }}
      >
        {gameMap.map((row, y) =>
          row.map((tile, x) => {
            let content = tile;
            let className =
              'flex items-center justify-center w-6 h-6 text-xs font-mono';

            if (
              playerPosition &&
              playerPosition.x === x &&
              playerPosition.y === y
            ) {
              content = ENTITY_PLAYER;
              className += ' bg-blue-500 text-white';
            } else if (
              exitPosition &&
              exitPosition.x === x &&
              exitPosition.y === y
            ) {
              content = ENTITY_EXIT;
              className += ' bg-green-500 text-white';
            } else if (enemyPositions.some((ep) => ep.x === x && ep.y === y)) {
              content = ENTITY_ENEMY;
              className += ' bg-red-500 text-white';
            } else if (tile === TILE_WALL) {
              className += ' bg-gray-800 text-gray-600';
            } else {
              className += ' bg-gray-900 text-gray-500';
            }

            return (
              <div key={`${x}-${y}`} className={className}>
                {content}
              </div>
            );
          }),
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-300">
      <Link
        to="/apps"
        className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
      >
        <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
        Back to Apps
      </Link>
      <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl mb-4 flex items-center">
        <CubeIcon size={48} className="mr-2" /> Roguelike Adventure
      </h1>
      <p className="text-lg text-gray-400 mb-6 text-center">
        Navigate the maze, avoid enemies, and find the exit!
      </p>

      {gameStatus === 'won' && (
        <div className="text-green-400 text-2xl font-bold mb-4">
          You Won! 🎉
          <button
            onClick={generateMap}
            className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-lg"
          >
            Play Again
          </button>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="text-red-400 text-2xl font-bold mb-4">
          Game Over! 💀
          <button
            onClick={generateMap}
            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-lg"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="border-2 border-gray-600 p-2 relative">{renderMap()}</div>

      <div className="mt-6 text-center">
        <p>Use WASD Keys to Move</p>
        <p className="text-sm text-gray-500">
          <span className="text-blue-400">@</span>: Player,{' '}
          <span className="text-red-400">E</span>: Enemy,{' '}
          <span className="text-green-400">X</span>: Exit
        </p>
      </div>
    </div>
  );
}

export default RoguelikeGamePage;
