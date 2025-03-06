-- Insert remaining best practices
INSERT INTO best_practices (
    title, category, cancer_type, description, rationale, recommendations, 
    evidence_level, implementation_tips, source, source_url, tags,
    clinical_guideline_reference, relevant_studies, user_feedback, view_count, usefulness_rating, user_reviews, version, change_log, created_at, updated_at
) VALUES 
-- CIPN Prevention
(
    'Prevention of Chemotherapy-Induced Peripheral Neuropathy',
    'Treatment Toxicity Management',
    'All Types',
    'Evidence-based strategies for preventing and managing chemotherapy-induced peripheral neuropathy (CIPN).',
    'CIPN affects up to 68% of patients receiving neurotoxic chemotherapy and can lead to long-term disability and reduced quality of life.',
    ARRAY[
        'Assess baseline neurological function',
        'Regular monitoring during neurotoxic chemotherapy',
        'Early intervention for symptoms',
        'Dose modification protocols',
        'Implementation of preventive measures'
    ],
    'Moderate',
    ARRAY[
        'Use standardized assessment tools',
        'Develop dose modification guidelines',
        'Create patient education materials',
        'Establish rehabilitation referral criteria'
    ],
    'ONS Guidelines',
    'https://www.ons.org/guidelines',
    ARRAY['neuropathy', 'chemotherapy toxicity', 'prevention'],
    'ASCO CIPN Guidelines 2023',
    '{"key_trials": ["NCT03323996", "NCT02753036"], "guidelines": ["PMID:31682550"]}',
    '{}',
    0,
    0.0,
    '{}',
    1,
    '{}',
    NOW(),
    NOW()
),

-- Immunotherapy Optimization
(
    'Optimizing Immunotherapy Response',
    'Immunotherapy',
    'Multiple Types',
    'Comprehensive strategies to optimize immune checkpoint inhibitor therapy outcomes through patient selection, monitoring, and toxicity management.',
    'Proper patient selection and early recognition of immune-related adverse events are crucial for maximizing immunotherapy benefits while minimizing risks.',
    ARRAY[
        'Screen for autoimmune conditions before initiation',
        'Monitor thyroid function and other endocrine parameters',
        'Implement standardized irAE management protocols',
        'Regular assessment of treatment response',
        'Early recognition and management of immune-related adverse events'
    ],
    'High',
    ARRAY[
        'Develop irAE management algorithms',
        'Create patient education materials about immune-related symptoms',
        'Establish clear communication channels for adverse event reporting',
        'Regular staff training on irAE recognition and management'
    ],
    'SITC Guidelines',
    'https://www.sitcancer.org/guidelines',
    ARRAY['immunotherapy', 'adverse events', 'patient monitoring'],
    'NCCN Immunotherapy Guidelines 2023',
    '{"clinical_trials": ["NCT03091491", "NCT02716454"], "key_studies": ["PMID:29437176"]}',
    '{}',
    0,
    0.0,
    '{}',
    1,
    '{}',
    NOW(),
    NOW()
),

-- Smoking Cessation
(
    'Smoking Cessation for Oncology Patients',
    'Preventive Care',
    'All Types',
    'Evidence-based smoking cessation interventions specifically designed for cancer patients throughout their treatment journey.',
    'Smoking cessation improves treatment outcomes, reduces complications, and enhances survival across multiple cancer types.',
    ARRAY[
        'Screen all patients for tobacco use at diagnosis',
        'Provide pharmacotherapy options when appropriate',
        'Implement behavioral counseling programs',
        'Regular follow-up and support',
        'Integration with cancer treatment plan'
    ],
    'High',
    ARRAY[
        'Establish tobacco cessation clinic referral pathway',
        'Train staff in brief intervention techniques',
        'Provide resources for nicotine replacement therapy',
        'Monitor quit rates and program effectiveness'
    ],
    'ASCO Guidelines',
    'https://www.asco.org/guidelines',
    ARRAY['smoking cessation', 'prevention', 'supportive care'],
    'NCCN Smoking Cessation Guidelines Version 2.2023',
    '{"systematic_reviews": ["PMID:28155391"], "guidelines": ["PMID:29443651"]}',
    '{}',
    0,
    0.0,
    '{}',
    1,
    '{}',
    NOW(),
    NOW()
),

-- Oral Chemotherapy Adherence
(
    'Improving Oral Chemotherapy Adherence',
    'Treatment Management',
    'All Types',
    'Structured approach to optimize adherence to oral chemotherapy regimens through patient education, monitoring, and support systems.',
    'Poor adherence to oral chemotherapy can lead to suboptimal outcomes and increased healthcare utilization.',
    ARRAY[
        'Structured patient education program',
        'Regular adherence monitoring',
        'Side effect management support',
        'Use of technology-based reminders',
        'Integration of pharmacist consultation'
    ],
    'Moderate',
    ARRAY[
        'Implement medication diary systems',
        'Develop patient education materials',
        'Create adherence monitoring protocols',
        'Establish communication pathways with community pharmacies'
    ],
    'ONS Guidelines',
    'https://www.ons.org/guidelines',
    ARRAY['oral chemotherapy', 'medication adherence', 'patient education'],
    'ASCO Oral Chemotherapy Guidelines 2023',
    '{"quality_studies": ["PMID:27745132"], "best_practices": ["PMID:28668202"]}',
    '{}',
    0,
    0.0,
    '{}',
    1,
    '{}',
    NOW(),
    NOW()
);
