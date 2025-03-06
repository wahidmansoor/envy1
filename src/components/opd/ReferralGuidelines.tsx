import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import { supabaseClient as supabase } from '../../lib/supabase';

interface ReferralPathway {
  id: string;
  referral_code: string;
  pathway_name: string;
  cancer_type: string;
  urgency_level: string;
  ai_triage_factors: {
    high_risk_factors: string[];
    moderate_risk_factors: string[];
    low_risk_factors: string[];
  };
  required_information: {
    clinical: string[];
    imaging: string[];
    lab_tests: string[];
    patient: string[];
  };
  clinical_pathway: {
    initial_assessment: string;
    urgent_cases: string[];
    routine_cases: string[];
    followup: string;
  };
  status_tracking: {
    stages: string[];
    current_stage: string;
  };
  sla_timeframes: {
    urgent: {
      triage: string;
      first_appointment: string;
    };
    routine: {
      triage: string;
      first_appointment: string;
    };
  };
  responsible_team: string;
}

interface ReferralStatus {
  id: string;
  referral_id: string;
  status: string;
  notes: string;
  updated_by: string;
  created_at: string;
}

export default function ReferralGuidelines() {
  const [pathways, setPathways] = useState<ReferralPathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  const [referralForm, setReferralForm] = useState({
    patientName: '',
    age: '',
    gender: '',
    clinicalFindings: '',
    symptoms: '',
    duration: '',
    imagingResults: '',
    labResults: ''
  });
  const [selectedPathway, setSelectedPathway] = useState<ReferralPathway | null>(null);
  const [aiTriageResult, setAiTriageResult] = useState<{
    urgency: string;
    reasoning: string[];
    timeframe: string;
  } | null>(null);

  useEffect(() => {
    fetchReferralPathways();
  }, []);

  async function fetchReferralPathways() {
    try {
      const { data, error } = await supabase
        .from('referral_pathways')
        .select('*');

      if (error) throw error;

      setPathways(data || []);
    } catch (error) {
      console.error('Error fetching referral pathways:', error);
    } finally {
      setLoading(false);
    }
  }

  const performAITriage = async (pathway: ReferralPathway) => {
    // Simulate AI analysis of referral information against pathway criteria
    const riskScore = calculateRiskScore(pathway);
    
    const urgency = riskScore >= 7 ? 'Urgent' : riskScore >= 4 ? 'Soon' : 'Routine';
    const reasoning = determineRiskReasons(pathway, riskScore);
    const timeframe = pathway.sla_timeframes?.[urgency.toLowerCase() as 'urgent' | 'routine']?.first_appointment || 'Not specified';

    setAiTriageResult({
      urgency,
      reasoning,
      timeframe
    });
  };

  const calculateRiskScore = (pathway: ReferralPathway) => {
    let score = 0;

    // Check high risk factors
    pathway.ai_triage_factors.high_risk_factors.forEach(factor => {
      if (referralForm.clinicalFindings.toLowerCase().includes(factor.toLowerCase()) ||
          referralForm.symptoms.toLowerCase().includes(factor.toLowerCase())) {
        score += 3;
      }
    });

    // Check moderate risk factors
    pathway.ai_triage_factors.moderate_risk_factors.forEach(factor => {
      if (referralForm.clinicalFindings.toLowerCase().includes(factor.toLowerCase()) ||
          referralForm.symptoms.toLowerCase().includes(factor.toLowerCase())) {
        score += 2;
      }
    });

    // Age consideration
    if (parseInt(referralForm.age) > 60) score += 1;
    if (parseInt(referralForm.age) > 75) score += 1;

    // Duration consideration
    if (referralForm.duration.includes('month') || 
        (referralForm.duration.includes('week') && parseInt(referralForm.duration) > 6)) {
      score += 1;
    }

    return score;
  };

  const determineRiskReasons = (pathway: ReferralPathway, score: number) => {
    const reasons: string[] = [];

    if (score >= 7) {
      reasons.push('Multiple high-risk factors identified');
      reasons.push('Requires urgent assessment');
    } else if (score >= 4) {
      reasons.push('Moderate risk factors present');
      reasons.push('Early assessment recommended');
    } else {
      reasons.push('Routine assessment appropriate');
      reasons.push('Low-risk presentation');
    }

    return reasons;
  };

  const submitReferral = async (pathway: ReferralPathway) => {
    try {
      // Create new referral status entry
      const { data, error } = await supabase
        .from('referral_status')
        .insert([
          {
            referral_id: pathway.id,
            status: 'Referral received',
            notes: `Initial triage urgency: ${aiTriageResult?.urgency}`,
            updated_by: 'System'
          }
        ])
        .select();

      if (error) throw error;

      // Update pathway status
      await supabase
        .from('referral_pathways')
        .update({
          status_tracking: {
            ...pathway.status_tracking,
            current_stage: 'Referral received'
          }
        })
        .eq('id', pathway.id);

      // Show success message
      alert('Referral successfully submitted');
      
    } catch (error) {
      console.error('Error submitting referral:', error);
      alert('Error submitting referral');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Cancer Referral Guidelines
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Form */}
        <div className="space-y-4 p-6 backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800">New Referral</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="pathway" className="block text-sm font-medium text-gray-700">
                Select Pathway
              </label>
              <select
                id="pathway"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const pathway = pathways.find(p => p.id === e.target.value);
                  setSelectedPathway(pathway || null);
                }}
                >
                <option value="">Please select</option>
                {pathways.map(pathway => (
                  <option key={pathway.id} value={pathway.id}>
                    {pathway.pathway_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                id="patientName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={referralForm.patientName}
                onChange={(e) => setReferralForm(prev => ({ ...prev, patientName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={referralForm.age}
                  onChange={(e) => setReferralForm(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={referralForm.gender}
                  onChange={(e) => setReferralForm(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="clinicalFindings" className="block text-sm font-medium text-gray-700">
                Clinical Findings
              </label>
              <textarea
                id="clinicalFindings"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={referralForm.clinicalFindings}
                onChange={(e) => setReferralForm(prev => ({ ...prev, clinicalFindings: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Symptoms
              </label>
              <textarea
                id="symptoms"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={referralForm.symptoms}
                onChange={(e) => setReferralForm(prev => ({ ...prev, symptoms: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration of Symptoms
              </label>
              <input
                type="text"
                id="duration"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., 2 weeks"
                value={referralForm.duration}
                onChange={(e) => setReferralForm(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imagingResults" className="block text-sm font-medium text-gray-700">
                Imaging Results
              </label>
              <textarea
                id="imagingResults"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={referralForm.imagingResults}
                onChange={(e) => setReferralForm(prev => ({ ...prev, imagingResults: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="labResults" className="block text-sm font-medium text-gray-700">
                Laboratory Results
              </label>
              <textarea
                id="labResults"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={referralForm.labResults}
                onChange={(e) => setReferralForm(prev => ({ ...prev, labResults: e.target.value }))}
              />
            </div>

            {selectedPathway && (
              <div className="space-y-4">
                <button
                  onClick={() => performAITriage(selectedPathway)}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Perform AI Triage
                </button>

                {aiTriageResult && (
                  <div className={`p-4 rounded-md ${
                    aiTriageResult.urgency === 'Urgent' ? 'bg-red-50' :
                    aiTriageResult.urgency === 'Soon' ? 'bg-yellow-50 bg-opacity-40' :
                    'bg-green-50 bg-opacity-40'
                  }`}>
                    <div className="flex items-center gap-2">
                      {aiTriageResult.urgency === 'Urgent' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : aiTriageResult.urgency === 'Soon' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                      <h4 className="font-medium">
                        {aiTriageResult.urgency} Referral
                      </h4>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Timeframe: {aiTriageResult.timeframe}</p>
                      <ul className="mt-2 pl-5 list-disc">
                        {aiTriageResult.reasoning.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => submitReferral(selectedPathway)}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  disabled={!aiTriageResult}
                >
                  Submit Referral
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pathway Information */}
        <div className="space-y-4">
          <AnimatePresence>
            {pathways.map((pathway) => (
              <motion.div
                key={pathway.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setExpandedPathway(expandedPathway === pathway.id ? null : pathway.id)}
                  className="w-full p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{pathway.pathway_name}</h3>
                    <p className="text-sm text-gray-500">{pathway.cancer_type}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      expandedPathway === pathway.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedPathway === pathway.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">Required Information</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              {Object.entries(pathway.required_information).map(([category, items]) => (
                                <div key={category}>
                                  <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
                                  <ul className="mt-1 text-sm text-gray-600 list-disc pl-4">
                                    {Array.isArray(items) && items.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">Clinical Pathway</h4>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Initial Assessment:</span>{' '}
                                {pathway.clinical_pathway.initial_assessment}
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Urgent Cases</h5>
                                  <ul className="mt-1 text-sm text-gray-600 list-disc pl-4">
                                    {Array.isArray(pathway.clinical_pathway.urgent_cases) && pathway.clinical_pathway.urgent_cases.map((step, index) => (
                                      <li key={index}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Routine Cases</h5>
                                  <ul className="mt-1 text-sm text-gray-600 list-disc pl-4">
                                    {Array.isArray(pathway.clinical_pathway.routine_cases) && pathway.clinical_pathway.routine_cases.map((step, index) => (
                                      <li key={index}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">SLA Timeframes</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Urgent</h5>
                                <p className="text-sm text-gray-600">
                                  Triage: {pathway.sla_timeframes?.urgent?.triage || 'Not specified'}<br />
                                  First Appointment: {pathway.sla_timeframes?.urgent?.first_appointment || 'Not specified'}
                                </p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Routine</h5>
                                <p className="text-sm text-gray-600">
                                  Triage: {pathway.sla_timeframes?.routine?.triage || 'Not specified'}<br />
                                  First Appointment: {pathway.sla_timeframes?.routine?.first_appointment || 'Not specified'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">Responsible Team</h4>
                            <p className="mt-1 text-sm text-gray-600">{pathway.responsible_team}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
