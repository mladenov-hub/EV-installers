# Project Master Context: EV Installer pSEO Platform

**Last Updated:** 2025-11-22
**Status:** ✅ Development Complete | 🚀 Deploying Agents to Production
**Architecture:** Modular Monolith with Autonomous Serverless Agents (Vercel Cron)

## 1. Project Mission
A Programmatic SEO (pSEO) platform designed to capture organic search traffic for "EV charger installers in [City], [State]" queries.
*   **Primary Goal:** Generate leads for electricians and sell them via arbitrage (Networx/Angi).
*   **Secondary Goal:** Affiliate revenue via Amazon Associates (EV Chargers).
*   **Target Audience:** EV owners needing home charging installation.

## 2. "God Mode" 8-Agent Swarm Architecture
We leverage a specialized team of 8 AI agents.
**UPDATE (Nov 22):** The architecture has shifted from manual CLI scripts to **Autonomous Vercel Cron Jobs** for the core operational agents.

### A. The Autonomous Swarm (Vercel Cron)
These agents run automatically on a schedule without human intervention.

| Agent Name | Role | Schedule | Endpoint | Function |
| :--- | :--- | :--- | :--- | :--- |
| **The Promoter** | Outreach | Daily @ 10 AM | `/api/cron/promoter` | Automates directory submissions & email outreach. |
| **The Auditor** | QA & Health | Weekly (Mon) | `/api/cron/auditor` | Checks site health (200 OK) & broken links. |
| **The Operator** | Data Integrity | Weekly (Sun) | `/api/cron/operator` | Validates database stats & data quality. |

### B. The Strategic Swarm (Manual/Ad-Hoc)
These agents are invoked manually for specific development or strategy tasks.

| Agent Name | Role | Model | Function |
| :--- | :--- | :--- | :--- |
| **The Overseer** | Project Manager | Claude 3.5 Sonnet | High-level orchestration & planning. |
| **The Architect** | Lead Developer | Claude 3.5 Sonnet | Next.js/Supabase implementation. |
| **The Liaison** | Business Logic | Claude 3.5 Haiku | API integrations & monetization logic. |
| **The Strategist** | Content Director | Gemini 2.0 Flash | Content generation & Spintax. |
| **The Analyst** | Growth Hacker | Gemini 2.0 Flash | PostHog analytics & optimization. |

## 3. System Architecture & Tech Stack

### Core Application
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Database:** Supabase (PostgreSQL)
*   **Hosting:** Vercel (Edge/Serverless)
*   **UI:** Tailwind CSS, Lucide React

### Key Directories
*   `app/`: Next.js App Router (Pages & API).
*   `app/api/cron/`: **[NEW]** Autonomous Agent Endpoints.
*   `app/admin/dashboard/`: **[UPDATED]** Real-time "God Mode" Dashboard.
*   `scripts/`: Legacy/Manual CLI scripts (being phased out or kept for utils).
*   `supabase/`: SQL Schemas (including new `agent_logs`).

### Data Schema
*   **`installers`**: Core business data (Electricians).
*   **`leads`**: User inquiries captured via `/api/leads`.
*   **`city_content`**: SEO metadata for pSEO pages.
*   **`agent_logs`**: **[NEW]** Audit trail for autonomous agent actions.

## 4. Security Protocols (CRITICAL)

### Agent Security
*   **Cron Authentication:** All Cron Agents require a `Authorization: Bearer <CRON_SECRET>` header.
    *   `CRON_SECRET` is stored in `.env.local` and Vercel Environment Variables.
    *   Verified by `lib/cron-utils.ts`.
*   **Database Access:**
    *   Client-side (UI): Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (RLS restricted).
    *   Agents (Server-side): Use `SUPABASE_SERVICE_KEY` (Full Admin Access) for reliable logging and data ops.

### Admin Security
*   **Dashboard:** Protected by basic cookie auth (`auth_token`).
*   **Agent Control Panel:** Requires manual entry of `CRON_SECRET` to trigger agents from the UI.

## 5. Current Status & Roadmap

### ✅ Completed Milestones
1.  **Core pSEO Engine:** `installers/[state]/[city]` dynamic routing works.
2.  **Lead Capture:** Functional Form + Supabase + Email Notification.
3.  **Agent Autonomy:** Successfully migrated Promoter, Auditor, and Operator to Vercel Cron.
4.  **Monitoring:** Admin Dashboard now streams `agent_logs` in real-time.

### 🔄 Immediate Next Steps
1.  **Deploy to Production:** Push latest changes to Vercel.
2.  **Verify Production Cron:** Ensure Vercel Scheduler actually triggers the agents.
3.  **Outreach Scale-Up:** Switch `Promoter` from "Simulation Mode" to real emailing (update SMTP creds).
4.  **Content Expansion:** Use `Strategist` to generate more city content rows.

## 6. How to Operate

### Triggering Agents Manually
Go to `/admin/dashboard`, enter the `CRON_SECRET` in the Agent Control Panel, and click "Run".

### viewing Logs
The Admin Dashboard (`/admin/dashboard`) displays a live feed of the `agent_logs` table.

### Modifying Agents
Edit the files in `app/api/cron/[agent_name]/route.ts`.
*   Always use `logAgentAction()` to ensure visibility in the dashboard.
*   Keep execution under 60s (Vercel Function Timeout) or use batching.
