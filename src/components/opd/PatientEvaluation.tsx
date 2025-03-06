import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientEvaluationForm from './PatientEvaluationForm';
import { ClipboardList } from 'lucide-react';

// Accordion items to show detailed explanations when clicked
const evaluationSteps = [
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

const PatientEvaluation = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <ClipboardList className="h-6 w-6 text-white" aria-label="Clipboard icon" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Patient Evaluation Guidelines
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <AnimatePresence>
          {evaluationSteps.map((section, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`relative rounded-xl overflow-hidden backdrop-blur-sm bg-white bg-opacity-40 shadow-lg border border-gray-200 border-opacity-40 transform transition-all duration-300 hover:shadow-xl`}
              >
                <button
                  onClick={() => toggleSection(index)}
                  role="button"
                  data-expanded={isOpen}
                  aria-controls={`section-content-${index}`}
                  className="w-full text-left p-5 focus:outline-none"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                    <span className="text-xl text-gray-400">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    key="content"
                    id={`section-content-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 border-opacity-40 px-5 pb-4"
                  >
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-4">
                        <label htmlFor={`eval-item-${itemIndex}`} className="block text-sm font-medium text-gray-700">{item.text}</label>
                        <textarea
                          id={`eval-item-${itemIndex}`}
                          rows={2}
                          placeholder={item.tooltip}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Patient Evaluation Form */}
      <div className="backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 p-6 transition-all duration-300 hover:shadow-xl">
        <PatientEvaluationForm />
      </div>
      
    </div>
  );
};

export default PatientEvaluation;
