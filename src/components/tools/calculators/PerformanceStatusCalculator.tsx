import React, { useState } from 'react';

const PerformanceStatusCalculator: React.FC = () => {
  const [ecogScore, setEcogScore] = useState(0);
  const [kpsScore, setKpsScore] = useState(100);

  const handleEcogChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEcogScore(parseInt(event.target.value, 10));
  };

  const handleKpsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKpsScore(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <h2>Performance Status Calculators</h2>
      <div>
        <h3>ECOG Performance Status</h3>
        <label>
          Score:
          <input
            type="number"
            min="0"
            max="5"
            value={ecogScore}
            onChange={handleEcogChange}
          />
        </label>
        <p>
          {ecogScore === 0
            ? 'Fully active, able to carry on all pre-disease performance without restriction'
            : ecogScore === 1
            ? 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature'
            : ecogScore === 2
            ? 'Ambulatory and capable of all self-care but unable to carry out any work activities; up and about more than 50% of waking hours'
            : ecogScore === 3
            ? 'Capable of only limited self-care; confined to bed or chair more than 50% of waking hours'
            : ecogScore === 4
            ? 'Completely disabled; cannot carry on any self-care; totally confined to bed or chair'
            : 'Dead'}
        </p>
      </div>
      <div>
        <h3>Karnofsky Performance Scale</h3>
        <label>
          Score:
          <input
            type="number"
            min="0"
            max="100"
            value={kpsScore}
            onChange={handleKpsChange}
          />
        </label>
        <p>
          {kpsScore === 100
            ? 'Normal, no complaints, no evidence of disease'
            : kpsScore >= 80
            ? 'Able to carry on normal activity, minor signs or symptoms of disease'
            : kpsScore >= 60
            ? 'Requires occasional assistance, but is able to care for most needs'
            : kpsScore >= 40
            ? 'Disabled, requires special care and assistance'
            : kpsScore >= 20
            ? 'Severely disabled, hospitalization is indicated, active supportive treatment is necessary'
            : 'Dead'}
        </p>
      </div>
    </div>
  );
};

export default PerformanceStatusCalculator;
