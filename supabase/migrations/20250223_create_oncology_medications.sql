-- Drop existing table if it exists
DROP TABLE IF EXISTS oncology_medications;

/*
INSTRUCTIONS FOR ADDING NEW COLUMNS:

1. For simple columns, use:
   ALTER TABLE oncology_medications ADD COLUMN column_name data_type;

2. For JSONB columns, use:
   ALTER TABLE oncology_medications ADD COLUMN column_name JSONB DEFAULT '{}';

3. To add to search_vector, you'll need to:
   a) Drop the existing generated column
   b) Recreate it with the new fields

Example:
-- Add new column
ALTER TABLE oncology_medications ADD COLUMN manufacturer TEXT;

-- Update search_vector to include new column
ALTER TABLE oncology_medications DROP COLUMN search_vector;
ALTER TABLE oncology_medications ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
    to_tsvector('english',
        name || ' ' ||
        classification || ' ' ||
        manufacturer
    )
) STORED;

Note: The React components will automatically handle new columns in the detail view.
*/

-- Create the oncology_medications table
CREATE TABLE oncology_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand_names JSONB NOT NULL,
    classification TEXT NOT NULL,
    indications JSONB NOT NULL,
    dosage JSONB NOT NULL,
    administration JSONB NOT NULL,
    side_effects JSONB NOT NULL,
    interactions JSONB NOT NULL,
    monitoring JSONB NOT NULL,
    reference_sources JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
            name || ' ' ||
            classification
        )
    ) STORED
);

-- Create an index for full text search
CREATE INDEX oncology_medications_search_idx ON oncology_medications USING GIN (search_vector);

-- Insert all medications
INSERT INTO oncology_medications (
    name, brand_names, classification, indications, dosage, administration, 
    side_effects, interactions, monitoring, reference_sources
)
VALUES 
-- Platinum-based Chemotherapy
('Cisplatin',
 '["Platinol"]',
 'Platinum Chemotherapy',
 '{"cancer_types": ["Lung Cancer", "Bladder Cancer", "Testicular Cancer", "Ovarian Cancer", "Head and Neck Cancer"]}',
 '{"standard": "50-100 mg/m² every 3-4 weeks", "adjustments": ["Reduce dose for renal impairment", "Hydration protocol required"]}',
 '["IV infusion over 1-2 hours", "Requires pre and post hydration"]',
 '["Nephrotoxicity", "Ototoxicity", "Nausea and vomiting", "Peripheral neuropathy", "Myelosuppression"]',
 '["Aminoglycosides", "NSAIDs", "Loop diuretics", "Nephrotoxic agents"]',
 '{"labs": ["Renal function", "Electrolytes", "CBC", "Audiometry"], "frequency": "Prior to each cycle", "precautions": ["Hearing tests", "Creatinine clearance monitoring"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

('Carboplatin',
 '["Paraplatin"]',
 'Platinum Chemotherapy',
 '{"cancer_types": ["Ovarian Cancer", "Lung Cancer", "Breast Cancer", "Head and Neck Cancer"]}',
 '{"standard": "AUC 5-6 every 3 weeks", "adjustments": ["Calculate dose using Calvert formula", "Adjust for renal function"]}',
 '["IV infusion over 30-60 minutes", "No pre-hydration required"]',
 '["Thrombocytopenia", "Neutropenia", "Nausea and vomiting", "Fatigue", "Peripheral neuropathy"]',
 '["Aminoglycosides", "NSAIDs", "Nephrotoxic agents"]',
 '{"labs": ["CBC", "Renal function", "Electrolytes"], "frequency": "Weekly in first cycle, then prior to each cycle", "precautions": ["Monitor platelet count"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

('Oxaliplatin',
 '["Eloxatin"]',
 'Platinum Chemotherapy',
 '{"cancer_types": ["Colorectal Cancer", "Pancreatic Cancer", "Gastric Cancer"]}',
 '{"standard": "85-130 mg/m² every 2-3 weeks", "adjustments": ["Reduce for neuropathy", "Modify for hepatic dysfunction"]}',
 '["IV infusion over 2-6 hours", "Avoid cold exposure during infusion"]',
 '["Peripheral neuropathy", "Cold sensitivity", "Nausea", "Fatigue", "Diarrhea"]',
 '["NSAIDs", "5-Fluorouracil", "Capecitabine"]',
 '{"labs": ["CBC", "Liver function", "Renal function"], "frequency": "Prior to each cycle", "precautions": ["Monitor neurological symptoms", "Avoid cold exposure"]}',
 '["NCCN Guidelines", "ESMO Guidelines"]'),

-- Anthracyclines
('Doxorubicin',
 '["Adriamycin", "Doxil"]',
 'Anthracycline Chemotherapy',
 '{"cancer_types": ["Breast Cancer", "Lymphoma", "Multiple Myeloma", "Sarcoma"]}',
 '{"standard": "60-75 mg/m² every 3 weeks", "adjustments": ["Lifetime cumulative dose limit", "Reduce for hepatic dysfunction"]}',
 '["IV push or infusion", "Administer through central line"]',
 '["Cardiotoxicity", "Myelosuppression", "Alopecia", "Nausea", "Mucositis"]',
 '["Trastuzumab", "Cyclophosphamide", "Other cardiotoxic agents"]',
 '{"labs": ["CBC", "Cardiac function (MUGA/Echo)", "Liver function"], "frequency": "Prior to each cycle", "precautions": ["Monitor ejection fraction", "Cumulative dose tracking"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

('Epirubicin',
 '["Ellence"]',
 'Anthracycline Chemotherapy',
 '{"cancer_types": ["Breast Cancer", "Gastric Cancer", "Ovarian Cancer"]}',
 '{"standard": "90-120 mg/m² every 3-4 weeks", "adjustments": ["Reduce for hepatic dysfunction"]}',
 '["IV push or infusion", "Protect from light"]',
 '["Cardiotoxicity", "Myelosuppression", "Alopecia", "Nausea", "Red urine"]',
 '["Trastuzumab", "Other cardiotoxic agents", "Live vaccines"]',
 '{"labs": ["CBC", "Cardiac function", "Liver function"], "frequency": "Before each cycle", "precautions": ["Monitor cardiac function", "Track cumulative dose"]}',
 '["NCCN Guidelines", "ESMO Guidelines"]'),

-- Antimetabolites
('5-Fluorouracil',
 '["Adrucil", "5-FU"]',
 'Antimetabolite',
 '{"cancer_types": ["Colorectal Cancer", "Breast Cancer", "Head and Neck Cancer", "Pancreatic Cancer"]}',
 '{"standard": "400-600 mg/m² weekly or 1000 mg/m²/day for 4-5 days", "adjustments": ["DPD testing recommended", "Adjust for toxicity"]}',
 '["IV bolus", "Continuous infusion", "Requires central line for continuous infusion"]',
 '["Myelosuppression", "Mucositis", "Diarrhea", "Hand-foot syndrome", "Cardiotoxicity"]',
 '["Leucovorin", "Metronidazole", "Warfarin", "Phenytoin"]',
 '{"labs": ["CBC", "Liver function", "DPD testing"], "frequency": "Weekly monitoring", "precautions": ["Monitor for DPD deficiency", "Cardiac monitoring"]}',
 '["NCCN Guidelines", "ESMO Guidelines"]'),

('Capecitabine',
 '["Xeloda"]',
 'Antimetabolite',
 '{"cancer_types": ["Colorectal Cancer", "Breast Cancer", "Gastric Cancer"]}',
 '{"standard": "1000-1250 mg/m² twice daily for 14 days every 21 days", "adjustments": ["Reduce for renal impairment", "Toxicity-based adjustments"]}',
 '["Oral administration", "Take within 30 minutes after meals"]',
 '["Hand-foot syndrome", "Diarrhea", "Nausea", "Stomatitis", "Fatigue"]',
 '["Warfarin", "Phenytoin", "Leucovorin", "Allopurinol"]',
 '{"labs": ["CBC", "Liver function", "Renal function"], "frequency": "Every cycle", "precautions": ["Monitor for hand-foot syndrome", "DPD testing recommended"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

-- Taxanes
('Paclitaxel',
 '["Taxol", "Abraxane"]',
 'Taxane Chemotherapy',
 '{"cancer_types": ["Breast Cancer", "Ovarian Cancer", "Lung Cancer", "Head and Neck Cancer"]}',
 '{"standard": "175 mg/m² every 3 weeks", "adjustments": ["Weekly schedules available", "Dose reduce for neuropathy"]}',
 '["IV infusion over 3 hours", "Requires premedication"]',
 '["Peripheral neuropathy", "Hypersensitivity reactions", "Myelosuppression", "Alopecia", "Arthralgia"]',
 '["CYP2C8 inhibitors", "CYP3A4 inhibitors", "Platinum agents"]',
 '{"labs": ["CBC", "Liver function"], "frequency": "Prior to each cycle", "precautions": ["Monitor for hypersensitivity", "Assess neuropathy"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

('Docetaxel',
 '["Taxotere"]',
 'Taxane Chemotherapy',
 '{"cancer_types": ["Breast Cancer", "Lung Cancer", "Prostate Cancer", "Gastric Cancer"]}',
 '{"standard": "75-100 mg/m² every 3 weeks", "adjustments": ["Reduce for hepatic dysfunction"]}',
 '["IV infusion over 1 hour", "Requires premedication with corticosteroids"]',
 '["Fluid retention", "Peripheral neuropathy", "Myelosuppression", "Alopecia", "Nail changes"]',
 '["CYP3A4 inhibitors", "Other myelosuppressive agents"]',
 '{"labs": ["CBC", "Liver function"], "frequency": "Prior to each cycle", "precautions": ["Monitor fluid retention", "Watch for hypersensitivity"]}',
 '["NCCN Guidelines", "ESMO Guidelines"]'),

-- Vinca Alkaloids
('Vinblastine',
 '["Velban"]',
 'Vinca Alkaloid',
 '{"cancer_types": ["Hodgkin Lymphoma", "Testicular Cancer", "Breast Cancer", "Bladder Cancer"]}',
 '{"standard": "6 mg/m² weekly", "adjustments": ["Reduce for liver dysfunction", "Adjust for myelosuppression"]}',
 '["IV push over 1-2 minutes", "Avoid extravasation"]',
 '["Myelosuppression", "Constipation", "Peripheral neuropathy", "Alopecia", "SIADH"]',
 '["Erythromycin", "CYP3A4 inhibitors", "Other neurotoxic agents"]',
 '{"labs": ["CBC", "Liver function"], "frequency": "Weekly", "precautions": ["Monitor for extravasation", "Assess neuropathy"]}',
 '["NCCN Guidelines", "ASHP Guidelines"]'),

('Vincristine',
 '["Oncovin"]',
 'Vinca Alkaloid',
 '{"cancer_types": ["ALL", "NHL", "Wilms Tumor", "Small Cell Lung Cancer"]}',
 '{"standard": "1.4 mg/m² weekly (max 2 mg)", "adjustments": ["Cap at 2 mg total dose", "Reduce for liver dysfunction"]}',
 '["IV push", "Strict extravasation precautions"]',
 '["Peripheral neuropathy", "Constipation", "SIADH", "Jaw pain", "Paralytic ileus"]',
 '["Itraconazole", "Voriconazole", "Other CYP3A4 inhibitors"]',
 '{"labs": ["CBC", "Liver function"], "frequency": "Weekly", "precautions": ["Monitor neurologic function", "Prevent extravasation"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]'),

-- Targeted Therapy
('Trastuzumab',
 '["Herceptin"]',
 'HER2 Monoclonal Antibody',
 '{"cancer_types": ["HER2-Positive Breast Cancer", "HER2-Positive Gastric Cancer"]}',
 '{"standard": "8 mg/kg loading, then 6 mg/kg every 3 weeks", "adjustments": ["No dose reduction for toxicity"]}',
 '["IV infusion", "First dose over 90 minutes, can reduce if tolerated"]',
 '["Cardiotoxicity", "Infusion reactions", "Pneumonitis", "Diarrhea"]',
 '["Anthracyclines", "Other cardiotoxic agents"]',
 '{"labs": ["Cardiac function", "LVEF monitoring"], "frequency": "Every 3 months", "precautions": ["Regular cardiac monitoring", "Hold for EF decline"]}',
 '["NCCN Guidelines", "BC Cancer Protocols"]'),

('Bevacizumab',
 '["Avastin"]',
 'VEGF Monoclonal Antibody',
 '{"cancer_types": ["Colorectal Cancer", "NSCLC", "Ovarian Cancer", "Glioblastoma"]}',
 '{"standard": "5-15 mg/kg every 2-3 weeks", "adjustments": ["Disease-specific dosing", "Hold for surgery"]}',
 '["IV infusion", "First dose over 90 minutes, can reduce if tolerated"]',
 '["Hypertension", "Proteinuria", "Bleeding", "Wound healing complications", "GI perforation"]',
 '["Sunitinib", "Other anti-angiogenic agents", "NSAIDs"]',
 '{"labs": ["Blood pressure", "Urinalysis", "Wound healing"], "frequency": "Every infusion", "precautions": ["Monitor BP closely", "Avoid major surgery"]}',
 '["NCCN Guidelines", "FDA prescribing information"]'),

-- Immunotherapy
('Pembrolizumab',
 '["Keytruda"]',
 'PD-1 Checkpoint Inhibitor',
 '{"cancer_types": ["Melanoma", "NSCLC", "Head and Neck Cancer", "Hodgkin Lymphoma"]}',
 '{"standard": "200 mg every 3 weeks or 400 mg every 6 weeks"}',
 '["IV infusion over 30 minutes"]',
 '["Immune-mediated adverse events", "Fatigue", "Pruritus", "Rash", "Diarrhea"]',
 '["Systemic corticosteroids", "Immunosuppressive agents"]',
 '{"labs": ["Thyroid function", "Liver function", "Renal function"], "frequency": "Every 3 weeks", "precautions": ["Monitor for immune-related adverse events"]}',
 '["NCCN Guidelines", "FDA prescribing information"]'),

('Nivolumab',
 '["Opdivo"]',
 'PD-1 Checkpoint Inhibitor',
 '{"cancer_types": ["Melanoma", "NSCLC", "RCC", "Hodgkin Lymphoma"]}',
 '{"standard": "240 mg every 2 weeks or 480 mg every 4 weeks", "adjustments": ["Withhold or discontinue for immune-mediated adverse events"]}',
 '["IV infusion over 30 minutes"]',
 '["Immune-mediated adverse events", "Fatigue", "Rash", "Diarrhea", "Pneumonitis"]',
 '["Systemic corticosteroids", "Immunosuppressive agents"]',
 '{"labs": ["Thyroid function", "Liver function", "Renal function"], "frequency": "Every 2-4 weeks", "precautions": ["Monitor for immune-related adverse events", "Assess endocrine function"]}',
 '["NCCN Guidelines", "ESMO Guidelines"]'),

-- Hormonal Therapy
('Tamoxifen',
 '["Nolvadex"]',
 'Selective Estrogen Receptor Modulator (SERM)',
 '{"cancer_types": ["ER-Positive Breast Cancer"]}',
 '{"standard": "20 mg daily", "adjustments": ["Continue for 5-10 years"]}',
 '["Oral administration", "Take with or without food"]',
 '["Hot flashes", "Deep vein thrombosis", "Endometrial cancer risk", "Mood changes"]',
 '["Warfarin", "CYP2D6 inhibitors", "Estrogens"]',
 '{"labs": ["Gynecologic exam", "Blood counts"], "frequency": "Every 6-12 months", "precautions": ["Monitor for vaginal bleeding", "Regular gynecologic exams"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]'),

('Anastrozole',
 '["Arimidex"]',
 'Aromatase Inhibitor',
 '{"cancer_types": ["ER-Positive Breast Cancer"]}',
 '{"standard": "1 mg daily", "adjustments": ["Post-menopausal women only"]}',
 '["Oral administration", "Once daily dosing"]',
 '["Joint pain", "Hot flashes", "Osteoporosis", "Elevated cholesterol", "Fatigue"]',
 '["Tamoxifen", "Estrogen-containing products"]',
 '{"labs": ["Bone density", "Lipid profile", "Liver function"], "frequency": "Every 6-12 months", "precautions": ["Monitor bone health", "Assess cardiovascular risk"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]'),

-- Supportive Care
('Filgrastim',
 '["Neupogen"]',
 'Granulocyte Colony-Stimulating Factor',
 '{"cancer_types": ["Neutropenia Prevention", "Stem Cell Mobilization"]}',
 '{"standard": "5 mcg/kg/day", "adjustments": ["Adjust timing with chemotherapy", "Weight-based dosing"]}',
 '["Subcutaneous injection", "IV infusion possible"]',
 '["Bone pain", "Fever", "Spleen enlargement", "Allergic reactions", "Musculoskeletal pain"]',
 '["Lithium", "Chemotherapy timing", "Topotecan"]',
 '{"labs": ["CBC with differential", "Spleen monitoring"], "frequency": "Regular CBC monitoring", "precautions": ["Watch for splenic rupture", "Monitor WBC counts"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]'),

('Pegfilgrastim',
 '["Neulasta"]',
 'Long-acting G-CSF',
 '{"cancer_types": ["Neutropenia Prevention"]}',
 '{"standard": "6 mg once per chemotherapy cycle", "adjustments": ["Fixed dosing", "Timing with chemotherapy"]}',
 '["Subcutaneous injection", "On-body injector available"]',
 '["Bone pain", "Injection site reactions", "Spleen enlargement", "Allergic reactions"]',
 '["Chemotherapy timing", "Lithium"]',
 '{"labs": ["CBC with differential", "Spleen monitoring"], "frequency": "Regular monitoring", "precautions": ["Timing with chemotherapy", "Monitor for splenic rupture"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]'),

('Ondansetron',
 '["Zofran"]',
 'Antiemetic',
 '{"cancer_types": ["CINV", "RINV"]}',
 '{"standard": "8-24 mg/day based on emetogenic risk", "adjustments": ["Reduce for hepatic dysfunction", "Timing with chemotherapy"]}',
 '["Oral", "IV", "ODT formulations"]',
 '["Headache", "Constipation", "QT prolongation", "Dizziness"]',
 '["QT prolonging medications", "Apomorphine", "SSRIs"]',
 '{"labs": ["ECG", "Electrolytes"], "frequency": "Baseline and as needed", "precautions": ["Monitor QT interval", "Assess for constipation"]}',
 '["NCCN Guidelines", "MASCC Guidelines"]'),

('Zoledronic Acid',
 '["Zometa"]',
 'Bisphosphonate',
 '{"cancer_types": ["Bone Metastases", "Hypercalcemia of Malignancy"]}',
 '{"standard": "4 mg every 3-4 weeks", "adjustments": ["Reduce for renal impairment", "Modify frequency based on indication"]}',
 '["IV infusion over 15 minutes"]',
 '["Renal toxicity", "Osteonecrosis of jaw", "Flu-like symptoms", "Hypocalcemia"]',
 '["Other nephrotoxic drugs", "Calcium supplements", "Thalidomide"]',
 '{"labs": ["Renal function", "Calcium", "Dental exam"], "frequency": "Prior to each dose", "precautions": ["Dental health", "Renal monitoring"]}',
 '["NCCN Guidelines", "ASCO Guidelines"]');