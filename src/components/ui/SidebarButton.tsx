import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  icon: LucideIcon;
  title: string;
  type?: 
    | 'flashcards' 
    | 'ai-chat-assistant'
    | 'clinical-guidelines'
    | 'treatment-algorithms'
    | 'evidence-library'
    | 'best-practices'
    | 'cancer-screening'
    | 'diagnostic-pathways'
    | 'patient-evaluation'
    | 'chemo-regimens'
    | 'dose-calculator'
    | 'toxicity-monitoring'
    | 'emergency-protocols'
    | 'supportive-care'
    | 'pain-management'
    | 'symptom-control'
    | 'end-of-life';
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function SidebarButton({ icon: Icon, title, description, isSelected, onClick, type }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 mb-3 
        ${isSelected
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg ring-2 ring-indigo-200 transform scale-[1.02]'
          : 'bg-white/10 text-gray-800 shadow-sm hover:shadow-md hover:bg-white/20 hover:transform hover:scale-[1.01]'}
        relative overflow-hidden group
      `}
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-indigo-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      
      {/* Icon container */}
      <div className={`p-2 rounded-full transition-all duration-300 mb-2 backdrop-blur-sm
        ${isSelected
          ? 'bg-white/20 text-white'
          : 'bg-gray-100 text-indigo-600 group-hover:bg-indigo-50 group-hover:text-indigo-700'}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Title */}
      <h3 className={`text-sm font-medium tracking-wide mb-1 transition-colors
        ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-indigo-700'}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-xs transition-colors ${isSelected ? 'text-indigo-100' : 'text-gray-500 group-hover:text-indigo-600'}`}>
        {description}
      </p>
    </button>
  );
}
