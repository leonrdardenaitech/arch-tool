import os
import subprocess
import requests
import winsound
from datetime import datetime

# === 1. CONFIGURATION (G-Drive Map) ===
G_DRIVE = "G:\\"
PIPER_EXE = os.path.join(G_DRIVE, "engine", "piper.exe")
MODELS_DIR = os.path.join(G_DRIVE, "models")
ASSETS_DIR = os.path.join(G_DRIVE, "Boardroom_Assets")

# --- ACTION: Ensure this matches your .onnx file in G:\models ---
VOICE_FILE = "en_US-lessac-medium.onnx" 
VOICE_PATH = os.path.join(MODELS_DIR, VOICE_FILE)

# === 2. THE DISPATCHER (Lithonia-Aware) ===
def get_briefing():
    now = datetime.now().strftime("%A, %B %d, %Y | %I:%M %p")
    try:
        geo = requests.get("http://ip-api.com/json/", timeout=3).json()
        city = geo.get('city', 'Unknown')
        if city in ['Redan', 'Snellville', 'Stonecrest', 'Conyers']:
            loc = "Lithonia, Georgia"
        else:
            loc = f"{city}, {geo.get('regionName')}"
    except:
        loc = "Lithonia, Georgia"

    return f"[{now}] DISPATCHER: System active in {loc}."

# === 3. THE VOICE BOX (Piper) ===
def speak(text):
    print(f"ANNOUNCER: {text}")
    temp_wav = os.path.join(G_DRIVE, "temp_voice.wav")

    if not os.path.exists(PIPER_EXE):
        print(f"!! ERROR: piper.exe missing from G:\\engine")
        return
    if not os.path.exists(VOICE_PATH):
        print(f"!! ERROR: {VOICE_FILE} missing from G:\\models")
        return

    cmd = f'echo "{text}" | "{PIPER_EXE}" -m "{VOICE_PATH}" -f "{temp_wav}"'
    subprocess.run(cmd, shell=True, capture_output=True)

    if os.path.exists(temp_wav):
        winsound.PlaySound(temp_wav, winsound.SND_FILENAME)
        os.remove(temp_wav)
    else:
        print("!! ERROR: Voice generation failed.")

# === 4. THE BUILDER (QR Server) ===
def generate_qr(link, filename):
    api_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={link}"
    try:
        img_data = requests.get(api_url).content
        if not os.path.exists(ASSETS_DIR):
            os.makedirs(ASSETS_DIR)

        # Pulse Metadata: LITHONIA-BASE | APP: DREAM_ARCHITECT | STATUS: ACTIVE
        pulse = "[PULSE_LITHONIA-BASE_APP_DREAM_ARCHITECT_STATUS_ACTIVE]"
        file_path = os.path.join(ASSETS_DIR, f"{pulse}_{filename}.png")
        with open(file_path, 'wb') as f:
            f.write(img_data)
        return file_path
    except Exception as e:
        print(f"!! QR ERROR: {e}")
        return None

# === 5. THE INTUITIVE LOOP ===
def run_boardroom():
    header = get_briefing()
    print(header)
    speak(header.split("] ")[1])

    LINKEDIN_URL = "https://linkedin.com/in/leon-darden"
    PORTFOLIO_URL = "https://leonrdarden.com"

    user_input = input("\nEnter intent (or 'exit'): ")
    if user_input.lower() == 'exit':
        return

    # Logic: QR Asset Pattern
    if "qr" in user_input.lower():
        if "linkedin" in user_input.lower():
            speak("Pattern recognized: Career Growth Asset. Generating LinkedIn QR code now.")
            path = generate_qr(LINKEDIN_URL, "Leon_Darden_LinkedIn_QR")
            if path:
                speak("Success. The LinkedIn QR code has been filed with the Pulse Signature.")
                print(f"ARCHIVIST: Saved to {path}")
        elif "portfolio" in user_input.lower() or "leonrdarden.com" in user_input.lower():
            speak("Pattern recognized: Portfolio Asset. Generating Portfolio QR code now.")
            path = generate_qr(PORTFOLIO_URL, "Leon_Darden_Portfolio_QR")
            if path:
                speak("Success. The Portfolio QR code has been filed with the Pulse Signature.")
                print(f"ARCHIVIST: Saved to {path}")
        else:
            speak("QR intent recognized, but target is unclear. Defaulting to Portfolio.")
            generate_qr(PORTFOLIO_URL, "Leon_Darden_Portfolio_QR")

    else:
        speak("Update received. Filing this intent to the Archivist for pattern matching.")

if __name__ == "__main__":
    run_boardroom()
