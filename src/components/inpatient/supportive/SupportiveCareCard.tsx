import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SupportiveCare {
  category: string;
  items: string[];
  recommendations: string[];
}

interface Props {
  care: SupportiveCare;
}

export default function SupportiveCareCard({ care }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl border border-gray-200/40 hover:scale-102 transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">
            {care.category}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'}`}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent p-2 transition-colors duration-300">Key Components</h4>
            <ul className="mt-2 space-y-1">
              {care.items.map((item, index) => (
                <li key={index} className="text-sm text-gray-800 flex items-start p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                  <span className="mr-2 text-indigo-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {isExpanded && (
            <div>
              <h4 className="font-medium text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent p-2 transition-colors duration-300">Recommendations</h4>
              <ul className="mt-2 space-y-1">
                {care.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-800 flex items-start p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                    <span className="mr-2 text-indigo-500">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
