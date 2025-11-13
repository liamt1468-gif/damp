// Verification Handler - Manages form submission and user verification process

class VerificationHandler {
    constructor() {
        this.storageKey = 'verificationApplications';
    }

    // Generate unique ID
    generateId() {
        return 'VER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Generate OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Submit verification application
    submitApplication(formData) {
        const application = {
            id: this.generateId(),
            fullName: formData.fullName || formData['full-name'],
            emiratesId: formData.emiratesId || formData['emirates-id-field'] || formData['emirates-id'],
            email: formData.email,
            mobileNumber: formData.mobileNumber || formData['mobile-number-field'] || formData['mobile-number'],
            nationality: formData.nationality || formData['countrytext-427'] || '',
            otp: this.generateOTP(),
            status: 'pending',
            timestamp: new Date().toISOString(),
            statusUpdatedAt: null
        };

        // Get existing applications
        const applications = this.getApplications();
        
        // Add new application
        applications.push(application);
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(applications));
        
        // Store current application for checking status
        sessionStorage.setItem('currentApplication', JSON.stringify(application));
        
        return application;
    }

    // Get all applications
    getApplications() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Get application by ID
    getApplicationById(id) {
        const applications = this.getApplications();
        return applications.find(app => app.id === id);
    }

    // Get current application from session
    getCurrentApplication() {
        const stored = sessionStorage.getItem('currentApplication');
        return stored ? JSON.parse(stored) : null;
    }

    // Check verification status
    checkStatus(id) {
        const application = this.getApplicationById(id);
        return application ? application.status : null;
    }

    // Update application status (for admin use)
    updateStatus(id, status) {
        const applications = this.getApplications();
        const index = applications.findIndex(app => app.id === id);
        
        if (index !== -1) {
            applications[index].status = status;
            applications[index].statusUpdatedAt = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(applications));
            return true;
        }
        return false;
    }

    // Clear all data (for testing)
    clearAll() {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem('currentApplication');
    }
}

// Create global instance
const verificationHandler = new VerificationHandler();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VerificationHandler;
}
