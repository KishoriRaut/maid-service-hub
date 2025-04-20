-- SQL to check and fix the salary_range constraint

-- First, check the current constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_salary_range_check';

-- Drop the existing constraint
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_salary_range_check;

-- Add a new constraint that accepts the exact string values from the dropdown
-- Using the exact syntax that Supabase is using
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_salary_range_check 
CHECK (
    salary_range = ANY (ARRAY['6000-10000'::text, '10000-15000'::text, '15000-20000'::text, '20000-25000'::text, '25000-30000'::text, '30000+'::text])
);

-- Verify the new constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_salary_range_check'; 