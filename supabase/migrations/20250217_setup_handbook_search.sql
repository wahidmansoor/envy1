-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop all indexes first
DROP INDEX IF EXISTS evidence_title_search_idx;
DROP INDEX IF EXISTS evidence_content_search_idx;
DROP INDEX IF EXISTS evidence_cancer_type_idx;
DROP INDEX IF EXISTS evidence_year_idx;
DROP INDEX IF EXISTS evidence_embedding_idx;

DROP INDEX IF EXISTS guidelines_title_search_idx;
DROP INDEX IF EXISTS guidelines_content_search_idx;
DROP INDEX IF EXISTS guidelines_cancer_type_idx;
DROP INDEX IF EXISTS guidelines_year_idx;
DROP INDEX IF EXISTS guidelines_embedding_idx;

DROP INDEX IF EXISTS algorithms_title_search_idx;
DROP INDEX IF EXISTS algorithms_content_search_idx;
DROP INDEX IF EXISTS algorithms_cancer_type_idx;
DROP INDEX IF EXISTS algorithms_year_idx;
DROP INDEX IF EXISTS algorithms_embedding_idx;

DROP INDEX IF EXISTS practices_title_search_idx;
DROP INDEX IF EXISTS practices_content_search_idx;
DROP INDEX IF EXISTS practices_cancer_type_idx;
DROP INDEX IF EXISTS practices_year_idx;
DROP INDEX IF EXISTS practices_embedding_idx;

DROP INDEX IF EXISTS oncology_terms_term_search_idx;
DROP INDEX IF EXISTS oncology_terms_embedding_idx;

-- Drop function if exists
DROP FUNCTION IF EXISTS search_content;

-- Drop existing tables
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS clinical_guidelines CASCADE;
DROP TABLE IF EXISTS treatment_algorithms CASCADE;
DROP TABLE IF EXISTS best_practices CASCADE;
DROP TABLE IF EXISTS oncology_terms CASCADE;

-- Create the evidence library table
CREATE TABLE evidence (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    type text NOT NULL CHECK (type IN ('Clinical Trial', 'Meta Analysis', 'Systematic Review', 'Case Study', 'Observational Study')),
    cancer_type text NOT NULL CHECK (
        cancer_type IN (
            'Breast Cancer',
            'Lung Cancer',
            'Colorectal Cancer',
            'Prostate Cancer',
            'Pancreatic Cancer',
            'Ovarian Cancer',
            'Leukemia',
            'Lymphoma',
            'Other'
        )
    ),
    year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    key_findings text[] NOT NULL DEFAULT ARRAY[]::text[],
    keywords text[] DEFAULT ARRAY[]::text[],
    embedding vector(1536),
    relevance_score float DEFAULT 0,
    citation_count integer DEFAULT 0,
    source_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create clinical guidelines table
CREATE TABLE clinical_guidelines (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    cancer_type text NOT NULL CHECK (
        cancer_type IN (
            'Breast Cancer',
            'Lung Cancer',
            'Colorectal Cancer',
            'Prostate Cancer',
            'Pancreatic Cancer',
            'Ovarian Cancer',
            'Leukemia',
            'Lymphoma',
            'Other'
        )
    ),
    year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    recommendations text[] NOT NULL DEFAULT ARRAY[]::text[],
    keywords text[] DEFAULT ARRAY[]::text[],
    embedding vector(1536),
    relevance_score float DEFAULT 0,
    source_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create treatment algorithms table
CREATE TABLE treatment_algorithms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    cancer_type text NOT NULL CHECK (
        cancer_type IN (
            'Breast Cancer',
            'Lung Cancer',
            'Colorectal Cancer',
            'Prostate Cancer',
            'Pancreatic Cancer',
            'Ovarian Cancer',
            'Leukemia',
            'Lymphoma',
            'Other'
        )
    ),
    year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    decision_points jsonb[] NOT NULL DEFAULT ARRAY[]::jsonb[],
    keywords text[] DEFAULT ARRAY[]::text[],
    embedding vector(1536),
    relevance_score float DEFAULT 0,
    source_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create best practices table
CREATE TABLE best_practices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    cancer_type text NOT NULL CHECK (
        cancer_type IN (
            'Breast Cancer',
            'Lung Cancer',
            'Colorectal Cancer',
            'Prostate Cancer',
            'Pancreatic Cancer',
            'Ovarian Cancer',
            'Leukemia',
            'Lymphoma',
            'Other'
        )
    ),
    year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    recommendations text[] NOT NULL DEFAULT ARRAY[]::text[],
    keywords text[] DEFAULT ARRAY[]::text[],
    embedding vector(1536),
    relevance_score float DEFAULT 0,
    source_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create necessary indexes for all tables
CREATE INDEX evidence_title_search_idx ON evidence USING gin(to_tsvector('english', title));
CREATE INDEX evidence_content_search_idx ON evidence USING gin(to_tsvector('english', content));
CREATE INDEX evidence_cancer_type_idx ON evidence(cancer_type);
CREATE INDEX evidence_year_idx ON evidence(year);
CREATE INDEX evidence_embedding_idx ON evidence USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX guidelines_title_search_idx ON clinical_guidelines USING gin(to_tsvector('english', title));
CREATE INDEX guidelines_content_search_idx ON clinical_guidelines USING gin(to_tsvector('english', content));
CREATE INDEX guidelines_cancer_type_idx ON clinical_guidelines(cancer_type);
CREATE INDEX guidelines_year_idx ON clinical_guidelines(year);
CREATE INDEX guidelines_embedding_idx ON clinical_guidelines USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX algorithms_title_search_idx ON treatment_algorithms USING gin(to_tsvector('english', title));
CREATE INDEX algorithms_content_search_idx ON treatment_algorithms USING gin(to_tsvector('english', content));
CREATE INDEX algorithms_cancer_type_idx ON treatment_algorithms(cancer_type);
CREATE INDEX algorithms_year_idx ON treatment_algorithms(year);
CREATE INDEX algorithms_embedding_idx ON treatment_algorithms USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX practices_title_search_idx ON best_practices USING gin(to_tsvector('english', title));
CREATE INDEX practices_content_search_idx ON best_practices USING gin(to_tsvector('english', content));
CREATE INDEX practices_cancer_type_idx ON best_practices(cancer_type);
CREATE INDEX practices_year_idx ON best_practices(year);
CREATE INDEX practices_embedding_idx ON best_practices USING ivfflat (embedding vector_cosine_ops);

-- Create function to search content across all tables
CREATE OR REPLACE FUNCTION search_content(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 15,
    filter_types text[] DEFAULT '{}',
    filter_cancer_types text[] DEFAULT '{}',
    min_year int DEFAULT 0,
    max_year int DEFAULT 9999,
    min_relevance float DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    type text,
    cancer_type text,
    year integer,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    -- Search clinical guidelines
    SELECT 
        g.id,
        g.title,
        g.content,
        'guideline'::text as type,
        g.cancer_type,
        g.year,
        1 - (g.embedding <=> query_embedding) as similarity
    FROM clinical_guidelines g
    WHERE 1 - (g.embedding <=> query_embedding) > match_threshold
        AND (array_length(filter_types, 1) IS NULL 
            OR 'guideline' = ANY(filter_types))
        AND (array_length(filter_cancer_types, 1) IS NULL 
            OR g.cancer_type = ANY(filter_cancer_types))
        AND g.year BETWEEN min_year AND max_year

    UNION ALL

    -- Search treatment algorithms
    SELECT 
        a.id,
        a.title,
        a.content,
        'algorithm'::text as type,
        a.cancer_type,
        a.year,
        1 - (a.embedding <=> query_embedding) as similarity
    FROM treatment_algorithms a
    WHERE 1 - (a.embedding <=> query_embedding) > match_threshold
        AND (array_length(filter_types, 1) IS NULL 
            OR 'algorithm' = ANY(filter_types))
        AND (array_length(filter_cancer_types, 1) IS NULL 
            OR a.cancer_type = ANY(filter_cancer_types))
        AND a.year BETWEEN min_year AND max_year

    UNION ALL

    -- Search evidence library
    SELECT 
        e.id,
        e.title,
        e.content,
        e.type,
        e.cancer_type,
        e.year,
        1 - (e.embedding <=> query_embedding) as similarity
    FROM evidence e
    WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
        AND (array_length(filter_types, 1) IS NULL 
            OR e.type = ANY(filter_types))
        AND (array_length(filter_cancer_types, 1) IS NULL 
            OR e.cancer_type = ANY(filter_cancer_types))
        AND e.year BETWEEN min_year AND max_year

    UNION ALL

    -- Search best practices
    SELECT 
        p.id,
        p.title,
        p.content,
        'practice'::text as type,
        p.cancer_type,
        p.year,
        1 - (p.embedding <=> query_embedding) as similarity
    FROM best_practices p
    WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
        AND (array_length(filter_types, 1) IS NULL 
            OR 'practice' = ANY(filter_types))
        AND (array_length(filter_cancer_types, 1) IS NULL 
            OR p.cancer_type = ANY(filter_cancer_types))
        AND p.year BETWEEN min_year AND max_year

    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- Create oncology_terms table for search suggestions
CREATE TABLE oncology_terms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    term text NOT NULL,
    category text,
    embedding vector(1536)
);

CREATE INDEX oncology_terms_term_search_idx ON oncology_terms USING gin(to_tsvector('english', term));
CREATE INDEX oncology_terms_embedding_idx ON oncology_terms USING ivfflat (embedding vector_cosine_ops);