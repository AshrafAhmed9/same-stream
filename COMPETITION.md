# OneAquaHealth IEEE Global Hackathon 2026 — "Same Stream"

## Headline (written before building)
> Two volunteers looking at the same stream should report the same thing. We
> measured how often they do with today's OneAquaHealth form, then redesigned
> it until they did.
- Number it rests on (vs which baseline): Krippendorff's α, guided flow vs a
  pixel-faithful replica of the current OAH citizen form, on the 12
  photo-answerable questions plus the overall Good/Moderate/Poor rating.
- Who gets hurt without it: OAH scientists and city managers who can't act on
  citizen ratings when two volunteers disagree on the same stream; first-time
  and older volunteers who give up on jargon (documented in the Ghent app
  test, Oct 2025).
- Still accurate at freeze? — TBD, check before freeze.

## Facts
- Competition type: engineering-judged hackathon (Devpost).
- Deadline: 4 Oct 2026, 9:00pm PDT = 5 Oct 2026, 09:30 IST.
- Freeze date: 3 Oct 2026, 20:00 IST.
- Results date: 24 Oct 2026 (IEEE iGET conference).
- Judged artifact: Devpost submission — track statement, description, 3–5 min
  video, public GitHub repo, working prototype/demo.
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
  This plan aims to beat that base rate with evidence the field lacks (real
  user testing), not by assuming it.

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
     calls → must proxy through our Worker. Proxy built and tested: see
     `worker/index.ts`. ✅ / ⬜ (update once proxy deployed+tested live)
   - HL7 FHIR OAH sandbox (`sandbox.hl7europe.eu`): DNS did not resolve on 27
     Sep 2026, confirmed down (also independently reported by 2 competitor
     repos as down since 23 Sep). Routed around: FHIR export validated
     against the public `hl7-eu/oah` IG definitions offline / via HAPI public
     test server instead of the OAH sandbox. Accepted risk, recorded below.
   - Cloudflare Pages + Workers + D1: account authenticated
     (ashrafahmed1232@gmail.com), confirmed via `wrangler whoami`. ⚠️ NOTE:
     this is not the userEmail on file for this session
     (dev.thejobsjungle2@gmail.com) — confirm with Ashraf which account should
     own the deployed submission before final freeze, since Devpost judges
     will visit the live URL under this account.
   - Recruiting 10–15 real participants: Ashraf's responsibility, in progress
     as of 29 Sep.
7. Ashraf approved the idea after seeing 3 candidates (T1 reliability study,
   T4 storytelling, T6 rain-flag) with reasoning, plus 2 data-only fallbacks
   (invasive-plant shortlist, One Health storytelling). Chose the reliability
   study. ✅

## Criteria
| Criterion | Weight | Strategy | Evidence shown |
|---|---|---|---|
| Impact & OAH alignment | 30% | Named harm (untrustworthy citizen data blocks real use); real OAH health-risk data on the benefit screen; findings handed back to OAH | Video ≤15s harm statement; benefit screen; findings doc sent to office@oneaquahealth.eu |
| Innovation & Creativity | 20% | First controlled reliability study of the OAH form; reusable reliability-testing harness (config-driven, any question set) | Harness code + README; pre-registration timestamp in git history |
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
- Pre-freeze re-count and decision: ⬜ TODO — re-run `gh search repos` on
  2 Oct and check the Devpost gallery once published.

## Claims
| Claim | Verifiable proof | Built? | Where a judge sees it |
|---|---|---|---|
| Guided flow improves inter-rater agreement | Krippendorff's α, guided vs baseline replica, bootstrap 95% CI, pre-registered before data collection | ⬜ | Results page (live data) + video + README |
| Guided flow preserves meaning (isn't just easier-to-agree-on-anything) | Anchor sites with unambiguous answer keys; accuracy reported alongside agreement | ⬜ | Results page, `docs/mapping.md` |
| Drop-in compatible with real OAH app | Answer codes fetched live from ENORA API vocabularies, not hardcoded | ⬜ | Worker proxy code + live API call in demo |
| FHIR-exportable | Passes HL7 R4 structural validation against `hl7-eu/oah` IG (via public HAPI, since OAH sandbox is down) | ⬜ | `analysis/` or `src/lib/fhir.ts` + validator output in README |

## Critical path and limitations
| Dependency or limitation | Proven live? | Routed around | If not, why |
|---|---|---|---|
| OAH citizen-app question text/codes | ✅ 27 Sep | — | — |
| ENORA API (sites, vocab, health-risk) | ✅ 27 Sep (curl) | Proxy needed for browser CORS | Worker proxy in progress |
| HL7 OAH FHIR sandbox | ❌ down 23–27 Sep | Validate against public HAPI test server instead | Sandbox outage confirmed by 2 independent competitor repos |
| 10–15 real study participants | ⬜ in progress | — | Ashraf recruiting 29 Sep–2 Oct |
| Small n (10–15) → wide CIs | N/A | Bootstrap CIs reported honestly; anchor sites; pooled primary endpoint; per-question results marked indicative | Accepted risk — see below |
| Photos, not field visits | N/A | Both arms see identical media, so comparison stays fair; limit stated explicitly in video/README | Accepted risk — Ashraf declined field visits |

## Overruled concerns
- Ashraf declined field site visits (no time/logistics). Accepted: study runs
  on CC-licensed photos of real OAH-city streams (Commons), both arms
  identical media, limit disclosed at the edge, not in the core claim.
- Ashraf declined AI-simulated participants (correctly — would be fabricated
  evidence and likely detected by a judge who co-designed the human protocol).
  Real recruitment required instead.

## Freeze gate
(Fill in with evidence — file paths, command output, URLs, video timestamps —
before submitting. Do not mark "done" without evidence.)
1. Competition type — engineering-judged, all items apply. ⬜
2. Base rate stated — see Facts. ⬜
3. Field re-counted before freeze — ⬜
4. Finished project still matches headline; 6 kill tests still pass — ⬜
5. Judged artifact runs the real core capability (no mock) — ⬜
6. One proof per core claim, shown twice — ⬜
7. Headline number beats naive baseline, visible in first 30s — ⬜
8. Limits shown at the edges — ⬜
9. Real inputs, not fixtures — ⬜
10. Most precise unit — ⬜
11. Sponsor tech (FHIR) contribution measured — ⬜
12. Every claim visible in judged artifact, not just repo — ⬜
13. Every prize bucket entered and confirmed — ⬜
14. Build froze on 3 Oct with reserve intact — ⬜
15. Live artifact protected until results (Cloudflare free tier, no spend cap needed but monitor) — ⬜
16. Compared against earlier winner research — ⬜
17. Submission surface at the bar, no more time spent — ⬜

## Post-results review
(Fill in after 24 Oct 2026 results announcement.)
