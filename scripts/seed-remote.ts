import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedRemote() {
    console.log("🌱 Starting Local-to-Remote Seeding...");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Must use Service Key

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing Supabase Credentials in .env.local");
        console.error("   Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set.");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read CSV
    const csvPath = path.join(process.cwd(), 'data', 'installers.csv');
    if (!fs.existsSync(csvPath)) {
        console.error("❌ CSV file not found at:", csvPath);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log(`📊 Found ${records.length} records to insert.`);

    // Transform
    const installers = records.map((record: any) => ({
        business_name: record.business_name,
        license_number: record.license_number || 'Pending',
        phone: record.phone,
        city: record.city, // The CSV has "San Francisco" (Title Case)
        state: record.state,
        zip_code: record.zip_code,
        utility_provider: record.utility_provider || 'Unknown',
        services: record.services || 'EV Charging',
        verified: record.verified === 'True' || record.verified === 'true',
        created_at: new Date().toISOString()
    }));

    // Insert
    const { error, count } = await supabase.from('installers').insert(installers).select('*', { count: 'exact' });

    if (error) {
        console.error("❌ Supabase Insert Error:", error);
    } else {
        console.log(`✅ Successfully inserted ${installers.length} records!`);
    }
}

seedRemote();
