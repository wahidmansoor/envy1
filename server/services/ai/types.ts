export type AIProvider = 'gemini' | 'lmstudio';

export interface AIConfig {
  provider: AIProvider;
  baseUrl?: string;
  apiKey?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  error?: string;
}
