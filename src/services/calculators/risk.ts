import { Calculator } from '../../types/calculators';

export const riskCalculators: Calculator[] = [
  {
    id: 'gail-model',
    name: 'Breast Cancer Risk (Gail Model)',
    description: 'Calculate 5-year and lifetime breast cancer risk',
    inputs: [
      {
        id: 'age',
        label: 'Current Age',
        type: 'number',
        required: true,
        min: 35,
        max: 85,
        hint: 'Valid for ages 35-85'
      },
      {
        id: 'menarche',
        label: 'Age at First Menstrual Period',
        type: 'select',
        required: true,
        options: [
          { label: '7-11', value: '7-11' },
          { label: '12-13', value: '12-13' },
          { label: '≥14', value: '≥14' }
        ]
      },
      {
        id: 'firstLiveBirth',
        label: 'Age at First Live Birth',
        type: 'select',
        required: true,
        options: [
          { label: 'No births', value: 'none' },
          { label: '<20', value: '<20' },
          { label: '20-24', value: '20-24' },
          { label: '25-29', value: '25-29' },
          { label: '≥30', value: '≥30' }
        ]
      }
    ]
  }
];
