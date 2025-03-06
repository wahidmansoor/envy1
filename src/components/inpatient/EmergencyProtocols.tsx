import React from 'react';
import { AlertTriangle } from 'lucide-react';
import EmergencyCard from './emergency/EmergencyCard';

export default function EmergencyProtocols() {
  const emergencies = [
    {
      title: 'Febrile Neutropenia',
      priority: 'high' as const,
      symptoms: [
        'Temperature ≥38.3°C once or ≥38.0°C for >1 hour',
        'Absolute neutrophil count <0.5 × 10⁹/L'
      ],
      immediateActions: [
        'Obtain blood cultures (peripheral and central line)',
        'Complete blood count, renal and liver function',
        'Start broad-spectrum antibiotics within 1 hour'
      ],
      monitoring: [
        'Vital signs every 4 hours',
        'Daily blood counts',
        'Clinical assessment twice daily'
      ]
    },
    {
      title: 'Tumor Lysis Syndrome',
      priority: 'high' as const,
      symptoms: [
        'Hyperuricemia',
        'Hyperkalemia',
        'Hyperphosphatemia',
        'Hypocalcemia'
      ],
      immediateActions: [
        'Aggressive hydration (2-3L/m²/day)',
        'Check electrolytes every 4-6 hours',
        'Start allopurinol or rasburicase',
        'ECG monitoring'
      ],
      monitoring: [
        'Strict input/output monitoring',
        'Electrolytes every 4-6 hours',
        'Uric acid levels daily'
      ]
    },
    {
      title: 'Spinal Cord Compression',
      priority: 'high' as const,
      symptoms: [
        'Back pain',
        'Progressive weakness',
        'Sensory level',
        'Bowel/bladder dysfunction'
      ],
      immediateActions: [
        'Start dexamethasone 16mg IV stat',
        'Urgent MRI whole spine',
        'Neurosurgery/radiation oncology consult',
        'Strict spine precautions'
      ],
      monitoring: [
        'Neurological observations hourly',
        'Pain assessment',
        'Bladder function monitoring'
      ]
    }
  ];

  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">Oncologic Emergencies</h2>
      </div>

      <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 backdrop-blur-md border border-indigo-300/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg">
        <div className="ml-3">
          <p className="text-sm text-gray-700 font-medium">
            These protocols are for emergency situations requiring immediate attention. 
            Early recognition and prompt intervention is crucial for optimal outcomes.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
        {emergencies.map((emergency, index) => (
          <EmergencyCard key={index} emergency={emergency} />
        ))}
      </div>
    </div>
  );
}
