import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Tabs } from '../../ui/Tabs';
import { calculatorCategories } from '../../../constants/calculators';
import CalculatorForm from './CalculatorForm';
import type { CalculatorCategory, CalculatorType } from '../../../types/calculators';

interface CalculatorToolProps {
  categories: CalculatorCategory[];
}

export default function CalculatorTool({ categories }: CalculatorToolProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate asynchronous data fetching (replace with your actual data loading)
    const fetchData = async () => {
      try {
        // Await your data fetching logic here.  For example:
        // const fetchedCategories = await fetchCalculatorCategories();
        // setCategories(fetchedCategories);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load calculator categories');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedCalculator(null);
  };

  const handleCalculatorSelect = (calculatorId: string) => {
    setSelectedCalculator(calculatorId);
  };

  const categoryTabs = (isLoading || error) ? [] : categories.map(category => ({
    id: category.id,
    label: category.name,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.calculators && category.calculators.length > 0 ? (
          category.calculators.map((calculator: CalculatorType) => (
            <button
              key={calculator.id}
              onClick={() => handleCalculatorSelect(calculator.id)}
              className="bg-transparent rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900 mb-2">{calculator.name}</h3>
              <p className="text-sm text-gray-500">{calculator.description}</p>
            </button>
          ))
        ) : (
          <p>No calculators available in this category.</p>
        )}
      </div>
    )
  }));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Clinical Calculators</h2>
        </div>
        <p className="text-sm text-gray-500">Evidence-based oncology calculators</p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Tabs tabs={categoryTabs} />
        {selectedCalculator && (
          <CalculatorForm 
            calculator={categories.find(cat => cat.calculators.find(calc => calc.id === selectedCalculator))?.calculators.find((calc: CalculatorType) => calc.id === selectedCalculator)!}
            onBack={() => setSelectedCalculator(null)}
          />
        )}
      </div>
    </div>
  );
}
