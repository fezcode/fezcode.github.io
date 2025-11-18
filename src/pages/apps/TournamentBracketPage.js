import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import colors from '../../config/colors';

function TournamentBracketPage() {
  useSeo({
    title: 'Tournament Bracket Generator | Fezcodex',
    description:
      'Generate and manage single-elimination tournament brackets with ease. Add competitors, track scores, and advance winners.',
    keywords: [
      'Fezcodex',
      'tournament bracket',
      'bracket generator',
      'single elimination',
      'tournament manager',
    ],
    ogTitle: 'Tournament Bracket Generator | Fezcodex',
    ogDescription:
      'Generate and manage single-elimination tournament brackets with ease. Add competitors, track scores, and advance winners.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Tournament Bracket Generator | Fezcodex',
    twitterDescription:
      'Generate and manage single-elimination tournament brackets with ease. Add competitors, track scores, and advance winners.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  // const detailTextColor = colors['app-light'];

  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newCompetitorCharLimitError, setNewCompetitorCharLimitError] =
    useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [nameError, setNameError] = useState('');
  const newCompetitorInputRef = useRef(null);

  const addCompetitor = () => {
    const trimmedCompetitor = newCompetitor.trim();
    if (trimmedCompetitor) {
      if (trimmedCompetitor.length > 5) {
        addToast({
          title: 'Error',
          message: 'Competitor name cannot exceed 5 characters.',
          duration: 3000,
        });
        return;
      }
      if (competitors.includes(trimmedCompetitor)) {
        setNameError('Competitor names must be unique.');
        addToast({
          title: 'Error',
          message: 'Competitor names must be unique.',
          duration: 3000,
        });
        return;
      }
      if (competitors.length < 64) {
        setCompetitors([...competitors, trimmedCompetitor]);
        setNewCompetitor('');
        setNameError('');
        newCompetitorInputRef.current.focus();
      } else {
        addToast({
          title: 'Error',
          message: 'Maximum of 64 competitors reached.',
          duration: 3000,
        });
      }
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
    if (trimmedName.length > 5) {
      addToast({
        title: 'Error',
        message: 'Competitor name cannot exceed 5 characters.',
        duration: 3000,
      });
      return;
    }
    if (
      competitors.includes(trimmedName) &&
      competitors[index] !== trimmedName
    ) {
      addToast({
        title: 'Error',
        message: 'Competitor names must be unique.',
        duration: 3000,
      });
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
      // Tournament is complete, or no matches to advance
      setCurrentRoundIndex(-1); // Indicate no current round
      setCurrentMatchIndex(-1); // Indicate no current match
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

    const shuffledCompetitors = [...competitors].sort(
      () => Math.random() - 0.5,
    );

    for (let i = 0; i < bracketSize / 2; i++) {
      const match = [null, null];
      if (i < byes) {
        match[0] = shuffledCompetitors[competitorIndex++];
      } else {
        if (shuffledCompetitors[competitorIndex]) {
          match[0] = shuffledCompetitors[competitorIndex++];
        }
        if (shuffledCompetitors[competitorIndex]) {
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

  const handleScoreChange = (
    roundIndex,
    matchIndex,
    competitorIndex,
    score,
  ) => {
    const newScores = { ...scores };
    if (!newScores[roundIndex]) {
      newScores[roundIndex] = {};
    }
    if (!newScores[roundIndex][matchIndex]) {
      newScores[roundIndex][matchIndex] = [null, null];
    }
    newScores[roundIndex][matchIndex][competitorIndex] = score.replace(
      /\D/g,
      '',
    );
    setScores(newScores);
  };

  const handleByes = (currentBracket, initialAdvancedMatches = {}) => {
    if (!currentBracket) return;

    const newBracket = JSON.parse(JSON.stringify(currentBracket));
    let changed = false;
    let updatedAdvancedMatches = { ...initialAdvancedMatches }; // Create a mutable copy

    newBracket[0].forEach((match, matchIndex) => {
      if (match[0] && match[1] === null) {
        const winner = match[0];
        const loser = 'Bye'; // Explicitly define 'Bye' as the loser

        // Update advancedMatches for this bye match
        updatedAdvancedMatches[`0-${matchIndex}`] = { winner, loser };

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
    // Only update advancedMatches once after the loop
    setAdvancedMatches(updatedAdvancedMatches);
  };

  const [compactLayout, setCompactLayout] = useState(false);

  return (
    <div className="py-16 sm:py-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">tb</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex flex-col justify-center mt-8">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-start relative w-full flex-grow"
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
            <div className="relative z-10">
              {!tournamentStarted ? (
                <>
                  <div>
                    <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                      {' '}
                      Tournament Brackets
                    </h1>
                    <hr className="border-gray-700 mb-4" />
                    <div className="mb-8">
                      <h2 className="text-2xl font-arvo font-normal mb-4">
                        Add Competitors (max 64 competitors, 5 char limit)
                      </h2>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={newCompetitor}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewCompetitor(value);
                            setNewCompetitorCharLimitError(value.length > 5);
                          }}
                          onKeyDown={handleNewCompetitorKeyDown}
                          placeholder="Enter competitor name"
                          className={`bg-gray-800 text-white p-2 rounded-lg flex-grow ${newCompetitorCharLimitError ? 'border-red-500 border-2' : ''}`}
                          ref={newCompetitorInputRef}
                        />
                        <button
                          onClick={addCompetitor}
                          className={`flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                            ${
                              competitors.length >= 64
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'border-app/100 bg-app/50 text-white hover:bg-app/70'
                            }`}
                          disabled={competitors.length >= 64}
                        >
                          Add
                        </button>
                      </div>
                      {newCompetitorCharLimitError && (
                        <p className="text-red-500 mt-2">
                          Competitor name cannot exceed 5 characters.
                        </p>
                      )}
                      {nameError && (
                        <p className="text-red-500 mt-2">{nameError}</p>
                      )}
                      {competitors.length >= 64 && (
                        <p className="text-red-500 mt-2">
                          Maximum of 64 competitors reached.
                        </p>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h2 className="text-2xl font-arvo font-normal mb-4">
                        Competitors ({competitors.length})
                      </h2>
                      <ul className="space-y-2">
                        {competitors.map((competitor, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-800 p-2 rounded-lg"
                          >
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
                                <button
                                  onClick={() => saveEdit(index)}
                                  className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                                    ${
                                      false // Save button is never disabled based on current logic
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'border-app/100 bg-app/50 text-white hover:bg-app/70'
                                    }`}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditing(index, competitor)
                                  }
                                  className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                                    ${
                                      false // Edit button is never disabled based on current logic
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'border-app/100 bg-app/50 text-white hover:bg-app/70'
                                    }`}
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => deleteCompetitor(index)}
                                className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                                    ${
                                      false // Delete button is never disabled based on current logic
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'border-app/100 bg-app/50 text-white hover:bg-app/70'
                                    }`}
                              >
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
                        className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                          ${
                            competitors.length < 2
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-app/50 text-white hover:bg-app/70'
                          }`}
                        disabled={competitors.length < 2}
                      >
                        Start Tournament
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-arvo font-normal mb-4">
                      How it works
                    </h2>
                    <p className="text-gray-400">
                      ✦ This tournament bracket generator creates a
                      single-elimination bracket. <br />
                      ✦ The number of rounds and BYEs are automatically
                      calculated based on the number of competitors. <br />
                      ✦ Competitors are randomly seeded. <br />
                      ✦ Enter scores for each match to advance the winner to the
                      next round. <br />
                      <br />
                      As an example, for 20 teams: <br />
                      ✦ The next power of 2 greater than or equal to 20 is 32
                      (2^5). <br />
                      ✦ The number of BYEs is calculated as bracketSize -
                      numCompetitors. <br />
                      ✦ Therefore, 32 - 20 = 12 BYEs. <br />
                      ✦ There will be 12 BYEs for 20 teams. <br />
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold">Bracket</h2>
                    <label
                      htmlFor="compact-layout-toggle"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          id="compact-layout-toggle"
                          type="checkbox"
                          className="sr-only"
                          checked={compactLayout}
                          onChange={() => setCompactLayout(!compactLayout)}
                        />
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${compactLayout ? 'translate-x-full bg-primary-500' : ''}`}
                        ></div>
                      </div>
                      <div className="ml-3 text-gray-300">Compact Layout</div>
                    </label>
                  </div>
                  <div className="flex space-x-4 overflow-x-auto pb-4 px-4">
                    {bracket &&
                      bracket.map((round, roundIndex) => (
                        <div
                          key={roundIndex}
                          className={`flex flex-col ${compactLayout ? 'space-y-2' : 'space-y-4'} min-w-max flex-shrink-0 ${roundIndex === currentRoundIndex ? 'border-2 border-yellow-400 p-2 rounded-lg' : ''}`}
                        >
                          <h3 className="text-xl font-bold">
                            Round {roundIndex + 1}
                          </h3>
                          {round.map((match, matchIndex) => (
                            <div
                              key={matchIndex}
                              className={`group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out overflow-hidden w-80 ${compactLayout ? 'min-h-[100px]' : 'h-full'} my-2 ${roundIndex === currentRoundIndex && matchIndex === currentMatchIndex ? 'border-2 border-yellow-400' : ''}`}
                              style={cardStyle}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    className="bg-gray-700 text-white p-1 rounded-lg w-16"
                                    value={
                                      scores[roundIndex]?.[matchIndex]?.[0] ||
                                      ''
                                    }
                                    onChange={(e) =>
                                      handleScoreChange(
                                        roundIndex,
                                        matchIndex,
                                        0,
                                        e.target.value,
                                      )
                                    }
                                    disabled={!match[0] || !match[1]}
                                  />
                                  <span
                                    className={`break-words ${match[0] && (match[1] === null ? 'text-article font-bold' : advancedMatches[`${roundIndex}-${matchIndex}`]?.winner === match[0] ? 'text-article font-bold' : advancedMatches[`${roundIndex}-${matchIndex}`]?.loser === match[0] ? 'text-gray-500 line-through' : '')}`}
                                  >
                                    {match[0] || 'TBD'}
                                  </span>
                                </div>
                                <span>vs</span>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`break-words ${match[1] && (match[1] === null ? 'text-gray-500 line-through' : advancedMatches[`${roundIndex}-${matchIndex}`]?.winner === match[1] ? 'text-article font-bold' : advancedMatches[`${roundIndex}-${matchIndex}`]?.loser === match[1] ? 'text-gray-500 line-through' : '')}`}
                                  >
                                    {match[1] ||
                                      (roundIndex === 0 ? 'Bye' : 'TBD')}
                                  </span>
                                  <input
                                    type="number"
                                    className="bg-gray-700 text-white p-1 rounded-lg w-16"
                                    value={
                                      scores[roundIndex]?.[matchIndex]?.[1] ||
                                      ''
                                    }
                                    onChange={(e) =>
                                      handleScoreChange(
                                        roundIndex,
                                        matchIndex,
                                        1,
                                        e.target.value,
                                      )
                                    }
                                    disabled={!match[0] || !match[1]}
                                  />
                                </div>
                              </div>
                              {match[0] && match[1] && (
                                <button
                                  onClick={() => {
                                    const score1 = parseInt(
                                      scores[roundIndex]?.[matchIndex]?.[0],
                                      10,
                                    );
                                    const score2 = parseInt(
                                      scores[roundIndex]?.[matchIndex]?.[1],
                                      10,
                                    );
                                    if (
                                      isNaN(score1) ||
                                      isNaN(score2) ||
                                      score1 === score2
                                    )
                                      return;
                                    const winner =
                                      score1 > score2 ? match[0] : match[1];
                                    const loser =
                                      score1 > score2 ? match[1] : match[0];
                                    advanceWinner(
                                      winner,
                                      loser,
                                      roundIndex,
                                      matchIndex,
                                    );
                                  }}
                                  className={`flex items-center justify-center gap-2 text-lg font-mono font-normal px-4 py-1 rounded-md border transition-colors duration-300 ease-in-out w-full mb-4
                                  ${
                                    advancedMatches[
                                      `${roundIndex}-${matchIndex}`
                                    ] ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      undefined ||
                                    scores[roundIndex]?.[matchIndex]?.[1] ===
                                      undefined ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      '' ||
                                    scores[roundIndex]?.[matchIndex]?.[1] ===
                                      '' ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      scores[roundIndex]?.[matchIndex]?.[1]
                                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                      : 'bg-app/50 text-white hover:bg-app/70'
                                  }`}
                                  disabled={
                                    advancedMatches[
                                      `${roundIndex}-${matchIndex}`
                                    ] ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      undefined ||
                                    scores[roundIndex]?.[matchIndex]?.[1] ===
                                      undefined ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      '' ||
                                    scores[roundIndex]?.[matchIndex]?.[1] ===
                                      '' ||
                                    scores[roundIndex]?.[matchIndex]?.[0] ===
                                      scores[roundIndex]?.[matchIndex]?.[1]
                                  }
                                >
                                  {advancedMatches[
                                    `${roundIndex}-${matchIndex}`
                                  ]
                                    ? `${advancedMatches[`${roundIndex}-${matchIndex}`].winner} advanced!`
                                    : roundIndex === bracket.length - 1
                                      ? 'Set Champion'
                                      : 'Set Winner'}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                  {champion && (
                    <div className="mt-8 text-center">
                      <h2 className="text-3xl font-bold">🎉 Champion! 🎉</h2>
                      <p className="text-xl font-bold text-yellow-400">
                        {champion}
                      </p>
                    </div>
                  )}
                  <div className="mt-8 flex gap-4 justify-center">
                    <button
                      onClick={resetScores}
                      className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                        ${
                          false // Reset Scores button is never disabled based on current logic
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-app/50 text-white hover:bg-app/70'
                        }`}
                    >
                      {' '}
                      Reset Scores{' '}
                    </button>
                    <button
                      onClick={resetTournament}
                      className={`flex items-center gap-2 text-lg font-mono font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out
                        ${
                          false // Reset Tournament button is never disabled based on current logic
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-app/50 text-white hover:bg-app/70'
                        }`}
                    >
                      {' '}
                      Reset Tournament{' '}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentBracketPage;
