import { supabaseClient } from '../lib/supabase';

async function getDistinctTumorGroups() {
  const { data, error } = await supabaseClient
    .from('protocols')
    .select('tumour_group')
    .limit(100); // High limit to get all groups

  if (error) {
    throw error;
  }

  // Extract unique tumor groups
  const groups = new Set(data?.map(p => p.tumour_group));
  return Array.from(groups).sort();
}

async function safeJSONParse(value: any) {
  if (!value) return value;
  if (typeof value !== 'string') return value;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('JSON Parse error:', error);
    return value;
  }
}

async function getProtocols(filters: any): Promise<any[]> {
  let query = supabaseClient
    .from('protocols')
    .select('*')

  if (filters.tumorGroup) {
    query = query.eq('tumour_group', filters.tumorGroup);
  }

  if (filters.drugName) {
    query = query.like('treatment->>drugs', `%${filters.drugName}%`);
  }

  if (filters.protocolCode) {
    query = query.ilike('protocol_code', `%${filters.protocolCode}%`);
  }

  const { data, error } = await query
    .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1)
    .order('protocol_code', { ascending: true });

  if (error) {
    throw error;
  }

  // Parse JSON fields from the database safely
  const protocols = await Promise.all((data || []).map(async protocol => ({
    ...protocol,
    treatment: await safeJSONParse(protocol.treatment),
    eligibility: await safeJSONParse(protocol.eligibility),
    exclusions: await safeJSONParse(protocol.exclusions),
    tests: await safeJSONParse(protocol.tests),
    dose_modifications: await safeJSONParse(protocol.dose_modifications),
    precautions: await safeJSONParse(protocol.precautions),
    reference_list: await safeJSONParse(protocol.reference_list)
  })));

  return protocols;
}

async function getProtocolsCount(filters: any): Promise<number> {
  let query = supabaseClient
    .from('protocols')
    .select('*', { count: 'exact' })

  if (filters.tumorGroup) {
    query = query.eq('tumour_group', filters.tumorGroup);
  }

  if (filters.drugName) {
    query = query.like('treatment->>drugs', `%${filters.drugName}%`);
  }

  if (filters.protocolCode) {
    query = query.ilike('protocol_code', `%${filters.protocolCode}%`);
  }

  const { count, error } = await query

  if (error) {
    throw error;
  }

  return count || 0;
}

export { getProtocols, getProtocolsCount, getDistinctTumorGroups };
