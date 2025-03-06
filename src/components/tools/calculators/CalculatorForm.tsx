import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Calculator } from '../../../types/calculators';
import { calculateResult } from '../../../services/calculators';

interface Props {
  calculator: Calculator;
  onBack: () => void;
}

export default function CalculatorForm({ calculator, onBack }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const calculatedResult = calculateResult(calculator.id, values);
      setResult(calculatedResult);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
      >
        <ChevronRight className="w-4 h-4 transform rotate-180" />
        Back to Calculators
      </button>

      <h3 className="text-lg font-semibold mb-2">{calculator.name}</h3>
      <p className="text-sm text-gray-500 mb-6">{calculator.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {calculator.inputs.map(input => (
          <div key={input.id} className="flex flex-col">
            <label htmlFor={input.id} className="block text-sm font-medium text-gray-700 mb-1">
              {input.label}
            </label>
            {input.type === 'select' ? (
              <select
                id={input.id}
                name={input.id}
                value={values[input.id] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                required={input.required}
              >
                <option value="">Select...</option>
                {input.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                id={input.id}
                name={input.id}
                value={values[input.id] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                required={input.required}
                min={input.min}
                max={input.max}
                step={input.step}
              />
            )}
            {input.hint && (
              <p className="mt-1 text-sm text-gray-500">{input.hint}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Result</h4>
          <div className="text-lg">{result}</div>
          {calculator.interpretation && (
            <p className="mt-2 text-sm text-gray-600">{calculator.interpretation(result)}</p>
          )}
        </div>
      )}
    </div>
  );
}
