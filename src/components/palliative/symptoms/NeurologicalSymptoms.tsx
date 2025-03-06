import React, { useState } from 'react';
import { Brain, LineChart, AlertTriangle, Clock, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Medication {
  name: string;
  class: string;
  dose: string;
  frequency: string;
  route: string;
  maxDaily: string;
  cautions: string[];
  alternatives: string[];
}

interface Symptom {
  name: string;
  severity: number;
  lastAssessment?: string;
  interventions: {
    type: string;
    timestamp: string;
    effectiveness: 'none' | 'partial' | 'complete';
  }[];
}

interface SymptomProtocol {
  assessmentTools: string[];
  nonPharmacological: string[];
  medications: Medication[];
  monitoring: string[];
  escalation: string[];
}

export default function NeurologicalSymptoms() {
  // Rest of the component implementation remains the same
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, Symptom>>({
    delirium: { name: 'Delirium', severity: 0, interventions: [] },
    seizures: { name: 'Seizures', severity: 0, interventions: [] },
    agitation: { name: 'Agitation', severity: 0, interventions: [] },
    confusion: { name: 'Confusion', severity: 0, interventions: [] }
  });

  // Protocol definitions
  const protocols: Record<string, SymptomProtocol> = {
    delirium: {
      assessmentTools: [
        'Confusion Assessment Method (CAM)',
        'Richmond Agitation-Sedation Scale',
        'Level of consciousness',
        'Orientation assessment',
        'Safety screening'
      ],
      nonPharmacological: [
        'Maintain day-night cycle',
        'Regular reorientation',
        'Familiar faces/objects',
        'Adequate hydration',
        'Remove physical restraints'
      ],
      medications: [
        {
          name: 'Haloperidol',
          class: 'Antipsychotic',
          dose: '0.5-1mg',
          frequency: 'Q2H PRN',
          route: 'PO/SC',
          maxDaily: '5mg',
          cautions: ['QT prolongation', 'Extrapyramidal symptoms'],
          alternatives: ['Risperidone', 'Olanzapine']
        },
        {
          name: 'Midazolam',
          class: 'Benzodiazepine',
          dose: '2.5mg',
          frequency: 'Q1H PRN',
          route: 'SC',
          maxDaily: '15mg',
          cautions: ['Respiratory depression', 'Paradoxical agitation'],
          alternatives: ['Lorazepam', 'Clonazepam']
        }
      ],
      monitoring: [
        'Hourly in acute phase',
        'Level of consciousness',
        'Vital signs',
        'Hydration status',
        'Medication effects'
      ],
      escalation: [
        'Increase antipsychotic dose',
        'Add benzodiazepine if needed',
        'Consider CT head if new onset',
        'Review for reversible causes'
      ]
    },
    seizures: {
      assessmentTools: [
        'Seizure characteristics',
        'Frequency monitoring',
        'Post-ictal assessment',
        'Trigger identification'
      ],
      nonPharmacological: [
        'Safety positioning',
        'Padding/protection',
        'Remove hazards',
        'Family education'
      ],
      medications: [
        {
          name: 'Midazolam',
          class: 'Benzodiazepine',
          dose: '5-10mg',
          frequency: 'For acute seizures',
          route: 'Buccal/IM',
          maxDaily: '30mg',
          cautions: ['Respiratory depression', 'Monitor airway'],
          alternatives: ['Lorazepam', 'Diazepam']
        },
        {
          name: 'Levetiracetam',
          class: 'Anticonvulsant',
          dose: '250-500mg',
          frequency: 'BD',
          route: 'PO/IV',
          maxDaily: '3000mg',
          cautions: ['Renal adjustment', 'Mood changes'],
          alternatives: ['Sodium valproate', 'Phenytoin']
        }
      ],
      monitoring: [
        'Seizure diary',
        'Post-ictal recovery',
        'Medication levels if indicated',
        'Side effect assessment'
      ],
      escalation: [
        'Increase anticonvulsant dose',
        'Add second agent if needed',
        'Consider status protocol',
        'Review for brain metastases'
      ]
    }
  };

  const severityLevels = [
    { value: 0, label: 'None', color: 'text-gray-600' },
    { value: 1, label: 'Mild', color: 'text-green-700' },
    { value: 2, label: 'Moderate', color: 'text-yellow-700' },
    { value: 3, label: 'Severe', color: 'text-red-700' }
  ];

  const updateSymptomSeverity = (symptomId: string, severity: number) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomId]: {
        ...prev[symptomId],
        severity,
        lastAssessment: new Date().toISOString()
      }
    }));
  };

  const addIntervention = (symptomId: string, type: string, effectiveness: 'none' | 'partial' | 'complete') => {
    setSymptoms(prev => ({
      ...prev,
      [symptomId]: {
        ...prev[symptomId],
        interventions: [
          ...prev[symptomId].interventions,
          {
            type,
            effectiveness,
            timestamp: new Date().toISOString()
          }
        ]
      }
    }));
  };

  // Rest of the component JSX remains the same
  return (
    <div className="rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          Neurological Symptoms
        </h3>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      {/* Symptom Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(symptoms).map(([id, symptom]) => (
          <div
            key={id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-colors",
              selectedSymptom === id ? "border-indigo-500 bg-indigo-50" : "hover:bg-gray-50"
            )}
            onClick={() => setSelectedSymptom(id)}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">{symptom.name}</h4>
              {symptom.lastAssessment && (
                <span className="text-xs text-gray-500">
                  {new Date(symptom.lastAssessment).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Severity Selection */}
            <div className="flex gap-2">
              {severityLevels.map(level => (
                <button
                  key={level.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSymptomSeverity(id, level.value);
                  }}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    symptom.severity === level.value ? level.color : "bg-gray-50"
                  )}
                >
                  {level.label}
                </button>
              ))}
            </div>

            {/* Recent Interventions */}
            {symptom.interventions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-xs text-gray-500">Latest intervention:</span>
                <div className="mt-1 text-sm">
                  {symptom.interventions[symptom.interventions.length - 1].type}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Protocol Display */}
      {selectedSymptom && protocols[selectedSymptom] && (
        <div className="border-t pt-6 mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Management Protocol</h4>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Assessment and Non-pharmacological */}
            <div className="space-y-4">
              <div className="rounded-lg p-4">
                <h5 className="font-medium text-sm mb-3">Assessment</h5>
                <ul className="space-y-2">
                  {protocols[selectedSymptom].assessmentTools.map((tool, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span>•</span>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg p-4">
                <h5 className="font-medium text-sm mb-3">Non-pharmacological Measures</h5>
                <ul className="space-y-2">
                  {protocols[selectedSymptom].nonPharmacological.map((measure, idx) => (
                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <div className="rounded-lg p-4">
                <h5 className="font-medium text-sm mb-3">Medications</h5>
                {protocols[selectedSymptom].medications.map((med, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{med.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {med.class}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-gray-600">Dose:</dt>
                      <dd>{med.dose}</dd>
                      <dt className="text-gray-600">Route:</dt>
                      <dd>{med.route}</dd>
                      <dt className="text-gray-600">Frequency:</dt>
                      <dd>{med.frequency}</dd>
                      <dt className="text-gray-600">Max Daily:</dt>
                      <dd>{med.maxDaily}</dd>
                    </dl>
                    {med.cautions.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                        <span className="font-medium text-yellow-800">Cautions: </span>
                        {med.cautions.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monitoring and Escalation */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg p-4">
              <h5 className="font-medium text-sm mb-3">Monitoring</h5>
              <ul className="space-y-2">
                {protocols[selectedSymptom].monitoring.map((item, idx) => (
                  <li key={idx} className="text-sm text-indigo-700 flex items-start gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg p-4">
              <h5 className="font-medium text-sm mb-3">Escalation Plan</h5>
              <ul className="space-y-2">
                {protocols[selectedSymptom].escalation.map((item, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
