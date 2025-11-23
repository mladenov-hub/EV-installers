import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-4xl mx-auto px-4 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using the EV Installers website, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        EV Installers is a directory and lead generation service. We connect homeowners with
                        independent electricians and installation companies. We do not perform installations ourselves,
                        nor do we employ the installers listed on our site.
                    </p>

                    <h3>3. No Endorsement or Warranty</h3>
                    <p>
                        We do not endorse or guarantee the work of any specific installer. You are solely responsible for
                        vetting and hiring any professional you find through our platform. We are not responsible for any
                        damages, disputes, or issues that arise from your engagement with third-party installers.
                    </p>

                    <h3>4. Affiliate Disclosure</h3>
                    <p>
                        This site contains affiliate links to products on Amazon.com. We may earn a commission on qualifying
                        purchases. This does not affect the price you pay.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        To the fullest extent permitted by law, EV Installers shall not be liable for any
                        indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                    </p>

                    <h3>6. Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these terms at any time. Your continued use of the site after any
                        changes indicates your acceptance of the new terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
