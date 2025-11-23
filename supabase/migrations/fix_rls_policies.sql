-- Fix RLS and Policies for Security and Performance

-- 1. Enable RLS on public tables
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- 2. Policies for agent_logs
-- Allow service role (agents) to do everything
CREATE POLICY "Service role full access agent_logs" ON public.agent_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin dashboard) to read logs
CREATE POLICY "Auth users view agent_logs" ON public.agent_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. Policies for leads
-- Allow anyone (anon) to insert leads (Lead Form)
CREATE POLICY "Public insert leads" ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated users (admin) to view leads
CREATE POLICY "Auth users view leads" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 4. Policies for locations
-- Allow public read access (for site navigation/search)
CREATE POLICY "Public read locations" ON public.locations
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. Fix Duplicate/Permissive Policies on city_content
-- First, drop existing policies to clean up
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_content;
DROP POLICY IF EXISTS "Enable read access for anon" ON public.city_content;
DROP POLICY IF EXISTS "Enable read access for authenticated" ON public.city_content;

-- Re-create a single clean read policy
CREATE POLICY "Public read city_content" ON public.city_content
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access city_content" ON public.city_content
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
