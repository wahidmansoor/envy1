import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface UploadStatusProps {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function UploadStatus({ status, progress, error }: UploadStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="mt-4">
      {status === 'uploading' && (
        <div className="content-container">
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-600">Uploading... {progress}%</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="flex-center gap-2 status-success">
          <CheckCircle className="h-5 w-5" />
          <span>Upload complete!</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex-center gap-2 status-error">
          <XCircle className="h-5 w-5" />
          <span>{error || 'Upload failed'}</span>
        </div>
      )}
    </div>
  );
}
