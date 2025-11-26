import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import emailService from '@/lib/email-service';

const leadSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    zipCode: z.string().min(5, "Invalid Zip Code"),
    projectType: z.enum(['install', 'repair']).optional(),
    vehicle: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    timeline: z.enum(['immediate', 'within_month', 'within_3months', 'planning']).optional(),
    propertyType: z.enum(['single_family', 'multi_family', 'commercial']).optional(),
    chargerType: z.enum(['level2', 'tesla', 'both', 'unsure']).optional(),
    electricalPanelUpgrade: z.boolean().optional(),
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

        // Get user's IP and user agent for tracking
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip');
        const userAgent = request.headers.get('user-agent');

        // Insert into new 'leads' table with enhanced schema
        const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .insert([{
                full_name: data.name,
                email: data.email,
                phone: data.phone || null,
                zip_code: data.zipCode,
                city: data.city || null,
                state: data.state || null,
                project_timeline: data.timeline || 'planning',
                property_type: data.propertyType || 'single_family',
                charger_type: data.chargerType || 'unsure',
                electrical_panel_upgrade: data.electricalPanelUpgrade || false,
                ip_address: ip || null,
                user_agent: userAgent || null,
                source: 'website',
                status: 'new',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (leadError) {
            console.error('Supabase error:', leadError);
            return NextResponse.json(
                { error: 'Database Error: Failed to save lead.' },
                { status: 500 }
            );
        }

        // Find and notify matching installers
        if (data.city && data.state && leadData) {
            // Get matching installers from the database
            const { data: installers } = await supabase
                .from('installers')
                .select('id, business_name, email, phone')
                .ilike('city', data.city)
                .eq('state', data.state.toUpperCase())
                .eq('active', true)
                .eq('verified', true)
                .order('featured', { ascending: false })
                .order('rating', { ascending: false })
                .limit(3);

            if (installers && installers.length > 0) {
                // Update lead with assigned installers
                const installerIds = installers.map(i => i.id);
                await supabase
                    .from('leads')
                    .update({ assigned_to: installerIds })
                    .eq('id', leadData.id);

                // Send notification emails to installers
                for (const installer of installers) {
                    if (installer.email) {
                        try {
                            await emailService.send({
                                to: installer.email,
                                template: 'lead_notification',
                                data: {
                                    leadName: data.name,
                                    leadEmail: data.email,
                                    leadPhone: data.phone,
                                    city: data.city,
                                    state: data.state,
                                    timeline: data.timeline,
                                    propertyType: data.propertyType,
                                    chargerType: data.chargerType,
                                    installerName: installer.business_name
                                }
                            });
                            console.log(`Lead notification sent to ${installer.business_name}`);
                        } catch (emailError) {
                            console.error(`Failed to notify installer ${installer.business_name}:`, emailError);
                        }
                    }
                }
            }
        }

        // Send confirmation email to the lead
        try {
            await emailService.send({
                to: data.email,
                template: 'quote_confirmation',
                data: {
                    name: data.name,
                    city: data.city || 'your area',
                    state: data.state || '',
                    timeline: data.timeline,
                    propertyType: data.propertyType,
                    chargerType: data.chargerType
                }
            });
            console.log(`Confirmation email sent to ${data.email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Your quote request has been submitted successfully!'
        });

    } catch (error) {
        console.error('Lead capture error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
