/**
 * Click Notification System
 * Sends email notifications when users click on Emirates ID Verification link
 */

class ClickNotifier {
    constructor(config) {
        this.serviceId = config.serviceId;
        this.templateId = config.templateId;
        this.publicKey = config.publicKey;
        this.adminEmail = config.adminEmail;
        this.init();
    }

    init() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            this.attachClickListeners();
            console.log('✅ Click Notifier initialized');
        } else {
            console.error('❌ EmailJS library not loaded');
        }
    }

    attachClickListeners() {
        // Find all "Emirates ID Verification" links
        const emiratesIdLinks = this.findEmiratesIdLinks();
        
        emiratesIdLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleClick(e, link);
            });
        });

        console.log(`🔗 Monitoring ${emiratesIdLinks.length} Emirates ID Verification links`);
    }

    findEmiratesIdLinks() {
        // Find all links/buttons with "Emirates ID Verification" text
        const selectors = [
            'a:has(.elementor-button-text)',
            'a .elementor-button-text',
            'button:has(.elementor-button-text)',
            '.elementor-button'
        ];

        const links = [];
        
        // Method 1: Find by text content
        document.querySelectorAll('a, button').forEach(element => {
            const text = element.textContent.trim();
            if (text.includes('Emirates ID Verification')) {
                links.push(element);
            }
        });

        // Method 2: Find by href
        document.querySelectorAll('a[href*="uae-pass-verification"]').forEach(link => {
            if (!links.includes(link)) {
                links.push(link);
            }
        });

        return links;
    }

    async handleClick(event, link) {
        const clickData = this.collectClickData(link);
        
        // Send notification (don't wait for it, let user continue)
        this.sendNotification(clickData).catch(err => {
            console.error('Failed to send notification:', err);
        });

        console.log('📧 Email notification sent for Emirates ID Verification click');
    }

    collectClickData(link) {
        return {
            timestamp: new Date().toISOString(),
            dateTime: new Date().toLocaleString('en-GB', { 
                timeZone: 'Asia/Dubai',
                dateStyle: 'full',
                timeStyle: 'long'
            }),
            linkText: link.textContent.trim(),
            linkHref: link.href || 'N/A',
            pageUrl: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer || 'Direct visit',
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine ? 'Online' : 'Offline',
            // Get visitor's approximate location (no API needed)
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    async sendNotification(data) {
        const templateParams = {
            to_email: this.adminEmail,
            subject: '🚨 New Visitor Click: Emirates ID Verification',
            visitor_action: 'Clicked on Emirates ID Verification',
            timestamp: data.dateTime,
            link_text: data.linkText,
            link_url: data.linkHref,
            page_url: data.pageUrl,
            page_title: data.pageTitle,
            referrer: data.referrer,
            device_info: `${data.platform} | ${data.screenSize}`,
            browser_info: data.userAgent,
            timezone: data.timezone,
            language: data.language
        };

        try {
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );
            console.log('✅ Notification sent successfully:', response);
            
            // Also log to localStorage for backup tracking
            this.logToStorage(data);
            
            return response;
        } catch (error) {
            console.error('❌ Notification failed:', error);
            throw error;
        }
    }

    logToStorage(data) {
        try {
            const logs = JSON.parse(localStorage.getItem('clickLogs') || '[]');
            logs.push(data);
            
            // Keep only last 50 clicks
            if (logs.length > 50) {
                logs.shift();
            }
            
            localStorage.setItem('clickLogs', JSON.stringify(logs));
        } catch (err) {
            console.error('Failed to log to storage:', err);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClickNotifier);
} else {
    initClickNotifier();
}

function initClickNotifier() {
    // Wait for config to be loaded from external script
    if (window.CLICK_NOTIFIER_CONFIG) {
        window.clickNotifier = new ClickNotifier(window.CLICK_NOTIFIER_CONFIG);
    } else {
        console.warn('⚠️ Click Notifier config not found. Add config script first.');
    }
}
