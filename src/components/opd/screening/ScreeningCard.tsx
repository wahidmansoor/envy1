import React from 'react';

interface ScreeningGuideline {
  cancer: string;
  population: string;
  frequency: string;
  method: string;
  recommendations: string[];
}

interface Props {
  guideline: ScreeningGuideline;
}

export default function ScreeningCard({ guideline }: Props) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900 mb-2">{guideline.cancer}</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-500">Target Population:</span>
          <p className="text-gray-900">{guideline.population}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Frequency:</span>
          <p className="text-gray-900">{guideline.frequency}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Screening Method:</span>
          <p className="text-gray-900">{guideline.method}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Key Recommendations:</span>
          <ul className="mt-1 space-y-1">
            {guideline.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-900 flex items-start">
                <span className="mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
