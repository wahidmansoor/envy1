-- Check if the uuid-ossp extension is enabled
SELECT EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = 'uuid-ossp'
);

-- Enable the uuid-ossp extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if the update_updated_at_column() function exists
SELECT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
);

-- Create the update_updated_at_column() function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;