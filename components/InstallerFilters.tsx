'use client';

import { useState } from 'react';
import { ChevronDown, Filter, Star, DollarSign, Clock, Shield } from 'lucide-react';

interface FilterOptions {
    priceRange: 'all' | 'under500' | '500to1000' | 'over1000';
    rating: number;
    services: string[];
    availability: 'all' | 'immediate' | 'within_week';
    verified: boolean;
}

interface InstallerFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
    installerCount: number;
}

export default function InstallerFilters({ onFilterChange, installerCount }: InstallerFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        priceRange: 'all',
        rating: 0,
        services: [],
        availability: 'all',
        verified: false
    });

    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange(updated);
    };

    const toggleService = (service: string) => {
        const services = filters.services.includes(service)
            ? filters.services.filter(s => s !== service)
            : [...filters.services, service];
        handleFilterChange({ services });
    };

    const resetFilters = () => {
        const defaultFilters: FilterOptions = {
            priceRange: 'all',
            rating: 0,
            services: [],
            availability: 'all',
            verified: false
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
            {/* Filter Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-slate-600" />
                    <span className="font-semibold text-slate-900">Filter Installers</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {installerCount} Results
                    </span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                    {isExpanded ? 'Hide' : 'Show'} Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Filter Options */}
            {isExpanded && (
                <div className="border-t border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Price Range */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                <DollarSign className="w-4 h-4" />
                                Price Range
                            </label>
                            <select
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange({ priceRange: e.target.value as FilterOptions['priceRange'] })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="all">All Prices</option>
                                <option value="under500">Under $500</option>
                                <option value="500to1000">$500 - $1,000</option>
                                <option value="over1000">Over $1,000</option>
                            </select>
                        </div>

                        {/* Minimum Rating */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                <Star className="w-4 h-4" />
                                Minimum Rating
                            </label>
                            <div className="flex gap-1">
                                {[0, 3, 4, 4.5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleFilterChange({ rating })}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filters.rating === rating
                                                ? 'bg-amber-100 text-amber-700 border-amber-300'
                                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {rating === 0 ? 'Any' : `${rating}+`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                <Clock className="w-4 h-4" />
                                Availability
                            </label>
                            <select
                                value={filters.availability}
                                onChange={(e) => handleFilterChange({ availability: e.target.value as FilterOptions['availability'] })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="all">Any Time</option>
                                <option value="immediate">Immediate (24-48h)</option>
                                <option value="within_week">Within a Week</option>
                            </select>
                        </div>

                        {/* Verified Only */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                <Shield className="w-4 h-4" />
                                Verification
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.verified}
                                    onChange={(e) => handleFilterChange({ verified: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">Verified Installers Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="mt-6">
                        <label className="text-sm font-medium text-slate-700 mb-3 block">Services Offered</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Level 2 Installation',
                                'Tesla Wall Connector',
                                'Panel Upgrades',
                                'Permit Handling',
                                'Commercial Installation',
                                'Solar Integration',
                                'Battery Storage'
                            ].map((service) => (
                                <button
                                    key={service}
                                    onClick={() => toggleService(service)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        filters.services.includes(service)
                                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}