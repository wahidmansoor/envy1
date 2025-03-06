import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, AlertTriangle, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Drug {
  name: string;
  dose_per_m2?: number;
  dose_per_kg?: number;
  fixed_dose?: number;
  unit: string;
  max_dose?: number;
  adjustments?: DoseAdjustment[];
}

interface DoseAdjustment {
  condition: string;
  percentage: number;
  description: string;
}

interface Premedication {
  name: string;
  dose: string;
  route: string;
  timing: string;
  required: boolean;
  warnings?: string[];
}

interface DrugRegimen {
  id: string;
  name: string;
  drugs: Drug[];
  premedications: Premedication[];
  cycle_length: number;
  standard_doses: boolean;
}

interface PatientData {
  weight: number;
  height: number;
  bsa: number;
  age: number;
}

const DEFAULT_REGIMENS: DrugRegimen[] = [
  {
    id: "AC",
    name: "AC (Doxorubicin/Cyclophosphamide)",
    drugs: [
      {
        name: "Doxorubicin",
        dose_per_m2: 60,
        unit: "mg",
        max_dose: 120,
        adjustments: [
          { condition: "Age > 65", percentage: 80, description: "Reduce dose for elderly patients" },
          { condition: "Previous cardiotoxicity", percentage: 75, description: "Monitor cardiac function" }
        ]
      },
      {
        name: "Cyclophosphamide",
        dose_per_m2: 600,
        unit: "mg",
        adjustments: [
          { condition: "Renal impairment", percentage: 75, description: "Check creatinine clearance" }
        ]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dose: "8mg",
        route: "IV",
        timing: "30 mins before",
        required: true,
        warnings: ["Monitor QT interval"]
      },
      {
        name: "Dexamethasone",
        dose: "12mg",
        route: "IV",
        timing: "30 mins before",
        required: true
      }
    ],
    cycle_length: 21,
    standard_doses: true
  }
];

type ValidatableField = 'weight' | 'height' | 'age';

const VALIDATION_RANGES = {
  weight: { min: 20, max: 250, unit: 'kg' },
  height: { min: 100, max: 250, unit: 'cm' },
  age: { min: 18, max: 120, unit: 'years' }
};

type ValidationError = { field: string; message: string };

export default function DoseCalculator() {
  const [selectedRegimen, setSelectedRegimen] = useState<DrugRegimen | null>(null);
  const [patientData, setPatientData] = useState<PatientData>({
    weight: 0,
    height: 0,
    bsa: 0,
    age: 0
  });
  const [showWarnings, setShowWarnings] = useState(false);
  const [calculatedDoses, setCalculatedDoses] = useState<Map<string, number>>(new Map());
  const [adjustments, setAdjustments] = useState<Map<string, DoseAdjustment[]>>(new Map());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [adjustmentWarnings, setAdjustmentWarnings] = useState<Map<string, string>>(new Map());

  // Calculate BSA using Mosteller formula
  const calculateBSA = (weight: number, height: number): number => {
    if (weight <= 0 || height <= 0) return 0;
    // Mosteller formula: BSA (m²) = √[(Height(cm) × Weight(kg)) / 3600]
    return Math.sqrt((height * weight) / 3600);
  };

  // Validate patient data
  const validatePatientData = (field: ValidatableField, value: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    const range = VALIDATION_RANGES[field];

    if (!value || isNaN(value)) {
      errors.push({
        field,
        message: `Please enter a valid ${field}`
      });
    } else if (value < range.min || value > range.max) {
      errors.push({
        field,
        message: `${field} must be between ${range.min} and ${range.max} ${range.unit}`
      });
    }

    return errors;
  };

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  // Update patient data and recalculate BSA
  const updatePatientData = (field: ValidatableField | 'bsa', value: number) => {
    const newData = { ...patientData, [field]: value };
    if (field === 'weight' || field === 'height') {
      newData.bsa = calculateBSA(
        field === 'weight' ? value : patientData.weight,
        field === 'height' ? value : patientData.height
      );
    }

    if (field !== 'bsa') {
      const errors = validatePatientData(field as ValidatableField, value);
      setValidationErrors(prev => [...prev.filter(e => e.field !== field), ...errors]);
    }

    setPatientData(newData);
  };

  // Check for multiple adjustments
  const checkAdjustments = (drugName: string, newAdjustments: DoseAdjustment[]) => {
    const warnings = new Map(adjustmentWarnings);
    
    if (newAdjustments.length > 1) {
      const totalReduction = newAdjustments.reduce((total, adj) => total * (adj.percentage / 100), 1);
      const finalPercentage = Math.round(totalReduction * 100);
      
      if (finalPercentage < 50) {
        warnings.set(drugName, `Warning: Combined dose reduction to ${finalPercentage}% may be excessive`);
      } else {
        warnings.set(drugName, `Multiple adjustments selected: Final dose will be ${finalPercentage}%`);
      }
    } else {
      warnings.delete(drugName);
    }
    
    setAdjustmentWarnings(warnings);
  };

  // Calculate doses based on patient data and selected regimen
  useEffect(() => {
    if (!selectedRegimen || !patientData.bsa) return;

    const doses = new Map<string, number>();
    selectedRegimen.drugs.forEach(drug => {
      let dose = 0;
      if (drug.dose_per_m2) {
        dose = drug.dose_per_m2 * patientData.bsa;
      } else if (drug.dose_per_kg) {
        dose = drug.dose_per_kg * patientData.weight;
      } else if (drug.fixed_dose) {
        dose = drug.fixed_dose;
      }

      // Apply adjustments if any are selected
      const drugAdjustments = adjustments.get(drug.name);
      if (drugAdjustments) {
        drugAdjustments.forEach(adjustment => {
          dose = dose * (adjustment.percentage / 100);
        });
      }

      // Apply maximum dose cap if specified
      if (drug.max_dose) {
        dose = Math.min(dose, drug.max_dose);
      }

      doses.set(drug.name, Math.round(dose * 100) / 100);
    });

    setCalculatedDoses(doses);
  }, [selectedRegimen, patientData, adjustments]);

  // Check for warnings based on patient data and selected regimen
  useEffect(() => {
    if (!selectedRegimen || !patientData.age) return;

    setShowWarnings(patientData.age > 65);
  }, [selectedRegimen, patientData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-lg rounded-lg shadow-lg">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chemotherapy Dose Calculator
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Data Section */}
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Data</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={patientData.weight || ''}
                onChange={(e) => updatePatientData('weight', parseFloat(e.target.value))}
                onFocus={() => clearValidationError('weight')}
                className="mt-1 block w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="Enter weight"
                aria-label="Patient weight in kilograms"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={patientData.height || ''}
                onChange={(e) => updatePatientData('height', parseFloat(e.target.value))}
                onFocus={() => clearValidationError('height')}
                className="mt-1 block w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="Enter height"
                aria-label="Patient height in centimeters"
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age (years)
              </label>
              <input
                id="age"
                type="number"
                value={patientData.age || ''}
                onChange={(e) => updatePatientData('age', parseFloat(e.target.value))}
                onFocus={() => clearValidationError('age')}
                className="mt-1 block w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="Enter age"
                aria-label="Patient age in years"
              />
            </div>
            <div>
              <label htmlFor="bsa" className="block text-sm font-medium text-gray-700">
                BSA (m²)
              </label>
              <input
                id="bsa"
                type="number"
                value={patientData.bsa ? Math.round(patientData.bsa * 100) / 100 : ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-200/40 bg-gray-50/50 backdrop-blur-sm shadow-sm sm:text-sm"
                aria-label="Calculated body surface area in square meters"
              />
            </div>
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50/30 backdrop-blur-md rounded-xl border border-red-200/40 shadow-md">
                <div className="text-sm text-red-800 space-y-1">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> {error.message}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regimen Selection */}
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Regimen</h3>
          <div className="space-y-4">
            {DEFAULT_REGIMENS.map((regimen) => (
              <button
                key={regimen.id}
                onClick={() => setSelectedRegimen(regimen)}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-300 backdrop-blur-md ${
                  selectedRegimen?.id === regimen.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg hover:from-indigo-500 hover:to-purple-500'
                    : 'border-gray-200/40 hover:border-purple-300 bg-white/10 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                } hover:shadow-lg`}
                aria-label={`Select ${regimen.name} regimen`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{regimen.name}</span>
                  <ChevronDown 
                    className={`h-5 w-5 transform transition-transform ${
                      selectedRegimen?.id === regimen.id ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Doses */}
        {selectedRegimen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Calculated Doses</h3>
            
            {/* Warnings */}
            {showWarnings && (
              <div className="mb-4 p-4 bg-yellow-50/30 backdrop-blur-md rounded-xl border border-yellow-200/40 shadow-md">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Dose Adjustment Recommended</span>
                </div>
                <p className="mt-1 text-sm text-yellow-600">
                  Patient age {'>'} 65 years. Consider dose reduction and careful monitoring.
                </p>
              </div>
            )}

            {/* Drug Doses */}
            <div className="space-y-4">
              {selectedRegimen.drugs.map((drug) => (
                <div key={drug.name} className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-gray-300/30 hover:border-purple-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{drug.name}</h4>
                      <p className="text-sm text-gray-500">
                        {drug.dose_per_m2 ? `${drug.dose_per_m2} ${drug.unit}/m²` :
                         drug.dose_per_kg ? `${drug.dose_per_kg} ${drug.unit}/kg` :
                         drug.fixed_dose ? `${drug.fixed_dose} ${drug.unit} (fixed)` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">
                        {calculatedDoses.get(drug.name)} {drug.unit}
                      </div>
                      {drug.max_dose && (
                        <div className="text-sm text-gray-500">
                          Max: {drug.max_dose} {drug.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dose Adjustments */}
                  {drug.adjustments && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Dose Adjustments</h5>
                      <div className="space-y-2">
                        {drug.adjustments.map((adjustment, idx) => (
                          <label key={idx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                               const newAdjustments = new Map(adjustments);
                               let drugAdjustments = newAdjustments.get(drug.name) || [];
                               
                               if (e.target.checked) {
                                 drugAdjustments = [...drugAdjustments, adjustment];
                               } else {
                                 drugAdjustments = drugAdjustments.filter(a => a !== adjustment);
                               }
                               
                               newAdjustments.set(drug.name, drugAdjustments);
                               setAdjustments(newAdjustments);
                               checkAdjustments(drug.name, drugAdjustments);
                             }}
                              className="rounded border-gray-300/50 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-600">{adjustment.description} ({adjustment.percentage}%)</span>
                          </label>
                        ))}
                        
                        {/* Adjustment Warnings */}
                        {adjustmentWarnings.get(drug.name) && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                            <AlertCircle className="h-4 w-4" />
                            {adjustmentWarnings.get(drug.name)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pre-medications */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Required Pre-medications</h4>
              <div className="space-y-3">
                {selectedRegimen.premedications.map((med, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-gray-200/40 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">{med.name}</div>
                      <div className="text-sm text-gray-600">
                        {med.dose} {med.route} ({med.timing})
                      </div>
                      {med.warnings && med.warnings.length > 0 && (
                        <div className="mt-1 text-sm text-yellow-600">
                          {med.warnings.map((warning, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              {warning}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
