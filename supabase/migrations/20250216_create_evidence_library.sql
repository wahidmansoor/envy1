-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing table if exists
DROP TABLE IF EXISTS evidence_library CASCADE;

-- Create the evidence library table
CREATE TABLE evidence_library (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    abstract text NOT NULL,
    cancer_type text NOT NULL,
    evidence_level text NOT NULL,
    authors text[] NOT NULL DEFAULT ARRAY[]::text[],
    publication_date timestamp with time zone,
    source text NOT NULL,
    source_url text,
    findings text[] NOT NULL DEFAULT ARRAY[]::text[],
    methodology text,
    conclusions text,
    search_vector tsvector,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_evidence_library_cancer_type ON evidence_library(cancer_type);
CREATE INDEX idx_evidence_library_evidence_level ON evidence_library(evidence_level);
CREATE INDEX idx_evidence_library_search ON evidence_library USING GIN(search_vector);

-- Create function to generate search vector
CREATE OR REPLACE FUNCTION evidence_library_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.abstract, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.methodology, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.conclusions, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.findings, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER evidence_library_search_update
  BEFORE INSERT OR UPDATE ON evidence_library
  FOR EACH ROW
  EXECUTE FUNCTION evidence_library_search_update();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Timestamp update trigger
CREATE TRIGGER update_evidence_library_timestamp
    BEFORE UPDATE ON evidence_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO evidence_library 
(title, abstract, cancer_type, evidence_level, authors, publication_date, source, findings, methodology, conclusions) 
VALUES
(
    'Impact of Immunotherapy in Advanced NSCLC',
    'A comprehensive analysis of immunotherapy outcomes in advanced non-small cell lung cancer patients.',
    'Lung Cancer',
    'Level 1',
    ARRAY['Smith, J.', 'Johnson, M.', 'Williams, R.'],
    '2024-01-15',
    'Journal of Clinical Oncology',
    ARRAY[
        'Improved overall survival with immunotherapy',
        'Better response in PD-L1 high expressors',
        'Reduced adverse events compared to chemotherapy'
    ],
    'Randomized controlled trial involving 850 patients across 50 centers',
    'Immunotherapy shows significant survival benefit in advanced NSCLC patients with good safety profile.'
),
(
    'Novel Targeted Therapies in Breast Cancer',
    'Evaluation of emerging targeted therapies for HER2+ breast cancer treatment.',
    'Breast Cancer',
    'Level 2',
    ARRAY['Brown, A.', 'Davis, S.'],
    '2024-02-01',
    'Breast Cancer Research',
    ARRAY[
        'New targeted agents show promising results',
        'Improved progression-free survival',
        'Manageable side effect profile'
    ],
    'Phase II clinical trial with 320 participants',
    'Novel targeted therapies demonstrate significant clinical benefit in HER2+ breast cancer patients.'
);

-- Enable Row Level Security
ALTER TABLE evidence_library ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Evidence library entries are viewable by everyone"
    ON evidence_library FOR SELECT
    USING (true);

CREATE POLICY "Evidence library entries are editable by authenticated users"
    ON evidence_library FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);