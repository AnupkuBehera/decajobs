@echo off
:: Batch script to switch Wi-Fi / Ethernet DNS to Cloudflare (1.1.1.1) and Google (8.8.8.8)
:: and flush Windows DNS cache to bypass stale router DNS cache.

:: Check for administrative permissions
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo ===================================================
echo     DecaJobs - DNS Switcher ^& Cache Flush Tool
echo ===================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|Loopback|Hyper-V|Bluetooth' }; " ^
    "foreach ($adapter in $adapters) { " ^
    "   Write-Host ('Configuring adapter: ' + $adapter.Name + ' (' + $adapter.InterfaceDescription + ')...') -ForegroundColor Cyan; " ^
    "   Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses ('1.1.1.1', '8.8.8.8') -ErrorAction SilentlyContinue; " ^
    "} " ^
    "Write-Host 'Flushing Windows DNS Cache...' -ForegroundColor Yellow; " ^
    "Clear-DnsClientCache; " ^
    "ipconfig /flushdns | Out-Null; " ^
    "Write-Host ''; " ^
    "Write-Host 'Testing DNS resolution for decajob.com...' -ForegroundColor Cyan; " ^
    "try { " ^
    "   $dns = Resolve-DnsName decajob.com -Type A -ErrorAction Stop; " ^
    "   $ips = ($dns | Where-Object { $_.IPAddress } | Select-Object -ExpandProperty IPAddress) -join ', '; " ^
    "   Write-Host ('SUCCESS: decajob.com now resolves to: ' + $ips) -ForegroundColor Green; " ^
    "} catch { " ^
    "   Write-Host ('DNS Query Error: ' + $_.Exception.Message) -ForegroundColor Red; " ^
    "} "

echo.
echo ===================================================
echo Setup complete! You can now open https://decajob.com
echo ===================================================
echo.
pause
