-- SQL to check the constraint on the experience column in maid_profiles table

-- Check the constraint definition
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_experience_check';

-- Check the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'maid_profiles'
ORDER BY ordinal_position;

-- Check if there are any existing profiles to see what values are being used
SELECT id, user_id, full_name, experience
FROM maid_profiles
LIMIT 10; 