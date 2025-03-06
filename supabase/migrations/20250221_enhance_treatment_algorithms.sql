-- Add new columns to treatment_algorithms table
ALTER TABLE treatment_algorithms
ADD COLUMN cancer_type TEXT NOT NULL DEFAULT 'General',
ADD COLUMN summary TEXT NOT NULL DEFAULT '',
ADD COLUMN treatment_steps JSONB NOT NULL DEFAULT '[]'::JSONB,
ADD COLUMN reference_sources JSONB NOT NULL DEFAULT '[]'::JSONB;

-- Create indices for better query performance
CREATE INDEX treatment_algorithms_cancer_type_idx ON treatment_algorithms(cancer_type);
CREATE INDEX treatment_algorithms_treatment_steps_idx ON treatment_algorithms USING GIN (treatment_steps);

-- Insert sample data
INSERT INTO treatment_algorithms (title, cancer_type, summary, treatment_steps, reference_sources, subtypes) VALUES
(
    'Breast Cancer Protocol',
    'Breast Cancer',
    'Comprehensive treatment approach for breast cancer patients',
    '[
        {
            "title": "Initial Assessment",
            "description": "Complete physical examination and staging",
            "substeps": [
                "Mammogram and ultrasound",
                "Tissue biopsy",
                "Hormone receptor testing"
            ]
        },
        {
            "title": "Treatment Planning",
            "description": "Multidisciplinary team discussion",
            "substeps": [
                "Surgery options evaluation",
                "Chemotherapy protocol selection",
                "Radiation therapy planning"
            ]
        }
    ]'::JSONB,
    '[
        {
            "title": "NCCN Guidelines 2024",
            "url": "https://www.nccn.org/guidelines",
            "year": 2024
        },
        {
            "title": "WHO Breast Cancer Guidelines",
            "year": 2024
        }
    ]'::JSONB,
    '[
        {
            "name": "Early-Stage Breast Cancer",
            "steps": [
                "Surgical removal of tumor",
                "Sentinel lymph node biopsy",
                "Adjuvant therapy assessment"
            ],
            "decisionPoints": [
                "Breast conservation vs. mastectomy",
                "Chemotherapy necessity based on tumor characteristics"
            ]
        },
        {
            "name": "Metastatic Breast Cancer",
            "steps": [
                "Systemic therapy",
                "Targeted biological therapy",
                "Palliative care integration"
            ],
            "decisionPoints": [
                "Hormone therapy selection",
                "Clinical trial eligibility"
            ]
        }
    ]'::JSONB
),
(
    'Lung Cancer Protocol',
    'Lung Cancer',
    'Evidence-based approach for lung cancer treatment',
    '[
        {
            "title": "Diagnosis Confirmation",
            "description": "Comprehensive diagnostic workup",
            "substeps": [
                "CT scan of chest",
                "PET scan for staging",
                "Bronchoscopy if indicated"
            ]
        },
        {
            "title": "Treatment Selection",
            "description": "Based on cancer type and stage",
            "substeps": [
                "Surgery for early-stage",
                "Chemotherapy protocol",
                "Radiation therapy planning"
            ]
        }
    ]'::JSONB,
    '[
        {
            "title": "ESMO Clinical Practice Guidelines",
            "url": "https://www.esmo.org/guidelines",
            "year": 2024
        }
    ]'::JSONB,
    '[
        {
            "name": "Early-Stage Lung Cancer",
            "steps": [
                "Surgical resection",
                "Mediastinal lymph node evaluation",
                "Adjuvant therapy consideration"
            ],
            "decisionPoints": [
                "Surgical approach selection",
                "Adjuvant therapy necessity"
            ]
        },
        {
            "name": "Advanced Lung Cancer",
            "steps": [
                "Molecular testing",
                "Targeted therapy selection",
                "Immunotherapy consideration"
            ],
            "decisionPoints": [
                "First-line therapy selection",
                "Maintenance strategy"
            ]
        }
    ]'::JSONB
);
