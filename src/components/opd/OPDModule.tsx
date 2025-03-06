import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import PatientEvaluation from './PatientEvaluation';
import DiagnosticPathways from './DiagnosticPathways';
import CancerScreeningSupabase from './CancerScreeningSupabase';
import ReferralGuidelines from './ReferralGuidelines';

interface Section {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export default function OPDModule() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: 'evaluation',
      title: 'Patient Evaluation',
      description: 'Comprehensive assessment tools and protocols for oncology patients.',
      component: <PatientEvaluation />
    },
    {
      id: 'pathways',
      title: 'Diagnostic Pathways',
      description: 'Standardized pathways for cancer diagnosis and staging.',
      component: <DiagnosticPathways />
    },
    {
      id: 'screening',
      title: 'Cancer Screening',
      description: 'Evidence-based screening guidelines and risk assessment tools.',
      component: <CancerScreeningSupabase />
    },
    {
      id: 'referral',
      title: 'Referral Guidelines',
      description: 'Protocols for appropriate and timely specialist referrals.',
      component: <ReferralGuidelines />
    }
  ];

  return (
    <div className="w-full max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 py-6 space-y-8">
      {/* Page Header */}
      <div className="rounded-xl p-6 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-indigo-500" />
          Oncology OPD
        </h1>
        <p className="mt-2 text-gray-600 text-lg max-w-4xl">
          Comprehensive outpatient department tools for cancer screening, patient evaluation,
          and standardized diagnostic pathways with AI-powered decision support.
        </p>
      </div>

      {/* Selectable Section Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`p-5 rounded-xl shadow-md hover:shadow-xl border backdrop-blur-lg transition-all duration-300 hover:scale-105
                      ${selectedSection === section.id 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-transparent hover:from-indigo-500 hover:to-purple-500' 
                        : 'bg-white/20 border-gray-200/40 hover:border-indigo-400 hover:bg-white/30'
                      }`}
          >
            <h3 className="font-medium text-lg">{section.title}</h3>
            <p className={`text-sm mt-2 ${
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
