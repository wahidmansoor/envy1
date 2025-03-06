import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Protocol, TreatmentItem } from '../../../types/protocol';

interface AdvancedFiltersProps {
  protocols: Protocol[];
  selectedDrug: string | null;
  setSelectedDrug: (drug: string | null) => void;
  protocolCode: string;
  setProtocolCode: (code: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function AdvancedFilters({
  protocols,
  selectedDrug,
  setSelectedDrug,
  protocolCode,
  setProtocolCode,
  setCurrentPage,
}: AdvancedFiltersProps) {
  // Extract unique drug names from all protocols
  const drugNames = React.useMemo(() => {
    const drugs = new Set<string>();
    protocols.forEach(protocol => {
      if (Array.isArray(protocol.treatment)) {
        protocol.treatment.forEach(treatment => {
          if (typeof treatment === 'object' && treatment !== null && 'drug' in treatment) {
            // If treatment is an object with a drug property
            const typedTreatment = treatment as TreatmentItem;
            drugs.add(typedTreatment.drug);
          } else if (typeof treatment === 'string') {
            drugs.add(treatment.split(' ')[0]);
 // Extract first word as drug name
          }
        });
      }
    });
    return Array.from(drugs).sort();
  }, [protocols]);

  // Reset filters
  const clearFilters = () => {
    setSelectedDrug(null);
    setProtocolCode('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="drug-name" className="block text-sm font-medium text-gray-700 mb-1">
            Drug Name
          </label>
          <div className="relative">
            <select
              id="drug-name"
              name="drug-name"
              value={selectedDrug || ''}
              onChange={(e) => {
                setSelectedDrug(e.target.value || null);
                setCurrentPage(1);
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              aria-label="Select drug name"
            >
              <option value="">All Drugs</option>
              {drugNames.map((drug) => (
                <option key={drug} value={drug}>
                  {drug}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Protocol Code Search */}
        <div>
          <label htmlFor="protocol-code" className="block text-sm font-medium text-gray-700 mb-1">
            Protocol Code
          </label>
          <div className="relative">
            <input
              id="protocol-code"
              type="text"
              value={protocolCode}
              onChange={(e) => {
                setProtocolCode(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Enter protocol code"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              aria-label="Search by protocol code"
            />
            {protocolCode && (
              <button
                onClick={() => setProtocolCode('')}
                className="absolute inset-y-0 right-0 flex items-center px-2"
                aria-label="Clear protocol code"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedDrug || protocolCode) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}