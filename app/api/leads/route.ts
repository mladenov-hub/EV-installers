import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const leadSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    zipCode: z.string().min(5, "Invalid Zip Code"),
    projectType: z.enum(['install', 'repair']).optional(),
    vehicle: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Zod Validation
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: validation.error.format() },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Initialize Supabase Client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase credentials missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Insert into 'leads' table
        const { error } = await supabase
            .from('leads')
            .insert([{
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                zip_code: data.zipCode,
                project_type: data.projectType || 'install',
                vehicle: data.vehicle || null,
                city: data.city || null,
                state: data.state || null,
                created_at: new Date().toISOString(),
                status: 'new'
            }]);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Database Error: Failed to save lead.' },
                { status: 500 }
            );
        }

        // Send Email Notification (Best Effort)
        // We do not await this to ensure the user gets a fast response.
        // In Vercel Serverless, we might need to await if the function freezes immediately, 
        // but typically for a simple SMTP call, a short await is fine, or we accept the risk.
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (smtpUser && smtpPass) {
            // Wrap in a promise that we don't strictly block on for too long
            const sendEmail = async () => {
                try {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // use STARTTLS
                        auth: { user: smtpUser, pass: smtpPass },
                        tls: { rejectUnauthorized: false }
                    });

                    await transporter.sendMail({
                        from: `"EV Lead Bot" <${smtpUser}>`,
                        to: smtpUser, // Send to admin (self)
                        subject: `🔌 New Lead: ${data.name} in ${data.zipCode}`,
                        text: `New Lead Captured!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nZip: ${data.zipCode}\nVehicle: ${data.vehicle || 'N/A'}`
                    });
                    console.log(`📧 Notification email sent to ${smtpUser}`);
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                }
            };
            
            // Execute email send but catch any errors so they don't affect the response
            await sendEmail(); 
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Lead capture error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
