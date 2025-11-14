/**
 * Website Protection & Anti-Cloning System
 * Protects against scraping, copying, and unauthorized data access
 */

class WebsiteProtection {
    constructor(config = {}) {
        this.config = {
            enableDevToolsBlock: config.enableDevToolsBlock !== false,
            enableRightClickBlock: config.enableRightClickBlock !== false,
            enableCopyPaste: config.enableCopyPaste !== false,
            enableConsoleBlock: config.enableConsoleBlock !== false,
            enableSourceObfuscation: config.enableSourceObfuscation !== false,
            enableDomainCheck: config.enableDomainCheck !== false,
            allowedDomains: config.allowedDomains || [],
            enableKeyboardShortcuts: config.enableKeyboardShortcuts !== false,
            enableIframeProtection: config.enableIframeProtection !== false,
            enableDataEncryption: config.enableDataEncryption !== false,
            warningMessage: config.warningMessage || 'Unauthorized access detected!'
        };
        
        this.init();
    }

    init() {
        console.log('🛡️ Website Protection Active');
        
        // Domain check disabled - allow all domains
        // if (this.config.enableDomainCheck) {
        //     this.checkDomain();
        // }
        
        if (this.config.enableDevToolsBlock) {
            this.blockDevTools();
        }
        
        // Right-click disabled - allow right-click
        // if (this.config.enableRightClickBlock) {
        //     this.disableRightClick();
        // }
        
        // Copy/paste disabled - allow copy/paste
        // if (this.config.enableCopyPaste) {
        //     this.disableCopyPaste();
        // }
        
        if (this.config.enableConsoleBlock) {
            this.blockConsoleCommands();
        }
        
        if (this.config.enableKeyboardShortcuts) {
            this.blockKeyboardShortcuts();
        }
        
        if (this.config.enableIframeProtection) {
            this.preventIframeEmbedding();
        }
        
        if (this.config.enableSourceObfuscation) {
            this.obfuscateSource();
        }
        
        this.protectLocalStorage();
        this.addWatermark();
        this.detectScreenshot();
    }

    // 1. Domain Verification - Only allow on authorized domains
    checkDomain() {
        const currentDomain = window.location.hostname;
        const allowedDomains = [
            'dubailegalcheck.ae',
            'www.dubailegalcheck.ae',
            'localhost',
            '127.0.0.1',
            ...this.config.allowedDomains
        ];
        
        if (!allowedDomains.some(domain => currentDomain.includes(domain))) {
            this.triggerSecurityAlert('Unauthorized domain detected!');
            // Clear all data
            localStorage.clear();
            sessionStorage.clear();
            // Redirect to blank page
            document.body.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;">
                    <div style="text-align:center;">
                        <h1>⚠️ Unauthorized Access</h1>
                        <p>This website is protected and can only be accessed from authorized domains.</p>
                        <p>Access denied.</p>
                    </div>
                </div>
            `;
            throw new Error('Unauthorized domain');
        }
    }

    // 2. Block Developer Tools
    blockDevTools() {
        // Detect when DevTools is open
        const devtools = { isOpen: false };
        const threshold = 160;
        
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.isOpen) {
                    devtools.isOpen = true;
                    this.triggerSecurityAlert('Developer tools detected!');
                }
            } else {
                devtools.isOpen = false;
            }
        };
        
        // Check periodically
        setInterval(detectDevTools, 500);
        
        // Alternative detection method
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: () => {
                this.triggerSecurityAlert('Console inspection detected!');
                return 'devtools-detected';
            }
        });
        
        console.log(element);
    }

    // 3. Disable Right-Click
    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionMessage('Right-click is disabled on this site.');
            return false;
        });
    }

    // 4. Disable Copy/Paste
    disableCopyPaste() {
        // Disable text selection
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable copy
        document.addEventListener('copy', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.showProtectionMessage('Copying is disabled on this site.');
                return false;
            }
        });
        
        // Disable cut
        document.addEventListener('cut', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });
        
        // Add CSS to prevent text selection
        const style = document.createElement('style');
        style.textContent = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 5. Block Console Commands
    blockConsoleCommands() {
        // Disable common console methods
        const noop = () => {};
        
        // Override console methods
        ['log', 'debug', 'info', 'warn', 'error', 'table', 'dir', 'dirxml', 'trace'].forEach(method => {
            const original = console[method];
            console[method] = function() {
                // Allow in development
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    original.apply(console, arguments);
                }
            };
        });
        
        // Block debugger
        setInterval(() => {
            (function() {
                return false;
            })();
        }, 100);
    }

    // 6. Block Keyboard Shortcuts
    blockKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F12 (DevTools)
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                this.showProtectionMessage('Developer tools are disabled.');
                return false;
            }
            
            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'U') {
                e.preventDefault();
                this.showProtectionMessage('Viewing source code is disabled.');
                return false;
            }
            
            // Ctrl+S (Save Page)
            if (e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                this.showProtectionMessage('Saving page is disabled.');
                return false;
            }
            
            // Ctrl+C (Copy) for non-input elements
            if (e.ctrlKey && e.key === 'C' && 
                e.target.tagName !== 'INPUT' && 
                e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+A (Select All) for non-input elements
            if (e.ctrlKey && e.key === 'A' && 
                e.target.tagName !== 'INPUT' && 
                e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });
    }

    // 7. Prevent Iframe Embedding
    preventIframeEmbedding() {
        if (window.self !== window.top) {
            // Site is in an iframe
            this.triggerSecurityAlert('Iframe embedding detected!');
            window.top.location = window.self.location;
        }
        
        // Set X-Frame-Options via meta tag
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Frame-Options';
        meta.content = 'DENY';
        document.head.appendChild(meta);
    }

    // 8. Source Code Obfuscation
    obfuscateSource() {
        // Add fake data to confuse scrapers
        const fakeData = document.createElement('div');
        fakeData.style.display = 'none';
        fakeData.innerHTML = `
            <!-- Fake data to confuse scrapers -->
            <div class="verification-data" style="display:none;">
                <span data-id="784-9999-9999999-9">FAKE_DATA</span>
                <span data-email="fake@example.com">FAKE_EMAIL</span>
                <span data-phone="+971000000000">FAKE_PHONE</span>
            </div>
        `;
        document.body.appendChild(fakeData);
        
        // Remove comments from HTML
        document.querySelectorAll('*').forEach(element => {
            for (let node of element.childNodes) {
                if (node.nodeType === Node.COMMENT_NODE) {
                    element.removeChild(node);
                }
            }
        });
    }

    // 9. Protect LocalStorage Data
    protectLocalStorage() {
        // Encrypt sensitive data before storing
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        localStorage.setItem = function(key, value) {
            if (key.includes('verification') || key.includes('Application')) {
                // Simple encryption (use real encryption in production)
                const encrypted = btoa(encodeURIComponent(value));
                originalSetItem.call(this, key, encrypted);
            } else {
                originalSetItem.call(this, key, value);
            }
        };
        
        localStorage.getItem = function(key) {
            const value = originalGetItem.call(this, key);
            if (value && (key.includes('verification') || key.includes('Application'))) {
                try {
                    return decodeURIComponent(atob(value));
                } catch (e) {
                    return value;
                }
            }
            return value;
        };
    }

    // 10. Add Invisible Watermark
    addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            font-size: 10px;
            color: rgba(0,0,0,0.02);
            pointer-events: none;
            z-index: 9999;
        `;
        watermark.textContent = `Protected by Dubai Police Security System - ${new Date().toISOString()}`;
        document.body.appendChild(watermark);
    }

    // 11. Detect Screenshot Attempts
    detectScreenshot() {
        // Detect when user leaves/returns to tab (possible screenshot)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('User left tab - possible screenshot attempt');
                this.logSecurityEvent('Tab hidden - possible screenshot');
            }
        });
        
        // Detect Print Screen key
        document.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                this.showProtectionMessage('Screenshot detected. This activity is logged.');
                this.logSecurityEvent('PrintScreen key pressed');
            }
        });
    }

    // Security Alert System
    triggerSecurityAlert(message) {
        console.warn('🚨 SECURITY ALERT:', message);
        this.logSecurityEvent(message);
        
        // Send alert to admin (via EmailJS if configured)
        if (window.CLICK_NOTIFIER_CONFIG && typeof emailjs !== 'undefined') {
            this.sendSecurityAlert(message);
        }
    }

    async sendSecurityAlert(message) {
        try {
            const templateParams = {
                to_email: window.CLICK_NOTIFIER_CONFIG.adminEmail,
                subject: '🚨 SECURITY ALERT - Website Protection',
                alert_type: message,
                timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }),
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                ip_info: 'Check server logs',
                action_taken: 'Access logged and monitored'
            };
            
            await emailjs.send(
                window.CLICK_NOTIFIER_CONFIG.serviceId,
                window.CLICK_NOTIFIER_CONFIG.templateId,
                templateParams,
                window.CLICK_NOTIFIER_CONFIG.publicKey
            );
        } catch (error) {
            console.error('Failed to send security alert:', error);
        }
    }

    logSecurityEvent(event) {
        const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        logs.push({
            event,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Keep last 100 logs
        if (logs.length > 100) {
            logs.shift();
        }
        
        localStorage.setItem('securityLogs', JSON.stringify(logs));
    }

    showProtectionMessage(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d32f2f;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `<strong>🛡️ ${message}</strong>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Auto-initialize with default settings
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProtection);
} else {
    initProtection();
}

function initProtection() {
    window.websiteProtection = new WebsiteProtection({
        enableDevToolsBlock: true,
        enableRightClickBlock: true,
        enableCopyPaste: true,
        enableConsoleBlock: false, // Set to true in production
        enableSourceObfuscation: true,
        enableDomainCheck: true,
        allowedDomains: ['your-netlify-site.netlify.app'], // Add your Netlify domain
        enableKeyboardShortcuts: true,
        enableIframeProtection: true,
        enableDataEncryption: true
    });
}

// Export for manual initialization
window.WebsiteProtection = WebsiteProtection;
