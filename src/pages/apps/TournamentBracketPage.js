import React, { useState, useEffect, useRef } from 'react';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';

function TournamentBracketPage() {
  usePageTitle('Tournament Bracket');
  const { addToast } = useToast();

  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [nameError, setNameError] = useState('');
  const newCompetitorInputRef = useRef(null);

  const addCompetitor = () => {
    const trimmedCompetitor = newCompetitor.trim();
    if (trimmedCompetitor && competitors.length < 64) {
      if (competitors.includes(trimmedCompetitor)) {
        setNameError('Competitor names must be unique.');
        addToast({ title: 'Error', message: 'Competitor names must be unique.', duration: 3000 });
        return;
      }
      setCompetitors([...competitors, trimmedCompetitor]);
      setNewCompetitor('');
      setNameError('');
      newCompetitorInputRef.current.focus();
    }
  };

  const handleNewCompetitorKeyDown = (e) => {
    if (e.key === 'Enter') {
      addCompetitor();
    }
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
    if (competitors.includes(trimmedName) && competitors[index] !== trimmedName) {
      addToast({ title: 'Error', message: 'Competitor names must be unique.', duration: 3000 });
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
        if(shuffledCompetitors[competitorIndex]) {
          match[0] = shuffledCompetitors[competitorIndex++];
        }
        if(shuffledCompetitors[competitorIndex]) {
          match[1] = shuffledCompetitors[competitorIndex++];
        }
      }
      initialRound.push(match);
    }

    const newBracket = [initialRound];
    for (let i = 1; i < rounds; i++) {
      const previousRound = newBracket[i - 1];
      const nextRound = [];
      for (let j = 0; j < previousRound.length / 2; j++) {
        nextRound.push([null, null]);
      }
      newBracket.push(nextRound);
    }

    setBracket(newBracket);
    handleByes(newBracket);
  };

  const [champion, setChampion] = useState(null);

  const advanceWinner = (winner, roundIndex, matchIndex) => {
    if (!bracket || !winner) return;

    setAdvancedMatches(prev => ({ ...prev, [`${roundIndex}-${matchIndex}`]: winner }));

    if (roundIndex === bracket.length - 1) {
      setChampion(winner);
      return;
    }

    const newBracket = JSON.parse(JSON.stringify(bracket));

    if (roundIndex + 1 < newBracket.length) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      if (matchIndex % 2 === 0) {
        newBracket[nextRoundIndex][nextMatchIndex][0] = winner;
      } else {
        newBracket[nextRoundIndex][nextMatchIndex][1] = winner;
      }
      setBracket(newBracket);
    }
  };

  const resetScores = () => {
    setScores({});
    setChampion(null);
    setAdvancedMatches({});
    generateBracket(competitors);
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
    if (!newScores[roundIndex]) {
      newScores[roundIndex] = {};
    }
    if (!newScores[roundIndex][matchIndex]) {
      newScores[roundIndex][matchIndex] = [null, null];
    }
    newScores[roundIndex][matchIndex][competitorIndex] = score.replace(/\D/g, '');
    setScores(newScores);
  };

  const handleByes = (currentBracket) => {
    if (!currentBracket) return;

    const newBracket = JSON.parse(JSON.stringify(currentBracket));
    let changed = false;

    newBracket[0].forEach((match, matchIndex) => {
      if (match[0] && match[1] === null) {
        const winner = match[0];
        if (0 + 1 < newBracket.length) {
          const nextRoundIndex = 0 + 1;
          const nextMatchIndex = Math.floor(matchIndex / 2);
          if (matchIndex % 2 === 0) {
            newBracket[nextRoundIndex][nextMatchIndex][0] = winner;
          } else {
            newBracket[nextRoundIndex][nextMatchIndex][1] = winner;
          }
          changed = true;
        }
      }
    });

    if (changed) {
      setBracket(newBracket);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-gray-900 text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Tournament Bracket
        </h1>

        {!tournamentStarted ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Add Competitors</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  onKeyDown={handleNewCompetitorKeyDown}
                  placeholder="Enter competitor name"
                  className="bg-gray-800 text-white p-2 rounded-lg flex-grow"
                  ref={newCompetitorInputRef}
                />
                <button
                  onClick={addCompetitor}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={competitors.length >= 64}
                >
                  Add
                </button>
              </div>
              {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
              {competitors.length >= 64 && <p className="text-red-500 mt-2">Maximum of 64 competitors reached.</p>}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Competitors ({competitors.length})</h2>
              <ul className="space-y-2">
                {competitors.map((competitor, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="bg-gray-700 text-white p-1 rounded-lg flex-grow"
                      />
                    ) : (
                      <span>{competitor}</span>
                    )}
                    <div className="flex gap-2">
                      {editingIndex === index ? (
                        <button onClick={() => saveEdit(index)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => startEditing(index, competitor)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                          Edit
                        </button>
                      )}
                      <button onClick={() => deleteCompetitor(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={startTournament}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={competitors.length < 2}
                >
                Start Tournament
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-4">Bracket</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {bracket && bracket.map((round, roundIndex) => (
                <div key={roundIndex} className="flex flex-col space-y-4">
                  <h3 className="text-xl font-bold">Round {roundIndex + 1}</h3>
                  {round.map((match, matchIndex) => (
                    <div key={matchIndex} className="bg-gray-800 p-4 rounded-lg w-72">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="bg-gray-700 text-white p-1 rounded-lg w-16"
                            value={scores[roundIndex]?.[matchIndex]?.[0] || ''}
                            onChange={(e) => handleScoreChange(roundIndex, matchIndex, 0, e.target.value)}
                            disabled={!match[0] || !match[1]}
                          />
                          <span>{match[0] || 'TBD'}</span>
                        </div>
                        <span>vs</span>
                        <div className="flex items-center gap-2">
                          <span>{match[1] || (roundIndex === 0 ? 'Bye' : 'TBD')}</span>
                          <input
                            type="number"
                            className="bg-gray-700 text-white p-1 rounded-lg w-16"
                            value={scores[roundIndex]?.[matchIndex]?.[1] || ''}
                            onChange={(e) => handleScoreChange(roundIndex, matchIndex, 1, e.target.value)}
                            disabled={!match[0] || !match[1]}
                          />
                        </div>
                      </div>
                      {match[0] && match[1] && (
                        <button
                          onClick={() => {
                            const score1 = scores[roundIndex]?.[matchIndex]?.[0];
                            const score2 = scores[roundIndex]?.[matchIndex]?.[1];
                            if (score1 === undefined || score2 === undefined || score1 === '' || score2 === '' || score1 === score2) return;
                            const winner = score1 > score2 ? match[0] : match[1];
                            advanceWinner(winner, roundIndex, matchIndex);
                          }}
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded w-full disabled:bg-gray-600"
                          disabled={advancedMatches[`${roundIndex}-${matchIndex}`] || scores[roundIndex]?.[matchIndex]?.[0] === undefined || scores[roundIndex]?.[matchIndex]?.[1] === undefined || scores[roundIndex]?.[matchIndex]?.[0] === '' || scores[roundIndex]?.[matchIndex]?.[1] === '' || scores[roundIndex]?.[matchIndex]?.[0] === scores[roundIndex]?.[matchIndex]?.[1]}
                        >
                          {advancedMatches[`${roundIndex}-${matchIndex}`] ? `${advancedMatches[`${roundIndex}-${matchIndex}`]} advanced!` : (roundIndex === bracket.length - 1 ? 'Set Champion' : 'Set Winner')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {champion && (
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold">Champion!</h2>
                <p className="text-xl font-bold text-yellow-400">{champion}</p>
              </div>
            )}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={resetScores}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset Scores
              </button>
              <button
                onClick={resetTournament}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset Tournament
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentBracketPage;
