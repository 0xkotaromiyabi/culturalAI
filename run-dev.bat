@echo off
echo Installing dependencies and starting development server...
echo.

wsl bash -c "cd /home/kotarominami/docmakers && npm install && npm run dev"
