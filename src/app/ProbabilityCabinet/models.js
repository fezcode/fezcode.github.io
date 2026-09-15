export function boundedNumber(value, fallback, min, max, integer = false) {
  if (value === null || value === undefined || String(value).trim() === '')
    return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const result = Math.min(max, Math.max(min, n));
  return integer ? Math.floor(result) : result;
}

export const votesNeeded = (count, rule) =>
  rule === 'majority' ? Math.floor(count / 2) + 1 : Math.ceil(count / 2);

// null means a pirate does not survive. Survival outranks every coin offer.
export function pirateSolution(count, rule = 'half', coins = 100) {
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > 5 ||
    !['half', 'majority'].includes(rule)
  )
    throw new Error('Invalid pirate rules');
  if (count === 1) return [coins];
  const fallback = pirateSolution(count - 1, rule, coins);
  const prices = fallback
    .map((value, i) => ({ i: i + 1, cost: value === null ? 0 : value + 1 }))
    .sort((a, b) => a.cost - b.cost || a.i - b.i);
  const coalition = prices.slice(0, votesNeeded(count, rule) - 1);
  const cost = coalition.reduce((sum, item) => sum + item.cost, 0);
  if (cost > coins) return [null, ...fallback];
  const allocation = Array(count).fill(0);
  allocation[0] = coins - cost;
  coalition.forEach(({ i, cost: price }) => {
    allocation[i] = price;
  });
  return allocation;
}

export function pirateVote(allocation, rule = 'half') {
  const count = allocation.length;
  if (
    !count ||
    count > 5 ||
    allocation.some((n) => !Number.isInteger(n) || n < 0) ||
    allocation.reduce((a, b) => a + b, 0) !== 100
  )
    return { valid: false };
  const fallback = count === 1 ? [] : pirateSolution(count - 1, rule);
  const votes = allocation.map(
    (coins, i) =>
      i === 0 || fallback[i - 1] === null || coins > fallback[i - 1],
  );
  return {
    valid: true,
    votes,
    fallback,
    accepted: votes.filter(Boolean).length >= votesNeeded(count, rule),
  };
}

export function bayesianRating(rating, votes, prior, weight) {
  return (rating * votes + prior * weight) / (votes + weight);
}

export function kaprekarStep(value) {
  if (!/^\d{4}$/.test(value)) throw new Error('Enter exactly four digits');
  const ascending = value.split('').sort().join('');
  const descending = ascending.split('').reverse().join('');
  return {
    input: value,
    descending,
    ascending,
    result: String(Number(descending) - Number(ascending)).padStart(4, '0'),
  };
}

export function kaprekarTrace(value) {
  const rows = [];
  const seen = new Set([value]);
  while (rows.length < 10) {
    const row = kaprekarStep(value);
    rows.push(row);
    if (seen.has(row.result)) break;
    seen.add(row.result);
    value = row.result;
  }
  return rows;
}

// Milgram's shock generator: 30 switches from 15 V to 450 V in 15 V steps.
export const MILGRAM_MAX_VOLTS = 450;

export function shockLabel(volts) {
  const labels = [
    'Slight shock',
    'Moderate shock',
    'Strong shock',
    'Very strong shock',
    'Intense shock',
    'Extreme intensity shock',
    'Danger: severe shock',
    'XXX',
  ];
  return labels[Math.min(7, Math.floor((volts - 15) / 60))];
}

// The learner is a confederate. Paraphrased from the schedule Milgram used
// in his Experiment 5, where the learner mentions a heart condition.
export function learnerResponse(volts) {
  if (volts < 75) return 'No sound from the other room.';
  if (volts < 120) return 'A grunt.';
  if (volts < 135) return 'A grunt. "Hey, this really hurts."';
  if (volts < 150) return 'A louder grunt.';
  if (volts < 165)
    return '"That\'s all. Get me out of here. I told you I had heart trouble. I refuse to go on."';
  if (volts < 195) return '"Let me out! I can\'t stand the pain!"';
  if (volts < 210)
    return '"Let me out of here! My heart\'s bothering me. You have no right to keep me here!"';
  if (volts < 225)
    return '"Experimenter! Get me out of here. I\'ve had enough. I won\'t be in the experiment any more."';
  if (volts < 270) return 'A cry of pain. "Get me out of here."';
  if (volts < 300) return 'An agonized scream. "Let me out of here!"';
  if (volts < 330)
    return 'An agonized scream. "I absolutely refuse to answer any more. I\'m no longer part of this experiment."';
  if (volts < 345)
    return 'A prolonged, agonized scream. "My heart\'s bothering me. Let me out, I tell you."';
  return 'Silence. No answer is treated as a wrong answer.';
}

export const MILGRAM_PRODS = [
  'Please continue.',
  'The experiment requires that you continue.',
  'It is absolutely essential that you continue.',
  'You have no other choice. You must go on.',
];

// Break-off points of the 40 subjects in Milgram's Experiment 5 (New Baseline),
// from Table 2 of Obedience to Authority (1974). 450 means fully obedient.
export const MILGRAM_BREAKOFFS = {
  150: 6,
  165: 1,
  180: 1,
  210: 1,
  300: 1,
  315: 2,
  345: 1,
  360: 1,
  450: 26,
};

// Fully obedient subjects in a selection of Milgram's variations.
export const MILGRAM_VARIATIONS = [
  {
    id: 'baseline',
    title: 'Baseline: learner heard through the wall',
    obedient: 26,
    total: 40,
  },
  {
    id: 'proximity',
    title: 'Learner in the same room',
    obedient: 16,
    total: 40,
  },
  {
    id: 'touch',
    title: 'Teacher forces the learner’s hand onto the plate',
    obedient: 12,
    total: 40,
  },
  {
    id: 'phone',
    title: 'Experimenter gives orders by telephone',
    obedient: 9,
    total: 40,
  },
  {
    id: 'office',
    title: 'Run-down office instead of Yale',
    obedient: 19,
    total: 40,
  },
  {
    id: 'ordinary',
    title: 'An ordinary man gives the orders',
    obedient: 4,
    total: 20,
  },
  {
    id: 'peers',
    title: 'Two fellow teachers refuse first',
    obedient: 4,
    total: 40,
  },
  {
    id: 'delegate',
    title: 'Someone else presses the switch',
    obedient: 37,
    total: 40,
  },
  {
    id: 'choice',
    title: 'Teacher chooses the shock level',
    obedient: 1,
    total: 40,
  },
];

export function milgramComparison(volts) {
  const points = Object.keys(MILGRAM_BREAKOFFS).map(Number);
  const total = points.reduce((sum, p) => sum + MILGRAM_BREAKOFFS[p], 0);
  const stoppedHere = MILGRAM_BREAKOFFS[volts] || 0;
  const stoppedEarlier = points
    .filter((p) => p < volts)
    .reduce((sum, p) => sum + MILGRAM_BREAKOFFS[p], 0);
  return {
    total,
    stoppedHere,
    stoppedEarlier,
    wentFurther: total - stoppedEarlier - stoppedHere,
    obedient: MILGRAM_BREAKOFFS[MILGRAM_MAX_VOLTS],
  };
}
