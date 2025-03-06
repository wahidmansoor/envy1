import React, { useState } from 'react';
import PerformanceStatusCalculator from './PerformanceStatusCalculator';
import ChemotherapyCalculator from './ChemotherapyCalculator';
import HematologyCalculator from './HematologyCalculator';
import PalliativeCalculator from './PalliativeCalculator';

const CalculatorSelector: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<
    'performance' | 'chemotherapy' | 'hematology' | 'palliative'
  >('performance');

  const renderCalculator = () => {
    switch (selectedCalculator) {
      case 'performance':
        return <PerformanceStatusCalculator />;
      case 'chemotherapy':
        return <ChemotherapyCalculator />;
      case 'hematology':
        return <HematologyCalculator />;
      case 'palliative':
        return <PalliativeCalculator />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={() => setSelectedCalculator('performance')}
          className={selectedCalculator === 'performance' ? 'active' : ''}
        >
          Performance Status
        </button>
        <button
          onClick={() => setSelectedCalculator('chemotherapy')}
          className={selectedCalculator === 'chemotherapy' ? 'active' : ''}
        >
          Chemotherapy
        </button>
        <button
          onClick={() => setSelectedCalculator('hematology')}
          className={selectedCalculator === 'hematology' ? 'active' : ''}
        >
          Hematology
        </button>
        <button
          onClick={() => setSelectedCalculator('palliative')}
          className={selectedCalculator === 'palliative' ? 'active' : ''}
        >
          Palliative
        </button>
      </div>
      <div>{renderCalculator()}</div>
    </div>
  );
};

export default CalculatorSelector;
