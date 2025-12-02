import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import GetQuoteForm from '@/components/GetQuoteForm';
import StickyCTA from '@/components/StickyCTA';
import AffiliateProduct from '@/components/AffiliateProduct';
import GoogleMap from '@/components/GoogleMap';
import { MapPin, Shield, Star, CheckCircle2, ArrowRight } from 'lucide-react';

import { createClient } from '@supabase/supabase-js';

// The Architect (Claude 4.5 Sonnet)
// Component: City Landing Page (Server Component)

interface PageProps {
    params: Promise<{
        state: string;
        city: string;
    }>;
}

// Helper to format city names (e.g., "san-francisco" -> "San Francisco")
function formatCityName(slug: string): string {
    return decodeURIComponent(slug)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Real Data Fetcher
async function getCityData(state: string, city: string) {
    const decodedCity = decodeURIComponent(city).replace(/-/g, ' ');
    const decodedState = state.toUpperCase();

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials missing, using fallback data');
            throw new Error('Missing credentials');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Query installers count
        const { count, error } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true })
            .ilike('city', decodedCity)
            .ilike('state', decodedState);

        if (error) throw error;

        return {
            city: decodedCity,
            state: decodedState,
            installerCount: count || 0,
            avgPrice: 450, // Static "Starting at" price since we don't have quote data yet
            utility: "Local Utility Co."
        };

    } catch (error) {
        console.error('Error fetching city data:', error);
        // Fallback to basic data if DB fails
        return {
            city: decodedCity,
            state: decodedState,
            installerCount: 0,
            avgPrice: 450,
            utility: "Local Utility Co."
        };
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { state, city } = await params;
    const data = await getCityData(state, city);
    const formattedCity = formatCityName(city);
    const formattedState = state.toUpperCase();

    // Fetch SEO Content
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return {
            title: `EV Charger Installers in ${formattedCity}, ${formattedState}`,
            description: `Find verified EV charger installers in ${formattedCity}.`
        };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: content } = await supabase
        .from('city_content')
        .select('meta_title, meta_description')
        .eq('city', formattedCity)
        .eq('state', formattedState)
        .single();

    return {
        title: content?.meta_title || `Top ${data.installerCount} EV Charger Installers in ${formattedCity}, ${formattedState} | 2025 Guide`,
        description: content?.meta_description || `Compare the best rated EV charger installers in ${formattedCity}, ${formattedState}. Average cost: $${data.avgPrice}. Get a free quote today.`,
    };
}

export default async function CityPage({ params }: PageProps) {
    const { state, city } = await params;
    // Use formatted city name for Display (UI)
    const formattedCity = formatCityName(city);
    // Use raw slug processing for DB (assuming DB has spaces, e.g. "San Francisco")
    const dbCityQuery = decodeURIComponent(city).replace(/-/g, ' ');
    const decodedState = state.toUpperCase();
    <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-500" />
        <span>{installer.city}, {installer.state}</span>
    </div>
                                            </div >
        <div className="space-y-2 text-sm text-slate-600">
            {installer.website && (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">Web:</span>
                    <a href={installer.website} target="_blank" rel="nofollow" className="text-blue-600 hover:underline truncate max-w-[200px]">{installer.website.replace(/^https?:\/\//, '')}</a>
                </div>
            )}
            {installer.phone && (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">Tel:</span>
                    <a href={`tel:${installer.phone}`} className="text-slate-600 hover:text-blue-600">{installer.phone}</a>
                </div>
            )}
        </div>
                                        </div >

        <div className="flex gap-3">
            <Link
                href={`/get-quote?installer=${installer.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
                Request Quote
            </Link>
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors">
                View Profile
            </button>
        </div>
                                    </div >
                                </div >
                            </div >

        {/* Google Map Section */ }
    {
        (installer.google_place_id || installer.address) && (
            <div className="border-t border-slate-200 bg-slate-50">
                <GoogleMap
                    placeId={installer.google_place_id}
                    businessName={installer.business_name}
                    address={installer.address || `${installer.city}, ${installer.state}`}
                    phone={installer.phone}
                />
            </div>
        )
    }
                        </div >
                    ))
}
                </div >

    {/* Sidebar - Lead Form & Affiliates */ }
    < div className = "lg:col-span-1" >
        <div className="sticky top-8">
            <GetQuoteForm city={formattedCity} state={decodedState} />

            <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Why use our platform?</h3>
                <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex gap-2">✓ Verified License & Insurance</li>
                    <li className="flex gap-2">✓ Compare 3+ Quotes Instantly</li>
                    <li className="flex gap-2">✓ Save up to 30% on Installation</li>
                </ul>
            </div>

            {/* Recommended Chargers */}
            <div className="mt-8">
                <h3 className="font-bold text-slate-900 mb-4">Recommended Chargers</h3>
                <div className="space-y-4">
                    <AffiliateProduct
                        asin="B0C6YMS4KH"
                        title="Tesla Wall Connector - Universal Electric Vehicle Charger"
                        price="$580.00"
                        rating={4.8}
                        reviews={1250}
                        image="https://m.media-amazon.com/images/I/61y4J2vTwIL._AC_SL1500_.jpg"
                    />
                    <AffiliateProduct
                        asin="B0B2Z5W1J4"
                        title="ChargePoint Home Flex Level 2 WiFi Charger"
                        price="$549.00"
                        rating={4.5}
                        reviews={890}
                        image="https://m.media-amazon.com/images/I/51j3f+L-92L._AC_SL1000_.jpg"
                    />
                </div>
            </div>
        </div>
                </div >

            </div >

    <StickyCTA />
        </div >
    );
}