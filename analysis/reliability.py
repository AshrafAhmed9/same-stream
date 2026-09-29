"""
Reliability analysis for the "Same Stream" study.

Reads raw responses (from D1, via `worker/index.ts` /api/export, saved as
responses.json) and computes Krippendorff's alpha per arm, per the
endpoints declared in PREREGISTRATION.md. Do not change the endpoint
definitions here without adding a dated note to PREREGISTRATION.md first.

Usage:
    python analysis/reliability.py responses.json > results.json
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict

import krippendorff
import numpy as np

# Pilot participants (3, baseline-only, 29 Sep 2026) are excluded from the
# primary analysis per PREREGISTRATION.md. Fill in their real participant
# ids here once the pilot runs.
EXCLUDE_PILOT_IDS: set[str] = set()

HEALTH_RELEVANT = {"water_color", "draining_pipes", "sewage_discharge", "barriers"}


def load_responses(path: str) -> list[dict]:
    with open(path) as f:
        rows = json.load(f)
    return [r for r in rows if r["participant_id"] not in EXCLUDE_PILOT_IDS]


def build_matrix(rows: list[dict], arm: str, question_ids: list[str] | None = None,
                  site_ids: list[str] | None = None) -> tuple[np.ndarray, list[str]]:
    """
    Build a reliability_data matrix for the `krippendorff` package: shape
    (n_raters, n_units), where a unit = (site_id, question_id) pair.
    Cell value = the participant's answer code, or empty string for missing
    (the krippendorff package treats '' / nan specially — we use np.nan).
    """
    arm_rows = [r for r in rows if r["arm"] == arm]
    participants = sorted({r["participant_id"] for r in arm_rows})
    units: list[tuple[str, str]] = []
    seen = set()
    for r in arm_rows:
        for qid, ans in r["answers"].items():
            if question_ids and qid not in question_ids:
                continue
            key = (r["site_id"], qid)
            if key not in seen:
                seen.add(key)
                units.append(key)
    if site_ids:
        units = [u for u in units if u[0] in site_ids]

    unit_index = {u: i for i, u in enumerate(units)}
    matrix = np.full((len(participants), len(units)), np.nan, dtype=object)
    p_index = {p: i for i, p in enumerate(participants)}

    for r in arm_rows:
        pi = p_index[r["participant_id"]]
        for qid, ans in r["answers"].items():
            if question_ids and qid not in question_ids:
                continue
            key = (r["site_id"], qid)
            if key not in unit_index:
                continue
            ui = unit_index[key]
            # multi-select answers are joined so they're treated as a single
            # nominal category (a different combination = a different code)
            val = ans if isinstance(ans, str) else "|".join(sorted(ans))
            matrix[pi, ui] = val

    return matrix, [f"{s}::{q}" for s, q in units]


def alpha_with_ci(matrix: np.ndarray, resamples: int = 2000, seed: int = 42) -> dict:
    def compute(m):
        # krippendorff package wants missing as '*' or NaN; object dtype
        # array with np.nan works with level_of_measurement='nominal'
        try:
            return krippendorff.alpha(reliability_data=m, level_of_measurement="nominal")
        except (ZeroDivisionError, ValueError):
            return float("nan")

    point = compute(matrix)
    rng = np.random.default_rng(seed)
    n_units = matrix.shape[1]
    samples = []
    for _ in range(resamples):
        idx = rng.integers(0, n_units, size=n_units)
        a = compute(matrix[:, idx])
        if not np.isnan(a):
            samples.append(a)
    samples.sort()
    lo = samples[int(0.025 * len(samples))] if samples else float("nan")
    hi = samples[int(0.975 * len(samples))] if samples else float("nan")
    return {"alpha": point, "ci_lo": lo, "ci_hi": hi, "n_units": n_units, "n_bootstrap": len(samples)}


def not_sure_rate(rows: list[dict], arm: str) -> float:
    arm_rows = [r for r in rows if r["arm"] == arm]
    total = 0
    not_sure = 0
    for r in arm_rows:
        for qid, ans in r["answers"].items():
            total += 1
            if ans in ("I am not sure", "not_sure", "NOT_SURE"):
                not_sure += 1
    return not_sure / total if total else float("nan")


def main():
    if len(sys.argv) < 2:
        print("usage: reliability.py responses.json", file=sys.stderr)
        sys.exit(1)

    rows = load_responses(sys.argv[1])
    with open("src/study/sites.json") as f:
        sites_config = json.load(f)
    group_a = sites_config["siteGroups"]["A"]
    group_b = sites_config["siteGroups"]["B"]

    results: dict = {"generated_from": sys.argv[1], "arms": {}}

    for arm in ("baseline", "guided"):
        m_all, units_all = build_matrix(rows, arm)
        m_health, _ = build_matrix(rows, arm, question_ids=list(HEALTH_RELEVANT))
        m_overall, _ = build_matrix(rows, arm, question_ids=["overall_rating"])
        m_a, _ = build_matrix(rows, arm, site_ids=group_a)
        m_b, _ = build_matrix(rows, arm, site_ids=group_b)

        results["arms"][arm] = {
            "primary_pooled": alpha_with_ci(m_all) if m_all.size else None,
            "overall_rating": alpha_with_ci(m_overall) if m_overall.size else None,
            "health_relevant": alpha_with_ci(m_health) if m_health.size else None,
            "site_group_A": alpha_with_ci(m_a) if m_a.size else None,
            "site_group_B": alpha_with_ci(m_b) if m_b.size else None,
            "not_sure_rate": not_sure_rate(rows, arm),
            "n_participants": len({r["participant_id"] for r in rows if r["arm"] == arm}),
        }

    print(json.dumps(results, indent=2, default=lambda o: None if isinstance(o, float) and np.isnan(o) else o))


if __name__ == "__main__":
    main()
