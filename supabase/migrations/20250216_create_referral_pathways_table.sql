-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the referral pathways table
CREATE TABLE IF NOT EXISTS referral_pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_code TEXT NOT NULL,
    pathway_name TEXT NOT NULL,
    cancer_type TEXT NOT NULL,
    urgency_level TEXT NOT NULL,
    ai_triage_factors JSONB,
    required_information JSONB,
    clinical_pathway JSONB,
    status_tracking JSONB,
    sla_timeframes JSONB,
    responsible_team TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create status tracking table for referrals
CREATE TABLE IF NOT EXISTS referral_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID REFERENCES referral_pathways(id),
    status TEXT NOT NULL,
    notes TEXT,
    updated_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO referral_pathways (
    referral_code,
    pathway_name,
    cancer_type,
    urgency_level,
    ai_triage_factors,
    required_information,
    clinical_pathway,
    status_tracking,
    sla_timeframes,
    responsible_team
)
VALUES
(
    'BREAST-REF-001',
    'Suspected Breast Cancer Pathway',
    'Breast',
    'Urgent',
    '{"high_risk_factors": ["Breast mass with skin changes", "Axillary lymphadenopathy", "Age > 50 with new mass"], "moderate_risk_factors": ["Family history", "Previous suspicious mammogram"], "low_risk_factors": ["Breast pain only", "Normal imaging"]}',
    '{"clinical": ["Physical examination findings", "Duration of symptoms", "Family history"], "imaging": ["Mammogram results", "Ultrasound if performed"], "lab_tests": ["Relevant blood works"], "patient": ["Demographics", "Risk factors", "Medications"]}',
    '{"initial_assessment": "Breast clinic triage", "urgent_cases": ["Same-day imaging", "Rapid access clinic"], "routine_cases": ["Scheduled clinic visit", "Standard imaging protocol"], "followup": "MDT discussion if needed"}',
    '{"stages": ["Referral received", "Triage complete", "Appointment scheduled", "Initial consultation", "Investigation phase", "MDT discussion", "Treatment plan", "Completed"], "current_stage": "Referral received"}',
    '{"urgent": {"triage": "24 hours", "first_appointment": "2 weeks"}, "routine": {"triage": "48 hours", "first_appointment": "4 weeks"}}',
    'Breast Cancer MDT'
),
(
    'LUNG-REF-001',
    'Suspected Lung Cancer Pathway',
    'Lung',
    'Urgent',
    '{"high_risk_factors": ["Hemoptysis", "Suspicious chest X-ray", "Weight loss with cough"], "moderate_risk_factors": ["Persistent cough", "Smoker > 30 pack years"], "low_risk_factors": ["Recent cough", "Non-smoker"]}',
    '{"clinical": ["Respiratory symptoms", "Performance status", "Smoking history"], "imaging": ["Chest X-ray", "CT if performed"], "lab_tests": ["Full blood count", "Biochemistry"], "patient": ["Demographics", "Comorbidities", "Medications"]}',
    '{"initial_assessment": "Respiratory clinic triage", "urgent_cases": ["Rapid access lung clinic", "Same-week CT"], "routine_cases": ["Scheduled clinic visit", "Standard protocol"], "followup": "MDT review"}',
    '{"stages": ["Referral received", "Triage complete", "Imaging arranged", "Clinic consultation", "Investigation phase", "MDT discussion", "Treatment plan", "Completed"], "current_stage": "Referral received"}',
    '{"urgent": {"triage": "24 hours", "first_appointment": "2 weeks"}, "routine": {"triage": "48 hours", "first_appointment": "4 weeks"}}',
    'Lung Cancer MDT'
),
(
    'BREAST-REF-URG-002',
    'Urgent Breast Cancer Referral Pathway',
    'Breast',
    'Urgent',
    '{"high_risk_factors": ["Palpable lump with rapid growth", "Skin changes (peau d’orange, ulceration)", "Axillary lymphadenopathy", "Nipple discharge (bloody or serous)", "Unilateral breast pain with mass"], "moderate_risk_factors": ["Previous history of atypical hyperplasia", "Dense breast tissue", "Family history of breast cancer"]}',
    '{"clinical": ["Physical exam findings", "Family history", "Symptom onset"], "imaging": ["Diagnostic mammogram", "Ultrasound", "MRI if high-risk"], "lab_tests": ["BRCA1/2 genetic testing if family history"], "patient": ["Age", "Hormone therapy use", "Lifestyle risk factors"]}',
    '{"initial_assessment": "Same-day mammogram & ultrasound", "urgent_cases": ["Biopsy within 72 hours if suspicious"], "followup": "MDT discussion for treatment planning"}',
    '{"stages": ["Referral received", "Imaging completed", "Biopsy scheduled", "Diagnosis confirmed", "MDT discussion"], "current_stage": "Referral received"}',
    '{"urgent": {"triage": "24 hours", "first_appointment": "2 weeks"}, "routine": {"triage": "48 hours", "first_appointment": "4 weeks"}}',
    'Breast Cancer MDT'
),
(
    'BREAST-REF-SCR-002',
    'Routine Breast Cancer Screening Pathway',
    'Breast',
    'Routine',
    '{"screening_criteria": ["Women aged 40+", "Family history of breast cancer", "Dense breast tissue requiring 3D imaging"]}',
    '{"clinical": ["Patient age", "Risk factor assessment"], "imaging": ["Annual mammogram", "MRI for high-risk"], "followup": ["Diagnostic mammogram if needed"]}',
    '{"initial_assessment": "Routine mammogram screening", "routine_cases": ["Follow-up if abnormal findings"], "followup": "Diagnostic workup if needed"}',
    '{"stages": ["Screening scheduled", "Results received", "Follow-up arranged"], "current_stage": "Screening scheduled"}',
    '{"routine": {"triage": "1 week", "first_appointment": "2-4 weeks"}}',
    'Breast Cancer Screening Program'
);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_referral_pathways_updated_at ON referral_pathways;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create trigger to update updated_at timestamp
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_referral_pathways_updated_at
    BEFORE UPDATE ON referral_pathways
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample status records
INSERT INTO referral_status (
    referral_id,
    status,
    notes,
    updated_by
)
SELECT 
    id,
    'Referral received',
    'Initial referral received and awaiting triage',
    'System'
FROM referral_pathways;
