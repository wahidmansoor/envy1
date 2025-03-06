// Example decision tree for Lung Cancer Diagnosis
import { DecisionNode } from '../components/opd/DecisionTree'; // Corrected import

export const lungCancerPathway = {
  startNode: "initialAssessment",
  nodes: {
    initialAssessment: {
      type: 'question' as "question", // Modified type annotation
      question: "Is the patient presenting with respiratory symptoms?",
      options: [
        { label: "Yes", nextNode: "imaging" },
        { label: "No", nextNode: "riskFactors" },
      ],
    },
    riskFactors: {
      type: 'question' as "question", // Modified type annotation
      question: "Does the patient have significant risk factors for lung cancer (e.g., smoking history, family history)?",
      options: [
        { label: "Yes", nextNode: "imaging" },
        { label: "No", nextNode: "noFurtherAction" },
      ],
    },
    imaging: {
      type: 'question' as "question", // Modified type annotation
      question: "Initial imaging results suggestive of malignancy?",
      options: [
        { label: "Yes", nextNode: "biopsy" },
        { label: "No", nextNode: "furtherImagingOrSurveillance" },
      ],
    },
    biopsy: {
      type: 'question' as "question", // Modified type annotation
      question: "Biopsy confirms lung cancer?",
      options: [
        { label: "Yes", nextNode: "staging" },
        { label: "No", nextNode: "alternativeDiagnosis" },
      ],
    },
    staging: {
      type: 'outcome' as "outcome", // Modified type annotation
      outcome: "Lung cancer confirmed. Proceed with staging and treatment planning.",
    },
    alternativeDiagnosis: {
      type: 'outcome' as "outcome", // Modified type annotation
      outcome: "Lung cancer ruled out. Consider alternative diagnoses and management.",
    },
    furtherImagingOrSurveillance: {
      type: 'outcome' as "outcome", // Modified type annotation
      outcome: "Imaging not suggestive of malignancy. Consider further imaging or surveillance based on clinical suspicion.",
    },
    noFurtherAction: {
      type: 'outcome' as "outcome", // Modified type annotation
      outcome: "Low risk. No further action needed at this time.",
    },
  },
};