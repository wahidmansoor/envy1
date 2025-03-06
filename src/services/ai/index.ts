import { AIProvider as RootAIProvider } from './types';
import { AIModelConfig, MODEL_SELECTION_CONFIG } from './providers/types';
import { GeminiProvider } from './providers/gemini';
import { getLMStudioResponse } from './providers/lmstudio';

const geminiConfig: AIModelConfig = {
  provider: 'gemini',
  ...MODEL_SELECTION_CONFIG.gemini.models['gemini-pro'],
  model: 'gemini-pro'
};

const geminiProvider = new GeminiProvider(geminiConfig);

export async function getChatResponse(prompt: string, provider: RootAIProvider): Promise<string> {
  switch (provider) {
    case 'gemini':
      const response = await geminiProvider.generateResponse(prompt);
      return response.content;
    case 'lmstudio':
      return getLMStudioResponse(prompt);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
