import {
  bayesianRating,
  boundedNumber,
  kaprekarStep,
  kaprekarTrace,
  learnerResponse,
  milgramComparison,
  MILGRAM_BREAKOFFS,
  MILGRAM_PRODS,
  MILGRAM_VARIATIONS,
  shockLabel,
  pirateSolution,
  pirateVote,
  RAZORS,
  RAZOR_CASES,
  razorDissent,
  razorTally,
  razorVerdicts,
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
  expect(
    experimentRssLinks(
      '<probability-experiment experiment="milgram-obedience" guess="3"></probability-experiment>',
    ),
  ).toContain('experiment=milgram-obedience&amp;guess=3');
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

describe('Milgram shock generator', () => {
  it('matches the Experiment 5 break-off table', () => {
    const total = Object.values(MILGRAM_BREAKOFFS).reduce((a, b) => a + b, 0);
    expect(total).toBe(40);
    expect(MILGRAM_BREAKOFFS[450]).toBe(26);
    expect(Math.min(...Object.keys(MILGRAM_BREAKOFFS).map(Number))).toBe(150);
    expect(milgramComparison(150)).toEqual({
      total: 40,
      stoppedHere: 6,
      stoppedEarlier: 0,
      wentFurther: 34,
      obedient: 26,
    });
    expect(milgramComparison(330)).toMatchObject({
      stoppedHere: 0,
      stoppedEarlier: 12,
      wentFurther: 28,
    });
    expect(milgramComparison(450)).toMatchObject({
      stoppedHere: 26,
      wentFurther: 0,
    });
    expect(milgramComparison(0)).toMatchObject({
      stoppedEarlier: 0,
      wentFurther: 40,
    });
  });
  it('labels the generator and scripts the learner in Milgram’s order', () => {
    expect(shockLabel(15)).toBe('Slight shock');
    expect(shockLabel(60)).toBe('Slight shock');
    expect(shockLabel(75)).toBe('Moderate shock');
    expect(shockLabel(150)).toBe('Strong shock');
    expect(shockLabel(375)).toBe('Danger: severe shock');
    expect(shockLabel(435)).toBe('XXX');
    expect(shockLabel(450)).toBe('XXX');
    expect(learnerResponse(60)).toMatch(/No sound/);
    expect(learnerResponse(150)).toMatch(/heart trouble/);
    expect(learnerResponse(300)).toMatch(/refuse to answer/);
    expect(learnerResponse(345)).toMatch(/Silence/);
    expect(MILGRAM_PRODS).toHaveLength(4);
    expect(MILGRAM_PRODS[3]).toMatch(/no other choice/);
  });
  it('keeps every variation within its sample size', () => {
    MILGRAM_VARIATIONS.forEach((row) => {
      expect(row.obedient).toBeLessThanOrEqual(row.total);
      expect(row.obedient).toBeGreaterThanOrEqual(0);
    });
    const baseline = MILGRAM_VARIATIONS.find((row) => row.id === 'baseline');
    expect(baseline.obedient / baseline.total).toBe(0.65);
  });
});

describe('Razor drawer', () => {
  it('only offers razors that exist in the drawer', () => {
    const known = RAZORS.map((razor) => razor.id);
    RAZOR_CASES.forEach((entry) => {
      Object.keys(entry.verdicts).forEach((id) => {
        expect(known).toContain(id);
      });
      expect(razorVerdicts(entry.id).length).toBeGreaterThanOrEqual(3);
    });
  });

  it('mixes split cases with unanimous ones so the drawer is not rigged', () => {
    const stanceCounts = RAZOR_CASES.map(
      (entry) =>
        new Set(
          razorVerdicts(entry.id)
            .map((verdict) => verdict.stance)
            .filter((stance) => stance !== 'abstain'),
        ).size,
    );
    // Every case needs at least one razor with jurisdiction over it.
    stanceCounts.forEach((size) => expect(size).toBeGreaterThanOrEqual(1));
    // The post's claim only holds if the drawer really does split on ordinary
    // facts, and it is only honest if it sometimes agrees.
    expect(stanceCounts.filter((size) => size > 1).length).toBeGreaterThanOrEqual(
      3,
    );
    expect(stanceCounts.filter((size) => size === 1).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('splits the drawer into agreement, dissent, and no jurisdiction', () => {
    const fence = razorDissent('deploy-check', 'chesterton');
    expect(fence.picked.stance).toBe('keep');
    expect(fence.agrees).toHaveLength(0);
    expect(fence.dissents.map((razor) => razor.id)).toEqual([
      'occam',
      'hitchens',
      'popper',
    ]);

    const cut = razorDissent('deploy-check', 'occam');
    expect(cut.agrees.map((razor) => razor.id)).toEqual(['hitchens']);
    expect(cut.dissents.map((razor) => razor.id)).toEqual([
      'popper',
      'chesterton',
    ]);
  });

  it('reports abstentions without counting them as dissent', () => {
    const payroll = razorDissent('payroll', 'hanlon');
    expect(payroll.abstains).toHaveLength(0);

    const study = razorDissent('study', 'occam');
    expect(study.abstains.map((razor) => razor.id)).toEqual(['hitchens']);
    expect(study.dissents).toHaveLength(0);

    // A razor with no jurisdiction still reports the razors that did rule.
    const misapplied = razorDissent('study', 'hitchens');
    expect(misapplied.picked.stance).toBe('abstain');
    expect(misapplied.abstains).toHaveLength(0);
    expect(misapplied.dissents.map((razor) => razor.id)).toEqual([
      'occam',
      'sagan',
      'popper',
    ]);
  });

  it('returns an empty split for a razor the case never offered', () => {
    expect(razorDissent('payroll', 'popper')).toMatchObject({
      picked: null,
      agrees: [],
      dissents: [],
      abstains: [],
    });
  });

  it('tallies contested cuts, misapplied razors, and the favourite', () => {
    const tally = razorTally([
      { caseId: 'payroll', razorId: 'hanlon' },
      { caseId: 'deploy-check', razorId: 'occam' },
      { caseId: 'study', razorId: 'occam' },
      { caseId: 'smart-meter', razorId: 'hanlon' },
    ]);
    expect(tally.total).toBe(4);
    // Every case but the study, where the whole drawer rejects the paper.
    expect(tally.contested).toBe(3);
    expect(tally.misapplied).toBe(1);
    expect(tally.distinct).toBe(2);
    expect(tally.favourite.id).toBe('hanlon');
    expect(tally.favouriteCount).toBe(2);
  });
});
