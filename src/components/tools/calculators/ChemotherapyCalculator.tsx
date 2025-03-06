import React, { useState } from 'react';

const ChemotherapyCalculator: React.FC = () => {
  const [carboplatin, setCarboplatin] = useState({
    auc: 5,
    creatinine: 1,
    weight: 70,
    dose: 0,
  });
  const [creatinineClearance, setCreatinineClearance] = useState(90);
  const [gfr, setGfr] = useState(90);
  const [doxorubicinDose, setDoxorubicinDose] = useState(0);
  const [ctcaeGrade, setCtcaeGrade] = useState(0);

  const handleCarboplatinChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof carboplatin
  ) => {
    setCarboplatin({ ...carboplatin, [field]: parseFloat(event.target.value) });
  };

  const calculateCarboplatinDose = () => {
    const { auc, creatinine, weight } = carboplatin;
    const dose = (auc * (creatinine + 25)) / (weight * 0.24);
    setCarboplatin({ ...carboplatin, dose: dose });
  };

  const calculateCreatinineClearance = () => {
    const { creatinine, weight } = carboplatin;
    const clearance = (140 - 0.2 * (70 - weight)) / creatinine;
    setCreatinineClearance(clearance);
  };

  const calculateGfr = () => {
    const { creatinine } = carboplatin;
    const gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(70, -0.203);
    setGfr(gfr);
  };

  const calculateDoxorubicinDose = () => {
    const maxCumulativeDose = 550;
    setDoxorubicinDose(maxCumulativeDose - 550);
  };

  const handleCtcaeGradeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCtcaeGrade(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <h2>Chemotherapy Calculators</h2>
      <div>
        <h3>Carboplatin Dosing (Calvert Formula)</h3>
        <label>
          AUC:
          <input
            type="number"
            value={carboplatin.auc}
            onChange={(e) => handleCarboplatinChange(e, 'auc')}
          />
        </label>
        <label>
          Creatinine (mg/dL):
          <input
            type="number"
            value={carboplatin.creatinine}
            onChange={(e) => handleCarboplatinChange(e, 'creatinine')}
          />
        </label>
        <label>
          Weight (kg):
          <input
            type="number"
            value={carboplatin.weight}
            onChange={(e) => handleCarboplatinChange(e, 'weight')}
          />
        </label>
        <button onClick={calculateCarboplatinDose}>Calculate Dose</button>
        <p>Carboplatin Dose: {carboplatin.dose.toFixed(2)} mg</p>
      </div>
      <div>
        <h3>Creatinine Clearance (Cockcroft-Gault)</h3>
        <label>
          Creatinine (mg/dL):
          <input
            type="number"
            value={carboplatin.creatinine}
            onChange={(e) => handleCarboplatinChange(e, 'creatinine')}
          />
        </label>
        <label>
          Weight (kg):
          <input
            type="number"
            value={carboplatin.weight}
            onChange={(e) => handleCarboplatinChange(e, 'weight')}
          />
        </label>
        <button onClick={calculateCreatinineClearance}>
          Calculate Creatinine Clearance
        </button>
        <p>Creatinine Clearance: {creatinineClearance.toFixed(2)} mL/min</p>
      </div>
      <div>
        <h3>GFR Estimation (MDRD, CKD-EPI)</h3>
        <label>
          Creatinine (mg/dL):
          <input
            type="number"
            value={carboplatin.creatinine}
            onChange={(e) => handleCarboplatinChange(e, 'creatinine')}
          />
        </label>
        <button onClick={calculateGfr}>Calculate GFR</button>
        <p>GFR: {gfr.toFixed(2)} mL/min/1.73m2</p>
      </div>
      <div>
        <h3>Cumulative Doxorubicin Dose</h3>
        <button onClick={calculateDoxorubicinDose}>
          Calculate Remaining Doxorubicin Dose
        </button>
        <p>Remaining Doxorubicin Dose: {doxorubicinDose.toFixed(2)} mg</p>
      </div>
      <div>
        <h3>NCI CTCAE Toxicity Grading</h3>
        <label>
          Toxicity Grade:
          <input
            type="number"
            min="0"
            max="5"
            value={ctcaeGrade}
            onChange={handleCtcaeGradeChange}
          />
        </label>
        <p>
          {ctcaeGrade === 0
            ? 'No adverse event'
            : ctcaeGrade === 1
            ? 'Mild adverse event'
            : ctcaeGrade === 2
            ? 'Moderate adverse event'
            : ctcaeGrade === 3
            ? 'Severe adverse event'
            : ctcaeGrade === 4
            ? 'Life-threatening adverse event'
            : 'Death'}
        </p>
      </div>
    </div>
  );
};

export default ChemotherapyCalculator;
