import React, { useState, useEffect } from 'react';
import { BookOpen, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProtocols, getProtocolsCount, getDistinctTumorGroups } from '../../services/protocols';
import type { Protocol, Treatment, TreatmentIntent, TreatmentDrug } from '../../types/protocol';
import { supabaseClient as supabase } from '../../lib/supabase';
import CancerSiteSelector from './regimens/CancerSiteSelector';

const ITEMS_PER_PAGE = 10;

const TREATMENT_INTENTS: TreatmentIntent[] = [
  'Curative Intent',
  'Palliative Intent',
  'Neoadjuvant or Adjuvant Therapy'
];

export type ProtocolFilters = {
  tumorGroup: string | null;
  drugName: string | null;
  treatmentIntent: TreatmentIntent | null;
};

// Protocol Detail Display Components
const renderTreatmentDrug = (item: TreatmentDrug, index: number) => {
  return (
    <li 
      key={index} 
      className="text-gray-600 p-2 rounded-lg border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
        backdropFilter: 'blur(8px)'
      }}>
      <div className="space-y-1">
        <div><span className="font-medium">Drug:</span> {item.name}</div>
        {item.dose && <div>
          <span className="font-medium">Dose:</span> {item.dose}
        </div>}
        {item.administration && <div>
          <span className="font-medium">Administration:</span> {item.administration}
        </div>}
        {item.alternative_switches && item.alternative_switches.length > 0 && (
          <div><span className="font-medium">Alternatives:</span> {item.alternative_switches.join(', ')}</div>
        )}
      </div>
    </li>
  );
};

const renderJsonSection = (title: string, data: Record<string, any> | null) => {
  if (!data) return null;
  
  // Check if the object is empty
  if (Object.keys(data).length === 0) {
    return (
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="mt-2 p-3 rounded-lg border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
            backdropFilter: 'blur(8px)'
          }}>
          <p className="text-sm text-gray-600">No {title.toLowerCase()} information available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <div className="mt-2 p-3 rounded-lg border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
          backdropFilter: 'blur(8px)'
        }}>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const ProtocolDetails = ({ protocol }: { protocol: Protocol }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">
        Protocol: {protocol.protocol_code}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-900">Tumour Group</h4>
          <p className="text-gray-600">{protocol.tumour_group}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Treatment Intent</h4>
          <p className="text-gray-600">{protocol.treatment_intent}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Treatment Section */}
        <div>
          <h4 className="font-medium text-gray-900">Treatment</h4>
          <div className="mt-2 space-y-2">
            {protocol.treatment?.drugs ? (
              protocol.treatment.drugs.map(renderTreatmentDrug)
            ) : (
              <p className="text-gray-600">No treatment details available</p>
            )}
          </div>
        </div>

        {/* Tests Section */}
        {protocol.tests && Object.keys(protocol.tests).length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Required Tests</h4>
            <div className="mt-2 space-y-3">
              {Object.entries(protocol.tests).map(([timing, tests]) => (
                <div key={timing} className="p-3 rounded-lg border border-gray-200/40 shadow-md">
                  <h5 className="text-gray-700 font-medium mb-2">{timing}:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(tests) && tests.map((test: string, index: number) => (
                      <li key={index} className="text-gray-600">{test}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Information Sections */}
        {renderJsonSection('Biomarkers', protocol.biomarkers)}
        {renderJsonSection('Risk Factors', protocol.risk_factors)}
        {renderJsonSection('Contraindications', protocol.contraindications)}
        {renderJsonSection('Follow-up Care', protocol.follow_up)}
        {renderJsonSection('Side Effects', protocol.side_effects)}
        {renderJsonSection('Drug Interactions', protocol.drug_interactions)}
        {renderJsonSection('Clinical Trials', protocol.clinical_trials)}

        {/* Response and Survival Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocol.response_rate && (
            <div>
              <h4 className="font-medium text-gray-900">Response Rate</h4>
              <p className="mt-1 text-gray-600">{protocol.response_rate}</p>
            </div>
          )}
          {protocol.overall_survival && (
            <div>
              <h4 className="font-medium text-gray-900">Overall Survival</h4>
              <p className="mt-1 text-gray-600">{protocol.overall_survival}</p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        {protocol.notes && (
          <div>
            <h4 className="font-medium text-gray-900">Additional Notes</h4>
            <p className="mt-1 text-gray-600 whitespace-pre-wrap">{protocol.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RegimensLibrary() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTumorGroup, setSelectedTumorGroup] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<TreatmentIntent | null>(null);
  const [tumorGroups, setTumorGroups] = useState<string[]>([]);

  // Fetch all tumor groups independently
  useEffect(() => {
    const fetchTumorGroups = async () => {
      try {
        const groups = await getDistinctTumorGroups();
        setTumorGroups(groups.filter(g => g && g !== 'Unknown'));
      } catch (err) {
        console.error('Failed to fetch tumor groups:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tumor groups');
      }
    };

    fetchTumorGroups();
  }, []);

  // Get unique drug names
  const drugNames = React.useMemo(() => {
    const drugs = new Set<string>();
    protocols.forEach(protocol => {
      if (protocol.treatment?.drugs) {
        protocol.treatment.drugs.forEach(drug => {
          if (drug.name) {
            drugs.add(drug.name);
          }
        });
      }
    });
    return Array.from(drugs).sort();
  }, [protocols]);

  // Fetch protocols with filters
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setIsLoading(true);
        const filters = {
          tumorGroup: selectedTumorGroup,
          drugName: selectedDrug,
          treatmentIntent: selectedIntent,
          page: currentPage,
          pageSize: ITEMS_PER_PAGE
        };

        const countFilters = {
          tumorGroup: selectedTumorGroup,
          drugName: selectedDrug,
          treatmentIntent: selectedIntent
        };

        const [fetchedProtocols, count] = await Promise.all([
          getProtocols(filters),
          getProtocolsCount(countFilters)
        ]);

        setProtocols(fetchedProtocols);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load protocols');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtocols();
  }, [currentPage, selectedTumorGroup, selectedDrug, selectedIntent]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get treatment summary
  const getTreatmentSummary = (treatment: Treatment | null) => {
    if (!treatment || !treatment.drugs || treatment.drugs.length === 0) {
      return 'No treatment details';
    }

    const drugsSummary = treatment.drugs
      .map(drug => `${drug.name || 'Unknown'}${drug.dose ? ` ${drug.dose}` : ''}`)
      .join(', ');
    
    return drugsSummary || 'No treatment details';
  };

  const clearAllFilters = () => {
    setSelectedTumorGroup(null);
    setSelectedDrug(null);
    setSelectedIntent(null);
    setCurrentPage(1);
  };

  if (isLoading && protocols.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 p-6"
        >
          Loading protocols...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 bg-opacity-40 border border-red-200 border-opacity-40 rounded-xl p-4">
        <div className="flex items-center">
          <p className="text-sm text-red-700">
            Error loading protocols: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chemotherapy Regimens
          </h2>
        </motion.div>
        
        {selectedTumorGroup && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
            layout
          >
            <h3 className="text-lg font-medium text-gray-900">
              {selectedTumorGroup} Protocols
            </h3>
            <motion.button
              onClick={clearAllFilters}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Back to cancer sites selection"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {selectedTumorGroup ? (
        <>
          {/* Results count */}
          <div className="text-sm text-gray-500 mb-6">
            Showing {protocols.length} of {totalCount} protocols
          </div>

          {/* Protocols Table */}
          <div className="bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tumour Group  
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment Intent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment Summary
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      More Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {protocols.map((protocol) => (
                    <tr 
                      key={protocol.id}
                      className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {protocol.protocol_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {protocol.tumour_group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {protocol.treatment_intent || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {getTreatmentSummary(protocol.treatment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => setSelectedProtocol(protocol)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                          aria-label={`View details for ${protocol.protocol_code}`}
                        >
                          More Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white bg-opacity-40 rounded-xl border border-gray-200 border-opacity-40 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                    </span>{' '}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      ) : (
        <CancerSiteSelector
          sites={tumorGroups}
          selectedSite={selectedTumorGroup}
          onSiteSelect={(site) => {
            setSelectedTumorGroup(site);
            setCurrentPage(1);
          }}
          drugNames={drugNames}
          selectedDrug={selectedDrug}
          onDrugSelect={setSelectedDrug}
          treatmentIntents={TREATMENT_INTENTS}
          selectedIntent={selectedIntent}
          onIntentSelect={setSelectedIntent}
          onClearFilters={clearAllFilters}
        />
      )}

      {/* Protocol Details Modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-25"
            onClick={() => setSelectedProtocol(null)}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl p-6 mx-auto bg-white bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 border-opacity-40 hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => setSelectedProtocol(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  aria-label="Close protocol details"
                >
                  <X className="w-6 h-6" />
                </button>
                <ProtocolDetails protocol={selectedProtocol} />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
