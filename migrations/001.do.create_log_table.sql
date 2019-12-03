CREATE TABLE ski_logs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT now(),
  ski_area TEXT NOT NULL,
  duration INTERVAL,
  notes TEXT

)
