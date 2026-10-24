@echo off
echo ========================================================
echo  Starting AI-Based Fraud and Anomaly Detection Platform
echo ========================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Fraud Detection API" cmd /k "cd backend && python run.py"

timeout /t 2 >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Fraud Detection Console" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Both services launched!
echo  Backend Docs: http://localhost:8000/docs
echo  Frontend UI:  http://localhost:5173
echo ========================================================
