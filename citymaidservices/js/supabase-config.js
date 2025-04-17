// Supabase configuration
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Check if user is authenticated
async function checkAuth() {
    const { data: { session }, error } = await window.supabase.auth.getSession();
    
    if (error) {
        console.error('Error checking authentication:', error);
        return null;
    }
    
    return session;
}

// Get current user
async function getCurrentUser() {
    const session = await checkAuth();
    return session ? session.user : null;
}

// Redirect if not authenticated
function redirectIfNotAuthenticated(redirectUrl = '../auth/login.html') {
    getCurrentUser().then(user => {
        if (!user) {
            window.location.href = redirectUrl;
        }
    });
}

// Export functions
window.authUtils = {
    checkAuth,
    getCurrentUser,
    redirectIfNotAuthenticated
}; 