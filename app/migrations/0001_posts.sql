CREATE TABLE posts (
  id TEXT PRIMARY KEY NOT NULL,
  spot_id TEXT NOT NULL,
  caption TEXT NOT NULL CHECK(length(caption) BETWEEN 1 AND 500),
  created_at TEXT NOT NULL,
  created_ms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible', 'hidden')),
  request_key TEXT UNIQUE NOT NULL,
  author_hash TEXT NOT NULL
);
CREATE INDEX posts_visible_newest ON posts(status, created_at DESC, id DESC);
CREATE INDEX posts_spot_newest ON posts(spot_id, status, created_at DESC, id DESC);
CREATE INDEX posts_rate_limit ON posts(author_hash, created_ms DESC);
