import React, { useState } from 'react';
import { 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Activity,
  Brain,
} from 'lucide-react';
import PainManagement from './PainManagement';
import EndOfLifeCare from './EndOfLifeCare';
import SymptomControl from './SymptomControl';
import PsychosocialCare from './PsychosocialCare';

interface Section {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  icon: React.ReactNode;
  subSections?: { title: string; content: string }[];
}

export default function PalliativeCareModule() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSubSections, setExpandedSubSections] = useState<{ [key: string]: boolean }>({});

  const toggleSubSection = (id: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections: Section[] = [
    {
      id: 'pain-management',
      title: 'Pain Management',
      description: 'Comprehensive tools for pain assessment and treatment.',
      component: <PainManagement />,
      icon: <Activity className="h-5 w-5 text-indigo-500" />,
      subSections: [
        { title: 'Opioid Dosing', content: 'Guidelines for opioid conversion and safe prescribing.' },
        { title: 'Neuropathic Pain', content: 'Approaches for managing pain from nerve damage.' }
      ]
    },
    {
      id: 'end-of-life-care',
      title: 'End of Life Care',
      description: 'Guidelines for terminal care, advance planning, and support.',
      component: <EndOfLifeCare />,
      icon: <Heart className="h-5 w-5 text-indigo-500" />,
      subSections: [
        { title: 'Advanced Care Planning', content: 'Discussing patient goals and legal considerations.' },
        { title: 'Bereavement Support', content: 'Resources for family coping and counseling.' }
      ]
    },
    {
      id: 'symptom-control',
      title: 'Symptom Control',
      description: 'Management of symptoms like nausea, dyspnea, and agitation.',
      component: <SymptomControl />,
      icon: <AlertTriangle className="h-5 w-5 text-indigo-500" />,
      subSections: [
        { title: 'Dyspnea', content: 'Management of breathlessness and non-pharmacologic interventions.' },
        { title: 'Fatigue', content: 'Energy conservation strategies and treatment options.' }
      ]
    },
    {
      id: 'psychosocial-care',
      title: 'Psychosocial Care',
      description: 'Supportive care covering emotional, spiritual, and social aspects.',
      component: <PsychosocialCare />,
      icon: <Brain className="h-5 w-5 text-indigo-500" />,
      subSections: [
        { title: 'Anxiety & Depression', content: 'Screening and treatment guidelines for distress.' },
        { title: 'Spiritual Support', content: 'Integrating spiritual care in palliative settings.' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 py-6 space-y-8">
      {/* Page Header */}
      <div className="rounded-xl p-6 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <Heart className="h-8 w-8 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Palliative Care</span>
        </h1>
        <p className="mt-2 text-gray-600 text-lg max-w-4xl">
          Comprehensive guidelines and protocols for managing symptoms, providing psychosocial support, 
          and delivering quality end-of-life care to enhance patient comfort and dignity.
        </p>
      </div>

      {/* Selectable Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`p-4 rounded-lg shadow-md hover:shadow-xl border backdrop-blur-lg transition-all duration-300 hover:scale-105
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

          {/* Sub-Sections */}
          <div className="mt-6 space-y-4">
            {sections.find((s) => s.id === selectedSection)?.subSections?.map((sub, index) => (
              <div key={index} 
                className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 p-4 rounded-xl border border-gray-200/40 shadow-md hover:shadow-xl 
                         backdrop-blur-md transition-all duration-300 ease-in-out hover:border-purple-300">
                <button 
                  className={`flex justify-between w-full text-left font-medium rounded-lg p-2 transition-all duration-300 ${
                    expandedSubSections[`${selectedSection}-${index}`]
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'text-gray-900 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                  }`}
                  onClick={() => toggleSubSection(`${selectedSection}-${index}`)}
                >
                  {sub.title}
                  {expandedSubSections[`${selectedSection}-${index}`] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-indigo-600" />
                  )}
                </button>
                {expandedSubSections[`${selectedSection}-${index}`] && (
                  <p className="mt-2 text-sm text-gray-600">{sub.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Alerts */}
      <div className="mt-8 p-6 border shadow-md hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] 
                    bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl opacity-75 hover:opacity-100 
                    transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-indigo-500" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Urgent Palliative Care Alerts</h2>
        </div>
        <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-2">
          <li><strong>Spinal Cord Compression:</strong> STAT MRI + Dexamethasone</li>
          <li><strong>Superior Vena Cava Syndrome:</strong> CT Chest + Urgent Oncology Referral</li>
          <li><strong>Hypercalcemia:</strong> IV Hydration + Bisphosphonates</li>
        </ul>
      </div>
    </div>
  );
}
