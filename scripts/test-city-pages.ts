import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Cities to test
const CITIES = [
    { name: "San Francisco", state: "CA", slug: "san-francisco" },
    { name: "Los Angeles", state: "CA", slug: "los-angeles" },
    { name: "New York", state: "NY", slug: "new-york" },
    { name: "Miami", state: "FL", slug: "miami" },
    { name: "Austin", state: "TX", slug: "austin" },
    { name: "Seattle", state: "WA", slug: "seattle" },
    { name: "Denver", state: "CO", slug: "denver" },
    { name: "Phoenix", state: "AZ", slug: "phoenix" },
    { name: "Boston", state: "MA", slug: "boston" },
    { name: "Chicago", state: "IL", slug: "chicago" }
];

async function testCityData() {
    console.log('🧪 Testing City Data in Database\n');
    console.log('=' .repeat(60));

    let totalInstallers = 0;
    let citiesWithData = 0;
    let citiesWithoutData = 0;

    for (const city of CITIES) {
        // Query the database exactly how the frontend does
        const { data, count, error } = await supabase
            .from('installers')
            .select('*', { count: 'exact' })
            .ilike('city', city.name)
            .ilike('state', city.state);

        if (error) {
            console.log(`❌ ${city.name}, ${city.state}: ERROR - ${error.message}`);
        } else {
            const installerCount = count || 0;
            totalInstallers += installerCount;

            if (installerCount > 0) {
                citiesWithData++;
                console.log(`✅ ${city.name}, ${city.state}: ${installerCount} installers`);
                console.log(`   URL: http://localhost:3000/installers/${city.state.toLowerCase()}/${city.slug}`);

                // Show first installer as sample
                if (data && data.length > 0) {
                    console.log(`   Sample: "${data[0].business_name}" - ${data[0].phone || 'No phone'}`);
                }
            } else {
                citiesWithoutData++;
                console.log(`⚠️  ${city.name}, ${city.state}: 0 installers`);
                console.log(`   URL: http://localhost:3000/installers/${city.state.toLowerCase()}/${city.slug}`);
            }
        }
        console.log('');
    }

    console.log('=' .repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   Total Cities: ${CITIES.length}`);
    console.log(`   Cities with data: ${citiesWithData}`);
    console.log(`   Cities without data: ${citiesWithoutData}`);
    console.log(`   Total installers: ${totalInstallers}`);

    // Test specific San Francisco query variants
    console.log('\n' + '=' .repeat(60));
    console.log('🔍 Testing San Francisco Query Variants:');

    const queries = [
        { city: 'San Francisco', state: 'CA' },
        { city: 'san francisco', state: 'CA' },
        { city: 'San Francisco', state: 'ca' },
        { city: 'san francisco', state: 'ca' }
    ];

    for (const query of queries) {
        const { count } = await supabase
            .from('installers')
            .select('*', { count: 'exact', head: true })
            .ilike('city', query.city)
            .ilike('state', query.state);

        console.log(`   Query: city="${query.city}", state="${query.state}" => ${count || 0} results`);
    }

    console.log('\n✨ Test Complete!');
    console.log('\nVisit these URLs to see the pages:');
    console.log('   - http://localhost:3000/installers/ca/san-francisco (Should show 5 installers)');
    console.log('   - http://localhost:3000/installers/ca/los-angeles');
    console.log('   - http://localhost:3000/installers/ny/new-york');
}

testCityData();