-- Comprehensive SQL to fix all constraints on the maid_profiles table

-- First, check all constraints on the table
SELECT con.conname AS constraint_name,
       con.contype AS constraint_type,
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'maid_profiles'
AND nsp.nspname = 'public';

-- Drop all check constraints that might be causing issues
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_experience_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_work_type_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_working_time_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_salary_range_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_gender_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_religion_check;
ALTER TABLE maid_profiles DROP CONSTRAINT IF EXISTS maid_profiles_status_check;

-- Add new constraints that match exactly what the form is sending

-- Experience constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_experience_check 
CHECK (
    experience = ANY (ARRAY['fresher'::text, '1+'::text, '2+'::text, '3+'::text, '4+'::text, '5+'::text, '10+'::text])
);

-- Work type constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_work_type_check 
CHECK (
    work_type = ANY (ARRAY['part_time'::text, 'full_time'::text, '24hours'::text, 'couple'::text])
);

-- Working time constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_working_time_check 
CHECK (
    working_time = ANY (ARRAY['morning'::text, 'day'::text, 'evening'::text, 'night'::text, '24hours'::text, 'flexible'::text])
);

-- Salary range constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_salary_range_check 
CHECK (
    salary_range = ANY (ARRAY['6000-10000'::text, '10000-15000'::text, '15000-20000'::text, '20000-25000'::text, '25000-30000'::text, '30000+'::text])
);

-- Gender constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_gender_check 
CHECK (
    gender = ANY (ARRAY['female'::text, 'male'::text, 'other'::text])
);

-- Religion constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_religion_check 
CHECK (
    religion = ANY (ARRAY['hinduism'::text, 'buddhism'::text, 'christianity'::text, 'islam'::text, 'other'::text, ''::text])
);

-- Status constraint
ALTER TABLE maid_profiles ADD CONSTRAINT maid_profiles_status_check 
CHECK (
    status = ANY (ARRAY['active'::text, 'inactive'::text, 'pending'::text])
);

-- Verify all constraints
SELECT con.conname AS constraint_name,
       con.contype AS constraint_type,
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'maid_profiles'
AND nsp.nspname = 'public'; 