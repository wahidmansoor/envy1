import React, { useState } from 'react';
import { ClipboardCheck, AlertTriangle, Heart, Clock, Stethoscope, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Previous interfaces remain the same
interface Symptom {
  name: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  timestamp?: string;
}

interface CarePathway {
  category: string;
  icon: JSX.Element;
  items: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    details: string[];
    medications?: {
      name: string;
      dose: string;
      route: string;
      frequency: string;
    }[];
  }[];
}

export default function TerminalCare() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, Symptom>>({
    consciousness: { name: 'Level of Consciousness', severity: 'none' },
    breathing: { name: 'Breathing Pattern', severity: 'none' },
    circulation: { name: 'Peripheral Circulation', severity: 'none' },
    secretions: { name: 'Respiratory Secretions', severity: 'none' },
    agitation: { name: 'Agitation/Restlessness', severity: 'none' },
    pain: { name: 'Pain', severity: 'none' }
  });

  const carePathways: CarePathway[] = [
    // Previous carePathways array remains the same
    {
      category: 'Clinical Assessment',
      icon: <Stethoscope className="h-5 w-5" />,
      items: [
        {
          action: 'Regular Symptom Assessment',
          priority: 'high',
          details: [
            'Monitor level of consciousness',
            'Assess breathing pattern and work',
            'Check peripheral circulation',
            'Evaluate pain status',
            'Document oral intake'
          ]
        },
        {
          action: 'Identify Terminal Phase',
          priority: 'high',
          details: [
            'Bedbound status',
            'Semi-comatose state',
            'Minimal oral intake',
            'Unable to take tablets'
          ]
        }
      ]
    },
    {
      category: 'Active Management',
      icon: <Heart className="h-5 w-5" />,
      items: [
        {
          action: 'Medication Management',
          priority: 'high',
          details: [
            'Stop non-essential medications',
            'Convert essential medications to appropriate route',
            'Ensure PRN medications available',
            'Regular review of effectiveness'
          ],
          medications: [
            {
              name: 'Morphine',
              dose: '2.5-5mg',
              route: 'SC',
              frequency: 'Q1H PRN for pain/dyspnea'
            },
            {
              name: 'Midazolam',
              dose: '2.5-5mg',
              route: 'SC',
              frequency: 'Q1H PRN for agitation'
            },
            {
              name: 'Hyoscine Butylbromide',
              dose: '20mg',
              route: 'SC',
              frequency: 'Q4H PRN for secretions'
            }
          ]
        },
        {
          action: 'Comfort Measures',
          priority: 'high',
          details: [
            'Position for comfort',
            'Regular mouth care',
            'Gentle suction if needed',
            'Monitor skin integrity'
          ]
        }
      ]
    },
    {
      category: 'Family Support',
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          action: 'Communication',
          priority: 'high',
          details: [
            'Explain expected changes',
            'Discuss hydration/feeding',
            'Address family concerns',
            'Provide emotional support'
          ]
        },
        {
          action: 'Practical Support',
          priority: 'medium',
          details: [
            'Flexible visiting hours',
            'Quiet environment',
            'Spiritual care access',
            'Bereavement support'
          ]
        }
      ]
    }
  ];

  const getSeverityClass = (severity: Symptom['severity']) => {
    switch (severity) {
      case 'none':
        return 'text-gray-600';
      case 'mild':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'severe':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const updateSymptom = (id: string, severity: Symptom['severity']) => {
    setSymptoms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        severity,
        timestamp: new Date().toISOString()
      }
    }));
  };

  return (
    <div className="rounded-lg shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-indigo-600" />
          Terminal Care Guidelines
        </h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      {/* Symptom Assessment */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 sm:mb-4">Current Symptoms</h4>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {Object.entries(symptoms).map(([id, symptom]) => (
            <div
              key={id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors",
                selectedSymptom === id ? "border-indigo-500 bg-indigo-50" : "hover:bg-gray-50"
              )}
              onClick={() => setSelectedSymptom(id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{symptom.name}</span>
                {symptom.timestamp && (
                  <span className="text-xs text-gray-500">
                    {new Date(symptom.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['none', 'mild', 'moderate', 'severe'] as const).map((severity) => (
                  <button
                    key={severity}
                    onClick={() => updateSymptom(id, severity)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-full transition-colors duration-200',
                      'touch-manipulation min-w-[60px]',
                      symptom.severity === severity
                        ? getSeverityClass(severity)
                        : 'text-gray-600'
                    )}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Pathways */}
      <div className="space-y-4">
        {carePathways.map((pathway) => (
          <div key={pathway.category} className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 sm:py-4 flex items-center gap-2">
              {pathway.icon}
              <h4 className="font-medium text-gray-900 sm:text-lg">{pathway.category}</h4>
            </div>
            <div className="p-4 space-y-4">
              {pathway.items.map((item) => (
                <div
                  key={item.action}
                  className={cn(
                    'rounded-lg p-3',
                    item.priority === 'high' ? 'bg-red-50' :
                    item.priority === 'medium' ? 'bg-yellow-50' :
                    'bg-green-50'
                  )}
                >
                  <h5 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">{item.action}</h5>
                  <ul className="space-y-1 text-sm">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {item.medications && (
                    <div className="mt-4 pt-4 border-t">
                      <h6 className="text-sm font-medium mb-2">Recommended Medications</h6>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        {item.medications.map((med, idx) => (
                          <div key={idx} className="rounded p-2 sm:p-3 text-sm">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-gray-600">
                              {med.dose} {med.route} {med.frequency}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Important Alerts */}
      <div className="border border-yellow-200 rounded-lg p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Important Notes</h4>
        </div>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-yellow-800">
          <li>Document all symptom changes and interventions</li>
          <li>Ensure anticipatory medications are prescribed</li>
          <li>Regular review of effectiveness of interventions</li>
          <li>Maintain clear communication with family/carers</li>
        </ul>
      </div>
    </div>
  );
}
