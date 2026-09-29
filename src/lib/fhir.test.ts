import { describe, it, expect } from "vitest";
import { siteResultToFhir } from "./fhir";

describe("siteResultToFhir", () => {
  const bundle = siteResultToFhir({
    siteId: "ghent-reep-canal",
    siteLabel: "Reep, Ghent",
    arm: "guided",
    participantId: "p-test-1",
    answers: { bank_type: "ART", habitats: ["SB", "SD"] },
    overallRating: "POOR",
    effectiveDateTime: "2026-09-29T12:00:00Z",
  });

  it("produces a valid R4 Bundle of type collection", () => {
    expect(bundle.resourceType).toBe("Bundle");
    expect(bundle.type).toBe("collection");
    expect(bundle.timestamp).toBe("2026-09-29T12:00:00Z");
  });

  it("emits one Observation per answered question plus the overall rating", () => {
    // 2 answers (bank_type, habitats) + 1 overall_rating = 3
    expect(bundle.entry).toHaveLength(3);
    for (const e of bundle.entry) {
      expect(e.resource.resourceType).toBe("Observation");
      expect(e.resource.status).toBe("preliminary"); // never "final" — see fhir.ts header comment
      expect(e.resource.code.coding.length).toBeGreaterThan(0);
    }
  });

  it("joins multi-select answers into a single valueString", () => {
    const habitats = bundle.entry.find((e) => e.resource.code.coding.some((c) => c.code === "habitats"));
    expect(habitats?.resource.valueString).toBe("SB, SD");
  });

  it("tags known indicators with the real OAH IG code system and concept code", () => {
    const bankType = bundle.entry.find((e) => e.resource.code.coding.some((c) => c.code === "bank_type"));
    const oahCoding = bankType?.resource.code.coding.find((c) =>
      c.system.includes("hl7-eu.github.io/oah")
    );
    expect(oahCoding?.code).toBe("morophology"); // verified against the live IG's own spelling
  });

  it("never invents an OAH code for a question with no mapped concept", () => {
    // "habitats" has no entry in OAH_CONCEPT_MAP — must not get a fabricated OAH coding.
    const habitats = bundle.entry.find((e) => e.resource.code.coding.some((c) => c.code === "habitats"));
    const oahCoding = habitats?.resource.code.coding.find((c) => c.system.includes("hl7-eu"));
    expect(oahCoding).toBeUndefined();
  });

  it("records participant and site as extensions, not in clinical fields", () => {
    const first = bundle.entry[0].resource;
    const ext = Object.fromEntries(first.extension.map((e) => [e.url.split("#")[1], e.valueString]));
    expect(ext.participantId).toBe("p-test-1");
    expect(ext.siteId).toBe("ghent-reep-canal");
  });
});
