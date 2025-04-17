-- Drop existing table and related objects
DROP TRIGGER IF EXISTS update_maid_profiles_updated_at ON maid_profiles;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS maid_profiles;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create fresh maid_profiles table
CREATE TABLE maid_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Personal Information
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    gender TEXT NOT NULL CHECK (gender IN ('female', 'male', 'other')),
    religion TEXT CHECK (religion IN ('hinduism', 'buddhism', 'christianity', 'islam', 'sikhism', 'jainism', 'kirat', 'bon', 'other')),
    languages TEXT[] NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    image_url TEXT,
    
    -- Work Preferences
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    working_time TEXT NOT NULL CHECK (working_time IN ('morning', 'day', 'evening', 'night', '24hours')),
    salary_range TEXT NOT NULL CHECK (salary_range IN ('6000-10000', '10000-15000', '15000-20000', '20000-25000', '25000-30000', '30000+')),
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    services TEXT[] NOT NULL CHECK (
        services <@ ARRAY['cooking', 'cleaning', 'babysitting', 'elder_care', 'pet_care', 
                          'laundry', 'office_help', 'gardening', 'shopping', 'ironing', 
                          'postnatal_massage', 'sick_care']
    ),
    
    -- Additional Information
    additional_info TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE maid_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Maid profiles are viewable by everyone" 
    ON maid_profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own maid profile" 
    ON maid_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maid profile" 
    ON maid_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_maid_profiles_updated_at
    BEFORE UPDATE ON maid_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 