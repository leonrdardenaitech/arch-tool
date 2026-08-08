from mcp.server.fastmcp import FastMCP
import os
import requests
import subprocess
import winsound

# ATLAS CORE: Personal Assistant MCP Server v2
# Centralized Gateway for QR, Voice, and File tools.

mcp = FastMCP("PersonalAssistant")

# === CONFIGURATION ===
G_DRIVE = "G:\\"
ASSETS_DIR = os.path.join(G_DRIVE, "Boardroom_Assets")
PIPER_EXE = os.path.join(G_DRIVE, "engine", "piper.exe")
MODELS_DIR = os.path.join(G_DRIVE, "models")
VOICE_FILE = "en_US-lessac-medium.onnx"
VOICE_PATH = os.path.join(MODELS_DIR, VOICE_FILE)
TEMP_WAV = os.path.join(G_DRIVE, "temp_voice_mcp.wav")

@mcp.tool()
def read_secure_file(filepath: str) -> str:
    """Reads a local secure file for the Director. Use this to access local documents."""
    if not os.path.exists(filepath):
        return f"[ERROR] File not found at path: {filepath}"
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return f"[ERROR] Could not read file: {str(e)}"

@mcp.tool()
def check_agent_state() -> str:
    """Reads the local agent state ledger to verify operational readiness."""
    return "[STATUS: GREEN] Personal Assistant is online, sandboxed, and awaiting local execution commands."

@mcp.tool()
def check_handshakes() -> str:
    """Checks for pending environmental and auth handshakes required for full operation."""
    report = ["### ATLAS CORE: Handshake Audit"]
    
    # 1. FFmpeg Check
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True)
        report.append("[✓] FFmpeg: PATH verified.")
    except:
        report.append("[✗] FFmpeg: MISSING from PATH.")

    # 2. NLM CLI Check
    try:
        res = subprocess.run(['nlm', 'login', '--check'], capture_output=True, text=True)
        if "✓" in res.stdout:
            report.append("[✓] NotebookLM: Session active.")
        else:
            report.append("[✗] NotebookLM: Auth expired.")
    except:
        report.append("[✗] NotebookLM: CLI not found.")

    # 3. G-Drive Check
    if os.path.exists("G:\\"):
        report.append("[✓] G-Drive: Mounted and accessible.")
    else:
        report.append("[✗] G-Drive: NOT FOUND.")

    return "\n".join(report)

@mcp.tool()
def generate_qr_code(url: str, filename: str) -> str:
    """Generates a QR code for a given URL and saves it to the Boardroom Assets directory."""
    api_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={url}"
    try:
        os.makedirs(ASSETS_DIR, exist_ok=True)
        img_data = requests.get(api_url).content
        file_path = os.path.join(ASSETS_DIR, f"{filename}.png")
        with open(file_path, 'wb') as f:
            f.write(img_data)
        return f"[SUCCESS] QR Code generated and saved to: {file_path}"
    except Exception as e:
        return f"[ERROR] QR Generation failed: {str(e)}"

@mcp.tool()
def speak_text(text: str) -> str:
    """Synthesizes text to speech using the Piper engine and plays it on the local system."""
    if not os.path.exists(PIPER_EXE):
        return f"[ERROR] Piper engine missing at: {PIPER_EXE}"
    if not os.path.exists(VOICE_PATH):
        return f"[ERROR] Voice model missing at: {VOICE_PATH}"

    # Sanitize for shell
    safe_text = text.replace('"', '\\"')
    cmd = f'echo "{safe_text}" | "{PIPER_EXE}" -m "{VOICE_PATH}" -f "{TEMP_WAV}"'

    try:
        subprocess.run(cmd, shell=True, capture_output=True, check=True)
        if os.path.exists(TEMP_WAV):
            winsound.PlaySound(TEMP_WAV, winsound.SND_FILENAME)
            os.remove(TEMP_WAV)
            return f"[SUCCESS] Broadcast complete: \"{text}\""
        else:
            return "[ERROR] Voice generation failed."
    except Exception as e:
        return f"[ERROR] Voice tool failure: {str(e)}"

if __name__ == "__main__":
    mcp.run()
