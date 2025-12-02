# Project Master Context: EV Installer pSEO Platform

**Last Updated:** 2025-11-26
**Status:** ✅ Real Data Integrated | 🚀 Live on Vercel
**Architecture:** Lead Capture Engine with **n8n Automation** & **Angi API**

## 1. Project Mission
A high-volume **Programmatic SEO (pSEO) Lead Generation Platform** for EV charger installations.
*   **Primary Goal:** Capture homeowner intent ("EV charger installers near me") and sell leads to **Angi** via API.
*   **Model:** Affiliate / Pay-Per-Lead (Arbitrage).
*   **Key Pivot (Dec 1):** We NO LONGER list specific installers. We provide a "Matchmaking" service.
*   **Target Scale:** 10,000+ City Landing Pages.

## 2. "God Mode" Automation Architecture
The system is now centered on **Content Generation** and **Lead Routing**.

### A. The Autonomous Swarm (n8n Workflows)
| Agent Name | Role | Platform | Function |
| :--- | :--- | :--- | :--- |
| **The Strategist** | **Content Engine** | n8n | **CRITICAL.** Generates high-quality, unique content for 10,000+ city pages. |
| **The Liaison** | Lead Router | n8n | Receives form submissions -> Validates -> Sends to **Angi API**. |
| **The Promoter** | Outreach | n8n | Builds backlinks to city pages to improve ranking. |
| **The Operator** | *Deprecated* | n8n | *Formerly Scraper. Now repurposed for City Discovery/Data Mining.* |


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

