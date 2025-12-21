import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import Dice from '../../components/Dice';
import '../../styles/DiceRollerPage.css'; // Import the CSS for animations
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const DiceRollerPage = () => {
  useSeo({
    title: 'Dice Roller | Fezcodex',
    description:
      'Roll various types of dice (d4, d6, d8, d10, d12, d20, d100) for your games and simulations.',
    keywords: [
      'Fezcodex',
      'dice roller',
      'd4',
      'd6',
      'd8',
      'd10',
      'd12',
      'd20',
      'd100',
      'games',
      'rpg',
    ],
    ogTitle: 'Dice Roller | Fezcodex',
    ogDescription:
      'Roll various types of dice (d4, d6, d8, d10, d12, d20, d100) for your games and simulations.',
    ogImage: '/images/asset/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Dice Roller | Fezcodex',
    twitterDescription:
      'Roll various types of dice (d4, d6, d8, d10, d12, d20, d100) for your games and simulations.',
    twitterImage: '/images/asset/ogtitle.png',
  });

  const { addToast } = useToast();
  const [diceType, setDiceType] = useState(6); // d6, d10, d20, etc.
  const [numDice, setNumDice] = useState(1);
  const [numDiceError, setNumDiceError] = useState(false);
  const [results, setResults] = useState([]);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (numDiceError) {
      addToast({
        title: 'Invalid Input',
        message: 'Please enter a number of dice between 1 and 1000.',
        duration: 3000,
        type: 'error',
      });
      return;
    }

    setRolling(true);
    setResults([]); // Clear previous results

    const newResults = [];
    for (let i = 0; i < numDice; i++) {
      newResults.push(Math.floor(Math.random() * diceType) + 1);
    }

    setTimeout(() => {
      setResults(newResults);
      setRolling(false);
      addToast({
        title: 'Roll Complete',
        message: `Rolled: ${newResults.join(', ')}`,
        duration: 3000,
      });
    }, 1000); // Simulate rolling animation duration
  };

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
        <BreadcrumbTitle title="Dice Roller" slug="dice" />
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Dice Roller{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="diceType"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Dice Type (dX)
                  </label>
                  <CustomDropdown
                    options={[
                      { label: 'd4', value: 4 },
                      { label: 'd6', value: 6 },
                      { label: 'd8', value: 8 },
                      { label: 'd10', value: 10 },
                      { label: 'd12', value: 12 },
                      { label: 'd20', value: 20 },
                      { label: 'd100', value: 100 },
                    ]}
                    value={diceType}
                    onChange={setDiceType}
                    label="Dice Type"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="numDice"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Number of Dice
                  </label>
                  <input
                    type="number"
                    id="numDice"
                    className={`mt-1 block w-full p-2 border rounded-md bg-gray-700 text-white focus:ring-blue-500 ${numDiceError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'}`}
                    value={numDice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setNumDice(value);
                      if (value < 1 || value > 1000) {
                        setNumDiceError(true);
                      } else {
                        setNumDiceError(false);
                      }
                    }}
                    min="1"
                    max="1000"
                  />
                  {numDiceError && (
                    <p className="text-red-500 text-sm mt-1">
                      Number of dice must be between 1 and 1000.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={rollDice}
                disabled={rolling || numDiceError}
                className={`px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button ${rolling || numDiceError ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: cardStyle.color,
                  borderColor: cardStyle.borderColor,
                  border: '1px solid',
                }}
              >
                {rolling ? 'Rolling...' : 'Roll Dice'}
              </button>

              {results.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-md text-center">
                  <div className="dice-animation-container">
                    {results.map((result, index) => (
                      <Dice
                        key={index}
                        value={result}
                        type={diceType}
                        isRolling={false}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Total: {results.reduce((sum, current) => sum + current, 0)}
                    {results.length > 0 &&
                      ` | Average: ${(results.reduce((sum, current) => sum + current, 0) / results.length).toFixed(2)}`}
                  </p>
                </div>
              )}

              {rolling && (
                <div className="dice-animation-container mt-6">
                  {Array.from({ length: numDice }).map((_, index) => (
                    <Dice key={index} type={diceType} isRolling={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRollerPage;
