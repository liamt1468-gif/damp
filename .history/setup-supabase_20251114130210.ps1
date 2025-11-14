# ========================================
# Supabase Setup Helper Script
# ========================================

Write-Host "`n🚀 Supabase Integration Helper" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Check if config file exists
if (Test-Path "site\wp-content\supabase-config.js") {
    Write-Host "✅ Config file found: site\wp-content\supabase-config.js" -ForegroundColor Green
    
    # Check if it's configured
    $configContent = Get-Content "site\wp-content\supabase-config.js" -Raw
    if ($configContent -match "YOUR_SUPABASE_URL") {
        Write-Host "⚠️  Config file needs your Supabase credentials`n" -ForegroundColor Yellow
        
        Write-Host "📋 TO GET YOUR CREDENTIALS:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://supabase.com/dashboard"
        Write-Host "2. Click on your project"
        Write-Host "3. Click Settings ⚙️ → API"
        Write-Host "4. Copy 'Project URL' and 'anon public' key`n"
        
        Write-Host "Would you like to enter them now? (yes/no)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "yes") {
            Write-Host "`nEnter your Supabase Project URL:" -ForegroundColor Cyan
            Write-Host "(Example: https://abcdefghijklmnop.supabase.co)" -ForegroundColor Gray
            $url = Read-Host
            
            Write-Host "`nEnter your Supabase Anon Key:" -ForegroundColor Cyan
            Write-Host "(The long string starting with 'eyJ...')" -ForegroundColor Gray
            $key = Read-Host
            
            # Update config file
            $configContent = $configContent -replace "YOUR_SUPABASE_URL", $url
            $configContent = $configContent -replace "YOUR_SUPABASE_ANON_KEY", $key
            
            Set-Content "site\wp-content\supabase-config.js" $configContent
            
            Write-Host "`n✅ Configuration updated successfully!" -ForegroundColor Green
        } else {
            Write-Host "`n⏭️  Skipping configuration. You can update the file manually." -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ Config file already configured!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Config file not found!" -ForegroundColor Red
    Write-Host "   Expected location: site\wp-content\supabase-config.js" -ForegroundColor Gray
}

Write-Host "`n📊 INTEGRATION STATUS:" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check which files exist
$files = @(
    "site\wp-content\supabase-config.js",
    "site\wp-content\data-management-supabase.js",
    "SUPABASE-SETUP-GUIDE.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
    }
}

Write-Host "`n📖 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan
Write-Host "1. ✅ Supabase table created (already done!)"
Write-Host "2. ⏳ Update supabase-config.js with your credentials"
Write-Host "3. ⏳ Update HTML pages with new script tags"
Write-Host "4. ⏳ Test the integration"
Write-Host "`nRead SUPABASE-SETUP-GUIDE.md for detailed instructions!`n" -ForegroundColor Yellow

Write-Host "🎯 Quick Test:" -ForegroundColor Cyan
Write-Host "After updating config, open any page and check browser console." -ForegroundColor Gray
Write-Host "You should see: '✅ Supabase initialized successfully'`n" -ForegroundColor Green

Write-Host "Done! 🎉" -ForegroundColor Green
