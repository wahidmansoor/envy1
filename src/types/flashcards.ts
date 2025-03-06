export const FlashcardModules = [
  'General Oncology',
  'Epidemiology',
  'Staging',
  'Treatment',
  'Genetics',
  'Breast Cancer',
  'Immunotherapy',
  'Chemotherapy',
  'Leukemia',
  'Colorectal Cancer',
  'Metabolism',
  'Tumor Biology'
] as const;

export type FlashcardModule = typeof FlashcardModules[number];

export const DifficultyLevels = ['Easy', 'Medium', 'Hard'] as const;
export type DifficultyLevel = typeof DifficultyLevels[number];

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module: FlashcardModule;
  difficulty: DifficultyLevel;
  created_at?: string;
  updated_at?: string;
}
