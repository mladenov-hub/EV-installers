import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}

interface EmailOptions {
    to: string | string[];
    template: 'lead_notification' | 'quote_confirmation' | 'installer_welcome' | 'follow_up';
    data: any;
}

// Professional Email Service Configuration
class EmailService {
    private transporter: any;
    private supabase: any;
    private fromEmail: string;
    private fromName: string;
    private domain: string;

    constructor() {
        this.domain = 'ev-installers-usa.com';
        this.fromEmail = `no-reply@${this.domain}`;
        this.fromName = 'EV Installers USA';

        // Configure email transporter based on environment
        if (process.env.SENDGRID_API_KEY) {
            // SendGrid Configuration (Recommended for production)
            this.transporter = nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY
                }
            });
        } else if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
            // Mailgun Configuration (Alternative)
            this.transporter = nodemailer.createTransport({
                host: 'smtp.mailgun.org',
                port: 587,
                secure: false,
                auth: {
                    user: `postmaster@${process.env.MAILGUN_DOMAIN}`,
                    pass: process.env.MAILGUN_API_KEY
                }
            });
        } else {
            // Fallback to SMTP (for development/testing)
            // Note: Update these credentials to use professional email service
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: { rejectUnauthorized: false }
            });

            // Override from email for development
            if (process.env.SMTP_USER) {
                this.fromEmail = process.env.SMTP_USER;
            }
        }

        // Initialize Supabase for logging
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
        if (supabaseUrl && supabaseKey) {
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }
    }

    // Email Templates
    private getTemplate(templateName: string, data: any): EmailTemplate {
        const templates: { [key: string]: (data: any) => EmailTemplate } = {
            lead_notification: (data) => ({
                subject: `New EV Charger Installation Lead - ${data.leadName}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                            .lead-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                            .lead-info h3 { color: #1e40af; margin-top: 0; }
                            .info-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
                            .info-row:last-child { border-bottom: none; }
                            .label { font-weight: bold; color: #666; display: inline-block; width: 150px; }
                            .value { color: #333; }
                            .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>New Installation Lead</h1>
                                <p>A potential customer is looking for EV charger installation</p>
                            </div>
                            <div class="content">
                                <div class="lead-info">
                                    <h3>Customer Information</h3>
                                    <div class="info-row">
                                        <span class="label">Name:</span>
                                        <span class="value">${data.leadName}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Email:</span>
                                        <span class="value">${data.leadEmail}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Phone:</span>
                                        <span class="value">${data.leadPhone || 'Not provided'}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Location:</span>
                                        <span class="value">${data.city}, ${data.state}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Project Timeline:</span>
                                        <span class="value">${data.timeline || 'Not specified'}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Property Type:</span>
                                        <span class="value">${data.propertyType || 'Not specified'}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Charger Type:</span>
                                        <span class="value">${data.chargerType || 'Not specified'}</span>
                                    </div>
                                </div>

                                <p><strong>Respond quickly!</strong> Customers typically choose the first installer who contacts them.</p>

                                <center>
                                    <a href="mailto:${data.leadEmail}" class="cta-button">Contact Customer</a>
                                </center>

                                <div class="footer">
                                    <p>This lead was generated through EV Installers USA</p>
                                    <p>© ${new Date().getFullYear()} EV Installers USA | <a href="https://ev-installers-usa.com">ev-installers-usa.com</a></p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
New EV Charger Installation Lead

Customer Information:
- Name: ${data.leadName}
- Email: ${data.leadEmail}
- Phone: ${data.leadPhone || 'Not provided'}
- Location: ${data.city}, ${data.state}
- Timeline: ${data.timeline || 'Not specified'}
- Property Type: ${data.propertyType || 'Not specified'}
- Charger Type: ${data.chargerType || 'Not specified'}

Respond quickly! Customers typically choose the first installer who contacts them.

Contact customer at: ${data.leadEmail}

This lead was generated through EV Installers USA
© ${new Date().getFullYear()} EV Installers USA | ev-installers-usa.com
                `
            }),

            quote_confirmation: (data) => ({
                subject: 'Your EV Charger Installation Quote Request Has Been Received',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
                            .next-steps { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
                            .installer-card { background: #f8f9fa; border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; margin: 10px 0; }
                            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Quote Request Received!</h1>
                                <p>We're connecting you with the best installers in ${data.city}</p>
                            </div>
                            <div class="content">
                                <p>Hi ${data.name},</p>

                                <p>Thank you for requesting a quote for EV charger installation. We've received your information and are sharing it with our top-rated verified installers in ${data.city}, ${data.state}.</p>

                                <div class="next-steps">
                                    <h3>What Happens Next?</h3>
                                    <ol>
                                        <li>Up to 3 verified installers will review your request</li>
                                        <li>You'll receive quotes directly from interested installers within 24-48 hours</li>
                                        <li>Compare quotes, reviews, and choose the best installer for your needs</li>
                                        <li>Schedule your installation at your convenience</li>
                                    </ol>
                                </div>

                                <h3>Your Request Details:</h3>
                                <ul>
                                    <li>Location: ${data.city}, ${data.state}</li>
                                    <li>Timeline: ${data.timeline || 'Flexible'}</li>
                                    <li>Property Type: ${data.propertyType || 'Not specified'}</li>
                                    <li>Charger Type: ${data.chargerType || 'To be determined'}</li>
                                </ul>

                                <h3>Tips for Choosing an Installer:</h3>
                                <ul>
                                    <li>✓ Verify their electrical license and insurance</li>
                                    <li>✓ Check customer reviews and ratings</li>
                                    <li>✓ Ask about warranty coverage</li>
                                    <li>✓ Confirm they're familiar with your EV model</li>
                                    <li>✓ Get everything in writing before work begins</li>
                                </ul>

                                <p>If you have any questions, feel free to reply to this email.</p>

                                <p>Best regards,<br>
                                The EV Installers USA Team</p>

                                <div class="footer">
                                    <p>© ${new Date().getFullYear()} EV Installers USA</p>
                                    <p><a href="https://ev-installers-usa.com">ev-installers-usa.com</a> | <a href="https://ev-installers-usa.com/privacy">Privacy Policy</a></p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
Hi ${data.name},

Thank you for requesting a quote for EV charger installation. We've received your information and are sharing it with our top-rated verified installers in ${data.city}, ${data.state}.

What Happens Next?
1. Up to 3 verified installers will review your request
2. You'll receive quotes directly from interested installers within 24-48 hours
3. Compare quotes, reviews, and choose the best installer
4. Schedule your installation at your convenience

Your Request Details:
- Location: ${data.city}, ${data.state}
- Timeline: ${data.timeline || 'Flexible'}
- Property Type: ${data.propertyType || 'Not specified'}
- Charger Type: ${data.chargerType || 'To be determined'}

Tips for Choosing an Installer:
✓ Verify their electrical license and insurance
✓ Check customer reviews and ratings
✓ Ask about warranty coverage
✓ Confirm they're familiar with your EV model
✓ Get everything in writing before work begins

If you have any questions, feel free to reply to this email.

Best regards,
The EV Installers USA Team

© ${new Date().getFullYear()} EV Installers USA
ev-installers-usa.com
                `
            }),

            installer_welcome: (data) => ({
                subject: 'Welcome to EV Installers USA - Start Receiving Leads Today',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h1>Welcome ${data.businessName}!</h1>
                        <p>Your business is now listed on EV Installers USA.</p>
                        <p>You'll receive email notifications when customers in ${data.city} are looking for EV charger installation.</p>
                        <p>Make sure to respond quickly to maximize your conversion rate!</p>
                        <p>Best regards,<br>EV Installers USA Team</p>
                    </body>
                    </html>
                `,
                text: `Welcome ${data.businessName}! Your business is now listed on EV Installers USA.`
            }),

            follow_up: (data) => ({
                subject: `Don't Miss Out - EV Charger Installers Standing By in ${data.city}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2>Hi ${data.name},</h2>
                        <p>We noticed you were looking for EV charger installation in ${data.city}.</p>
                        <p>Our verified installers are ready to help you get started with home charging.</p>
                        <p><a href="https://ev-installers-usa.com/installers/${data.state.toLowerCase()}/${data.city.toLowerCase().replace(/\s+/g, '-')}">View Available Installers</a></p>
                    </body>
                    </html>
                `,
                text: `Hi ${data.name}, we noticed you were looking for EV charger installation. Visit ev-installers-usa.com to get connected with verified installers.`
            })
        };

        const templateFunc = templates[templateName];
        if (!templateFunc) {
            throw new Error(`Template ${templateName} not found`);
        }

        return templateFunc(data);
    }

    // Send email method
    async send(options: EmailOptions): Promise<any> {
        try {
            const template = this.getTemplate(options.template, options.data);
            const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;

            const mailOptions = {
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to: to,
                subject: template.subject,
                text: template.text,
                html: template.html,
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                }
            };

            // Send the email
            const info = await this.transporter.sendMail(mailOptions);

            // Log to database if available
            if (this.supabase) {
                await this.supabase
                    .from('email_logs')
                    .insert({
                        recipient_email: to,
                        subject: template.subject,
                        template_used: options.template,
                        status: 'sent',
                        sent_at: new Date().toISOString(),
                        provider: this.getProviderName(),
                        provider_message_id: info.messageId,
                        provider_response: info
                    });
            }

            return { success: true, messageId: info.messageId };

        } catch (error: any) {
            console.error('Email send error:', error);

            // Log error to database if available
            if (this.supabase) {
                await this.supabase
                    .from('email_logs')
                    .insert({
                        recipient_email: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                        subject: 'Failed to send',
                        template_used: options.template,
                        status: 'failed',
                        error_message: error.message,
                        provider: this.getProviderName()
                    });
            }

            throw error;
        }
    }

    // Helper to identify which provider is being used
    private getProviderName(): string {
        if (process.env.SENDGRID_API_KEY) return 'sendgrid';
        if (process.env.MAILGUN_API_KEY) return 'mailgun';
        if (process.env.AWS_SES_REGION) return 'ses';
        return 'smtp';
    }

    // Verify email configuration
    async verify(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('Email service configured successfully');
            return true;
        } catch (error) {
            console.error('Email service verification failed:', error);
            return false;
        }
    }
}

export default new EmailService();