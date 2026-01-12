import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  DiceSixIcon,
  TargetIcon,
  EyeIcon,
  ChartBarIcon,
  GearSixIcon,
} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';
import Seo from '../../components/Seo';
import {ToastContext} from '../../context/ToastContext';
import Dice from '../../components/Dice';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';
import CustomDropdown from '../../components/CustomDropdown';

const DiceRollerPage = () => {
  const appName = 'Dice Roller';

  const {addToast} = useContext(ToastContext);
  const [diceType, setDiceType] = useState(6);
  const [numDice, setNumDice] = useState(1);
  const [numDiceError, setNumDiceError] = useState(false);
  const [results, setResults] = useState([]);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (numDiceError) {
      addToast({
        message: 'INPUT_ERROR: Dice count must be between 1 and 1000.',
        type: 'error',
      });
      return;
    }

    setRolling(true);
    setResults([]);

    const newResults = [];
    for (let i = 0; i < numDice; i++) {
      newResults.push(Math.floor(Math.random() * diceType) + 1);
    }

    setTimeout(() => {
      setResults(newResults);
      setRolling(false);
      addToast({
        message: `SEQUENCE_GENERATED: Rolled ${newResults.length} units.`,
        type: 'success',
      });
    }, 1000);
  };

  const total = results.reduce((sum, current) => sum + current, 0);
  const average = results.length > 0 ? (total / results.length).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Dice Roller | Fezcodex"
        description="Roll various types of dice (d4, d6, d8, d10, d12, d20, d100) for your games and simulations in a brutalist workspace."
        keywords={['Fezcodex', 'dice roller', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100', 'games', 'rpg', 'brutalist']}
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
          <BreadcrumbTitle title={appName} slug="dice" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Randomized unit generation. Interface with the{' '}
                <span className="text-emerald-400 font-bold">probability matrix</span>{' '}
                to extract non-deterministic results.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Active_Units
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {numDice.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Matrix_Status
                </span>
                <span className={`text-3xl font-black ${rolling ? 'text-white' : 'text-emerald-500'}`}>
                  {rolling ? 'COLLAPSING' : 'STABLE'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <GearSixIcon weight="fill"/>
                Config_Interface
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      Unit_Type (dX)
                    </label>
                    <CustomDropdown
                      fullWidth
                      options={[
                        {label: 'D4_TETRA', value: 4},
                        {label: 'D6_HEXA', value: 6},
                        {label: 'D8_OCTA', value: 8},
                        {label: 'D10_DECA', value: 10},
                        {label: 'D12_DODECA', value: 12},
                        {label: 'D20_ICOSA', value: 20},
                        {label: 'D100_PERCENT', value: 100},
                      ]}
                      value={diceType}
                      onChange={setDiceType}
                      variant="brutalist"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      Unit_Quantity
                    </label>
                    <input
                      type="number"
                      value={numDice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNumDice(val);
                        setNumDiceError(val < 1 || val > 1000);
                      }}
                      className={`w-full bg-transparent border-b-2 py-2 text-xl font-mono text-white focus:outline-none transition-colors uppercase ${numDiceError ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500'}`}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <button
                  onClick={rollDice}
                  disabled={rolling || numDiceError}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <DiceSixIcon weight="bold" size={18}/>
                  {rolling ? 'COLLAPSING_WAVE...' : 'EXECUTE_ROLL'}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <ChartBarIcon size={20} weight="bold"/>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Metrics_Output
                </h4>
              </div>
              <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Aggregate_Sum</span>
                  <span className="text-emerald-400 font-bold">{total}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Mean_Value</span>
                  <span className="text-emerald-400 font-bold">{average}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3
              className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500"/>
              Observation_Deck
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale">
                <GenerativeArt seed={appName + results.length} className="w-full h-full" />
              </div>

              <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                  {rolling ? (
                    <motion.div
                      key="rolling"
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      className="flex flex-wrap gap-4 justify-center"
                    >
                      {Array.from({length: Math.min(numDice, 50)}).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <Dice type={diceType} isRolling={true} />
                        </div>
                      ))}
                      {numDice > 50 && <div className="text-gray-600 font-mono text-xs uppercase self-center">...Buffer_Overflow_Visual_Truncated</div>}
                    </motion.div>
                  ) : results.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      className="flex flex-wrap gap-4 justify-center max-h-[500px] overflow-y-auto custom-scrollbar p-4"
                    >
                      {results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{scale: 0, rotate: -180}}
                          animate={{scale: 1, rotate: 0}}
                          transition={{type: 'spring', delay: index * 0.01}}
                        >
                          <Dice value={result} type={diceType} isRolling={false} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-4">
                      <TargetIcon size={64} weight="thin" className="mx-auto text-white/5" />
                      <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Awaiting_Execution_Command...
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.5em] text-gray-500">
                <span>LOCAL_PROBABILITY_SYNC</span>
                <span>DR_v3.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRollerPage;