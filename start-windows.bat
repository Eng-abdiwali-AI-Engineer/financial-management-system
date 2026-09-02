@echo off
cd /d %~dp0
call npm install
call npm run install:all
start "API" cmd /k "cd server && npm run dev"
start "Frontend" cmd /k "cd client && npm run dev"
echo Smart Financial Management is starting...
