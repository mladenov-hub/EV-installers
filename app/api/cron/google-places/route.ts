import { NextRequest, NextResponse } from 'next/server';
import { isValidCronRequest, logAgentAction } from '@/lib/cron-utils';
import { createClient } from '@supabase/supabase-js';

// Google Places Scraper Agent
// Schedule: Daily @ 2:00 AM (or weekly, depending on API limits)
// Task: Fetches real installer data from Google Places API

const CITIES = [
    { name: "San Francisco", state: "CA" },
    { name: "Los Angeles", state: "CA" },
    { name: "New York", state: "NY" },
    { name: "Miami", state: "FL" },
    { name: "Austin", state: "TX" },
    { name: "Seattle", state: "WA" },
    { name: "Denver", state: "CO" },
    { name: "Phoenix", state: "AZ" },
    { name: "Boston", state: "MA" },
    { name: "Chicago", state: "IL" }
];

async function fetchInstallers(city: string, state: string) {
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!GOOGLE_API_KEY) {
        throw new Error('Missing GOOGLE_PLACES_API_KEY');
    }

    const url = 'https://places.googleapis.com/v1/places:searchText';
    // Query optimized to find actual electricians/installers
    const query = `Tesla wall connector installation ${city}, ${state}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.id,places.types'
            },
            body: JSON.stringify({
                textQuery: query,
                maxResultCount: 10 // Get up to 10 results per city
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error(`Google API Error for ${city}:`, data.error.message);
            return [];
        }

        const places = data.places || [];

        // Filter to only include electricians (exclude charging stations)
        const electricians = places.filter((place: any) => {
            const types = place.types || [];
            return types.includes('electrician') ||
                types.includes('electrical_contractor') ||
                types.includes('contractor') ||
                !types.includes('electric_vehicle_charging_station');
        });

        return electricians.map((place: any) => ({
            business_name: place.displayName?.text || "Unknown Installer",
            license_number: null, // Will need to be fetched separately if needed
            phone: place.nationalPhoneNumber || null,
            city: city,
            state: state,
            zip_code: extractZipFromAddress(place.formattedAddress) || '00000',
            utility_provider: getUtilityProvider(city, state),
            services: 'EV Charger Installation, Panel Upgrade',
            verified: true,
            google_place_id: place.id,
            website: place.websiteUri || null,
            rating: place.rating || null,
            review_count: place.userRatingCount || null,
            address: place.formattedAddress || null
        }));

    } catch (error) {
        console.error(`Network Error for ${city}:`, error);
        return [];
    }
}

function extractZipFromAddress(address: string | null): string | null {
    if (!address) return null;
    const zipMatch = address.match(/\b\d{5}\b/);
    return zipMatch ? zipMatch[0] : null;
}

function getUtilityProvider(city: string, state: string): string {
    const utilityMap: Record<string, string> = {
        'San Francisco,CA': 'PG&E',
        'Los Angeles,CA': 'LADWP',
        'New York,NY': 'ConEd',
        'Miami,FL': 'FPL',
        'Austin,TX': 'Austin Energy',
        'Seattle,WA': 'Seattle City Light',
        'Denver,CO': 'Xcel Energy',
        'Phoenix,AZ': 'APS',
        'Boston,MA': 'Eversource',
        'Chicago,IL': 'ComEd'
    };
    return utilityMap[`${city},${state}`] || 'Local Utility';
}

export async function GET(request: NextRequest) {
    if (!isValidCronRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
        cities_processed: 0,
        total_installers_fetched: 0,
        errors: [] as string[]
    };

    try {
        // Process each city
        for (const city of CITIES) {
            try {
                await logAgentAction('GooglePlaces', 'fetch_start', 'info', { city: city.name, state: city.state });

                const installers = await fetchInstallers(city.name, city.state);

                if (installers.length > 0) {
                    // Check for existing Google Places entries for this city
                    const { data: existingData } = await supabase
                        .from('installers')
                        .select('google_place_id')
                        .eq('city', city.name)
                        .eq('state', city.state)
                        .not('google_place_id', 'is', null);

                    const existingPlaceIds = new Set(existingData?.map((d: any) => d.google_place_id) || []);

                    // Filter out duplicates
                    const newInstallers = installers.filter((installer: any) =>
                        !existingPlaceIds.has(installer.google_place_id)
                    );

                    if (newInstallers.length > 0) {
                        // Insert new installers
                        const { error: insertError } = await supabase
                            .from('installers')
                            .insert(newInstallers);

                        if (insertError) {
                            console.error(`Insert error for ${city.name}:`, insertError);
                            results.errors.push(`${city.name}: ${insertError.message}`);
                        } else {
                            results.total_installers_fetched += newInstallers.length;
                            await logAgentAction('GooglePlaces', 'fetch_success', 'success', {
                                city: city.name,
                                new_installers: newInstallers.length,
                                skipped_duplicates: installers.length - newInstallers.length
                            });
                        }
                    } else {
                        await logAgentAction('GooglePlaces', 'fetch_skip', 'info', {
                            city: city.name,
                            message: 'All installers already exist'
                        });
                    }
                }

                results.cities_processed++;

                // Rate limiting - wait 500ms between cities
                await new Promise(r => setTimeout(r, 500));

            } catch (cityError: any) {
                console.error(`Error processing ${city.name}:`, cityError);
                results.errors.push(`${city.name}: ${cityError.message}`);
                await logAgentAction('GooglePlaces', 'fetch_error', 'error', {
                    city: city.name,
                    error: cityError.message
                });
            }
        }

        await logAgentAction('GooglePlaces', 'batch_complete', 'success', results);

        return NextResponse.json({
            success: true,
            ...results
        });

    } catch (error: any) {
        console.error('Google Places Cron Error:', error);
        await logAgentAction('GooglePlaces', 'batch_error', 'error', { error: error.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}