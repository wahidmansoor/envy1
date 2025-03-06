import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const commonData = {
    code: 'BRAJANAS',
    tumour_group: 'Breast',
    cancer_site: 'Breast',
    treatment_intent: 'Neoadjuvant or Adjuvant Therapy',
    eligibility: [
        "Postmenopausal women with hormone receptor-positive invasive breast cancer",
        "Scenarios include upfront therapy (5 years), early switch (2-3 years of tamoxifen), late switch (5 years of aromatase inhibitor), and preoperative use for patients unsuitable for immediate surgery",
        "Additional 5 years of aromatase inhibitor if disease-free after the first 5 years",
        "Stage IIA to IIIA disease with recurrence risk ≥10%, or stage IIIB and C, and life expectancy ≥10 years"
    ],
    exclusions: [
        "Premenopausal women",
        "DCIS only"
    ],
    tests: [
        "Baseline bone density (optional)",
        "Follow-up bone density every 3 years",
        "Serum cholesterol and triglycerides if clinically indicated"
    ],
    treatment: [{
        drug: "Anastrozole",
        dose: "1 mg daily PO",
        administration: "Upfront therapy for 5 years, with potential for an additional 5 years for a total of 10 years of endocrine therapy",
        alternative_switches: [
            "Early switch after 2-3 years of tamoxifen",
            "Late switch after 4.5-6 years of tamoxifen"
        ]
    }],
    dose_modifications: {},
    precautions: [
        "Hepatic dysfunction: Caution in severe hepatic dysfunction",
        "Bone density: Risk of reduced bone density and increased osteoporosis. Calcium, vitamin D supplementation, and weight-bearing exercise recommended",
        "Hyperlipidemia: Monitoring cholesterol and triglyceride levels"
    ],
    reference_list: [
        "Coombes RC, Hall E, Gibson LJ, et al. N Engl J Med 2004;350(11):1081-92",
        "The ATAC Trialists Group. Cancer 2003;98:1802-10",
        "Additional references from Lancet, ASCO, and other oncology journals"
    ]
};

// Add protocol-specific fields
const protocolsData = {
    ...commonData,
    treatment_protocol: 'Anastrozole 1mg daily for 5-10 years'
};

async function fixBrajanasData() {
    try {
        console.log('Updating BRAJANAS protocol data...');

        // First delete existing entries if any
        await supabase
            .from('protocols')
            .delete()
            .eq('code', 'BRAJANAS');
            
        await supabase
            .from('regimens')
            .delete()
            .eq('code', 'BRAJANAS');

        // Insert into protocols table
        const { error: protocolError } = await supabase
            .from('protocols')
            .insert(protocolsData);
            
        if (protocolError) throw protocolError;
        
        // Insert into regimens table
        const { error: regimenError } = await supabase
            .from('regimens')
            .insert(commonData);
            
        if (regimenError) throw regimenError;

        console.log('Successfully updated BRAJANAS protocol data in both tables');
        
        // Verify the insertion
        const { data: verifyProtocolData } = await supabase
            .from('protocols')
            .select('*')
            .eq('code', 'BRAJANAS');
            
        const { data: verifyRegimenData } = await supabase
            .from('regimens')
            .select('*')
            .eq('code', 'BRAJANAS');

        console.log('\nVerification:');
        console.log('\nProtocols Table:', JSON.stringify(verifyProtocolData, null, 2));
        console.log('\nRegimens Table:', JSON.stringify(verifyRegimenData, null, 2));
        
    } catch (error) {
        console.error('Update failed:', error.message);
    }
}

fixBrajanasData();