'use client';

import { useState } from 'react';
import { X, Check, Star, MapPin, Phone, Globe, Shield, Clock } from 'lucide-react';

interface Installer {
    id: string;
    business_name: string;
    rating: number | null;
    review_count: number | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string;
    state: string;
    verified: boolean;
    starting_price: number | null;
    services: string | null;
    average_response_hours: number | null;
    years_in_business: number | null;
    completed_installations: number | null;
}

interface InstallerComparisonProps {
    installers: Installer[];
    onClose: () => void;
}

export default function InstallerComparison({ installers, onClose }: InstallerComparisonProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>(
        installers.slice(0, 3).map(i => i.id)
    );

    const selectedInstallers = installers.filter(i => selectedIds.includes(i.id));

    const toggleInstaller = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else if (selectedIds.length < 3) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const features = [
        { key: 'rating', label: 'Customer Rating', icon: Star },
        { key: 'starting_price', label: 'Starting Price', icon: null },
        { key: 'response_time', label: 'Response Time', icon: Clock },
        { key: 'experience', label: 'Years in Business', icon: null },
        { key: 'completed', label: 'Installations Completed', icon: null },
        { key: 'services', label: 'Services Offered', icon: null },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Compare Installers</h2>
                        <p className="text-blue-100 mt-1">Select up to 3 installers to compare side by side</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Installer Selection */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-wrap gap-3">
                        {installers.map((installer) => (
                            <button
                                key={installer.id}
                                onClick={() => toggleInstaller(installer.id)}
                                disabled={!selectedIds.includes(installer.id) && selectedIds.length >= 3}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedIds.includes(installer.id)
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                        : 'bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200'
                                } ${
                                    !selectedIds.includes(installer.id) && selectedIds.length >= 3
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {selectedIds.includes(installer.id) && (
                                    <Check className="w-4 h-4 inline mr-2" />
                                )}
                                {installer.business_name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left p-4 font-semibold text-slate-900">Feature</th>
                                {selectedInstallers.map((installer) => (
                                    <th key={installer.id} className="p-4 text-center">
                                        <div className="space-y-2">
                                            <div className="font-bold text-slate-900">
                                                {installer.business_name}
                                            </div>
                                            {installer.verified && (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                    <Shield className="w-3 h-3" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Rating */}
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        Customer Rating
                                    </div>
                                </td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4 text-center">
                                        {installer.rating ? (
                                            <div>
                                                <div className="flex justify-center items-center gap-1 text-amber-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold">{installer.rating.toFixed(1)}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    ({installer.review_count} reviews)
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">No ratings yet</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Starting Price */}
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <td className="p-4 font-medium text-slate-700">Starting Price</td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4 text-center">
                                        <div className="text-2xl font-bold text-slate-900">
                                            {installer.starting_price ? `$${installer.starting_price}` : '$450+'}
                                        </div>
                                        <div className="text-xs text-slate-500">Installation only</div>
                                    </td>
                                ))}
                            </tr>

                            {/* Response Time */}
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Average Response Time
                                    </div>
                                </td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4 text-center">
                                        {installer.average_response_hours ? (
                                            <span className="font-semibold">
                                                {installer.average_response_hours < 24
                                                    ? `${installer.average_response_hours} hours`
                                                    : `${Math.round(installer.average_response_hours / 24)} days`}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">Not available</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Experience */}
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <td className="p-4 font-medium text-slate-700">Years in Business</td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4 text-center">
                                        {installer.years_in_business ? (
                                            <span className="font-semibold">{installer.years_in_business}+ years</span>
                                        ) : (
                                            <span className="text-slate-400">Not specified</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Completed Installations */}
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium text-slate-700">Installations Completed</td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4 text-center">
                                        {installer.completed_installations ? (
                                            <span className="font-semibold">{installer.completed_installations}+</span>
                                        ) : (
                                            <span className="text-slate-400">Not specified</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Contact Info */}
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <td className="p-4 font-medium text-slate-700">Contact Information</td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4">
                                        <div className="space-y-2 text-sm">
                                            {installer.phone && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Phone className="w-3 h-3" />
                                                    <a href={`tel:${installer.phone}`} className="text-blue-600 hover:underline">
                                                        {installer.phone}
                                                    </a>
                                                </div>
                                            )}
                                            {installer.website && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Globe className="w-3 h-3" />
                                                    <a href={installer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        Website
                                                    </a>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center gap-2 text-slate-600">
                                                <MapPin className="w-3 h-3" />
                                                {installer.city}, {installer.state}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Services */}
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium text-slate-700">Services Offered</td>
                                {selectedInstallers.map((installer) => (
                                    <td key={installer.id} className="p-4">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Level 2</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tesla</span>
                                            {installer.services?.includes('Panel') && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Panel Upgrade</span>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-50 flex justify-center gap-4">
                    {selectedInstallers.map((installer) => (
                        <button
                            key={installer.id}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Get Quote from {installer.business_name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}