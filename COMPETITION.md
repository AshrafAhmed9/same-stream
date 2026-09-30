# OneAquaHealth IEEE Global Hackathon 2026 — "Same Stream"

## Headline (PIVOTED 1 Oct 2026 — see "Headline pivot" note below)
> OneAquaHealth's own Ghent pilot (Oct 2025) found volunteers confused by the
> citizen stream form's jargon. We rewrote every ambiguous question against
> the field protocol's own definitions, kept every answer drop-in compatible
> with the live ENORA API, and built the first reliability-testing harness
> for the OAH form — randomized, pre-registered, ready for OAH to run with
> real volunteers.
- Number it rests on (vs which baseline): 12 of 16 photo-answerable
  questions rewritten with a protocol-cited justification
  (`docs/mapping.md`), 0 new answer codes introduced — 100% of rewrites
  verified against the live ENORA vocabulary.
- Who gets hurt without it: OAH scientists and city managers who can't trust
  citizen ratings when volunteers interpret jargon differently; first-time
  and older volunteers who give up on the current form's terms (Ghent test,
  Oct 2025).
- Still accurate at freeze? — TBD, check before freeze.

### Headline pivot (1 Oct 2026) — read this before trusting anything above the line
The original headline measured Krippendorff's α, guided flow vs baseline,
from a real randomized study (target 10–15 participants). **That study was
never run — 0 participants, ever.** Ashraf has no access to real recruits
before the 3 Oct freeze and explicitly declined both (a) spending effort on
recruitment channels that don't require personal contacts (hackathon
Slack/Discord, r/SampleSize, citizen-science forums — drafted and offered)
and (b) AI-simulated/synthetic participant data (correctly rejected twice as
fabricated evidence — see Overruled concerns).

**This is a real, material downgrade, not a framing change.** The pre-freeze
field re-count (29 Sep) found 0 of 31 competing repos ran any controlled
human reliability study — that was this submission's single strongest,
hardest-to-replicate differentiator, and the entire Innovation/Impact case
rested on having *measured* something no one else had. Without real data:
- Kill test 2 ("the number") no longer rests on a measured outcome, only on
  a static rewrite-count, which is real but far weaker evidence.
- Kill test 6 ("who gets hurt") is now argued from the Ghent report, not
  demonstrated live in our own data.
- Freeze gate items 6, 7, 9 (proof per claim / baseline / real inputs) fail
  for the reliability claim specifically — recorded as an accepted risk
  below, not hidden in a limitations footnote.
- Honest placement estimate: **dropped from "aims to beat the ~2–3% base
  rate on unique evidence" to roughly base-rate or below it.** The
  differentiator that justified expecting better than base rate is gone; a
  reusable pre-registered tool that was never run is real engineering value
  but is a materially weaker, more common submission shape (a
  well-built proof-of-concept) than "here is a real measured result no one
  else has."
- What still stands, and is real: the protocol-grounded rewrite mapping, the
  live ENORA drop-in compatibility, the validated FHIR export, and a working
  harness OAH could literally run themselves. These are genuinely built,
  tested, and deployed — not vaporware. They are just a smaller claim than
  the one originally planned.

## Facts
- Competition type: engineering-judged hackathon (Devpost).
- Deadline: 4 Oct 2026, 9:00pm PDT = 5 Oct 2026, 09:30 IST.
- Freeze date: 3 Oct 2026, 20:00 IST.
- Results date: 24 Oct 2026 (IEEE iGET conference).
- Judged artifact: Devpost submission — track statement, description, 3–5 min
  video, public GitHub repo, working prototype/demo.
- **Live links (29 Sep 2026):** app https://same-stream.pages.dev · worker
  https://same-stream.ashrafahmed1232.workers.dev · repo
  https://github.com/AshrafAhmed9/same-stream
- Judges: Maria João Feio (OAH coordinator, wrote the protocols), Alexander
  Nikolov (SYNYO, runs hackathon), Pradyumna Kodgi (Oracle), Gora Datta (FHIR),
  David E. González, Vinay Sharma, Sreekanth Reddy Panyam, George Koutalieris
  (ENORA — built the app/API), Harm op den Akker & Ângela Freitas (SHINE
  2Europe — co-designed the citizen protocol, ran app evaluations).
- Entrants: 1,089 registered (Devpost updates page, 27 Sep 2026). Public
  gallery not yet published. Estimated 150–300 submissions from registrant
  count and typical hackathon conversion.
- Prizes: 5 cash places total (1st $1,500, runner-up $1,000, 2nd runner-up
  $500, 2 special mentions $250 each) + certificates/IEEE membership perks.
- Honest placement estimate: ~2–3% base rate (5 places / ~150–300 entries).
  **Updated 1 Oct 2026 after the headline pivot (see above): no longer
  expecting to beat this base rate.** The evidence that would have beaten it
  (a real measured reliability result, unique in the field) was never
  collected. Placement now rests on execution quality of a well-built,
  honestly-scoped tool, which is ordinary, not differentiated.

## Kickoff gate
1. Rules/scoring/judges/artifact — read from source, recorded above. ✅
2. Prize buckets — listed above with status (see table below). ✅
3. Field counted: 27 public GitHub repos surveyed via `gh search` (gallery not
   yet public). Past-winner research: sibling IEEE hackathons (ClimateChain,
   AI Dev Hack 2025) have no comparable domain precedent; judged on rules
   criteria only. Exclusion list: generic FHIR-export-of-citizen-data (13
   repos already do this), "AI validates your answer" (9 repos), composite
   health-index dashboards (7 repos). ✅
4. Kill tests — see "Kill tests" section below. ✅
5. Headline sentence + number — see top of this file. ✅
6. Critical path proven live:
   - OAH citizen-app question text/codes: extracted live from
     `apps.oneaquahealth.eu/_nuxt/i18n.config.bcYbKmN2.js` (27 Sep 2026),
     confirmed exact match to app UI screenshots. ✅
   - ENORA API (`api.enora-oah.eu/api/*`): confirmed live and open, no key
     needed, for `/sites/all` (106 sites), `/citizens/stream_assessments`,
     `/resilience-map/health-risks` (96 rows). Blocks cross-origin browser
     calls → proxied through our Worker. Deployed and tested live: 29 Sep
     2026, `curl https://same-stream.ashrafahmed1232.workers.dev/api/oah/citizens/bank_types`
     returns the real vocabulary. ✅
   - HL7 FHIR OAH sandbox (`sandbox.hl7europe.eu`): DNS did not resolve on 27
     Sep 2026, confirmed down (also independently reported by 2 competitor
     repos as down since 23 Sep). Routed around: FHIR export validated
     against the public `hl7-eu/oah` IG definitions offline / via HAPI public
     test server instead of the OAH sandbox. Accepted risk, recorded below.
   - Cloudflare Pages + Workers + D1: account authenticated
     (ashrafahmed1232@gmail.com), confirmed via `wrangler whoami`. GitHub
     repo owner is also ashrafahmed1232@gmail.com's account (AshrafAhmed9).
     Account-mismatch flag from earlier in this session resolved: the
     session's own userEmail now matches (ashrafahmed1232@gmail.com), so
     both the deployed app and the repo are on Ashraf's own accounts. ✅
   - Recruiting 10–15 real participants: Ashraf's responsibility. Study is
     LIVE at https://same-stream.pages.dev as of 29 Sep 2026 evening —
     recruitment can start immediately.
7. Ashraf approved the idea after seeing 3 candidates (T1 reliability study,
   T4 storytelling, T6 rain-flag) with reasoning, plus 2 data-only fallbacks
   (invasive-plant shortlist, One Health storytelling). Chose the reliability
   study. ✅

## Criteria
| Criterion | Weight | Strategy | Evidence shown |
|---|---|---|---|
| Impact & OAH alignment | 30% | Named harm, argued from OAH's own Ghent pilot findings (not our own measured data — pivoted 1 Oct, no participant data collected); real OAH health-risk data on the benefit screen | Video harm statement citing Ghent test; benefit screen |
| Innovation & Creativity | 20% | **Downgraded 1 Oct:** reusable, pre-registered reliability-testing harness (config-driven, any question set), built and ready but never run — disclosed as future work for OAH, not a completed study | Harness code + README; pre-registration timestamp in git history; honest "not yet run" note in README/video |
| Technical Implementation | 20% | Live ENORA API integration via Worker proxy; FHIR R4 export; D1-backed study harness; automated α computation | Deployed URL; passing tests; FHIR validator output |
| UX | 15% | Guided flow redesign targeting measured failure points; urban reference photos; plain-language rewrites | Side-by-side demo in video; SUS/ease scores from pilot |
| Feasibility & Scale | 15% | Drop-in ENORA answer codes; harness reusable by OAH for any question, any language | README "how OAH could adopt this" section |

## Prize buckets
| Bucket | Requirement | Status | Confirmed with Ashraf |
|---|---|---|---|
| Track 1 (Citizen Science UX) — primary track | Guided workflow, simplified terms, data accuracy, repeat engagement | In progress | Yes (chosen 27 Sep) |
| Overall 1st/Runner-up/2nd Runner-up/Special Mention | Submit before 4 Oct deadline | Not yet submitted | — |
| IEEE Certificate of Merit / Participation | Automatic on qualifying submission | N/A until submitted | — |

## Field
- Exclusion list: generic FHIR export of citizen data (13 repos); "AI
  suggests, human decides" consistency checks (~9 repos); sampling
  prioritization tools (6 repos); composite health-index dashboards (7
  repos); Sentinel-2/remote-sensing water quality (3 repos, off-mission for
  small urban streams); US-data-instead-of-EU entries (4 repos).
- Entries sharing our mechanic (count, date): **0 of 27** surveyed repos are
  Track-1-primary. **0** run a controlled inter-rater reliability study.
  Nearest neighbors: StreamCheck (T3, rules-based consistency check, no human
  study), StreamKeepers (T5, real OAH data + 5-person SUS test — the only
  entry with any real-user evidence, but not a controlled A/B).
- Decision: proceed — genuinely open track, but treat the 27-repo survey as a
  lower bound; ~1,000 more registrants are invisible until the gallery opens.
- Pre-freeze re-count (29 Sep, via `gh search repos "oneaquahealth"`): **31
  repos** (up from 27 at kickoff). Still **0 Track-1-primary entries, 0
  controlled inter-rater reliability studies**. Nearest neighbors unchanged:
  HyunsikParker/streamcheck ("explained consistency and weather checks",
  T3-style rules-based, no human study), BriceZemba/streamkeepers (T5, real
  OAH data + 5-person SUS — still the only other entry with any real-user
  evidence, still not a controlled A/B). Decision: proceed unchanged. Final
  check against the Devpost gallery once it's public post-deadline.

## Claims
| Claim | Verifiable proof | Built? | Where a judge sees it |
|---|---|---|---|
| Guided flow improves inter-rater agreement | Krippendorff's α, guided vs baseline replica, bootstrap 95% CI, pre-registered before data collection | ✅ harness built & pre-registered, ❌ **never run — 0 participants, permanently, per the 1 Oct pivot.** Not a claim of this submission. | Results page shows the live "not enough data" path honestly; README states plainly this was designed but not executed |
| Guided flow preserves meaning (isn't just easier-to-agree-on-anything) | Anchor sites with unambiguous answer keys; accuracy reported alongside agreement | ✅ built (2 anchors, live accuracy card), ❌ no data to report — same pivot | Results page (shows empty-state honestly), `docs/mapping.md` |
| Drop-in compatible with real OAH app | Answer codes fetched live from ENORA API vocabularies, not hardcoded | ✅ deployed & curl-tested 29 Sep | Worker proxy code (`worker/index.ts`) + live `/api/oah/*` calls |
| FHIR-exportable | Passes HL7 R4 structural validation against `hl7-eu/oah` IG concepts (via public HAPI, since OAH sandbox is down) | ✅ 0 errors on all 4 generated Observations, 29 Sep | `src/lib/fhir.ts` + `docs/fhir-export.md` |
| Reliability math is correct, not just plausible | Both TS and Python implementations match Krippendorff's own published worked example (0.743) | ✅ 4 tests, both languages | `src/lib/krippendorff.test.ts`, `analysis/tests/test_reliability.py`, CI green |
| Guided-flow images are real, not silently broken | Every referenced image returns 200 on the live deploy | ✅ verified 29 Sep — found and fixed 6 broken references first | `media/CREDITS.md` |
| Rewrites are meaning-preserving, not arbitrary simplification | Every guided question maps 1:1 to the original ENORA answer code and cites the Zenodo field protocol's own definition | ✅ 12/16 photo-answerable questions rewritten, each cited | `docs/mapping.md` (this is now the submission's primary technical/UX evidence, replacing the reliability claim) |

**Status as of 1 Oct 2026 (post-pivot):** the product, study harness, FHIR
export, and analysis pipeline are all built, deployed, and tested. Real
participant data was never collected and will not be — see "Headline pivot"
above. The submission now rests on the rows marked ✅ in this table, not the
two marked ❌. Those two stay in the table, not deleted, so the gap is
visible rather than quietly dropped.

**Full end-to-end pipeline verified live, 29 Sep 2026:** 3 automated
browser sessions (2 guided, 1 baseline) ran consent → orientation (guided
only) → all 8 sites × every question type (single/multi/yesno/number,
decomposed sequences, evidence recap) → end survey → submit, against the
live deployed URL. All 3 completed with zero JS errors, and all 136
expected rows per session landed correctly in D1 (verified via
`/api/results`). The live results page correctly computed α on the
resulting data (e.g. guided pooled α = 0.78, 95% CI 0.70–0.85) and
correctly reported "not enough data yet" for the single-participant
baseline arm — proving the "not enough data" path works too, not just the
happy path. **This test data was then purged from D1** (`DELETE FROM
responses; DELETE FROM sessions;`) so it doesn't contaminate the real,
pre-registered dataset — confirmed clean via `/api/results` returning `[]`
before any real participant starts.

## Critical path and limitations
| Dependency or limitation | Proven live? | Routed around | If not, why |
|---|---|---|---|
| OAH citizen-app question text/codes | ✅ 27 Sep | — | — |
| ENORA API (sites, vocab, health-risk) | ✅ 27 & 29 Sep (curl + deployed proxy) | Proxy built and deployed | — |
| HL7 OAH FHIR sandbox | ❌ down 23–29 Sep | Validated against public HAPI R4 `$validate` instead, 0 errors | Sandbox outage confirmed by 2 independent competitor repos |
| 6 guided-flow reference images | ❌ were silently broken (onerror-hidden) as of first deploy | Found via headless-browser audit, fixed with 1 real CC photo + 5 original diagrams, redeployed & verified | Fixed same evening, 29 Sep |
| 10–15 real study participants | ❌ not started — 0/0 as of 29 Sep evening | — | **Ashraf's responsibility — the actual bottleneck now** |
| Small n (10–15) → wide CIs | N/A | Bootstrap CIs reported honestly; anchor sites; pooled primary endpoint; per-question results marked indicative | Accepted risk — see below |
| Photos, not field visits | N/A | Both arms see identical media, so comparison stays fair; limit stated explicitly in video/README | Accepted risk — Ashraf declined field visits |

## Overruled concerns
- Ashraf declined field site visits (no time/logistics). Accepted: study runs
  on CC-licensed photos of real OAH-city streams (Commons), both arms
  identical media, limit disclosed at the edge, not in the core claim.
- Ashraf declined AI-simulated participants (correctly — would be fabricated
  evidence and likely detected by a judge who co-designed the human protocol).
  Real recruitment required instead.
- 1 Oct 2026: Ashraf declined synthetic/AI-generated participant data a
  second time when re-raised under time pressure (still correctly rejected —
  same reasoning as above). Also declined the lowest-effort real-recruitment
  option (one broadcast message to existing contacts, offered as taking
  under a minute) and the free public-channel recruitment drafts (hackathon
  Slack, r/SampleSize, citizen-science forums), stating no time for any
  human recruitment. **Accepted: pivot the headline away from the
  reliability claim entirely rather than fabricate or skip evidence.** This
  is recorded as a real, material downgrade in placement expectation, not a
  neutral pivot — see "Headline pivot" note at the top of this file.

## Freeze gate
(Fill in with evidence — file paths, command output, URLs, video timestamps —
before submitting. Do not mark "done" without evidence.)
1. Competition type — engineering-judged, all items apply. ✅
2. Base rate stated — 1,089 registrants, 5 cash places, ~2–3% honest
   placement estimate. See Facts. ✅
3. Field re-counted before freeze — ✅ 29 Sep, 31 repos, 0 Track-1-primary,
   0 controlled reliability studies. See Field section above. Will re-check
   once the Devpost gallery is public.
4. Finished project still matches headline; 6 kill tests still pass —
   ✅ re-checked 29 Sep: headline (measure + fix reliability of the OAH form)
   unchanged; guided flow, baseline replica, results page, and FHIR export
   are all built exactly as scoped in the plan. Kill tests 1–5 still pass on
   inspection (one sentence, the α measurement, the demo moment, low overlap
   per the field re-count, hard-because-nobody's-run-a-controlled-study).
   Kill test 6 (who gets hurt) unchanged. ⬜ final re-check at 3 Oct freeze
   after real data lands, since the headline number itself is still pending.
5. Judged artifact runs the real core capability (no mock) — ✅ live app at
   same-stream.pages.dev runs the real study flow against a real D1 database
   and the real ENORA API (proxied), not a mock or local-only path. Verified
   by 3 full automated browser sessions completing end-to-end, 29 Sep.
6. One proof per core claim, shown twice — ⬜ blocked on real participant
   data (proof requires α computed from real sessions, shown for both the
   pooled endpoint and the anchor-site accuracy check — both wired and
   tested against synthetic sessions, awaiting real ones).
7. Headline number beats naive baseline, visible in first 30s — ⬜ blocked
   on real data; video script (docs/video-script.md) already scripts the
   number into the first 30 seconds, with [BRACKET] placeholders for the
   real value.
8. Limits shown at the edges — ✅ stated explicitly and non-buried: photos
   not field visits, excluded questions, non-OAH-volunteer participants,
   small n — see Critical path and limitations table above, and echoed in
   docs/video-script.md and docs/devpost-submission.md.
9. Real inputs, not fixtures — ✅ 8 real CC-licensed photos of real OAH-city
   streams (src/study/sites.json), real live ENORA vocabularies, not
   synthetic test fixtures.
10. Most precise unit — ✅ per-question α, not just an overall score;
    per-site anchor accuracy, not just aggregate; see docs/mapping.md and
    the results page's per-question breakdown.
11. Sponsor tech (FHIR) contribution measured — ✅ FHIR export validated
    with 0 structural errors against the real `hl7-eu/oah` IG concepts via
    public HAPI R4 `$validate`, since the OAH sandbox was down. See
    docs/fhir-export.md.
12. Every claim visible in judged artifact, not just repo — ✅ every claim
    in the table above names a judge-visible location (results page, video,
    README), not just source code.
13. Every prize bucket entered and confirmed — ⬜ **needs Ashraf**: confirm
    solo-entry eligibility and Track 1 bucket in the Devpost
    discussion/Slack before submitting.
14. Build froze on 3 Oct with reserve intact — ⬜ pending, date not yet
    reached.
15. Live artifact protected until results — ✅ Cloudflare Pages + Workers +
    D1 free tier: no scheduled jobs that burn budget, no spend cap needed
    (free tier hard-caps rather than billing), worker confirmed reachable
    29 Sep (`curl https://same-stream.ashrafahmed1232.workers.dev/api/results`
    → `[]`). Plan: spot-check the live URL every few days through 24 Oct.
16. Compared against earlier winner research — ✅ see Adversarial iteration
    log passes 5, 6, 9, 10 in the plan; judge-persona pass (9) maps directly
    to what past winners (StreamLink T7 FHIR lifecycle, StreamKeepers T5
    real-data SUS) had that this submission also has or deliberately
    doesn't compete on.
17. Submission surface at the bar, no more time spent — ⬜ pending real
    numbers; docs/video-script.md and docs/devpost-submission.md are
    drafted and ready to fill in, not yet polished further than needed.

## Post-results review
(Fill in after 24 Oct 2026 results announcement.)
