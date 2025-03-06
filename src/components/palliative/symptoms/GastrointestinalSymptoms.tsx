import React, { useState } from 'react';
import { Activity, LineChart, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Rest of the code remains the same
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

export default function GastrointestinalSymptoms() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, Symptom>>({
    nausea: { name: 'Nausea', severity: 0, interventions: [] },
    vomiting: { name: 'Vomiting', severity: 0, interventions: [] },
    constipation: { name: 'Constipation', severity: 0, interventions: [] },
    diarrhea: { name: 'Diarrhea', severity: 0, interventions: [] },
    anorexia: { name: 'Anorexia', severity: 0, interventions: [] }
  });

  const protocols: Record<string, SymptomProtocol> = {
    nausea: {
      assessmentTools: [
        'ESAS Score (0-10)',
        'Frequency in 24 hours',
        'Relation to medications/meals',
        'Impact on oral intake'
      ],
      nonPharmacological: [
        'Small, frequent meals',
        'Avoid strong odors',
        'Cool, fresh air',
        'Relaxation techniques',
        'Ginger tea/supplements'
      ],
      medications: [
        {
          name: 'Ondansetron',
          class: '5-HT3 Antagonist',
          dose: '4-8mg',
          frequency: 'Q8H',
          route: 'PO/IV/SC',
          maxDaily: '32mg',
          cautions: ['QT prolongation', 'Constipation'],
          alternatives: ['Granisetron', 'Palonosetron']
        },
        {
          name: 'Metoclopramide',
          class: 'D2 Antagonist',
          dose: '10mg',
          frequency: 'QID',
          route: 'PO/IV/SC',
          maxDaily: '40mg',
          cautions: ['Extrapyramidal symptoms', 'Avoid in bowel obstruction'],
          alternatives: ['Domperidone', 'Haloperidol']
        }
      ],
      monitoring: [
        'Symptom diary',
        'Oral intake record',
        'Weight changes',
        'Hydration status'
      ],
      escalation: [
        'Consider alternative antiemetics',
        'Review for underlying causes',
        'Consider gastroenterology referral',
        'Consider parenteral nutrition if prolonged'
      ]
    },
    constipation: {
      assessmentTools: [
        'Bowel movement frequency',
        'Bristol stool chart',
        'Abdominal examination',
        'Digital rectal exam if indicated'
      ],
      nonPharmacological: [
        'Adequate hydration',
        'Mobility as tolerated',
        'Fiber-rich diet if appropriate',
        'Regular toileting routine'
      ],
      medications: [
        {
          name: 'Senna',
          class: 'Stimulant laxative',
          dose: '15mg',
          frequency: 'Daily-BD',
          route: 'PO',
          maxDaily: '30mg',
          cautions: ['Abdominal cramps'],
          alternatives: ['Bisacodyl', 'Sodium picosulfate']
        },
        {
          name: 'Macrogol',
          class: 'Osmotic laxative',
          dose: '1-3 sachets',
          frequency: 'Daily',
          route: 'PO',
          maxDaily: '3 sachets',
          cautions: ['Ensure adequate fluid intake'],
          alternatives: ['Lactulose', 'Magnesium salts']
        }
      ],
      monitoring: [
        'Daily bowel diary',
        'Abdominal symptoms',
        'Response to interventions',
        'Side effects of medications'
      ],
      escalation: [
        'Combine different classes of laxatives',
        'Consider rectal interventions',
        'Review opioid regimen',
        'Exclude bowel obstruction'
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
          <Activity className="h-5 w-5 text-indigo-600" />
          Gastrointestinal Symptoms
        </h3>
        <button
          onClick={() => {}} // Add export functionality
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Export Report
        </button>
      </div>

      {/* Symptom Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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