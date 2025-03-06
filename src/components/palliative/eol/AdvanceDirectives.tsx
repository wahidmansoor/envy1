import React, { useState } from 'react';
import { FileText, Download, CheckSquare, Info, Users, Settings } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface DirectiveStatus {
  completed: boolean;
  notes: string;
  lastUpdated?: string;
}

interface LegalRequirement {
  requirement: string;
  description: string;
  mandatory: boolean;
}

interface CulturalConsideration {
  culture: string;
  considerations: string[];
  recommendations: string[];
}

export default function AdvanceDirectives() {
  const [directiveStatus, setDirectiveStatus] = useState<Record<string, DirectiveStatus>>({
    resuscitation: { completed: false, notes: '' },
    feeding: { completed: false, notes: '' },
    ventilation: { completed: false, notes: '' },
    location: { completed: false, notes: '' },
    proxy: { completed: false, notes: '' }
  });

  const legalRequirements: LegalRequirement[] = [
    {
      requirement: 'Patient Capacity Assessment',
      description: 'Document mental capacity to make decisions',
      mandatory: true
    },
    {
      requirement: 'Witness Signatures',
      description: 'Two witnesses required, non-family members',
      mandatory: true
    },
    {
      requirement: 'Healthcare Proxy Details',
      description: 'Full contact information and relationship',
      mandatory: true
    },
    {
      requirement: 'Physician Certification',
      description: 'Discussion documented in medical record',
      mandatory: true
    },
    {
      requirement: 'Regular Review',
      description: 'Update every 6 months or with status changes',
      mandatory: false
    }
  ];

  const culturalConsiderations: CulturalConsideration[] = [
    {
      culture: 'General Principles',
      considerations: [
        'Religious beliefs about end-of-life',
        'Family decision-making dynamics',
        'Language barriers',
        'Traditional healing practices'
      ],
      recommendations: [
        'Engage cultural/religious leaders',
        'Use professional interpreters',
        'Document cultural preferences',
        'Respect traditional practices'
      ]
    }
  ];

  const updateDirectiveStatus = (directive: string, update: Partial<DirectiveStatus>) => {
    setDirectiveStatus(prev => ({
      ...prev,
      [directive]: {
        ...prev[directive],
        ...update,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const generatePDF = () => {
    // Implement PDF generation logic
    console.log('Generating PDF...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          Advance Care Planning
        </h3>
        <button
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
                    bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 
                    transition-colors duration-200"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Directives Checklist - Full width on mobile, half on desktop */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-gray-500" />
            Essential Directives
          </h4>
          {Object.entries(directiveStatus).map(([key, status]) => (
            <div key={key} className="border rounded-lg p-3">
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-2">
                <label className="flex items-center gap-2 min-w-[200px]">
                  <input
                    type="checkbox"
                    checked={status.completed}
                    onChange={(e) => updateDirectiveStatus(key, { completed: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="font-medium text-sm capitalize">
                    {key === 'location' ? 'Preferred Location' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
                {status.lastUpdated && (
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(status.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
              <textarea
                value={status.notes}
                onChange={(e) => updateDirectiveStatus(key, { notes: e.target.value })}
                placeholder={`Enter ${key} preferences...`}
                className="mt-2 block w-full text-sm rounded-md border-gray-300 shadow-sm 
                        focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                rows={3}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            Legal Requirements
          </h4>
          {legalRequirements.map((req, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-lg p-3 sm:p-4',
                req.mandatory ? 'bg-red-50' : 'bg-gray-50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h5 className="text-sm sm:text-base font-medium">{req.requirement}</h5>
                  <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                </div>
                {req.mandatory && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 
                              rounded-full whitespace-nowrap flex-shrink-0">
                    Required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Considerations */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-gray-500" />
          Cultural Considerations
        </h4>
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
          {culturalConsiderations.map((culture, idx) => (
            <div key={idx} className="space-y-3">
              <h5 className="text-sm font-medium text-blue-900">{culture.culture}</h5>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h6 className="text-sm font-medium text-blue-800 mb-2">Key Considerations</h6>
                  <ul className="space-y-2">
                    {culture.considerations.map((item, i) => (
                      <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-blue-800 mb-2">Recommendations</h6>
                  <ul className="space-y-2">
                    {culture.recommendations.map((item, i) => (
                      <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-8 p-4 sm:p-6 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 flex items-center gap-2 mb-3">
          <Info className="h-4 w-4" />
          Next Steps
        </h4>
        <ul className="space-y-2">
          {!Object.values(directiveStatus).every(s => s.completed) && (
            <li className="text-sm text-yellow-800">Complete all essential directives</li>
          )}
          <li className="text-sm text-yellow-800">Review with healthcare team</li>
          <li className="text-sm text-yellow-800">Provide copies to relevant parties</li>
          <li className="text-sm text-yellow-800">Schedule next review date</li>
        </ul>
      </div>
    </div>
  );
}
