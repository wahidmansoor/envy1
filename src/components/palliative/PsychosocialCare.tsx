import React from 'react';
import { Heart, Users, Globe, Sunrise, Search, FileText } from 'lucide-react';

interface SupportResource {
  id: string;
  type: string;
  description: string;
  services: string[];
  contacts: string[];
  icon: React.ReactNode;
}

const supportResources: SupportResource[] = [
  {
    id: 'emotional',
    type: 'Emotional Support',
    description: 'Services to address psychological and emotional needs',
    services: [
      'Individual counseling',
      'Group therapy sessions',
      'Depression screening',
      'Anxiety management'
    ],
    contacts: [
      'Psychology Department',
      'Social Work Services',
      'Counseling Hotline'
    ],
    icon: <Heart className="h-6 w-6" />
  },
  {
    id: 'social',
    type: 'Social Support',
    description: 'Resources for social and practical assistance',
    services: [
      'Family meetings',
      'Support groups',
      'Resource coordination',
      'Financial counseling'
    ],
    contacts: [
      'Social Work Department',
      'Patient Navigator',
      'Community Services'
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 'spiritual',
    type: 'Spiritual Care',
    description: 'Spiritual and religious support services',
    services: [
      'Spiritual counseling',
      'Religious services',
      'Meditation support',
      'Cultural rituals'
    ],
    contacts: [
      'Chaplaincy Services',
      'Religious Leaders',
      'Meditation Guide'
    ],
    icon: <Sunrise className="h-6 w-6" />
  },
  {
    id: 'cultural',
    type: 'Cultural Support',
    description: 'Culturally sensitive care and services',
    services: [
      'Cultural liaison',
      'Language services',
      'Traditional healing',
      'Cultural celebrations'
    ],
    contacts: [
      'Cultural Affairs Office',
      'Translation Services',
      'Community Leaders'
    ],
    icon: <Globe className="h-6 w-6" />
  }
];

export default function PsychosocialCare() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Heart className="h-6 w-6 text-indigo-500" />
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Psychosocial Support Services</span>
      </h2>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportResources.map((resource) => (
          <div key={resource.id} 
            className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg rounded-xl border border-gray-200/40 overflow-hidden shadow-md 
                     hover:shadow-xl hover:scale-102 opacity-85 hover:opacity-100 transition-all duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-indigo-500">{resource.icon}</span>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{resource.type}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

              {/* Services */}
              <div className="mb-4">
                <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Available Services</h4>
                <ul className="space-y-2">
                  {resource.services.map((service, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                      <span className="text-indigo-500">•</span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Contact Information</h4>
                <ul className="space-y-2">
                  {resource.contacts.map((contact, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      {contact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment Tools */}
      <section className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl mt-8 border border-white/20 shadow-md 
                       hover:shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Search className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Assessment Tools</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Psychological Screening</h4>
            <ul className="space-y-2">
              {['Depression and Anxiety Scales', 'Distress Thermometer', 'Quality of Life Assessment'].map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                  <span className="text-indigo-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Social Assessment</h4>
            <ul className="space-y-2">
              {['Support Network Evaluation', 'Resource Needs Assessment', 'Cultural Background Assessment'].map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                  <span className="text-indigo-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documentation Guidelines */}
      <section className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                       hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
          <FileText className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Documentation Guidelines</span>
        </h3>
        <div className="space-y-4">
          {[
            'Regular assessment of psychosocial needs and interventions',
            'Family meetings and care conferences documentation',
            'Cultural and spiritual preferences and accommodations',
            'Support service referrals and follow-up plans'
          ].map((guideline, index) => (
            <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
              <span className="text-indigo-500">{index + 1}.</span>
              <p className="text-sm text-gray-700">{guideline}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
