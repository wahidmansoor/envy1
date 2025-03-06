import React from 'react';

export default function AdmissionChecklist() {
  const checklist = [
    {
      title: 'Initial Assessment',
      items: [
        'Vital signs and performance status',
        'Current medications review',
        'Recent chemotherapy history',
        'Allergies documentation',
        'Weight and height measurement'
      ]
    },
    {
      title: 'Required Investigations',
      items: [
        'Complete blood count',
        'Comprehensive metabolic panel',
        'Coagulation profile',
        'Chest X-ray if indicated',
        'ECG if indicated'
      ]
    },
    {
      title: 'Documentation',
      items: [
        'Admission note completion',
        'Treatment plan documentation',
        'Consent forms if required',
        'Advanced care directives',
        'Contact information verification'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-200/40 hover:scale-102 transition-all duration-300 ease-in-out">
      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Admission Checklist</h3>
      <div className="space-y-6">
        {checklist.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-sm transition-colors duration-300">
              {section.title}
            </h4>
            <ul className="mt-3 space-y-3">
              {section.items.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-gray-800 p-2 rounded-lg group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                  <input
                    type="checkbox"
                    id={`${section.title.toLowerCase()}-${index}`}
                    name={`${section.title.toLowerCase()}-${index}`}
                    aria-label={item}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 transition-colors duration-300"
                  />
                  <label 
                    htmlFor={`${section.title.toLowerCase()}-${index}`}
                    className="ml-3 group-hover:text-gray-900 transition-colors duration-300"
                  >{item}</label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
