export async function getLMStudioResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch('http://192.168.56.1:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'local-model',
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting LM Studio response:', error);
    throw error;
  }
}
