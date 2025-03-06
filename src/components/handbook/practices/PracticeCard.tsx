import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeProps {
  practice: {
    id?: string;
    title: string;
    category: string;
    recommendations: string[];
    rationale: string[];
  };
}

export default function PracticeCard({ practice }: PracticeProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const buttonId = `practice-${practice.id || practice.title.toLowerCase().replace(/\s+/g, '-')}`;
  const panelId = `${buttonId}-panel`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-emerald-200 transition-colors"
    >
      <div className="p-4">
        <button
          id={buttonId}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-start text-left group"
          aria-controls={panelId}
          aria-label={`${practice.title} - ${practice.category}`}
          type="button"
        >
          <div>
            <h3 className="font-medium text-gray-900">{practice.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{practice.category}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="p-1 rounded-full bg-gray-50 group-hover:bg-gray-100"
          >
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={panelId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-4"
              role="region"
              aria-labelledby={buttonId}
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
                <ul className="mt-2 space-y-2">
                  {practice.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="mr-2 text-emerald-500">•</span>
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Rationale</h4>
                <ul className="mt-2 space-y-2">
                  {practice.rationale.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="mr-2 text-emerald-500">•</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
