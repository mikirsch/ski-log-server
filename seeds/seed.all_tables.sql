TRUNCATE
  ski_logs,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, full_name, nickname)
VALUES
  ('test', '$2a$12$OV6KJChcVRQWTFMCamxgy.Y.pjuW3JP8LhoIiIx/dt.ub.vxonr2.', 'test user', 'test')
;

INSERT INTO ski_logs (user_id, ski_area, location, notes)
VALUES 
  (1, 'Vail', 'Colorado', 'Example ski log'),
  (1, 'Keystone', 'Colorado', 'A second ski log')
;
