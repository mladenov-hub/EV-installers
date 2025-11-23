-- Add website column to installers table
ALTER TABLE installers 
ADD COLUMN IF NOT EXISTS website text;

-- Add pricing_model column (e.g., "Fixed", "Hourly", "Quote")
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS pricing_model text DEFAULT 'Quote';

-- Add starting_price column (numeric)
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS starting_price numeric;
