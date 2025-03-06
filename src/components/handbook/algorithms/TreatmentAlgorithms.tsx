import React, { useState, useEffect } from 'react';
import { GitMerge } from 'lucide-react';
import type { WithSearchResults, Algorithm } from '../types';
import HandbookSkeleton from '../ui/HandbookSkeleton';
import { supabaseClient } from '../../../lib/supabase';

export default function TreatmentAlgorithms({ searchResults, initialData }: WithSearchResults) {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCancerType, setSelectedCancerType] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults.length > 0) {
      // Transformation logic for search results
      const transformedAlgorithms = searchResults.map((result): Algorithm => ({
        id: result.id,
        title: result.title,
        cancer_type: result.cancerType || 'General',
        year: 2024, // Default year or extract from result if available
        content: result.content,
        decision_points: [], // Placeholder, adjust if search results contain decision points
        keywords: [], // Default keywords
        embedding: null, // Default embedding
        relevance_score: 0, // Default relevance score
        created_at: new Date().toISOString(), // Default created_at
        updated_at: new Date().toISOString() // Default updated_at
      } as Algorithm));
      setAlgorithms(transformedAlgorithms);
    } else if (!initialData) {
      fetchAlgorithms();
    }
  }, [searchResults, initialData]);

  const fetchAlgorithms = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching algorithms...');
      const { data, error: fetchError } = await supabaseClient
        .from('treatment_algorithms')
        .select('*');

      if (fetchError) throw fetchError;

      console.log('Fetched algorithms:', data);
      setAlgorithms(data || []);
    } catch (err) {
      console.error('Error fetching algorithms:', err);
      setError('Failed to fetch treatment algorithms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HandbookSkeleton />;
  }

  const filteredAlgorithms = selectedCancerType
    ? algorithms.filter(a => a.cancer_type === selectedCancerType)
    : algorithms;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <GitMerge className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Treatment Algorithms
        </h2>
      </div>

      {error && (
        <div className="backdrop-blur-sm bg-red-50/40 text-red-700 p-4 rounded-xl shadow-lg border border-red-200/40">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {filteredAlgorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 overflow-hidden transition-all duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {algorithm.title}
              </h3>
              <div className="flex gap-2 mb-4">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-gray-200 border-opacity-40 rounded-full">
                  {algorithm.cancer_type}
                </span>
                {algorithm.year && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-gray-200 border-opacity-40 rounded-full">
                    Year: {algorithm.year}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {algorithm.decision_points && algorithm.decision_points.map((dp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">{dp.order}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{dp.description}</h4>
                      {dp.options && dp.options.length > 0 && (
                        <ul className="mt-2 pl-4 space-y-1">
                          {dp.options.map((option: string, optIndex: number) => (
                            <li key={optIndex} className="text-sm text-gray-600">
                              • {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center p-8 backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300">
          <p className="text-gray-600">No treatment algorithms found.</p>
        </div>
      )}
    </div>
  );
}
