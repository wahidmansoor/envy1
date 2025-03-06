import React from 'react';
import { BrainCircuit } from 'lucide-react';
import FlashcardContainer from '../flashcards/FlashcardContainer';

export default function FlashcardTool() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Oncology Flashcards</h2>
        </div>
        <p className="text-sm text-gray-500">Interactive learning cards for key oncology concepts</p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <FlashcardContainer />
      </div>
    </div>
  );
}
