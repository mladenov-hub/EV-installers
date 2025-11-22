import dotenv from 'dotenv';

// The Liaison (Claude 4.5 Haiku)
// Role: Monetization & Integration
// Task: Route leads to APIs (Zapier/Make) and handle affiliate link rotation.

interface Lead {
    name: string;
    email: string;
    phone: string;
    zip: string;
    projectType: "install" | "repair";
    vehicle?: string;
}

interface AffiliateProduct {
    id: string;
    name: string;
    links: { url: string; weight: number }[]; // Weighted rotation for A/B testing
}

// Mock Affiliate Configuration
const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || 'evinstallers2-20';

const AFFILIATE_PRODUCTS: Record<string, AffiliateProduct> = {
    "charger-level-2": {
        id: "charger-level-2",
        name: "Top Rated Level 2 Charger",
        links: [
            { url: `https://amazon.com/dp/B00000?tag=${TAG}`, weight: 70 }, // Primary
            { url: "https://manufacturer.com/?ref=ev-pseo", weight: 30 }      // Direct partnership
        ]
    }
};

export class Liaison {
    static async routeLead(lead: Lead): Promise<{ success: boolean; provider: string; message: string }> {
        console.log(`🤝 Liaison (Claude 4.5 Haiku): Processing lead for ${lead.name} (${lead.zip})...`);

        // Simulate API Latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Logic: Route based on Zip Code
        // In production, this would hit a Zapier Webhook
        if (lead.zip.startsWith("9")) {
            console.log("   > Routing to: Premium Network (West Coast)");
            return { success: true, provider: "PremiumNet", message: "Lead accepted by PremiumNet" };
        } else {
            console.log("   > Routing to: National Aggregator (General)");
            return { success: true, provider: "Networx", message: "Lead accepted by Networx" };
        }
    }

    static getAffiliateLink(productId: string): string {
        const product = AFFILIATE_PRODUCTS[productId];
        if (!product) return "#";

        // Weighted Random Selection
        const totalWeight = product.links.reduce((sum, link) => sum + link.weight, 0);
        let random = Math.random() * totalWeight;

        for (const link of product.links) {
            if (random < link.weight) return link.url;
            random -= link.weight;
        }

        return product.links[0].url; // Fallback
    }
}

// Simulation
if (require.main === module) {
    (async () => {
        // Test Lead Routing
        const result = await Liaison.routeLead({
            name: "Alice Smith",
            email: "alice@test.com",
            phone: "555-0199",
            zip: "94105",
            projectType: "install",
            vehicle: "Tesla Model Y"
        });
        console.log("   Result:", result);

        // Test Affiliate Rotation
        console.log("\n🔄 Liaison: Testing Affiliate Link Rotation (10 clicks):");
        for (let i = 0; i < 10; i++) {
            console.log(`   Click ${i + 1}: ${Liaison.getAffiliateLink("charger-level-2")}`);
        }
    })();
}
