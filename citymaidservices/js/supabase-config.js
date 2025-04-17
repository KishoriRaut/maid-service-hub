// Supabase configuration
const supabaseUrl = 'https://fdgqqxyyofjnkhswkwcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3FxeHl5b2Zqbmtoc3drd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjQyMTMsImV4cCI6MjA1OTYwMDIxM30.YyJLLu3r2a7Mh7ny0ie-YzzLfPh5PdrJJHnBFBxWqVE';

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