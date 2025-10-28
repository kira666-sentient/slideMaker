@echo off
echo ========================================
echo SlideMaker Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..
echo Backend setup complete!
echo.

echo [2/4] Setting up Frontend...
cd frontend
echo Installing Node dependencies...
call npm install
cd ..
echo Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd backend && venv\Scripts\activate && python app.py
echo 2. Frontend: cd frontend && npm start
echo.
pause
