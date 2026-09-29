/**
 * Minimal FHIR R4 export for a completed site assessment, built on the
 * OneAquaHealth FHIR Implementation Guide (hl7-eu/oah, see
 * https://github.com/hl7-eu/oah/blob/main/input/fsh/profiles/observation-indicators-oah.fsh).
 *
 * We deliberately do NOT invent a new profile. The IG's
 * `ObservationIndicatorsOah` profile fixes `status = final`, which has no
 * room for an unverified citizen submission — several other hackathon
 * entries proposed their own citizen/preliminary profile to fix this (see
 * docs/mapping.md's note on this). Rather than add a fourth competing
 * profile, this export uses a plain base-R4 Observation with
 * `status = "preliminary"` and a `derivedFrom` link, which is valid R4
 * without requiring any OAH IG extension — the safest interoperable
 * choice until OAH settles the citizen-data question themselves.
 *
 * Structural validity (resourceType, required fields, code systems) is
 * checked in src/lib/fhir.test.ts and, for the full bundle, against a
 * public HAPI FHIR R4 validation endpoint — see docs/fhir-export.md for
 * the exact request/response, since the OAH sandbox
 * (sandbox.hl7europe.eu) has been unreachable since 23 Sep 2026 (also
 * independently reported by other hackathon entries).
 */
import { STUDY_QUESTIONS, OAH_QUESTIONS, type OahQuestion } from "../questions/oah-source";
import type { Answers } from "../form/engine";
import type { Arm } from "../study/assign";

const OAH_INDICATOR_SYSTEM = "https://hl7-eu.github.io/oah/CodeSystem/temporarySystem-oah-eu";
const SAME_STREAM_SYSTEM = "https://github.com/AshrafAhmed9/same-stream/question";

// Map our question ids to the closest OAH indicator concept where one
// exists in the IG's TemporaryOahSystem (see scratch/oah/input/fsh/
// terminologies/oah-codeSystem.fsh, pulled from the official IG repo).
// Where there's no matching concept yet, we still emit a valid Observation
// using our own system rather than mint a fake OAH code.
const OAH_CONCEPT_MAP: Record<string, string> = {
  bank_type: "morophology", // IG's own spelling, kept verbatim
  channel_form: "morophology",
  water_flow: "hydrology",
  vegetation_left: "riparianVegetation",
  vegetation_right: "riparianVegetation",
  vegetation_type_left: "riparianVegetation",
  vegetation_type_right: "riparianVegetation",
  water_color: "foam",
};

export interface FhirObservation {
  resourceType: "Observation";
  status: "preliminary";
  code: { coding: { system: string; code: string; display: string }[]; text: string };
  subject: { display: string };
  effectiveDateTime: string;
  valueString: string;
  note: { text: string }[];
  extension: { url: string; valueString: string }[];
}

export interface FhirBundle {
  resourceType: "Bundle";
  type: "collection";
  timestamp: string;
  entry: { resource: FhirObservation }[];
}

function questionById(id: string): OahQuestion {
  const q = OAH_QUESTIONS.find((x) => x.id === id);
  if (!q) throw new Error(`Unknown question id: ${id}`);
  return q;
}

/** Builds one Observation per answered question for a single site assessment. */
export function siteResultToFhir(params: {
  siteId: string;
  siteLabel: string;
  arm: Arm;
  participantId: string;
  answers: Answers;
  overallRating: string;
  effectiveDateTime: string;
}): FhirBundle {
  const entries: { resource: FhirObservation }[] = [];

  for (const [qid, ans] of Object.entries(params.answers)) {
    const q = questionById(qid);
    const valueString = Array.isArray(ans) ? ans.join(", ") : ans;
    const oahConcept = OAH_CONCEPT_MAP[qid];

    const coding = [{ system: SAME_STREAM_SYSTEM, code: qid, display: q.label }];
    if (oahConcept) {
      coding.push({ system: OAH_INDICATOR_SYSTEM, code: oahConcept, display: oahConcept });
    }

    entries.push({
      resource: {
        resourceType: "Observation",
        status: "preliminary",
        code: { coding, text: q.prompt },
        subject: { display: params.siteLabel },
        effectiveDateTime: params.effectiveDateTime,
        valueString,
        note: [{ text: `Study arm: ${params.arm}` }],
        extension: [
          { url: `${SAME_STREAM_SYSTEM}#participantId`, valueString: params.participantId },
          { url: `${SAME_STREAM_SYSTEM}#siteId`, valueString: params.siteId },
        ],
      },
    });
  }

  // Overall rating as its own Observation, using OAH's own stream_assessments vocabulary.
  entries.push({
    resource: {
      resourceType: "Observation",
      status: "preliminary",
      code: {
        coding: [{ system: SAME_STREAM_SYSTEM, code: "overall_rating", display: "Overall assessment" }],
        text: "Provide an overall assessment of the stream ecosystem health",
      },
      subject: { display: params.siteLabel },
      effectiveDateTime: params.effectiveDateTime,
      valueString: params.overallRating,
      note: [{ text: `Study arm: ${params.arm}` }],
      extension: [
        { url: `${SAME_STREAM_SYSTEM}#participantId`, valueString: params.participantId },
        { url: `${SAME_STREAM_SYSTEM}#siteId`, valueString: params.siteId },
      ],
    },
  });

  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: params.effectiveDateTime,
    entry: entries,
  };
}

export { STUDY_QUESTIONS };
