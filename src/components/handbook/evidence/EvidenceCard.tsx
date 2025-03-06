import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EvidenceProps {
  evidence: {
    title: string;
    type: string;
    year: string;
    keyFindings: string[];
    implications: string[];
  };
}

export default function EvidenceCard({ evidence }: EvidenceProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="relative backdrop-blur-sm bg-white/40 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{evidence.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{evidence.type}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-indigo-100 rounded-full transition-all"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-indigo-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Tags & Meta Info */}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-gray-500 flex items-center">
          📅 {evidence.year}
        </span>
        <span className="px-2.5 py-0.5 bg-blue-100 bg-opacity-40 text-blue-800 rounded-full border border-blue-200 border-opacity-40 text-xs font-medium">
          {evidence.type}
        </span>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-5 space-y-6">
          {/* Key Findings Section */}
          <div className="p-4 rounded-lg shadow-inner transition-all duration-300">
            <h4 className="text-sm font-semibold text-gray-900">Key Findings</h4>
            <ul className="space-y-3 mt-3">
              {evidence.keyFindings.map((finding, index) => (
                <li 
                  key={index} 
                  className="flex items-start text-sm text-gray-700 p-3 rounded-lg shadow-sm transition-all hover:bg-indigo-100"
                >
                  <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium">
                    {index + 1}
                  </span>
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Implications Section */}
          <div className="p-4 rounded-lg shadow-inner transition-all duration-300">
            <h4 className="text-sm font-semibold text-gray-900">Clinical Implications</h4>
            <ul className="space-y-3 mt-3">
              {evidence.implications.map((implication, index) => (
                <li 
                  key={index} 
                  className="flex items-start text-sm text-gray-700 p-3 rounded-lg shadow-sm transition-all hover:bg-indigo-100"
                >
                  <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium">
                    {index + 1}
                  </span>
                  {implication}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
