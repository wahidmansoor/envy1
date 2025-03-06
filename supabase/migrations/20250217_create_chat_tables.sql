-- Drop existing types and tables
DROP VIEW IF EXISTS chat_analytics;
DROP TABLE IF EXISTS chat_interactions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS ai_responses CASCADE;
DROP TYPE IF EXISTS chat_role;
DROP TYPE IF EXISTS response_format;
DROP TYPE IF EXISTS urgency_level;

-- Create types for chat message roles and response formats
CREATE TYPE chat_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE response_format AS ENUM ('treatment', 'workup', 'interaction', 'case', 'alert', 'general');
CREATE TYPE urgency_level AS ENUM ('routine', 'urgent', 'emergency');

-- Create chat interactions table
CREATE TABLE chat_interactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    query text NOT NULL,
    response jsonb NOT NULL,
    format response_format NOT NULL DEFAULT 'general',
    cancer_type text,
    tokens_used integer,
    model text,
    has_alert boolean DEFAULT false,
    feedback jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create chat sessions table
CREATE TABLE chat_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text,
    context jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create chat messages table
CREATE TABLE chat_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role chat_role NOT NULL,
    content text NOT NULL,
    tokens_used integer,
    model text,
    feedback jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create AI responses analytics table
CREATE TABLE ai_responses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt text NOT NULL,
    response jsonb NOT NULL,
    model text NOT NULL,
    tokens_used integer,
    cancer_type text,
    has_emergency boolean DEFAULT false,
    processing_time interval,
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX chat_interactions_format_idx ON chat_interactions(format);
CREATE INDEX chat_interactions_cancer_type_idx ON chat_interactions(cancer_type);
CREATE INDEX chat_interactions_created_at_idx ON chat_interactions(created_at DESC);
CREATE INDEX chat_interactions_has_alert_idx ON chat_interactions(has_alert) WHERE has_alert = true;

CREATE INDEX chat_messages_session_idx ON chat_messages(session_id);
CREATE INDEX chat_messages_role_idx ON chat_messages(role);
CREATE INDEX chat_messages_created_at_idx ON chat_messages(created_at DESC);

CREATE INDEX ai_responses_model_idx ON ai_responses(model);
CREATE INDEX ai_responses_cancer_type_idx ON ai_responses(cancer_type);
CREATE INDEX ai_responses_has_emergency_idx ON ai_responses(has_emergency) WHERE has_emergency = true;
CREATE INDEX ai_responses_created_at_idx ON ai_responses(created_at DESC);

-- Add full-text search capabilities
ALTER TABLE chat_interactions ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(query, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(response->>'content', '')), 'B')
    ) STORED;

CREATE INDEX chat_interactions_search_idx ON chat_interactions USING gin(search_vector);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_chat_interactions_timestamp
    BEFORE UPDATE ON chat_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_timestamp
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for chat analytics
CREATE VIEW chat_analytics AS
SELECT
    date_trunc('day', created_at) as day,
    format,
    cancer_type,
    model,
    COUNT(*) as total_interactions,
    SUM(tokens_used) as total_tokens,
    COUNT(*) FILTER (WHERE has_alert) as emergency_cases,
    AVG(tokens_used) as avg_tokens_per_interaction
FROM chat_interactions
GROUP BY 1, 2, 3, 4;