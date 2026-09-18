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

// The razor drawer. Each razor is a heuristic for allocating attention when
// the evidence runs out, not a truth-preserving rule. The point of the
// experiment is that several of them fire on the same facts and disagree.
export const RAZORS = [
  {
    id: 'occam',
    name: 'Occam’s Razor',
    rule: 'Do not multiply entities beyond necessity.',
  },
  {
    id: 'hanlon',
    name: 'Hanlon’s Razor',
    rule: 'Never attribute to malice what is adequately explained by incompetence.',
  },
  {
    id: 'grey',
    name: 'Grey’s Law',
    rule: 'Sufficiently advanced incompetence is indistinguishable from malice.',
  },
  {
    id: 'hitchens',
    name: 'Hitchens’s Razor',
    rule: 'What is asserted without evidence can be dismissed without evidence.',
  },
  {
    id: 'sagan',
    name: 'The Sagan Standard',
    rule: 'Extraordinary claims require extraordinary evidence.',
  },
  {
    id: 'popper',
    name: 'Popper’s Criterion',
    rule: 'A claim that forbids nothing explains nothing.',
  },
  {
    id: 'chesterton',
    name: 'Chesterton’s Fence',
    rule: 'Do not remove a fence until you know why it was put there.',
  },
  {
    id: 'duck',
    name: 'The Duck Test',
    rule: 'If it looks like a duck and quacks like a duck, it is a duck.',
  },
];

export function razorById(id) {
  return RAZORS.find((razor) => razor.id === id);
}

// Stances are per-case labels, not global ones. Two razors share a stance when
// they point at the same action; 'abstain' means the razor has no jurisdiction
// over these facts at all.
export const RAZOR_CASES = [
  {
    id: 'payroll',
    title: 'The short paycheck',
    scene:
      'Your salary landed 400 short. You emailed payroll four days ago and got nothing back. Over lunch a colleague mentions theirs was short too, by a different amount.',
    settles:
      'Ask for the journal for that payroll run. A broken import and a deliberate adjustment look nothing alike in a ledger, and you can read one in about ninety seconds.',
    verdicts: {
      occam: {
        stance: 'error',
        call: 'A broken payroll run',
        why: 'One failed import explains both shortfalls. A scheme needs a motive, a plan, and two co-ordinated wrong numbers, which is three new entities bought to explain one event.',
      },
      hanlon: {
        stance: 'error',
        call: 'A broken payroll run',
        why: 'Two different wrong amounts is the signature of a bad migration, not a policy. Nobody skims from two people in unequal, arbitrary quantities.',
      },
      grey: {
        stance: 'blame',
        call: 'Treat it as deliberate',
        why: 'Four days of silence about missing wages is itself the injury. Past a certain scale it stops mattering which one it is: the money is gone and nobody is answering.',
      },
      duck: {
        stance: 'blame',
        call: 'Treat it as deliberate',
        why: 'Money missing, questions unanswered, no explanation offered. It walks like being stiffed and it quacks like being stiffed.',
      },
    },
  },
  {
    id: 'deploy-check',
    title: 'The ninety-second sleep',
    scene:
      'You inherit a service. The deploy script sleeps ninety seconds before health checks run. No comment, no ticket, and the author left in 2019. It costs your team about twenty minutes a week.',
    settles:
      'Reproduce the slowest cold start you can in staging, then take the sleep out and watch. Chesterton’s Fence is an instruction to go and look, not a permit to leave it alone forever.',
    verdicts: {
      chesterton: {
        stance: 'keep',
        call: 'Leave it until you know',
        why: 'You cannot price the fence before you know what it pens in. An arbitrary-looking sleep is usually somebody’s scar tissue from an outage you did not witness.',
      },
      occam: {
        stance: 'cut',
        call: 'Take it out',
        why: 'The simplest account of an uncommented sleep is that someone added it while debugging and never came back for it. Load-bearing sleeps tend to acquire comments.',
      },
      hitchens: {
        stance: 'cut',
        call: 'Take it out',
        why: 'Nobody can state what the sleep is for. A reason asserted by nobody can be dismissed without a counter-reason.',
      },
      popper: {
        stance: 'test',
        call: 'Make it forbid something',
        why: '"It might be load-bearing" rules out no observation, so it is not yet a claim. Turn it into one by naming what breaks, then go and break it.',
      },
    },
  },
  {
    id: 'study',
    title: 'The miracle intervention',
    scene:
      'A heavily shared paper reports that a five-minute breathing exercise raises exam scores by 12%. n = 38, one lab, no preregistration. Three replication attempts have since found nothing.',
    settles:
      'A preregistered, multi-site replication with a pooled n in the thousands. Note that Popper’s criterion praises this paper: it stuck its neck out and got it cut off in public, which is the system working.',
    verdicts: {
      sagan: {
        stance: 'reject',
        call: 'Do not believe it yet',
        why: 'A five-minute intervention with a double-digit effect on a heavily studied outcome is an extraordinary claim. Thirty-eight undergraduates in one building is not extraordinary evidence.',
      },
      occam: {
        stance: 'reject',
        call: 'Do not believe it yet',
        why: 'Sampling noise plus a publication filter that eats the null results requires no new mechanism. A previously unknown cognitive effect requires an entire one.',
      },
      popper: {
        stance: 'reject',
        call: 'Do not believe it yet',
        why: 'It was falsifiable, it was tested three times, and it failed. That is not a scandal, it is the criterion doing precisely its job.',
      },
      hitchens: {
        stance: 'abstain',
        call: 'Wrong tool',
        why: 'There is evidence here. It is just weak evidence. Firing Hitchens at a real if lousy dataset is how "I find this implausible" gets laundered into "this was asserted without evidence".',
      },
    },
  },
  {
    id: 'resignation',
    title: 'The abrupt resignation',
    scene:
      'A senior engineer resigns with no notice. The week before, she raised a security problem in a planning meeting and was told to take it offline. Nobody took it offline.',
    settles:
      'Ask her. The most under-used instrument in all of applied epistemics is a direct question to the one person who already knows the answer.',
    verdicts: {
      hanlon: {
        stance: 'coincidence',
        call: 'Probably unrelated',
        why: 'People resign over pay, commutes, a manager or a better offer far more often than over principle. "Take it offline" is mostly what managers say when the agenda is overrunning.',
      },
      occam: {
        stance: 'coincidence',
        call: 'Probably unrelated',
        why: 'Resignations are common and one nearby meeting is weak evidence of a link. The causal story needs a mechanism nobody in the room has actually observed.',
      },
      grey: {
        stance: 'connected',
        call: 'Assume it is connected',
        why: 'Whether she was pushed or simply gave up, an organisation that reliably buries security flags produces the same output as one that suppresses them. Read the result, not the intent.',
      },
      duck: {
        stance: 'connected',
        call: 'Assume it is connected',
        why: 'Flag raised, flag buried, flagger gone, all inside seven days. Pattern-matching is doing every bit of the work here, which is exactly the duck test’s failure mode.',
      },
    },
  },
  {
    id: 'smart-meter',
    title: 'The smart meter',
    scene:
      'Your uncle is certain the new smart meter is making him ill. He says he can feel when it is transmitting, and his headaches started the month it was installed.',
    settles:
      'Double-blind provocation studies, which have been run many times over: sufferers cannot tell a transmitting device from a dead one above chance. The headaches are real. The detection is not.',
    verdicts: {
      sagan: {
        stance: 'reject',
        call: 'Reject the mechanism',
        why: 'Detecting non-ionising radiation at household power levels through a wall would be a new human sense. That is about as extraordinary as a claim gets.',
      },
      popper: {
        stance: 'reject',
        call: 'Reject the mechanism',
        why: 'This one is beautifully falsifiable: kill the transmitter without telling him. It has been tested at scale, and the effect disappears the moment the subject cannot see the device.',
      },
      hanlon: {
        stance: 'abstain',
        call: 'Wrong tool',
        why: 'Hanlon is a razor about intent, and nobody here is lying to you. A sincere man reporting real symptoms falls outside its jurisdiction entirely.',
      },
      chesterton: {
        stance: 'abstain',
        call: 'Wrong tool',
        why: 'There is no fence. Quoting Chesterton here would be an ornate way of saying "but what if he is right", which is not an argument.',
      },
    },
  },
];

export function razorCase(id) {
  return RAZOR_CASES.find((item) => item.id === id) || RAZOR_CASES[0];
}

// Every razor the case has an opinion from, in RAZORS order.
export function razorVerdicts(caseId) {
  const entry = razorCase(caseId);
  return RAZORS.filter((razor) => entry.verdicts[razor.id]).map((razor) => ({
    ...razor,
    ...entry.verdicts[razor.id],
  }));
}

// Razors that reach a different conclusion from the same facts, kept separate
// from the ones that simply have no jurisdiction. Both are worth seeing; only
// the first group is embarrassing.
export function razorDissent(caseId, razorId) {
  const verdicts = razorVerdicts(caseId);
  const picked = verdicts.find((verdict) => verdict.id === razorId);
  if (!picked) return { picked: null, agrees: [], dissents: [], abstains: [] };
  return {
    picked,
    agrees: verdicts.filter(
      (v) => v.id !== razorId && v.stance === picked.stance,
    ),
    dissents: verdicts.filter(
      (v) => v.stance !== picked.stance && v.stance !== 'abstain',
    ),
    abstains:
      picked.stance === 'abstain'
        ? []
        : verdicts.filter((v) => v.stance === 'abstain'),
  };
}

// picks: [{ caseId, razorId }]
export function razorTally(picks) {
  const counts = {};
  let contested = 0;
  let misapplied = 0;
  picks.forEach(({ caseId, razorId }) => {
    counts[razorId] = (counts[razorId] || 0) + 1;
    const { picked, dissents } = razorDissent(caseId, razorId);
    if (dissents.length) contested += 1;
    if (picked && picked.stance === 'abstain') misapplied += 1;
  });
  const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  return {
    total: picks.length,
    contested,
    misapplied,
    distinct: ranked.length,
    favourite: ranked[0] ? razorById(ranked[0]) : null,
    favouriteCount: ranked[0] ? counts[ranked[0]] : 0,
  };
}
