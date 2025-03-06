-- Creates the regimens table for storing chemotherapy protocols
CREATE TABLE IF NOT EXISTS regimens (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    code text NOT NULL UNIQUE,
    tumour_group text NOT NULL,
    cancer_site text NOT NULL,
    treatment_intent text NOT NULL,
    eligibility jsonb DEFAULT '[]'::jsonb,
    exclusions jsonb DEFAULT '[]'::jsonb,
    tests jsonb DEFAULT '{}'::jsonb,
    treatment jsonb NOT NULL,
    dose_modifications jsonb DEFAULT '{}'::jsonb,
    precautions jsonb DEFAULT '[]'::jsonb,
    reference_list jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- Add a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_regimens_updated_at
    BEFORE UPDATE ON regimens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create an index on the code column since we'll query by it
CREATE INDEX IF NOT EXISTS regimens_code_idx ON regimens(code);

-- Create an index on the tumour_group column for filtering
CREATE INDEX IF NOT EXISTS regimens_tumour_group_idx ON regimens(tumour_group);

-- Comment on table and columns
COMMENT ON TABLE regimens IS 'Stores chemotherapy protocol information';
COMMENT ON COLUMN regimens.code IS 'Unique protocol code (e.g. HNAVCAP)';
COMMENT ON COLUMN regimens.tumour_group IS 'The tumour group this protocol belongs to';
COMMENT ON COLUMN regimens.cancer_site IS 'The specific cancer site this protocol is for';
COMMENT ON COLUMN regimens.treatment_intent IS 'The intent of the treatment (e.g. curative, palliative)';
COMMENT ON COLUMN regimens.eligibility IS 'Array of eligibility criteria';
COMMENT ON COLUMN regimens.exclusions IS 'Array of exclusion criteria';
COMMENT ON COLUMN regimens.tests IS 'Object containing required tests information';
COMMENT ON COLUMN regimens.treatment IS 'Object containing treatment details (drugs, schedule, etc)';
COMMENT ON COLUMN regimens.dose_modifications IS 'Object containing dose modification guidelines';
COMMENT ON COLUMN regimens.precautions IS 'Array of precautions and warnings';
COMMENT ON COLUMN regimens.reference_list IS 'Array of reference citations';