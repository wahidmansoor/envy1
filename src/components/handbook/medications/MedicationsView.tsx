import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Pill } from 'lucide-react';
import { supabaseClient } from '../../../lib/supabase';
import MedicationDetailModal from './MedicationDetailModal';
import HandbookSkeleton from '../ui/HandbookSkeleton';
import type { Medication } from '../types';

interface MedicationsViewProps {
  initialData?: Medication[];
}

export default function MedicationsView({ initialData }: MedicationsViewProps) {
  const [medications, setMedications] = useState<Medication[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetchMedications();
    }
  }, [initialData]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching medications...');
      let query = supabaseClient
        .from('oncology_medications')
        .select('*');

      if (selectedClass) {
        query = query.eq('classification', selectedClass);
      }

      // If there's a search query, search across multiple fields
      if (searchQuery) {
        query = query.or([
          // Search in the tsvector for name and classification
          `search_vector.ilike.%${searchQuery}%`,
          // Also search in cancer types
          `indications->>'cancer_types'.ilike.%${searchQuery}%`
        ].join(','));
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        // Insert the data into the oncology_medications table
        const medicationsToInsert = [
          {
            name: 'Cisplatin',
            brand_names: ['Platinol'],
            classification: 'Platinum Chemotherapy',
            indications: {
              cancer_types: ['Lung Cancer', 'Bladder Cancer', 'Testicular Cancer']
            },
            dosage: {
              standard: '50-100 mg/m² every 3-4 weeks'
            },
            administration: ['Infuse over 1-2 hours with hydration'],
            side_effects: ['Nephrotoxicity', 'Nausea & vomiting', 'Ototoxicity'],
            interactions: ['Aminoglycosides', 'NSAIDs', 'Loop Diuretics'],
            monitoring: {
              labs: ['Renal function', 'Electrolytes'],
              frequency: 'Prior to each cycle',
              precautions: ['Hearing tests']
            },
            reference_sources: ['NCCN Guidelines', 'BC Cancer Protocols']
          },
          {
            name: 'Carboplatin',
            brand_names: ['Paraplatin'],
            classification: 'Platinum Chemotherapy',
            indications: {
              cancer_types: ['Ovarian Cancer', 'Lung Cancer']
            },
            dosage: {
              standard: 'AUC 5-6 every 3 weeks'
            },
            administration: ['Infuse over 30-60 minutes'],
            side_effects: ['Thrombocytopenia', 'Nausea & vomiting', 'Peripheral neuropathy'],
            interactions: ['Aminoglycosides', 'NSAIDs'],
            monitoring: {
              labs: ['Platelet count', 'Renal function'],
              frequency: 'Prior to each cycle'
            },
            reference_sources: ['NCCN Guidelines']
          },
          {
            name: 'Doxorubicin',
            brand_names: ['Adriamycin', 'Doxil'],
            classification: 'Anthracycline Chemotherapy',
            indications: {
              cancer_types: ['Breast Cancer', 'Lymphoma', 'Leukemia']
            },
            dosage: {
              standard: '60-75 mg/m² every 3 weeks'
            },
            administration: ['Administer via central line'],
            side_effects: ['Cardiotoxicity', 'Myelosuppression', 'Alopecia'],
            interactions: ['Cyclophosphamide', 'Paclitaxel', 'Trastuzumab'],
            monitoring: {
              labs: ['CBC', 'Liver function tests'],
              frequency: 'Prior to each cycle',
              precautions: ['Regular cardiac monitoring']
            },
            reference_sources: ['NCCN Guidelines']
          }
        ];

        // Use Promise.all to wait for all insertions to complete
        await Promise.all(
          medicationsToInsert.map(async (medication) => {
            const { data: insertData, error: insertError } = await supabaseClient
              .from('oncology_medications')
              .insert([medication]);

            if (insertError) {
              console.error('Error inserting medication:', insertError);
              throw insertError;
            }
            console.log('Inserted medication:', insertData);
          })
        );

        // After inserting, fetch the medications again
        fetchMedications();
        return;
      }

      console.log('Fetched medications:', data);
      setMedications(data || []);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError('Failed to fetch medications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery || selectedClass) {
      fetchMedications();
    }
  }, [searchQuery, selectedClass]);

  if (loading) {
    return <HandbookSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Oncology Medications</h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medications, classifications, or cancer types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="pl-4 pr-10 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            aria-label="Filter by classification"
          >
            <option value="">All Classifications</option>
            <option value="Platinum Chemotherapy">Platinum Chemotherapy</option>
            <option value="Anthracycline Chemotherapy">Anthracycline Chemotherapy</option>
            <option value="Taxane Chemotherapy">Taxane Chemotherapy</option>
            <option value="PD-1 Checkpoint Inhibitor">PD-1 Checkpoint Inhibitor</option>
            <option value="HER2 Monoclonal Antibody">HER2 Monoclonal Antibody</option>
            <option value="Selective Estrogen Receptor Modulator (SERM)">SERM</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-white/30 backdrop-blur-md border border-white/20 text-red-700 p-4 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <X className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="text-center p-8 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
            No medications found. {searchQuery || selectedClass ? 'Try adjusting your filters.' : ''}
          </div>
        ) : (
          medications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 p-6 cursor-pointer transition-all duration-300"
              onClick={() => setSelectedMedication(medication)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{medication.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {medication.brand_names.join(', ')}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 rounded-full text-xs font-medium border border-gray-200 border-opacity-40">
                  {medication.classification}
                </span>
              </div>
              <div className="mt-2">
                  <p className="text-sm text-gray-600 font-medium">
                    {medication.indications.cancer_types.join(', ')}
                  </p>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Detail Modal */}
      <MedicationDetailModal
        medication={selectedMedication}
        isOpen={!!selectedMedication}
        onClose={() => setSelectedMedication(null)}
      />
    </div>
   );
}