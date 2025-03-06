import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyBrajanas() {
    try {
        console.log('Verifying BRAJANAS protocol...');
        
        // Check protocols table
        const { data: protocolData, error: protocolError } = await supabase
            .from('protocols')
            .select('*')
            .eq('code', 'BRAJANAS');
            
        if (protocolError) throw protocolError;
        
        console.log('\nProtocols Table:');
        console.log(JSON.stringify(protocolData, null, 2));
        
        // Check regimens table
        const { data: regimenData, error: regimenError } = await supabase
            .from('regimens')
            .select('*')
            .eq('code', 'BRAJANAS');
            
        if (regimenError) throw regimenError;
        
        console.log('\nRegimens Table:');
        console.log(JSON.stringify(regimenData, null, 2));
        
    } catch (error) {
        console.error('Verification failed:', error.message);
    }
}

verifyBrajanas();