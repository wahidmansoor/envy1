import { breastCancerData } from './breast';
import { lungCancerData } from './lung';
// Import other cancer type data...

export const cancerPathwaysData = {
  'Breast Cancer': breastCancerData,
  'Lung Cancer': lungCancerData,
  // Add other cancer types...
};

export type CancerType = keyof typeof cancerPathwaysData;
