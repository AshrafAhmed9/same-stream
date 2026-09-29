# Video script (target: 3:30–4:00, hard ceiling 5:00)

Judges stop watching at the time limit (competition skill: "Stay under the
time limit"). This script is timed conservatively under it. Fill in the
bracketed numbers from `analysis/results.json` once the study closes —
never leave a placeholder number in the final recording.

Screen-record at 1080p, participant's own device audio optional. Ashraf
narrates live over screen capture — no need for a polished voiceover
booth, clarity matters more than production value.

---

## 0:00–0:15 — The harm (cold open, no logo, no intro slide)

**Visual:** Split screen, two phones side by side, same real stream photo
on both.

**Say:** "This is one stream. Two OneAquaHealth volunteers looked at it
and used the app's real form. [SHOW: one answers 'U-shaped, natural
banks', the other answers 'flat, artificial banks' — same photo]. If a
city can't tell whether that's the same report or two different streams,
the data can't drive a decision."

## 0:15–0:45 — What OneAquaHealth's citizen data is for, and why this matters

**Visual:** Quick cut to the real OAH app (apps.oneaquahealth.eu) — the
real question list, the real Good/Moderate/Poor rating screen.

**Say:** "OneAquaHealth's Citizen Science App asks volunteers to assess
urban streams: channel shape, banks, pipes, vegetation, an overall
rating. Researchers and city managers use that to decide where to look
closer, where sewage might be reaching a stream, where habitat is
degrading. That only works if different people looking at the same
stream report the same thing. Nobody had measured whether they do — so
we did."

## 0:45–1:30 — The live product: guided flow

**Visual:** Screen-record the actual deployed app (same-stream.pages.dev),
guided arm, live: orientation step → a decomposed bank-type question with
the real gabion photo → the evidence recap before the overall rating.

**Say:** "We built an exact replica of the current form — same questions,
same codes, pulled live from OneAquaHealth's own API — and a redesigned
version that targets exactly where people get confused: which way is
downstream, urban examples the app's rural pictures don't show, plain
language instead of 'transversal barrier'. Then we ran both as a
randomized study: [N] volunteers, one arm each, rating the same 8 real
streams in OneAquaHealth's own research cities."

## 1:30–2:15 — The number, against the baseline

**Visual:** Cut to the live results page (same-stream.pages.dev/#/results).

**Say:** "This is Krippendorff's alpha — the standard measure of
inter-rater agreement, zero is chance, one is perfect agreement. With the
current form: [BASELINE ALPHA]. With the guided flow: [GUIDED ALPHA].
[IF POSITIVE: That's a measurable jump in whether two volunteers agree —
on the same real streams, same questions, same codes.] [IF NULL: The
result didn't move on the pooled measure — but broken down by question,
here's exactly which ones did and didn't, which is itself new information
OneAquaHealth didn't have.]"

**Visual:** Per-question table, health-relevant subset number.

**Say:** "On the questions that matter most for health — visible pipes,
sewage, water condition — agreement is [HEALTH ALPHA]. [Add one honest
sentence about the anchor-site accuracy check: agreement isn't just
everyone converging on the same wrong answer.]"

## 2:15–2:45 — One limit, stated plainly

**Say:** "Two honest limits: this ran on photos, not the field, so both
arms saw identical media — that keeps the comparison fair, but it isn't
the same as standing at the stream. And with [N] participants the
confidence intervals are still wide — [SHOW CI on screen]. We're
reporting that, not hiding it."

## 2:45–3:15 — What we're handing back to OneAquaHealth

**Visual:** `docs/mapping.md` scrolling briefly, then the FHIR export
validation result (`docs/fhir-export.md`).

**Say:** "Every guided question maps 1-to-1 back to the real app's
question and OneAquaHealth's own field protocol — nothing here is
invented. The guided flow emits the exact same answer codes, so it could
drop straight into the real app. And every response can export as FHIR,
validated against a public HAPI server since OneAquaHealth's own sandbox
has been down. We're sending the reliability table and the urban
reference photos to the OneAquaHealth team before the deadline, whether
or not we win."

## 3:15–3:30 — Close

**Say:** "This is Same Stream — Track 1. Live at same-stream.pages.dev,
code and the full pre-registration at
github.com/AshrafAhmed9/same-stream."

---

## Recording checklist
- [ ] Real α numbers pulled from `analysis/results.json`, not placeholders
- [ ] Screen-record at 1080p minimum
- [ ] Total runtime under 5:00, ideally 3:30–4:00
- [ ] Upload to YouTube (unlisted is fine) before pasting into Devpost
- [ ] Caption/subtitle if time allows (accessibility, judged under UX)
