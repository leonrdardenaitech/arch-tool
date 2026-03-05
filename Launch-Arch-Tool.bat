@echo off
title ARCH-TOOL 5.0 // SLIME INTERFACE
echo Starting Slime-Matrix...
cd /d "%~dp0"
start "" "http://localhost:5173/arch-tool.html"
npm run dev
pause
