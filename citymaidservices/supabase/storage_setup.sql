-- Create a new storage bucket for maid profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('maid_profile_images', 'maid_profile_images', true);

-- Create storage policy to allow authenticated users to upload their own profile image
CREATE POLICY "Users can upload their own profile image"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'maid_profile_images' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Create storage policy to allow public access to view profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'maid_profile_images');

-- Create storage policy to allow users to update their own profile image
CREATE POLICY "Users can update their own profile image"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'maid_profile_images' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Create storage policy to allow users to delete their own profile image
CREATE POLICY "Users can delete their own profile image"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'maid_profile_images' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
); 