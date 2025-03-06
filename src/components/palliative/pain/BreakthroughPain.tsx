import React, { useState } from 'react';
import { Calculator, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { cn, clamp } from '../../../lib/utils';

interface DoseResult {
  dose: number;
  frequency: string;
  maxDaily: number;
  warnings: string[];
}

export default function BreakthroughPain() {
  const [dailyDose, setDailyDose] = useState<string>('');
  const [opioidType, setOpioidType] = useState<string>('morphine');
  const [lastDose, setLastDose] = useState<string>('');
  const [calculatedDose, setCalculatedDose] = useState<DoseResult | null>(null);

  const guidelines = {
    assessment: [
      {
        title: 'Characteristics',
        items: [
          'Sudden onset or predictable?',
          'Related to movement or specific activities?',
          'Duration of episodes',
          'Current management effectiveness'
        ]
      },
      {
        title: 'Timing Analysis',
        items: [
          'Frequency of episodes per day',
          'Pattern relative to regular doses',
          'Time to onset of relief with rescue dose',
          'Duration of breakthrough relief'
        ]
      }
    ],
    management: [
      {
        title: 'Initial Approach',
        items: [
          'Calculate breakthrough dose (10-15% of 24-hour total)',
          'Use immediate-release formulation',
          'Consider route based on onset needed',
          'Maximum frequency Q2H PRN'
        ]
      },
      {
        title: 'Ongoing Care',
        items: [
          'Review effectiveness after 24 hours',
          'Adjust regular dosing if > 3 episodes/day',
          'Consider preventive dosing for predictable pain',
          'Document all breakthrough episodes'
        ]
      }
    ]
  };

  const calculateDose = () => {
    const total = parseFloat(dailyDose);
    if (isNaN(total) || total <= 0) return;

    const result: DoseResult = {
      dose: 0,
      frequency: '',
      maxDaily: 0,
      warnings: []
    };

    // Calculate breakthrough dose (10-15% of total daily dose)
    result.dose = Math.round(total * 0.15);
    result.maxDaily = Math.floor(24 / 2); // Max q2h = 12 doses
    
    // Set frequency based on opioid type
    switch (opioidType) {
      case 'morphine':
        result.frequency = 'Q2H PRN';
        break;
      case 'oxycodone':
        result.frequency = 'Q3H PRN';
        break;
      case 'hydromorphone':
        result.frequency = 'Q2H PRN';
        break;
      default:
        result.frequency = 'Q2H PRN';
    }

    // Add relevant warnings
    if (total > 300) {
      result.warnings.push('High total daily dose - consider opioid rotation');
    }
    if (!lastDose) {
      result.warnings.push('Important to document timing of last regular dose');
    }

    setCalculatedDose(result);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2 
                   text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        <Clock className="h-5 w-5 text-blue-600" />
        Breakthrough Pain Management
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calculator Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-purple-600" />
            Dose Calculator
          </h4>

          <div className="space-y-3">
            <div>
              <label 
                htmlFor="dailyDose"
                className="block text-sm font-medium text-gray-700"
              >
                24-hour Regular Opioid Dose (mg)
              </label>
              <input
                id="dailyDose"
                type="number"
                value={dailyDose}
                onChange={(e) => setDailyDose(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter total daily dose in mg"
                aria-label="Total daily opioid dose in milligrams"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label 
                htmlFor="opioidType"
                className="block text-sm font-medium text-gray-700"
              >
                Opioid Type
              </label>
              <select
                id="opioidType"
                value={opioidType}
                onChange={(e) => setOpioidType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-purple-500 focus:ring-purple-500"
                aria-label="Select opioid medication type"
              >
                <option value="morphine">Morphine</option>
                <option value="oxycodone">Oxycodone</option>
                <option value="hydromorphone">Hydromorphone</option>
              </select>
            </div>

            <div>
              <label 
                htmlFor="lastDose"
                className="block text-sm font-medium text-gray-700"
              >
                Time of Last Regular Dose
              </label>
              <input
                id="lastDose"
                type="time"
                value={lastDose}
                onChange={(e) => setLastDose(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-purple-500 focus:ring-purple-500"
                aria-label="Time of last regular dose"
              />
            </div>

            <button
              onClick={calculateDose}
              disabled={!dailyDose}
              className={cn(
                "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm",
                "font-medium text-white transition-all duration-200",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none")}
              aria-label="Calculate breakthrough pain dose"
            >
              Calculate Breakthrough Dose
            </button>
          </div>

          {calculatedDose && (
            <div 
              className="mt-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4"
              role="region"
              aria-label="Calculated dose results"
            >
              <h5 className="font-medium text-blue-900">Calculated Dose:</h5>
              <dl className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Breakthrough dose:</dt>
                  <dd className="text-sm font-medium text-purple-700">
                    {calculatedDose.dose}mg
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Frequency:</dt>
                  <dd className="text-sm font-medium text-blue-700">{calculatedDose.frequency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Maximum doses per day:</dt>
                  <dd className="text-sm font-medium text-purple-700">{calculatedDose.maxDaily}</dd>
                </div>
              </dl>
              {calculatedDose.warnings.length > 0 && (
                <div 
                  className="mt-3 p-3 bg-white/80 rounded-md border border-purple-100"
                  role="alert"
                  aria-label="Important warnings about the calculated dose"
                >
                  <h6 className="text-sm font-medium text-yellow-800 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Important Notes
                  </h6>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    {calculatedDose.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Guidelines Section */}
        <div className="space-y-6">
          {Object.entries(guidelines).map(([category, sections]) => (
            <div 
              key={category} 
              className="space-y-4"
              role="region"
              aria-label={`${category} guidelines`}
            >
              <h4 className="font-medium capitalize flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {category === 'assessment' ? (
                  <FileText className="h-4 w-4 text-blue-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                )}
                {category}
              </h4>
              
              {sections.map((section) => (
                <div 
                  key={section.title} 
                  className="bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50
                          rounded-lg p-4 border border-gray-100 transition-all duration-200"
                  role="region"
                  aria-labelledby={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <h5 
                    id={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-medium text-sm text-blue-900"
                  >
                    {section.title}
                  </h5>
                  <ul className="mt-2 space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span aria-hidden="true">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
