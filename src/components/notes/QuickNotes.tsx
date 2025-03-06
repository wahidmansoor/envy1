import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Save, Share } from 'lucide-react';
import { useQuickNotes } from '../../hooks/useQuickNotes';
import TextEditor from './TextEditor';

export default function QuickNotes() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  const { content, setContent, saveNotes, characterCount } = useQuickNotes();

  const handleDragStart = (e: React.DragEvent) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const handleDrag = (moveEvent: MouseEvent) => {
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 0);
      
      const x = Math.min(Math.max(0, moveEvent.clientX - offsetX), maxX);
      const y = Math.min(Math.max(0, moveEvent.clientY - offsetY), maxY);
      
      setPosition({ x, y });
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Adjust position when window is resized
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - (dragRef.current?.offsetWidth || 0)),
        y: Math.min(prev.y, window.innerHeight - (dragRef.current?.offsetHeight || 0))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={dragRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: isMinimized ? 'auto' : '350px',
      }}
      className={`fixed z-50 bg-white rounded-lg shadow-lg transition-all duration-200 ${
        isMinimized ? 'w-auto' : 'w-[350px]'
      }`}
    >
      <div
        className="p-2 bg-indigo-600 text-white rounded-t-lg cursor-move flex items-center justify-between"
        onMouseDown={handleDragStart}
      >
        <h3 className="text-sm font-medium px-2">Quick Notes</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-indigo-500 rounded"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={saveNotes}
            className="p-1.5 hover:bg-indigo-500 rounded"
            title="Save notes"
          >
            <Save size={14} />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-indigo-500 rounded"
            title="Minimize"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4">
          <TextEditor
            value={content}
            onChange={setContent}
            className="min-h-[200px] max-h-[400px] overflow-y-auto"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{characterCount} characters</span>
            <span>{Math.max(0, 5000 - characterCount)} remaining</span>
          </div>
        </div>
      )}
    </div>
  );
}
