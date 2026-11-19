@echo off
cd /d "%~dp0"
echo Starting the Node.js portfolio API on port 3000...
start "Portfolio API" cmd /k npm start
echo Starting the React/Vite website...
start "Portfolio Website" cmd /k npm run dev
echo.
echo Leave both terminal windows open. Open the Local URL printed by Vite.
pause
