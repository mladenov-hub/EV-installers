import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { MapPin, ArrowRight, Shield } from 'lucide-react';
import { notFound } from 'next/navigation';

// Force dynamic rendering to ensure we fetch fresh data
export const dynamic = 'force-dynamic';

interface StatePageProps {
    params: {
        state: string;
    };
}

export default async function StatePage({ params }: StatePageProps) {
    const { state } = params;
    const decodedState = state.toUpperCase(); // Simple normalization, e.g., 'tx' -> 'TX'

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch cities in this state that have installers
    // We use a distinct query on the installers table or fetch from locations table
    const { data: cities, error } = await supabase
        .from('locations') // Assuming we have a locations table populated, or we can query installers
        .select('*')
        .ilike('state', decodedState)
        .order('city', { ascending: true });

    if (error) {
        console.error('Error fetching cities:', error);
    }

    // If no cities found in locations, try fetching unique cities from installers table as fallback
    let cityList = cities || [];
    if (cityList.length === 0) {
        const { data: installerCities } = await supabase
            .from('installers')
            .select('city, state')
            .ilike('state', decodedState);

        if (installerCities) {
            // Deduplicate
            const unique = new Set(installerCities.map(i => i.city));
            cityList = Array.from(unique).map(c => ({ city: c, state: decodedState, slug: c.toLowerCase().replace(/\s+/g, '-') }));
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Top EV Installers in {decodedState}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Find verified, licensed electricians for your EV charger installation across {decodedState}.
                    </p>
                </div>
            </div>

            {/* City Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {cityList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cityList.map((loc: any) => (
                            <Link
                                key={loc.city}
                                href={`/installers/${state.toLowerCase()}/${loc.slug || loc.city.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {loc.city}
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex bg-yellow-50 p-4 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Installers Found Yet</h3>
                        <p className="text-slate-600">
                            We are currently expanding our network in {decodedState}. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
