import { Flashcard } from '../types/flashcards';
import { supabaseClient as supabase } from '../lib/supabase';

export async function getFlashcards(): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*');

  if (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }

  return data as Flashcard[];
}

export async function addFlashcard(flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> {
  const { data, error } = await supabase
    .from('flashcards')
    .insert(flashcard)
    .single();

  if (error) {
    console.error('Error adding flashcard:', error);
    throw error;
  }

  return data as Flashcard;
}

export async function updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
  const { data, error } = await supabase
    .from('flashcards')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }

  return data as Flashcard;
}

export async function deleteFlashcard(id: string): Promise<void> {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
}
