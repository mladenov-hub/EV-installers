import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Force Anon Key

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
    console.log('Checking data with ANON KEY...');

    const { data, error } = await supabase
        .from('installers')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error with Anon Key:', error);
    } else {
        console.log(`Success! Found ${data?.length} records.`);
    }
}

checkRLS();
