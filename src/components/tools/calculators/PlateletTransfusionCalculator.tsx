import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { calculatePlateletTransfusionThreshold, calculatePlateletIncrement, isPlateletRefractory } from '../../../services/calculators/hematology';

interface RiskFactorCheckbox {
  id: keyof PatientRiskFactors;
  label: string;
  description?: string;
}

interface PatientRiskFactors {
  activeBleed: boolean;
  priorBleed: boolean;
  fever: boolean;
  sepsis: boolean;
  acuteGVHD: boolean;
  mucositis: boolean;
  recentSurgery: boolean;
  coagulopathy: boolean;
  renalFailure: boolean;
  hepaticDysfunction: boolean;
  anticoagulation: boolean;
  rapidPlateletConsumption: boolean;
}

interface PatientCondition {
  diagnosis: 'Acute Leukemia' | 'Solid Tumor' | 'Autologous HSCT' | 'Allogeneic HSCT' | 'Other';
  procedureType?: 'Minor' | 'Major Surgery' | 'CNS Surgery' | 'Lumbar Puncture' | 'None';
  isStable: boolean;
  currentPlateletCount: number;
  recentPlateletResponse?: number;
  refractoriness?: boolean;
}

const RISK_FACTORS: RiskFactorCheckbox[] = [
  { id: 'activeBleed', label: 'Active Bleeding', description: 'Current active hemorrhage' },
  { id: 'priorBleed', label: 'Prior Bleeding', description: 'Significant bleeding within past 5 days' },
  { id: 'fever', label: 'Fever', description: 'Temperature > 38.5°C' },
  { id: 'sepsis', label: 'Sepsis', description: 'Suspected or confirmed infection with organ dysfunction' },
  { id: 'acuteGVHD', label: 'Acute GVHD', description: 'Active acute graft-versus-host disease' },
  { id: 'mucositis', label: 'Mucositis', description: 'Grade ≥2 mucositis' },
  { id: 'recentSurgery', label: 'Recent Surgery', description: 'Surgery within past 72 hours' },
  { id: 'coagulopathy', label: 'Coagulopathy', description: 'Abnormal coagulation parameters' },
  { id: 'renalFailure', label: 'Renal Failure', description: 'Acute or chronic kidney disease' },
  { id: 'hepaticDysfunction', label: 'Hepatic Dysfunction', description: 'Liver dysfunction affecting coagulation' },
  { id: 'anticoagulation', label: 'Anticoagulation', description: 'Current therapeutic anticoagulation' },
  { id: 'rapidPlateletConsumption', label: 'Rapid Consumption', description: 'Rapid platelet consumption pattern' }
];

const DIAGNOSES = ['Acute Leukemia', 'Solid Tumor', 'Autologous HSCT', 'Allogeneic HSCT', 'Other'] as const;
const PROCEDURES = ['None', 'Minor', 'Major Surgery', 'CNS Surgery', 'Lumbar Puncture'] as const;

export default function PlateletTransfusionCalculator() {
  const [riskFactors, setRiskFactors] = useState<PatientRiskFactors>({
    activeBleed: false,
    priorBleed: false,
    fever: false,
    sepsis: false,
    acuteGVHD: false,
    mucositis: false,
    recentSurgery: false,
    coagulopathy: false,
    renalFailure: false,
    hepaticDysfunction: false,
    anticoagulation: false,
    rapidPlateletConsumption: false
  });

  const [condition, setCondition] = useState<PatientCondition>({
    diagnosis: 'Other',
    procedureType: 'None',
    isStable: true,
    currentPlateletCount: 0,
    recentPlateletResponse: undefined,
    refractoriness: false
  });

  const [result, setResult] = useState<any>(null);

  const handleRiskFactorChange = (factor: keyof PatientRiskFactors) => {
    setRiskFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };

  const handleCalculate = () => {
    const threshold = calculatePlateletTransfusionThreshold(riskFactors, condition);
    setResult(threshold);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return 'text-red-600';
      case 'Urgent': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Platelet Transfusion Calculator
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Determine appropriate platelet transfusion thresholds based on patient risk factors and condition
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Factors */}
        <div className="bg-transparent p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factors</h3>
          <div className="space-y-3">
            {RISK_FACTORS.map(factor => (
              <div key={factor.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={factor.id}
                  checked={riskFactors[factor.id]}
                  onChange={() => handleRiskFactorChange(factor.id)}
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={factor.id} className="text-sm">
                  <span className="font-medium text-gray-900">{factor.label}</span>
                  {factor.description && (
                    <p className="text-gray-500 text-xs">{factor.description}</p>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Condition */}
        <div className="bg-transparent p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Condition</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                Diagnosis
              </label>
              <select
                id="diagnosis"
                value={condition.diagnosis}
                onChange={(e) => setCondition(prev => ({
                  ...prev,
                  diagnosis: e.target.value as PatientCondition['diagnosis']
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {DIAGNOSES.map(diagnosis => (
                  <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
                Planned Procedure
              </label>
              <select
                id="procedure"
                value={condition.procedureType}
                onChange={(e) => setCondition(prev => ({
                  ...prev,
                  procedureType: e.target.value as PatientCondition['procedureType']
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {PROCEDURES.map(procedure => (
                  <option key={procedure} value={procedure}>{procedure}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="plateletCount" className="block text-sm font-medium text-gray-700">
                Current Platelet Count (×10⁹/L)
              </label>
              <input
                type="number"
                id="plateletCount"
                value={condition.currentPlateletCount || ''}
                onChange={(e) => setCondition(prev => ({
                  ...prev,
                  currentPlateletCount: Number(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stable"
                checked={condition.isStable}
                onChange={(e) => setCondition(prev => ({
                  ...prev,
                  isStable: e.target.checked
                }))}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="stable" className="text-sm font-medium text-gray-700">
                Patient is clinically stable
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Calculate Transfusion Threshold
      </button>

      {result && (
        <div className="bg-transparent p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${getUrgencyColor(result.urgency)}`}>
              {result.urgency} Transfusion Need
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Prophylactic Threshold</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.prophylacticThreshold} ×10⁹/L
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Therapeutic Threshold</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.therapeuticThreshold} ×10⁹/L
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Recommended Dose</p>
            <p className="text-gray-900">{result.recommendedDose}</p>
          </div>

          {result.additionalConsiderations.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Considerations</h4>
              <ul className="space-y-2">
                {result.additionalConsiderations.map((consideration: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}