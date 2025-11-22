'use client';

import { useEffect, useState } from 'react';

// The Architect (Claude 4.5 Sonnet)
// Component: Sticky CTA (Mobile Optimized)

export default function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl md:hidden z-50 animate-slide-up">
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md"
            >
                Get Free Quotes
            </button>
        </div>
    );
}
