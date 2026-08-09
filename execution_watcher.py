import os
import shutil
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# 1. Define The Dock (Intake) and The Four Chambers (Vaults)
DOCK_DIR = r"C:\Users\Leonr\Downloads"
VIDEO_VAULT = r"C:\Users\Leonr\Downloads\video_assets"
AUDIO_VAULT = r"C:\Users\Leonr\Downloads\audio_assets"
IMAGE_VAULT = r"C:\Users\Leonr\Downloads\image_assets"
KNOWLEDGE_BASE = r"C:\Users\Leonr\Downloads\Knowledge_Base"

# Create chambers if they don't exist
for vault in [VIDEO_VAULT, AUDIO_VAULT, IMAGE_VAULT, KNOWLEDGE_BASE]:
    os.makedirs(vault, exist_ok=True)

# 2. Define the Sorting Logic by Extension
EXTENSION_MAP = {
    # Video
    ".mp4": VIDEO_VAULT, ".mov": VIDEO_VAULT, ".avi": VIDEO_VAULT,
    # Audio
    ".mp3": AUDIO_VAULT, ".wav": AUDIO_VAULT,
    # Visual/Images
    ".png": IMAGE_VAULT, ".jpg": IMAGE_VAULT, ".jpeg": IMAGE_VAULT,
    # Knowledge Base (NotebookLM)
    ".pdf": KNOWLEDGE_BASE, ".md": KNOWLEDGE_BASE, ".txt": KNOWLEDGE_BASE, ".epub": KNOWLEDGE_BASE
}

# 3. The Watchdog Tripwire
class DockSorterHandler(FileSystemEventHandler):
    def on_created(self, event):
        # Ignore directory creations
        if event.is_directory:
            return
        
        # Brief pause to ensure the file has completely finished downloading
        time.sleep(1.5) 
        
        file_path = event.src_path
        file_name = os.path.basename(file_path)
        file_ext = os.path.splitext(file_name)[2].lower()

        # 4. Mechanical Routing
        if file_ext in EXTENSION_MAP:
            target_vault = EXTENSION_MAP[file_ext]
            target_path = os.path.join(target_vault, file_name)
            
            try:
                # Teleport the file behind the energy field
                shutil.move(file_path, target_path)
                print(f"[AC DOCK CONTROL] Secured {file_name} -> {target_vault}")
            except Exception as e:
                print(f"[ERROR] Could not route {file_name}: {e}")

if __name__ == "__main__":
    print("[AC DOCK CONTROL] The perimeter is locked. Sorting active...")
    event_handler = DockSorterHandler()
    observer = Observer()
    observer.schedule(event_handler, DOCK_DIR, recursive=False)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()