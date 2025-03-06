import React from 'react';
import { Heart } from 'lucide-react';
import SupportiveCareCard from './supportive/SupportiveCareCard';

export default function SupportiveCare() {
  const supportiveCare = [
    {
      category: 'Pain Management',
      items: [
        'Regular pain assessment using validated tools',
        'WHO analgesic ladder implementation',
        'Breakthrough pain management',
        'Non-pharmacological interventions',
        'Side effect monitoring and management'
      ],
      recommendations: [
        'Use standardized pain assessment tools',
        'Regular review of analgesic efficacy',
        'Consider adjuvant medications',
        'Early involvement of pain team if needed'
      ]
    },
    {
      category: 'Nutrition Support',
      items: [
        'Nutritional status assessment',
        'Oral nutritional supplements',
        'Enteral feeding consideration',
        'Parenteral nutrition if indicated',
        'Dietary consultation'
      ],
      recommendations: [
        'Weekly weight monitoring',
        'Regular dietary intake assessment',
        'Early dietitian involvement',
        'Consider appetite stimulants if appropriate'
      ]
    },
    {
      category: 'Psychological Support',
      items: [
        'Regular psychological assessment',
        'Anxiety and depression screening',
        'Family support provision',
        'Coping strategies development',
        'Referral to psycho-oncology'
      ],
      recommendations: [
        'Use validated screening tools',
        'Regular family meetings',
        'Consider support groups',
        'Early referral for specialized support'
      ]
    }
  ];

  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">Supportive Care</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
        {supportiveCare.map((care, index) => (
          <SupportiveCareCard key={index} care={care} />
        ))}
      </div>
    </div>
  );
}
