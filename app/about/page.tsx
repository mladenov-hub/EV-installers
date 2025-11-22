
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">About Antigravity</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Accelerating the transition to electric vehicles by making home charging installation simple, transparent, and accessible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600">
                            We believe that finding a qualified electrician shouldn&apos;t be the hardest part of buying an EV.
                            Our mission is to build the most comprehensive, data-driven directory of EV charger installers
                            in the United States.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">
                            We aggregate data on licensed electricians, verify their credentials, and provide a simple platform
                            for homeowners to compare quotes. We partner with top-rated networks to ensure you get fast,
                            competitive bids for your project.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Ready to get started?</h2>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
                    >
                        Find an Installer Near You
                    </Link>
                </div>
            </div>
        </div>
    );
}
