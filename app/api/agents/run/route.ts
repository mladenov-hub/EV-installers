import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';

const execAsync = promisify(exec);

// Initialize Supabase (Server-side)
// Moved inside handler to prevent build-time crash if env vars are missing

export async function POST(request: Request) {
    try {
        const { agentId, apiKey } = await request.json();

        // Security Check
        const validKey = process.env.ADMIN_PASSWORD;
        if (!apiKey || apiKey !== validKey) {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid API Key' },
                { status: 401 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase Credentials in API Route");
             return NextResponse.json(
                { error: 'Server Configuration Error: Missing DB Credentials' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        let command = '';

        // Map agent IDs to scripts
        switch (agentId) {
            case 'operator':
                // Run scraper and then seeder
                command = 'python scripts/operator/scraper.py && npx tsx scripts/seed-installers.ts';
                break;
            case 'auditor':
                command = 'npx tsx scripts/auditor/seo_check.ts';
                break;
            case 'strategist':
                command = 'npx tsx scripts/strategist/content_generator.ts';
                break;
            case 'liaison':
                command = 'npx tsx scripts/liaison/lead_router.ts';
                break;
            case 'promoter':
                command = 'npx tsx scripts/promoter/outreach.ts';
                break;
            case 'analyst':
                command = 'npx tsx scripts/analyst/optimizer.ts';
                break;
            default:
                return NextResponse.json({ error: 'Unknown agent' }, { status: 400 });
        }

        // Log Start
        await supabase.from('agent_logs').insert([{
            agent_id: agentId,
            action: 'Execution',
            message: `Started executing ${agentId} sequence...`,
            status: 'running'
        }]);

        // Execute the command
        // Note: In a production serverless environment (Vercel), running long scripts like this 
        // might time out or be restricted. This is primarily for local dev or a VPS.
        // For Vercel, we would trigger a background job (e.g., Inngest/Trigger.dev).
        console.log(`🤖 Executing Agent: ${agentId} with command: ${command}`);

        const { stdout, stderr } = await execAsync(command);

        console.log('Stdout:', stdout);
        if (stderr) console.error('Stderr:', stderr);

        // Log Success
        await supabase.from('agent_logs').insert([{
            agent_id: agentId,
            action: 'Completion',
            message: `Successfully executed. Output: ${stdout.substring(0, 100)}...`,
            status: 'success'
        }]);

        return NextResponse.json({ success: true, output: stdout });

    } catch (error) {
        console.error('Agent execution failed:', error);

        // Log Error
        // We need to parse the body to get agentId if possible, but it's tricky in catch block
        // So we'll skip logging the specific agent ID error for now to keep it simple

        return NextResponse.json(
            { error: 'Agent execution failed', details: String(error) },
            { status: 500 }
        );
    }
}
