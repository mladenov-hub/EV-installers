import { NextResponse } from 'next/server';

interface ErrorLog {
    timestamp: string;
    error: string;
    stack?: string;
    context?: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorHandler {
    private isDevelopment = process.env.NODE_ENV === 'development';

    // Log error to console and optionally to external service
    private logError(errorLog: ErrorLog) {
        // Always log to console in development
        if (this.isDevelopment) {
            console.error('🚨 Error:', errorLog);
        }

        // In production, send to error tracking service
        if (!this.isDevelopment) {
            // Send to Sentry, LogRocket, or similar
            this.sendToErrorTracker(errorLog);
        }

        // Log critical errors to database for admin review
        if (errorLog.severity === 'critical') {
            this.logToDatabase(errorLog);
        }
    }

    // Send errors to external tracking service
    private async sendToErrorTracker(errorLog: ErrorLog) {
        // Integrate with Sentry
        if (process.env.SENTRY_DSN) {
            try {
                // Sentry integration would go here
                // const Sentry = require('@sentry/node');
                // Sentry.captureException(errorLog);
            } catch (e) {
                console.error('Failed to send error to Sentry:', e);
            }
        }

        // Or use a simple webhook for Slack/Discord notifications
        if (process.env.ERROR_WEBHOOK_URL) {
            try {
                await fetch(process.env.ERROR_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `🚨 Error in EV Installers USA`,
                        attachments: [{
                            color: errorLog.severity === 'critical' ? 'danger' : 'warning',
                            fields: [
                                { title: 'Error', value: errorLog.error, short: false },
                                { title: 'Timestamp', value: errorLog.timestamp, short: true },
                                { title: 'Severity', value: errorLog.severity, short: true },
                                { title: 'Context', value: JSON.stringify(errorLog.context), short: false }
                            ]
                        }]
                    })
                });
            } catch (e) {
                console.error('Failed to send error webhook:', e);
            }
        }
    }

    // Log critical errors to database
    private async logToDatabase(errorLog: ErrorLog) {
        try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_KEY!
            );

            await supabase
                .from('agent_logs')
                .insert({
                    agent: 'ErrorHandler',
                    action: 'critical_error',
                    status: 'error',
                    message: errorLog.error,
                    metadata: {
                        stack: errorLog.stack,
                        context: errorLog.context,
                        severity: errorLog.severity
                    }
                });
        } catch (e) {
            console.error('Failed to log error to database:', e);
        }
    }

    // Handle API errors with proper response
    handleApiError(error: any, context?: any): NextResponse {
        const errorMessage = error.message || 'An unexpected error occurred';
        const statusCode = error.statusCode || 500;
        const severity = this.getSeverity(statusCode);

        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            error: errorMessage,
            stack: error.stack,
            context,
            severity
        };

        this.logError(errorLog);

        // Return user-friendly error response
        const response = {
            error: this.isDevelopment ? errorMessage : this.getUserFriendlyMessage(statusCode),
            ...(this.isDevelopment && { stack: error.stack }),
            timestamp: errorLog.timestamp,
            requestId: this.generateRequestId()
        };

        return NextResponse.json(response, { status: statusCode });
    }

    // Handle async errors in API routes
    asyncHandler(fn: Function) {
        return async (req: Request, ...args: any[]) => {
            try {
                return await fn(req, ...args);
            } catch (error) {
                return this.handleApiError(error, { url: req.url, method: req.method });
            }
        };
    }

    // Determine error severity based on status code
    private getSeverity(statusCode: number): ErrorLog['severity'] {
        if (statusCode >= 500) return 'critical';
        if (statusCode >= 400) return 'medium';
        return 'low';
    }

    // Get user-friendly error messages
    private getUserFriendlyMessage(statusCode: number): string {
        const messages: Record<number, string> = {
            400: 'Invalid request. Please check your input and try again.',
            401: 'Authentication required. Please log in and try again.',
            403: 'You do not have permission to perform this action.',
            404: 'The requested resource was not found.',
            409: 'A conflict occurred. The resource may already exist.',
            429: 'Too many requests. Please slow down and try again later.',
            500: 'An internal server error occurred. Our team has been notified.',
            502: 'Bad gateway. Please try again in a few moments.',
            503: 'Service temporarily unavailable. Please try again later.'
        };

        return messages[statusCode] || 'An unexpected error occurred. Please try again.';
    }

    // Generate unique request ID for tracking
    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Validate required environment variables
    validateEnvironment(): void {
        const required = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'GOOGLE_PLACES_API_KEY'
        ];

        const missing = required.filter(key => !process.env[key]);

        if (missing.length > 0) {
            const error = `Missing required environment variables: ${missing.join(', ')}`;
            this.logError({
                timestamp: new Date().toISOString(),
                error,
                severity: 'critical',
                context: { missing }
            });

            if (this.isDevelopment) {
                throw new Error(error);
            }
        }
    }

    // Monitor API health
    async checkHealth(): Promise<{ status: string; services: Record<string, boolean> }> {
        const services: Record<string, boolean> = {};

        // Check Supabase connection
        try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { error } = await supabase.from('installers').select('id').limit(1);
            services.database = !error;
        } catch {
            services.database = false;
        }

        // Check Google Places API
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=test&inputtype=textquery&key=${process.env.GOOGLE_PLACES_API_KEY}`
            );
            services.googlePlaces = response.ok;
        } catch {
            services.googlePlaces = false;
        }

        // Check email service
        try {
            const emailService = require('./email-service').default;
            services.email = await emailService.verify();
        } catch {
            services.email = false;
        }

        const allHealthy = Object.values(services).every(status => status);

        return {
            status: allHealthy ? 'healthy' : 'degraded',
            services
        };
    }
}

export default new ErrorHandler();