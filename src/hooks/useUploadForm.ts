import { useState } from 'react';
import { AIProvider } from '../services/ai/types';
import { uploadDocument } from '../services/documents';

interface UseUploadFormProps {
  onClose?: () => void;
}

export function useUploadForm({ onClose }: UseUploadFormProps) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<AIProvider>('gemini');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setStatus('uploading');
    setProgress(0);
    setError('');

    try {
      const result = await uploadDocument(file, title, provider, (progress) => {
        setProgress(progress);
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      setStatus('success');
      setTitle('');
      setFile(null);
      
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return {
    title,
    setTitle,
    file,
    setFile,
    status,
    progress,
    error,
    provider,
    setProvider,
    handleSubmit
  };
}
