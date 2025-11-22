import { NextRequest, NextResponse } from 'next/server';
import { isValidCronRequest, logAgentAction } from '@/lib/cron-utils';
import { createClient } from '@supabase/supabase-js';

// The Operator: Data Agent
// Schedule: Weekly (Sunday @ 3:00 AM)
// Task: Validates database integrity and generates data stats.

export async function GET(request: NextRequest) {
    if (!isValidCronRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Count Installers
        const { count: totalCount, error: countError } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // 2. Count Unverified
        const { count: unverifiedCount, error: unverifiedError } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true })
            .eq('verified', false);
        
        if (unverifiedError) throw unverifiedError;

        // 3. Check for Duplicates (Simple Name Check on a sample)
        // (Skipping complex logic for this cron, just reporting stats)

        const stats = {
            total_installers: totalCount,
            unverified: unverifiedCount,
            verified_percentage: totalCount ? Math.round(((totalCount - (unverifiedCount || 0)) / totalCount) * 100) : 0
        };

        await logAgentAction('Operator', 'data_audit', 'success', stats);

        return NextResponse.json({ success: true, stats });

    } catch (error: any) {
        console.error('Operator Error:', error);
        await logAgentAction('Operator', 'data_audit', 'error', { error: error.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
