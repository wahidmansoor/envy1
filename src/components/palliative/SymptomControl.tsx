import React, { useState } from 'react';
import { Activity, Search, ThermometerSnowflake, Wind, LayoutGrid, LayoutList } from 'lucide-react';
import EnhancedSymptomView from './EnhancedSymptomView';

interface ClassicSymptom {
  id: string;
  name: string;
  description: string;
  interventions: {
    nonPharmacological: string[];
    pharmacological: string[];
  };
  monitoring: string[];
  icon: React.ReactNode;
}

interface ViewMode {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const viewModes: ViewMode[] = [
  { id: 'classic', name: 'Classic View', icon: <LayoutGrid className="h-6 w-6" /> },
  { id: 'new', name: 'Detailed View', icon: <LayoutList className="h-6 w-6" /> }
];

const classicSymptoms: ClassicSymptom[] = [
  {
    id: 'dyspnea',
    name: 'Dyspnea',
    description: 'Breathlessness or shortness of breath',
    interventions: {
      nonPharmacological: [
        'Positioning (upright, forward lean)',
        'Fan therapy',
        'Breathing exercises',
        'Anxiety management'
      ],
      pharmacological: [
        'Opioids (morphine/hydromorphone)',
        'Anxiolytics if needed',
        'Oxygen therapy if hypoxic',
        'Bronchodilators if indicated'
      ]
    },
    monitoring: [
      'Respiratory rate',
      'Oxygen saturation',
      'Work of breathing',
      'Associated anxiety'
    ],
    icon: <Wind className="h-6 w-6" />
  },
  {
    id: 'nausea',
    name: 'Nausea/Vomiting',
    description: 'Treatment of nausea and prevention of vomiting',
    interventions: {
      nonPharmacological: [
        'Environmental modifications',
        'Small frequent meals',
        'Avoid strong odors',
        'Relaxation techniques'
      ],
      pharmacological: [
        'Metoclopramide',
        'Ondansetron',
        'Haloperidol',
        'Dexamethasone if indicated'
      ]
    },
    monitoring: [
      'Frequency of episodes',
      'Oral intake',
      'Hydration status',
      'Medication effectiveness'
    ],
    icon: <ThermometerSnowflake className="h-6 w-6" />
  }
];

export default function SymptomControl() {
  const [viewMode, setViewMode] = useState<'classic' | 'new'>('classic');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('dyspnea');

  const currentSymptom = classicSymptoms.find(s => s.id === selectedSymptom);

  return (
    <div className="space-y-8">
      {/* View Mode Selection */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as 'classic' | 'new')}
              className={`inline-flex items-center px-4 py-2 border border-opacity-40 transition-all duration-300 ${
                viewMode === mode.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-white/10 backdrop-blur-md text-gray-700 border-gray-200/40 hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
              } ${mode.id === 'classic' ? 'rounded-l-xl' : 'rounded-r-xl'}`}
            >
              {mode.icon}
              <span className="ml-2">{mode.name}</span>
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'classic' ? (
        <>
          {/* Classic Symptom Management View */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-indigo-500" />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Symptom Management</span>
            </h2>
            <div className="flex flex-wrap gap-4 mb-6">
              {classicSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => setSelectedSymptom(symptom.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 shadow-md
                            hover:shadow-xl backdrop-blur-lg
                    ${selectedSymptom === symptom.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent hover:from-indigo-500 hover:to-purple-500'
                      : 'bg-white/20 text-gray-700 border border-gray-200/40 hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 opacity-85 hover:opacity-100'
                    }`}
                >
                  <span className={selectedSymptom === symptom.id ? 'text-white' : 'text-indigo-500'}>
                    {symptom.icon}
                  </span>
                  {symptom.name}
                </button>
              ))}
            </div>
          </section>

          {/* Selected Symptom Details */}
          {currentSymptom && (
            <div className="rounded-xl border border-gray-200/40 overflow-hidden bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg shadow-md 
                          hover:shadow-xl transition-all duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-indigo-500">{currentSymptom.icon}</span>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{currentSymptom.name}</h3>
                </div>
                <p className="text-gray-600 mb-6">{currentSymptom.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interventions */}
                  <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                               hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
                    <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Non-Pharmacological</h4>
                    <ul className="space-y-2">
                      {currentSymptom.interventions.nonPharmacological.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                          <span className="text-indigo-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                               hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
                    <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Pharmacological</h4>
                    <ul className="space-y-2">
                      {currentSymptom.interventions.pharmacological.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                          <span className="text-indigo-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Monitoring Section */}
              <div className="p-6 border-t border-gray-200/40 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg 
                           hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-3">
                  <Search className="h-6 w-6 text-indigo-500" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Monitoring Parameters</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentSymptom.monitoring.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        // New View content will be implemented here
        <EnhancedSymptomView />
      )}
    </div>
  );
}
