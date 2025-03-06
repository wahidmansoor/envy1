-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the cancer screening table
CREATE TABLE IF NOT EXISTS cancer_screening (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cancer_type TEXT NOT NULL,
    screening_type TEXT NOT NULL,
    eligibility_criteria JSONB,
    risk_factors JSONB,
    screening_interval TEXT,
    ai_recommendations JSONB,
    next_steps JSONB,
    evidence_level TEXT,
    reference_list JSONB
);

-- Insert sample data
INSERT INTO cancer_screening (
    cancer_type,
    screening_type,
    eligibility_criteria,
    risk_factors,
    screening_interval,
    ai_recommendations,
    next_steps,
    evidence_level,
    reference_list
)
VALUES
(
    'Breast',
    'Mammogram',
    '[
        "Women aged 40-74 years for average risk",
        "Women aged 25-39 with family history or genetic risk should consider early risk assessment",
        "High-risk patients (e.g., BRCA1/2 carriers) should start MRI screening by age 25",
        "Clinical breast exam every 1-3 years for women 25-39"
    ]',
    '{
        "high": [
            "First-degree relative with breast cancer",
            "BRCA1/2 mutation",
            "Previous chest radiation (e.g., Hodgkin''s lymphoma survivors)",
            "History of atypical hyperplasia or LCIS",
            "Hormone replacement therapy use"
        ],
        "moderate": [
            "Dense breast tissue",
            "Early menarche (<12 years old)",
            "Late menopause (>55 years old)"
        ],
        "low": [
            "Regular physical activity",
            "Healthy weight",
            "Limited alcohol intake"
        ]
    }',
    'Annual mammogram starting at age 40 for average risk; Annual MRI + mammogram for high-risk',
    '{
        "screening_frequency": "Annual for 40+",
        "additional_imaging": ["Tomosynthesis for dense breasts", "MRI for high-risk patients"],
        "risk_assessment": "Recommend early genetic testing for family history cases"
    }',
    '{
        "normal": "Continue routine screening",
        "abnormal": [
            "Diagnostic mammogram",
            "Breast ultrasound",
            "MRI if high-risk",
            "Core needle biopsy if suspicious finding"
        ],
        "genetic_mutation_detected": [
            "Consider prophylactic mastectomy",
            "Discuss chemoprevention with Tamoxifen or Raloxifene"
        ]
    }',
    'Level 1A',
    '[
        "NCCN Guidelines Version 6.2024 Breast Cancer Screening",
        "ACS Guidelines 2025",
        "USPSTF Breast Cancer Screening Recommendations 2025"
    ]'
),
(
    'Colorectal',
    'Colonoscopy',
    '["Adults aged 45-75 years", "No symptoms of colorectal cancer", "No personal history of colorectal cancer or advanced polyps"]',
    '{"high": ["Family history of colorectal cancer", "Lynch syndrome", "Inflammatory bowel disease"], "moderate": ["Obesity", "Type 2 diabetes", "Smoking"], "low": ["Regular exercise", "High-fiber diet", "Limited red meat intake"]}',
    'Every 10 years for average risk, more frequent for high risk',
    '{"screening_frequency": "10 years", "alternative_tests": ["FIT annually", "CT colonography every 5 years"], "risk_assessment": "Average"}',
    '{"normal": "Repeat in 10 years", "polyps_found": ["Remove polyps", "Follow-up in 3-5 years"], "abnormal": "Additional testing and possible referral"}',
    'Level 1A',
    '["USPSTF Guidelines 2025", "ACG Clinical Guidelines"]'
);