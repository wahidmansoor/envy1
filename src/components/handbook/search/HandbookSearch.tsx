import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAISearch, SearchResult, ContentType, CancerType } from '../../../hooks/useAISearch';
import useDebounce from '../../../hooks/useDebounce';

interface HandbookSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  defaultFilters?: {
    contentTypes?: ContentType[];
    cancerTypes?: CancerType[];
    yearRange?: [number, number];
    minRelevance?: number;
  };
  className?: string;
}

const currentYear = new Date().getFullYear();
const yearRange = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function HandbookSearch({ 
  onResultSelect,
  defaultFilters,
  className = ''
}: HandbookSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(defaultFilters || {});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const {
    search,
    results,
    suggestions,
    isSearching,
    error
  } = useAISearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery, { filters });
    }
  }, [debouncedQuery, filters, search]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    search(suggestion, { filters });
  };

  const handleFilterChange = useCallback((key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search across all content..."
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Search handbook content"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        
        <div className="absolute right-2 top-2 flex items-center gap-2">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 rounded-full"
            title={showFilters ? "Hide filters" : "Show filters"}
            aria-label={showFilters ? "Hide search filters" : "Show search filters"}
          >
            <Filter className={`h-4 w-4 ${showFilters ? 'text-indigo-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" id="content-type-label">
                  Content Type
                </label>
                <select
                  multiple
                  value={filters.contentTypes || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value as ContentType);
                    handleFilterChange('contentTypes', values);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  aria-labelledby="content-type-label"
                  title="Select content types"
                >
                  {['guideline', 'algorithm', 'evidence', 'practice'].map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" id="cancer-type-label">
                  Cancer Type
                </label>
                <select
                  multiple
                  value={filters.cancerTypes || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value as CancerType);
                    handleFilterChange('cancerTypes', values);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  aria-labelledby="cancer-type-label"
                  title="Select cancer types"
                >
                  {['breast', 'lung', 'colorectal', 'prostate', 'pancreatic', 'ovarian', 'leukemia', 'lymphoma', 'other'].map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" id="year-range-label">
                  Year Range
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={filters.yearRange?.[0] || yearRange[yearRange.length - 1]}
                    onChange={(e) => handleFilterChange('yearRange', [
                      parseInt(e.target.value),
                      filters.yearRange?.[1] || currentYear
                    ])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Start year"
                    title="Select start year"
                  >
                    {yearRange.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span>to</span>
                  <select
                    value={filters.yearRange?.[1] || currentYear}
                    onChange={(e) => handleFilterChange('yearRange', [
                      filters.yearRange?.[0] || yearRange[yearRange.length - 1],
                      parseInt(e.target.value)
                    ])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="End year"
                    title="Select end year"
                  >
                    {yearRange.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-md hover:bg-gray-100"
                aria-label="Clear all filters"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="flex items-center justify-center p-4 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </div>
            ) : (
              <div>
                {suggestions.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <div className="text-xs font-medium text-gray-500 px-3 py-1">
                      Suggestions
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-md"
                        aria-label={`Search for ${suggestion}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-1">
                      Results
                    </div>
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => onResultSelect?.(result)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md"
                        aria-label={`View ${result.title}`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{result.type}</span>
                          {result.year && (
                            <>
                              <span>•</span>
                              <span>{result.year}</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}