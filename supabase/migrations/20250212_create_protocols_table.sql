-- Drop existing objects if they exist
DROP TABLE IF EXISTS protocols CASCADE;
DROP FUNCTION IF EXISTS search_protocols(TEXT);

-- Create protocols table
CREATE TABLE protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_code TEXT NOT NULL,
    tumour_group TEXT NOT NULL,
    treatment_intent TEXT NOT NULL CHECK (treatment_intent IN ('Curative Intent', 'Palliative Intent')),
    eligibility JSONB DEFAULT '[]'::JSONB,
    exclusions JSONB DEFAULT '[]'::JSONB,
    tests JSONB DEFAULT '{}'::JSONB,
    treatment JSONB NOT NULL,
    dose_modifications JSONB DEFAULT '{}'::JSONB,
    precautions JSONB DEFAULT '[]'::JSONB,
    reference_list JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create indices for better performance
CREATE INDEX protocols_code_idx ON protocols USING GIN (to_tsvector('english', protocol_code));
CREATE INDEX protocols_tumour_group_idx ON protocols USING GIN (to_tsvector('english', tumour_group));
CREATE INDEX protocols_treatment_idx ON protocols USING GIN (treatment);

-- Enable Row Level Security
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Protocols are viewable by all users"
    ON protocols FOR SELECT
    USING (true);

CREATE POLICY "Protocols are insertable by authenticated users"
    ON protocols FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Protocols are updatable by authenticated users"
    ON protocols FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_protocols_updated_at
    BEFORE UPDATE ON protocols
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Placeholder for INSERT statements based on CSV data
-- INSERT INTO protocols (...);
