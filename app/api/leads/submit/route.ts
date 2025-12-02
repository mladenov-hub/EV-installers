import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.zipCode || !body.email || !body.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save to Supabase 'leads' table
        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    first_name: body.firstName,
                    last_name: body.lastName,
                    email: body.email,
                    phone: body.phone,
                    zip_code: body.zipCode,
                    project_type: body.projectType,
                    details: body.details,
                    city: body.city,
                    state: body.state,
                    source: 'website_form',
                    status: 'new'
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
        }

        // 2. TODO: Trigger n8n Webhook or Send to Angi API
        // await fetch('https://your-n8n-instance.com/webhook/new-lead', { ... })

        return NextResponse.json({ success: true, leadId: data[0].id });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
