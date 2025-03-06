import React, { useState, useEffect } from 'react';
import ClinicalGuidelines from './guidelines/ClinicalGuidelines';
import type { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import TreatmentAlgorithms from './algorithms/TreatmentAlgorithms';
import EvidenceLibrary from './evidence/EvidenceLibrary';
import BestPractices from './practices/BestPractices';
import MedicationsView from './medications/MedicationsView';
import { BookText, GitMerge, Library, Award, Pill } from 'lucide-react';
import { useAISearch } from '../../hooks/useAISearch';
import { supabaseClient } from '../../lib/supabase';
import type { Guideline, Algorithm, Evidence, Practice, Medication } from './types';
import AppLogo from '../../assets/logos/AppLogo.tsx';

interface TabData {
  guidelines: Guideline[];
  algorithms: Algorithm[];
  evidence: Evidence[];
  practices: Practice[];
  medications: Medication[];
}

export default function AIHandbookModule() {
  const [activeTab, setActiveTab] = useState('guidelines');
  const { results: searchResults } = useAISearch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TabData>({
    guidelines: [],
    algorithms: [],
    evidence: [],
    practices: [],
    medications: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Check auth state
        const { data: { session }, error: authError } = await supabaseClient.auth.getSession();

        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`);
        }

        if (!session) {
          throw new Error('Not authenticated - please sign in');
        }

        setIsLoading(true);
        setError(null);

        const [
          guidelinesResult,
          algorithmsResult,
          evidenceResult,
          practicesResult,
          medicationsResult
        ] = await Promise.allSettled([
          supabaseClient
            .from('clinical_guidelines')
            .select('*'),
          supabaseClient
            .from('treatment_algorithms')
            .select('*'),
          supabaseClient
            .from('evidence_library')
            .select('*'),
          supabaseClient
            .from('best_practices')
            .select('*'),
          supabaseClient
            .from('oncology_medications')
            .select('*')
        ]);

        // Check for any errors in the responses
        [guidelinesResult, algorithmsResult, evidenceResult, practicesResult, medicationsResult]
          .forEach(result => {
            if (result.status === 'fulfilled' && result.value.error) {
              console.error('[AIHandbook] Supabase Error:', {
                message: result.value.error.message,
                details: result.value.error.details,
                hint: result.value.error.hint,
                code: result.value.error.code
              });
              throw result.value.error;
            }
          });

        const newData = {
          guidelines: guidelinesResult.status === 'fulfilled' ? guidelinesResult.value.data || [] : [],
          algorithms: algorithmsResult.status === 'fulfilled' ? algorithmsResult.value.data || [] : [],
          evidence: evidenceResult.status === 'fulfilled' ? evidenceResult.value.data || [] : [],
          practices: practicesResult.status === 'fulfilled' ? practicesResult.value.data || [] : [],
          medications: medicationsResult.status === 'fulfilled' ? medicationsResult.value.data || [] : []
        };

        setData(newData);
      } catch (err) {
        console.error('[AIHandbook] Error:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : typeof err === 'object' && err !== null && 'message' in err 
          ? String(err.message) 
          : 'An unknown error occurred';
          
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [activeTab]);

  const sections = [
    {
      id: 'guidelines',
      title: 'Clinical Guidelines',
      description: 'Evidence-based clinical guidelines with AI-powered search and recommendations.',
      component: (
        <ClinicalGuidelines 
          searchResults={searchResults}
          initialData={data.guidelines}
        />
      ),
      icon: <BookText className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'algorithms',
      title: 'Treatment Algorithms',
      description: 'Interactive treatment pathways and decision support algorithms.',
      component: (
        <TreatmentAlgorithms 
          searchResults={searchResults}
          initialData={data.algorithms}
        />
      ),
      icon: <GitMerge className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'evidence',
      title: 'Evidence Library',
      description: 'Curated collection of research papers and clinical evidence.',
      component: (
        <EvidenceLibrary 
          searchResults={searchResults}
          initialData={data.evidence}
        />
      ),
      icon: <Library className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'practices',
      title: 'Best Practices',
      description: 'Standard operating procedures and clinical best practices.',
      component: (
        <BestPractices 
          searchResults={searchResults}
          initialData={data.practices}
        />
      ),
      icon: <Award className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Comprehensive database of oncology medications and protocols.',
      component: <MedicationsView initialData={data.medications} />,
      icon: <Pill className="h-6 w-6 text-indigo-500" />
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (isLoading) return;
    
    // Reset error if any
    if (error) {
      setError(null);
      setIsLoading(true);
    }
    setActiveTab(sectionId);
  };

  return (
    <div className="w-full max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="rounded-xl p-6 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <BookText className="h-8 w-8 text-indigo-600" />
          AI Handbook
        </h1>
        <p className="mt-2 text-gray-600 text-lg max-w-4xl">
          AI-powered clinical guidelines and evidence-based resources
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="card bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
          <p className="font-medium">Error loading content</p>
          <p className="mt-1 text-description">{error}</p>
          <button 
            onClick={() => { setError(null); setIsLoading(true); }}
            className="button-primary mt-4"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Selectable Section Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`p-4 rounded-lg shadow-md hover:shadow-xl border backdrop-blur-lg transition-all duration-300 hover:scale-102
                         ${activeTab === section.id 
                           ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-transparent hover:from-indigo-500 hover:to-purple-500' 
                           : 'bg-white/20 border-gray-200/40 hover:border-indigo-400 hover:bg-white/30'
                         }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={activeTab === section.id ? 'text-white' : ''}>
                    <div className="h-5 w-5">{section.icon}
</div>
                  </span>
                  <h3 className="font-medium text-base">{section.title}</h3>
                </div>
                <p className={`text-sm ${
                  activeTab === section.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {section.description}
                </p>
              </button>
            ))}
          </div>

          {/* Display Selected Section */}
          {activeTab && (
            <div className="mt-6 p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-200/40 bg-white/20 
                          backdrop-blur-lg transition-all duration-300 ease-in-out">
              <div className="max-w-7xl mx-auto">
                {sections.find((s) => s.id === activeTab)?.component}
              </div>
              {/* Section Quick Help */}
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-gray-300/30 
                           shadow-md hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300">
                <p className="text-sm text-gray-600">
                  {sections.find((s) => s.id === activeTab)?.description}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
