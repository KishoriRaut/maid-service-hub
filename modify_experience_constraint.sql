-- SQL to modify the constraint on the experience column in maid_profiles table

-- Drop the existing constraint if it exists
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_experience_check;

-- Add a new constraint that accepts the exact string values from the dropdown
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_experience_check 
CHECK (
    experience IN ('fresher', '1+', '2+', '3+', '4+', '5+', '10+')
); 