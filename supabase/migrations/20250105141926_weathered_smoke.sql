/*
  # Create protocols schema

  1. New Tables
    - `protocols`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `tumour_group` (text)
      - `eligibility` (jsonb)
      - `exclusions` (jsonb)
      - `tests` (jsonb)
      - `treatment` (jsonb)
      - `dose_modifications` (jsonb)
      - `precautions` (jsonb)
      - `reference_list` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `protocols` table
    - Add policies for authenticated users to read protocols
*/

-- Create protocols table
CREATE TABLE IF NOT EXISTS protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  tumour_group text NOT NULL,
  eligibility jsonb NOT NULL DEFAULT '[]'::jsonb,
  exclusions jsonb NOT NULL DEFAULT '[]'::jsonb,
  tests jsonb NOT NULL DEFAULT '{}'::jsonb,
  treatment jsonb NOT NULL DEFAULT '[]'::jsonb,
  dose_modifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  precautions jsonb NOT NULL DEFAULT '[]'::jsonb,
  reference_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON protocols;

-- Create policies
CREATE POLICY "Allow read access to all authenticated users"
  ON protocols
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert protocol data
INSERT INTO protocols (
  code,
  tumour_group,
  eligibility,
  exclusions,
  tests,
  treatment,
  dose_modifications,
  precautions,
  reference_list
) VALUES (
  'LUAJNIVPC',
  'Lung',
  '[
    "Previously untreated resectable non-small cell lung cancer (NSCLC)",
    "Tumour ≥ 4 cm or node positive, M0",
    "Any histology except large cell neuroendocrine carcinoma",
    "Good performance status",
    "Adequate hematologic, hepatic and renal function",
    "Access to a treatment centre with expertise to manage immune-mediated adverse reactions of checkpoint inhibitors"
  ]'::jsonb,
  '[
    "Known EGFR or ALK mutation",
    "Large cell neuroendocrine carcinoma",
    "Unresectable or metastatic disease"
  ]'::jsonb,
  '{
    "Baseline": [
      "CBC & Diff",
      "platelets",
      "creatinine",
      "alkaline phosphatase",
      "ALT",
      "total bilirubin",
      "LDH",
      "sodium",
      "potassium",
      "random glucose",
      "TSH",
      "morning serum cortisol",
      "chest x-ray"
    ],
    "Before each treatment": [
      "CBC & Diff",
      "platelets",
      "creatinine",
      "alkaline phosphatase",
      "ALT",
      "total bilirubin",
      "LDH",
      "sodium",
      "potassium",
      "TSH",
      "creatine kinase",
      "random glucose"
    ]
  }'::jsonb,
  '[
    {
      "drug": "Nivolumab",
      "dose": "4.5 mg/kg (maximum 360 mg)",
      "administration": "IV in 50 to 100 mL NS over 30 minutes using a 0.2 micron in-line filter"
    },
    {
      "drug": "PAClitaxel",
      "dose": "200 mg/m²",
      "administration": "IV in 250 to 500 mL NS over 3 hours (use non-DEHP bag and non-DEHP tubing with 0.2 micron in-line filter)"
    },
    {
      "drug": "CARBOplatin",
      "dose": "AUC 6 Dose = AUC x (GFR + 25)",
      "administration": "IV in 100 to 250 mL NS over 30 minutes"
    }
  ]'::jsonb,
  '{
    "Hematological": {
      "ANC (10⁹/L)": [">= 1.5", "1.0 to < 1.5", "< 1.0"],
      "Platelets (10⁹/L)": [">= 100", "75 to < 100", "< 100"],
      "Dose": ["100%", "75%", "Delay"]
    }
  }'::jsonb,
  '[
    {
      "type": "Warning",
      "text": "Serious immune-mediated reactions"
    },
    {
      "type": "Warning",
      "text": "Infusion-related reactions"
    },
    {
      "type": "Caution",
      "text": "Extravasation: PACLitaxel causes pain and may, rarely, cause tissue necrosis if extravasated"
    }
  ]'::jsonb,
  '[
    {
      "type": "Publication",
      "citation": "Forde PM, Spicer J, Lu S, et al; CheckMate 816 Investigators. Neoadjuvant Nivolumab plus Chemotherapy in Resectable Lung Cancer. N Engl J Med. 2022 May 26;386(21):1973-1985."
    },
    {
      "type": "Recommendation",
      "citation": "Nivolumab (Opdivo) CADTH Reimbursement Recommendation. Canadian Journal of Health Technologies 2023; 3(4):1-24."
    }  
  ]'::jsonb
);
