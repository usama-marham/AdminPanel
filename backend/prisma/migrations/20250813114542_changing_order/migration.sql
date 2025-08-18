-- This is an empty migration.
ALTER TABLE doctors
  MODIFY COLUMN bio TEXT DEFAULT NULL AFTER phone,
  MODIFY COLUMN degree VARCHAR(1000) DEFAULT NULL AFTER bio,
  MODIFY COLUMN qualifications JSON DEFAULT (JSON_ARRAY()) AFTER degree,
  MODIFY COLUMN experiences JSON DEFAULT (JSON_ARRAY()) AFTER qualifications,
  MODIFY COLUMN publications JSON DEFAULT (JSON_ARRAY()) AFTER experiences;