/**
 * Click Notifier Configuration
 * 
 * Setup Instructions:
 * 1. Go to https://www.emailjs.com/
 * 2. Create a free account
 * 3. Create an email service (Gmail, Outlook, etc.)
 * 4. Create an email template (see template below)
 * 5. Get your Public Key from EmailJS dashboard
 * 6. Replace the values below with your actual EmailJS credentials
 */

window.CLICK_NOTIFIER_CONFIG = {
    // YOUR EmailJS credentials (Replace these with your actual values)
    serviceId: 'service_px83unb',        // e.g., 'service_abc123'
    templateId: 'template_vg0bxfe',      // e.g., 'template_xyz789'
    publicKey: '4Ztnbso3p2h58Rj9N',        // e.g., 'user_ABC123DEF456'
    
    // Your email address to receive notifications
    adminEmail: 'your-email@example.com'  // Change to your actual email
};

/*
===========================================
EMAILJS TEMPLATE SETUP
===========================================

1. Go to EmailJS Dashboard > Email Templates
2. Create a new template
3. Use this HTML template:

---

Subject: 
🚨 New Visitor Click: Emirates ID Verification

Email Body (HTML):
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        h1 { color: #d32f2f; margin-top: 0; }
        .info-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; margin-left: 10px; }
        .timestamp { background: #ff9800; color: white; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 New Website Visitor Alert!</h1>
        
        <div class="timestamp">
            <strong>{{timestamp}}</strong>
        </div>

        <div class="info-box">
            <p><span class="label">🎯 Action:</span><span class="value">{{visitor_action}}</span></p>
            <p><span class="label">🔗 Link Text:</span><span class="value">{{link_text}}</span></p>
            <p><span class="label">🌐 Link URL:</span><span class="value"><a href="{{link_url}}">{{link_url}}</a></span></p>
        </div>

        <div class="info-box">
            <h3>📄 Page Information</h3>
            <p><span class="label">Page Title:</span><span class="value">{{page_title}}</span></p>
            <p><span class="label">Page URL:</span><span class="value"><a href="{{page_url}}">{{page_url}}</a></span></p>
            <p><span class="label">Referrer:</span><span class="value">{{referrer}}</span></p>
        </div>

        <div class="info-box">
            <h3>💻 Visitor Details</h3>
            <p><span class="label">Device:</span><span class="value">{{device_info}}</span></p>
            <p><span class="label">Browser:</span><span class="value">{{browser_info}}</span></p>
            <p><span class="label">Timezone:</span><span class="value">{{timezone}}</span></p>
            <p><span class="label">Language:</span><span class="value">{{language}}</span></p>
        </div>

        <p style="text-align: center; color: #999; margin-top: 30px; font-size: 12px;">
            This is an automated notification from Dubai Police Verification Service
        </p>
    </div>
</body>
</html>

---

4. Save the template and copy the Template ID to this config file

===========================================
*/
