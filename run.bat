@echo off
cd /d "%~dp0"
echo Dang khoi dong server va mo trinh duyet...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -OpenBrowser
pause
