import { NextRequest, NextResponse } from 'next/server';
import { isValidCronRequest, logAgentAction } from '@/lib/cron-utils';

// The Auditor: QA Agent
// Schedule: Weekly (Monday @ 6:00 AM)
// Task: Verifies site health and checks for broken critical paths.

export async function GET(request: NextRequest) {
    if (!isValidCronRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ev-installers-app.vercel.app'; // Fallback for production
    const pathsToCheck = [
        '/',
        '/about',
        '/installers/tx/austin', // High traffic target
        '/admin/login'
    ];

    const results = [];
    let errorCount = 0;

    try {
        for (const path of pathsToCheck) {
            const url = `${baseUrl}${path}`;
            const startTime = Date.now();
            
            let status = 0;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                status = res.status;
            } catch (e) {
                status = 500;
            }
            
            const duration = Date.now() - startTime;
            const success = status >= 200 && status < 400;

            if (!success) errorCount++;

            results.push({
                path,
                status,
                duration_ms: duration,
                ok: success
            });
        }

        const logStatus = errorCount > 0 ? 'warning' : 'success';

        await logAgentAction('Auditor', 'health_check', logStatus, {
            base_url: baseUrl,
            results: results
        });

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error('Auditor Error:', error);
        await logAgentAction('Auditor', 'health_check', 'error', { error: error.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
