SELECT 
  column_name,
  data_type,
  col_description('protocols_detailed'::regclass, ordinal_position) as column_description
FROM information_schema.columns
WHERE table_name = 'protocols_detailed'
ORDER BY ordinal_position;