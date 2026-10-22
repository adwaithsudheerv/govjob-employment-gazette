@echo off
echo ========================================================
echo   Starting GovJobPulse - BCA & MCA Government Job Portal
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Python FastAPI Backend on http://localhost:8000 ...
start "GovJobPulse Backend" cmd /k "cd backend && python run.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Vite Server on http://localhost:5173 ...
start "GovJobPulse Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Frontend Dashboard: http://localhost:5173
echo Backend API Docs:   http://localhost:8000/docs
echo ========================================================
pause
