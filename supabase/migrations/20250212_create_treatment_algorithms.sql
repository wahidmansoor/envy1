-- Drop existing table if it exists
DROP TABLE IF EXISTS treatment_algorithms;

-- Create treatment_algorithms table
CREATE TABLE treatment_algorithms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    cancer_type TEXT NOT NULL,
    year INTEGER,
    decision_points JSONB[],
    keywords TEXT[],
    embedding VECTOR(384),
    relevance_score NUMERIC,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    algorithm_type TEXT DEFAULT 'Standard',
    clinical_guideline_reference TEXT,
    risk_stratification JSONB DEFAULT '{}'::jsonb,
    alternative_pathways JSONB DEFAULT '{}'::jsonb,
    effectiveness_data JSONB DEFAULT '{}'::jsonb,
    biomarkers JSONB DEFAULT '{}'::jsonb,
    contraindications JSONB DEFAULT '{}'::jsonb,
    side_effect_management JSONB DEFAULT '{}'::jsonb,
    cost_analysis JSONB DEFAULT '{}'::jsonb,
    treatment_response_data JSONB DEFAULT '{}'::jsonb,
    guideline_year TEXT,
    AI_recommendations JSONB DEFAULT '{}'::jsonb
);

-- Create an index for cancer_type
CREATE INDEX treatment_algorithms_cancer_type_idx ON treatment_algorithms (cancer_type);

-- Create an index for keywords
CREATE INDEX treatment_algorithms_keywords_idx ON treatment_algorithms USING GIN (keywords);

-- Insert initial data for Stage III Colorectal Cancer Treatment Algorithm
INSERT INTO treatment_algorithms (
    title, content, cancer_type, year, decision_points, keywords, embedding, relevance_score, 
    source_url, created_at, updated_at, algorithm_type, clinical_guideline_reference, 
    risk_stratification, alternative_pathways, effectiveness_data, biomarkers, contraindications, 
    side_effect_management, cost_analysis, treatment_response_data, guideline_year, AI_recommendations
) VALUES (
    'Stage III Colorectal Cancer Treatment Algorithm',
    'Guideline for treating Stage III Colorectal Cancer patients.',
    'Colorectal Cancer',
    2024,
    ARRAY[
        '{
            "order": 1,
            "description": "Staging & Diagnosis",
            "options": ["Colonoscopy", "CT Scan", "MRI"]
        }'::jsonb,
        '{
            "order": 2,
            "description": "Surgery",
            "options": ["Colectomy", "Lymph Node Dissection"]
        }'::jsonb,
        '{
            "order": 3,
            "description": "Adjuvant Therapy",
            "options": ["FOLFOX", "CAPOX", "Observation"]
        }'::jsonb
    ],
    ARRAY['Colorectal Cancer', 'Stage III', 'Adjuvant Therapy'],
    NULL, 
    0.95,
    'https://www.nccn.org/professionals/colorectal',
    NOW(),
    NOW(),
    'Standard',
    'NCCN Guidelines',
    '{"low_risk": "Observation", "high_risk": "FOLFOX/CAPOX"}'::jsonb,
    '{"relapse": "Consider clinical trials or palliative care"}'::jsonb,
    '{"5-year survival": "80%"}'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '2024',
    '{}'::jsonb
);

-- Insert New Cancer Treatment Algorithms
INSERT INTO treatment_algorithms (
    title, content, cancer_type, year, decision_points, keywords, embedding, relevance_score, 
    source_url, created_at, updated_at, algorithm_type, clinical_guideline_reference, 
    risk_stratification, alternative_pathways, effectiveness_data, biomarkers, contraindications, 
    side_effect_management, cost_analysis, treatment_response_data, guideline_year, AI_recommendations
) VALUES
-- Acute Myeloid Leukemia (AML) Induction Therapy Algorithm
(
    'AML Induction Therapy Algorithm',
    'Guideline for induction therapy in Acute Myeloid Leukemia patients.',
    'Acute Myeloid Leukemia',
    2024,
    ARRAY[
        '{
            "order": 1,
            "description": "Cytogenetic & Molecular Risk Assessment",
            "options": ["FLT3", "NPM1", "CEBPA"]
        }'::jsonb,
        '{
            "order": 2,
            "description": "Induction Therapy Selection",
            "options": ["7+3 Regimen", "CPX-351 for high-risk patients"]
        }'::jsonb,
        '{
            "order": 3,
            "description": "Post-Remission Strategy",
            "options": ["Allo-SCT", "Consolidation Chemo"]
        }'::jsonb
    ],
    ARRAY['AML', 'Induction Therapy', '7+3 Regimen'],
    NULL, 
    0.92,
    'https://www.nccn.org/professionals/aml',
    NOW(),
    NOW(),
    'Standard',
    'NCCN AML Guidelines 2024',
    '{"low_risk": "Standard 7+3 regimen", "high_risk": "CPX-351"}'::jsonb,
    '{"relapse": "Consider hypomethylating agents or targeted therapy"}'::jsonb,
    '{"CR rate": "70% in low-risk AML", "OS": "45% at 5 years"}'::jsonb,
    '{"FLT3": "Midostaurin", "IDH1/2": "Ivosidenib/Enasidenib"}'::jsonb,
    '{"Severe Cardiac Disease": "Avoid Anthracyclines"}'::jsonb,
    '{"Cytopenia": "G-CSF Support", "Cardiotoxicity": "Monitor EF"}'::jsonb,
    '{"Induction Cost": "$50,000", "Post-Remission SCT Cost": "$120,000"}'::jsonb,
    '{"5-year OS": "45% overall", "MRD-negative survival": "60%"}'::jsonb,
    '2024',
    '{"AI-Based Rec": "Consider Venetoclax + Hypomethylating Agents for elderly AML"}'::jsonb
),
-- Ovarian Cancer Treatment Algorithm
(
    'Ovarian Cancer First-Line Therapy',
    'Standard of care for newly diagnosed ovarian cancer patients.',
    'Ovarian Cancer',
    2024,
    ARRAY[
        '{
            "order": 1,
            "description": "Initial Surgery Decision",
            "options": ["Primary Debulking Surgery", "Neoadjuvant Chemo"]
        }'::jsonb,
        '{
            "order": 2,
            "description": "Chemotherapy Decision",
            "options": ["Carboplatin/Paclitaxel", "Bevacizumab Addition"]
        }'::jsonb,
        '{
            "order": 3,
            "description": "Maintenance Therapy",
            "options": ["PARP Inhibitor for BRCA+", "Surveillance"]
        }'::jsonb
    ],
    ARRAY['Ovarian Cancer', 'Platinum-Based Chemotherapy', 'PARP Inhibitor'],
    NULL, 
    0.94,
    'https://www.nccn.org/professionals/ovarian',
    NOW(),
    NOW(),
    'Standard',
    'NCCN Ovarian Cancer Guidelines 2024',
    '{"low_risk": "Surveillance", "high_risk": "Maintenance Therapy"}'::jsonb,
    '{"Recurrent Setting": "Consider Niraparib"}'::jsonb,
    '{"5-year OS": "50%", "PFS Benefit": "Improved with PARP inhibitors"}'::jsonb,
    '{"BRCA1/2": "Olaparib", "HRD": "Rucaparib"}'::jsonb,
    '{"GFR <30": "Avoid Platinum", "Severe Hemorrhage": "Avoid Bevacizumab"}'::jsonb,
    '{"Thrombocytopenia": "Platelet Support", "Nausea": "Ondansetron"}'::jsonb,
    '{"Total Therapy Cost": "$80,000"}'::jsonb,
    '{"5-year OS": "50%", "PFS with PARP": "18 months"}'::jsonb,
    '2024',
    '{"AI-Based Rec": "Consider ctDNA monitoring for early recurrence detection"}'::jsonb
);

-- Add comment to the table
COMMENT ON TABLE treatment_algorithms IS 'Oncology treatment algorithms with enhanced features for tracking, version control, and evidence-based implementation guidance';
