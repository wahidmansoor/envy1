import React from 'react';
import { Pill } from 'lucide-react';

const premedications = [
  {
    category: 'Antiemetics',
    medications: [
      {
        name: 'Ondansetron',
        dose: '8-16mg IV',
        timing: '30 mins before chemo',
        indications: ['Highly emetogenic chemotherapy', 'Moderately emetogenic chemotherapy']
      },
      {
        name: 'Dexamethasone',
        dose: '8-12mg IV',
        timing: '30 mins before chemo',
        indications: ['Highly emetogenic chemotherapy', 'Prevention of hypersensitivity']
      }
    ]
  },
  {
    category: 'Hypersensitivity Prophylaxis',
    medications: [
      {
        name: 'Diphenhydramine',
        dose: '25-50mg IV',
        timing: '30 mins before taxanes',
        indications: ['Taxane chemotherapy', 'History of mild reactions']
      },
      {
        name: 'Ranitidine',
        dose: '50mg IV',
        timing: '30 mins before taxanes',
        indications: ['Taxane chemotherapy', 'Platinum agents']
      }
    ]
  }
];

export default function PreMedications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Pre-Medications</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {premedications.map((category) => (
          <div key={category.category} className="bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="font-medium text-gray-900 mb-4">{category.category}</h3>
            <div className="space-y-4">
              {category.medications.map((med) => (
                <div key={med.name} className="bg-white bg-opacity-40 rounded-lg border border-gray-200 border-opacity-40 p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{med.name}</h4>
                    <span className="text-sm text-indigo-600">{med.dose}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Timing: {med.timing}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Indications:</p>
                    <ul className="space-y-1">
                      {med.indications.map((indication, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="mr-2">•</span>
                          {indication}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
