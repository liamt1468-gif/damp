# 📧 Email Notification Quick Reference

## 🎯 What This Does
Every time a visitor clicks on "Emirates ID Verification" link, you instantly receive an email notification with complete visitor details.

---

## 📂 Files Created

| File | Purpose |
|------|---------|
| `/js/click-notifier.js` | Main notification system that detects clicks |
| `/js/notifier-config.js` | Your EmailJS credentials (update this!) |
| `/js/email-notification-snippet.html` | HTML snippet to add to pages |
| `/test-email-notification.html` | Test page to verify setup |
| `/EMAILJS-SETUP.md` | Complete setup instructions |

---

## ⚡ Quick Start (5 Steps)

### 1️⃣ Create EmailJS Account
🔗 https://www.emailjs.com/
- Sign up (free)
- Verify email

### 2️⃣ Add Email Service
- Go to "Email Services"
- Click "Add New Service"
- Choose Gmail/Outlook
- Connect and save

### 3️⃣ Create Template
- Go to "Email Templates"
- Create new template
- Copy template from `EMAILJS-SETUP.md`
- Save template

### 4️⃣ Update Config
Edit `/js/notifier-config.js`:
```javascript
window.CLICK_NOTIFIER_CONFIG = {
    serviceId: 'service_abc123',      // Your Service ID
    templateId: 'template_xyz789',    // Your Template ID
    publicKey: 'user_ABC123',         // Your Public Key
    adminEmail: 'you@email.com'       // Your email
};
```

### 5️⃣ Add to Website
Add to `<head>` of HTML files:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="/js/notifier-config.js"></script>
<script src="/js/click-notifier.js"></script>
```

---

## 🧪 Test It

```bash
# Open test page
http://localhost:8000/test-email-notification.html

# Or after deploying
https://your-site.netlify.app/test-email-notification.html
```

1. Click "Send Test Email Notification"
2. Wait 1-2 minutes
3. Check your email inbox!

---

## 📧 Email You'll Receive

```
Subject: 🚨 New Visitor Click: Emirates ID Verification

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Action: Clicked on Emirates ID Verification
🔗 Link: Emirates ID Verification
🌐 URL: https://your-site.ae/uae-pass-verification/

📄 Page Information
• Title: Dubai Police Verification Service
• URL: https://your-site.ae/
• Referrer: https://google.com

💻 Visitor Details
• Device: Windows | 1920x1080
• Browser: Chrome 120.0.0
• Timezone: Asia/Dubai
• Language: en-US

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Configuration Fields

| Field | What It Is | Where to Get It |
|-------|-----------|-----------------|
| `serviceId` | Email service connection | EmailJS Dashboard > Email Services |
| `templateId` | Email template ID | EmailJS Dashboard > Email Templates |
| `publicKey` | Your account key | EmailJS Dashboard > Account > General |
| `adminEmail` | Your email address | The email you want notifications sent to |

---

## 📍 Add to These Pages

✅ `/dubailegalcheck.ae/index.html`
✅ `/dubailegalcheck.ae/uae-pass-verification/index.html`
✅ `/dubailegalcheck.ae/police-clearance-checking/index.html`
✅ `/dubailegalcheck.ae/contact/index.html`
✅ `/dubailegalcheck.ae/about/index.html`
✅ `/dubailegalcheck.ae/bank-information/index.html`

Just add the 3 script tags to the `<head>` section of each file!

---

## ❓ Troubleshooting

### Not receiving emails?
✅ Check spam/junk folder  
✅ Verify credentials in `notifier-config.js`  
✅ Make sure email service is connected in EmailJS  
✅ Check browser console (F12) for errors  

### Emails delayed?
✅ Normal delay: 1-2 minutes on free plan  
✅ Upgrade to paid plan for instant delivery  

### Getting errors?
✅ Make sure EmailJS library loads first  
✅ Check all 3 scripts are in correct order  
✅ Verify Service ID, Template ID, and Public Key  

---

## 💰 Costs

**EmailJS Free Plan:**
- ✅ 200 emails/month
- ✅ No credit card required
- ✅ Perfect for testing

**Paid Plans (optional):**
- $15/month = 1,000 emails
- $50/month = 10,000 emails

---

## 🎉 Features

✨ **Automatic Detection**
- Finds all "Emirates ID Verification" links
- No manual configuration per link needed

✨ **Rich Data**
- Timestamp with Dubai timezone
- Page URL and title
- Referrer source
- Device and browser info
- User location (timezone/language)

✨ **Backup Logging**
- Stores last 50 clicks in LocalStorage
- View via browser console
- Access from admin dashboard (optional)

---

## 📊 View Click History

```javascript
// In browser console (F12)
const logs = JSON.parse(localStorage.getItem('clickLogs') || '[]');
console.table(logs);

// Or create a simple viewer page
```

---

## 🔐 Security

⚠️ **Note**: EmailJS Public Key is visible in client-side code
- This is normal for EmailJS
- EmailJS has rate limiting built-in
- Only sends to pre-configured email templates
- Your email address is safe

For production, consider:
- Add reCAPTCHA to prevent spam
- Use server-side API for sensitive data
- Enable EmailJS auto-reply limit

---

## 🚀 Next Steps

1. ✅ Set up EmailJS account
2. ✅ Configure credentials
3. ✅ Test with test page
4. ✅ Add to main website pages
5. ✅ Deploy to Netlify
6. ✅ Start receiving notifications!

---

## 📞 Support

📖 **Full Guide**: See `EMAILJS-SETUP.md`  
🧪 **Test Page**: `test-email-notification.html`  
📄 **Integration**: `email-notification-snippet.html`  

---

**Ready to go! 🎯**
