import { useState, useEffect } from 'react';
import { Flashcard } from '../types/flashcards';
import { getFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from '../services/flashcards';

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  async function fetchFlashcards() {
    try {
      setIsLoading(true);
      const data = await getFlashcards();
      setFlashcards(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch flashcards');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function addNewFlashcard(flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const newFlashcard = await addFlashcard(flashcard);
      setFlashcards([...flashcards, newFlashcard]);
      setError(null);
    } catch (err) {
      setError('Failed to add flashcard');
      console.error(err);
    }
  }

  async function updateExistingFlashcard(id: string, updates: Partial<Flashcard>) {
    try {
      const updatedFlashcard = await updateFlashcard(id, updates);
      setFlashcards(flashcards.map(fc => fc.id === id ? updatedFlashcard : fc));
      setError(null);
    } catch (err) {
      setError('Failed to update flashcard');
      console.error(err);
    }
  }

  async function removeFlashcard(id: string) {
    try {
      await deleteFlashcard(id);
      setFlashcards(flashcards.filter(fc => fc.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete flashcard');
      console.error(err);
    }
  }

  return {
    flashcards,
    isLoading,
    error,
    addNewFlashcard,
    updateExistingFlashcard,
    removeFlashcard,
  };
}
