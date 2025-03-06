import React from 'react';
import { Heart, FileText, Users, AlertTriangle } from 'lucide-react';

interface CareGuideline {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  instructions: string[];
}

const careGuidelines: CareGuideline[] = [
  {
    title: 'Comfort Care Measures',
    description: 'Essential interventions for patient comfort',
    priority: 'high',
    instructions: [
      'Regular mouth care',
      'Positioning for comfort',
      'Environmental adjustments',
      'Symptom management protocols'
    ]
  },
  {
    title: 'Family Support',
    description: 'Guidelines for supporting family members',
    priority: 'high',
    instructions: [
      'Regular communication updates',
      'Emotional support provision',
      'Resource connections',
      'Bereavement care planning'
    ]
  },
  {
    title: 'Documentation',
    description: 'Critical documentation requirements',
    priority: 'medium',
    instructions: [
      'Advance directives review',
      'DNR status confirmation',
      'Medication adjustments',
      'Care plan updates'
    ]
  }
];

export default function EndOfLifeCare() {
  return (
    <div className="space-y-8">
      {/* Care Guidelines Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Heart className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">End of Life Care Guidelines</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careGuidelines.map((guideline) => (
            <div key={guideline.title} 
              className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out opacity-85 hover:opacity-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{guideline.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  guideline.priority === 'high' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : guideline.priority === 'medium'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white/90'
                    : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white/80'
                } shadow-sm transition-all duration-300`}>
                  {guideline.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{guideline.description}</p>
              <ul className="space-y-2">
                {guideline.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                    <span className="text-indigo-500">•</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Care Planning */}
      <section className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-md 
                       hover:shadow-xl transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-indigo-500" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Advanced Care Planning</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Advance Directives
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Healthcare Proxy
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                MOLST/POLST Forms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                DNR Documentation
              </li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Discussion Points</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Goals of Care
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Treatment Preferences
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Family Involvement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                Cultural Considerations
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Family Support */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                     hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Family Support Services</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Social Work Consultation
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Spiritual Care Services
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Grief Counseling
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Support Groups
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                     hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Critical Considerations</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Cultural Sensitivity
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Communication Timing
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Resource Availability
            </li>
            <li className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Follow-up Planning
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
