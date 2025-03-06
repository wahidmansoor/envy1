import React, { useState } from 'react';
import { ChevronRight, Activity, Stethoscope, Dna, ShieldCheck, 
         Wind, CircleDot, GitBranch, Brain, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TabView from './TabView';

interface TreatmentStep {
  title: string;
  description: string;
  substeps?: string[];
}

interface Reference {
  title: string;
  url?: string;
  year?: number;
}

interface Algorithm {
  id: number;
  title: string;
  cancer_type: string;
  summary: string;
  treatment_steps: TreatmentStep[];
  reference_sources: Reference[];
  subtypes: { name: string; steps: string[]; decisionPoints: string[]; }[];
}

interface AlgorithmCardProps {
  algorithm: Algorithm;
  isExpanded: boolean;
  onToggle: () => void;
  isHovered: boolean;
}

const cancerIcons: { [key: string]: JSX.Element } = {
  'Breast Cancer': <Dna className="h-6 w-6 text-pink-600" />,
  'Lung Cancer': <Wind className="h-6 w-6 text-blue-600" />,
  'Blood Cancer': <CircleDot className="h-6 w-6 text-red-600" />,
  'Heart Cancer': <Heart className="h-6 w-6 text-red-600" />,
  'Colorectal Cancer': <Activity className="h-6 w-6 text-green-600" />,
  'Bladder Cancer': <Stethoscope className="h-6 w-6 text-indigo-600" />,
  'Endometrial Cancer': <ShieldCheck className="h-6 w-6 text-yellow-600" />
};

const TREATMENT_STAGES = ['Early-Stage', 'Locoregional', 'Metastatic'];

function AlgorithmCard({ algorithm, isExpanded, onToggle, isHovered }: AlgorithmCardProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Get icon based on cancer type or fallback to default
  const getIcon = () => {
    return cancerIcons[algorithm.cancer_type] || <GitBranch className="h-6 w-6 text-gray-600" />;
  };

  const renderTreatmentSteps = () => {
    return (
      <div className="space-y-4">
        <AnimatePresence>
          {algorithm.treatment_steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
              {step.substeps && step.substeps.length > 0 && (
                <ul className="space-y-2">
                  {step.substeps.map((substep, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-600">{substep}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderStageContent = (stage: string) => {
    const subtypes = algorithm.subtypes.filter(subtype =>
      subtype.name.toLowerCase().includes(stage.toLowerCase())
    );

    if (subtypes.length === 0) {
      return (
        <div className="py-4 text-center text-gray-500 text-sm">
          No treatment algorithms available for this stage.
        </div>
      );
    }

    return subtypes.map((subtype, subIndex) => (
      <div key={subIndex} className="space-y-4 mb-6 last:mb-0">
        <h4 className="font-medium text-gray-900 text-base">{subtype.name}</h4>
        
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Treatment Steps:</h5>
          <ul className="space-y-2">
            {subtype.steps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-600">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {subtype.decisionPoints.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Decision Points:</h5>
            <ul className="list-disc pl-5 space-y-1">
              {subtype.decisionPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600">{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative rounded-xl overflow-hidden 
         shadow-md border transition-all duration-300
        ${isHovered ? 'shadow-lg border-indigo-400' : 'border-gray-200'}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex justify-between items-center text-left group"
      >
        <div className="flex items-center gap-4">
          <span>{getIcon()}</span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{algorithm.title}</h3>
            <p className="text-sm text-gray-500">{algorithm.summary}</p>
          </div>
        </div>
        <ChevronRight 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 
            ${isExpanded ? 'rotate-90' : ''}`} 
        />
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-5 pb-5"
        >
          <div className="mb-6">
            {renderTreatmentSteps()}
          </div>

          <TabView
            tabs={TREATMENT_STAGES}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {TREATMENT_STAGES.map((stage) => renderStageContent(stage))}
          </TabView>

          {algorithm.reference_sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">References:</h4>
              <ul className="space-y-1">
                {algorithm.reference_sources.map((ref, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {ref.url ? (
                      <a 
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {ref.title} {ref.year ? `(${ref.year})` : ''}
                      </a>
                    ) : (
                      <span>{ref.title} {ref.year ? `(${ref.year})` : ''}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default AlgorithmCard;
