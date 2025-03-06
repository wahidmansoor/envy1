-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if exists
DROP TABLE IF EXISTS clinical_guidelines CASCADE;

-- Create clinical guidelines table
CREATE TABLE clinical_guidelines (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    type text NOT NULL,
    cancer_type text NOT NULL,
    stages text[] NOT NULL DEFAULT ARRAY[]::text[],
    recommendations text[] NOT NULL DEFAULT ARRAY[]::text[],
    version text NOT NULL,
    status text NOT NULL,
    source text NOT NULL,
    source_url text,
    last_review_date timestamp with time zone,
    next_review_date timestamp with time zone,
    search_vector tsvector,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_clinical_guidelines_type ON clinical_guidelines(type);
CREATE INDEX idx_clinical_guidelines_cancer_type ON clinical_guidelines(cancer_type);
CREATE INDEX idx_clinical_guidelines_search ON clinical_guidelines USING GIN(search_vector);

-- Create function to generate search vector
CREATE OR REPLACE FUNCTION clinical_guidelines_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.type, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.recommendations, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER clinical_guidelines_search_update
  BEFORE INSERT OR UPDATE ON clinical_guidelines
  FOR EACH ROW
  EXECUTE FUNCTION clinical_guidelines_search_update();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Timestamp update trigger
CREATE TRIGGER update_clinical_guidelines_timestamp
    BEFORE UPDATE ON clinical_guidelines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO clinical_guidelines 
(title, content, type, cancer_type, stages, recommendations, version, status, source, last_review_date, next_review_date) 
VALUES
(
    'Breast Cancer Screening Guidelines',
    'Comprehensive screening guidelines for breast cancer detection and prevention.',
    'Screening',
    'Breast Cancer',
    ARRAY['All'],
    ARRAY[
        'Annual mammography for women age 40 and older',
        'Clinical breast examination every 3 years for women in their 20s and 30s',
        'Consider genetic testing for high-risk individuals',
        'Monthly breast self-examination optional'
    ],
    '2024.1',
    'Published',
    'National Cancer Institute',
    '2024-01-15',
    '2025-01-15'
),
(
    'Advanced NSCLC Treatment Protocol',
    'Evidence-based treatment guidelines for advanced non-small cell lung cancer.',
    'Treatment',
    'Lung Cancer',
    ARRAY['Stage III', 'Stage IV'],
    ARRAY[
        'Molecular testing for all advanced NSCLC patients',
        'First-line immunotherapy for eligible patients',
        'Regular monitoring of treatment response',
        'Integration of palliative care'
    ],
    '2024.2',
    'Published',
    'International Lung Cancer Association',
    '2024-02-01',
    '2025-02-01'
);

-- Enable Row Level Security
ALTER TABLE clinical_guidelines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinical guidelines are viewable by everyone"
    ON clinical_guidelines FOR SELECT
    USING (true);

CREATE POLICY "Clinical guidelines are editable by authenticated users"
    ON clinical_guidelines FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);