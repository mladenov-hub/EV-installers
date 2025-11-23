-- Fix "Multiple Permissive Policies" Performance Issue
-- This script removes ALL conflicting policies and creates a single clean set.

-- 1. Clean up 'city_content' duplicates AND existing target policies
DROP POLICY IF EXISTS "Allow public read access" ON public.city_content;
DROP POLICY IF EXISTS "Public read city_content" ON public.city_content;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.city_content;
DROP POLICY IF EXISTS "Allow service role full access" ON public.city_content;
DROP POLICY IF EXISTS "Service role full access city_content" ON public.city_content;

-- 2. Create ONE clean read policy
CREATE POLICY "Public read city_content" ON public.city_content
    FOR SELECT
    TO public
    USING (true);

-- 3. Create ONE clean service policy
CREATE POLICY "Service role full access city_content" ON public.city_content
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Clean up 'installers' table (Preventative)
DROP POLICY IF EXISTS "Allow public read access" ON public.installers;
DROP POLICY IF EXISTS "Public read installers" ON public.installers;

-- 5. Re-create ONE single read policy for installers
CREATE POLICY "Public read installers" ON public.installers
    FOR SELECT
    TO public
    USING (true);

-- 6. Re-create ONE service role policy for installers
-- (Note: If one already exists with a different name, it might duplicate, 
-- but 'TO service_role' usually doesn't trigger the 'permissive for authenticated' warning.
-- We'll add this just to be sure agents have access.)
DROP POLICY IF EXISTS "Service role full access installers" ON public.installers;
CREATE POLICY "Service role full access installers" ON public.installers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
