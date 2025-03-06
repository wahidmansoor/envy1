import { useState, useEffect } from 'react';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useQuickNotes() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('quickNotes');
    return saved || '';
  });
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      saveNotes();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [content]);

  useEffect(() => {
    // Calculate character count excluding HTML tags
    const div = document.createElement('div');
    div.innerHTML = content;
    setCharacterCount(div.textContent?.length || 0);
  }, [content]);

  const saveNotes = () => {
    try {
      localStorage.setItem('quickNotes', content);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  return {
    content,
    setContent,
    saveNotes,
    characterCount
  };
}
