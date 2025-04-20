-- Comprehensive SQL to examine maid_profiles table structure and constraints

-- Check table existence
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'maid_profiles'
);

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'maid_profiles'
ORDER BY ordinal_position;

-- Check all constraints on the table
SELECT con.conname AS constraint_name,
       con.contype AS constraint_type,
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'maid_profiles'
AND nsp.nspname = 'public';

-- Check specific constraint on experience column
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name = 'maid_profiles_experience_check';

-- Check if there are any existing profiles
SELECT COUNT(*) FROM maid_profiles;

-- Check sample data if any exists
SELECT id, user_id, full_name, experience, work_type, working_time, salary_range
FROM maid_profiles
LIMIT 5; 