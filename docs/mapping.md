# Question mapping: OAH app → guided flow → professional protocol

This is the meaning-preservation record for the study. Every guided-flow
question is a **rewrite**, not a new question: same underlying construct,
same ENORA answer code on submit. This table exists so a reviewer — including
Dr. Feio, who wrote the underlying protocol — can check that in seconds.

Column 3 cites the OneAquaHealth *Field Sampling Protocols for Urban Stream
Ecosystems* (Calapez, Bouchali, Norte, Serra, Ramos, Schmeller, Feio; 2023;
CC-BY-4.0; Zenodo [doi.org/10.5281/zenodo.20344421](https://doi.org/10.5281/zenodo.20344421)),
which is the professional-grade version of the same hydromorphology survey
the citizen app simplifies. Where the citizen category maps cleanly onto a
professional one, that is strong evidence the citizen question is measuring
a real, previously-validated construct — the disagreement we're finding is
in how the question is *asked*, not in whether the construct is meaningful.

| OAH citizen question | ENORA codes | Professional protocol anchor (Annex I) | Guided-flow rewrite | What changed |
|---|---|---|---|---|
| Channel Form: "The channel form is..." | FLAT / U / V | (no direct professional equivalent; channel cross-section shape is implicit in the substrate/bank tables) | Same 3-option picture choice, but reference images now include one real urban concrete-trapezoid photo alongside the original illustrations, since the app's own reference image (`1.png`) shows only rural cross-sections | Added an urban example; no wording or code change |
| Bottom Type: "The bottom of the wet channel is…" | NAT / ART | Substrate types present in the channel: BE/BO/ST/G/SA/MU/OM vs **AR: Artificial** | *Excluded from the study* — not reliably visible in a surface photo | — |
| Bank Type: "The banks of the channel are…" | NAT / ART / LAS | Substrate in the banks: EA (earth/soil), **ST (layed stones, not compacted by concrete)**, GA (gabion), **CC (concrete or similar)** | Same 3 options, decomposed into a yes/no sequence: "Is there any concrete or mortar visible on the banks?" → ART if yes; else "Are loose stones or a wire-mesh gabion placed along the bank?" → LAS if yes; else NAT. Reference set now includes a real gabion-mesh photo, since the app's illustrated option C is ambiguous between loose stones and mesh gabion | Decomposed into sequential binary checks matching the protocol's own EA/ST/GA/CC logic; added a gabion photo |
| Habitats: "The habitats present are…" | SB / SI / SD / RF / AV | Not in Annex I directly (closer to the macrophyte/substrate presence tables) | Same 5 checkboxes, each with its own thumbnail instead of one composite reference image | Per-option imagery, no wording change |
| Natural Debris: "There are…" | FT / FB / FL | — | Unchanged | — |
| Water Flow: "How is the water flowing" | FAS / NOR / STA / DRY | Flow types: **RI** (riffles/unbroken standing waves) ≈ FAS, **RU** (runs, no waves) ≈ NOR, **PO/NP** (pools/no perceptible flow) ≈ STA, **D** (dry) = DRY | Same 4 options, reworded to the protocol's own operational test: "Do you see standing waves or ripples?" → Fast; "Is the surface moving but smooth?" → Slow; "Is the water sitting still?" → Stagnant; "No water in the channel?" → Dry | Wording anchored to the protocol's flow-type definitions instead of subjective "fast/slow" |
| Water Aspect: "How is the water?" | CL / MU / FO / CO | — | Unchanged options; added a "this is not about smell" note, since pilot testers conflated "colors/altered color" with odor | Clarifying note only |
| Barriers: "Do you see any dams or other transversal artificial barriers?" | Yes/No | **Barriers to longitudinal connectivity** (number of weirs/dams) — direct match | Unchanged wording; reference photo set expanded (small urban weirs, not just large dams, since the app's example image shows only large dam structures) | Added small-weir example photos |
| Draining Pipes / Sewage discharge | Yes/No each | **Outflows** (pipes/similar discharging pluvial waters) — direct match | Combined into one guided screen: "Do you see any pipe entering the stream?" then a follow-up "Does it look like it's carrying dirty/grey water, or rainwater?" splits into the two original codes | Sequential disambiguation of two questions citizens conflate (pilot finding) |
| Water Withdrawal | Yes/No | **Intakes** (pipes/similar abstracting water) — direct match | *Excluded from the study* — rarely visible in a single photo without local knowledge | — |
| Impervious Areas (L/R) | Yes/No each | Land cover / catchment characterization (GIS, §2.2) — professionally done by GIS, not visually estimated by volunteers | Unchanged question; added a worked example photo showing the "1/3 of margin" threshold marked | Visual anchor for the 1/3 threshold |
| Vegetation present (L/R) | Yes/No each | Riparian vegetation cover categories | Unchanged | — |
| Vegetation Type (L/R): "Which vegetation is dominant... (first 5 meters)" | H / B / T | Riparian vegetation height categories: **Herbaceous <1.5m**, **Shrubby 1.5–3m**, **Arboreal >3m** — exact match | Unchanged options; reworded from "dominant (>50%)" to the protocol's own height-band language plus a photo showing a human-height reference for scale | Height-band anchor image |
| Invasive/non-native species | Yes/No | Non-native species column exists per vegetation type, but requires species ID | *Excluded from the study* — requires identification skill, not a fair photo-only test | — |
| Vegetation Cuts | Yes/No | — | *Excluded from the study* — requires recency knowledge not visible in one photo | — |
| Overall rating | GOOD / MODERATE / POOR | Not a single professional field — it's the citizen's own gestalt judgement | Unchanged question and descriptions; guided flow adds an evidence recap screen immediately before it, listing the citizen's own prior answers next to the three OAH definitions | Recap only, no wording change to the rating question itself |

## What we did *not* change
No guided-flow question invents new categories, drops an ENORA code, or
changes what gets written to the OAH schema. Every submission — baseline or
guided arm — produces the exact same field names and codes the real API
expects (see `src/questions/oah-source.ts`), and both arms can be exported to
FHIR through the same code path (`src/lib/fhir.ts`).

## Excluded questions, and why
Five questions are excluded from the reliability study because they can't be
fairly answered from a static photo set by either arm: `channel_type`
(bottom type — usually submerged), `water_withdrawal`, `water_height`,
`invasive_species` (needs species ID), `vegetation_cut` (needs recency
knowledge). This is disclosed as a study limitation, not silently dropped —
see `PREREGISTRATION.md` and the README.
