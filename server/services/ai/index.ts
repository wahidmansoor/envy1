import { AIProvider, EmbeddingResponse } from './types.js';
import { generateGeminiEmbedding } from './providers/gemini.js';
import { generateLMStudioEmbedding } from './providers/lmstudio.js';

export async function generateEmbedding(text: string, provider: AIProvider): Promise<EmbeddingResponse> {
  switch (provider) {
    case 'gemini':
      return generateGeminiEmbedding(text);
    case 'lmstudio':
      return generateLMStudioEmbedding(text);
    default:
      return { embedding: [], error: `Unsupported AI provider: ${provider}` };
  }
}
