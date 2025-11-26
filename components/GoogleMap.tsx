// Google Maps Embed Component for Installers
interface GoogleMapProps {
    placeId?: string | null;
    businessName: string;
    address?: string | null;
    phone?: string | null;
}

export default function GoogleMap({ placeId, businessName, address, phone }: GoogleMapProps) {
    // Use the Google Maps Embed API (no API key needed in the frontend)
    // If we have a place_id, use that for the most accurate map
    // Otherwise, use the address or business name as a fallback

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        // Fallback to static map link if no API key
        const query = placeId
            ? `place_id:${placeId}`
            : address || businessName;

        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

        return (
            <div className="w-full h-[300px] bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 mb-2">View on Google Maps</p>
                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Open Map →
                    </a>
                </div>
            </div>
        );
    }

    // Use place ID for the most accurate embedding
    let embedSrc: string;

    if (placeId) {
        // Use place mode for Google Place ID
        embedSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`;
    } else if (address) {
        // Use search mode for address
        embedSrc = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(address)}`;
    } else {
        // Fallback to business name
        embedSrc = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(businessName)}`;
    }

    return (
        <div className="w-full">
            <iframe
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={embedSrc}
                className="rounded-lg shadow-sm"
                title={`Map showing location of ${businessName}`}
            />
            {phone && (
                <div className="mt-2 text-sm text-slate-600">
                    <span className="font-medium">Call:</span>
                    <a href={`tel:${phone}`} className="text-blue-600 hover:underline ml-1">
                        {phone}
                    </a>
                </div>
            )}
        </div>
    );
}