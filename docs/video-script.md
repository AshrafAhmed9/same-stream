# Video script (target: 3:00–3:30, hard ceiling 5:00)

**Pivoted 1 Oct 2026.** The original script led with a measured Krippendorff's
α from a real randomized study. That study was never run — 0 real
participants, and it will stay that way (see `COMPETITION.md`, "Headline
pivot"). This version does not reference any participant numbers, because
there are none, and never fabricates or implies data that doesn't exist.
Judges stop watching at the time limit (competition skill: "Stay under the
time limit").

Screen-record at 1080p, participant's own device audio optional. Ashraf
narrates live over screen capture — no need for a polished voiceover booth,
clarity matters more than production value.

---

## 0:00–0:15 — The harm (cold open, no logo, no intro slide)

**Visual:** The real OneAquaHealth app's citizen form, a jargon-heavy
question on screen (e.g. "transversal barrier").

**Say:** "OneAquaHealth's own citizen-app testing in Ghent, October 2025,
found volunteers getting stuck on questions like this. If people can't
answer confidently, city managers and scientists can't trust what they
report."

## 0:15–0:45 — What OneAquaHealth's citizen data is for

**Visual:** Quick cut to the real OAH app — the question list, the
Good/Moderate/Poor rating screen.

**Say:** "OneAquaHealth's Citizen Science App asks volunteers to assess
urban streams: channel shape, banks, pipes, vegetation, an overall rating.
Researchers use that to decide where to look closer — where sewage might be
reaching a stream, where habitat is degrading. That only works if the
questions are actually clear."

## 0:45–1:45 — The live product: guided flow, rewritten against the protocol

**Visual:** Screen-record the actual deployed app (same-stream.pages.dev),
guided arm, live: orientation step → a decomposed bank-type question with
the real gabion photo → the evidence recap before the overall rating.

**Say:** "We rewrote every photo-answerable question in the form — 12 of
16 — against OneAquaHealth's own field protocol definitions, not guesses.
[SHOW docs/mapping.md scrolling] Each rewrite cites exactly which protocol
definition it's grounded in, and every single one still produces the exact
same answer code the real app expects — zero new codes. [SHOW the live
ENORA API call returning the real vocabulary] This isn't a mockup: it pulls
live from OneAquaHealth's own API, so it's drop-in compatible with the real
app today."

## 1:45–2:30 — What's honestly NOT here yet

**Visual:** The live results page (same-stream.pages.dev/#/results) showing
its real empty state.

**Say:** "We also built a full reliability-testing harness — a randomized
A/B study, pre-registered before any data collection, that measures whether
volunteers agree with each other more using the guided version versus the
real form. It's live, it's tested end-to-end, and it computes Krippendorff's
alpha automatically the moment real responses come in. [SHOW the empty
results page] But we're not going to show you a number here, because we
didn't get real participants in time. We'd rather say that plainly than
fake it. OneAquaHealth — or any future team — can run this study with their
own volunteers starting today, in any of the app's 7 languages, with zero
setup beyond pointing it at their own question set."

## 2:30–3:00 — What we're handing back to OneAquaHealth

**Visual:** FHIR export validation result (`docs/fhir-export.md`).

**Say:** "Every response can export as FHIR R4, validated against
OneAquaHealth's own IG definitions via a public HAPI server, since
OneAquaHealth's own sandbox has been down. We're sending the full rewrite
mapping and the reliability harness to the OneAquaHealth team before the
deadline, whether or not we win."

## 3:00–3:15 — Close

**Say:** "This is Same Stream — Track 1. Live at same-stream.pages.dev,
code, the full pre-registration, and an honest account of what was and
wasn't tested, at github.com/AshrafAhmed9/same-stream."

---

## Recording checklist
- [ ] No participant numbers, α values, or CIs anywhere in the video — none exist
- [ ] Results page shown in its real empty state, not staged
- [ ] Screen-record at 1080p minimum
- [ ] Total runtime under 5:00, ideally 3:00–3:30
- [ ] Upload to YouTube (unlisted is fine) before pasting into Devpost
- [ ] Caption/subtitle if time allows (accessibility, judged under UX)
