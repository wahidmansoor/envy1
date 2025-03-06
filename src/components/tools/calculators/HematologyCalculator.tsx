import React from 'react';
import { calculateHASBLEDScore } from '../../../services/calculators/calculations';

interface RiskFactor {
  label: string;
  key: keyof HASBLEDFactors;
}

interface HASBLEDFactors {
  hypertension: boolean;
  renalDisease: boolean;
  liverDisease: boolean;
  stroke: boolean;
  bleeding: boolean;
  labileINR: boolean;
  elderly: boolean;
  drugsOrAlcohol: boolean;
}

const HematologyCalculator: React.FC = () => {
  const [riskFactors, setRiskFactors] = React.useState<HASBLEDFactors>({
    hypertension: false,
    renalDisease: false,
    liverDisease: false,
    stroke: false,
    bleeding: false,
    labileINR: false,
    elderly: false,
    drugsOrAlcohol: false
  });

  const riskFactorsList: RiskFactor[] = [
    { label: 'Hypertension', key: 'hypertension' },
    { label: 'Renal Disease', key: 'renalDisease' },
    { label: 'Liver Disease', key: 'liverDisease' },
    { label: 'Stroke History', key: 'stroke' },
    { label: 'Bleeding History', key: 'bleeding' },
    { label: 'Labile INR', key: 'labileINR' },
    { label: 'Elderly (>65 years)', key: 'elderly' },
    { label: 'Drugs/Alcohol', key: 'drugsOrAlcohol' }
  ];

  const handleRiskFactorChange = (key: keyof HASBLEDFactors) => {
    setRiskFactors(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const score = calculateHASBLEDScore(
    riskFactors.hypertension,
    riskFactors.renalDisease,
    riskFactors.liverDisease,
    riskFactors.stroke,
    riskFactors.bleeding,
    riskFactors.labileINR,
    riskFactors.elderly ? 65 : 64,
    riskFactors.drugsOrAlcohol
  );

  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score <= 1) return { level: 'Low Risk', color: 'text-green-600' };
    if (score === 2) return { level: 'Moderate Risk', color: 'text-yellow-600' };
    return { level: 'High Risk', color: 'text-red-600' };
  };

  const { level, color } = getRiskLevel(score);

  return (
    <div className="p-6 max-w-2xl mx-auto rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Bleeding Risk Calculator (HAS-BLED Score)
      </h2>
      
      <div className="space-y-4 mb-6">
        {riskFactorsList.map(({ label, key }) => (
          <div key={key} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={key}
              checked={riskFactors[key]}
              onChange={() => handleRiskFactorChange(key)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={key} className="text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-transparent rounded-lg">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Total Score</p>
          <p className="text-4xl font-bold mb-2">{score}</p>
          <p className={`text-lg font-medium ${color}`}>{level}</p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Risk Levels:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Score 0-1: Low risk of bleeding</li>
          <li>Score 2: Moderate risk of bleeding</li>
          <li>Score ≥3: High risk of bleeding - careful assessment required</li>
        </ul>
      </div>
    </div>
  );
};

export default HematologyCalculator;
