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
    ".mp4": VIDEO_VAULT, ".mov": VIDEO_VAULT, ".avi": VIDEO_VAULT,
    ".mp3": AUDIO_VAULT, ".wav": AUDIO_VAULT,
    ".png": IMAGE_VAULT, ".jpg": IMAGE_VAULT, ".jpeg": IMAGE_VAULT,
    ".pdf": KNOWLEDGE_BASE, ".md": KNOWLEDGE_BASE, ".txt": KNOWLEDGE_BASE, ".epub": KNOWLEDGE_BASE
}

# 3. The Watchdog Tripwire (V2 Patch)
class DockSorterHandler(FileSystemEventHandler):
    
    def process_file(self, file_path):
        # Brief pause to ensure the file has completely finished transferring
        time.sleep(1.5) 
        
        file_name = os.path.basename(file_path)
        # [FORGE PATCH] Fixed the array index logic
        file_ext = os.path.splitext(file_name)[1].lower()

        # 4. Mechanical Routing
        if file_ext in EXTENSION_MAP:
            target_vault = EXTENSION_MAP[file_ext]
            target_path = os.path.join(target_vault, file_name)
            
            try:
                # Teleport the file behind the energy field
                shutil.move(file_path, target_path)
                print(f"[AC DOCK CONTROL] Secured {file_name} -> {target_vault}")
                
                # The binary "ding" notification to confirm execution
                print('\a')
            except Exception as e:
                print(f"[ERROR] Could not route {file_name}: {e}")

    # Listen for brand new files (e.g., saving directly from an application)
    def on_created(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

    # Listen for moved/renamed files (e.g., dragging from another folder or browser downloads finishing)
    def on_moved(self, event):
        if not event.is_directory:
            self.process_file(event.dest_path)

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