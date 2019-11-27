CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  nickname TEXT,
  created TIMESTAMP NOT NULL DEFAULT now(),
  modified TIMESTAMP
);

ALTER TABLE ski_logs
  ADD COLUMN
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

INSERT INTO users (user_name, password)
  VALUES ('demo', '$2a$04$EbrSWa268.YeCq.cerwlVOfcP0WGcRtaWEljDpwprLpcyso9md0R2')