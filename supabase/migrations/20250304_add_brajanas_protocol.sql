-- Add BRAJANAS protocol
INSERT INTO protocols (
  code,
  tumour_group,
  cancer_site,
  treatment_intent,
  eligibility,
  exclusions,
  tests,
  treatment,
  dose_modifications,
  precautions,
  reference_list,
  created_at,
  updated_at
) VALUES (
  'BRAJANAS',
  'Breast',
  'Breast',
  'Neoadjuvant or Adjuvant Therapy',
  '[
    "Postmenopausal women with hormone receptor-positive invasive breast cancer",
    "Scenarios include upfront therapy (5 years), early switch (2-3 years of tamoxifen), late switch (5 years of aromatase inhibitor), and preoperative use for patients unsuitable for immediate surgery",
    "Additional 5 years of aromatase inhibitor if disease-free after the first 5 years",
    "Stage IIA to IIIA disease with recurrence risk ≥10%, or stage IIIB and C, and life expectancy ≥10 years"
  ]',
  '["Premenopausal women", "DCIS only"]',
  '["Baseline bone density (optional)", "Follow-up bone density every 3 years", "Serum cholesterol and triglycerides if clinically indicated"]',
  '[{
    "drug": "Anastrozole",
    "dose": "1 mg daily PO",
    "administration": "Upfront therapy for 5 years, with potential for an additional 5 years for a total of 10 years of endocrine therapy",
    "alternative_switches": ["Early switch after 2-3 years of tamoxifen", "Late switch after 4.5-6 years of tamoxifen"]
  }]',
  '{}',
  '[
    "Hepatic dysfunction: Caution in severe hepatic dysfunction",
    "Bone density: Risk of reduced bone density and increased osteoporosis. Calcium, vitamin D supplementation, and weight-bearing exercise recommended",
    "Hyperlipidemia: Monitoring cholesterol and triglyceride levels"
  ]',
  '[
    "Coombes RC, Hall E, Gibson LJ, et al. N Engl J Med 2004;350(11):1081-92",
    "The ATAC Trialists Group. Cancer 2003;98:1802-10",
    "Additional references from Lancet, ASCO, and other oncology journals"
  ]',
  '2025-03-04 00:00:00',
  '2025-03-04 00:00:00'
);

-- Add the same protocol to regimens table
INSERT INTO regimens (
  code,
  tumour_group,
  cancer_site,
  treatment_intent,
  eligibility,
  exclusions,
  tests,
  treatment,
  dose_modifications,
  precautions,
  reference_list,
  created_at,
  updated_at
) VALUES (
  'BRAJANAS',
  'Breast',
  'Breast',
  'Neoadjuvant or Adjuvant Therapy',
  '[
    "Postmenopausal women with hormone receptor-positive invasive breast cancer",
    "Scenarios include upfront therapy (5 years), early switch (2-3 years of tamoxifen), late switch (5 years of aromatase inhibitor), and preoperative use for patients unsuitable for immediate surgery",
    "Additional 5 years of aromatase inhibitor if disease-free after the first 5 years",
    "Stage IIA to IIIA disease with recurrence risk ≥10%, or stage IIIB and C, and life expectancy ≥10 years"
  ]',
  '["Premenopausal women", "DCIS only"]',
  '["Baseline bone density (optional)", "Follow-up bone density every 3 years", "Serum cholesterol and triglycerides if clinically indicated"]',
  '[{
    "drug": "Anastrozole",
    "dose": "1 mg daily PO",
    "administration": "Upfront therapy for 5 years, with potential for an additional 5 years for a total of 10 years of endocrine therapy",
    "alternative_switches": ["Early switch after 2-3 years of tamoxifen", "Late switch after 4.5-6 years of tamoxifen"]
  }]',
  '{}',
  '[
    "Hepatic dysfunction: Caution in severe hepatic dysfunction",
    "Bone density: Risk of reduced bone density and increased osteoporosis. Calcium, vitamin D supplementation, and weight-bearing exercise recommended",
    "Hyperlipidemia: Monitoring cholesterol and triglyceride levels"
  ]',
  '[
    "Coombes RC, Hall E, Gibson LJ, et al. N Engl J Med 2004;350(11):1081-92",
    "The ATAC Trialists Group. Cancer 2003;98:1802-10",
    "Additional references from Lancet, ASCO, and other oncology journals"
  ]',
  '2025-03-04 00:00:00',
  '2025-03-04 00:00:00'
);