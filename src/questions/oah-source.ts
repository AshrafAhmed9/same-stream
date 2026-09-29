/**
 * Canonical, verbatim source of truth for the real OneAquaHealth citizen
 * science app's stream-assessment questions, extracted from the live app.
 *
 * Provenance (verified 27 Sep 2026, re-checked 29 Sep 2026):
 * - English strings: https://apps.oneaquahealth.eu/_nuxt/i18n.config.bcYbKmN2.js
 *   (bundled Vue-i18n messages, `messages.en`), saved at
 *   scratch/i18n_en.json.
 * - Answer codes: live GET requests to https://api.enora-oah.eu/api/citizens/*
 *   (no auth required; blocks cross-origin browser calls, so our app proxies
 *   through worker/index.ts instead of calling it directly from the client).
 * - Reference images: https://apps.oneaquahealth.eu/citizen/questionnaire-images/{1-20}.{png,jpg}
 *   mirrored into public/reference-photos/oah-app/.
 *
 * Every question here maps 1:1 to a real ENORA API vocabulary endpoint and a
 * real question the citizen app asks. Do not invent questions or codes.
 * If OAH changes their app, re-run scratch/fetch-oah-source.sh and diff.
 */

export type Section = "1_3" | "2_3" | "3_3";

export interface AnswerOption {
  /** Exact code from the live ENORA API vocabulary. */
  code: string;
  /** Exact label text from the live ENORA API (English). */
  label: string;
}

export type QuestionKind = "single" | "multi" | "yesno" | "number" | "text";

export interface OahQuestion {
  /** Stable id, matches the ENORA vocabulary endpoint name where one exists. */
  id: string;
  section: Section;
  kind: QuestionKind;
  /** Short field label, as shown in the app (e.g. "Channel Form"). */
  label: string;
  /** The actual question text put to the citizen. */
  prompt: string;
  /** Extra instruction text the app shows, if any. */
  info?: string;
  /** Answer options, verbatim from ENORA API + app strings. Omitted for yesno/number/text. */
  options?: AnswerOption[];
  /** Whether "I am not sure" / "I'm not sure" is offered (all single-select except a few are yes/no+notSure). */
  hasNotSure?: boolean;
  /** Reference image filename(s) the real app shows for this question, in public/reference-photos/oah-app/. */
  referenceImages?: string[];
  /**
   * Can this question be answered from a static photo set (upstream,
   * downstream, surroundings) alone, without being physically present?
   * false => excluded from the reliability study; the study only tests what
   * both arms can fairly see. This is a disclosed limitation, not a
   * silent gap: see docs/mapping.md.
   */
  photoAnswerable: boolean;
}

export const OAH_QUESTIONS: OahQuestion[] = [
  // ---- Section 1/3: "What do you see from where you stand (in ca. 100m)?" ----
  {
    id: "channel_form",
    section: "1_3",
    kind: "single",
    label: "Channel Form",
    prompt: "The channel form is...",
    hasNotSure: true,
    referenceImages: ["1.png"],
    photoAnswerable: true,
    options: [
      { code: "FLAT", label: "Flat (A)" },
      { code: "U", label: "U Shape (B)" },
      { code: "V", label: "V Shape (C)" },
    ],
  },
  {
    id: "channel_type", // ENORA vocab name for "Bottom Type" is channel_types
    section: "1_3",
    kind: "single",
    label: "Bottom Type",
    prompt: "The bottom of the wet channel is…",
    hasNotSure: true,
    referenceImages: ["2.png"],
    photoAnswerable: false, // usually submerged / not visible in a surface photo
    options: [
      { code: "NAT", label: "Natural (A)" },
      { code: "ART", label: "Artificial (concrete or stones with concrete) (B)" },
    ],
  },
  {
    id: "bank_type",
    section: "1_3",
    kind: "single",
    label: "Bank Type",
    prompt: "The banks of the channel are…",
    hasNotSure: true,
    referenceImages: ["3.png"],
    photoAnswerable: true,
    options: [
      { code: "NAT", label: "Natural (A)" },
      { code: "ART", label: "Artificial (concrete or stones with concrete) (B)" },
      { code: "LAS", label: "Layed stones with no concrete (C)" },
    ],
  },
  {
    id: "habitats",
    section: "1_3",
    kind: "multi",
    label: "Habitats",
    prompt: "The habitats present are…",
    info: "You may select several types of habitats.",
    referenceImages: ["4.png"],
    photoAnswerable: true,
    options: [
      { code: "SB", label: "Sand banks (A)" },
      { code: "SI", label: "Sand islands (B)" },
      { code: "SD", label: "Stone deposits (C)" },
      { code: "RF", label: "Riffles, rapids, falls (D)" },
      { code: "AV", label: "Aquatic vegetation (E)" },
    ],
  },
  {
    id: "fallen_biomass", // "Natural Debris"
    section: "1_3",
    kind: "multi",
    label: "Natural Debris",
    prompt: "There are…",
    info: "You may select several types of natural debris.",
    referenceImages: ["5.png"],
    photoAnswerable: true,
    options: [
      { code: "FT", label: "Fallen trees (A)" },
      { code: "FB", label: "Fallen branches (B)" },
      { code: "FL", label: "Deposits of fallen leaves (C)" },
    ],
  },
  {
    id: "water_flow",
    section: "1_3",
    kind: "single",
    label: "Water Flow",
    prompt: "How is the water flowing",
    hasNotSure: true,
    referenceImages: ["6.png"],
    photoAnswerable: true,
    options: [
      { code: "FAS", label: "Fast (with waves or high velocity) (A)" },
      { code: "NOR", label: "Slow (B)" },
      { code: "STA", label: "Stagnant/intermittent (C)" },
      { code: "DRY", label: "Dry (D)" },
    ],
  },

  // ---- Section 2/3 ----
  {
    id: "water_color", // "Water Aspect"
    section: "2_3",
    kind: "single",
    label: "Water Aspect",
    prompt: "How is the water?",
    hasNotSure: true,
    referenceImages: ["7.png"],
    photoAnswerable: true,
    options: [
      { code: "CL", label: "Clear/transparent (A)" },
      { code: "MU", label: "Muddy/turbid (B)" },
      { code: "FO", label: "Has foam (C)" },
      { code: "CO", label: "Has colors/altered color (D)" },
    ],
  },
  {
    id: "water_withdrawal",
    section: "2_3",
    kind: "yesno",
    label: "Water Withdrawal",
    prompt: "Is there any kind of obvious water collection, use, removal from the stream?",
    hasNotSure: true,
    referenceImages: ["8.jpg"],
    photoAnswerable: false, // needs local knowledge, rarely visible in one photo
  },
  {
    id: "barriers",
    section: "2_3",
    kind: "yesno",
    label: "Barriers",
    prompt:
      "Do you see any dams or other transversal artificial barriers (see some examples in images provided)?",
    hasNotSure: true,
    referenceImages: ["9.png"],
    photoAnswerable: true,
  },
  {
    id: "draining_pipes",
    section: "2_3",
    kind: "yesno",
    label: "Draining Pipes",
    prompt: "Are there pipes draining polluted water into the stream?",
    hasNotSure: true,
    referenceImages: ["10.jpg"],
    photoAnswerable: true,
  },
  {
    id: "sewage_discharge",
    section: "2_3",
    kind: "yesno",
    label: "Sewage discharge",
    prompt: "Is there any kind of water entry or discharge of sewage?",
    hasNotSure: true,
    referenceImages: ["11.jpg", "12.jpg"],
    photoAnswerable: true,
  },
  {
    id: "construction",
    section: "2_3",
    kind: "yesno",
    label: "Construction",
    prompt: "Is there any construction/works in stream?",
    hasNotSure: true,
    photoAnswerable: true,
  },
  {
    id: "water_height",
    section: "2_3",
    kind: "number",
    label: "Water height",
    prompt: "What is the water height?",
    info: "Give your estimate in meters (m).",
    referenceImages: ["13.jpg"],
    photoAnswerable: false, // needs a scale reference / being physically present
  },

  // ---- Section 3/3: "In the margins/riparian zone (5-10m from the channel banktop)" ----
  {
    id: "impervious_left",
    section: "3_3",
    kind: "yesno",
    label: "Impervious Areas (Left)",
    prompt:
      "Is more than one third of the left margin covered by impervious areas (such as roads, sidewalks or buildings)?",
    hasNotSure: true,
    referenceImages: ["14.png"],
    photoAnswerable: true,
  },
  {
    id: "impervious_right",
    section: "3_3",
    kind: "yesno",
    label: "Impervious Areas (Right)",
    prompt:
      "Is more than one third of the right margin covered by impervious areas (such as roads, sidewalks or buildings)?",
    hasNotSure: true,
    referenceImages: ["15.png"],
    photoAnswerable: true,
  },
  {
    id: "vegetation_left",
    section: "3_3",
    kind: "yesno",
    label: "Vegetation (Left)",
    prompt: "Is the left margin covered by vegetation?",
    hasNotSure: true,
    referenceImages: ["16.png"],
    photoAnswerable: true,
  },
  {
    id: "vegetation_type_left",
    section: "3_3",
    kind: "single",
    label: "Vegetation Type (Left)",
    prompt:
      "Which vegetation is dominant (meaning that it covers more than 50%, or half) in the left margin (first 5 meters from the channel banktop)?",
    info: "Don't forget to look to the left vegetation when in the downstream direction",
    hasNotSure: true,
    referenceImages: ["17.png"],
    photoAnswerable: true,
    options: [
      { code: "H", label: "Herbs (A)" },
      { code: "B", label: "Shrubs (B)" },
      { code: "T", label: "Trees (C)" },
    ],
  },
  {
    id: "vegetation_right",
    section: "3_3",
    kind: "yesno",
    label: "Vegetation (Right)",
    prompt: "Is the right margin covered by vegetation?",
    hasNotSure: true,
    referenceImages: ["18.png"],
    photoAnswerable: true,
  },
  {
    id: "vegetation_type_right",
    section: "3_3",
    kind: "single",
    label: "Vegetation Type (Right)",
    prompt:
      "Which vegetation is dominant (meaning that it covers more than 50%, or half) in the right margin (first 5 meters from the channel bank/top)?",
    info: "Don't forget to look to the right vegetation when in the downstream direction",
    hasNotSure: true,
    referenceImages: ["19.png"],
    photoAnswerable: true,
    options: [
      { code: "H", label: "Herbs (A)" },
      { code: "B", label: "Shrubs (B)" },
      { code: "T", label: "Trees (C)" },
    ],
  },
  {
    id: "invasive_species",
    section: "3_3",
    kind: "yesno",
    label: "Invasive Species",
    prompt: "Do you see any non-native or invasive plant species?",
    hasNotSure: true,
    photoAnswerable: false, // requires species identification, out of scope for this study
  },
  {
    id: "vegetation_cut",
    section: "3_3",
    kind: "yesno",
    label: "Vegetation Cuts",
    prompt:
      "Have there been recent cuts if vegetation (partial or total) on the banks (or just one of the banks) of the stream?",
    hasNotSure: true,
    referenceImages: ["20.png"],
    photoAnswerable: false, // needs recency knowledge, not reliably visible
  },
];

/** The final overall rating question (Feedback 1/2 in the real app). */
export interface OverallRating {
  code: "GOOD" | "MODERATE" | "POOR";
  label: string;
  description: string;
}

export const OVERALL_RATINGS: OverallRating[] = [
  {
    code: "GOOD",
    label: "Good quality",
    description:
      "The ecosystem components are there: riparian vegetation, natural channel, good water quality, biodiversity",
  },
  {
    code: "MODERATE",
    label: "Moderate quality",
    description:
      "Some alterations, still biodiverse, with vegetation in the margins, water looks good...",
  },
  {
    code: "POOR",
    label: "Poor quality",
    description:
      "Highly modified / artificialized, loss of riparian vegetation, loss of habitats, polluted",
  },
];

/**
 * Questions included in the reliability study. Excludes questions that
 * cannot be fairly answered from a fixed photo set (see photoAnswerable).
 * This is a disclosed study limitation (docs/mapping.md), not a silent
 * omission — the excluded questions are listed there with the reason.
 */
export const STUDY_QUESTIONS: OahQuestion[] = OAH_QUESTIONS.filter(
  (q) => q.photoAnswerable
);

export const EXCLUDED_QUESTIONS: OahQuestion[] = OAH_QUESTIONS.filter(
  (q) => !q.photoAnswerable
);
