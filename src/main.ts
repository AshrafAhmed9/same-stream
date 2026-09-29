import "./style.css";
import { getOrCreateParticipant, markConsented, getSites } from "./study/assign";
import { API_BASE } from "./lib/api";
import { runSite, showOrientationIfNeeded, type SiteResult } from "./form/engine";
import { renderResultsPage } from "./results/page";

const app = document.getElementById("app")!;

function el(html: string): HTMLElement {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild as HTMLElement;
}

type SubmitPayload = {
  participantId: string;
  arm: string;
  seed: number;
  siteResults: SiteResult[];
  ease: number;
  confidence: number;
};

const QUEUE_KEY = "same-stream:offline-queue";

function queuePayload(payload: SubmitPayload) {
  const queue: SubmitPayload[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  // Don't queue the same participant's session twice (e.g. a retry that
  // itself fails shouldn't duplicate the entry already sitting there).
  const withoutDup = queue.filter((p) => p.participantId !== payload.participantId);
  withoutDup.push(payload);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(withoutDup));
}

function dequeuePayload(participantId: string) {
  const queue: SubmitPayload[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.filter((p) => p.participantId !== participantId)));
}

async function postSubmit(payload: SubmitPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false; // network failure (offline, worker unreachable, etc.)
  }
}

async function submitSession(payload: SubmitPayload): Promise<boolean> {
  const ok = await postSubmit(payload);
  if (ok) {
    dequeuePayload(payload.participantId);
  } else {
    // Don't lose the participant's data on a network blip or a transient
    // 5xx: queue it and retry automatically next time the app loads.
    queuePayload(payload);
  }
  return ok;
}

/** Retries anything left in the offline queue from a previous failed
 * submission — runs once on every app load, silently, before the user
 * does anything. A participant who submitted on a bad connection still
 * ends up in the dataset once they (or anyone) reopens the page online. */
async function flushOfflineQueue() {
  const queue: SubmitPayload[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  if (queue.length === 0) return;
  for (const payload of queue) {
    const ok = await postSubmit(payload);
    if (ok) dequeuePayload(payload.participantId);
  }
}

function renderConsent() {
  app.innerHTML = "";
  app.appendChild(
    el(`
    <div class="card">
      <h1>Same Stream</h1>
      <p>OneAquaHealth's citizen science app asks volunteers to assess urban
      streams. This short study checks whether two people looking at the
      same stream give the same answers — and tries a redesigned version of
      the form to see if it helps.</p>
      <p class="muted">Takes about 10 minutes. You'll look at 8 real photos
      of streams in OneAquaHealth's own research cities and answer the same
      kind of questions the real app asks. No account, no personal data —
      just your answers, a random id, and how long you took.</p>
      <p class="muted">This is independent research for the OneAquaHealth
      IEEE Global Hackathon, not run by OneAquaHealth itself. Your answers
      may be shown (anonymously) in the results and shared with the
      OneAquaHealth team.</p>
      <div class="checkbox-row">
        <input type="checkbox" id="consentBox" />
        <label for="consentBox">I'm 18+ and okay with my anonymous answers being used for this research.</label>
      </div>
      <div class="row">
        <a href="#/results" class="muted">See live results →</a>
        <button id="startBtn" disabled>Start</button>
      </div>
    </div>
  `)
  );
  const box = app.querySelector<HTMLInputElement>("#consentBox")!;
  const btn = app.querySelector<HTMLButtonElement>("#startBtn")!;
  box.addEventListener("change", () => (btn.disabled = !box.checked));
  btn.addEventListener("click", startStudy);
}

function startStudy() {
  let participant = getOrCreateParticipant();
  participant = markConsented(participant);

  const sites = getSites();
  const siteResults: SiteResult[] = [];
  let idx = 0;

  const nextSite = () => {
    if (idx >= sites.length) {
      renderEndSurvey(participant, siteResults);
      return;
    }
    runSite(app, participant, participant.siteOrder[idx], idx, sites.length, (result) => {
      siteResults.push(result);
      idx++;
      nextSite();
    });
  };

  showOrientationIfNeeded(app, participant, nextSite);
}

function renderEndSurvey(participant: ReturnType<typeof getOrCreateParticipant>, siteResults: SiteResult[]) {
  app.innerHTML = "";
  app.appendChild(
    el(`
    <div class="card">
      <h2>Almost done</h2>
      <p>Overall, how easy was this to use?</p>
      <div class="options" id="ease">
        ${[1, 2, 3, 4, 5].map((n) => `<label class="opt" data-val="${n}"><input type="radio" name="ease" value="${n}" /> ${n} ${n === 1 ? "(very hard)" : n === 5 ? "(very easy)" : ""}</label>`).join("")}
      </div>
      <p>How confident are you in your answers?</p>
      <div class="options" id="conf">
        ${[1, 2, 3, 4, 5].map((n) => `<label class="opt" data-val="${n}"><input type="radio" name="conf" value="${n}" /> ${n} ${n === 1 ? "(not confident)" : n === 5 ? "(very confident)" : ""}</label>`).join("")}
      </div>
      <div class="row"><span></span><button id="submitBtn" disabled>Submit my answers</button></div>
    </div>
  `)
  );
  const wireGroup = (id: string) => {
    const group = app.querySelector(`#${id}`)!;
    const opts = Array.from(group.querySelectorAll<HTMLElement>(".opt"));
    opts.forEach((o) =>
      o.addEventListener("click", () => {
        opts.forEach((x) => x.classList.remove("selected"));
        o.classList.add("selected");
        (o.querySelector("input") as HTMLInputElement).checked = true;
        checkReady();
      })
    );
  };
  const checkReady = () => {
    const ease = app.querySelector<HTMLElement>("#ease .selected");
    const conf = app.querySelector<HTMLElement>("#conf .selected");
    app.querySelector<HTMLButtonElement>("#submitBtn")!.disabled = !(ease && conf);
  };
  wireGroup("ease");
  wireGroup("conf");

  app.querySelector("#submitBtn")!.addEventListener("click", async () => {
    const ease = Number(app.querySelector<HTMLElement>("#ease .selected")!.dataset.val);
    const confidence = Number(app.querySelector<HTMLElement>("#conf .selected")!.dataset.val);
    const btn = app.querySelector<HTMLButtonElement>("#submitBtn")!;
    btn.disabled = true;
    btn.textContent = "Submitting…";
    const ok = await submitSession({
      participantId: participant.participantId,
      arm: participant.arm,
      seed: participant.seed,
      siteResults,
      ease,
      confidence,
    });
    renderThankYou(ok);
  });
}

function renderThankYou(submitted: boolean) {
  app.innerHTML = "";
  app.appendChild(
    el(`
    <div class="card">
      <h1>Thank you</h1>
      <p>${submitted ? "Your answers were recorded." : "Your answers were saved on this device and will sync automatically — thank you anyway."}</p>
      <p class="muted">Every response helps measure whether OneAquaHealth's
      citizen form gets consistent answers from different volunteers.</p>
      <a href="#/results"><button>See live results</button></a>
    </div>
  `)
  );
}

function router() {
  if (location.hash === "#/results") {
    renderResultsPage(app);
  } else {
    renderConsent();
  }
}

window.addEventListener("hashchange", router);
router();
flushOfflineQueue();
