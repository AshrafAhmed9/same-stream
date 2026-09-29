# Same Stream

**Track 1: Citizen Science UX — OneAquaHealth IEEE Global Hackathon 2026**

**Live study:** https://same-stream.pages.dev
**Live results:** https://same-stream.pages.dev/#/results

## The problem

OneAquaHealth's [Citizen Science App](https://apps.oneaquahealth.eu/login)
asks volunteers to assess urban streams: channel shape, bank type, water
flow, visible pipes, vegetation, an overall Good/Moderate/Poor rating. That
data only helps researchers if different volunteers looking at the same
stream report the same thing. Nobody has measured whether they do.

We built a faithful replica of the real form (same questions, same answer
codes, same images — extracted directly from the live app), and a redesigned
version targeting the specific places volunteers get confused (urban cases
the app's rural illustrations don't cover, ambiguous left/right, jargon like
"impervious" and "transversal barrier"). Then we ran both as a randomized
study: volunteers rate the same 8 real stream photos, one arm per person,
and we measure inter-rater agreement (Krippendorff's α) on each.

See [`analysis/PREREGISTRATION.md`](analysis/PREREGISTRATION.md) for the
full pre-registered design, committed before any data was collected, and
[`docs/mapping.md`](docs/mapping.md) for exactly how every guided-flow
question maps back to the real app's question and OneAquaHealth's own field
protocol (so nothing here is a "new" question — every rewrite is checked
against the source).

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
  Python (`analysis/reliability.py`, for the final write-up), both checked
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
analysis/             pre-registration + Python reliability analysis (final write-up)
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

## Status

This is a live, in-progress study (see `COMPETITION.md` for the full
tracker). The results page updates in real time as responses come in — it
is not a static mockup. Final analysis, per-question reliability table, and
findings for OneAquaHealth will be added to this README before the
submission deadline.
