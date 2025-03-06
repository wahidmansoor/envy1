import { useState, useEffect } from 'react';
import { getProtocols } from '../services/protocols';
import type { Protocol } from '../types/protocol';

// Define a list of common cancer sites
const CANCER_SITES = [
  'Breast',
  'Lung',
  'Colorectal',
  'Prostate',
  'Leukemia',
  'Lymphoma',
  'Melanoma',
  'Bladder',
  'Kidney',
  'Pancreatic',
  'Thyroid',
  'Liver',
  'Ovarian',
  'Cervical',
  'Brain',
  'Other'
];

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCancerSite, setSelectedCancerSite] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProtocols() {
      try {
        const data = await getProtocols();
        console.log('Fetched protocols:', data); // Add this line for debugging
        setProtocols(data);
      } catch (err) {
        console.error('Error fetching protocols:', err); // Add this line for debugging
        setError(err instanceof Error ? err.message : 'Failed to load protocols');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProtocols();
  }, []);

  const cancerSites = [...new Set(protocols.map(p => p.cancer_site))];

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = searchTerm === '' || 
      protocol.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.cancer_site.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSite = !selectedCancerSite || 
      protocol.cancer_site === selectedCancerSite;

    return matchesSearch && matchesSite;
  });

  return {
    protocols: filteredProtocols,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    cancerSites,
    selectedCancerSite,
    setSelectedCancerSite,
    CANCER_SITES
  };
}
