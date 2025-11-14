// ==========================================
// SUPABASE CONFIGURATION
// ==========================================
// 
// HOW TO GET YOUR CREDENTIALS:
// 1. Go to your Supabase project: https://supabase.com/dashboard
// 2. Click on your project (liamt1468-gif's Org / liamt1468-gif's Project)
// 3. Click "Settings" (gear icon) in left sidebar
// 4. Click "API" under Project Settings
// 5. Copy "Project URL" and "anon public" key
//
// ==========================================

const SUPABASE_CONFIG = {
    // Replace these with your actual Supabase credentials
    url: 'YOUR_SUPABASE_URL',  // Example: 'https://abcdefghijklmnop.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Long string starting with 'eyJ...'
};

// Initialize Supabase client (loaded from CDN in HTML)
let supabaseClient = null;

function initializeSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase library not loaded. Add CDN script to your HTML.');
        return false;
    }
    
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
        console.error('❌ Please update SUPABASE_CONFIG with your actual credentials.');
        return false;
    }
    
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('✅ Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return false;
    }
}

// Export for use in other scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initializeSupabase = initializeSupabase;
window.getSupabaseClient = () => supabaseClient;
