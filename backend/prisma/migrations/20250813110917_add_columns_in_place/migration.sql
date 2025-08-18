-- This is an empty migration.
-- add four columns and position them precisely
ALTER TABLE doctors
  ADD COLUMN degree VARCHAR(1000) DEFAULT NULL AFTER bio,
  ADD COLUMN qualifications JSON DEFAULT (JSON_ARRAY()) AFTER degree,
  ADD COLUMN experiences JSON DEFAULT (JSON_ARRAY()) AFTER qualifications,
  ADD COLUMN publications JSON DEFAULT (JSON_ARRAY()) AFTER experiences;
