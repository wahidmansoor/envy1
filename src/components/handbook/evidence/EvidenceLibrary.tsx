import React, { useState, useEffect } from 'react';
import { Library } from 'lucide-react';
import type { WithSearchResults, Evidence } from '../types';
import HandbookSkeleton from '../ui/HandbookSkeleton';
import { supabaseClient } from '../../../lib/supabase';

export default function EvidenceLibrary({ searchResults, initialData }: WithSearchResults) {
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults.length > 0) {
      const transformedEvidence = searchResults.map((result): Evidence => ({
        id: result.id,
        title: result.title,
        abstract: result.content,
        cancer_type: result.cancerType || 'Multiple Types',
        evidence_level: 'Level 1',
        authors: ['Various Authors'],
        publication_date: new Date().toISOString(),
        source: 'Database',
        findings: result.content.split('\n').filter(line => line.trim()),
        methodology: 'Systematic Review',
        conclusions: result.content
      }));
      setEvidenceItems(transformedEvidence);
    } else if (!initialData) {
      fetchEvidence();
    }
  }, [searchResults, initialData]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching evidence...');
      const { data, error: fetchError } = await supabaseClient
        .from('evidence_library')
        .select('*');

      if (fetchError) throw fetchError;

      console.log('Fetched evidence:', data);
      setEvidenceItems(data || []);
    } catch (err) {
      console.error('Error fetching evidence:', err);
      setError('Failed to fetch evidence library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HandbookSkeleton />;
  }

  const filteredEvidence = selectedLevel
    ? evidenceItems.filter(e => e.evidence_level === selectedLevel)
    : evidenceItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <Library className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Evidence Library
        </h2>
      </div>

      {error && (
        <div className="backdrop-blur-md bg-white/30 text-red-700 p-4 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {filteredEvidence.map((evidence) => (
          <div
            key={evidence.id}
            className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {evidence.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full border border-gray-200 border-opacity-40">
                    {evidence.cancer_type}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full border border-gray-200 border-opacity-40">
                    {evidence.evidence_level}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="font-medium mb-2">Abstract:</p>
                <p className="mb-4">{evidence.abstract}</p>

                <button
                  onClick={() => setExpandedId(expandedId === evidence.id ? null : evidence.id)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  View {expandedId === evidence.id ? 'Less' : 'More'}
                </button>

                {expandedId === evidence.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Key Findings:</p>
                      <ul className="list-disc pl-4 mb-4">
                        {evidence.findings.map((finding, index) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Methodology:</p>
                      <p>{evidence.methodology}</p>
                    </div>

                    <div>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Conclusions:</p>
                      <p>{evidence.conclusions}</p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Source: {evidence.source}</p>
                      <p>Published: {new Date(evidence.publication_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center p-8 backdrop-blur-md bg-white/30 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 border border-white/20 transition-all duration-300">
          <p className="text-gray-600">No evidence items found.</p>
        </div>
      )}
    </div>
  );
}
