import React, { useState, useMemo } from 'react';
import { Pill, Search, AlertTriangle, Info, Check, Clock, AlertOctagon } from 'lucide-react';

interface PreMedication {
  id: string;
  name: string;
  dose: string;
  route: string;
  timing: string;
  required: boolean;
  indications: string[];
  contraindications?: string[];
  warnings?: string[];
  alternatives?: string[];
  weightBased?: boolean;
  interactionsWith?: string[];
  category: 'Antiemetic' | 'Steroid' | 'Antiallergic' | 'Other';
  adminSequence?: number;
}

const DEFAULT_PREMEDS: PreMedication[] = [
  {
    id: '1',
    name: 'Ondansetron',
    dose: '8-16mg',
    route: 'IV',
    timing: '30 minutes before chemotherapy',
    required: true,
    indications: ['High emetogenic risk', 'Moderate emetogenic risk'],
    contraindications: ['Known hypersensitivity', 'Long QT syndrome'],
    warnings: ['Monitor QT interval', 'May cause headache'],
    alternatives: ['Granisetron', 'Palonosetron'],
    category: 'Antiemetic',
    interactionsWith: ['Aprepitant'],
    adminSequence: 1
  },
  {
    id: '2',
    name: 'Dexamethasone',
    dose: '8-20mg',
    route: 'IV',
    timing: '30 minutes before chemotherapy',
    required: true,
    indications: ['Antiemetic prophylaxis', 'Hypersensitivity prevention'],
    contraindications: ['Active infection'],
    warnings: ['Blood glucose monitoring in diabetic patients'],
    category: 'Steroid',
    interactionsWith: [],
    adminSequence: 2
  },
  {
    id: '3',
    name: 'Diphenhydramine',
    dose: '25-50mg',
    route: 'IV',
    timing: '30 minutes before chemotherapy',
    required: false,
    indications: ['Hypersensitivity prevention', 'Breakthrough nausea'],
    warnings: ['May cause drowsiness'],
    category: 'Antiallergic',
    interactionsWith: [],
    adminSequence: 3
  },
  {
    id: '4',
    name: 'Aprepitant',
    dose: '125mg',
    route: 'PO',
    timing: '1 hour before chemotherapy',
    required: false,
    indications: ['High emetogenic risk regimens'],
    warnings: ['CYP3A4 interactions'],
    category: 'Antiemetic',
    interactionsWith: ['Ondansetron'],
    adminSequence: 1
  },
  {
    id: '5',
    name: 'Ranitidine',
    dose: '50mg',
    route: 'IV',
    timing: '30-60 minutes before chemotherapy',
    required: false,
    indications: ['H2 blockade', 'Gastric protection'],
    contraindications: ['Known hypersensitivity'],
    warnings: [],
    category: 'Other',
    weightBased: true,
    interactionsWith: [],
    adminSequence: 2
  }
];

export default function PreMedicationManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PreMedication['category']>('all');
  const [selectedMeds, setSelectedMeds] = useState<Set<string>>(new Set());
  const [patientWeight, setPatientWeight] = useState<number>(0);

  const filteredMeds = useMemo(() => {
    return DEFAULT_PREMEDS.filter(med => {
      if (selectedCategory !== 'all' && med.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          med.name.toLowerCase().includes(query) ||
          med.category.toLowerCase().includes(query) ||
          med.indications.some(i => i.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const selectedMedsDetails = useMemo(() => {
    return Array.from(selectedMeds)
      .map(id => DEFAULT_PREMEDS.find(m => m.id === id))
      .filter((med): med is PreMedication => med !== undefined)
      .sort((a, b) => (a.adminSequence || 0) - (b.adminSequence || 0));
  }, [selectedMeds]);

  const interactions = useMemo(() => {
    const warnings: string[] = [];
    selectedMedsDetails.forEach(med1 => {
      selectedMedsDetails.forEach(med2 => {
        if (med1.id !== med2.id && med1.interactionsWith?.includes(med2.name)) {
          warnings.push(`Potential interaction between ${med1.name} and ${med2.name}`);
        }
      });
    });
    return warnings;
  }, [selectedMedsDetails]);

  const categories = ['all', 'Antiemetic', 'Steroid', 'Antiallergic', 'Other'] as const;

  const calculateDose = (med: PreMedication) => {
    if (med.weightBased && patientWeight > 0) {
      const baseValue = parseInt(med.dose);
      if (!isNaN(baseValue)) {
        return `${baseValue}mg/kg = ${baseValue * patientWeight}mg`;
      }
    }
    return med.dose;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Pre-Medication Manager
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <label htmlFor="premed-search" className="sr-only">
            Search pre-medications
          </label>
          <input
            id="premed-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pre-medications..."
            className="w-full rounded-md border-gray-300 pl-10 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
            aria-label="Search pre-medications"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div>
          <label htmlFor="category-select" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as typeof selectedCategory)}
            className="w-full rounded-md border-gray-300 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
            aria-label="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="patient-weight" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Weight (kg)
          </label>
          <input
            id="patient-weight"
            type="number"
            value={patientWeight || ''}
            onChange={(e) => setPatientWeight(Number(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
      </div>

      {/* Pre-medications List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className="relative bg-white/20 backdrop-blur-lg rounded-lg border border-gray-200/40 overflow-hidden hover:border-purple-300 hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {med.required && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-sm">
                  Required
                </span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-500">{med.category}</p>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMeds.has(med.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedMeds);
                      if (e.target.checked) {
                        newSelected.add(med.id);
                      } else {
                        newSelected.delete(med.id);
                      }
                      setSelectedMeds(newSelected);
                    }}
                    className="ml-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-300"
                    aria-label={`Select ${med.name}`}
                  />
                  <span className="sr-only">Select {med.name}</span>
                </label>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900">Dose:</span>
                  <span className="text-gray-600">{calculateDose(med)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900">Route:</span>
                  <span className="text-gray-600">{med.route}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900">Timing:</span>
                  <span className="text-gray-600">{med.timing}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {med.contraindications && (
                  <div className="flex items-start gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <ul className="list-disc list-inside space-y-1">
                      {med.contraindications.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {med.warnings && (
                  <div className="flex items-start gap-2 text-yellow-600 text-sm">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <ul className="list-disc list-inside space-y-1">
                      {med.warnings.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-start gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <ul className="list-disc list-inside space-y-1">
                    {med.indications.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {med.alternatives && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Alternatives: </span>
                    {med.alternatives.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Medications Summary */}
      {selectedMeds.size > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg rounded-lg border border-indigo-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">Selected Pre-medications (Administration Sequence)</h3>
          <ul className="space-y-2">
            {selectedMedsDetails.map((med) => (
              <li key={med.id} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="flex items-center gap-2 min-w-[24px]">
                  {med.adminSequence && (
                    <span className="text-xs font-medium text-cyan-700">
                      #{med.adminSequence}
                    </span>
                  )}
                </div>
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>
                  {med.name} - {calculateDose(med)} {med.route} ({med.timing})
                </span>
              </li>
            ))}
          </ul>
          
          {interactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-indigo-200/40">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertOctagon className="h-5 w-5" />
                <h4 className="font-medium">Potential Interactions</h4>
              </div>
              <ul className="space-y-1">
                {interactions.map((warning, idx) => (
                  <li key={idx} className="text-sm text-red-600">• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedMedsDetails.some(med => med.weightBased) && !patientWeight && (
            <div className="mt-4 pt-4 border-t border-indigo-200/40">
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">Please enter patient weight for accurate weight-based dosing</p>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMeds.size === 0 && (
        <div className="mt-6 p-4 bg-white/20 backdrop-blur-lg rounded-lg border border-gray-200/40 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="h-5 w-5" />
            <p className="text-sm">Select pre-medications to view administration sequence</p>
          </div>
        </div>
      )}
    </div>
  );
}