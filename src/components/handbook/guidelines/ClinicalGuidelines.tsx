import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { WithSearchResults, Guideline } from '../types';
import HandbookSkeleton from '../ui/HandbookSkeleton';
import { supabaseClient } from '../../../lib/supabase';
import GuidelineCard from './GuidelineCard';

export default function ClinicalGuidelines({ searchResults, initialData }: WithSearchResults) {
  const [guidelines, setGuidelines] = useState<Guideline[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults.length > 0) {
      const transformedGuidelines = searchResults.map((result): Guideline => ({
        id: result.id,
        title: result.title,
        content: result.content,
        type: result.type || 'General',
        cancer_type: result.cancerType || 'All Types',
        stages: ['All Stages'],
        recommendations: result.content.split('\n').filter(line => line.trim()),
        version: '1.0',
        status: 'Published',
        source: 'Database',
        last_review_date: new Date().toISOString(),
        next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }));
      setGuidelines(transformedGuidelines);
    } else if (!initialData) {
      fetchGuidelines();
    }
  }, [searchResults, initialData]);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabaseClient
        .from('clinical_guidelines')
        .select('*');

      if (fetchError) throw fetchError;

      setGuidelines(data || []);
    } catch (err) {
      setError('Failed to fetch guidelines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HandbookSkeleton />;
  }

  const filteredGuidelines = selectedType
    ? guidelines.filter(g => g.type === selectedType)
    : guidelines;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Clinical Guidelines
        </h2>
      </div>

      {error && (
        <div className="alert-warning">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {filteredGuidelines.map((guideline) => (
          <div key={guideline.id}>
            <GuidelineCard 
              guideline={{
                title: guideline.title,
                category: guideline.type,
                lastUpdated: new Date(guideline.updated_at).toLocaleDateString(),
                recommendations: guideline.recommendations,
                evidenceLevel: guideline.cancer_type,
                description: guideline.content
              }} 
            />
          </div>
        ))}
      </div>

      {filteredGuidelines.length === 0 && (
        <div className="backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 p-8 text-center transition-all duration-300 hover:shadow-xl">
          <p className="text-gray-600">No guidelines found.</p>
        </div>
      )}
    </div>
  );
}
