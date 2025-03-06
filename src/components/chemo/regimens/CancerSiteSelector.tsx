import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TreatmentIntent } from '../../../types/protocol';

interface CancerSiteSelectorProps {
  sites: string[];
  selectedSite: string | null;
  onSiteSelect: (site: string) => void;
  drugNames: string[];
  selectedDrug: string | null;
  onDrugSelect: (drug: string | null) => void;
  treatmentIntents: TreatmentIntent[];
  selectedIntent: TreatmentIntent | null;
  onIntentSelect: (intent: TreatmentIntent | null) => void;
  onClearFilters: () => void;
}

export default function CancerSiteSelector({
  sites,
  selectedSite,
  onSiteSelect,
  drugNames,
  selectedDrug,
  onDrugSelect,
  treatmentIntents,
  selectedIntent,
  onIntentSelect,
  onClearFilters,
}: CancerSiteSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drug Name Filter */}
          <div className="relative">
            <label htmlFor="drug-name" className="block text-sm font-medium text-gray-700 mb-1">
              Drug Name
            </label>
            <div className="relative">
              <select
                id="drug-name"
                name="drug-name"
                value={selectedDrug || ''}
                onChange={(e) => onDrugSelect(e.target.value || null)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm rounded-md appearance-none"
                aria-label="Select drug name"
              >
                <option value="">All Drugs</option>
                {drugNames.map((drug) => (
                  <option key={drug} value={drug}>
                    {drug}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Treatment Intent Filter */}
          <div className="relative">
            <label htmlFor="treatment-intent" className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Intent
            </label>
            <div className="relative">
              <select
                id="treatment-intent"
                name="treatment-intent"
                value={selectedIntent || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const intent = value ? value as TreatmentIntent : null;
                  onIntentSelect(intent);
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm rounded-md appearance-none"
                aria-label="Select treatment intent"
              >
                <option value="">All Intents</option>
                {treatmentIntents.map((intent) => (
                  <option key={intent} value={intent}>
                    {intent}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedDrug || selectedIntent) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Tumour Groups Grid */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Tumour Group
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sites.map((site) => (
            <button
              key={site}
              onClick={() => onSiteSelect(site)}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedSite === site
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-2 border-transparent shadow-md hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
              }`}
            >
              <div className={`font-medium ${
                selectedSite === site ? 'text-white' : 'text-gray-900'
              }`}>{site}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}