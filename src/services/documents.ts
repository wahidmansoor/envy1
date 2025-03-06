import { AIProvider } from './ai/types';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL environment variable is not set');
}

export async function uploadDocument(
  file: File,
  title: string,
  provider: AIProvider = 'gemini',
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    onProgress?.(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await fetch(`${apiUrl}/api/documents?provider=${provider}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    onProgress?.(100);

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}
