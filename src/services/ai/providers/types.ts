export type AIProvider = 'openai' | 'gemini';

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface AIProviderResponse {
  content: string;
  model: string;
  tokensUsed: number;
  provider: AIProvider;
}

export interface AIError extends Error {
  provider: AIProvider;
  code: string;
  retryable: boolean;
}

export type QueryType = 
  | 'medical_literature'
  | 'patient_education'
  | 'clinical_decision'
  | 'drug_interaction'
  | 'guideline_based';

// Model selection configuration
export const MODEL_SELECTION_CONFIG = {
  openai: {
    preferredQueryTypes: [
      'clinical_decision',
      'drug_interaction',
      'guideline_based'
    ],
    models: {
      'gpt-4': {
        maxTokens: 1000,
        temperature: 0.2,
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
      },
      'gpt-3.5-turbo': {
        maxTokens: 500,
        temperature: 0.3,
        timeout: 15000,
        retryAttempts: 2,
        retryDelay: 500
      }
    }
  },
  gemini: {
    preferredQueryTypes: [
      'medical_literature',
      'patient_education'
    ],
    models: {
      'gemini-pro': {
        maxTokens: 800,
        temperature: 0.3,
        timeout: 20000,
        retryAttempts: 3,
        retryDelay: 1000
      }
    }
  }
};