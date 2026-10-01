# Same Stream

**Track 1: Citizen Science UX — OneAquaHealth IEEE Global Hackathon 2026**

**Live study:** https://same-stream.pages.dev
**Live results:** https://same-stream.pages.dev/#/results

## The problem

OneAquaHealth's [Citizen Science App](https://apps.oneaquahealth.eu/login)
asks volunteers to assess urban streams: channel shape, bank type, water
flow, visible pipes, vegetation, an overall Good/Moderate/Poor rating. That
data only helps researchers if different volunteers looking at the same
stream report the same thing. OneAquaHealth's own Ghent pilot (Oct 2025)
found volunteers getting stuck on the form's wording.

## What this is

Three pieces:

1. **A guided version of the form.** 11 of the 16 photo-answerable
   questions change: 8 are reworded or split into yes/no sequences (bank
   type, water flow, pipes and the like), and 3 keep their wording but gain
   an urban reference image the app's rural illustrations lack. There is
   also an explicit "which way is downstream" step up front. Every rewrite still produces
   the exact answer code the real app expects, so nothing new gets stored.
   [`docs/mapping.md`](docs/mapping.md) maps each one back to the original
   question and to OneAquaHealth's field protocol.
2. **A reliability-testing harness.** A randomized A/B setup: each
   participant sees either a replica of the current form or the guided
   version, rates the same 8 real stream photos, and the results page
   computes Krippendorff's α per arm with bootstrap confidence intervals.
   The design is pre-registered in
   [`analysis/PREREGISTRATION.md`](analysis/PREREGISTRATION.md).
3. **A FHIR R4 export** of a completed assessment, checked against the
   public HL7 validator (see [`docs/fhir-export.md`](docs/fhir-export.md)).

**The study has not been run.** No participants took part, so there is no
agreement result for either arm and the results page shows its empty state.
The harness is tested end to end (including the statistics, checked against
Krippendorff's own worked example) and is ready for anyone with volunteers
to point at it.

## What's real here

- **The questions**: extracted verbatim from the live app's own code
  (`apps.oneaquahealth.eu/_nuxt/i18n.config.*.js`) — see
  `src/questions/oah-source.ts`.
- **The answer codes**: fetched live from OneAquaHealth's own API
  (`api.enora-oah.eu/api/citizens/*`) through our Worker proxy
  (`worker/index.ts` → `/api/oah/*`), not hardcoded — so if OAH changes a
  vocabulary, this app stays in sync.
- **The reference images**: mirrored directly from the live app.
- **The study sites**: 8 real, CC-licensed photographs of streams in
  OneAquaHealth's own research cities (Oslo, Toulouse, Ghent, Coimbra,
  Benevento) — full credits in `media/CREDITS.md`.
- **The statistics**: Krippendorff's α, implemented independently in both
  TypeScript (`src/lib/krippendorff.ts`, for the live results page) and
  Python (`analysis/reliability.py`, for offline analysis), both checked
  against Krippendorff's own published worked example (α = 0.743) in
  `src/lib/krippendorff.test.ts` and `analysis/tests/test_reliability.py`.

## Architecture

```
src/                  static PWA (Vite + vanilla TypeScript, no framework)
  questions/          OAH_QUESTIONS = source of truth; guided.ts = rewrites
  study/              arm assignment, randomization, site config
  form/               the screen-by-screen study engine
  results/            live results page (fetches raw rows, computes α client-side)
  lib/                seeded RNG, Krippendorff's alpha, API base
worker/               Cloudflare Worker: D1-backed submission + ENORA proxy
analysis/             pre-registration + Python reliability analysis (offline analysis)
docs/mapping.md       every guided question ↔ original OAH question ↔ protocol citation
```

Deployed on Cloudflare Pages (static site) + Cloudflare Workers + D1
(responses), all on free tiers.

## Running locally

```bash
npm install
npm run dev            # frontend, http://localhost:5173
npm run worker:dev      # worker, http://localhost:8787 (needs wrangler login)
npm test                 # vitest — includes the Krippendorff cross-check
```

## Limits

- No study data exists. Nothing in this repo claims the guided form improves
  agreement; that is the question the harness exists to answer.
- The 8 study sites are photos, not field visits.
- 5 of the 21 OAH questions can't be answered from a photo and are out of
  scope.
- OneAquaHealth's FHIR sandbox was unreachable during development, so the
  export was validated against a public HAPI server instead.
