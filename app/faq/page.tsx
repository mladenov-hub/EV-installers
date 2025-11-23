import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'EV Charging FAQ | Everything You Need to Know',
    description: 'Common questions about EV charger installation, charging levels, connectors, and costs. Get answers from the experts.',
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Everything you need to know about charging your electric vehicle at home.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="space-y-8">

                    {/* Section 1: Charging Basics */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">⚡</span>
                            Charging Basics
                        </h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="What are the different levels of EV charging?"
                                answer={
                                    <div className="space-y-4">
                                        <p>There are three main levels of charging:</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Level 1 (120V):</strong> Uses a standard household outlet. Adds 3-5 miles of range per hour. Best for overnight charging or plug-in hybrids.</li>
                                            <li><strong>Level 2 (240V):</strong> Requires a dedicated circuit (like a dryer). Adds 12-80 miles of range per hour. The standard for home charging.</li>
                                            <li><strong>Level 3 (DC Fast Charging):</strong> Commercial stations only. Charges 80% in 20-40 minutes. Not available for home installation.</li>
                                        </ul>
                                    </div>
                                }
                            />
                            <FAQItem
                                question="Do I need a special outlet for a Level 2 charger?"
                                answer="Yes. Level 2 chargers require a 240-volt outlet (typically NEMA 14-50) or a hardwired connection. This is similar to what your electric dryer or stove uses. You will likely need a licensed electrician to install a dedicated circuit in your garage or driveway."
                            />
                            <FAQItem
                                question="What is the difference between J1772, CCS, and NACS (Tesla)?"
                                answer="J1772 is the standard connector for Level 1 and 2 charging for non-Tesla vehicles. CCS is the standard for fast charging (Level 3) for non-Teslas. NACS (North American Charging Standard) is Tesla's proprietary connector, which is now being adopted by other manufacturers. Most chargers come with J1772 or NACS, and adapters are widely available."
                            />
                        </div>
                    </section>

                    {/* Section 2: Installation & Costs */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 mt-12">
                            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">💰</span>
                            Installation & Costs
                        </h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="How much does it cost to install a home EV charger?"
                                answer="Installation costs typically range from $400 to $1,500+, depending on the complexity. Factors include the distance from your electrical panel, whether you need a panel upgrade, and local permit fees. The charger unit itself usually costs between $400 and $800."
                            />
                            <FAQItem
                                question="Can I install an EV charger myself?"
                                answer="It is highly recommended to hire a licensed electrician. Working with 240V electricity carries significant safety risks. Professional installation ensures compliance with local building codes, safety standards, and often keeps your home insurance and warranty valid."
                            />
                            <FAQItem
                                question="Are there tax credits or rebates available?"
                                answer="Yes! The federal government offers a tax credit (Alternative Fuel Vehicle Refueling Property Credit) for 30% of the hardware and installation cost, up to $1,000. Many local utility companies and states also offer additional rebates. Check with your local utility provider."
                            />
                        </div>
                    </section>

                    {/* Section 3: Usage & Safety */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 mt-12">
                            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">🛡️</span>
                            Usage & Safety
                        </h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="Is it safe to charge my EV in the rain?"
                                answer="Yes. EV charging stations and vehicle ports are designed to be weather-resistant and safe to use in rain or snow. However, always ensure your charging unit is rated for outdoor use (e.g., NEMA 3R or NEMA 4 rating) if installed outside."
                            />
                            <FAQItem
                                question="Should I charge my EV to 100% every night?"
                                answer="For most daily driving, it is recommended to charge to 80% or 90% to prolong battery life. Charging to 100% is best reserved for long road trips. Consult your vehicle's manual for specific recommendations."
                            />
                        </div>
                    </section>

                </div>

                {/* CTA */}
                <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Ready to get installed?</h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                        Connect with verified local electricians who specialize in EV charger installation. Get free quotes today.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
                    >
                        Find an Installer
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: React.ReactNode }) {
    return (
        <details className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                <h3 className="text-lg font-semibold text-slate-900 pr-4">{question}</h3>
                <span className="text-slate-400 transform group-open:rotate-180 transition-transform duration-200">
                    ▼
                </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {answer}
            </div>
        </details>
    );
}
