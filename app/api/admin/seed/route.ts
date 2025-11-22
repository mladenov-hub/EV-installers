import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// The Operator (DeepSeek-R1) - Remote Seeder
// Endpoint: POST /api/admin/seed
// Auth: Requires { apiKey: ADMIN_PASSWORD } in body

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (apiKey !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Initialize Supabase (Service Role for Writes)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Locate CSV File
        const csvPath = path.join(process.cwd(), 'data', 'installers.csv');
        
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: 'CSV file not found at ' + csvPath }, { status: 404 });
        }

        // Read & Parse CSV
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`Found ${records.length} records in CSV.`);

        // Transform Data
        const installers = records.map((record: any) => ({
            business_name: record.business_name,
            license_number: record.license_number || 'Pending',
            phone: record.phone,
            city: record.city,
            state: record.state,
            zip_code: record.zip_code,
            utility_provider: record.utility_provider || 'Unknown',
            services: record.services || 'EV Charging',
            verified: record.verified === 'True' || record.verified === 'true',
            created_at: new Date().toISOString()
        }));

        // Batch Insert (Upsert to avoid duplicates if running multiple times)
        // We assume 'business_name' + 'zip_code' might be a unique constraint, 
        // but for now we just insert. Better to truncate first if re-seeding.
        
        // Option: Clear table first? (Uncomment if desired)
        // await supabase.from('installers').delete().neq('id', 0);

        const { error } = await supabase.from('installers').insert(installers);

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully seeded ${installers.length} installers.`,
            count: installers.length
        });

    } catch (error: any) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
