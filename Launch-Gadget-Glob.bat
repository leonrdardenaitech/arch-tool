@echo off
title GADGET GLOB 5.3 // SLIME INTERFACE
echo Starting Sludge-Matrix...
cd /d "%~dp0"
start "" "http://localhost:5173/arch-tool/gadget-glob.html"
npm run dev
pause
