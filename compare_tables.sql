-- Compare table structures
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name IN ('protocols', 'regimens')
ORDER BY 
    table_name, ordinal_position;