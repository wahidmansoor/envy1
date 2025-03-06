import type { Flashcard, FlashcardModule } from '../types/flashcards';

export const flashcardModules: FlashcardModule[] = [
  'Basics',
  'Diagnosis',
  'Treatment',
  'Complications',
  'Research'
];

export const flashcardsData: Flashcard[] = [
  {
    id: '1',
    moduleId: 'Basics',
    question: 'What are the hallmarks of cancer as described by Hanahan and Weinberg?',
    answer: '1. Sustained proliferative signaling\n2. Evading growth suppressors\n3. Resisting cell death\n4. Enabling replicative immortality\n5. Inducing angiogenesis\n6. Activating invasion & metastasis\n7. Genome instability\n8. Inflammation\n9. Reprogramming energy metabolism\n10. Evading immune destruction',
    tags: ['cancer biology', 'fundamentals'],
    difficulty: 'Basic'
  },
  {
    id: '2',
    moduleId: 'Diagnosis',
    question: 'What are the key components of TNM staging?',
    answer: 'T: Size/extent of primary Tumor\nN: Regional lymph Node involvement\nM: Distant Metastasis\n\nEach component is assigned a number (0-4 for T, 0-3 for N, 0-1 for M) indicating severity.',
    tags: ['staging', 'classification'],
    difficulty: 'Basic'
  },
  // Add remaining 48 flashcards here with comprehensive oncology concepts
];

// Add styling for card flip animation
export const cardStyles = {
  perspective: 'perspective-1000',
  transition: 'transition-transform duration-500',
  transform: 'preserve-3d',
  rotateY: 'rotate-y-180',
  backfaceHidden: 'backface-hidden'
};
