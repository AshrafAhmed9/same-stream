import { describe, it, expect } from "vitest";
import { nominalAlpha } from "./krippendorff";

describe("nominalAlpha", () => {
  it("matches Krippendorff's (2011) worked nominal example (alpha ≈ 0.743)", () => {
    // "Computing Krippendorff's Alpha-Reliability", Table 1. 4 observers,
    // 12 units, nominal data, missing values as null.
    const A = ["1", "2", "3", "3", "2", "1", "4", "1", "2", null, null, null];
    const B = ["1", "2", "3", "3", "2", "2", "4", "1", "2", "5", null, "3"];
    const C = [null, "3", "3", "3", "2", "3", "4", "2", "2", "5", "1", null];
    const D = ["1", "2", "3", "3", "2", "4", "4", "1", "2", "5", "1", null];
    const alpha = nominalAlpha([A, B, C, D]);
    expect(alpha).toBeCloseTo(0.743, 2);
  });

  it("returns 1 for perfect agreement", () => {
    const a = ["X", "Y", "X", "Y"];
    const b = ["X", "Y", "X", "Y"];
    expect(nominalAlpha([a, b])).toBeCloseTo(1, 6);
  });

  it("returns a value near 0 for chance-level agreement with balanced categories", () => {
    // Two raters who systematically disagree on every unit (worst case for
    // 2 categories: alpha goes negative, not just to 0) — sanity check that
    // it's well below 1, not that it hits an exact target.
    const a = ["X", "X", "Y", "Y", "X", "Y"];
    const b = ["Y", "Y", "X", "X", "Y", "X"];
    const alpha = nominalAlpha([a, b]);
    expect(alpha).toBeLessThan(0);
  });

  it("ignores units with fewer than 2 non-missing ratings", () => {
    const a = ["X", "Y", null];
    const b = ["X", "Y", "Z"]; // unit 3 has only 1 rating -> excluded
    expect(nominalAlpha([a, b])).toBeCloseTo(1, 6);
  });
});
