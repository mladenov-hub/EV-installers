import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-4xl mx-auto px-4 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to EV Installers ("we," "our," or "us"). We are committed to protecting your privacy
                        and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect,
                        use, and share information when you visit our site to find EV charger installers.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you submit a request for a quote.
                        This may include your name, email address, phone number, zip code, and vehicle details.
                        We also automatically collect certain information about your device and how you interact with our site
                        using cookies and similar technologies.
                    </p>

                    <h3>3. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Connect you with local electricians and installers.</li>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Communicate with you about your request.</li>
                        <li>Monitor and analyze trends and usage.</li>
                    </ul>

                    <h3>4. Sharing of Information</h3>
                    <p>
                        <strong>Lead Generation:</strong> When you submit a quote request, we share your information with
                        third-party installer networks (such as Networx or Angi) or direct local partners so they can contact
                        you with the requested quotes. By submitting a request, you consent to this sharing.
                    </p>
                    <p>
                        <strong>Affiliate Links:</strong> We participate in the Amazon Services LLC Associates Program.
                        If you click on an Amazon link and make a purchase, we may earn a commission. Amazon has its own
                        privacy policy which governs their collection of data.
                    </p>

                    <h3>5. Data Security</h3>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and
                        unauthorized access, disclosure, alteration and destruction.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@evinstallers.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
