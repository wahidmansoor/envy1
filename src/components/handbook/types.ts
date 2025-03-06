import type { SearchResult } from '../../hooks/useAISearch';

export interface WithSearchResults {
  searchResults: SearchResult[];
  initialData?: any[];
}

export interface Practice {
  id: string;
  title: string;
  category: string;
  cancer_type: string;
  description: string;
  rationale: string;
  recommendations: string[];
  evidence_level: string;
  implementation_tips: string[];
  source: string;
  source_url?: string;
  // New fields
  tags?: string[];
  clinical_guideline_reference?: string;
  video_link?: string;
  relevant_studies?: {
    key_studies?: string[];
    clinical_trials?: string[];
    systematic_reviews?: string[];
    meta_analyses?: string[];
    guidelines?: string[];
    consensus_statements?: string[];
    practice_reviews?: string[];
    quality_studies?: string[];
    impact_studies?: string[];
    interventions?: string[];
  };
  user_feedback?: {
    ratings?: {
      average: number;
      count: number;
      distribution: Record<string, number>;
    };
    comments?: Array<{
      id: string;
      user_id: string;
      comment: string;
      rating: number;
      created_at: string;
    }>;
  };
  view_count?: number;
  usefulness_rating?: number;
  user_reviews?: {
    [key: string]: {
      rating: number;
      review: string;
      created_at: string;
      user_id: string;
    };
  };
  version?: number;
  change_log?: {
    [version: string]: {
      updated_at: string;
      previous_data: Practice;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export interface Guideline {
  id: string;
  title: string;
  content: string;
  type: string;
  cancer_type: string;
  stages: string[];
  recommendations: string[];
  version: string;
  status: string;
  source: string;
  source_url?: string;
  last_review_date: string;
  next_review_date: string;
  updated_at: string;
}

export interface Algorithm {
  id: string;
  title: string;
  content: string;
  cancer_type: string;
  year: number;
  decision_points: {
    order: number;
    description: string;
    options: string[];
  }[];
  keywords: string[];
  embedding: any; // Adjust type as needed
  relevance_score: number;
  source_url?: string;
  created_at: string;
  updated_at: string;
  algorithm_type?: string;
  clinical_guideline_reference?: string;
  risk_stratification?: { [key: string]: any };
  alternative_pathways?: { [key: string]: any };
  effectiveness_data?: { [key: string]: any };
  biomarkers?: { [key: string]: any };
  contraindications?: { [key: string]: any };
  side_effect_management?: { [key: string]: any };
  cost_analysis?: { [key: string]: any };
  treatment_response_data?: { [key: string]: any };
  guideline_year?: string;
  AI_recommendations?: { [key: string]: any };
}

export interface Evidence {
  id: string;
  title: string;
  abstract: string;
  cancer_type: string;
  evidence_level: string;
  authors: string[];
  publication_date: string;
  source: string;
  source_url?: string;
  findings: string[];
  methodology: string;
  conclusions: string;
}

export interface Medication {
  id?: string;
  name: string;
  brand_names: string[];
  classification: string;
  indications: {
    cancer_types: string[];
    stages?: string[];
  };
  dosage: {
    standard: string;
    adjustments?: string[];
  };
  administration: string[];
  side_effects: string[];
  interactions: string[];
  monitoring: {
    labs?: string[];
    frequency?: string;
    precautions?: string[];
  };
  reference_sources: string[];
  created_at?: string;
  updated_at?: string;
}
