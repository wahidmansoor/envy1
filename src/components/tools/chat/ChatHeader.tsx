import React from 'react';
import { MessageSquare, Maximize2, Minimize2, Moon, Sun, GripHorizontal } from 'lucide-react';
import { useTheme } from './ChatThemeProvider';

interface ChatHeaderProps {
  isExpanded: boolean;
  activeModel: string | null;
  onToggleExpand: () => void;
  dragHandleProps?: any; // For react-draggable
}

export default function ChatHeader({ 
  isExpanded, 
  activeModel, 
  onToggleExpand,
  dragHandleProps 
}: ChatHeaderProps) {
  const { theme, toggleTheme, themeStyles } = useTheme();

  return (
    <div 
      className={`flex items-center justify-between p-4 ${themeStyles.border} border-b cursor-move`}
      {...dragHandleProps}
    >
      <div className="flex items-center gap-2">
        <GripHorizontal className="h-5 w-5 text-gray-400" />
        <MessageSquare className={`h-5 w-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
        <h2 className={`font-semibold ${themeStyles.text}`}>AI Assistant</h2>
        {activeModel && (
          <span className="text-xs text-gray-500">
            ({activeModel})
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className={`p-1 rounded-md ${
            theme === 'light' 
              ? 'hover:bg-gray-100 text-gray-600' 
              : 'hover:bg-gray-700 text-gray-400'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={onToggleExpand}
          className={`p-1 rounded-md ${
            theme === 'light' 
              ? 'hover:bg-gray-100 text-gray-600' 
              : 'hover:bg-gray-700 text-gray-400'
          }`}
          aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
        >
          {isExpanded ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}