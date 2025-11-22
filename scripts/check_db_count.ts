import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Credentials missing');
    process.exit(1);
}

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 5) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount() {
    console.log('Checking database connection...');

    // ...
    const { count, error } = await supabase
        .from('installers')
        .select('*', { count: 'exact', head: true });

    let output = '';
    if (error) {
        output += `❌ Select Error: ${JSON.stringify(error, null, 2)}\n`;
    } else {
        output += `✅ Total Installers in DB: ${count}\n`;
    }

    if (count === 0 || count === null) {
        output += 'Attempting test insert...\n';
        const { error: insertError } = await supabase
            .from('installers')
            .insert([{
                business_name: 'Test Electric',
                city: 'Test City',
                state: 'TS',
                zip_code: '00000',
                verified: false
            }]);

        if (insertError) {
            output += `❌ Insert Error: ${JSON.stringify(insertError, null, 2)}\n`;
        } else {
            output += '✅ Test insert successful.\n';
        }
    }

    fs.writeFileSync('db_status.txt', output);
}

checkCount();
