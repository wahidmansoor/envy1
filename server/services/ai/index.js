import { generateGeminiEmbedding } from './providers/gemini.js';
import { generateLMStudioEmbedding } from './providers/lmstudio.js';

export async function generateEmbedding(text, provider = 'gemini') {
  const providers = {
    gemini: generateGeminiEmbedding,
    lmstudio: generateLMStudioEmbedding
  };

  const generateFn = providers[provider];
  if (!generateFn) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  return generateFn(text);
}
