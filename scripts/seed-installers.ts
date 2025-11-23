import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// The Operator (DeepSeek-R1) -> Handover to Architect
// Task: Normalize data and prepare for Supabase (Real Data)

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const DATA_FILE = path.join(process.cwd(), 'data', 'real_installers_la.csv');

interface Installer {
    business_name: string;
    license_number: string;
    phone: string;
    city: string;
    state: string;
    zip_code: string;
    utility_provider: string;
    services: string;
    verified: string; // CSV reads as string
    website?: string;
    starting_price?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInstallers() {
    console.log('🌱 Seeding Process Initiated (Real Data)...');
    console.log(`📂 Reading data from: ${DATA_FILE}`);

    const installers: Installer[] = [];

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Error: Data file not found.');
        return;
    }

    await new Promise((resolve, reject) => {
        fs.createReadStream(DATA_FILE)
            .pipe(csv())
            .on('data', (data) => installers.push(data))
            .on('end', () => {
                console.log(`📊 Found ${installers.length} raw records.`);
                resolve(null);
            })
            .on('error', reject);
    });

    await normalizeAndValidate(installers);
}

async function normalizeAndValidate(data: Installer[]) {
    console.log('🧹 Normalizing data...');

    const validRecords = data.filter(record => {
        if (!record.business_name || !record.city) return false;
        return true;
    }).map(record => ({
        business_name: record.business_name,
        license_number: record.license_number,
        phone: record.phone,
        city: record.city,
        state: record.state,
        zip_code: record.zip_code,
        utility_provider: record.utility_provider,
        services: record.services,
        verified: record.verified === 'True' || record.verified === 'true',
        website: record.website || null,
        starting_price: record.starting_price ? parseFloat(record.starting_price) : null
    }));

    console.log(`✅ Validated ${validRecords.length} records.`);

    // Clean up existing data for this city to avoid duplicates
    if (validRecords.length > 0) {
        const city = validRecords[0].city;
        console.log(`🗑️  Cleaning up existing records for ${city}...`);
        const { error: deleteError } = await supabase
            .from('installers')
            .delete()
            .eq('city', city);

        if (deleteError) {
            console.error('Error deleting old records:', deleteError);
        }
    }

    console.log('🔌 Connecting to Supabase...');

    const { error } = await supabase.from('installers').insert(validRecords);

    if (error) {
        console.error('❌ Error inserting data:', error);
    } else {
        console.log('🚀 Success! Real data inserted into Supabase.');
    }
}

seedInstallers();
