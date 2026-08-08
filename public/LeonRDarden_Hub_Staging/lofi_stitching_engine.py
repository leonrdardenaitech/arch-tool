import os
import subprocess
import time

# ATLAS CORE: Lofi Assembly & Stitching Engine
# This script monitors for sequential clips and concatenates them using FFmpeg.

BASE_DIR = r'C:\Users\Leonr\projects\arch-tool\public\BurningOne'
VIDEO_DIR = os.path.join(BASE_DIR, 'Videos')
AUDIO_DIR = os.path.join(BASE_DIR, 'audio', 'jazz')
OUTPUT_NAME = 'Lofi_1Project_Final_Assembly.mp4'

def check_ffmpeg():
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except:
        return False

def assemble_sequence():
    if not os.path.exists(VIDEO_DIR):
        print(f"[ERROR] Video directory missing: {VIDEO_DIR}")
        return

    if not check_ffmpeg():
        print("[CRITICAL] FFmpeg not found in PATH. Assembly halted.")
        return

    # 1. Identify clips 00001-00006
    clips = [f for f in os.listdir(VIDEO_DIR) if f.endswith('.mp4') and any(str(i).zfill(5) in f for i in range(1, 7))]
    clips.sort()

    if not clips:
        print("[IDLE] No clips found matching sequence 00001-00006.")
        return

    print(f"[ATLAS CORE] Clips detected: {len(clips)}. Initializing concatenation...")

    # 2. Create concat list
    concat_list = os.path.join(VIDEO_DIR, 'concat_list.txt')
    with open(concat_list, 'w') as f:
        for clip in clips:
            f.write(f"file '{clip}'\n")

    # 3. Concatenate video
    temp_output = os.path.join(VIDEO_DIR, 'stitched_no_audio.mp4')
    cmd = f'ffmpeg -f concat -safe 0 -i "{concat_list}" -c copy "{temp_output}" -y'
    
    try:
        subprocess.run(cmd, shell=True, check=True)
        print("[SUCCESS] Video concatenation complete.")
    except Exception as e:
        print(f"[ERROR] Video stitching failed: {e}")
        return

    # 4. Apply 30-minute jazz audio (looping if necessary)
    # Target: select a random 30-min stack or specific audio
    final_output = os.path.join(VIDEO_DIR, OUTPUT_NAME)
    audio_file = os.path.join(AUDIO_DIR, 'Cosmic_Chill_FULL_SONG_MusicGPT.mp3') # Placeholder
    
    if os.path.exists(audio_file):
        print("[ATLAS CORE] Applying audio stack...")
        audio_cmd = f'ffmpeg -i "{temp_output}" -stream_loop -1 -i "{audio_file}" -map 0:v:0 -map 1:a:0 -c:v copy -shortest "{final_output}" -y'
        subprocess.run(audio_cmd, shell=True)
        print(f"[ATLAS CORE] ASSEMBLY COMPLETE: {final_output}")
    else:
        print("[WARN] Audio stack not found. Finalizing video-only assembly.")
        os.rename(temp_output, final_output)

if __name__ == "__main__":
    assemble_sequence()
