import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseClient as supabase } from '../../lib/supabase';

interface CancerScreening {
  id: string;
  cancer_type: string;
  screening_type: string;
  eligibility_criteria: string[];
  risk_factors: {
    high: string[];
    moderate: string[];
    low: string[];
  };
  screening_interval: string;
  ai_recommendations: {
    screening_frequency: string;
    additional_imaging?: string[];
    risk_assessment: string;
  };
  next_steps: {
    normal: string | string[];
    abnormal?: string[];
  };
  reference_list: string[];
  evidence_level: string;
}

interface ScreeningRecommendation {
  nextDate: string;
  urgency: 'Urgent' | 'Routine' | 'Monitor';
  additionalTests?: string[];
  followUpNotes?: string[];
}

export default function CancerScreeningSupabase() {
  const [screeningData, setScreeningData] = useState<CancerScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedScreen, setExpandedScreen] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<{[key: string]: ScreeningRecommendation}>({});
  const [generatingRecommendation, setGeneratingRecommendation] = useState<{[key: string]: boolean}>({});
  
  const patientInfo = {
    age: '',
    gender: '',
    familyHistory: false,
    smokingHistory: 'never',
    previousScreenings: false,
    symptoms: [] as string[],
    riskFactors: [] as string[]
  };

  useEffect(() => {
    fetchScreeningData();
  }, []);

  async function fetchScreeningData() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('cancer_screening')
        .select('*');

      if (fetchError) throw fetchError;

      setScreeningData(data || []);
    } catch (err) {
      console.error('Error fetching screening data:', err);
      setError('Failed to load screening guidelines. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyStyles = (urgency?: 'Urgent' | 'Routine' | 'Monitor') => {
    switch (urgency) {
      case 'Urgent':
        return {
          bg: 'bg-red-50 bg-opacity-40',
          text: 'text-red-700',
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'Routine':
        return {
          bg: 'bg-green-50 bg-opacity-40',
          text: 'text-green-700',
          icon: <CheckCircle2 className="h-4 w-4" />
        };
      case 'Monitor':
        return {
          bg: 'bg-yellow-50 bg-opacity-40',
          text: 'text-yellow-700',
          icon: <Clock className="h-4 w-4" />
        };
      default:
        return {
          bg: 'bg-gray-50/50',
          text: 'text-gray-700',
          icon: null
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 backdrop-blur-sm bg-red-50 bg-opacity-40 rounded-lg text-red-700">
        <AlertCircle className="inline-block mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Cancer Screening
          </h2>
        </div>
      </motion.div>

      {/* Patient Information Form */}
      <div className="backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 p-6 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-transparent"
              value={patientInfo.age || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-transparent disabled:bg-gray-100 disabled:text-gray-500"
              value={patientInfo.gender}
              disabled
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Screening Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {screeningData.map((screening, index) => {
            const recommendation = recommendations[screening.id];
            const urgencyStyles = getUrgencyStyles(recommendation?.urgency);

            return (
              <motion.div
                key={screening.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div 
                  onClick={() => setExpandedScreen(expandedScreen === index ? null : index)}
                  className="cursor-pointer p-4 border-b border-gray-200 border-opacity-40"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{screening.cancer_type}</h3>
                      <p className="text-sm text-gray-500">{screening.screening_type}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedScreen === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  </div>
                  
                  {recommendation && (
                    <div className={`mt-2 text-sm rounded-md p-2 ${urgencyStyles.bg} ${urgencyStyles.text}`}>
                      <div className="flex items-center gap-1">
                        {urgencyStyles.icon}
                        <span className="font-medium">{recommendation.urgency}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}