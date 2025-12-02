# EV Installer Programmatic SEO Platform

## Project Overview
This is a **Programmatic SEO (pSEO) Lead Generation Platform** designed to capture organic search traffic for "EV charger installers in [City], [State]" queries.

**The Strategy:**
1.  **Traffic:** Generate 10,000+ unique landing pages (one for every city).
2.  **Conversion:** Use a **"Get Matched" Lead Form** instead of listing specific installers.
3.  **Monetization:** Send captured leads to the **Angi API** for a commission.

The core of the project is an **n8n Automation Swarm** that handles content generation at scale.

## Architecture

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Database:** Supabase (PostgreSQL) - *Stores Leads & Content, not Installer Listings.*
*   **Automation:** n8n (Docker)
*   **Integration:** Angi API (Lead Selling)

### The "God Mode" Swarm
The system uses a specialized team of AI agents running on n8n:

1.  **Autonomous Agents (n8n Workflows):**
    *   **The Strategist:** **(Main Priority)** Generates SEO content for thousands of pages using AI Agents.
    *   **The Liaison:** Handles the Lead Form submission and API connection to Angi.
    *   **The Promoter:** Automates backlink building.

2.  **Strategic Agents (Manual/Ad-Hoc):**
    *   **The Overseer:** Project management and orchestration.
    *   **The Architect:** Codebase implementation (Next.js/Supabase).
    *   **The Strategist:** Content generation using Spintax.
    *   **The Analyst:** Optimization and PostHog analytics.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file with the following keys:
```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=... # Required for Agents (Write Access)

# Security
CRON_SECRET=... # Random string for securing Vercel Cron jobs
ADMIN_PASSWORD=... # Password for /admin/dashboard

# External Services
SMTP_USER=... # Gmail for outreach
SMTP_PASS=... # App Password
NEXT_PUBLIC_AMAZON_TAG=... # Associate ID
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Directory Structure

*   **`app/`**: Next.js App Router.
    *   `app/installers/[state]/`: **[NEW]** State-level aggregation pages.
    *   `app/installers/[state]/[city]/`: Dynamic pSEO landing pages with **Google Maps**.
    *   `app/admin/dashboard/`: Real-time "God Mode" dashboard for monitoring agents.
    *   `app/api/cron/`: Endpoints for autonomous agents (Promoter, Operator).
    *   `app/api/leads/`: Lead capture endpoint.
    *   `components/`: UI Components (including new `ZipSearch.tsx`).
*   **`scripts/`**: Legacy and manual agent scripts (e.g., seeding data).
*   **`supabase/`**: SQL schemas and migration scripts (`agent_logs`, `installers`).
*   **`lib/`**: Shared utilities, including `cron-utils.ts` for security and logging.
*   **`data/`**: Raw CSV data sources.

## Agent Operations

### Monitoring
Navigate to `/admin/dashboard` to view real-time logs of agent activities. The system uses a `agent_logs` table in Supabase to track every action (e.g., "Promoter sent 5 emails").

### Manual Triggering
You can manually trigger an agent (even autonomous ones) via the **Agent Control Panel** in the dashboard. You will need the `CRON_SECRET` to authorize the execution.

### Modifying Agents
Agent logic is located in `app/api/cron/[agent_name]/route.ts`.
*   **Important:** Always use the `logAgentAction` utility to ensure visibility in the dashboard.
*   **Timeout:** Keep execution under 60 seconds (Vercel Limit) or use batching (e.g., process 5 items per run).

## Deployment

The project is configured for **Vercel**.
*   **Build Command:** `next build`
*   **Cron Jobs:** defined in `vercel.json`.
*   **Environment Variables:** Ensure all keys from `.env.local` are added to Vercel Project Settings.

## Key Commands
*   `npm run dev`: Start dev server.
*   `npm run build`: Build for production.
*   `npm run lint`: Run ESLint.
