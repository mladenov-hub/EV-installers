import { NextRequest, NextResponse } from 'next/server';
import { isValidCronRequest, logAgentAction } from '@/lib/cron-utils';
import nodemailer from 'nodemailer';

// The Promoter: Outreach Agent
// Schedule: Daily @ 10:00 AM
// Task: Simulates outreach to directories or blog owners.

export async function GET(request: NextRequest) {
    // 1. Security Check
    if (!isValidCronRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const actions = [];
    const logs = [];

    try {
        // 2. Define Targets (In a real app, fetch from DB)
        const targets = [
            { name: "Yelp", type: "Directory", status: "Pending" },
            { name: "Angi", type: "Directory", status: "Pending" },
            { name: "Green Tech Blog", type: "Blog", email: "editor@greentech.example.com" }
        ];

        // 3. Execute "Work" (Simulated Batch Processing)
        // We process 1 item per run to avoid timeouts in this demo, or a small batch.
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        actions.push(`Selected Target: ${target.name} (${target.type})`);

        if (target.type === 'Directory') {
            // Simulate Directory Submission
            await new Promise(resolve => setTimeout(resolve, 1000)); // Fake work
            actions.push(`Submitted to ${target.name} successfully.`);
        } else {
            // Simulate Email Draft
            const emailDraft = `Subject: Collab?\n\nHi ${target.name}, love your work...`;
            actions.push(`Drafted email to ${target.email}.`);
            
            // Optional: Send real email to admin as proof
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                 const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
                    tls: { rejectUnauthorized: false }
                });
                // Send to self/admin instead of real target for safety
                await transporter.sendMail({
                    from: `"Promoter Agent" <${process.env.SMTP_USER}>`,
                    to: process.env.SMTP_USER, 
                    subject: `[Agent Report] Outreach to ${target.name}`,
                    text: emailDraft
                });
                actions.push("Sent copy to Admin.");
            }
        }

        // 4. Log Success
        await logAgentAction('Promoter', 'outreach_batch', 'success', {
            items_processed: 1,
            actions: actions
        });

        return NextResponse.json({ success: true, actions });

    } catch (error: any) {
        console.error('Promoter Error:', error); 
        
        // 5. Log Error
        await logAgentAction('Promoter', 'outreach_batch', 'error', {
            error: error.message
        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
