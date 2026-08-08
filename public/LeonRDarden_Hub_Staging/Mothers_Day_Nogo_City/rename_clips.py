import os

# ATLAS CORE: Sequential Renaming Tool (Protected Mode)
# Renames new clips to CLIP_xxx while protecting user-named files like 'kast.mp4'.

VIDEO_DIR = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\Mothers_Day_Nogo_City\video'
PROTECTED_FILES = ['kast.mp4']

def rename_sequentially():
    if not os.path.exists(VIDEO_DIR):
        print(f"[ERROR] Directory not found: {VIDEO_DIR}")
        return

    # 1. Get all MP4 files that are NOT protected and NOT already CLIP_xxx
    all_files = [f for f in os.listdir(VIDEO_DIR) if f.endswith('.mp4')]
    
    # Identify the highest current CLIP number to continue sequence
    existing_clips = [int(f[5:8]) for f in all_files if f.startswith('CLIP_') and f[5:8].isdigit()]
    next_num = max(existing_clips) + 1 if existing_clips else 1

    files_to_rename = [f for f in all_files if f not in PROTECTED_FILES and not f.startswith('CLIP_')]
    
    if not files_to_rename:
        print("[IDLE] No new files to rename.")
        return

    # Sort files_to_rename by time
    files_with_time = []
    for f in files_to_rename:
        path = os.path.join(VIDEO_DIR, f)
        files_with_time.append((path, os.path.getmtime(path)))
    files_with_time.sort(key=lambda x: x[1])

    print(f"[ATLAS CORE] Renaming {len(files_with_time)} new clips, protecting {PROTECTED_FILES}...")

    # 3. Rename
    for i, (old_path, _) in enumerate(files_with_time, 0):
        new_name = f"CLIP_{str(next_num + i).zfill(3)}.mp4"
        new_path = os.path.join(VIDEO_DIR, new_name)
        
        try:
            os.rename(old_path, new_path)
            print(f"Renamed: {os.path.basename(old_path)} -> {new_name}")
        except Exception as e:
            print(f"Error renaming {old_path}: {e}")

if __name__ == "__main__":
    rename_sequentially()
