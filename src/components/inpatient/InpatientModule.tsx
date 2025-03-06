import React, { useState } from 'react';
import { 
  BedDouble,
  AlertTriangle,
  ClipboardList,
  Heart,
  LogOut
} from 'lucide-react';

import EmergencyProtocols from './EmergencyProtocols';
import AdmissionGuidelines from './AdmissionGuidelines';
import SupportiveCare from './SupportiveCare';
import DischargeChecklist from './DischargeChecklist';

interface Section {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  icon: React.ReactNode;
}

export default function InpatientModule() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: 'emergency',
      title: 'Emergency Protocols',
      description: 'Critical care guidelines for oncologic emergencies and acute complications.',
      component: <EmergencyProtocols />,
      icon: <AlertTriangle className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 'admission',
      title: 'Admission Guidelines',
      description: 'Standardized protocols for patient admission and initial assessment.',
      component: <AdmissionGuidelines />,
      icon: <ClipboardList className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 'supportive',
      title: 'Supportive Care',
      description: 'Comprehensive care protocols for managing treatment side effects.',
      component: <SupportiveCare />,
      icon: <Heart className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 'discharge',
      title: 'Discharge Planning',
      description: 'Structured checklists and guidelines for safe patient discharge.',
      component: <DischargeChecklist />,
      icon: <LogOut className="h-5 w-5 text-indigo-500" />
    }
  ];

  return (
    <div className="w-full max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 py-6 space-y-8">
      {/* Page Header */}
      <div className="rounded-xl p-6 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <BedDouble className="h-8 w-8 text-indigo-500" />
          Inpatient Oncology
        </h1>
        <p className="mt-2 text-gray-600 text-lg max-w-4xl">
          Comprehensive protocols and guidelines for managing oncology inpatients,
          including emergency care, supportive measures, and discharge planning.
        </p>
      </div>

      {/* Selectable Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`p-4 rounded-lg shadow-md hover:shadow-xl border backdrop-blur-lg transition-all duration-300 hover:scale-102
                      ${selectedSection === section.id 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-transparent hover:from-indigo-500 hover:to-purple-500' 
                        : 'bg-white/20 border-gray-200/40 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                      }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={selectedSection === section.id ? 'text-white' : ''}>
                {section.icon}
              </span>
              <h3 className="font-medium text-base">{section.title}</h3>
            </div>
            <p className={`text-sm ${
              selectedSection === section.id ? 'text-white/90' : 'text-gray-600'
            }`}>
              {section.description}
            </p>
          </button>
        ))}
      </div>

      {/* Display Selected Section */}
      {selectedSection && (
        <div className="mt-6 p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-200/40 bg-white/20 
                      backdrop-blur-lg transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            {sections.find((s) => s.id === selectedSection)?.component}
          </div>
        </div>
      )}
    </div>
  );
}
