import { ShieldCheck, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">EV Charging Safety Guide</h1>
                    <p className="text-xl text-slate-600">
                        Why professional installation is critical for your home and vehicle.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            The Risks of Improper Installation
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Fire Hazard</h3>
                                <p className="text-slate-600">
                                    EV chargers draw high continuous loads (32-48 amps). Standard outlets and wiring
                                    cannot handle this heat generation, leading to melting and electrical fires.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Voided Warranties</h3>
                                <p className="text-slate-600">
                                    Both your vehicle and home insurance warranties may be voided if charging equipment
                                    is not installed by a licensed professional according to code.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <Zap className="w-8 h-8 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Electrical Panel Load</h3>
                        <p className="text-slate-600">
                            Adding a charger is like adding a new dryer or oven. A pro calculates your total load
                            to ensure your main breaker doesn't trip or overheat.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Permits & Inspection</h3>
                        <p className="text-slate-600">
                            Legitimate installations require a city permit and inspection. This is your proof
                            that the work meets the National Electrical Code (NEC).
                        </p>
                    </div>
                </div>

                <div className="bg-blue-600 text-white rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Don&apos;t Risk It. Hire a Pro.</h2>
                    <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
                        Our directory only lists verified, licensed electricians who specialize in EV infrastructure.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Find an Installer Near Me
                    </Link>
                </div>
            </div>
        </div>
    );
}
