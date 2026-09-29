/**
 * Cloudflare Worker: stores study responses in D1, serves anonymized
 * results, and proxies the live ENORA/OneAquaHealth citizen API (which
 * blocks cross-origin browser requests) so the app can fetch real,
 * current answer vocabularies rather than a hardcoded copy.
 */
export interface Env {
  DB: D1Database;
}

const OAH_API_BASE = "https://api.enora-oah.eu/api";
const ALLOWED_OAH_PATHS = new Set([
  "citizens/channel_forms",
  "citizens/channel_types",
  "citizens/bank_types",
  "citizens/habitats",
  "citizens/fallen_biomass",
  "citizens/water_flows",
  "citizens/water_colors",
  "citizens/vegetation_types",
  "citizens/stream_assessments",
]);

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "content-type");
  return new Response(res.body, { status: res.status, headers });
}

function json(data: unknown, status = 200): Response {
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json" },
    })
  );
}

interface SiteResultIn {
  siteId: string;
  answers: Record<string, string | string[]>;
  overallRating: string;
  msStarted: number;
  msFinished: number;
}

interface SubmitBody {
  participantId: string;
  arm: "baseline" | "guided";
  seed: number;
  siteResults: SiteResultIn[];
  ease: number;
  confidence: number;
}

async function handleSubmit(req: Request, env: Env): Promise<Response> {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  if (!body.participantId || !body.arm || !Array.isArray(body.siteResults)) {
    return json({ error: "missing fields" }, 400);
  }
  if (body.arm !== "baseline" && body.arm !== "guided") {
    return json({ error: "invalid arm" }, 400);
  }

  const stmts: D1PreparedStatement[] = [];
  stmts.push(
    env.DB.prepare(
      `INSERT OR REPLACE INTO sessions (participant_id, arm, seed, ease, confidence, n_sites) VALUES (?,?,?,?,?,?)`
    ).bind(body.participantId, body.arm, body.seed ?? null, body.ease ?? null, body.confidence ?? null, body.siteResults.length)
  );

  for (const site of body.siteResults) {
    for (const [qid, ans] of Object.entries(site.answers)) {
      const val = Array.isArray(ans) ? JSON.stringify(ans.slice().sort()) : ans;
      stmts.push(
        env.DB.prepare(
          `INSERT INTO responses (participant_id, arm, site_id, question_id, answer, ms_started, ms_finished) VALUES (?,?,?,?,?,?,?)`
        ).bind(body.participantId, body.arm, site.siteId, qid, val, site.msStarted ?? null, site.msFinished ?? null)
      );
    }
    stmts.push(
      env.DB.prepare(
        `INSERT INTO responses (participant_id, arm, site_id, question_id, answer, ms_started, ms_finished) VALUES (?,?,?,?,?,?,?)`
      ).bind(body.participantId, body.arm, site.siteId, "overall_rating", site.overallRating, site.msStarted ?? null, site.msFinished ?? null)
    );
  }

  await env.DB.batch(stmts);
  return json({ ok: true });
}

async function handleResults(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT participant_id, arm, site_id, question_id, answer FROM responses`
  ).all();
  return json(results ?? []);
}

/** Full export for analysis/reliability.py — grouped by participant+site. */
async function handleExport(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT r.participant_id, r.arm, r.site_id, r.question_id, r.answer, r.ms_started, r.ms_finished
     FROM responses r ORDER BY r.participant_id, r.site_id`
  ).all<{
    participant_id: string;
    arm: string;
    site_id: string;
    question_id: string;
    answer: string;
    ms_started: number;
    ms_finished: number;
  }>();

  const grouped = new Map<string, any>();
  for (const row of results ?? []) {
    const key = `${row.participant_id}::${row.site_id}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        participant_id: row.participant_id,
        arm: row.arm,
        site_id: row.site_id,
        answers: {},
        ms_started: row.ms_started,
        ms_finished: row.ms_finished,
      });
    }
    const g = grouped.get(key);
    let val: any = row.answer;
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        val = JSON.parse(val);
      } catch {
        /* keep as string */
      }
    }
    if (row.question_id === "overall_rating") g.answers.overall_rating = val;
    else g.answers[row.question_id] = val;
  }

  return json(Array.from(grouped.values()));
}

async function handleOahProxy(req: Request, path: string): Promise<Response> {
  if (!ALLOWED_OAH_PATHS.has(path)) {
    return json({ error: "path not allowed" }, 403);
  }
  const upstream = await fetch(`${OAH_API_BASE}/${path}`, {
    headers: { accept: "application/json" },
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  const body = await upstream.text();
  return cors(
    new Response(body, {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    })
  );
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

    if (url.pathname === "/api/submit" && req.method === "POST") return handleSubmit(req, env);
    if (url.pathname === "/api/results" && req.method === "GET") return handleResults(env);
    if (url.pathname === "/api/export" && req.method === "GET") return handleExport(env);
    if (url.pathname.startsWith("/api/oah/") && req.method === "GET") {
      return handleOahProxy(req, url.pathname.replace("/api/oah/", ""));
    }

    return json({ error: "not found" }, 404);
  },
};
