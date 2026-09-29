import { describe, it, expect } from "vitest";
import { resolveDecomposedSequence, remainderCode, NOT_SURE } from "./decomposed";
import { OAH_QUESTIONS } from "../questions/oah-source";
import { GUIDED_OVERRIDES } from "../questions/guided";

const bankType = OAH_QUESTIONS.find((q) => q.id === "bank_type")!;
const bankSteps = GUIDED_OVERRIDES.bank_type!.decomposed!.steps;
const waterFlow = OAH_QUESTIONS.find((q) => q.id === "water_flow")!;
const flowSteps = GUIDED_OVERRIDES.water_flow!.decomposed!.steps;

describe("resolveDecomposedSequence: bank_type (concrete? -> stones/gabion? -> natural)", () => {
  it("resolves ART on a 'yes' to concrete", () => {
    expect(resolveDecomposedSequence(bankType, bankSteps, ["yes"])).toBe("ART");
  });
  it("resolves LAS on 'no' then 'yes' to stones/gabion", () => {
    expect(resolveDecomposedSequence(bankType, bankSteps, ["no", "yes"])).toBe("LAS");
  });
  it("falls through to NAT when both steps are 'no'", () => {
    expect(resolveDecomposedSequence(bankType, bankSteps, ["no", "no"])).toBe("NAT");
  });
  it("stops immediately at 'unsure', regardless of step", () => {
    expect(resolveDecomposedSequence(bankType, bankSteps, ["unsure"])).toBe(NOT_SURE);
    expect(resolveDecomposedSequence(bankType, bankSteps, ["no", "unsure"])).toBe(NOT_SURE);
  });
  it("every option code in bank_type is reachable", () => {
    const codes = (bankType.options ?? []).map((o) => o.code).sort();
    expect(codes).toEqual(["ART", "LAS", "NAT"].sort());
    // ART and LAS come from explicit yesCode steps; NAT is the remainder.
    expect(remainderCode(bankType, bankSteps)).toBe("NAT");
  });
});

describe("resolveDecomposedSequence: water_flow (dry? -> fast? -> stagnant? -> slow)", () => {
  it("resolves each code from its own step", () => {
    expect(resolveDecomposedSequence(waterFlow, flowSteps, ["yes"])).toBe("DRY");
    expect(resolveDecomposedSequence(waterFlow, flowSteps, ["no", "yes"])).toBe("FAS");
    expect(resolveDecomposedSequence(waterFlow, flowSteps, ["no", "no", "yes"])).toBe("STA");
    expect(resolveDecomposedSequence(waterFlow, flowSteps, ["no", "no", "no", "yes"])).toBe("NOR");
  });
  it("all 4 codes are covered by explicit steps (no implicit remainder)", () => {
    const codes = new Set((waterFlow.options ?? []).map((o) => o.code));
    const covered = new Set(flowSteps.map((s) => s.yesCode));
    expect(covered).toEqual(codes);
  });
});
