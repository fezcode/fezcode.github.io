import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrophyIcon,
  PlusIcon,
  TrashIcon,
  PencilSimpleIcon,
  ArrowCounterClockwiseIcon,
  PlayIcon,
  RowsIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function TournamentBracketPage() {
  const appName = 'Tournament Bracket';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Create and manage single-elimination tournament brackets.',
    keywords: [
      'Fezcodex',
      'tournament bracket',
      'bracket generator',
      'single elimination',
      'tournament manager',
    ],
  });

  const { addToast } = useToast();

  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const newCompetitorInputRef = useRef(null);

  const addCompetitor = () => {
    const trimmedCompetitor = newCompetitor.trim();
    if (trimmedCompetitor) {
      if (trimmedCompetitor.length > 5) {
        addToast({
          title: 'Error',
          message: 'Name cannot exceed 5 characters.',
          type: 'error'
        });
        return;
      }
      if (competitors.includes(trimmedCompetitor)) {
        addToast({
          title: 'Error',
          message: 'Names must be unique.',
          type: 'error'
        });
        return;
      }
      if (competitors.length < 64) {
        setCompetitors([...competitors, trimmedCompetitor]);
        setNewCompetitor('');
        newCompetitorInputRef.current.focus();
      } else {
        addToast({
          title: 'Limit Reached',
          message: 'Maximum of 64 competitors reached.',
          type: 'error'
        });
      }
    }
  };

  const handleNewCompetitorKeyDown = (e) => {
    if (e.key === 'Enter') addCompetitor();
  };

  const deleteCompetitor = (index) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const startEditing = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEdit = (index) => {
    const trimmedName = editingText.trim();
    if (trimmedName.length > 5) {
      addToast({ title: 'Error', message: 'Name too long.', type: 'error' });
      return;
    }
    if (competitors.includes(trimmedName) && competitors[index] !== trimmedName) {
      addToast({ title: 'Error', message: 'Name must be unique.', type: 'error' });
      return;
    }
    const updatedCompetitors = [...competitors];
    updatedCompetitors[index] = trimmedName;
    setCompetitors(updatedCompetitors);
    setEditingIndex(null);
    setEditingText('');
  };

  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [bracket, setBracket] = useState(null);
  const [advancedMatches, setAdvancedMatches] = useState({});
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (!bracket) return;

    let foundCurrent = false;
    for (let r = 0; r < bracket.length; r++) {
      for (let m = 0; m < bracket[r].length; m++) {
        if (!advancedMatches[`${r}-${m}`]) {
          setCurrentRoundIndex(r);
          setCurrentMatchIndex(m);
          foundCurrent = true;
          return;
        }
      }
    }
    if (!foundCurrent) {
      setCurrentRoundIndex(-1);
      setCurrentMatchIndex(-1);
    }
  }, [bracket, advancedMatches]);

  const startTournament = () => {
    setTournamentStarted(true);
    generateBracket(competitors);
  };

  const generateBracket = (competitors) => {
    const numCompetitors = competitors.length;
    const rounds = Math.ceil(Math.log2(numCompetitors));
    const bracketSize = Math.pow(2, rounds);
    const byes = bracketSize - numCompetitors;

    let initialRound = [];
    let competitorIndex = 0;
    const shuffledCompetitors = [...competitors].sort(() => Math.random() - 0.5);

    for (let i = 0; i < bracketSize / 2; i++) {
      const match = [null, null];
      if (i < byes) {
        match[0] = shuffledCompetitors[competitorIndex++];
      } else {
        if (shuffledCompetitors[competitorIndex]) match[0] = shuffledCompetitors[competitorIndex++];
        if (shuffledCompetitors[competitorIndex]) match[1] = shuffledCompetitors[competitorIndex++];
      }
      initialRound.push(match);
    }

    const newBracket = [initialRound];
    for (let i = 1; i < rounds; i++) {
      const previousRound = newBracket[i - 1];
      const nextRound = [];
      for (let j = 0; j < previousRound.length / 2; j++) nextRound.push([null, null]);
      newBracket.push(nextRound);
    }

    setBracket(newBracket);
    handleByes(newBracket, {});
  };

  const [champion, setChampion] = useState(null);

  const advanceWinner = (winner, loser, roundIndex, matchIndex) => {
    if (!bracket || !winner) return;

    setAdvancedMatches((prev) => ({
      ...prev,
      [`${roundIndex}-${matchIndex}`]: { winner, loser },
    }));

    if (roundIndex === bracket.length - 1) {
      setChampion(winner);
      addToast({ title: 'Champion Crowned', message: `${winner} has won the tournament!`, type: 'gold' });
      return;
    }

    const newBracket = JSON.parse(JSON.stringify(bracket));
    const nextRoundIndex = roundIndex + 1;
    const nextMatchIndex = Math.floor(matchIndex / 2);
    if (matchIndex % 2 === 0) {
      newBracket[nextRoundIndex][nextMatchIndex][0] = winner;
    } else {
      newBracket[nextRoundIndex][nextMatchIndex][1] = winner;
    }
    setBracket(newBracket);
  };

  const resetTournament = () => {
    setTournamentStarted(false);
    setBracket(null);
    setChampion(null);
    setScores({});
    setCompetitors([]);
    setAdvancedMatches({});
  };

  const [scores, setScores] = useState({});

  const handleScoreChange = (roundIndex, matchIndex, competitorIndex, score) => {
    const newScores = { ...scores };
    if (!newScores[roundIndex]) newScores[roundIndex] = {};
    if (!newScores[roundIndex][matchIndex]) newScores[roundIndex][matchIndex] = [null, null];
    newScores[roundIndex][matchIndex][competitorIndex] = score.replace(/\D/g, '');
    setScores(newScores);
  };

  const handleByes = (currentBracket, initialAdvancedMatches = {}) => {
    if (!currentBracket) return;
    const newBracket = JSON.parse(JSON.stringify(currentBracket));
    let changed = false;
    let updatedAdvancedMatches = { ...initialAdvancedMatches };

    newBracket[0].forEach((match, matchIndex) => {
      if (match[0] && match[1] === null) {
        const winner = match[0];
        const loser = 'Bye';
        updatedAdvancedMatches[`0-${matchIndex}`] = { winner, loser };
        if (newBracket.length > 1) {
          const nextMatchIndex = Math.floor(matchIndex / 2);
          if (matchIndex % 2 === 0) newBracket[1][nextMatchIndex][0] = winner;
          else newBracket[1][nextMatchIndex][1] = winner;
          changed = true;
        }
      }
    });

    if (changed) setBracket(newBracket);
    setAdvancedMatches(updatedAdvancedMatches);
  };

  const [compactLayout, setCompactLayout] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Tournament Bracket" slug="tb" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Create and manage single-elimination tournament brackets. Add competitors, track scores, and advance winners.
              </p>
            </div>
          </div>
        </header>

        <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
            <GenerativeArt seed={appName + tournamentStarted} className="w-full h-full" />
          </div>

          <div className="relative z-10">
            {!tournamentStarted ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Add Competitors</h2>
                    <div className="flex gap-4">
                      <input
                        ref={newCompetitorInputRef}
                        type="text"
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={handleNewCompetitorKeyDown}
                        placeholder="Name (max 5 chars)"
                        className="flex-1 bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-emerald-500 outline-none transition-colors"
                      />
                      <button
                        onClick={addCompetitor}
                        disabled={competitors.length >= 64}
                        className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all disabled:opacity-20"
                      >
                        <PlusIcon weight="bold" size={20} />
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      {competitors.length} / 64 competitors added
                    </p>
                  </div>

                  {competitors.length >= 2 && (
                    <button
                      onClick={startTournament}
                      className="w-full py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm rounded-sm flex items-center justify-center gap-3"
                    >
                      <PlayIcon weight="fill" size={24} />
                      Start Tournament
                    </button>
                  )}

                  <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
                    <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4">How it works</h3>
                    <ul className="space-y-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
                      <li>• Single-elimination format</li>
                      <li>• Automatic BYE calculation</li>
                      <li>• Random seeding</li>
                      <li>• Max 64 participants</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Participants</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto custom-scrollbar-terminal pr-4">
                    {competitors.map((competitor, index) => (
                      <div key={index} className="group/item flex items-center justify-between bg-white/5 border border-white/5 p-3 hover:border-white/20 transition-all">
                        {editingIndex === index ? (
                          <input
                            autoFocus
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={() => saveEdit(index)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(index)}
                            className="bg-black text-white p-1 w-full text-xs font-mono outline-none"
                          />
                        ) : (
                          <>
                            <span className="text-xs font-mono uppercase truncate mr-2">{competitor}</span>
                            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button onClick={() => startEditing(index, competitor)} className="p-1 hover:text-emerald-500"><PencilSimpleIcon size={14} /></button>
                              <button onClick={() => deleteCompetitor(index)} className="p-1 hover:text-red-500"><TrashIcon size={14} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {competitors.length === 0 && (
                      <div className="col-span-full py-12 border border-dashed border-white/10 text-center">
                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">No participants added</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic">Live Bracket</h2>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setCompactLayout(!compactLayout)}
                      className={`flex items-center gap-2 px-4 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all ${compactLayout ? 'bg-white text-black border-white' : 'text-gray-500 border-white/10 hover:text-white'}`}
                    >
                      {compactLayout ? <SquaresFourIcon weight="bold" /> : <RowsIcon weight="bold" />}
                      {compactLayout ? 'Compact' : 'Standard'}
                    </button>
                    <button onClick={resetTournament} className="text-xs font-mono text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                      <ArrowCounterClockwiseIcon weight="bold" /> Reset All
                    </button>
                  </div>
                </div>

                <div className="flex space-x-12 overflow-x-auto pb-8 custom-scrollbar-terminal pr-4">
                  {bracket && bracket.map((round, roundIndex) => (
                    <div key={roundIndex} className="flex flex-col gap-8 min-w-[280px]">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <span className="text-[10px] font-mono text-emerald-500 font-black">#{roundIndex + 1}</span>
                        <h3 className="text-sm font-black uppercase tracking-widest">Round {roundIndex + 1}</h3>
                      </div>

                      <div className="flex flex-col justify-around flex-1 gap-4">
                        {round.map((match, matchIndex) => {
                          const matchId = `${roundIndex}-${matchIndex}`;
                          const isCurrent = roundIndex === currentRoundIndex && matchIndex === currentMatchIndex;
                          const result = advancedMatches[matchId];

                          return (
                            <div
                              key={matchIndex}
                              className={`relative p-4 border transition-all duration-500 ${isCurrent ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/10 bg-white/[0.01]'}`}
                            >
                              <div className="space-y-3">
                                {[0, 1].map((idx) => {
                                  const name = match[idx];
                                  const isWinner = result?.winner === name && name !== null;
                                  const isLoser = result?.loser === name && name !== null;
                                  const isBye = idx === 1 && match[0] && match[1] === null && roundIndex === 0;

                                  return (
                                    <div key={idx} className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <input
                                          type="number"
                                          placeholder="0"
                                          value={scores[roundIndex]?.[matchIndex]?.[idx] || ''}
                                          onChange={(e) => handleScoreChange(roundIndex, matchIndex, idx, e.target.value)}
                                          disabled={!match[0] || !match[1] || !!result}
                                          className="w-10 bg-black/40 border border-white/5 text-[10px] font-mono p-1 text-center focus:border-emerald-500 outline-none disabled:opacity-20"
                                        />
                                        <span className={`text-xs font-mono uppercase truncate ${isWinner ? 'text-emerald-400 font-black' : isLoser ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                          {isBye ? 'BYE' : (name || 'TBD')}
                                        </span>
                                      </div>
                                      {isWinner && <TrophyIcon weight="fill" size={14} className="text-amber-400 shrink-0" />}
                                    </div>
                                  );
                                })}
                              </div>

                              {match[0] && match[1] && !result && (
                                <button
                                  onClick={() => {
                                    const s1 = parseInt(scores[roundIndex]?.[matchIndex]?.[0]);
                                    const s2 = parseInt(scores[roundIndex]?.[matchIndex]?.[1]);
                                    if (isNaN(s1) || isNaN(s2) || s1 === s2) {
                                      addToast({ title: 'Invalid Score', message: 'Enter unique scores for both.', type: 'error' });
                                      return;
                                    }
                                    const winner = s1 > s2 ? match[0] : match[1];
                                    const loser = s1 > s2 ? match[1] : match[0];
                                    advanceWinner(winner, loser, roundIndex, matchIndex);
                                  }}
                                  className="mt-4 w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                                >
                                  Advance Winner
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {champion && (
                    <div className="flex flex-col items-center justify-center min-w-[300px] border-l border-white/10 pl-12">
                      <div className="relative p-12 bg-emerald-500 text-black text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <TrophyIcon weight="fill" size={64} className="mx-auto" />
                        <div>
                          <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] opacity-60">Champion</p>
                          <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-tight">{champion}</h2>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex Tournament Tracker</span>
          <span className="text-gray-800">Status // {tournamentStarted ? 'ACTIVE' : 'READY'}</span>
        </footer>
      </div>
    </div>
  );
}

export default TournamentBracketPage;
