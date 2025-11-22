import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function verifyConnection() {
    console.log('🕵️ Auditor: Verifying Supabase Connection...');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Error: Missing Supabase credentials in .env.local');
        return;
    }

    // Log first few chars to verify it's loaded (without leaking full secret)
    console.log(`🔍 URL Loaded: ${supabaseUrl.substring(0, 15)}...`);

    if (!supabaseUrl.includes('.supabase.co')) {
        console.warn('⚠️ Warning: URL does not look like a standard Supabase API URL (usually ends in .supabase.co)');
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try to fetch data
        const { data, error } = await supabase.from('installers').select('count', { count: 'exact', head: true });

        if (error) {
            // If the error is about the table not existing, that means we CONNECTED successfully!
            if (error.code === '42P01') { // undefined_table
                console.log('✅ Success: Connected to Supabase! (Table "installers" does not exist yet, which is expected)');
                return;
            }
            console.error('❌ Connection Failed:', error.message);
        } else {
            console.log('✅ Success: Connected to Supabase!');
        }

    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

verifyConnection();
