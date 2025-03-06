export interface TreatmentDrug {
  name: string;
  dose?: string;
  administration?: string;
  alternative_switches?: string[];
}

export interface Treatment {
  drugs?: TreatmentDrug[];
  schedule?: string[];
  duration?: string;
  type?: 'Chemotherapy' | 'Other';
}

export type TreatmentIntent = 'Curative Intent' | 'Palliative Intent' | 'Neoadjuvant or Adjuvant Therapy';

export interface Protocol {
  id: string;
  protocol_code: string;
  tumour_group: string;
  treatment_intent: TreatmentIntent;
  eligibility: string[] | null;
  exclusions: string[] | null;
  tests: Record<string, any> | null;
  treatment: Treatment | null;
  dose_modifications: Record<string, any> | null;
  precautions: string[] | null;
  biomarkers: Record<string, any> | null;
  risk_factors: Record<string, any> | null;
  contraindications: Record<string, any> | null;
  follow_up: Record<string, any> | null;
  side_effects: Record<string, any> | null;
  drug_interactions: Record<string, any> | null;
  clinical_trials: Record<string, any> | null;
  response_rate: string | null;
  overall_survival: string | null;
  notes: string | null;
  reference_list: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface Algorithm {
  id: string;
  title: string;
  type: string;
  content: string;
  steps: string[];
}
