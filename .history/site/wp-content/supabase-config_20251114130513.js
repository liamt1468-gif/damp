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
    // Your Supabase credentials - configured automatically
    url: 'https://wstfhcqxliwjdxbjocj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndszdGZoY3F4bGl3amR4YmpvY2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMTU3NDYxMiwieHR0cCI6MTczMTU3NDYxMn0.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndszdGZoY3F4bGl3amR4YmpvY2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMTU3NDYxMiwieHR0cCI6MTczMTU3NDYxMn0'
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
