import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking data for Los Angeles, CA...');

    // Check exact match
    const { data: exact, error: exactError } = await supabase
        .from('installers')
        .select('*')
        .eq('city', 'Los Angeles')
        .eq('state', 'CA');

    if (exactError) console.error('Exact match error:', exactError);
    console.log(`Exact match count: ${exact?.length || 0}`);

    // Check case-insensitive
    const { data: ilike, error: ilikeError } = await supabase
        .from('installers')
        .select('*')
        .ilike('city', 'los angeles')
        .ilike('state', 'ca');

    if (ilikeError) console.error('ILike match error:', ilikeError);
    console.log(`Case-insensitive count: ${ilike?.length || 0}`);

    // Check all installers to see what cities exist
    const { data: all, error: allError } = await supabase
        .from('installers')
        .select('city, state')
        .limit(10);

    if (allError) console.error('Fetch all error:', allError);
    console.log('Sample data in DB:', all);
}

checkData();
