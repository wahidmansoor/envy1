import { CancerPathwayData } from '../../types/cancer-pathways';

export const breastCancerData: CancerPathwayData = {
  title: 'Breast Cancer',
  enhancedInfo: {
    diagnosticTests: {
      title: 'Enhanced Diagnostic Tests',
      items: [
        'Digital mammography with tomosynthesis',
        'Automated breast ultrasound (ABUS)',
        'Contrast-enhanced MRI protocols',
        'Molecular breast imaging',
        'Image-guided biopsy techniques'
      ]
    },
    tools: {
      title: 'Decision Support & Risk Assessment',
      items: [
        'IBIS/Tyrer-Cuzick risk calculator',
        'Gail model risk assessment',
        'CAD systems for mammography',
        'Genetic testing decision tools',
        'Treatment response predictors'
      ]
    },
    resources: {
      title: 'Patient Resources & Support',
      items: [
        'Breast cancer support groups',
        'Genetic counseling services',
        'Lifestyle intervention programs',
        'Survivorship care planning',
        'Clinical trial matching'
      ]
    }
  },
  steps: [
    {
      name: 'Clinical breast examination',
      details: {
        when: 'Initial consultation and regular follow-up',
        considerations: [
          'Patient age and risk factors',
          'Previous breast problems',
          'Family history significance',
          'Hormonal influences'
        ],
        outcomes: [
          'Detection of palpable masses',
          'Skin/nipple changes assessment',
          'Lymph node evaluation',
          'Documentation of findings'
        ],
        followUp: [
          'Imaging referral if needed',
          'Regular screening schedule',
          'Patient education',
          'Risk reduction strategies'
        ]
      }
    }
    // ... Add similar detailed data for other steps
  ]
};
