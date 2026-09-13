export const sequences = [
  'HHH',
  'HHT',
  'HTH',
  'HTT',
  'THH',
  'THT',
  'TTH',
  'TTT',
];

export const bestResponse = (sequence) =>
  (sequence[1] === 'H' ? 'T' : 'H') + sequence.slice(0, 2);

export function normalizePair(first, second) {
  const a = sequences.includes(first) ? first : 'HHT';
  const b =
    sequences.includes(second) && second !== a ? second : bestResponse(a);
  return [a, b];
}

// Absorbing Markov chain over proper prefixes of the two patterns.
// Solve P(state) = (P(state + H) + P(state + T)) / 2 for P(player 2 wins).
export function secondWinProbability(first, second) {
  if (
    !sequences.includes(first) ||
    !sequences.includes(second) ||
    first === second
  ) {
    throw new Error('Choose two distinct three-flip sequences.');
  }
  const states = [
    ...new Set([
      '',
      first.slice(0, 1),
      first.slice(0, 2),
      second.slice(0, 1),
      second.slice(0, 2),
    ]),
  ];
  const matrix = states.map((state, row) => {
    const values = Array(states.length + 1).fill(0);
    values[row] = 1;
    for (const coin of ['H', 'T']) {
      const next = state + coin;
      if (next.endsWith(second)) values[states.length] += 0.5;
      else if (!next.endsWith(first)) {
        const suffix = states
          .filter((s) => next.endsWith(s))
          .sort((a, b) => b.length - a.length)[0];
        values[states.indexOf(suffix)] -= 0.5;
      }
    }
    return values;
  });
  for (let column = 0; column < states.length; column++) {
    let pivot = column;
    for (let row = column + 1; row < states.length; row++) {
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column]))
        pivot = row;
    }
    [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];
    const divisor = matrix[column][column];
    matrix[column] = matrix[column].map((v) => v / divisor);
    for (let row = 0; row < states.length; row++) {
      if (row === column) continue;
      const factor = matrix[row][column];
      matrix[row] = matrix[row].map((v, i) => v - factor * matrix[column][i]);
    }
  }
  return matrix[0][states.length];
}

export function advanceGame(game, first, second, coin) {
  const tail = (game.tail + coin).slice(-3);
  return {
    tail,
    flips: game.flips + 1,
    history: [...game.history.slice(-23), coin],
    winner: tail === first ? 1 : tail === second ? 2 : null,
  };
}

export const emptyGame = () => ({
  tail: '',
  flips: 0,
  history: [],
  winner: null,
});

export function simulateGames(first, second, count, random = Math.random) {
  let secondWins = 0;
  for (let i = 0; i < count; i++) {
    let tail = '';
    do {
      tail = (tail + (random() < 0.5 ? 'H' : 'T')).slice(-3);
    } while (tail !== first && tail !== second);
    if (tail === second) secondWins++;
  }
  return { first: count - secondWins, second: secondWins };
}
