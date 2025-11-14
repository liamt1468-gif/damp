# ========================================
# Project Cleanup Script
# Removes obsolete files and dead code
# ========================================

Write-Host "`n🧹 DAMP Project Cleanup Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Function to safely remove items
function Remove-Safely {
    param(
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        Write-Host "🗑️  Removing: $Description" -ForegroundColor Yellow
        Remove-Item $Path -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path $Path) {
            Write-Host "   ❌ Failed to remove: $Path" -ForegroundColor Red
        } else {
            Write-Host "   ✅ Removed successfully" -ForegroundColor Green
        }
    } else {
        Write-Host "⏭️  Skipping: $Description (not found)" -ForegroundColor Gray
    }
}

# Ask for confirmation
Write-Host "This script will delete obsolete files from your project." -ForegroundColor Yellow
Write-Host "The following items will be removed:`n" -ForegroundColor Yellow

Write-Host "OBSOLETE JAVASCRIPT FILES:" -ForegroundColor Cyan
Write-Host "  - js/verification-handler.js (replaced by data-management.js)"
Write-Host "  - js/form-handler.js (replaced by data-management.js)"
Write-Host "  - js/integration-snippet.html"
Write-Host "  - js/email-notification-snippet.html`n"

Write-Host "TEST FILES:" -ForegroundColor Cyan
Write-Host "  - test.html"
Write-Host "  - test-protection.html"
Write-Host "  - test-email-notification.html"
Write-Host "  - example-integration.html`n"

Write-Host "OBSOLETE DIRECTORIES:" -ForegroundColor Cyan
Write-Host "  - dubailegalcheck.ae/ (entire folder)"
Write-Host "  - hts-cache/"
Write-Host "  - upload.wikimedia.org/"
Write-Host "  - uaepass-demo.kishwersultana.online/"
Write-Host "  - .history/`n"

Write-Host "CACHE/LOG FILES:" -ForegroundColor Cyan
Write-Host "  - cookies.txt"
Write-Host "  - hts-log.txt"
Write-Host "  - backblue.gif"
Write-Host "  - fade.gif`n"

$confirmation = Read-Host "Continue with cleanup? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "`n❌ Cleanup cancelled by user." -ForegroundColor Red
    exit
}

Write-Host "`n🚀 Starting cleanup...`n" -ForegroundColor Green

# Phase 1: Remove obsolete JavaScript files
Write-Host "`n📂 Phase 1: Obsolete JavaScript Files" -ForegroundColor Magenta
Remove-Safely "js\verification-handler.js" "Old verification handler"
Remove-Safely "js\form-handler.js" "Old form handler"
Remove-Safely "js\integration-snippet.html" "Integration snippet"
Remove-Safely "js\email-notification-snippet.html" "Email notification snippet"

# Phase 2: Remove test files
Write-Host "`n📂 Phase 2: Test Files" -ForegroundColor Magenta
Remove-Safely "test.html" "Test page"
Remove-Safely "test-protection.html" "Protection test page"
Remove-Safely "test-email-notification.html" "Email notification test page"
Remove-Safely "example-integration.html" "Example integration page"

# Phase 3: Remove obsolete directories
Write-Host "`n📂 Phase 3: Obsolete Directories" -ForegroundColor Magenta
Remove-Safely "dubailegalcheck.ae" "Old dubailegalcheck.ae folder"
Remove-Safely "hts-cache" "HTTrack cache folder"
Remove-Safely "upload.wikimedia.org" "Wikipedia uploads folder"
Remove-Safely "uaepass-demo.kishwersultana.online" "Old demo folder"
Remove-Safely ".history" "Local history folder"

# Phase 4: Remove cache/log files
Write-Host "`n📂 Phase 4: Cache and Log Files" -ForegroundColor Magenta
Remove-Safely "cookies.txt" "Cookies file"
Remove-Safely "hts-log.txt" "HTTrack log file"
Remove-Safely "backblue.gif" "HTTrack image"
Remove-Safely "fade.gif" "HTTrack image"

# Summary
Write-Host "`n✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📊 CORE SYSTEM FILES (PRESERVED):" -ForegroundColor Cyan
Write-Host "  ✅ site/wp-content/data-management.js"
Write-Host "  ✅ site/uae-pass-verification/index.html"
Write-Host "  ✅ site/bank-information/index.html"
Write-Host "  ✅ admin/index.html"
Write-Host "  ✅ status/index.html"
Write-Host "  ✅ index.html (landing page)`n"

Write-Host "📊 OPTIONAL FILES (PRESERVED):" -ForegroundColor Yellow
if (Test-Path "js\click-notifier.js") {
    Write-Host "  ⏸️  js/click-notifier.js (email notifications)"
}
if (Test-Path "js\notifier-config.js") {
    Write-Host "  ⏸️  js/notifier-config.js (email config)"
}
if (Test-Path "js\website-protection.js") {
    Write-Host "  ⏸️  js/website-protection.js (anti-scraping)"
}

Write-Host "`n💡 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Review CLEANUP-ANALYSIS.md for details"
Write-Host "  2. Test your site to ensure everything works"
Write-Host "  3. Run: git status (to see changes)"
Write-Host "  4. Commit changes when ready:`n"
Write-Host "     git add ."
Write-Host "     git commit -m 'Clean up obsolete files and dead code'"
Write-Host "     git push origin main`n"

Write-Host "Done! 🎉" -ForegroundColor Green
