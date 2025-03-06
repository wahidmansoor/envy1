import { CancerPathwayData } from '../types/cancer-pathways';

export const cancerPathwaysData: Record<string, CancerPathwayData> = {
  'Lung Cancer': {
    title: 'Lung Cancer',
    enhancedInfo: {
      diagnosticTests: {
        title: 'Enhanced Diagnostic Tests',
        items: [
          'Low-dose CT screening protocols',
          'PET-CT for staging accuracy',
          'Bronchoscopy with EBUS/navigation',
          'Molecular testing panels',
          'Liquid biopsy options'
        ]
      },
      tools: {
        title: 'Decision Support & Risk Assessment',
        items: [
          'Nodule risk calculators',
          'Screening eligibility tools',
          'Staging assistance systems',
          'Treatment pathway navigators',
          'Follow-up scheduling tools'
        ]
      },
      resources: {
        title: 'Patient Resources & Follow-up',
        items: [
          'Smoking cessation programs',
          'Support group connections',
          'Treatment option guides',
          'Side effect management',
          'Nutrition and exercise plans'
        ]
      }
    },
    steps: [
      {
        name: 'Chest X-ray',
        details: {
          when: 'Initial screening and symptom evaluation',
          considerations: [
            'Patient radiation exposure',
            'Cost-effectiveness',
            'Availability and accessibility',
            'Limitation in early detection'
          ],
          outcomes: [
            'Detection of obvious masses',
            'Identification of pleural effusions',
            'Mediastinal abnormalities',
            'Limited for small nodules'
          ],
          followUp: [
            'CT scan if abnormal',
            'Regular monitoring',
            'Documentation requirements',
            'Referral protocols'
          ]
        }
      },
      // ... similar detailed data for other steps
    ]
  },
  // ... similar detailed data for other cancer types
};
