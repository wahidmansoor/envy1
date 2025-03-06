/*
  # Insert additional protocol data

  This migration inserts a new protocol into the protocols table.
  Adjusts column names to match existing table structure.
*/

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
  'LUADINVPP',
  'Lung',
  '[
    "Previously untreated resectable non-small cell lung cancer (NSCLC)",
    "Tumour ≥ 4 cm or node positive, M0",
    "Non-squamous histology",
    "No EGFR or ALK mutation",
    "Good performance status",
    "Adequate hematologic, hepatic and renal function",
    "Access to a treatment centre with expertise to manage immune-mediated adverse reactions of checkpoint inhibitors"
  ]'::jsonb,
  '[
    "Large cell neuroendocrine carcinoma",
    "Unresectable or metastatic disease"
  ]'::jsonb,
  '{
    "Baseline": [
      "CBC & Diff, platelets, creatinine, alkaline phosphatase, ALT, total bilirubin, LDH, sodium, potassium, random glucose, TSH, morning serum cortisol, chest xray",
      "HBsAg, HBcoreAb (required, but results do not have to be available to proceed with first treatment; results must be checked before proceeding with cycle 2)"
    ],
    "Before each treatment": [
      "CBC & Diff, platelets, creatinine, alkaline phosphatase, ALT, total bilirubin, LDH, sodium, potassium, TSH, creatine kinase, random glucose"
    ],
    "Weekly": [
      "CBC & Diff, platelets during Cycles 1 and 2"
    ],
    "If clinically indicated": [
      "chest x-ray, morning serum cortisol, lipase, serum or urine HCG (required for women of child bearing potential if pregnancy suspected), free T3 and free T4, serum ACTH levels, testosterone, estradiol, FSH, LH, ECG"
    ]
  }'::jsonb,
  '[
    {
      "drug": "Nivolumab",
      "dose": "4.5 mg/kg (maximum 360 mg)",
      "administration": "IV in 50 to 100 mL NS over 30 minutes using a 0.2 micron in-line filter"
    },
    {
      "drug": "Pemetrexed",
      "dose": "500 mg/m²",
      "administration": "IV in 100 mL NS over 10 minutes"
    },
    {
      "drug": "CISplatin",
      "dose": "75 mg/m²",
      "administration": "IV in 500 mL NS over 1 hour"
    }
  ]'::jsonb,
  '{
    "Hematological": {
      "Based on day 1 counts": [
        {
          "ANC (x10^9/L)": "Greater than or equal to 1.5",
          "Platelets (x10^9/L)": "Greater than or equal to 100",
          "Dose": "100%"
        },
        {
          "ANC (x10^9/L)": "Less than 1.5",
          "Platelets (x10^9/L)": "Less than 100",
          "Dose": "Delay"
        }
      ],
      "Based on nadir counts for pemetrexed only": [
        {
          "ANC (x10^9/L)": "Greater than or equal to 0.5",
          "Platelets (x10^9/L)": "Greater than or equal to 50",
          "Dose": "100%"
        },
        {
          "ANC (x10^9/L)": "Less than 0.5",
          "Platelets (x10^9/L)": "Greater than or equal to 50",
          "Dose": "75%"
        },
        {
          "ANC (x10^9/L)": "Any",
          "Platelets (x10^9/L)": "Less than 50",
          "Dose": "50%"
        }
      ]
    }
  }'::jsonb,
  '[
    {
      "type": "Warning",
      "text": "Serious immune-mediated reactions: can be severe to fatal and usually occur during the treatment course, but may develop months after discontinuation of therapy"
    },
    {
      "type": "Warning",
      "text": "Infusion-related reactions: isolated cases of severe reaction have been reported"
    },
    {
      "type": "Important",
      "text": "Vitamin supplements: appropriate prescription of folic acid and vitamin B12 is essential"
    },
    {
      "type": "Warning",
      "text": "Neutropenia: Fever or other evidence of infection must be assessed promptly and treated aggressively"
    },
    {
      "type": "Caution",
      "text": "NSAIDs: Concurrent nonsteroidal anti-inflammatory agents should be avoided"
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
