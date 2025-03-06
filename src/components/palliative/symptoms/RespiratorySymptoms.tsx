import React, { useState } from 'react';
import { Wind, LineChart, AlertTriangle, Clock, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Keep all interfaces and type definitions
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

export default function RespiratorySymptoms() {
  // Keep all state and protocol definitions
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, Symptom>>({
    dyspnea: { name: 'Dyspnea', severity: 0, interventions: [] },
    cough: { name: 'Cough', severity: 0, interventions: [] },
    secretions: { name: 'Secretions', severity: 0, interventions: [] },
    hemoptysis: { name: 'Hemoptysis', severity: 0, interventions: [] }
  });

  // Keep all protocol definitions
  const protocols: Record<string, SymptomProtocol> = {
    dyspnea: {
      assessmentTools: [
        'Modified Borg Scale (0-10)',
        'Respiratory rate',
        'Oxygen saturation',
        'Work of breathing',
        'Activity limitation assessment'
      ],
      nonPharmacological: [
        'Positioning (upright, forward lean)',
        'Cool air flow (fan)',
        'Breathing exercises',
        'Activity pacing',
        'Anxiety management'
      ],
      medications: [
        {
          name: 'Morphine',
          class: 'Opioid',
          dose: '2.5-5mg',
          frequency: 'Q4H PRN',
          route: 'PO/SC',
          maxDaily: 'Titrate to effect',
          cautions: ['Respiratory depression', 'Monitor sedation'],
          alternatives: ['Oxycodone', 'Hydromorphone']
        },
        {
          name: 'Lorazepam',
          class: 'Benzodiazepine',
          dose: '0.5-1mg',
          frequency: 'Q6H PRN',
          route: 'SL/PO',
          maxDaily: '4mg',
          cautions: ['Sedation', 'Falls risk'],
          alternatives: ['Midazolam', 'Clonazepam']
        }
      ],
      monitoring: [
        'Respiratory rate trend',
        'Oxygen saturation',
        'Level of consciousness',
        'Activity tolerance',
        'Response to interventions'
      ],
      escalation: [
        'Increase opioid dose if needed',
        'Consider oxygen therapy',
        'Review for reversible causes',
        'Consider palliative sedation if refractory'
      ]
    },
    secretions: {
      assessmentTools: [
        'Volume assessment',
        'Character of secretions',
        'Impact on breathing',
        'Effectiveness of clearing'
      ],
      nonPharmacological: [
        'Positioning',
        'Humidification',
        'Oral care',
        'Suctioning if appropriate'
      ],
      medications: [
        {
          name: 'Hyoscine Butylbromide',
          class: 'Anticholinergic',
          dose: '20mg',
          frequency: 'Q4H PRN',
          route: 'SC',
          maxDaily: '120mg',
          cautions: ['Urinary retention', 'Confusion in elderly'],
          alternatives: ['Glycopyrronium', 'Atropine']
        }
      ],
      monitoring: [
        'Secretion volume',
        'Swallowing ability',
        'Respiratory comfort',
        'Side effects'
      ],
      escalation: [
        'Increase anticholinergic dose',
        'Consider alternative medication',
        'Review hydration status',
        'Consider suction device'
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

  return (
    <div className="rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Wind className="h-5 w-5 text-indigo-600" />
          Respiratory Symptoms
        </h3>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      {/* Keep all the existing JSX structure */}
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

      {/* Selected Symptom Protocol */}
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
