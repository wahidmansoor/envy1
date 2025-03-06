import { useState, useCallback, useRef } from 'react';
import { supabaseClient as supabase } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { OpenAIProvider } from '../services/ai/providers/openai';
import { GeminiProvider } from '../services/ai/providers/gemini';

export type ContentType = 'guideline' | 'algorithm' | 'evidence' | 'practice';
export type CancerType = 'breast' | 'lung' | 'colorectal' | 'prostate' | 'pancreatic' | 'ovarian' | 'leukemia' | 'lymphoma' | 'other';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  cancerType: CancerType;
  year?: number;
  relevance: number;
  summary?: string;
  tags?: string[];
  relatedContent?: {
    guidelines?: string[];
    algorithms?: string[];
    evidence?: string[];
    practices?: string[];
  };
}

interface SearchFilters {
  contentTypes?: ContentType[];
  cancerTypes?: CancerType[];
  yearRange?: [number, number];
  minRelevance?: number;
}

interface SearchOptions {
  filters?: SearchFilters;
  limit?: number;
  includeRelated?: boolean;
}

interface CachedResult {
  timestamp: number;
  results: SearchResult[];
  query: string;
  filters?: SearchFilters;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_HISTORY = 10;
const MIN_QUERY_LENGTH = 2;

export function useAISearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<'openai' | 'gemini'>('openai');

  const searchCache = useRef<Record<string, CachedResult>>({});
  const searchHistory = useRef<string[]>([]);
  const currentQuery = useRef<string>('');

  // Generate search suggestions based on input
  const generateSuggestions = useCallback(async (input: string): Promise<string[]> => {
    if (input.length < MIN_QUERY_LENGTH) return [];

    try {
      const { data, error } = await supabase.rpc('generate_search_suggestions', {
        query_text: input,
        max_suggestions: 5
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
      return [];
    }
  }, []);

  // Get related content for a specific result
  const getRelatedContent = useCallback(async (result: SearchResult): Promise<SearchResult['relatedContent']> => {
    try {
      const { data, error } = await supabase.rpc('find_related_content', {
        content_id: result.id,
        content_type: result.type,
        cancer_type: result.cancerType
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to fetch related content:', err);
      return {};
    }
  }, []);

  // Create embeddings for search query with fallback
  const generateEmbeddings = async (text: string) => {
    const config = {
      provider: 'openai' as const,
      model: 'gpt-3.5-turbo',
      maxTokens: 4000,
      temperature: 0.7,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 10000
    };

    try {
      // Try OpenAI first
      const openAI = new OpenAIProvider(config);
      const embeddings = await openAI.generateResponse(text);
      setActiveProvider('openai');
      return embeddings;
    } catch (err) {
      console.error('OpenAI failed:', err);

      try {
        // Fallback to Gemini
        const geminiConfig = {
          ...config,
          provider: 'gemini' as const,
          model: 'gemini-pro'
        };
        const gemini = new GeminiProvider(geminiConfig);
        const embeddings = await gemini.generateResponse(text);
        setActiveProvider('gemini');
        return embeddings;
      } catch (geminiErr) {
        console.error('Gemini fallback failed:', geminiErr);
        throw new Error('Both OpenAI and Gemini failed to generate embeddings');
      }
    }
  };

  // Main search function
  const search = useCallback(async (
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> => {
    const {
      filters,
      limit = 20,
      includeRelated = true
    } = options;

    // Check cache first
    const cacheKey = JSON.stringify({ query, filters });
    const cached = searchCache.current[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.results;
    }

    try {
      setIsSearching(true);
      setError(null);

      // Generate embeddings for the query
      const embeddings = await generateEmbeddings(query);

      // Perform vector similarity search
      const { data: searchResults, error: searchError } = await supabase.rpc(
        'search_content',
        {
          query_embedding: embeddings,
          match_threshold: 0.7,
          match_count: limit,
          filter_types: filters?.contentTypes || [],
          filter_cancer_types: filters?.cancerTypes || [],
          min_year: filters?.yearRange?.[0] || 0,
          max_year: filters?.yearRange?.[1] || 9999,
          min_relevance: filters?.minRelevance || 0
        }
      );

      if (searchError) throw searchError;

      // Process and enhance results
      const enhancedResults = await Promise.all(
        searchResults.map(async (result: any) => {
          const enhanced: SearchResult = {
            id: result.id,
            title: result.title,
            content: result.content,
            type: result.type,
            cancerType: result.cancer_type,
            year: result.year,
            relevance: result.similarity,
            summary: result.summary,
            tags: result.tags
          };

          if (includeRelated) {
            enhanced.relatedContent = await getRelatedContent(enhanced);
          }

          return enhanced;
        })
      );

      // Update cache
      searchCache.current[cacheKey] = {
        timestamp: Date.now(),
        results: enhancedResults,
        query
      };

      return enhancedResults;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [getRelatedContent]);

  // Update recommendations based on search history
  const updateRecommendations = useCallback(async () => {
    if (searchHistory.current.length === 0) return;

    try {
      const recentQueries = searchHistory.current.slice(0, 3).join(' ');
      const results = await search(recentQueries, {
        limit: 5,
        includeRelated: true
      });

      setRecommendations(results);
    } catch (err) {
      console.error('Failed to update recommendations:', err);
    }
  }, [search]);

  // Handle search query with debounce
  const handleSearch = useCallback(async (
    query: string,
    options?: SearchOptions
  ) => {
    currentQuery.current = query;

    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    // Generate suggestions first
    const newSuggestions = await generateSuggestions(query);
    setSuggestions(newSuggestions);

    // Perform the search
    const searchResults = await search(query, options);
    
    // Only update if this is still the current query
    if (query === currentQuery.current) {
      setResults(searchResults);
      
      // Update search history and recommendations
      if (searchResults.length > 0) {
        searchHistory.current = [
          query,
          ...searchHistory.current.filter(q => q !== query)
        ].slice(0, MAX_HISTORY);
        
        updateRecommendations();
      }
    }
  }, [search, generateSuggestions, updateRecommendations]);

  return {
    search: handleSearch,
    results,
    suggestions,
    recommendations,
    isSearching,
    error,
    activeProvider
  };
}
