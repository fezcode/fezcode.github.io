import {
  bayesianRating,
  boundedNumber,
  kaprekarStep,
  kaprekarTrace,
  pirateSolution,
  pirateVote,
} from './models';
import { experimentRssLinks } from '../../../scripts/experiment-rss.cjs';

describe('Pirate Council', () => {
  it('reproduces every classic backward-induction round', () => {
    const expected = [
      [100],
      [100, 0],
      [99, 0, 1],
      [99, 0, 1, 0],
      [98, 0, 1, 0, 1],
    ];
    expected.forEach((allocation, i) => {
      expect(pirateSolution(i + 1)).toEqual(allocation);
      expect(pirateVote(allocation).accepted).toBe(true);
    });
    expect(pirateVote(expected[4]).votes).toEqual([
      true,
      false,
      true,
      false,
      true,
    ]);
  });
  it('rejects equal-payoff bribes and overspending', () => {
    expect(pirateVote([98, 0, 0, 1, 1]).accepted).toBe(false);
    expect(pirateVote([97, 0, 1, 1, 1]).votes[3]).toBe(false);
    expect(pirateVote([100, 1, 0, 0, 0]).valid).toBe(false);
    expect(pirateVote([-1, 101]).valid).toBe(false);
    expect(pirateVote([99.5, 0.5]).valid).toBe(false);
  });
  it('honors survival before coins under strict majority', () => {
    expect(pirateSolution(2, 'majority')).toEqual([null, 100]);
    expect(pirateVote([0, 100], 'majority').accepted).toBe(false);
    expect(pirateSolution(3, 'majority')).toEqual([100, 0, 0]);
    expect(pirateVote([100, 0, 0], 'majority').votes).toEqual([
      true,
      true,
      false,
    ]);
    expect(pirateSolution(5, 'majority')).toEqual([97, 0, 1, 2, 0]);
    expect(pirateVote([97, 0, 1, 2, 0], 'majority').accepted).toBe(true);
  });
  it('finds the maximum captain payoff by exhaustive comparison for three pirates', () => {
    for (const rule of ['half', 'majority']) {
      let maximum = -1;
      for (let b = 0; b <= 100; b++)
        for (let c = 0; c <= 100 - b; c++) {
          const a = 100 - b - c;
          if (pirateVote([a, b, c], rule).accepted)
            maximum = Math.max(maximum, a);
        }
      expect(pirateSolution(3, rule)[0]).toBe(maximum);
    }
  });
});

describe('Bayesian rating model', () => {
  it('uses the prior at zero votes and equal weights at v = m', () => {
    expect(bayesianRating(9, 0, 6.5, 100)).toBe(6.5);
    expect(bayesianRating(9, 100, 6.5, 100)).toBe(7.75);
    expect(bayesianRating(9, 105, 6.5, 100)).toBeCloseTo(7.7804878049);
  });
  it('moves toward the observed rating as evidence increases, in either direction', () => {
    expect(bayesianRating(9, 1000, 6.5, 100)).toBeGreaterThan(
      bayesianRating(9, 100, 6.5, 100),
    );
    expect(bayesianRating(3, 1000, 6.5, 100)).toBeLessThan(
      bayesianRating(3, 100, 6.5, 100),
    );
  });
});

describe('Kaprekar machine', () => {
  it('preserves leading zeroes and the known 3524 path', () => {
    expect(kaprekarStep('1000')).toEqual({
      input: '1000',
      ascending: '0001',
      descending: '1000',
      result: '0999',
    });
    expect(kaprekarTrace('3524').map((row) => row.result)).toEqual([
      '3087',
      '8352',
      '6174',
      '6174',
    ]);
    expect(() => kaprekarStep('12')).toThrow();
  });
  it('checks all 10,000 four-digit starting strings', () => {
    for (let n = 0; n < 10000; n++) {
      const value = String(n).padStart(4, '0');
      const trace = kaprekarTrace(value);
      const target = new Set(value).size === 1 ? '0000' : '6174';
      expect(trace.at(-1).result).toBe(target);
      expect(trace.length).toBeLessThanOrEqual(8);
    }
  });
});

it('normalizes untrusted numeric settings without losing valid zeroes', () => {
  expect(boundedNumber('Infinity', 100, 0, 1000)).toBe(100);
  expect(boundedNumber('', 100, 0, 1000)).toBe(100);
  expect(boundedNumber('0', 100, 0, 1000)).toBe(0);
  expect(boundedNumber('99', 5, 1, 5, true)).toBe(5);
});

it('creates safe RSS links for all experiments, including multiline and single-quoted tags', () => {
  const html = experimentRssLinks(
    `<probability-experiment experiment="penneys-game" first="HHH" second="THH"></probability-experiment>\n<probability-experiment\n experiment='pirate-game' pirates='3' rule='majority'></probability-experiment>\n<probability-experiment experiment="bayesian-ratings" votes="0" prior="6.5"></probability-experiment>\n<probability-experiment experiment="kaprekars-routine" start="1000"></probability-experiment>`,
  );
  expect(html).toContain('first=HHH&amp;second=THH');
  expect(html).toContain('pirates=3&amp;rule=majority');
  expect(html).toContain('votes=0&amp;prior=6.5');
  expect(html).toContain('start=1000');
  expect(html).not.toContain('<probability-experiment');
  expect(
    experimentRssLinks(
      '<probability-experiment experiment="unknown"></probability-experiment>',
    ),
  ).toBe('');
  expect(
    experimentRssLinks(
      '<probability-experiment experiment="pirate-game" rule="javascript:alert(1)"></probability-experiment>',
    ),
  ).not.toMatch(/javascript:/);
});
