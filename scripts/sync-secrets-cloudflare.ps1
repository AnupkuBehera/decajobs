<#
.SYNOPSIS
    Syncs environment variables from .env.local to Cloudflare Workers secrets using Wrangler.
.DESCRIPTION
    Reads .env.local and executes 'npx wrangler secret put <KEY>' for each secret key.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/sync-secrets-cloudflare.ps1
#>

$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env.local not found at $envFile" -ForegroundColor Red
    Write-Host "Please run 'node scripts/setup-payments.mjs' first to create .env.local." -ForegroundColor Yellow
    exit 1
}

$secretKeys = @(
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_PLAN_ID",
    "RAZORPAY_WEBHOOK_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "GEMINI_API_KEY",
    "CRON_SECRET"
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   DecaJobs - Cloudflare Worker Secrets Sync Tool     " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$envMap = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and (-not $line.StartsWith("#")) -and ($line.Contains("="))) {
        $idx = $line.IndexOf("=")
        $k = $line.Substring(0, $idx).Trim()
        $v = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
        $envMap[$k] = $v
    }
}

$syncedCount = 0

foreach ($key in $secretKeys) {
    if ($envMap.ContainsKey($key) -and $envMap[$key] -and (-not $envMap[$key].Contains("your_")) -and (-not $envMap[$key].Contains("example"))) {
        $val = $envMap[$key]
        $masked = if ($val.Length -gt 8) { $val.Substring(0, 4) + "..." + $val.Substring($val.Length - 4) } else { "****" }
        Write-Host "Uploading $key ($masked)..." -ForegroundColor Yellow -NoNewline
        
        try {
            $val | npx wrangler secret put $key 2>&1 | Out-Null
            Write-Host " [OK]" -ForegroundColor Green
            $syncedCount++
        } catch {
            Write-Host " [FAILED: $_]" -ForegroundColor Red
        }
    } else {
        Write-Host "Skipping $key (not set in .env.local)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Successfully synced $syncedCount secrets to Cloudflare Workers!" -ForegroundColor Green
Write-Host "You can now redeploy your worker with: npm run deploy:cf" -ForegroundColor Cyan
