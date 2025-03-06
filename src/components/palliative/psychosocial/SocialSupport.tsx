import React from 'react';

export default function SocialSupport() {
  const support = {
    familySupport: [
      'Regular family meetings',
      'Caregiver education',
      'Respite care arrangements',
      'Communication facilitation'
    ],
    practicalSupport: [
      'Financial counseling',
      'Legal advice referral',
      'Home care coordination',
      'Transportation assistance'
    ],
    communityResources: [
      'Support group referrals',
      'Community service links',
      'Volunteer programs',
      'Social work consultation'
    ]
  };

  return (
    <div className="rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Social Support</h3>
      <div className="space-y-4">
        {Object.entries(support).map(([category, items]) => (
          <div key={category} className="rounded-lg p-4">
            <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
            <ul className="mt-2 space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
