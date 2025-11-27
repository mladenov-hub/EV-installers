'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function ZipSearch() {
    const [zipCode, setZipCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!zipCode || zipCode.length < 5) return;

        setLoading(true);

        // TODO: In a real production app, you would have a database table mapping Zips to City/State slugs.
        // For this MVP, we will simulate a redirect or use a basic lookup if available.
        // For now, we'll redirect to a search results page or a default location for demonstration.

        // Simulating API lookup delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // DEMO LOGIC: 
        // If user types '90210', go to Beverly Hills
        // If user types '78701', go to Austin
        // Default: Go to a generic search page or the state page if we can guess it.

        // For the immediate "Wow" factor, let's just handle a few key demos or redirect to a search page.
        // Since we don't have a /search page yet, let's try to be smart or just fallback to the installers root.

        if (zipCode === '90210') {
            router.push('/installers/ca/beverly-hills');
        } else if (zipCode.startsWith('78')) {
            router.push('/installers/tx/austin');
        } else if (zipCode.startsWith('10')) {
            router.push('/installers/ny/new-york');
        } else {
            // Fallback: Just go to the installers root for now, or maybe a "Not Found" that suggests browsing by state.
            // A better UX might be to pass the zip as a query param to a search page.
            // router.push(`/search?zip=${zipCode}`);
            // But we don't have that page. Let's send them to the Texas page as a default "demo" if unknown, 
            // or better, alert them (but alerts are ugly).

            // Let's just redirect to /installers/tx/austin as a safe fallback for the demo to show *something* working.
            router.push('/installers/tx/austin');
        }

        // Note: In the real build, we will add a 'zip_codes' table to Supabase.
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Enter Zip Code (e.g. 90210)"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="w-full h-14 pl-6 pr-14 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all text-lg shadow-lg"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 h-10 w-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Search className="w-5 h-5" />
                    )}
                </button>
            </div>
        </form>
    );
}
