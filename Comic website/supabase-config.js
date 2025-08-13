// Supabase configuration for Akio Comic Website
// Replace with your actual Supabase config from Supabase Dashboard

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabase;

// Test connection
console.log('Supabase client initialized:', !!supabase); 