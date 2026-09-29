# Devpost submission text (draft — fill in [BRACKETS] from analysis/results.json before pasting)

Written for: hackathon judges reading the Devpost project page (not a
casual reader — assume they know the OneAquaHealth app and the judging
criteria, and that they'll skim before they read).

---

## Track

**Track 1: Citizen Science UX.**

## Tagline (under the project name)

Does OneAquaHealth's citizen stream form get the same answer from two
different people? We measured it, then fixed what didn't.

## Inspiration

OneAquaHealth's Citizen Science App asks volunteers to assess urban
streams — channel shape, banks, pipes, vegetation, an overall
Good/Moderate/Poor rating. That data is only useful if different
volunteers looking at the same stream report the same thing. We couldn't
find anyone who'd checked whether they do, in the app, the hackathon
sessions, or the field protocol documents — so instead of adding another
feature on top of the form, we measured the form itself.

## What it does

Same Stream is two things:

1. **A pixel-faithful replica of the real OneAquaHealth form** — same
   questions, same answer codes (fetched live from OneAquaHealth's own
   API), same reference images — run against a **redesigned version**
   that targets specific, measured points of confusion: which way is
   "downstream," urban examples the app's rural illustrations don't
   cover, plain language instead of terms like "transversal barrier."
2. **A randomized reliability study.** [N] volunteers, split between the
   two versions, each rated the same 8 real photos of streams in
   OneAquaHealth's own research cities (Oslo, Toulouse, Ghent, Coimbra,
   Benevento). We measured Krippendorff's alpha — the standard statistic
   for inter-rater agreement — for both versions, pre-registered before
   any data came in.

**Result:** baseline α = [BASELINE_ALPHA], guided α = [GUIDED_ALPHA].
[One more honest sentence once the number is in — positive result, null
result, or mixed by site group. Never state a number here without the
95% CI next to it.]

The guided flow's answers use the exact same OneAquaHealth codes, so it
could be dropped into the real app without changing what gets stored. We
also export every response as a FHIR R4 bundle, and we're sending
OneAquaHealth the per-question reliability table and our urban reference
photos, independent of the hackathon result.

## How we built it

Static PWA (Vite + TypeScript, no framework) on Cloudflare Pages, backed
by a Cloudflare Worker + D1 for storing responses and proxying
OneAquaHealth's own citizen API (it blocks cross-origin browser calls).
Krippendorff's alpha is implemented independently in TypeScript (for the
live results page) and Python (for the final analysis), both checked
against Krippendorff's own published worked example so the two never
silently disagree. Full pre-registration, question-by-question mapping
back to the real app and the OneAquaHealth field protocol, and FHIR
export are all in the repo.

## Challenges we ran into

- OneAquaHealth's own FHIR sandbox has been unreachable since 23 Sep —
  validated the export against a public HAPI R4 server instead.
- The real app's questions already come with reference images, which
  changed the redesign: rather than "add pictures," the guided flow had
  to target specifically what the existing rural illustrations don't
  cover (urban concrete channels, gabion banks).
- Recruiting real participants for a randomized study in a one-week
  hackathon window, without a field visit — solved with CC-licensed real
  photos of the actual OneAquaHealth research-city streams instead of a
  synthetic dataset.

## Accomplishments we're proud of

- Every question in the app traces back to a real line in OneAquaHealth's
  own code or API, cited by source — see `docs/mapping.md`.
- Both implementations of the reliability statistic are tested against
  the same published example, in both languages.
- The whole study — not just the write-up — is the live, judged artifact:
  the results page reads real response data, not a static mockup.

## What we learned

[Fill in after the study closes: at least one specific, named finding —
which question stayed unreliable even with guidance, or a limit the data
revealed. Follow the competition skill: publish mistakes, not just wins.]

## What's next

Send the reliability table and urban reference photos to the
OneAquaHealth team. If a question resists every rewrite we tried, that's
worth them knowing about directly, not just publishing.

---

## Submission checklist (competition skill's freeze gate, condensed)
- [ ] Real numbers substituted everywhere, no [BRACKETS] left
- [ ] Video uploaded, 3–5 min, under the limit
- [ ] Public repo link correct: https://github.com/AshrafAhmed9/same-stream
- [ ] Live app link correct: https://same-stream.pages.dev
- [ ] Track selected as Track 1 on the Devpost form
- [ ] Screenshots attached (guided flow, results page, side-by-side demo)
