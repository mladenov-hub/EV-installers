import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to validate Vercel Cron requests
export function isValidCronRequest(request: NextRequest): boolean {
    // Check for Authorization header (Bearer CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
        return true;
    }

    // Allow localhost for testing if strictly necessary, but prefer secret
    // Also allow Vercel's internal signature if needed, but Bearer is standard for user-defined crons
    return false;
}

// Helper to log agent actions to Supabase
export async function logAgentAction(
    agentName: string,
    actionType: string,
    status: 'success' | 'error' | 'warning' | 'info',
    details: any
) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // Must use Service Key for writing logs reliably

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials for logging');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { error } = await supabase.from('agent_logs').insert({
            agent_name: agentName,
            action_type: actionType,
            status: status,
            details: details
        });

        if (error) {
            console.error('Failed to write agent log:', error);
        }
    } catch (e) {
        console.error('Exception writing agent log:', e);
    }
}
