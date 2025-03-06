import React from 'react';

export default function AdmissionCriteria() {
  const criteria = [
    {
      category: 'Emergency Admissions',
      conditions: [
        'Febrile neutropenia',
        'Severe pain requiring IV analgesia',
        'Acute neurological deterioration',
        'Superior vena cava obstruction',
        'Spinal cord compression'
      ]
    },
    {
      category: 'Planned Admissions',
      conditions: [
        'Complex chemotherapy regimens',
        'High-dose chemotherapy',
        'Stem cell transplantation',
        'Major supportive care needs',
        'Clinical trial protocols requiring admission'
      ]
    },
    {
      category: 'Supportive Care',
      conditions: [
        'Severe symptom control issues',
        'Nutritional support initiation',
        'Complex wound care',
        'Palliative care needs',
        'Social/family support crisis'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-200/40 hover:scale-102 transition-all duration-300 ease-in-out">
      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Admission Criteria</h3>
      <div className="space-y-6">
        {criteria.map((section) => (
          <div key={section.category}>
            <h4 className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-sm transition-colors duration-300">
              {section.category}
            </h4>
            <ul className="mt-2 space-y-2">
              {section.conditions.map((condition, index) => (
                <li key={index} className="flex items-start text-sm text-gray-800 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                  <span className="mr-2 text-indigo-500">•</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
