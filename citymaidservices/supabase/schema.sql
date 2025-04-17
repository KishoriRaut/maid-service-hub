-- Create maid_profiles table
CREATE TABLE IF NOT EXISTS maid_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    religion TEXT,
    languages TEXT[] NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    working_time TEXT NOT NULL,
    salary_range TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    services TEXT[] NOT NULL,
    image_url TEXT,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employer_profiles table
CREATE TABLE IF NOT EXISTS employer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_range TEXT NOT NULL,
    working_time TEXT NOT NULL,
    required_services TEXT[] NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table to track unlocked contacts (bidirectional)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL,
    contact_type TEXT NOT NULL, -- 'maid' or 'employer'
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_id TEXT,
    UNIQUE(user_id, contact_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NPR',
    status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_id TEXT,
    description TEXT
);

-- Drop existing tables if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Maid profiles are viewable by everyone" ON maid_profiles;
DROP POLICY IF EXISTS "Users can insert their own maid profile" ON maid_profiles;
DROP POLICY IF EXISTS "Users can update their own maid profile" ON maid_profiles;
DROP POLICY IF EXISTS "Employer profiles are viewable by everyone" ON employer_profiles;
DROP POLICY IF EXISTS "Users can insert their own employer profile" ON employer_profiles;
DROP POLICY IF EXISTS "Users can update their own employer profile" ON employer_profiles;
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Employers can insert their own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;

-- Create RLS policies
ALTER TABLE maid_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Maid profiles policies
CREATE POLICY "Maid profiles are viewable by everyone" 
    ON maid_profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own maid profile" 
    ON maid_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maid profile" 
    ON maid_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Employer profiles policies
CREATE POLICY "Employer profiles are viewable by everyone" 
    ON employer_profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own employer profile" 
    ON employer_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile" 
    ON employer_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" 
    ON jobs FOR SELECT 
    USING (true);

CREATE POLICY "Employers can insert their own jobs" 
    ON jobs FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM employer_profiles 
        WHERE employer_profiles.id = jobs.employer_id 
        AND employer_profiles.user_id = auth.uid()
    ));

CREATE POLICY "Employers can update their own jobs" 
    ON jobs FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM employer_profiles 
        WHERE employer_profiles.id = jobs.employer_id 
        AND employer_profiles.user_id = auth.uid()
    ));

-- Contacts policies (bidirectional)
CREATE POLICY "Users can view their own contacts" 
    ON contacts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts" 
    ON contacts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" 
    ON payments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" 
    ON payments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_maid_profiles_updated_at
BEFORE UPDATE ON maid_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at
BEFORE UPDATE ON employer_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 