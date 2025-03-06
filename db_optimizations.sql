
-- Create indexes for frequently searched columns
CREATE INDEX IF NOT EXISTS idx_code ON protocols (code);
CREATE INDEX IF NOT EXISTS idx_cancer_site ON protocols (cancer_site);
CREATE INDEX IF NOT EXISTS idx_treatment_intent ON protocols (treatment_intent);

-- Create GIN indexes for jsonb columns to speed up searches
CREATE INDEX IF NOT EXISTS idx_eligibility_gin ON protocols USING GIN (eligibility);
CREATE INDEX IF NOT EXISTS idx_exclusions_gin ON protocols USING GIN (exclusions);
CREATE INDEX IF NOT EXISTS idx_treatment_gin ON protocols USING GIN (treatment);

-- Enable pg_hint_plan for better query optimization
CREATE EXTENSION IF NOT EXISTS pg_hint_plan;

-- Set default values for critical columns
ALTER TABLE protocols 
ALTER COLUMN cancer_site SET DEFAULT 'Unknown';

-- Normalize data with treatment intent reference table
-- Step 1: Create the treatment_intents table
CREATE TABLE IF NOT EXISTS treatment_intents (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Step 2: Insert common treatment intents
INSERT INTO treatment_intents (name)
VALUES ('Curative'), ('Palliative'), ('Adjuvant'), ('Neoadjuvant'), 
       ('First-Line'), ('Second-Line'), ('Maintenance')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add foreign key column to protocols table
ALTER TABLE protocols
ADD COLUMN IF NOT EXISTS treatment_intent_id INT;

-- Step 4: Create index on the new column
CREATE INDEX IF NOT EXISTS idx_treatment_intent_id ON protocols (treatment_intent_id);

-- Step 5: Update the new column with proper references
UPDATE protocols
SET treatment_intent_id = (
    SELECT id FROM treatment_intents 
    WHERE treatment_intents.name = protocols.treatment_intent
)
WHERE treatment_intent IS NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE protocols
ADD CONSTRAINT fk_treatment_intent 
FOREIGN KEY (treatment_intent_id) 
REFERENCES treatment_intents(id);

-- Note: After confirming everything works, you can drop the original treatment_intent column:
-- ALTER TABLE protocols DROP COLUMN treatment_intent;
