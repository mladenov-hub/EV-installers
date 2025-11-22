import { MetadataRoute } from 'next';

// The Architect (Claude 4.5 Sonnet)
// Component: Sitemap Generator
// Task: Generate XML sitemap for SEO indexing.

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ev-installers.vercel.app'; // Replace with real domain later

    // Static Routes
    const routes = [
        '',
        '/admin/dashboard',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Routes (Sample - In production, fetch from Supabase)
    const cities = [
        { state: 'TX', city: 'Austin' },
        { state: 'CA', city: 'San-Francisco' },
        { state: 'FL', city: 'Miami' },
        { state: 'NY', city: 'New-York' },
    ];

    const cityRoutes = cities.map((place) => ({
        url: `${baseUrl}/installers/${place.state}/${place.city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...cityRoutes];
}
