import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cancerSites: string[];
  selectedCancerSite: string | null;
  setSelectedCancerSite: (site: string | null) => void;
}

export default function RegimenFilters({
  searchTerm,
  setSearchTerm,
  cancerSites,
  selectedCancerSite,
  setSelectedCancerSite
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search protocols..."
        />
      </div>

      <div className="flex-shrink-0">
        <label htmlFor="cancer-site-select" className="sr-only">Select Cancer Site</label>
        <select
          id="cancer-site-select"
          value={selectedCancerSite || ''}
          onChange={(e) => setSelectedCancerSite(e.target.value || null)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Cancer Sites</option>
          {cancerSites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </div>

      {(searchTerm || selectedCancerSite) && (
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCancerSite(null);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
