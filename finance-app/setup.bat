@echo off
echo ========================================
echo Finance Manager - Auto Setup Script
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)
echo [OK] Node.js terinstall

REM Check PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL tidak ditemukan. Silakan install PostgreSQL terlebih dahulu.
    pause
    exit /b 1
)
echo [OK] PostgreSQL terinstall

echo.
echo Installing dependencies...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ========================================
echo Database Setup
echo ========================================
echo.
echo Silakan buat database 'finance_app' di PostgreSQL secara manual:
echo.
echo 1. Buka pgAdmin atau psql
echo 2. Jalankan: CREATE DATABASE finance_app;
echo 3. Import file: backend\init.sql
echo.
echo Atau jalankan perintah ini di Command Prompt:
echo psql -U postgres -c "CREATE DATABASE finance_app;"
echo psql -U postgres -d finance_app -f backend\init.sql
echo.
echo Setelah selesai, edit file backend\.env sesuai konfigurasi PostgreSQL Anda
echo.
pause

echo.
echo ========================================
echo Setup completed!
echo ========================================
echo.
echo Untuk menjalankan aplikasi:
echo.
echo 1. Terminal 1 - Backend:
echo    cd backend
echo    npm start
echo.
echo 2. Terminal 2 - Frontend:
echo    cd frontend
echo    npm start
echo.
echo Aplikasi akan berjalan di: http://localhost:3000
echo.
pause
