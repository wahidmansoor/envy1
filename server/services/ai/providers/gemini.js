import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../../config/index.js';

export async function generateGeminiEmbedding(text) {
  try {
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(text);
    const response = await result.response;
    
    // Convert text response to embedding vector (placeholder implementation)
    const embedding = Array.from({ length: 1536 }, () => Math.random());
    return { embedding };
  } catch (error) {
    console.error('Gemini embedding error:', error);
    return { error: 'Failed to generate Gemini embedding' };
  }
}
