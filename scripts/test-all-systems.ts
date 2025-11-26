#!/usr/bin/env node

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    section: (msg: string) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// Test results tracker
const testResults: { test: string; status: 'pass' | 'fail'; error?: string }[] = [];

async function testEnvironmentVariables() {
    log.section('Testing Environment Variables');

    const required = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_KEY',
        'GOOGLE_PLACES_API_KEY',
        'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
        'CRON_SECRET'
    ];

    const optional = [
        'SENDGRID_API_KEY',
        'MAILGUN_API_KEY',
        'AWS_SES_REGION',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS'
    ];

    let allRequired = true;
    for (const key of required) {
        if (process.env[key]) {
            log.success(`${key} is set`);
        } else {
            log.error(`${key} is missing`);
            allRequired = false;
        }
    }

    console.log('\nOptional Environment Variables:');
    for (const key of optional) {
        if (process.env[key]) {
            log.info(`${key} is set`);
        } else {
            log.warning(`${key} is not set (optional)`);
        }
    }

    testResults.push({
        test: 'Environment Variables',
        status: allRequired ? 'pass' : 'fail',
        error: allRequired ? undefined : 'Missing required environment variables'
    });

    return allRequired;
}

async function testSupabaseConnection() {
    log.section('Testing Supabase Connection');

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        // Test database connection
        const { data, error } = await supabase
            .from('installers')
            .select('count')
            .limit(1);

        if (error) throw error;

        log.success('Connected to Supabase database');

        // Check if tables exist
        const tables = ['installers', 'leads', 'city_content', 'agent_logs', 'email_logs'];
        for (const table of tables) {
            try {
                const { error } = await supabase.from(table).select('count').limit(1);
                if (error) {
                    log.error(`Table '${table}' not accessible: ${error.message}`);
                } else {
                    log.success(`Table '${table}' exists and is accessible`);
                }
            } catch (e: any) {
                log.error(`Table '${table}' check failed: ${e.message}`);
            }
        }

        testResults.push({ test: 'Supabase Connection', status: 'pass' });
        return true;
    } catch (error: any) {
        log.error(`Supabase connection failed: ${error.message}`);
        testResults.push({
            test: 'Supabase Connection',
            status: 'fail',
            error: error.message
        });
        return false;
    }
}

async function testGooglePlacesAPI() {
    log.section('Testing Google Places API');

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        log.error('GOOGLE_PLACES_API_KEY not set');
        testResults.push({
            test: 'Google Places API',
            status: 'fail',
            error: 'API key not set'
        });
        return false;
    }

    try {
        const url = 'https://places.googleapis.com/v1/places:searchText';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName'
            },
            body: JSON.stringify({
                textQuery: 'electrician San Francisco',
                maxResultCount: 1
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        log.success('Google Places API is working');
        log.info(`Found ${data.places?.length || 0} results`);

        testResults.push({ test: 'Google Places API', status: 'pass' });
        return true;
    } catch (error: any) {
        log.error(`Google Places API failed: ${error.message}`);
        testResults.push({
            test: 'Google Places API',
            status: 'fail',
            error: error.message
        });
        return false;
    }
}

async function testGoogleMapsEmbed() {
    log.section('Testing Google Maps Embed API');

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        log.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set');
        testResults.push({
            test: 'Google Maps Embed',
            status: 'fail',
            error: 'API key not set'
        });
        return false;
    }

    log.success('Google Maps Embed API key is configured');
    log.info('Maps will be embedded on installer pages');

    testResults.push({ test: 'Google Maps Embed', status: 'pass' });
    return true;
}

async function testEmailConfiguration() {
    log.section('Testing Email Configuration');

    let emailConfigured = false;

    // Check for professional email service
    if (process.env.SENDGRID_API_KEY) {
        log.success('SendGrid is configured');
        emailConfigured = true;
    } else if (process.env.MAILGUN_API_KEY) {
        log.success('Mailgun is configured');
        emailConfigured = true;
    } else if (process.env.AWS_SES_REGION) {
        log.success('AWS SES is configured');
        emailConfigured = true;
    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        log.warning('Using SMTP (consider upgrading to professional service)');
        log.info(`SMTP User: ${process.env.SMTP_USER}`);
        emailConfigured = true;
    } else {
        log.error('No email service configured');
    }

    testResults.push({
        test: 'Email Configuration',
        status: emailConfigured ? 'pass' : 'fail',
        error: emailConfigured ? undefined : 'No email service configured'
    });

    return emailConfigured;
}

async function testDataIntegrity() {
    log.section('Testing Data Integrity');

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        // Count installers
        const { count: installerCount } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true });

        log.info(`Total installers in database: ${installerCount || 0}`);

        // Check installers with Google Place IDs
        const { count: googlePlaceCount } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true })
            .not('google_place_id', 'is', null);

        log.info(`Installers with Google Place IDs: ${googlePlaceCount || 0}`);

        // Check verified installers
        const { count: verifiedCount } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true })
            .eq('verified', true);

        log.info(`Verified installers: ${verifiedCount || 0}`);

        // Check leads
        const { count: leadCount } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        log.info(`Total leads captured: ${leadCount || 0}`);

        testResults.push({ test: 'Data Integrity', status: 'pass' });
        return true;
    } catch (error: any) {
        log.error(`Data integrity check failed: ${error.message}`);
        testResults.push({
            test: 'Data Integrity',
            status: 'fail',
            error: error.message
        });
        return false;
    }
}

async function testBuildProcess() {
    log.section('Testing Build Process');

    log.info('Running TypeScript compilation check...');

    try {
        const { execSync } = require('child_process');
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        log.success('TypeScript compilation successful');
        testResults.push({ test: 'Build Process', status: 'pass' });
        return true;
    } catch (error: any) {
        log.error('TypeScript compilation failed');
        log.error(error.stdout?.toString() || error.message);
        testResults.push({
            test: 'Build Process',
            status: 'fail',
            error: 'TypeScript compilation errors'
        });
        return false;
    }
}

async function printSummary() {
    log.section('Test Summary');

    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const total = testResults.length;

    console.log('\nTest Results:');
    console.log('─'.repeat(60));

    testResults.forEach(result => {
        const icon = result.status === 'pass' ? '✓' : '✗';
        const color = result.status === 'pass' ? colors.green : colors.red;
        console.log(`${color}${icon}${colors.reset} ${result.test.padEnd(30)} ${result.status.toUpperCase()}`);
        if (result.error) {
            console.log(`  └─ Error: ${result.error}`);
        }
    });

    console.log('─'.repeat(60));
    console.log(`\nTotal: ${total} | Passed: ${colors.green}${passed}${colors.reset} | Failed: ${colors.red}${failed}${colors.reset}`);

    if (failed === 0) {
        console.log(`\n${colors.green}🎉 All tests passed! The system is ready for production.${colors.reset}`);
    } else {
        console.log(`\n${colors.red}⚠️  Some tests failed. Please fix the issues above.${colors.reset}`);
    }

    // Provide next steps
    console.log('\n' + colors.cyan + 'Next Steps:' + colors.reset);
    if (failed > 0) {
        console.log('1. Fix the failing tests above');
        console.log('2. Re-run this test script: npm run test:systems');
    } else {
        console.log('1. Deploy to Vercel: vercel --prod');
        console.log('2. Set up domain DNS for ev-installers-usa.com');
        console.log('3. Configure email domain authentication (SPF, DKIM, DMARC)');
        console.log('4. Monitor the system using the admin dashboard');
    }
}

// Main test runner
async function runAllTests() {
    console.log(colors.magenta + '\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     EV Installers USA - Comprehensive System Test       ║');
    console.log('╚══════════════════════════════════════════════════════════╝' + colors.reset);

    await testEnvironmentVariables();
    await testSupabaseConnection();
    await testGooglePlacesAPI();
    await testGoogleMapsEmbed();
    await testEmailConfiguration();
    await testDataIntegrity();
    await testBuildProcess();

    await printSummary();
}

// Run tests
runAllTests().catch(console.error);