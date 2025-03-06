import React, { useState } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { calculateBreastCancerRecurrenceScore } from '../../../services/calculators/oncotype';
import type { GeneExpressionData, RecurrenceScoreResult } from '../../../types/calculators';

const initialGeneData: GeneExpressionData = {
  // Reference genes
  ACTB: 0,
  GAPDH: 0,
  RPLPO: 0,
  GUS: 0,
  TFRC: 0,

  // Proliferation group
  Ki67: 0,
  STK15: 0,
  Survivin: 0,
  CCNB1: 0,
  MYBL2: 0,

  // Invasion group
  MMP11: 0,
  CTSL2: 0,

  // HER2 group
  GRB7: 0,
  HER2: 0,

  // Estrogen group
  ER: 0,
  PGR: 0,
  BCL2: 0,
  SCUBE2: 0
};

const geneGroups = {
  reference: ['ACTB', 'GAPDH', 'RPLPO', 'GUS', 'TFRC'],
  proliferation: ['Ki67', 'STK15', 'Survivin', 'CCNB1', 'MYBL2'],
  invasion: ['MMP11', 'CTSL2'],
  HER2: ['GRB7', 'HER2'],
  estrogen: ['ER', 'PGR', 'BCL2', 'SCUBE2']
};

export default function OncotypeDxCalculator() {
  const [geneData, setGeneData] = useState<GeneExpressionData>(initialGeneData);
  const [result, setResult] = useState<RecurrenceScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (gene: keyof GeneExpressionData, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setGeneData(prev => ({
      ...prev as GeneExpressionData,
      [gene]: numValue
    }));
  };

  const validateData = (): boolean => {
    for (const value of Object.values(geneData)) {
      if (value <= 0) {
        setError('All gene expression values must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const handleCalculate = () => {
    setError(null);
    if (!validateData()) return;

    try {
      const score = calculateBreastCancerRecurrenceScore(geneData);
      setResult(score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  const handleReset = () => {
    setGeneData(initialGeneData);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Oncotype DX Recurrence Score Calculator
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter normalized gene expression values to calculate the breast cancer recurrence score
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(geneGroups).map(([group, genes]) => (
          <div key={group} className="p-4 bg-transparent rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 capitalize mb-4">{group} Genes</h3>
            <div className="space-y-3">
              {genes.map((gene) => (
                <div key={gene} className="flex items-center gap-2">
                  <label htmlFor={gene} className="w-24 text-sm font-medium text-gray-700">
                    {gene}
                  </label>
                  <input
                    type="number"
                    id={gene}
                    value={geneData[gene as keyof GeneExpressionData] || ''}
                    onChange={(e) => handleInputChange(gene as keyof GeneExpressionData, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    step="0.01"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate Score
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 flex items-center gap-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {result && (
        <div className="mt-6 p-6 bg-transparent rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Recurrence Score</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{result.score}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Risk Group</p>
              <p className={`mt-1 text-lg font-semibold ${
                result.riskGroup === 'Low' ? 'text-green-600' :
                result.riskGroup === 'Intermediate' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {result.riskGroup}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">95% Confidence Interval</p>
              <p className="mt-1 text-gray-900">
                {result.confidence.interval[0]} - {result.confidence.interval[1]}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Component Scores</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Proliferation Score</p>
                  <p className="font-medium text-gray-900">{result.subscores.proliferationScore.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Invasion Score</p>
                  <p className="font-medium text-gray-900">{result.subscores.invasionScore.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">HER2 Score</p>
                  <p className="font-medium text-gray-900">{result.subscores.HER2Score.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estrogen Score</p>
                  <p className="font-medium text-gray-900">{result.subscores.estrogenScore.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}