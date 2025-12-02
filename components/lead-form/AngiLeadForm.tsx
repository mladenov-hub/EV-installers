'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, MapPin, Zap, ArrowRight } from 'lucide-react';

interface AngiLeadFormProps {
    city: string;
    state: string;
}

export default function AngiLeadForm({ city, state }: AngiLeadFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        zipCode: '',
        projectType: 'install', // install, repair, replace
        propertyType: 'residential', // residential, commercial
        timeline: 'immediately', // immediately, 1_week, 1_month
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        details: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/leads/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, city, state }),
            });

            if (!response.ok) throw new Error('Submission failed');

            setIsSuccess(true);
            // Optional: Redirect to a "Thank You" page or Angi affiliate link after a delay
            // setTimeout(() => router.push('/thank-you'), 3000);
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow-sm">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-600 mb-6">
                    We are matching you with the top-rated EV installers in <strong>{city}, {state}</strong>.
                    Expect a call or email shortly to discuss your project.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-green-600 font-medium hover:underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Get Matched with Top Pros</h3>
                <p className="text-blue-100">
                    Compare quotes from licensed EV charger installers in {city}.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">What do you need?</label>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, projectType: 'install' })}
                                    className={`p-3 border rounded-lg text-left flex items-center transition-colors ${formData.projectType === 'install'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <Zap className="w-5 h-5 mr-3" />
                                    <span className="font-medium">New Charger Installation</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, projectType: 'repair' })}
                                    className={`p-3 border rounded-lg text-left flex items-center transition-colors ${formData.projectType === 'repair'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="w-5 h-5 mr-3 flex items-center justify-center font-bold text-lg">🔧</div>
                                    <span className="font-medium">Repair Existing Charger</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="zipCode"
                                    required
                                    placeholder="e.g. 90210"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (formData.zipCode.length >= 5) setStep(2);
                                else alert('Please enter a valid Zip Code');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center group"
                        >
                            Next Step
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Matching...
                                    </>
                                ) : (
                                    'Get My Free Quotes'
                                )}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                By clicking, you agree to receive quotes from local pros. No obligation.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            Back
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
