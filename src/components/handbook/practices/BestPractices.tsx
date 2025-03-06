import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import type { WithSearchResults, Practice } from '../types';
import HandbookSkeleton from '../ui/HandbookSkeleton';
import { supabaseClient } from '../../../lib/supabase';

export default function BestPractices({ searchResults, initialData }: WithSearchResults) {
  const [practices, setPractices] = useState<Practice[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults.length > 0) {
      const transformedPractices = searchResults.map((result): Practice => ({
        id: result.id,
        title: result.title,
        category: 'General',
        cancer_type: result.cancerType || 'All Types',
        description: result.content,
        rationale: result.content,
        recommendations: result.content.split('\n').filter(line => line.trim()),
        evidence_level: 'High',
        implementation_tips: [],
        source: 'Database'
      }));
      setPractices(transformedPractices);
    } else if (!initialData) {
      fetchPractices();
    }
  }, [searchResults, initialData]);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching best practices...');
      const { data, error: fetchError } = await supabaseClient
        .from('best_practices')
        .select('*');

      if (fetchError) throw fetchError;

      console.log('Fetched practices:', data);
      setPractices(data || []);
    } catch (err) {
      console.error('Error fetching practices:', err);
      setError('Failed to fetch best practices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HandbookSkeleton />;
  }

  const filteredPractices = selectedCategory
    ? practices.filter(p => p.category === selectedCategory)
    : practices;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <Award className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Best Practices
        </h2>
      </div>

      {error && (
        <div className="backdrop-blur-md bg-white/30 text-red-700 p-4 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {filteredPractices.map((practice) => (
          <div
            key={practice.id}
            className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {practice.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full border border-gray-200 border-opacity-40">
                    {practice.category}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full border border-gray-200 border-opacity-40">
                    {practice.cancer_type}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full border border-gray-200 border-opacity-40">
                    {practice.evidence_level}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="font-medium mb-2">Description:</p>
                <p className="mb-4">{practice.description}</p>

                <button
                  onClick={() => setExpandedId(expandedId === practice.id ? null : practice.id)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  View {expandedId === practice.id ? 'Less' : 'More'}
                </button>

                {expandedId === practice.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Recommendations:</p>
                      <ul className="list-disc pl-4 mb-4">
                        {practice.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    {practice.implementation_tips.length > 0 && (
                      <div>
                        <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Implementation Tips:</p>
                        <ul className="list-disc pl-4 mb-4">
                          {practice.implementation_tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Rationale:</p>
                      <p>{practice.rationale}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPractices.length === 0 && (
        <div className="text-center p-8 backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300">
          <p className="text-gray-600">No best practices found.</p>
        </div>
      )}
    </div>
  );
}
