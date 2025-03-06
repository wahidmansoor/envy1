import { CancerPathwayData } from '../../types/cancer-pathways';

export const lungCancerData: CancerPathwayData = {
  title: 'Lung Cancer',
  enhancedInfo: {
    diagnosticTests: {
      title: 'Enhanced Diagnostic Tests',
      items: [
        'Low-dose CT screening protocols',
        'PET/CT fusion imaging',
        'Navigational bronchoscopy',
        'Molecular testing panels',
        'Liquid biopsy options'
      ]
    },
    tools: {
      title: 'Decision Support & Risk Assessment',
      items: [
        'Lung-RADS™ reporting system',
        'Nodule risk calculators',
        'Smoking risk assessment',
        'Treatment pathway navigators',
        'Radiation exposure tracking'
      ]
    },
    resources: {
      title: 'Patient Resources & Support',
      items: [
        'Smoking cessation programs',
        'Pulmonary rehabilitation',
        'Support group connections',
        'Nutritional counseling',
        'Palliative care integration'
      ]
    }
  },
  steps: [
    {
      name: 'Chest X-ray',
      details: {
        when: 'Initial screening and symptom evaluation',
        considerations: [
          'Radiation exposure limits',
          'Technical quality factors',
          'Patient positioning',
          'Previous imaging comparison'
        ],
        outcomes: [
          'Mass detection sensitivity',
          'Nodule characterization',
          'Pleural assessment',
          'Mediastinal evaluation'
        ],
        followUp: [
          'CT referral criteria',
          'Monitoring intervals',
          'Report documentation',
          'Patient communication'
        ]
      }
    }
    // ... Add similar detailed data for other steps
  ]
};
