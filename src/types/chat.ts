export type ResponseFormat = 'treatment' | 'workup' | 'interaction' | 'case' | 'alert' | 'general';

export type ClinicalGuideline = 'NCCN' | 'ASCO' | 'ESMO';

export type Urgency = 'routine' | 'urgent' | 'emergency';

export interface TreatmentResponse {
  firstLine: {
    options: string[];
    evidence: {
      guideline: ClinicalGuideline;
      level: string;
      reference: string;
    };
    considerations: string[];
  };
  secondLine: {
    options: string[];
    evidence: {
      guideline: ClinicalGuideline;
      level: string;
      reference: string;
    };
    considerations: string[];
  };
  palliativeCare?: {
    indications: string[];
    recommendations: string[];
  };
  redFlags?: string[];
}

export interface WorkupResponse {
  laboratory: {
    required: string[];
    optional: string[];
    monitoring: string[];
  };
  imaging: {
    initial: string[];
    followUp: string[];
    frequency: string;
  };
  biomarkers: {
    required: string[];
    optional: string[];
    interpretation: string[];
  };
}

export interface DrugInteraction {
  mechanism: string;
  severity: 'major' | 'moderate' | 'minor';
  clinicalImpact: string;
  management: string[];
  evidence: {
    guideline?: ClinicalGuideline;
    reference: string;
  };
}

export interface CaseResponse {
  patientFactors: {
    considerations: string[];
    contraindications: string[];
  };
  riskAssessment: {
    factors: string[];
    score?: string;
    interpretation: string;
  };
  treatmentPathway: {
    recommended: string[];
    alternatives: string[];
    monitoring: string[];
  };
}

export interface Alert {
  type: 'emergency' | 'warning' | 'info';
  message: string;
  action: string[];
  urgency: Urgency;
}

export interface ChatResponse {
  format: ResponseFormat;
  content: TreatmentResponse | WorkupResponse | DrugInteraction | CaseResponse;
  alerts?: Alert[];
  references: {
    guidelines: ClinicalGuideline[];
    citations: string[];
  };
  aiModel: string;
  tokensUsed: number;
  followUpSuggestions?: string[];
}

export interface QuickReply {
  id: string;
  text: string;
  category: 'treatment' | 'workup' | 'interaction' | 'case' | 'general';
  format: ResponseFormat;
  context?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | ChatResponse;
  timestamp: Date;
  tokensUsed?: number;
  model?: string;
  feedback?: {
    helpful: boolean;
    comment?: string;
  };
  typing?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  context: {
    cancerType?: string;
    patientFactors?: Record<string, any>;
    guidelines?: ClinicalGuideline[];
    preferredModel?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface ChatConfig {
  defaultModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  guidelines: ClinicalGuideline[];
  responseFormat: ResponseFormat;
  streamResponse: boolean;
  theme?: 'light' | 'dark';
  position?: {
    x: number;
    y: number;
  };
}

export interface AIQueryParams {
  query: string;
  format?: ResponseFormat;
  context?: {
    cancerType?: string;
    patientFactors?: Record<string, any>;
    previousMessages?: ChatMessage[];
    guidelines?: ClinicalGuideline[];
  };
  config?: Partial<ChatConfig>;
}

// Updated quick replies with more context-aware options
export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'nsclc-first-line',
    text: 'List first-line NSCLC treatments',
    category: 'treatment',
    format: 'treatment',
    context: 'NSCLC'
  },
  {
    id: 'breast-workup',
    text: 'Initial workup for breast cancer',
    category: 'workup',
    format: 'workup',
    context: 'Breast Cancer'
  },
  {
    id: 'chemo-interactions',
    text: 'Common chemotherapy drug interactions',
    category: 'interaction',
    format: 'interaction'
  },
  {
    id: 'emergency-cord-compression',
    text: 'Manage spinal cord compression',
    category: 'case',
    format: 'alert'
  },
  {
    id: 'mbc-treatment',
    text: 'Treatment options for metastatic breast cancer',
    category: 'treatment',
    format: 'treatment',
    context: 'Metastatic Breast Cancer'
  },
  {
    id: 'immunotherapy-toxicity',
    text: 'Managing immunotherapy side effects',
    category: 'case',
    format: 'case'
  }
];