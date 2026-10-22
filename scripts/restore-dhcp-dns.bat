@echo off
:: Batch script to restore automatic DHCP DNS for all active network adapters.

:: Check for administrative permissions
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo ===================================================
echo     DecaJobs - Restore Default DHCP DNS
echo ===================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|Loopback|Hyper-V|Bluetooth' }; " ^
    "foreach ($adapter in $adapters) { " ^
    "   Write-Host ('Restoring DHCP DNS for: ' + $adapter.Name + '...') -ForegroundColor Cyan; " ^
    "   Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ResetServerAddresses -ErrorAction SilentlyContinue; " ^
    "} " ^
    "Write-Host 'Flushing Windows DNS Cache...' -ForegroundColor Yellow; " ^
    "Clear-DnsClientCache; " ^
    "ipconfig /flushdns | Out-Null; "

echo.
echo ===================================================
echo Default DHCP DNS settings restored!
echo ===================================================
echo.
pause
