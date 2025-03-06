-- Add new columns to protocols_detailed table
ALTER TABLE protocols_detailed
  ADD COLUMN IF NOT EXISTS biomarkers JSONB,
  ADD COLUMN IF NOT EXISTS risk_factors JSONB,
  ADD COLUMN IF NOT EXISTS contraindications JSONB,
  ADD COLUMN IF NOT EXISTS follow_up JSONB,
  ADD COLUMN IF NOT EXISTS side_effects JSONB,
  ADD COLUMN IF NOT EXISTS drug_interactions JSONB,
  ADD COLUMN IF NOT EXISTS clinical_trials JSONB,
  ADD COLUMN IF NOT EXISTS response_rate TEXT,
  ADD COLUMN IF NOT EXISTS overall_survival TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comments to describe the columns
COMMENT ON COLUMN protocols_detailed.biomarkers IS 'Genetic or molecular markers relevant to the treatment protocol';
COMMENT ON COLUMN protocols_detailed.risk_factors IS 'Known risk factors associated with the protocol';
COMMENT ON COLUMN protocols_detailed.contraindications IS 'Specific contraindications for the treatments';
COMMENT ON COLUMN protocols_detailed.follow_up IS 'Follow-up care guidelines for patients';
COMMENT ON COLUMN protocols_detailed.side_effects IS 'Potential side effects of the treatment';
COMMENT ON COLUMN protocols_detailed.drug_interactions IS 'Possible drug interactions that need monitoring';
COMMENT ON COLUMN protocols_detailed.clinical_trials IS 'References to clinical trials related to the protocol';
COMMENT ON COLUMN protocols_detailed.response_rate IS 'Treatment response rates if available';
COMMENT ON COLUMN protocols_detailed.overall_survival IS 'Overall survival rates for the treatment';
COMMENT ON COLUMN protocols_detailed.notes IS 'Additional information or comments related to the protocol';