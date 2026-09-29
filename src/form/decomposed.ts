/**
 * Pure logic for resolving a guided-flow decomposed yes/no sequence
 * (see src/questions/guided.ts) down to a single OAH answer code. Kept
 * separate from DOM rendering (engine.ts) so it's unit-testable without a
 * browser.
 */
import type { OahQuestion } from "../questions/oah-source";

export interface DecomposedStep {
  prompt: string;
  yesCode: string | null;
}

export const NOT_SURE = "NOT_SURE";

/** The option code implied by reaching the end of the sequence with every
 * step answered "no" — the one option none of the steps' yesCode covers. */
export function remainderCode(question: OahQuestion, steps: DecomposedStep[]): string {
  const allCodes = new Set((question.options ?? []).map((o) => o.code));
  const usedCodes = new Set(steps.map((s) => s.yesCode).filter(Boolean) as string[]);
  const remainder = [...allCodes].find((c) => !usedCodes.has(c));
  return remainder ?? steps[steps.length - 1]?.yesCode ?? NOT_SURE;
}

export type StepAnswer = "yes" | "no" | "unsure";

/**
 * Runs the sequence against a full list of pre-decided step answers
 * (used by tests to simulate a participant clicking through). Returns the
 * resolved code. Mirrors the interactive logic in engine.ts exactly: an
 * "unsure" at any step ends the sequence immediately with NOT_SURE, a
 * "yes" ends it with that step's yesCode, and running out of steps falls
 * through to remainderCode.
 */
export function resolveDecomposedSequence(
  question: OahQuestion,
  steps: DecomposedStep[],
  stepAnswers: StepAnswer[]
): string {
  for (let i = 0; i < steps.length; i++) {
    const answer = stepAnswers[i];
    if (answer === undefined) break;
    if (answer === "unsure") return NOT_SURE;
    if (answer === "yes" && steps[i].yesCode) return steps[i].yesCode!;
    // "no" -> continue to next step
  }
  return remainderCode(question, steps);
}
