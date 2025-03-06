import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Rotate3D } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

const sampleFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'What is the TNM staging system?',
    back: 'A cancer staging system that describes: \n- T: Size of tumor\n- N: Lymph node involvement\n- M: Metastasis presence',
    category: 'Oncology Basics'
  },
  {
    id: '2',
    front: 'What are the main types of breast cancer?',
    back: '1. Ductal carcinoma in situ (DCIS)\n2. Invasive ductal carcinoma (IDC)\n3. Invasive lobular carcinoma (ILC)\n4. Inflammatory breast cancer',
    category: 'Breast Cancer'
  },
  {
    id: '3',
    front: 'List common chemotherapy side effects',
    back: '1. Nausea and vomiting\n2. Fatigue\n3. Hair loss\n4. Decreased blood counts\n5. Neuropathy\n6. Mucositis',
    category: 'Treatment'
  }
];

export default function FlashcardContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});

  const handleNext = () => {
    if (currentIndex < sampleFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setUserProgress({ ...userProgress, [sampleFlashcards[currentIndex].id]: true });
    }
  };

  const currentCard = sampleFlashcards[currentIndex];
  const progress = Math.round((Object.keys(userProgress).length / sampleFlashcards.length) * 100);

  return (
    <div className="h-full flex flex-col items-center justify-between p-4">
      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-red-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="w-full max-w-xl aspect-[4/3] relative cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d relative ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front */}
          <div className="w-full h-full absolute backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div className="text-sm text-gray-500 mb-4">{currentCard.category}</div>
            <div className="flex-1 flex items-center justify-center text-center text-lg font-medium">
              {currentCard.front}
            </div>
            <div className="text-sm text-gray-400 mt-4 flex items-center justify-center">
              <Rotate3D className="w-4 h-4 mr-2" />
              Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="w-full h-full absolute backface-hidden bg-white rounded-xl shadow-lg p-6 rotate-y-180 flex flex-col">
            <div className="text-sm text-gray-500 mb-4">{currentCard.category}</div>
            <div className="flex-1 flex items-center justify-center whitespace-pre-line">
              {currentCard.back}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        <div className="text-gray-600">
          {currentIndex + 1} / {sampleFlashcards.length}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex === sampleFlashcards.length - 1}
          className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}