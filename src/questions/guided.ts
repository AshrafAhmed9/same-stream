/**
 * Guided-flow question definitions. Every entry here is a REWRITE of a real
 * OAH question in src/questions/oah-source.ts — same id, same options/codes,
 * different prompt/help/images. See docs/mapping.md for the reasoning
 * behind each change. Do not add a question here that has no matching id
 * in OAH_QUESTIONS: the study only tests rewrites, never new questions.
 */
import { OAH_QUESTIONS, type OahQuestion } from "./oah-source";

export interface GuidedOverride {
  /** Replaces `prompt`. Leave undefined to keep the original. */
  prompt?: string;
  /** Replaces `info`. */
  info?: string;
  /** Extra reference images (urban / disambiguating), appended to the original set. */
  extraReferenceImages?: string[];
  /**
   * If set, this question is asked as a short sequence of yes/no
   * sub-questions instead of one multi-option picker. The sequence must
   * resolve to exactly one of the original option codes. Implemented in
   * src/form/guidedSequence.ts.
   */
  decomposed?: {
    steps: { prompt: string; yesCode: string | null; noNextIndex?: number }[];
  };
  /** Shown once, before the question, e.g. a scale/orientation reminder. */
  preNote?: string;
}

export const GUIDED_OVERRIDES: Record<string, GuidedOverride> = {
  channel_form: {
    extraReferenceImages: ["urban/channel-form-concrete-trapezoid.jpg"],
    preNote: "The app's pictures show rural streams. Here's an urban example too.",
  },
  bank_type: {
    prompt: "Look at the banks (the sloped sides of the channel).",
    decomposed: {
      steps: [
        {
          prompt: "Is there concrete or mortar visible holding the bank together?",
          yesCode: "ART",
        },
        {
          prompt: "Are loose stones, rocks, or a wire-mesh cage (gabion) placed along the bank, with no concrete?",
          yesCode: "LAS",
          noNextIndex: -1, // falls through to NAT
        },
      ],
    },
    extraReferenceImages: ["urban/gabion-mesh-example.jpg"],
  },
  water_flow: {
    decomposed: {
      steps: [
        { prompt: "Is there no water at all in the channel?", yesCode: "DRY" },
        { prompt: "Do you see standing waves, ripples, or white water?", yesCode: "FAS" },
        { prompt: "Is the water sitting still, with no visible movement?", yesCode: "STA" },
        { prompt: "Is the surface moving but smooth, with no waves?", yesCode: "NOR" },
      ],
    },
  },
  water_color: {
    info: "This question is about how the water looks, not how it smells.",
  },
  barriers: {
    prompt: "Do you see any dam, weir, or other artificial wall crossing the stream (any size)?",
    extraReferenceImages: ["urban/small-urban-weir.jpg"],
  },
  draining_pipes: {
    prompt: "Do you see a pipe entering the stream?",
    decomposed: {
      steps: [
        { prompt: "Do you see a pipe entering the stream?", yesCode: null }, // gate; see sewage_discharge for split
      ],
    },
  },
  sewage_discharge: {
    prompt: "If there's a pipe: does what's coming out look dirty, grey, or smelly (not clear rainwater)?",
  },
  impervious_left: {
    extraReferenceImages: ["urban/impervious-threshold-example.jpg"],
  },
  impervious_right: {
    extraReferenceImages: ["urban/impervious-threshold-example.jpg"],
  },
  vegetation_type_left: {
    prompt:
      "Looking at the left margin (facing downstream), what's the tallest plant type that covers more than half the ground: under waist height, taller bushes, or full trees?",
    extraReferenceImages: ["urban/vegetation-height-scale.jpg"],
  },
  vegetation_type_right: {
    prompt:
      "Looking at the right margin (facing downstream), what's the tallest plant type that covers more than half the ground: under waist height, taller bushes, or full trees?",
    extraReferenceImages: ["urban/vegetation-height-scale.jpg"],
  },
};

/** Orientation step shown once at the start of the guided flow, before any question. */
export const ORIENTATION_STEP = {
  title: "Which way is downstream?",
  body:
    "Left and right always mean the side you'd see facing the direction the water is flowing — not your own left and right as you look at the photo. Find the direction of flow first (look for ripples, debris, or the general slope), then imagine standing in the stream facing that way.",
  image: "urban/orientation-diagram.jpg",
};

export function getGuidedQuestion(oahId: string): OahQuestion & GuidedOverride {
  const base = OAH_QUESTIONS.find((q) => q.id === oahId);
  if (!base) throw new Error(`No OAH question with id ${oahId}`);
  const override = GUIDED_OVERRIDES[oahId] ?? {};
  return {
    ...base,
    ...override,
    prompt: override.prompt ?? base.prompt,
    info: override.info ?? base.info,
    referenceImages: [
      ...(base.referenceImages ?? []),
      ...(override.extraReferenceImages ?? []),
    ],
  };
}
