import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface GuidelineProps {
  guideline: {
    title: string;
    category: string;
    lastUpdated: string;
    recommendations: string[];
    evidenceLevel: string;
    description: string;
  };
}

export default function GuidelineCard({ guideline }: GuidelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Function to truncate description
  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div 
      className="rounded-xl shadow-lg hover:shadow-xl opacity-90 hover:opacity-100 border border-gray-200/40 p-6 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
        backdropFilter: 'blur(8px)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="flex-space-between">
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{guideline.title}</h3>
          <p className="text-description mt-1">{guideline.category}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:shadow-md hover:bg-gradient-to-br from-indigo-500/15 to-purple-500/15"
          style={{
            backdropFilter: 'blur(8px)'
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-indigo-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Tags & Meta Info */}
      <div className="mt-3 flex-center gap-4 text-sm">
        <span className="text-text-light flex-center">
          🕒 {guideline.lastUpdated}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full text-xs shadow-sm border border-indigo-200/30">
          {guideline.evidenceLevel}
        </span>
        <button 
          className="p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:shadow-md hover:bg-gradient-to-br from-indigo-500/15 to-purple-500/15"
          title="More information"
        >
          <Info className="h-5 w-5 text-indigo-600" />
        </button>
      </div>

      {/* Truncated Description (Expanded on Click) */}
      <p className="mt-3 text-description">
        {isExpanded ? guideline.description : truncateText(guideline.description, 100)}
      </p>

      {/* Expandable Recommendations Section */}
      {isExpanded && (
        <div 
          className="mt-5 p-4 rounded-lg border border-gray-200/40 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
            backdropFilter: 'blur(8px)'
          }}>
          <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Key Recommendations</h4>
          <ul className="space-y-3 mt-3">
            {guideline.recommendations.map((rec, index) => (
              <li 
                key={index} 
                className="flex items-start text-sm text-text p-3 rounded-lg shadow-sm transition-all duration-300 hover:bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
              >
                <span className="mr-2 text-indigo-600">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
