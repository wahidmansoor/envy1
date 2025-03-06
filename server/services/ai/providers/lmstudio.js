export async function generateLMStudioEmbedding(text) {
  try {
    const response = await fetch('http://localhost:1234/v1/embeddings', {
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
    return { error: 'Failed to generate LM Studio embedding' };
  }
}
