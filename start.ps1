Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting GovJobPulse - BCA & MCA Government Job Portal" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting Python FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; python run.py"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Frontend Vite Server on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Application successfully started!" -ForegroundColor Yellow
Write-Host "Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
