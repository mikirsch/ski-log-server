CREATE TABLE ski_logs (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL DEFAULT now(),
  ski_area TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT

)
