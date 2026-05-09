@echo off
echo [*] ATLAS PULSE: Manual Intent Retrieval Started...
nlm notebook query 53fc92d9-bbec-4032-aa3d-32b4f50a1558 "What is the most recent intent tagged with ###DRAFT###? Return ONLY the intent text after the tag. If none exists, say 'NONE'." > atlas_temp.txt
set /p INTENT=<atlas_temp.txt
del atlas_temp.txt

if "%INTENT%"=="NONE" (
    echo [!] No new blueprints found in Atlas.
) else (
    echo [+] Intent Captured: %INTENT%
    echo [EXECUTE]python "G:\Coach_Scripts\boardroom_loop.py" "%INTENT%" >> public\dispatch_queue.md
    echo [*] Intent filed to queue. Watchdog will execute shortly.
)
pause
