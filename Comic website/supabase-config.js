// Supabase configuration for Akio Comic Website
// Replace with your actual Supabase config from Supabase Dashboard

const SUPABASE_URL = 'https://zwyrnxanqkwigvunoxnx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXhuYWx0d2FzemprdG9jZnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTg5MjQsImV4cCI6MjA3MDY3NDkyNH0.rQSpQIk4mgO-z247-lJRg0H-rbbr-6LpQBJK7NZnEtU';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabase;

// Test connection
console.log('Supabase client initialized:', !!supabase);

// Instructions for setup:
// 1. Go to https://supabase.com/dashboard
// 2. Create new project: akio-comic-website
// 3. Go to Settings > API
// 4. Copy Project URL and anon public key
// 5. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY above 