import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY in .env.local');
    process.exit(1);
}

console.log('🔑 API Key found:', GOOGLE_API_KEY.substring(0, 10) + '...');

async function testGooglePlacesAPI() {
    console.log('\n🧪 Testing Google Places API with different queries...\n');

    const url = 'https://places.googleapis.com/v1/places:searchText';

    // Test different queries to find the best one
    const queries = [
        'electricians EV charging installation service San Francisco, CA',
        'Tesla wall connector installation San Francisco, CA',
        'electrical contractor EV charger San Francisco, CA'
    ];

    for (const query of queries) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📍 Query: "${query}"`);
        console.log(`${'='.repeat(60)}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_API_KEY,
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.types'
                },
                body: JSON.stringify({
                    textQuery: query,
                    maxResultCount: 3
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error('❌ API Error:', data.error.message);
                continue;
            }

            const places = data.places || [];
            console.log(`✅ Found ${places.length} results:\n`);

            places.forEach((place: any, index: number) => {
                console.log(`${index + 1}. ${place.displayName?.text || 'Unknown'}`);
                console.log(`   📍 ${place.formattedAddress || 'No address'}`);
                console.log(`   📞 ${place.nationalPhoneNumber || 'No phone'}`);
                console.log(`   ⭐ Rating: ${place.rating || 'N/A'}`);
                console.log(`   📂 Types: ${place.types?.join(', ') || 'N/A'}`);
            });

        } catch (error: any) {
            console.error('❌ Network Error:', error.message);
        }

        // Small delay between queries
        await new Promise(r => setTimeout(r, 500));
    }
}

testGooglePlacesAPI();