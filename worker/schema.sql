CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  arm TEXT NOT NULL CHECK (arm IN ('baseline','guided')),
  site_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  ms_started INTEGER,
  ms_finished INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  participant_id TEXT PRIMARY KEY,
  arm TEXT NOT NULL,
  seed INTEGER,
  ease INTEGER,
  confidence INTEGER,
  n_sites INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_responses_arm ON responses(arm);
CREATE INDEX IF NOT EXISTS idx_responses_participant ON responses(participant_id);
