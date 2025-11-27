-- DANGER: This script deletes ALL data from the installers table.
-- Run this only when you are ready to replace fake data with real Google Places data.

TRUNCATE TABLE installers RESTART IDENTITY CASCADE;

-- Optional: If you want to keep the locations but just clear installers
-- TRUNCATE TABLE installers RESTART IDENTITY CASCADE;

-- If you also want to clear leads associated with these fake installers
-- TRUNCATE TABLE leads RESTART IDENTITY CASCADE;
