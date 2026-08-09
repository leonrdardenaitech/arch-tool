@echo off
echo [ATLAS CORE] Bypassing Desktop. Initiating V4 Studio Compilation...
cd /d C:\Users\Leonr\projects\arch-tool
echo [1/3] Building Static React Files...
call npm run build
echo [2/3] Writing Python App configurations...
echo import webview > NLE_Offline_App.py
echo webview.create_window("Darden AI-Native NLE (Offline)", "file:///C:/Users/Leonr/projects/arch-tool/dist/index.html") >> NLE_Offline_App.py
echo webview.start() >> NLE_Offline_App.py
echo import webview > PA_Offline_App.py
echo webview.create_window("Darden PA (The Guard)", "file:///C:/Users/Leonr/projects/arch-tool/dist/index.html#/pa_dashboard") >> PA_Offline_App.py
echo webview.start() >> PA_Offline_App.py
echo [3/3] Compiling Executables...
python -m PyInstaller --noconfirm --onefile --windowed --name "Darden_NLE_Offline" NLE_Offline_App.py
python -m PyInstaller --noconfirm --onefile --windowed --name "Darden_PA_Offline" PA_Offline_App.py
echo [ATLAS CORE] Compilation Complete! Check the 'dist' folder.
pause
