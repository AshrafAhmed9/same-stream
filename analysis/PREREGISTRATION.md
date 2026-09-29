# Pre-registration: "Same Stream" reliability study

Committed to git before any participant data was collected. The git log
timestamp on this file is the proof of pre-registration — do not edit the
hypotheses or endpoints below after data collection starts; append
deviations in a dated note at the bottom instead.

## Research question
Do volunteers using OneAquaHealth's real citizen stream-assessment questions
agree with each other more when the flow is redesigned around measured
failure points, compared with a faithful replica of the current form?

## Design
- Between-subjects. Each participant is randomly assigned to exactly one
  arm (`baseline` or `guided`) on first visit, persisted for their session.
- Each participant answers the study-eligible questions
  (`src/questions/oah-source.ts` → `STUDY_QUESTIONS`, 16 questions) for all
  8 sites in `src/study/sites.json`, in a randomized site order per
  participant, plus the overall Good/Moderate/Poor rating per site.
- Option order within each question is randomized per participant (not per
  site) to avoid position bias; "not sure" is always listed last.
- A 3-person pilot (baseline arm only, think-aloud) ran before the guided
  flow was finalized. Pilot responses are excluded from the primary
  analysis — see `analysis/reliability.py` `EXCLUDE_PILOT_IDS`.

## Primary endpoint
Krippendorff's α (nominal, bootstrap 95% CI, 2000 resamples over
sites×raters) computed separately for the `baseline` and `guided` arms,
pooled across all 16 study questions plus the overall rating (17 items
total), each unit-of-analysis = one (site, question) pair with one rating
per participant in that arm.

**Hypothesis:** α(guided) > α(baseline), with non-overlapping 95% CIs.

## Secondary endpoints (all pre-specified, reported regardless of outcome)
1. α on the overall Good/Moderate/Poor rating alone.
2. α on the health-relevant subset: `water_color`, `draining_pipes`,
   `sewage_discharge`, `barriers`.
3. "Not sure" rate per arm (proportion of answers where offered and chosen).
4. Accuracy on the 2 anchor sites (`sites.json` → `anchor: true`) against
   the recorded `anchorKey`, for the unambiguous fields only
   (`bank_type`, `impervious_left/right`, `vegetation_left/right`).
5. Median completion time per site, per arm.
6. Single Ease Question (1–5) and confidence (1–5) per arm, asked once at
   the end.

## Sensitivity analysis
Re-run the primary endpoint with "not sure" recoded as a disagreement
category (rather than excluded), to check the result isn't an artifact of
who says "not sure" instead of guessing.

## Second situation (replication check)
Re-run the primary endpoint separately on `siteGroups.A` (Oslo-heavy +
Ghent) and `siteGroups.B` (Toulouse + Coimbra + Benevento) from
`sites.json`. A result that only holds in one group is reported as such,
not averaged away.

## Stopping rule
- Recruit 1–2 Oct 2026, target ≥5 completed participants per arm (≥10
  total), extend to 2 Oct 18:00 IST if under 8 total by 2 Oct 09:00 IST.
- No peeking-and-stopping: the analysis script is not run on partial data
  to decide whether to keep collecting, only completion counts are checked.

## Exclusions
- Pilot participants (3, baseline-only, 29 Sep).
- Any session with <50% of sites completed.
- Any session completed in under 90 seconds total (implausibly fast).

## What would make us report a null/negative result honestly
If α(guided) is not greater than α(baseline), or CIs overlap, the headline
becomes: "here is the first measured reliability table for the OAH citizen
form, including which questions guidance did not fix" — not a forced win.
The per-question table is reported either way.

## Deviations from this pre-registration (append-only, dated)
_(none yet)_
