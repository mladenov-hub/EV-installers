import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// The Strategist (Gemini 3)
// Role: Content Director
// Task: Generate unique, high-value content using Spintax and local data.

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

interface CityData {
    city: string;
    state: string;
    installerCount: number;
    avgCost: number;
    utility: string;
}

class SpintaxGenerator {
    // Helper to process {Option A|Option B|Option C}
    static spin(text: string): string {
        return text.replace(/\{([^{}]*)\}/g, (match, choices) => {
            const options = choices.split('|');
            return options[Math.floor(Math.random() * options.length)];
        });
    }

    static generateIntro(data: CityData, strategy: 'COST' | 'SPEED' | 'VALUE'): string {
        let template = '';

        switch (strategy) {
            case 'COST':
                template = "{Looking to save money|Want to avoid overpaying|Need the best price} on your EV charger installation in {city}? " +
                    "Our database tracks {count} {local|verified|licensed} electricians in {state} who can help you {get the job done|install your station} for an average of ${cost}. " +
                    "{Don't pay too much|Stop guessing prices}; compare quotes today.";
                break;
            case 'SPEED':
                template = "{Need a charge fast|In a rush to charge|Want faster charging} in {city}? " +
                    "Stop using {slow|trickle} Level 1 chargers. We found {count} pros in {city} ready to install a Level 2 station {immediately|this week|ASAP}. " +
                    "Get back on the road {faster|sooner} with a professional install.";
                break;
            case 'VALUE':
                template = "{Boost your home value|Increase your property value|Invest in your home} in {city} with a dedicated EV charging station. " +
                    "With {count} experts available in {state}, adding a Level 2 charger is a {smart|wise|brilliant} investment. " +
                    "Works perfectly with {local utility|your power company}, {utility}.";
                break;
        }

        // First pass: Replace variables
        const content = template
            .replace(/{city}/g, data.city)
            .replace(/{state}/g, data.state)
            .replace(/{count}/g, data.installerCount.toString())
            .replace(/{cost}/g, data.avgCost.toString())
            .replace(/{utility}/g, data.utility);

        // Second pass: Process Spintax
        return this.spin(content);
    }
}

async function runStrategist() {
    console.log("🧠 Strategist (Gemini 3): Initializing Content Engine...");

    // 1. Fetch Unique Cities from Installers Table
    const { data: installers, error } = await supabase
        .from('installers')
        .select('city, state, utility_provider');

    if (error || !installers) {
        console.error("❌ Failed to fetch installers:", error);
        return;
    }

    // Group by City
    const cityMap = new Map<string, CityData>();

    installers.forEach(inst => {
        const key = `${inst.city}-${inst.state}`;
        if (!cityMap.has(key)) {
            cityMap.set(key, {
                city: inst.city,
                state: inst.state,
                installerCount: 0,
                avgCost: 450, // Default estimate
                utility: inst.utility_provider || 'Local Utility'
            });
        }
        const cityData = cityMap.get(key)!;
        cityData.installerCount++;
    });

    console.log(`📊 Found ${cityMap.size} unique cities.`);

    // 2. Generate and Save Content
    for (const cityData of cityMap.values()) {
        const strategy = ['COST', 'SPEED', 'VALUE'][Math.floor(Math.random() * 3)] as 'COST' | 'SPEED' | 'VALUE';
        const content = SpintaxGenerator.generateIntro(cityData, strategy);

        const metaTitle = `Top ${cityData.installerCount} EV Charger Installers in ${cityData.city}, ${cityData.state}`;
        const metaDesc = `Compare ${cityData.installerCount} verified EV charger installers in ${cityData.city}. Get quotes for Tesla, ChargePoint, and Level 2 home stations.`;

        console.log(`   > Generating for ${cityData.city} (${strategy})...`);

        const { error: upsertError } = await supabase
            .from('city_content')
            .upsert({
                city: cityData.city,
                state: cityData.state,
                intro_text: content,
                meta_title: metaTitle,
                meta_description: metaDesc
            }, { onConflict: 'city, state' });

        if (upsertError) console.error(`     ❌ Error saving ${cityData.city}:`, upsertError.message);
    }

    console.log("✅ Content generation complete.");
}

// Run
if (require.main === module) {
    runStrategist();
}
