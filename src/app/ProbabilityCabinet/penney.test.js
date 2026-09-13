import {
  advanceGame,
  bestResponse,
  emptyGame,
  normalizePair,
  secondWinProbability,
  sequences,
  simulateGames,
} from './penney';

describe('Penney’s Game probabilities', () => {
  it.each([
    ['HHH', 7 / 8],
    ['HHT', 3 / 4],
    ['HTH', 2 / 3],
    ['HTT', 2 / 3],
    ['THH', 2 / 3],
    ['THT', 2 / 3],
    ['TTH', 3 / 4],
    ['TTT', 7 / 8],
  ])('matches the known best-response odds for %s', (first, expected) => {
    expect(secondWinProbability(first, bestResponse(first))).toBeCloseTo(
      expected,
      12,
    );
  });
  it('preserves player symmetry and fair-coin complement symmetry for all 56 pairings', () => {
    const complement = (s) =>
      s.replace(/[HT]/g, (c) => (c === 'H' ? 'T' : 'H'));
    for (const first of sequences)
      for (const second of sequences) {
        if (first === second) continue;
        const p = secondWinProbability(first, second);
        expect(p).toBeGreaterThan(0);
        expect(p).toBeLessThan(1);
        expect(p + secondWinProbability(second, first)).toBeCloseTo(1, 12);
        expect(
          secondWinProbability(complement(first), complement(second)),
        ).toBeCloseTo(p, 12);
      }
  });
  it('tracks overlapping windows and stops at the first match', () => {
    let game = emptyGame();
    for (const coin of 'HTHH') game = advanceGame(game, 'HHH', 'THH', coin);
    expect(game.winner).toBe(2);
    expect(game.flips).toBe(4);
  });
  it('counts deterministic simulated games', () => {
    expect(simulateGames('HHH', 'THH', 10, () => 0.1)).toEqual({
      first: 10,
      second: 0,
    });
    let i = 0;
    expect(
      simulateGames('HHH', 'THH', 10, () => [0.9, 0.1, 0.1][i++ % 3]),
    ).toEqual({ first: 0, second: 10 });
  });
  it('normalizes invalid or identical URL selections', () => {
    expect(normalizePair('bad', 'bad')).toEqual(['HHT', 'THH']);
    expect(normalizePair('HHH', 'HHH')).toEqual(['HHH', 'THH']);
    expect(() => secondWinProbability('HHH', 'HHH')).toThrow();
  });
});
