-- Add unique constraint on protocol code
ALTER TABLE protocols ADD CONSTRAINT protocols_code_unique UNIQUE (code);