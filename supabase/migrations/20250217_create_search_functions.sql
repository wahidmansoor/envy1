-- Enable the vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing functions that might use the type
DROP FUNCTION IF EXISTS search_content CASCADE;
DROP FUNCTION IF EXISTS find_related_content CASCADE;

-- Drop and recreate the search result type
DROP TYPE IF EXISTS search_result CASCADE;
CREATE TYPE search_result AS (
    id uuid,
    title text,
    content text,
    type text,
    cancer_type text,
    year integer,
    similarity float
);

-- Function to search content across all relevant tables using embeddings
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
        'evidence'::text as type,
        e.cancer_type,
        e.year,
        1 - (e.embedding <=> query_embedding) as similarity
    FROM evidence e
    WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
        AND (array_length(filter_types, 1) IS NULL 
            OR 'evidence' = ANY(filter_types))
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

-- Function to find related content for a given item
CREATE OR REPLACE FUNCTION find_related_content(
    content_id uuid,
    content_type text,
    cancer_type text,
    limit_count int DEFAULT 3
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item_embedding vector(1536);
    result json;
BEGIN
    -- Get the embedding of the source content
    CASE content_type
        WHEN 'guideline' THEN
            SELECT embedding INTO item_embedding FROM clinical_guidelines WHERE id = content_id;
        WHEN 'algorithm' THEN
            SELECT embedding INTO item_embedding FROM treatment_algorithms WHERE id = content_id;
        WHEN 'evidence' THEN
            SELECT embedding INTO item_embedding FROM evidence WHERE id = content_id;
        WHEN 'practice' THEN
            SELECT embedding INTO item_embedding FROM best_practices WHERE id = content_id;
    END CASE;

    -- Find related content using the embedding
    WITH related_content AS (
        SELECT * FROM search_content(
            item_embedding,
            0.7,  -- match_threshold
            limit_count + 1,  -- match_count (add 1 to account for the source item)
            ARRAY[]::text[],  -- filter_types
            ARRAY[cancer_type]  -- filter_cancer_types
        )
        WHERE id != content_id  -- Exclude the source item
    )
    SELECT json_build_object(
        'guidelines', (SELECT json_agg(r.*) FROM related_content r WHERE r.type = 'guideline'),
        'algorithms', (SELECT json_agg(r.*) FROM related_content r WHERE r.type = 'algorithm'),
        'evidence', (SELECT json_agg(r.*) FROM related_content r WHERE r.type = 'evidence'),
        'practices', (SELECT json_agg(r.*) FROM related_content r WHERE r.type = 'practice')
    ) INTO result;

    RETURN result;
END;
$$;