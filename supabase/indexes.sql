-- Additional Indexes for Performance
-- Run this in the Supabase SQL Editor

-- Index for State lookups (used in City Pages)
CREATE INDEX IF NOT EXISTS installers_state_idx ON installers(state);

-- Index for Business Name sorting
CREATE INDEX IF NOT EXISTS installers_business_name_idx ON installers(business_name);

-- Index for Leads status (for Admin Dashboard filtering)
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
