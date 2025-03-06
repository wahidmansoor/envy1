import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { uploadDocument } from '../../services/documents';
import { AIProvider } from '../../services/ai/types';
import UploadStatus from '../ui/UploadStatus';
import { ACCEPTED_FILE_TYPES } from '../../constants/upload';
import { useUploadForm } from '../../hooks/useUploadForm';

interface DocumentUploaderProps {
  onClose?: () => void;
}

export default function DocumentUploader({ onClose }: DocumentUploaderProps) {
  const {
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
  } = useUploadForm({ onClose });

  const isDisabled = !file || !title || status === 'uploading';

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
      setFile(selectedFile);
    } else if (selectedFile) {
      alert('File size must be less than 10MB');
    }
  }, [setFile]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ai-provider" className="block text-sm font-medium text-gray-700">AI Provider</label>
          <select
            value={provider}
            id="ai-provider"
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            disabled={status === 'uploading'}
          >
            <option value="gemini">Google Gemini</option>
            <option value="lmstudio">LM Studio</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="document-title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="document-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            required
            disabled={status === 'uploading'}
          />
        </div>

        <div>
          <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700">Document</label>
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors ${
              status === 'uploading' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div className="space-y-1 text-center">
              <Upload className={`mx-auto h-12 w-12 ${file ? 'text-indigo-500' : 'text-gray-400'}`} />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="document-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    id="document-upload"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    disabled={status === 'uploading'}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {ACCEPTED_FILE_TYPES.join(', ').toUpperCase()} up to 10MB
              </p>
              {file && (
                <p className="text-sm text-indigo-600 font-medium">{file.name}</p>
              )}
            </div>
          </div>
        </div>
        
        <UploadStatus 
          status={status}
          progress={progress}
          error={error}
        />

        <button
          type="submit"
          disabled={isDisabled}
          aria-label={status === 'uploading' ? 'Uploading document...' : 'Upload document'}
          className={`w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {status === 'uploading' ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
