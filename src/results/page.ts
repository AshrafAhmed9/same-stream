import { nominalAlpha, bootstrapAlphaCI } from "../lib/krippendorff";
import { STUDY_QUESTIONS } from "../questions/oah-source";
import { API_BASE } from "../lib/api";

interface RawRow {
  participant_id: string;
  arm: "baseline" | "guided";
  site_id: string;
  question_id: string;
  answer: string;
}

function buildMatrix(rows: RawRow[], arm: string, questionIds?: string[]): (string | null)[][] {
  const filtered = rows.filter((r) => r.arm === arm && (!questionIds || questionIds.includes(r.question_id)));
  const participants = Array.from(new Set(filtered.map((r) => r.participant_id)));
  const units = Array.from(new Set(filtered.map((r) => `${r.site_id}::${r.question_id}`)));
  const unitIndex = new Map(units.map((u, i) => [u, i]));
  const pIndex = new Map(participants.map((p, i) => [p, i]));
  const matrix: (string | null)[][] = participants.map(() => new Array(units.length).fill(null));
  for (const r of filtered) {
    const pi = pIndex.get(r.participant_id)!;
    const ui = unitIndex.get(`${r.site_id}::${r.question_id}`)!;
    matrix[pi][ui] = r.answer;
  }
  return matrix;
}

function fmtAlpha(x: { point: number; lo: number; hi: number }): string {
  if (Number.isNaN(x.point)) return "not enough data yet";
  return `α = ${x.point.toFixed(2)} (95% CI ${x.lo.toFixed(2)}–${x.hi.toFixed(2)})`;
}

export async function renderResultsPage(app: HTMLElement) {
  app.innerHTML = `<div class="card"><h1>Live results</h1><p class="muted">Loading…</p></div>`;

  let rows: RawRow[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/results`);
    rows = await res.json();
  } catch {
    app.innerHTML = `<div class="card"><h1>Live results</h1><p>Couldn't load results right now.</p><a href="#/">← Back</a></div>`;
    return;
  }

  const nBaseline = new Set(rows.filter((r) => r.arm === "baseline").map((r) => r.participant_id)).size;
  const nGuided = new Set(rows.filter((r) => r.arm === "guided").map((r) => r.participant_id)).size;

  const baselinePooled = bootstrapAlphaCI(buildMatrix(rows, "baseline"));
  const guidedPooled = bootstrapAlphaCI(buildMatrix(rows, "guided"));
  const baselineOverall = bootstrapAlphaCI(buildMatrix(rows, "baseline", ["overall_rating"]));
  const guidedOverall = bootstrapAlphaCI(buildMatrix(rows, "guided", ["overall_rating"]));

  const perQuestionRows = STUDY_QUESTIONS.map((q) => {
    const b = nominalAlpha(buildMatrix(rows, "baseline", [q.id]));
    const g = nominalAlpha(buildMatrix(rows, "guided", [q.id]));
    return `<tr><td>${q.label}</td><td>${Number.isNaN(b) ? "—" : b.toFixed(2)}</td><td>${Number.isNaN(g) ? "—" : g.toFixed(2)}</td></tr>`;
  }).join("");

  app.innerHTML = "";
  app.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card">
      <h1>Live results</h1>
      <p class="muted">${nBaseline} baseline participants · ${nGuided} guided participants ·
      updates as responses come in.</p>
      <h2>Primary endpoint: agreement across all questions</h2>
      <p><strong>Baseline (current OAH form):</strong> ${fmtAlpha(baselinePooled)}</p>
      <p><strong>Guided (redesigned flow):</strong> ${fmtAlpha(guidedPooled)}</p>
      <h2>Overall Good/Moderate/Poor rating</h2>
      <p><strong>Baseline:</strong> ${fmtAlpha(baselineOverall)}</p>
      <p><strong>Guided:</strong> ${fmtAlpha(guidedOverall)}</p>
      <p class="muted">α below 0 means worse than chance; 0 is chance; 1 is
      perfect agreement. Krippendorff's α, nominal, bootstrap 95% CI over
      2000 resamples. See analysis/PREREGISTRATION.md.</p>
    </div>
    <div class="card">
      <h2>Per-question breakdown</h2>
      <table class="results-table">
        <thead><tr><th>Question</th><th>Baseline α</th><th>Guided α</th></tr></thead>
        <tbody>${perQuestionRows}</tbody>
      </table>
      <p class="muted">Small samples early on will show wide swings — this
      table is honest, not cherry-picked.</p>
    </div>
    <div class="card">
      <a href="#/">← Take the study</a>
    </div>
  `
  );
}
