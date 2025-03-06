import { EmbeddingResponse } from '../types.js';

export async function generateLMStudioEmbedding(text: string): Promise<EmbeddingResponse> {
  try {
    const response = await fetch('http://192.168.56.1:1234/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: text,
        model: 'local-model',
      }),
    });

    const data = await response.json();
    return { embedding: data.data[0].embedding };
  } catch (error) {
    console.error('LM Studio embedding error:', error);
    return { embedding: [], error: 'Failed to generate LM Studio embedding' };
  }
}
