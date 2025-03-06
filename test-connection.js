import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('Testing connection...');
        
        const testRecord = {
            code: 'TEST123',
            tumour_group: 'Test Group',
            cancer_site: 'Test Site',
            treatment_intent: 'Curative',
            treatment_protocol: 'Test Protocol',
            eligibility: JSON.stringify([
                'Age ≥ 18 years',
                'ECOG performance status 0-2'
            ]),
            exclusions: JSON.stringify({
                criteria: [
                    'Prior chemotherapy',
                    'Active infection'
                ]
            }),
            tests: JSON.stringify({
                baseline: ['CBC', 'Chemistry'],
                monitoring: ['Weekly CBC'],
                frequency: 'Weekly'
            }),
            treatment: JSON.stringify({
                drugs: [
                    { name: 'Drug A', dose: '100mg' }
                ],
                schedule: ['Day 1-14'],
                duration: '6 cycles',
                type: 'Chemotherapy'
            }),
            dose_modifications: JSON.stringify({
                hematological: ['ANC < 1.0: Delay'],
                nonHematological: ['Grade 3: Reduce dose'],
                renal: ['CrCl < 30: Reduce dose'],
                hepatic: ['Bili > 3x ULN: Hold']
            }),
            precautions: JSON.stringify([
                'Monitor for infusion reactions',
                'Regular cardiac monitoring'
            ]),
            reference_list: JSON.stringify([
                'Author et al. Journal 2024'
            ])
        };

        const { error } = await supabase
            .from('protocols')
            .insert(testRecord);

        if (error) throw error;
        console.log('Test successful');
        
    } catch (error) {
        console.error('Connection test failed:', error.message);
    } finally {
        await supabase.from('protocols').delete().eq('code', 'TEST123');
    }
}

testConnection();
