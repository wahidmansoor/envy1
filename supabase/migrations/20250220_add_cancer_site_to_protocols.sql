-- Add cancer_site column to protocols table
ALTER TABLE protocols
ADD COLUMN cancer_site TEXT,
ADD COLUMN treatment_intent TEXT,
ADD CONSTRAINT valid_treatment_intent CHECK (treatment_intent IN ('Curative Intent', 'Palliative Intent'));

-- Create index for the new column
CREATE INDEX protocols_cancer_site_idx ON protocols USING GIN (to_tsvector('english', cancer_site));

-- Update existing records to set cancer_site same as tumour_group initially
UPDATE protocols
SET cancer_site = tumour_group;

-- Make cancer_site NOT NULL after setting initial values
ALTER TABLE protocols
ALTER COLUMN cancer_site SET NOT NULL;

-- Update search_protocols function to include cancer_site
CREATE OR REPLACE FUNCTION search_protocols(search_query TEXT)
RETURNS TABLE (
    id UUID,
    code TEXT,
    tumour_group TEXT,
    cancer_site TEXT,
    treatment_intent TEXT,
    treatment JSONB,
    similarity REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.code,
        p.tumour_group,
        p.cancer_site,
        p.treatment_intent,
        p.treatment,
        ts_rank(
            setweight(to_tsvector('english', p.code), 'A') ||
            setweight(to_tsvector('english', p.tumour_group), 'B') ||
            setweight(to_tsvector('english', p.cancer_site), 'B'),
            to_tsquery('english', search_query)
        ) as similarity
    FROM protocols p
    WHERE
        to_tsvector('english', p.code) @@ to_tsquery('english', search_query) OR
        to_tsvector('english', p.tumour_group) @@ to_tsquery('english', search_query) OR
        to_tsvector('english', p.cancer_site) @@ to_tsquery('english', search_query)
    ORDER BY similarity DESC;
END;
$$ LANGUAGE plpgsql;

-- Update sample data with treatment_intent
UPDATE protocols
SET treatment_intent = 'Curative Intent'
WHERE code IN ('BC-01', 'LUAJNP', 'LUAJOSI');

UPDATE protocols
SET treatment_intent = 'Palliative Intent'
WHERE code = 'NSCLC-01';