export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Tool {
  id: string;
  title: string;
  component: React.ComponentType;
  moduleIds: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}
