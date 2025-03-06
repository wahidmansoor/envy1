import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreeningDetails } from '../../types/pathways';

export default function CancerScreening() {
  const [screeningForms, setScreeningForms] = useState<{[cancerType: string]: { [riskFactor: string]: string }}>({});
  const [followUpRecommendations, setFollowUpRecommendations] = useState<{[cancerType: string]: string}>({});
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);

  const generateRecommendation = async (cancerType: string) => {
    setIsGeneratingRecommendation(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI call
    const recommendation = `Next ${screeningGuidelines.find(g => g.cancer === cancerType)?.method} in 1 year`; // Example recommendation
    setFollowUpRecommendations(prevRecs => ({
      ...prevRecs,
      [cancerType]: recommendation,
    }));
    setIsGeneratingRecommendation(false);
    return recommendation;
  };

  const handleRiskFactorChange = (cancerType: string, riskFactor: string, value: string) => {
    setScreeningForms(prevForms => ({
      ...prevForms,
      [cancerType]: {
        ...prevForms[cancerType],
        [riskFactor]: value,
      },
    }));
  };

  const [expandedScreen, setExpandedScreen] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [age, setAge] = useState('');
  const [familyHistory, setFamilyHistory] = useState(false);
  const [smokingHistory, setSmokingHistory] = useState('never');
  const [expandedDetails, setExpandedDetails] = useState<{[key: string]: boolean}>({});

  const screeningGuidelines = [
    {
      cancer: 'Breast Cancer',
      population: 'Women aged 40-74',
      frequency: 'Every 2 years',
      method: 'Mammography',
      recommendations: [
        'Monthly breast self-examination',
        'Annual clinical breast examination',
        'Consider starting earlier if family history'
      ]
    },
    {
      cancer: 'Colorectal Cancer',
      population: 'Adults aged 45-75',
      frequency: 'Every 10 years',
      method: 'Colonoscopy',
      recommendations: [
        'Annual FIT test as an alternative',
        'Earlier screening if family history',
        'Consider risks and benefits after 75'
      ]
    },
    {
      cancer: 'Cervical Cancer',
      population: 'Women aged 21-65',
      frequency: 'Every 3-5 years',
      method: 'Pap smear ± HPV testing',
      recommendations: [
        'Start at age 21',
        'HPV co-testing every 5 years after 30',
        'Can stop after 65 if adequate prior screening'
      ]
    },
    {
      cancer: 'Prostate Cancer',
      population: 'Men aged 55-69',
      frequency: 'Discuss timing (often annually or biennially) with provider',
      method: 'PSA (Prostate-Specific Antigen) ± Digital Rectal Exam',
      recommendations: [
        'Shared decision-making is crucial',
        'Discuss potential benefits/harms of screening',
        'Family history and race can affect risk'
      ]
    },
    {
      cancer: 'Lung Cancer',
      population: 'Adults 50-80 with 20 pack-year smoking history (currently smoking or quit within past 15 years)',
      frequency: 'Annual, if criteria are met',
      method: 'Low-dose CT (LDCT)',
      recommendations: [
        'Discontinue if patient has not smoked for 15 years',
        'Counsel on smoking cessation',
        'Balance false positives vs. early detection benefits'
      ]
    },
    {
      cancer: 'Ovarian Cancer',
      population: 'High-risk women (e.g., BRCA mutations)',
      frequency: 'Individualized (no routine screening for average risk)',
      method: 'Transvaginal ultrasound + CA-125 (for high-risk only)',
      recommendations: [
        'Genetic counseling if strong family history',
        'Consider prophylactic oophorectomy if very high risk',
        'Routine screening not recommended for average-risk women'
      ]
    },
    {
      cancer: 'Endometrial Cancer',
      population: 'Women with increased risk (e.g., Lynch syndrome)',
      frequency: 'No standard routine screening for average risk',
      method: 'Endometrial biopsy in select high-risk cases',
      recommendations: [
        'Report any postmenopausal bleeding',
        'Genetic testing/counseling for hereditary syndromes',
        'Discuss prophylactic hysterectomy in very high-risk scenarios'
      ]
    },
    {
      cancer: 'Skin Cancer',
      population: 'All adults (no routine screening recommendation by USPSTF for average risk)',
      frequency: 'Self-exam monthly; clinical exam for high-risk individuals',
      method: 'Visual skin exam',
      recommendations: [
        'Use sun protection (sunscreen, protective clothing)',
        'Monitor moles for changes (ABCDE rule)',
        'High-risk individuals may need annual dermatologist visits'
      ]
    },
    {
      cancer: 'Pancreatic Cancer',
      population: 'High-risk individuals (e.g., hereditary pancreatitis, BRCA2, Lynch syndrome)',
      frequency: 'Individualized screening (no routine for average risk)',
      method: 'Endoscopic ultrasound (EUS) or MRI for high-risk',
      recommendations: [
        'Genetic counseling if strong family history',
        'Focus on managing modifiable risk factors',
        'No routine screening for most individuals'
      ]
    }
  ];

  const toggleScreen = (index: number) => {
    setExpandedScreen(expandedScreen === index ? null : index);
  };

  const getScreeningDetails = (cancer: string): ScreeningDetails => {
    // This would ideally come from your data source
    return {
      when: `Timing recommendations for ${cancer} screening`,
      procedure: [
        'Pre-screening preparation steps',
        'During screening procedure details',
        'Post-screening follow-up',
        'Result interpretation timeline'
      ],
      risks: [
        'False positives/negatives',
        'Procedural complications',
        'Psychological impact',
        'Financial considerations'
      ],
      benefits: [
        'Early detection rates',
        'Survival improvement statistics',
        'Quality of life impact',
        'Cost-effectiveness'
      ],
      alternatives: [
        'Alternative screening methods',
        'Risk-based screening approaches',
        'Monitoring options',
        'Lifestyle modifications'
      ]
    };
  };

  const toggleDetails = (index: number, type: string) => {
    const key = `${index}-${type}`;
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <Search className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Cancer Screening Tests
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {screeningGuidelines.map((guideline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`
                relative rounded-xl overflow-hidden
                bg-gradient-to-br from-white to-gray-50
                shadow-[0_0_15px_rgba(0,0,0,0.1)]
                transform transition-all duration-300
              `}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <button
                onClick={() => toggleScreen(index)}
                className="w-full p-5 flex justify-between items-center text-left group"
              >
                <h3 className="font-semibold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {guideline.cancer}
                </h3>
                <motion.div
                  animate={{ rotate: expandedScreen === index ? 180 : 0 }}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100"
                >
                  <ChevronDown className="h-5 w-5 text-indigo-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedScreen === index && (
                  <div
                    className="px-5 pb-5"
                  >
                    <div className="space-y-3">
                      <div className="space-y-2"> 
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
                        <input
                          type="number"
                          name="age"
                          id="age"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700">Family History of Breast Cancer:</label>
                        <input
                          type="checkbox"
                          name="familyHistory"
                          id="familyHistory"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={familyHistory}
                          onChange={(e) => setFamilyHistory(e.target.checked)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="smokingHistory" className="block text-sm font-medium text-gray-700">Smoking History:</label>
                        <select
                          id="smokingHistory"
                          name="smokingHistory"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={smokingHistory}
                          onChange={(e) => setSmokingHistory(e.target.value)}
                        >
                          <option value="never">Never Smoked</option>
                          <option value="former">Former Smoker</option>
                          <option value="current">Current Smoker</option>
                        </select>
                      </div>
                      <motion.p
                        variants={{
                          open: { opacity: 1, x: 0 },
                          collapsed: { opacity: 0, x: -20 }
                        }}
                        className="text-sm text-gray-600"
                      >
                        Target Population: {guideline.population}
                      </motion.p>
                      <motion.div
                        variants={{
                          open: { opacity: 1, x: 0 },
                          collapsed: { opacity: 0, x: -20 }
                        }}
                        className="text-sm font-medium text-indigo-600"
                      >
                        Frequency: {guideline.frequency}
                      </motion.div>
                      <motion.div
                        variants={{
                          open: { opacity: 1, x: 0 },
                          collapsed: { opacity: 0, x: -20 }
                        }}
                        className="text-sm text-gray-600"
                      >
                        Method: {guideline.method}
                      </motion.div>
                      <motion.ul
                        variants={{
                          open: { opacity: 1, x: 0 },
                          collapsed: { opacity: 0, x: -20 }
                        }}
                        className="text-sm text-gray-600 list-disc pl-4 space-y-1"
                      >
                        {guideline.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </motion.ul>
                    </div>
                    <div className="mt-4 space-y-3">
                      {['procedure', 'risks', 'benefits', 'alternatives'].map((section) => (
                        <motion.div key={section} className="border-t pt-2">
                          <button
                            onClick={() => toggleDetails(index, section)}
                            className="flex justify-between items-center w-full text-left"
                          >
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {section}
                            </span>
                            <ChevronRight 
                              className={`h-4 w-4 text-indigo-600 transform transition-transform
                                ${expandedDetails[`${index}-${section}`] ? 'rotate-90' : ''}`}
                            />
                          </button>
                          
                          <AnimatePresence>
                            {expandedDetails[`${index}-${section}`] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 pl-4 border-l-2 border-indigo-100"
                              >
                                {section === 'when' ? (
                                  <p className="text-sm text-gray-600">{getScreeningDetails(guideline.cancer)[section as keyof ScreeningDetails]}</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {(getScreeningDetails(guideline.cancer)[section as keyof ScreeningDetails] as string[]).map((item, idx) => (
                                      <li key={idx} className="text-sm text-gray-600">
                                        {item}
                                      </li>
                                    ))}</ul>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export {screeningGuidelines};
