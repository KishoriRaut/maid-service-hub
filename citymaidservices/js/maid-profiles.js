// Use the Supabase client from supabase-config.js
const supabase = window.supabase;

/**
 * Fetch all maid profiles with optional filters
 * @param {Object} filters - Optional filters for the query
 * @param {string} filters.city - Filter by city
 * @param {string} filters.working_time - Filter by working time
 * @param {string} filters.salary_range - Filter by salary range
 * @param {string[]} filters.services - Filter by services (array)
 * @param {number} filters.experience_min - Minimum years of experience
 * @returns {Promise<Array>} - Array of maid profiles
 */
async function fetchMaidProfiles(filters = {}) {
    try {
        let query = supabase
            .from('maid_profiles')
            .select('*');
        
        // Apply filters if provided
        if (filters.city) {
            query = query.eq('city', filters.city);
        }
        
        if (filters.working_time) {
            query = query.eq('working_time', filters.working_time);
        }
        
        if (filters.salary_range) {
            query = query.eq('salary_range', filters.salary_range);
        }
        
        if (filters.services && filters.services.length > 0) {
            query = query.contains('services', filters.services);
        }
        
        if (filters.experience_min) {
            query = query.gte('experience_years', filters.experience_min);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching maid profiles:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error in fetchMaidProfiles:', error);
        throw error;
    }
}

/**
 * Fetch a single maid profile by ID
 * @param {string} profileId - The ID of the profile to fetch
 * @returns {Promise<Object>} - The maid profile
 */
async function fetchMaidProfileById(profileId) {
    try {
        const { data, error } = await supabase
            .from('maid_profiles')
            .select('*')
            .eq('id', profileId)
            .single();
        
        if (error) {
            console.error('Error fetching maid profile:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error in fetchMaidProfileById:', error);
        throw error;
    }
}

/**
 * Fetch a maid profile by user ID
 * @param {string} userId - The user ID to fetch the profile for
 * @returns {Promise<Object>} - The maid profile
 */
async function fetchMaidProfileByUserId(userId) {
    try {
        const { data, error } = await supabase
            .from('maid_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) {
            console.error('Error fetching maid profile:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error in fetchMaidProfileByUserId:', error);
        throw error;
    }
}

/**
 * Update a maid profile
 * @param {string} profileId - The ID of the profile to update
 * @param {Object} profileData - The data to update
 * @returns {Promise<Object>} - The updated profile
 */
async function updateMaidProfile(profileId, profileData) {
    try {
        const { data, error } = await supabase
            .from('maid_profiles')
            .update(profileData)
            .eq('id', profileId)
            .select();
        
        if (error) {
            console.error('Error updating maid profile:', error);
            throw error;
        }
        
        return data[0];
    } catch (error) {
        console.error('Error in updateMaidProfile:', error);
        throw error;
    }
}

/**
 * Delete a maid profile
 * @param {string} profileId - The ID of the profile to delete
 * @returns {Promise<void>}
 */
async function deleteMaidProfile(profileId) {
    try {
        const { error } = await supabase
            .from('maid_profiles')
            .delete()
            .eq('id', profileId);
        
        if (error) {
            console.error('Error deleting maid profile:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error in deleteMaidProfile:', error);
        throw error;
    }
}

/**
 * Upload a profile image
 * @param {File} imageFile - The image file to upload
 * @param {string} userId - The user ID to associate with the image
 * @returns {Promise<string>} - The URL of the uploaded image
 */
async function uploadProfileImage(imageFile, userId) {
    try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const bucketName = 'maid-images';
        
        // Upload the file to the existing bucket
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            console.error('Error uploading image:', error);
            
            // If bucket doesn't exist, provide a helpful error message
            if (error.message && error.message.includes('bucket')) {
                throw new Error('Storage bucket not found. Please create a bucket named "maid-images" in your Supabase project.');
            }
            
            throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        
        return publicUrl;
    } catch (error) {
        console.error('Error in uploadProfileImage:', error);
        throw error;
    }
}

/**
 * Get the latest maid profiles
 * @param {number} limit - The maximum number of profiles to return
 * @returns {Promise<Array>} - Array of maid profiles
 */
async function getLatestMaids(limit = 6) {
    try {
        const { data, error } = await supabase
            .from('maid_profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) {
            console.error('Error fetching latest maids:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error in getLatestMaids:', error);
        throw error;
    }
}

// Export functions for use in other files
window.maidProfiles = {
    fetchMaidProfiles,
    fetchMaidProfileById,
    fetchMaidProfileByUserId,
    updateMaidProfile,
    deleteMaidProfile,
    uploadProfileImage,
    getLatestMaids
}; 