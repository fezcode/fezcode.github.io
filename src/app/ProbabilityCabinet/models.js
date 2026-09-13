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
