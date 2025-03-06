import React from 'react';

// Define the structure for evaluation items and steps
interface EvaluationItem {
  text: string;
  tooltip: string;
}

interface EvaluationStep {
  title: string;
  items: EvaluationItem[];
}

const evaluationSteps: EvaluationStep[] = [
  {
    title: "History Taking",
    items: [
      { text: "Presenting complaint(s) and timeline", tooltip: "Onset, duration, frequency, severity" },
      { text: "Past medical history", tooltip: "Major illnesses, surgeries, medications" },
      { text: "Family history", tooltip: "Malignancies, genetic predispositions" },
      { text: "Social factors", tooltip: "Smoking, alcohol, occupation, lifestyle" },
      { text: "Review of systems", tooltip: "Comprehensive symptom checklist" },
    ],
  },
  {
    title: "Physical Examination",
    items: [
      { text: "General appearance & vitals", tooltip: "Weight, posture, BP, HR, RR, Temp" },
      { text: "Systematic organ exam", tooltip: "Head-to-toe examination" },
      { text: "Lymph node assessment", tooltip: "Nodal regions, size, consistency" },
      { text: "Targeted exam", tooltip: "Based on presenting symptoms" },
      { text: "Performance status", tooltip: "ECOG, Karnofsky score" },
    ],
  },
  {
    title: "Documentation",
    items: [
      { text: "Standardized forms/EMRs", tooltip: "Consistent data entry" },
      { text: "Diagnostic findings record", tooltip: "Labs, imaging, pathology" },
      { text: "Pain assessment", tooltip: "Pain scales, management strategies" },
      { text: "Quality of life measures", tooltip: "FACT, EORTC QLQ-C30" },
      { text: "Progress notes", tooltip: "Visit summaries, treatment response" },
    ],
  },
];

const PatientEvaluationForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Patient Evaluation Form</h3>
      <p className="text-sm text-gray-700">
        This form is designed to guide you through a structured patient evaluation process. Please fill in the details below.
      </p>

      {evaluationSteps.map((step, stepIndex) => (
        <div key={stepIndex} className="mb-4 p-4 rounded-lg shadow-sm bg-gray-50">
          <h4 className="text-md font-semibold text-gray-700 mb-2">{step.title}</h4>
          <div className="space-y-3">
            {step.items.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-1">
                <label htmlFor={`eval-item-${stepIndex}-${itemIndex}`} className="block text-sm font-medium text-gray-700">
                  {item.text}
                </label>
                <textarea
                  id={`eval-item-${stepIndex}-${itemIndex}`}
                  rows={2}
                  placeholder={item.tooltip}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Evaluation
        </button>
      </div>
    </div>
  );
};

export default PatientEvaluationForm;