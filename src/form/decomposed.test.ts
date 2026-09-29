import { describe, it, expect } from "vitest";
import { resolveDecomposedSequence, remainderCode, NOT_SURE, shouldAutoAnswerSewageDischarge } from "./decomposed";
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

describe("guided-flow structural guard (regression test for a real bug)", () => {
  // A `decomposed` sequence resolves a leftover "no to everything" case via
  // remainderCode(), which needs question.options to exist. draining_pipes
  // (kind: "yesno", no .options) used to have a 1-step `decomposed` block
  // as a "gate", and answering "No" silently resolved to NOT_SURE instead
  // of "No" — found by testing the live deployed app, not by a unit test,
  // because the bug was in a combination no existing test covered. This
  // guard makes that combination impossible to reintroduce for ANY
  // question, not just draining_pipes.
  it("only single-kind questions (which have .options) ever declare a decomposed sequence", () => {
    for (const [id, override] of Object.entries(GUIDED_OVERRIDES)) {
      if (!override.decomposed) continue;
      const question = OAH_QUESTIONS.find((q) => q.id === id)!;
      expect(question.kind, `${id} has a decomposed sequence but is kind=${question.kind}, not "single"`).toBe(
        "single"
      );
      expect(question.options?.length, `${id}'s decomposed sequence needs question.options to resolve its remainder`).toBeGreaterThan(0);
    }
  });

  it("draining_pipes is a plain yesno with no decomposed sequence, so it can actually answer 'No'", () => {
    expect(GUIDED_OVERRIDES.draining_pipes?.decomposed).toBeUndefined();
  });
});

describe("shouldAutoAnswerSewageDischarge (regression test for a real bug)", () => {
  // Bug: engine.ts used to set answers.sewage_discharge = "No" as a
  // shortcut when draining_pipes = "No", but then still rendered the
  // sewage_discharge question afterward, silently overwriting the
  // shortcut with the participant's next click. Fixed by skipping the
  // question entirely when this returns true.
  it("is true when the gate question (draining_pipes) was answered No", () => {
    expect(shouldAutoAnswerSewageDischarge({ draining_pipes: "No" })).toBe(true);
  });
  it("is false when a pipe was seen (draining_pipes = Yes)", () => {
    expect(shouldAutoAnswerSewageDischarge({ draining_pipes: "Yes" })).toBe(false);
  });
  it("is false when draining_pipes hasn't been answered yet", () => {
    expect(shouldAutoAnswerSewageDischarge({})).toBe(false);
  });
  it("is false when draining_pipes was NOT_SURE (still needs its own answer)", () => {
    expect(shouldAutoAnswerSewageDischarge({ draining_pipes: NOT_SURE })).toBe(false);
  });
});
