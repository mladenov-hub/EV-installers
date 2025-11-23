-- Migration: Add Google Places API columns to installers table
-- Date: 2025-11-23
-- Purpose: Support storing data fetched from Google Places API

-- Add rating column for Google Places rating (1.0 to 5.0)
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS rating numeric(2,1) CHECK (rating >= 0 AND rating <= 5);

-- Add review count column for number of Google reviews
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS review_count integer CHECK (review_count >= 0);

-- Add address column for full street address from Google Places
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS address text;

-- Add place_id column to track Google Places unique identifier
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Add website column if it doesn't exist (may be fetched from Google Places)
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS website text;

-- Create index on google_place_id for faster lookups and duplicate prevention
CREATE INDEX IF NOT EXISTS installers_google_place_id_idx ON installers (google_place_id);

-- Add updated_at column to track when Google Places data was last refreshed
ALTER TABLE installers
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_installers_updated_at BEFORE UPDATE ON installers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();