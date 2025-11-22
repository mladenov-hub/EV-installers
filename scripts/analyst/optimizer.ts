// The Analyst (Gemini 3)
// Role: Optimization & Analytics
// Task: Monitor PostHog data, identify trends, and trigger automated actions (Kill/Promote).

interface PageMetrics {
    path: string;
    views: number;
    bounceRate: number; // Percentage (0-100)
    conversions: number;
    avgTimeOnPage: number; // Seconds
}

interface OptimizationAction {
    type: 'KILL' | 'REWRITE' | 'PROMOTE' | 'KEEP';
    reason: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

class Analyst {
    static analyze(metrics: PageMetrics): OptimizationAction {
        console.log(`📈 Analyst (Gemini 3): Analyzing ${metrics.path}...`);

        // 1. The "Kill Switch" (Dead Weight)
        // High Bounce Rate + Low Time on Page = Irrelevant Content
        if (metrics.bounceRate > 85 && metrics.avgTimeOnPage < 10) {
            return {
                type: 'KILL',
                reason: `High Bounce Rate (${metrics.bounceRate}%) & Low Engagement (${metrics.avgTimeOnPage}s).`,
                priority: 'HIGH'
            };
        }

        // 2. The "Rewrite" Trigger (Missed Opportunity)
        // High Traffic + Low Conversions = Bad Offer/CTA
        if (metrics.views > 1000 && metrics.conversions === 0) {
            return {
                type: 'REWRITE',
                reason: `High Traffic (${metrics.views}) but Zero Conversions. Needs CRO.`,
                priority: 'HIGH'
            };
        }

        // 3. The "Unicorn" Detector (Winners)
        // High Conversion Rate (> 5%)
        const conversionRate = (metrics.conversions / metrics.views) * 100;
        if (conversionRate > 5 && metrics.views > 100) {
            return {
                type: 'PROMOTE',
                reason: `High Conversion Rate (${conversionRate.toFixed(1)}%). Replicate this template.`,
                priority: 'MEDIUM'
            };
        }

        return { type: 'KEEP', reason: 'Performance within normal parameters.', priority: 'LOW' };
    }
}

// Simulation
if (require.main === module) {
    const samplePages: PageMetrics[] = [
        { path: "/installers/tx/austin", views: 5000, bounceRate: 45, conversions: 350, avgTimeOnPage: 120 }, // Unicorn
        { path: "/installers/nd/nowhere", views: 5, bounceRate: 95, conversions: 0, avgTimeOnPage: 2 },     // Dead
        { path: "/installers/ca/la", views: 12000, bounceRate: 60, conversions: 0, avgTimeOnPage: 45 }      // Needs Rewrite
    ];

    console.log("🧠 Analyst: Running Weekly Optimization Scan...\n");

    samplePages.forEach(page => {
        const action = Analyst.analyze(page);
        console.log(`📍 ${page.path}`);
        console.log(`   Action: ${action.type}`);
        console.log(`   Reason: ${action.reason}`);
        console.log("-".repeat(50));
    });
}
