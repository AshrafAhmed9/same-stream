import { nominalAlpha, bootstrapAlphaCI } from "../lib/krippendorff";
import { STUDY_QUESTIONS } from "../questions/oah-source";
import { API_BASE } from "../lib/api";
import sitesConfig from "../study/sites.json";

interface RawRow {
  participant_id: string;
  arm: "baseline" | "guided";
  site_id: string;
  question_id: string;
  answer: string;
}

const HEALTH_RELEVANT = ["water_color", "draining_pipes", "sewage_discharge", "barriers"];

function buildMatrix(
  rows: RawRow[],
  arm: string,
  opts: { questionIds?: string[]; siteIds?: string[] } = {}
): (string | null)[][] {
  const filtered = rows.filter(
    (r) =>
      r.arm === arm &&
      (!opts.questionIds || opts.questionIds.includes(r.question_id)) &&
      (!opts.siteIds || opts.siteIds.includes(r.site_id))
  );
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

/** Anchor-site accuracy: for each anchor site's unambiguous fields, what
 * fraction of answers matched the recorded answer key? This checks that
 * high agreement isn't just "everyone converging on the same wrong
 * answer" — see PREREGISTRATION.md secondary endpoint 4. */
function anchorAccuracy(rows: RawRow[], arm: string): { n: number; correct: number } {
  let n = 0;
  let correct = 0;
  for (const site of sitesConfig.sites) {
    if (!site.anchor || !("anchorKey" in site)) continue;
    const key = (site as any).anchorKey as Record<string, string>;
    for (const [qid, expected] of Object.entries(key)) {
      const answers = rows.filter((r) => r.arm === arm && r.site_id === site.id && r.question_id === qid);
      for (const a of answers) {
        n++;
        if (a.answer === expected) correct++;
      }
    }
  }
  return { n, correct };
}

function notSureRate(rows: RawRow[], arm: string): { n: number; notSure: number } {
  const filtered = rows.filter((r) => r.arm === arm);
  const notSure = filtered.filter((r) => r.answer === "NOT_SURE").length;
  return { n: filtered.length, notSure };
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
  const baselineOverall = bootstrapAlphaCI(buildMatrix(rows, "baseline", { questionIds: ["overall_rating"] }));
  const guidedOverall = bootstrapAlphaCI(buildMatrix(rows, "guided", { questionIds: ["overall_rating"] }));
  const baselineHealth = bootstrapAlphaCI(buildMatrix(rows, "baseline", { questionIds: HEALTH_RELEVANT }));
  const guidedHealth = bootstrapAlphaCI(buildMatrix(rows, "guided", { questionIds: HEALTH_RELEVANT }));

  const groupA = sitesConfig.siteGroups.A;
  const groupB = sitesConfig.siteGroups.B;
  const baselineA = bootstrapAlphaCI(buildMatrix(rows, "baseline", { siteIds: groupA }));
  const guidedA = bootstrapAlphaCI(buildMatrix(rows, "guided", { siteIds: groupA }));
  const baselineB = bootstrapAlphaCI(buildMatrix(rows, "baseline", { siteIds: groupB }));
  const guidedB = bootstrapAlphaCI(buildMatrix(rows, "guided", { siteIds: groupB }));

  const baselineAnchor = anchorAccuracy(rows, "baseline");
  const guidedAnchor = anchorAccuracy(rows, "guided");
  const baselineNotSure = notSureRate(rows, "baseline");
  const guidedNotSure = notSureRate(rows, "guided");

  const perQuestionRows = STUDY_QUESTIONS.map((q) => {
    const b = nominalAlpha(buildMatrix(rows, "baseline", { questionIds: [q.id] }));
    const g = nominalAlpha(buildMatrix(rows, "guided", { questionIds: [q.id] }));
    return `<tr><td>${q.label}</td><td>${Number.isNaN(b) ? "—" : b.toFixed(2)}</td><td>${Number.isNaN(g) ? "—" : g.toFixed(2)}</td></tr>`;
  }).join("");

  const fmtAcc = (a: { n: number; correct: number }) => (a.n === 0 ? "no data yet" : `${a.correct}/${a.n} correct (${Math.round((100 * a.correct) / a.n)}%)`);
  const fmtNotSure = (a: { n: number; notSure: number }) => (a.n === 0 ? "no data yet" : `${Math.round((100 * a.notSure) / a.n)}% (${a.notSure}/${a.n})`);

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
      <h2>Secondary: health-relevant questions</h2>
      <p class="muted">Water aspect, pipes, sewage discharge, barriers — the
      questions most likely to feed a One Health decision.</p>
      <p><strong>Baseline:</strong> ${fmtAlpha(baselineHealth)}</p>
      <p><strong>Guided:</strong> ${fmtAlpha(guidedHealth)}</p>
    </div>

    <div class="card">
      <h2>Secondary: anchor-site accuracy</h2>
      <p class="muted">2 sites have an unambiguous answer key (see
      src/study/sites.json). This checks agreement isn't just everyone
      converging on the same wrong answer.</p>
      <p><strong>Baseline:</strong> ${fmtAcc(baselineAnchor)}</p>
      <p><strong>Guided:</strong> ${fmtAcc(guidedAnchor)}</p>
    </div>

    <div class="card">
      <h2>Secondary: "not sure" rate</h2>
      <p><strong>Baseline:</strong> ${fmtNotSure(baselineNotSure)}</p>
      <p><strong>Guided:</strong> ${fmtNotSure(guidedNotSure)}</p>
    </div>

    <div class="card">
      <h2>Replication check: two independent site groups</h2>
      <p class="muted">Group A: Oslo ×3 + Ghent. Group B: Toulouse ×2 +
      Coimbra + Benevento. A result that only holds in one group is
      reported as such, not averaged away.</p>
      <table class="results-table">
        <thead><tr><th>Group</th><th>Baseline α</th><th>Guided α</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>${fmtAlpha(baselineA)}</td><td>${fmtAlpha(guidedA)}</td></tr>
          <tr><td>B</td><td>${fmtAlpha(baselineB)}</td><td>${fmtAlpha(guidedB)}</td></tr>
        </tbody>
      </table>
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
