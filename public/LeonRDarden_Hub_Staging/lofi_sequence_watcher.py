import os
import time
import subprocess
import shutil

# ATLAS CORE: Lofi Sequence Watcher v1.1
# Resilient monitoring for 'sequence' and '88' suffixed assets.

WATCH_DIRS = [
    r'C:\Users\Leonr\projects\arch-tool\public\BurningOne\Videos',
    r'C:\Users\Leonr\Downloads'
]
STAGING_DIR = r'C:\Users\Leonr\projects\arch-tool\public\BurningOne\Videos'
AUDIO_FILE = r'C:\Users\Leonr\projects\arch-tool\public\BurningOne\audio\jazz\Cosmic_Chill_FULL_SONG_MusicGPT.mp3'
OUTPUT_NAME = 'Lofi_1Project_Final_Assembly.mp4'

def get_sequence_clips():
    all_clips = []
    for d in WATCH_DIRS:
        if not os.path.exists(d): continue
        # Detect 00001-00006 OR any file with 'sequence' or '88' in the name
        pattern_matches = [
            os.path.join(d, f) for f in os.listdir(d) 
            if f.endswith(('.mp4', '.mov')) and 
            (any(str(i).zfill(5) in f for i in range(1, 7)) or 'sequence' in f.lower() or '88' in f)
        ]
        all_clips.extend(pattern_matches)
    
    unique_clips = {}
    for c in all_clips:
        base = os.path.basename(c)
        if base not in unique_clips:
            unique_clips[base] = c
            
    # Priority sorting: Numbered sequence first, then alphabetical
    sorted_bases = sorted(unique_clips.keys())
    return [unique_clips[b] for b in sorted_bases]

def run_stitching(clips):
    print(f"\n[ATLAS CORE] Sequence detected ({len(clips)} files). Syncing to Staging Hub...")
    # ... (rest of logic remains same, added improved logging below)
    print(f"[*] Initializing FFmpeg concat for: {[os.path.basename(c) for c in clips]}")
    
    # 1. Sync to staging
    staged_clips = []
    for c in clips:
        target = os.path.join(STAGING_DIR, os.path.basename(c))
        if not os.path.exists(target):
            shutil.copy(c, target)
        staged_clips.append(os.path.basename(c))

    # 2. Create concat list
    concat_list = os.path.join(STAGING_DIR, 'concat_list.txt')
    with open(concat_list, 'w') as f:
        for c in staged_clips:
            f.write(f"file '{c}'\n")

    # 3. Concatenate
    temp_output = os.path.join(STAGING_DIR, 'stitched_no_audio.mp4')
    final_output = os.path.join(STAGING_DIR, OUTPUT_NAME)
    
    print("[*] Concatenating video streams...")
    cmd = f'ffmpeg -f concat -safe 0 -i "{concat_list}" -c copy "{temp_output}" -y'
    subprocess.run(cmd, shell=True)

    if os.path.exists(AUDIO_FILE):
        print("[*] Applying 30-minute jazz audio stack...")
        audio_cmd = f'ffmpeg -i "{temp_output}" -stream_loop -1 -i "{AUDIO_FILE}" -map 0:v:0 -map 1:a:0 -c:v copy -shortest "{final_output}" -y'
        subprocess.run(audio_cmd, shell=True)
        print(f"[SUCCESS] ASSEMBLY COMPLETE: {final_output}")
    else:
        print("[WARN] Audio missing. Finalizing video-only assembly.")
        if os.path.exists(temp_output):
            os.replace(temp_output, final_output)

def main():
    print("=== [ATLAS] LOFI SEQUENCE WATCHER ACTIVE ===")
    print(f"[*] Monitoring: {WATCH_DIRS}")
    
    processed_count = 0
    
    while True:
        try:
            clips = get_sequence_clips()
            # Wait for all 6 clips to be present
            if len(clips) >= 6 and len(clips) != processed_count:
                if not check_ffmpeg():
                    print("[!] Blocker: FFmpeg not in PATH. Waiting for resolution...")
                else:
                    run_stitching(clips)
                    processed_count = len(clips)
            elif len(clips) > 0 and len(clips) < 6:
                print(f"[STATUS] Sequence Progress: {len(clips)}/6 clips detected.", end='\r')
        except Exception as e:
            print(f"\n[ERROR] Watcher Loop: {e}")
        
        time.sleep(5)

if __name__ == "__main__":
    main()
