import React from 'react';
import { ClipboardCheck } from 'lucide-react';

export default function DischargeChecklist() {
  const checklist = [
    {
      category: 'Clinical Status',
      items: [
        'Stable vital signs for 24 hours',
        'Adequate pain control with oral medications',
        'Stable or improving symptoms',
        'No active infections',
        'Adequate oral intake'
      ]
    },
    {
      category: 'Medications',
      items: [
        'Discharge prescriptions prepared',
        'Medication reconciliation completed',
        'Patient education on new medications',
        'Follow-up prescriptions arranged',
        'Anticoagulation plan if needed'
      ]
    },
    {
      category: 'Follow-up Plan',
      items: [
        'Outpatient appointments scheduled',
        'Laboratory tests arranged',
        'Imaging studies planned',
        'Home care services organized',
        'Emergency contact information provided'
      ]
    },
    {
      category: 'Patient Education',
      items: [
        'Warning signs and symptoms reviewed',
        'Activity restrictions discussed',
        'Diet and nutrition guidelines provided',
        'Wound care instructions if applicable',
        'When to seek urgent care explained'
      ]
    }
  ];

  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">Discharge Planning</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {checklist.map((section) => (
          <div key={section.category} className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-200/40 hover:scale-102 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">{section.category}</h3>
            <ul className="space-y-3">
              {section.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`${section.category.toLowerCase()}-${index}`}
                    name={`${section.category.toLowerCase()}-${index}`}
                    aria-label={item}
                    className="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 transition-colors duration-300"
                  />
                  <label
                    htmlFor={`${section.category.toLowerCase()}-${index}`}
                    className="ml-3 text-sm text-gray-800 p-2 rounded-lg w-full hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300"
                  >
                    {item}</label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
