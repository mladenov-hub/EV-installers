import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import GetQuoteForm from '@/components/GetQuoteForm';
import StickyCTA from '@/components/StickyCTA';
import AffiliateProduct from '@/components/AffiliateProduct';
import GoogleMap from '@/components/GoogleMap';
import { MapPin, Star } from 'lucide-react';
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Graceful fallback if DB is not connected
    const supabase = (supabaseUrl && supabaseKey)
        ? createClient(supabaseUrl, supabaseKey)
        : null;

    // 1. Get Content (SEO)
    let content = null;
    if (supabase) {
        const { data } = await supabase
            .from('city_content')
            .select('*')
            .ilike('city', dbCityQuery) // Relaxed matching
            .eq('state', decodedState)
            .single();
        content = data;
    }

    // 2. Get Installers (for the list)
    let installers: any[] | null = [];
    let count = 0;

    if (supabase) {
        console.log(`🔍 Querying DB for City: "${dbCityQuery}", State: "${decodedState}"`);

        const { data: installerData, count: installerCount, error } = await supabase
            .from('installers')
            .select('*', { count: 'exact' })
            .ilike('city', dbCityQuery) // Relaxed matching
            .ilike('state', decodedState); // Changed from eq to ilike to match getCityData logic

        if (error) {
            console.error('❌ Supabase Query Error:', error);
        } else {
            console.log(`✅ Found ${installerCount} installers`);
        }

        installers = installerData;
        count = installerCount || 0;
    }

    const installerCount = count || 0;
    const startingPrice = 450;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {content?.meta_title || `Top Rated EV Charger Installers in ${formattedCity}, ${decodedState}`}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        {content?.intro_text || `Find verified local electricians in ${formattedCity} to install your Level 2 home charging station. Get quotes, compare prices, and charge faster.`}
                    </p>

                    <div className="flex justify-center gap-8 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">●</span> {installerCount} Pros Available
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-400">●</span> Verified License
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400">●</span> Est. ${startingPrice}+
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content - Installer List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Verified Installers</h2>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {installerCount} Results
                        </span>
                    </div>

                    {installers?.map((installer: any) => (
                        <div key={installer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {installer.business_name}
                                                </h3>

                                                {/* Verified Badge */}
                                                {installer.verified && (
                                                    <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Verified Business
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price Badge */}
                                            <div className="text-right ml-4">
                                                <div className="text-xs text-slate-500 uppercase tracking-wide">Starting at</div>
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {installer.starting_price ? `$${installer.starting_price}` : '$450+'}
                                                </div>
                                                <div className="text-xs text-slate-500">Installation only</div>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        {installer.rating && installer.rating > 0 && (
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(installer.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-sm">{installer.rating.toFixed(1)}</span>
                                                <span className="text-slate-500 text-sm">({installer.review_count || 0} reviews)</span>
                                            </div>
                                        )}

                                        {/* Location & Contact */}
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm">{installer.address || `${installer.city}, ${installer.state} ${installer.zip_code || ''}`}</span>
                                            </div>
                                            {installer.phone && (
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <a href={`tel:${installer.phone}`} className="text-sm text-blue-600 hover:underline">
                                                        {installer.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Services */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Level 2 Charging</span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Tesla Wall Connector</span>
                                            {installer.services && installer.services.includes('Panel') && (
                                                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Panel Upgrades</span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-5">
                                            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                                                Get Quote
                                            </button>
                                            {installer.website && (
                                                <a
                                                    href={installer.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm text-slate-700"
                                                >
                                                    Visit Website
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Google Map Section */}
                            {(installer.google_place_id || installer.address) && (
                                <div className="border-t border-slate-200 bg-slate-50">
                                    <GoogleMap
                                        placeId={installer.google_place_id}
                                        businessName={installer.business_name}
                                        address={installer.address || `${installer.city}, ${installer.state}`}
                                        phone={installer.phone}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar - Lead Form & Affiliates */}
                <div className="lg:col-span-1">
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
                </div>

            </div>

            <StickyCTA />
        </div>
    );
}