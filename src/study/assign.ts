import { mulberry32, shuffle, randomSeed } from "../lib/rng";
import sitesConfig from "./sites.json";
import { STUDY_QUESTIONS } from "../questions/oah-source";

export type Arm = "baseline" | "guided";

export interface ParticipantState {
  participantId: string;
  arm: Arm;
  seed: number;
  siteOrder: string[];
  /** Per-question option order (question id -> shuffled option codes). */
  optionOrder: Record<string, string[]>;
  consentedAt: string;
  createdAt: string;
}

const STORAGE_KEY = "same-stream:participant";

function uuid(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Assigns arm + randomization once per browser, persisted in localStorage.
 * A returning participant (same browser) keeps their original assignment —
 * we never re-randomize mid-study, since that would break the between-subjects design. */
export function getOrCreateParticipant(): ParticipantState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as ParticipantState;
    } catch {
      /* fall through and recreate */
    }
  }

  const seed = randomSeed();
  const rand = mulberry32(seed);
  const arm: Arm = rand() < 0.5 ? "baseline" : "guided";

  const siteIds = sitesConfig.sites.map((s) => s.id);
  const siteOrder = shuffle(siteIds, rand);

  const optionOrder: Record<string, string[]> = {};
  for (const q of STUDY_QUESTIONS) {
    if (!q.options) continue;
    const codes = q.options.map((o) => o.code);
    optionOrder[q.id] = shuffle(codes, rand);
  }

  const state: ParticipantState = {
    participantId: uuid(),
    arm,
    seed,
    siteOrder,
    optionOrder,
    consentedAt: "",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function markConsented(state: ParticipantState): ParticipantState {
  const updated = { ...state, consentedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetParticipant() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSites() {
  return sitesConfig.sites;
}

export function getSiteById(id: string) {
  return sitesConfig.sites.find((s) => s.id === id);
}
