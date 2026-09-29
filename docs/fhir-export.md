# FHIR export: what it is, and how it was checked

`src/lib/fhir.ts` turns one completed site assessment into a FHIR R4
`Bundle` of `Observation` resources — one per answered question, plus the
overall rating. See that file's header comment for why it uses a plain
base-R4 `Observation` (`status: "preliminary"`) instead of inventing a new
OAH IG profile: the IG's own `ObservationIndicatorsOah` profile fixes
`status = final`, which has no room for unverified citizen data, and five
other hackathon entries have already each proposed their own competing fix
for that same gap (see the competitive survey referenced in
`COMPETITION.md`). Adding a sixth wasn't going to help OAH; using what
already validates was the safer, more useful choice.

## What's real
- The two OAH indicator concept codes used (`morophology`, `hydrology`,
  `riparianVegetation`, `foam` — spelled exactly as in the live IG,
  including OAH's own typo in "morophology") were checked against the
  actual current file in the `hl7-eu/oah` repo, not memorized:
  `curl https://raw.githubusercontent.com/hl7-eu/oah/master/input/fsh/terminologies/oah-codeSystem.fsh`
  — see `OAH_CONCEPT_MAP` in `src/lib/fhir.ts` for the exact mapping, and
  `docs/mapping.md` for why each question maps where it does.
- Every field in the exported bundle comes from the same production code
  path the app itself calls (`siteResultToFhir`), not a hand-written
  fixture — `scratch/gen-fhir-sample.mjs` calls the real function.

## Validation: OAH sandbox down, used a public HAPI server instead
The official `sandbox.hl7europe.eu` OAH FHIR sandbox did not resolve from
our network on 27–29 Sep 2026 (confirmed independently by two other
hackathon entries as down since 23 Sep). Routed around it: validated the
exported bundle's 4 Observations against the public HAPI FHIR R4 test
server's `$validate` operation instead (`hapi.fhir.org/baseR4`), 29 Sep
2026:

```
Observation 0 (bank_type):      0 errors, 4 warnings
Observation 1 (water_flow):     0 errors, 4 warnings
Observation 2 (habitats):       0 errors, 3 warnings
Observation 3 (overall_rating): 0 errors, 3 warnings
```

**Zero structural errors** across all 4. The warnings are expected and
benign: "CodeSystem is unknown and can't be validated" fires for any
externally-hosted code system the validator hasn't indexed (true of nearly
every real-world FHIR system reference, including OAH's own), and the
`dom-6` warning ("resource should have narrative") is a best-practice
suggestion, not a validity requirement.

## Reproducing this check
```bash
npx tsx scratch/gen-fhir-sample.mjs > sample-bundle.json   # generates from real code
# then POST each entry.resource to https://hapi.fhir.org/baseR4/Observation/$validate
```
(`scratch/` is gitignored working space; the generator script content is
reproduced in this repo's CI, see `.github/workflows/ci.yml`.)
