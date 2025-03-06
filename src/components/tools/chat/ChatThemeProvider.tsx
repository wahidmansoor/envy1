import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  themeStyles: {
    background: string;
    text: string;
    border: string;
    input: {
      background: string;
      text: string;
      border: string;
    };
    button: {
      primary: string;
      secondary: string;
      hover: string;
      text: string;
    };
    message: {
      user: string;
      assistant: string;
      userText: string;
      assistantText: string;
    };
  };
}

const lightTheme = {
  background: 'bg-transparent',
  text: 'text-gray-900',
  border: 'border-gray-200',
  input: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-gray-300'
  },
  button: {
    primary: 'bg-indigo-600',
    secondary: 'bg-gray-100',
    hover: 'hover:bg-indigo-700',
    text: 'text-white'
  },
  message: {
    user: 'bg-indigo-50',
    assistant: 'bg-gray-50 border border-gray-200',
    userText: 'text-gray-900',
    assistantText: 'text-gray-900'
  }
};

const darkTheme = {
  background: 'bg-transparent',
  text: 'text-gray-100',
  border: 'border-gray-700',
  input: {
    background: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700'
  },
  button: {
    primary: 'bg-indigo-500',
    secondary: 'bg-gray-700',
    hover: 'hover:bg-indigo-600',
    text: 'text-gray-100'
  },
  message: {
    user: 'bg-indigo-900/50',
    assistant: 'bg-gray-800 border border-gray-700',
    userText: 'text-gray-100',
    assistantText: 'text-gray-100'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ChatThemeProvider');
  }
  return context;
}

interface ChatThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}

export function ChatThemeProvider({ children, initialTheme = 'light' }: ChatThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = theme === 'light' ? lightTheme : darkTheme;

  const value = {
    theme,
    toggleTheme,
    themeStyles
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}