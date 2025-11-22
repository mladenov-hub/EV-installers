'use client';

import { ExternalLink } from 'lucide-react';

// The Liaison (Claude 4.5 Haiku)
// Component: Affiliate Product Card

interface ProductProps {
    asin: string;
    title: string;
    price: string;
    rating: number;
    reviews: number;
    image: string;
}

export default function AffiliateProduct({ asin, title, price, rating, reviews, image }: ProductProps) {
    const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || 'evinstallers2-20';
    const affiliateLink = `https://www.amazon.com/dp/${asin}?tag=${tag}`;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="relative h-48 mb-4 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                {/* In a real app, use Next/Image. For now, simple img tag for external URLs */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Best Seller
                </div>
            </div>

            <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 h-12">
                {title}
            </h3>

            <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(Math.floor(rating))}
                    {'☆'.repeat(5 - Math.floor(rating))}
                </div>
                <span className="text-xs text-slate-500">({reviews})</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-slate-900">{price}</span>
                <a
                    href={affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Buy on Amazon <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
