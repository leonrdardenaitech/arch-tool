import keyboard
import pyperclip
import pyttsx3
import pystray
from PIL import Image, ImageDraw
import threading
import time
import sys
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import google.genai as genai

# Load credentials from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")

# Initialize Gemini
if GEMINI_API_KEY and GEMINI_API_KEY != "PASTE_YOUR_KEY_HERE":
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

# --- CONFIGURATION ---
VOICE_RATE = 150 
VOICE_VOLUME = 0.8 
READ_HOTKEY = 'alt+s'
GEMINI_HOTKEY = 'alt+g'

# Global engine for control
engine = pyttsx3.init()
is_processing = False

def setup_voice():
    engine.setProperty('rate', VOICE_RATE)
    engine.setProperty('volume', VOICE_VOLUME)

def speak(text):
    global is_processing
    is_processing = True
    engine.say(text)
    engine.runAndWait()
    is_processing = False

def get_highlighted_text():
    # Save original clipboard
    original = pyperclip.paste()
    # Trigger Ctrl+C
    keyboard.press_and_release('ctrl+c')
    time.sleep(0.15) # Wait for OS
    text = pyperclip.paste()
    # Restore original
    pyperclip.copy(original)
    return text if text != original else None

def read_aloud():
    if is_processing: return
    text = get_highlighted_text()
    if text:
        threading.Thread(target=speak, args=(text,)).start()

def process_with_gemini(text=None):
    global is_processing
    if is_processing or not client: 
        if not client: print("Error: Gemini API Key not found in .env")
        return
    
    if not text:
        text = get_highlighted_text()
    
    if not text: return

    is_processing = True
    print("Gemini is thinking...")
    
    try:
        # 1. Ask Gemini to polish the text
        prompt = f"Turn the following notes or text into a professional, concise email or cover letter. Maintain a polite but direct tone:\n\n{text}"
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        refined_text = response.text

        # 2. Send the email to yourself (as a draft/test)
        if GMAIL_USER and GMAIL_PASSWORD:
            msg = EmailMessage()
            msg.set_content(refined_text)
            msg['Subject'] = "Quiet Assistant: Refined Draft"
            msg['From'] = GMAIL_USER
            msg['To'] = GMAIL_USER # Sending to yourself for review

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(GMAIL_USER, GMAIL_PASSWORD)
                smtp.send_message(msg)
            
            print("Success: Refined email sent to your inbox!")
            speak("Gemini has finished. Check your inbox.")
        else:
            print("Error: Gmail credentials missing in .env")
            pyperclip.copy(refined_text)
            speak("Gemini finished, but I couldn't send the email. The draft is on your clipboard.")

    except Exception as e:
        print(f"Error: {e}")
        speak("Something went wrong with the AI or Email.")
    
    is_processing = False

def stop_speech():
    engine.stop()

def create_image():
    width, height = 64, 64
    image = Image.new('RGB', (width, height), (0, 120, 215))
    dc = ImageDraw.Draw(image)
    dc.ellipse([16, 16, 48, 48], fill=(255, 255, 255))
    return image

def on_quit(icon, item):
    icon.stop()
    sys.exit()

def run_tray():
    icon = pystray.Icon("Quiet Assistant")
    icon.menu = pystray.Menu(
        pystray.MenuItem("Quiet Assistant Active", lambda: None, enabled=False),
        pystray.MenuItem("Stop Speech", stop_speech),
        pystray.MenuItem("Quit", on_quit)
    )
    icon.icon = create_image()
    icon.run()

def clipboard_watcher():
    """Background thread to watch for '###DRAFT###' trigger from HTML editors."""
    global is_processing
    print("Clipboard Watcher Active: Waiting for '###DRAFT###' trigger...")
    last_processed = ""
    
    while True:
        try:
            current_clipboard = pyperclip.paste()
            # Only trigger if it starts with the tag and we haven't just processed it
            if current_clipboard.startswith("###DRAFT###") and current_clipboard != last_processed:
                if not is_processing:
                    print("Auto-trigger detected! Sending to Gemini...")
                    # Strip the tag and process
                    clean_text = current_clipboard.replace("###DRAFT###", "").strip()
                    last_processed = current_clipboard
                    threading.Thread(target=process_with_gemini, args=(clean_text,)).start()
            
            time.sleep(1.0) # Check every second to save CPU
        except Exception:
            time.sleep(2.0)

if __name__ == "__main__":
    setup_voice()
    keyboard.add_hotkey(READ_HOTKEY, read_aloud)
    keyboard.add_hotkey(GEMINI_HOTKEY, lambda: threading.Thread(target=process_with_gemini).start())
    
    # Start the "Pro Tip" Clipboard Watcher in a separate thread
    watcher_thread = threading.Thread(target=clipboard_watcher, daemon=True)
    watcher_thread.start()
    
    print(f"Assistant Active!")
    print(f" - {READ_HOTKEY}: Read Aloud")
    print(f" - {GEMINI_HOTKEY}: Polish & Email to Self")
    print(f" - Auto-Bridge: Activated (Watches for '###DRAFT###')")
    run_tray()
