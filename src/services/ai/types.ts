export type AIProvider = 'gemini' | 'lmstudio';

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature: number;
  retryAttempts: number;
  retryDelay: number;
  timeout?: number;
}

export interface AIConfig {
  provider: AIProvider;
  baseUrl?: string;
  apiKey?: string;
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
