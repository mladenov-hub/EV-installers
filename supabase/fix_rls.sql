-- Check and Enable Public Read Access
-- 1. Installers Table
ALTER TABLE installers ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflict
DROP POLICY IF EXISTS "Allow public read access" ON installers;

-- Create Policy: Anyone can SELECT
CREATE POLICY "Allow public read access"
ON installers FOR SELECT
TO public
USING (true);

-- 2. City Content Table
ALTER TABLE city_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON city_content;

CREATE POLICY "Allow public read access"
ON city_content FOR SELECT
TO public
USING (true);

-- 3. Locations Table
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON locations;

CREATE POLICY "Allow public read access"
ON locations FOR SELECT
TO public
USING (true);
