-- SQL to check and fix the work_type constraint

-- First, check the current constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_work_type_check';

-- Drop the existing constraint
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_work_type_check;

-- Add a new constraint that accepts the exact string values from the dropdown
-- Using the exact syntax that Supabase is using
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_work_type_check 
CHECK (
    work_type = ANY (ARRAY['part_time'::text, 'full_time'::text, '24hours'::text, 'couple'::text])
);

-- Verify the new constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_work_type_check'; 