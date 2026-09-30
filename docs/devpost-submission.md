# Devpost submission text (draft — pivoted 1 Oct 2026, no [BRACKETS] left to fill)

Written for: hackathon judges reading the Devpost project page (not a
casual reader — assume they know the OneAquaHealth app and the judging
criteria, and that they'll skim before they read).

**Pivot note (read this, not just the text below):** this draft originally
led with a measured Krippendorff's α from a real randomized study. That
study was built, deployed, and tested end-to-end, but never run on real
participants — 0, and it will stay that way before the deadline. Rather
than publish a number that doesn't exist or fabricate one, this submission
is honest about that gap and leads with what's actually true: a
protocol-grounded redesign, live drop-in compatibility with the real app,
and a finished reliability-testing harness handed to OneAquaHealth to run
themselves. See `COMPETITION.md` → "Headline pivot" for the full reasoning.

---

## Track

**Track 1: Citizen Science UX.**

## Tagline (under the project name)

OneAquaHealth's own testing found volunteers confused by the citizen
stream form. We rewrote every question against the field protocol, kept it
drop-in compatible with the real app, and built (but didn't get to run) the
reliability study to prove it.

## Inspiration

OneAquaHealth's Citizen Science App asks volunteers to assess urban
streams — channel shape, banks, pipes, vegetation, an overall
Good/Moderate/Poor rating. That data is only useful if different
volunteers looking at the same stream report the same thing. OneAquaHealth's
own Ghent pilot test (October 2025) found volunteers getting stuck on the
form's jargon. Instead of adding another feature on top of the form, we
went after the questions themselves.

## What it does

Same Stream is three things:

1. **A pixel-faithful replica of the real OneAquaHealth form** — same
   questions, same answer codes (fetched live from OneAquaHealth's own
   API), same reference images — alongside a **redesigned guided version**
   that targets specific points of confusion: which way is "downstream,"
   urban examples the app's rural illustrations don't cover, plain language
   instead of terms like "transversal barrier." 12 of 16 photo-answerable
   questions were rewritten, each one cited against OneAquaHealth's own
   field protocol definitions (`docs/mapping.md`), and every rewrite still
   emits the exact same OneAquaHealth answer code — zero new codes
   introduced, so it could be dropped into the real app without changing
   what gets stored.
2. **A randomized reliability-testing harness**, pre-registered before any
   data collection, that measures Krippendorff's alpha (the standard
   inter-rater agreement statistic) between the guided and baseline
   versions automatically, the moment real responses come in. It's live
   and fully tested end-to-end. **We did not get real participants before
   the deadline, so this submission reports no reliability result** — the
   results page is shown in its honest, real empty state, not staged. Any
   team, including OneAquaHealth's own, can point it at their volunteers
   today and get a real number.
3. **A FHIR R4 export**, validated against OneAquaHealth's own IG
   definitions via a public HAPI server (their own sandbox has been down
   since 23 Sep).

## How we built it

Static PWA (Vite + TypeScript, no framework) on Cloudflare Pages, backed
by a Cloudflare Worker + D1 for storing responses and proxying
OneAquaHealth's own citizen API (it blocks cross-origin browser calls).
Krippendorff's alpha is implemented independently in TypeScript (for the
live results page) and Python (for offline analysis), both checked against
Krippendorff's own published worked example so the two never silently
disagree — verified even though no real study data exists yet to run them
on. Full pre-registration, a question-by-question mapping back to the real
app and the OneAquaHealth field protocol, and FHIR export are all in the
repo.

## Challenges we ran into

- **We could not recruit real study participants in time**, and decided
  against two shortcuts that would have looked like a result without being
  one: synthetic/AI-generated participant data, and quietly omitting that
  the study was never run. We're disclosing this directly instead: the
  harness works, the study design was pre-registered, but the headline
  number this project was originally built around does not exist in this
  submission.
- OneAquaHealth's own FHIR sandbox has been unreachable since 23 Sep —
  validated the export against a public HAPI R4 server instead.
- The real app's questions already come with reference images, which
  changed the redesign: rather than "add pictures," the guided flow had to
  target specifically what the existing rural illustrations don't cover
  (urban concrete channels, gabion banks).

## Accomplishments we're proud of

- Every question in the app traces back to a real line in OneAquaHealth's
  own code or API, cited by source — see `docs/mapping.md`.
- Both implementations of the reliability statistic are tested against the
  same published example, in both languages, so the harness is trustworthy
  even without data to run it on yet.
- The whole system — replica form, guided form, results page, FHIR export —
  is the live, judged artifact, not a write-up: it runs against
  OneAquaHealth's real, live API today.

## What we learned

That a measurement tool without a measurement isn't the same claim, and
saying so plainly is worth more than a number we didn't earn. The harder
and more honest engineering problem by far was the redesign itself —
tracing 12 questions back to exact protocol definitions without changing a
single stored code — and that's what this submission actually stands on.

## What's next

Hand the full reliability harness and the rewrite mapping to the
OneAquaHealth team so they can run the study we didn't have time to run,
with their own volunteers, in any of the app's 7 languages.

---

## Submission checklist (competition skill's freeze gate, condensed)
- [ ] No reliability numbers anywhere in the text — none exist, and none are implied
- [ ] Video uploaded, under 5 min
- [ ] Public repo link correct: https://github.com/AshrafAhmed9/same-stream
- [ ] Live app link correct: https://same-stream.pages.dev
- [ ] Track selected as Track 1 on the Devpost form
- [ ] Screenshots attached (guided flow, mapping doc, FHIR validation, results page's real empty state)
