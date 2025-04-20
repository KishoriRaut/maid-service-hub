-- SQL to check and fix the working_time constraint

-- First, check the current constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_working_time_check';

-- Drop the existing constraint
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_working_time_check;

-- Add a new constraint that accepts the exact string values from the dropdown
-- Using the exact syntax that Supabase is using
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_working_time_check 
CHECK (
    working_time = ANY (ARRAY['morning'::text, 'day'::text, 'evening'::text, 'night'::text, '24hours'::text, 'flexible'::text])
);

-- Verify the new constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_working_time_check'; 