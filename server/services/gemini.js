import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(text);
  return result.response.text();
}
