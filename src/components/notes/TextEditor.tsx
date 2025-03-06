import React from 'react';
import { Bold, Italic, List } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function TextEditor({ value, onChange, className = '' }: TextEditorProps) {
  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <button
          onClick={() => handleFormat('bold')}
          className="p-1 hover:bg-gray-100 rounded"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className="p-1 hover:bg-gray-100 rounded"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-1 hover:bg-gray-100 rounded"
          title="Bullet List"
        >
          <List size={16} />
        </button>
      </div>
      <div
        contentEditable
        className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
