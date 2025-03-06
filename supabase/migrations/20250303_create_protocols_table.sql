-- Creates the protocols table for storing chemotherapy protocols
CREATE TABLE IF NOT EXISTS protocols (
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
CREATE TRIGGER update_protocols_updated_at
    BEFORE UPDATE ON protocols
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create an index on the code column since we'll query by it
CREATE INDEX IF NOT EXISTS protocols_code_idx ON protocols(code);

-- Create an index on the tumour_group column for filtering
CREATE INDEX IF NOT EXISTS protocols_tumour_group_idx ON protocols(tumour_group);

-- Comment on table and columns
COMMENT ON TABLE protocols IS 'Stores chemotherapy protocol information';
COMMENT ON COLUMN protocols.code IS 'Unique protocol code (e.g. HNAVCAP)';
COMMENT ON COLUMN protocols.tumour_group IS 'The tumour group this protocol belongs to';
COMMENT ON COLUMN protocols.cancer_site IS 'The specific cancer site this protocol is for';
COMMENT ON COLUMN protocols.treatment_intent IS 'The intent of the treatment (e.g. curative, palliative)';
COMMENT ON COLUMN protocols.eligibility IS 'Array of eligibility criteria';
COMMENT ON COLUMN protocols.exclusions IS 'Array of exclusion criteria';
COMMENT ON COLUMN protocols.tests IS 'Object containing required tests information';
COMMENT ON COLUMN protocols.treatment IS 'Object containing treatment details (drugs, schedule, etc)';
COMMENT ON COLUMN protocols.dose_modifications IS 'Object containing dose modification guidelines';
COMMENT ON COLUMN protocols.precautions IS 'Array of precautions and warnings';
COMMENT ON COLUMN protocols.reference_list IS 'Array of reference citations';