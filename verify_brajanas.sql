-- Check BRAJANAS protocol in both tables
SELECT 'Protocols Table' as source, code, tumour_group, cancer_site, treatment_intent 
FROM protocols 
WHERE code = 'BRAJANAS'
UNION ALL
SELECT 'Regimens Table' as source, code, tumour_group, cancer_site, treatment_intent 
FROM regimens 
WHERE code = 'BRAJANAS'
ORDER BY source;

-- Verify JSON fields in protocols
SELECT 
    code,
    eligibility,
    exclusions,
    tests,
    treatment,
    dose_modifications,
    precautions,
    reference_list
FROM protocols
WHERE code = 'BRAJANAS';