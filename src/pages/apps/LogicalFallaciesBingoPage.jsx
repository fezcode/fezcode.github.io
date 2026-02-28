import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  BrainIcon,
  CheckCircleIcon
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const FALLACIES = [
  { name: 'Ad Hominem', desc: 'Attacking the person instead of the argument.' },
  { name: 'Straw Man', desc: 'Misrepresenting an argument to make it easier to attack.' },
  { name: 'Slippery Slope', desc: 'Assuming a small step leads to a chain of extreme events.' },
  { name: 'False Dilemma', desc: 'Presenting only two options when more exist.' },
  { name: 'Post Hoc', desc: 'Assuming A caused B because A happened first.' },
  { name: 'Whataboutism', desc: 'Deflecting by bringing up a different issue (Tu Quoque).' },
  { name: 'Red Herring', desc: 'Introducing an irrelevant topic to distract.' },
  { name: 'Confirmation Bias', desc: 'Favoring info that confirms existing beliefs.' },
  { name: 'Sunk Cost', desc: 'Continuing because of past investment, not future value.' },
  { name: 'Dunning-Kruger', desc: 'Overestimating ability when knowledge is low.' },
  { name: 'No True Scotsman', desc: 'Changing the definition to exclude counter-examples.' },
  { name: 'Texas Sharpshooter', desc: 'Cherry-picking data to fit a pattern.' },
  { name: 'Moving Goalposts', desc: 'Changing the criteria for proof after evidence is met.' },
  { name: 'Begging the Question', desc: 'The premise assumes the conclusion is true.' },
  { name: 'Appeal to Authority', desc: 'Saying it is true because an "expert" said so.' },
  { name: 'Appeal to Emotion', desc: 'Manipulating emotions instead of using logic.' },
  { name: 'Bandwagon', desc: 'Saying it is true because many people believe it.' },
  { name: 'Appeal to Ignorance', desc: 'Assuming true because not proven false (or vice versa).' },
  { name: 'Burden of Proof', desc: 'Making a claim but expecting others to disprove it.' },
  { name: 'Personal Incredulity', desc: 'Saying it is false because it is hard to understand.' },
  { name: 'Ambiguity', desc: 'Using double meanings to mislead or misrepresent the truth.' },
  { name: 'Genetic Fallacy', desc: 'Judging something based on where it comes from.' },
  { name: 'Middle Ground', desc: 'Assuming a compromise between two extremes is the truth.' },
  { name: 'Anecdotal', desc: 'Using personal experience instead of sound evidence.' }
];

function LogicalFallaciesBingoPage() {
  const [grid, setGrid] = useState([]);
  const [marked, setMarked] = useState(new Set());
  const [bingo, setBingo] = useState(false);

  const shuffleAndGenerate = () => {
    const shuffled = [...FALLACIES].sort(() => Math.random() - 0.5);
    const newGrid = [];
    let index = 0;
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        newGrid.push({ name: 'FREE SPACE', desc: 'You are using the internet', isFree: true });
      } else {
        newGrid.push(shuffled[index]);
        index++;
      }
    }
    setGrid(newGrid);
    setMarked(new Set([12])); // Free space marked
    setBingo(false);
  };

  useEffect(() => {
    shuffleAndGenerate();
  }, []);

  const toggleMark = (index) => {
    if (index === 12) return; // Can't unmark free space
    const newMarked = new Set(marked);
    if (newMarked.has(index)) {
      newMarked.delete(index);
    } else {
      newMarked.add(index);
    }
    setMarked(newMarked);
    checkBingo(newMarked);
  };

  const checkBingo = (currentMarked) => {
    const winningLines = [
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // Rows
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // Cols
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20] // Diagonals
    ];

    const isBingo = winningLines.some(line => line.every(index => currentMarked.has(index)));
    setBingo(isBingo);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Logical Fallacies Bingo | Fezcodex"
        description="A playable bingo game based on common logical fallacies found on the internet."
        keywords={['bingo', 'logical fallacies', 'game', 'logic', 'internet arguments']}
      />
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <header className="mb-12">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Fallacy Bingo"
                slug="fb"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Surviving a family dinner or a Twitter thread? Keep track of the terrible arguments you encounter with this interactive bingo board. Need a refresher? Read the <Link to="/posts/encyclopedia-of-bad-arguments" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30 underline-offset-4">Encyclopedia of Bad Arguments</Link>.
              </p>
            </div>

            <button
              onClick={shuffleAndGenerate}
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
            >
              <ArrowsClockwiseIcon weight="bold" size={20} className={bingo ? "animate-spin" : ""} />
              <span>Shuffle Board</span>
            </button>
          </div>
        </header>

        {bingo && (
          <div className="mb-8 p-6 bg-emerald-500/20 border border-emerald-500/50 rounded-sm flex items-center gap-4 text-emerald-400 animate-pulse">
            <CheckCircleIcon size={32} weight="fill" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest font-mono">Bingo!</h2>
              <p className="text-sm opacity-80">You've successfully witnessed a complete collapse of logic.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 md:gap-4 w-full aspect-square max-w-4xl mx-auto">
          {grid.map((cell, index) => {
            const isMarked = marked.has(index);
            const isFree = cell.isFree;
            return (
              <button
                key={index}
                onClick={() => toggleMark(index)}
                className={`
                  relative flex flex-col items-center justify-center p-2 md:p-4 text-center border transition-all duration-300 rounded-sm
                  ${isMarked
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.05] text-gray-300'
                  }
                  ${isFree ? 'bg-white/5 border-white/20' : ''}
                `}
              >
                <span className="font-mono text-[9px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 leading-tight">
                  {cell.name}
                </span>
                {!isFree && (
                  <span className="hidden md:block text-[10px] opacity-60 leading-tight">
                    {cell.desc}
                  </span>
                )}
                {isMarked && !isFree && (
                  <div className="absolute top-2 right-2 text-emerald-500">
                    <CheckCircleIcon weight="fill" size={16} />
                  </div>
                )}
                {isFree && (
                  <BrainIcon className="mt-2 text-emerald-500/50" size={24} />
                )}
              </button>
            );
          })}
        </div>

        <footer className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Logic_Defense_Module_v1.0</span>
          <span className="text-gray-800">READY</span>
        </footer>
      </div>
    </div>
  );
}

export default LogicalFallaciesBingoPage;
