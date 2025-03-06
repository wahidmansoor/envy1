import React, { useState } from 'react';
import { Users, Calendar, Phone, Book, Heart, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FamilyMember {
  name: string;
  relationship: string;
  contact: string;
  preferredLanguage: string;
  updates: boolean;
}

interface SupportResource {
  name: string;
  type: 'internal' | 'external';
  availability: string[];
  contact: string;
  notes: string;
}

interface NeedsAssessment {
  category: string;
  items: {
    need: string;
    status: 'unmet' | 'inProgress' | 'met';
    notes: string;
  }[];
}

export default function FamilySupport() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const supportResources: SupportResource[] = [
    {
      name: 'Social Work Team',
      type: 'internal',
      availability: ['Mon-Fri 8am-5pm', 'On-call weekends'],
      contact: '555-0123',
      notes: 'Primary contact for family support coordination'
    },
    {
      name: 'Spiritual Care',
      type: 'internal',
      availability: ['24/7 on-call'],
      contact: '555-0124',
      notes: 'Multi-faith support available'
    },
    {
      name: 'Bereavement Support Group',
      type: 'external',
      availability: ['Weekly meetings - Thursdays 6pm'],
      contact: '555-0125',
      notes: 'Pre-registration required'
    }
  ];

  const needsAssessment: NeedsAssessment[] = [
    {
      category: 'Immediate Support',
      items: [
        { need: 'Accommodation arrangements', status: 'unmet', notes: '' },
        { need: 'Transportation assistance', status: 'unmet', notes: '' },
        { need: 'Language support', status: 'unmet', notes: '' }
      ]
    },
    {
      category: 'Information Needs',
      items: [
        { need: 'Understanding of prognosis', status: 'unmet', notes: '' },
        { need: 'Care plan clarity', status: 'unmet', notes: '' },
        { need: 'Support service awareness', status: 'unmet', notes: '' }
      ]
    },
    {
      category: 'Emotional Support',
      items: [
        { need: 'Counseling services', status: 'unmet', notes: '' },
        { need: 'Spiritual/religious support', status: 'unmet', notes: '' },
        { need: 'Grief support', status: 'unmet', notes: '' }
      ]
    }
  ];

  const updateNeedStatus = (category: string, needIndex: number, status: 'unmet' | 'inProgress' | 'met') => {
    // Implementation for updating need status
    console.log(`Updating ${category} need ${needIndex} to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unmet':
        return 'text-red-600';
      case 'inProgress':
        return 'text-yellow-600';
      case 'met':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="rounded-lg shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Family Support Services
        </h3>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
                    bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 
                    transition-colors duration-200"
        >
          Add Family Member
        </button>
      </div>

      {/* Needs Assessment */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Book className="h-4 w-4 text-gray-500" />
          Support Needs Assessment
        </h4>
        {needsAssessment.map((category) => (
          <div key={category.category} className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3">
              <h5 className="font-medium text-sm sm:text-base">{category.category}</h5>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center 
                                        justify-between gap-2 sm:gap-4">
                    <span className="text-sm sm:text-base text-gray-600">{item.need}</span>
                    <div className="flex flex-wrap gap-2">
                      {(['unmet', 'inProgress', 'met'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateNeedStatus(category.category, idx, status)}
                          className={cn(
                            'px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors duration-200',
                            'min-w-[80px] flex-1 sm:flex-none justify-center',
                            item.status === status ? getStatusColor(status) : 'hover:bg-gray-200'
                          )}
                        >
                          {status === 'inProgress' ? 'In Progress' : 
                            status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Resources */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Heart className="h-4 w-4 text-gray-500" />
          Support Resources
        </h4>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {supportResources.map((resource) => (
            <div
              key={resource.name}
              className={cn(
                'border rounded-lg p-4 sm:p-5',
                resource.type === 'internal' ? 'bg-blue-50' : 'bg-green-50'
              )}
            >
              <div className="flex items-start justify-between">
                <h5 className="font-medium text-sm sm:text-base">{resource.name}</h5>
                <span className="text-xs px-2 py-1 rounded-full shadow-sm">
                  {resource.type}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <ul className="text-sm text-gray-600">
                    {resource.availability.map((time, idx) => (
                      <li key={idx}>{time}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{resource.contact}</span>
                </div>
                {resource.notes && (
                  <p className="text-xs text-gray-500 mt-2">{resource.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Reminders */}
      <div className="border border-yellow-200 rounded-lg p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Important Notes</h4>
        </div>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-yellow-800">
          <li>Document all family interactions and support provided</li>
          <li>Regular assessment of family needs and coping</li>
          <li>Cultural and religious preferences to be respected</li>
          <li>Maintain clear communication channels with all family members</li>
          <li>Schedule follow-up support after bereavement</li>
        </ul>
      </div>

      {/* Scheduled Support */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          Upcoming Support Sessions
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Family Meeting</span>
              <span className="text-xs text-gray-500">Tomorrow, 2 PM</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Review care plan and address concerns</p>
          </div>
          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Spiritual Care Visit</span>
              <span className="text-xs text-gray-500">Today, 4 PM</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Regular support session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
