'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface USAMapProps {
    onStateClick?: (stateCode: string) => void;
}

const USAMap: React.FC<USAMapProps> = ({ onStateClick }) => {
    const router = useRouter();
    const [hoveredState, setHoveredState] = useState<string | null>(null);

    const handleStateClick = (stateCode: string) => {
        if (onStateClick) {
            onStateClick(stateCode);
        } else {
            router.push(`/installers/${stateCode.toLowerCase()}`);
        }
    };

    // SVG Paths for US States (Simplified for performance and visual clarity)
    const states = [
        { id: "HI", name: "Hawaii", d: "M 183.146 576.672 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 198.887 580.441 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 214.628 584.21 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 230.369 587.979 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 246.11 591.748 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 261.851 595.517 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 277.592 599.286 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z M 293.333 603.055 l -2.697 2.152 l 2.697 2.152 l 2.697 -2.152 l -2.697 -2.152 Z" }, // Simplified placeholder for complex islands
        { id: "AK", name: "Alaska", d: "M 112.9 430.3 l 1.9 5.8 l 10.8 1.9 l 5.1 8.3 l -3.2 5.1 l -8.9 -1.9 l -5.1 -7 l -7 1.3 l -3.8 -5.1 l 10.2 -8.4 Z" }, // Simplified
        { id: "FL", name: "Florida", d: "M 756.9 478.4 l 12.8 1.9 l 10.2 26.2 l 3.8 15.3 l -7 10.2 l -10.2 -3.8 l -12.1 -21.7 l -26.2 -3.8 l -1.3 -8.9 l 30 -15.4 Z" },
        { id: "NH", name: "New Hampshire", d: "M 889.3 129.5 l 5.1 14.7 l -5.1 1.3 l -3.2 -14.1 l 3.2 -1.9 Z" },
        { id: "MI", name: "Michigan", d: "M 661.7 167.9 l 10.2 10.2 l 5.1 23.6 l -8.9 5.1 l -10.2 -8.9 l -5.1 -21.7 l 8.9 -8.3 Z M 629.8 148.7 l 21.7 3.2 l 10.2 8.9 l -14.1 3.2 l -21.7 -5.1 l 3.9 -10.2 Z" },
        { id: "VT", name: "Vermont", d: "M 879.1 127.6 l 3.2 14.7 l -5.1 1.3 l -2.6 -15.3 l 4.5 -0.7 Z" },
        { id: "ME", name: "Maine", d: "M 897.6 100.1 l 14.1 10.2 l 5.1 17.9 l -10.2 10.2 l -7 -3.2 l -5.1 -17.9 l 3.1 -17.2 Z" },
        { id: "RI", name: "Rhode Island", d: "M 901.4 172.4 l 3.2 1.3 l -1.3 3.2 l -3.2 -1.3 l 1.3 -3.2 Z" },
        { id: "NY", name: "New York", d: "M 836.3 134.6 l 35.8 3.2 l 3.2 28.1 l -10.2 3.2 l -3.2 -5.1 l -17.9 -1.3 l -15.3 5.1 l -5.1 -10.2 l 12.7 -23 Z M 893.1 166.6 l 11.5 3.2 l -1.9 3.8 l -10.8 -1.9 l 1.2 -5.1 Z" },
        { id: "PA", name: "Pennsylvania", d: "M 817.1 171.1 l 58.8 3.2 l 1.3 26.2 l -60.1 1.3 l 0 -30.7 Z" },
        { id: "NJ", name: "New Jersey", d: "M 877.2 176.2 l 5.1 15.3 l -3.2 10.2 l -7 -2.6 l -1.3 -14.1 l 6.4 -8.8 Z" },
        { id: "DE", name: "Delaware", d: "M 868.9 203.7 l 5.1 1.3 l 1.3 10.2 l -6.4 1.3 l 0 -12.8 Z" },
        { id: "MD", name: "Maryland", d: "M 831.2 201.1 l 37.7 2.6 l 3.2 12.8 l -15.3 3.2 l -5.1 -7 l -10.2 1.3 l -3.2 -5.1 l -7.1 -7.8 Z" },
        { id: "VA", name: "Virginia", d: "M 803.7 218.4 l 15.3 -7.7 l 10.2 5.1 l 28.1 3.8 l 3.2 15.3 l -30.7 3.2 l -26.1 -19.7 Z" },
        { id: "WV", name: "West Virginia", d: "M 790.3 203.7 l 12.8 5.1 l 8.9 15.3 l -15.3 10.2 l -17.9 -7.7 l 3.2 -14.1 l 8.3 -8.8 Z" },
        { id: "OH", name: "Ohio", d: "M 759.0 183.9 l 28.1 -3.2 l 10.2 23.0 l -8.9 15.3 l -30.7 -1.3 l 1.3 -33.8 Z" },
        { id: "IN", name: "Indiana", d: "M 725.1 185.2 l 24.3 1.3 l 3.2 44.7 l -15.3 3.2 l -5.1 -12.8 l -7.1 -36.4 Z" },
        { id: "IL", name: "Illinois", d: "M 693.8 180.0 l 24.3 1.3 l 3.2 58.8 l -15.3 10.2 l -17.9 -23.0 l 5.7 -47.3 Z" },
        { id: "CT", name: "Connecticut", d: "M 886.1 159.6 l 11.5 1.3 l -1.3 8.9 l -12.8 1.3 l 2.6 -11.5 Z" },
        { id: "WI", name: "Wisconsin", d: "M 654.1 129.5 l 23.0 5.1 l 10.2 46.0 l -20.4 3.2 l -15.3 -15.3 l 2.5 -39.0 Z" },
        { id: "NC", name: "North Carolina", d: "M 783.3 238.2 l 48.6 -5.1 l 23.0 15.3 l -15.3 12.8 l -58.8 1.3 l 2.5 -24.3 Z" },
        { id: "DC", name: "District of Columbia", d: "M 858.0 208.0 l 3.0 0 l 0 3.0 l -3.0 0 Z" },
        { id: "MA", name: "Massachusetts", d: "M 884.2 149.4 l 26.8 1.3 l 1.3 7.7 l -5.1 5.1 l -23.0 -1.3 l 0 -12.8 Z" },
        { id: "TN", name: "Tennessee", d: "M 714.9 258.0 l 79.2 -5.1 l 8.9 17.9 l -86.8 1.3 l -1.3 -14.1 Z" },
        { id: "AR", name: "Arkansas", d: "M 645.2 274.6 l 48.6 1.3 l 5.1 33.2 l -38.4 3.2 l -15.3 -37.7 Z" },
        { id: "MO", name: "Missouri", d: "M 632.4 213.3 l 48.6 1.3 l 7.7 46.0 l -23.0 15.3 l -38.4 -10.2 l 5.1 -52.4 Z" },
        { id: "GA", name: "Georgia", d: "M 764.1 270.8 l 30.7 5.1 l 10.2 30.7 l -23.0 5.1 l -25.6 -30.7 l 7.7 -10.2 Z" },
        { id: "SC", name: "South Carolina", d: "M 792.2 263.1 l 38.4 5.1 l -5.1 25.6 l -30.7 -5.1 l -2.6 -25.6 Z" },
        { id: "KY", name: "Kentucky", d: "M 723.8 227.3 l 48.6 5.1 l 8.9 15.3 l -66.5 5.1 l -10.2 -15.3 l 19.2 -10.2 Z" },
        { id: "AL", name: "Alabama", d: "M 733.4 281.0 l 23.0 1.3 l 5.1 48.6 l -15.3 1.3 l -12.8 -51.2 Z" },
        { id: "LA", name: "Louisiana", d: "M 642.6 314.2 l 28.1 1.3 l 5.1 15.3 l 23.0 5.1 l -5.1 15.3 l -46.0 1.3 l -5.1 -38.3 Z" },
        { id: "MS", name: "Mississippi", d: "M 693.8 281.0 l 23.0 1.3 l -2.6 53.7 l -15.3 1.3 l -5.1 -56.3 Z" },
        { id: "IA", name: "Iowa", d: "M 609.4 176.2 l 53.7 1.3 l 7.7 30.7 l -51.1 5.1 l -10.3 -37.1 Z" },
        { id: "MN", name: "Minnesota", d: "M 596.6 120.0 l 46.0 5.1 l 5.1 48.6 l -40.9 3.2 l -10.2 -56.9 Z" },
        { id: "OK", name: "Oklahoma", d: "M 553.1 267.0 l 74.1 1.3 l 3.2 33.2 l -48.6 3.2 l -28.7 -37.7 Z M 507.1 267.0 l 46.0 0 l 0 10.0 l -46.0 0 Z" },
        { id: "TX", name: "Texas", d: "M 507.1 277.2 l 46.0 0 l 28.1 38.3 l 35.8 15.3 l -10.2 46.0 l -23.0 15.3 l -38.4 -23.0 l -51.1 -30.7 l 12.8 -61.2 Z" },
        { id: "NM", name: "New Mexico", d: "M 430.4 267.0 l 61.3 1.3 l 2.6 63.9 l -63.9 0 l 0 -65.2 Z" },
        { id: "KS", name: "Kansas", d: "M 540.3 221.0 l 66.5 1.3 l 2.6 35.8 l -69.1 0 l 0 -37.1 Z" },
        { id: "NE", name: "Nebraska", d: "M 522.4 182.6 l 71.6 1.3 l 5.1 25.6 l -61.3 3.2 l -15.3 -30.1 Z" },
        { id: "SD", name: "South Dakota", d: "M 517.3 144.3 l 63.9 1.3 l 2.6 35.8 l -66.5 0 l 0 -37.1 Z" },
        { id: "ND", name: "North Dakota", d: "M 512.2 108.5 l 63.9 1.3 l 2.6 33.2 l -66.5 0 l 0 -34.5 Z" },
        { id: "WY", name: "Wyoming", d: "M 440.6 149.4 l 61.3 1.3 l -2.6 48.6 l -58.7 0 l 0 -49.9 Z" },
        { id: "MT", name: "Montana", d: "M 389.5 103.4 l 107.4 5.1 l -2.6 39.6 l -104.8 -1.3 l 0 -43.4 Z" },
        { id: "CO", name: "Colorado", d: "M 435.5 210.8 l 63.9 1.3 l -2.6 46.0 l -61.3 0 l 0 -47.3 Z" },
        { id: "ID", name: "Idaho", d: "M 353.7 108.5 l 25.6 5.1 l 10.2 38.3 l -15.3 38.3 l -30.7 -5.1 l 10.2 -76.6 Z" },
        { id: "UT", name: "Utah", d: "M 384.4 195.4 l 35.8 1.3 l -2.6 46.0 l -33.2 0 l 0 -47.3 Z M 384.4 195.4 l 0 -15.0 l 25.0 0 l 0 15.0 Z" },
        { id: "AZ", name: "Arizona", d: "M 363.9 246.5 l 53.7 1.3 l -5.1 63.9 l -48.6 -10.2 l 0 -55.0 Z" },
        { id: "NV", name: "Nevada", d: "M 320.4 172.4 l 51.1 1.3 l 5.1 69.0 l -30.7 25.6 l -25.5 -95.9 Z" },
        { id: "OR", name: "Oregon", d: "M 271.8 123.8 l 69.0 5.1 l -7.7 51.1 l -61.3 -5.1 l 0 -51.1 Z" },
        { id: "WA", name: "Washington", d: "M 282.1 85.5 l 56.2 5.1 l -5.1 33.2 l -63.9 -2.6 l 12.8 -35.7 Z" },
        { id: "CA", name: "California", d: "M 269.3 177.5 l 40.9 7.7 l 25.6 89.5 l -38.4 15.3 l -38.4 -38.3 l 10.3 -74.2 Z" },
    ];

    return (
        <div className="w-full h-full flex items-center justify-center">
            <svg
                viewBox="0 0 959 593"
                className="w-full h-auto max-w-5xl drop-shadow-xl"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {states.map((state) => (
                    <g key={state.id} className="group cursor-pointer transition-all duration-300">
                        <path
                            d={state.d}
                            id={state.id}
                            name={state.name}
                            className={`
                stroke-white stroke-[1.5px] transition-all duration-300 ease-out
                ${hoveredState === state.id
                                    ? 'fill-blue-500 -translate-y-1 drop-shadow-lg z-10'
                                    : 'fill-slate-300 hover:fill-blue-400'
                                }
              `}
                            onClick={() => handleStateClick(state.id)}
                            onMouseEnter={() => setHoveredState(state.id)}
                            onMouseLeave={() => setHoveredState(null)}
                            style={{
                                transformOrigin: 'center',
                            }}
                        />
                        {/* Tooltip-like label on hover */}
                        {hoveredState === state.id && (
                            <text
                                x="50%"
                                y="50"
                                textAnchor="middle"
                                className="text-2xl font-bold fill-slate-800 pointer-events-none"
                                style={{ textShadow: '0px 2px 4px rgba(255,255,255,0.8)' }}
                            >
                                {state.name}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* Floating Label for currently hovered state */}
            {hoveredState && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-200 pointer-events-none animate-fade-in">
                    <p className="text-lg font-bold text-slate-900">
                        {states.find(s => s.id === hoveredState)?.name}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">Click to view installers</p>
                </div>
            )}
        </div>
    );
};

export default USAMap;
