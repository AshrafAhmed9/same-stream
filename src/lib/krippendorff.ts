/**
 * Krippendorff's alpha for nominal data, missing values allowed.
 * Implements the coincidence-matrix method from Krippendorff, K. (2011),
 * "Computing Krippendorff's Alpha-Reliability", so results are directly
 * comparable to the `krippendorff` Python package used in
 * analysis/reliability.py (both are checked against the same worked
 * example, alpha = 0.743, in the test suites on both sides).
 *
 * `data` is rater-major: data[raterIndex][unitIndex] = category (string) or
 * null/undefined for a missing rating. Units with fewer than 2 raters
 * contribute nothing (there's no pair to compare).
 */
export function nominalAlpha(data: (string | null | undefined)[][]): number {
  const nUnits = data[0]?.length ?? 0;
  const nRaters = data.length;

  // Coincidence matrix: o[c][k] = weighted count of (c,k) ordered pairs
  // pooled across all units, each unit's pairs weighted by 1/(n_u - 1).
  const o = new Map<string, Map<string, number>>();
  const bump = (c: string, k: string, w: number) => {
    if (!o.has(c)) o.set(c, new Map());
    const row = o.get(c)!;
    row.set(k, (row.get(k) ?? 0) + w);
  };

  let n = 0; // total pairable values = sum of n_u over included units
  for (let u = 0; u < nUnits; u++) {
    const vals: string[] = [];
    for (let r = 0; r < nRaters; r++) {
      const v = data[r][u];
      if (v !== null && v !== undefined && v !== "") vals.push(v);
    }
    const nu = vals.length;
    if (nu < 2) continue; // no pairs to contribute
    const w = 1 / (nu - 1);
    for (let i = 0; i < nu; i++) {
      for (let j = 0; j < nu; j++) {
        if (i === j) continue;
        bump(vals[i], vals[j], w);
      }
    }
    n += nu;
  }

  if (n === 0) return NaN;

  // Marginals n_c = sum_k o[c][k] (row sum, including k=c).
  const categories = Array.from(o.keys());
  const marginal = new Map<string, number>();
  for (const c of categories) {
    let sum = 0;
    for (const v of o.get(c)!.values()) sum += v;
    marginal.set(c, sum);
  }

  // Observed disagreement: off-diagonal mass / n.
  let offDiagSum = 0;
  for (const c of categories) {
    const row = o.get(c)!;
    for (const [k, v] of row) {
      if (k !== c) offDiagSum += v;
    }
  }
  const Do = offDiagSum / n;

  // Expected disagreement: sum_{c!=k} n_c*n_k / (n*(n-1))
  let expOffDiag = 0;
  for (const c of categories) {
    for (const k of categories) {
      if (c === k) continue;
      expOffDiag += (marginal.get(c) ?? 0) * (marginal.get(k) ?? 0);
    }
  }
  const De = n > 1 ? expOffDiag / (n * (n - 1)) : 0;

  if (De === 0) return Do === 0 ? 1 : NaN;
  return 1 - Do / De;
}

/** Bootstrap 95% CI by resampling units with replacement. */
export function bootstrapAlphaCI(
  data: (string | null | undefined)[][],
  resamples = 2000,
  seed = 42
): { point: number; lo: number; hi: number } {
  const nUnits = data[0]?.length ?? 0;
  const point = nominalAlpha(data);
  if (nUnits === 0 || Number.isNaN(point)) return { point, lo: NaN, hi: NaN };

  let a = seed >>> 0;
  const rand = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const samples: number[] = [];
  for (let b = 0; b < resamples; b++) {
    const idx: number[] = [];
    for (let i = 0; i < nUnits; i++) idx.push(Math.floor(rand() * nUnits));
    const resampled = data.map((raterRow) => idx.map((i) => raterRow[i]));
    const a_ = nominalAlpha(resampled);
    if (!Number.isNaN(a_)) samples.push(a_);
  }
  samples.sort((x, y) => x - y);
  const lo = samples[Math.floor(0.025 * samples.length)] ?? NaN;
  const hi = samples[Math.floor(0.975 * samples.length)] ?? NaN;
  return { point, lo, hi };
}
