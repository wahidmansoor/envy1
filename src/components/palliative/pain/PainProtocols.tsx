import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Calculator, Pill } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Protocol {
  step: string;
  level: 'mild' | 'moderate' | 'severe';
  painRange: string;
  medications: {
    name: string;
    dosing: string;
    route: string;
    frequency: string;
    maxDose: string;
    cautions: string[];
  }[];
  adjuvants?: {
    name: string;
    indications: string[];
    dosing: string;
  }[];
  notes: string[];
  monitoring: string[];
}

const protocols: Protocol[] = [
  {
    step: 'Step 1',
    level: 'mild',
    painRange: '1-3',
    medications: [
      {
        name: 'Paracetamol',
        dosing: '1g',
        route: 'PO/IV',
        frequency: 'Q6H',
        maxDose: '4g/24h',
        cautions: ['Hepatic impairment', 'Renal impairment']
      },
      {
        name: 'Ibuprofen',
        dosing: '400mg',
        route: 'PO',
        frequency: 'Q8H',
        maxDose: '1200mg/24h',
        cautions: ['GI bleeding risk', 'Renal impairment', 'Concurrent anticoagulation']
      }
    ],
    adjuvants: [
      {
        name: 'Gabapentin',
        indications: ['Neuropathic pain', 'Radiating pain'],
        dosing: 'Start 300mg daily, titrate as needed'
      }
    ],
    notes: [
      'Consider adjuvants early for neuropathic pain',
      'Regular dosing more effective than PRN'
    ],
    monitoring: [
      'Pain score Q4H',
      'Liver function if prolonged paracetamol use',
      'Renal function if NSAID use'
    ]
  },
  {
    step: 'Step 2',
    level: 'moderate',
    painRange: '4-6',
    medications: [
      {
        name: 'Tramadol',
        dosing: '50-100mg',
        route: 'PO',
        frequency: 'Q6H',
        maxDose: '400mg/24h',
        cautions: ['Seizure risk', 'Serotonin syndrome with SSRIs']
      },
      {
        name: 'Codeine',
        dosing: '30-60mg',
        route: 'PO',
        frequency: 'Q4H',
        maxDose: '240mg/24h',
        cautions: ['Variable metabolism', 'Constipation']
      }
    ],
    adjuvants: [
      {
        name: 'Pregabalin',
        indications: ['Neuropathic pain', 'Better bioavailability than gabapentin'],
        dosing: 'Start 75mg BD, titrate as needed'
      }
    ],
    notes: [
      'Continue Step 1 medications',
      'Start laxatives prophylactically',
      'Consider switching to Step 3 if inadequate response'
    ],
    monitoring: [
      'Pain score Q4H',
      'Sedation score',
      'Bowel movements',
      'Signs of opioid toxicity'
    ]
  },
  {
    step: 'Step 3',
    level: 'severe',
    painRange: '7-10',
    medications: [
      {
        name: 'Morphine',
        dosing: '5-10mg',
        route: 'IV/SC',
        frequency: 'Q4H',
        maxDose: 'No ceiling dose - titrate to effect',
        cautions: ['Respiratory depression', 'Renal impairment']
      },
      {
        name: 'Oxycodone',
        dosing: '5-10mg',
        route: 'PO',
        frequency: 'Q4H',
        maxDose: 'No ceiling dose - titrate to effect',
        cautions: ['Higher cost', 'Similar precautions to morphine']
      }
    ],
    adjuvants: [
      {
        name: 'Ketamine',
        indications: ['Opioid resistance', 'Neuropathic pain'],
        dosing: 'Specialist supervision required'
      },
      {
        name: 'Dexamethasone',
        indications: ['Bone pain', 'Nerve compression'],
        dosing: '8mg daily, review duration'
      }
    ],
    notes: [
      'Consider PCA for severe uncontrolled pain',
      'Regular laxatives mandatory',
      'Anti-emetics as needed',
      'Review adjuvant medications'
    ],
    monitoring: [
      'Pain score Q2H until stable',
      'Continuous pulse oximetry if opioid naive',
      'Regular sedation scoring',
      'Daily opioid requirements'
    ]
  }
];

export default function PainProtocols() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 flex items-center gap-2 
                   text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        <Pill className="h-5 w-5 flex-shrink-0 text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-600 to-purple-600" />
        WHO Pain Ladder Protocol
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {protocols.map((protocol) => (
          <div 
            key={protocol.step}
            className={cn(
              'rounded-lg overflow-hidden transition-all duration-300',
              'border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
              protocol.level === 'mild' ? 
                'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50' :
              protocol.level === 'moderate' ? 
                'border-purple-200 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50' :
                'border-red-200 hover:border-red-300 bg-gradient-to-br from-white to-red-50',
              expandedStep === protocol.step && 'ring-2 ring-indigo-500 ring-offset-2'
            )}
          >
            <button
              onClick={() => setExpandedStep(expandedStep === protocol.step ? null : protocol.step)}
              className={cn(
                'w-full px-4 py-4 sm:py-5 flex items-center justify-between',
                'transition-colors duration-200 focus:outline-none group',
                'hover:bg-opacity-75'
              )}
            >
              <div className="flex items-start gap-3">
                {expandedStep === protocol.step ? (
                  <ChevronDown 
                    className="h-5 w-5 text-blue-600 transform transition-transform duration-300" 
                  />
                ) : (
                  <ChevronRight 
                    className="h-5 w-5 text-gray-400 group-hover:text-purple-600 
                              transform transition-transform duration-300 group-hover:translate-x-0.5" 
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium sm:text-lg text-gray-900">
                    {protocol.step} - {protocol.level.charAt(0).toUpperCase() + protocol.level.slice(1)} Pain
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">Pain Score: {protocol.painRange}</p>
                </div>
              </div>
            </button>

            {expandedStep === protocol.step && (
              <div 
                className="p-4 sm:p-6 space-y-6"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'opacity 300ms ease-out, transform 300ms ease-out'
                }}
              >
                <div className="space-y-4">
                  <h5 className="font-medium text-sm sm:text-base text-gray-900 flex items-center gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{protocol.step}</span>
                    Medications
                  </h5>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {protocol.medications.map((med) => (
                      <div 
                        key={med.name} 
                        className="border rounded-lg overflow-hidden bg-white shadow-sm 
                                 hover:shadow-md transition-shadow duration-200"
                      >
                        <button
                          onClick={() => setExpandedMed(expandedMed === med.name ? null : med.name)}
                          className="
                            w-full px-4 py-3 sm:py-4 flex items-center justify-between 
                            hover:bg-gray-50 transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-purple-500 group
                          "
                        >
                          <span className="font-medium text-sm sm:text-base text-gray-900">{med.name}</span>
                          {expandedMed === med.name ? (
                            <ChevronDown className="h-4 w-4 text-purple-600 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 
                                                   transition-transform duration-200 group-hover:translate-x-0.5" />
                          )}
                        </button>
                        {expandedMed === med.name && (
                          <div 
                            className="px-4 py-4 border-t bg-gray-50 space-y-4"
                            style={{
                              opacity: 1,
                              transform: 'translateY(0)',
                              transition: 'opacity 200ms ease-out, transform 200ms ease-out'
                            }}
                          >
                            <div className="grid sm:grid-cols-2 gap-4">
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <dt className="text-gray-500">Dosing</dt>
                                <dd className="font-medium text-gray-900">{med.dosing}</dd>
                                <dt className="text-gray-500">Route</dt>
                                <dd className="font-medium text-gray-900">{med.route}</dd>
                                <dt className="text-gray-500">Frequency</dt>
                                <dd className="font-medium text-gray-900">{med.frequency}</dd>
                                <dt className="text-gray-500">Max Dose</dt>
                                <dd className="font-medium text-gray-900">{med.maxDose}</dd>
                              </dl>
                            </div>
                            {med.cautions.length > 0 && (
                              <div className="pt-3 border-t border-gray-200">
                                <h6 className="text-sm font-medium text-purple-800 flex items-center gap-2 mb-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Cautions
                                </h6>
                                <ul className="grid gap-2 text-sm text-yellow-800">
                                  {med.cautions.map((caution, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="select-none">•</span>
                                      <span>{caution}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {protocol.adjuvants && (
                  <div>
                    <h5 className="font-medium text-sm sm:text-base text-gray-900 mb-4">Adjuvant Medications</h5>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      {protocol.adjuvants.map((adjuvant, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 sm:p-5">
                          <h6 className="font-medium text-sm sm:text-base text-purple-900">{adjuvant.name}</h6>
                          <dl className="mt-2 text-sm">
                            <dt className="text-blue-800 font-medium mb-1">Indications</dt>
                            <dd className="mt-1">
                              <ul className="space-y-1 text-blue-700">
                                {adjuvant.indications.map((ind, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="select-none">•</span>
                                    <span>{ind}</span>
                                  </li>
                                ))}
                              </ul>
                            </dd>
                            <dt className="text-blue-800 font-medium mt-3 mb-1">Dosing</dt>
                            <dd className="text-blue-700">{adjuvant.dosing}</dd>
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 sm:p-5">
                    <h5 className="font-medium text-sm sm:text-base text-blue-900 mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-purple-600" />
                      Monitoring Requirements
                    </h5>
                    <ul className="space-y-2 text-sm text-indigo-700">
                      {protocol.monitoring.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
                    <h5 className="font-medium text-sm sm:text-base text-gray-900 mb-3">Important Notes</h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {protocol.notes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="select-none">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
