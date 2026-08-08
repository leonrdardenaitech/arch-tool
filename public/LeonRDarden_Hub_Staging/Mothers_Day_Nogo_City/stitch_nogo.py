import os
import subprocess
import sys

# ATLAS CORE: Mother's Day Nogo City Stitching Engine
# This script concatenates video clips in chronological order and applies audio.

STAGING_DIR = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\Mothers_Day_Nogo_City'
VIDEO_DIR = os.path.join(STAGING_DIR, 'video')
AUDIO_DIR = os.path.join(STAGING_DIR, 'audio')
OUTPUT_DIR = STAGING_DIR
FINAL_OUTPUT = os.path.join(OUTPUT_DIR, 'Mothers_Day_Nogo_City_Draft.mp4')

def get_ffmpeg():
    # Use the discovered path
    path = r'C:\Users\Leonr\AppData\Local\Programs\ScreenToGif\ffmpeg.exe'
    if os.path.exists(path):
        return f'"{path}"'
    
    # Check if ffmpeg is available in PATH
    try:
        subprocess.run('ffmpeg -version', shell=True, capture_output=True, check=True)
        return 'ffmpeg'
    except:
        return None

def stitch_videos():
    ffmpeg_exe = get_ffmpeg()
    if not ffmpeg_exe:
        print("[CRITICAL] FFmpeg not found. Please ensure FFmpeg is in your PATH.")
        return

    # 1. Get clips sorted by NAME (CLIP_001, CLIP_002, etc.)
    sorted_clips = [os.path.join(VIDEO_DIR, f) for f in os.listdir(VIDEO_DIR) if f.startswith('CLIP_') and f.endswith('.mp4')]
    sorted_clips.sort() 

    # 2. Append protected final clip 'kast.mp4' if it exists
    final_clip = os.path.join(VIDEO_DIR, 'kast.mp4')
    if os.path.exists(final_clip):
        print("[ATLAS CORE] Final shot 'kast.mp4' detected. Appending to end of sequence.")
        sorted_clips.append(final_clip)

    if not sorted_clips:
        print("[ERROR] No clips found in staging folder.")
        return

    print(f"[ATLAS CORE] Detected {len(sorted_clips)} total clips for assembly. Generating concat list...")

    # 2. Create concat list for FFmpeg
    concat_file = os.path.join(VIDEO_DIR, 'concat_list.txt')
    with open(concat_file, 'w') as f:
        for clip_path in sorted_clips:
            f.write(f"file '{os.path.basename(clip_path)}'\n")

    # 3. Concatenate and CROP 10% (Watermark removal)
    # 10% crop logic: crop=iw:ih*0.9:0:0 (removes 10% from bottom)
    temp_video = os.path.join(VIDEO_DIR, 'temp_stitched.mp4')
    
    # We must re-encode to apply the crop filter
    print("[ATLAS CORE] Executing video concatenation and 10% crop...")
    concat_cmd = f'{ffmpeg_exe} -f concat -safe 0 -i "{concat_file}" -vf "crop=iw:ih*0.9:0:0" -c:v libx264 -pix_fmt yuv420p -preset medium "{temp_video}" -y'
    
    result = subprocess.run(concat_cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"[ERROR] Video assembly failed: {result.stderr}")
        return

    # 4. Add audio
    audio_files = [f for f in os.listdir(AUDIO_DIR) if f.endswith('.mp3')]
    if audio_files:
        audio_path = os.path.join(AUDIO_DIR, audio_files[0])
        print(f"[ATLAS CORE] Applying audio track: {audio_files[0]}")
        
        final_cmd = f'{ffmpeg_exe} -i "{temp_video}" -i "{audio_path}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest "{FINAL_OUTPUT}" -y'
        result = subprocess.run(final_cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[SUCCESS] Production complete: {FINAL_OUTPUT}")
        else:
            print(f"[ERROR] Audio sync failed: {result.stderr}")
    else:
        print("[WARN] No audio track found. Finalizing video-only draft.")
        if os.path.exists(FINAL_OUTPUT): os.remove(FINAL_OUTPUT)
        os.rename(temp_video, FINAL_OUTPUT)
        print(f"[SUCCESS] Production complete (Video only): {FINAL_OUTPUT}")

    # Cleanup
    if os.path.exists(temp_video): os.remove(temp_video)

if __name__ == "__main__":
    stitch_videos()
