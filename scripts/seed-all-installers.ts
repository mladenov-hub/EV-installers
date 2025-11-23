import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const DATA_FILE = path.join(process.cwd(), 'data', 'installers.csv');

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
    rating?: number;
    review_count?: number;
    address?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAllInstallers() {
    console.log('🌱 Seeding Process Initiated (All Cities)...');
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

    await normalizeAndInsert(installers);
}

async function normalizeAndInsert(data: Installer[]) {
    console.log('🧹 Normalizing data...');

    const validRecords = data.filter(record => {
        if (!record.business_name || !record.city) return false;
        return true;
    }).map(record => ({
        business_name: record.business_name.trim(),
        license_number: record.license_number ? record.license_number.trim() : null,
        phone: record.phone ? record.phone.trim() : null,
        city: record.city.trim(),
        state: record.state ? record.state.trim() : null,
        zip_code: record.zip_code ? record.zip_code.trim() : null,
        utility_provider: record.utility_provider ? record.utility_provider.trim() : null,
        services: record.services ? record.services.trim() : null,
        verified: record.verified === 'True' || record.verified === 'true'
        // Temporarily commented out until migration is applied:
        // website: record.website || null,
        // rating: record.rating ? parseFloat(record.rating.toString()) : null,
        // review_count: record.review_count ? parseInt(record.review_count.toString()) : null,
        // address: record.address || null
    }));

    console.log(`✅ Validated ${validRecords.length} records.`);

    // Group by city to show what we're inserting
    const cityCounts = validRecords.reduce((acc, record) => {
        acc[record.city] = (acc[record.city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('📍 Cities and installer counts:');
    Object.entries(cityCounts).forEach(([city, count]) => {
        console.log(`   - ${city}: ${count} installers`);
    });

    // Clean up ALL existing installer data
    console.log('🗑️  Cleaning up ALL existing installer records...');
    const { error: deleteError } = await supabase
        .from('installers')
        .delete()
        .neq('id', 0); // Delete all records (neq with 0 matches all)

    if (deleteError) {
        console.error('Error deleting old records:', deleteError);
        return;
    }

    console.log('🔌 Inserting new data into Supabase...');

    // Insert in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < validRecords.length; i += batchSize) {
        const batch = validRecords.slice(i, i + batchSize);
        const { error } = await supabase.from('installers').insert(batch);

        if (error) {
            console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error);
        } else {
            console.log(`✅ Batch ${i / batchSize + 1} inserted (${batch.length} records)`);
        }
    }

    // Verify the data was inserted
    const { data: count, error: countError } = await supabase
        .from('installers')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting records:', countError);
    } else {
        console.log(`🚀 Success! Total installers in database: ${count}`);
    }

    // Specifically check San Francisco
    const { data: sfData, error: sfError } = await supabase
        .from('installers')
        .select('*')
        .ilike('city', 'san francisco');

    if (sfError) {
        console.error('Error checking San Francisco data:', sfError);
    } else {
        console.log(`🌉 San Francisco installers in database: ${sfData?.length || 0}`);
    }
}

seedAllInstallers();