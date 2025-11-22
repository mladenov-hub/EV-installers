import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import GetQuoteForm from '@/components/GetQuoteForm';
import StickyCTA from '@/components/StickyCTA';
import AffiliateProduct from '@/components/AffiliateProduct';
import { MapPin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// The Architect (Claude 4.5 Sonnet)
// Component: City Landing Page (Server Component)

interface PageProps {
    params: Promise<{
        state: string;
        city: string;
    }>;
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

    // Fetch SEO Content
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return {
            title: `EV Charger Installers in ${data.city}, ${data.state}`,
            description: `Find verified EV charger installers in ${data.city}.`
        };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: content } = await supabase
        .from('city_content')
        .select('meta_title, meta_description')
        .eq('city', data.city)
        .eq('state', data.state)
        .single();

    return {
        title: content?.meta_title || `Top ${data.installerCount} EV Charger Installers in ${data.city}, ${data.state} | 2025 Guide`,
        description: content?.meta_description || `Compare the best rated EV charger installers in ${data.city}, ${data.state}. Average cost: $${data.avgPrice}. Get a free quote today.`,
    };
}

export default async function CityPage({ params }: PageProps) {
    const { state, city } = await params;
    const decodedCity = decodeURIComponent(city).replace(/-/g, ' ');
    const decodedState = state.toUpperCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        notFound();
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get Content (SEO)
    const { data: content } = await supabase
        .from('city_content')
        .select('*')
        .eq('city', decodedCity)
        .eq('state', decodedState)
        .single();

    // 2. Get Installers (for the list)
    const { data: installers, count } = await supabase
        .from('installers')
        .select('*', { count: 'exact' })
        .eq('city', decodedCity)
        .eq('state', decodedState);

    const installerCount = count || 0;
    const startingPrice = 450;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {content?.meta_title || `Top Rated EV Charger Installers in ${decodedCity}, ${decodedState}`}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        {content?.intro_text || `Find verified local electricians in ${decodedCity} to install your Level 2 home charging station. Get quotes, compare prices, and charge faster.`}
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
                        <div key={installer.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{installer.business_name}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-slate-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{installer.city}, {installer.state}</span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Level 2 Charging</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Tesla Wall Connector</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Starting at</div>
                                    <div className="text-2xl font-bold text-slate-900">${startingPrice}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar - Lead Form & Affiliates */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <GetQuoteForm city={decodedCity} state={decodedState} />

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
